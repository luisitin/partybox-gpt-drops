import { referenceByFace } from './dist/reference.js';

let checks = 0;
function assert(condition, message) {
  checks++;
  if (!condition) throw new Error(message);
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}
function f(n, d = 1n) {
  n = BigInt(n);
  d = BigInt(d);
  const g = gcd(n, d);
  return { numerator: n / g, denominator: d / g };
}
function plus(a, b) {
  return f(a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator);
}
function times(a, b) {
  return f(a.numerator * b.numerator, a.denominator * b.denominator);
}
function equal(a, b) {
  return a.numerator === b.numerator && a.denominator === b.denominator;
}
function leq(a, b) {
  if (b === 'infinity') return true;
  if (a === 'infinity') return false;
  return a.numerator * b.denominator <= b.numerator * a.denominator;
}

const node = (id, next = [], passThrough = false) => ({ id, kind: 'irrelevant', next, passThrough });
const board = (...nodes) => ({ nodes });
function value(table, face, start) {
  const row = table.get(face)?.get(start);
  assert(row !== undefined, `Missing ${face}/${start}`);
  return row;
}
function landing(table, face, start, id, n, d = 1n) {
  const actual = value(table, face, start).landing.get(id);
  assert(actual !== undefined && equal(actual, f(n, d)), `Landing ${face}/${start}/${id}`);
}
function pass(table, face, start, id, n, d = 1n) {
  const actual = value(table, face, start).expectedPasses.get(id);
  assert(n === 'infinity' ? actual === n : actual !== undefined && actual !== 'infinity'
    && equal(actual, f(n, d)), `Pass ${face}/${start}/${id}`);
}
function nonterm(table, face, start, n, d = 1n) {
  assert(equal(value(table, face, start).nonTermination, f(n, d)), `Nontermination ${face}/${start}`);
}

