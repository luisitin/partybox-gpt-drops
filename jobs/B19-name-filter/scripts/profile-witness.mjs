// Bounded, instrumented diagnostic only. This never runs or replaces npm test.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance, PerformanceObserver} from 'node:perf_hooks';
import {Session} from 'node:inspector';
import {promisify} from 'node:util';
import {setImmediate as immediate} from 'node:timers/promises';

const directory = 'reports/latest/resume-witness-diagnostic';
mkdirSync(directory, {recursive:true});
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const guarded = ['nameFilter.ts','dist/nameFilter.js','tests/run.mjs','tests/blind/reference.mjs','data/policy.json','scripts/profile-witness.mjs'];
const guards = () => Object.fromEntries(guarded.map(file=>[file,digest(file)]));
const sourceStart = guards();
const runtime = readFileSync('dist/nameFilter.js','utf8');
const production = await import('../dist/nameFilter.js');
// Exposing private stages in a separate diagnostic module does not modify the
// actual runtime file or production calls sampled below.
const stages = await import('data:text/javascript;base64,'+Buffer.from(runtime+'\nexport {SIMPLE_ASCII, lower, SAFE, BAD, TERMS, pattern};\n').toString('base64'));
const input = 'kde';
const hostedWitness = {commit:'04f8ece5072e5952a2668af20f88202e8361b1d9',runId:37674003845,jobId:112972678278,seed:1,index:1504,input,observedMs:0.089284000000589};
const eligible = stages.TERMS.filter(term=>term.length<=input.length);
const bounded = new RegExp(stages.pattern(eligible)+'|'+stages.pattern(eligible.map(term=>[...term].reverse().join(''))));
const gc = [];
const observer = new PerformanceObserver(list=>{for(const event of list.getEntries())gc.push({startMs:event.startTime,durationMs:event.duration,kind:event.detail?.kind});});
observer.observe({entryTypes:['gc']});
let sink=0;
function loop(label, fn, calls=500000) {
 const start=performance.now();
 for(let i=0;i<calls;i++)sink+=fn()?1:0;
 const end=performance.now();
 return {label,calls,startMs:start,endMs:end,totalMs:end-start,meanMs:(end-start)/calls};
}
const costs=[];
for(let round=0;round<3;round++) {
 for(const [label,fn] of [
  ['loop-control',()=>false],
  ['ASCII-guard',()=>stages.SIMPLE_ASCII.test(input)],
  ['lowercase',()=>stages.lower(input)==='kde'],
  ['exception-lookup',()=>stages.SAFE.has(input)],
  ['full-matcher',()=>stages.BAD.test(input)],
  ['length-eligible-matcher',()=>bounded.test(input)],
  ['unchanged-production',()=>production.nameFilter(input).ok],
 ]) costs.push({round,...loop(label,fn)});
}
function individual(label, fn) {
 const observations=[];
 for(let i=0;i<100000;i++)sink+=fn()?1:0;
 for(let index=0;index<10000;index++) {
  const start=performance.now();sink+=fn()?1:0;
  observations.push({index,startMs:start,durationMs:performance.now()-start});
 }
 return {label,observations};
}
const individualCalls=[individual('timer-and-loop-control',()=>true),individual('unchanged-production',()=>production.nameFilter(input).ok)];
const session=new Session();session.connect();
const post=promisify(session.post.bind(session));
await post('Profiler.enable');await post('Profiler.setSamplingInterval',{interval:500});
await post('Profiler.start');
const profiled=loop('unchanged-production-inspector-profile',()=>production.nameFilter(input).ok,3000000);
const {profile}=await post('Profiler.stop');session.disconnect();
writeFileSync(directory+'/witness.cpuprofile',JSON.stringify(profile)+'\n');
await immediate();await immediate();observer.disconnect();
// Exhaust all short ASCII words for this candidate matcher against the current
// matcher. This is supplemental diagnostic evidence, not blind independence.
let candidateCases=0,candidateDisagreements=0;
for(let a=97;a<=122;a++)for(let b=97;b<=122;b++)for(let c=97;c<=122;c++) {
 const word=String.fromCharCode(a,b,c);candidateCases++;
 if(stages.BAD.test(word)!==bounded.test(word))candidateDisagreements++;
}
const sourceEnd=guards();
const report={kind:'instrumented-nonacceptance-diagnostic',createdAt:new Date().toISOString(),environment:{node:process.version,unicode:process.versions.unicode},hostedWitness,sourceStart,sourceEnd,unchanged:JSON.stringify(sourceStart)===JSON.stringify(sourceEnd),costs,individualCalls,gc,profiled,profileFile:'witness.cpuprofile',matcher:{fullForwardTerms:stages.TERMS.length,eligibleForwardTerms:eligible.length,candidateCases,candidateDisagreements},sink,limitations:['All timings are diagnostic and instrumented; none certify the literal acceptance gate.','Stage loops use a fixed witness, not the full acceptance input mix.','GC events and sampled CPU frames do not prove the historical hosted outlier cause.','Length eligibility omits only patterns whose minimum input length exceeds mapped text length; this has not yet changed production.']};
writeFileSync(directory+'/report.json',JSON.stringify(report,null,2)+'\n');
const frames=profile.nodes.filter(n=>n.hitCount).sort((a,b)=>b.hitCount-a.hitCount).slice(0,12).map(n=>({functionName:n.callFrame.functionName,url:n.callFrame.url.slice(0,130),hits:n.hitCount}));
console.log(JSON.stringify({kind:report.kind,pid:process.pid,createdAt:report.createdAt,unchanged:report.unchanged,costs,matcher:report.matcher,gcEvents:gc.length,frames}));
if(!report.unchanged || candidateDisagreements)process.exitCode=1;
