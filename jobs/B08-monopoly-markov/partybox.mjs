// Seeded suite for the PartyBox-facing boardOdds.ts (node partybox.mjs <1|2|3>), run by npm test.
// 1. The generated blocks still match the sealed solver; the port file passes PartyBox's purity bans.
// 2. verifyBoardOdds(): exact checks against the sealed solver, roi.csv and the definitions, plus a fuzz.
// 3. A seeded simulation of what simulate.mjs never measured: turn ends (per-turn odds, rolls per
//    turn), "nearest railroad" and "nearest utility" card arrivals and the movement dice at utilities.
// 4. Planted mutants of boardOdds.ts, each strictly compiled and each killed by verifyBoardOdds().
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { expectedFiles, plans } from './partybox-export.mjs';
import { verifyBoardOdds, verifyPurity } from './partybox-checks.mjs';
import * as boardOdds from './build/boardOdds.js';

const seed = Number(process.argv[2]);
assert.ok([1, 2, 3].includes(seed), 'Fixed required seed');
const source = readFileSync('boardOdds.ts', 'utf8');
const digest = createHash('sha256').update(source).digest('hex');

for (const [file, actual, expected] of expectedFiles()) assert.equal(actual, expected, `Generated block of ${file}`);
const purityRules = verifyPurity(source);
const exact = verifyBoardOdds(boardOdds, { fuzzSeed: seed });
console.log(JSON.stringify({ suite: 'partybox-exact', seed, passed: true, assertions: exact.assertions, fuzzCases: exact.fuzzCases }));

