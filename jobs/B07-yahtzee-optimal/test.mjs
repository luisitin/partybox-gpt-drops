import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createReference} from './build/independent/reference.js';

export function loadBinary(filename) {
  const data=fs.readFileSync(filename);
  assert.equal(data.length,8388608);
  return new Float64Array(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength));
}
export function independentReference() {
  return createReference(loadBinary('independent/official.bin'),loadBinary('independent/published.bin'));
}
export const reachable=Array.from({length:64},(_,mask)=>{
  let set=new Set([0]);
  for(let face=1;face<=6;face++)if(mask&(1<<(face-1))){const next=new Set();for(const u of set)for(let n=0;n<=5;n++)next.add(Math.min(63,u+face*n));set=next;}
  return [...set].sort((a,b)=>a-b);
});
function lex(a,b){for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;}
export function seeded(seed){let value=seed>>>0;return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};}

export function boundaryChecks(api,reference) {
  let assertions=0;
  const eq=(a,b,label)=>{assert.deepEqual(a,b,label);assertions++;};
  const close=(a,b)=>{assert.ok(Math.abs(a-b)<=1e-10,`${a} != ${b}`);assertions++;};
  const fail=fn=>{assert.throws(fn,RangeError);assertions++;};
  const empty={usedMask:0,upper:0,yahtzeeBonus:false};
  const goldens=[
    [[1,1,1,2,2],[3,4,0,0,0,0,7,0,25,0,0,0,7]],
    [[2,3,4,5,6],[0,2,3,4,5,6,0,0,0,30,40,0,20]],
    [[3,3,3,3,3],[0,0,15,0,0,0,15,15,0,0,0,50,15]],
    [[1,2,3,4,4],[1,2,3,8,0,0,0,0,0,30,0,0,14]],
    [[1,2,3,5,6],[1,2,3,0,5,6,0,0,0,0,0,0,17]],
    [[6,6,6,6,1],[1,0,0,0,0,24,25,25,0,0,0,0,25]],
  ];
  for(const mode of ['official','published']) {
    for(const [dice,values] of goldens)for(let c=0;c<13;c++) {
      const card={...empty,ruleMode:mode},actual=api.score(Object.freeze([...dice]),c,Object.freeze(card));
      eq(actual,reference.score(dice,c,card),'Manual scoring and transition');eq(actual.points,values[c]);
    }
    for(const [dice] of goldens){const card={...empty,ruleMode:mode},a=api.bestCategory(dice,card),b=reference.bestCategory(dice,card);close(a.expectedValue,b.expectedValue);}
    for(let face=1;face<=6;face++)for(const y of [false,true])for(const matchingFilled of [false,true]) {
      const card={usedMask:2048|(matchingFilled?1<<(face-1):0),upper:0,yahtzeeBonus:y,ruleMode:mode};
      for(let c=0;c<13;c++)eq(api.score(Array(5).fill(face),c,card),reference.score(Array(5).fill(face),c,card),'Extra Yahtzee/Joker legal choices');
    }
    for(const [dice,c,card] of [
      [[6,6,6,1,1],5,{usedMask:31,upper:50,yahtzeeBonus:false}],
      [[6,6,6,1,1],5,{usedMask:31,upper:63,yahtzeeBonus:false}],
      [[3,3,3,3,3],0,{usedMask:8190,upper:0,yahtzeeBonus:true}],
      [[3,3,3,3,3],0,{usedMask:8190,upper:0,yahtzeeBonus:false}],
    ])eq(api.score(dice,c,{...card,ruleMode:mode}),reference.score(dice,c,{...card,ruleMode:mode}));
    const chance={usedMask:4095,upper:0,yahtzeeBonus:false,ruleMode:mode};
    close(api.expectedValue(chance),70/3);
    eq(api.bestCategory([1,2,3,4,6],chance).category,12);
    eq(api.bestHold([1,2,3,4,6],1,chance).hold,[4,6]);
    close(api.bestHold([1,2,3,4,6],1,chance).expectedValue,20.5);
    eq(api.bestHold([1,2,3,4,6],2,chance).hold,[6]);
    eq(api.bestHold([6,1,4,3,2],0,chance).hold,[1,2,3,4,6]);
    const yOnly={usedMask:6143,upper:0,yahtzeeBonus:false,ruleMode:mode};
    eq(api.bestHold([6,6,6,6,6],2,yOnly).hold,[6,6,6,6,6]);
    close(api.bestHold([6,6,6,6,6],2,yOnly).expectedValue,50);
    const straightOnly={usedMask:8191^512,upper:63,yahtzeeBonus:false,ruleMode:mode};
    eq(api.bestHold([1,2,3,4,4],1,straightOnly).hold,[1,2,3,4]);
    eq(api.bestHold([1,2,3,4,4],2,straightOnly).hold,[1,2,3,4]);
    const full={usedMask:8191,upper:0,yahtzeeBonus:false,ruleMode:mode};
    eq(api.expectedValue(full),0);fail(()=>api.bestCategory([1,2,3,4,5],full));fail(()=>api.bestHold([1,2,3,4,5],0,full));
    const frozenDice=Object.freeze([6,1,2,3,4]),frozenCard=Object.freeze({...chance});
    const before=JSON.stringify([frozenDice,frozenCard]);
    api.score(frozenDice,12,frozenCard);api.bestCategory(frozenDice,frozenCard);api.bestHold(frozenDice,1,frozenCard);eq(JSON.stringify([frozenDice,frozenCard]),before);
  }
  for(const dice of [null,[],[1,2,3,4],[0,1,2,3,4],[7,1,2,3,4],[1,2,3,4,1.5],new Array(5),[1,2,3,4,NaN]])fail(()=>api.score(dice,0));
  for(const c of [-1,13,0.5,'0',NaN,null])fail(()=>api.score([1,2,3,4,5],c));
  for(const card of [null,[],{}, {...empty,usedMask:-1},{...empty,usedMask:8192},{...empty,upper:1},{...empty,upper:64},{...empty,upper:NaN},{...empty,yahtzeeBonus:true},{...empty,yahtzeeBonus:0},{...empty,ruleMode:null},{...empty,ruleMode:'bad'}]){
    fail(()=>api.score([1,2,3,4,5],0,card));fail(()=>api.expectedValue(card));fail(()=>api.bestCategory([1,2,3,4,5],card));fail(()=>api.bestHold([1,2,3,4,5],1,card));
  }
  for(const n of [-1,3,0.5,NaN,null])fail(()=>api.bestHold([1,2,3,4,5],n,empty));
  fail(()=>api.valueOfHold([1,2,3,4,5],[6],1,empty));fail(()=>api.valueOfHold([1,2,3,4,5],new Array(1),1,empty));
  close(api.expectedValue(),reference.expectedValue());
  eq(api.expectedValue({...empty,ruleMode:'published'}).toFixed(4),'254.5896');
  eq(api.expectedValue().toFixed(4),'254.5877');
  return {passed:true,assertions};
}

