/** Post-seal helper, imports only the unchanged independently authored oracle. */
import assert from 'node:assert/strict';
import {validatePosition,validateTable,validatePlay,findBestPlay} from './dist/reference.js';

export function checkWitness(position,row,literal=false){
 assert.equal(validatePosition(position).ok,true,'input position');
 assert.equal(row.error,undefined,'oracle must not fail');
 const {result:r,certificate:c}=row;
 assert.equal(r.ok,true);assert.equal(r.optimal,true);
 assert.equal(validateTable(r.table).ok,true,'table witness');
 assert.equal(c.status,'OPTIMAL');assert.equal(c.integerRowsVerified,true);
 assert.equal(c.threads,1);assert.equal(Number.isSafeInteger(c.encodedObjective),true);
 assert.equal(c.encodedObjective,128*r.value+r.played.length);
 assert.equal(Number.isFinite(c.primalObjective)&&Number.isFinite(c.dualBound),true);
 assert.ok(Math.abs(c.primalObjective-c.encodedObjective)<=1e-5);
 assert.ok(c.dualBound>=c.encodedObjective-1e-5&&c.dualBound-c.encodedObjective<1);
 assert.ok(Math.abs(c.absoluteGap-(c.dualBound-c.encodedObjective))<=1e-5);
 const inventoryBound=128*position.hand.reduce((s,t)=>s+(t.kind==='joker'?13:t.value),0)+position.hand.length;
 assert.equal(c.inventoryEncodedUpperBound,inventoryBound);
 assert.ok(c.encodedObjective<=inventoryBound);
 assert.equal(c.inventoryBoundClosed,c.encodedObjective===inventoryBound);
 if(c.backend==='analytic-opening-threshold-from-optimal-milp'){
  assert.equal(position.initialMeldDone,false);assert.equal(r.action,'pass');
  assert.ok(Number.isSafeInteger(c.unrestrictedEncodedObjective));
  assert.ok(Math.floor(c.unrestrictedEncodedObjective/128)<30);
  assert.ok(Math.abs(c.unrestrictedPrimalObjective-c.unrestrictedEncodedObjective)<=1e-5);
  assert.ok(c.unrestrictedDualBound>=c.unrestrictedEncodedObjective-1e-5&&c.unrestrictedDualBound-c.unrestrictedEncodedObjective<1);
 }else assert.ok(['scipy-highs','analytic-empty-model'].includes(c.backend));
 if(r.action==='play'){
  const v=validatePlay(position,r.table);assert.equal(v.ok,true,'play witness');
  assert.equal(v.value,r.value);assert.equal(v.played.length,r.played.length);
  assert.deepEqual([...v.played].sort(),[...r.played].sort());
  assert.equal(v.rackPenaltyShed,r.rackPenaltyShed);assert.equal(r.initialMeldDone,true);
  const hand=new Map(position.hand.map(t=>[t.id,t])),rack=new Set(r.played);
  let value=0,penalty=0,count=0;
  for(const meld of r.table)for(const tile of meld.tiles)if(hand.has(tile.id)){
   value+=tile.kind==='number'?tile.value:tile.as.value;
   penalty+=tile.kind==='number'?tile.value:30;count++;
  }
  assert.equal(value,r.value);assert.equal(penalty,r.rackPenaltyShed);assert.equal(count,r.played.length);
  assert.deepEqual(r.remainingHand,position.hand.filter(t=>!rack.has(t.id)));
 }else{
  assert.equal(r.action,'pass');assert.deepEqual(r.table,position.table);
  assert.deepEqual(r.remainingHand,position.hand);assert.deepEqual(r.played,[]);
  assert.equal(r.value,0);assert.equal(r.rackPenaltyShed,0);
  assert.equal(r.initialMeldDone,position.initialMeldDone);
 }
 if(literal){
  const expected=findBestPlay(position);assert.equal(expected.ok,true);
  assert.equal(r.value,expected.value,'literal objective value');
  assert.equal(r.played.length,expected.played.length,'literal objective count');
 }
 return {value:r.value,count:r.played.length,backend:c.backend,candidates:c.candidates,
         enumeratedCandidates:c.enumeratedCandidates,nodes:c.nodes,gap:c.absoluteGap,
         inventoryBoundClosed:c.inventoryBoundClosed,
         elapsedMs:row.elapsedMs,generationMs:c.generationMs,solveMs:c.solveMs};
}
