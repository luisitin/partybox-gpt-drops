from pathlib import Path
import json,hashlib,subprocess,time,os,zipfile
root=Path('/tmp/gpt-drops-B08-audit-20261009');job=root/'jobs/B08-monopoly-markov';work=root/'.work/20261009-audit'
original=json.loads((work/'frozen-original-source-files.json').read_text())
edits={
 'test.mjs':("import { writeFileSync } from 'node:fs';","import { writeFileSync,mkdirSync } from 'node:fs';","assert.ok([1,2,3].includes(seed));"),
 'simulate.mjs':("import { writeFileSync } from 'node:fs';","import { writeFileSync,mkdirSync } from 'node:fs';","assert.ok([1,2,3].includes(seed),'Fixed required seed');"),
 'mutate.mjs':("import { readFileSync,writeFileSync } from 'node:fs';","import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';","assert.ok([1,2,3].includes(seed));"),
 'partybox.mjs':("import { readFileSync, writeFileSync } from 'node:fs';","import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';","assert.ok([1, 2, 3].includes(seed), 'Fixed required seed');")
}
changed=set()
for name,(before,after,seedline) in edits.items():
 p=job/name;s=p.read_text();assert s.count(before)==s.count(seedline)==1
 n=s.replace(before,after).replace(seedline,seedline+"\nmkdirSync('.verification',{recursive:true});")
 assert n.replace(after,before).replace(seedline+"\nmkdirSync('.verification',{recursive:true});",seedline)==s
 p.write_text(n);changed.add(str(p.relative_to(root)))
p=root/'.github/workflows/B08.yml';s=p.read_text();before="paths: ['jobs/B08-*/**']";after="paths: ['jobs/B08-*/**', '.github/workflows/B08.yml']";assert s.count(before)==1
p.write_text(s.replace(before,after));changed.add(str(p.relative_to(root)))
current={}
for name,row in original.items():
 b=(root/name).read_bytes();current[name]={**row,'sha256':hashlib.sha256(b).hexdigest(),'gitSHA':hashlib.sha1(b'blob '+str(len(b)).encode()+bytes([0])+b).hexdigest(),'bytes':len(b)}
 if name not in changed:assert current[name]==row,name
(work/'partial-patched-source-files.json').write_text(json.dumps(current,indent=2)+'\n')
receipt={'changedHarnessFiles':sorted(changed),'allOther67OriginalNativeInputsUnchanged':True,'originalDriverAndAllWorkloadsUnchanged':True,'originalAuthoredSealsUnchanged':True,'exactDiffOnlyImportsDirectoryCreationAndWorkflowSelfPath':True,'sourceFullAcceptance':'PENDING'}
(work/'NARROW-REPAIR-SCOPE.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))

