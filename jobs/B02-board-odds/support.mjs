import assert from 'node:assert/strict';

// Third arithmetic implementation for assertions and explicit path enumeration.
export function q(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  assert.notEqual(d, 0n);
  if (d < 0n) { n = -n; d = -d; }
  let a = n < 0n ? -n : n, b = d;
  while (b) [a, b] = [b, a % b];
  return { numerator: n / a, denominator: d / a };
}
export const zero = q(0), one = q(1);
export const plus = (a, b) => q(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
export const times = (a, b) => q(a.numerator * b.numerator, a.denominator * b.denominator);
export const number = a => Number(a.numerator) / Number(a.denominator);
export const delta = face => new Map([[face, one]]);
export const node = (id, next = [], passThrough = false) => ({ id, kind: passThrough ? 'shop' : 'space', next, passThrough });
export const graph = (...nodes) => ({ nodes });
export function stringify(x) {
  return JSON.stringify(x, (_, v) => typeof v === 'bigint' ? `${v}n` : v instanceof Map ? [...v] : v);
}
export function same(a, b, label = '') {
  assert.equal(a.size, b.size, label + ': starts');
  for (const [id, expected] of b) {
    const actual = a.get(id); assert.ok(actual, label + ': missing start ' + id);
    const order = m => [...m].sort(([x], [y]) => x < y ? -1 : x > y ? 1 : 0);
    assert.deepEqual(order(actual.landing), order(expected.landing), label + ': landings from ' + id);
    assert.deepEqual(actual.nonTermination, expected.nonTermination, label + ': nontermination from ' + id);
    assert.deepEqual(order(actual.expectedPasses), order(expected.expectedPasses), label + ': passes from ' + id);
  }
}
export function invariant(board, odds) {
  assert.equal(odds.size, board.nodes.length);
  for (const start of board.nodes) {
    const row = odds.get(start.id); assert.ok(row);
    assert.equal(row.landing.size, board.nodes.length);
    assert.equal(row.expectedPasses.size, board.nodes.filter(v => v.passThrough).length);
    let sum = row.nonTermination;
    for (const v of board.nodes) {
      const p = row.landing.get(v.id); assert.ok(p);
      assert.ok(p.numerator >= 0n && p.denominator > 0n);
      assert.deepEqual(p, q(p.numerator, p.denominator)); sum = plus(sum, p);
      if (v.passThrough) {
        const e = row.expectedPasses.get(v.id); assert.ok(e);
        if (e !== 'infinity') { assert.ok(e.numerator >= 0n); assert.deepEqual(e, q(e.numerator, e.denominator)); }
      }
    }
    assert.deepEqual(sum, one, 'landing + nonTermination must equal exactly 1');
    assert.ok(row.nonTermination.numerator >= 0n);
  }
}
export function mixture(table, die) {
  const first = table.values().next().value, output = new Map();
  for (const [start, row] of first) {
    const landing = new Map([...row.landing.keys()].map(id => [id, zero]));
    const expectedPasses = new Map([...row.expectedPasses.keys()].map(id => [id, zero]));
    let nonTermination = zero;
    for (const [face, probability] of die) {
      if (!probability.numerator) continue;
      const r = table.get(face).get(start);
      for (const [id, p] of r.landing) landing.set(id, plus(landing.get(id), times(probability, p)));
      nonTermination = plus(nonTermination, times(probability, r.nonTermination));
      for (const [id, e] of r.expectedPasses) {
        const old = expectedPasses.get(id);
        expectedPasses.set(id, old === 'infinity' || e === 'infinity' ? 'infinity' : plus(old, times(probability, e)));
      }
    }
    output.set(start, { landing, expectedPasses, nonTermination });
  }
  return output;
}

/** Mulberry32 word generator; all entropy supplied explicitly by callers. */
export function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
}
/** Exact rejection sampling, never float scaling or modulo-biased selection. */
export function pick(random, bound) {
  assert.ok(Number.isSafeInteger(bound) && bound > 0 && bound <= 0x100000000);
  const limit = 0x100000000 - (0x100000000 % bound);
  let word; do { word = random(); } while (word >= limit);
  return word % bound;
}
function shuffle(a, random) {
  for (let i = a.length - 1; i > 0; i--) { const j = pick(random, i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function randomDag(random, n = 1 + pick(random, 25)) {
  const nodes = Array.from({ length: n }, (_, i) => node(`v${i}`, [], pick(random, 3) === 0));
  for (let i = 0; i < n - 1; i++) {
    const candidates = shuffle(Array.from({ length: n - i - 1 }, (_, j) => j + i + 1), random);
    const count = pick(random, Math.min(3, candidates.length) + 1);
    nodes[i].next = candidates.slice(0, count).map(j => nodes[j].id);
    if (count && pick(random, 10) === 0) nodes[i].next.push(nodes[i].next[0]);
  }
  return { nodes: shuffle(nodes, random) };
}
export function randomCyclic(random, epsilon = false, n = 2 + pick(random, 24)) {
  const nodes = Array.from({ length: n }, (_, i) => node(`v${i}`, [], pick(random, 3) === 0));
  nodes[0].passThrough = epsilon;
  nodes[1].passThrough = false;
  for (let i = 0; i < n; i++) {
    const choices = nodes.filter(v => epsilon || !nodes[i].passThrough || !v.passThrough);
    const count = pick(random, Math.min(2, choices.length) + 1);
    nodes[i].next = shuffle(choices.slice(), random).slice(0, count).map(v => v.id);
  }
  // Guaranteed cycle even when all other sampled edges are sinks.
  nodes[0].next = epsilon && pick(random, 2) ? ['v0', 'v1'] : ['v0'];
  return { nodes: shuffle(nodes, random) };
}
export function randomDie(random, maxFace = 10) {
  const weights = Array.from({ length: maxFace + 1 }, () => 1 + pick(random, 9));
  const total = weights.reduce((a, b) => a + b, 0);
  return new Map(weights.map((w, face) => [face, q(w, total)]));
}

/** Third policy implementation: graph-distance relaxation to a fixed point. */
export function pathChoices(board, policy, target) {
  const index = new Map(board.nodes.map((v, i) => [v.id, i]));
  const next = board.nodes.map(v => [...new Set(v.next)].map(id => index.get(id)));
  if (policy === 'uniform') return next;
  const d = board.nodes.map(v => v.id === target ? 0 : Infinity);
  for (let k = 0; k < board.nodes.length; k++) {
    let changed = false;
    for (let i = 0; i < next.length; i++) for (const j of next[i])
      if (d[j] + 1 < d[i]) { d[i] = d[j] + 1; changed = true; }
    if (!changed) break;
  }
  return next.map(edges => {
    const best = Math.min(...edges.map(j => d[j]));
    return edges.filter(j => d[j] === best);
  });
}

/** Enumerate EVERY finite path, with no memoization or probability truncation.
 * Only invoked when the pass-only subgraph is acyclic. Positive-cost cycles OK.
 */
export function brute(board, steps, policy = 'uniform', target, onlyStart) {
  const choices = pathChoices(board, policy, target), output = new Map(), secondMoments = new Map();
  let leaves = 0;
  for (let s = 0; s < board.nodes.length; s++) {
    if (onlyStart !== undefined && s !== onlyStart) continue;
    const landing = new Map(board.nodes.map(v => [v.id, zero]));
    const expectedPasses = new Map(board.nodes.filter(v => v.passThrough).map(v => [v.id, zero]));
    const second = new Map([...expectedPasses.keys()].map(id => [id, zero]));
    const stack = [{ at: s, left: steps, p: one, counts: new Uint32Array(board.nodes.length), edges: 0 }];
    while (stack.length) {
      const { at, left, p, counts, edges } = stack.pop();
      assert.ok(edges <= board.nodes.length * (steps + 1), 'Brute enumeration received a zero-cost cycle');
      if (left === 0 || choices[at].length === 0) {
        leaves++;
        const id = board.nodes[at].id; landing.set(id, plus(landing.get(id), p));
        for (let j = 0; j < counts.length; j++) if (counts[j]) {
          const name = board.nodes[j].id;
          expectedPasses.set(name, plus(expectedPasses.get(name), times(p, q(counts[j]))));
          second.set(name, plus(second.get(name), times(p, q(BigInt(counts[j]) ** 2n))));
        }
        continue;
      }
      const probability = times(p, q(1, choices[at].length));
      for (const dest of choices[at]) {
        const visit = counts.slice(), pass = board.nodes[dest].passThrough;
        if (pass) visit[dest]++;
        stack.push({ at: dest, left: left - (pass ? 0 : 1), p: probability, counts: visit, edges: edges + 1 });
      }
    }
    output.set(board.nodes[s].id, { landing, expectedPasses, nonTermination: zero });
    secondMoments.set(board.nodes[s].id, second);
  }
  return { output, leaves, secondMoments };
}

export function fixtures() {
  return [
    ['empty', graph()],
    ['sink', graph(node('S'))],
    ['pass-sink', graph(node('S', ['P']), node('P', [], true))],
    ['line', graph(node('S', ['P']), node('P', ['A'], true), node('A', ['Q']), node('Q', ['B'], true), node('B'))],
    ['diamond', graph(node('S', ['A', 'B']), node('A', ['T']), node('B', ['T']), node('T'))],
    ['uneven', graph(node('S', ['A', 'B', 'C']), node('A', ['T']), node('B', ['C']), node('C', ['T']), node('T'))],
    ['target-near', graph(node('S', ['A', 'B']), node('A', ['B']), node('B', ['T']), node('T'))],
    ['target-hops-not-cost', graph(node('S', ['A', 'P']), node('A', ['T']), node('P', ['Q'], true), node('Q', ['T'], true), node('T'))],
    ['directed', graph(node('S', ['A', 'B']), node('A', ['T']), node('B'), node('T', ['B']))],
    ['unreachable', graph(node('S', ['A', 'B']), node('A'), node('B'), node('T'))],
    ['duplicate', graph(node('S', ['A', 'B', 'B']), node('A'), node('B'))],
    ['ordinary-loop', graph(node('S', ['S']))],
    ['ordinary-ring', graph(node('S', ['A']), node('A', ['S']))],
    ['pass-loop-exit', graph(node('S', ['P']), node('P', ['P', 'A'], true), node('A'))],
    ['pass-ring-exit', graph(node('S', ['P']), node('P', ['Q'], true), node('Q', ['P', 'A'], true), node('A'))],
    ['closed-pass-loop', graph(node('S', ['P']), node('P', ['P'], true))],
    ['closed-pass-ring', graph(node('S', ['P', 'A']), node('P', ['Q'], true), node('Q', ['P'], true), node('A'))],
    ['multiple-traps', graph(node('S', ['P', 'Q', 'A']), node('P', ['P'], true), node('Q', ['Q'], true), node('A'))],
    ['trap-after-last', graph(node('S', ['A']), node('A', ['P']), node('P', ['P'], true))],
    ['transient-before-trap', graph(node('S', ['P', 'A']), node('P', ['P', 'Q'], true), node('Q', ['Q'], true), node('A'))],
    ['unreachable-trap', graph(node('S', ['A']), node('A'), node('P', ['P'], true))],
    ['return-pass', graph(node('S', ['P']), node('P', ['S'], true))],
    ['all-pass-acyclic', graph(node('S', ['P'], true), node('P', ['Q'], true), node('Q', [], true))],
    ['unsafe-object-ids', graph(node('__proto__', ['constructor']), node('constructor', [''], true), node(''))],
    ['pass-kinds', graph(node('S', ['P']), { ...node('P', ['T'], true), kind: 'gate' }, node('T'))],
  ];
}

export function golden(engine, reference, seed = 1) {
  let cases = 0, directRegressionAssertions = 0;
  const check = (a, b) => { assert.deepEqual(a, b); directRegressionAssertions++; };
  for (const [name, board] of fixtures()) for (const policy of ['uniform', 'toward target']) {
    const target = 'T', oracle = reference(board, 5, policy, target);
    const table = engine.boardOddsByFace(board, 5, policy, target);
    for (let face = 0; face <= 5; face++) {
      const actual = engine.boardOdds(board, delta(face), policy, target);
      same(actual, oracle.get(face), `${name}/${policy}/${face}`);
      same(table.get(face), oracle.get(face), `${name}/table/${face}`);
      invariant(board, actual); cases++;
    }
    const die = new Map([[0, q(1, 6)], [1, q(1, 3)], [5, q(1, 2)]]);
    same(engine.boardOdds(board, die, policy, target), mixture(oracle, die), name + '/mixture'); cases++;
  }
  const list = new Map(fixtures());
  const at = (name, face, start = 'S', policy = 'uniform', target) =>
    engine.boardOdds(list.get(name), delta(face), policy, target).get(start);
  check(at('line', 1).landing.get('A'), one);
  check(at('line', 1).expectedPasses.get('P'), one);
  check(at('line', 1).expectedPasses.get('Q'), zero);
  check(at('line', 2).expectedPasses.get('Q'), one);
  check(at('diamond', 1).landing.get('A'), q(1, 2));
  check(at('uneven', 1).landing.get('A'), q(1, 3));
  check(at('target-near', 1, 'S', 'toward target', 'T').landing.get('B'), one);
  check(at('target-hops-not-cost', 1, 'S', 'toward target', 'T').landing.get('A'), one);
  check(at('pass-loop-exit', 1).expectedPasses.get('P'), q(2));
  check(at('pass-loop-exit', 1, 'P').expectedPasses.get('P'), one);
  check(at('pass-loop-exit', 0, 'P').expectedPasses.get('P'), zero);
  check(at('closed-pass-ring', 1).nonTermination, q(1, 2));
  check(at('closed-pass-ring', 1).expectedPasses.get('Q'), 'infinity');
  check(at('trap-after-last', 1).nonTermination, zero);
  check(at('multiple-traps', 1).nonTermination, q(2, 3));
  check(at('transient-before-trap', 1).expectedPasses.get('P'), one);
  check(at('pass-sink', 1).landing.get('P'), one);
  check(at('ordinary-ring', Number.MAX_SAFE_INTEGER).landing.get('A'), one);
  check(at('return-pass', 2 ** 40).expectedPasses.get('P'), q(2n ** 40n));
  const huge = 2n ** 60n + 7n, precise = new Map([[0, q(1, huge)], [1, q(huge - 1n, huge)]]);
  check(engine.boardOdds(list.get('line'), precise).get('S').landing.get('S'), q(1, huge));
  check(engine.boardOdds(list.get('closed-pass-loop'), new Map([[0, one], [1, zero]])).get('P').expectedPasses.get('P'), zero);
  const objectDie = { 0: q(1, 2), 1: q(1, 2) };
  same(engine.boardOdds(list.get('line'), objectDie), engine.boardOdds(list.get('line'), new Map([[0, q(1, 2)], [1, q(1, 2)]])));
  const before = stringify(list.get('line'));
  engine.boardOdds(list.get('line'), delta(2)); check(stringify(list.get('line')), before);
  const frozen = Object.freeze({ nodes: Object.freeze(list.get('line').nodes.map(v => Object.freeze({ ...v, next: Object.freeze(v.next.slice()) }))) });
  same(engine.boardOdds(frozen, delta(2)), engine.boardOdds(list.get('line'), delta(2)));
  const random = rng(seed);
  for (let i = 0; i < 1000; i++) {
    const a = q(BigInt(random()) - 0x80000000n, BigInt(random()) + 1n);
    const b = q(BigInt(random()) - 0x80000000n, BigInt(random()) + 1n);
    assert.deepEqual(engine.rational(a.numerator, a.denominator), a);
    assert.deepEqual(engine.add(a, b), plus(a, b));
    assert.deepEqual(engine.multiply(a, b), times(a, b));
  }
  check(engine.rational(2n, -4n), q(-1, 2));
  check(engine.rational(0n, 99n), zero);
  const invalid = [
    () => engine.rational(1n, 0n),
    ...[-1, 1.5, Infinity, NaN, 2 ** 53].map(face => () => engine.boardOdds(list.get('line'), delta(face))),
    () => engine.boardOdds(list.get('line'), new Map()),
    () => engine.boardOdds(list.get('line'), new Map([[1, q(1, 2)]])),
    () => engine.boardOdds(list.get('line'), new Map([[1, q(2)]])),
    () => engine.boardOdds(list.get('line'), new Map([[0, q(-1)], [1, q(2)]])),
    () => engine.boardOdds(list.get('line'), new Map([[1, { numerator: 1n, denominator: 0n }]])),
    () => engine.boardOdds(graph(node('S'), node('S')), delta(1)),
    () => engine.boardOdds(graph(node('S', ['missing'])), delta(1)),
    () => engine.boardOdds(list.get('line'), delta(1), 'bad'),
    () => engine.boardOdds(list.get('line'), delta(1), 'toward target'),
    () => engine.boardOddsByFace(list.get('line'), -1),
  ];
  invalid.forEach(fn => assert.throws(fn));
  // JSON/untyped callers must not turn missing adjacency into a dead end or
  // a string into character-by-character branch IDs.
  const malformedNext = [undefined, null, '', 'AB', new Set(['A']), {0: 'A', length: 1}, [1], [null], [undefined], Array(1)];
  for (const next of malformedNext) {
    const board = graph({...node('S'), next}, node('A'), node('B'));
    for (const fn of [
      () => engine.boardOdds(board, delta(1)),
      () => engine.boardOddsByFace(board, 1),
    ]) {
      assert.throws(fn, TypeError);
      invalid.push(fn);
    }
  }
  // Repeatability and output isolation: modifying one output must not affect a subsequent call.
  const original = engine.boardOdds(list.get('line'), delta(1));
  original.get('S').landing.clear();
  check(engine.boardOdds(list.get('line'), delta(1)).get('S').landing.get('A'), one);
  return { fixtureDifferentialCases: cases, arithmeticCases: 1000, invalidInputCases: invalid.length,
    directRegressionAssertions, fixtureGraphs: fixtures().length };
}
