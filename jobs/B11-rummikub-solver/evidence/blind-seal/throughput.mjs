import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {findBestPlay,validateTable} from './dist/reference.js';
let state=123456789;
const rng=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296;};
const colors=['red','blue','black','orange'];let sum=0;
const start=performance.now();
for(let k=0;k<1000;k++){
 const hand=[],used=new Map();
 while(hand.length<14){const color=colors[Math.floor(rng()*4)],value=1+Math.floor(rng()*13),key=color+value;if((used.get(key)??0)>=2)continue;used.set(key,(used.get(key)??0)+1);hand.push({id:String(hand.length),kind:'number',color,value});}
 const before=JSON.stringify(hand),result=findBestPlay({table:[],hand,initialMeldDone:true});
 assert.equal(result.ok,true);assert.equal(validateTable(result.table).ok,true);assert.equal(JSON.stringify(hand),before);sum+=result.value;
}
assert.equal(sum,17703);
const result={seed:123456789,cases:1000,totalValue:sum,status:'passed'};
writeFileSync('THROUGHPUT.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,elapsedMs:performance.now()-start}));
