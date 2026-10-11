import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {createReference} from './build/reference-verification.js';

const tolerance=1e-10;
function table(path){const b=fs.readFileSync(path);if(b.length!==8388608)throw new Error('own table size');return new Float64Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));}
function counts(code){const result=[];for(let f=0;f<6;f++){result.push(code%6);code=Math.floor(code/6);}if(code!==0)throw new Error('hold code range');return result;}
function dice(code){return counts(code).flatMap((n,f)=>Array(n).fill(f+1));}
function code(d){const c=[0,0,0,0,0,0];for(const f of d)c[f-1]++;return c.reduce((n,v,f)=>n+v*6**f,0);}
const full=[];
function rolls(prefix,start){if(prefix.length===5){full.push(prefix);return;}for(let f=start;f<=6;f++)rolls([...prefix,f],f);}
rolls([],1);
const allHolds=[];
for(let n=0;n<=5;n++){
 function build(prefix,start){if(prefix.length===n){allHolds.push(prefix);return;}for(let f=start;f<=6;f++)build([...prefix,f],f);}
 build([],1);
}
allHolds.sort((a,b)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;});
function fail(reason,details){throw new Error(reason+' '+JSON.stringify(details));}
function near(a,b,details){if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>tolerance)fail('native vs actual sealed TS value', {...details,a,b,tolerance});}
function parse(record,format){
 const key=record.readUInt32LE(0);if(key>=2097152)fail('component key',{key});
 const card={usedMask:key%8192,upper:Math.floor(key/8192)%64,yahtzeeBonus:!!(key&524288),ruleMode:key&1048576?'published':'official'};
 let reference,primary;
 if(format==='paired'){
  const policy=offset=>({category:Array.from(record.subarray(offset,offset+252)),holdOneCodes:Array.from({length:252},(_,r)=>record.readUInt16LE(offset+252+r*2)),holdTwoCodes:Array.from({length:252},(_,r)=>record.readUInt16LE(offset+756+r*2))});
  primary=policy(4);reference=policy(1264);
  reference.zero=Array.from({length:252},(_,r)=>record.readDoubleLE(2524+r*8));reference.one=Array.from({length:252},(_,r)=>record.readDoubleLE(4540+r*8));reference.two=Array.from({length:252},(_,r)=>record.readDoubleLE(6556+r*8));
 }else{
  reference={zero:Array.from({length:252},(_,r)=>record.readDoubleLE(4+r*8)),one:Array.from({length:252},(_,r)=>record.readDoubleLE(2020+r*8)),two:Array.from({length:252},(_,r)=>record.readDoubleLE(4036+r*8)),category:Array.from({length:252},(_,r)=>record.readInt32LE(6052+r*4)),holdOneCodes:Array.from({length:252},(_,r)=>record.readInt32LE(7060+r*4)),holdTwoCodes:Array.from({length:252},(_,r)=>record.readInt32LE(8068+r*4))};
 }
 return {key,card,reference,primary};
}
export async function verifyStream({stream,officialPath,publishedPath,format='paired',primaryVerifier,expectedComponents,reportPath,reference}){
 if(format!=='paired'&&format!=='standalone')throw new Error('observation format');
 const ref=reference??createReference(table(officialPath),table(publishedPath));
 const size=format==='paired'?8572:9076;
 const sourceDigest=crypto.createHash('sha256'),keysDigest=crypto.createHash('sha256');
 let pending=Buffer.alloc(0),records=0,numericChecks=0,policyChecks=0,alternativeCategories=0,alternativeHolds=0,maxDifference=0;
 const seen=new Set();
 async function compare(record){
  const parsed=parse(record,format),{key,card,reference:native}=parsed;
  if(seen.has(key))fail('duplicate component',{key});seen.add(key);keysDigest.update(record.subarray(0,4));
  const actual=ref.inspectTurn(card);
  for(let r=0;r<252;r++){
   for(const layer of ['zero','one','two']){near(native[layer][r],actual[layer][r],{key,r,layer});maxDifference=Math.max(maxDifference,Math.abs(native[layer][r]-actual[layer][r]));numericChecks++;}
   const nc=native.category[r],tc=actual.categories[r];
   if(nc!==tc){const s=ref.score(full[r],nc,card);if(!s.legal)fail('illegal native category',{key,r,nc});near(s.points+s.yahtzeeBonus+s.upperBonus+ref.expectedValue(s.next),actual.zero[r],{key,r,category:nc});alternativeCategories++;}
   policyChecks++;
   for(const [n,name,actualName,layer] of [[1,'holdOneCodes','holdsOne','one'],[2,'holdTwoCodes','holdsTwo','two']]){
    const nativeCode=native[name][r],hc=counts(nativeCode),rc=counts(code(full[r]));if(hc.reduce((a,b)=>a+b,0)>5||hc.some((v,f)=>v>rc[f]))fail('illegal native hold',{key,r,n,nativeCode});
    const selected=allHolds[actual[actualName][r]];if(!selected)fail('actual TS hold index',{key,r,n});
    if(nativeCode!==code(selected)){near(ref.bruteHoldValue(full[r],dice(nativeCode),n,card),actual[layer][r],{key,r,n,nativeCode});alternativeHolds++;}
    policyChecks++;
   }
  }
  if(primaryVerifier)await primaryVerifier(parsed);
  records++;
 }
 for await(const chunk of stream){sourceDigest.update(chunk);pending=pending.length?Buffer.concat([pending,chunk]):chunk;let offset=0;while(offset+size<=pending.length){await compare(pending.subarray(offset,offset+size));offset+=size;}pending=Buffer.from(pending.subarray(offset));}
 if(pending.length)fail('partial observation record',{bytes:pending.length,size});
 if(records===0)fail('empty observation stream',{});
 if(expectedComponents!==undefined&&records!==expectedComponents)fail('component count',{records,expectedComponents});
 const report={records,numericChecks,policyChecks,alternativeCategories,alternativeHolds,maxDifference,tolerance,streamSha256:sourceDigest.digest('hex'),orderedComponentKeysSha256:keysDigest.digest('hex'),format,recordBytes:size,allPassed:true};
 if(reportPath)fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');return report;
}
export async function consumeObservations(stream,{officialPath,publishedPath,primaryInspectTurn,expectedComponents,reportPath}){
 if(typeof primaryInspectTurn!=='function')throw new Error('actual primary TypeScript inspection hook required');
 const reference=createReference(table(officialPath),table(publishedPath));
 let primaryNumericChecks=0,primaryPolicyChecks=0,primaryAlternativeCategories=0,primaryAlternativeHolds=0,primaryCrossImplementationAlternatives=0,primaryMaxDifference=0;
 const primaryVerifier=async({key,card,primary,native,reference:observed})=>{
  if(!primary)fail('missing primary observation',{key});
  const actual=await primaryInspectTurn(card),own=reference.inspectTurn(card);
  function categoryValue(category,r){const s=reference.score(full[r],category,card);if(!s.legal)fail('nonoptimal primary category is illegal',{key,r,category});return s.points+s.yahtzeeBonus+s.upperBonus+reference.expectedValue(s.next);}
  for(let r=0;r<252;r++){
   for(const layer of ['zero','one','two']){near(actual[layer][r],observed[layer][r],{key,r,primaryLayer:layer});primaryMaxDifference=Math.max(primaryMaxDifference,Math.abs(actual[layer][r]-observed[layer][r]));primaryNumericChecks++;}
   const category=actual.category[r],observedCategory=primary.category[r];
   for(const candidate of [category,observedCategory])if(!Number.isInteger(candidate)||candidate<0||candidate>12)fail('primary category range',{key,r,candidate});
   if(category!==own.categories[r]){near(categoryValue(category,r),own.zero[r],{key,r,actualPrimaryCategory:category});primaryCrossImplementationAlternatives++;}
   if(category!==observedCategory){near(categoryValue(category,r),own.zero[r],{key,r,primaryCategory:category});near(categoryValue(observedCategory,r),own.zero[r],{key,r,nativePrimaryCategory:observedCategory});primaryAlternativeCategories++;}
   primaryPolicyChecks++;
   for(const [n,name,layer] of [[1,'holdOneCodes','one'],[2,'holdTwoCodes','two']]){
    const actualCode=actual[name][r],observedCode=primary[name][r];
    for(const candidate of [actualCode,observedCode]){if(!Number.isInteger(candidate)||candidate<0||candidate>=46656)fail('primary hold code',{key,r,n,candidate});const hc=counts(candidate),rc=counts(code(full[r]));if(hc.some((v,f)=>v>rc[f]))fail('primary hold is not a submultiset',{key,r,n,candidate});}
    if(actualCode!==observedCode){near(reference.bruteHoldValue(full[r],dice(actualCode),n,card),own[layer][r],{key,r,n,actualCode});near(reference.bruteHoldValue(full[r],dice(observedCode),n,card),own[layer][r],{key,r,n,observedCode});primaryAlternativeHolds++;}
    const ownCode=code(allHolds[(n===1?own.holdsOne:own.holdsTwo)[r]]);
    if(actualCode!==ownCode){near(reference.bruteHoldValue(full[r],dice(actualCode),n,card),own[layer][r],{key,r,n,actualPrimaryCode:actualCode});primaryCrossImplementationAlternatives++;}
    primaryPolicyChecks++;
   }
  }
 };
 const result=await verifyStream({stream,officialPath,publishedPath,format:'paired',primaryVerifier,expectedComponents,reference});
 const report={...result,primaryNumericChecks,primaryPolicyChecks,primaryAlternativeCategories,primaryAlternativeHolds,primaryCrossImplementationAlternatives,primaryMaxDifference};
 if(reportPath)fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const [officialPath,publishedPath,format='standalone',reportPath,expected]=process.argv.slice(2);
 if(!officialPath||!publishedPath)throw new Error('usage: verify-stream ownOfficial.bin ownPublished.bin standalone|paired [report.json]');
 const expectedComponents=expected===undefined?undefined:Number(expected);
 if(expectedComponents!==undefined&&(!Number.isInteger(expectedComponents)||expectedComponents<=0))throw new Error('expected component count');
 const result=await verifyStream({stream:process.stdin,officialPath,publishedPath,format,reportPath,expectedComponents});console.log(JSON.stringify(result));
}
