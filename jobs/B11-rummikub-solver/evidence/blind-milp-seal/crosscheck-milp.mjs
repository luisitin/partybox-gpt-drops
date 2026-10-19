/** Own stratified fixtures and RNG; imports only our unchanged sealed oracle. */
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {writeFileSync} from 'node:fs';
import {checkWitness} from './witness-check.mjs';
import {validatePosition} from './dist/reference.js';
const colors=['red','blue','black','orange'];
const positions=[],families=[];
let state=0x6f13b207;
const random=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%n;};
const number=(id,c,v)=>({id,kind:'number',color:colors[c],value:v});
for(let i=0;i<1000;i++){
 const family=i%5,table=[],used=new Map();let id=0,oldJ=0;
 const add=(c,v)=>{const key=c+':'+v;used.set(key,(used.get(key)??0)+1);return number('t'+id++,c,v);};
 if(family>=2){
  const c=random(4),start=1+random(10);
  const tiles=[add(c,start),add(c,start+1),add(c,start+2)];
  if(family>=3){const t=tiles.pop();used.set(c+':'+(start+2),used.get(c+':'+(start+2))-1);
   tiles.push({id:t.id,kind:'joker',as:{color:colors[c],value:start+2}});oldJ++;}
  table.push({kind:'run',tiles});
  if(family===4){
   const c2=(c+1+random(3))%4,start2=1+random(10),a=add(c2,start2),b=add(c2,start2+1);
   table.push({kind:'run',tiles:[a,b,{id:'t'+id++,kind:'joker',as:{color:colors[c2],value:start2+2}}]});oldJ++;
  }
 }
 const oldCount=table.reduce((sum,m)=>sum+m.tiles.length,0);
 const size=i%11===0?random(15-oldCount):14-oldCount;
 const hand=[];
 const newJ=Math.min(size,Math.max(0,(i%3)-oldJ));
 for(let j=0;j<newJ;j++)hand.push({id:'t'+id++,kind:'joker'});
 while(hand.length<size){
  let c,v;
  if(family===1&&hand.length<9){c=hand.length%4;v=8+(Math.floor(hand.length/4)%3);}
  else {c=random(4);v=1+random(13);}
  if((used.get(c+':'+v)??0)>=2)continue;
  hand.push(add(c,v));
 }
 const p={table,hand,initialMeldDone:i%2===0};
 if(!validatePosition(p).ok)throw Error('Own fixture invalid '+i);
 positions.push(p);families.push(family);
}
const python=spawn('python3',['milp-reference.py'],{cwd:new URL('.',import.meta.url),stdio:['pipe','pipe','inherit']});
const output=createInterface({input:python.stdout});
const counts=Array(5).fill(0),reports=[];
for(const p of positions)python.stdin.write(JSON.stringify(p)+'\n');
python.stdin.end();
try{
 for await(const line of output){
  const index=reports.length,report=checkWitness(positions[index],JSON.parse(line),true);
  counts[families[index]]++;reports.push({index,family:families[index],...report});
  if(reports.length%100===0)console.log(JSON.stringify({checked:reports.length}));
 }
}catch(error){python.kill();throw error;}
const code=await new Promise(resolve=>python.on('exit',resolve));
if(code!==0||reports.length!==positions.length)throw Error('Incomplete crosscheck');
writeFileSync('MILP-CROSSCHECK-1000.json',JSON.stringify({status:'passed',seed:'0x6f13b207',
 cases:reports.length,families:{randomRack:counts[0],concentratedDuplicates:counts[1],
 oldRun:counts[2],oldJoker:counts[3],twoOldJokers:counts[4]},reports},null,2)+'\n');
