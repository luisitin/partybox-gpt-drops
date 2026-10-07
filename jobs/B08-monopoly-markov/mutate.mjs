import assert from 'node:assert/strict';
import { readFileSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { verify } from './checks.mjs';
const seed=Number(process.argv[2]);
assert.ok([1,2,3].includes(seed));
const original=readFileSync('monopolyOdds.ts','utf8');
const digest=createHash('sha256').update(original).digest('hex');
const mutations=[
  ['M01 denominator','TRANSITION_DENOMINATOR = 9216','TRANSITION_DENOMINATOR = 9217'],
  ['M02 early triple-double jail','double && streak === 2','double && streak === 1'],
  ['M03 reversed doubles','const double = first === second;','const double = first !== second;'],
  ['M04 premature third jail attempt','current.failedAttempts < 2','current.failedAttempts < 1'],
  ['M05 jail doubles extra roll','followingDoubles = 0;','followingDoubles = double ? 1 : 0;'],
  ['M06 ASAP inherited jail streak','current.kind === \'free\' ? current.doubles : 0;','current.kind === \'free\' ? current.doubles : 1;'],
  ['M07 ordinary streak reset','followingDoubles = double ? streak + 1 : 0;','followingDoubles = double ? streak + 1 : 1;'],
  ['M08 movement off by one','position + first + second','position + first + second + 1'],
  ['M09 GoToJail relocation','if (at === 30) {','if (at === 31) {'],
  ['M10 CC jail card visiting','put(10, oneCard, true);','put(10, oneCard, false);',0],
  ['M11 Chance jail card visiting','put(10, oneCard, true);','put(10, oneCard, false);',1],
  ['M12 CC card multiplicity','put(at, 14 * oneCard);','put(at, 13 * oneCard);'],
  ['M13 Chance stay multiplicity','put(at, 6 * oneCard);','put(at, 7 * oneCard);'],
  ['M14 missing second railroad card','put(railroad, 2 * oneCard, false, true);','put(railroad, oneCard, false, true);'],
  ['M15 nearest railroad mapping','at === 7 ? 15 : at === 22 ? 25 : 5','at === 7 ? 5 : at === 22 ? 25 : 5'],
  ['M16 nearest utility mapping','const utility = at === 22 ? 28 : 12;','const utility = at === 22 ? 12 : 28;'],
  ['M17 back-three card','resolve(at - 3, oneCard);','resolve(at - 2, oneCard);'],
  ['M18 jail does not reset streak','arrival.jailed ? FIRST_JAIL_STATE : freeState(arrival.position, followingDoubles)','arrival.jailed ? freeState(10, followingDoubles) : freeState(arrival.position, followingDoubles)'],
  ['M19 end-turn filter','decoded.kind === \'jailed\' || decoded.doubles === 0','decoded.kind === \'jailed\' || decoded.doubles === 1'],
  ['M20 Marvin Gardens rent edition','[24, 120, 360, 850, 1025, 1200]','[22, 120, 360, 850, 1025, 1200]'],
  ['M21 missing full-set rent doubling','2 * property.rents[0]!','property.rents[0]!'],
  ['M22 hotel construction investment','(houseLevel ?? 0) * property.houseCost','Math.min(houseLevel ?? 0, 4) * property.houseCost'],
  ['M23 railroad premium missing','(probability + railroadBonus) * rent','(probability + 0 * railroadBonus) * rent'],
  ['M24 utility Chance premium','42 * utilityChance','28 * utilityChance'],
  ['M25 per-turn rent conversion','expectedRentPerRoll / result.turnStartMass','expectedRentPerRoll * result.turnStartMass'],
];
assert.equal(mutations.length,25);
const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);
assert.equal(config.error,undefined);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd());
assert.equal(parsed.errors.length,0);
const file=resolve('monopolyOdds.ts');
const results=[];
for(const [name,before,after,occurrence=0] of mutations) {
  const offsets=[];let cursor=0;
  while(true){const index=original.indexOf(before,cursor);if(index<0)break;offsets.push(index);cursor=index+before.length;}
  assert.equal(offsets.length,name.startsWith('M10')||name.startsWith('M11')?2:1,`Unique mutation site: ${name}`);
  const index=offsets[occurrence];
  const changed=original.slice(0,index)+after+original.slice(index+before.length);
  const options={...parsed.options,declaration:false,noEmit:false,outDir:undefined};
  const host=ts.createCompilerHost(options);
  const originalRead=host.readFile.bind(host);
  host.readFile=path=>resolve(path)===file?changed:originalRead(path);
  let compiled;
  host.writeFile=(path,content)=>{if(path.endsWith('monopolyOdds.js'))compiled=content;};
  const program=ts.createProgram([file],options,host);
  const diagnostics=ts.getPreEmitDiagnostics(program);
  const emitted=program.emit();
  diagnostics.push(...emitted.diagnostics);
  assert.equal(diagnostics.length,0,`${name} must compile strictly: ${ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'})}`);
  assert.ok(compiled,`${name} emitted module`);
  const target=`.verification/mutant-${seed}-${name.slice(0,3)}.mjs`;
  writeFileSync(target,compiled);
  let failure;
  try {const engine=await import(pathToFileURL(resolve(target)).href);verify(engine,{published:false});}
  catch(error){failure=String(error.message);}
  assert.ok(failure,`${name} survived runtime independent verification`);
  assert.equal(createHash('sha256').update(readFileSync('monopolyOdds.ts')).digest('hex'),digest,'Original source unchanged after this isolated mutant');
  results.push({name,strictCompilation:true,runtimeKilled:true,failure});
  console.log(JSON.stringify({suite:'mutation',seed,...results.at(-1)}));
}
assert.equal(createHash('sha256').update(readFileSync('monopolyOdds.ts')).digest('hex'),digest,'Original restored/unchanged after each isolated mutation');
const report={passed:true,seed,mutations:25,strictCompiled:25,runtimeKilled:25,productionSHA256:digest,results};
writeFileSync(`.verification/mutations-seed-${seed}.json`,JSON.stringify(report,null,2)+'\n');
