import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { root,receipt } from './helpers.mjs';
const started=performance.now(),runs=[];
function run(args,seed){
 const child=spawnSync(process.execPath,args,{cwd:root,env:{...process.env,SEED:String(seed)},stdio:'inherit',timeout:25*60*1000});
 assert.equal(child.error,undefined,`command failed: node ${args.join(' ')}`);
 assert.equal(child.signal,null,'child terminated by a signal');
 assert.equal(child.status,0,`nonzero status: SEED=${seed} node ${args.join(' ')}`);
}
for(const seed of [1,2,3]){
 run(['test/checksums.mjs'],seed);
 run(['node_modules/typescript/bin/tsc','-p','tsconfig.json'],seed);
 const compile={suite:'strict-TypeScript',seed,cases:3,passed:3,command:`SEED=${seed} node node_modules/typescript/bin/tsc -p tsconfig.json`};
 receipt(`compile-seed-${seed}`,compile);runs.push(compile);
 // Deliberately serial: no suite competes with the latency measurement.
 for(const suite of ['unit','contracts','small','milp-crosscheck','large-independent','audit','mutations','bench']){
  run([`test/${suite}.mjs`],seed);
  const data=JSON.parse(readFileSync(resolve(root,`.test-output/${suite}-seed-${seed}.json`),'utf8'));
  assert.equal(data.seed,seed);assert.equal(data.passed,data.cases);
  runs.push({suite:data.suite,seed,cases:data.cases,passed:data.passed,command:data.command});
 }
}
const result={suite:'full-npm-test',command:'npm test',seeds:[1,2,3],status:'passed',runs,elapsedMs:performance.now()-started};
receipt('full-run',result);
console.log(JSON.stringify(result));
