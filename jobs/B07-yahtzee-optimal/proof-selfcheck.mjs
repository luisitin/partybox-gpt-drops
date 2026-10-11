import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {Readable} from 'node:stream';
import {componentProofs} from './component-proofs.mjs';
import {createPrimaryBridge} from './primary-bridge.mjs';

// Synthetic transport/cache mechanics only; actual TS semantics are checked
// by consumeObservations during the six full paired simulation suites.
const filename='.verification/component-proofs-cache-selfcheck.json';fs.rmSync(filename,{force:true});
await createPrimaryBridge();
const record=key=>{const b=Buffer.alloc(8572);b.writeUInt32LE(key);return b;};
const original=Buffer.concat([record(0),record(1)]),digest=data=>crypto.createHash('sha256').update(data).digest('hex');
let assertions=0;
async function consume(bytes){const cache=componentProofs('cache-selfcheck');let direct=0;for await(const ignored of cache.unproven(Readable.from([bytes]))){assert.equal(ignored.length,8572);direct++;}return cache.finish({records:direct,streamSha256:'synthetic',orderedComponentKeysSha256:'synthetic',allPassed:true});}
const first=await consume(original);assert.equal(first.records,2);assert.equal(first.directRecords,2);assert.equal(first.reusedRecords,0);assert.equal(first.streamSha256,digest(original));assertions+=4;
const repeated=await consume(original);assert.equal(repeated.records,2);assert.equal(repeated.directRecords,1);assert.equal(repeated.auditRecords,1);assert.equal(repeated.reusedRecords,1);assert.equal(repeated.streamSha256,first.streamSha256);assertions+=5;
const corrupt=Buffer.from(original);corrupt[8572+200]=1;
await assert.rejects(consume(corrupt));assertions++;
await assert.rejects(consume(Buffer.concat([record(0),record(0)])));assertions++;
await assert.rejects(consume(original.subarray(0,original.length-1)));assertions++;
const saved=fs.readFileSync(filename,'utf8'),wrong=JSON.parse(saved);wrong.sourceFingerprint='wrong';fs.writeFileSync(filename,JSON.stringify(wrong));assert.throws(()=>componentProofs('cache-selfcheck'));assertions++;
fs.writeFileSync(filename,saved);const fresh=Buffer.concat([record(0),record(1),record(2)]),newRecord=await consume(fresh);assert.equal(newRecord.directRecords,2);assert.equal(newRecord.reusedRecords,1);assert.equal(newRecord.records,3);assertions+=3;
fs.rmSync(filename,{force:true});
const report={passed:true,assertions,syntheticProtocolOnly:true,description:'Fresh/direct/audit/reused/new record counts, exact-byte corruption, duplicate/order/partial rejection and source fingerprint mismatch. No semantic strategy success is claimed by synthetic vectors.'};
fs.writeFileSync('reports/proof-cache-selfcheck.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
