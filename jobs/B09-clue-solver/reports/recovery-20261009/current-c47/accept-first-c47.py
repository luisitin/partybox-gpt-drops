import pathlib,hashlib,io,json,re,struct,math,time,zipfile
ROOT=pathlib.Path('/tmp/gpt-drops-B09-audit-20261009');JOB=ROOT/'jobs/B09-clue-solver';WORK=ROOT/'.work/20261009-audit'
HEAD='c47cdf5570896c0ca80869c2cfca8116d945db16'
digest=lambda b:hashlib.sha256(b).hexdigest()
expected=json.loads((WORK/'first-source-files.json').read_text());tree=json.loads((WORK/'first-native-tree.json').read_text());assert not tree['truncated']
native={e['path']:e for e in tree['tree'] if e['type']=='blob'};assert set(native)==set(expected) and len(expected)==72
for n,e in expected.items():
 b=(ROOT/n).read_bytes();assert digest(b)==e['sha256'] and native[n]['sha']==e['gitSHA'] and native[n]['size']==e['bytes'],n
manifest=[]
for line in (JOB/'SHA256SUMS.txt').read_text().splitlines():
 h,n=line.split('  ');p=(JOB/n).resolve();assert p.is_relative_to(ROOT) and digest(p.read_bytes())==h,n;manifest.append(p.relative_to(ROOT).as_posix())
own={n for n in expected if n.startswith('jobs/B09-clue-solver/') and not n.endswith('/SHA256SUMS.txt')};assert set(manifest)==own|{'.github/workflows/B09.yml'} and len(manifest)==67
original=json.loads((WORK/'frozen-original-source-files.json').read_text())
for n in ['reference.ts','types.ts','INDEPENDENCE.md','package.json','package-lock.json','tsconfig.json','results.json','mutation-results.json','hosted-results.json','preloop-results.json','verification-output.log','benchmark.mjs','benchmark-worst.json']:
 assert digest((JOB/n).read_bytes())==original['jobs/B09-clue-solver/'+n]['sha256'],n
prod=(JOB/'clueSolver.ts').read_text();assert not re.search(r'Math[.]random|Date[.]now',prod)
assert not json.loads((JOB/'package.json').read_text()).get('dependencies')
run=json.loads((WORK/'first-native-run.json').read_text());jobs=json.loads((WORK/'first-native-jobs.json').read_text())['jobs'];arts=json.loads((WORK/'first-native-artifacts.json').read_text())['artifacts']
assert run['head_sha']==HEAD and run['status']=='completed' and run['conclusion']=='success';assert len(jobs)==1 and jobs[0]['status']=='completed' and jobs[0]['conclusion']=='success';assert all(s['status']=='completed' and s['conclusion']=='success' for s in jobs[0]['steps'])
assert len(arts)==1 and not arts[0]['expired'];artifact=arts[0];assert artifact['workflow_run']['head_sha']==HEAD and artifact['workflow_run']['id']==run['id']
archive=(WORK/'first-c47-official.zip').read_bytes();assert len(archive)==artifact['size_in_bytes'] and 'sha256:'+digest(archive)==artifact['digest']
eocd=archive.rfind(bytes([80,75,5,6]));assert eocd>=0 and eocd+22+struct.unpack_from('<H',archive,eocd+20)[0]==len(archive)
files={}
with zipfile.ZipFile(io.BytesIO(archive)) as z:
 assert z.testzip() is None
 for e in z.infolist():
  p=pathlib.PurePosixPath(e.filename);assert not p.is_absolute() and '..' not in p.parts and not e.is_dir() and e.filename not in files and e.file_size<=30000000 and (e.external_attr>>16)&0o170000!=0o120000
  files[e.filename]=z.read(e)
baseline=json.loads((WORK/'ORIGINAL-2B395-FULL-ACCEPTANCE.json').read_text())
variants=list(dict.fromkeys(x['id'] for x in json.loads((JOB/'mutation-results.json').read_text())))
wanted={'results.json','mutation-results.json','.verification/package.json','.verification/types.js'}|{'.verification/mutant-'+n+'.mjs' for n in variants}
assert set(files)==wanted and len(files)==29
assert json.loads(files['.verification/package.json'])=={'type':'module'} and files['.verification/types.js']==(JOB/'dist/types.js').read_bytes()
module_hashes={}
for n in variants:
 b=files['.verification/mutant-'+n+'.mjs'];assert len(b)>5000 and b'function solveClue' in b;module_hashes[n]=digest(b)
