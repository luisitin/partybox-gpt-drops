import fs from 'node:fs';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {createReference} from './build/reference-verification.js';
import {verifyStream,consumeObservations} from './verify-stream.mjs';
const officialPath=new URL('../official.bin',import.meta.url),publishedPath=new URL('../published.bin',import.meta.url);
const dump=fs.readFileSync(new URL('../native-observations-selfcheck.bin',import.meta.url));
assert.equal(dump.length,9076000);const first=dump.subarray(0,9076);
const options={officialPath,publishedPath,format:'standalone',expectedComponents:1};
let rejected=0;
async function reject(name,bytes,changes={}){await assert.rejects(verifyStream({...options,...changes,stream:Readable.from([bytes])}),undefined,name);rejected++;}
await reject('empty',Buffer.alloc(0));
await reject('partial',first.subarray(0,9075));
const badKey=Buffer.from(first);badKey.writeUInt32LE(2097152,0);await reject('bad key',badKey);
const nan=Buffer.from(first);nan.writeDoubleLE(NaN,4);await reject('NaN',nan);
const wrong=Buffer.from(first);wrong.writeDoubleLE(wrong.readDoubleLE(4)+1,4);await reject('wrong value',wrong);
const category=Buffer.from(first);category.writeInt32LE(255,6052);await reject('invalid category',category);
const hold=Buffer.from(first);hold.writeInt32LE(50000,7060);await reject('invalid hold code',hold);
const sub=Buffer.from(first);sub.writeInt32LE(38880,7060);await reject('not submultiset',sub);
const nonoptimal=Buffer.from(first);nonoptimal.writeInt32LE(0,7060+251*4);await reject('legal but nonoptimal hold',nonoptimal);
await reject('duplicate',Buffer.concat([first,first]),{expectedComponents:2});
await reject('missing record',first,{expectedComponents:2});
await reject('await async failure',first,{primaryVerifier:async()=>{await Promise.resolve();throw new Error('deliberate async rejection');}});
await reject('format',first,{format:'unknown'});
const b=fs.readFileSync(officialPath),p=fs.readFileSync(publishedPath);
const ref=createReference(new Float64Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.length)),new Float64Array(p.buffer.slice(p.byteOffset,p.byteOffset+p.length)));
const fullHolds=[];for(let n=0;n<=5;n++){function walk(a,start){if(a.length===n){fullHolds.push(a);return;}for(let f=start;f<=6;f++)walk([...a,f],f);}walk([],1);}
fullHolds.sort((a,b)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;});
const encode=d=>{const c=[0,0,0,0,0,0];for(const f of d)c[f-1]++;return c.reduce((s,n,i)=>s+n*6**i,0);};
const paired=[];
for(let i=0;i<1000;i++){
 const s=dump.subarray(i*9076,(i+1)*9076),record=Buffer.alloc(8572);s.copy(record,0,0,4);
 for(const offset of [4,1264])for(let r=0;r<252;r++){record.writeUInt8(s.readInt32LE(6052+r*4),offset+r);record.writeUInt16LE(s.readInt32LE(7060+r*4),offset+252+r*2);record.writeUInt16LE(s.readInt32LE(8068+r*4),offset+756+r*2);}
 s.copy(record,2524,4,6052);paired.push(record);
}
function primaryInspectTurn(card){const t=ref.inspectTurn(card);return {zero:t.zero,one:t.one,two:t.two,category:t.categories,holdOneCodes:Array.from(t.holdsOne,h=>encode(fullHolds[h])),holdTwoCodes:Array.from(t.holdsTwo,h=>encode(fullHolds[h]))};}
const result=await consumeObservations(Readable.from(paired),{officialPath,publishedPath,primaryInspectTurn,expectedComponents:1000});
const invalidPrimaryCategory=Buffer.from(paired[0]);invalidPrimaryCategory[4]=0;
await assert.rejects(consumeObservations(Readable.from([invalidPrimaryCategory]),{officialPath,publishedPath,primaryInspectTurn,expectedComponents:1}));rejected++;
const invalidPrimaryHold=Buffer.from(paired[0]);invalidPrimaryHold.writeUInt16LE(0,256+251*2);
await assert.rejects(consumeObservations(Readable.from([invalidPrimaryHold]),{officialPath,publishedPath,primaryInspectTurn,expectedComponents:1}));rejected++;
await assert.rejects(consumeObservations(Readable.from([paired[0]]),{officialPath,publishedPath,primaryInspectTurn:async card=>{const t=primaryInspectTurn(card);const zero=new Float64Array(t.zero);zero[0]=NaN;return {...t,zero};},expectedComponents:1}));rejected++;
const report={description:'Parser self-check using independently computed native reference observations; synthetic duplicated primary fields test the protocol only, not a primary simulation',negativeFixtures:rejected,allNegativeFixturesRejected:true,pairedReferenceRows:result.records,rootNumericChecks:result.numericChecks,rootPolicyChecks:result.policyChecks,syntheticCallbackNumericChecks:result.primaryNumericChecks,syntheticCallbackPolicyChecks:result.primaryPolicyChecks,allPassed:true};
fs.writeFileSync(new URL('./PARSER-SELFCHECK.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
