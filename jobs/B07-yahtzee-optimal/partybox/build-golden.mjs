// Golden decisions for the PartyBox port: the sealed primary module's exact answers on 500 seeded
// mid-game states plus every extra-Yahtzee/Joker shape, so a reformatted copy can prove it is
// still the same solver (partybox/__tests__/optimal.test.ts compares them bit for bit).
// Usage: node partybox/build-golden.mjs [outFile]   (default: partybox/__tests__/optimal-golden.json)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const job=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reachable=Array.from({length:64},(_,mask)=>{
  let set=new Set([0]);
  for(let face=1;face<=6;face++)if(mask&(1<<(face-1))){const next=new Set();for(const u of set)for(let n=0;n<=5;n++)next.add(Math.min(63,u+face*n));set=next;}
  return [...set].sort((a,b)=>a-b);
});
function seeded(seed){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}

/** States: 500 seeded mid-game positions, then five alike on every Joker-relevant card shape. */
export function goldenStates() {
  const random=seeded(7),states=[];
  for(let i=0;i<500;i++){
    const usedMask=Math.floor(random()*8191),uppers=reachable[usedMask&63];
    const upper=uppers[Math.floor(random()*uppers.length)];
    const yahtzeeBonus=Boolean(usedMask&2048)&&random()<0.5;
    const dice=Array.from({length:5},()=>Math.floor(random()*6)+1);
    states.push({ruleMode:i%2?'official':'published',usedMask,upper,yahtzeeBonus,dice,rollsLeft:i%3});
  }
  for(const ruleMode of ['official','published'])for(const face of [1,4,6])for(const yahtzeeBonus of [false,true])
    for(const [label,extra] of [['matching open',0],['matching filled',1<<(face-1)],['lower full',(1<<(face-1))|0x17c0],['only upper left',0x1fc0]]){
      const usedMask=2048|extra,upper=reachable[usedMask&63].includes(30)?30:0;
      states.push({ruleMode,usedMask,upper,yahtzeeBonus,dice:Array(5).fill(face),rollsLeft:label==='lower full'?1:0});
    }
  return states;
}
export function goldenOf(api) {
  const cases=goldenStates().map(state=>{
    const card={usedMask:state.usedMask,upper:state.upper,yahtzeeBonus:state.yahtzeeBonus,ruleMode:state.ruleMode};
    const hold=api.bestHold(state.dice,state.rollsLeft,card),category=api.bestCategory(state.dice,card);
    return {...state,stateValue:api.expectedValue(card),hold:hold.hold,holdValue:hold.expectedValue,category:category.category,categoryValue:category.expectedValue};
  });
  return {source:'B07 build/yahtzeeOpt.js (sealed primary core); regenerate with node partybox/build-golden.mjs',
    start:{official:api.expectedValue(),published:api.expectedValue({usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:'published'})},cases};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const api=await import(path.join(job,'build/yahtzeeOpt.js'));
  const out=path.resolve(process.argv[2]??path.join(job,'partybox/__tests__/optimal-golden.json'));
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(goldenOf(api))+'\n');
  console.log(JSON.stringify({out:path.relative(job,out),cases:goldenOf(api).cases.length}));
}
