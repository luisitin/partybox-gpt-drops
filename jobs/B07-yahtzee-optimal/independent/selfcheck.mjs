import assert from 'node:assert/strict';
import fs from 'node:fs';
import {score,createReference} from './build/reference.js';
let assertions=0;
function eq(a,b){assert.deepEqual(a,b);assertions++;}
function near(a,b,tolerance=1e-10){assert.ok(Math.abs(a-b)<=tolerance,`${a} vs ${b}`);assertions++;}
function bad(fn){assert.throws(fn,RangeError);assertions++;}
const empty={usedMask:0,upper:0,yahtzeeBonus:false};
const tests=[
 [[1,1,1,2,2],[3,4,0,0,0,0,7,0,25,0,0,0,7]],
 [[2,3,4,5,6],[0,2,3,4,5,6,0,0,0,30,40,0,20]],
 [[3,3,3,3,3],[0,0,15,0,0,0,15,15,0,0,0,50,15]],
 [[1,2,3,4,4],[1,2,3,8,0,0,0,0,0,30,0,0,14]],
 [[1,2,3,5,6],[1,2,3,0,5,6,0,0,0,0,0,0,17]],
 [[6,6,6,6,1],[1,0,0,0,0,24,25,25,0,0,0,0,25]],
];
for(const [d,values] of tests)for(let c=0;c<13;c++){const s=score(Object.freeze(d),c,Object.freeze(empty));eq(s.points,values[c]);eq(s.legal,true);eq(s.yahtzeeBonus,0);eq(s.upperBonus,0);eq(s.next.usedMask,1<<c);eq(s.next.upper,c<6?values[c]:0);eq(s.next.ruleMode,'official');}
const force={usedMask:2048,upper:0,yahtzeeBonus:true};
for(let c=0;c<13;c++){const s=score([3,3,3,3,3],c,force);eq(s.legal,c===2);eq(s.points,c===2?15:0);eq(s.yahtzeeBonus,c===2?100:0);if(c!==2)eq(s.next,{...force,ruleMode:'official'});}
const joker={usedMask:2052,upper:0,yahtzeeBonus:true};
for(const [c,p] of [[6,15],[7,15],[8,25],[9,30],[10,40],[12,15]]){const s=score([3,3,3,3,3],c,joker);eq(s.legal,true);eq(s.points,p);eq(s.yahtzeeBonus,100);}
eq(score([3,3,3,3,3],0,joker).legal,false);
eq(score([3,3,3,3,3],10,{...joker,yahtzeeBonus:false}).points,40);
eq(score([3,3,3,3,3],10,{...joker,yahtzeeBonus:false}).yahtzeeBonus,0);
eq(score([3,3,3,3,3],10,{...force,ruleMode:'published'}).legal,true);
eq(score([3,3,3,3,3],10,{...force,ruleMode:'published'}).points,0);
eq(score([3,3,3,3,3],10,{...joker,ruleMode:'published'}).points,40);
const onlyUpper={usedMask:8190,upper:0,yahtzeeBonus:true};
eq(score([3,3,3,3,3],0,onlyUpper).points,0);eq(score([3,3,3,3,3],0,onlyUpper).yahtzeeBonus,100);
const bonus=score([6,6,6,1,1],5,{usedMask:31,upper:50,yahtzeeBonus:false});eq(bonus.points,18);eq(bonus.upperBonus,35);eq(bonus.next.upper,63);
eq(score([6,6,6,1,1],5,{usedMask:31,upper:63,yahtzeeBonus:false}).upperBonus,0);
for(const d of [null,[],[1,2,3,4],[0,1,2,3,4],[7,1,2,3,4],[1,2,3,4,1.5],new Array(5),[1,2,3,4,NaN]])bad(()=>score(d,0));
for(const c of [-1,13,0.5,'0',NaN,null])bad(()=>score([1,2,3,4,5],c));
for(const c of [null,[],{}, {...empty,usedMask:-1},{...empty,usedMask:8192},{...empty,upper:1},{...empty,upper:64},{...empty,upper:NaN},{...empty,yahtzeeBonus:true},{...empty,yahtzeeBonus:0},{...empty,ruleMode:null},{...empty,ruleMode:'bad'}])bad(()=>score([1,2,3,4,5],0,c));
const names=['official','published'];
const table={};
for(const mode of names){const bytes=fs.readFileSync(new URL(`./${mode}.bin`,import.meta.url));table[mode]=new Float64Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));}
const ref=createReference(table.official,table.published);
const chanceOnly={usedMask:4095,upper:0,yahtzeeBonus:false};
near(ref.expectedValue(chanceOnly),70/3);
near(ref.bestHold([1,2,3,4,6],1,chanceOnly).expectedValue,20.5);
eq(ref.bestHold([1,2,3,4,6],1,chanceOnly).hold,[4,6]);
eq(ref.bestHold([1,2,3,4,6],2,chanceOnly).hold,[6]);
eq(ref.bestCategory([1,2,3,4,6],chanceOnly).category,12);
near(ref.bestHold([1,2,3,4,6],0,chanceOnly).expectedValue,16);
eq(ref.bestHold([1,2,3,4,6],0,chanceOnly).hold,[1,2,3,4,6]);
const yahtzeeOnly={usedMask:6143,upper:0,yahtzeeBonus:false};
near(ref.bestHold([6,6,6,6,6],2,yahtzeeOnly).expectedValue,50);
eq(ref.bestHold([6,6,6,6,6],2,yahtzeeOnly).hold,[6,6,6,6,6]);
eq(ref.expectedValue({usedMask:8191,upper:0,yahtzeeBonus:false}),0);
bad(()=>ref.bestHold([1,2,3,4,5],0,{usedMask:8191,upper:0,yahtzeeBonus:false}));
bad(()=>ref.bestCategory([1,2,3,4,5],{usedMask:8191,upper:0,yahtzeeBonus:false}));
bad(()=>ref.bestHold([1,2,3,4,5],3,empty));
bad(()=>ref.bruteHoldValue([1,2,3,4,5],[6],1,empty));
let branchChecks=0;
for(const card of [chanceOnly,yahtzeeOnly,{usedMask:8187,upper:0,yahtzeeBonus:false},{...empty,ruleMode:'published'},empty]) {
 near(ref.recomputedExpectedValue(card),ref.expectedValue(card));
 for(const d of [[1,2,3,4,5],[1,1,2,2,3],[2,2,2,2,6],[6,6,6,6,6],[3,4,4,5,6]])for(const n of [1,2]){
   const selected=ref.bestHold(d,n,card);near(ref.bruteHoldValue(d,selected.hold,n,card),selected.expectedValue,2e-10);branchChecks++;
 }
}
for(const mode of names){
 let valid=0,finite=0;
 for(let m=0;m<8192;m++)for(let u=0;u<64;u++)for(let b=0;b<=1;b++){
  const card={usedMask:m,upper:u,yahtzeeBonus:!!b,ruleMode:mode};
  try{score([1,2,3,4,5],0,card);}catch(error){if(error instanceof RangeError)continue;throw error;}
  valid++;const v=ref.expectedValue(card);assert.ok(Number.isFinite(v)&&v>=0&&v<=1805);finite++;assertions++;
 }
 eq(valid,536448);eq(finite,536448);
}
const report={assertions,manualScoringCases:78,orderedChanceCrossChecks:branchChecks,allValidTableStatesPerMode:536448,modeResults:names.map(mode=>({mode,expectedValue:ref.expectedValue({...empty,ruleMode:mode}),recomputed:ref.recomputedExpectedValue({...empty,ruleMode:mode})})),allPassed:true};
fs.writeFileSync(new URL('./SELFCHECK.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
