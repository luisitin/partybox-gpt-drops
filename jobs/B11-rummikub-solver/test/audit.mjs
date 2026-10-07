import assert from 'node:assert/strict';
import { readFileSync,writeFileSync,mkdirSync,rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { findBestPlay,validateTable,validatePlay } from '../dist/rummikub.js';
import { referenceValidateTable,referenceValidatePlay } from '../dist/reference.js';
import { root,rng,largePosition,freeze,receipt,seedArg,hash } from './helpers.mjs';
const seed=seedArg(),original=readFileSync(resolve(root,'rummikub.ts'),'utf8');
// This is a DERIVED implementation, not a second independent author. Replace
// BOTH the frontier key and the custom hash table with full-state string keys
// and the built-in Map. This detects unsafe frontier compression and memo bugs.
const begin=original.indexOf('  // A run spans at most five values:');
const end=original.indexOf('  let states = 0, memoHits = 0, boundPrunes = 0;',begin);
assert.ok(begin>=0&&end>begin);
const replacement=`  const first = (a: number, b: number): number => a !== 0
    ? 31 - Math.clz32(a & -a) : 63 - Math.clz32(b & -b);
  const stateKey = (a: number, b: number, c: number, d: number, p: number): string =>
    [a, b, c, d, p].join(',');
  const memo = new Map<string, number>();
  const getMemo = (key: string): number => memo.get(key) ?? 0;
  const putMemo = (key: string, value: number): void => { memo.set(key, value); };
`;
const transformed=original.slice(0,begin)+replacement+original.slice(end);
const dir=resolve(root,'.mutants');mkdirSync(dir,{recursive:true});
const path=resolve(dir,`full-state-audit-${seed}.mts`),jsPath=path.replace(/\.mts$/,'.mjs');
writeFileSync(path,transformed);
const config=ts.readConfigFile(resolve(root,'tsconfig.json'),ts.sys.readFile);
assert.equal(config.error,undefined);
const options=ts.parseJsonConfigFileContent(config.config,ts.sys,root).options;
const errors=ts.getPreEmitDiagnostics(ts.createProgram([path],{...options,noEmit:true,declaration:false}))
 .filter(d=>d.category===ts.DiagnosticCategory.Error);
assert.equal(errors.length,0,errors.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));
writeFileSync(jsPath,ts.transpileModule(transformed,{compilerOptions:{...options,declaration:false,module:ts.ModuleKind.ES2022},fileName:path}).outputText);
const audit=await import(pathToFileURL(jsPath).href),random=rng(seed),cases=200;
let transcript='',corpus='';
for(let i=0;i<cases;i++) {
 const p=freeze(largePosition(random,i));corpus+=JSON.stringify(p)+'\n';
 const a=findBestPlay(p),b=audit.findBestPlay(p),context=`seed=${seed} case=${i}`;
 assert.ok(a.ok,context);assert.ok(b.ok,context);
 assert.equal(a.value,b.value,context);assert.equal(a.played.length,b.played.length,context);
 // The same search order and tie rule should also return the identical witness.
 assert.deepEqual(a.table,b.table,context);
 for(const table of [a.table,b.table]) {
  assert.ok(validateTable(table).ok,context);assert.ok(referenceValidateTable(table),context);
  if(a.action==='play'){assert.ok(validatePlay(p,table).ok,context);assert.ok(referenceValidatePlay(p,table),context);}
  else assert.deepEqual(table,p.table,context);
 }
 transcript+=`${a.value}:${a.played.length}:${hash(JSON.stringify(a.table))}\n`;
 if((i+1)%50===0)console.log(`full-state audit seed=${seed} ${i+1}/${cases}`);
}
rmSync(path);rmSync(jsPath);
receipt(`audit-seed-${seed}`,{suite:'full-state-key-large-differential',seed,cases,passed:cases,
 command:`SEED=${seed} node test/audit.mjs`,strictCompilePassed:true,
 implementation:'Derived full-inventory string-key Map; not independent authorship or brute force',
 corpusSha256:hash(corpus),semanticDiffSha256:hash(transcript),derivedSourceSha256:hash(transformed)});
console.log(`full-state audit seed=${seed}: ${cases} passed`);
