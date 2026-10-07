import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { solveClue } from './dist/clueSolver.js';
import { solveReference } from './dist/reference.js';
import { rng, randomReduced, deal, suggest, classic, reduced, adversarialCases, denseClassic } from './fixtures.mjs';

const fractionEqual = (a, b) => a.numerator * b.denominator === b.numerator * a.denominator;
function compare(log, production = solveClue) {
  const actual = production(log), reference = solveReference(log);
  assert.equal(actual.ok, reference.ok, 'independent status');
  if (!actual.ok) { assert.equal(actual.code, reference.code, 'independent error classification'); return actual; }
  assert.equal(actual.totalDeals, reference.totalDeals, 'independent exact deal count');
  for (const [name, probabilities] of Object.entries(reference.cards)) {
    assert.ok(fractionEqual(actual.cards[name].envelope, probabilities.envelope), `${name}: envelope`);
    probabilities.hands.forEach((value, player) => assert.ok(fractionEqual(actual.cards[name].hands[player], value), `${name}: hand ${player}`));
  }
  return actual;
}
const plus = (a, b) => ({ numerator: a.numerator * b.denominator + b.numerator * a.denominator, denominator: a.denominator * b.denominator });
function conservation(solution, log) {
  assert.ok(solution.ok);
  const one = { numerator: 1n, denominator: 1n };
  for (const probabilities of Object.values(solution.cards)) {
    assert.ok(fractionEqual(probabilities.hands.reduce(plus, probabilities.envelope), one), 'card ownership sums exactly to one');
    for (const f of [probabilities.envelope, ...probabilities.hands]) assert.ok(f.numerator >= 0n && f.numerator <= f.denominator && f.denominator > 0n);
  }
  for (let p = 0; p < log.handSizes.length; p++) assert.ok(fractionEqual(Object.values(solution.cards).reduce((sum, values) => plus(sum, values.hands[p]), { numerator: 0n, denominator: 1n }), { numerator: BigInt(log.handSizes[p]), denominator: 1n }));
  for (const group of [log.deck.suspects, log.deck.weapons, log.deck.rooms]) assert.ok(fractionEqual(group.reduce((sum, name) => plus(sum, solution.cards[name].envelope), { numerator: 0n, denominator: 1n }), one));
}
export function smoke(production = solveClue, seed = 1) {
  const { base, invalid, contradiction } = adversarialCases();
  for (const [name, log] of invalid) { const result = compare(log, production); assert.equal(result.ok, false, name); assert.equal(result.code, 'INVALID_INPUT', name); }
  for (const [name, log] of contradiction) { const result = compare(log, production); assert.equal(result.ok, false, name); assert.equal(result.code, 'CONTRADICTION', name); }
  let count = invalid.length + contradiction.length;
  const random = rng(918273 + seed);
  for (let i = 0; i < 120; i++) { const game = randomReduced(random); conservation(compare(game.log, production), game.log); count++; }
  for (let p = 3; p <= 6; p++) {
    const game = deal(classic, p, random);
    for (let turn = 0; turn < 7; turn++) { conservation(compare(game.log, production), game.log); count++; suggest(game, random, game.log.me); }
  }
  const empty = compare(base, production); conservation(empty, base); count++;
  const fixed = { ...base, shown: [{ player: 1, card: 's1' }, { player: 1, card: 'w1' }, { player: 2, card: 'r1' }, { player: 2, card: 'r2' }] };
  conservation(compare(fixed, production), fixed); count++;
  // Player 2 responds to player 1 before player 0: wraparound evidence must not deny player 0.
  const wrapped = { ...base, suggestions: [{ player: 1, cards: ['s0','w1','r1'], refutedBy: 2 }] };
  conservation(compare(wrapped, production), wrapped); count++;
  const emptyHand = { deck: reduced, handSizes: [0,3,4], me: 0, ownHand: [], suggestions: [] };
  conservation(compare(emptyHand, production), emptyHand); count++;
  const prototypeDeck = { suspects: ['__proto__','s1','s2'], weapons: ['constructor','w1','w2'], rooms: [...reduced.rooms] };
  const namespaced = { ...base, deck: prototypeDeck, ownHand: ['__proto__','constructor','r0'] };
  conservation(compare(namespaced, production), namespaced); count++;
  const analytic = compare({ handSizes: [3,3,3,3,3,3], me: 0, ownHand: ['Green','Candlestick','Ballroom'], suggestions: [] }, production);
  assert.equal(analytic.ok, true); assert.equal(analytic.totalDeals, 33_633_600_000n); count++;
  const untouched = structuredClone(wrapped), snapshot = JSON.stringify(untouched);
  const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } };
  freeze(untouched);
  const first = compare(untouched, production), second = compare(untouched, production);
  assert.equal(JSON.stringify(untouched), snapshot, 'solver does not mutate a deeply frozen log');
  assert.deepEqual(first, second, 'identical inputs give identical exact outputs'); count += 2;
  const dense = denseClassic(), denseSolution = compare(dense.log, production);
  conservation(denseSolution, dense.log); assert.equal(denseSolution.totalDeals, 1n); count++;
  return count;
}

