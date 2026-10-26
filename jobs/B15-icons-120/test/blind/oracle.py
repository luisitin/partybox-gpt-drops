"""Independent B15 SVG/PNG/mask auditor; JSON-lines protocol on stdin/stdout."""
import base64
import binascii
import json
import math
import re
import struct
import sys
import xml.etree.ElementTree as ET
import zlib

NUMBER = r'[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?'
NUMERIC = re.compile(NUMBER + r'\Z')
ATTRIBUTE = re.compile(r'\s+([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*"([^"<>]*)"')
ROOT_ATTRIBUTES = {'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'}
COMMON = {'fill', 'stroke', 'stroke-width', 'fill-rule'}
GEOMETRY = {
    'path': {'d'}, 'rect': {'x', 'y', 'width', 'height', 'rx'},
    'circle': {'cx', 'cy', 'r'}, 'ellipse': {'cx', 'cy', 'rx', 'ry'},
}

def finite_number(text):
    return isinstance(text, str) and NUMERIC.fullmatch(text) is not None and math.isfinite(float(text))

def numbers(text):
    result = []
    position = 0
    for match in re.finditer(NUMBER, text):
        if re.fullmatch(r'[\s,]*', text[position:match.start()]) is None:
            return None
        if not math.isfinite(float(match.group())):
            return None
        result.append(float(match.group()))
        position = match.end()
    return result if re.fullmatch(r'[\s,]*', text[position:]) else None

