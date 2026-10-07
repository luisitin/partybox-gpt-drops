import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {createPrimaryBridge} from './primary-bridge.mjs';
import {consumeObservations} from './independent/native-adapter/verify-stream.mjs';
import {componentProofs} from './component-proofs.mjs';

const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export async function simulateAndVerify(mode,seed,games=1000000) {
 assert.ok(['official','published'].includes(mode));assert.ok([1,2,3].includes(seed));assert.equal(games,1000000,'Full game count is mandatory');
 const bridge=await createPrimaryBridge();
 const proofs=componentProofs(mode);
 const reportPath=`reports/simulation-${mode}-seed-${seed}.json`,keysPath=`reports/visited-${mode}-seed-${seed}.bin`;
 const regenerated=`.verification/regenerated-${mode}-seed-${seed}.bin`,log=fs.createWriteStream(`.verification/simulation-${mode}-seed-${seed}.log`);
 const child=spawn('./.verification/paired-sim',[mode,String(seed),String(games),reportPath,keysPath,regenerated,'3'],{stdio:['ignore','pipe','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:process.env.OMP_NUM_THREADS??'2'}});
 child.stdout.pipe(log);child.stderr.pipe(process.stderr);
 const completed=new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',(code,signal)=>code===0?resolve():reject(new Error(`Paired ${mode}/${seed} exited ${code}, signal ${signal}`)));});
 completed.catch(()=>{});
 let inspected;
 try {
  const direct=await consumeObservations(proofs.unproven(child.stdio[3]),{officialPath:'independent/official.bin',publishedPath:'independent/published.bin',primaryInspectTurn:bridge.inspectTurn});
  inspected=proofs.finish(direct);fs.writeFileSync(`reports/bridge-${mode}-seed-${seed}.json`,JSON.stringify(inspected,null,2)+'\n');
  await completed;
 }catch(error){child.kill('SIGTERM');await completed.catch(()=>{});throw error;}
 const simulation=JSON.parse(fs.readFileSync(reportPath,'utf8'));
 assert.equal(simulation.passed,true);assert.equal(simulation.games,1000000);assert.equal(simulation.pairedResults,1000000);
 assert.equal(simulation.holdComparisons,26000000);assert.equal(simulation.categoryComparisons,13000000);assert.equal(simulation.scoreTransitionComparisons,13000000);assert.equal(simulation.decisionComparisons,39000000);
 assert.ok(simulation.sigma<=4);assert.ok(simulation.maximumDecisionGap<=1e-10);
 assert.equal(inspected.records,simulation.distinctVisitedComponents);
 assert.equal(inspected.records,simulation.referenceComputedComponents);
 assert.equal(fs.statSync(keysPath).size,inspected.records*4);
 assert.equal(inspected.orderedComponentKeysSha256,digest(keysPath));
 assert.equal(digest(regenerated),digest(`tables/${mode}.bin`),'Native policy calculation regenerated the actual shipped table bit for bit');
 assert.equal(fs.readFileSync('yahtzeeOpt.ts','utf8'),bridge.originalSource);
 const result={passed:true,mode,seed,simulation,actualTypeScriptBridge:inspected,regeneratedBinarySHA256:digest(regenerated),visitedKeysSHA256:digest(keysPath)};
 fs.writeFileSync(`reports/paired-${mode}-seed-${seed}.json`,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({suite:'paired-native-and-actual-TypeScript',...result}));return result;
}
if(process.argv[2])await simulateAndVerify(process.argv[2],Number(process.argv[3]));
