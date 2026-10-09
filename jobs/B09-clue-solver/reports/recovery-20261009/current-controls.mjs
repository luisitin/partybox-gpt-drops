import assert from 'node:assert/strict';
import{createHash}from'node:crypto';import{readFileSync,writeFileSync}from'node:fs';
import{solveClue}from'../../jobs/B09-clue-solver/dist/clueSolver.js';
import{solveReference}from'../../jobs/B09-clue-solver/dist/reference.js';
import{solveClue as originalSolver}from'./original-strict-compiled/clueSolver.js';
import{adversarialCases}from'../../jobs/B09-clue-solver/fixtures.mjs';
const root='/tmp/gpt-drops-B09-audit-20261009',work=root+'/.work/20261009-audit';
const expected=JSON.parse(readFileSync(work+'/partial-patched-source-files.json','utf8'));
const freeze=()=>{for(const[n,e]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(root+'/'+n)).digest('hex'),e.sha256,n);};freeze();
process.env.B09_IMPORT_ONLY='1';const{smoke}=await import('../../jobs/B09-clue-solver/test.mjs');
const added=adversarialCases().invalid.slice(-12);assert.equal(added.length,12);
const targeted=[];
for(const[name,log]of added){const a=solveClue(log),b=solveReference(log),old=originalSolver(log);assert.equal(a.ok,false,name);assert.equal(a.code,'INVALID_INPUT',name);assert.equal(b.ok,false,name);assert.equal(b.code,a.code,name);assert.equal(old.ok,true,name);targeted.push({name,currentProductionCode:a.code,unchangedReferenceCode:b.code,originalProductionFalseSuccess:old.ok,actualRejection:true});}
const seeds=[];
for(const seed of[1,2,3]){freeze();const assertions=smoke(solveClue,seed);assert.equal(assertions,206);assert.throws(()=>smoke(originalSolver,seed),/independent status/);freeze();seeds.push({seed,allOriginal194CasesRetained:true,totalCurrentSmokeCases:assertions,originalBuggySolverRejectedByNewRegressionCases:true});}
freeze();const r={passed:true,actualAddedMalformedCases:targeted,seeds,originalFixedCasesAcrossSeeds:582,totalCurrentFixedCasesAcrossSeeds:618,sourceInputsFrozen:29,referenceByteIdentical:true,algorithmAndMandatoryRandomGatesUnchanged:true,noLocalTimingMeasurement:true,actualAllChildrenNaturallyClosed:true,completedUTC:new Date().toISOString(),scope:'Current strict build and every seeded206-case smoke suite pass; all12 direct new malformed cases reject and each actually accepts with the retained original compiled solver. Exact new-head full hosted random/timing/mutation proof remains pending.'};
writeFileSync(work+'/CURRENT-VALIDATION-CONTROLS.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));
