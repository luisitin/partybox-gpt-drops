import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire, Module} from 'node:module';
import {createHash} from 'node:crypto';
import {mutations} from './mutations.mjs';
const require=createRequire(import.meta.url), N=10_000_000;
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const data=read('dice.json'), committed=read('odds.json');
fs.mkdirSync('.test-output',{recursive:true});
const records=[], failures=[];
function cmd(command,args,options={}){const r=spawnSync(command,args,{encoding:'utf8',maxBuffer:64*1024*1024,...options});if(r.error)throw r.error;assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout;}
function suite(seed,name,body){try{const result=body();records.push({seed,name,passed:true,...result});console.log(`PASS seed=${seed} ${name} cases=${result.cases}`);}catch(error){const message=String(error.stack||error);records.push({seed,name,passed:false,error:message});failures.push({seed,name,error:message});console.error(`FAIL seed=${seed} ${name}: ${message}`);}}
function integrity(){
 const manifest=fs.readFileSync('SHA256SUMS.txt','utf8');assert(Buffer.byteLength(manifest)<=30_000_000);
 const entries=manifest.trim().split('\n');
 for(const line of entries){const match=/^([a-f0-9]{64})  (.+)$/.exec(line);assert(match);
  const bytes=fs.readFileSync(match[2]);assert(bytes.length<=30_000_000,match[2]+' exceeds file limit');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),match[1],match[2]+' checksum');
 }
 return{cases:entries.length,command:'npm test (all delivered hashes and per-file 30000000-byte gate)'};
}
function* tuples(blocks,i=0,values=[]){if(i===blocks.length){yield values.slice();return;}for(const v of blocks[i]){values.push(v);yield*tuples(blocks,i+1,values);values.pop();}}
const key=(m,c)=>`${m}:${c??'?'}`;
function rational(s){const [n,d]=s.split('/').map(BigInt);assert(d>0n);return[n,d];}
function sumOne(ss){let a=0n,b=1n;for(const s of ss){const[n,d]=rational(s);a=a*d+n*b;b*=d;}assert.equal(a,b);}
function gcd(a,b){while(b){[a,b]=[b,a%b];}return a<0n?-a:a;}
function semantic(){
 const sources=new Map(data.sources.map(s=>[s.id,s])), facts=new Map(data.facts.map(f=>[f.id,f]));
 for(const list of [data.sources,data.facts,data.characters,data.dice,data.items,data.models])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 for(const s of sources.values())for(const quote of s.quotes)assert(quote.split(/\s+/).filter(Boolean).length<=25,s.id);
 for(const f of facts.values()){for(const s of f.sources)assert(sources.has(s));if(f.status==='two-source')assert(new Set(f.sources.map(s=>sources.get(s).independenceGroup)).size>=2,f.id);}
 for(const collection of [data.characters,data.dice,data.items,data.compatibility,data.models])for(const r of collection)for(const f of r.facts)assert(facts.has(f));
 assert.equal(data.characters.length,22);for(const c of data.characters){assert.equal(c.dieId,'normal');assert.deepEqual([c.single,c.double,c.triple],['normal','double','triple']);}
 assert.deepEqual(data.dice[0].faces.map(f=>f.movement),[1,2,3,4,5,6,7,8,9,10]);
 for(const d of data.dice)for(const f of d.faces)assert.equal(f.coins,0);
 assert(!data.models.some(m=>/double-creepy|triple-creepy|double-custom/.test(m.id)));
 assert.deepEqual(Object.keys(read('package.json').dependencies),[]);
 for(const file of ['engine-a.ts','odds.ts','rng.ts'])assert(!/Math\.random\s*\(|Date\.now\s*\(/.test(fs.readFileSync(file,'utf8')));
 return{cases:data.facts.length+data.sources.length+data.characters.length+data.models.length,command:'npm test (semantic references, aliases, quote budgets, dependency/purity scan)'};
}
function researchRecheck(){
 const audit=read('reports/source-reopen-audit.json'),rows=read('reports/research-row-audit.json').rows;
 assert.deepEqual(audit.map(row=>row.id),data.sources.map(source=>source.id));
 for(const source of audit)if(source.kind!=='rejected'){
  assert(source.firstRetrieved&&source.secondRetrieved,source.id+' both source passes');
  assert(source.firstQuoteMatches.every(Boolean)&&source.secondQuoteMatches.every(Boolean),source.id+' quote recovery');
 }
 const expected=data.facts.length+data.characters.length+data.dice.reduce((n,die)=>n+die.faces.length,0)+
  data.items.length+data.models.length+data.compatibility.length;
 assert.equal(rows.length,expected);assert.equal(new Set(rows.map(row=>row[0])).size,expected);
 for(const row of rows)assert.equal(row[4],true,row[0]+' source recheck');
 return{cases:audit.length+rows.length,recheckedRows:rows.length,retrievedSources:audit.filter(s=>s.secondRetrieved).length,
  unresolvedResearchFacts:data.facts.filter(f=>f.status!=='two-source').map(f=>f.id),
  command:'npm test (complete per-row second-pass coverage and all accepted source quotes recovered in both archived passes)'};
}
function invariants(A){let cases=0;for(const d of committed.distributions){
 sumOne(Object.values(d.movement));sumOne(d.joint.map(x=>x.probability));if(d.coins)sumOne(Object.values(d.coins));
 const total=BigInt(d.sampleSpace);assert.equal(d.joint.reduce((n,r)=>n+BigInt(r.ways),0n),total);
 const margM={},margC={};let meanM=0n,meanC=0n;
 for(const row of d.joint){assert.equal(row.probability,A.fraction(BigInt(row.ways),total));margM[row.movement]=(margM[row.movement]??0n)+BigInt(row.ways);meanM+=BigInt(row.movement)*BigInt(row.ways);if(row.coins!==null){margC[row.coins]=(margC[row.coins]??0n)+BigInt(row.ways);meanC+=BigInt(row.coins)*BigInt(row.ways);}cases++;}
 for(const[k,v]of Object.entries(margM))assert.equal(d.movement[k],A.fraction(v,total));
 if(d.coins)for(const[k,v]of Object.entries(margC))assert.equal(d.coins[k],A.fraction(v,total));
 assert.equal(d.meanMovement,A.fraction(meanM,total));assert.equal(d.meanCoins,d.coins?A.fraction(meanC,total):null);
 for(const s of [...Object.values(d.movement),...Object.values(d.coins??{}),...d.joint.map(r=>r.probability),d.meanMovement,...(d.meanCoins?[d.meanCoins]:[])]){const[n,den]=rational(s);assert.equal(gcd(n,den),1n);assert.equal(s,A.fraction(n,den));}
 }return{cases,command:'npm test (bigint normalization, marginals, expectations and reduction)'};
}
function lookupChecks(A,L){let cases=0;
 for(const c of data.characters)for(const n of[1,2,3]){assert.strictEqual(L.getCharacterOdds(c.id,n),L.getOdds(['normal','double','triple'][n-1]));cases++;}
 for(const d of committed.distributions){assert.deepEqual(L.getOdds(d.id),d);assert(Object.isFrozen(L.getOdds(d.id)));for(let m=-1;m<=50;m++){assert.equal(L.movementProbability(d.id,m),d.movement[m]??'0/1');cases++;}for(const r of d.joint)if(r.coins!==null){assert.equal(L.jointProbability(d.id,r.movement,r.coins),r.probability);cases++;}}
 for(let c=1;c<=10;c++){assert.equal(L.getCustomOdds(c).movement[c],'1/1');cases++;}
 for(const c of[0,11,NaN,Infinity,1.1])assert.throws(()=>L.getCustomOdds(c));
 assert.throws(()=>L.getOdds('unknown'));assert.throws(()=>L.getCharacterOdds('unknown',1));assert.throws(()=>L.getCharacterOdds('mario',4));
 assert.throws(()=>L.jointProbability('together',10,0));assert.throws(()=>L.getOdds('normal').joint.push({}));
 assert.throws(()=>A.fraction(1n,0n));assert.equal(A.fraction(0n,7n),'0/1');assert.equal(A.fraction(2n,-4n),'-1/2');
 assert.throws(()=>A.evaluateRoll(data.models[0],[]));assert.throws(()=>A.evaluateRoll(data.models[0],[0]));
 assert.throws(()=>A.enumerate({...data.models[0],blocks:[[1,1]]}));assert.throws(()=>A.enumerate({...data.models[0],blocks:[[]]}));
 return{cases:cases+17,command:'npm test (lookup equality, all characters, custom choices, immutability, rejected inputs)'};
}
function goldens(A){const model=id=>data.models.find(m=>m.id===id);const checks=[
 ['double',[7,7],14,10],['double',[1,1],2,10],['double',[1,2],3,0],['triple',[7,7,7],21,50],['triple',[3,3,3],9,20],['triple',[7,7,1],15,0],['payday-double',[7,7],14,24],['payday-triple',[7,7,7],21,71],['turbo',[7,7,7,7],28,70],['turbo',[10,10,10,10],40,30],['together',[7,7],14,null],['together-reported-bonus',[7,7],14,10],['mario-payday-triple',[7,7,7,8],29,79],['mario-triple',[10,10,10,3],33,20],['mario-creepy',[1,8],9,0],['mushroom',[1],6,0]];
 for(const[id,r,m,c]of checks)assert.deepEqual(A.evaluateRoll(model(id),r),{movement:m,coins:c});
 assert.equal(A.enumerate(model('double')).coins['10'],'1/10');assert.equal(A.enumerate(model('triple')).coins['50'],'1/1000');assert.equal(A.enumerate(model('triple')).coins['20'],'9/1000');
 return{cases:checks.length+3,command:'npm test (literal arithmetic goldens; game inputs retain their research confidence)'};
}
function compare(A,oracle){let cases=0;for(let i=0;i<data.models.length;i++){
 const m=data.models[i], expected=oracle[i];assert.deepEqual(A.enumerate(m),expected.distribution,m.id+' A versus B distribution');assert.deepEqual(expected.distribution,committed.distributions[i],m.id+' B versus committed');let j=0;
 for(const r of tuples(m.blocks)){const out=A.evaluateRoll(m,r);assert.deepEqual([out.movement,out.coins],expected.cases[j],`${m.id} tuple ${j}`);j++;cases++;}assert.equal(j,Number(expected.distribution.sampleSpace));
 }return{cases,distributions:data.models.length,command:'npm test (TypeScript Cartesian enumeration versus Python convolution and independent per-tuple evaluator)'};}
function blindComparisons(A,B){let cases=0;
 const sealed=fs.readFileSync('tests/blind/SEALED-SHA256SUMS.txt','utf8').trim().split('\n');
 for(const line of sealed){const[digest,name]=line.split('  ');assert.equal(createHash('sha256').update(fs.readFileSync('tests/blind/'+name)).digest('hex'),digest);}
 for(let i=0;i<data.models.length;i++){
  const model=data.models[i],expected=B.enumerate(model);
  assert.deepEqual(A.enumerate(model),expected,model.id+' production versus sealed blind distribution');
  assert.deepEqual(committed.distributions[i],expected,model.id+' lookup table versus sealed blind distribution');
  for(const roll of tuples(model.blocks)){assert.deepEqual(A.evaluateRoll(model,roll),B.evaluateRoll(model,roll),model.id+' blind tuple');cases++;}
 }
 for(let n=-100;n<=100;n++)for(let d=-10;d<=10;d++)if(d!==0)
  assert.equal(A.fraction(BigInt(n),BigInt(d)),B.fraction(BigInt(n),BigInt(d)));
 const base=data.models[0];
 const invalid=[{blocks:[]},{blocks:Array.from({length:6},()=>[1])},{blocks:[[1,1]]},
  {blocks:[[]]},{blocks:[[0]]},{blocks:[[11]]},{blocks:[[1.5]]},{offset:-1},{offset:6},
  {offset:.5},{bonusDice:1},{bonusDice:2},{bonusDice:-1},{bonusDice:.5},
  {bonusRegular:-1},{bonusSevens:.5},{payday:'true'},{coinKnown:1}];
 for(const patch of invalid)for(const engine of[A,B]){
  assert.throws(()=>engine.enumerate({...base,...patch}),RangeError);
  assert.throws(()=>engine.evaluateRoll({...base,...patch},[1]),RangeError);
 }
 return{cases,distributions:data.models.length,fractionComparisons:4020,invalidModelFixtures:invalid.length,
  referenceSha256:createHash('sha256').update(fs.readFileSync('tests/blind/reference.ts')).digest('hex'),
  command:'npm test (sealed blind mixed-radix oracle versus every production tuple, table, fraction and invalid model fixture)'};
}
function blindAuthorSelfcheck(){
 const destination='.test-output/blind-selfcheck';fs.mkdirSync(destination+'/compiled',{recursive:true});
 for(const name of['package.json','reference.ts','selfcheck.mjs'])
  fs.copyFileSync('tests/blind/'+name,destination+'/'+name);
 const tsc=path.resolve('node_modules/typescript/bin/tsc');
 cmd(process.execPath,[tsc,'--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext',
  '--strict','--noUncheckedIndexedAccess','--outDir','compiled','reference.ts'],{cwd:destination});
 const output=cmd(process.execPath,['selfcheck.mjs'],{cwd:destination});
 assert.equal(fs.readFileSync(destination+'/SELFCHECK.json','utf8'),fs.readFileSync('tests/blind/SELFCHECK.json','utf8'));
 return{cases:41,command:'npm test (rerun original sealed author self-check in transient directory)',output:output.trim()};
}
function mutate(seed,A,oracle){const base=fs.readFileSync('.build/engine-a.js','utf8'), result=[];
 for(const[id,description,needle,replacement]of mutations){assert.equal(base.split(needle).length,2,`${id}: mutation anchor must occur once`);const module=new Module(path.resolve('.build/'+id+'.cjs'));module.filename=path.resolve('.build/'+id+'.cjs');module.paths=[];module._compile(base.replace(needle,replacement),module.filename);
 let witness=null;for(let i=0;i<data.models.length;i++){try{assert.deepEqual(module.exports.enumerate(data.models[i]),oracle[i].distribution);}catch(e){assert(e instanceof assert.AssertionError,`${id}: runtime error is not an assertion kill`);witness={model:data.models[i].id,message:String(e.message).slice(0,180)};break;}}
 assert(witness,`${id}: SURVIVED`);result.push({id,description,compiled:true,killed:true,sourceSha256:createHash('sha256').update(base.replace(needle,replacement)).digest('hex'),witness});
 }fs.writeFileSync(`.test-output/mutations-seed-${seed}.json`,JSON.stringify(result,null,2)+'\n');return{cases:result.length,compiled:result.length,killed:result.length,survived:0,compileErrors:0,command:'npm test (25 individual compiled-source mutants; only assertion failures against sealed blind distributions count as kills)'};
}
function rngChecks(R,seed){const a=R.seededRng(seed),b=R.seededRng(seed);for(let i=0;i<1000;i++)assert.equal(a(),b());
 let values=[4294967295,4294967294,9],calls=0;assert.equal(R.randomIndex(10,()=>{calls++;return values.shift();}),9);assert.equal(calls,3);
 for(const v of[-1,1.5,4294967296,NaN])assert.throws(()=>R.randomIndex(10,()=>v));assert.throws(()=>R.seededRng(0));assert.throws(()=>R.randomIndex(0,a));assert.equal(R.randomIndex(1,()=>123),'0'|0);
 return{cases:1009,command:'npm test (RNG reproducibility, rejection branch and uint32 bounds)'};
}
function simulationInputs(seed,model,expected,A){
 const widths=model.blocks.map(b=>b.length),bins=new Map(expected.joint.map((r,j)=>[key(r.movement,r.coins),j]));
 const rankToBin=[];for(const roll of tuples(model.blocks)){const out=A.evaluateRoll(model,roll);rankToBin.push(bins.get(key(out.movement,out.coins)));}
 const streamSeed=createHash('sha256').update(`B01:${seed}:${model.id}`).digest().readUInt32LE(0)||1;
 return{widths,bins,rankToBin,streamSeed};
}
function nativeCounts(input,trials){
 const text=[input.streamSeed,trials,input.widths.length,input.bins.size,...input.widths,...input.rankToBin].join(' ')+'\n';
 return JSON.parse(cmd('.test-output/montecarlo',[],{input:text}));
}
function nativeEquivalence(seed,A,R){
 const raw=JSON.parse(cmd('.test-output/montecarlo',['--raw'],{input:`${seed} 1024\n`}));
 const generator=R.seededRng(seed);for(const value of raw)assert.equal(value,generator());
 for(let i=0;i<data.models.length;i++){
  const input=simulationInputs(seed,data.models[i],committed.distributions[i],A),rng=R.seededRng(input.streamSeed);
  const js=Array(input.bins.size).fill(0);
  for(let trial=0;trial<1000;trial++){
   let rank=0;for(const width of input.widths)rank=rank*width+R.randomIndex(width,rng);
   js[input.rankToBin[rank]]++;
  }
  assert.deepEqual(nativeCounts(input,1000).observed,js,data.models[i].id+' accelerated sampler parity');
 }
 return{cases:1024+data.models.length,models:data.models.length,
  command:'npm test (C++ versus TypeScript PRNG values and 1000 complete sampled tuples for every model)'};
}
function simulate(seed,A,R){let cases=0;const results=[],statFailures=[];
 for(let i=0;i<data.models.length;i++){
 const model=data.models[i],expected=committed.distributions[i],input=simulationInputs(seed,model,expected,A);
 const {streamSeed}=input,native=nativeCounts(input,N),observed=native.observed;
 const movement={},coins={},checks=[];
 function check(label,count,p){const[n,d]=rational(p),delta=BigInt(count)*d-BigInt(N)*n,variance=BigInt(N)*n*(d-n),square=delta*delta;const passed=square<=16n*variance;checks.push({outcome:label,observed:count,probability:p,withinFourSigma:passed,zSquared:variance?`${square}/${variance}`:'0/1'});if(!passed)statFailures.push({model:model.id,seed,outcome:label,count,p});cases++;}
 for(let j=0;j<observed.length;j++){const r=expected.joint[j],count=observed[j];check(`joint:${key(r.movement,r.coins)}`,count,r.probability);movement[r.movement]=(movement[r.movement]??0)+count;if(r.coins!==null)coins[r.coins]=(coins[r.coins]??0)+count;}
 for(const[k,p]of Object.entries(expected.movement))check(`movement:${k}`,movement[k]??0,p);
 for(const[k,p]of Object.entries(expected.coins??{}))check(`coins:${k}`,coins[k]??0,p);
 assert.equal(observed.reduce((a,b)=>a+b,0),N);
 results.push({model:model.id,seed,streamSeed,trials:N,rngDraws:native.rngDraws,rejectedDraws:native.rejectedDraws,passed:checks.every(c=>c.withinFourSigma),checks});console.log(`MC seed=${seed} ${model.id} trials=${N} ${results.at(-1).passed?'PASS':'FAIL'}`);
 }
 fs.writeFileSync(`.test-output/monte-carlo-seed-${seed}.json`,JSON.stringify(results,null,2)+'\n');assert.deepEqual(statFailures,[],'4-sigma excursions retained; never rerun/cherry-pick seeds');
 return{cases,models:results.length,trials:N*results.length,command:'npm test (10000000 independent face-sampled tuples per model; exact bigint 4-sigma inequalities)'};
}
for(const seed of[1,2,3]){
 suite(seed,'artifact-integrity',integrity);
 suite(seed,'typescript-strict',()=>{cmd('tsc',['-p','tsconfig.json']);return{cases:4,command:'tsc -p tsconfig.json'};});
 suite(seed,'native-sampler-compile',()=>{cmd('g++',['-std=c++17','-O3','-Wall','-Wextra','-Werror','tests/montecarlo.cpp','-o','.test-output/montecarlo']);return{cases:1,command:'g++ -std=c++17 -O3 -Wall -Wextra -Werror tests/montecarlo.cpp -o .test-output/montecarlo'};});
 suite(seed,'json-schema',()=>{const output=cmd('python3',['tests/validate.py',String(seed)]);fs.writeFileSync(`.test-output/validator-seed-${seed}.txt`,output);console.log(output.trim());return{cases:2,command:`python3 tests/validate.py ${seed}`,output};});
 const A=require('../.build/engine-a.js'),L=require('../.build/odds.js'),R=require('../.build/rng.js'),B=require('../.build/tests/blind/reference.js');
 const oracle=JSON.parse(cmd('python3',['tests/oracle_b.py']));
 suite(seed,'semantic-references',semantic);
 suite(seed,'research-source-recheck',researchRecheck);
 suite(seed,'exhaustive-A-B',()=>compare(A,oracle));
 suite(seed,'blind-independent-odds',()=>blindComparisons(A,B));
 suite(seed,'blind-author-selfcheck',blindAuthorSelfcheck);
 suite(seed,'exact-invariants',()=>invariants(A));
 suite(seed,'lookup-boundaries',()=>lookupChecks(A,L));
 suite(seed,'literal-goldens',()=>goldens(A));
 suite(seed,'seeded-rng',()=>rngChecks(R,seed));
 suite(seed,'mutation-testing',()=>mutate(seed,A,data.models.map(model=>({distribution:B.enumerate(model)}))));
 suite(seed,'native-sampler-equivalence',()=>nativeEquivalence(seed,A,R));
 suite(seed,'monte-carlo',()=>simulate(seed,A,R));
}
fs.writeFileSync('.test-output/suites.json',JSON.stringify(records,null,2)+'\n');
console.log(`SUITES ${records.filter(r=>r.passed).length}/${records.length} PASS; failures=${failures.length}`);
process.exitCode=failures.length?1:0;
