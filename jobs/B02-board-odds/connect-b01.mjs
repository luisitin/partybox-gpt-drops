// Connection test: B01's exact dice tables must feed B02 unchanged, and B02 must reproduce them exactly.
// The oracle is B01's own movement fractions: fixtures/b01-odds.json is a byte-for-byte copy of
// jobs/B01-jamboree-dice/odds.json (job/B01-jamboree-dice), pinned by SHA-256 below.
// Line board: O0 -> P1 -> O1 -> P2 -> O2 ... -> PN -> ON, where O = ordinary space (one step), P = shop (zero steps).
// One roll of movement m lands on Om and enters shop Pk exactly when m >= k, so:
//   landing(Om) = P(movement = m)   and   expectedPasses(Pk) = P(movement >= k).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { q, zero, one, plus } from './support.mjs';

export const B01_ODDS = 'fixtures/b01-odds.json';
export const B01_ODDS_SHA256 = '3874aeeb2f069b0ebb6b50605f3fa801df8dc300c7f82d5863162b23c1680e32';
export const LINE_LENGTH = 35; // above the largest B01 outcome for these dice (triple: 30)
export const B01_DICE = ['normal', 'double', 'triple'];

export function parseFraction(text) {
  const match = /^(-?\d+)(?:\/(\d+))?$/.exec(text);
  assert.ok(match, `not an exact fraction: ${text}`);
  return q(BigInt(match[1]), BigInt(match[2] ?? '1'));
}

export function lineBoard(length = LINE_LENGTH) {
  const nodes = [{ id: 'O0', kind: 'space', next: ['P1'], passThrough: false }];
  for (let k = 1; k <= length; k++) {
    nodes.push({ id: `P${k}`, kind: 'shop', next: [`O${k}`], passThrough: true });
    nodes.push({ id: `O${k}`, kind: 'space', next: k < length ? [`P${k + 1}`] : [], passThrough: false });
  }
  return { nodes };
}

export function connectB01(engine) {
  const raw = readFileSync(B01_ODDS);
  const digest = createHash('sha256').update(raw).digest('hex');
  assert.equal(digest, B01_ODDS_SHA256, 'vendored B01 odds.json changed; re-copy it deliberately');
  const source = JSON.parse(raw.toString('utf8'));
  const board = lineBoard();
  const report = { source: 'jobs/B01-jamboree-dice/odds.json (vendored copy)', sourceSha256: digest, dice: [] };
  for (const id of B01_DICE) {
    const row = source.distributions.find(d => d.id === id);
    assert.ok(row, `B01 distribution missing: ${id}`);
    const pmf = new Map(Object.entries(row.movement).map(([m, p]) => [Number(m), parseFraction(p)]));
    const die = engine.dieFromFractions(row.movement);
    assert.equal(Object.keys(die).length, pmf.size, `${id}: every B01 outcome must survive the adapter`);
    assert.deepEqual(Object.values(die).reduce(plus, zero), one, `${id}: B01 weights must sum to exactly one`);
    const start = engine.boardOdds(board, die, 'uniform').get('O0');
    assert.deepEqual(start.nonTermination, zero, `${id}: a line board never fails to terminate`);
    let total = zero;
    for (const p of pmf.values()) total = plus(total, p);
    assert.deepEqual(total, one, `${id}: independent sum`);
    const tail = new Map();
    let running = zero;
    for (let m = LINE_LENGTH; m >= 1; m--) { running = plus(running, pmf.get(m) ?? zero); tail.set(m, running); }
    for (let m = 1; m <= LINE_LENGTH; m++)
      assert.deepEqual(start.landing.get(`O${m}`), pmf.get(m) ?? zero, `${id}: landing on O${m}`);
    assert.deepEqual(start.landing.get('O0'), zero, `${id}: no zero face in B01 movement`);
    for (let k = 1; k <= LINE_LENGTH; k++)
      assert.deepEqual(start.expectedPasses.get(`P${k}`), tail.get(k) ?? zero, `${id}: shop P${k} visits`);
    report.dice.push({ id, outcomes: pmf.size, minimum: Math.min(...pmf.keys()), maximum: Math.max(...pmf.keys()),
      landingChecks: LINE_LENGTH + 1, shopChecks: LINE_LENGTH });
  }
  return report;
}
