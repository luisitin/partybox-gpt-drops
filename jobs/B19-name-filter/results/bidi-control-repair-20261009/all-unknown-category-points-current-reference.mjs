import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {nameFilter} from '/tmp/B19-root-checkpoint-20261009/jobs/B19-name-filter/dist/nameFilter.js';
import {createReference} from '/tmp/B19-root-checkpoint-20261009/jobs/B19-name-filter/tests/independent-unicode-20261009/reference.mjs';
const job='/tmp/B19-root-checkpoint-20261009/jobs/B19-name-filter';
const output='/tmp/B19-new-reference-unknown-category-exhaustive-20261009';
mkdirSync(output,{recursive:true});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const files=[import.meta.filename,process.execPath,`${job}/nameFilter.ts`,`${job}/dist/nameFilter.js`,`${job}/tests/independent-unicode-20261009/reference.mjs`,`${job}/tests/independent-unicode-20261009/seal.json`,`${job}/data/policy.json`];
const snapshot=()=>files.map(path=>{const bytes=readFileSync(path);return {path,bytes:bytes.length,sha256:hash(bytes)};});
const before=snapshot();
const oracle=createReference(JSON.parse(readFileSync(`${job}/data/policy.json`)));
const groups=[['Cn',/^\p{Cn}$/u],['Co',/^\p{Co}$/u]];
const report={status:'RUNNING',startedAt:new Date().toISOString(),timed:false,unicode:process.versions.unicode,before,categories:[],disagreements:[],scope:'Every Unicode Cn/Co code point in the exact an+point+al context that exposed the old independent-oracle discrepancy. Explicit unknown-category barrier expectation is ok. This is not a performance test or all-context Unicode proof.'};
for(const [category,pattern] of groups){
 let cases=0,productionPassed=0,independentPassed=0;
 for(let scalar=0;scalar<=0x10ffff;scalar++){
  const c=String.fromCodePoint(scalar);
  if(!pattern.test(c))continue;
  cases++;const input='an'+c+'al';const p=nameFilter(input),o=oracle.nameFilter(input);
  if(p.ok)productionPassed++;if(o.ok)independentPassed++;
  if(!p.ok||!o.ok)report.disagreements.push({category,scalar,input,production:p,independentReference:o});
 }
 report.categories.push({category,cases,productionPassed,independentPassed});
}
report.after=snapshot();report.guardsUnchanged=JSON.stringify(before)===JSON.stringify(report.after);report.finishedAt=new Date().toISOString();
report.status=report.guardsUnchanged&&report.disagreements.length===0?'PASS':'FAIL';
writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,startedAt:report.startedAt,finishedAt:report.finishedAt,categories:report.categories,disagreements:report.disagreements.length,guardsUnchanged:report.guardsUnchanged}));
process.exitCode=report.status==='PASS'?0:1;
