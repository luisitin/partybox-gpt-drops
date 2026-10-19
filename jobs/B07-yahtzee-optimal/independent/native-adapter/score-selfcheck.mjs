import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {score} from './build/reference-verification.js';
const full=[];function walk(d,start){if(d.length===5){full.push(d);return;}for(let f=start;f<=6;f++)walk([...d,f],f);}walk([],1);
let pending=Buffer.alloc(0),cases=0;
const hash=crypto.createHash('sha256');
for await(const chunk of process.stdin){
 hash.update(chunk);pending=pending.length?Buffer.concat([pending,chunk]):chunk;
 let offset=0;
 while(offset+36<=pending.length){
  const b=pending.subarray(offset,offset+36),key=b.readUInt32LE(0),r=b.readUInt16LE(4),c=b[6];
  const card={usedMask:key%8192,upper:Math.floor(key/8192)%64,yahtzeeBonus:!!(key&524288),ruleMode:key&1048576?'published':'official'};
  const s=score(full[r],c,card),fields=[s.points,s.yahtzeeBonus,s.upperBonus,s.next.usedMask,s.next.upper,+s.next.yahtzeeBonus,+(s.next.ruleMode==='published')];
  assert.equal(!!b[7],s.legal);for(let i=0;i<7;i++)assert.equal(b.readInt32LE(8+i*4),fields[i],`${key}:${r}:${c}:field${i}`);
  cases++;offset+=36;
 }
 pending=Buffer.from(pending.subarray(offset));
}
assert.equal(pending.length,0);assert.equal(cases,20*252*13);
const report={cases,fieldComparisons:cases*8,cardProfiles:20,all252DistinctRollsAnd13Categories:true,allPassed:true,streamSha256:hash.digest('hex')};
fs.writeFileSync(new URL('./SCORE-SELFCHECK.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
