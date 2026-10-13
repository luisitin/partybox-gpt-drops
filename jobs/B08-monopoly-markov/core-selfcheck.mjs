import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { buildTransitions, stationary, monopolyOdds, freeState, jailState,
  decodeState, squareOfState, PROPERTIES, STATE_COUNT } from './build/monopolyOdds.js';
let checks = 0;
const check = (condition, label) => { checks++; assert.ok(condition, label); };
const close = (a, b, label) => check(Math.abs(a - b) < 1e-12, label);
for (let state = 0; state < STATE_COUNT; state++) {
  const decoded = decodeState(state);
  check((decoded.kind === 'jailed' ? jailState(decoded.failedAttempts)
    : freeState(decoded.position, decoded.doubles)) === state, 'State bijection');
  check(squareOfState(state) !== 30, 'No free GoToJail state');
}
const observations = [];
for (const strategy of ['leave ASAP', 'stay max']) {
  const model = buildTransitions(strategy);
  for (const row of model.counts) {
    check(row.length === 120, 'State row width');
    check(row.reduce((s, n) => s + n, 0) === 9216, 'Exact row total');
    for (const n of row) check(Number.isInteger(n) && n >= 0, 'Integer nonnegative transition');
  }
  const from = freeState(24);
  check(model.counts[from][freeState(0, 1)] === 17, 'Chance back-three CC nested GO');
  check(model.counts[from][freeState(33, 1)] === 14, 'Chance back-three CC stay');
  check(model.counts[from][freeState(36, 1)] === 96, 'Six stationary Chance cards');
  check(model.counts[from][117] === 1361, 'GoToJail plus CC and Chance jail mass');
  check(model.railroadBonusCounts[from][5] === 32, 'Two nearest-railroad cards');
  check(model.utilityChanceCounts[from][12] === 16, 'Nearest utility card');
  check(model.counts[freeState(19, 2)][117] === 2080, 'Third doubles before movement');
  const odds = stationary(model);
  close(odds.landing.reduce((s, p) => s + p, 0), 1, 'Landing normalization');
  close(odds.endTurnLanding.reduce((s, p) => s + p, 0), 1, 'Turn normalization');
  check(odds.residual < 1e-13, 'Stationary residual');
  check(odds.landing[30] === 0, 'GoToJail no final occupancy');
  for (const p of odds.stateProbabilities) check(Number.isFinite(p) && p >= 0, 'Stationary nonnegativity');
  const complete = monopolyOdds(strategy);
  check(complete.properties.length === 28, 'Every property');
  check(PROPERTIES.filter(p => p.kind === 'street').length === 22, '22 streets');
  const b = complete.properties.find(p => p.property.position === 39).levels;
  check(b.find(row => row.houseLevel === 5).investment === 1400, 'Hotel total investment');
  check(b.find(row => row.houseLevel === 5).ordinaryRent === 2000, 'Boardwalk hotel rent');
  const utility = complete.properties.find(p => p.property.position === 12);
  close(utility.levels[1].expectedRentPerRoll, utility.landingProbability * 70, 'Two utilities rent mean');
  for (const property of complete.properties) for (const row of property.levels) {
    check(row.expectedRentPerRoll > 0 && row.breakEvenRolls > 0, 'Positive rent returns');
    close(row.expectedRentPerRoll * row.breakEvenRolls, row.investment, 'Rent break-even algebra');
  }
  observations.push({ strategy, iterations: odds.iterations, residual: odds.residual,
    rollsPerTurn: odds.rollsPerTurn, landing: odds.landing });
}
const asap = buildTransitions('leave ASAP');
const max = buildTransitions('stay max');
check(asap.counts[117][freeState(12, 1)] === 256, 'Paid jail doubles grant extra roll');
check(asap.counts[117][118] === 0 && asap.counts[117][119] === 0, 'No delayed ASAP attempts');
check(max.counts[117][118] === 7680, 'Thirty failed first jail outcomes');
check(max.counts[118][119] === 7680, 'Thirty failed second jail outcomes');
check(max.counts[119][freeState(12)] === 256, 'Third attempt advances');
check(max.counts[119][freeState(12, 1)] === 0, 'Jail release grants no extra roll');
const report = { passed: true, checks, provenance: 'Production self-check before independent source access', observations };
writeFileSync('CORE-SELFCHECK.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, checks, observations: observations.map(({ landing, ...row }) => row) }));
