import assert from 'node:assert/strict';
import { readFileSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as oracle from '../dist/reference.js';
import * as primary from '../dist/ttr.js';
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const sourceHashes={original:sha('reference.snapshot.ts.txt'),amended:sha('reference.ts'),primary:sha('ttr.ts')};
let assertions=0;
const discrepancies=[];
function compare(name,args,label) {
  const evaluate=fn=>{try{return {value:fn(...args)};}catch(error){return {error:error.constructor.name};}};
  const expected=evaluate(oracle[name]),actual=evaluate(primary[name]);assertions++;
  try{assert.deepEqual(actual,expected);}catch{discrepancies.push({name,label,args,expected,actual});}
}
const cards=['pink','white','blue','yellow','orange','black','red','green','locomotive'];
const inventory=n=>Object.fromEntries(cards.map(c=>[c,n]));
const player=id=>({id,cards:inventory(12),trainsRemaining:45,ticketIds:[]});
const game=n=>({playerCount:n,players:Array.from({length:n},(_,i)=>player(`p${i}`)),claims:{}});
const edge=(id,a,b,length,color='gray')=>({id,a,b,length,color});
const seeds=[];
for(const seed of [1,2,3]) {
  const random=oracle.seeded(seed);const before=assertions;
  for(let sample=0;sample<20000;sample++) {
    const v=2+Math.floor(random()*8),n=Math.floor(random()*13);
    const routes=Array.from({length:n},(_,i)=>edge(`r${i}`,`v${Math.floor(random()*v)}`,`v${Math.floor(random()*v)}`,1+Math.floor(random()*6)));
    const ids=routes.map(r=>r.id);
    compare('longestTrail',[routes,ids],`seed${seed}/graph${sample}`);
    const ticket={id:'t',a:`v${Math.floor(random()*(v+2))}`,b:`v${Math.floor(random()*(v+2))}`,points:1+Math.floor(random()*22)};
    compare('ticketComplete',[routes,ids,ticket],`seed${seed}/ticket${sample}`);
  }
  seeds.push({seed,graphs:20000,checks:assertions-before});
  console.log(JSON.stringify({seed,assertions,discrepancies:discrepancies.length}));
}
const routes=[edge('r','A','B',2,'red'),edge('p','B','A',2,'red'),edge('g','B','C',3),edge('__proto__','C','D',1,'blue')];
for(const n of [2,3,4,5]) {
  const state=game(n),request={routeId:'r',playerId:'p0',cards:['red','locomotive']};
  compare('canClaim',[routes,state,request],`players${n}`);compare('applyClaim',[routes,state,request],`players${n}`);
  state.claims.r='p0';for(const owner of ['p0','p1'])compare('canClaim',[routes,state,{...request,routeId:'p',playerId:owner}],`parallel${n}/${owner}`);
}
for(const spend of [[],['red'],['red','blue'],['locomotive','locomotive'],new Array(2),['red',undefined],['invalid','red']])
  compare('canClaim',[routes,game(2),{routeId:'r',playerId:'p0',cards:spend}],'Spend boundary');
for(const mutation of [g=>{g.playerCount=1;},g=>{g.players.pop();},g=>{g.players[0].cards.red=-1;},g=>{g.players[0].cards.red=NaN;},
  g=>{g.players[0].cards.red=Number.MAX_SAFE_INTEGER+1;},g=>{g.players[0].ticketIds=new Array(1);},g=>{g.players[0].cards.extra=1;},
  g=>{delete g.players[0].cards.red;},g=>{g.claims.invalid='p0';},g=>{g.claims.r='invalid';}]) {
  const state=game(2);mutation(state);compare('canClaim',[routes,state,{routeId:'r',playerId:'p0',cards:['red','red']}],'Container boundary');
}
for(const ids of [[],['r'],['r','r'],['unknown'],new Array(1),['r',undefined]]) {
  compare('longestTrail',[routes,ids],'Owned ID boundary');compare('ticketComplete',[routes,ids,{id:'t',a:'A',b:'B',points:1}],'Owned ticket boundary');
}
for(const n of [2,3,4,5]) {
  const state=game(n);state.claims.r='p0';state.claims.g='p1';
  const tickets=[{id:'one',a:'A',b:'B',points:8},{id:'two',a:'A',b:'C',points:14}];state.players[0].ticketIds=['two','one'];
  compare('scoreGame',[routes,tickets,state],`Scoring player${n}`);
  state.players[0].ticketIds=['unknown'];compare('scoreGame',[routes,tickets,state],'Unknown held ticket');
}
for(const seed of [1,2,3,0,-1,4294967295]) {
  const a=oracle.seeded(seed),b=primary.seeded(seed);for(let i=0;i<1000;i++){assertions++;assert.equal(a(),b(),'RNG replay');}
}
for(const [file,hash] of [['reference.snapshot.ts.txt',sourceHashes.original],['reference.ts',sourceHashes.amended],['ttr.ts',sourceHashes.primary]])assert.equal(sha(file),hash,'Read-only sources');
const report={passed:discrepancies.length===0,assertions,seeds,sourceHashes,discrepancies};
writeFileSync('test-output/graphs.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
assert.equal(discrepancies.length,0,'Every public contract case matches');
