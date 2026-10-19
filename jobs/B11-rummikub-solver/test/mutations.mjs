import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { root, seedArg, receipt, hash } from './helpers.mjs';
const seed=seedArg(), source=readFileSync(resolve(root,'rummikub.ts'),'utf8');
const baseline=spawnSync(process.execPath,['test/unit.mjs'],{cwd:root,env:{...process.env,SEED:String(seed)},encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
assert.equal(baseline.error,undefined,'Baseline launch/timeout failed');assert.equal(baseline.signal,null);
assert.equal(baseline.status,0,`A failing baseline cannot kill a mutant: ${baseline.stderr}`);
// Exactly one source change per mutant; no mutation flags exist in production.
const mutations=[
 ['M01','Accept two-tile melds','if (raw.length < 3)','if (raw.length < 2)'],
 ['M02','Reject valid four-tile groups','if (tiles.length > 4)','if (tiles.length > 3)'],
 ['M03','Ignore repeated group colors','if (new Set(faces.map(f => f.color)).size !== tiles.length)','if (false)'],
 ['M04','Ignore unequal group values','if (faces.some(f => f.value !== faces[0]!.value))','if (false)'],
 ['M05','Require gaps of two in runs','f.value !== faces[i - 1]!.value + 1','f.value !== faces[i - 1]!.value + 2'],
 ['M06','Ignore mixed run colors','if (faces.some(f => f.color !== faces[0]!.color))','if (false)'],
 ['M07','Allow value fourteen',"x['value'] <= 13 /* M07 */","x['value'] <= 14 /* M07 */"],
 ['M08','Allow value zero',"x['value'] >= 1 /* M08 */","x['value'] >= 0 /* M08 */"],
 ['M09','Permit three physical jokers','if (++jokers > 2)','if (++jokers > 3)'],
 ['M10','Permit three numbered copies','if (count > 2)','if (count > 3)'],
 ['M11','Ignore duplicate physical IDs','if (seen.has(t.id))','if (false)'],
 ['M12','Reject every placed joker',"return !onTable || validFace(x['as']); // M12","return !onTable; // M12"],
 ['M13','Raise initial threshold to 31','if (value < 30) return invalid(\'INITIAL_UNDER_30\'','if (value < 31) return invalid(\'INITIAL_UNDER_30\''],
 ['M14','Lower initial threshold to 29','if (value < 30) return invalid(\'INITIAL_UNDER_30\'','if (value < 29) return invalid(\'INITIAL_UNDER_30\''],
 ['M15','Allow initial-turn table manipulation','if (position.table.some(m => !keys.has(meldKey(m))))','if (false && position.table.some(m => !keys.has(meldKey(m))))'],
 ['M16','Allow old table tiles to disappear','if (old.some(t => !afterIds.has(t.id)))','if (false && old.some(t => !afterIds.has(t.id)))'],
 ['M17','Allow foreign physical IDs','if (!original) return invalid(\'FOREIGN_TILE\'','if (false) return invalid(\'FOREIGN_TILE\''],
 ['M18','Allow a physical tile to change identity','if (original && !physicalSame(t, original))','if (original && !physicalSame(t, original) && false)'],
 ['M19','Allow table-only moves','if (played.length === 0)','if (played.length < 0)'],
 ['M20','Do not score a played rack joker','if (!r.joker || r.handCount > 0) value += s.face.value; // M20','if (!r.joker) value += s.face.value; // M20'],
 ['M21','Count old table points as new rack value','const baseline = old.reduce((v, t) => v + (t.kind === \'number\' ? t.value : 0), 0); // M21',
  'const baseline = old.reduce((v) => v, 0); // M21'],
 ['M22','Omit group candidates','for (let value = 1; value <= 13; value++) { // M22','for (let value = 14; value <= 13; value++) { // M22'],
 ['M23','Omit run candidates','for (const color of COLORS) { // M23','for (const color of COLORS.slice(0, 0)) { // M23'],
 ['M24','Omit all joker substitutions','j < jokerIndices.length; j++) { // M24','j < 0; j++) { // M24'],
 ['M25','Treat mandatory low-word table resources as optional','const reqLo = (a & ~handLo) | (c & ~twoHandLo); // M25',
  'const reqLo = ((a & ~handLo) | (c & ~twoHandLo)) & 0; // M25'],
];
assert.equal(mutations.length,25);
const dir=resolve(root,'.mutants'); mkdirSync(dir,{recursive:true});
const config=ts.readConfigFile(resolve(root,'tsconfig.json'),ts.sys.readFile);
assert.equal(config.error,undefined);
const options=ts.parseJsonConfigFileContent(config.config,ts.sys,root).options;
const results=[];
for(const [id,description,from,to] of mutations) {
  assert.equal(source.split(from).length-1,1,`${id}: mutation must match exactly once`);
  const mutant=source.replace(from,to), file=resolve(dir,`${id}-seed-${seed}.mts`);
  writeFileSync(file,mutant);
  // Compiler errors, syntax errors, timeouts and crashes are NOT credited kills.
  const program=ts.createProgram([file],{...options,noEmit:true,declaration:false});
  const diagnostics=ts.getPreEmitDiagnostics(program).filter(x=>x.category===ts.DiagnosticCategory.Error);
  assert.equal(diagnostics.length,0,`${id}: mutant must still compile strictly: `+
    diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));
  const js=ts.transpileModule(mutant,{compilerOptions:{...options,declaration:false,module:ts.ModuleKind.ES2022},fileName:file}).outputText;
  const implementation=file.replace(/\.mts$/,'.mjs'); writeFileSync(implementation,js);
  const run=spawnSync(process.execPath,['test/unit.mjs'],{cwd:root,env:{...process.env,SEED:String(seed),B11_IMPL:implementation},
    encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
  assert.equal(run.error,undefined,`${id}: child launch/timeout error`); assert.equal(run.signal,null,`${id}: child crash`);
  const firstAssertion=(run.stderr+'\n'+run.stdout).split('\n').find(x=>x.startsWith('B11_ASSERTION_FAILURE '));
  const killed=run.status===1 && !!firstAssertion;
  results.push({id,description,from,to,strictCompilePassed:true,killed,exitCode:run.status,
    firstKillingAssertion:firstAssertion??null,mutantSha256:hash(mutant)});
  console.log(`${id} seed=${seed} ${killed?'KILLED by assertion':'SURVIVED'}`);
  rmSync(file);rmSync(implementation);
}
const data={suite:'one-at-a-time-mutations',seed,cases:25,passed:results.filter(x=>x.killed).length,
  command:`SEED=${seed} node test/mutations.mjs`,killSuite:'61 hand-written tests (includes 40 joker cases)',results};
receipt(`mutations-seed-${seed}`,data);
assert.equal(data.passed,25,'Every planted semantic bug must be caught');
console.log(JSON.stringify({...data,results:undefined}));
