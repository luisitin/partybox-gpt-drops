// Regression fingerprint, not a gate: regenerates the bench corpus for one seed and checks that the
// current solver reproduces every per-call search statistic recorded by the hosted CI bench receipt.
// Usage: SEED=1 node evidence/probe/corpus-fingerprint.mjs   (run after npm run build)
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { findBestPlay, validatePlay } from '../../dist/rummikub.js';
import { rng, largePosition, freeze } from '../../test/helpers.mjs';
const seed = Number(process.env.SEED ?? 1), n = Number(process.env.N ?? 200);
const receipt = JSON.parse(readFileSync(new URL(`../ci-37652457475/bench-seed-${seed}.json`, import.meta.url), 'utf8'));
const warm = rng(0xB1100000 + seed), random = rng(seed);
const sha = (x) => createHash('sha256').update(x).digest('hex');
const run = (p) => { const t = performance.now(); const r = findBestPlay(p); return { r, ms: performance.now() - t }; };
const rows = [], mismatches = [];
let corpus = '', warmCorpus = '';
const checkRow = (kind, i, p, expected) => {
  const { r, ms } = run(p);
  assert.ok(r.ok);
  const got = { value: r.value, played: r.played.length, states: r.stats.states, memoHits: r.stats.memoHits, boundPrunes: r.stats.boundPrunes, candidates: r.stats.candidates };
  const want = expected ? { value: expected.value, played: expected.played, states: expected.states, memoHits: expected.memoHits, boundPrunes: expected.boundPrunes, candidates: expected.candidates } : got;
  if (expected && JSON.stringify(got) !== JSON.stringify(want)) mismatches.push({ kind, i, got, want });
  rows.push({ kind, i, ms, ...got });
  if (r.action === 'play') assert.ok(validatePlay(p, r.table).ok);
};
for (let i = 0; i < 8; i++) { const p = freeze(largePosition(warm, i)); warmCorpus += JSON.stringify(p) + '\n'; checkRow('warm', i, p, undefined); } // CI kept no warmup receipt
for (let i = 0; i < n; i++) { const p = freeze(largePosition(random, i)); corpus += JSON.stringify(p) + '\n'; checkRow('main', i, p, receipt.samples[i]); }
const main = rows.filter(x => x.kind === 'main');
const pct = (arr, q) => { const v = [...arr].sort((a, b) => a - b); return v[Math.ceil(v.length * q) - 1]; };
const ms = main.map(x => x.ms), st = main.map(x => x.states);
const out = {
  seed, n, corpusSha256: sha(corpus), ciCorpusSha256: receipt.corpusSha256,
  warmCorpusSha256: sha(warmCorpus), ciWarmCorpusSha256: receipt.warmupCorpusSHA256,
  fingerprintMatchesCi: mismatches.length === 0 && main.length === receipt.samples.length && sha(corpus) === receipt.corpusSha256, mismatches: mismatches.slice(0, 5),
  mainMs: { p50: pct(ms, 0.5), p99: pct(ms, 0.99), max: Math.max(...ms) },
  mainStates: { p50: pct(st, 0.5), p99: pct(st, 0.99), max: Math.max(...st) },
  msPerKiloState: { p50: pct(main.map(x => x.ms / Math.max(1, x.states / 1000)), 0.5), max: Math.max(...main.map(x => x.ms / Math.max(1, x.states / 1000))) },
  host: { node: process.version, cpus: (await import('node:os')).cpus().length, loadavg: (await import('node:os')).loadavg()[0] },
};
writeFileSync(new URL(`./corpus-fingerprint-seed-${seed}.json`, import.meta.url), JSON.stringify({ ...out, rows }, null, 2) + '\n');
console.log(JSON.stringify(out));
assert.equal(out.fingerprintMatchesCi, true, 'search statistics diverge from the CI receipt');
