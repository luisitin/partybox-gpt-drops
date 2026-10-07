/** Independently authored from the public rules, before reading production. */
export type BlindCell = 0 | 1 | 2 | 3;
export interface BlindModel { readonly size: number; readonly fleet: readonly number[] }
export interface BlindHull { readonly cells: readonly number[]; readonly mask: bigint }
const preparedGeometry: unique symbol = Symbol("independent geometry");
const preparedCells: unique symbol = Symbol("independent cell geometry");
type PreparedModel = BlindModel & { readonly [preparedGeometry]?: readonly (readonly BlindHull[])[]; readonly [preparedCells]?: readonly (readonly (readonly number[])[])[] };
/** Independent reusable geometry. It contains no observation-specific cache. */
export function prepareBlindModel(size: number, fleet: readonly number[]): BlindModel {
  const model: BlindModel = { size, fleet: [...fleet] };
  const hulls = blindHulls(model);
  return { ...model, [preparedGeometry]: hulls, [preparedCells]: hulls.map(group => group.map(hull => hull.cells)) } as PreparedModel;
}
export function blindCellPlacements(model: BlindModel): readonly (readonly (readonly number[])[])[] {
  return (model as PreparedModel)[preparedCells] ?? blindHulls(model).map(group => group.map(hull => hull.cells));
}
export function blindHulls(model: BlindModel): readonly (readonly BlindHull[])[] {
  const prepared = (model as PreparedModel)[preparedGeometry];
  if (prepared) return prepared;
  return model.fleet.map(length => {
    const result: BlindHull[] = [];
    for (let direction = 0; direction < (length === 1 ? 1 : 2); direction++) {
      const step = direction === 0 ? 1 : model.size;
      for (let row = 0; row < model.size; row++) for (let column = 0; column < model.size; column++) {
        if (direction === 0 ? column + length > model.size : row + length > model.size) continue;
        const cells = Array.from({ length }, (_, offset) => row * model.size + column + offset * step);
        let mask = 0n; for (const cell of cells) mask |= 1n << BigInt(cell);
        result.push({ cells, mask });
      }
    }
    return result;
  });
}
export interface BlindState {
  readonly cells: readonly BlindCell[];
  readonly hitShip?: readonly (number | null)[];
  readonly sunk: readonly { readonly ship: number; readonly cells: readonly number[] }[];
}
export interface BlindDensity {
  readonly ok: true;
  readonly total: bigint;
  readonly counts: readonly bigint[];
  readonly targetCounts: readonly bigint[];
  readonly nodes: number;
}
export interface BlindFailure { readonly ok: false; readonly code: "invalid-input" | "contradiction" | "budget-exceeded"; readonly message: string }
export type BlindResult = BlindDensity | BlindFailure;
type Placement = { cells: readonly number[]; mask: bigint; hitMask: bigint; target: boolean };
const error = (code: BlindFailure["code"], message: string): BlindFailure => ({ ok: false, code, message });

function hull(size: number, cells: readonly number[], length: number): boolean {
  if (cells.length !== length || new Set(cells).size !== length || cells.some(c => !Number.isInteger(c) || c < 0 || c >= size * size)) return false;
  const sorted = [...cells].sort((a,b) => a-b);
  return sorted.every((c,i) => c === sorted[0]! + i && Math.floor(c / size) === Math.floor(sorted[0]! / size)) || sorted.every((c,i) => c === sorted[0]! + i * size);
}

/** Literal labeled-fleet enumeration; a budget failure never returns partial counts. */
export function blindDensity(model: BlindModel, state: BlindState, budget = 5_000_000): BlindResult {
  try { return enumerate(model, state, budget); }
  catch { return error("invalid-input", "Malformed model or observations"); }
}

