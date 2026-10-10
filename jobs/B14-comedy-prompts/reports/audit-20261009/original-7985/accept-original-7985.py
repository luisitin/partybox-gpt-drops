import json,hashlib,zipfile,re,difflib,datetime,shutil
from pathlib import Path
from collections import Counter
from jsonschema import Draft202012Validator
root=Path('/tmp/gpt-drops-B14-audit-20261009');w=root/'.work/20261009-audit';job=root/'jobs/B14-comedy-prompts'
meta=json.loads((w/'original-native-tree.json').read_text());frozen=w/'original-source';nativechecks=[]
for f in meta['files']:
 b=(root/f['path']).read_bytes();assert len(b)==f['size'];assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==f['sha']
 d=frozen/f['path'];d.parent.mkdir(parents=True,exist_ok=True);d.write_bytes(b);nativechecks.append(f['path'])
archive=w/'original-official.zip';b=archive.read_bytes();assert len(b)==5385 and hashlib.sha256(b).hexdigest()=='ba8f481a977e3ab0f46542f35301f194e3f3e966e74e95bc2c2b77214646b3f6'
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None and len(z.infolist())==2
 assert set(z.namelist())=={'ci.log','pool-similarity-rerun.json'}
 for f in z.infolist():assert not f.filename.startswith('/') and '..' not in Path(f.filename).parts and f.file_size<30_000_000
 ci=z.read('ci.log').decode();scan=json.loads(z.read('pool-similarity-rerun.json'))
 (w/'original-artifact-ci.log').write_text(ci)
 (w/'original-artifact-pool-similarity.json').write_bytes(z.read('pool-similarity-rerun.json'))
native=(w/'original-full-native-log.log').read_text();plain=re.sub(r'^\d{4}-\d{2}-\d{2}T[^\s]+Z ?', '',native,flags=re.M)
assert '7985b82423a9419bbbfcdc6c1dfb12b816bc461e' in native
for line in ci.splitlines():assert not line.strip() or line.strip() in plain,repr(line)
manifest=[]
for line in (job/'SHA256SUMS.txt').read_text().splitlines():
 h,p=line.split('  ',1);f=job/p;assert f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==h;assert p+': OK' in ci;manifest.append(p)
assert len(manifest)==163
actual=sorted(str(p.relative_to(job)) for p in job.rglob('*') if p.is_file() and '.work' not in p.parts and '__pycache__' not in p.parts and p.name!='SHA256SUMS.txt')
assert sorted(manifest)==actual
assert all((job/p).stat().st_size<=30_000_000 for p in actual+['SHA256SUMS.txt'])
load=lambda p:json.loads((job/p).read_text())
expected=load('results/pool-similarity.json');assert {k:v for k,v in scan.items() if k!='elapsedSeconds'}=={k:v for k,v in expected.items() if k!='elapsedSeconds'}
assert scan['candidateCases']==3000 and scan['pairComparisons']==4498500 and scan['textForms']==2 and scan['wordingDirectionsPerPair']==2
segments=scan['coverageSegments'];assert len(segments)==12
for s in segments:
 assert s['pairComparisons']==sum(2999-i for i in range(s['leftStart'],s['leftEndExclusive']))
 assert json.dumps({'completedLeftStart':s['leftStart'],'completedLeftEndExclusive':s['leftEndExclusive'],'pairComparisons':s['pairComparisons']})[:-1] in ci
assert sum(s['pairComparisons'] for s in segments)==4498500 and segments[0]['leftStart']==0 and segments[-1]['leftEndExclusive']==3000
assert all(a['leftEndExclusive']==b['leftStart'] for a,b in zip(segments,segments[1:]))
release=load('results/release.json');assert release['candidatePoolSimilarityComparisons']==4498500 and release['similarityPairComparisons']==719400
assert json.dumps(release,indent=2) in ci
rows=load('candidates.json');by={r['id']:r for r in rows};selected=load('prompts.json');selection={r['id'] for r in selected};reviews=load('grading/pass2.json');rv={r['id']:r for r in reviews['rows']}
assert len(rows)==len(by)==len(rv)==3000 and len(selected)==len(selection)==1200
for source,schema in [(rows,load('candidates.schema.json')),(selected,load('prompts.schema.json'))]:
 Draft202012Validator.check_schema(schema);assert not list(Draft202012Validator(schema).iter_errors(source))
