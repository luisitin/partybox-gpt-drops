import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {oracleDensity,oraclePositions,referenceCandidates,oracleSampleDensity,validWorld} from '../dist/test/oracle.js';
import {policyOracle} from './policy-oracle.mjs';
import {smallCase,unwrap,applyShot,rng} from './support.mjs';
const close=(a,b,eps=1e-10)=>assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}; tolerance ${eps}`);
const total=a=>a.reduce((s,x)=>s+x,0);
const asInput=(m,s)=>({size:m.size,fleet:m.fleet,...s});
const empty=(n)=>({cells:Array(n*n).fill(0),hitShip:Array(n*n).fill(null),sunk:[]});
function frozen(x){if(x&&typeof x==='object'){Object.freeze(x);for(const v of Object.values(x))frozen(v);}return x;}
function compareExact(AI,m,s) {
  const reference=oracleDensity(asInput(m,s));
  const actual=AI.probabilityDensity(m,s,()=>.271828,{mode:'exact',maxNodes:1_000_000});
  if(reference.total===0n){assert.equal(actual.ok,false);assert.equal(actual.error,'contradiction');return;}
  const d=unwrap(actual);assert.equal(d.method,'exact');assert.equal(d.total,reference.total);
  assert.deepEqual(d.counts,reference.counts);
  assert.deepEqual(d.probability,reference.counts.map(c=>Number(c)/Number(reference.total)));
  assert.deepEqual(d.target,reference.targetCounts.map(c=>Number(c)/Number(reference.total)));
  checkDensity(m,s,d);
  return {d,reference};
}
function checkDensity(m,s,d) {
  assert.equal(d.probability.length,m.size*m.size);
  const remaining=m.fleet.reduce((acc,len,i)=>acc+(s.sunk.some(x=>x.ship===i)?0:len),0);
  close(total(d.probability),remaining,1e-9);
  for(let c=0;c<s.cells.length;c++) {
    const p=d.probability[c];assert.ok(Number.isFinite(p)&&p>=-1e-12&&p<=1+1e-12);
    assert.ok(d.target[c]>=-1e-12&&d.target[c]<=p+1e-12);
    if(s.cells[c]===1||s.cells[c]===3){close(p,0);close(d.target[c],0);}
    if(s.cells[c]===2){close(p,1);close(d.target[c],1);}
  }
}
/** Recompute each proposal probability without masks or production helpers. */
function checkWeights(input,samples) {
  const groups=referenceCandidates(input).sort((a,b)=>a.positions.length-b.positions.length||a.ship-b.ship);
  for(const sample of samples) {
    let expected=1;const occupied=new Set();
    for(let index=0;index<groups.length;index++) {
      const group=groups[index],future=new Set(groups.slice(index+1).flatMap(g=>g.positions.flat()));
      const needed=input.cells.flatMap((s,c)=>s===2&&!occupied.has(c)&&!future.has(c)?[c]:[]);
      const allowed=group.positions.filter(p=>p.every(c=>!occupied.has(c))&&needed.every(c=>p.includes(c)));
      const w=p=>32**p.filter(c=>input.cells[c]===2&&input.hitShip?.[c]==null).length;
      const z=allowed.reduce((s,p)=>s+w(p),0),p=sample.world[group.ship];
      assert.ok(allowed.some(q=>q.length===p.length&&q.every(c=>p.includes(c))));
      expected*=z/w(p);for(const c of p)occupied.add(c);
    }
    close(sample.weight,expected,Math.max(1e-9,expected*1e-12));
  }
}
export function runUnit(AI,seed=1) {
  const tests=[];
  const test=(name,fn)=>{try{fn();tests.push({name,cases:1,passed:1,seed});}catch(e){throw new Error(`unit:${name}: ${e.message}`,{cause:e});}};
  const model=(n=4,f=[2])=>unwrap(AI.createModel(n,f));
  test('horizontal and vertical edge endpoints',()=>{
    const m=model();assert.equal(m.placements[0].length,24);
    assert.ok(m.placements[0].some(p=>p.cells.join(',')==='14,15'));
    assert.ok(m.placements[0].some(p=>p.cells.join(',')==='11,15'));
    compareExact(AI,m,empty(4));
  });
  test('one-cell ship orientations counted once',()=>{
    const m=model(6,[1]);const {d}=compareExact(AI,m,empty(6));assert.equal(d.total,36n);assert.deepEqual(d.counts,Array(36).fill(1n));
  });
  test('all mask words and sign bits 31 32 63 64 95 96 99',()=>{
    const m=model(10,[2]);
    for(const c of [0,30,31,32,33,62,63,64,65,94,95,96,97,98,99]) {const s=empty(10);s.cells[c]=2;compareExact(AI,m,s);}
  });
  test('blocked cells across every mask word',()=>{const s=empty(10);for(const c of [31,32,63,64,95,96,99])s.cells[c]=1;compareExact(AI,model(10,[2]),s);});
  test('length one on 100 cells',()=>{const {d}=compareExact(AI,model(10,[1]),empty(10));assert.equal(d.total,100n);assert.ok(d.counts.every(n=>n===1n));});
  test('joint exclusion and legal touching',()=>{const {d}=compareExact(AI,model(2,[2,2]),empty(2));assert.equal(d.total,4n);assert.deepEqual(d.counts,[4n,4n,4n,4n]);});
  test('labelled identical lengths not deduplicated',()=>{assert.deepEqual(model(4,[2,2,2]).fleet,[2,2,2]);compareExact(AI,model(4,[2,2]),empty(4));});
  test('miss excludes every intersecting hull',()=>{const s=empty(4);s.cells[0]=1;s.cells[5]=1;s.cells[15]=1;compareExact(AI,model(),s);});
  test('named hits belong to designated ships',()=>{const s=empty(4);s.cells[0]=2;s.hitShip[0]=0;s.cells[1]=2;s.hitShip[1]=1;compareExact(AI,model(4,[2,3]),s);});
  test('negative sinking evidence rejects fully hit afloat ship',()=>{const s=empty(4);s.cells[0]=s.cells[1]=2;const r=AI.probabilityDensity(model(),s,()=>.5,{mode:'exact'});assert.equal(r.ok,false);assert.equal(r.error,'contradiction');});
  test('every anonymous hit must be covered',()=>{const s=empty(4);s.cells[0]=s.cells[3]=2;compareExact(AI,model(),s);});
  test('sunk hull removed and adjacent ships still allowed',()=>{const s=empty(4);s.cells[0]=s.cells[1]=3;s.sunk=[{ship:0,cells:[0,1]}];compareExact(AI,model(4,[2,2]),s);});
  test('all sunk is terminal but empty density has one configuration',()=>{const m=model(2,[2]);const s=empty(2);s.cells[0]=s.cells[1]=3;s.sunk=[{ship:0,cells:[0,1]}];const {d}=compareExact(AI,m,s);assert.equal(d.total,1n);for(const level of ['easy','medium','hard']){const r=AI.chooseShot(m,s,level,()=>.5);assert.equal(r.ok,false);assert.equal(r.error,'game-over');}});
  test('empty fleet is terminal',()=>{compareExact(AI,model(4,[]),empty(4));assert.equal(AI.chooseShot(model(4,[]),empty(4),'easy',()=>.5).error,'game-over');});
  test('impossible global fleet returns error without throwing',()=>{const m=model(3,[3,3]);const s=empty(3);for(const c of [0,1,2,6,7,8])s.cells[c]=1;compareExact(AI,m,s);});
  test('enumeration budget returns no partial density',()=>{const r=AI.probabilityDensity(model(),empty(4),()=>.5,{mode:'exact',maxNodes:1});assert.equal(r.ok,false);assert.equal(r.error,'budget-exceeded');assert.equal(r.value,undefined);});
  test('sample exhaustion is not contradiction',()=>{const s=empty(4);s.cells[5]=s.cells[15]=2;const r=AI.probabilityDensity(model(4,[2,2]),s,()=>0,{mode:'sampled',samples:1});assert.equal(r.ok,false);assert.equal(r.error,'sample-exhausted');});
  test('sample weights and conditional marginals independently reconstructed',()=>{
    const m=model(4,[2,2]),s=empty(4);s.cells[0]=2;
    const d=unwrap(AI.probabilityDensity(m,s,AI.seededRng(seed),{mode:'sampled',samples:64,audit:true}));
    assert.ok(d.accepted>0);assert.equal(d.accepted,d.audit.length);assert.ok(d.audit.every(x=>validWorld(asInput(m,s),x.world)));
    checkDensity(m,s,d);checkWeights(asInput(m,s),d.audit);
    const expected=oracleSampleDensity(asInput(m,s),d.audit);d.probability.forEach((p,c)=>close(p,expected[c]));
  });
  test('one ship conditional sampling equals exact posterior',()=>{
    const m=model(4,[3]),s=empty(4);s.cells[5]=2;s.cells[15]=1;
    const {d}=compareExact(AI,m,s),a=unwrap(AI.probabilityDensity(m,s,AI.seededRng(seed),{mode:'sampled',samples:1,audit:true}));
    d.probability.forEach((p,c)=>close(p,a.probability[c]));checkDensity(m,s,a);
  });
  test('easy medium hard match independent policies',()=>{
    const m=model(4,[2,3]),s=empty(4);s.cells[6]=2;s.hitShip[6]=1;s.cells[0]=s.cells[5]=1;
    const input=asInput(m,s),ref=oracleDensity(input);
    for(const level of ['easy','medium','hard']) {
      const a=unwrap(AI.chooseShot(m,s,level,()=>.314159,{mode:'exact'}));
      assert.equal(a.cell,policyOracle(input,level,.314159,ref));
    }
  });
  test('never select any previously fired cell',()=>{
    const m=model(4,[2]);const s=empty(4);s.cells.fill(1);s.cells[14]=s.cells[15]=0;
    for(const level of ['easy','medium','hard'])for(const u of [0,.499,.99999999]) {const r=unwrap(AI.chooseShot(m,s,level,()=>u,{mode:'exact'}));assert.equal(s.cells[r.cell],0);}
  });
  test('uniform endpoints of injected RNG',()=>{const m=model(),s=empty(4);assert.equal(unwrap(AI.chooseShot(m,s,'easy',()=>0)).cell,0);assert.equal(unwrap(AI.chooseShot(m,s,'easy',()=>1-Number.EPSILON)).cell,15);});
  test('invalid RNG is an error value',()=>{
    for(const fn of [()=>1,()=>-1,()=>NaN,()=>Infinity,()=>{throw new Error('bad rng');}]) {
      for(const level of ['easy','medium','hard']) {const r=AI.chooseShot(model(),empty(4),level,fn,{mode:'sampled'});assert.equal(r.ok,false);assert.equal(r.error,'invalid-rng');}
    }
  });
  test('strict malformed model options and observation checks',()=>{
    for(const [size,fleet] of [[0,[2]],[11,[2]],[4,[0]],[4,[5]],[2,[2,2,2]],[NaN,[2]]])assert.equal(AI.createModel(size,fleet).ok,false);
    for(const opt of [{samples:0},{samples:1.5},{maxNodes:0},{maxNodes:4294967297},{mode:'no'}])assert.equal(AI.probabilityDensity(model(),empty(4),()=>.5,opt).error,'invalid-input');
    for(const s of [{cells:[],sunk:[]},{...empty(4),cells:Array(16).fill(9)},{...empty(4),hitShip:[]},{...empty(4),sunk:[{ship:8,cells:[0,1]}]}])assert.equal(AI.probabilityDensity(model(),s,()=>.5).ok,false);
  });
  test('bent overlapping duplicate and mismatched sunk declarations',()=>{
    const m=model(4,[3,3]);
    for(const declarations of [[{ship:0,cells:[0,1,5]}],[{ship:0,cells:[0,1,2]},{ship:0,cells:[4,5,6]}],[{ship:0,cells:[0,1,2]},{ship:1,cells:[1,5,9]}]]) {
      const s=empty(4);s.sunk=declarations;for(const g of declarations)for(const c of g.cells)s.cells[c]=3;assert.equal(AI.probabilityDensity(m,s,()=>.5).error,'invalid-input');
    }
    const s=empty(4);s.cells[4]=3;assert.equal(AI.probabilityDensity(m,s,()=>.5).error,'invalid-input');
  });
  test('public state updates copied and repeat feedback rejected',()=>{
    const m=model(),s=frozen(empty(4));const hit=unwrap(AI.recordShot(m,s,0,{result:'hit',ship:0}));
    assert.equal(s.cells[0],0);assert.equal(hit.cells[0],2);
    assert.equal(AI.recordShot(m,hit,0,{result:'hit',ship:0}).ok,false);
    assert.equal(AI.recordShot(m,hit,5,{result:'sunk',ship:0,cells:[4,5]}).ok,false);
    const sunk=unwrap(AI.recordShot(m,hit,1,{result:'sunk',ship:0,cells:[0,1]}));assert.equal(sunk.sunk.length,1);assert.equal(hit.sunk.length,0);
  });
  test('sinking cannot relabel another ships earlier named hit',()=>{
    const m=model(4,[2,2]),s=empty(4);s.cells[0]=2;s.hitShip[0]=1;
    assert.equal(AI.recordShot(m,s,1,{result:'sunk',ship:0,cells:[0,1]}).ok,false);
  });
  test('determinism and frozen inputs',()=>{
    const m=frozen(model(4,[2,2])),s=frozen(empty(4));
    assert.deepEqual(AI.chooseShot(m,s,'hard',AI.seededRng(seed),{mode:'sampled',samples:16}),AI.chooseShot(m,s,'hard',AI.seededRng(seed),{mode:'sampled',samples:16}));
  });
  test('100-cell terminal misses are contradictory not a repeat shot',()=>{const m=model(10,[2]),s=empty(10);s.cells.fill(1);assert.equal(AI.chooseShot(m,s,'hard',()=>.5).error,'contradiction');});
  return tests;
}
export function runDifferential(AI,seed,count=10000) {
  const start=performance.now();let fullLayouts=0n,policyChecks=0,feedbackChecks=0;
  for(let i=0;i<count;i++) {
    const {size,fleet,world,state,named}=smallCase(seed,i),m=unwrap(AI.createModel(size,fleet));
    const before=JSON.stringify(state),input=asInput(m,state);
    const {reference}=compareExact(AI,m,state);fullLayouts+=reference.total;
    const u=rng((i+1)*17+seed)();
    for(const level of ['easy','medium','hard']) {
      const ref=policyOracle(input,level,u,reference),r=AI.chooseShot(m,state,level,()=>u,{mode:'exact'});
      if(ref===null){assert.equal(r.ok,false);assert.equal(r.error,'game-over');}
      else {
        const choice=unwrap(r);assert.equal(choice.cell,ref,`policy ${level} seed=${seed} case=${i}`);assert.equal(state.cells[choice.cell],0);
        const {state:expected,feedback}=applyShot(state,choice.cell,world,named);
        assert.deepEqual(unwrap(AI.recordShot(m,state,choice.cell,feedback)),expected);feedbackChecks++;
      }
      policyChecks++;
    }
    assert.equal(JSON.stringify(state),before);
  }
  return {name:'6x6 full-enumeration differential',seed,cases:count,passed:count,enumeratedLayouts:String(fullLayouts),policyChecks,feedbackChecks,seconds:(performance.now()-start)/1000};
}
export function runSampleAudit(AI,seed,count=200) {
  const start=performance.now();let checkedWorlds=0,exhausted=0,maxDifference=0;
  for(let i=0;i<count;i++) {
    const {size,fleet,state}=smallCase(seed,i+10000),m=unwrap(AI.createModel(size,fleet)),input=asInput(m,state);
    const r=AI.probabilityDensity(m,state,AI.seededRng(seed*65537+i),{mode:'sampled',samples:64,audit:true});
    if(!r.ok){assert.equal(r.error,'sample-exhausted');exhausted++;continue;}
    const d=r.value;checkDensity(m,state,d);checkWeights(input,d.audit);
    const expected=oracleSampleDensity(input,d.audit);
    for(let c=0;c<state.cells.length;c++){const error=Math.abs(expected[c]-d.probability[c]);maxDifference=Math.max(maxDifference,error);close(expected[c],d.probability[c],1e-10);}
    checkedWorlds+=d.audit.length;
  }
  return {name:'independent sampled-world and weight audit',seed,cases:count,passed:count,checkedWorlds,exhausted,maxDifference,seconds:(performance.now()-start)/1000};
}
