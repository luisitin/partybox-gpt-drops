/** Independently authored from the public B11 contract and publisher's rules. */
export type Color = 'red' | 'blue' | 'black' | 'orange';
export interface Face { readonly color: Color; readonly value: number; }
export interface NumberTile extends Face { readonly id: string; readonly kind: 'number'; }
export interface JokerTile { readonly id: string; readonly kind: 'joker'; }
export type Tile = NumberTile | JokerTile;
export type PlacedTile = NumberTile | (JokerTile & { readonly as: Face });
export interface Meld { readonly kind: 'run' | 'group'; readonly tiles: readonly PlacedTile[]; }
export interface Position { readonly table: readonly Meld[]; readonly hand: readonly Tile[]; readonly initialMeldDone: boolean; }
export type Failure = { readonly ok: false; readonly error: { readonly code: string; readonly message: string } };
export type Validation = { readonly ok: true } | Failure;
export type PlayValidation = Failure | { readonly ok: true; readonly played: readonly string[]; readonly value: number; readonly rackPenaltyShed: number };
export type SolveResult = Failure | { readonly ok: true; readonly action: 'play' | 'pass'; readonly table: readonly Meld[]; readonly played: readonly string[]; readonly remainingHand: readonly Tile[]; readonly value: number; readonly rackPenaltyShed: number; readonly initialMeldDone: boolean; readonly optimal: true; readonly stats: { readonly states: number; readonly memoHits: number; readonly boundPrunes: number; readonly candidates: number } };
const COLORS: readonly Color[] = ['red', 'blue', 'black', 'orange'];
const failure = (code: string): Failure => ({ok: false, error: {code, message: code}});
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const face = (value: unknown): value is Face => record(value) && COLORS.includes(value.color as Color) && Number.isInteger(value.value) && (value.value as number) >= 1 && (value.value as number) <= 13;
function physical(value: unknown): value is Tile {
  return record(value) && typeof value.id === 'string' && value.id.length > 0 && (value.kind === 'joker' || (value.kind === 'number' && face(value)));
}
function placed(value: unknown): value is PlacedTile {
  return physical(value) && (value.kind === 'number' || (record(value) && face(value.as)));
}
const represented = (tile: PlacedTile): Face => tile.kind === 'number' ? tile : tile.as;
function inventory(tiles: readonly Tile[]): boolean {
  if (tiles.length > 106) return false;
  const ids = new Set<string>(), counts = new Map<string, number>(); let jokers = 0;
  for (const tile of tiles) {
    if (ids.has(tile.id)) return false;
    ids.add(tile.id);
    if (tile.kind === 'joker') { if (++jokers > 2) return false; }
    else { const key = tile.color + ':' + tile.value, count = (counts.get(key) ?? 0) + 1; if (count > 2) return false; counts.set(key, count); }
  }
  return true;
}
function legalMeld(value: unknown): value is Meld {
  if (!record(value) || !Array.isArray(value.tiles) || value.tiles.length < 3 || !value.tiles.every(placed)) return false;
  const tiles: PlacedTile[] = value.tiles, first = represented(tiles[0]!);
  if (value.kind === 'run') return tiles.every((tile, index) => { const f = represented(tile); return f.color === first.color && f.value === first.value + index; });
  if (value.kind === 'group') return tiles.length <= 4 && new Set(tiles.map(tile => represented(tile).color)).size === tiles.length && tiles.every(tile => represented(tile).value === first.value);
  return false;
}
function readTable(value: unknown): readonly Meld[] | undefined {
  if (!Array.isArray(value) || !value.every(legalMeld)) return undefined;
  const table: Meld[] = value;
  return inventory(table.flatMap(meld => meld.tiles)) ? table : undefined;
}
function readPosition(value: unknown): Position | undefined {
  if (!record(value) || typeof value.initialMeldDone !== 'boolean' || !Array.isArray(value.hand) || !value.hand.every(physical)) return undefined;
  const table = readTable(value.table);
  if (!table) return undefined;
  const hand: Tile[] = value.hand;
  return inventory([...table.flatMap(meld => meld.tiles), ...hand]) ? {table, hand, initialMeldDone: value.initialMeldDone} : undefined;
}
export function validateTable(value: unknown): Validation { return readTable(value) ? {ok: true} : failure('table'); }
export function validatePosition(value: unknown): Validation { return readPosition(value) ? {ok: true} : failure('position'); }
const samePhysical = (a: Tile, b: Tile): boolean => a.id === b.id && a.kind === b.kind && (a.kind === 'joker' || (b.kind === 'number' && a.color === b.color && a.value === b.value));
const samePlaced = (a: PlacedTile, b: PlacedTile): boolean => samePhysical(a,b) && (a.kind === 'number' || (b.kind === 'joker' && a.as.color === b.as.color && a.as.value === b.as.value));
const sameMeld = (a: Meld, b: Meld): boolean => a.kind === b.kind && a.tiles.length === b.tiles.length && a.tiles.every(tile => {const other=b.tiles.find(value=>value.id===tile.id);return other!==undefined && samePlaced(tile,other);});
export function validatePlay(before: unknown, after: unknown): PlayValidation {
  const position = readPosition(before), table = readTable(after);
  if (!position || !table) return failure('input');
  const old = position.table.flatMap(meld => meld.tiles), rackIds = new Set(position.hand.map(tile => tile.id));
  const available = new Map<string,Tile>([...old,...position.hand].map(tile => [tile.id,tile]));
  const output = table.flatMap(meld => meld.tiles), present = new Set(output.map(tile => tile.id));
  for (const tile of output) { const original = available.get(tile.id); if (!original || !samePhysical(original,tile)) return failure('physical'); }
  if (old.some(tile => !present.has(tile.id))) return failure('old-tile-missing');
  const added = output.filter(tile => rackIds.has(tile.id));
  if (!added.length) return failure('no-rack-tile');
  const value = added.reduce((sum,tile) => sum + represented(tile).value,0);
  if (!position.initialMeldDone && (value < 30 || position.table.some(meld => !table.some(next => sameMeld(meld,next))))) return failure('opening');
  return {ok: true, played: added.map(tile => tile.id), value, rackPenaltyShed: added.reduce((sum,tile) => sum + (tile.kind === 'joker' ? 30 : tile.value),0)};
}
const copyTile = (tile: Tile): Tile => tile.kind === 'number' ? {id:tile.id,kind:'number',color:tile.color,value:tile.value} : {id:tile.id,kind:'joker'};
const copyPlaced = (tile: PlacedTile): PlacedTile => tile.kind === 'number' ? {id:tile.id,kind:'number',color:tile.color,value:tile.value} : {id:tile.id,kind:'joker',as:{color:tile.as.color,value:tile.as.value}};
const copyMeld = (meld: Meld): Meld => ({kind:meld.kind,tiles:meld.tiles.map(copyPlaced)});
interface Candidate { readonly mask: bigint; readonly meld: Meld; readonly value: number; readonly count: number; }
interface Outcome { readonly value: number; readonly count: number; readonly melds: readonly Meld[]; }
const EMPTY: Outcome = {value:0,count:0,melds:[]};
const better = (a: Outcome,b: Outcome): boolean => a.value > b.value || (a.value === b.value && a.count > b.count);

