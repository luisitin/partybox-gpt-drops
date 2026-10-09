import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,readdirSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
mkdirSync('test-output',{recursive:true});
const folder=mkdtempSync(join(tmpdir(),'b12-tool-controls-')),raw=pathToFileURL(resolve('dist/reference.js')).href;
const owner=(mode)=>"import {longestTrail as raw} from "+JSON.stringify(raw)+";let calls=0;export function longestTrail(routes){calls++;return {length:"+ (mode==='bad-small'?'0':"(calls>300&&"+JSON.stringify(mode==='bad-budget')+")?0:raw(routes.map(r=>({id:r.id,a:r.from,b:r.to,length:r.length,color:'gray'})),routes.map(r=>r.id))")+"};}\n";
const rows=[];
try{
 for(const mode of ['bad-small','bad-budget','correct']){
  const file=join(folder,mode+'.mjs');writeFileSync(file,owner(mode));const run=spawnSync(process.execPath,['tools/polish-check.mjs','compare','--owner',file],{encoding:'utf8',timeout:210000,maxBuffer:4*1024*1024});
  assert.equal(run.signal,null,mode+' should close naturally');const output=run.stdout.trim().split('\n').filter(Boolean).map(JSON.parse);
  writeFileSync('test-output/review-compare-'+mode+'.log',run.stdout+run.stderr);
  if(mode==='correct'){assert.equal(run.status,0,run.stderr);assert.equal(output.length,2);assert.equal(output[0].cases,300);assert.equal(output[1].setsCompared,1000);assert.ok(output.every(x=>x.valueMismatches===0));}
  else{assert.notEqual(run.status,0,mode+' must fail');assert.match(run.stderr,/comparison failed/);assert.ok(output.at(-1).valueMismatches>0);if(mode==='bad-budget'){assert.equal(output[0].valueMismatches,0);assert.equal(output[1].setsCompared,1000);}}
  rows.push({mode,actualCLIStatus:run.status,naturallyClosed:true,output:output.map(({check,cases,setsCompared,valueMismatches})=>({check,cases,setsCompared,valueMismatches}))});
 }
 const py=spawnSync('python3',['tests/reopen-control.py'],{encoding:'utf8',timeout:30000});assert.equal(py.signal,null);assert.equal(py.status,0,py.stderr);
 writeFileSync('test-output/review-reopen.log',py.stdout+py.stderr);rows.push({mode:'reopen-HTTP-component',...JSON.parse(py.stdout)});
}finally{rmSync(folder,{recursive:true,force:true});}
assert.equal(readdirSync(tmpdir()).includes(folder.split('/').at(-1)),false);
console.log(JSON.stringify({passed:true,actualCLIControls:3,actualHTTPControls:5,temporaryOwnedControllersClosed:true,scope:'Correctness checks only; no new performance claim or live fourteen-source research pass.',rows}));
