import {blindChoose} from '../dist/blindPolicy.js';
/** Adapter only: the independently authored policy was sealed before source inspection. */
export function policyOracle(input,difficulty,u,density) {
  const estimate=difficulty==='hard'?{occupancy:density.counts.map(c=>Number(c)/Number(density.total)),target:density.targetCounts.map(c=>Number(c)/Number(density.total)),method:'exact'}:undefined;
  const result=blindChoose(input,input,difficulty,u,estimate);
  if(!result.ok) {if(result.code==='game-over')return null;throw new Error(`Blind policy: ${result.code}: ${result.message}`);}
  return result.cell;
}
