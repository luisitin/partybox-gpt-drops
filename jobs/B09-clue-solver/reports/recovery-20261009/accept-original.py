from pathlib import Path
import tarfile,json,hashlib,io,re,time
r=Path('/tmp/gpt-drops-B09-audit-20261009');w=r/'.work/20261009-audit';a=w/'original-2b395-source.tar.gz';raw=a.read_bytes();tree=json.loads((w/'original-tree.json').read_text());native={e['path']:e for e in tree['tree'] if e['type']=='blob'};assert not tree['truncated']
out={}
with tarfile.open(fileobj=io.BytesIO(raw),mode='r:gz') as t:
 root=t.getnames()[0].split('/')[0]
 for e in t:
  if e.isdir():continue
  assert e.isfile() and not e.issym() and not e.islnk()
  p=Path(e.name).relative_to(root);assert not p.is_absolute() and '..' not in p.parts;name=p.as_posix();assert name in native
  b=t.extractfile(e).read();v=native[name];sha=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest();assert sha==v['sha'] and len(b)==v['size'] and len(b)<=30000000,name
  dest=r/p;dest.parent.mkdir(parents=True,exist_ok=True);assert not dest.exists() or dest.read_bytes()==b;dest.write_bytes(b);out[name]={'bytes':len(b),'gitSHA':sha,'sha256':hashlib.sha256(b).hexdigest()}
assert set(out)==set(native)
(w/'frozen-original-source-files.json').write_text(json.dumps(out,indent=2)+'\n')
j=r/'jobs/B09-clue-solver';manifest=[]
for line in (j/'SHA256SUMS.txt').read_text().splitlines():
 h,n=line.split('  ');p=(j/n).resolve();assert p.is_relative_to(r) and hashlib.sha256(p.read_bytes()).hexdigest()==h;manifest.append(p.relative_to(r).as_posix())
expected=set(n for n in out if n.startswith('jobs/B09-clue-solver/') and not n.endswith('/SHA256SUMS.txt'))|{'.github/workflows/B09.yml'};assert set(manifest)==expected
run=json.loads((w/'original-run.json').read_text());jobs=json.loads((w/'original-jobs.json').read_text())['jobs'];arts=json.loads((w/'original-artifacts.json').read_text())['artifacts'];assert run['head_sha']=='2b39550d395bab5ea0ad5c18cae19c3f78fdd84c' and run['status']=='completed' and run['conclusion']=='success';assert len(jobs)==1 and all(x['status']=='completed' and x['conclusion']=='success' for x in jobs[0]['steps']);assert not arts
b=(w/'original-fullNativeLog.log').read_bytes();log=b.decode('utf-8-sig');plain=[x.split(' ',1)[1] if re.match('[0-9]{4}-[0-9]{2}-[0-9]{2}T',x) else x for x in log.splitlines()]
records=[]
for l in plain:
 try:d=json.loads(l)
 except ValueError:continue
 if isinstance(d,dict) and 'reducedCases' in d:records.append(d)
assert len(records)==3 and [x['seed'] for x in records]==[1,2,3]
for i,d in enumerate(records):
 assert d['fixedCases']==194 and d['reducedCases']==20000 and d['fullGames']==5000 and d['playerCounts']==[1250]*4
 assert d['fullUpdates']==[45266,44878,45247][i] and d['sparseSixPlayerStressUpdates']==420 and d['denseSixPlayerSuggestions']==690 and d['sixPlayerUpdates']==[11795,11714,11796][i]
 assert 0<=d['sixPlayerMilliseconds']['p50']<=d['sixPlayerMilliseconds']['p99']<=d['sixPlayerMilliseconds']['maximum']<=200
 assert d['sparseSixPlayerStressMaximum']<=200 and d['denseSixPlayerMilliseconds']<=200
for seed in [1,2,3]:
 assert f'seed {seed}: 20,000 reduced random logs agree exactly' in plain
 for n in range(1000,5001,1000):assert f'seed {seed}: {n}/5000 full games' in plain
mut=json.loads((j/'mutation-results.json').read_text());assert len(mut)==75
ids=[]
for m in mut:assert m['killed'] and m['seed'] in [1,2,3] and m['evidence'];ids.append(m['id'])
unique=list(dict.fromkeys(ids));assert len(unique)==25
for i,n in enumerate(unique,1):
 assert sorted(x['seed'] for x in mut if x['id']==n)==[1,2,3]
 assert f'mutation {i}/25 {n}: killed for seeds 1,2,3' in plain
assert '25/25 independently planted, compiling production mutations caught for all three seeds' in plain
for n in manifest:assert n.removeprefix('jobs/B09-clue-solver/')+': OK' in plain or ('../../.github/workflows/B09.yml: OK' in plain and n=='.github/workflows/B09.yml'),n
test=(j/'test.mjs').read_text();assert 'timings.sort((a,b) => a-b)' in test and 'maximum <= 200' in test and '20_000' in test and '5_000' in test
mutation=(j/'mutations.mjs').read_text();assert "execFileSync(process.execPath" in mutation and 'for (const seed of [1,2,3])' in mutation and 'Compiler' not in mutation.split('const results =')[1]
for n,e in out.items():assert hashlib.sha256((r/n).read_bytes()).hexdigest()==e['sha256']
receipt={'accepted':True,'source':run['head_sha'],'workflowRun':run['id'],'job':jobs[0]['id'],'nativeSourceInputs':len(out),'manifestEntries':len(manifest),'fullNativeLogBytes':len(b),'fullNativeLogSHA256':hashlib.sha256(b).hexdigest(),'fullSeedReports':records,'reducedLogs':60000,'classicGames':15000,'classicUpdates':sum(x['fullUpdates'] for x in records),'sparseUpdates':1260,'denseUpdates':3,'actualStrictCompiledVariants':25,'actualSeededRuntimeMutationKills':75,'originalWorkflowHasNoArchiveStep':True,'actualArtifacts':0,'wholeNativeMetadataAndLogsAccepted':True,'sourceAndReferenceUnchanged':True,'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Exact original2b395 original full hosted workflow and complete native log accepted. Recorded original timing scope only; no current local timing run. Genuine archive unavailable by original workflow design; no archive acceptance claimed. Sparse-tuple and deck-null defects remain separate.'}
(w/'ORIGINAL-2B395-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))
