import {referenceCandidates} from '../dist/test/oracle.js';
/** Separate coordinate-based shot policy, with no production imports. */
export function policyOracle(input,difficulty,u,density) {
  const open=[];
  for(let r=0;r<input.size;r++)for(let c=0;c<input.size;c++)if(input.cells[r*input.size+c]===0)open.push(r*input.size+c);
  const candidates=referenceCandidates(input);
  if(!candidates.length||!open.length)return null;
  const scores=new Map(open.map(c=>[c,0]));
  const minimum=Math.min(...candidates.map(s=>input.fleet[s.ship]));
  let target=false;
  if(difficulty==='hard') {
    target=input.cells.includes(2);
    for(const c of open)scores.set(c,Number((target?density.targetCounts:density.counts)[c])/Number(density.total));
  }else if(difficulty==='easy') {
    for(const c of open)for(let h=0;h<input.cells.length;h++)if(input.cells[h]===2&&
      Math.abs(Math.floor(c/input.size)-Math.floor(h/input.size))+Math.abs(c%input.size-h%input.size)===1)scores.set(c,1);
    target=[...scores.values()].some(x=>x>0);
  }else {
    for(const ship of candidates)for(const p of ship.positions) {
      let hits=0;for(const c of p)if(input.cells[c]===2)hits++;
      for(const c of p)if(scores.has(c))scores.set(c,scores.get(c)+hits*hits);
    }
    target=[...scores.values()].some(x=>x>0);
  }
  let allowed=open;
  if(!target&&difficulty!=='easy') {
    const coloured=open.filter(c=>(Math.floor(c/input.size)+c%input.size)%minimum===0);
    if(coloured.length)allowed=coloured;
  }
  const maximum=Math.max(...allowed.map(c=>scores.get(c)));
  const ties=allowed.filter(c=>Math.abs(scores.get(c)-maximum)<=1e-12);
  return ties[Math.floor(u*ties.length)];
}
