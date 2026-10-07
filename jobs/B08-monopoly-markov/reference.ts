/** Independently authored B08 oracle; public mathematical contract only. */
export type JailStrategy = 'leave ASAP' | 'stay max';
export interface ReferenceResult {
  readonly transitionCounts: number[][];
  readonly stateProbabilities: number[];
  readonly landing: number[];
  readonly endTurnLanding: number[];
  readonly turnStartMass: number;
}
const denominator = 9216;
const stateCount = 120;
function freeIndex(square: number, streak: number): number {
  if (square === 30) throw new Error('Go To Jail is transient');
  return (square - (square > 30 ? 1 : 0)) * 3 + streak;
}
function position(state: number): number {
  if (state >= 117) return 10;
  const compressed = Math.floor(state / 3);
  return compressed + (compressed >= 30 ? 1 : 0);
}
/** Exact card resolution in units of 1/256, retaining labelled card multiplicity. */
function arrivals(square: number, units: number, emit: (square: number, jail: boolean, units: number) => void): void {
  if (square === 30) { emit(10, true, units); return; }
  if ([2, 17, 33].includes(square)) {
    emit(0, false, units / 16);
    emit(10, true, units / 16);
    emit(square, false, units * 14 / 16);
    return;
  }
  if ([7, 22, 36].includes(square)) {
    const part = units / 16;
    for (const destination of [0, 11, 24, 5, 39]) emit(destination, false, part);
    emit(10, true, part);
    emit(square === 7 ? 15 : square === 22 ? 25 : 5, false, 2 * part);
    emit(square === 22 ? 28 : 12, false, part);
    arrivals(square - 3, part, emit);
    emit(square, false, 6 * part);
    return;
  }
  emit(square, false, units);
}
export function referenceTransitions(strategy: JailStrategy): number[][] {
  if (strategy !== 'leave ASAP' && strategy !== 'stay max') throw new RangeError('Unknown jail strategy');
  const rows = Array.from({length: stateCount}, () => Array<number>(stateCount).fill(0));
  for (let state = 0; state < stateCount; state++) {
    const row = rows[state]!;
    const jailed = state >= 117;
    const previousDoubles = jailed ? 0 : state % 3;
    for (let first = 1; first <= 6; first++) for (let second = 1; second <= 6; second++) {
      const double = first === second;
      if (!jailed && double && previousDoubles === 2) { row[117] = row[117]! + 256; continue; }
      if (jailed && strategy === 'stay max' && !double && state < 119) {
        row[state + 1] = row[state + 1]! + 256;
        continue;
      }
      const streak = jailed && strategy === 'stay max' ? 0 : double ? previousDoubles + 1 : 0;
      arrivals((position(state) + first + second) % 40, 256, (square, jail, units) => {
        const destination = jail ? 117 : freeIndex(square, streak);
        row[destination] = row[destination]! + units;
      });
    }
    if (row.some(value => !Number.isSafeInteger(value) || value < 0) || row.reduce((a,b) => a+b, 0) !== denominator)
      throw new Error('Invalid exact transition row');
  }
  return rows;
}
/** Full pivoted linear system for pi P = pi; no power-iteration or production imports. */
function stationary(rows: readonly (readonly number[])[]): number[] {
  const n = rows.length;
  const matrix = Array.from({length:n}, (_, equation) => Array.from({length:n + 1}, (_, unknown) =>
    unknown === n ? 0 : rows[unknown]![equation]! / denominator - (equation === unknown ? 1 : 0)));
  matrix[n - 1] = [...Array<number>(n).fill(1), 1];
  for (let column = 0; column < n; column++) {
    let pivot = column;
    for (let candidate = column + 1; candidate < n; candidate++)
      if (Math.abs(matrix[candidate]![column]!) > Math.abs(matrix[pivot]![column]!)) pivot = candidate;
    [matrix[pivot], matrix[column]] = [matrix[column]!, matrix[pivot]!];
    const divisor = matrix[column]![column]!;
    if (Math.abs(divisor) < 1e-15) throw new Error('Singular stationary system');
    for (let entry = column; entry <= n; entry++) matrix[column]![entry] = matrix[column]![entry]! / divisor;
    for (let equation = 0; equation < n; equation++) {
      if (equation === column) continue;
      const factor = matrix[equation]![column]!;
      matrix[equation]![column] = 0;
      for (let entry = column + 1; entry <= n; entry++)
        matrix[equation]![entry] = matrix[equation]![entry]! - factor * matrix[column]![entry]!;
    }
  }
  const answer = matrix.map(row => row[n]!);
  if (answer.some(value => value < -1e-13 || !Number.isFinite(value))) throw new Error('Invalid stationary solution');
  for (let i = 0; i < n; i++) if (answer[i]! < 0) answer[i] = 0;
  const mass = answer.reduce((a,b) => a+b,0);
  return answer.map(value => value / mass);
}
export function referenceStationary(strategy: JailStrategy): ReferenceResult {
  const transitionCounts = referenceTransitions(strategy);
  const stateProbabilities = stationary(transitionCounts);
  const landing = Array<number>(40).fill(0);
  const endTurnLanding = Array<number>(40).fill(0);
  let turnStartMass = 0;
  for (let state = 0; state < stateCount; state++) {
    const square = position(state);
    landing[square] = landing[square]! + stateProbabilities[state]!;
    if (state >= 117 || state % 3 === 0) {
      endTurnLanding[square] = endTurnLanding[square]! + stateProbabilities[state]!;
      turnStartMass += stateProbabilities[state]!;
    }
  }
  return {transitionCounts, stateProbabilities, landing,
    endTurnLanding: endTurnLanding.map(value => value / turnStartMass), turnStartMass};
}
