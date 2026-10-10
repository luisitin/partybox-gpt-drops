import assert from 'node:assert/strict';
import {referenceStationary,referenceTransitions} from './build/reference.js';
let checks=0;
function check(value,label){assert.ok(value,label);checks++;}
for(const strategy of ['leave ASAP','stay max']) {
  const result=referenceStationary(strategy);
  check(result.transitionCounts.length===120,'120 canonical states');
  for(const row of result.transitionCounts) {
    check(row.length===120,'120 destinations');
    check(row.reduce((a,b)=>a+b,0)===9216,'exact row mass');
    check(row.every(x=>Number.isSafeInteger(x)&&x>=0),'integer nonnegative counts');
  }
  check(Math.abs(result.stateProbabilities.reduce((a,b)=>a+b,0)-1)<1e-14,'state mass');
  check(Math.abs(result.landing.reduce((a,b)=>a+b,0)-1)<1e-14,'roll mass');
  check(Math.abs(result.endTurnLanding.reduce((a,b)=>a+b,0)-1)<1e-14,'turn mass');
  check(result.landing[30]===0&&result.endTurnLanding[30]===0,'transient Go To Jail');
  for(let destination=0;destination<120;destination++){
    const arrival=result.stateProbabilities.reduce((sum,mass,source)=>sum+mass*result.transitionCounts[source][destination]/9216,0);
    check(Math.abs(arrival-result.stateProbabilities[destination])<1e-13,'stationary residual');
  }
  check(result.transitionCounts[2][117]>=1536,'all third doubles send to jail');
  if(strategy==='stay max'){
    check(result.transitionCounts[117][118]===7680,'first jail miss retained');
    check(result.transitionCounts[118][119]===7680,'second jail miss retained');
    check(result.transitionCounts[119][118]===0&&result.transitionCounts[119][119]===0,'third jail miss exits');
    for(const state of [117,118,119])for(let destination=0;destination<117;destination++)
      if(destination%3!==0)check(result.transitionCounts[state][destination]===0,'jail escape does not grant extra roll');
    check(result.transitionCounts[117][42]===256,'jail double 2+2 lands on Virginia, without extra roll');
  }else{
    check(JSON.stringify(result.transitionCounts[117])===JSON.stringify(result.transitionCounts[118]),'ASAP attempts equivalent');
    check(JSON.stringify(result.transitionCounts[118])===JSON.stringify(result.transitionCounts[119]),'ASAP attempts equivalent');
    check(result.transitionCounts[117][43]===256,'ASAP double 2+2 lands Virginia with extra roll');
    check(Math.abs(result.stateProbabilities[118])<1e-14&&Math.abs(result.stateProbabilities[119])<1e-14,'unreachable ASAP waiting states');
  }
  check(JSON.stringify(result)===JSON.stringify(referenceStationary(strategy)),'determinism');
}
assert.throws(()=>referenceTransitions('unknown'),RangeError);checks++;
console.log(JSON.stringify({checks,passed:checks,failed:0}));
