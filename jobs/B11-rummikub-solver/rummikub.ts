/**
 * Rummikub Classic, official English 2019 end-of-turn rules.
 * Pure, deterministic, dependency-free; all mutation is invocation-local.
 * Jokers have explicit bindings on the table, never an ambiguous score.
 * See SOURCES.md, ALGORITHM.md and VERIFY.md for scope and evidence.
 */
export type Color = 'red' | 'blue' | 'black' | 'orange';
export interface Face { readonly color: Color; readonly value: number }
export interface NumberTile extends Face { readonly id: string; readonly kind: 'number' }
export interface JokerTile { readonly id: string; readonly kind: 'joker' }
export type Tile = NumberTile | JokerTile;
export type PlacedTile = NumberTile | (JokerTile & { readonly as: Face });
export interface Meld { readonly kind: 'run' | 'group'; readonly tiles: readonly PlacedTile[] }
export interface Position {
  readonly table: readonly Meld[];
  readonly hand: readonly Tile[];
  readonly initialMeldDone: boolean;
}
export interface Failure { readonly ok: false; readonly error: { readonly code: string; readonly message: string } }
export type Validation = { readonly ok: true } | Failure;
export type PlayValidation = Failure | {
  readonly ok: true;
  /** IDs originally on the rack, not all IDs in rearranged sets. */
  readonly played: readonly string[];
  /** Sum of represented values of played rack tiles, including rack jokers. */
  readonly value: number;
  /** Distinct from meld value: a joker remaining on a rack has a 30-point penalty. */
  readonly rackPenaltyShed: number;
};
export interface SearchStats {
  readonly states: number;
  readonly memoHits: number;
  readonly boundPrunes: number;
  readonly candidates: number;
}
export type SolveResult = Failure | {
  readonly ok: true;
  readonly action: 'play' | 'pass';
  readonly table: readonly Meld[];
  readonly played: readonly string[];
  readonly remainingHand: readonly Tile[];
  readonly value: number;
  readonly rackPenaltyShed: number;
  readonly initialMeldDone: boolean;
  readonly optimal: true;
  readonly stats: SearchStats;
};
const COLORS: readonly Color[] = ['red', 'blue', 'black', 'orange'];
const SCALE = 128; // >106: a one-point improvement dominates every tile-count tie.
const invalid = (code: string, message: string): Failure => ({ ok: false, error: { code, message } });
const record = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
function validFace(x: unknown): x is Face {
  return record(x) && COLORS.includes(x['color'] as Color)
    && typeof x['value'] === 'number' && Number.isInteger(x['value'])
    && x['value'] >= 1 /* M08 */ && x['value'] <= 13 /* M07 */;
}
function validTile(x: unknown, onTable: boolean): x is Tile | PlacedTile {
  if (!record(x) || typeof x['id'] !== 'string' || x['id'].length === 0) return false;
  if (x['kind'] === 'number') return validFace(x);
  if (x['kind'] !== 'joker') return false;
  return !onTable || validFace(x['as']); // M12
}
function faceOf(t: PlacedTile): Face { return t.kind === 'number' ? t : t.as; }
function physicalSame(a: Tile, b: Tile): boolean {
  return a.kind === b.kind && (a.kind === 'joker'
    || (b.kind === 'number' && a.color === b.color && a.value === b.value));
}
function checkInventory(tiles: readonly Tile[]): Validation {
  if (tiles.length > 106) return invalid('DECK_SIZE', 'At most 106 physical tiles exist.');
  const seen = new Set<string>();
  const copies = new Map<number, number>();
  let jokers = 0;
  for (const t of tiles) {
    if (seen.has(t.id)) return invalid('DUPLICATE_ID', 'A physical tile ID occurs twice.'); // M11
    seen.add(t.id);
    if (t.kind === 'joker') {
      if (++jokers > 2) return invalid('JOKER_COUNT', 'At most two physical jokers exist.'); // M09
    } else {
      const type = COLORS.indexOf(t.color) * 13 + t.value - 1;
      const count = (copies.get(type) ?? 0) + 1;
      if (count > 2) return invalid('COPY_COUNT', 'At most two copies of a numbered tile exist.'); // M10
      copies.set(type, count);
    }
  }
  return { ok: true };
}
/** Validates complete, explicitly bound, ordered runs and unordered groups. */
export function validateTable(input: unknown): Validation {
  if (!Array.isArray(input)) return invalid('TABLE_SHAPE', 'The table must be an array of melds.');
  const all: PlacedTile[] = [];
  for (const entry of input as unknown[]) {
    if (!record(entry) || !Array.isArray(entry['tiles'])) return invalid('MELD_SHAPE', 'Invalid meld.');
    const raw: unknown[] = entry['tiles'];
    if (raw.length < 3) return invalid('MELD_SHORT', 'Every meld needs at least three tiles.'); // M01
    if (!raw.every(t => validTile(t, true))) return invalid('TILE_SHAPE', 'Invalid tile or joker binding.');
    const tiles = raw as PlacedTile[];
    const faces = tiles.map(faceOf);
    if (entry['kind'] === 'group') {
      if (tiles.length > 4) return invalid('GROUP_LONG', 'A group has at most four tiles.'); // M02
      if (new Set(faces.map(f => f.color)).size !== tiles.length) return invalid('GROUP_COLOR', 'Group colors must differ.'); // M03
      if (faces.some(f => f.value !== faces[0]!.value)) return invalid('GROUP_VALUE', 'Group values must match.'); // M04
    } else if (entry['kind'] === 'run') {
      if (faces.some(f => f.color !== faces[0]!.color)) return invalid('RUN_COLOR', 'A run uses one color.'); // M06
      if (faces.some((f, i) => i > 0 && f.value !== faces[i - 1]!.value + 1)) return invalid('RUN_GAP', 'Run numbers must be consecutive and ascending.'); // M05
    } else return invalid('MELD_KIND', 'Meld kind must be run or group.');
    all.push(...tiles);
    if (all.length > 106) return invalid('DECK_SIZE', 'At most 106 physical tiles exist.');
  }
  return checkInventory(all);
}
export function validatePosition(input: unknown): Validation {
  if (!record(input) || typeof input['initialMeldDone'] !== 'boolean' || !Array.isArray(input['hand']))
    return invalid('POSITION_SHAPE', 'Expected table, hand, and a boolean initialMeldDone.');
  const v = validateTable(input['table']);
  if (!v.ok) return v;
  const raw: unknown[] = input['hand'];
  if (!raw.every(t => validTile(t, false))) return invalid('HAND_TILE', 'Invalid rack tile.');
  return checkInventory([...(input['table'] as Meld[]).flatMap(m => m.tiles), ...(raw as Tile[])]);
}
function meldKey(m: Meld): string {
  const a = m.tiles.map(t => [t.id, faceOf(t).color, faceOf(t).value] as const);
  a.sort((x, y) => x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0);
  return JSON.stringify([m.kind, a]);
}
/** Validates a PLAY, not a draw/pass: at least one rack tile must be added. */
export function validatePlay(before: unknown, after: unknown): PlayValidation {
  const p = validatePosition(before);
  if (!p.ok) return p;
  const v = validateTable(after);
  if (!v.ok) return v;
  const position = before as Position;
  const table = after as readonly Meld[];
  const old = position.table.flatMap(m => m.tiles);
  const now = table.flatMap(m => m.tiles);
  const afterIds = new Set(now.map(t => t.id));
  if (old.some(t => !afterIds.has(t.id))) return invalid('TABLE_TILE_LOST', 'Every old table tile must stay on the table.'); // M16
  const allowed = new Map<string, Tile>([...old, ...position.hand].map(t => [t.id, t]));
  for (const t of now) {
    const original = allowed.get(t.id);
    if (!original) return invalid('FOREIGN_TILE', 'A played tile was not in this position.'); // M17
    if (original && !physicalSame(t, original)) return invalid('TILE_CHANGED', 'A physical tile cannot change its kind, number, or color.'); // M18
  }
  const handIds = new Set(position.hand.map(t => t.id));
  const played = now.filter(t => handIds.has(t.id));
  if (played.length === 0) return invalid('NO_RACK_TILE', 'A play must add at least one rack tile.'); // M19
  const value = played.reduce((n, t) => n + faceOf(t).value, 0);
  if (!position.initialMeldDone) {
    const keys = new Set(table.map(meldKey));
    if (position.table.some(m => !keys.has(meldKey(m)))) return invalid('INITIAL_TABLE_CHANGED', 'The opening turn cannot manipulate or extend old melds.'); // M15
    if (value < 30) return invalid('INITIAL_UNDER_30', 'The initial meld must reach 30 using rack tiles alone.'); // M13 M14
  }
  return { ok: true, played: played.map(t => t.id), value,
    rackPenaltyShed: played.reduce((n, t) => n + (t.kind === 'joker' ? 30 : t.value), 0) };
}
function copyTile(t: Tile): Tile {
  return t.kind === 'number' ? { id: t.id, kind: 'number', color: t.color, value: t.value }
    : { id: t.id, kind: 'joker' };
}
function copyTable(table: readonly Meld[]): Meld[] {
  return table.map(m => ({ kind: m.kind, tiles: m.tiles.map((t): PlacedTile => t.kind === 'number'
    ? { id: t.id, kind: 'number', color: t.color, value: t.value }
    : { id: t.id, kind: 'joker', as: { color: t.as.color, value: t.as.value } }) }));
}
interface Resource { readonly tiles: readonly Tile[]; readonly handCount: number; readonly joker: boolean }
interface Slot { readonly index: number; readonly face: Face }
interface Candidate {
  readonly lo: number; readonly hi: number;
  readonly kind: 'run' | 'group'; readonly slots: readonly Slot[];
  readonly weight: number; readonly upper: number;
}

