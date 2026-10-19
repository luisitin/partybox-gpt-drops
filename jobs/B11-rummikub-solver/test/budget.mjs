// Expansion-cap suite: options.maxStates is deterministic (no clock) and exact at its boundary.
// A cap equal to the unbounded search size returns the identical answer; one below it refuses.
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { findBestPlay } from '../dist/rummikub.js';
import { rng, smallPosition, largePosition, freeze, receipt, seedArg } from './helpers.mjs';

const seed = seedArg(), random = rng(0xB0D6E700 + seed);
const SMALL = 120, LARGE = 8;
const positions = [];
for (let i = 0; i < SMALL; i++) positions.push({ name: `small-${i}`, large: false, p: freeze(smallPosition(random, i)) });
for (let i = 0; i < LARGE; i++) positions.push({ name: `large-${i}`, large: true, p: freeze(largePosition(random, i)) });

const BAD_OPTIONS = [{ maxStates: -1 }, { maxStates: 1.5 }, { maxStates: Number.NaN }, { maxStates: '3' },
  { maxStates: Infinity }, { maxStates: 2 ** 53 }, null, 'x', []];
const results = [], largeStates = [], largeMs = [], refusalMs = [];
let refusals = 0, boundaryChecks = 0, shapeChecks = 0;

for (const { name, large, p } of positions) {
  try {
    const base = findBestPlay(p);
    assert.ok(base.ok, 'unbounded solve must succeed');
    assert.deepEqual(findBestPlay(p, {}), base, 'empty options equal the default');
    assert.deepEqual(findBestPlay(p, { maxStates: undefined }), base, 'an undefined cap is no cap');
    assert.deepEqual(findBestPlay(p, { maxStates: Number.MAX_SAFE_INTEGER }), base, 'a huge cap is inert');
    const s = base.stats.states;
    assert.deepEqual(findBestPlay(p, { maxStates: s }), base, 'a cap equal to the search size changes nothing');
    boundaryChecks++;
    if (s > 0) {
      const start = performance.now();
      const tight = findBestPlay(p, { maxStates: s - 1 });
      refusalMs.push(performance.now() - start);
      assert.equal(tight.ok, false, 'one expansion below the search size must refuse');
      assert.equal(tight.error.code, 'BUDGET_EXCEEDED');
      assert.deepEqual(Object.keys(tight).sort(), ['error', 'ok'], 'a refusal carries no partial play');
      assert.deepEqual(findBestPlay(p, { maxStates: s - 1 }), tight, 'a refusal is deterministic');
      refusals++;
    }
    if (large) {
      largeStates.push(s);
      const start = performance.now();
      findBestPlay(p);
      largeMs.push(performance.now() - start);
    }
    for (const bad of BAD_OPTIONS) {
      const r = findBestPlay(p, bad);
      assert.equal(r.ok, false, `malformed options ${JSON.stringify(bad)} must refuse`);
      assert.equal(r.error.code, 'BUDGET_SHAPE');
      shapeChecks++;
    }
    results.push({ name, passed: true, states: s });
  } catch (error) {
    results.push({ name, passed: false, error: String(error) });
    console.error(`B11_ASSERTION_FAILURE ${name}: ${error}`);
  }
}

const summary = (values) => {
  const v = [...values].sort((a, b) => a - b);
  const at = (q) => v.length ? v[Math.min(v.length - 1, Math.ceil(v.length * q) - 1)] : null;
  return { n: v.length, p50: at(0.5), p99: at(0.99), max: v.at(-1) ?? null };
};
const data = {
  suite: 'expansion-cap', seed, cases: results.length, passed: results.filter(x => x.passed).length,
  command: `SEED=${seed} node test/budget.mjs`, refusals, boundaryChecks, shapeChecks,
  refusalMs: summary(refusalMs), largeStates: summary(largeStates), largeUnboundedMs: summary(largeMs),
  results,
};
receipt(`budget-seed-${seed}`, data);
console.log(JSON.stringify({ ...data, results: undefined }));
if (data.passed !== data.cases) process.exitCode = 1;
