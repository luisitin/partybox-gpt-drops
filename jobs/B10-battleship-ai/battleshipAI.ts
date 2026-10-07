/**
 * B10 Battleship AI. Zero runtime dependencies; no module-level mutable caches.
 * Coordinates are row-major. Ships are LABELLED by their index in model.fleet.
 * 0 unknown, 1 miss, 2 unresolved hit, 3 identified sunk hull.
 * Orthogonal/diagonal touching is legal; overlapping is not.
 */
export type Rng = () => number;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Cell = 0 | 1 | 2 | 3;
export interface SunkShip { readonly ship:number; readonly cells:readonly number[] }
export interface State {
  readonly cells:readonly Cell[];
  /** Optional public identity announced on each hit; null means anonymous. */
  readonly hitShip?:readonly (number|null)[];
  /** Exact publicly identified hulls, NOT guessed connected components. */
  readonly sunk:readonly SunkShip[];
}
interface Mask { readonly a:number; readonly b:number; readonly c:number; readonly d:number }
interface Placement extends Mask { readonly cells:readonly number[] }
export interface Model {
  readonly size:number;
  readonly fleet:readonly number[];
  readonly placements:readonly (readonly Placement[])[];
}
export type ErrorCode = 'invalid-input'|'invalid-rng'|'contradiction'|'budget-exceeded'|'sample-exhausted'|'game-over';
export interface Failure { readonly ok:false; readonly error:ErrorCode; readonly message:string }
export type Result<T> = {readonly ok:true; readonly value:T} | Failure;
export interface Options {
  readonly mode?:'auto'|'exact'|'sampled';
  /** Bounded enumeration work: recursive nodes, not elapsed wall time. */
  readonly maxNodes?:number;
  /** Independent importance-sampling proposals (failed proposals count too). */
  readonly samples?:number;
  /** Return full sampled worlds and proposal weights for independent audits. */
  readonly audit?:boolean;
}
export interface AuditSample {
  readonly world:readonly (readonly number[])[];
  readonly weight:number;
}
export interface Density {
  readonly method:'exact'|'sampled';
  /** Marginal occupancy of remaining ships. Hits=1, misses/sunk=0. */
  readonly probability:readonly number[];
  /** Occupancy belonging to a ship with at least one unresolved hit. */
  readonly target:readonly number[];
  readonly total?:bigint;
  readonly counts?:readonly bigint[];
  readonly proposals:number;
  readonly accepted:number;
  readonly effectiveSamples:number;
  readonly nodes:number;
  readonly audit:readonly AuditSample[];
}
export interface ShotChoice { readonly cell:number; readonly method:'hunt'|'target'|'exact'|'sampled'; readonly density?:Density }
const fail=(error:ErrorCode,message:string):Failure=>({ok:false,error,message});
const zero=():Mask=>({a:0,b:0,c:0,d:0});
function mask(cells:readonly number[]):Mask {
  const words=[0,0,0,0];
  for(const c of cells)words[c>>>5]=words[c>>>5]! | (1<<(c&31));
  return {a:words[0]!,b:words[1]!,c:words[2]!,d:words[3]!};
}
function union(x:Mask,y:Mask):Mask {return {a:x.a|y.a,b:x.b|y.b,c:x.c|y.c,d:x.d|y.d};}
function overlaps(x:Mask,y:Mask):boolean {return !!((x.a&y.a)|(x.b&y.b)|(x.c&y.c)|(x.d&y.d));}
function contains(x:Mask,y:Mask):boolean {return ((x.a&y.a)===y.a)&&((x.b&y.b)===y.b)&&((x.c&y.c)===y.c)&&((x.d&y.d)===y.d);}
function subtract(x:Mask,y:Mask):Mask {return {a:x.a&~y.a,b:x.b&~y.b,c:x.c&~y.c,d:x.d&~y.d};}
function empty(x:Mask):boolean {return (x.a|x.b|x.c|x.d)===0;}
function random(rng:Rng):number|null {
  try {const x=rng();return Number.isFinite(x)&&x>=0&&x<1?x:null;}catch{return null;}
}
/** Deterministic 32-bit PRNG. Its closure is the only intentional RNG state. */
export function seededRng(seed:number):Rng {
  let state=seed>>>0;
  return ()=> {state=(state+0x6D2B79F5)>>>0;let t=state;
    t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;};
}
export function createModel(size=10,fleet:readonly number[]=[5,4,3,3,2]):Result<Model> {
  if(!Number.isInteger(size)||size<2||size>10||!Array.isArray(fleet)||fleet.length>10||
     fleet.some(n=>!Number.isInteger(n)||n<1||n>size)||fleet.reduce((a,b)=>a+b,0)>size*size)
    return fail('invalid-input','Board size must be 2..10; fleet must fit with lengths 1..size (at most 10 ships).');
  const placements=fleet.map(length=>{
    const ps:Placement[]=[];
    for(let r=0;r<size;r++)for(let c=0;c<size;c++) {
      if(c+length<=size) {const cells=Array.from({length},(_,k)=>r*size+c+k);ps.push({...mask(cells),cells});}
      if(length>1&&r+length<=size) {const cells=Array.from({length},(_,k)=>(r+k)*size+c);ps.push({...mask(cells),cells});}
    }
    return ps;
  });
  return {ok:true,value:{size,fleet:[...fleet],placements}};
}
export function initialState(model:Model):State {
  return {cells:Array<Cell>(model.size*model.size).fill(0),hitShip:Array<number|null>(model.size*model.size).fill(null),sunk:[]};
}
interface Candidates { ship:number; ps:readonly Placement[]; namedHits:number }
interface Prepared { groups:Candidates[]; hits:Mask; blocked:Mask; hasHits:boolean; hasAnonymous:boolean }
function suffixMasks(groups:readonly Candidates[]):Mask[] {
  const suffix:Mask[]=Array.from({length:groups.length+1},zero);
  for(let i=groups.length-1;i>=0;i--) {
    let {a,b,c,d}=suffix[i+1]!;
    for(const move of groups[i]!.ps){a|=move.a;b|=move.b;c|=move.c;d|=move.d;}
    suffix[i]={a,b,c,d};
  }
  return suffix;
}
function prepare(model:Model,state:State):Result<Prepared> {
  const n=model.size*model.size;
  if(!state||!Array.isArray(state.cells)||state.cells.length!==n||!Array.isArray(state.sunk)||
    state.cells.some(c=>c!==0&&c!==1&&c!==2&&c!==3)||
    (state.hitShip!==undefined&&(!Array.isArray(state.hitShip)||state.hitShip.length!==n)))
    return fail('invalid-input','Invalid observation array.');
  const sunken=new Set<number>(), fixed=new Set<number>();
  for(const s of state.sunk) {
    if(!s||!Number.isInteger(s.ship)||s.ship<0||s.ship>=model.fleet.length||sunken.has(s.ship)||
      !Array.isArray(s.cells)||s.cells.length!==model.fleet[s.ship]||new Set(s.cells).size!==s.cells.length||
      s.cells.some((c:number)=>!Number.isInteger(c)||c<0||c>=n||state.cells[c]!==3||fixed.has(c))||
      !model.placements[s.ship]!.some(p=>p.cells.every(c=>s.cells.includes(c))))
      return fail('invalid-input','Invalid, duplicate, bent or overlapping sunk hull.');
    sunken.add(s.ship);for(const c of s.cells)fixed.add(c);
  }
  const hits:number[]=[], blocked:number[]=[], own:number[][]=model.fleet.map(()=>[]);
  let hasAnonymous=false;
  for(let c=0;c<n;c++) {
    const status=state.cells[c]!, owner=state.hitShip?.[c]??null;
    if((status===3)!==fixed.has(c))return fail('invalid-input','Sunk cells must match identified hulls exactly.');
    if(owner!==null&&(!Number.isInteger(owner)||owner<0||owner>=model.fleet.length||
      (status!==2&&status!==3)))return fail('invalid-input','Invalid hit owner.');
    if(status===3&&owner!==null&&!state.sunk.some(s=>s.ship===owner&&s.cells.includes(c)))
      return fail('invalid-input','Sunk owner does not match hull.');
    if(status===2) {
      hits.push(c);
      if(owner!==null) {if(sunken.has(owner))return fail('contradiction','An unresolved hit belongs to a sunk ship.');own[owner]!.push(c);}
      else hasAnonymous=true;
    }
    if(status===1||status===3)blocked.push(c);
  }
  const blockedMask=mask(blocked),groups:Candidates[]=[];
  for(let ship=0;ship<model.fleet.length;ship++) {
    if(sunken.has(ship))continue;
    const required=mask(own[ship]!);
    const forbidden=mask(hits.filter(c=>state.hitShip?.[c]!=null&&state.hitShip[c]!==ship));
    const ps=model.placements[ship]!.filter(p=>!overlaps(p,blockedMask)&&!overlaps(p,forbidden)&&contains(p,required)&&p.cells.some(c=>state.cells[c]===0));
    if(!ps.length)return fail('contradiction','An unsunk ship has no legal placement.');
    groups.push({ship,ps,namedHits:own[ship]!.length});
  }
  groups.sort((x,y)=>x.ps.length-y.ps.length||x.ship-y.ship);
  const hitMask=mask(hits);
  // Every candidate already covers its own named hits. Only anonymous hits
  // need the union-of-candidates necessary coverage check.
  if(hasAnonymous) {
    let a=0,b=0,c=0,d=0;
    for(const g of groups)for(const placement of g.ps){a|=placement.a;b|=placement.b;c|=placement.c;d|=placement.d;}
    if(!contains({a,b,c,d},hitMask))return fail('contradiction','An unresolved hit cannot be covered.');
  }
  return {ok:true,value:{groups,hits:hitMask,blocked:blockedMask,hasHits:hits.length>0,hasAnonymous}};
}
function exact(model:Model,state:State,p:Prepared,maxNodes:number):Result<Density> {
  const n=model.size*model.size,counts=Array<number>(n).fill(0),targets=Array<number>(n).fill(0);
  let total=0,nodes=0,exhausted=false;
  const chosen:Placement[]=[];
  const suffix=suffixMasks(p.groups);
  function visit(depth:number,used:Mask):void {
    if(++nodes>maxNodes){exhausted=true;return;}
    if(!contains(union(used,suffix[depth]!),p.hits))return;
    if(depth===p.groups.length) {
      if(!contains(used,p.hits))return;
      total++;
      for(const ship of chosen) {
        const hit=ship.cells.some(c=>state.cells[c]===2);
        for(const c of ship.cells){counts[c]!++;if(hit)targets[c]!++;}
      }
      return;
    }
    for(const q of p.groups[depth]!.ps) {
      if(overlaps(q,used))continue;
      chosen.push(q);visit(depth+1,union(used,q));chosen.pop();
      if(exhausted)return;
    }
  }
  visit(0,zero());
  if(exhausted)return fail('budget-exceeded',`Exact enumeration exceeded ${maxNodes} search nodes; no partial density returned.`);
  if(!total)return fail('contradiction','No complete legal fleet matches the observations.');
  // maxNodes is <= 2^32, hence integer accumulators are EXACT before BigInt conversion.
  return {ok:true,value:{method:'exact',probability:counts.map(x=>x/total),target:targets.map(x=>x/total),
    total:BigInt(total),counts:counts.map(BigInt),proposals:0,accepted:0,effectiveSamples:total,nodes,audit:[]}};
}
function sampled(model:Model,state:State,p:Prepared,rng:Rng,samples:number,audit:boolean):Result<Density> {
  const n=model.size*model.size, density=Array<number>(n).fill(0),target=Array<number>(n).fill(0);
  const records:AuditSample[]=[];
  let denominator=0,sumSquares=0,accepted=0;
  // Proposal weights are needed only on the sampled path. Exact inference,
  // Easy/Medium decisions and feedback validation avoid these allocations.
  const hasAnonymous=p.hasAnonymous;
  const groups=p.groups.map(g=>({...g,weights:hasAnonymous?g.ps.map(move=>{
    let anonymous=0;for(const cell of move.cells)if(state.cells[cell]===2&&state.hitShip?.[cell]==null)anonymous++;
    return Math.pow(32,anonymous);
  }):null}));
  const chosen:Placement[]=[];
  const suffix=suffixMasks(p.groups),conditional:Placement[]=[];
  for(let attempt=0;attempt<samples;attempt++) {
    chosen.length=0;
    let used=zero(),weight=1,rejected=false;
    for(let depth=0;depth<p.groups.length;depth++) {
      const g=groups[depth]!, mandatory=subtract(p.hits,union(used,suffix[depth+1]!));
      let z=0;
      for(let j=0;j<g.ps.length;j++)if(!overlaps(g.ps[j]!,used)&&contains(g.ps[j]!,mandatory))z+=g.weights?.[j]??1;
      if(!z){rejected=true;break;}
      const u=random(rng);if(u===null)return fail('invalid-rng','RNG must return a finite number in [0,1).');
      let cut=u*z,pick=-1;
      for(let j=0;j<g.ps.length;j++)if(!overlaps(g.ps[j]!,used)&&contains(g.ps[j]!,mandatory)) {
        cut-=g.weights?.[j]??1;if(cut<0){pick=j;break;}
      }
      // Integer z/weights guarantee a pick even for the largest valid binary64 RNG value.
      if(pick<0)return fail('invalid-rng','RNG selection overflow.');
      weight*=z/(g.weights?.[pick]??1);
      const q=g.ps[pick]!;chosen.push(q);used=union(used,q);
    }
    if(rejected||!contains(used,p.hits))continue;
    accepted++;denominator+=weight;sumSquares+=weight*weight;
    if(audit) {
      const world:(readonly number[])[]=Array(model.fleet.length);
      // These hulls belong to readonly model/state inputs. Sharing them keeps
      // complete per-shot audits inexpensive; no input hull is modified.
      for(const s of state.sunk)world[s.ship]=s.cells;
      for(let i=0;i<p.groups.length;i++)world[p.groups[i]!.ship]=chosen[i]!.cells;
      records.push({world,weight});
    }
    // Rao-Blackwellization: condition on the other ships, then enumerate this ship's
    // legal conditional placements uniformly. NEVER count overlapping partial fleets.
    for(let i=0;i<p.groups.length;i++) {
      const q=chosen[i]!,other=subtract(used,q),need=subtract(p.hits,other),g=p.groups[i]!;
      conditional.length=0;
      for(const move of g.ps)if(!overlaps(move,other)&&contains(move,need))conditional.push(move);
      const contribution=weight/conditional.length,hit=!empty(need);
      for(const move of conditional)
        for(const c of move.cells){density[c]!+=contribution;if(hit)target[c]!+=contribution;}
    }
  }
  if(!accepted)return fail('sample-exhausted','No consistent sample found within the proposal budget; this is NOT proof of contradiction.');
  return {ok:true,value:{method:'sampled',probability:density.map(x=>x/denominator),target:target.map(x=>x/denominator),
    proposals:samples,accepted,effectiveSamples:denominator*denominator/sumSquares,nodes:0,audit:records}};
}
function infer(model:Model,state:State,p:Prepared,rng:Rng,options:Options):Result<Density> {
  const maxNodes=options.maxNodes??1_000_000,samples=options.samples??8,mode=options.mode??'auto';
  if(!Number.isInteger(maxNodes)||maxNodes<1||maxNodes>4294967296||!Number.isInteger(samples)||samples<1||samples>100_000||
    !['auto','exact','sampled'].includes(mode))return fail('invalid-input','Invalid inference options.');
  if(mode==='exact')return exact(model,state,p,maxNodes);
  let product=1;for(const g of p.groups)product*=g.ps.length;
  if(mode==='auto'&&product<=2000)return exact(model,state,p,maxNodes);
  return sampled(model,state,p,rng,samples,options.audit??false);
}
export function probabilityDensity(model:Model,state:State,rng:Rng,options:Options={}):Result<Density> {
  const result=prepare(model,state);if(!result.ok)return result;
  return infer(model,state,result.value,rng,options);
}
function neighbours(c:number,size:number):number[] {
  const out:number[]=[],r=Math.floor(c/size),col=c%size;
  if(r>0)out.push(c-size);if(col>0)out.push(c-1);if(col+1<size)out.push(c+1);if(r+1<size)out.push(c+size);
  return out;
}
function choose(candidates:readonly number[],rng:Rng):Result<number> {
  if(!candidates.length)return fail('game-over','No unshot cell remains.');
  const u=random(rng);return u===null?fail('invalid-rng','RNG must return a finite number in [0,1).'):{ok:true,value:candidates[Math.floor(u*candidates.length)]!};
}
/** Every returned cell is unknown in the supplied state. No state/model is mutated. */
export function chooseShot(model:Model,state:State,difficulty:Difficulty,rng:Rng,options:Options={}):Result<ShotChoice> {
  if(!['easy','medium','hard'].includes(difficulty))return fail('invalid-input','Unknown difficulty.');
  const prepared=prepare(model,state);if(!prepared.ok)return prepared;
  if(!prepared.value.groups.length)return fail('game-over','All ships have been sunk.');
  const unshot:number[]=[];
  for(let c=0;c<state.cells.length;c++)if(state.cells[c]===0)unshot.push(c);
  if(!unshot.length)return fail('game-over','No unshot cells remain.');
  if(difficulty==='hard') {
    let result=infer(model,state,prepared.value,rng,options);
    // An empty batch is a sampling failure, not a contradictory observation.
    if(!result.ok && result.error==='sample-exhausted' && (options.mode??'auto')==='auto')
      result=sampled(model,state,prepared.value,rng,128,options.audit??false);
    // On a rare rejected batch, bounded exact search can prove/resolve the state.
    // Never silently substitute an independent-ship heuristic for joint inference.
    if(!result.ok && result.error==='sample-exhausted' && (options.mode??'auto')==='auto')
      result=exact(model,state,prepared.value,Math.min(options.maxNodes??50_000,50_000));
    if(!result.ok)return result;
    const d=result.value,hasHits=prepared.value.hasHits;
    const shortest=Math.min(...prepared.value.groups.map(g=>model.fleet[g.ship]!));
    const parity=unshot.filter(c=>(Math.floor(c/model.size)+c%model.size)%shortest===0);
    const pool=!hasHits&&parity.length?parity:unshot;
    const values=hasHits?d.target:d.probability;
    let best=-Infinity;const ties:number[]=[];
    for(const c of pool)best=Math.max(best,values[c]!);
    for(const c of pool)if(best-values[c]!<=1e-12)ties.push(c);
    const pick=choose(ties,rng);return pick.ok?{ok:true,value:{cell:pick.value,method:d.method,density:d}}:pick;
  }
  const scores=Array<number>(state.cells.length).fill(0);
  if(difficulty==='easy') {
    for(let c=0;c<state.cells.length;c++)if(state.cells[c]===2)
      for(const t of neighbours(c,model.size))if(state.cells[t]===0)scores[t]=1;
  }else {
    // Target legal straight extensions; never merge neighbouring ships into one hull.
    for(const g of prepared.value.groups) {
      if(!prepared.value.hasAnonymous&&g.namedHits===0)continue;
      for(const p of g.ps) {
      let hits=g.namedHits;
      if(prepared.value.hasAnonymous){hits=0;for(const cell of p.cells)if(state.cells[cell]===2)hits++;}
      if(hits)for(const c of p.cells)if(state.cells[c]===0)scores[c]!+=hits*hits;
      }
    }
  }
  const best=Math.max(...unshot.map(c=>scores[c]!));
  let pool=best>0?unshot.filter(c=>scores[c]===best):unshot;
  if(best===0&&difficulty==='medium') {
    const length=Math.min(...prepared.value.groups.map(g=>model.fleet[g.ship]!));
    const parity=pool.filter(c=>(Math.floor(c/model.size)+c%model.size)%length===0);
    if(parity.length)pool=parity;
  }
  const pick=choose(pool,rng);
  return pick.ok?{ok:true,value:{cell:pick.value,method:best>0?'target':'hunt'}}:pick;
}
/** Apply public feedback. On a sink, supply the hull already established by named hits,
 * or the hull explicitly revealed by the host. Never infer it from mere adjacency. */