/** Every physical subset is inspected; joker assignments follow possible faces. */
function subsetMelds(tiles: readonly Tile[]): Meld[] {
  if (tiles.length < 3 || tiles.length > 13) return [];
  const natural = tiles.filter((tile): tile is NumberTile => tile.kind === 'number');
  const jokers = tiles.filter((tile): tile is JokerTile => tile.kind === 'joker');
  const first = natural[0]; if (!first || jokers.length > 2) return [];
  const out: Meld[] = [];
  if (tiles.length <= 4 && natural.every(tile => tile.value === first.value) && new Set(natural.map(tile => tile.color)).size === natural.length) {
    const absent = COLORS.filter(color => !natural.some(tile => tile.color === color));
    const assign = (index: number, chosen: PlacedTile[], colors: readonly Color[]): void => {
      if (index === jokers.length) { out.push({kind:'group',tiles:[...natural,...chosen]}); return; }
      for (const color of colors) assign(index+1,[...chosen,{id:jokers[index]!.id,kind:'joker',as:{color,value:first.value}}],colors.filter(value => value !== color));
    }; assign(0,[],absent);
  }
  if (natural.every(tile => tile.color === first.color) && new Set(natural.map(tile => tile.value)).size === natural.length) {
    for (let start=1; start+tiles.length-1<=13; start++) {
      if (natural.some(tile => tile.value < start || tile.value >= start+tiles.length)) continue;
      const gaps = Array.from({length:tiles.length},(_,index) => start+index).filter(value => !natural.some(tile => tile.value === value));
      if (gaps.length !== jokers.length) continue;
      const orders = jokers.length === 2 ? [jokers,[jokers[1]!,jokers[0]!]] : [jokers];
      for (const order of orders) {
        const all: PlacedTile[] = [...natural,...order.map((tile,index): PlacedTile => ({id:tile.id,kind:'joker',as:{color:first.color,value:gaps[index]!}}))];
        all.sort((a,b)=>represented(a).value-represented(b).value);out.push({kind:'run',tiles:all});
      }
    }
  }
  return out;
}
function collect(tiles: readonly Tile[], mandatory: number): Candidate[] {
  const index = new Map(tiles.map((tile,i)=>[tile.id,i])), map = new Map<bigint,Candidate>();
  const add = (meld: Meld): void => {
    let mask=0n,value=0,count=0;
    for (const tile of meld.tiles) { const at=index.get(tile.id)!;mask |= 1n<<BigInt(at);if (at>=mandatory) {value+=represented(tile).value;count++;} }
    const previous=map.get(mask);if (!previous || value>previous.value) map.set(mask,{mask,meld,value,count});
  };
  if (tiles.length <= 14) {
    // Literal enumeration: no geometric candidate generation in the small oracle.
    const end=2**tiles.length,count=new Uint8Array(end),colors=new Uint8Array(end),values=new Uint16Array(end),duplicates=new Uint8Array(end);
    const bits=tiles.map(tile=>tile.kind==='joker'?null:{color:2**COLORS.indexOf(tile.color),value:2**tile.value});
    for (let mask=1; mask<end; mask++) {
      const previous=mask&(mask-1),at=31-Math.clz32(mask^previous),f=bits[at];
      count[mask]=count[previous]!+1;colors[mask]=colors[previous]!;values[mask]=values[previous]!;duplicates[mask]=duplicates[previous]!;
      if (f) {duplicates[mask]=duplicates[mask]!|(colors[previous]!&f.color?2:0)|(values[previous]!&f.value?1:0);colors[mask]=colors[mask]!|f.color;values[mask]=values[mask]!|f.value;}
      if (count[mask]!<3 || count[mask]!>13) continue;
      const c=colors[mask]!,v=values[mask]!,d=duplicates[mask]!;
      const maybeGroup=count[mask]!<=4 && (d&2)===0 && v!==0 && (v&(v-1))===0;
      const maybeRun=(d&1)===0 && c!==0 && (c&(c-1))===0;
      if (!maybeGroup && !maybeRun) continue;
      const subset=tiles.filter((_,index)=>(mask & 2**index)!==0);
      for (const meld of subsetMelds(subset)) add(meld);
    }
  } else {
    const numbers=tiles.filter((tile):tile is NumberTile=>tile.kind==='number'),jokers=tiles.filter((tile):tile is JokerTile=>tile.kind==='joker');
    const faces = new Map<string,NumberTile[]>();
    for (const tile of numbers) {const key=tile.color+':'+tile.value;faces.set(key,[...(faces.get(key)??[]),tile]);}
    const fill = (wanted: readonly Face[],kind:'run'|'group'): void => {
      const walk = (at:number,chosen:PlacedTile[],used:Set<string>):void => {
        if (at===wanted.length) {add({kind,tiles:chosen});return;}
        const f=wanted[at]!;
        for (const tile of faces.get(f.color+':'+f.value)??[]) if (!used.has(tile.id)) walk(at+1,[...chosen,tile],new Set([...used,tile.id]));
        for (const tile of jokers) if (!used.has(tile.id)) walk(at+1,[...chosen,{id:tile.id,kind:'joker',as:f}],new Set([...used,tile.id]));
      };walk(0,[],new Set());
    };
    for (const color of COLORS) for (let start=1;start<=11;start++) for (let end=start+2;end<=13;end++) fill(Array.from({length:end-start+1},(_,i)=>({color,value:start+i})),'run');
    for (let value=1;value<=13;value++) for (let colors=1;colors<16;colors++) {const selected=COLORS.filter((_,i)=>(colors&2**i)!==0);if (selected.length>=3) fill(selected.map(color=>({color,value})),'group');}
  }
  return [...map.values()];
}
export function findBestPlay(input: unknown): SolveResult {
  const position=readPosition(input);if (!position) return failure('position');
  const previous=position.table.flatMap(meld=>meld.tiles),mandatory=position.initialMeldDone?previous.length:0;
  const tiles:Tile[]=position.initialMeldDone?[...previous,...position.hand]:[...position.hand];
  const candidates=collect(tiles,mandatory),buckets:Candidate[][]=tiles.map(()=>[]);
  for (const candidate of candidates) for (let i=0;i<tiles.length;i++) if ((candidate.mask & (1n<<BigInt(i)))!==0n) buckets[i]!.push(candidate);
  for (const bucket of buckets) bucket.sort((a,b)=>b.value-a.value || b.count-a.count);
  const required=(1n<<BigInt(mandatory))-1n,memo=new Map<bigint,Outcome|null>();let states=0,memoHits=0,boundPrunes=0;
  const search=(left:bigint):Outcome|null=>{
    if (left===0n) return EMPTY;
    if (memo.has(left)) {memoHits++;return memo.get(left)!;}states++;
    let pivot=-1,choices:Candidate[]=[],least=Number.POSITIVE_INFINITY;
    const needed=left&required;
    for (let i=0;i<tiles.length;i++) if (((needed || left)&(1n<<BigInt(i)))!==0n) {
      const feasible=buckets[i]!.filter(candidate=>(candidate.mask&left)===candidate.mask);
      if (feasible.length<least) {pivot=i;choices=feasible;least=feasible.length;if (!least) break;}
    }
    let best:Outcome|null=pivot>=mandatory?search(left^(1n<<BigInt(pivot))):null;
    let upperValue=0,upperCount=0;
    for (let i=mandatory;i<tiles.length;i++) if ((left&(1n<<BigInt(i)))!==0n) {const tile=tiles[i]!;upperValue+=tile.kind==='joker'?13:tile.value;upperCount++;}
    for (const candidate of choices) {
      if (best && best.value===upperValue && best.count===upperCount) {boundPrunes++;break;}
      const tail=search(left^candidate.mask);if (!tail) continue;
      const result:Outcome={value:candidate.value+tail.value,count:candidate.count+tail.count,melds:[candidate.meld,...tail.melds]};
      if (!best || better(result,best)) best=result;
    }
    memo.set(left,best);return best;
  };
  const best=search((1n<<BigInt(tiles.length))-1n),stats={states,memoHits,boundPrunes,candidates:candidates.length};
  if (!best || best.count===0 || (!position.initialMeldDone && best.value<30)) return {ok:true,action:'pass',table:position.table.map(copyMeld),played:[],remainingHand:position.hand.map(copyTile),value:0,rackPenaltyShed:0,initialMeldDone:position.initialMeldDone,optimal:true,stats};
  const table=position.initialMeldDone?best.melds.map(copyMeld):[...position.table.map(copyMeld),...best.melds.map(copyMeld)];
  const checked=validatePlay(position,table);if (!checked.ok) throw new Error('Independent solver produced invalid table: '+checked.error.code);
  const ids=new Set(checked.played);
  return {ok:true,action:'play',table,played:checked.played,remainingHand:position.hand.filter(tile=>!ids.has(tile.id)).map(copyTile),value:checked.value,rackPenaltyShed:checked.rackPenaltyShed,initialMeldDone:true,optimal:true,stats};
}
