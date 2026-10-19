import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import * as engine from './build/boardOdds.js';
import { referenceByFace } from './build/blind-reference.js';
import { q, one, zero, plus, times, number, delta, same, invariant, mixture, rng, pick,
  randomDag, randomCyclic, randomDie, pathChoices, brute, golden, stringify } from './support.mjs';
import { connectB01 } from './connect-b01.mjs';

const argument = name => { const at = process.argv.indexOf(name); return at < 0 ? undefined : process.argv[at + 1]; };
const seed = Number(argument('--seed') ?? 1), smoke = process.argv.includes('--smoke');
assert.ok([1, 2, 3].includes(seed));
const mode = argument('--mode') ?? 'all';
const report = { seed, smoke, suites: [], passed: false };
mkdirSync('.verification', { recursive: true });
const record = row => { report.suites.push(row); console.log(JSON.stringify(row)); };
const maxFace = 10;
function exactGraphs(name, count, random, makeBoard, enumerate) {
  let startFaceChecks = 0, pathLeaves = 0, graphPolicyFaceCases = 0, mixedCases = 0, enumeratedCases = 0;
  let minimumNodes = Infinity, maximumNodes = 0;
  for (let g = 0; g < count; g++) {
    const board = makeBoard(random, g);
    minimumNodes = Math.min(minimumNodes, board.nodes.length); maximumNodes = Math.max(maximumNodes, board.nodes.length);
    const target = g % 5 === 0 ? 'missing-target' : board.nodes[pick(random, board.nodes.length)].id;
    const die = randomDie(random, maxFace);
    for (const policy of ['uniform', 'toward target']) {
      const ref = referenceByFace(board, maxFace, policy, target);
      const table = engine.boardOddsByFace(board, maxFace, policy, target);
      for (let face = 0; face <= maxFace; face++) {
        const label = `${name}/seed=${seed}/graph=${g}/policy=${policy}/face=${face}`;
        const actual = engine.boardOdds(board, delta(face), policy, target);
        same(actual, ref.get(face), label); same(table.get(face), ref.get(face), label + '/table');
        invariant(board, actual); graphPolicyFaceCases++; startFaceChecks += board.nodes.length;
        if (enumerate(g)) {
          const paths = brute(board, face, policy, target); pathLeaves += paths.leaves;
          same(actual, paths.output, label + '/brute'); enumeratedCases++;
        }
      }
      const actualMix = engine.boardOdds(board, die, policy, target);
      same(actualMix, mixture(ref, die), `${name}/${g}/${policy}/mixed`); invariant(board, actualMix); mixedCases++;
      // Node order and edge order are representations, not probabilities.
      const reversed = { nodes: board.nodes.slice().reverse().map(v => ({ ...v, next: v.next.slice().reverse() })) };
      same(engine.boardOdds(reversed, die, policy, target), actualMix, `${name}/${g}/permutation`);
    }
    if ((g + 1) % 250 === 0) console.log(`${name}: ${g + 1}/${count} graphs`);
  }
  record({ name, graphs: count, policies: 2, faces: '0..10 inclusive', minimumNodes, maximumNodes,
    graphPolicyFaceCases, startFaceChecks, mixtureCases: mixedCases, permutationCases: mixedCases,
    bruteForceCases: enumeratedCases, enumeratedTerminalPaths: pathLeaves, passed: true });
}
function withinFour(observed, trials, p) {
  const error = BigInt(observed) * p.denominator - BigInt(trials) * p.numerator;
  return error * error <= 16n * BigInt(trials) * p.numerator * (p.denominator - p.numerator);
}
function withinFourMean(total, trials, mean, variance) {
  const error = BigInt(total) * mean.denominator - BigInt(trials) * mean.numerator;
  return error * error * variance.denominator <= 16n * BigInt(trials) * variance.numerator * mean.denominator ** 2n;
}
function simulateSuite() {
  const randomBoards = rng(seed ^ 0x53494D47), graphs = smoke ? 2 : 50, trials = smoke ? 10000 : 1000000;
  const rows = [], failures = [];
  let landingChecks = 0, passChecks = 0, maxLandingZ = 0, maxPassZ = 0, pathsEnumerated = 0;
  for (let g = 0; g < graphs; g++) {
    const board = g < graphs / 2 ? randomDag(randomBoards, 3 + pick(randomBoards, 23)) : randomCyclic(randomBoards, false);
    const policy = g % 2 ? 'toward target' : 'uniform';
    const target = g % 5 === 0 ? 'missing-target' : board.nodes[pick(randomBoards, board.nodes.length)].id;
    const choices = pathChoices(board, policy, target);
    const s = Math.max(0, choices.findIndex(edges => edges.length > 1));
    const start = board.nodes[s].id;
    const weights = Array.from({ length: maxFace + 1 }, () => 1 + pick(randomBoards, 5));
    const tickets = weights.flatMap((w, face) => Array(w).fill(face));
    const die = new Map(weights.map((w, face) => [face, q(w, tickets.length)]));
    const expected = engine.boardOdds(board, die, policy, target);
    const ref = referenceByFace(board, maxFace, policy, target);
    same(expected, mixture(ref, die), `simulation/${seed}/${g}/oracle`); invariant(board, expected);
    const second = new Map(board.nodes.filter(v => v.passThrough).map(v => [v.id, zero]));
    for (const [face, p] of die) {
      const paths = brute(board, face, policy, target, s); pathsEnumerated += paths.leaves;
      same(new Map([[start, ref.get(face).get(start)]]), paths.output, `simulation/${g}/${face}/brute`);
      for (const [id, e2] of paths.secondMoments.get(start)) second.set(id, plus(second.get(id), times(p, e2)));
    }
    const expectedRow = expected.get(start); assert.deepEqual(expectedRow.nonTermination, zero);
    const counts = new Float64Array(board.nodes.length), passes = new Float64Array(board.nodes.length);
    const rollRandom = rng((seed ^ 0x524F4C4C ^ Math.imul(g + 1, 0x9E3779B9)) >>> 0);
    const limits = choices.map(edges => edges.length ? 0x100000000 - 0x100000000 % edges.length : 0);
    const ticketLimit = 0x100000000 - 0x100000000 % tickets.length;
    // Walk graph edges, not a sampled engine CDF. No truncation or timeout bucket.
    for (let roll = 0; roll < trials; roll++) {
      let word; do { word = rollRandom(); } while (word >= ticketLimit);
      let left = tickets[word % tickets.length], at = s;
      while (left > 0 && choices[at].length > 0) {
        const edges = choices[at], limit = limits[at];
        do { word = rollRandom(); } while (word >= limit);
        at = edges[word % edges.length];
        if (board.nodes[at].passThrough) passes[at]++; else left--;
      }
      counts[at]++;
    }
    assert.equal(counts.reduce((a, b) => a + b, 0), trials);
    const landingRows = [], passRows = [];
    board.nodes.forEach((v, j) => {
      const p = expectedRow.landing.get(v.id), probability = number(p);
      const variance = trials * probability * (1 - probability);
      const z = variance > 0 ? Math.abs(counts[j] - trials * probability) / Math.sqrt(variance) : 0;
      const passed = withinFour(counts[j], trials, p); landingChecks++;
      maxLandingZ = Math.max(maxLandingZ, z);
      landingRows.push({ node: v.id, probability: `${p.numerator}/${p.denominator}`, observed: counts[j], z, passed });
      if (!passed) failures.push({ graph: g, node: v.id, type: 'landing', z });
      if (v.passThrough) {
        const mean = expectedRow.expectedPasses.get(v.id); assert.notEqual(mean, 'infinity');
        const squaredMean = times(mean, mean), e2 = second.get(v.id);
        const variance = plus(e2, q(-squaredMean.numerator, squaredMean.denominator));
        assert.ok(variance.numerator >= 0n);
        const sd = Math.sqrt(trials * number(variance));
        const z = sd > 0 ? Math.abs(passes[j] - trials * number(mean)) / sd : 0;
        const passed = withinFourMean(passes[j], trials, mean, variance); passChecks++;
        maxPassZ = Math.max(maxPassZ, z);
        passRows.push({ node: v.id, expectation: `${mean.numerator}/${mean.denominator}`,
          variance: `${variance.numerator}/${variance.denominator}`, observedTotal: passes[j], z, passed });
        if (!passed) failures.push({ graph: g, node: v.id, type: 'passes', z });
      }
    });
    rows.push({ graph: g, board, policy, target, start, trials, die: [...die], landing: landingRows, passes: passRows });
    console.log(`simulation: seed=${seed}, graph=${g + 1}/${graphs}, rolls=${trials}, failures=${failures.length}`);
  }
  const detail = { seed, graphs, rollsPerGraph: trials, totalRolls: graphs * trials, landingChecks, passChecks,
    maxLandingZ, maxPassZ, comparisonsUseExactIntegerInequalities: true, failures, graphsDetail: rows };
  writeFileSync(`.verification/simulation-seed-${seed}.json`, stringify(detail) + '\n');
  record({ name: 'seeded-simulation', graphs, rollsPerGraph: trials, totalRolls: graphs * trials,
    landingChecks, passChecks, maxLandingZ, maxPassZ, enumeratedMomentPaths: pathsEnumerated, passed: failures.length === 0 });
  assert.equal(failures.length, 0, stringify(failures));
}
try {
  if (mode === 'all' || mode === 'golden') {
    const results = golden(engine, referenceByFace, seed);
    record({ name: 'golden-regression-arithmetic-validation', ...results, passed: true });
    const connection = connectB01(engine);
    record({ name: 'b01-dice-connection', ...connection, passed: true });
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    assert.deepEqual(pkg.dependencies, {});
    for (const file of ['boardOdds.ts', 'blind-reference.ts']) {
      const source = readFileSync(file, 'utf8');
      assert.ok(!/Math\s*\.\s*random\s*\(|Date\s*\.\s*now\s*\(/.test(source), file);
      assert.ok(!/^\s*import\s/m.test(source), 'Implementations must share no runtime code');
    }
    record({ name: 'dependency-purity-static-guards', checkedSources: 2, passed: true });
  }
  if (mode === 'all' || mode === 'random') exactGraphs('random-acyclic-brute-force', smoke ? 20 : 2000,
    rng(seed ^ 0x44414753), r => randomDag(r), () => true);
  if (mode === 'all' || mode === 'cycles') exactGraphs('cyclic-graphs', smoke ? 10 : 500,
    rng(seed ^ 0x4359434C), (r, i) => randomCyclic(r, i >= (smoke ? 5 : 250)),
    i => i < (smoke ? 5 : 250));
  if (mode === 'all' || mode === 'simulation') simulateSuite();
  report.passed = true;
} catch (error) {
  report.error = String(error?.stack ?? error); console.error(report.error); process.exitCode = 1;
} finally {
  writeFileSync(`.verification/tests-seed-${seed}${smoke ? '-smoke' : ''}${mode === 'all' ? '' : '-' + mode}.json`, JSON.stringify(report, null, 2) + '\n');
}
