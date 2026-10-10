import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import * as original from './build/reference.js';
import * as amended from './probe-build/amended-reference.js';
const routes=[{id:'r',a:'A',b:'B',length:1,color:'gray'}];
const ticket={id:'t',a:'A',b:'B',points:1};
const bad=new Array(1);
const before=original.longestTrail(routes,bad);
assert.equal(before,0,'Original false-valid sparse owned IDs replay');
assert.throws(()=>amended.longestTrail(routes,bad),RangeError);
assert.throws(()=>amended.ticketComplete(routes,bad,ticket),RangeError);
assert.equal(amended.longestTrail(routes,['r']),1);
assert.equal(amended.ticketComplete(routes,['r'],ticket),true);
const report={passed:true,originalLongestResult:before,amendedLongestError:'RangeError',amendedTicketError:'RangeError',
  input:{routes,ownedIds:'new Array(1) (one sparse hole, not an actual undefined-filled array)',ticket},
  publicRequirement:'Every owned ID must be a known distinct route ID; malformed ownedIds throws RangeError'};
writeFileSync('SPARSE-REPLAY.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
