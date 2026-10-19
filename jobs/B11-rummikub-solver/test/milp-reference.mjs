import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {validatePosition,validateTable,validatePlay} from '../dist/rummikub.js';
import {blind} from './blind-adapter.mjs';
import {root} from './helpers.mjs';

/** Validate the independently computed witness and its disclosed numerical certificate. */
export function checkMilpWitness(position,row) {
  assert.ok(validatePosition(position).ok);assert.ok(blind.validatePosition(position).ok);
  assert.equal(row.error,undefined,JSON.stringify(row.error));
  const r=row.result,c=row.certificate;
  assert.equal(r.ok,true);assert.equal(r.optimal,true);
  assert.ok(validateTable(r.table).ok);assert.ok(blind.validateTable(r.table).ok);
  assert.equal(c.status,'OPTIMAL');assert.equal(c.integerRowsVerified,true);
  assert.equal(c.scipyVersion,'1.17.0');assert.equal(c.threads,1);
  assert.ok(Number.isSafeInteger(c.encodedObjective));
  assert.equal(c.encodedObjective,128*r.value+r.played.length);
  const bound=(encoded,primal,dual,gap)=>{
    assert.ok(Number.isSafeInteger(encoded));
    assert.ok([primal,dual,gap].every(Number.isFinite));
    assert.ok(Math.abs(primal-encoded)<=1e-5);
    assert.ok(dual>=encoded-1e-5&&dual-encoded<1);
    assert.ok(Math.abs(gap-(dual-encoded))<=1e-5);
  };
  bound(c.encodedObjective,c.primalObjective,c.dualBound,c.absoluteGap);
  const inventoryBound=128*position.hand.reduce((sum,t)=>sum+(t.kind==='joker'?13:t.value),0)+position.hand.length;
  assert.equal(c.inventoryEncodedUpperBound,inventoryBound);
  assert.ok(c.encodedObjective<=inventoryBound);
  assert.equal(c.inventoryBoundClosed,c.encodedObjective===inventoryBound);
  if(c.backend==='analytic-opening-threshold-from-optimal-milp') {
    assert.equal(position.initialMeldDone,false);assert.equal(r.action,'pass');
    bound(c.unrestrictedEncodedObjective,c.unrestrictedPrimalObjective,c.unrestrictedDualBound,c.unrestrictedGap);
    assert.ok(Math.floor(c.unrestrictedEncodedObjective/128)<30);
  } else assert.ok(['scipy-highs','analytic-empty-model'].includes(c.backend));
  assert.ok(Number.isFinite(row.elapsedMs)&&row.elapsedMs>=0);
  assert.ok(Number.isSafeInteger(r.value)&&r.value>=0);
  assert.equal(new Set(r.played).size,r.played.length);
  if(r.action==='play') {
    for(const validate of [validatePlay,blind.validatePlay]) {
      const v=validate(position,r.table);assert.ok(v.ok);
      assert.equal(v.value,r.value);assert.equal(v.rackPenaltyShed,r.rackPenaltyShed);
      assert.deepEqual([...v.played].sort(),[...r.played].sort());
    }
    assert.equal(r.initialMeldDone,true);
    const rack=new Map(position.hand.map(t=>[t.id,t]));
    let value=0,penalty=0,count=0;
    for(const meld of r.table)for(const t of meld.tiles)if(rack.has(t.id)) {
      value+=t.kind==='joker'?t.as.value:t.value;
      penalty+=t.kind==='joker'?30:t.value;count++;
    }
    assert.equal(value,r.value);assert.equal(penalty,r.rackPenaltyShed);assert.equal(count,r.played.length);
    const played=new Set(r.played);assert.deepEqual(r.remainingHand,position.hand.filter(t=>!played.has(t.id)));
  } else {
    assert.equal(r.action,'pass');assert.deepEqual(r.table,position.table);
    assert.deepEqual(r.remainingHand,position.hand);assert.deepEqual(r.played,[]);
    assert.equal(r.value,0);assert.equal(r.rackPenaltyShed,0);
    assert.equal(r.initialMeldDone,position.initialMeldDone);
  }
  return row;
}

/** One persistent, sequential JSON-lines process; no primary answers enter it. */
export function createMilpReference() {
  const child=spawn('python3',['-u','test/milp-reference.py'],{cwd:root,
    env:{...process.env,OPENBLAS_NUM_THREADS:'1',OMP_NUM_THREADS:'1',MKL_NUM_THREADS:'1',NUMEXPR_NUM_THREADS:'1'},
    stdio:['pipe','pipe','pipe']});
  let pending=null,failure=null,stderr='',closing=false;
  const fail=error=>{failure=error;if(pending){pending.reject(error);pending=null;}};
  child.stderr.on('data',chunk=>{stderr=(stderr+chunk.toString()).slice(-12000);});
  child.on('error',fail);child.stdin.on('error',fail);
  const lines=createInterface({input:child.stdout});
  lines.on('line',line=>{
    if(!pending){fail(new Error('Unexpected independent oracle output'));return;}
    const waiter=pending;pending=null;
    try {waiter.resolve(JSON.parse(line));}catch(error){waiter.reject(error);}
  });
  const exited=new Promise(resolve=>child.on('close',(code,signal)=>{
    if(pending||!closing)fail(new Error(`Independent oracle exited before completing: ${code}/${signal}\n${stderr}`));
    resolve({code,signal});
  }));
  return {
    async solve(position) {
      if(failure)throw failure;assert.equal(pending,null,'Only one reference request may be active');
      assert.ok(blind.validatePosition(position).ok);
      const before=JSON.stringify(position);
      const row=await new Promise((resolve,reject)=>{
        pending={resolve,reject};child.stdin.write(before+'\n');
      });
      assert.equal(JSON.stringify(position),before);
      return checkMilpWitness(position,row);
    },
    async close() {
      closing=true;child.stdin.end();const {code,signal}=await exited;
      if(failure)throw failure;assert.equal(signal,null);assert.equal(code,0,stderr);
    },
    abort() {child.kill();}
  };
}
