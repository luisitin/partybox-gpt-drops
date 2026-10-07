import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { solveClue } from './dist/clueSolver.js';
import { rng, randomReduced, deal, suggest, classic } from './fixtures.mjs';
const random = rng(Number(process.env.B09_SEED ?? 1));
for (let i = 0; i < 20_000; i++) randomReduced(random);
let worst = 0, worstCase, calls = 0;
function measure(game, label) {
  const start = performance.now(), result = solveClue(game.log), milliseconds = performance.now() - start;
  if (!result.ok) throw Error('truth lost');
  calls++;
  if (milliseconds > worst) { worst = milliseconds; worstCase = { label, milliseconds, log: structuredClone(game.log) }; }
  if (milliseconds > 100) console.log(label, milliseconds);
}
for (let i = 0; i < 5_000; i++) {
  const players = 3 + i % 4, game = deal(classic, players, random), turns = 4 + Math.floor(random() * 9);
  for (let turn = 0; turn <= turns; turn++) {
    if (players === 6) measure(game, `game${i}/turn${turn}`);
    if (turn < turns) suggest(game, random, random() < .75 ? game.log.me : Math.floor(random() * players));
  }
}
for (let i = 0; i < 60; i++) {
  const game = deal(classic, 6, random);
  for (let turn = 0; turn < 20; turn++) {
    const observation = suggest(game, random); delete observation.shownCard;
    if (turn % 3 === 0) measure(game, `stress${i}/turn${turn}`);
  }
}
writeFileSync('benchmark-worst.json', JSON.stringify({ calls, ...worstCase }, null, 2) + '\n');
console.log('worst', worst, 'calls', calls, worstCase.label);
