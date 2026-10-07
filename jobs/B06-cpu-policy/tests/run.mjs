import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import{spawnSync}from'node:child_process';import{pathToFileURL}from'node:url';import{createHash}from'node:crypto';
import{manual}from'./scenarios.mjs';import{researchCheck}from'./research-check.mjs';import{randomSuite,toySuite}from'./core.mjs';import{mutations}from'./mutations.mjs';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');process.chdir(root);fs.mkdirSync('.work',{recursive:true});
const compile=(args)=>{const p=spawnSync(process.execPath,['node_modules/typescript/bin/tsc',...args],{encoding:'utf8',timeout:60000});assert.equal(p.status,0,`strict compile: ${p.stdout}${p.stderr}`);};
const source=fs.readFileSync('cpuPolicy.ts','utf8');assert.ok(!/Math\.random|Date\.now|performance\.now/.test(source));assert.equal(Object.keys(JSON.parse(fs.readFileSync('package.json')).dependencies??{}).length,0);
for(const seed of [1,2,3]){
 compile(['-p','tsconfig.json']);const api=await import(pathToFileURL(path.join(root,'build/cpuPolicy.js'))+'?seed='+seed),ref=await import(pathToFileURL(path.join(root,'build/reference.js'))+'?seed='+seed);
 const scenarios=manual(api),independentScenarios=manual(ref);assert.deepEqual(scenarios,independentScenarios);
 console.log(`seed ${seed}: 80 manual scenarios passed`);const random=randomSuite(api,ref,seed,100000);console.log(`seed ${seed}: ${random.cases} random legal states passed`);
 const toy=toySuite(api,ref,seed,10000);console.log(`seed ${seed}: Hard ${toy.hard}/10000 (${toy.rate*100}%), Easy ${toy.easy}, ties ${toy.ties}`);
 const kills=[];
 for(let i=0;i<mutations.length;i++){
  const[name,needle,replacement]=mutations[i];assert.ok(source.includes(needle),`missing mutation ${name}`);const folder=path.join(root,'.work',`seed${seed}-mut${i+1}`);fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'cpuPolicy.ts'),source.replace(needle,replacement));fs.copyFileSync('types.ts',path.join(folder,'types.ts'));
  compile(['--strict','--noUncheckedIndexedAccess','--exactOptionalPropertyTypes','--noUnusedLocals','--noUnusedParameters','--noEmitOnError','--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext','--outDir',path.join(folder,'build'),path.join(folder,'cpuPolicy.ts'),path.join(folder,'types.ts')]);
  const mutant=await import(pathToFileURL(path.join(folder,'build/cpuPolicy.js')));let witness=null;
  try{manual(mutant);randomSuite(mutant,ref,seed,1000);toySuite(mutant,ref,seed,100);}catch(error){witness=String(error.message).slice(0,1000);}
  assert.ok(witness,`SURVIVED: ${name}`);kills.push({number:i+1,name,compiled:true,killed:true,witness,sourceSha256:createHash('sha256').update(source.replace(needle,replacement)).digest('hex')});console.log(`seed ${seed}: mutant ${i+1}/25 killed (${name})`);
 }
 const research=researchCheck();
 const report={seed,research,command:'npm test',manual:scenarios,random,toy,mutations:kills,status:'passed'};fs.writeFileSync(`.work/seed-${seed}.json`,JSON.stringify(report,null,2)+'\n');
}
console.log('All code suites passed for seeds 1, 2, 3. Research acceptance is tracked separately and may remain UNVERIFIED.');
