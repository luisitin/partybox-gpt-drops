import assert from 'node:assert/strict';
import fs from 'node:fs';
import {score,expectedValue,bestCategory,bestHold,valueOfHold} from './build/yahtzeeOpt.js';

let checks=0;
const check=(actual,expected)=>{assert.deepEqual(actual,expected);checks++;};
const close=(actual,expected)=>{assert.ok(Math.abs(actual-expected)<=1e-10,`${actual} != ${expected}`);checks++;};
const fails=(fn)=>{assert.throws(fn,RangeError);checks++;};
const full=8191,Y=2048;
function manual(dice,category) {
  const frequencies=Array.from({length:6},(_,f)=>dice.filter(x=>x===f+1).length);
  const sum=dice.reduce((a,b)=>a+b,0),sorted=[...new Set(dice)].sort((a,b)=>a-b);
  if(category<6)return frequencies[category]*(category+1);
  if(category===6||category===7)return frequencies.some(n=>n>=category-3)?sum:0;
  if(category===8)return frequencies.includes(2)&&frequencies.includes(3)?25:0;
  if(category===9||category===10){let run=0,maximum=0,last=-1;for(const n of sorted){run=n===last+1?run+1:1;maximum=Math.max(maximum,run);last=n;}return maximum>=(category===9?4:5)?(category===9?30:40):0;}
  if(category===11)return frequencies.includes(5)?50:0;
  return sum;
}
let orderedRolls=0,scoringCases=0;
for(let encoded=0;encoded<7776;encoded++) {
  let code=encoded;const dice=[];for(let i=0;i<5;i++){dice.push(code%6+1);code=Math.floor(code/6);}
  orderedRolls++;
  for(const mode of ['official','published'])for(let c=0;c<13;c++){
    const result=score(dice,c,{usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode});
    check(result.legal,true);check(result.points,manual(dice,c));check(result.yahtzeeBonus,0);check(result.upperBonus,0);scoringCases++;
  }
}
const reach=[];
for(let mask=0;mask<64;mask++) {
  const sums=new Set();
  const visit=(face,total)=>{if(face===7){sums.add(Math.min(63,total));return;}if(mask&(1<<(face-1)))for(let n=0;n<=5;n++)visit(face+1,total+n*face);else visit(face+1,total);};
  visit(1,0);reach.push(sums);
}
const stateCounts={};
for(const mode of ['official','published']) {
  let states=0;
  for(let mask=0;mask<=full;mask++)for(const upper of reach[mask&63])for(let bonus=0;bonus<=(mask&Y?1:0);bonus++) {
    const card={usedMask:mask,upper,yahtzeeBonus:Boolean(bonus),ruleMode:mode};
    const value=expectedValue(card);assert.ok(Number.isFinite(value)&&value>=0);checks++;
    if(mask===full)check(value,0);states++;
  }
  check(states,536448);stateCounts[mode]=states;
  const chance={usedMask:full^(1<<12),upper:63,yahtzeeBonus:false,ruleMode:mode};
  close(expectedValue(chance),70/3);
  check(bestHold([1,3,4,5,6],1,chance).hold,[4,5,6]);
  check(bestHold([1,3,4,5,6],2,chance).hold,[5,6]);
  check(bestHold([6,1,5,4,3],0,chance).hold,[1,3,4,5,6]);
  check(bestCategory([1,3,4,5,6],chance).category,12);
  for(let face=1;face<=6;face++)for(const bonus of [false,true]) {
    const card={usedMask:Y,upper:0,yahtzeeBonus:bonus,ruleMode:mode},dice=Array(5).fill(face);
    for(let c=0;c<13;c++) {
      const result=score(dice,c,card),legal=c!==11&&(mode==='published'||c===face-1);
      check(result.legal,legal);check(result.yahtzeeBonus,legal&&bonus?100:0);
      if(!legal)check(result.next,card);
    }
    const upperFilled={...card,usedMask:Y|(1<<(face-1))};
    for(const c of [8,9,10])check(score(dice,c,upperFilled).points,[25,30,40][c-8]);
  }
  check(score([6,6,6,6,6],5,{usedMask:31,upper:60,yahtzeeBonus:false,ruleMode:mode}).upperBonus,35);
  check(score([6,6,6,6,6],5,{usedMask:31,upper:63,yahtzeeBonus:false,ruleMode:mode}).upperBonus,0);
  check(score([6,6,6,6,6],8,{usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode}).points,0);
  check(score([1,1,1,1,1],0,{usedMask:full^1,upper:63,yahtzeeBonus:true,ruleMode:mode}).yahtzeeBonus,100);
  const frozenDice=Object.freeze([6,1,2,3,4]),frozenCard=Object.freeze({...chance});
  score(frozenDice,12,frozenCard);bestCategory(frozenDice,frozenCard);bestHold(frozenDice,1,frozenCard);checks+=3;
  fails(()=>bestCategory([1,2,3,4,5],{usedMask:full,upper:63,yahtzeeBonus:false,ruleMode:mode}));
  fails(()=>bestHold([1,2,3,4,5],1,{usedMask:full,upper:63,yahtzeeBonus:false,ruleMode:mode}));
}
let directHolds=0;
for(const mode of ['official','published'])for(let trial=0;trial<25;trial++){
  const dice=Array.from({length:5},(_,i)=>(trial+i*3)%6+1),hold=dice.filter((_,i)=>((trial>>i)&1)!==0);
  const card={usedMask:full^((1<<12)|(1<<8)),upper:63,yahtzeeBonus:false,ruleMode:mode};
  let total=0,outcomes=0;
  const visit=(rolled)=>{if(rolled.length===5-hold.length){const hand=[...hold,...rolled];let best=-Infinity;for(const c of [8,12]){const result=score(hand,c,card);best=Math.max(best,result.points+expectedValue(result.next));}total+=best;outcomes++;return;}for(let face=1;face<=6;face++)visit([...rolled,face]);};
  visit([]);close(valueOfHold(dice,hold,1,card),total/outcomes);directHolds++;
}
for(const dice of [[],[1,2,3,4],[1,2,3,4,7],[1,2,3,4,1.5],new Array(5)])fails(()=>score(dice,12));
for(const c of [-1,13,NaN,1.5])fails(()=>score([1,2,3,4,5],c));
for(const card of [null,{usedMask:0,upper:1,yahtzeeBonus:false},{usedMask:0,upper:0,yahtzeeBonus:true},{usedMask:8192,upper:0,yahtzeeBonus:false},{usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:'other'}])fails(()=>expectedValue(card));
for(const n of [-1,3,NaN,0.5])fails(()=>bestHold([1,2,3,4,5],n,{usedMask:0,upper:0,yahtzeeBonus:false}));
fails(()=>valueOfHold([1,2,3,4,5],[6],1,{usedMask:0,upper:0,yahtzeeBonus:false}));
fails(()=>valueOfHold([1,2,3,4,5],new Array(1),1,{usedMask:0,upper:0,yahtzeeBonus:false}));
const actual={official:expectedValue(),published:expectedValue({usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:'published'})};
check(actual.published.toFixed(4),'254.5896');check(actual.official.toFixed(4),'254.5877');
const report={passed:true,checks,orderedRolls,scoringCases,stateCounts,directHolds,actualComputedStartingValues:actual,implementationIsolation:'Executed before opening any independent B07 source, tests or tables.'};
fs.writeFileSync('CORE-SELFCHECK.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
