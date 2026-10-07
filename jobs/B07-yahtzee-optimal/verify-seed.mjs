import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as api from './build/yahtzeeOpt.js';
import {independentReference,boundaryChecks,completeTableComparison,scoringExhaustion,randomStateComparison} from './test.mjs';
const seed=Number(process.argv[2]);assert.ok([1,2,3].includes(seed));
const reference=independentReference();
const result={passed:true,seed,boundaries:boundaryChecks(api,reference),fullTables:completeTableComparison(api,reference),scoring:scoringExhaustion(api,reference,seed),random:randomStateComparison(api,reference,seed,50000)};
fs.writeFileSync(`reports/verification-seed-${seed}.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