function enumerate(model: BlindModel, state: BlindState, budget: number): BlindResult {
  if (!model || !state || !Number.isInteger(model.size) || model.size < 2 || model.size > 10 || !Array.isArray(model.fleet) || model.fleet.length > 10 || model.fleet.some(length => !Number.isInteger(length) || length < 1 || length > model.size) || !Number.isSafeInteger(budget) || budget < 1)
    return error("invalid-input", "Invalid board, fleet or exact-enumeration budget");
  const size = model.size, area = size * size;
  if (model.fleet.reduce((sum, length) => sum + length, 0) > area) return error("invalid-input", "Fleet cells exceed the board area");
  if (!Array.isArray(state.cells) || state.cells.length !== area || state.cells.some(c => c !== 0 && c !== 1 && c !== 2 && c !== 3) || !Array.isArray(state.sunk))
    return error("invalid-input", "Invalid public board observations");
  if (state.hitShip !== undefined && (!Array.isArray(state.hitShip) || state.hitShip.length !== area || state.hitShip.some(ship => ship !== null && (!Number.isInteger(ship) || ship < 0 || ship >= model.fleet.length))))
    return error("invalid-input", "Invalid named-hit labels");
  const sunkShips = new Set<number>(), sunkCells = new Set<number>();
  for (const announcement of state.sunk) {
    if (!announcement || !Number.isInteger(announcement.ship) || announcement.ship < 0 || announcement.ship >= model.fleet.length || sunkShips.has(announcement.ship) || !Array.isArray(announcement.cells) || !hull(size, announcement.cells, model.fleet[announcement.ship]!))
      return error("invalid-input", "Invalid announced sunk hull");
    sunkShips.add(announcement.ship);
    for (const cell of announcement.cells) {
      if (sunkCells.has(cell) || state.cells[cell] !== 3) return error("contradiction", "Sunk hulls overlap or disagree with the board");
      sunkCells.add(cell);
      const named = state.hitShip?.[cell];
      if (named !== undefined && named !== null && named !== announcement.ship) return error("contradiction", "Sunk hull has a conflicting ship label");
    }
  }
  let hits = 0n, forbidden = 0n;
  for (let cell = 0; cell < area; cell++) {
    const observation = state.cells[cell]!, named = state.hitShip?.[cell];
    if (observation === 2) {
      hits |= 1n << BigInt(cell);
      if (named !== undefined && named !== null && sunkShips.has(named)) return error("contradiction", "An unresolved hit names a sunk ship");
    }
    if (observation === 1 || observation === 3) forbidden |= 1n << BigInt(cell);
    if (observation === 3 && !sunkCells.has(cell)) return error("invalid-input", "Every sunk cell needs an announced hull");
    if ((observation === 0 || observation === 1) && named !== undefined && named !== null) return error("invalid-input", "A named hit needs a hit or sunk observation");
  }
  const alternatives: { ship: number; placements: Placement[] }[] = [], shapes = blindHulls(model);
  for (let ship = 0; ship < model.fleet.length; ship++) {
    if (sunkShips.has(ship)) continue;
    const placements: Placement[] = [];
    let ownHits = 0n, othersHits = 0n;
    for (let cell = 0; cell < area; cell++) if (state.cells[cell] === 2) {
      const named = state.hitShip?.[cell];
      if (named === ship) ownHits |= 1n << BigInt(cell);
      else if (named !== null && named !== undefined) othersHits |= 1n << BigInt(cell);
    }
    for (const {cells, mask} of shapes[ship]!) {
        if ((mask & forbidden) !== 0n || (mask & othersHits) !== 0n || (mask & ownHits) !== ownHits || !cells.some(cell => state.cells[cell] === 0)) continue;
        placements.push({ cells, mask, hitMask: mask & hits, target: (mask & hits) !== 0n });
    }
    if (placements.length === 0) return error("contradiction", "An afloat labeled ship has no legal placement");
    alternatives.push({ ship, placements });
  }
  alternatives.sort((a,b) => a.placements.length - b.placements.length || a.ship - b.ship);
  const suffixCover = Array<bigint>(alternatives.length + 1).fill(0n);
  for (let i = alternatives.length - 1; i >= 0; i--) suffixCover[i] = suffixCover[i+1]! | alternatives[i]!.placements.reduce((mask,p) => mask | p.hitMask, 0n);
  const counts = Array<number>(area).fill(0), targetCounts = Array<number>(area).fill(0), selected: Placement[] = [];
  let nodes = 0, total = 0, exceeded = false;
  const visit = (position: number, occupied: bigint, covered: bigint): void => {
    if (exceeded) return;
    nodes++;
    if (nodes > budget) { exceeded = true; return; }
    if (((covered | suffixCover[position]!) & hits) !== hits) return;
    if (position === alternatives.length) {
      if (covered !== hits) return;
      total++;
      for (const placement of selected) for (const cell of placement.cells) {
        counts[cell] = counts[cell]! + 1;
        if (placement.target) targetCounts[cell] = targetCounts[cell]! + 1;
      }
      return;
    }
    for (const placement of alternatives[position]!.placements) {
      if ((occupied & placement.mask) !== 0n) continue;
      selected.push(placement);
      visit(position + 1, occupied | placement.mask, covered | placement.hitMask);
      selected.pop();
      if (exceeded) return;
    }
  };
  visit(0, 0n, 0n);
  if (exceeded) return error("budget-exceeded", "Literal exact enumeration exceeded its node budget");
  if (total === 0) return error("contradiction", "No consistent complete labeled fleet");
  // Every count is <= leaves <= visited nodes <= the safe-integer budget.
  return { ok: true, total: BigInt(total), counts: counts.map(BigInt), targetCounts: targetCounts.map(BigInt), nodes };
}