let fixtures = 0;
function fixture(run) { run(); fixtures++; }
fixture(() => {
  const t = referenceByFace(board(), 4);
  assert(t.size === 5, 'Empty board face table');
  for (const odds of t.values()) assert(odds.size === 0, 'Empty board start table');
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['b']), node('b', ['c']), node('c')), 5);
  landing(t, 0, 'a', 'a', 1n);
  landing(t, 1, 'a', 'b', 1n);
  landing(t, 2, 'a', 'c', 1n);
  landing(t, 5, 'a', 'c', 1n);
  landing(t, 5, 'c', 'c', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['q'], true),
    node('q', ['b'], true), node('b')), 3);
  landing(t, 1, 'a', 'b', 1n);
  pass(t, 1, 'a', 'p', 1n);
  pass(t, 1, 'a', 'q', 1n);
  pass(t, 1, 'p', 'p', 0n);
  pass(t, 1, 'p', 'q', 1n);
  landing(t, 0, 'p', 'p', 1n);
  pass(t, 0, 'p', 'p', 0n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['a'])), 10);
  for (let face = 0; face <= 10; face++) landing(t, face, 'a', 'a', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('p', ['p'], true)), 3);
  nonterm(t, 0, 'p', 0n);
  pass(t, 0, 'p', 'p', 0n);
  for (let face = 1; face <= 3; face++) {
    nonterm(t, face, 'p', 1n);
    landing(t, face, 'p', 'p', 0n);
    pass(t, face, 'p', 'p', 'infinity');
  }
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['p', 'b'], true), node('b')), 2);
  landing(t, 1, 'a', 'b', 1n);
  pass(t, 1, 'a', 'p', 2n);
  pass(t, 1, 'p', 'p', 1n);
  pass(t, 2, 'a', 'p', 2n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['q'], true),
    node('q', ['p', 'b'], true), node('b')), 1);
  landing(t, 1, 'a', 'b', 1n);
  pass(t, 1, 'a', 'p', 2n);
  pass(t, 1, 'a', 'q', 2n);
  pass(t, 1, 'p', 'p', 1n);
  pass(t, 1, 'p', 'q', 2n);
  pass(t, 1, 'q', 'p', 1n);
  pass(t, 1, 'q', 'q', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['q', 'b'], true),
    node('q', ['p', 'c'], true), node('b'), node('c')), 1);
  landing(t, 1, 'a', 'b', 2n, 3n);
  landing(t, 1, 'a', 'c', 1n, 3n);
  pass(t, 1, 'a', 'p', 4n, 3n);
  pass(t, 1, 'a', 'q', 2n, 3n);
  pass(t, 1, 'p', 'p', 1n, 3n);
  pass(t, 1, 'p', 'q', 2n, 3n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['t']), node('t', ['p', 'b'], true),
    node('p', ['q'], true), node('q', ['p'], true), node('b')), 2);
  landing(t, 1, 'a', 'b', 1n, 2n);
  nonterm(t, 1, 'a', 1n, 2n);
  pass(t, 1, 'a', 't', 1n);
  pass(t, 1, 'a', 'p', 'infinity');
  pass(t, 1, 'a', 'q', 'infinity');
  pass(t, 1, 'p', 't', 0n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', [], true)), 5);
  landing(t, 1, 'a', 'p', 1n);
  pass(t, 1, 'a', 'p', 1n);
  landing(t, 5, 'a', 'p', 1n);
  pass(t, 5, 'a', 'p', 1n);
  pass(t, 5, 'p', 'p', 0n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['b']), node('b', ['p']),
    node('p', ['c'], true), node('c')), 2);
  landing(t, 1, 'a', 'b', 1n);
  pass(t, 1, 'a', 'p', 0n);
  landing(t, 2, 'a', 'c', 1n);
  pass(t, 2, 'a', 'p', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['a'], true)), 5);
  landing(t, 3, 'a', 'a', 1n);
  pass(t, 3, 'a', 'p', 3n);
  pass(t, 3, 'p', 'p', 2n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['b', 'b', 'c']), node('b'), node('c')), 1);
  landing(t, 1, 'a', 'b', 1n, 2n);
  landing(t, 1, 'a', 'c', 1n, 2n);
});
fixture(() => {
  const g = board(node('a', ['p', 'b']), node('p', ['q'], true),
    node('q', ['t'], true), node('b', ['t']), node('t'));
  const t = referenceByFace(g, 1, 'toward target', 't');
  landing(t, 1, 'a', 'b', 1n);
  pass(t, 1, 'a', 'p', 0n);
});
fixture(() => {
  const g = board(node('a', ['b', 'c']), node('b', ['t']), node('c', ['t']), node('t'));
  const t = referenceByFace(g, 1, 'toward target', 't');
  landing(t, 1, 'a', 'b', 1n, 2n);
  landing(t, 1, 'a', 'c', 1n, 2n);
});
fixture(() => {
  const g = board(node('a', ['b', 'c']), node('b'), node('c'), node('isolated'));
  for (const target of ['missing', 'isolated', undefined]) {
    const t = referenceByFace(g, 1, 'toward target', target);
    landing(t, 1, 'a', 'b', 1n, 2n);
    landing(t, 1, 'a', 'c', 1n, 2n);
  }
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['t']), node('t', ['c']), node('c')), 2,
    'toward target', 't');
  landing(t, 2, 'a', 'c', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('__proto__', ['']), node('', ['toString'], true),
    node('toString', ['a/b']), node('a/b')), 2);
  landing(t, 1, '__proto__', 'toString', 1n);
  pass(t, 1, '__proto__', '', 1n);
  landing(t, 2, '__proto__', 'a/b', 1n);
});
fixture(() => {
  const g = board(node('a', ['p']), node('p', ['p', 'b'], true), node('b'));
  const original = JSON.stringify(g);
  for (const n of g.nodes) { Object.freeze(n.next); Object.freeze(n); }
  Object.freeze(g.nodes);
  Object.freeze(g);
  const t = referenceByFace(g, 2);
  assert(JSON.stringify(g) === original, 'Input preservation');
  t.get(0).get('a').landing.get('b').numerator = 99n;
  landing(t, 1, 'b', 'a', 0n);
  const again = referenceByFace(g, 2);
  landing(again, 0, 'a', 'b', 0n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['b']), node('b', ['p']),
    node('p', ['p'], true)), 3);
  nonterm(t, 1, 'a', 0n);
  pass(t, 1, 'a', 'p', 0n);
  nonterm(t, 2, 'a', 1n);
  pass(t, 2, 'a', 'p', 'infinity');
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['t', 'b']), node('t', ['t', 'p'], true),
    node('p', ['p'], true), node('b')), 2);
  nonterm(t, 1, 'a', 1n, 2n);
  landing(t, 1, 'a', 'b', 1n, 2n);
  pass(t, 1, 'a', 't', 1n);
  pass(t, 1, 'a', 'p', 'infinity');
  pass(t, 1, 't', 't', 1n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p', 'q', 'r']), node('p', ['p'], true),
    node('q', ['q'], true), node('r', [], true)), 2);
  nonterm(t, 1, 'a', 2n, 3n);
  landing(t, 1, 'a', 'r', 1n, 3n);
  pass(t, 1, 'a', 'p', 'infinity');
  pass(t, 1, 'a', 'q', 'infinity');
  pass(t, 1, 'a', 'r', 1n, 3n);
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['a', 'p']), node('p', ['p'], true)), 3);
  nonterm(t, 3, 'a', 7n, 8n);
  landing(t, 3, 'a', 'a', 1n, 8n);
  pass(t, 3, 'a', 'p', 'infinity');
});
fixture(() => {
  const t = referenceByFace(board(node('a', ['p']), node('p', ['b'], true),
    node('b', ['c']), node('c')), 2, 'toward target', 'p');
  landing(t, 1, 'a', 'b', 1n);
  landing(t, 2, 'a', 'c', 1n);
  pass(t, 2, 'a', 'p', 1n);
});

