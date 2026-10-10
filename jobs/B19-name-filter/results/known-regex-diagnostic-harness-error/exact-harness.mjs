// Private-candidate investigation only; never changes or certifies production.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {performance,PerformanceObserver} from 'node:perf_hooks';
import {setImmediate as immediate} from 'node:timers/promises';
import {nameFilter} from '../dist/nameFilter.js';
import {createReference} from '../tests/blind/reference.mjs';
const scan=process.argv.includes('--scan');
const balanced=process.argv.includes('--balanced');
const lazy=process.argv.includes('--lazy');
const knownRegex=process.argv.includes('--known-regex');
const out=knownRegex?'reports/latest/known-plain-regex-diagnostic':lazy?'reports/latest/known-plain-lazy-diagnostic':balanced?'reports/latest/ascii-scan-balanced-diagnostic':scan?'reports/latest/ascii-scan-allocation-diagnostic':'reports/latest/ascii-allocation-diagnostic';mkdirSync(out,{recursive:true});
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const guarded=['nameFilter.ts','dist/nameFilter.js','tests/run.mjs','tests/blind/reference.mjs','scripts/profile-ascii-allocation.mjs'];
const guards=()=>Object.fromEntries(guarded.map(p=>[p,hash(p)]));
const sourceStart=guards();
let candidateSource=readFileSync('dist/nameFilter.js','utf8');
if(knownRegex){
 const anchor='function knownPlain(input) {';
 if(candidateSource.split(anchor).length!==2)throw Error('Known-plain anchor must be unique');
 const addition="const UNCHANGED_KNOWN = new RegExp('^[\\\\x00-\\\\x7f'+[...KNOWN].filter(([character, entry])=>character.length===1&&entry.plain===character).map(([character])=>'\\\\u'+character.charCodeAt(0).toString(16).padStart(4,'0')).join('')+']*$');\n";
 candidateSource=candidateSource.replace(anchor,addition+anchor+'\n if(UNCHANGED_KNOWN.test(input))return input;');
}else if(lazy){
 const begin=candidateSource.indexOf('function knownPlain(input) {');
 const end=candidateSource.indexOf('function hasContent(plain) {',begin);
 if(begin<0||end<0)throw Error('Known-plain candidate anchors absent');
 candidateSource=candidateSource.slice(0,begin)+`function knownPlain(input) {
 let plain; let offset=0;
 for(const character of input) {
  const entry=character<='\\x7f'?undefined:KNOWN.get(character);
  if(character>'\\x7f'&&entry===undefined)return undefined;
  const replacement=entry===undefined?character:entry.plain;
  if(plain!==undefined)plain+=replacement;
  else if(replacement!==character)plain=input.slice(0,offset)+replacement;
  offset+=character.length;
 }
 return plain===undefined?input:plain;
}
`+candidateSource.slice(end);
}else for(const [from,to] of [
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
const inputs=[...corpora,...obfuscations,'kde','Scunthorpe','KDE','LANA','s中ex',...(lazy||knownRegex?['A961п']:[])];
const contextual=[];
if(lazy||knownRegex){
 const characters=new Set([...policy.groups.flatMap(([,group])=>[...group]),...'\u00ad\u034f\u061c\u180e\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\ufeff']);
 for(const c of [...characters]){characters.add(c.toUpperCase());characters.add(c.toLowerCase());}
 for(let i=0xc0;i<=0xff;i++)characters.add(String.fromCharCode(i));
 for(let i=0xff01;i<=0xff5e;i++)characters.add(String.fromCharCode(i));
 for(const c of characters)for(const value of [c,'a'+c,c+'a','s'+c+'ex','se'+c+'x','Σ'+c+'A','A'+c+'Σ','AΣ'+c,'ſ'+c+'ex'])contextual.push(value);
 contextual.push('ﬃ'.repeat(16),'s\u200bex','Σ\u200bA','AΣ\u200b');
}
let cases=0,disagreements=0;
for(const input of [...inputs,...contextual]){cases++;const expected=blind(input),actual=candidate.nameFilter(input);if(actual.ok!==expected.ok||actual.reason!==expected.reason)disagreements++;}
const gc=[];const observer=new PerformanceObserver(list=>{for(const e of list.getEntries())gc.push({startMs:e.startTime,durationMs:e.duration});});observer.observe({entryTypes:['gc']});
const phases=[];let sink=0;
for(const [workload,rows] of [['hosted-witness',[lazy||knownRegex?'A961п':'kde']],['mixed-original-corpora-and-obfuscations',inputs]]){
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
const report={kind:'instrumented-private-candidate-nonacceptance',createdAt:new Date().toISOString(),environment:{node:process.version,unicode:process.versions.unicode},sourceStart,sourceEnd,candidateSha256,balancedOrder:balanced,candidateChange:knownRegex?'Policy-derived regexp proves all known plain replacements unchanged before returning original input; original builder/contextual folding/fallback retained.':lazy?'Known-character plain strings allocate only on first changed replacement; unchanged strings preserve original input, full contextual folding/fallback retained.':scan?'Single allocation-free ASCII letter/case scan; whole-string folding retained for all other cases.':'General already-lowercaseASCII proof avoids unconditional lowercase string allocation; other inputs retain whole-string folding.',cases,disagreements,phases,gc,sink,unchanged:JSON.stringify(sourceStart)===JSON.stringify(sourceEnd),limitations:['GC phase overlap is diagnostic association, not proof of any historical outlier cause.','Fixed/mixed loops and instrumentation do not replace the unchanged per-call acceptance workload.','Candidate is a separate module and has not changed production.']};
writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({kind:report.kind,createdAt:report.createdAt,cases,disagreements,unchanged:report.unchanged,phases}));
if(!report.unchanged||disagreements)process.exitCode=1;
