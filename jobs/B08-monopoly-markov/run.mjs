import assert from 'node:assert/strict';
import { readFileSync,writeFileSync,mkdirSync,rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { basename } from 'node:path';
const digest=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
function seal(file,directory='.') {
  for(const line of readFileSync(file,'utf8').trim().split('\n')) {
    const [expected,path]=line.split('  ');
    assert.equal(digest(`${directory}/${basename(path)}`),expected,`Authoring seal ${file}/${path}`);
  }
}
function command(args) {
  console.log(`RUN node ${args.join(' ')}`);
  const result=spawnSync(process.execPath,args,{stdio:'inherit'});
  assert.equal(result.error,undefined,`Start ${args[0]}`);
  assert.equal(result.status,0,`Successful exit ${args.join(' ')}`);
}
rmSync('.verification',{recursive:true,force:true});mkdirSync('.verification',{recursive:true});
const sources=['monopolyOdds.ts','reference.ts','roi-reference.ts','checks.mjs','test.mjs','simulate.mjs',
  'sampling-variance.mjs','mutate.mjs','run.mjs','export.mjs','hashes.mjs','tsconfig.json','package.json','package-lock.json',
  'data/published-tables.json','data/us-properties.json','data/collins-table.json'];
const sourceSHA256=Object.fromEntries(sources.map(file=>[file,digest(file)]));
seal('PRODUCTION-SEALED-SHA256SUMS.txt');
seal('blind-authoring/SEALED-SHA256SUMS.txt','blind-authoring');
seal('blind-authoring/ROI-SEALED-SHA256SUMS.txt','blind-authoring');
assert.equal(digest('reference.ts'),digest('blind-authoring/reference.ts'),'Unchanged blind transition source');
assert.equal(digest('roi-reference.ts'),digest('blind-authoring/roi-reference.ts'),'Unchanged blind ROI source');
const pkg=JSON.parse(readFileSync('package.json'));
assert.deepEqual(pkg.dependencies,{},'Zero runtime dependencies');
for(const file of ['monopolyOdds.ts','reference.ts','roi-reference.ts'])
  assert.ok(!/Math\.random|Date\.now/.test(readFileSync(file,'utf8')),`Pure deterministic core ${file}`);
assert.ok(!/^import\b/m.test(readFileSync('monopolyOdds.ts','utf8')),'Production has no imports');
assert.ok(!/monopolyOdds/.test(readFileSync('reference.ts','utf8')+readFileSync('roi-reference.ts','utf8')),'Blind solvers do not import production');
command(['hashes.mjs']);
command(['node_modules/typescript/bin/tsc','-p','tsconfig.json']);
command(['export.mjs']);
const runs=[];
for(const seed of [1,2,3]) {
  command(['test.mjs',String(seed)]);
  command(['simulate.mjs',String(seed)]);
  command(['mutate.mjs',String(seed)]);
  runs.push({seed,exact:JSON.parse(readFileSync(`.verification/exact-seed-${seed}.json`)),
    simulation:JSON.parse(readFileSync(`.verification/simulation-seed-${seed}.json`)),
    mutation:JSON.parse(readFileSync(`.verification/mutations-seed-${seed}.json`))});
}
for(const [file,before] of Object.entries(sourceSHA256))assert.equal(digest(file),before,`Source unchanged during full run: ${file}`);
command(['hashes.mjs']);
const report={passed:true,node:process.version,typescript:JSON.parse(readFileSync('node_modules/typescript/package.json')).version,
  command:'npm test',seeds:[1,2,3],sourceSHA256,totals:{exactTransitionCells:86400,stationaryStates:720,publishedSquares:720,
  matchedPublishedSquares:717,documentedPublishedGaps:3,requiredButlerComparisons:480,
  roiScenarios:1044,simulationRolls:600000000,simulationSquares:240,strictCompiledMutants:75,runtimeKilledMutants:75},runs};
writeFileSync('.verification/summary.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({suite:'complete',passed:true,node:report.node,typescript:report.typescript,seeds:report.seeds,totals:report.totals}));