assert len(set(module_hashes.values()))==25
results=json.loads(files['results.json']);mutations=json.loads(files['mutation-results.json']);assert len(results)==3 and [x['seed'] for x in results]==[1,2,3] and len(mutations)==75
log_bytes=(WORK/'first-native-log.log').read_bytes();log=log_bytes.decode('utf-8-sig');plain=[x.split(' ',1)[1] if re.match('[0-9]{4}-[0-9]{2}-[0-9]{2}T',x) else x for x in log.splitlines()]
objects=[]
for l in plain:
 try:o=json.loads(l)
 except ValueError:continue
 if isinstance(o,dict) and 'reducedCases' in o:objects.append(o)
assert len(objects)==3
for i,d in enumerate(results):
 seed=i+1;assert d['seed']==seed and d['fixedCases']==206 and d['reducedCases']==20000 and d['fullGames']==5000 and d['playerCounts']==[1250]*4
 old=baseline['fullSeedReports'][i]
 for n in ['reducedSuggestions','fullSuggestions','fullUpdates','sparseSixPlayerStressUpdates','denseSixPlayerSuggestions','sixPlayerUpdates']:assert d[n]==old[n],n
 values=d['rawSixPlayerMilliseconds'];assert isinstance(values,list) and len(values)==d['sixPlayerUpdates'] and values==sorted(values) and all(isinstance(v,(int,float)) and math.isfinite(v) and 0<=v<=200 for v in values)
 timings=d['sixPlayerMilliseconds'];assert timings=={'p50':values[math.floor((len(values)-1)*.5)],'p99':values[math.floor((len(values)-1)*.99)],'maximum':values[-1]}
 assert 0<=d['sparseSixPlayerStressMaximum']<=200 and 0<=d['denseSixPlayerMilliseconds']<=200 and d['sparseSixPlayerStressMaximum'] in values and d['denseSixPlayerMilliseconds'] in values
 assert {k:v for k,v in d.items() if k!='rawSixPlayerMilliseconds'}==objects[i]
 assert f'seed {seed}: 20,000 reduced random logs agree exactly' in plain
 for n in range(1000,5001,1000):assert f'seed {seed}: {n}/5000 full games' in plain
for i,n in enumerate(variants,1):
 group=[m for m in mutations if m['id']==n];assert sorted(m['seed'] for m in group)==[1,2,3] and all(m['killed'] and m['evidence'] for m in group)
 assert f'mutation {i}/25 {n}: killed for seeds 1,2,3' in plain
assert '25/25 independently planted, compiling production mutations caught for all three seeds' in plain
for name in manifest:
 label='../../.github/workflows/B09.yml' if name=='.github/workflows/B09.yml' else name.removeprefix('jobs/B09-clue-solver/')
 assert label+': OK' in plain,label
assert str(artifact['id']) in log and artifact['digest'].split(':',1)[1] in log and '> npm run build && node test.mjs && node mutations.mjs' in log
assert all(digest((ROOT/n).read_bytes())==v['sha256'] for n,v in expected.items())
receipt={'accepted':True,'source':HEAD,'workflowRun':run['id'],'job':jobs[0]['id'],'artifact':artifact['id'],'archiveBytes':len(archive),'archiveSHA256':digest(archive),'fullSafeUniqueZipMembers':len(files),'nativeSourceInputs':len(expected),'manifestEntries':len(manifest),'fullNativeLogBytes':len(log_bytes),'fullNativeLogSHA256':digest(log_bytes),'sourceAndHistoricalReportsAndIndependentReferenceUnchanged':True,'fullCurrentFixedCases':618,'originalFixedCasesRetained':582,'addedMalformedCases':12,'reducedLogs':60000,'classicGames':15000,'classicUpdates':sum(d['fullUpdates'] for d in results),'sparseUpdates':1260,'denseUpdates':3,'actualStrictCompiledVariants':25,'actualSeededRuntimeMutationKills':75,'actualCompiledModulesSHA256':module_hashes,'allRawSixPlayerMeasurements':sum(len(d['rawSixPlayerMilliseconds']) for d in results),'literal200msMaximumGateUnchanged':True,'recomputedTimingQuantiles':[{'seed':d['seed'],**d['sixPlayerMilliseconds']} for d in results],'allOriginalDatasetsUnchanged':True,'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Exact currentc47 genuine full hosted archive and native workflow accepted, at every original random/mutation/timing gate plus12validation regressions. All current timing samples independently recomputed. Historical/current timing scopes separate; substantive KEEP pending.'}
(WORK/'FIRST-C47-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+chr(10))
print(json.dumps({k:v for k,v in receipt.items() if k!='actualCompiledModulesSHA256'}))
