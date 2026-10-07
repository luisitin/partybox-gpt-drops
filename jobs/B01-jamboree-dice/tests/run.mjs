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
function cmd(command,args){const r=spawnSync(command,args,{encoding:'utf8',maxBuffer:64*1024*1024});if(r.error)throw r.error;assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout;}
function suite(seed,name,body){try{const result=body();records.push({seed,name,passed:true,...result});console.log(`PASS seed=${seed} ${name} cases=${result.cases}`);}catch(error){const message=String(error.stack||error);records.push({seed,name,passed:false,error:message});failures.push({seed,name,error:message});console.error(`FAIL seed=${seed} ${name}: ${message}`);}}
function* tuples(blocks,i=0,values=[]){if(i===blocks.length){yield values.slice();return;}for(const v of blocks[i]){values.push(v);yield*tuples(blocks,i+1,values);values.pop();}}
const key=(m,c)=>`${m}:${c??'?'}`;
function rational(s){const [n,d]=s.split('/').map(BigInt);assert(d>0n);return[n,d];}
function sumOne(ss){let a=0n,b=1n;for(const s of ss){const[n,d]=rational(s);a=a*d+n*b;b*=d;}assert.equal(a,b);}
function gcd(a,b){while(b){[a,b]=[b,a%b];}return a<0n?-a:a;}
function semantic(){
 const sources=new Map(data.sources.map(s=>[s.id,s])), facts=new Map(data.facts.map(f=>[f.id,f]));
 for(const list of [data.sources,data.facts,data.characters,data.dice,data.items,data.models])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 for(const s of sources.values())assert(s.quotes.join(' ').split(/\s+/).filter(Boolean).length<=25,s.id);
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
function mutate(seed,A,oracle){const base=fs.readFileSync('.build/engine-a.js','utf8'), result=[];
 for(const[id,description,needle,replacement]of mutations){assert.equal(base.split(needle).length,2,`${id}: mutation anchor must occur once`);const module=new Module(path.resolve('.build/'+id+'.cjs'));module.filename=path.resolve('.build/'+id+'.cjs');module.paths=[];module._compile(base.replace(needle,replacement),module.filename);
 let witness=null;for(let i=0;i<data.models.length;i++){try{assert.deepEqual(module.exports.enumerate(data.models[i]),oracle[i].distribution);}catch(e){witness={model:data.models[i].id,message:String(e.message).slice(0,180)};break;}}
 assert(witness,`${id}: SURVIVED`);result.push({id,description,killed:true,witness});
 }fs.writeFileSync(`.test-output/mutations-seed-${seed}.json`,JSON.stringify(result,null,2)+'\n');return{cases:result.length,killed:result.length,command:'npm test (25 individual compiled-source mutants; pristine baseline separately passed)'};
}
function rngChecks(R,seed){const a=R.seededRng(seed),b=R.seededRng(seed);for(let i=0;i<1000;i++)assert.equal(a(),b());
 let values=[4294967295,4294967294,9],calls=0;assert.equal(R.randomIndex(10,()=>{calls++;return values.shift();}),9);assert.equal(calls,3);
 for(const v of[-1,1.5,4294967296,NaN])assert.throws(()=>R.randomIndex(10,()=>v));assert.throws(()=>R.seededRng(0));assert.throws(()=>R.randomIndex(0,a));assert.equal(R.randomIndex(1,()=>123),'0'|0);
 return{cases:1009,command:'npm test (RNG reproducibility, rejection branch and uint32 bounds)'};
}
function simulate(seed,A,R){let cases=0;const results=[],statFailures=[];
 for(let i=0;i<data.models.length;i++){
 const model=data.models[i],expected=committed.distributions[i], widths=model.blocks.map(b=>b.length), bins=new Map(expected.joint.map((r,j)=>[key(r.movement,r.coins),j]));
 const rankToBin=new Uint16Array(Number(expected.sampleSpace));let rank=0;for(const r of tuples(model.blocks)){const out=A.evaluateRoll(model,r);rankToBin[rank++]=bins.get(key(out.movement,out.coins));}
 const streamSeed=createHash('sha256').update(`B01:${seed}:${model.id}`).digest().readUInt32LE(0)||1,rng=R.seededRng(streamSeed),observed=new Uint32Array(bins.size);
 for(let t=0;t<N;t++){let index=0;for(let b=0;b<widths.length;b++)index=index*widths[b]+R.randomIndex(widths[b],rng);observed[rankToBin[index]]++;}
 const movement={},coins={},checks=[];
 function check(label,count,p){const[n,d]=rational(p),delta=BigInt(count)*d-BigInt(N)*n,variance=BigInt(N)*n*(d-n),square=delta*delta;const passed=square<=16n*variance;checks.push({outcome:label,observed:count,probability:p,withinFourSigma:passed,zSquared:variance?`${square}/${variance}`:'0/1'});if(!passed)statFailures.push({model:model.id,seed,outcome:label,count,p});cases++;}
 for(let j=0;j<observed.length;j++){const r=expected.joint[j],count=observed[j];check(`joint:${key(r.movement,r.coins)}`,count,r.probability);movement[r.movement]=(movement[r.movement]??0)+count;if(r.coins!==null)coins[r.coins]=(coins[r.coins]??0)+count;}
 for(const[k,p]of Object.entries(expected.movement))check(`movement:${k}`,movement[k]??0,p);
 for(const[k,p]of Object.entries(expected.coins??{}))check(`coins:${k}`,coins[k]??0,p);
 assert.equal(observed.reduce((a,b)=>a+b,0),N);
 results.push({model:model.id,seed,streamSeed,trials:N,passed:checks.every(c=>c.withinFourSigma),checks});console.log(`MC seed=${seed} ${model.id} trials=${N} ${results.at(-1).passed?'PASS':'FAIL'}`);
 }
 fs.writeFileSync(`.test-output/monte-carlo-seed-${seed}.json`,JSON.stringify(results,null,2)+'\n');assert.deepEqual(statFailures,[],'4-sigma excursions retained; never rerun/cherry-pick seeds');
 return{cases,models:results.length,trials:N*results.length,command:'npm test (10000000 independent face-sampled tuples per model; exact bigint 4-sigma inequalities)'};
}
for(const seed of[1,2,3]){
 suite(seed,'typescript-strict',()=>{cmd('tsc',['-p','tsconfig.json']);return{cases:3,command:'tsc -p tsconfig.json'};});
 suite(seed,'json-schema',()=>{const output=cmd('python3',['tests/validate.py',String(seed)]);fs.writeFileSync(`.test-output/validator-seed-${seed}.txt`,output);console.log(output.trim());return{cases:2,command:`python3 tests/validate.py ${seed}`,output};});
 const A=require('../.build/engine-a.js'),L=require('../.build/odds.js'),R=require('../.build/rng.js');
 const oracle=JSON.parse(cmd('python3',['tests/oracle_b.py']));
 suite(seed,'semantic-references',semantic);
 suite(seed,'exhaustive-A-B',()=>compare(A,oracle));
 suite(seed,'exact-invariants',()=>invariants(A));
 suite(seed,'lookup-boundaries',()=>lookupChecks(A,L));
 suite(seed,'literal-goldens',()=>goldens(A));
 suite(seed,'seeded-rng',()=>rngChecks(R,seed));
 suite(seed,'mutation-testing',()=>mutate(seed,A,oracle));
 suite(seed,'monte-carlo',()=>simulate(seed,A,R));
}
fs.writeFileSync('.test-output/suites.json',JSON.stringify(records,null,2)+'\n');
console.log(`SUITES ${records.filter(r=>r.passed).length}/${records.length} PASS; failures=${failures.length}`);
process.exitCode=failures.length?1:0;
