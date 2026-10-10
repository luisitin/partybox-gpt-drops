/** Array/set oracle. Does not import production code, geometry, validation or RNG. */
export interface OracleInput {
  size: number; fleet: readonly number[]; cells: readonly number[];
  hitShip?: readonly (number | null)[];
  sunk: readonly {ship: number; cells: readonly number[]}[];
}
export function oraclePositions(size: number, length: number): number[][] {
  const out: number[][] = [];
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
    if(c+length<=size) out.push(Array.from({length},(_,i)=>r*size+c+i));
    if(length>1 && r+length<=size) out.push(Array.from({length},(_,i)=>(r+i)*size+c));
  }
  return out;
}
export function referenceCandidates(a: OracleInput): {ship:number; positions:number[][]}[] {
  const sunkShips=new Set(a.sunk.map(s=>s.ship));
  const fixed=new Set(a.sunk.flatMap(s=>[...s.cells]));
  return a.fleet.flatMap((length,ship)=>sunkShips.has(ship)?[]:[{
    ship, positions:oraclePositions(a.size,length).filter(p=>
      p.every(c=>a.cells[c]!==1 && !fixed.has(c) &&
        (a.cells[c]!==2 || a.hitShip?.[c]==null || a.hitShip[c]===ship)) &&
      p.some(c=>a.cells[c]===0) &&
      a.cells.every((status,c)=>status!==2 || a.hitShip?.[c]!==ship || p.includes(c)))
  }]);
}
export function oracleDensity(a:OracleInput): {total:bigint; counts:bigint[]; targetCounts:bigint[]} {
  const candidates=referenceCandidates(a);
  const occupied=new Set<number>();
  const counts=Array<bigint>(a.size*a.size).fill(0n);
  const targetCounts=Array<bigint>(a.size*a.size).fill(0n), selected:number[][]=[];
  let total=0n;
  function visit(i:number):void {
    if(i===candidates.length) {
      if(a.cells.some((status,c)=>status===2 && !occupied.has(c)))return;
      total++;
      for(const c of occupied)counts[c]=counts[c]!+1n;
      for(const p of selected)if(p.some(c=>a.cells[c]===2))for(const c of p)targetCounts[c]=targetCounts[c]!+1n;
      return;
    }
    for(const p of candidates[i]!.positions) {
      if(p.some(c=>occupied.has(c)))continue;
      for(const c of p)occupied.add(c);
      selected.push(p);visit(i+1);selected.pop();
      for(const c of p)occupied.delete(c);
    }
  }
  visit(0);
  return {total,counts,targetCounts};
}
/** Independent inspection of a reported full sample (including negative sunk evidence). */
export function validWorld(a:OracleInput, world:readonly (readonly number[])[]):boolean {
  if(world.length!==a.fleet.length)return false;
  const seen=new Set<number>();
  for(let ship=0;ship<a.fleet.length;ship++) {
    const p=world[ship]!;
    if(p.length!==a.fleet[ship])return false;
    if(!oraclePositions(a.size,a.fleet[ship]!).some(q=>q.length===p.length && q.every(c=>p.includes(c))))return false;
    for(const c of p) {
      if(seen.has(c)||a.cells[c]===1)return false;
      seen.add(c);
      if(a.cells[c]===2 && a.hitShip?.[c]!=null && a.hitShip[c]!==ship)return false;
    }
    const sunk=a.sunk.find(s=>s.ship===ship);
    if(sunk) {if(!sunk.cells.every(c=>p.includes(c)))return false;}
    else if(p.every(c=>a.cells[c]!==0))return false;
  }
  return a.cells.every((s,c)=>(s!==2&&s!==3)||seen.has(c));
}
/** Reconstruct the Rao-Blackwellized marginal of each weighted sample using arrays only. */
export function oracleSampleDensity(a:OracleInput, samples:readonly {world:readonly (readonly number[])[];weight:number}[]):number[] {
  const cs=referenceCandidates(a), out=Array<number>(a.size*a.size).fill(0);
  let denominator=0;
  for(const sample of samples) {
    if(!validWorld(a,sample.world))throw new Error('illegal sample');
    denominator+=sample.weight;
    for(const ship of cs) {
      const other=new Set(sample.world.flatMap((p,i)=>i===ship.ship?[]:[...p]));
      const needed=a.cells.flatMap((s,c)=>s===2&&!other.has(c)?[c]:[]);
      const eligible=ship.positions.filter(p=>p.every(c=>!other.has(c)) && needed.every(c=>p.includes(c)));
      if(!eligible.length)throw new Error('no conditional candidate');
      for(const p of eligible)for(const c of p)out[c]!+=sample.weight/eligible.length;
    }
  }
  return out.map(x=>x/denominator);
}
