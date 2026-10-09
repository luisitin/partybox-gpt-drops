import csv,hashlib,io,json,math,pathlib,re,struct,time,zipfile
ROOT=pathlib.Path('/tmp/gpt-drops-B08-audit-20261009')
JOB=ROOT/'jobs/B08-monopoly-markov'
WORK=ROOT/'.work/20261009-audit'
HEAD='5f35ba66a2169b4126c8ae312efa8c1635b3f5e3'
digest=lambda b:hashlib.sha256(b).hexdigest()
expected=json.loads((WORK/'frozen-original-source-files.json').read_text())
tree=json.loads((WORK/'native-original-tree.json').read_text())
assert not tree['truncated']
native={e['path']:e for e in tree['tree'] if e['type']=='blob'}
for name,e in expected.items():
 b=(ROOT/name).read_bytes()
 assert digest(b)==e['sha256'] and native[name]['sha']==e['gitSHA'] and native[name]['size']==e['bytes'],name
manifest=[]
for line in (JOB/'SHA256SUMS.txt').read_text().splitlines():
 h,n=line.split('  ');f=(JOB/n).resolve();assert f.is_relative_to(ROOT)
 assert digest(f.read_bytes())==h,n
 manifest.append(str(f.relative_to(ROOT)))
own=[n for n in expected if n.startswith('jobs/B08-monopoly-markov/') and not n.endswith('/SHA256SUMS.txt')]
assert set(manifest)==set(own+['.github/workflows/B08.yml']) and len(manifest)==67
seal_counts=[]
for filename,folder in [('PRODUCTION-SEALED-SHA256SUMS.txt','.'),('blind-authoring/SEALED-SHA256SUMS.txt','blind-authoring'),('blind-authoring/ROI-SEALED-SHA256SUMS.txt','blind-authoring')]:
 lines=(JOB/filename).read_text().splitlines();seal_counts.append(len(lines))
 for line in lines:
  h,n=line.split('  ');assert digest((JOB/folder/pathlib.Path(n).name).read_bytes())==h,n
assert seal_counts==[4,4,3]
for n in ['reference.ts','roi-reference.ts']:assert (JOB/n).read_bytes()==(JOB/'blind-authoring'/n).read_bytes()
run=json.loads((WORK/'original-native-run.json').read_text())
jobs=json.loads((WORK/'original-native-jobs.json').read_text())['jobs']
artifacts=json.loads((WORK/'original-native-artifacts.json').read_text())['artifacts']
assert run['head_sha']==HEAD and run['status']=='completed' and run['conclusion']=='success'
assert len(jobs)==1 and jobs[0]['status']=='completed' and jobs[0]['conclusion']=='success'
assert all(s['status']=='completed' and s['conclusion']=='success' for s in jobs[0]['steps'])
assert len(artifacts)==1 and not artifacts[0]['expired']
artifact=artifacts[0];assert artifact['workflow_run']['head_sha']==HEAD
archive=(WORK/'original-5f35-official.zip').read_bytes()
assert len(archive)==artifact['size_in_bytes'] and 'sha256:'+digest(archive)==artifact['digest']
end=archive.rfind(b'PK\x05\x06');assert end>=0 and end+22+struct.unpack_from('<H',archive,end+20)[0]==len(archive)
files={}
with zipfile.ZipFile(io.BytesIO(archive)) as z:
 assert z.testzip() is None
 for e in z.infolist():
  p=pathlib.PurePosixPath(e.filename)
  assert not p.is_absolute() and '..' not in p.parts and not e.is_dir()
  assert e.filename not in files and (e.external_attr>>16)&0o170000!=0o120000 and e.file_size<=30000000
  files[e.filename]=z.read(e)
assert len(files)==148
summary=json.loads(files['summary.json'])
required={'exactTransitionCells':86400,'stationaryStates':720,'publishedSquares':720,'matchedPublishedSquares':717,'documentedPublishedGaps':3,'requiredButlerComparisons':480,'roiScenarios':1044,'simulationRolls':600000000,'simulationSquares':240,'strictCompiledMutants':75,'runtimeKilledMutants':75,'partyboxRoiRows':1044,'partyboxSimulationRolls':120000000,'partyboxSimulatedStatistics':288,'partyboxStrictCompiledMutants':60,'partyboxRuntimeKilledMutants':60}
assert summary['passed'] and summary['command']=='npm test' and summary['node']=='v22.16.0' and summary['typescript']=='5.8.3'
assert summary['seeds']==[1,2,3] and summary['totals']==required and len(summary['sourceSHA256'])==22
for n,h in summary['sourceSHA256'].items():assert digest((JOB/n).read_bytes())==h,n
log_bytes=(WORK/'original-5f35-full-native.log').read_bytes();log=log_bytes.decode('utf-8-sig')
plain=[re.sub(r'^\d{4}-\d{2}-\d{2}T\S+Z ','',l) for l in log.splitlines()]
objects=[]
for l in plain:
 try:o=json.loads(l)
 except ValueError:continue
 if isinstance(o,dict):objects.append(o)
