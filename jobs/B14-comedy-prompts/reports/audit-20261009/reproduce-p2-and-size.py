import hashlib,json,subprocess,sys,tempfile,shutil,datetime
from pathlib import Path
w=Path(__file__).resolve().parent;root=w.parents[1];job=root/'jobs/B14-comedy-prompts';original=w/'original-source/jobs/B14-comedy-prompts'
oldsel=json.loads((original/'prompts.json').read_text());oldids={r['id'] for r in oldsel};by={r['id']:r for r in json.loads((original/'candidates.json').read_text())};rv={r['id']:r for r in json.loads((original/'grading/pass2.json').read_text())['rows']}
named={}
for r in oldsel:
 for n in r['namedReferences']:named[n]=named.get(n,0)+1
findings=[]
for i in ['Q0249','Q0255']:
 assert i not in oldids and by[i]['firstPass']['grade']==5 and rv[i]['grade']==4 and named[by[i]['namedReferences'][0]]<3
 findings.append({'id':i,'grade':[5,4],'selected':False,'referenceSlotsUsed':named[by[i]['namedReferences'][0]],'text':by[i]['text']})
assert 'M0497' in oldids and 'Q0497' in oldids and all('ashes' in by[i]['text'] and 'Folgers tin' in by[i]['text'] for i in ['M0497','Q0497'])
results=[]
def invoke(script,fixture,args):
 before={str(p.relative_to(fixture)):hashlib.sha256(p.read_bytes()).hexdigest() for p in fixture.rglob('*') if p.is_file()}
 result=subprocess.run([sys.executable,str(script)]+args,cwd=fixture,capture_output=True,text=True,timeout=10)
 after={str(p.relative_to(fixture)):hashlib.sha256(p.read_bytes()).hexdigest() for p in fixture.rglob('*') if p.is_file()}
 assert before==after,'check mutated fixture'
 return {'returncode':result.returncode,'stdout':result.stdout,'stderr':result.stderr,'allFixtureBytesPreserved':True}
def setup(base):
 p=base/'fixture';(p/'scripts').mkdir(parents=True);(p/'payload.txt').write_bytes(b'unchanged useful delivery\n')
 (p/'scripts/checksums.py').write_bytes((job/'scripts/checksums.py').read_bytes())
 return p
def manifest(p):
 (p/'SHA256SUMS.txt').write_text('\n'.join(hashlib.sha256(f.read_bytes()).hexdigest()+'  '+str(f.relative_to(p)) for f in sorted(p.rglob('*')) if f.is_file() and f.name!='SHA256SUMS.txt')+'\n')
def case(name,mutation,expected):
 with tempfile.TemporaryDirectory(prefix='b14-size-control-',dir=w) as temporary:
  p=setup(Path(temporary));manifest(p);mutation(p)
  result=invoke(p/'scripts/checksums.py',p,['--check']);assert (result['returncode']==0)==expected,(name,result)
  result['name']=name;results.append(result)
case('unchanged complete positive',lambda p:None,True)
case('unlisted ordinary file',lambda p:(p/'unlisted.txt').write_text('extra'),False)
case('changed listed payload',lambda p:(p/'payload.txt').write_text('changed'),False)
case('missing listed payload',lambda p:(p/'payload.txt').unlink(),False)
case('duplicate manifest entry',lambda p:(p/'SHA256SUMS.txt').write_text((p/'SHA256SUMS.txt').read_text()*2),False)
case('invalid checksum syntax',lambda p:(p/'SHA256SUMS.txt').write_text('not a checksum\n'),False)
case('absolute manifest path',lambda p:(p/'SHA256SUMS.txt').write_text('0'*64+'  /tmp/outside\n'),False)
case('parent traversal manifest path',lambda p:(p/'SHA256SUMS.txt').write_text('0'*64+'  ../outside\n'),False)
case('symlink delivery',lambda p:(p/'link').symlink_to(p/'payload.txt'),False)
case('private work excluded',lambda p:((p/'.work').mkdir(),(p/'.work/private.txt').write_text('private')),True)
legacy=[]
for listed in [False,True]:
 with tempfile.TemporaryDirectory(prefix='b14-old-size-witness-',dir=w) as temporary:
  p=setup(Path(temporary));manifest(p)
  with (p/'oversized.dat').open('wb') as f:f.truncate(30_000_001)
  if listed:manifest(p)
  old=subprocess.run(['sha256sum','-c','SHA256SUMS.txt'],cwd=p,capture_output=True,text=True,timeout=10)
  new=invoke(p/'scripts/checksums.py',p,['--check'])
  assert old.returncode==0 and new['returncode']!=0
  legacy.append({'listed':listed,'oldExit':old.returncode,'oldStdout':old.stdout,'new':new})
receipt={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'originalHead':'7985b82423a9419bbbfcdc6c1dfb12b816bc461e','omittedHigherGrades':findings,'weakerSelectedWitness':{'id':'Q0002','grade':[by['Q0002']['firstPass']['grade'],rv['Q0002']['grade']]},'semanticDuplicateIds':['M0497','Q0497'],'legacyFalseGreenControls':legacy,'newReadOnlyChecks':results,'childClosures':'all subprocess.run completed naturally; owned temporary control fixtures removed by TemporaryDirectory; no signals','researchClaimsPromoted':0}
(w/'P2-REPRO-AND-SIZE-CONTROLS.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'utc':receipt['utc'],'negativeControls':sum(x['returncode']!=0 for x in results)+len(legacy),'positiveControls':sum(x['returncode']==0 for x in results),'legacyOversizedFalseGreens':2,'oldBothGenreRankingGap':True,'oldFolgersSemanticDuplicate':True,'researchPromotions':0},indent=2))
