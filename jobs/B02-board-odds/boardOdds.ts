/** Exact board movement. Runtime dependencies: none. See README for semantics. */
export interface Rational { readonly numerator: bigint; readonly denominator: bigint }
export interface BoardNode {
  readonly id: string; readonly kind: string;
  readonly next: readonly string[]; readonly passThrough: boolean;
}
export interface BoardGraph { readonly nodes: readonly BoardNode[] }
export type DieDistribution = ReadonlyMap<number, Rational> | Readonly<Record<string, Rational>>;
export type BranchPolicy = 'uniform' | 'toward target';
export type ExpectedPasses = Rational | 'infinity';
export interface StartOdds {
  readonly landing: ReadonlyMap<string, Rational>;
  readonly nonTermination: Rational;
  readonly expectedPasses: ReadonlyMap<string, ExpectedPasses>;
}
export type BoardOdds = ReadonlyMap<string, StartOdds>;
export const ZERO: Rational = Object.freeze({ numerator: 0n, denominator: 1n });
export const ONE: Rational = Object.freeze({ numerator: 1n, denominator: 1n });
function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  return a;
}
export function rational(numerator: bigint, denominator = 1n): Rational {
  if (denominator === 0n) throw new RangeError('Zero denominator');
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  if (numerator === 0n) return ZERO;
  const g = gcd(numerator, denominator);
  return { numerator: numerator / g, denominator: denominator / g };
}
export function add(a: Rational, b: Rational): Rational {
  if (a.numerator === 0n) return b;
  if (b.numerator === 0n) return a;
  const g = gcd(a.denominator, b.denominator);
  return rational(a.numerator * (b.denominator / g) + b.numerator * (a.denominator / g),
    (a.denominator / g) * b.denominator);
}
function neg(a: Rational): Rational { return rational(-a.numerator, a.denominator); }
export function multiply(a: Rational, b: Rational): Rational {
  if (a.numerator === 0n || b.numerator === 0n) return ZERO;
  const g = gcd(a.numerator, b.denominator), h = gcd(b.numerator, a.denominator);
  return { numerator: (a.numerator / g) * (b.numerator / h),
    denominator: (a.denominator / h) * (b.denominator / g) };
}
function reciprocal(a: Rational): Rational { return rational(a.denominator, a.numerator); }
type Matrix = Rational[][];
const zeros = (r: number, c: number): Matrix => Array.from({ length: r }, () => Array<Rational>(c).fill(ZERO));
const identity = (n: number): Matrix => Array.from({ length: n }, (_, i) =>
  Array.from({ length: n }, (_, j) => i === j ? ONE : ZERO));
