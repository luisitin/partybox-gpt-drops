// Verbatim declarations from the guarded original runner; no acceptance test runs.
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {nameFilter} from '../../jobs/B19-name-filter/dist/nameFilter.js';
import {reference} from '../../jobs/B19-name-filter/dist/tests/reference.js';
import {createReference} from '../../jobs/B19-name-filter/tests/blind/reference.mjs';
const policy = JSON.parse(readFileSync(new URL('../../jobs/B19-name-filter/data/policy.json', import.meta.url)));
const originalPolicy = JSON.parse(readFileSync(new URL('../../jobs/B19-name-filter/data/original-workload-policy.json', import.meta.url)));
const blind = createReference(policy);
const label = result => result.ok ? 'ok' : result.reason;
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
    if([...input].length>16 || seen.has(input))continue; // domain/dedup only, never oracle feedback
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
// p|ssy is NOT the spelling of a blocked term under this policy; avoid invented witnesses.
witnessBlocked.splice(witnessBlocked.indexOf('p|ssy'),1);
const fixed = [
 ...['Lana','Bonner','Stitt','Dick','Coons','Dykes','Raper'].map(input=>({input,expected:'blocked',kind:'documented-collision'})),
 ...originalPolicy.safe.filter(input=>[...input].length<=16).map(input=>({input,expected:'ok',kind:'exact-exception'})),
 ...positive.map(input=>({input,expected:'ok',kind:'benign'})),
 ...policy.terms.map(input=>({input,expected:'blocked',kind:'base-lexicon'})),
 ...witnessBlocked.map(input=>({input,expected:'blocked',kind:'adversarial'})),
 ...['','   ','....','🚀','\u0301'].map(input=>({input,expected:'empty',kind:'format'})),
 ...['Alex\n','\ud800','\udfff','A\u202eB','A\u2067B','\u007f'].map(input=>({input,expected:'control',kind:'format'})),
 ...['abcdefghijklmnopq','𐐨'.repeat(17),'x'.repeat(100000)].map(input=>({input,expected:'length',kind:'format'})),
 ...[null,undefined,0,NaN,Infinity,{},[],false,Symbol('name')].map(input=>({input,expected:'type',kind:'format'})),
];
// Additive checks for the new exact spellings and for attempted exception
// bypasses. These do not change fixed, positive, mutation or benchmark inputs.
const addedNameCases = [
 ...['Analia','Analía','ANALIA','Analise','ANALISE','Sexto','SEXTO'].map(input=>({input,expected:'ok'})),
 ...['Analiasex','Analisesex','Sextosex','sexAnalia','4nalia','analiа','ѕexto','se xto'].map(input=>({input,expected:'blocked'})),
];
const mappingCases=[];
for(const term of policy.terms)for(let i=0;i<term.length;i++)for(const v of variants[term[i]]??[]){
 const input=term.slice(0,i)+v+term.slice(i+1);
 mappingCases.push({input,expected:'blocked',kind:'single-glyph',term});
}
// Supplement every original suite with all declared characters/case variants
// in mixed contexts, including Greek final sigma and normalization fallback.
const knownCharacters=new Set([...policy.groups.flatMap(([,group])=>[...group]),...'\u00ad\u034f\u061c\u180e\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\ufeff']);
for(const character of [...knownCharacters]){knownCharacters.add(character.toUpperCase());knownCharacters.add(character.toLowerCase());}
const knownCases=[...knownCharacters].flatMap(c=>[c,'a'+c,c+'a','s'+c+'ex','se'+c+'x','Σ'+c+'A','A'+c+'Σ','AΣ'+c,'ſ'+c+'ex'].map(input=>({input,expected:label(blind.nameFilter(input)),kind:'precompiled-Unicode-policy'})));
// The original suites and their counts are unchanged. Independently challenge
// every extra compiled code point in ordinary, contextual-case and fallback
// positions; expected outcomes come from the original sealed reference.
const rangeCharacters=[...Array.from({length:64},(_,i)=>String.fromCharCode(0x00c0+i)),...Array.from({length:94},(_,i)=>String.fromCharCode(0xff01+i))];
const rangeCases=rangeCharacters.flatMap(c=>[c,'a'+c,c+'a','s'+c+'ex','se'+c+'x','Σ'+c+'A','A'+c+'Σ','AΣ'+c,'ſ'+c+'ex'].map(input=>({input,expected:label(blind.nameFilter(input)),kind:'precompiled-Unicode-ranges'})));
// Exhaust short mapped ASCII inputs and term-length/repetition boundaries.
// These supplement rather than alter the original 43,830-case workload, and
// expectations are supplied only by the unchanged sealed independent oracle.
const lengthCases=[];
for(let a=97;a<=122;a++) {
 const first=String.fromCharCode(a);
 lengthCases.push(first);
 for(let b=97;b<=122;b++) {
  const second=first+String.fromCharCode(b);lengthCases.push(second);
  for(let c=97;c<=122;c++)lengthCases.push(second+String.fromCharCode(c));
 }
}
for(const term of policy.terms)for(const spelling of [term,[...term].reverse().join('')]) {
 for(let count=0;count<=16;count++) {
  const repeated=spelling[0].repeat(count)+spelling.slice(1);
  lengthCases.push(repeated,'a'+repeated,repeated+'a');
 }
 lengthCases.push(spelling+'中', '中'+spelling, spelling.slice(0,1)+'中'+spelling.slice(1));
}
lengthCases.push('ｓｅｘ','s e x','s.e.x','s中ex','c1it','Bob','boob','boooob','s'.repeat(16),'ﬃ'.repeat(16));
const lengthBoundaryCases=[...new Set(lengthCases)].map(input=>({input,expected:label(blind.nameFilter(input)),kind:'length-pruned-blind-boundary'}));
const mutations = [
 ['M01','Remove lowercasing', '.toLowerCase()', ''],
 ['M02','Lose compatibility normalization', "normalize('NFKD')", "normalize('NFD')"],
 ['M03','Keep combining marks', ".replace(MARKS, '')", ''],
 ['M04','Keep zero-width format characters', ".replace(FORMATS, '')", ''],
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
 ['M18','Disable reversed scan', "TERMS.map(term => [...term].reverse().join(''))", '[]'],
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
 const times=new Float64Array(sample.length);let index=0;const start=performance.now();
 for(const s of sample){const t=performance.now();sink+=nameFilter(s).ok?1:0;times[index++]=performance.now()-t;}
 const end=performance.now();const elapsed=end-start;
 const outliers=[];
 for(let i=0;i<times.length;i++)if(times[i]>0.05)outliers.push({index:i,input:sample[i],timeMs:times[i]});
 times.sort((a,b)=>a-b);
 return {calls:sample.length,meanMs:elapsed/sample.length,p50Ms:times[4999],p99Ms:times[9899],maxMs:times[9999],over005Ms:outliers.length,outliers,measurementStartMs:start,measurementEndMs:end,sink};
}

export {makeObfuscations, makeFuzz, positive, fixed, mappingCases, knownCases, rangeCases, lengthBoundaryCases, addedNameCases, rng, pick};

export {mutations};
