import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const digest=data=>crypto.createHash('sha256').update(data).digest('hex');
const sources=['yahtzeeOpt.ts','generator.cpp','primary-bridge.mjs','paired-sim.cpp','component-proofs.mjs','simulate.mjs','run.mjs','independent/reference.ts','independent/native-adapter/reference-verification.ts','independent/native-adapter/verify-stream.mjs','independent/native-adapter/native-reference.hpp','independent/native-adapter/generate-core.hpp','tables/official.bin','tables/published.bin','tables/official.json','tables/published.json','build/tables/official.json','build/tables/published.json','independent/official.bin','independent/published.bin','.verification/paired-sim','.verification/primary-bridge/primary.mjs','build/yahtzeeOpt.js','build/independent/reference.js','independent/native-adapter/build/reference-verification.js'];

/** Memoize only complete native vectors already checked against actual TS.
 * Fresh npm test deletes this cache. Every incoming record is still hashed and
 * checked; no game, move, scorer case, random state or mutation is omitted. */
export function componentProofs(mode) {
 const fingerprint=digest(JSON.stringify(sources.map(file=>[file,digest(fs.readFileSync(file))])));
 const filename=`.verification/component-proofs-${mode}.json`;
 let proofs=new Map();
 if(fs.existsSync(filename)){
  const saved=JSON.parse(fs.readFileSync(filename,'utf8'));assert.equal(saved.sourceFingerprint,fingerprint,'Proof source/data/compiler output must be unchanged');
  proofs=new Map(saved.proofs);
 }
 let records=0,directRecords=0,reusedRecords=0,auditRecords=0,lastKey=-1;
 const streamDigest=crypto.createHash('sha256'),keysDigest=crypto.createHash('sha256');
 async function* unproven(stream) {
  let pending=Buffer.alloc(0);
  for await(const chunk of stream){
   streamDigest.update(chunk);pending=pending.length?Buffer.concat([pending,chunk]):chunk;
   let offset=0;
   while(offset+8572<=pending.length){
    const record=pending.subarray(offset,offset+8572),key=record.readUInt32LE(0),hash=digest(record);
    assert.ok(key>lastKey,'Native component records must be unique and sorted');lastKey=key;
    keysDigest.update(record.subarray(0,4));records++;
    const previous=proofs.get(key);
    if(previous!==undefined)assert.equal(previous,hash,'A reused component must exactly match every already TS-verified native value/policy byte');
    // Recheck the first component directly on every stream, including cached streams.
    if(previous===undefined||records===1){
     if(previous!==undefined)auditRecords++;
     yield record;proofs.set(key,hash);directRecords++;
    }else reusedRecords++;
    offset+=8572;
   }
   pending=Buffer.from(pending.subarray(offset));
  }
  assert.equal(pending.length,0,'Complete8572-byte observations required');
 }
 function finish(direct) {
  assert.equal(direct.records,directRecords);assert.equal(records,directRecords+reusedRecords);
  const encoded=JSON.stringify({version:1,sourceFingerprint:fingerprint,proofs:[...proofs]});assert.ok(encoded.length<=30000000,'Split proof cache if it grows beyond file limit');fs.writeFileSync(filename,encoded);
  return {...direct,records,directRecords,reusedRecords,auditRecords,distinctComponentProofs:proofs.size,sourceFingerprint:fingerprint,directStreamSha256:direct.streamSha256,directOrderedKeysSha256:direct.orderedComponentKeysSha256,streamSha256:streamDigest.digest('hex'),orderedComponentKeysSha256:keysDigest.digest('hex'),reuseRule:'Every8572-byte policy/value record exactly matches a SHA256 proof previously checked against both actual TS bodies during this npm test; first component is directly audited every stream.'};
 }
 return {unproven,finish};
}