function addRow(to: Rational[], from: readonly Rational[], scale: Rational): void {
  if (scale.numerator === 0n) return;
  for (let j = 0; j < to.length; j++) if (from[j]!.numerator !== 0n)
    to[j] = add(to[j]!, multiply(scale, from[j]!));
}
function product(a: Matrix, b: Matrix, columns: number): Matrix {
  const c = zeros(a.length, columns);
  for (let i = 0; i < a.length; i++) for (let k = 0; k < b.length; k++)
    addRow(c[i]!, b[k]!, a[i]![k]!);
  return c;
}
function inverse(a: Matrix): Matrix {
  const n = a.length, right = identity(n), left = a.map(row => row.slice());
  for (let k = 0; k < n; k++) {
    let pivot = k;
    while (pivot < n && left[pivot]![k]!.numerator === 0n) pivot++;
    if (pivot === n) throw new Error('Internal invariant: singular transient closure');
    [left[k], left[pivot]] = [left[pivot]!, left[k]!];
    [right[k], right[pivot]] = [right[pivot]!, right[k]!];
    const scale = reciprocal(left[k]![k]!);
    left[k] = left[k]!.map(x => multiply(x, scale));
    right[k] = right[k]!.map(x => multiply(x, scale));
    for (let i = 0; i < n; i++) if (i !== k) {
      const factor = neg(left[i]![k]!);
      addRow(left[i]!, left[k]!, factor); addRow(right[i]!, right[k]!, factor);
    }
  }
  return right;
}
function validFace(face: number): void {
  if (!Number.isSafeInteger(face) || face < 0) throw new RangeError('Faces must be nonnegative safe integers');
}
function dieEntries(die: DieDistribution): [number, Rational][] {
  const raw = die instanceof Map ? [...die] : Object.entries(die).map(([k, v]) => [Number(k), v] as const);
  const entries: [number, Rational][] = [];
  let sum = ZERO;
  for (const [face, value] of raw) {
    validFace(face);
    const p = rational(value.numerator, value.denominator);
    if (p.numerator < 0n) throw new RangeError('Negative probability');
    sum = add(sum, p);
    if (p.numerator !== 0n) entries.push([face, p]);
  }
  if (sum.numerator !== sum.denominator) throw new RangeError('Die probabilities must sum to exactly one');
  return entries;
}
interface Kernel { transition: Matrix; reward: Matrix }
interface Prepared {
  nodes: readonly BoardNode[]; traps: number[][]; trapOf: Map<number, number>; kernel: Kernel;
}
function prepare(board: BoardGraph, policy: BranchPolicy, target?: string): Prepared {
  if (policy !== 'uniform' && policy !== 'toward target') throw new RangeError('Unknown branch policy');
  if (policy === 'toward target' && target === undefined) throw new RangeError('A target ID is required');
  const nodes = board.nodes, n = nodes.length, indices = new Map<string, number>();
  nodes.forEach((v, i) => {
    if (typeof v.id !== 'string' || typeof v.kind !== 'string' || typeof v.passThrough !== 'boolean' || !Array.isArray(v.next))
      throw new TypeError('Invalid board node');
    for (const id of v.next) if (typeof id !== 'string') throw new TypeError('Next IDs must be strings');
    if (indices.has(v.id)) throw new RangeError('Duplicate node ID');
    indices.set(v.id, i);
  });
  const links = nodes.map(v => [...new Set(v.next)].map(id => {
    const j = indices.get(id); if (j === undefined) throw new RangeError('Unknown next ID: ' + id); return j;
  }));
  const reverse: number[][] = Array.from({ length: n }, () => []);
  links.forEach((edges, i) => edges.forEach(j => reverse[j]!.push(i)));
  const distance = Array<number>(n).fill(Infinity), root = target === undefined ? undefined : indices.get(target);
  if (root !== undefined) {
    const queue = [root]; distance[root] = 0;
    for (let head = 0; head < queue.length; head++) {
      const v = queue[head]!;
      for (const w of reverse[v]!) if (distance[w] === Infinity) {
        distance[w] = distance[v]! + 1; queue.push(w);
      }
    }
  }
  const choices = links.map(edges => {
    if (policy === 'uniform' || edges.length === 0) return edges;
    const best = Math.min(...edges.map(j => distance[j]!));
    return edges.filter(j => distance[j] === best);
  });
  // Iterative Kosaraju: no recursion limit for self-loops or deep graphs.
  const rev: number[][] = Array.from({ length: n }, () => []);
  choices.forEach((edges, i) => edges.forEach(j => rev[j]!.push(i)));
  const seen = new Set<number>(), order: number[] = [];
  for (let s = 0; s < n; s++) {
    if (seen.has(s)) continue;
    const stack: [number, number][] = [[s, 0]]; seen.add(s);
    while (stack.length) {
      const top = stack[stack.length - 1]!, edges = choices[top[0]]!;
      if (top[1] === edges.length) { order.push(top[0]); stack.pop(); }
      else { const w = edges[top[1]++]!; if (!seen.has(w)) { seen.add(w); stack.push([w, 0]); } }
    }
  }
  const assigned = new Set<number>(), traps: number[][] = [];
  for (const s of order.reverse()) {
    if (assigned.has(s)) continue;
    const cls: number[] = [], todo = [s]; assigned.add(s);
    while (todo.length) {
      const v = todo.pop()!; cls.push(v);
      for (const w of rev[v]!) if (!assigned.has(w)) { assigned.add(w); todo.push(w); }
    }
    const members = new Set(cls);
    if (cls.every(j => nodes[j]!.passThrough && choices[j]!.length > 0 &&
      choices[j]!.every(w => members.has(w)))) traps.push(cls);
  }
  const trapOf = new Map<number, number>();
  traps.forEach((cls, t) => cls.forEach(j => trapOf.set(j, t)));
  const size = n + traps.length, a = identity(n), exits = zeros(n, size), rewards = zeros(n, n);
  for (let i = 0; i < n; i++) {
    const t = trapOf.get(i);
    if (t !== undefined) { exits[i]![n + t] = ONE; continue; }
    const edges = choices[i]!;
    if (edges.length === 0) { exits[i]![i] = ONE; continue; }
    const p = rational(1n, BigInt(edges.length));
    for (const j of edges) {
      if (nodes[j]!.passThrough) {
        a[i]![j] = add(a[i]![j]!, neg(p));
        if (!trapOf.has(j)) rewards[i]![j] = add(rewards[i]![j]!, p);
      } else exits[i]![j] = add(exits[i]![j]!, p);
    }
  }
  const fundamental = inverse(a);
  const transition = product(fundamental, exits, size), reward = product(fundamental, rewards, n);
  for (let t = 0; t < traps.length; t++) {
    const row = Array<Rational>(size).fill(ZERO); row[n + t] = ONE;
    transition.push(row); reward.push(Array<Rational>(n).fill(ZERO));
  }
  return { nodes, traps, trapOf, kernel: { transition, reward } };
}
function compose(a: Kernel, b: Kernel, size: number, n: number): Kernel {
  const reward = product(a.transition, b.reward, n);
  for (let i = 0; i < size; i++) addRow(reward[i]!, a.reward[i]!, ONE);
  return { transition: product(a.transition, b.transition, size), reward };
}
function unit(size: number, n: number): Kernel { return { transition: identity(size), reward: zeros(size, n) }; }
function render(prepared: Prepared, movement: Kernel): BoardOdds {
  const { nodes, traps, trapOf } = prepared, n = nodes.length;
  return new Map(nodes.map((v, i) => {
    const landing = new Map(nodes.map((w, j) => [w.id, movement.transition[i]![j]!]));
    let nonTermination = ZERO;
    for (let t = 0; t < traps.length; t++) nonTermination = add(nonTermination, movement.transition[i]![n + t]!);
    const expectedPasses = new Map<string, ExpectedPasses>();
    nodes.forEach((w, j) => {
      if (!w.passThrough) return;
      const t = trapOf.get(j);
      expectedPasses.set(w.id, t !== undefined && movement.transition[i]![n + t]!.numerator > 0n
        ? 'infinity' : movement.reward[i]![j]!);
    });
    return [v.id, { landing, nonTermination, expectedPasses }];
  }));
}
/** Exact results for all integer faces 0..maxFace; useful for table generation/tests. */
export function boardOddsByFace(board: BoardGraph, maxFace: number,
  policy: BranchPolicy = 'uniform', target?: string): ReadonlyMap<number, BoardOdds> {
  validFace(maxFace);
  const prepared = prepare(board, policy, target), n = prepared.nodes.length, size = n + prepared.traps.length;
  let movement = unit(size, n);
  const results = new Map<number, BoardOdds>();
  for (let face = 0; face <= maxFace; face++) {
    results.set(face, render(prepared, movement));
    if (face < maxFace) movement = compose(prepared.kernel, movement, size, n);
  }
  return results;
}
/** BigInt-rational mixture. Binary powering uses O(log(max nonzero face)) compositions. */
export function boardOdds(board: BoardGraph, die: DieDistribution,
  policy: BranchPolicy = 'uniform', target?: string): BoardOdds {
  const entries = dieEntries(die), prepared = prepare(board, policy, target);
  const n = prepared.nodes.length, size = n + prepared.traps.length;
  const total: Kernel = { transition: zeros(size, size), reward: zeros(size, n) };
  const powers: Kernel[] = [prepared.kernel];
  for (const [face, weight] of entries) {
    let remaining = face, bit = 0, movement = unit(size, n);
    while (remaining > 0) {
      if (powers[bit] === undefined) powers.push(compose(powers[bit - 1]!, powers[bit - 1]!, size, n));
      if (remaining % 2 === 1) movement = compose(movement, powers[bit]!, size, n);
      remaining = Math.floor(remaining / 2); bit++;
    }
    for (let i = 0; i < size; i++) {
      addRow(total.transition[i]!, movement.transition[i]!, weight);
      addRow(total.reward[i]!, movement.reward[i]!, weight);
    }
  }
  return render(prepared, total);
}
