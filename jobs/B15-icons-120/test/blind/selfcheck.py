"""Elementary independent fixtures, without reading any B15 production art."""
import binascii
import json
import struct
import zlib
from pathlib import Path
from oracle import audit_svg, decode_png, alpha_mask, compare_masks, below_limit

PREFIX = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#ABCDEF" stroke="#112233" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'
PATH = '<path d="M8 8H24V24H8Z"/>'
SVG = PREFIX + PATH + '</svg>'
counts = {'svg': 0, 'png': 0, 'alpha': 0, 'compare': 0, 'limit': 0}
def svg(text, valid):
    result = audit_svg(text)
    assert result['valid'] == valid, (text, result)
    counts['svg'] += 1

for art in [PATH, '<rect x="0" y="0" width="4" height="4" rx="0"/>',
            '<circle cx="32" cy="32" r="20"/>', '<ellipse cx="32" cy="32" rx="20" ry="8"/>',
            '<g transform="rotate(-30 32 32)">' + PATH + '</g>',
            '<path d="M1e1 -.5L2 3 4 5Q5 6 7 8C1 2 3 4 5 6Z" fill-rule="evenodd"/>']:
    svg(PREFIX + art + '</svg>', True)
assert audit_svg(SVG)['colors'] == ['#112233', '#abcdef']
assert audit_svg(SVG)['shapes'] == 1
assert audit_svg(SVG)['bytes'] == len(SVG.encode())
for text in [SVG + ' ', '\n' + SVG, SVG.replace('/>', '/>\n'), SVG.replace('><', '> <', 1),
             SVG.replace('"0 0 64 64"', '"0 0 32 32"'), SVG.replace('stroke-width="4"', 'stroke-width="3"'),
             SVG.replace('"round"', '"butt"', 1), SVG.replace('xmlns="http://www.w3.org/2000/svg"', ''),
             SVG.replace('"#ABCDEF"', '"red"'), SVG.replace('"#ABCDEF"', '"#abc"'),
             SVG.replace('"M8 8H24V24H8Z"', "'M8 8H24V24H8Z'"),
             SVG.replace('M8', 'm8'), SVG.replace('M8 8H24', 'M8H24'), SVG.replace('M8 8H24', 'M8 8A24'),
             SVG.replace('M8 8', 'M1e309 8'), SVG.replace(PATH, ''), SVG.replace(PATH, '<text>Hello</text>'),
             '<!DOCTYPE svg>' + SVG, SVG.replace('M8 8', 'M&#56; 8'),
             PREFIX + '<circle cx="1" cy="1" r="0"/></svg>',
             PREFIX + '<rect x="0" y="0" width="-4" height="4"/></svg>',
             PREFIX + '<g transform="rotate(30)">' + PATH + '</g></svg>',
             PREFIX + '<path d="M0 0L1 1"><circle cx="1" cy="1" r="1"/></path></svg>',
             PREFIX + '<path d="M0 0L1 1" stroke-width="0"/></svg>',
             PREFIX + '<path d="M0 0L1 1" style="fill:#000000"/></svg>']:
    svg(text, False)
svg(PREFIX + ''.join('<rect x="0" y="0" width="1" height="1" fill="#%06x"/>' % i for i in range(7)) + '</svg>', False)
svg(SVG.replace('d="', 'd="' + '0 ' * 800), False)

def chunk(kind, data):
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', binascii.crc32(kind + data) & 0xffffffff)
def png(header, payload, middle=b'', trailing=b''):
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) + middle + chunk(b'IDAT', zlib.compress(payload)) + chunk(b'IEND', b'') + trailing
header = struct.pack('>IIBBBBB', 2, 2, 8, 2, 0, 0, 0)
expected = bytes([10,30,90,255,40,70,120,255,15,35,95,255,45,75,125,255])
golden = {
    0: [[10,30,90,40,70,120], [15,35,95,45,75,125]],
    1: [[10,30,90,30,40,30], [15,35,95,30,40,30]],
    2: [[10,30,90,40,70,120], [5,5,5,5,5,5]],
    3: [[10,30,90,35,55,75], [10,20,50,18,23,18]],
    4: [[10,30,90,30,40,30], [5,5,5,5,5,5]],
}
for mode, rows in golden.items():
    payload = bytes([mode] + rows[0] + [mode] + rows[1])
    assert decode_png(png(header, payload)) == (2, 2, expected)
    counts['png'] += 1
simple = png(header, bytes([0] + golden[0][0] + [0] + golden[0][1]))
rgba_header = struct.pack('>IIBBBBB', 2, 1, 8, 6, 0, 0, 0)
rgba = bytes([12,34,56,127,12,34,56,128])
assert decode_png(png(rgba_header, b'\x00' + rgba)) == (2, 1, rgba)
counts['png'] += 1
assert decode_png(png(header, bytes([0] + golden[0][0] + [0] + golden[0][1]), chunk(b'tEXt', b'note\x00original fixture'))) == (2, 2, expected)
counts['png'] += 1
transparent = png(header, bytes([0] + golden[0][0] + [0] + golden[0][1]), chunk(b'tRNS', struct.pack('>HHH', 10,30,90)))
assert decode_png(transparent)[2][3] == 0
counts['png'] += 1
wrong_crc = bytearray(simple); wrong_crc[-5] ^= 1
bad = [bytes(wrong_crc), simple[:-1], simple + b'x',
       png(header, b'\x05' + bytes(golden[0][0]) + b'\x00' + bytes(golden[0][1])),
       png(header, b'\x00'), png(header, bytes([0] + golden[0][0] + [0] + golden[0][1]), chunk(b'ABCD', b'')),
       png(struct.pack('>IIBBBBB', 2,2,16,2,0,0,0), b'\x00'),
       png(header, b'\x00', chunk(b'IHDR', header))]
compressed = zlib.compress(bytes([0] + golden[0][0] + [0] + golden[0][1]))
bad.append(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) + chunk(b'IDAT', compressed[:3]) + chunk(b'tEXt', b'x\x00y') + chunk(b'IDAT', compressed[3:]) + chunk(b'IEND', b''))
for value in bad:
    try: decode_png(value)
    except (ValueError, zlib.error): pass
    else: raise AssertionError('Malformed PNG accepted')
    counts['png'] += 1
for value, expected_mask in [(b'', []), (rgba, [2]), (bytes([0,0,0,255] * 33), [0xffffffff, 1]), (b'abc', None)]:
    assert alpha_mask(value) == expected_mask
    counts['alpha'] += 1
for a, b, expected_result in [([15],[3], {'intersection':2,'union':4,'iou':.5}),
                             ([0],[0], {'intersection':0,'union':0,'iou':1}),
                             ([],[], {'intersection':0,'union':0,'iou':1}), ([1],[],None)]:
    assert compare_masks(a,b) == expected_result
    counts['compare'] += 1
for i, u, expected_result in [(3,4,True),(4,5,False),(0,1,True),(0,0,False),
                             (-1,4,False),(5,4,False),(1.5,4,False),(True,4,False),
                             (1, float('inf'),False),(1,2**53,False),
                             ((4*(2**53-1))//5,2**53-1,True)]:
    assert below_limit(i,u) == expected_result
    counts['limit'] += 1
report = {'counts': counts, 'total': sum(counts.values()), 'status':'passed'}
Path('SELFCHECK.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report))