if (!process.env.B09_IMPORT_ONLY) {
  const selected = process.env.B09_SEED ? [Number(process.env.B09_SEED)] : [1,2,3];
  const reports = [];
  for (const seed of selected) {
    const random = rng(seed), fixedCases = smoke(solveClue, seed);
    let reducedCases = 0, reducedSuggestions = 0;
    for (let i = 0; i < 20_000; i++) {
      const game = randomReduced(random), solution = compare(game.log);
      conservation(solution, game.log);
      for (const card of game.envelope) assert.ok(solution.cards[card].envelope.numerator > 0n, 'true reduced envelope remains possible');
      reducedCases++; reducedSuggestions += game.log.suggestions.length;
    }
    console.log(`seed ${seed}: 20,000 reduced random logs agree exactly`);
    const timings = [], updates = [], stressTimings = [], playerCounts = [0,0,0,0,0,0,0];
    let fullSuggestions = 0;
    for (let i = 0; i < 5_000; i++) {
      const players = 3 + i % 4, game = deal(classic, players, random);
      const turns = 4 + Math.floor(random() * 9);
      playerCounts[players]++;
      for (let turn = 0; turn <= turns; turn++) {
        const start = performance.now(), solution = solveClue(game.log), elapsed = performance.now() - start;
        const reference = solveReference(game.log);
        assert.ok(solution.ok && reference.ok);
        assert.equal(solution.totalDeals, reference.totalDeals);
        for (const [card, expected] of Object.entries(reference.cards)) {
          assert.ok(fractionEqual(solution.cards[card].envelope, expected.envelope));
          expected.hands.forEach((f, p) => assert.ok(fractionEqual(solution.cards[card].hands[p], f)));
        }
        conservation(solution, game.log);
        for (const card of game.envelope) assert.ok(solution.cards[card].envelope.numerator > 0n, 'true full envelope remains possible at every update');
        if (players === 6) timings.push(elapsed);
        updates.push(elapsed);
        if (turn < turns) { suggest(game, random, random() < .75 ? game.log.me : Math.floor(random() * players)); fullSuggestions++; }
      }
      if ((i + 1) % 1000 === 0) console.log(`seed ${seed}: ${i + 1}/5000 full games`);
    }
    // Deliberately retain unresolved existential refuter constraints in sparse logs.
    for (let i = 0; i < 60; i++) {
      const game = deal(classic, 6, random);
      for (let turn = 0; turn < 20; turn++) {
        const observation = suggest(game, random); delete observation.shownCard;
        if (turn % 3 !== 0) continue;
        const start = performance.now(), solution = solveClue(game.log), elapsed = performance.now() - start;
        timings.push(elapsed); stressTimings.push(elapsed);
        const reference = solveReference(game.log);
        assert.ok(solution.ok && reference.ok); assert.equal(solution.totalDeals, reference.totalDeals);
        for (const [card, expected] of Object.entries(reference.cards)) {
          assert.ok(fractionEqual(solution.cards[card].envelope, expected.envelope));
          expected.hands.forEach((f, p) => assert.ok(fractionEqual(solution.cards[card].hands[p], f)));
        }
        conservation(solution, game.log);
        for (const card of game.envelope) assert.ok(solution.cards[card].envelope.numerator > 0n);
      }
    }
    const dense = denseClassic(), denseStart = performance.now(), denseSolution = solveClue(dense.log), denseMilliseconds = performance.now() - denseStart;
    const denseReference = solveReference(dense.log);
    assert.deepEqual(denseSolution, denseReference); conservation(denseSolution, dense.log); assert.equal(denseSolution.totalDeals, 1n);
    timings.push(denseMilliseconds);
    timings.sort((a,b) => a-b);
    const p50 = timings[Math.floor((timings.length - 1) * .5)], p99 = timings[Math.floor((timings.length - 1) * .99)], maximum = timings.at(-1);
    assert.ok(maximum <= 200, `every observed six-player update <=200ms; max=${maximum}`);
    const report = { seed, fixedCases, reducedCases, reducedSuggestions, fullGames: 5000, playerCounts: playerCounts.slice(3), fullSuggestions, fullUpdates: updates.length, sparseSixPlayerStressUpdates: stressTimings.length, sparseSixPlayerStressMaximum: Math.max(...stressTimings), denseSixPlayerSuggestions: dense.log.suggestions.length, denseSixPlayerMilliseconds: denseMilliseconds, sixPlayerUpdates: timings.length, sixPlayerMilliseconds: { p50, p99, maximum } };
    reports.push(report); console.log(JSON.stringify(report));
  }
  writeFileSync(process.env.B09_REPORT ?? 'results.json', JSON.stringify(reports, null, 2) + '\n');
}
