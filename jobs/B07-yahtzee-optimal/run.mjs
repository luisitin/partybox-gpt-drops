import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
fs.mkdirSync('.verification',{recursive:true});fs.mkdirSync('reports',{recursive:true});
for(const mode of ['official','published'])fs.rmSync(`.verification/component-proofs-${mode}.json`,{force:true});
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const execute=(binary,args,options={})=>execFileSync(binary,args,{stdio:'inherit',env:{...process.env,OMP_NUM_THREADS:process.env.OMP_NUM_THREADS??'2'},...options});
const node=args=>execute(process.execPath,args);
const tscArgs=['node_modules/typescript/bin/tsc','--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext','--strict','--noUncheckedIndexedAccess','--exactOptionalPropertyTypes','--noUnusedLocals','--noUnusedParameters','--noEmitOnError'];
function checkSeal(folder,manifest,replacements={}) {
 const lines=fs.readFileSync(path.join(folder,manifest),'utf8').trim().split('\n');
 for(const line of lines){const [digest,name]=line.split('  ');assert.ok(digest&&name);assert.equal(sha(replacements[name]??path.join(folder,name)),digest,`Historical seal ${folder}/${name}`);}
 return lines.length;
}
function files(folder) {
 return fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>{
  if(['node_modules','build','.verification','.git'].includes(entry.name))return [];
  const filename=path.join(folder,entry.name);return entry.isDirectory()?files(filename):[filename];
 });
}
const repository=path.resolve('../..');
const jobPrefix='jobs/B07-yahtzee-optimal/';
const manifest=fs.readFileSync('SHA256SUMS.txt','utf8').trim().split('\n');
const manifestNames=new Set();
for(const line of manifest){const [digest,name]=line.split('  ');assert.ok(digest&&name);assert.equal(sha(path.join(repository,name)),digest,`Committed manifest ${name}`);manifestNames.add(name);}
for(const file of files('.').filter(file=>path.basename(file)!=='SHA256SUMS.txt'))assert.ok(manifestNames.has(jobPrefix+file),`Manifest coverage ${file}`);
assert.ok(manifestNames.has('.github/workflows/B07.yml'),'Workflow is included in delivery hashes');
const sourceFiles=files('.').filter(file=>!file.startsWith('reports/')&&path.basename(file)!=='SHA256SUMS.txt');
const initialHashes=new Map(sourceFiles.map(file=>[file,sha(file)]));
for(const file of files('.'))assert.ok(fs.statSync(file).size<=30000000,`File exceeds30MB: ${file}`);
const packageJSON=JSON.parse(fs.readFileSync('package.json','utf8'));assert.equal(Object.keys(packageJSON.dependencies).length,0);
assert.equal(JSON.parse(fs.readFileSync('node_modules/typescript/package.json','utf8')).version,'5.8.3');
assert.ok(Number(process.versions.node.split('.')[0])>=22);
const primary=fs.readFileSync('yahtzeeOpt.ts','utf8'),generator=fs.readFileSync('generator.cpp','utf8');
assert.ok(!/Math\.random|Date\.now|node:|\bfetch\s*\(|\brequire\s*\(/.test(primary),'Production must be pure with no runtime platform dependencies');
assert.ok(!/254\.58/.test(primary+generator),'No starting expectation is hardcoded in production or generator');
const historicalPrimaryFiles=checkSeal('.','PRIMARY-SEALED-SHA256SUMS.txt',{'yahtzeeOpt.ts':'primary-snapshot/yahtzeeOpt.ts'});
assert.equal(fs.readFileSync('PRIMARY-SEALED-SHA256SUMS.txt','utf8'),fs.readFileSync('primary-snapshot/PRIMARY-SEALED-SHA256SUMS.txt','utf8'));
const independentFiles=checkSeal('independent','SEALED-SHA256SUMS.txt');
const adapterOriginalFiles=checkSeal('independent/native-adapter/v1-snapshot','ADAPTER-SEALED-SHA256SUMS.txt');
const adapterFiles=checkSeal('independent/native-adapter','ADAPTER-V2-SEALED-SHA256SUMS.txt');
node(['node_modules/typescript/bin/tsc','-p','tsconfig.json']);node(['copy-tables.mjs']);
for(const mode of ['official','published'])assert.equal(sha(`tables/${mode}.json`),sha(`build/tables/${mode}.json`),'Deployed compiled module uses the actual shipped table unchanged');
node([...tscArgs,'--declaration','--outDir','build/independent','independent/reference.ts']);
node([...tscArgs,'--outDir','independent/native-adapter/build','independent/native-adapter/reference-verification.ts']);
execute('g++',['-std=c++20','-O3','-ffp-contract=off','-fopenmp','-Wall','-Wextra','-Werror','generator.cpp','-o','.verification/generator']);
execute('g++',['-std=c++20','-O3','-ffp-contract=off','-Wall','-Wextra','-Werror','independent/generate.cpp','-o','.verification/independent-generator']);
execute('g++',['-std=c++20','-O3','-ffp-contract=off','-fopenmp','-Wall','-Wextra','-Werror','paired-sim.cpp','-o','.verification/paired-sim']);
const tableFacts=[];
for(const mode of ['official','published']){
 const bytes=fs.readFileSync(`tables/${mode}.bin`),json=JSON.parse(fs.readFileSync(`tables/${mode}.json`,'utf8'));assert.equal(bytes.length,8388608);assert.equal(json.length,1048576);
 let finite=0;for(let i=0;i<json.length;i++){const value=bytes.readDoubleLE(i*8);if(Number.isFinite(value)){assert.equal(json[i],value);finite++;}else assert.equal(json[i],null);}
 assert.equal(finite,536448);tableFacts.push({mode,entries:json.length,finiteStates:finite,binarySHA256:sha(`tables/${mode}.bin`),jsonSHA256:sha(`tables/${mode}.json`)});
}
const suites=[];
for(const seed of [1,2,3]){
 console.log(`B07 full seed ${seed}: begin`);
 const independentRegenerations=[];
 for(const mode of ['official','published']){
  const output=`.verification/independent-regenerated-${mode}-seed-${seed}.bin`,logPath=`.verification/independent-generation-${mode}-seed-${seed}.log`;
  const stdout=fs.openSync(logPath,'w');try{execute('./.verification/independent-generator',[mode,output],{stdio:['ignore',stdout,'inherit']});}finally{fs.closeSync(stdout);}
  assert.equal(sha(output),sha(`independent/${mode}.bin`),'Independent source regenerated its own sealed table bit for bit');
  const result=JSON.parse(fs.readFileSync(logPath,'utf8').trim());assert.equal(result.validStates,536448);assert.equal(result.entries,1048576);
  independentRegenerations.push({...result,regeneratedSHA256:sha(output)});
 }
 node(['proof-selfcheck.mjs']);
 node(['verify-seed.mjs',String(seed)]);
 node(['mutate.mjs',String(seed)]);
 const paired=[];
 for(const mode of ['official','published']){
  node(['simulate.mjs',mode,String(seed)]);
  paired.push(JSON.parse(fs.readFileSync(`reports/paired-${mode}-seed-${seed}.json`,'utf8')));
 }
 const suite={seed,independentRegenerations,verification:JSON.parse(fs.readFileSync(`reports/verification-seed-${seed}.json`,'utf8')),mutations:JSON.parse(fs.readFileSync(`reports/mutations-seed-${seed}.json`,'utf8')),paired};
 fs.writeFileSync(`reports/full-seed-${seed}.json`,JSON.stringify(suite,null,2)+'\n');suites.push(suite);
 for(const [file,digest] of initialHashes)assert.equal(sha(file),digest,`Source/assets unchanged after full seed${seed}: ${file}`);
 console.log(`B07 full seed ${seed}: PASS all required counts`);
}
const totals={midgameStates:suites.reduce((n,s)=>n+s.verification.random.states,0),scoringCases:suites.reduce((n,s)=>n+s.verification.scoring.scoringCases,0),strictCompiledMutants:suites.reduce((n,s)=>n+s.mutations.strictCompiled,0),runtimeKilledMutants:suites.reduce((n,s)=>n+s.mutations.runtimeKilled,0),fullPairedGames:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.simulation.games,0),0),nativeDecisionComparisons:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.simulation.decisionComparisons,0),0),nativeScoringTransitionComparisons:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.simulation.scoreTransitionComparisons,0),0),visitedComponentVectors:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.actualTypeScriptBridge.records,0),0),directActualTypeScriptComponents:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.actualTypeScriptBridge.directRecords,0),0),reusedVerifiedComponentVectors:suites.reduce((n,s)=>n+s.paired.reduce((a,p)=>a+p.actualTypeScriptBridge.reusedRecords,0),0)};
assert.equal(totals.midgameStates,150000);assert.equal(totals.scoringCases,606528);assert.equal(totals.strictCompiledMutants,75);assert.equal(totals.runtimeKilledMutants,75);assert.equal(totals.fullPairedGames,6000000);assert.equal(totals.nativeDecisionComparisons,234000000);assert.equal(totals.nativeScoringTransitionComparisons,78000000);
const summary={passed:true,runtime:{node:process.version,typescript:'5.8.3',cpp:execFileSync('g++',['--version'],{encoding:'utf8'}).split('\n')[0]},sourceIsolation:{historicalPrimaryFiles,independentFiles,adapterOriginalFiles,adapterFiles,immutableFiles:initialHashes.size,sourceHashes:Object.fromEntries(initialHashes)},tables:tableFacts,seeds:[1,2,3],totals,suites};
fs.writeFileSync('reports/summary.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({passed:true,totals,runtime:summary.runtime}));
