import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';

/** Reject missing, partial, inconsistent, or failed seed ledgers. */
export function aggregate(reports,expectedHashes) {
  assert.equal(reports.length,3,'All three seed ledgers required');
  const hashes=['sourceSHA256','oracleSHA256','policyReferenceSHA256'];
  const benchmarks=[];
  for(const seed of [1,2,3]) {
    const matches=reports.filter(r=>r.seeds?.length===1&&r.seeds[0]===seed);
    assert.equal(matches.length,1,`Exactly one ledger for seed ${seed}`);
    const r=matches[0];
    assert.equal(r.passed,true);assert.deepEqual(r.failures,[]);
    assert.ok(r.command.includes(`--seed=${seed}`));
    assert.ok(r.integrityFiles>=30);
    for(const key of hashes) {
      assert.match(r[key],/^[a-f0-9]{64}$/);
      assert.equal(r[key],reports[0][key],`Different ${key}`);
      if(expectedHashes)assert.equal(r[key],expectedHashes[key],`Current checkout ${key}`);
    }
    assert.equal(r.staticChecks.length,1);
    assert.equal(r.staticChecks[0].seed,seed);
    assert.equal(r.staticChecks[0].cases,6);assert.equal(r.staticChecks[0].passed,6);
    assert.ok(r.units.length>=29);
    assert.equal(new Set(r.units.map(x=>x.name)).size,r.units.length);
    for(const unit of r.units){assert.equal(unit.seed,seed);assert.ok(unit.cases>0);assert.equal(unit.passed,unit.cases);}
    for(const [name,cases] of [['differential',10000],['sampleAudits',200],['mutations',25]]) {
      assert.equal(r[name].length,1);
      const suite=r[name][0];assert.equal(suite.seed,seed);assert.equal(suite.cases,cases);assert.equal(suite.passed,cases);
    }
    assert.equal(r.differential[0].policyChecks,30000);
    assert.equal(r.mutations[0].results.length,25);
    assert.deepEqual(r.mutations[0].results.map(x=>x.id).sort(),Array.from({length:25},(_,i)=>`M${String(i+1).padStart(2,'0')}`));
    for(const mutant of r.mutations[0].results){assert.equal(mutant.killed,true);assert.equal(typeof mutant.killedBy,'string');assert.ok(mutant.killedBy.length>0);}
    assert.equal(r.ledgerChecks.length,1);
    assert.equal(r.ledgerChecks[0].seed,seed);assert.ok(r.ledgerChecks[0].cases>=16);assert.equal(r.ledgerChecks[0].passed,r.ledgerChecks[0].cases);
    assert.equal(r.benchmarks.length,3);
    for(const difficulty of ['easy','medium','hard']) {
      const cells=r.benchmarks.filter(b=>b.seed===seed&&b.difficulty===difficulty);
      assert.equal(cells.length,1,`Missing ${difficulty} seed ${seed}`);
      const b=cells[0];
      assert.equal(b.games,100000);assert.equal(b.samples,8);
      assert.equal(b.feedback,'named hits; named exact sunk hulls');
      assert.equal(b.repeatedShots,0);assert.equal(b.errors,0);
      assert.equal(b.policyComparisons,b.shots);
      assert.equal(b.densityComparisons,difficulty==='hard'?b.shots:0);
      assert.equal(b.allShotsUnder50ms,true);assert.equal(b.latency.over50,0);assert.deepEqual(b.slowCases,[]);
      for(const key of ['p50','p99','max'])assert.ok(Number.isFinite(b.latency[key])&&b.latency[key]>=0&&b.latency[key]<=50);
      assert.ok(b.latency.p50<=b.latency.p99);
      assert.ok(Number.isFinite(b.maxAuditDifference)&&b.maxAuditDifference<=1e-10);
      assert.equal(b.histogram.length,101);
      let count=0,shots=0;
      for(let turn=0;turn<=100;turn++){assert.ok(Number.isSafeInteger(b.histogram[turn])&&b.histogram[turn]>=0);count+=b.histogram[turn];shots+=turn*b.histogram[turn];}
      assert.equal(count,100000);assert.equal(shots,b.shots);assert.equal(b.mean,shots/count);
      if(difficulty==='hard'){assert.equal(b.hardUnder45,true);assert.ok(b.mean<45);assert.equal(b.sampledShots+b.exactShots,b.shots);}
      benchmarks.push(b);
    }
  }
  return {complete:true,passed:true,seeds:[1,2,3],games:900000,exactStates:30000,sampleAudits:600,mutationKills:75,
    sourceHashes:Object.fromEntries(hashes.map(key=>[key,reports[0][key]])),benchmarks,seedLedgers:reports};
}
if(process.argv[1]?.endsWith('ci-aggregate.mjs')) {
  const path=process.argv[2]??'reports/ci-seeds';
  const reports=[1,2,3].map(seed=>JSON.parse(readFileSync(`${path}/B10-seed-${seed}/latest.json`,'utf8')));
  const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
  const result=aggregate(reports,{sourceSHA256:hash('battleshipAI.ts'),oracleSHA256:hash('blindOracle.ts'),policyReferenceSHA256:hash('blindPolicy.ts')});
  mkdirSync('reports',{recursive:true});writeFileSync('reports/ci-aggregate.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({complete:result.complete,passed:result.passed,seeds:result.seeds,games:result.games,exactStates:result.exactStates,mutationKills:result.mutationKills}));
}
