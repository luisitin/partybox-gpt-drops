import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {cpus,platform,arch,availableParallelism} from 'node:os';
import {spawn} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import * as AI from '../dist/battleshipAI.js';
import {runUnit,runDifferential,runSampleAudit} from './suites.mjs';
import {runMutations} from './mutations.mjs';
const quick=process.argv.includes('--quick'),noBench=process.argv.includes('--no-bench');
const single=process.argv.find(x=>x.startsWith('--seed='));
const seeds=single?[Number(single.split('=')[1])]:[1,2,3];
assert.ok(seeds.every(x=>[1,2,3].includes(x)),'Only verification seeds 1, 2 and 3 are supported');
const command=`${process.execPath} test/run.mjs ${process.argv.slice(2).join(' ')}`.trim();
const report={command,complete:!quick&&!noBench&&!single,node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0]?.model,
  logicalCPUs:availableParallelism(),seeds,staticChecks:[],units:[],differential:[],sampleAudits:[],mutations:[],benchmarks:[],failures:[]};
const start=performance.now();mkdirSync('reports',{recursive:true});
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
function save(){report.elapsedSeconds=(performance.now()-start)/1000;writeFileSync('reports/latest.json',JSON.stringify(report,null,2)+'\n');}
function checks() {
  const packageJson=JSON.parse(readFileSync('package.json','utf8')),config=JSON.parse(readFileSync('tsconfig.json','utf8'));
  assert.equal(config.compilerOptions.strict,true);assert.equal(config.compilerOptions.noUncheckedIndexedAccess,true);
  assert.equal(config.compilerOptions.exactOptionalPropertyTypes,true);
  assert.deepEqual(packageJson.dependencies??{},{});
  const source=readFileSync('battleshipAI.ts','utf8');
  assert.ok(!/Math\s*\.\s*random\s*\(|Date\s*\.\s*now\s*\(/.test(source));
  assert.ok(!/^\s*import\s/m.test(source),'Production implementation has no imports');
  report.sourceSHA256=hash('battleshipAI.ts');report.oracleSHA256=hash('test/oracle.ts');
  if(existsSync('SHA256SUMS.txt')) {
    const lines=readFileSync('SHA256SUMS.txt','utf8').trim().split('\n');
    for(const line of lines){const [expected,path]=line.split(/  /);assert.equal(hash(path),expected,`SHA256 ${path}`);}
    report.integrityFiles=lines.length;
  }else if(!quick)throw new Error('SHA256SUMS.txt is required for the full suite');
  report.staticChecks.push({name:'strict configuration, dependency and RNG checks',cases:6,passed:6});
}
async function worker(seed,difficulty,games) {
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['test/benchmark.mjs',String(seed),String(games),difficulty],{stdio:['ignore','pipe','pipe']});
    let stderr='';child.stdout.on('data',chunk=>process.stdout.write(chunk));child.stderr.on('data',chunk=>{stderr+=chunk;process.stderr.write(chunk);});
    child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`${difficulty} seed ${seed} exited ${code}: ${stderr.slice(-1500)}`)));
  });
  const r=JSON.parse(readFileSync(`reports/benchmark-${difficulty}-seed${seed}-${games}.json`,'utf8'));report.benchmarks.push(r);save();
  if(difficulty==='hard'&&!r.hardUnder45)report.failures.push(`${difficulty} seed ${seed}: mean ${r.mean} is not <45`);
  if(!r.allShotsUnder50ms)report.failures.push(`${difficulty} seed ${seed}: ${r.latency.over50} calls exceeded 50 ms (max ${r.latency.max})`);
  if(r.repeatedShots||r.errors)report.failures.push(`${difficulty} seed ${seed}: repeated shots or errors`);
}
try {
  checks();
  for(const seed of seeds) {
    report.units.push(...runUnit(AI,seed));
    report.differential.push(runDifferential(AI,seed,quick?1000:10000));
    report.sampleAudits.push(runSampleAudit(AI,seed,quick?50:200));
    const mutations=await runMutations(AI,seed);report.mutations.push(mutations);
    if(mutations.passed!==25)report.failures.push(`seed ${seed}: only ${mutations.passed}/25 mutations killed`);
    save();console.log(JSON.stringify({verifiedSeed:seed,differential:report.differential.at(-1),mutationsKilled:mutations.passed}));
  }
  if(!noBench)for(const difficulty of ['easy','medium','hard']) {
    // Three seed workers at most. Bounded parallelism keeps CI under the 30-minute limit.
    const pending=seeds.map(seed=>()=>worker(seed,difficulty,quick?1000:100000));
    const concurrency=Math.min(3,availableParallelism());
    async function drain(){while(pending.length){const work=pending.shift();try{await work();}catch(error){report.failures.push(error.message);save();}}}
    await Promise.all(Array.from({length:concurrency},drain));
  }
}catch(error){report.failures.push(error.stack??String(error));}
finally {
  report.passed=report.failures.length===0;save();
  console.log(JSON.stringify({complete:report.complete,passed:report.passed,failures:report.failures,seconds:report.elapsedSeconds,report:'reports/latest.json'}));
  if(!report.passed)process.exitCode=1;
}
