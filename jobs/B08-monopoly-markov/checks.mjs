import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { referenceStationary } from './build/reference.js';
import { referenceROI, referenceSpecialArrivalMass } from './build/roi-reference.js';

export const strategies = ['leave ASAP', 'stay max'];
export const references = new Map(strategies.map(strategy => [strategy, referenceStationary(strategy)]));
const tables = JSON.parse(readFileSync(new URL('./data/published-tables.json', import.meta.url)));
const propertyData = JSON.parse(readFileSync(new URL('./data/us-properties.json', import.meta.url)));
const collins = JSON.parse(readFileSync(new URL('./data/collins-table.json', import.meta.url)));
export function verify(engine, {published = true} = {}) {
  let assertions = 0;
  const check = (condition, message) => { assertions++; assert.ok(condition, message); };
  const equal = (actual, expected, message) => { assertions++; assert.deepEqual(actual, expected, message); };
  const close = (actual, expected, tolerance, message) => check(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance, `${message}: ${actual} != ${expected}`);
  equal(engine.STATE_COUNT, 120, 'State count');
  equal(engine.TRANSITION_DENOMINATOR, 9216, 'Exact common denominator');
  equal(engine.FIRST_JAIL_STATE, 117, 'First jail index');
  for (let state = 0; state < 120; state++) {
    const decoded = engine.decodeState(state);
    equal(decoded.kind === 'jailed' ? engine.jailState(decoded.failedAttempts) : engine.freeState(decoded.position, decoded.doubles), state, 'State bijection');
    equal(engine.squareOfState(state), state >= 117 ? 10 : Math.floor(state / 3) + (state >= 90 ? 1 : 0), 'State square projection');
  }
  equal(engine.PROPERTIES.length, 28, 'All properties');
  for (const expected of propertyData.streets) {
    const property = engine.PROPERTIES.find(p => p.position === expected.position);
    check(property, `Street ${expected.position}`);
    for (const key of ['name', 'purchasePrice', 'houseCost', 'rents']) equal(property[key], expected[key], `Official street ${key}`);
  }
  const groups = [[1,3],[6,8,9],[11,13,14],[16,18,19],[21,23,24],[26,27,29],[31,32,34],[37,39]];
  const colors = ['brown','light blue','pink','orange','red','yellow','green','dark blue'];
  for (let group=0;group<groups.length;group++) for(const position of groups[group])
    equal(engine.PROPERTIES.find(p=>p.position===position).color,colors[group],'Official color set');
  for (const kind of ['railroad', 'utility']) {
    const fixture = propertyData[kind === 'railroad' ? 'railroads' : 'utilities'];
    for (const position of fixture.positions) {
      const property = engine.PROPERTIES.find(p => p.position === position);
      equal(property.kind, kind, 'Property kind');
      equal(property.purchasePrice, fixture.purchasePrice, 'Official property price');
      equal(property.rents, fixture.rents ?? fixture.multipliers, 'Official property rents');
    }
  }
  const observations = [];
  for (const strategy of strategies) {
    const reference = references.get(strategy);
    const model = engine.buildTransitions(strategy);
    equal(model.denominator, 9216, 'Model denominator');
    for (let from = 0; from < 120; from++) {
      equal(model.counts[from].length, 120, 'Transition row width');
      equal(model.counts[from].reduce((a,b) => a+b,0), 9216, 'Exact transition row mass');
      for (let to = 0; to < 120; to++) equal(model.counts[from][to], reference.transitionCounts[from][to], `Blind transition ${strategy}/${from}/${to}`);
    }
    const result = engine.stationary(model);
    const complete = engine.monopolyOdds(strategy);
    let maxStateDifference = 0;
    for (let state = 0; state < 120; state++) {
      check(result.stateProbabilities[state] >= 0, 'Nonnegative stationary state');
      close(result.stateProbabilities[state], reference.stateProbabilities[state], 1e-12, 'Blind stationary state');
      close(complete.stateProbabilities[state], result.stateProbabilities[state], 1e-15, 'Public API state');
      maxStateDifference = Math.max(maxStateDifference, Math.abs(result.stateProbabilities[state] - reference.stateProbabilities[state]));
    }
    for (let square = 0; square < 40; square++) {
      close(result.landing[square], reference.landing[square], 1e-12, 'Blind roll landing');
      close(result.endTurnLanding[square], reference.endTurnLanding[square], 1e-12, 'Blind turn landing');
    }
    close(result.turnStartMass, reference.turnStartMass, 1e-12, 'Blind turn-start mass');
    close(result.rollsPerTurn, 1 / reference.turnStartMass, 1e-12, 'Rolls per turn');
    close(result.landing.reduce((a,b) => a+b,0), 1, 1e-12, 'Roll normalization');
    close(result.endTurnLanding.reduce((a,b) => a+b,0), 1, 1e-12, 'Turn normalization');
    check(result.residual < 1e-13, 'Stationary residual');
    equal(result.landing[30], 0, 'Immediate GoToJail');
    const publicProperties = engine.rentReturns(model, result);
    const roiOracle = referenceROI(strategy, engine.PROPERTIES);
    const specialOracle = referenceSpecialArrivalMass(strategy);
    for(let position=0;position<40;position++) for(const [field, expected] of [['railroadBonusCounts',specialOracle.railroad[position]],['utilityChanceCounts',specialOracle.utility[position]]]) {
      const actual=result.stateProbabilities.reduce((sum,mass,state)=>sum+mass*model[field][state][position]/9216,0);
      close(actual,expected,1e-12,'Blind special card arrival mass');
    }
    equal(complete.properties, publicProperties, 'Public ROI API');
    let roiIndex=0;
    for (const {property, landingProbability, levels} of publicProperties) {
      close(landingProbability, reference.landing[property.position], 1e-12, 'Property landing');
      equal(levels.length, property.kind === 'street' ? 7 : property.kind === 'railroad' ? 4 : 2, 'All ownership/building levels');
      for (const level of levels) {
        const oracle=roiOracle[roiIndex++];
        equal(property.position,oracle.position,'Blind ROI position order');
        for(const field of ['houseLevel','ownedInSet','investment','ordinaryRent']) equal(level[field],oracle[field],`Blind ROI ${field}`);
        for(const field of ['expectedRentPerRoll','expectedRentPerOpponentTurn','rentROIPerRoll','rentROIPerOpponentTurn','breakEvenRolls','breakEvenOpponentTurns'])
          close(level[field],oracle[field],1e-12*Math.max(1,Math.abs(oracle[field])),`Blind ROI ${field}`);
        const houses = level.houseLevel ?? 0;
        equal(level.investment, property.purchasePrice + houses * property.houseCost, 'Investment includes hotel fifth payment');
        let ordinaryRent;
        if (property.kind === 'street') ordinaryRent = houses === 0 ? property.rents[0] * (level.ownedInSet > 1 ? 2 : 1) : property.rents[houses];
        else if (property.kind === 'railroad') ordinaryRent = property.rents[level.ownedInSet - 1];
        else ordinaryRent = 7 * property.rents[level.ownedInSet - 1];
        equal(level.ordinaryRent, ordinaryRent, 'Rent at ownership level');
        check(level.expectedRentPerRoll > 0, 'Positive expected rent');
        if (property.kind === 'street') close(level.expectedRentPerRoll, ordinaryRent * reference.landing[property.position], 1e-12, 'Blind street rent');
        close(level.expectedRentPerOpponentTurn, level.expectedRentPerRoll / reference.turnStartMass, 1e-12, 'Opponent turn income');
        close(level.rentROIPerRoll, level.expectedRentPerRoll / level.investment, 1e-12, 'Roll ROI');
        close(level.rentROIPerOpponentTurn, level.expectedRentPerOpponentTurn / level.investment, 1e-12, 'Turn ROI');
        close(level.breakEvenRolls * level.expectedRentPerRoll, level.investment, 1e-10, 'Roll break-even algebra');
        close(level.breakEvenOpponentTurns * level.expectedRentPerOpponentTurn, level.investment, 1e-10, 'Turn break-even algebra');
      }
    }
    // Labelled path fixtures exercise card rent premiums independently of projection.
    const row = engine.freeState(24);
    equal(model.railroadBonusCounts[row][5], 32, 'Two nearest-railroad cards');
    equal(model.utilityChanceCounts[row][12], 16, 'One nearest-utility card');
    const tableComparisons = [];
    if (published) for (const table of tables.tables) {
      const actual = table.id === 'butler-per-roll' ? result.landing : result.endTurnLanding;
      let maxDifference = 0;
      for (let square = 0; square < 40; square++) {
        const expected = table.strategies[strategy][square];
        close(actual[square], expected, 1e-4, `Published ${table.id}/${strategy}/${square}`);
        maxDifference = Math.max(maxDifference, Math.abs(actual[square] - expected));
      }
      tableComparisons.push({id:table.id,squares:40,maxDifference,tolerance:1e-4});
    }
    if(published) {
      const differences=result.landing.map((probability,position)=>({position,difference:probability-collins.strategies[strategy][position]}));
      const gaps=differences.filter(row=>Math.abs(row.difference)>1e-4);
      if(strategy==='leave ASAP') for(const row of differences) close(result.landing[row.position],collins.strategies[strategy][row.position],1e-4,'Independent published Collins ASAP table');
      else equal(gaps.map(row=>row.position),[10],'Documented Collins maximum-stay rule gap remains confined to aggregate Jail');
      tableComparisons.push({id:collins.id,squares:40,maxDifference:Math.max(...differences.map(row=>Math.abs(row.difference))),
        tolerance:1e-4,matchedSquares:40-gaps.length,documentedGaps:gaps,conflictRecord:gaps.length?'CONFLICTS.md':null});
    }
    equal(roiIndex,174,'All independently computed ROI scenarios');
    observations.push({strategy, maxStateDifference, iterations:result.iterations, residual:result.residual,
      turnStartMass:result.turnStartMass, rollsPerTurn:result.rollsPerTurn, tableComparisons});
  }
  for (const invalid of [-1,30,40,0.5,NaN]) assert.throws(() => engine.freeState(invalid));
  for (const invalid of [-1,3,0.5,NaN]) assert.throws(() => engine.jailState(invalid));
  assert.throws(() => engine.buildTransitions('unknown'));
  assert.throws(() => engine.stationary(engine.buildTransitions('leave ASAP'),0));
  assert.throws(() => engine.stationary(engine.buildTransitions('leave ASAP'),1e-15,1));
  assertions += 12;
  return {passed:true, assertions, exactTransitionCells:28800, stationaryStates:240,
    publishedSquares:published ? 240 : 0, matchedPublishedSquares:published?239:0,
    documentedPublishedGaps:published?1:0,properties:56, ownershipScenarios:348, observations};
}
