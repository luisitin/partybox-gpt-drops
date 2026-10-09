from pathlib import Path
import hashlib,json,subprocess,time,tarfile
r=Path('/tmp/gpt-drops-B08-audit-20261009');j=r/'jobs/B08-monopoly-markov';w=r/'.work/20261009-audit'
e=json.loads((w/'first81da-source-files.json').read_text());o=json.loads((w/'frozen-original-source-files.json').read_text())
d=lambda b:hashlib.sha256(b).hexdigest()
assert (w/'FIRST-81DA-FULL-ACCEPTANCE.json').exists()
def freeze():
 for n,v in e.items():assert d((r/n).read_bytes())==v['sha256'],n
def now():return time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
freeze();assert not (j/'.verification').exists()
t=tarfile.open(w/'original-5f35-source.tar.gz');names=t.getnames();prefix=names[0].split('/')[0]
allowed={'.github/workflows/B08.yml'}|{'jobs/B08-monopoly-markov/'+n for n in ['test.mjs','simulate.mjs','mutate.mjs','partybox.mjs','README.md','NEXT.md','VERIFY.md','LOOP.md','ASSUMPTIONS.md','SHA256SUMS.txt']}
unchanged=[]
for n,v in o.items():
 if n not in allowed:assert (r/n).read_bytes()==t.extractfile(prefix+'/'+n).read();unchanged.append(n)
for n in ['test.mjs','simulate.mjs','mutate.mjs','partybox.mjs']:
 p='jobs/B08-monopoly-markov/'+n;s=(r/p).read_text()
 if n=='partybox.mjs':s=s.replace(', mkdirSync }', ' }').replace("mkdirSync('.verification', { recursive: true });\n",'')
 else:s=s.replace(',mkdirSync }',' }').replace("mkdirSync('.verification',{recursive:true});\n",'')
 assert s.encode()==t.extractfile(prefix+'/'+p).read(),n
p='.github/workflows/B08.yml';s=(r/p).read_text().replace(", '.github/workflows/B08.yml'",'');assert s.encode()==t.extractfile(prefix+'/'+p).read()
k1={'passed':True,'round':1,'concreteAudit':'Reverse exactly the four mkdir imports/calls and workflow own path, and compare all other original immutable source gates, model, library, authoring seals, data and preview bytes with the genuine original source archive.','originalImmutableInputsChecked':len(unchanged),'fiveRepairFilesExactlyReversible':True,'completeOriginalDriverAndPackageUnchanged':True,'currentSourceInputsFrozen':len(e),'playerFacingGainFound':False,'completedUTC':now()}
(w/'KEEP-1-GATE-PRESERVATION.json').write_text(json.dumps(k1,indent=2)+'\n');print(json.dumps(k1),flush=True)
out=w/'keep-edge-controls';out.mkdir(exist_ok=True);records=[]
def run(label,argv,expected):
 freeze()
 with (out/(label+'.stdout')).open('wb') as a,(out/(label+'.stderr')).open('wb') as b:p=subprocess.run(argv,cwd=j,stdout=a,stderr=b,timeout=30)
 freeze();assert p.returncode==expected,(label,p.returncode)
 return {'label':label,'argv':argv,'exitCode':p.returncode,'stdoutSHA256':d((out/(label+'.stdout')).read_bytes()),'stderrSHA256':d((out/(label+'.stderr')).read_bytes()),'closedUTC':now()}
for n in ['test.mjs','simulate.mjs','mutate.mjs','partybox.mjs']:
 for label,value in [('zero','0'),('four','4'),('text','invalid'),('omitted',None)]:
  assert not (j/'.verification').exists();argv=['node',n]+([] if value is None else [value]);v=run(n+'-'+label,argv,1)
  assert not (j/'.verification').exists() and not (out/(n+'-'+label+'.stdout')).read_bytes()
  assert b'AssertionError' in (out/(n+'-'+label+'.stderr')).read_bytes();v['noOutputDirectoryOrFalseSuccess']=True;records.append(v)
k2={'passed':True,'round':2,'concreteAudit':'Actual invalid seed and omitted argument failure controls for every exposed runner, checking validation happens before directory creation.','actualExpectedRejections':len(records),'records':records,'currentSourceInputsFrozen':len(e),'playerFacingGainFound':False,'completedUTC':now()}
(w/'KEEP-2-INVALID-SEEDS.json').write_text(json.dumps(k2,indent=2)+'\n');print(json.dumps({k:v for k,v in k2.items() if k!='records'}),flush=True)
v=run('valid-first-absent',['node','test.mjs','1'],0);assert (j/'.verification').is_dir();before=(j/'.verification/exact-seed-1.json').read_bytes();assert json.loads(before)['assertions']==37981
sent=b'\x00\xffB08-existing-output-sentinel\n';(j/'.verification/sentinel.bin').write_bytes(sent)
v2=run('valid-repeat-existing',['node','test.mjs','1'],0);assert (j/'.verification/exact-seed-1.json').read_bytes()==before and (j/'.verification/sentinel.bin').read_bytes()==sent
(j/'.verification').rename(out/'valid-existing-directory-outputs')
collisions=[]
for n in ['test.mjs','simulate.mjs','mutate.mjs','partybox.mjs']:
 (j/'.verification').write_bytes(sent);v3=run(n+'-file-collision',['node',n,'1'],1)
 assert (j/'.verification').is_file() and (j/'.verification').read_bytes()==sent and b'EEXIST' in (out/(n+'-file-collision.stderr')).read_bytes()
 (j/'.verification').rename(out/(n+'-collision-original-file'));collisions.append(v3)
freeze();assert not (j/'.verification').exists()
k3={'passed':True,'round':3,'concreteAudit':'Two actual full exact runs with missing then existing output folder; report bytes repeat exactly and unrelated binary sentinel survives. Four actual regular-file collision failures preserve original bytes and cannot produce success.','actualExactRuns':2,'exactAssertionsPerRun':37981,'repeatableReportSHA256':d(before),'binarySentinelPreserved':True,'actualExpectedFileCollisionRejections':4,'validCommands':[v,v2],'collisionCommands':collisions,'currentSourceInputsFrozen':len(e),'playerFacingGainFound':False,'completedUTC':now()}
(w/'KEEP-3-IDEMPOTENCE-COLLISIONS.json').write_text(json.dumps(k3,indent=2)+'\n');print(json.dumps({k:v for k,v in k3.items() if k not in ['validCommands','collisionCommands']}),flush=True)
print(json.dumps({'passed':True,'threeSubstantiveNoGainRounds':True,'allActualChildrenNaturallyClosed':True,'originalPublicInputsFrozen':len(e),'noOutputFolderLeftBehind':True,'completedUTC':now()}),flush=True)
