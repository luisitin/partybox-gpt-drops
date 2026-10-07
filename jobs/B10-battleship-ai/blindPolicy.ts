import { blindCellPlacements, type BlindModel, type BlindState, type BlindFailure } from "./blindOracle.js";

export interface BlindEstimate { readonly occupancy: readonly number[]; readonly target: readonly number[]; readonly method: "exact" | "sampled" }
export interface BlindAuditWorld { readonly world: readonly (readonly number[])[]; readonly weight: number }
export type BlindDecision = { readonly ok: true; readonly cell: number; readonly method: "hunt" | "target" | "exact" | "sampled" } | BlindFailure | { readonly ok: false; readonly code: "game-over"; readonly message: string };
const invalid = (message: string): BlindFailure => ({ ok: false, code: "invalid-input", message });

const hits = (state: BlindState, placement: readonly number[]): number => placement.filter(cell => state.cells[cell] === 2).length;
function legal(state: BlindState, ship: number, placements: readonly (readonly number[])[]): readonly (readonly number[])[] {
  let named = 0;
  for (let cell = 0; cell < state.cells.length; cell++) if (state.cells[cell] === 2 && state.hitShip?.[cell] === ship) named++;
  return placements.filter(placement => {
    let unknown = false, covered = 0;
    for (const cell of placement) {
      const value = state.cells[cell]!, label = state.hitShip?.[cell];
      if (value === 1 || value === 3 || (value === 2 && label !== undefined && label !== null && label !== ship)) return false;
      if (value === 0) unknown = true;
      if (value === 2 && label === ship) covered++;
    }
    return unknown && covered === named;
  });
}
function remaining(model: BlindModel, state: BlindState): number[] {
  return model.fleet.map((_, ship) => ship).filter(ship => !state.sunk.some(s => s.ship === ship));
}
function hunt(model: BlindModel, afloat: readonly number[], unknown: readonly number[]): readonly number[] {
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
      const knownHits = state.cells.map((_, cell) => cell).filter(cell => state.cells[cell] === 2);
      const neighbors = unknown.filter(cell => knownHits.some(hit => Math.abs(Math.floor(cell / model.size) - Math.floor(hit / model.size)) + Math.abs(cell % model.size - hit % model.size) === 1));
      pool = neighbors.length ? neighbors : unknown; method = neighbors.length ? "target" : "hunt";
    } else {
      const score = Array<number>(state.cells.length).fill(0);
      if (difficulty === "medium") {
        const namedHits = Array<number>(model.fleet.length).fill(0);
        let anonymous = false, anyHits = false;
        for (let cell = 0; cell < state.cells.length; cell++) if (state.cells[cell] === 2) {
          anyHits = true;
          const label = state.hitShip?.[cell];
          if (label == null) anonymous = true;
          else namedHits[label] = namedHits[label]! + 1;
        }
        // With no hits every score is zero. With only named hits, ships that
        // own none must avoid all foreign hits and also contribute exactly zero.
        if (anyHits) {
          const shapes = blindCellPlacements(model);
          for (const ship of afloat) {
            if (!anonymous && namedHits[ship] === 0) continue;
            for (const placement of legal(state, ship, shapes[ship]!)) {
              const weight = (anonymous ? hits(state, placement) : namedHits[ship]!) ** 2;
              for (const cell of placement) if (state.cells[cell] === 0) score[cell] = score[cell]! + weight;
            }
          }
        }
        const max = Math.max(...unknown.map(cell => score[cell]!));
        if (max > 0) { pool = unknown.filter(cell => max - score[cell]! <= 1e-12); method = "target"; }
        else { pool = hunt(model, afloat, unknown); method = "hunt"; }
      } else if (difficulty === "hard") {
        if (!estimate || estimate.occupancy.length !== state.cells.length || estimate.target.length !== state.cells.length) return invalid("Hard replay needs public density arrays");
        const unresolved = state.cells.includes(2), values = unresolved ? estimate.target : estimate.occupancy;
        const candidates = unresolved ? unknown : hunt(model, afloat, unknown);
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
    const afloat = remaining(model, state), shapes = blindCellPlacements(model);
    const candidates = shapes.map((placements, ship) => afloat.includes(ship) ? legal(state, ship, placements) : []);
    const occupancy = Array<number>(state.cells.length).fill(0), target = Array<number>(state.cells.length).fill(0);
    const maximum = Math.max(...samples.map(sample => sample.weight));
    let totalWeight = 0;
    const owners = new Int16Array(state.cells.length), hitCells: number[] = [], conditional: (readonly number[])[] = [];
    for (let cell = 0; cell < state.cells.length; cell++) if (state.cells[cell] === 2) hitCells.push(cell);
    for (const sample of samples) {
      if (sample.world.length !== model.fleet.length) return invalid("Audited worlds must retain every labeled hull");
      owners.fill(-1);
      for (let ship = 0; ship < model.fleet.length; ship++) {
        const placement = sample.world[ship]!, fixed = state.sunk.find(s => s.ship === ship);
        if (placement.length !== model.fleet[ship]) return invalid("Audited hull length disagrees with its label");
        if (fixed) {
          if (placement.length !== fixed.cells.length || fixed.cells.some(cell => !placement.includes(cell) || state.cells[cell] !== 3)) return invalid("Audited world changed a fixed sunk hull");
        }
        let lowRow = model.size, highRow = -1, lowColumn = model.size, highColumn = -1, unknown = false;
        for (const cell of placement) {
          if (!Number.isInteger(cell) || cell < 0 || cell >= state.cells.length || owners[cell] !== -1) return invalid("Audited world contains invalid or overlapping cells");
          owners[cell] = ship;
          const row = Math.floor(cell / model.size), column = cell % model.size;
          lowRow = Math.min(lowRow,row); highRow = Math.max(highRow,row); lowColumn = Math.min(lowColumn,column); highColumn = Math.max(highColumn,column);
          if (state.cells[cell] === 0) unknown = true;
          if (!fixed && (state.cells[cell] === 1 || state.cells[cell] === 3)) return invalid("Audited afloat hull touches a blocked cell");
        }
        if (!((lowRow === highRow && highColumn - lowColumn + 1 === placement.length) || (lowColumn === highColumn && highRow - lowRow + 1 === placement.length))) return invalid("Audited hull is bent or discontinuous");
        if (!fixed && !unknown) return invalid("A fully hit audited ship must already be sunk");
      }
      for (const cell of hitCells) if (owners[cell] === -1 || (state.hitShip?.[cell] != null && owners[cell] !== state.hitShip[cell])) return invalid("Audited world leaves a hit uncovered or assigns it to a foreign label");
      const weight = sample.weight / maximum; totalWeight += weight;
      for (const ship of afloat) {
        let required = 0; for (const cell of hitCells) if (owners[cell] === ship) required++;
        conditional.length=0;
        for (const placement of candidates[ship]!) {
          let covered = 0, valid = true;
          for (const cell of placement) {
            if (owners[cell] !== -1 && owners[cell] !== ship) { valid = false; break; }
            if (state.cells[cell] === 2 && owners[cell] === ship) covered++;
          }
          if (valid && covered === required) conditional.push(placement);
        }
        if (conditional.length === 0) return invalid("An audited world has no conditional hulls");
        const contribution = weight / conditional.length;
        for (const placement of conditional) {
          const targets = required > 0;
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
