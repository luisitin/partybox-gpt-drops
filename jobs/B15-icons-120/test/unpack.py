"""Build the ZIP from committed SVGs when absent; never silently overwrite edits."""
import json, zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
ids=[row['id'] for row in json.loads((root/'manifest.json').read_text())]
expected={'icons/'+name+'.svg' for name in ids}
if not (root/'icons.zip').exists():
    with zipfile.ZipFile(root/'icons.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for name in sorted(ids,key=lambda name:name+'.svg'):
            source=root/'icons'/(name+'.svg')
            data=source.read_bytes()
            if len(data)>1500:raise ValueError('oversized source SVG')
            info=zipfile.ZipInfo('icons/'+name+'.svg',date_time=(1980,1,1,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
            archive.writestr(info,data)
with zipfile.ZipFile(root/'icons.zip') as z:
    if len(z.namelist())!=120 or set(z.namelist())!=expected:raise ValueError('unexpected ZIP members')
    for info in z.infolist():
        if info.file_size>1500:raise ValueError('oversized SVG member')
        data=z.read(info);data.decode('utf-8');dest=root/info.filename
        if dest.exists() and dest.read_bytes()!=data:raise ValueError('edited icon differs from sealed bundle: '+info.filename)
        dest.parent.mkdir(exist_ok=True);dest.write_bytes(data)
