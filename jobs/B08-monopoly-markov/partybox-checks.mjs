// Exact checks for the PartyBox-facing boardOdds.ts. verifyBoardOdds() is shared by the seeded suite
// (partybox.mjs) and by every planted mutant, so a mutant must fail these checks to count as killed.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as solver from './build/monopolyOdds.js';
import { plans, utilityWeights } from './partybox-export.mjs';

const data = JSON.parse(readFileSync(new URL('./data/us-properties.json', import.meta.url)));
const csv = readFileSync(new URL('./roi.csv', import.meta.url), 'utf8').trim().split('\n')
  .map(line => [...line.matchAll(/"((?:[^"]|"")*)"/g)].map(match => match[1].replaceAll('""', '"')));
const header = csv[0];
export const roiRows = csv.slice(1).map(row => Object.fromEntries(header.map((key, i) => [key, row[i]])));

/** B08's own source fixture in PartyBox's edition shape (`spaces[i]`, `rules`). */
export const deeds = new Map([
  ...data.streets.map(s => [s.position, { kind: 'street', price: s.purchasePrice, buildingCost: s.houseCost, rents: s.rents }]),
  ...data.railroads.positions.map(p => [p, { kind: 'railroad', price: data.railroads.purchasePrice, buildingCost: 0, rents: [] }]),
  ...data.utilities.positions.map(p => [p, { kind: 'utility', price: data.utilities.purchasePrice, buildingCost: 0, rents: [] }]),
]);
export const rules = { railroadRents: data.railroads.rents, utilityMultipliers: data.utilities.multipliers, monopolyRentMultiplier: 2 };
const STREETS = data.streets.map(s => s.position);
const GROUPS = [[1, 3], [6, 8, 9], [11, 13, 14], [16, 18, 19], [21, 23, 24], [26, 27, 29], [31, 32, 34], [37, 39]];

