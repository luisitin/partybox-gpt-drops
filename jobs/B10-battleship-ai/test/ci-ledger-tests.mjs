import assert from 'node:assert/strict';
import {aggregate} from './ci-aggregate.mjs';

// Synthetic ledger records test aggregation only, never gameplay counts.
function fixture() {
  return [1,2,3].map(seed=>({seeds:[seed],passed:true,failures:[],command:`node test/run.mjs --seed=${seed}`,integrityFiles:40,
    sourceSHA256:'1'.repeat(64),oracleSHA256:'2'.repeat(64),policyReferenceSHA256:'3'.repeat(64),
    staticChecks:[{seed,cases:6,passed:6}],units:Array.from({length:29},(_,i)=>({name:`fixture ${i}`,seed,cases:1,passed:1})),
    differential:[{seed,cases:10000,passed:10000,policyChecks:30000}],sampleAudits:[{seed,cases:200,passed:200}],
    mutations:[{seed,cases:25,passed:25,results:Array.from({length:25},(_,i)=>({id:`M${String(i+1).padStart(2,'0')}`,killed:true,killedBy:'fixture assertion'}))}],
    ledgerChecks:[{seed,cases:16,passed:16}],benchmarks:['easy','medium','hard'].map(difficulty=>{
      const turns=difficulty==='hard'?44:50,histogram=Array(101).fill(0);histogram[turns]=100000;
      return {seed,difficulty,games:100000,samples:8,feedback:'named hits; named exact sunk hulls',repeatedShots:0,errors:0,
        shots:turns*100000,policyComparisons:turns*100000,densityComparisons:difficulty==='hard'?turns*100000:0,
        allShotsUnder50ms:true,latency:{p50:1,p99:2,max:3,over50:0},slowCases:[],maxAuditDifference:0,histogram,mean:turns,
        hardUnder45:difficulty==='hard'?true:null,sampledShots:0,exactShots:difficulty==='hard'?turns*100000:0};
    })}));
}
export function runLedgerTests(seed) {
  const edits=[
    r=>r.pop(),r=>r.push(structuredClone(r[0])),r=>r[1].seeds=[1],r=>r[0].benchmarks.pop(),
    r=>r[0].benchmarks[0].games=99999,r=>r[0].differential[0].cases=9999,r=>r[0].differential[0].policyChecks--,
    r=>r[0].sampleAudits[0].passed--,r=>r[0].mutations[0].results[0].killed=false,r=>r[0].mutations[0].results[0].killedBy=null,
    r=>r[0].units[0].passed=0,r=>r[1].sourceSHA256='4'.repeat(64),r=>r[0].benchmarks[0].policyComparisons--,
    r=>r[0].benchmarks[2].densityComparisons--,r=>r[0].benchmarks[0].latency.max=50.001,
    r=>r[0].benchmarks[0].slowCases=[{milliseconds:51}],r=>r[0].benchmarks[2].mean=45,
    r=>r[0].benchmarks[0].histogram[50]--,r=>r[0].benchmarks[2].maxAuditDifference=1e-9,
    r=>r[0].passed=false,r=>r[0].failures=['failure'],r=>r[0].staticChecks[0].passed--,
    r=>r[0].ledgerChecks[0].passed--,r=>r[0].benchmarks[0].repeatedShots=1,r=>r[0].benchmarks[0].errors=1,
  ];
  assert.equal(aggregate(fixture()).games,900000);
  for(const edit of edits){const reports=fixture();edit(reports);assert.throws(()=>aggregate(reports));}
  assert.throws(()=>aggregate(fixture(),{sourceSHA256:'5'.repeat(64)}));
  return {name:'CI complete-ledger validation (synthetic metadata only)',seed,cases:edits.length+2,passed:edits.length+2};
}
