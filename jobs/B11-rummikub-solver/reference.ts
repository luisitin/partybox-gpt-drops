/**
 * Exhaustive physical-subset oracle. No production imports and no shared
 * legality predicates, candidate generator, search, or scoring code.
 * It deliberately considers melds of EVERY length, not only short runs.
 * The 14-tile limit is explicit: this is an oracle, not a fast large solver.
 * Authorship/isolation limitations are recorded in VERIFY.md.
 */
export type RefColor = 'red' | 'blue' | 'black' | 'orange';
export type RefTile =
  | { readonly id: string; readonly kind: 'number'; readonly color: RefColor; readonly value: number }
  | { readonly id: string; readonly kind: 'joker' };
export type RefPlaced = RefTile & { readonly as?: { readonly color: RefColor; readonly value: number } };
export interface RefMeld { readonly kind: 'group' | 'run'; readonly tiles: readonly RefPlaced[] }
export interface RefPosition {
  readonly table: readonly RefMeld[];
  readonly hand: readonly RefTile[];
  readonly initialMeldDone: boolean;
}
export interface RefAnswer {
  readonly ok: boolean;
  readonly value: number;
  readonly playedCount: number;
  readonly table: readonly RefMeld[];
  readonly error?: string;
}
const COLORS: readonly RefColor[] = ['red', 'blue', 'black', 'orange'];
function object(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}
function face(x: unknown): boolean {
  return object(x) && COLORS.includes(x['color'] as RefColor)
    && Number.isInteger(x['value']) && Number(x['value']) >= 1 && Number(x['value']) <= 13;
}
function tile(x: unknown, placed: boolean): x is RefPlaced {
  return object(x) && typeof x['id'] === 'string' && x['id'].length > 0
    && ((x['kind'] === 'number' && face(x))
      || (x['kind'] === 'joker' && (!placed || face(x['as']))));
}
function physical(a: RefTile, b: RefTile): boolean {
  return a.kind === b.kind && (a.kind === 'joker'
    || (b.kind === 'number' && a.color === b.color && a.value === b.value));
}
function deck(tiles: readonly RefTile[]): boolean {
  if (tiles.length > 106) return false;
  const ids: string[] = [];
  const copies: Record<string, number> = Object.create(null) as Record<string, number>;
  let jokers = 0;
  for (const t of tiles) {
    if (ids.includes(t.id)) return false;
    ids.push(t.id);
    if (t.kind === 'joker') { if (++jokers > 2) return false; }
    else {
      const k = `${t.color}/${t.value}`;
      copies[k] = (copies[k] ?? 0) + 1;
      if (copies[k]! > 2) return false;
    }
  }
  return true;
}
function represented(t: RefPlaced): { readonly color: RefColor; readonly value: number } {
  return t.kind === 'number' ? t : t.as!;
}
export function referenceValidateTable(x: unknown): boolean {
  if (!Array.isArray(x)) return false;
  const all: RefPlaced[] = [];
  for (const m of x as unknown[]) {
    if (!object(m) || !Array.isArray(m['tiles'])) return false;
    const a: unknown[] = m['tiles'];
    if (a.length < 3 || !a.every(t => tile(t, true))) return false;
    const placed = a as RefPlaced[];
    all.push(...placed);
    const f = placed.map(represented);
    if (m['kind'] === 'group') {
      if (f.length > 4 || f.some(t => t.value !== f[0]!.value)
        || new Set(f.map(t => t.color)).size !== f.length) return false;
    } else if (m['kind'] === 'run') {
      for (let i = 1; i < f.length; i++) {
        if (f[i]!.color !== f[0]!.color || f[i]!.value !== f[i - 1]!.value + 1) return false;
      }
    } else return false;
  }
  return deck(all);
}
export function referenceValidatePosition(p: unknown): p is RefPosition {
  if (!object(p) || typeof p['initialMeldDone'] !== 'boolean'
    || !referenceValidateTable(p['table']) || !Array.isArray(p['hand'])) return false;
  const h: unknown[] = p['hand'];
  if (!h.every(t => tile(t, false))) return false;
  return deck([...(p['table'] as RefMeld[]).flatMap(m => m.tiles), ...(h as RefTile[])]);
}
function signature(m: RefMeld): string {
  return JSON.stringify([m.kind, m.tiles.map(t => [t.id, represented(t).color,
    represented(t).value]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))]);
}
export function referenceValidatePlay(p: unknown, after: unknown): boolean {
  if (!referenceValidatePosition(p) || !referenceValidateTable(after)) return false;
  const q = after as readonly RefMeld[];
  const old = p.table.flatMap(m => m.tiles);
  const next = q.flatMap(m => m.tiles);
  if (old.some(t => !next.some(u => u.id === t.id && physical(u, t)))) return false;
  const allowed = [...old, ...p.hand];
  if (next.some(t => !allowed.some(u => u.id === t.id && physical(t, u)))) return false;
  const added = next.filter(t => p.hand.some(h => h.id === t.id));
  if (!added.length) return false;
  if (!p.initialMeldDone) {
    if (p.table.some(m => !q.some(n => signature(m) === signature(n)))) return false;
    if (added.reduce((n, t) => n + represented(t).value, 0) < 30) return false;
  }
  return true;
}