/** Seeded Mulberry32 stream for the totality fuzz. */
export function stream(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function verifyBoardOdds(mod, { fuzzSeed = 1, fuzzCases = 20000 } = {}) {
  let assertions = 0;
  const check = (condition, message) => { assertions++; assert.ok(condition, message); };
  const same = (actual, expected, message) => { assertions++; assert.ok(Object.is(actual, expected), `${message}: ${actual} !== ${expected}`); };
  const close = (actual, expected, relative, message) => check(Number.isFinite(actual)
    && Math.abs(actual - expected) <= relative * Math.max(1, Math.abs(expected)), `${message}: ${actual} != ${expected}`);
  const observations = {};

  assertions++; assert.deepEqual([...mod.JAIL_PLANS], plans, 'Jail plans');
  for (const plan of plans) {
    const odds = mod.BOARD_ODDS[plan], result = solver.monopolyOdds(plan), model = solver.buildTransitions(plan);
    // 1. The tables are the sealed solver's numbers, bit for bit.
    same(odds.rollsPerTurn, result.rollsPerTurn, `${plan} rolls per turn`);
    for (const key of ['perRoll', 'perTurn', 'railroadCard', 'utilityCard', 'utilityDice', 'utilityCardDice'])
      check(Array.isArray(odds[key]) && odds[key].length === 40 && odds[key].every(v => Number.isFinite(v) && v >= 0), `${plan} ${key} shape`);
    for (let square = 0; square < 40; square++) {
      same(odds.perRoll[square], result.landing[square], `${plan} per-roll ${square}`);
      same(odds.perTurn[square], result.endTurnLanding[square], `${plan} per-turn ${square}`);
    }
    close(odds.perRoll.reduce((a, b) => a + b, 0), 1, 1e-12, `${plan} per-roll sum`);
    close(odds.perTurn.reduce((a, b) => a + b, 0), 1, 1e-12, `${plan} per-turn sum`);
    // 2. Card arrival masses, recomputed here from the sealed integer counts, live only where they should.
    for (let square = 0; square < 40; square++) {
      let railroad = 0, utility = 0;
      for (let state = 0; state < 120; state++) {
        railroad += result.stateProbabilities[state] * model.railroadBonusCounts[state][square];
        utility += result.stateProbabilities[state] * model.utilityChanceCounts[state][square];
      }
      close(odds.railroadCard[square], railroad / 9216, 1e-15, `${plan} railroad card ${square}`);
      close(odds.utilityCard[square], utility / 9216, 1e-15, `${plan} utility card ${square}`);
      check(([5, 15, 25].includes(square)) === (odds.railroadCard[square] > 0), `${plan} railroad card support ${square} (Chance 7, 22, 36 reach 15, 25, 5; never 35)`);
      check(([12, 28].includes(square)) === (odds.utilityCard[square] > 0), `${plan} utility card support ${square}`);
      check(([12, 28].includes(square)) === (odds.utilityDice[square] > 0), `${plan} utility dice support ${square}`);
      check(odds.railroadCard[square] <= odds.perRoll[square] && odds.utilityCard[square] <= odds.perRoll[square], `${plan} card share ${square}`);
    }
    // 3. Movement-dice weights: their per-state integer arrivals equal the sealed transition counts.
    const weights = utilityWeights(plan, result.stateProbabilities);
    for (let state = 0; state < 120; state++) for (const u of [12, 28]) {
      const sealedArrivals = [0, 1, 2].reduce((t, d) => t + model.counts[state][solver.freeState(u, d)], 0);
      assertions += 2;
      assert.equal(weights.cardCounts[state][u], model.utilityChanceCounts[state][u], `${plan} card arrivals ${state}/${u}`);
      assert.equal(weights.directCounts[state][u] + weights.cardCounts[state][u], sealedArrivals, `${plan} utility arrivals ${state}/${u}`);
    }
    const dice = {};
    for (const u of [12, 28]) {
      same(odds.utilityDice[u], weights.dice[u], `${plan} utility dice ${u}`);
      same(odds.utilityCardDice[u], weights.cardDice[u], `${plan} utility card dice ${u}`);
      const direct = odds.perRoll[u] - odds.utilityCard[u];
      check(odds.utilityDice[u] >= 2 * direct && odds.utilityDice[u] <= 12 * direct, `${plan} dice bounds ${u}`);
      check(odds.utilityCardDice[u] >= 2 * odds.utilityCard[u] && odds.utilityCardDice[u] <= 12 * odds.utilityCard[u], `${plan} card dice bounds ${u}`);
      dice[u] = { meanDirect: odds.utilityDice[u] / direct, meanCard: odds.utilityCardDice[u] / odds.utilityCard[u] };
    }
    // 4. Every one of B08's 174 ROI rows for this plan, through the PartyBox-shaped API (fresh utility dice).
    let rows = 0;
    for (const row of roiRows.filter(r => r.strategy === plan)) {
      const position = Number(row.position), deed = deeds.get(position);
      const holding = row.kind === 'street'
        ? { level: Number(row.houseLevel), fullGroup: row.scenario !== 'unimproved without color set', sameKind: 0 }
        : { level: 0, fullGroup: false, sameKind: Number(row.ownedInSet) };
      const options = { plan, utilityDice: 'fresh' };
      close(mod.rentPerOpponentTurn(position, deed, holding, rules, options), Number(row.expectedRentPerOpponentTurn), 1e-12, `${plan} ROI rent ${position}/${row.scenario}/${row.ownedInSet}`);
      close(mod.rentReturn(position, deed, holding, rules, options), Number(row.rentROIPerOpponentTurn), 1e-12, `${plan} ROI ${position}/${row.scenario}/${row.ownedInSet}`);
      same(mod.investmentOf(deed, holding), Number(row.investment), `${plan} investment ${position}/${row.scenario}`);
      rows++;
    }
    check(rows === 174, `${plan} all ROI rows`);
    // 5. Utility rent in PartyBox's movement-dice mode, from the definitions.
    for (const u of [12, 28]) for (const owned of [1, 2]) {
      const expected = (rules.utilityMultipliers[owned - 1] * odds.utilityDice[u] + rules.utilityMultipliers[1] * odds.utilityCardDice[u]) * odds.rollsPerTurn;
      close(mod.rentPerOpponentTurn(u, deeds.get(u), { level: 0, fullGroup: false, sameKind: owned }, rules, { plan }), expected, 1e-12, `${plan} movement utility ${u}/${owned}`);
    }
    // 6. Build gains: definition, refusals, and the classic-board fact the integration guide relies on.
    let thirdHouseBest = 0;
    for (const position of STREETS) {
      const deed = deeds.get(position);
      const rent = level => mod.rentPerOpponentTurn(position, deed, { level, fullGroup: true, sameKind: 0 }, rules, { plan });
      const steps = [];
      for (let level = 0; level < 5; level++) {
        const gain = mod.buildGain(position, deed, { level, fullGroup: true, sameKind: 0 }, rules, undefined, { plan });
        close(gain, (rent(level + 1) - rent(level)) / deed.buildingCost, 1e-12, `${plan} next build gain ${position}/${level}`);
        steps.push(gain);
        for (let target = level + 1; target <= 5; target++)
          close(mod.buildGain(position, deed, { level, fullGroup: true, sameKind: 0 }, rules, target, { plan }),
            (rent(target) - rent(level)) / ((target - level) * deed.buildingCost), 1e-12, `${plan} build gain ${position}/${level}->${target}`);
      }
      same(mod.buildGain(position, deed, { level: 5, fullGroup: true, sameKind: 0 }, rules, undefined, { plan }), 0, `${plan} no build past a hotel`);
      same(mod.buildGain(position, deed, { level: 1, fullGroup: false, sameKind: 0 }, rules, undefined, { plan }), 0, `${plan} no build without the group`);
      same(mod.buildGain(position, deed, { level: 2, fullGroup: true, sameKind: 0 }, rules, 2, { plan }), 0, `${plan} target not above level`);
      if (steps.indexOf(Math.max(...steps)) === 2) thirdHouseBest++;
      else check([1, 3].includes(position), `${plan} third house not best only on the browns (${position})`);
    }
    same(thirdHouseBest, 20, `${plan} third house is the best step on 20 of 22 streets`);
    for (const p of [5, 12]) same(mod.buildGain(p, deeds.get(p), { level: 0, fullGroup: true, sameKind: 1 }, rules, undefined, { plan }), 0, `${plan} no buildings on ${p}`);
    // 7. The TV moment: hottest squares and set shares.
    const hot = mod.hottestSquares(40, plan);
    check(hot.length === 40 && hot.every((h, i) => i === 0 || hot[i - 1].chance > h.chance
      || (hot[i - 1].chance === h.chance && hot[i - 1].square < h.square)), `${plan} hottest order`);
    assertions++; assert.deepEqual(hot.slice(0, 3).map(h => h.square), [10, 24, 0], `${plan} jail, Illinois-position 24, GO lead`);
    same(hot[39].square, 30, `${plan} Go To Jail coldest`);
    same(mod.hottestSquares(1, plan, 'turn')[0].square, 10, `${plan} turns end in jail most`);
    same(mod.hottestSquares(1, plan, 'turn')[0].chance, odds.perTurn[10], `${plan} per-turn chance`);
    for (const [count, length] of [[0, 0], [-3, 0], [NaN, 0], [Infinity, 0], [2.7, 2], [100, 40], [1, 1]])
      same(mod.hottestSquares(count, plan).length, length, `${plan} hottest count ${count}`);
    const shares = GROUPS.map(group => mod.shareOf(group, plan));
    same(shares.indexOf(Math.max(...shares)), 3, `${plan} orange is the hottest colour group`);
    close(mod.shareOf([16, 18, 19, 16, 19], plan), shares[3], 1e-15, `${plan} duplicates count once`);
    close(mod.shareOf(Array.from({ length: 40 }, (_, i) => i), plan, 'turn'), 1, 1e-12, `${plan} whole-board turn share`);
    same(mod.shareOf([-1, 40, 2.5], plan), 0, `${plan} off-board share`);
    for (let square = 0; square < 40; square++) {
      same(mod.shareOf([square], plan), odds.perRoll[square], `${plan} share per roll ${square}`);
      same(mod.shareOf([square], plan, 'turn'), odds.perTurn[square], `${plan} share per turn ${square}`);
    }
    // Buildings without the whole group cannot happen in play; such a holding earns nothing.
    for (const position of STREETS)
      same(mod.rentPerOpponentTurn(position, deeds.get(position), { level: 3, fullGroup: false, sameKind: 0 }, rules, { plan }), 0, `${plan} houses without the group ${position}`);
    observations[plan] = { rollsPerTurn: odds.rollsPerTurn, hottest: hot.slice(0, 5), orange: shares[3], red: shares[4], utilityDice: dice, thirdHouseBest };
  }
  // 8. The documented defaults: plan 'leave ASAP', utility dice 'movement', per roll, next building.
  for (const position of [...deeds.keys()]) {
    const deed = deeds.get(position);
    const holding = deed.kind === 'street' ? { level: 1, fullGroup: true, sameKind: 0 } : { level: 0, fullGroup: false, sameKind: 1 };
    const explicit = { plan: 'leave ASAP', utilityDice: 'movement' };
    same(mod.rentPerOpponentTurn(position, deed, holding, rules), mod.rentPerOpponentTurn(position, deed, holding, rules, explicit), `default options rent ${position}`);
    same(mod.rentReturn(position, deed, holding, rules), mod.rentReturn(position, deed, holding, rules, explicit), `default options return ${position}`);
    same(mod.buildGain(position, deed, holding, rules), mod.buildGain(position, deed, holding, rules, 2, explicit), `default build target ${position}`);
  }
  assertions++; assert.deepEqual(mod.hottestSquares(40), mod.hottestSquares(40, 'leave ASAP', 'roll'), 'default hottest plan and per');
  same(mod.shareOf([16, 18, 19]), mod.shareOf([16, 18, 19], 'leave ASAP', 'roll'), 'default share plan and per');
  // 9. Totality: garbage in never throws and never yields a negative or non-finite number.
  const random = stream(0x5eed0000 + fuzzSeed);
  const pick = list => list[Math.floor(random() * list.length)];
  const numbers = [NaN, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7, 39, 40, 1e9, -Infinity, Infinity];
  const plansIn = [...plans, undefined, 'stay', '', 'LEAVE ASAP', null];
  for (let i = 0; i < fuzzCases; i++) {
    const position = random() < 0.7 ? Math.floor(random() * 40) : pick(numbers);
    const deed = random() < 0.6 ? deeds.get(pick([...deeds.keys()])) : {
      kind: pick(['street', 'railroad', 'utility', 'tax', '', 'go']), price: pick(numbers), buildingCost: pick(numbers),
      rents: pick([[], [NaN], [-5, -10], [1, 2, 3, 4, 5, 6], [1e308, 1e308]]) };
    const holding = { level: pick(numbers), fullGroup: random() < 0.5, sameKind: pick(numbers) };
    const ruleSet = random() < 0.7 ? rules : { railroadRents: pick([[], [NaN], [-25]]), utilityMultipliers: pick([[], [4], [NaN, 10]]), monopolyRentMultiplier: pick(numbers) };
    const options = { plan: pick(plansIn), utilityDice: pick(['movement', 'fresh', undefined, 'other']) };
    let values;
    try {
      values = [mod.rentPerOpponentTurn(position, deed, holding, ruleSet, options), mod.rentReturn(position, deed, holding, ruleSet, options),
        mod.investmentOf(deed, holding), mod.buildGain(position, deed, holding, ruleSet, pick([undefined, ...numbers]), options),
        mod.shareOf([position, pick(numbers)], options.plan), ...mod.hottestSquares(pick(numbers), options.plan).map(h => h.chance)];
    } catch (error) { assert.fail(`Totality case ${i} threw: ${error.message}`); }
    assertions++;
    assert.ok(values.every(v => Number.isFinite(v) && v >= 0), `Totality case ${i}: ${JSON.stringify(values)}`);
  }
  return { passed: true, assertions, fuzzCases, roiRows: 348, observations };
}

/** Static purity of the port file: what PartyBox's eslint bans in games/<id>/server. */
export function verifyPurity(source) {
  const banned = [/^\s*import\b/m, /Math\.random/, /Date\.now/, /new Date\b/, /\bIntl\b/, /toLocale/, /localeCompare/,
    /export default/, /^(let|var)\s/m, /\bawait\b/, /\bprocess\b/, /setTimeout|setInterval/];
  for (const pattern of banned) assert.ok(!pattern.test(source), `boardOdds.ts must not contain ${pattern}`);
  return banned.length;
}
