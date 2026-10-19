"""Oracle B: ElementTree XML + Python big-integer masks + stdlib PNG decoder.
No imports of the TypeScript checker, its whitelist, or its counting helpers.
Different implementation, same author: blind independent authorship is NOT claimed.
"""
import sys, json, re, math, struct, zlib, binascii, hashlib
from pathlib import Path
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
NUM = r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?'

def path_valid(s):
    lex = re.compile(r'[MLHVCQZ]|' + NUM)
    tokens = lex.findall(s)
    if re.sub(r'[\s,]', '', lex.sub('', s)) or not tokens or tokens[0] != 'M':
        return False
    runs, current = [], None
    for token in tokens:
        if token in 'MLHVCQZ' and len(token) == 1:
            current = [token, []]
            runs.append(current)
        elif current is None:
            return False
        else:
            current[1].append(token)
    for command, values in runs:
        needed = dict(M=2,L=2,H=1,V=1,C=6,Q=4,Z=0)[command]
        if needed == 0:
            if values: return False
        elif not values or len(values) % needed:
            return False
        if any(not math.isfinite(float(x)) for x in values): return False
    return True

def audit(svg):
    result = {'valid': True, 'bytes':len(svg.encode('utf-8')), 'colors':[], 'shapes':0}
    bad = bool(re.search(r'[\r\n\t]|\sxmlns:|</[^>]*\s[^>]*>|\s[\w:-]+\s+=|=\s+"',svg)) or result['bytes'] > 1500 or svg != svg.strip() or bool(re.search(r'>\s+<|[&]|<\?|<!',svg))
    # The authored serialization uses double-quoted attributes and no prefixed names.
    if re.search(r"\s[\w:-]+\s*=\s*'",svg): bad = True
    try: root = ET.fromstring(svg)
    except ET.ParseError:
        result['valid'] = False
        return result
    base = {'fill','stroke','stroke-width','fill-rule'}
    attrs = {'g':{'transform'},'path':base|{'d'},'rect':base|{'x','y','width','height','rx'},
             'circle':base|{'cx','cy','r'},'ellipse':base|{'cx','cy','rx','ry'}}
    paints = set()
    if root.tag != '{'+NS+'}svg': bad = True
    # ElementTree absorbs xmlns into expanded element names.
    if root.attrib.get('viewBox') != '0 0 64 64': bad = True
    if root.attrib.get('stroke-width') != '4': bad = True
    if root.attrib.get('stroke-linecap') != 'round': bad = True
    if root.attrib.get('stroke-linejoin') != 'round': bad = True
    allowed_root = {'viewBox','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin'}
    for el in root.iter():
        tag = el.tag.removeprefix('{'+NS+'}')
        if not el.tag.startswith('{'+NS+'}') or tag not in {'svg','g','path','rect','circle','ellipse'}:
            bad = True
        if el is not root and tag == 'svg': bad = True
        allowed = allowed_root if el is root else attrs.get(tag,set())
        if set(el.attrib) - allowed: bad = True
        if (el.text or '').strip() or (el.tail or '').strip(): bad = True
        if tag not in {'g','svg'} and len(el): bad = True
        for key,value in el.attrib.items():
            if key in {'fill','stroke'} and value != 'none':
                if not re.fullmatch(r'#[0-9a-fA-F]{6}',value): bad = True
                paints.add(value.lower())
            if key == 'fill-rule' and value not in {'nonzero','evenodd'}: bad = True
            if key == 'stroke-width':
                if not re.fullmatch(NUM,value): bad = True
                elif not math.isfinite(float(value)) or float(value) <= 0: bad = True
        numeric = {'circle':['cx','cy','r'],'ellipse':['cx','cy','rx','ry'],'rect':['x','y','width','height']}.get(tag,[])
        for key in numeric:
            value = el.attrib.get(key,'')
            if not re.fullmatch(NUM,value) or not math.isfinite(float(value)): bad = True
        for key in {'circle':['r'],'ellipse':['rx','ry'],'rect':['width','height']}.get(tag,[]):
            value = el.attrib.get(key,'')
            if not re.fullmatch(NUM,value) or float(value) <= 0: bad = True
        if tag == 'rect' and 'rx' in el.attrib:
            value=el.attrib['rx']
            if not re.fullmatch(NUM,value) or not math.isfinite(float(value)) or float(value)<0: bad=True
        if tag == 'path' and not path_valid(el.attrib.get('d','')): bad=True
        if tag == 'g':
            match = re.fullmatch(r'rotate\(([^()]*)\)',el.attrib.get('transform',''))
            values = re.split(r'[ ,]+',match[1].strip()) if match else []
            if len(values) != 3 or any(not re.fullmatch(NUM,x) or not math.isfinite(float(x)) for x in values): bad=True
        if tag in {'circle','ellipse','path','rect'}: result['shapes']+=1
    result['colors']=sorted(paints)
    result['valid']=not bad and len(paints)<=6 and result['shapes']>0
    return result

