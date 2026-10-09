import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {nameFilter,isAllowedName} from '/workspace/partybox-gpt-drops-B19-finish/jobs/B19-name-filter/dist/nameFilter.js';
import {reference} from '/workspace/partybox-gpt-drops-B19-finish/jobs/B19-name-filter/dist/tests/reference.js';
import {createReference} from '/tmp/B19-independent-reference-20261009/reference.mjs';
import {fixed,mappingCases,makeObfuscations,makeFuzz,knownCases,rangeCases,lengthBoundaryCases,addedNameCases} from '/workspace/partybox-gpt-drops-B19-finish/.work/B19-ASCII-mapping-candidate/original-workload-declarations.mjs';
const job='/workspace/partybox-gpt-drops-B19-finish/jobs/B19-name-filter';
const output='/tmp/B19-new-reference-original-preflight-20261009';
mkdirSync(output,{recursive:true});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const guarded=[import.meta.filename,process.execPath,`${job}/nameFilter.ts`,`${job}/dist/nameFilter.js`,`${job}/tests/reference.ts`,`${job}/dist/tests/reference.js`,`${job}/tests/run.mjs`,`${job}/tests/blind/reference.mjs`,`${job}/data/policy.json`,`${job}/data/original-workload-policy.json`,'/tmp/B19-independent-reference-20261009/reference.mjs','/tmp/B19-independent-reference-20261009/seal.json','/workspace/partybox-gpt-drops-B19-finish/.work/B19-ASCII-mapping-candidate/original-workload-declarations.mjs',...['names','words','places'].map(group=>`${job}/data/cache/${group}.json`)];
const snapshot=()=>guarded.map(path=>{const b=readFileSync(path);return {path,bytes:b.length,sha256:sha(b)};});
const before=snapshot();
const policy=JSON.parse(readFileSync(`${job}/data/policy.json`));
const blind=createReference(policy);
const corpora=Object.fromEntries(['names','words','places'].map(group=>[group,JSON.parse(readFileSync(`${job}/data/cache/${group}.json`))]));
const label=x=>x.ok?'ok':x.reason;
const report={status:'RUNNING',startedAt:new Date().toISOString(),timed:false,before,suites:[],disagreements:[],limitations:['Untimed functional comparison only; original benchmark and mutation command are not executed by this helper.','Expected current production disagreement on three newly interpreted Unicode Bidi_Control points is retained, not waived.']};
function compare(name,rows,seed){
 let agreements=0,nfaAgreements=0,frozen=0,wrapper=0;
 for(let i=0;i<rows.length;i++){
  const input=rows[i].input;
  const p=nameFilter(input),b=blind.nameFilter(input),r=reference(input);
  const actual=label(p),expected=label(b),nfa=label(r);
  if(actual===expected)agreements++;
  else report.disagreements.push({name,seed,index:i,input:typeof input==='string'?input:String(input),points:typeof input==='string'?Array.from(input,c=>c.codePointAt(0)):null,production:actual,newIndependentReference:expected,historicalNFA:nfa});
  if(nfa===expected)nfaAgreements++;
  if(Object.isFrozen(p)&&Object.isFrozen(b))frozen++;
  if(isAllowedName(input)===(actual==='ok')&&blind.isAllowedName(input)===(expected==='ok'))wrapper++;
 }
 report.suites.push({name,seed,cases:rows.length,productionAgreements:agreements,historicalNFAAgreements:nfaAgreements,bothResultsFrozen:frozen,wrapperAgreements:wrapper});
}
for(const seed of [1,2,3]){
 const generated=makeObfuscations(seed);
 const all=[...fixed,...mappingCases,...generated.rows,...makeFuzz(seed),...Object.values(corpora).flat().map(row=>({input:row.name}))];
 if(all.length!==43830)throw new Error(`Original corpus count changed: ${all.length}`);
 compare('every-original-43830-input',all,seed);
 compare('existing-supplemental-cases',[...addedNameCases,...knownCases,...rangeCases,...lengthBoundaryCases],seed);
}
const bidi=[0x061c,0x200e,0x200f,0x202a,0x202b,0x202c,0x202d,0x202e,0x2066,0x2067,0x2068,0x2069];
const controls=bidi.flatMap(n=>{const c=String.fromCodePoint(n);return [c,'Alice'+c,c+'Alice','an'+c+'al','s'+c+'ex','analysis'+c,c.repeat(16),c.repeat(17)].map(input=>({input}));});
compare('all-twelve-bidi-controls-and-original-length-precedence',controls,null);
const after=snapshot();report.after=after;report.guardsUnchanged=JSON.stringify(before)===JSON.stringify(after);report.finishedAt=new Date().toISOString();
report.status=report.guardsUnchanged&&report.disagreements.length===0?'PASS':'FAIL';
writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,startedAt:report.startedAt,finishedAt:report.finishedAt,suites:report.suites,disagreements:report.disagreements.length,guardsUnchanged:report.guardsUnchanged}));
process.exitCode=report.status==='PASS'?0:1;
