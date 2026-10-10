import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {execFileSync} from 'node:child_process';
import {blind} from './blind-adapter.mjs';
import {validateTable,validatePlay} from '../dist/rummikub.js';
import {createMilpReference} from './milp-reference.mjs';
import {seedArg,rng,smallPosition,freeze,receipt,hash} from './helpers.mjs';

const versions=JSON.parse(execFileSync('python3',['-c',
  'import sys,json,numpy,scipy; print(json.dumps({"python":".".join(map(str,sys.version_info[:3])),"numpy":numpy.__version__,"scipy":scipy.__version__}))'],
  {encoding:'utf8',env:{...process.env,OPENBLAS_NUM_THREADS:'1',OMP_NUM_THREADS:'1'}}));
assert.deepEqual(versions,{python:'3.12.14',numpy:'2.3.5',scipy:'1.17.0'});
const seed=seedArg(),random=rng(0xC1100000+seed),oracle=createMilpReference();
const cases=1000,families=Array(10).fill(0),jokers=[0,0,0],tileCounts=Array(15).fill(0);
let passed=0,openings=0,inventoryBoundClosed=0,corpus='';
const certificates=[],started=performance.now();
try {
  for(let i=0;i<cases;i++) {
    const position=freeze(smallPosition(random,i));
    const resources=[...position.hand,...position.table.flatMap(m=>m.tiles)];
    assert.ok(resources.length<=14);
    families[i%10]++;tileCounts[resources.length]++;
    jokers[resources.filter(t=>t.kind==='joker').length]++;
    if(!position.initialMeldDone)openings++;
    const literal=blind.findBestPlay(position);assert.ok(literal.ok);
    const row=await oracle.solve(position),answer=row.result;
    assert.equal(answer.value,literal.value,`seed=${seed} case=${i}`);
    assert.equal(answer.played.length,literal.played.length,`seed=${seed} case=${i}`);
    assert.ok(blind.validateTable(literal.table).ok);
    assert.ok(validateTable(literal.table).ok);
    if(literal.action==='play') {
      assert.ok(blind.validatePlay(position,literal.table).ok);
      assert.ok(validatePlay(position,literal.table).ok);
    }
    else assert.deepEqual(literal.table,position.table);
    if(row.certificate.inventoryBoundClosed)inventoryBoundClosed++;
    const inputSHA256=hash(JSON.stringify(position));
    corpus+=`${inputSHA256}:${answer.value}:${answer.played.length}\n`;
    certificates.push({case:i,inputSHA256,value:answer.value,playedCount:answer.played.length,
      certificate:row.certificate,elapsedMs:row.elapsedMs});passed++;
    if(passed%100===0)console.log(`MILP/literal seed=${seed} ${passed}/${cases}`);
  }
  await oracle.close();
}catch(error){oracle.abort();throw error;}
const result={suite:'independent-MILP-versus-literal-subsets',seed,cases,passed,
  command:`SEED=${seed} node test/milp-crosscheck.mjs`,versions,families,jokerHistogram:jokers,tileCounts,
  openings,inventoryBoundClosed,semanticDiffSHA256:hash(corpus),elapsedMs:performance.now()-started,certificates};
receipt(`milp-crosscheck-seed-${seed}`,result);
console.log(JSON.stringify({...result,certificates:undefined}));