export function completeTableComparison(api,reference) {
  const result={passed:true,tolerance:1e-10,modes:[]};
  for(const mode of ['official','published']) {
    const data=loadBinary(`tables/${mode}.bin`),other=loadBinary(`independent/${mode}.bin`);
    let count=0,maximumDifference=0,worstIndex=-1;
    for(let index=0;index<data.length;index++){
      if(Number.isFinite(data[index])||Number.isFinite(other[index])){
        assert.ok(Number.isFinite(data[index])&&Number.isFinite(other[index]),`Reachability mismatch ${mode}:${index}`);
        const difference=Math.abs(data[index]-other[index]);assert.ok(difference<=1e-10,`Full table disagreement ${mode}:${index}`);
        if(difference>maximumDifference){maximumDifference=difference;worstIndex=index;}count++;
      }
    }
    assert.equal(count,536448);
    const card={usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode};
    assert.equal(api.expectedValue(card),data[0]);assert.equal(reference.expectedValue(card),other[0]);
    result.modes.push({mode,statesCompared:count,maximumDifference,worstIndex,primaryStartingValue:data[0],independentStartingValue:other[0]});
  }
  return result;
}

export function scoringExhaustion(api,reference,seed) {
  let cases=0;
  for(let code=0;code<7776;code++) {
    let number=code;const dice=[];for(let i=0;i<5;i++){dice.push(number%6+1);number=Math.floor(number/6);}
    for(const mode of ['official','published'])for(let category=0;category<13;category++) {
      const card={usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:mode};
      assert.deepEqual(api.score(dice,category,card),reference.score(dice,category,card),`Scoring ${seed}:${mode}:${code}:${category}`);cases++;
    }
  }
  return {passed:true,seed,orderedRolls:7776,categories:13,modes:2,scoringCases:cases};
}

