import type { BlindModel, BlindState, BlindFailure } from "./blindOracle.js";

export interface BlindEstimate { readonly occupancy: readonly number[]; readonly target: readonly number[]; readonly method: "exact" | "sampled" }
export interface BlindAuditWorld { readonly world: readonly (readonly number[])[]; readonly weight: number }
export type BlindDecision = { readonly ok: true; readonly cell: number; readonly method: "hunt" | "target" | "exact" | "sampled" } | BlindFailure | { readonly ok: false; readonly code: "game-over"; readonly message: string };
const invalid = (message: string): BlindFailure => ({ ok: false, code: "invalid-input", message });

function geometry(size: number, length: number): number[][] {
  const result: number[][] = [];
  for (let first = 0; first < size * size; first++) {
    const row = Math.floor(first / size), column = first % size;
    if (column + length <= size) result.push(Array.from({ length }, (_, k) => first + k));
    if (length > 1 && row + length <= size) result.push(Array.from({ length }, (_, k) => first + k * size));
  }
  return result;
}
const hits = (state: BlindState, placement: readonly number[]): number => placement.filter(cell => state.cells[cell] === 2).length;
function legal(model: BlindModel, state: BlindState, ship: number, placements: readonly (readonly number[])[]): readonly (readonly number[])[] {
  const named: number[] = [];
  for (let cell = 0; cell < state.cells.length; cell++) if (state.cells[cell] === 2 && state.hitShip?.[cell] === ship) named.push(cell);
  return placements.filter(placement => {
    if (!placement.some(cell => state.cells[cell] === 0) || named.some(cell => !placement.includes(cell))) return false;
    return placement.every(cell => state.cells[cell] !== 1 && state.cells[cell] !== 3 && !(state.cells[cell] === 2 && state.hitShip?.[cell] !== undefined && state.hitShip[cell] !== null && state.hitShip[cell] !== ship));
  });
}
function remaining(model: BlindModel, state: BlindState): number[] {
  return model.fleet.map((_, ship) => ship).filter(ship => !state.sunk.some(s => s.ship === ship));
}
function hunt(model: BlindModel, state: BlindState, afloat: readonly number[], unknown: readonly number[]): readonly number[] {
  const shortest = Math.min(...afloat.map(ship => model.fleet[ship]!));
  const parity = unknown.filter(cell => (Math.floor(cell / model.size) + cell % model.size) % shortest === 0);
  return parity.length ? parity : unknown;
}

/** Independent policy replay, using only public observations, estimates and final RNG draw. */
export function blindChoose(model: BlindModel, state: BlindState, difficulty: "easy" | "medium" | "hard", finalRandom: number, estimate?: BlindEstimate): BlindDecision {
  try {
    const unknown = state.cells.map((_, cell) => cell).filter(cell => state.cells[cell] === 0), afloat = remaining(model, state);
    if (unknown.length === 0 || afloat.length === 0) return { ok: false, code: "game-over", message: "No remaining shot" };
    if (!Number.isFinite(finalRandom) || finalRandom < 0 || finalRandom >= 1) return invalid("Invalid final uniform RNG draw");
    let pool: readonly number[], method: "hunt" | "target" | "exact" | "sampled";
    if (difficulty === "easy") {
      const neighbors = unknown.filter(cell => state.cells.some((value, hit) => value === 2 && Math.abs(Math.floor(cell / model.size) - Math.floor(hit / model.size)) + Math.abs(cell % model.size - hit % model.size) === 1));
      pool = neighbors.length ? neighbors : unknown; method = neighbors.length ? "target" : "hunt";
    } else {
      const score = Array<number>(state.cells.length).fill(0);
      if (difficulty === "medium") {
        for (const ship of afloat) for (const placement of legal(model, state, ship, geometry(model.size, model.fleet[ship]!))) {
          const weight = hits(state, placement) ** 2;
          for (const cell of placement) if (state.cells[cell] === 0) score[cell] = score[cell]! + weight;
        }
        const max = Math.max(...unknown.map(cell => score[cell]!));
        if (max > 0) { pool = unknown.filter(cell => max - score[cell]! <= 1e-12); method = "target"; }
        else { pool = hunt(model, state, afloat, unknown); method = "hunt"; }
      } else if (difficulty === "hard") {
        if (!estimate || estimate.occupancy.length !== state.cells.length || estimate.target.length !== state.cells.length) return invalid("Hard replay needs public density arrays");
        const unresolved = state.cells.includes(2), values = unresolved ? estimate.target : estimate.occupancy;
        const candidates = unresolved ? unknown : hunt(model, state, afloat, unknown);
        const max = Math.max(...candidates.map(cell => values[cell]!));
        pool = candidates.filter(cell => max - values[cell]! <= 1e-12); method = estimate.method;
      } else return invalid("Unknown difficulty");
    }
    const ordered = [...pool].sort((a,b) => a-b);
    if (ordered.length === 0) return { ok: false, code: "contradiction", message: "No policy candidates" };
    return { ok: true, cell: ordered[Math.floor(finalRandom * ordered.length)]!, method };
  } catch { return invalid("Malformed policy inputs"); }
}

