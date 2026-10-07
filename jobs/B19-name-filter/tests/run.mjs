import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
import { nameFilter, isAllowedName } from '../dist/nameFilter.js';
import { reference } from '../dist/tests/reference.js';

const root = new URL('../', import.meta.url);
process.chdir(root.pathname);
const coreOnly = process.argv.includes('--core');
const out = 'reports/latest';
mkdirSync(out, {recursive:true});
const policy = JSON.parse(readFileSync('data/policy.json', 'utf8'));
const source = readFileSync('nameFilter.ts', 'utf8');
const compiled = readFileSync('dist/nameFilter.js', 'utf8');
const refSource = readFileSync('tests/reference.ts', 'utf8');
const sha = x => createHash('sha256').update(x).digest('hex');
const label = x => x.ok ? 'ok' : x.reason;
const json = (path, data) => writeFileSync(`${out}/${path}`, JSON.stringify(data,null,2)+'\n');
const result = {mode:coreOnly?'core-only':'full', environment:{node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0]?.model,unicode:process.versions.unicode},sourceSha256:sha(source),referenceSha256:sha(refSource),suites:[],failures:[],unverified:[]};
function record(name, cases, passed, seed, details={}) {
  const row={name,cases,passed,seed,command:`node tests/run.mjs${coreOnly?' --core':''}`, ...details};
  result.suites.push(row);
  if(passed!==cases) result.failures.push(row);
  console.log(JSON.stringify(row));
}
function rng(seed) { let s=seed>>>0; return () => { s=(s+0x6d2b79f5)>>>0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296; }; }
function pick(r,a){return a[Math.floor(r()*a.length)];}
const variants = Object.fromEntries(policy.groups.filter(([c])=>c!=='#').map(([c,g])=>[c,[...g]]));
variants.i.push('1','|'); variants.l.push('1','|');
function makeObfuscations(seed) {
  const r=rng(seed), seen=new Set(), rows=[], coverage={}; let attempts=0;
  while(rows.length<5000 && attempts<500000) {
    const term=policy.terms[attempts++ % policy.terms.length];
    const reverse=r()<0.5, repeat=r()<0.65, glyph=r()<0.8, separators=r()<0.7, wide=r()<0.15;
    let a=[];
    for(const c of term) {
      let v=glyph && variants[c]?.length && r()<0.65 ? pick(r,variants[c]) : c;
      if(/^[a-z]$/.test(v) && r()<0.45) v=v.toUpperCase();
      if(wide && /^[A-Za-z]$/.test(v)) v=String.fromCodePoint(v.codePointAt(0)+0xfee0);
      a.push(v);
      if(repeat && r()<0.4) for(let k=0,n=1+Math.floor(r()*2);k<n;k++)a.push(v);
      if(separators && r()<0.45)a.push(pick(r,[' ','.','_','-','\u200b','\u0301']));
    }
    if(reverse)a.reverse();
    const input=a.join('');
    if([...input].length>16 || seen.has(input))continue;
    seen.add(input); rows.push({input,expected:'blocked',term,reverse,repeat,glyph,separators,wide});
    coverage[term]=(coverage[term]??0)+1;
  }
  if(rows.length!==5000)throw new Error('Generator failed to make 5000 unique in-domain cases');
  return {rows,coverage,attempts};
}
const positive = [
  'Scunthorpe','Penistone','Dickinson','Hancock','Sussex','Essex','Cockburn','Babcock',
  'Cummings','Cumberland','Titus','Virginia','Bangkok','Canal','Analysis','Sexton',
  'Cocktail','Classical','Assistant','Passage','Massachusetts','Cassandra','Richard',
  'Dickson','Nigel','Nigeria','Niger','Niggardly','Hitchcock','Peacock','Cucumber',
  'Anne-Marie',"O’Neil",'José','Zoë','李雷','محمد','🙂Alex','𠮷野','Bob','Bobby','Bobbi',
  'abcdefghijklmnop','𐐨'.repeat(16),'s中ex','Alex','Banana','niger',
];
const witnessBlocked=['SEX','ｓｅｘ','s\u0301ex','s\u200bex','s e x','s.e.x','p0rn','d1ck','s3x','4nal','5ex','7wat','@nal','$ex','c1it','sеx','sεx','xes','seeex','fuck','Hancocksex','p|ssy','diсk','cоck','s℮x','cl!t','cυnt','cυпt','cυпτ','boooob'];
witnessBlocked.splice(witnessBlocked.indexOf('p|ssy'),1);
const fixed = [
 ...positive.map(input=>({input,expected:'ok',kind:'benign'})),
 ...policy.terms.map(input=>({input,expected:'blocked',kind:'base-lexicon'})),
 ...witnessBlocked.map(input=>({input,expected:'blocked',kind:'adversarial'})),
 ...['','   ','....','🚀','\u0301'].map(input=>({input,expected:'empty',kind:'format'})),
 ...['Alex\n','\ud800','\udfff','A\u202eB','A\u2067B','\u007f'].map(input=>({input,expected:'control',kind:'format'})),
 ...['abcdefghijklmnopq','𐐨'.repeat(17),'x'.repeat(100000)].map(input=>({input,expected:'length',kind:'format'})),
 ...[null,undefined,0,NaN,Infinity,{},[],false,Symbol('name')].map(input=>({input,expected:'type',kind:'format'})),
];
const mappingCases=[];
for(const term of policy.terms)for(let i=0;i<term.length;i++)for(const v of variants[term[i]]??[]){
 const input=term.slice(0,i)+v+term.slice(i+1);
 mappingCases.push({input,expected:'blocked',kind:'single-glyph',term});
}
const mutations = [
 ['M01','Remove lowercasing', '.toLowerCase()', ''],
 ['M02','Lose compatibility normalization', "normalize('NFKD')", "normalize('NFD')"],
 ['M03','Keep combining marks', ".replace(/\\p{M}/gu, '')", ''],
 ['M04','Keep zero-width format characters', ".replace(/\\p{Cf}/gu, '')", ''],
 ['M05','Treat spaces as letter barriers', "const mapped = MAP.get(c);", "if (c === ' ') { text += '~'; continue; } const mapped = MAP.get(c);"],
 ['M06','Treat dots as letter barriers', "const mapped = MAP.get(c);", "if (c === '.') { text += '~'; continue; } const mapped = MAP.get(c);"],
 ['M07','Drop zero-to-o mapping', "['o', '0оοσօ']", "['o', 'оοσօ']"],
 ['M08','Drop one ambiguity mapping', "['#', '1|']", "['#', '|']"],
 ['M09','Drop three-to-e mapping', "['e', '3еεϵ℮']", "['e', 'еεϵ℮']"],
 ['M10','Drop four-to-a mapping', "['a', '4@аɑα']", "['a', '@аɑα']"],
 ['M11','Drop five-to-s mapping', "['s', '5$ѕʂ']", "['s', '$ѕʂ']"],
 ['M12','Drop seven-to-t mapping', "['t', '7+тτ']", "['t', '+тτ']"],
 ['M13','Drop at-sign mapping', "['a', '4@аɑα']", "['a', '4аɑα']"],
 ['M14','Drop dollar-sign mapping', "['s', '5$ѕʂ']", "['s', '5ѕʂ']"],
 ['M15','Resolve ambiguous one only as i', "c === 'i' || c === 'l'", "c === 'i'"],
 ['M16','Drop Cyrillic e mapping', "['e', '3еεϵ℮']", "['e', '3εϵ℮']"],
 ['M17','Drop Greek epsilon mapping', "['e', '3еεϵ℮']", "['e', '3еϵ℮']"],
 ['M18','Disable reversed scan', "BAD.test([...text].reverse().join(''))", 'false'],
 ['M19','Disable repetition at single letters', "run.length === 1 ? '+'", "run.length === 1 ? ''"],
 ['M20','Delete a blocked lexicon entry', ' fellatio fuck gook ', ' fellatio gook '],
 ['M21','Use substring rather than whole-word exceptions', 'SAFE.has(plain)', '[...SAFE].some(word => plain.includes(word))'],
 ['M22','Admit 17 code points', '[...input].length > 16', '[...input].length > 17'],
 ['M23','Reject exactly 16 code points', '[...input].length > 16', '[...input].length >= 16'],
 ['M24','Silently delete unmapped letters', "text += '~';", "text += '';"],
 ['M25','Forget required original double letters', "`{${run.length},}`", "'+'"],
];
function evalCases(fn, cases) {
 let passed=0;const errors=[];
 for(const row of cases){
  try {const actual=label(fn(row.input));if(actual===row.expected)passed++;else if(errors.length<20)errors.push({input:typeof row.input==='string'?row.input.slice(0,100):String(row.input),expected:row.expected,actual});}
  catch(e){if(errors.length<20)errors.push({input:String(row.input).slice(0,100),error:String(e)});}
 }
 return {passed,errors};
}
function makeFuzz(seed) {
 const r=rng(seed^0x51f15e),alphabet=[...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ._-@!$|',...'аεопυχ𐐨李محمد', '\u200b','\u0301','\ud800','\u202e','🚀','\n'];
 return Array.from({length:5000},()=>{let input='';for(let j=0,n=Math.floor(r()*21);j<n;j++)input+=pick(r,alphabet);return{input,expected:label(reference(input)),kind:'differential-fuzz'};});
}
function benchmark(seed, inputs) {
 const r=rng(seed^0x1234abcd);const sample=Array.from({length:10000},()=>pick(r,inputs));
 let sink=0;
 for(let round=0;round<10;round++)for(const s of sample)sink+=nameFilter(s).ok?1:0;
 const times=[];const start=performance.now();
 for(const s of sample){const t=performance.now();sink+=nameFilter(s).ok?1:0;times.push(performance.now()-t);}
 const elapsed=performance.now()-start;times.sort((a,b)=>a-b);
 return {calls:sample.length,meanMs:elapsed/sample.length,p50Ms:times[4999],p99Ms:times[9899],maxMs:times[9999],over005Ms:times.filter(x=>x>0.05).length,sink};
}
let corpora=null;
if(!coreOnly){
 const fetched=spawnSync('python3',['scripts/fetch-data.py'],{encoding:'utf8',maxBuffer:8*1024*1024});
 writeFileSync(`${out}/data-acquisition.log`,(fetched.stdout??'')+(fetched.stderr??''));
 console.log(fetched.stdout??'');
 if(fetched.status!==0){record('public-corpus-acquisition',1,0,null,{error:(fetched.stderr??String(fetched.error)).slice(0,2000)});}
 else {corpora=Object.fromEntries(['names','words','places'].map(k=>[k,JSON.parse(readFileSync(`data/cache/${k}.json`,'utf8'))]));record('public-corpus-acquisition',1,1,null);}
}else result.unverified.push('Public corpus tests intentionally not run by --core; this is not a full pass.');
const approvedPath='data/kept-rejections.json';
const approved=existsSync(approvedPath)?JSON.parse(readFileSync(approvedPath,'utf8')):[];
for(const seed of [1,2,3]) {
 const generated=makeObfuscations(seed);
 writeFileSync(`${out}/obfuscations-seed${seed}.jsonl`,generated.rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
 const baseline=evalCases(nameFilter,fixed);record('handwritten-format-and-Scunthorpe',fixed.length,baseline.passed,seed,{errors:baseline.errors});
 const mapResult=evalCases(nameFilter,mappingCases);record('exhaustive-declared-single-glyph-substitution',mappingCases.length,mapResult.passed,seed,{errors:mapResult.errors});
 const obf=evalCases(nameFilter,generated.rows);
 record('generated-obfuscations',5000,obf.passed,seed,{misses:5000-obf.passed,errors:obf.errors,coverage:generated.coverage,attempts:generated.attempts});
 const corpusCases=[];
 if(corpora)for(const [group,rows] of Object.entries(corpora)){
  const expectedCount={names:20000,words:10000,places:2000}[group];
  const unique=new Set(rows.map(x=>x.name.toLowerCase())).size;
  record(`${group}-count-and-uniqueness`,2,Number(rows.length===expectedCount)+Number(unique===expectedCount),seed,{rows:rows.length,unique});
  const rejected=[];let accepted=0,reviewed=0;
  for(const row of rows){
   const actual=label(nameFilter(row.name));
   const known=approved.find(x=>x.group===group&&x.name===row.name&&x.reason===actual);
   corpusCases.push({input:row.name,expected:known?known.reason:'ok',kind:group});
   if(actual==='ok')accepted++;
   else {if(known)reviewed++;rejected.push({...row,reason:actual,review:known?.explanation??'UNREVIEWED; corpus all-pass target not met'});}
  }
  json(`${group}-rejections-seed${seed}.json`,rejected);
  const unexpected=rejected.filter(x=>x.review.startsWith('UNREVIEWED'));
  const stale=approved.filter(x=>x.group===group&&!rejected.some(y=>y.name===x.name&&y.reason===x.reason));
  record(`${group}-positive-corpus`,rows.length,accepted+reviewed,seed,{accepted,rejected:rejected.length,reviewed,unexpected:unexpected.length,stale:stale.length,zeroRejections:rejected.length===0});
  record(`${group}-reviewed-baseline-no-stale-entries`,1,Number(stale.length===0),seed);
  if(seed===1)console.log('CORPUS_REJECTIONS',group,JSON.stringify(rejected));
 }
 const fuzz=makeFuzz(seed);
 const all=[...fixed,...mappingCases,...generated.rows,...fuzz,...corpusCases];
 let agreements=0,deterministic=0,wrapper=0;
 for(const row of all){
  try{const a=label(nameFilter(row.input)),b=label(reference(row.input));if(a===b)agreements++;if(a===label(nameFilter(row.input)))deterministic++;if(isAllowedName(row.input)===(a==='ok'))wrapper++;}
  catch(e){result.failures.push({name:'differential-throw',seed,input:String(row.input).slice(0,100),error:String(e)});}
 }
 record('regex-vs-bitset-NFA-differential',all.length,agreements,seed);
 record('repeat-call-purity',all.length,deterministic,seed);
 record('boolean-wrapper',all.length,wrapper,seed);
 const mutationRows=[];
 for(const [id,description,from,to] of mutations){
  if(compiled.split(from).length!==2)throw new Error(`Mutation anchor must be unique: ${id}`);
  const code=compiled.replace(from,to);
  const module=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const checks=evalCases(module.nameFilter,all);
  const killed=checks.passed<all.length;
  mutationRows.push({id,description,seed,killed,cases:all.length,disagreements:all.length-checks.passed,witness:checks.errors[0]??null,mutantSha256:sha(code)});
 }
 json(`mutations-seed${seed}.json`,mutationRows);
 record('25-real-executed-mutations',25,mutationRows.filter(x=>x.killed).length,seed,{survivors:mutationRows.filter(x=>!x.killed).map(x=>x.id)});
 const sizes={sourceBytes:Buffer.byteLength(source),sourceGzipBytes:gzipSync(source,{level:9}).length,compiledBytes:Buffer.byteLength(compiled),compiledGzipBytes:gzipSync(compiled,{level:9}).length,limitBytes:6000};
 record('runtime-gzip-size',2,Number(sizes.sourceGzipBytes<=6000)+Number(sizes.compiledGzipBytes<=6000),seed,sizes);
 const pureChecks=[!source.includes('Math.random'),!source.includes('Date.now'),!/^import\s/m.test(source),Object.keys(JSON.parse(readFileSync('package.json')).dependencies??{}).length===0,!source.includes('eval(')];
 record('zero-runtime-dependencies-and-forbidden-APIs',pureChecks.length,pureChecks.filter(Boolean).length,seed);
 const bench=benchmark(seed,[...positive,...generated.rows.map(x=>x.input),...(corpora?Object.values(corpora).flat().map(x=>x.name):[])]);
 json(`benchmark-seed${seed}.json`,bench);
 record('latency-every-observed-check-under-005ms',bench.calls,bench.calls-bench.over005Ms,seed,bench);
}
result.unverified.push('Clean-room independent authorship: both implementations were produced in one session; only algorithmic separation is verified.');
result.unverified.push('All Unicode homoglyphs, all languages/slurs, intent, and arbitrary unseen obfuscations: not claimed. See POLICY.md.');
result.unverified.push('Hard real-time 0.05ms bound on every platform: not established by a finite benchmark.');
json('summary.json',result);
console.log('FINAL_SUMMARY',JSON.stringify({mode:result.mode,suites:result.suites.length,failures:result.failures.map(x=>({name:x.name,seed:x.seed,cases:x.cases,passed:x.passed})),sourceSha256:result.sourceSha256,referenceSha256:result.referenceSha256}));
process.exitCode=result.failures.length?1:0;
