import assert from 'node:assert/strict';
import { findBestPlay, validatePosition, validateTable, validatePlay } from '../dist/rummikub.js';
import { referenceBestPlay, referenceValidateTable, referenceValidatePlay } from '../dist/reference.js';
import { rng, smallPosition, freeze, receipt, seedArg, hash } from './helpers.mjs';
import { performance } from 'node:perf_hooks';
const seed = seedArg(), random = rng(seed), cases = 50000;
let passed = 0, plays = 0, openings = 0, changedOldMelds = 0, corpus = '';
const tileCounts = Array(15).fill(0), jokers = [0, 0, 0];
const start = performance.now();
for (let i = 0; i < cases; i++) {
  const p = freeze(smallPosition(random, i)), input = JSON.stringify(p);
  const size = p.table.flatMap(m => m.tiles).length + p.hand.length;
  assert.ok(size <= 14);
  tileCounts[size]++;
  jokers[[...p.hand, ...p.table.flatMap(m => m.tiles)].filter(t => t.kind === 'joker').length]++;
  if (!p.initialMeldDone) openings++;
  assert.ok(validatePosition(p).ok, `generator seed=${seed} case=${i}`);
  const a = findBestPlay(p), b = referenceBestPlay(p);
  const context = `seed=${seed} case=${i} input=${input}`;
  assert.ok(a.ok, `${context}\nprimary=${JSON.stringify(a)}`);
  assert.ok(b.ok, `${context}\nreference=${JSON.stringify(b)}`);
  assert.equal(a.value, b.value, context);
  assert.equal(a.played.length, b.playedCount, context);
  assert.ok(a.optimal, context);
  for (const table of [a.table, b.table]) {
    assert.ok(validateTable(table).ok, context);
    assert.ok(referenceValidateTable(table), context);
    if (a.played.length) {
      assert.ok(validatePlay(p, table).ok, context);
      assert.ok(referenceValidatePlay(p, table), context);
    } else assert.deepEqual(table, p.table, context);
  }
  assert.equal(JSON.stringify(p), input, context);
  if (a.action === 'play') {
    plays++;
    if (p.table.some(m => !a.table.some(n => JSON.stringify(m) === JSON.stringify(n)))) changedOldMelds++;
  }
  corpus += hash(input) + `:${a.value}:${a.played.length}\n`;
  passed++;
  if ((i + 1) % 5000 === 0) console.log(`small seed=${seed} ${i + 1}/${cases}`);
}
const result = { suite: 'physical-subset-brute-force', seed, cases, passed,
  command: `SEED=${seed} node test/small.mjs`, maxTiles: 14, tileCounts, jokerHistogram: jokers,
  openings, plays, changedOldMelds, semanticDiffSha256: hash(corpus), elapsedMs: performance.now() - start };
receipt(`small-seed-${seed}`, result);
console.log(JSON.stringify(result));