def good_path(data):
    if not data:
        return False
    tokens = []
    position = 0
    for match in re.finditer(r'[MLHVCQZ]|' + NUMBER, data):
        if re.fullmatch(r'[\s,]*', data[position:match.start()]) is None:
            return False
        tokens.append(match.group())
        position = match.end()
    if re.fullmatch(r'[\s,]*', data[position:]) is None or not tokens or tokens[0] != 'M':
        return False
    arity = {'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'Q': 4, 'Z': 0}
    index = 0
    while index < len(tokens):
        command = tokens[index]
        if command not in arity:
            return False
        index += 1
        count = 0
        while index < len(tokens) and tokens[index] not in arity:
            if not finite_number(tokens[index]):
                return False
            count += 1
            index += 1
        if arity[command] == 0:
            if count != 0:
                return False
        elif count == 0 or count % arity[command] != 0:
            return False
    return True

def audit_svg(text):
    encoded = text.encode('utf-8', errors='surrogatepass')
    issues = []
    colors = set()
    shapes = 0
    def issue(message):
        issues.append(message)
    if len(encoded) > 1500:
        issue('byte budget')
    if text != text.strip() or re.search(r'[\r\n\t]|>\s+<', text):
        issue('not minified')
    if '&' in text or '<!' in text or '<?' in text:
        issue('entity or declaration')
    lexical = []
    for match in re.finditer(r'<([^<>]+)>', text):
        body = match.group(1)
        if body.startswith('/'):
            continue
        if body.endswith('/'):
            body = body[:-1]
        name_match = re.match(r'[A-Za-z_:][A-Za-z0-9_.:-]*', body)
        if name_match is None:
            issue('tag syntax')
            continue
        attrs = {}
        cursor = name_match.end()
        while cursor < len(body):
            if re.fullmatch(r'\s*', body[cursor:]):
                break
            attr = ATTRIBUTE.match(body, cursor)
            if attr is None:
                issue('attribute syntax')
                break
            if attr.group(1) in attrs:
                issue('duplicate attribute')
            attrs[attr.group(1)] = attr.group(2)
            cursor = attr.end()
        lexical.append((name_match.group(), attrs))
    try:
        root = ET.fromstring(text)
    except (ET.ParseError, ValueError, UnicodeError):
        return {'valid': False, 'bytes': len(encoded), 'colors': [], 'shapes': 0, 'issues': issues + ['XML']}
    nodes = list(root.iter())
    if len(nodes) != len(lexical):
        issue('lexical element mismatch')
    root_attrs = lexical[0][1] if lexical else {}
    required = {'xmlns': 'http://www.w3.org/2000/svg', 'viewBox': '0 0 64 64',
                'stroke-width': '4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'}
    if not lexical or lexical[0][0] != 'svg' or root.tag != '{http://www.w3.org/2000/svg}svg':
        issue('SVG root')
    if any(root_attrs.get(key) != value for key, value in required.items()):
        issue('root profile')
    if set(root_attrs) - ROOT_ATTRIBUTES:
        issue('root attributes')
    for index, node in enumerate(nodes):
        if node.text or node.tail:
            issue('text content')
        if index >= len(lexical):
            continue
        name, attrs = lexical[index]
        if node.tag != '{http://www.w3.org/2000/svg}' + name:
            issue('namespace')
        if index > 0:
            if name == 'g':
                if set(attrs) != {'transform'}:
                    issue('group attributes')
                transform = re.fullmatch(r'rotate\((.*)\)', attrs.get('transform', ''))
                values = numbers(transform.group(1)) if transform else None
                if values is None or len(values) != 3:
                    issue('rotation')
            elif name in GEOMETRY:
                shapes += 1
                if set(attrs) - (COMMON | GEOMETRY[name]):
                    issue('shape attributes')
                if name == 'path':
                    if not good_path(attrs.get('d', '')):
                        issue('path')
                else:
                    required_geometry = GEOMETRY[name] - ({'rx'} if name == 'rect' else set())
                    if any(key not in attrs for key in required_geometry):
                        issue('missing geometry')
                    for key in GEOMETRY[name]:
                        if key not in attrs:
                            continue
                        if not finite_number(attrs[key]):
                            issue('numeric geometry')
                        elif key in {'width', 'height', 'r', 'rx', 'ry'}:
                            value = float(attrs[key])
                            if value < 0 or (value == 0 and not (name == 'rect' and key == 'rx')):
                                issue('nonpositive geometry')
            else:
                issue('element')
        for key in ('fill', 'stroke'):
            if key in attrs:
                paint = attrs[key]
                if paint == 'none':
                    pass
                elif re.fullmatch(r'#[0-9a-fA-F]{6}', paint):
                    colors.add(paint.lower())
                else:
                    issue('paint')
        if 'fill-rule' in attrs and attrs['fill-rule'] not in {'evenodd', 'nonzero'}:
            issue('fill rule')
        if 'stroke-width' in attrs and (not finite_number(attrs['stroke-width']) or float(attrs['stroke-width']) <= 0):
            issue('stroke width')
        if len(node) > 0 and name not in {'svg', 'g'}:
            issue('shape contains children')
    if shapes == 0:
        issue('no art')
    if len(colors) > 6:
        issue('color budget')
    return {'valid': not issues, 'bytes': len(encoded), 'colors': sorted(colors), 'shapes': shapes, 'issues': issues}

def decode_png(data):
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('PNG signature')
    offset = 8
    header = None
    compressed = []
    seen_idat = False
    closed_idat = False
    palette = False
    transparent = None
    seen_end = False
    while offset < len(data):
        if offset + 12 > len(data):
            raise ValueError('chunk truncation')
        length = struct.unpack_from('>I', data, offset)[0]
        kind = data[offset + 4:offset + 8]
        if not re.fullmatch(b'[A-Za-z]{4}', kind) or not 65 <= kind[2] <= 90:
            raise ValueError('chunk type')
        end = offset + 12 + length
        if end > len(data):
            raise ValueError('chunk payload truncation')
        payload = data[offset + 8:offset + 8 + length]
        crc = struct.unpack_from('>I', data, end - 4)[0]
        if binascii.crc32(kind + payload) & 0xffffffff != crc:
            raise ValueError('CRC')
        offset = end
        if header is None and kind != b'IHDR':
            raise ValueError('IHDR first')
        if seen_idat and kind != b'IDAT':
            closed_idat = True
        if kind == b'IHDR':
            if header is not None or length != 13:
                raise ValueError('IHDR')
            header = struct.unpack('>IIBBBBB', payload)
            width, height, depth, color, compression, filtering, interlace = header
            if width == 0 or height == 0 or depth != 8 or color not in (2, 6) or compression != 0 or filtering != 0 or interlace != 0:
                raise ValueError('unsupported format')
        elif kind == b'PLTE':
            if palette or seen_idat or transparent is not None or length == 0 or length > 768 or length % 3:
                raise ValueError('PLTE')
            palette = True
        elif kind == b'tRNS':
            if transparent is not None or seen_idat or header[3] != 2 or length != 6:
                raise ValueError('tRNS')
            transparent = struct.unpack('>HHH', payload)
            if any(channel > 255 for channel in transparent):
                raise ValueError('tRNS sample')
        elif kind == b'IDAT':
            if closed_idat:
                raise ValueError('noncontiguous IDAT')
            compressed.append(payload)
            seen_idat = True
        elif kind == b'IEND':
            if length != 0 or not seen_idat or offset != len(data):
                raise ValueError('IEND')
            seen_end = True
            break
        elif 65 <= kind[0] <= 90:
            raise ValueError('unknown critical chunk')
    if header is None or not seen_end:
        raise ValueError('missing PNG chunks')
    width, height, _, color, _, _, _ = header
    channels = 4 if color == 6 else 3
    stride = width * channels
    expected = height * (stride + 1)
    inflater = zlib.decompressobj()
    raw = inflater.decompress(b''.join(compressed), expected + 1)
    if len(raw) != expected or not inflater.eof or inflater.unused_data or inflater.unconsumed_tail:
        raise ValueError('decompression length or stream')
    rgba = bytearray()
    previous = bytearray(stride)
    for row in range(height):
        start = row * (stride + 1)
        mode = raw[start]
        if mode > 4:
            raise ValueError('row filter')
        current = bytearray(stride)
        for column in range(stride):
            a = current[column - channels] if column >= channels else 0
            b = previous[column]
            c = previous[column - channels] if column >= channels else 0
            if mode == 0:
                predictor = 0
            elif mode == 1:
                predictor = a
            elif mode == 2:
                predictor = b
            elif mode == 3:
                predictor = (a + b) // 2
            else:
                p = a + b - c
                distances = (abs(p - a), abs(p - b), abs(p - c))
                predictor = (a, b, c)[distances.index(min(distances))]
            current[column] = (raw[start + 1 + column] + predictor) % 256
        if channels == 4:
            rgba.extend(current)
        else:
            for column in range(0, stride, 3):
                rgb = tuple(current[column:column + 3])
                rgba.extend(rgb)
                rgba.append(0 if transparent is not None and rgb == transparent else 255)
        previous = current
    return width, height, bytes(rgba)

def alpha_mask(rgba):
    if len(rgba) % 4:
        return None
    words = [0] * ((len(rgba) // 4 + 31) // 32)
    for pixel, alpha in enumerate(rgba[3::4]):
        if alpha >= 128:
            words[pixel // 32] |= 1 << (pixel % 32)
    return words

def compare_masks(a, b):
    if len(a) != len(b):
        return None
    intersection = 0
    union = 0
    for x, y in zip(a, b):
        x = int(x) & 0xffffffff
        y = int(y) & 0xffffffff
        intersection += (x & y).bit_count()
        union += (x | y).bit_count()
    return {'intersection': intersection, 'union': union, 'iou': intersection / union if union else 1}

def below_limit(intersection, union):
    def safe(value):
        return not isinstance(value, bool) and isinstance(value, (int, float)) and abs(value) <= 2**53 - 1 and math.isfinite(value) and int(value) == value
    return safe(intersection) and safe(union) and 0 <= intersection <= union and union > 0 and 5 * int(intersection) < 4 * int(union)

def request(message):
    op = message['op']
    if op == 'svg':
        return audit_svg(message['text'])
    if op == 'png':
        width, height, rgba = decode_png(base64.b64decode(message['data'], validate=True))
        return {'valid': True, 'width': width, 'height': height, 'rgba': base64.b64encode(rgba).decode('ascii')}
    if op == 'alpha':
        words = alpha_mask(base64.b64decode(message['data'], validate=True))
        return {'valid': words is not None, 'words': words}
    if op == 'compare':
        result = compare_masks(message['a'], message['b'])
        return {'valid': result is not None, 'result': result}
    if op == 'limit':
        return {'below': below_limit(message['intersection'], message['union'])}
    raise ValueError('unknown operation')

if __name__ == '__main__':
    for line in sys.stdin:
        try:
            reply = request(json.loads(line))
        except (ValueError, KeyError, TypeError, OverflowError, UnicodeError, zlib.error) as error:
            reply = {'valid': False, 'error': str(error)}
        print(json.dumps(reply, separators=(',', ':'), ensure_ascii=True), flush=True)