// Simulation. Same movement and card rules as simulate.mjs, different stream constants. Predeclared:
// 200 batch means per statistic, |z| <= 4.5 (288 statistics over three seeds, so a family-wise
// false-alarm rate near 0.4% for a t distribution with 199 degrees of freedom); exact zeros must be zero.
const ROLLS = 20_000_000, BATCHES = 200, BATCH = ROLLS / BATCHES, BURN_IN = 10_000, LIMIT = 4.5;
function simulate(plan) {
  let stream = (Math.imul(seed, 0x85ebca6b) ^ (plan === 'leave ASAP' ? 0xc2b2ae35 : 0x27d4eb2f)) >>> 0;
  const word = () => {
    stream = (stream + 0x6d2b79f5) >>> 0;
    let t = stream;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
  // Statistic layout: 0 turn ends, 1..40 turn ends on square, 41..43 railroad card at 5/15/25,
  // 44..45 utility card at 12/28, 46..47 movement dice summed over ordinary arrivals at 12/28.
  const STATS = 48, totals = new Float64Array(STATS), batch = new Float64Array(STATS);
  const sums = new Float64Array(STATS), squares = new Float64Array(STATS);
  const railroadIndex = { 5: 41, 15: 42, 25: 43 }, utilityIndex = { 12: 0, 28: 1 };
  let position = 0, streak = 0, jailed = -1;
  for (let roll = -BURN_IN; roll < ROLLS; roll++) {
    let draw = word();
    while (draw >= 4294967292) draw = word();
    const joint = draw % 36, first = (joint % 6) + 1, second = Math.floor(joint / 6) + 1, total = first + second;
    const double = first === second;
    let move = true, railroadCard = -1, utilityCard = -1, utilityDirect = -1;
    if (jailed >= 0 && plan === 'stay max') {
      if (!double && jailed < 2) { jailed++; move = false; }
      else { jailed = -1; streak = 0; position = 10; }
    } else {
      if (jailed >= 0) { jailed = -1; position = 10; streak = 0; }
      if (double && streak === 2) { jailed = 0; position = 10; streak = 0; move = false; }
      else streak = double ? streak + 1 : 0;
    }
    if (move) {
      position = (position + total) % 40;
      if (position === 30) { position = 10; jailed = 0; streak = 0; }
      else {
        if (position === 12 || position === 28) utilityDirect = position;
        if (position === 7 || position === 22 || position === 36) {
          switch (word() & 15) {
            case 0: position = 0; break;
            case 1: position = 10; jailed = 0; streak = 0; break;
            case 2: position = 11; break;
            case 3: position = 24; break;
            case 4: position = 5; break;
            case 5: position = 39; break;
            case 6: case 7: position = position === 7 ? 15 : position === 22 ? 25 : 5; railroadCard = position; break;
            case 8: position = position === 22 ? 28 : 12; utilityCard = position; break;
            case 9: position -= 3; break;
          }
        }
        if (position === 2 || position === 17 || position === 33) {
          const card = word() & 15;
          if (card === 0) position = 0;
          else if (card === 1) { position = 10; jailed = 0; streak = 0; }
        }
      }
    }
    if (roll < 0) continue;
    if (jailed >= 0 || streak === 0) { batch[0]++; batch[1 + position]++; }
    if (railroadCard >= 0) batch[railroadIndex[railroadCard]]++;
    if (utilityCard >= 0) batch[44 + utilityIndex[utilityCard]]++;
    if (utilityDirect >= 0) batch[46 + utilityIndex[utilityDirect]] += total;
    if ((roll + 1) % BATCH === 0) {
      for (let k = 0; k < STATS; k++) {
        const mean = batch[k] / BATCH;
        totals[k] += batch[k]; sums[k] += mean; squares[k] += mean * mean; batch[k] = 0;
      }
    }
  }
  const odds = boardOdds.BOARD_ODDS[plan];
  const expected = [1 / odds.rollsPerTurn, ...odds.perTurn.map(p => p / odds.rollsPerTurn),
    ...[5, 15, 25].map(s => odds.railroadCard[s]), ...[12, 28].map(s => odds.utilityCard[s]),
    ...[12, 28].map(s => odds.utilityDice[s])];
  const names = ['turn ends', ...Array.from({ length: 40 }, (_, s) => `turn ends on ${s}`), 'railroad card 5',
    'railroad card 15', 'railroad card 25', 'utility card 12', 'utility card 28', 'dice at 12', 'dice at 28'];
  let maxZ = 0;
  const statistics = expected.map((value, k) => {
    const mean = sums[k] / BATCHES, variance = (squares[k] - BATCHES * mean * mean) / (BATCHES - 1);
    const error = Math.sqrt(Math.max(variance, 0) / BATCHES), difference = mean - value;
    const z = value === 0 ? (totals[k] === 0 ? 0 : Infinity) : error === 0 ? Infinity : Math.abs(difference) / error;
    maxZ = Math.max(maxZ, z);
    return { statistic: names[k], expected: value, simulated: mean, standardError: error, z };
  });
  const passed = maxZ <= LIMIT;
  const simulatedRollsPerTurn = ROLLS / totals[0];
  return { plan, rolls: ROLLS, batches: BATCHES, burnIn: BURN_IN, limit: LIMIT, passed, maxZ,
    rollsPerTurn: { exact: odds.rollsPerTurn, simulated: simulatedRollsPerTurn }, statistics };
}
const simulation = [];
for (const plan of plans) {
  const result = simulate(plan);
  simulation.push(result);
  assert.ok(result.passed, `${plan}/seed ${seed}: z ${result.maxZ} exceeds the predeclared ${LIMIT}`);
  console.log(JSON.stringify({ suite: 'partybox-simulation', plan, seed, rolls: ROLLS, statistics: result.statistics.length,
    passed: true, maxZ: result.maxZ, rollsPerTurn: result.rollsPerTurn }));
}

// Planted mutants: each must compile under the strict tsconfig and each must fail verifyBoardOdds().
const mutations = [
  ['P01 per-turn conversion dropped', '* odds.rollsPerTurn : 0;', '* 1 : 0;'],
  ['P02 railroad card premium dropped', '(at(odds.perRoll, position) + at(odds.railroadCard, position))', '(at(odds.perRoll, position))'],
  ['P03 full-group doubling dropped', 'base * rules.monopolyRentMultiplier', 'base + 0 * rules.monopolyRentMultiplier'],
  ['P04 houses without the group earn', '  if (level > 0 && !holding.fullGroup) return 0;\n', ''],
  ['P05 card pays the owned multiplier', 'MEAN_DICE * at(rules.utilityMultipliers, 1) * card', 'MEAN_DICE * multiplier * card'],
  ['P06 fresh dice mean 6', 'const MEAN_DICE = 7;', 'const MEAN_DICE = 6;'],
  ['P07 card rent dropped on movement dice', 'multiplier * at(odds.utilityDice, position) + cardRent', 'multiplier * at(odds.utilityDice, position)'],
  ['P08 railroad rent off by one', 'at(rules.railroadRents, owned - 1)', 'at(rules.railroadRents, owned)'],
  ['P09 hotel invested as four houses', 'Math.min(level, 5) * deed.buildingCost', 'Math.min(level, 4) * deed.buildingCost'],
  ['P10 coldest first', 'b.chance - a.chance || a.square - b.square', 'a.chance - b.chance || a.square - b.square'],
  ['P11 hottest per roll and turn swapped', "per === 'turn' ? odds.perTurn : odds.perRoll", "per === 'roll' ? odds.perTurn : odds.perRoll", 0, 2],
  ['P12 share per roll and turn swapped', "per === 'turn' ? odds.perTurn : odds.perRoll", "per === 'roll' ? odds.perTurn : odds.perRoll", 1, 2],
  ['P13 share counts duplicates', 'for (let square = 0; square < SQUARES; square++)\n    if (squares.includes(square)) total += at(values, square);',
    'for (const square of squares) if (validSquare(square)) total += at(values, square);'],
  ['P14 multi-step build priced as one', '((target - level) * deed.buildingCost)', '(deed.buildingCost)'],
  ['P15 default plan differs per site', "planOdds(options.plan ?? 'leave ASAP')", "planOdds(options.plan ?? 'stay max')", 1, 2],
  ['P16 default utility dice fresh', "options.utilityDice === 'fresh'", "options.utilityDice !== 'movement'"],
  ['P17 one generated digit', '0.0318576628665498,', '0.0318576628665499,'],
  ['P18 negative rent allowed', 'return Number.isFinite(value) && value > 0 ? value : 0;', 'return Number.isFinite(value) ? value : 0;', 0, 2],
  ['P19 hottest count rounds up', 'Math.min(SQUARES, Math.floor(count))', 'Math.min(SQUARES, Math.ceil(count))'],
  ['P20 hottest default plan', "count: number,\n  plan: JailPlan = 'leave ASAP',", "count: number,\n  plan: JailPlan = 'stay max',"],
];
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
assert.equal(config.error, undefined);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
assert.equal(parsed.errors.length, 0);
const file = resolve('boardOdds.ts');
const mutants = [];
for (const [name, before, after, occurrence = 0, sites = 1] of mutations) {
  const offsets = [];
  for (let cursor = 0; ; ) {
    const index = source.indexOf(before, cursor);
    if (index < 0) break;
    offsets.push(index); cursor = index + before.length;
  }
  assert.equal(offsets.length, sites, `Mutation sites: ${name}`);
  const changed = source.slice(0, offsets[occurrence]) + after + source.slice(offsets[occurrence] + before.length);
  const options = { ...parsed.options, declaration: false, noEmit: false, outDir: undefined };
  const host = ts.createCompilerHost(options);
  const read = host.readFile.bind(host);
  host.readFile = path => (resolve(path) === file ? changed : read(path));
  let compiled;
  host.writeFile = (path, content) => { if (path.endsWith('boardOdds.js')) compiled = content; };
  const program = ts.createProgram([file], options, host);
  const diagnostics = [...ts.getPreEmitDiagnostics(program), ...program.emit().diagnostics];
  assert.equal(diagnostics.length, 0, `${name} must compile strictly: ${diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('; ')}`);
  assert.ok(compiled, `${name} emitted module`);
  const target = `.verification/partybox-mutant-${seed}-${name.slice(0, 3)}.mjs`;
  writeFileSync(target, compiled);
  let failure;
  try { verifyBoardOdds(await import(pathToFileURL(resolve(target)).href), { fuzzSeed: seed }); }
  catch (error) { failure = String(error.message).split('\n')[0]; }
  assert.ok(failure, `${name} survived verifyBoardOdds`);
  assert.equal(createHash('sha256').update(readFileSync('boardOdds.ts')).digest('hex'), digest, 'boardOdds.ts unchanged');
  mutants.push({ name, strictCompilation: true, runtimeKilled: true, failure });
  console.log(JSON.stringify({ suite: 'partybox-mutation', seed, ...mutants.at(-1) }));
}

const report = { passed: true, seed, boardOddsSHA256: digest, purityRules,
  exact: { assertions: exact.assertions, fuzzCases: exact.fuzzCases, roiRows: exact.roiRows, observations: exact.observations },
  simulation, mutants: { planted: mutations.length, strictCompiled: mutants.length, runtimeKilled: mutants.length, results: mutants } };
writeFileSync(`.verification/partybox-seed-${seed}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ suite: 'partybox', seed, passed: true, assertions: exact.assertions,
  simulatedRolls: ROLLS * plans.length, mutants: mutations.length, killed: mutants.length }));