export function randomStateComparison(api,reference,seed,count=50000) {
  const random=seeded(seed);let holdAlternates=0,categoryAlternates=0,orderedHoldChecks=0,maximumValueDifference=0,maximumHoldResidual=0;
  const seen=new Set(),modes={official:0,published:0},rollLayers=[0,0,0];
  for(let trial=0;trial<count;trial++) {
    let mask=Math.floor(random()*8191);
    const uppers=reachable[mask&63],upper=uppers[Math.floor(random()*uppers.length)];
    const card={usedMask:mask,upper,yahtzeeBonus:Boolean(mask&2048)&&random()<0.5,ruleMode:trial%2?'official':'published'};
    const dice=Array.from({length:5},()=>Math.floor(random()*6)+1),rollsLeft=trial%3;
    modes[card.ruleMode]++;rollLayers[rollsLeft]++;seen.add(`${card.ruleMode}:${mask}:${upper}:${card.yahtzeeBonus}`);
    const before=JSON.stringify([card,dice]);
    const value=api.expectedValue(card),expected=reference.expectedValue(card),difference=Math.abs(value-expected);
    assert.ok(difference<=1e-10,`State ${seed}:${trial}: ${JSON.stringify(card)}`);maximumValueDifference=Math.max(maximumValueDifference,difference);
    const a=api.bestCategory(dice,card),b=reference.bestCategory(dice,card);
    assert.deepEqual(api.score(dice,a.category,card),reference.score(dice,a.category,card));
    assert.equal(a.legal,true);
    const categoryValue=a.points+a.yahtzeeBonus+a.upperBonus+reference.expectedValue(a.next);
    assert.ok(Math.abs(categoryValue-b.expectedValue)<=1e-10,`Category objective ${seed}:${trial}`);
    assert.ok(Math.abs(a.expectedValue-b.expectedValue)<=1e-10);
    if(a.category!==b.category)categoryAlternates++;
    const chosen=api.bestHold(dice,rollsLeft,card),optimum=reference.bestHold(dice,rollsLeft,card);
    const holdDifference=Math.abs(chosen.expectedValue-optimum.expectedValue);
    assert.ok(holdDifference<=1e-10,`Hold objective ${seed}:${trial} ${JSON.stringify({card,dice,rollsLeft,chosen,optimum})}`);
    maximumValueDifference=Math.max(maximumValueDifference,holdDifference);
    assert.deepEqual(chosen.hold,[...chosen.hold].sort((x,y)=>x-y));
    const remaining=[...dice];for(const face of chosen.hold){const found=remaining.indexOf(face);assert.ok(found>=0);remaining.splice(found,1);}
    if(rollsLeft===0)assert.deepEqual(chosen.hold,[...dice].sort((x,y)=>x-y));
    else {
      const direct=reference.bruteHoldValue(dice,chosen.hold,rollsLeft,card),residual=Math.abs(direct-optimum.expectedValue);
      assert.ok(residual<=1e-10,`Ordered-roll hold replay ${seed}:${trial}: ${residual}`);maximumHoldResidual=Math.max(maximumHoldResidual,residual);orderedHoldChecks++;
      assert.ok(Math.abs(api.valueOfHold(dice,chosen.hold,rollsLeft,card)-direct)<=1e-10);
    }
    if(lex(chosen.hold,optimum.hold)!==0)holdAlternates++;
    assert.equal(JSON.stringify([card,dice]),before);
    if((trial+1)%5000===0)console.log(`seed ${seed}: ${trial+1}/${count} exact midgame comparisons`);
  }
  return {passed:true,seed,states:count,distinctScorecards:seen.size,modes,rollLayers,orderedHoldChecks,tolerance:1e-10,maximumValueDifference,maximumHoldResidual,holdAlternates,categoryAlternates,alternateMeaning:'Different floating evaluation orders may select different holds within the declared roundoff tolerance; every selected hold was directly evaluated with ordered chance outcomes.'};
}
