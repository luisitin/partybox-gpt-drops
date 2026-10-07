import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { findBestPlay, validateTable, validatePlay } from '../dist/rummikub.js';
import { referenceBestPlay, referenceValidateTable, referenceValidatePlay } from '../dist/reference.js';
import { root, rng, smallPosition, colors, freeze, receipt, seedArg, hash } from './helpers.mjs';
const seed=seedArg(), random=rng(seed), checks=[];
const check=(name,fn)=>{fn();checks.push({name,passed:true});};
for(const filename of ['rummikub.ts','reference.ts']) check(`${filename}: no runtime imports or ambient clocks/randomness`,()=>{
 const text=readFileSync(resolve(root,filename),'utf8'), ast=ts.createSourceFile(filename,text,ts.ScriptTarget.Latest,true);
 const visit=node=>{
  assert.ok(!ts.isImportDeclaration(node)&&!ts.isImportEqualsDeclaration(node),'no runtime imports');
  if(ts.isPropertyAccessExpression(node)) assert.ok(!['Math.random','Date.now','performance.now','process.hrtime'].includes(node.getText(ast)));
  if(ts.isIdentifier(node)) assert.ok(!['Date','setTimeout','setInterval','fetch','XMLHttpRequest'].includes(node.text));
  ts.forEachChild(node,visit);
 };visit(ast);
});
check('strict compiler settings and zero runtime dependencies',()=>{
 const pkg=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
 assert.equal(Object.keys(pkg.dependencies??{}).length,0);
 const cfg=JSON.parse(readFileSync(resolve(root,'tsconfig.json'),'utf8')).compilerOptions;
 for(const key of ['strict','noUncheckedIndexedAccess','exactOptionalPropertyTypes','noUnusedLocals','noUnusedParameters']) assert.equal(cfg[key],true);
});
check('seeded RNG determinism and range for 10000 draws',()=>{
 const a=rng(seed),b=rng(seed); for(let i=0;i<10000;i++){const x=a();assert.equal(x,b());assert.ok(x>=0&&x<1);}
});
let transcript='';
// 1000 metamorphic positions: color permutation, ID renaming, rack reversal,
// meld-order reversal, and repeated-call equality cannot change the optimum.
for(let i=0;i<1000;i++) {
 const p=freeze(smallPosition(random,i)), a=findBestPlay(p);
 assert.ok(a.ok);const again=findBestPlay(p);assert.deepEqual(again,a);
 for(const table of [a.table,again.table]){
  assert.ok(validateTable(table).ok);assert.ok(referenceValidateTable(table));
  if(a.action==='play'){assert.ok(validatePlay(p,table).ok);assert.ok(referenceValidatePlay(p,table));}
 }
 const shift=1+(i%3);
 const recolor=c=>colors[(colors.indexOf(c)+shift)%4];
 const change=t=>t.kind==='number'?{...t,id:`renamed:${t.id}`,color:recolor(t.color)}:
   {id:`renamed:${t.id}`,kind:'joker',...(t.as?{as:{value:t.as.value,color:recolor(t.as.color)}}:{})};
 const q=freeze({initialMeldDone:p.initialMeldDone,hand:p.hand.map(change).reverse(),
   table:p.table.map(m=>({kind:m.kind,tiles:m.tiles.map(change)})).reverse()});
 const b=findBestPlay(q),oracle=referenceBestPlay(q);
 assert.ok(b.ok);assert.ok(oracle.ok);
 assert.equal(a.value,b.value);assert.equal(b.value,oracle.value);
 assert.equal(a.played.length,b.played.length);assert.equal(b.played.length,oracle.playedCount);
 for(const table of [b.table,oracle.table]) {
   assert.ok(validateTable(table).ok);assert.ok(referenceValidateTable(table));
   if(b.action==='play'){assert.ok(validatePlay(q,table).ok);assert.ok(referenceValidatePlay(q,table));}
 }
 transcript+=`${hash(JSON.stringify(q))}:${b.value}:${b.played.length}\n`;
}
receipt(`contracts-seed-${seed}`,{suite:'contracts-and-metamorphic',seed,cases:checks.length+1000,passed:checks.length+1000,
 command:`SEED=${seed} node test/contracts.mjs`,staticChecks:checks,metamorphicCases:1000,semanticDiffSha256:hash(transcript)});
console.log(`contracts seed=${seed}: ${checks.length+1000} passed`);
