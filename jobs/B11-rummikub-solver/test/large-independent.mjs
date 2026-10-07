import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {performance} from 'node:perf_hooks';
import {validatePosition,validateTable,validatePlay} from '../dist/rummikub.js';
import {referenceBestPlay,referenceValidatePosition,referenceValidateTable,referenceValidatePlay} from './blind-adapter.mjs';
import {root,rng,largePosition,freeze,receipt,seedArg,hash} from './helpers.mjs';

const seed=seedArg(),entries=[],start=performance.now();
for(const [phase,count,random] of [['main',200,rng(seed)],['warm',8,rng(0xB1100000+seed)]]) {
  for(let i=0;i<count;i++) {
    const p=freeze(largePosition(random,i));
    assert.equal(p.table.flatMap(m=>m.tiles).length,40);assert.equal(p.hand.length,20);
    assert.ok(validatePosition(p).ok);assert.ok(referenceValidatePosition(p));
    // The reference receives only the public position; no primary solver answer.
    const answer=referenceBestPlay(p);assert.ok(answer.ok);assert.ok(answer.optimal);
    assert.ok(validateTable(answer.table).ok);assert.ok(referenceValidateTable(answer.table));
    if(answer.action==='play'){assert.ok(validatePlay(p,answer.table).ok);assert.ok(referenceValidatePlay(p,answer.table));}
    else assert.deepEqual(answer.table,p.table);
    entries.push({phase,case:i,inputSHA256:hash(JSON.stringify(p)),answer});
    if((i+1)%25===0)console.log(`independent large seed=${seed} ${phase} ${i+1}/${count}`);
  }
}
const result={suite:'blind-independent-large-optima',seed,cases:208,passed:208,
  command:`SEED=${seed} node test/large-independent.mjs`,mainCases:200,warmupCases:8,
  independentSourceSHA256:hash(readFileSync(resolve(root,'blindReference.ts'))),
  generatorSourceSHA256:hash(readFileSync(resolve(root,'test/helpers.mjs'))),elapsedMs:performance.now()-start,entries};
receipt(`large-independent-seed-${seed}`,result);
console.log(JSON.stringify({...result,entries:undefined}));