assert len(objects)==159
assert {'suite':'complete','passed':True,'node':summary['node'],'typescript':summary['typescript'],'seeds':[1,2,3],'totals':required} in objects
assert sum('SHA256: 67 files verified' in l for l in plain)==2
assert 'npm ci --ignore-scripts --no-audit --no-fund' in log and '> node run.mjs' in log
assert str(artifact['id']) in log and artifact['digest'].split(':',1)[1] in log
odds=json.loads((JOB/'odds.json').read_text());assert len(odds['squareNames'])==40
strategies=odds['strategies'];assert len(strategies)==2
csv_rows=list(csv.DictReader(io.StringIO((JOB/'roi.csv').read_text())));assert len(csv_rows)==348
totals={k:0 for k in required};max_sigmas=[];max_z=[];mutant_hashes={}
for seed,suite in zip([1,2,3],summary['runs']):
 assert suite['seed']==seed
 exact=suite['exact'];sim=suite['simulation'];mut=suite['mutation'];port=suite['partybox']
 for key,value in [('exact',exact),('simulation',sim),('mutations',mut),('partybox',port)]:
  assert value==json.loads(files[f'{key}-seed-{seed}.json'])
 assert exact['passed'] and exact['seed']==seed and exact['assertions']==37981
 assert exact['exactTransitionCells']==28800 and exact['stationaryStates']==240 and exact['publishedSquares']==240
 assert exact['ownershipScenarios']==348 and exact['matchedPublishedSquares']==239 and exact['documentedPublishedGaps']==1
 assert {k:exact[k] for k in ['suite','seed','passed','assertions','exactTransitionCells','stationaryStates','publishedSquares','ownershipScenarios','observations']} in objects
 for obs in exact['observations']:
  assert obs['maxStateDifference']<=1e-12 and obs['residual']<=1e-12
  comparisons=obs['tableComparisons'];assert len(comparisons)==3
  assert [c['id'] for c in comparisons]==['butler-per-roll','butler-end-turn','collins-per-roll']
  for c in comparisons[:2]:assert c['squares']==40 and c['tolerance']==1e-4 and c['maxDifference']<=1e-4
  c=comparisons[2];assert c['squares']==40 and c['tolerance']==1e-4
  if obs['strategy']=='leave ASAP':assert c['matchedSquares']==40 and not c['documentedGaps'] and c['maxDifference']<=1e-4
  else:assert c['matchedSquares']==39 and len(c['documentedGaps'])==1 and c['documentedGaps'][0]['position']==10 and c['conflictRecord']=='CONFLICTS.md'
 for variance in exact['samplingVariance']:
  assert len(variance['variances'])==40 and all(math.isfinite(v) and v>=0 for v in variance['variances']) and variance['maxResidual']<1e-12
 assert sim['passed'] and len(sim['results'])==2
 for result in sim['results']:
  assert result['passed'] and result['seed']==seed and result['rolls']==100000000 and result['burnIn']==10000
  assert result['maxSigma']<=4 and len(result['squares'])==40 and result['poissonResidual']<1e-12
  assert sum(x['count'] for x in result['squares'])==100000000
  var=next(v for v in exact['samplingVariance'] if v['strategy']==result['strategy'])
  for position,x in enumerate(result['squares']):
   assert x['position']==position and isinstance(x['count'],int) and x['count']>=0
   sd=math.sqrt(result['rolls']*var['variances'][position])
   assert math.isclose(x['standardDeviation'],sd,rel_tol=1e-12,abs_tol=1e-12)
   assert math.isclose(x['difference'],x['count']-x['expected'],rel_tol=1e-12,abs_tol=1e-9)
   sigma=abs(x['difference'])/sd if sd else 0
   assert math.isclose(x['sigma'],sigma,rel_tol=1e-12,abs_tol=1e-12) and sigma<=4
  assert math.isclose(result['maxSigma'],max(x['sigma'] for x in result['squares']),rel_tol=1e-12)
  native_result={k:result[k] for k in ['strategy','seed','rolls','passed','maxSigma','poissonResidual']}
  assert {'suite':'simulation',**native_result} in objects
  assert all(f'simulation seed={seed} strategy={result["strategy"]} rolls={n}' in plain for n in range(10000000,100000001,10000000))
  max_sigmas.append({'seed':seed,'strategy':result['strategy'],'maxSigma':result['maxSigma']})
 assert mut['passed'] and mut['mutations']==mut['strictCompiled']==mut['runtimeKilled']==25 and len(mut['results'])==25
 assert mut['productionSHA256']==digest((JOB/'monopolyOdds.ts').read_bytes())
 for index,m in enumerate(mut['results'],1):
  assert m['strictCompilation'] and m['runtimeKilled'] and m['failure'] and m['name'].startswith(f'M{index:02}')
  assert {'suite':'mutation','seed':seed,**m} in objects
  name=f'mutant-{seed}-M{index:02}.mjs';assert len(files[name])>1000
  mutant_hashes[name]=digest(files[name])
 assert len({mutant_hashes[f'mutant-{seed}-M{i:02}.mjs'] for i in range(1,26)})==25
 assert port['passed'] and port['seed']==seed and port['boardOddsSHA256']==digest((JOB/'boardOdds.ts').read_bytes())
 assert port['exact']['assertions']==24023 and port['exact']['fuzzCases']==20000 and port['exact']['roiRows']==348
 assert {'suite':'partybox-exact','seed':seed,'passed':True,'assertions':24023,'fuzzCases':20000} in objects
 assert len(port['simulation'])==2
 for result in port['simulation']:
  assert result['passed'] and result['rolls']==20000000 and result['batches']==200 and result['burnIn']==10000
  assert result['limit']==4.5 and result['maxZ']<=4.5 and len(result['statistics'])==48
  for stat in result['statistics']:
   assert all(math.isfinite(stat[k]) for k in ['expected','simulated','standardError','z']) and stat['standardError']>=0 and stat['z']<=4.5
   if stat['expected']==0:assert stat['simulated']==0 and stat['z']==0
   else:assert math.isclose(stat['z'],abs(stat['simulated']-stat['expected'])/stat['standardError'],rel_tol=1e-10,abs_tol=1e-10)
  assert math.isclose(result['maxZ'],max(x['z'] for x in result['statistics']),rel_tol=1e-12)
  assert {'suite':'partybox-simulation','plan':result['plan'],'seed':seed,'rolls':20000000,'statistics':48,'passed':True,'maxZ':result['maxZ'],'rollsPerTurn':result['rollsPerTurn']} in objects
  max_z.append({'seed':seed,'plan':result['plan'],'maxZ':result['maxZ']})
 pm=port['mutants'];assert pm['planted']==pm['strictCompiled']==pm['runtimeKilled']==20 and len(pm['results'])==20
 for index,m in enumerate(pm['results'],1):
  assert m['strictCompilation'] and m['runtimeKilled'] and m['failure'] and m['name'].startswith(f'P{index:02}')
  assert {'suite':'partybox-mutation','seed':seed,**m} in objects
  name=f'partybox-mutant-{seed}-P{index:02}.mjs';assert len(files[name])>1000
  mutant_hashes[name]=digest(files[name])
 assert len({mutant_hashes[f'partybox-mutant-{seed}-P{i:02}.mjs'] for i in range(1,21)})==20
 assert {'suite':'partybox','seed':seed,'passed':True,'assertions':24023,'simulatedRolls':40000000,'mutants':20,'killed':20} in objects
 for k,amount in [('exactTransitionCells',exact['exactTransitionCells']),('stationaryStates',exact['stationaryStates']),('publishedSquares',exact['publishedSquares']),('matchedPublishedSquares',exact['matchedPublishedSquares']),('documentedPublishedGaps',exact['documentedPublishedGaps']),('requiredButlerComparisons',160),('roiScenarios',exact['ownershipScenarios']),('simulationRolls',sum(r['rolls'] for r in sim['results'])),('simulationSquares',sum(len(r['squares']) for r in sim['results'])),('strictCompiledMutants',mut['strictCompiled']),('runtimeKilledMutants',mut['runtimeKilled']),('partyboxRoiRows',port['exact']['roiRows']),('partyboxSimulationRolls',sum(r['rolls'] for r in port['simulation'])),('partyboxSimulatedStatistics',sum(len(r['statistics']) for r in port['simulation'])),('partyboxStrictCompiledMutants',pm['strictCompiled']),('partyboxRuntimeKilledMutants',pm['runtimeKilled'])]:
  totals[k]+=amount
