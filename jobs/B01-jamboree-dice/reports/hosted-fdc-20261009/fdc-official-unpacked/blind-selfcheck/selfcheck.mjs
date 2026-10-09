import assert from 'node:assert/strict';
import fs from 'node:fs';
import {enumerate, evaluateRoll, fraction, addFractions} from './compiled/reference.js';

let assertions = 0;
const eq = (actual, expected) => { assert.deepEqual(actual, expected); assertions++; };
const raises = fn => { assert.throws(fn, RangeError); assertions++; };
const base = {id:'fixture',blocks:[[1,2],[1,2]],bonusDice:2,bonusRegular:10,
  bonusSevens:50,payday:false,offset:0,coinKnown:true,facts:['contract'],confidence:'high'};
eq(fraction(0n,7n),'0/1'); eq(fraction(6n,8n),'3/4'); eq(fraction(-6n,-8n),'3/4');
eq(fraction(6n,-8n),'-3/4'); eq(addFractions('1/3','1/6'),'1/2'); raises(()=>fraction(1n,0n));
eq(enumerate(base), {id:'fixture',sampleSpace:'4',confidence:'high',facts:['contract'],
  movement:{2:'1/4',3:'1/2',4:'1/4'},coins:{0:'1/2',10:'1/2'},
  joint:[{movement:2,coins:10,ways:'1',probability:'1/4'},
    {movement:3,coins:0,ways:'2',probability:'1/2'},
    {movement:4,coins:10,ways:'1',probability:'1/4'}],meanMovement:'3/1',meanCoins:'5/1'});
eq(evaluateRoll({...base,blocks:[[7],[7]],payday:true,offset:5},[7,7]),{movement:19,coins:64});
eq(evaluateRoll({...base,blocks:[[7],[7],[3]],payday:true},[7,7,3]),{movement:17,coins:67});
eq(evaluateRoll({...base,blocks:[[7],[7],[3]],bonusDice:3,payday:true},[7,7,3]),{movement:17,coins:17});
eq(evaluateRoll({...base,coinKnown:false},[1,1]),{movement:2,coins:null});
const unknown=enumerate({...base,coinKnown:false});
eq(unknown.coins,null); eq(unknown.meanCoins,null);
eq(unknown.joint,[{movement:2,coins:null,ways:'1',probability:'1/4'},
  {movement:3,coins:null,ways:'2',probability:'1/2'},
  {movement:4,coins:null,ways:'1',probability:'1/4'}]);
eq(enumerate({...base,blocks:[[10]],bonusDice:0,offset:5}).meanMovement,'15/1');
eq(enumerate({...base,blocks:[[2,1],[3]],bonusDice:0}).movement,{4:'1/2',5:'1/2'});
for(const blocks of [[],Array.from({length:6},()=>[1]),[[]],[[1,1]],[[0]],[[11]],[[1.5]]])
  raises(()=>enumerate({...base,blocks}));
for(const bonusDice of [-1,1,3,1.5]) raises(()=>enumerate({...base,bonusDice}));
for(const offset of [-1,6,.5]) raises(()=>enumerate({...base,offset}));
raises(()=>evaluateRoll(base,[1])); raises(()=>evaluateRoll(base,[1,3]));
// Independently known fair-d10 matching probabilities and means.
const normal=Array.from({length:10},(_,i)=>i+1);
const double=enumerate({...base,blocks:[normal,normal]});
eq(double.sampleSpace,'100'); eq(double.movement['2'],'1/100');
eq(double.movement['11'],'1/10'); eq(double.meanMovement,'11/1');
eq(double.coins,{'0':'9/10','10':'9/100','50':'1/100'});
const triple=enumerate({...base,blocks:[normal,normal,normal],bonusDice:3,bonusRegular:20});
eq(triple.sampleSpace,'1000'); eq(triple.movement['3'],'1/1000');
eq(triple.meanMovement,'33/2'); eq(triple.coins,{'0':'99/100','20':'9/1000','50':'1/1000'});
const result={status:'passed',assertions,authorship:'public contract and dice.json only; no production or tests read'};
fs.writeFileSync('SELFCHECK.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
