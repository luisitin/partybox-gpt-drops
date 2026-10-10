import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import * as engine from './build/monopolyOdds.js';
import { verify } from './checks.mjs';
import { references,strategies } from './checks.mjs';
import { samplingVariance } from './sampling-variance.mjs';
const seed=Number(process.argv[2]);
assert.ok([1,2,3].includes(seed));
const report={suite:'exact-and-published',seed,...verify(engine),samplingVariance:strategies.map(strategy=>({strategy,...samplingVariance(references.get(strategy))}))};
writeFileSync(`.verification/exact-seed-${seed}.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({suite:report.suite,seed,passed:report.passed,assertions:report.assertions,
  exactTransitionCells:report.exactTransitionCells,stationaryStates:report.stationaryStates,publishedSquares:report.publishedSquares,
  ownershipScenarios:report.ownershipScenarios,observations:report.observations}));