// A separate direct path enumerator is safe on DAGs: it makes an entry at
// each edge and spends a step only on ordinary destinations.
function enumerate(g, start, face, policy, target) {
  const byId = new Map(g.nodes.map(n => [n.id, n]));
  const distances = new Map(g.nodes.map(n => [n.id, Infinity]));
  if (policy === 'toward target' && byId.has(target)) {
    distances.set(target, 0);
    // Simple repeated relaxation intentionally differs from reference BFS.
    for (let iteration = 0; iteration < g.nodes.length; iteration++) {
      for (const n of g.nodes) for (const next of new Set(n.next)) {
        distances.set(n.id, Math.min(distances.get(n.id), 1 + distances.get(next)));
      }
    }
  }
  const row = {
    landing: new Map(g.nodes.map(n => [n.id, f(0n)])),
    nonTermination: f(0n),
    expectedPasses: new Map(g.nodes.filter(n => n.passThrough).map(n => [n.id, f(0n)])),
  };
  function walk(id, remaining, probability) {
    const n = byId.get(id);
    if (remaining === 0 || n.next.length === 0) {
      row.landing.set(id, plus(row.landing.get(id), probability));
      return;
    }
    let choices = [...new Set(n.next)];
    if (policy === 'toward target') {
      const best = Math.min(...choices.map(next => distances.get(next)));
      choices = choices.filter(next => distances.get(next) === best);
    }
    const weight = times(probability, f(1n, BigInt(choices.length)));
    for (const next of choices) {
      const destination = byId.get(next);
      if (destination.passThrough) {
        row.expectedPasses.set(next, plus(row.expectedPasses.get(next), weight));
      }
      walk(next, remaining - (destination.passThrough ? 0 : 1), weight);
    }
  }
  walk(start, face, f(1n));
  return row;
}

function makeRng(seed) {
  let state = seed >>> 0;
  return n => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % n; };
}
function randomGraph(rng, cyclic) {
  const size = 1 + rng(10);
  const nodes = Array.from({ length: size }, (_, i) => node(`n${i}`, [], rng(3) === 0));
  for (let from = 0; from < size; from++) {
    const eligible = cyclic ? size : size - from - 1;
    if (eligible === 0) continue;
    const count = rng(Math.min(eligible, 4) + 1);
    for (let j = 0; j < count; j++) {
      const to = cyclic ? rng(size) : from + 1 + rng(eligible);
      nodes[from].next.push(`n${to}`);
    }
  }
  return { nodes };
}
function compare(actual, expected, message) {
  assert(equal(actual.nonTermination, expected.nonTermination), `${message} nontermination`);
  for (const [id, value] of expected.landing) {
    assert(equal(actual.landing.get(id), value), `${message} landing ${id}`);
  }
  for (const [id, value] of expected.expectedPasses) {
    assert(equal(actual.expectedPasses.get(id), value), `${message} passes ${id}`);
  }
}

let dagGraphs = 0;
let cyclicGraphs = 0;
let dagComparisons = 0;
let cyclicRows = 0;
for (const seed of [1, 2, 3]) {
  const rng = makeRng(seed);
  for (let index = 0; index < 200; index++) {
    const g = randomGraph(rng, false);
    dagGraphs++;
    for (const policy of ['uniform', 'toward target']) {
      const target = index % 7 === 0 ? 'unknown' : `n${rng(g.nodes.length)}`;
      const t = referenceByFace(g, 4, policy, target);
      for (let face = 0; face <= 4; face++) for (const n of g.nodes) {
        dagComparisons++;
        compare(t.get(face).get(n.id), enumerate(g, n.id, face, policy, target),
          `DAG seed=${seed} index=${index} face=${face} start=${n.id} policy=${policy}`);
      }
    }
  }
  for (let index = 0; index < 200; index++) {
    const g = randomGraph(rng, true);
    cyclicGraphs++;
    for (const policy of ['uniform', 'toward target']) {
      const t = referenceByFace(g, 4, policy, `n${rng(g.nodes.length)}`);
      for (let face = 0; face <= 4; face++) for (const n of g.nodes) {
        cyclicRows++;
        const row = t.get(face).get(n.id);
        let total = row.nonTermination;
        assert(row.landing.size === g.nodes.length, 'Every physical landing present');
        assert(row.expectedPasses.size === g.nodes.filter(n => n.passThrough).length,
          'Every pass-through reward present');
        for (const probability of row.landing.values()) total = plus(total, probability);
        assert(equal(total, f(1n)), 'Exact total probability');
        for (const rational of [...row.landing.values(), row.nonTermination,
          ...row.expectedPasses.values()].filter(v => v !== 'infinity')) {
          assert(rational.numerator >= 0n && rational.denominator > 0n
            && gcd(rational.numerator, rational.denominator) === 1n, 'Canonical nonnegative fraction');
        }
        if (face > 0) {
          const prior = t.get(face - 1).get(n.id);
          assert(leq(prior.nonTermination, row.nonTermination), 'Nontermination monotonicity');
          for (const [id, passes] of row.expectedPasses) {
            assert(leq(prior.expectedPasses.get(id), passes), 'Pass reward monotonicity');
          }
        }
      }
    }
  }
}
console.log(JSON.stringify({ fixtures, dagGraphs, dagComparisons, cyclicGraphs, cyclicRows,
  seeds: [1, 2, 3], checks, passed: true }));
