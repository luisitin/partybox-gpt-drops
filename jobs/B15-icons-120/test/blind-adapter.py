"""Post-seal orchestration; numerical/XML/PNG decisions come from sealed oracle.py.

The previously published serialization profile additionally disallows spaces
around attribute '='. That rule was absent from the author's supplied contract;
raw sealed decisions and this explicitly added profile decision are both saved.
"""
import hashlib
import json
import re
import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / 'blind'))
from oracle import audit_svg, decode_png, alpha_mask, compare_masks, below_limit

def packed(words):
    return b''.join(struct.pack('<I', word) for word in words)

def pairs(ids, masks):
    out = []
    for index, left in enumerate(ids):
        for right in ids[index + 1:]:
            value = compare_masks(masks[left], masks[right])
            assert value is not None
            assert below_limit(value['intersection'], value['union'])
            out.append([left, right, value['intersection'], value['union']])
    return out

def main(request):
    result = {'audits': [], 'rawAudits': [], 'pngs': [], 'secondaryPngs': [],
              'pairs': {}, 'secondaryPairs': {}, 'crossRenderer': [],
              'maskCases': [], 'maskWords': [], 'pngFixtures': [], 'limits': []}
    for case in request['cases']:
        raw = audit_svg(case['svg'])
        result['rawAudits'].append(raw)
        value = dict(raw)
        if re.search(r'\s[\w:-]+\s+=|=\s+"', case['svg']):
            value['valid'] = False
            value['issues'] = [*value['issues'], 'canonical attribute serialization']
        result['audits'].append(value)
    for case in request['maskCases']:
        a, b = alpha_mask(bytes(case['a'])), alpha_mask(bytes(case['b']))
        assert a is not None and b is not None
        value = compare_masks(a, b)
        assert value is not None
        result['maskCases'].append([value['intersection'], value['union']])
        result['maskWords'].append([a, b])
    for i, u, _ in request['limits']:
        result['limits'].append(below_limit(i, u))
    for case in request['pngFixtures']:
        try:
            w, h, rgba = decode_png(Path(case['path']).read_bytes())
            result['pngFixtures'].append({'ok': True, 'width': w, 'height': h, 'rgba': list(rgba)})
        except (ValueError, OverflowError):
            result['pngFixtures'].append({'ok': False})
    ids = request['ids']
    for size in (24, 48, 256):
        masks, others = {}, {}
        for renderer, folder, mapped, dest in (
            ('librsvg', request['pngRoot'], masks, result['pngs']),
            ('cairo', request['secondaryRoot'], others, result['secondaryPngs'])
        ):
            for name in ids:
                width, height, rgba = decode_png((Path(folder) / str(size) / (name + '.png')).read_bytes())
                assert width == size and height == size
                words = alpha_mask(rgba)
                assert words is not None
                mapped[name] = words
                own = compare_masks(words, words)
                assert own is not None
                dest.append({'name': name, 'size': size, 'pixels': own['union'], 'bytes': len(rgba),
                             'maskSha256': hashlib.sha256(packed(words)).hexdigest(),
                             'rgbaSha256': hashlib.sha256(rgba).hexdigest(), 'renderer': renderer})
        result['pairs'][str(size)] = pairs(ids, masks)
        result['secondaryPairs'][str(size)] = pairs(ids, others)
        for name in ids:
            value = compare_masks(masks[name], others[name])
            assert value is not None
            result['crossRenderer'].append([name, size, value['intersection'], value['union']])
    return result

if __name__ == '__main__':
    json.dump(main(json.load(sys.stdin)), sys.stdout, separators=(',', ':'))