/** Independently verify legal audited worlds and reduce their conditional marginals. */
export function blindAuditDensity(model: BlindModel, state: BlindState, samples: readonly BlindAuditWorld[]): BlindEstimate | BlindFailure {
  try {
    if (samples.length === 0 || samples.some(sample => !Number.isFinite(sample.weight) || sample.weight <= 0)) return invalid("Positive finite audited sample weights required");
    const afloat = remaining(model, state), candidates = model.fleet.map((length, ship) => legal(model, state, ship, geometry(model.size, length)));
    const occupancy = Array<number>(state.cells.length).fill(0), target = Array<number>(state.cells.length).fill(0);
    const maximum = Math.max(...samples.map(sample => sample.weight));
    let totalWeight = 0;
    for (const sample of samples) {
      if (sample.world.length !== model.fleet.length) return invalid("Audited worlds must retain every labeled hull");
      const occupied = new Set<number>();
      for (let ship = 0; ship < model.fleet.length; ship++) {
        const placement = sample.world[ship]!, fixed = state.sunk.find(s => s.ship === ship);
        if (fixed) {
          if (placement.length !== fixed.cells.length || fixed.cells.some(cell => !placement.includes(cell))) return invalid("Audited world changed a fixed sunk hull");
        } else if (!candidates[ship]!.some(candidate => candidate.length === placement.length && candidate.every(cell => placement.includes(cell)))) return invalid("Audited world has an illegal afloat hull");
        for (const cell of placement) { if (occupied.has(cell)) return invalid("Audited world contains overlapping ships"); occupied.add(cell); }
      }
      if (state.cells.some((value, cell) => value === 2 && !occupied.has(cell))) return invalid("Audited world leaves an unresolved hit uncovered");
      const weight = sample.weight / maximum; totalWeight += weight;
      for (const ship of afloat) {
        const others = new Set(sample.world.flatMap((placement, other) => other === ship ? [] : [...placement]));
        const uncovered = state.cells.map((_, cell) => cell).filter(cell => state.cells[cell] === 2 && !others.has(cell));
        const conditional = candidates[ship]!.filter(placement => placement.every(cell => !others.has(cell)) && uncovered.every(cell => placement.includes(cell)));
        if (conditional.length === 0) return invalid("An audited world has no conditional hulls");
        const contribution = weight / conditional.length;
        for (const placement of conditional) {
          const targets = hits(state, placement) > 0;
          for (const cell of placement) {
            occupancy[cell] = occupancy[cell]! + contribution;
            if (targets) target[cell] = target[cell]! + contribution;
          }
        }
      }
    }
    return { occupancy: occupancy.map(value => value / totalWeight), target: target.map(value => value / totalWeight), method: "sampled" };
  } catch { return invalid("Malformed audited samples"); }
}