assert totals==required
assert len(mutant_hashes)==135
assert len([o for o in objects if o.get('strictCompilation') and o.get('runtimeKilled')])==135
for family,amount in [('mutant',25),('partybox-mutant',20)]:
 for i in range(1,amount+1):assert len({mutant_hashes[f'{family}-{seed}-{("M" if family=="mutant" else "P")}{i:02}.mjs'] for seed in [1,2,3]})==1
for name,e in expected.items():assert digest((ROOT/name).read_bytes())==e['sha256'],name
receipt={'accepted':True,'source':HEAD,'workflowRun':run['id'],'job':jobs[0]['id'],'artifact':artifact['id'],'archiveBytes':len(archive),'archiveSHA256':digest(archive),'fullSafeUniqueZipMembers':len(files),'nativeSourceInputs':len(expected),'manifestEntries':len(manifest),'authoredSealCounts':seal_counts,'runtimeSourceFingerprints':len(summary['sourceSHA256']),'nativeJSONObjects':len(objects),'fullCompiledMutationModules':len(mutant_hashes),'compiledMutationSHA256':mutant_hashes,'totals':totals,'fullNativeLogBytes':len(log_bytes),'fullNativeLogSHA256':digest(log_bytes),'coreSimulationSixCells':max_sigmas,'portSimulationSixCells':max_z,'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Exact original5f35 full native workflow and entire genuine archive accepted at full720M/135 counts. Source unchanged. Standalone and own-path review defects remain separate.'}
(WORK/'ORIGINAL-5F35-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({k:v for k,v in receipt.items() if k!='compiledMutationSHA256'},indent=2))