/** Returns the best binding for exactly this physical subset, or undefined. */
function subsetMeld(a: readonly RefTile[], handIds: ReadonlySet<string>):
  { meld: RefMeld; value: number } | undefined {
  if (a.length < 3) return undefined;
  const real = a.filter((t): t is Extract<RefTile, { kind: 'number' }> => t.kind === 'number');
  const wild = a.filter(t => t.kind === 'joker').slice().sort((x, y) =>
    Number(handIds.has(x.id)) - Number(handIds.has(y.id)) || x.id.localeCompare(y.id));
  if (!real.length || wild.length > 2) return undefined;
  let best: { meld: RefMeld; value: number } | undefined;
  const offer = (m: RefMeld): void => {
    const value = m.tiles.reduce((v, t) => v + (handIds.has(t.id) ? represented(t).value : 0), 0);
    if (!best || value > best.value) best = { meld: m, value };
  };
  const v = real[0]!.value;
  if (a.length <= 4 && real.every(t => t.value === v)
    && new Set(real.map(t => t.color)).size === real.length) {
    const free = COLORS.filter(c => !real.some(t => t.color === c));
    offer({ kind: 'group', tiles: [...real, ...wild.map((t, i): RefPlaced =>
      ({ ...t, as: { color: free[i]!, value: v } }))] });
  }
  const c = real[0]!.color;
  if (a.length <= 13 && real.every(t => t.color === c)
    && new Set(real.map(t => t.value)).size === real.length) {
    // Brute-force every allowed interval. Assign table jokers to smaller gaps;
    // hand jokers to larger gaps (their values alone enter the objective).
    for (let start = 1; start + a.length - 1 <= 13; start++) {
      if (real.some(t => t.value < start || t.value >= start + a.length)) continue;
      let j = 0;
      const run: RefPlaced[] = [];
      for (let n = start; n < start + a.length; n++) {
        const r = real.find(t => t.value === n);
        if (r) run.push(r);
        else run.push({ ...wild[j++]!, as: { color: c, value: n } });
      }
      offer({ kind: 'run', tiles: run });
    }
  }
  return best;
}

/** Exhaustively visits all reachable physical tile subsets and partitions. */
export function referenceBestPlay(p: unknown): RefAnswer {
  const fail = (error: string): RefAnswer => ({ ok: false, value: 0, playedCount: 0, table: [], error });
  if (!referenceValidatePosition(p)) return fail('INVALID_POSITION');
  const old = p.table.flatMap(m => m.tiles);
  if (old.length + p.hand.length > 14) return fail('ORACLE_LIMIT_14_TOTAL_TILES');
  const a: readonly RefTile[] = p.initialMeldDone ? [...old, ...p.hand] : p.hand;
  const required = p.initialMeldDone ? (1 << old.length) - 1 : 0;
  const hand = new Set(p.hand.map(t => t.id));
  const limit = 1 << a.length;
  const candidates: { mask: number; meld: RefMeld; value: number }[] = [];
  for (let mask = 1; mask < limit; mask++) {
    // Independent, literal physical subset enumeration, including long runs.
    let count = 0;
    for (let z = mask; z; z &= z - 1) count++;
    if (count < 3) continue;
    const subset: RefTile[] = [];
    for (let i = 0; i < a.length; i++) if (mask & (1 << i)) subset.push(a[i]!);
    const m = subsetMeld(subset, hand);
    if (m) candidates.push({ mask, ...m });
  }
  const score = new Int32Array(limit).fill(-1);
  const previous = new Int32Array(limit).fill(-1);
  const used = new Int32Array(limit).fill(-1);
  score[0] = 0;
  for (let mask = 0; mask < limit; mask++) {
    if (score[mask]! < 0) continue;
    for (let j = 0; j < candidates.length; j++) {
      const m = candidates[j]!;
      if (mask & m.mask) continue;
      const next = mask | m.mask;
      const value = score[mask]! + m.value;
      if (value > score[next]!) { score[next] = value; previous[next] = mask; used[next] = j; }
    }
  }
  let best = 0;
  let bestMask = -1;
  let bestCount = 0;
  for (let mask = 0; mask < limit; mask++) {
    if ((mask & required) !== required || score[mask]! < 0
      || (!p.initialMeldDone && score[mask]! < 30)) continue;
    let count = 0;
    for (let z = mask; z; z &= z - 1) count++;
    count -= p.initialMeldDone ? old.length : 0;
    if (score[mask]! > best || (score[mask] === best && count > bestCount)) {
      best = score[mask]!; bestMask = mask; bestCount = count;
    }
  }
  if (!bestCount) return { ok: true, value: 0, playedCount: 0, table: p.table };
  const table: RefMeld[] = [];
  for (let mask = bestMask; mask > 0; mask = previous[mask]!) table.push(candidates[used[mask]!]!.meld);
  if (!p.initialMeldDone) table.push(...p.table);
  if (!referenceValidatePlay(p, table)) return fail('ORACLE_OUTPUT_INVALID');
  return { ok: true, value: best, playedCount: bestCount, table };
}