/**
 * Exact count-resource weighted cover. No clock, randomness, cutoff, or heuristic
 * answer. It maximizes meld value, then the number of rack tiles played.
 * A finite search can still be expensive; measured latency is not a universal SLA.
 */
export function findBestPlay(input: unknown): SolveResult {
  const checked = validatePosition(input);
  if (!checked.ok) return checked;
  const position = input as Position;
  const old = position.initialMeldDone ? position.table.flatMap(m => m.tiles) : [];
  const tiles = [...old, ...position.hand];
  const handIds = new Set(position.hand.map(t => t.id));
  const resources: Resource[] = [];
  const typeIndex = new Map<number, number>();
  const grouped = new Map<number, Tile[]>();
  const jokerTiles: Tile[] = [];
  for (const t of tiles) {
    if (t.kind === 'joker') jokerTiles.push(t);
    else {
      const k = COLORS.indexOf(t.color) * 13 + t.value - 1;
      const a = grouped.get(k) ?? [];
      a.push(t); grouped.set(k, a);
    }
  }
  for (const [k, a] of [...grouped].sort((x, y) => (x[0] % 13) - (y[0] % 13) || x[0] - y[0])) {
    typeIndex.set(k, resources.length);
    resources.push({ tiles: a, handCount: a.filter(t => handIds.has(t.id)).length, joker: false });
  }
  const jokerIndices: number[] = [];
  for (const j of jokerTiles) {
    jokerIndices.push(resources.length);
    resources.push({ tiles: [j], handCount: handIds.has(j.id) ? 1 : 0, joker: true });
  }
  const typeUpper = resources.map(r => ((r.joker ? (r.handCount ? 13 : 0)
    : (r.tiles[0] as NumberTile).value) * SCALE + 1));
  let lo = 0, hi = 0, twiceLo = 0, twiceHi = 0;
  let handLo = 0, handHi = 0, twoHandLo = 0, twoHandHi = 0;
  let initialUpper = 0;
  for (let i = 0; i < resources.length; i++) {
    const r = resources[i]!, b = 1 << (i % 32);
    if (i < 32) {
      lo |= b; if (r.tiles.length === 2) twiceLo |= b;
      if (r.handCount > 0) handLo |= b; if (r.handCount === 2) twoHandLo |= b;
    } else {
      hi |= b; if (r.tiles.length === 2) twiceHi |= b;
      if (r.handCount > 0) handHi |= b; if (r.handCount === 2) twoHandHi |= b;
    }
    initialUpper += typeUpper[i]! * r.tiles.length;
  }
  const unique = new Map<string, Candidate>();
  function offer(kind: 'run' | 'group', slots: readonly Slot[]): void {
    let a = 0, b = 0, value = 0, upper = 0;
    for (const s of slots) {
      const r = resources[s.index]!;
      if (s.index < 32) a |= 1 << s.index; else b |= 1 << (s.index - 32);
      if (!r.joker || r.handCount > 0) value += s.face.value; // M20
      upper += typeUpper[s.index]!;
    }
    const weight = value * SCALE + slots.length;
    const key = `${a}/${b}`;
    if ((unique.get(key)?.weight ?? -1) < weight)
      unique.set(key, { lo: a, hi: b, kind, slots: slots.slice(), weight, upper });
  }
  function template(kind: 'run' | 'group', faces: readonly Face[]): void {
    const chosen: Slot[] = [];
    const visit = (p: number, usedJokers: number): void => {
      if (p === faces.length) { offer(kind, chosen); return; }
      const f = faces[p]!;
      const t = typeIndex.get(COLORS.indexOf(f.color) * 13 + f.value - 1);
      if (t !== undefined) { chosen.push({ index: t, face: f }); visit(p + 1, usedJokers); chosen.pop(); }
      for (let j = 0; j < jokerIndices.length; j++) { // M24
        if (usedJokers & (1 << j)) continue;
        chosen.push({ index: jokerIndices[j]!, face: f }); visit(p + 1, usedJokers | (1 << j)); chosen.pop();
      }
    };
    visit(0, 0);
  }
  for (let value = 1; value <= 13; value++) { // M22
    // Every 3-color group and the 4-color group, with every joker substitution.
    for (let missing = -1; missing < 4; missing++)
      template('group', COLORS.filter((_, i) => i !== missing).map(color => ({ color, value })));
  }
  for (const color of COLORS) { // M23
    // Every longer run partitions into lengths 3, 4 and 5; see the proof.
    for (let length = 3; length <= 5; length++) for (let start = 1; start + length - 1 <= 13; start++)
      template('run', Array.from({ length }, (_, i) => ({ color, value: start + i })));
  }
  const interchangeableJokers = jokerIndices.length === 2
    && resources[jokerIndices[0]!]!.handCount === resources[jokerIndices[1]!]!.handCount;
  const joker0 = jokerIndices[0] ?? -1, joker1 = jokerIndices[1] ?? -1;
  const hasIndex = (a: number, b: number, i: number): boolean =>
    i >= 0 && !!((i < 32 ? a : b) & (1 << (i % 32)));
  const jokerMask = (a: number, b: number): number =>
    (hasIndex(a, b, joker0) ? 1 : 0) | (hasIndex(a, b, joker1) ? 2 : 0);
  const candidates = [...unique.values()].sort((a, b) => b.weight - a.weight);
  // Once a joker is consumed, do not scan candidates requiring it. Preserve
  // descending weight order within all four precomputed availability lists.
  const byType: number[][][] = resources.map(() => [[], [], [], []]);
  candidates.forEach((m, index) => {
    const needed = jokerMask(m.lo, m.hi);
    for (let available = 0; available < 4; available++) {
      if ((needed & available) !== needed) continue;
      // Equal-origin jokers: label the first one used 0, not 1.
      if (interchangeableJokers && (available & 1) && (needed & 2) && !(needed & 1)) continue;
      for (const slot of m.slots) byType[slot.index]![available]!.push(index);
    }
  });
  // A run spans at most five values: only twenty numbered resources ahead
  // of the current pivot can differ from their original counts. Two extra
  // bits remember the physical jokers. This exact key fits in 48 integer bits.
  const window = (a: number, b: number, p: number): number =>
    (p < 32 ? (a >>> p) | (p === 0 ? 0 : b << (32 - p)) : b >>> (p - 32)) & 0xfffff;
  const first = (a: number, b: number): number => a !== 0
    ? 31 - Math.clz32(a & -a) : 63 - Math.clz32(b & -b);
  const stateKey = (a: number, b: number, c: number, d: number, p: number): number => {
    const js = jokerMask(a, b);
    return window(a, b, p) + window(c, d, p) * 1048576 + js * 1099511627776 + p * 4398046511104;
  };
  // Open-addressed integer memo: three typed arrays, no per-state objects.
  // Values pack (score + 1) and (choice + 64); 0 = empty, 1 = infeasible.
  // <=3477 pre-dedup candidates and <=106 tiles prove the 12-bit choice field.
  let capacity = 32768, entries = 0;
  let keysLo = new Uint32Array(capacity), keysHi = new Uint32Array(capacity);
  let values = new Uint32Array(capacity);
  const bucket = (a: number, b: number): number => {
    let h = Math.imul(a ^ Math.imul(b, 0x85ebca6b), 0x9e3779b1);
    h ^= h >>> 16;
    return h & (capacity - 1);
  };
  const getMemo = (key: number): number => {
    const a = key >>> 0, b = Math.floor(key / 4294967296);
    let i = bucket(a, b);
    while (values[i] !== 0) {
      if (keysLo[i] === a && keysHi[i] === b) return values[i]!;
      i = (i + 1) & (capacity - 1);
    }
    return 0;
  };
  const putMemo = (key: number, value: number): void => {
    if ((entries + 1) * 10 > capacity * 7) {
      const oldLo = keysLo, oldHi = keysHi, oldValues = values;
      capacity *= 2;
      keysLo = new Uint32Array(capacity); keysHi = new Uint32Array(capacity);
      values = new Uint32Array(capacity);
      for (let j = 0; j < oldValues.length; j++) if (oldValues[j] !== 0) {
        let i = bucket(oldLo[j]!, oldHi[j]!);
        while (values[i] !== 0) i = (i + 1) & (capacity - 1);
        keysLo[i] = oldLo[j]!; keysHi[i] = oldHi[j]!; values[i] = oldValues[j]!;
      }
    }
    const a = key >>> 0, b = Math.floor(key / 4294967296);
    let i = bucket(a, b);
    while (values[i] !== 0 && (keysLo[i] !== a || keysHi[i] !== b)) i = (i + 1) & (capacity - 1);
    if (values[i] === 0) entries++;
    keysLo[i] = a; keysHi[i] = b; values[i] = value;
  };
  let states = 0, memoHits = 0, boundPrunes = 0;
  const fits = (c: Candidate, a: number, b: number): boolean => (c.lo & a) === c.lo && (c.hi & b) === c.hi;
  function search(a: number, b: number, c: number, d: number, upper: number): number {
    if (a === 0 && b === 0) return 0;
    const pivot = first(a, b);
    const key = stateKey(a, b, c, d, pivot);
    const cached = getMemo(key);
    if (cached) { memoHits++; return cached === 1 ? -Infinity : Math.floor(cached / 4096) - 1; }
    states++;
    // Required residual copies are exactly remainingCount > originalHandCount.
    const reqLo = (a & ~handLo) | (c & ~twoHandLo); // M25
    const reqHi = (b & ~handHi) | (d & ~twoHandHi);
    const required = pivot >= 0 && !!((pivot < 32 ? reqLo : reqHi) & (1 << (pivot % 32)));
    let best = -Infinity, choice = -1;
    for (const index of byType[pivot]![jokerMask(a, b)]!) {
      const m = candidates[index]!;
      if (!fits(m, a, b)) continue;
      const restUpper = upper - m.upper;
      if (m.weight + restUpper <= best) { boundPrunes++; continue; }
      const s = m.weight + search(a ^ (m.lo & ~c), b ^ (m.hi & ~d),
        c & ~m.lo, d & ~m.hi, restUpper);
      if (s > best) { best = s; choice = index; }
      if (best === upper) break;
    }
    if (!required) {
      const bit = 1 << (pivot % 32);
      const u = upper - typeUpper[pivot]!;
      if (u > best) {
        const s = pivot < 32
          ? search(a ^ (bit & ~c), b, c & ~bit, d, u)
          : search(a, b ^ (bit & ~d), c, d & ~bit, u);
        if (s > best) { best = s; choice = -pivot - 2; }
      } else boundPrunes++;
    }
    putMemo(key, best === -Infinity ? 1 : (best + 1) * 4096 + choice + 64);
    return best;
  }
  const score = search(lo, hi, twiceLo, twiceHi, initialUpper);
  const stats: SearchStats = { states, memoHits, boundPrunes, candidates: candidates.length };
  const baseline = old.reduce((v, t) => v + (t.kind === 'number' ? t.value : 0), 0); // M21
  const value = Math.floor(score / SCALE) - baseline;
  const pass = (): SolveResult => ({ ok: true, action: 'pass', table: copyTable(position.table), played: [],
    remainingHand: position.hand.map(copyTile), value: 0, rackPenaltyShed: 0,
    initialMeldDone: position.initialMeldDone, optimal: true, stats });
  if (!Number.isFinite(score)) return invalid('INTERNAL_NO_COVER', 'A valid input table must have a cover.');
  if (value <= 0 || (!position.initialMeldDone && value < 30)) return pass();
  const selected: Candidate[] = [];
  while (lo !== 0 || hi !== 0) {
    const packed = getMemo(stateKey(lo, hi, twiceLo, twiceHi, first(lo, hi)));
    const choice = (packed & 4095) - 64;
    if (packed <= 1 || choice === -1) return invalid('INTERNAL_TRACE', 'Missing optimal-cover witness.');
    let a = 0, b = 0;
    if (choice < -1) {
      const i = -choice - 2;
      if (i < 32) a = 1 << i; else b = 1 << (i - 32);
    } else {
      const candidate = candidates[choice]!;
      selected.push(candidate); a = candidate.lo; b = candidate.hi;
    }
    lo ^= a & ~twiceLo; hi ^= b & ~twiceHi;
    twiceLo &= ~a; twiceHi &= ~b;
  }
  const consumed = resources.map(() => 0);
  const table: Meld[] = position.initialMeldDone ? [] : copyTable(position.table);
  for (const m of selected) {
    const placed = m.slots.map((s): PlacedTile => {
      const t = resources[s.index]!.tiles[consumed[s.index]!]!;
      consumed[s.index] = consumed[s.index]! + 1;
      return t.kind === 'number' ? { id: t.id, kind: 'number', color: t.color, value: t.value }
        : { id: t.id, kind: 'joker', as: { color: s.face.color, value: s.face.value } };
    });
    table.push({ kind: m.kind, tiles: placed });
  }
  // Independent API-level postcondition: never release an unchecked table/play.
  const checkedPlay = validatePlay(position, table);
  if (!checkedPlay.ok) return invalid('INTERNAL_OUTPUT_INVALID', JSON.stringify(checkedPlay.error));
  if (checkedPlay.value !== value) return invalid('INTERNAL_SCORE', 'Search score and physical play disagree.');
  const playedIds = new Set(checkedPlay.played);
  return { ok: true, action: 'play', table, played: checkedPlay.played,
    remainingHand: position.hand.filter(t => !playedIds.has(t.id)).map(copyTile), value,
    rackPenaltyShed: checkedPlay.rackPenaltyShed, initialMeldDone: true, optimal: true, stats };
}