assert Counter(r['kind'] for r in rows)=={'fill':1500,'most-likely':1500} and Counter(r['kind'] for r in selected)=={'fill':600,'most-likely':600}
assert all(len(r['text'])<=90 for r in rows)
assert reviews['reviewInputSha256']==hashlib.sha256((job/'review-input.json').read_bytes()).hexdigest()
batches=list(sorted((job/'batches').glob('*.tsv')));assert len(batches)==30
reviewed={}
for batch in batches:
 seal=load('seals/'+batch.stem+'.json');inp=job/'review-inputs'/(batch.stem+'.json')
 assert seal['firstPassSha256']==hashlib.sha256(batch.read_bytes()).hexdigest() and seal['reviewInputSha256']==hashlib.sha256(inp.read_bytes()).hexdigest()
 n=int(batch.name[:3]);r2=load('grading/pass2-'+str(n).zfill(3)+'.json');assert r2['reviewInputSha256']==hashlib.sha256(inp.read_bytes()).hexdigest() and r2['reviewer']!='original-author'
 assert {r['id'] for r in r2['rows']}=={r['id'] for r in json.loads(inp.read_text())}
 for r in r2['rows']:
  assert r['id'] not in reviewed and rv[r['id']]==dict(r,reviewer=r2['reviewer']);reviewed[r['id']]=r
assert len(reviewed)==3000 and sum(by[k]['firstPass']['grade']>=4 and r['grade']>=4 for k,r in rv.items())==1978
assert sum(by[k]['firstPass']['grade']==r['grade'] for k,r in rv.items())==1343
assert sum((by[k]['firstPass']['grade']>=4)==(r['grade']>=4) for k,r in rv.items())==2217
aliases=load('named-reference-aliases.json')['tagToCanonical'];named=Counter();editorial=load('editorial-review.json');ed={r['id']:r for r in editorial['rows']}
assert editorial['selectedSha256']==hashlib.sha256((job/'prompts.json').read_bytes()).hexdigest()
for r in selected:
 o=by[r['id']];assert all(r[k]==o[k] for k in ['kind','text','namedReferences']);assert o['firstPass']['grade']>=4 and rv[r['id']]['grade']>=4
 named.update(set(aliases.get(x,x) for x in r['namedReferences']));e=ed[r['id']];assert all(e[k] for k in ['noSlurs','noMinors','namedReferencesChecked'])
 assert {x['tag'] for x in e['namedReferenceEvidence']}==set(r['namedReferences'])
 for x in e['namedReferenceEvidence']:assert r['text'][x['start']:x['end']]==x['nameInText'] and x['canonical']==aliases.get(x['tag'],x['tag'])
assert len(named)==630 and max(named.values())==3 and dict(sorted(named.items()))==load('named-reference-audit.json')['selectedCombinedCounts']
normalize=lambda s:re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
for flag in scan['flags']:
 a,b=[by[x]['text'] for x in flag['ids']];a,b=normalize(a),normalize(b);ac,bc=a.removeprefix('who s most likely to '),b.removeprefix('who s most likely to ')
 full=max(difflib.SequenceMatcher(None,a,b,autojunk=False).ratio(),difflib.SequenceMatcher(None,b,a,autojunk=False).ratio());content=max(difflib.SequenceMatcher(None,ac,bc,autojunk=False).ratio(),difflib.SequenceMatcher(None,bc,ac,autojunk=False).ratio())
 assert flag['fullTextRatio']==full and flag['contentRatio']==content and max(full,content)>.75
 assert (flag['resolution']=='keep-distinct')==all(i in selection for i in flag['ids'])
assert len(scan['flags'])==57 and scan['originalSingleDirectionFlagsRetained']==55 and scan['selectedFlaggedPairs']==4
assert {tuple(x['ids']) for x in load('curation-iterations/01/full-pool-single-direction-scan.json')['flags']} <= {tuple(x['ids']) for x in scan['flags']}
receipt={'acceptedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'originalHead':meta['head'],'run':37675775829,'job':112978767591,'artifact':11506704793,'archiveBytes':archive.stat().st_size,'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'nativeLogBytes':(w/'original-full-native-log.log').stat().st_size,'nativeLogSha256':hashlib.sha256((w/'original-full-native-log.log').read_bytes()).hexdigest(),'nativeSourceBlobHashesChecked':len(nativechecks),'manifestPayloadsChecked':163,'deliveredFileSizesIndependentlyObserved':164,'allSafeZIPEntriesFullyReadCRC':2,'actualHostedScanPairs':4498500,'actualHostedFinalScanPairs':719400,'actualHostedSegmentsChecked':12,'actualFlagRatiosIndependentlyRecomputed':57,'originalSingleDirectionFlagsRetained':55,'selectedFlagsAllResolved':4,'candidateSchemasChecked':3000,'finalSchemasChecked':1200,'allFirstPassSealsChecked':30,'independentGradeCasesChecked':3000,'bothGradeQualified':1978,'agreementExactCount':1343,'agreementThresholdCount':2217,'combinedCanonicalBuckets':630,'combinedMax':3,'researchScopeStillUnverified':True,'scope':'Whole genuine original evidence is accepted for its actual editorial/structural scans only; original tests omit the delivery size gate and do not establish global reranking, semantic uniqueness or factual cue research. Original Ready13/source remains protected.'}
(w/'ORIGINAL-7985-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt,indent=2))