export function recordShot(model:Model,state:State,cell:number,feedback:
  {readonly result:'miss'}|{readonly result:'hit';readonly ship?:number}|{readonly result:'sunk';readonly ship:number;readonly cells:readonly number[]}
):Result<State> {
  const valid=prepare(model,state);if(!valid.ok)return valid;
  if(!Number.isInteger(cell)||cell<0||cell>=state.cells.length||state.cells[cell]!==0)
    return fail('invalid-input','A shot must address an unknown cell.');
  const cells=[...state.cells],owners=state.hitShip?[...state.hitShip]:Array<number|null>(cells.length).fill(null),sunk=[...state.sunk];
  if(feedback.result==='miss')cells[cell]=1;
  else if(feedback.result==='hit') {cells[cell]=2;owners[cell]=feedback.ship??null;}
  else if(feedback.result==='sunk') {
    if(!feedback.cells.includes(cell)||feedback.cells.some(c=>c!==cell&&(state.cells[c]!==2||(state.hitShip?.[c]!=null&&state.hitShip[c]!==feedback.ship))))
      return fail('invalid-input','Every other cell in a newly sunk hull must already be hit.');
    for(const c of feedback.cells){cells[c]=3;owners[c]=feedback.ship;}
    sunk.push({ship:feedback.ship,cells:[...feedback.cells]});
  }else return fail('invalid-input','Unknown feedback.');
  const next:State={cells,hitShip:owners,sunk};const checked=prepare(model,next);
  return checked.ok?{ok:true,value:next}:checked;
}
