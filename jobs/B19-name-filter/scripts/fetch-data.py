#!/usr/bin/env python3
"""Acquire public, aggregate corpora. Never synthesize or pad a missing corpus.
Requires Python 3 stdlib only. Snapshot hashes and source ranks are recorded.
A cached selection is verified against its own manifest on every test run.
"""
import csv, hashlib, io, json, pathlib, sys, urllib.request, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'data' / 'cache'
OUT.mkdir(parents=True, exist_ok=True)
LOCK = json.loads((ROOT / 'data' / 'snapshot-manifest.json').read_text())
SOURCES = {
 'male': 'https://www2.census.gov/topics/genealogy/1990surnames/dist.male.first',
 'female': 'https://www2.census.gov/topics/genealogy/1990surnames/dist.female.first',
 'last': 'https://www2.census.gov/topics/genealogy/1990surnames/dist.all.last',
 'words': 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt',
 'places': 'https://download.geonames.org/export/dump/cities15000.zip'
}
def digest(b): return hashlib.sha256(b).hexdigest()
def fetch(url):
    req=urllib.request.Request(url, headers={'User-Agent':'B19-corpus-verifier/1.0 (public aggregate test data)'})
    with urllib.request.urlopen(req, timeout=90) as r:
        if r.status != 200: raise RuntimeError(f'HTTP {r.status}: {url}')
        return r.read(29_000_001)
def main():
    manifest_path=OUT/'manifest.json'
    if manifest_path.exists():
        m=json.loads(manifest_path.read_text())
        for item in m['outputs']:
            b=(OUT/item['file']).read_bytes()
            expected = next(x for x in LOCK['outputs'] if x['file']==item['file'])
            if digest(b)!=item['sha256'] or item != expected: raise RuntimeError('Cached corpus checksum mismatch: '+item['file'])
        if m != LOCK: raise RuntimeError('Cached manifest differs from committed snapshot lock')
        print('CORPORA_CACHE_VERIFIED',json.dumps(m,ensure_ascii=True)); return
    raw={}; sources=[]
    for key,url in SOURCES.items():
        b=fetch(url)
        if len(b)>29_000_000: raise RuntimeError('Source exceeds file size budget')
        expected=next(x for x in LOCK['sources'] if x['id']==key)
        if digest(b)!=expected['sha256']: raise RuntimeError('Upstream source changed; do not silently refresh the snapshot: '+key)
        raw[key]=b
        sources.append({'id':key,'url':url,'bytes':len(b),'sha256':digest(b)})
    given={}
    for category in ['male','female']:
        rows=raw[category].decode('ascii').splitlines()
        if len(rows)<1000: raise RuntimeError('Incomplete Census first-name download')
        for line in rows:
            fields=line.split()
            name, frequency, rank=fields[0].lower(), float(fields[1]), int(fields[3])
            item={'name':name,'source':category,'sourceRank':rank,'sourceFrequency':frequency}
            if name not in given or frequency>given[name]['sourceFrequency']: given[name]=item
    # 5,000 unique given names by max sex-specific frequency, then the most
    # frequent surnames not already selected until 20,000 unique names total.
    names=sorted(given.values(),key=lambda x:(-x['sourceFrequency'],x['name']))[:5000]
    if len(names)!=5000: raise RuntimeError('Fewer than 5000 distinct first names')
    seen={x['name'] for x in names}
    for line in raw['last'].decode('ascii').splitlines():
        fields=line.split(); name=fields[0].lower()
        if name in seen: continue
        seen.add(name); names.append({'name':name,'source':'last','sourceRank':int(fields[3])})
        if len(names)==20000: break
    words=[{'name':line.strip(),'source':'words','sourceRank':i+1} for i,line in enumerate(raw['words'].decode().splitlines()) if line.strip()]
    if len(words)!=10000: raise RuntimeError(f'English corpus is not exactly 10000 rows: {len(words)}')
    with zipfile.ZipFile(io.BytesIO(raw['places'])) as z:
        text=z.read('cities15000.txt').decode('utf8')
    city_rows=[]
    for line in text.splitlines():
        f=line.split('\t')
        if len(f)!=19: raise RuntimeError('Invalid GeoNames schema')
        city_rows.append((int(f[14]),int(f[0]),f[1],f[8]))
    places=[]; seen=set()
    for population,geonameid,name,country in sorted(city_rows,key=lambda row:(-row[0],row[1])):
        if name.casefold() in seen: continue
        seen.add(name.casefold());places.append({'name':name,'population':population,'geonameid':geonameid,'country':country,'source':'places'})
        if len(places)==2000: break
    selections={'names':names,'words':words,'places':places}; outputs=[]
    for key, rows in selections.items():
        n={'names':20000,'words':10000,'places':2000}[key]
        if len(rows)!=n or len({r['name'].casefold() for r in rows})!=n: raise RuntimeError(f'Bad count/duplicates: {key}')
        b=(json.dumps(rows,ensure_ascii=False,separators=(',',':'))+'\n').encode()
        (OUT/(key+'.json')).write_bytes(b)
        outputs.append({'file':key+'.json','count':n,'bytes':len(b),'sha256':digest(b)})
    m={'sources':sources,'outputs':outputs,'selection':'5000 unique 1990 given names by max sex-specific frequency; append highest-ranked distinct surnames to 20000; all 10000 English entries unfiltered; 2000 unique GeoNames city names by descending population. No moderation-based exclusions.'}
    if m != LOCK: raise RuntimeError('Selected corpus differs from committed snapshot lock')
    manifest_path.write_text(json.dumps(m,indent=2)+'\n')
    print('CORPORA_FETCHED',json.dumps(m,ensure_ascii=True))
if __name__=='__main__':
    try: main()
    except Exception as exc: print('CORPUS_ACQUISITION_FAILED',repr(exc),file=sys.stderr);sys.exit(1)
