import assert from 'node:assert/strict';
import { cpus, platform, arch } from 'node:os';
import { performance } from 'node:perf_hooks';
import { findBestPlay, validatePosition, validateTable, validatePlay } from '../dist/rummikub.js';
import { referenceValidateTable, referenceValidatePlay } from './blind-adapter.mjs';
import {loadIndependentLedger} from './independent-ledger.mjs';
import { rng, largePosition, freeze, receipt, seedArg, hash } from './helpers.mjs';
const seed = seedArg(), random = rng(seed), cases = 200;
const independentAnswer=loadIndependentLedger(seed);
const samples = [], warmupSamples = [], values = [], counts = [0, 0, 0];
let corpus = '', warmupCorpus = '', worstInput, worstMs = -1, worstPhase, worstCase;
// Distinct cold-start positions are also measured and subject to the literal gate.
const warm = rng(0xB1100000 + seed);
for (let i = 0; i < 8; i++) {
  const p=freeze(largePosition(warm,i)),input=JSON.stringify(p);
  warmupCorpus+=input+'\n';
  const start=performance.now();
  const a=findBestPlay(p);
  const ms=performance.now()-start;
  assert.ok(a.ok);const b=independentAnswer('warm',i,p);assert.ok(b.ok);
  assert.equal(a.value,b.value);assert.equal(a.played.length,b.playedCount);
  for(const answer of [a,b]) {
    assert.ok(validateTable(answer.table).ok);assert.ok(referenceValidateTable(answer.table));
    if(answer.action==='play'){assert.ok(validatePlay(p,answer.table).ok);assert.ok(referenceValidatePlay(p,answer.table));}
    else assert.deepEqual(answer.table,p.table);
  }
  assert.equal(JSON.stringify(p),input);
  warmupSamples.push({case:i,ms,value:a.value,played:a.played.length,...a.stats});
  if(ms>worstMs){worstMs=ms;worstInput=p;worstPhase='warm';worstCase=i;}
  if(ms>500)console.log(`PERFORMANCE OVER LIMIT seed=${seed} warmup=${i} ms=${ms.toFixed(3)}`);
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
  const reference = independentAnswer('main',i,p);assert.ok(reference.ok);
  assert.equal(answer.value,reference.value);assert.equal(answer.played.length,reference.playedCount);
  assert.ok(validateTable(reference.table).ok);assert.ok(referenceValidateTable(reference.table));
  if(reference.action==='play'){assert.ok(validatePlay(p,reference.table).ok);assert.ok(referenceValidatePlay(p,reference.table));}
  assert.ok(validateTable(answer.table).ok);
  assert.ok(referenceValidateTable(answer.table));
  if (answer.action === 'play') {
    assert.ok(validatePlay(p, answer.table).ok);
    assert.ok(referenceValidatePlay(p, answer.table));
  } else assert.deepEqual(answer.table, p.table);
  assert.equal(JSON.stringify(p), input);
  samples.push({ case: i, ms, value: answer.value, played: answer.played.length, ...answer.stats });
  values.push(ms);
  if (ms > worstMs) { worstMs = ms; worstInput = p; worstPhase='main'; worstCase=i; }
  if (ms > 500) console.log(`PERFORMANCE OVER LIMIT seed=${seed} case=${i} ms=${ms.toFixed(3)}`);
  if ((i + 1) % 50 === 0) console.log(`bench seed=${seed} ${i + 1}/${cases}`);
}
values.sort((a, b) => a - b);
const result = {
  suite: '40-table-20-hand-latency', seed, cases, warmupCases: 8,
  warmupPassed: warmupSamples.filter(x=>x.ms<=500).length,
  allMeasuredCalls: cases+8, allPassed: [...samples,...warmupSamples].filter(x=>x.ms<=500).length,
  blindOptimumComparisons: cases + 8, passed: samples.filter(x => x.ms <= 500).length,
  command: `SEED=${seed} node test/bench.mjs`, limitMs: 500,
  p50Ms: values[Math.ceil(cases * 0.50) - 1], p99Ms: values[Math.ceil(cases * 0.99) - 1],
  mainMaxMs: values.at(-1), warmupMaxMs: Math.max(...warmupSamples.map(x=>x.ms)),
  maxMs: Math.max(values.at(-1),...warmupSamples.map(x=>x.ms)),
  totalJokerHistogram: counts, corpusSha256: hash(corpus),warmupCorpusSHA256:hash(warmupCorpus),
  environment: { node: process.version, platform: platform(), arch: arch(), cpu: cpus()[0]?.model },
  samples, warmupSamples, worstInput, worstPhase, worstCase,
};
receipt(`bench-seed-${seed}`, result);
console.log(JSON.stringify({ ...result, samples: undefined, warmupSamples: undefined, worstInput: undefined }));
assert.equal(result.warmupPassed,8,'A cold-start warmup call exceeded 500 ms');
assert.equal(result.allPassed,cases+8,'A measured call exceeded 500 ms');
assert.ok(result.p99Ms <= 500, `p99 ${result.p99Ms} exceeds 500 ms`);
assert.ok(result.maxMs <= 500, `maximum ${result.maxMs} exceeds 500 ms`);
