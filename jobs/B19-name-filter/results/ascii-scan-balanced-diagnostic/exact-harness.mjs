// Private-candidate investigation only; never changes or certifies production.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance,PerformanceObserver} from 'node:perf_hooks';
import {setImmediate as immediate} from 'node:timers/promises';
import {nameFilter} from '../dist/nameFilter.js';
import {createReference} from '../tests/blind/reference.mjs';
const scan=process.argv.includes('--scan');
const balanced=process.argv.includes('--balanced');
const out=balanced?'reports/latest/ascii-scan-balanced-diagnostic':scan?'reports/latest/ascii-scan-allocation-diagnostic':'reports/latest/ascii-allocation-diagnostic';mkdirSync(out,{recursive:true});
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const guarded=['nameFilter.ts','dist/nameFilter.js','tests/run.mjs','tests/blind/reference.mjs','scripts/profile-ascii-allocation.mjs'];
const guards=()=>Object.fromEntries(guarded.map(p=>[p,hash(p)]));
const sourceStart=guards();
let candidateSource=readFileSync('dist/nameFilter.js','utf8');
for(const [from,to] of [
 ['const simple = SIMPLE_ASCII.test(input);',scan?'const wordKind = asciiWordKind(input); const simple = wordKind !== 0;':'const alreadyLower = WORD.test(input); const simple = alreadyLower || SIMPLE_ASCII.test(input);'],
 ['let plain = ascii ? lower(input)',scan?'let plain = ascii ? (wordKind === 1 ? input : lower(input))':'let plain = ascii ? (alreadyLower ? input : lower(input))'],
]){if(candidateSource.split(from).length!==2)throw Error('Candidate anchor must be unique');candidateSource=candidateSource.replace(from,to);}
if(scan)candidateSource+='\nfunction asciiWordKind(input) { if(input.length===0)return 0; let kind=1; for(let i=0;i<input.length;i++){const code=input.charCodeAt(i);if(code>=97&&code<=122)continue;if(code>=65&&code<=90){kind=2;continue;}return 0;}return kind;}\n';
const candidateSha256=createHash('sha256').update(candidateSource).digest('hex');
const candidate=await import('data:text/javascript;base64,'+Buffer.from(candidateSource).toString('base64'));
writeFileSync(out+'/private-candidate.js',candidateSource);
const policy=JSON.parse(readFileSync('data/policy.json','utf8'));
const blind=createReference(policy).nameFilter;
const corpora=['names','words','places'].flatMap(p=>JSON.parse(readFileSync(`data/cache/${p}.json`,'utf8')).map(v=>v.name));
const obfuscations=readFileSync('results/resume-length-pruning/obfuscations-seed1.jsonl','utf8').trim().split('\n').map(v=>JSON.parse(v).input);
const inputs=[...corpora,...obfuscations,'kde','Scunthorpe','KDE','LANA','s中ex'];
let cases=0,disagreements=0;
for(const input of inputs){cases++;const expected=blind(input),actual=candidate.nameFilter(input);if(actual.ok!==expected.ok||actual.reason!==expected.reason)disagreements++;}
const gc=[];const observer=new PerformanceObserver(list=>{for(const e of list.getEntries())gc.push({startMs:e.startTime,durationMs:e.duration});});observer.observe({entryTypes:['gc']});
const phases=[];let sink=0;
for(const [workload,rows] of [['hosted-witness',['kde']],['mixed-original-corpora-and-obfuscations',inputs]]){
 for(const [variant,fn] of [['baseline',nameFilter],['candidate',candidate.nameFilter]])for(let i=0;i<100000;i++)sink+=fn(rows[i%rows.length]).ok?1:0;
 for(let round=0;round<3;round++)for(const [variant,fn] of (balanced&&round%2? [['candidate',candidate.nameFilter],['baseline',nameFilter]]:[['baseline',nameFilter],['candidate',candidate.nameFilter]])){
  const startMs=performance.now();
  for(let i=0;i<500000;i++)sink+=fn(rows[i%rows.length]).ok?1:0;
  const endMs=performance.now();
  await immediate();await immediate();
  const events=gc.filter(e=>e.startMs>=startMs&&e.startMs<endMs);
  phases.push({workload,round,variant,calls:500000,startMs,endMs,totalMs:endMs-startMs,meanMs:(endMs-startMs)/500000,gcEvents:events.length,gcDurationMs:events.reduce((sum,e)=>sum+e.durationMs,0)});
 }
}
observer.disconnect();
const sourceEnd=guards();
const report={kind:'instrumented-private-candidate-nonacceptance',createdAt:new Date().toISOString(),environment:{node:process.version,unicode:process.versions.unicode},sourceStart,sourceEnd,candidateSha256,balancedOrder:balanced,candidateChange:scan?'Single allocation-free ASCII letter/case scan; whole-string folding retained for all other cases.':'General already-lowercaseASCII proof avoids unconditional lowercase string allocation; other inputs retain whole-string folding.',cases,disagreements,phases,gc,sink,unchanged:JSON.stringify(sourceStart)===JSON.stringify(sourceEnd),limitations:['GC phase overlap is diagnostic association, not proof of any historical outlier cause.','Fixed/mixed loops and instrumentation do not replace the unchanged per-call acceptance workload.','Candidate is a separate module and has not changed production.']};
writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({kind:report.kind,createdAt:report.createdAt,cases,disagreements,unchanged:report.unchanged,phases}));
if(!report.unchanged||disagreements)process.exitCode=1;
