import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {withReportSession} from './report-session.mjs';

const root=path.resolve('.verification','report-session-selfcheck-'+crypto.randomUUID());
fs.mkdirSync(path.join(root,'reports/historical'),{recursive:true});
const original=Buffer.from('Sealed original report bytes\n'),historical=Buffer.from([0,1,2,255]);
fs.writeFileSync(path.join(root,'reports/summary.json'),original);
fs.writeFileSync(path.join(root,'reports/historical/source.bin'),historical);
let assertions=0;
const same=(a,b)=>{assert.deepEqual(a,b);assertions++;};
const assertRestored=()=>{
 same(fs.readFileSync(path.join(root,'reports/summary.json')),original);
 same(fs.readFileSync(path.join(root,'reports/historical/source.bin')),historical);
 same(fs.existsSync(path.join(root,'reports/generated.json')),false);
 same(fs.existsSync(path.join(root,'.verification/report-session.lock')),false);
};
const writeAndExit=(marker,code,signal=null)=>{
 const script=`const fs=require('node:fs');fs.writeFileSync('reports/summary.json',${JSON.stringify(marker)});fs.writeFileSync('reports/generated.json','new output');${signal?`process.kill(process.pid,${JSON.stringify(signal)});`:`process.exit(${code});`}`;
 const result=spawnSync(process.execPath,['-e',script],{cwd:root,encoding:'utf8',timeout:10000});
 assert.equal(result.error,undefined);
 return {code:result.status??143,signal:result.signal};
};
const records=[];
for(const marker of ['first actual invocation','second actual invocation']){
 const session=await withReportSession(root,()=>writeAndExit(marker,0));
 same(session.result.code,0);assertRestored();
 same(fs.readFileSync(path.join(session.latest,'summary.json'),'utf8'),marker);
 const receipt=JSON.parse(fs.readFileSync(path.join(session.latest,'report-session.json'),'utf8'));
 same(receipt.passed,true);same(receipt.originalHashes,receipt.restoredOriginalHashes);
 records.push({name:marker,code:session.result.code,passed:receipt.passed});
}
for(const [marker,code,signal] of [['failed actual child',7,null],['terminated actual child',143,'SIGTERM']]){
 const session=await withReportSession(root,()=>writeAndExit(marker,code,signal));
 same(session.result.code,code);assertRestored();
 const receipt=JSON.parse(fs.readFileSync(path.join(session.latest,'report-session.json'),'utf8'));
 same(receipt.passed,false);same(receipt.originalHashes,receipt.restoredOriginalHashes);
 same(fs.readFileSync(path.join(session.latest,'summary.json'),'utf8'),marker);
 records.push({name:marker,code:session.result.code,signal:session.result.signal,passed:receipt.passed});
}
await assert.rejects(withReportSession(root,()=>{
 fs.writeFileSync(path.join(root,'reports/summary.json'),'partial before thrown failure');
 throw new Error('controlled exception after report write');
}),/controlled exception after report write/);assertions++;
assertRestored();
let receipt=JSON.parse(fs.readFileSync(path.join(root,'.verification/full-run-reports/latest/report-session.json'),'utf8'));
same(receipt.passed,false);same(receipt.originalHashes,receipt.restoredOriginalHashes);
records.push({name:'thrown exception',passed:receipt.passed});
await assert.rejects(withReportSession(root,()=>{
 const result=spawnSync(path.join(root,'genuinely-missing-executable'),[],{cwd:root,timeout:10000});
 assert.ok(result.error);throw result.error;
}),/ENOENT/);assertions++;
assertRestored();
receipt=JSON.parse(fs.readFileSync(path.join(root,'.verification/full-run-reports/latest/report-session.json'),'utf8'));
same(receipt.passed,false);same(receipt.originalHashes,receipt.restoredOriginalHashes);
records.push({name:'actual missing executable',passed:receipt.passed});
same(fs.readdirSync(path.join(root,'.verification/full-run-reports/invocations')).length,6);
const report={passed:true,assertions,successfulInvocations:2,failedInvocations:4,records,syntheticReportTransportOnly:true,description:'Actual child exits, SIGTERM, exception and ENOENT exercise the production report-session helper; no solver semantic count is claimed by these fixtures.'};
fs.writeFileSync('reports/report-session-selfcheck.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({reportSessionSelfcheck:report}));
