import assert from 'node:assert/strict';
import { cpus, platform, arch } from 'node:os';
import { performance } from 'node:perf_hooks';
import { findBestPlay, validatePosition, validateTable, validatePlay } from '../dist/rummikub.js';
import { referenceValidateTable, referenceValidatePlay } from '../dist/reference.js';
import { rng, largePosition, freeze, receipt, seedArg, hash } from './helpers.mjs';
const seed = seedArg(), random = rng(seed), cases = 200;
const samples = [], values = [], counts = [0, 0, 0];
let corpus = '', worstInput, worstMs = -1;
// Warm up V8 only: distinct positions, and no caches survive a solver call.
const warm = rng(0xB1100000 + seed);
for (let i = 0; i < 8; i++) {
  const p=freeze(largePosition(warm,i)),a=findBestPlay(p);assert.ok(a.ok);
  assert.ok(validateTable(a.table).ok);assert.ok(referenceValidateTable(a.table));
  if(a.action==='play'){assert.ok(validatePlay(p,a.table).ok);assert.ok(referenceValidatePlay(p,a.table));}
}
for (let i = 0; i < cases; i++) {
  const p = freeze(largePosition(random, i));
  const input = JSON.stringify(p); corpus += input + '\n';
  assert.equal(p.table.flatMap(m => m.tiles).length, 40);
  assert.equal(p.hand.length, 20);
  assert.ok(validatePosition(p).ok);
  const all = [...p.table.flatMap(m => m.tiles), ...p.hand];
  counts[all.filter(t => t.kind === 'joker').length]++;
  const start = performance.now();
  const answer = findBestPlay(p);
  const ms = performance.now() - start;
  assert.ok(answer.ok, JSON.stringify(answer));
  assert.ok(answer.optimal);
  assert.ok(validateTable(answer.table).ok);
  assert.ok(referenceValidateTable(answer.table));
  if (answer.action === 'play') {
    assert.ok(validatePlay(p, answer.table).ok);
    assert.ok(referenceValidatePlay(p, answer.table));
  } else assert.deepEqual(answer.table, p.table);
  assert.equal(JSON.stringify(p), input);
  samples.push({ case: i, ms, value: answer.value, played: answer.played.length, ...answer.stats });
  values.push(ms);
  if (ms > worstMs) { worstMs = ms; worstInput = p; }
  if (ms > 500) console.log(`PERFORMANCE OVER LIMIT seed=${seed} case=${i} ms=${ms.toFixed(3)}`);
  if ((i + 1) % 50 === 0) console.log(`bench seed=${seed} ${i + 1}/${cases}`);
}
values.sort((a, b) => a - b);
const result = {
  suite: '40-table-20-hand-latency', seed, cases, warmupCases: 8, warmupPassed: 8, passed: samples.filter(x => x.ms <= 500).length,
  command: `SEED=${seed} node test/bench.mjs`, limitMs: 500,
  p50Ms: values[Math.ceil(cases * 0.50) - 1], p99Ms: values[Math.ceil(cases * 0.99) - 1],
  maxMs: values.at(-1), totalJokerHistogram: counts, corpusSha256: hash(corpus),
  environment: { node: process.version, platform: platform(), arch: arch(), cpu: cpus()[0]?.model },
  samples, worstInput,
};
receipt(`bench-seed-${seed}`, result);
console.log(JSON.stringify({ ...result, samples: undefined, worstInput: undefined }));
assert.ok(result.p99Ms <= 500, `p99 ${result.p99Ms} exceeds 500 ms`);
assert.ok(result.maxMs <= 500, `maximum ${result.maxMs} exceeds 500 ms`);
