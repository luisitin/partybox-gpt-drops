/** Test-only oracle: sparse state elimination, then forward occupation propagation.
 * No implementation/runtime imports from boardOdds.ts. Independently represented
 * fractions, target searches, recurrence detection, and transition evaluation.
 * Algorithmic separation is not a claim of independent human/agent authorship.
 */
type F = readonly [bigint, bigint];
type Q = { readonly numerator: bigint; readonly denominator: bigint };
type G = { readonly nodes: readonly { readonly id: string; readonly kind: string;
  readonly next: readonly string[]; readonly passThrough: boolean }[] };
type O = { readonly landing: ReadonlyMap<string, Q>; readonly nonTermination: Q;
  readonly expectedPasses: ReadonlyMap<string, Q | 'infinity'> };
const z: F = [0n, 1n];
const u: F = [1n, 1n];
function f(n: bigint, d = 1n): F {
  if (d === 0n) throw new Error('oracle: division by zero');
  if (d < 0n) { n = -n; d = -d; }
  let a = n < 0n ? -n : n, b = d;
  while (b !== 0n) { const t = a % b; a = b; b = t; }
  return [n / a, d / a];
}
function plus(a: F, b: F): F { return f(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function times(a: F, b: F): F { return f(a[0] * b[0], a[1] * b[1]); }
function over(a: F, b: F): F { return f(a[0] * b[1], a[1] * b[0]); }
function out(a: F): Q { return { numerator: a[0], denominator: a[1] }; }

export function referenceByFace(graph: G, maxFace: number,
  policy: 'uniform' | 'toward target' = 'uniform', target?: string): ReadonlyMap<number, ReadonlyMap<string, O>> {
  const nodes = graph.nodes, n = nodes.length;
  const index = new Map(nodes.map((v, i) => [v.id, i]));
  const links = nodes.map(v => [...new Set(v.next)].map(id => {
    const j = index.get(id); if (j === undefined) throw new Error('oracle: unknown edge'); return j;
  }));
  // Independent forward BFS from every candidate (production uses reverse BFS).
  const distance = (start: number): number => {
    const queue: [number, number][] = [[start, 0]], seen = new Set<number>();
    for (let head = 0; head < queue.length; head++) {
      const [v, d] = queue[head]!;
      if (nodes[v]!.id === target) return d;
      if (seen.has(v)) continue;
      seen.add(v);
      for (const w of links[v]!) if (!seen.has(w)) queue.push([w, d + 1]);
    }
    return Infinity;
  };
  const ds = nodes.map((_, i) => distance(i));
  const choices = links.map(edges => {
    if (policy === 'uniform' || edges.length === 0) return edges;
    const shortest = Math.min(...edges.map(j => ds[j]!));
    return edges.filter(j => ds[j] === shortest);
  });
  // Identify closed communicating classes using independent reachability searches.
  const reachable = choices.map((_, root) => {
    const found = new Set<number>([root]), todo = [root];
    while (todo.length) for (const w of choices[todo.pop()!]!)
      if (!found.has(w)) { found.add(w); todo.push(w); }
    return found;
  });
  const assigned = new Set<number>(), traps: number[][] = [];
  for (let i = 0; i < n; i++) {
    if (assigned.has(i)) continue;
    const cls = [...reachable[i]!].filter(j => reachable[j]!.has(i));
    for (const j of cls) assigned.add(j);
    if (cls.every(j => nodes[j]!.passThrough && choices[j]!.length > 0 &&
      choices[j]!.every(k => cls.includes(k)))) traps.push(cls);
  }
  const trapOf = new Map<number, number>();
  traps.forEach((cls, t) => cls.forEach(j => trapOf.set(j, t)));
  const size = n + traps.length, width = size + n;
  const dependencies = nodes.map(() => new Map<number, F>());
  const constants: F[][] = nodes.map(() => Array.from({ length: width }, () => z));
  for (let i = 0; i < n; i++) {
    const t = trapOf.get(i);
    if (t !== undefined) { constants[i]![n + t] = u; continue; }
    const choicesHere = choices[i]!;
    if (!choicesHere.length) { constants[i]![i] = u; continue; }
    const p = f(1n, BigInt(choicesHere.length));
    for (const j of choicesHere) {
      if (nodes[j]!.passThrough) {
        dependencies[i]!.set(j, plus(dependencies[i]!.get(j) ?? z, p));
        if (!trapOf.has(j)) constants[i]![size + j] = plus(constants[i]![size + j]!, p);
      } else constants[i]![j] = plus(constants[i]![j]!, p);
    }
  }
  // Each virtual source initially points at its physical start without counting entry.
  const sourceLinks = nodes.map((_, i) => new Map<number, F>([[i, u]]));
  const solved: F[][] = nodes.map(() => Array.from({ length: width }, () => z));
  const substitute = (row: Map<number, F>, values: F[], k: number): void => {
    const factor = row.get(k); if (!factor) return;
    row.delete(k);
    for (const [j, p] of dependencies[k]!) row.set(j, plus(row.get(j) ?? z, times(factor, p)));
    for (let c = 0; c < width; c++) if (constants[k]![c]![0] !== 0n)
      values[c] = plus(values[c]!, times(factor, constants[k]![c]!));
  };
  // Geometric loop resummation; reverse order, not a matrix inversion.
  for (let k = n - 1; k >= 0; k--) {
    const loop = dependencies[k]!.get(k) ?? z;
    const scale = over(u, plus(u, [-loop[0], loop[1]]));
    dependencies[k]!.delete(k);
    for (const [j, p] of dependencies[k]!) dependencies[k]!.set(j, times(p, scale));
    constants[k] = constants[k]!.map(v => times(v, scale));
    for (let i = 0; i < k; i++) substitute(dependencies[i]!, constants[i]!, k);
    for (let s = 0; s < n; s++) substitute(sourceLinks[s]!, solved[s]!, k);
  }
  // Absorbed nontermination classes have no further finite transient rewards.
  for (let t = 0; t < traps.length; t++) {
    const row: F[] = Array.from({ length: width }, () => z); row[n + t] = u; solved.push(row);
  }
  const result = new Map<number, ReadonlyMap<string, O>>();
  for (let k = 0; k <= maxFace; k++) result.set(k, new Map<string, O>());
  for (let s = 0; s < n; s++) {
    let occupation: F[] = Array.from({ length: size }, (_, j) => j === s ? u : z);
    let reward: F[] = Array.from({ length: n }, () => z);
    for (let k = 0; k <= maxFace; k++) {
      const landing = new Map(nodes.map((v, j) => [v.id, out(occupation[j]!)]));
      let nonterm: F = z;
      for (let t = 0; t < traps.length; t++) nonterm = plus(nonterm, occupation[n + t]!);
      const expectedPasses = new Map<string, Q | 'infinity'>();
      nodes.forEach((v, j) => {
        if (!v.passThrough) return;
        const t = trapOf.get(j);
        expectedPasses.set(v.id, t !== undefined && occupation[n + t]![0] > 0n ? 'infinity' : out(reward[j]!));
      });
      (result.get(k)! as Map<string, O>).set(nodes[s]!.id,
        { landing, nonTermination: out(nonterm), expectedPasses });
      if (k === maxFace) break;
      const next: F[] = Array.from({ length: size }, () => z);
      const nextReward = reward.slice();
      for (let i = 0; i < size; i++) if (occupation[i]![0] !== 0n) {
        for (let j = 0; j < size; j++) if (solved[i]![j]![0] !== 0n)
          next[j] = plus(next[j]!, times(occupation[i]!, solved[i]![j]!));
        for (let j = 0; j < n; j++) if (solved[i]![size + j]![0] !== 0n)
          nextReward[j] = plus(nextReward[j]!, times(occupation[i]!, solved[i]![size + j]!));
      }
      occupation = next; reward = nextReward;
    }
  }
  return result;
}
