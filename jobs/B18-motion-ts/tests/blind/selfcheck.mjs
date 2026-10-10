import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { rk4Step, spring, settleTime, namedControlPoints } from './spring-oracle.mjs';

function evaluate(rows, spring = false) {
  const width = spring ? 6 : 5;
  const input = Buffer.alloc(rows.length * width * 8);
  rows.forEach((row, index) => row.forEach((value, column) =>
    input.writeDoubleLE(value, (index * width + column) * 8)));
  const run = spawnSync('./quad-oracle', spring ? ['--spring'] : [], {
    input, maxBuffer: Math.max(1024 * 1024, rows.length * 16 + 4096),
  });
  assert.equal(run.status, 0, run.stderr?.toString());
  const columns = spring ? 2 : 1;
  assert.equal(run.stdout.length, rows.length * columns * 8);
  return rows.map((_, i) => Array.from({ length: columns }, (_, j) =>
    run.stdout.readDoubleLE((i * columns + j) * 8)));
}

let assertions = 0;
let maximumRk4Error = 0;
const close = (actual, expected, tolerance = 2e-14) => {
  ++assertions;
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${actual} versus ${expected}`);
};

const curveRows = [];
const curveExpected = [];
const addCurve = (row, expected) => { curveRows.push(row); curveExpected.push(expected); };
for (const controls of Object.values(namedControlPoints)) {
  addCurve([0, ...controls], 0);
  addCurve([1, ...controls], 1);
}
for (const [x1, x2] of [[0, 0], [1, 1], [1, 0], [0, 1], [0.3, 0.7]]) {
  for (const p of [0, Number.MIN_VALUE, 1e-30, 0.1, 0.5, 0.9, 1 - 2 ** -53, 1]) {
    addCurve([p, x1, x1, x2, x2], p);
  }
}
for (const p of [Number.MIN_VALUE, 1e-300, 1e-30, 0.1, 0.5]) {
  addCurve([p, 0, 1 / 3, 0, 2 / 3], Math.cbrt(p));
}
for (const p of [0.5 - 2 ** -54, 0.5, 0.5 + 2 ** -53]) {
  addCurve([p, 1, 1 / 3, 0, 2 / 3], 0.5 + Math.cbrt((p - 0.5) / 4));
}
addCurve([-0.5, 0.25, 0.75, 0.5, 0.3], -1.5);
addCurve([-0.5, 0, 0.75, 0.5, 0.3], -0.3);
addCurve([-0.5, 0, 0.75, 0, 0.3], 0);
addCurve([1.5, 0.25, 0.75, 0.5, 0.3], 1.7);
addCurve([1.5, 0.25, 0.75, 1, 0.3], 1 + 0.5 / 3);
addCurve([1.5, 1, 0.75, 1, 0.3], 1);
addCurve([-Number.MAX_VALUE, Number.MIN_VALUE, 1, 0.5, 0.3], -Number.MAX_VALUE);
const curveValues = evaluate(curveRows);
curveValues.forEach(([value], i) => close(value, curveExpected[i]));
curveRows.forEach((row, i) => {
  if (row[1] === row[2] && row[3] === row[4]) {
    ++assertions;
    assert.equal(curveValues[i][0], row[0]);
  }
  if (row[1] === 0 && row[3] === 0 && row[2] === 1 / 3 && row[4] === 2 / 3) {
    ++assertions;
    assert.ok(Math.abs(curveValues[i][0] / curveExpected[i] - 1) < 2e-14,
      `subnormal-progress cubic inverse: ${curveValues[i][0]} vs ${curveExpected[i]}`);
  }
});

const exact = [
  { m: 1, k: 0, c: 0, x: 1, v: -0.3, f: t => [1 - 0.3 * t, -0.3] },
  { m: 1, k: 0, c: 2, x: 1, v: -0.3,
    f: t => [1 - 0.15 * (1 - Math.exp(-2 * t)), -0.3 * Math.exp(-2 * t)] },
  { m: 1, k: 4, c: 0, x: 1, v: 0, f: t => [Math.cos(2 * t), -2 * Math.sin(2 * t)] },
  { m: 1, k: 4, c: 4, x: 1, v: 0,
    f: t => [(1 + 2 * t) * Math.exp(-2 * t), -4 * t * Math.exp(-2 * t)] },
  { m: 1, k: 2, c: 3, x: 1, v: 0,
    f: t => [2 * Math.exp(-t) - Math.exp(-2 * t),
      -2 * Math.exp(-t) + 2 * Math.exp(-2 * t)] },
];
const springRows = [];
const springExpected = [];
for (const s of exact) for (const t of [-1, 0, 0.0001, 0.1, 1, 10, 1000]) {
  springRows.push([t, s.m, s.k, s.c, s.x, s.v]);
  springExpected.push(t <= 0 ? [s.x, s.v] : s.f(t));
}
springRows.push([1, 0, 1, 1, 1, 0], [1, 1, -1, 1, 1, 0]);
springExpected.push([0, 0], [0, 0]);
const springValues = evaluate(springRows, true);
springValues.forEach((state, i) => state.forEach((value, j) => close(value, springExpected[i][j])));
springRows.forEach((row, i) => spring(...row).forEach((value, j) => close(value, springExpected[i][j])));

for (const s of exact) {
  let state = [s.x, s.v];
  for (let frame = 1; frame <= 10000; ++frame) {
    state = rk4Step(state, 1e-4, s.m, s.k, s.c);
    const reference = s.f(frame * 1e-4);
    for (let i = 0; i < 2; ++i) {
      maximumRk4Error = Math.max(maximumRk4Error, Math.abs(state[i] - reference[i]));
      close(state[i], reference[i], 1e-11);
    }
  }
}

let settlingSamples = 0;
for (const s of exact.filter(s => s.k > 0 && s.c > 0)) {
  const t = settleTime(s.m, s.k, s.c, s.x, s.v, 0.001);
  assert.ok(t > 0 && Number.isFinite(t));
  for (let index = 0; index <= 1000; ++index) {
    const values = s.f(t * (1 + index / 100));
    for (const value of values) {
      ++settlingSamples;
      assert.ok(Math.abs(value) <= 0.001);
    }
  }
}
assert.equal(settleTime(0, 1, 1), 0);
assert.equal(settleTime(1, 1, 0), Number.MAX_VALUE);
assert.equal(settleTime(1, 0, 1), Number.MAX_VALUE);
assert.equal(settleTime(1, 1, 1, 0, 0), 0);

const result = {
  mathematicalBezierCases: curveRows.length,
  mathematicalSpringCases: springRows.length,
  rk4Frames: exact.length * 10000,
  rk4StateValues: exact.length * 10000 * 2,
  maximumRk4Error,
  settlingSamples,
  scalarAssertions: assertions,
  status: 'passed',
};
writeFileSync('SELFCHECK.json', `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(result)}\n`);
