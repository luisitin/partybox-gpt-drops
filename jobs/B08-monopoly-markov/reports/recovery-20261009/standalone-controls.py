from pathlib import Path
import hashlib,json,os,subprocess,time,zipfile
root=Path('/tmp/gpt-drops-B08-audit-20261009');job=root/'jobs/B08-monopoly-markov';work=root/'.work/20261009-audit'
expected=json.loads((work/'partial-patched-source-files.json').read_text())
def freeze():
 for n,r in expected.items():assert hashlib.sha256((root/n).read_bytes()).hexdigest()==r['sha256'],n
freeze()
records=[];started=time.time();out=work/'standalone-clean-controls';out.mkdir()
runners=['test.mjs','simulate.mjs','mutate.mjs','partybox.mjs']
for seed in [1,2,3]:
 for runner in runners:
  assert time.time()-started<400,'Whole control bound'
  assert not (job/'.verification').exists(),'Fresh output folder precondition'
  folder=out/f'seed-{seed}-{runner[:-4]}';folder.mkdir()
  result=subprocess.run(['node',runner,str(seed)],cwd=job,capture_output=True,timeout=120)
  (folder/'stdout.log').write_bytes(result.stdout);(folder/'stderr.log').write_bytes(result.stderr)
  record={'seed':seed,'runner':runner,'command':f'node {runner} {seed}','exitCode':result.returncode,'cleanOutputDirectoryAbsentBeforeStart':True,'createdOutputDirectory':(job/'.verification').is_dir(),'stdoutSHA256':hashlib.sha256(result.stdout).hexdigest(),'stderrSHA256':hashlib.sha256(result.stderr).hexdigest()}
  if (job/'.verification').exists():os.rename(job/'.verification',folder/'outputs')
  record['closedUTC']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
  records.append(record);(out/'progress.json').write_text(json.dumps(records,indent=2)+'\n')
  assert result.returncode==0 and record['createdOutputDirectory'],record
  prefix={'test.mjs':'exact','simulate.mjs':'simulation','mutate.mjs':'mutations','partybox.mjs':'partybox'}[runner]
  report=json.loads((folder/'outputs'/f'{prefix}-seed-{seed}.json').read_text())
  assert report['passed']
  if runner=='test.mjs':assert report['assertions']==37981 and report['exactTransitionCells']==28800 and report['ownershipScenarios']==348
  if runner=='simulate.mjs':
   assert len(report['results'])==2
   assert all(r['rolls']==100000000 and r['maxSigma']<=4 and sum(x['count'] for x in r['squares'])==100000000 for r in report['results'])
  if runner=='mutate.mjs':assert report['strictCompiled']==report['runtimeKilled']==25 and all(r['strictCompilation'] and r['runtimeKilled'] and r['failure'] for r in report['results'])
  if runner=='partybox.mjs':
   assert report['exact']['assertions']==24023 and report['exact']['fuzzCases']==20000 and report['exact']['roiRows']==348
   assert len(report['simulation'])==2 and all(r['rolls']==20000000 and r['limit']==4.5 and r['maxZ']<=4.5 and len(r['statistics'])==48 for r in report['simulation'])
   assert report['mutants']['strictCompiled']==report['mutants']['runtimeKilled']==20
  freeze();print(json.dumps(record),flush=True)
artifact=work/'standalone-clean-controls.zip'
with zipfile.ZipFile(artifact,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for f in sorted(out.rglob('*')):
  if f.is_file():z.write(f,str(f.relative_to(out)))
receipt={'passed':True,'sourceScope':'Current narrow unpublished harness repair only; hosted full proof still required','commands':records,'allRequiredSeeds':[1,2,3],'cleanStandaloneInvocations':12,'exactAssertions':37981*3,'portExactAssertions':24023*3,'originalSimulationRolls':600000000,'portSimulationRolls':120000000,'originalStrictRuntimeMutants':75,'portStrictRuntimeMutants':60,'archiveBytes':artifact.stat().st_size,'archiveSHA256':hashlib.sha256(artifact.read_bytes()).hexdigest(),'sourceInputsFrozen':len(expected),'completedUTC':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'All four actual exposed runners complete from a missing output directory for every required seed, at unchanged full component counts; complete outputs, compiled mutants and raw logs retained.'}
(work/'STANDALONE-CLEAN-CONTROLS.json').write_text(json.dumps(receipt,indent=2)+'\n')
freeze();print(json.dumps({k:v for k,v in receipt.items() if k!='commands'}),flush=True)