def decode_png(data):
    """Decode 8-bit, non-interlaced RGB/RGBA PNG; validate CRCs and all row filters."""
    if data[:8] != b'\x89PNG\r\n\x1a\n': raise ValueError('PNG signature')
    p, payload, header, ended = 8, bytearray(), None, False
    while p < len(data):
        if p+12 > len(data): raise ValueError('truncated chunk')
        n = struct.unpack('>I',data[p:p+4])[0]
        kind=data[p+4:p+8]; body=data[p+8:p+8+n]
        if p+12+n>len(data): raise ValueError('truncated payload')
        crc=struct.unpack('>I',data[p+8+n:p+12+n])[0]
        if binascii.crc32(kind+body)&0xffffffff != crc: raise ValueError('CRC')
        p+=12+n
        if kind==b'IHDR':
            if header is not None or n!=13: raise ValueError('IHDR')
            header=struct.unpack('>IIBBBBB',body)
        elif kind==b'IDAT': payload.extend(body)
        elif kind==b'IEND': ended=True;break
    if not ended or p!=len(data) or header is None: raise ValueError('PNG end')
    w,h,depth,color,compression,filter_method,interlace=header
    if depth!=8 or color not in (2,6) or compression or filter_method or interlace: raise ValueError('PNG profile')
    channels=4 if color==6 else 3; stride=w*channels
    raw=zlib.decompress(payload)
    if len(raw)!=h*(stride+1): raise ValueError('PNG length')
    out=bytearray(); up=bytearray(stride)
    for y in range(h):
        mode=raw[y*(stride+1)]; row=bytearray(raw[y*(stride+1)+1:(y+1)*(stride+1)])
        if mode not in range(5): raise ValueError('PNG filter')
        if mode:
            for x in range(stride):
                a=row[x-channels] if x>=channels else 0
                b=up[x]; c=up[x-channels] if x>=channels else 0
                if mode==1: prediction=a
                elif mode==2: prediction=b
                elif mode==3: prediction=(a+b)//2
                else:
                    p0=a+b-c; distances=(abs(p0-a),abs(p0-b),abs(p0-c))
                    prediction=(a,b,c)[distances.index(min(distances))]
                row[x]=(row[x]+prediction)&255
        out.extend(row);up=row
    if channels==3:
        rgba=bytearray(w*h*4)
        for i in range(w*h): rgba[i*4:i*4+4]=out[i*3:i*3+3]+b'\xff'
        out=rgba
    return w,h,out

def bitmap(rgba):
    packed=bytearray((len(rgba)//4+7)//8)
    for i in range(len(rgba)//4):
        if rgba[4*i+3]>=128: packed[i//8]|=1<<(i%8)
    return int.from_bytes(packed,'little')

def pairs(ids,masks):
    out=[]
    for i,a in enumerate(ids):
        for j in range(i+1,len(ids)):
            left,right=masks[i],masks[j]
            out.append([a,ids[j],(left&right).bit_count(),(left|right).bit_count()])
    return out

def main(request):
    result={'audits':[audit(c['svg']) for c in request['cases']], 'pngs':[], 'pairs':{},'secondaryPairs':{},'crossRenderer':[], 'maskCases':[],'pngFixtures':[]}
    for case in request.get('maskCases',[]):
        a=bitmap(bytes(case['a']));b=bitmap(bytes(case['b']))
        result['maskCases'].append([(a&b).bit_count(),(a|b).bit_count()])
    for case in request.get('pngFixtures',[]):
        try:
            w,h,rgba=decode_png(Path(case['path']).read_bytes())
            result['pngFixtures'].append({'ok':True,'width':w,'height':h,'rgba':list(rgba)})
        except (ValueError,zlib.error,struct.error): result['pngFixtures'].append({'ok':False})
    if 'pngRoot' not in request: return result
    import cairosvg
    root=Path(request['pngRoot']);secondary=Path(request['secondaryRoot']);svgroot=Path(request['svgRoot']);ids=request['ids']
    for size in (24,48,256):
        masks=[];others=[];(secondary/str(size)).mkdir(parents=True,exist_ok=True)
        for name in ids:
            w,h,rgba=decode_png((root/str(size)/(name+'.png')).read_bytes())
            mask=bitmap(rgba);masks.append(mask)
            if w!=size or h!=size:raise ValueError('raster dimensions')
            result['pngs'].append({'name':name,'size':size,'pixels':mask.bit_count(),'bytes':len(rgba),'maskSha256':hashlib.sha256(mask.to_bytes((size*size+7)//8,'little')).hexdigest()})
            destination=secondary/str(size)/(name+'.png')
            cairosvg.svg2png(url=str(svgroot/(name+'.svg')),write_to=str(destination),output_width=size,output_height=size)
            cw,ch,crgba=decode_png(destination.read_bytes())
            if cw!=size or ch!=size:raise ValueError('secondary dimensions')
            other=bitmap(crgba);others.append(other)
            result['crossRenderer'].append([name,size,(mask&other).bit_count(),(mask|other).bit_count()])
        result['pairs'][str(size)]=pairs(ids,masks)
        result['secondaryPairs'][str(size)]=pairs(ids,others)
    result['cairoSVG']=cairosvg.__version__
    return result

if __name__=='__main__':
    json.dump(main(json.load(sys.stdin)),sys.stdout,separators=(',',':'))
