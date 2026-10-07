import assert from 'node:assert/strict';
import { readFileSync,writeFileSync } from 'node:fs';
const metadata=[];
for(const mode of ['official','published']){
  const buffer=readFileSync(`tables/${mode}.bin`);assert.equal(buffer.length,8*2**20);
  const values=Array.from({length:2**20},(_,index)=>buffer.readDoubleLE(index*8));
  assert.ok(Number.isFinite(values[0]));
  writeFileSync(`tables/${mode}.json`,JSON.stringify(values)+'\n');
  metadata.push({mode,expectedValue:values[0],finiteStates:values.filter(Number.isFinite).length,entries:2**20,binaryBytes:buffer.length});
}
writeFileSync('tables/METADATA.json',JSON.stringify({source:'Actual complete native dynamic programming; no imported answers',tables:metadata},null,2)+'\n');
console.log(JSON.stringify(metadata));
