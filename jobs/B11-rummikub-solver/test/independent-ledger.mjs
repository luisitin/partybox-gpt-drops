import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {root,hash} from './helpers.mjs';

/** Reuse only the fresh reference results for this run's identical corpus. */
export function loadIndependentLedger(seed) {
  const ledger=JSON.parse(readFileSync(resolve(root,`.test-output/large-independent-seed-${seed}.json`),'utf8'));
  assert.equal(ledger.seed,seed);assert.equal(ledger.cases,208);assert.equal(ledger.passed,208);
  assert.equal(ledger.independentSourceSHA256,hash(readFileSync(resolve(root,'blindReference.ts'))));
  assert.equal(ledger.generatorSourceSHA256,hash(readFileSync(resolve(root,'test/helpers.mjs'))));
  assert.equal(ledger.entries.length,208);
  const byCase=new Map(ledger.entries.map(entry=>[`${entry.phase}:${entry.case}`,entry]));
  assert.equal(byCase.size,208);
  for(const [phase,count] of [['main',200],['warm',8]])for(let i=0;i<count;i++)assert.ok(byCase.has(`${phase}:${i}`));
  return (phase,index,position)=>{
    const entry=byCase.get(`${phase}:${index}`);assert.ok(entry);
    assert.equal(entry.inputSHA256,hash(JSON.stringify(position)),'Independent ledger input differs');
    assert.ok(entry.answer.ok);assert.ok(entry.answer.optimal);
    return entry.answer;
  };
}
