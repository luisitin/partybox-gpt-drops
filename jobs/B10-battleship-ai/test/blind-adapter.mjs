import assert from 'node:assert/strict';
import {blindDensity} from '../dist/blindOracle.js';
import {blindAuditDensity} from '../dist/blindPolicy.js';
export function oracleDensity(input,prepared=input) {
  const result=blindDensity(prepared,input);
  if(result.ok)return result;
  if(result.code==='contradiction')return {total:0n,counts:Array(input.size*input.size).fill(0n),targetCounts:Array(input.size*input.size).fill(0n)};
  throw new Error(`Blind exact oracle failed: ${result.code}: ${result.message}`);
}
export function auditDensity(model,state,density) {
  const reference=blindAuditDensity(model,state,density.audit);
  assert.ok(!('ok' in reference),JSON.stringify(reference));
  let maximum=0;
  for(let cell=0;cell<state.cells.length;cell++) {
    const occupancy=Math.abs(reference.occupancy[cell]-density.probability[cell]),target=Math.abs(reference.target[cell]-density.target[cell]);
    maximum=Math.max(maximum,occupancy,target);
    assert.ok(occupancy<=1e-10&&target<=1e-10,`Blind sampled reduction cell${cell}: occupancy${occupancy}, target${target}`);
  }
  return maximum;
}
