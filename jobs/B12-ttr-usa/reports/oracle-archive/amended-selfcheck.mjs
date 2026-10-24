import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { canClaim,applyClaim,ticketComplete,longestTrail,scoreGame,seeded } from './probe-build/amended-reference.js';
let assertions=0;
const equal=(a,b,message)=>{assertions++;assert.deepEqual(a,b,message);};
const throws=(fn,message)=>{assertions++;assert.throws(fn,RangeError,message);};
const colors=['pink','white','blue','yellow','orange','black','red','green','locomotive'];
const inventory=count=>Object.fromEntries(colors.map(card=>[card,count]));
const player=id=>({id,cards:inventory(20),trainsRemaining:45,ticketIds:[]});
const game=count=>({playerCount:count,players:Array.from({length:count},(_,i)=>player(`p${i}`)),claims:{}});
const route=(id,a,b,length=1,color='gray',parallelGroup)=>({id,a,b,length,color,...(parallelGroup===undefined?{}:{parallelGroup})});
const routes=[route('r','A','B',2,'red'),route('parallel','B','A',2,'red'),route('gray','B','C',3),route('__proto__','C','D',1,'blue')];
const claim={routeId:'r',playerId:'p0',cards:['red','locomotive']};
for(const n of [2,3,4,5]) {
  const original=game(n),snapshot=JSON.stringify(original);
  equal(canClaim(routes,original,claim),true,'Named route plus loco');
  const result=applyClaim(routes,original,claim);
  equal(JSON.stringify(original),snapshot,'No input mutation');
  equal(result.players[0].trainsRemaining,43,'Train spend');
  equal(result.players[0].cards.red,19,'Color spend');equal(result.players[0].cards.locomotive,19,'Loco spend');
  equal(canClaim(routes,result,{...claim,routeId:'parallel'}),false,'Same owner cannot claim both parallel edges');
  equal(canClaim(routes,result,{...claim,routeId:'parallel',playerId:'p1'}),n>=4,'Global small-game restriction');
  equal(canClaim(routes,result,claim),false,'Already claimed');
}
for(const cards of [['red','red','red'],['locomotive','locomotive','locomotive'],['blue','blue','locomotive']])
  equal(canClaim(routes,game(2),{routeId:'gray',playerId:'p0',cards}),true,'Gray one color or all locos');
for(const cards of [['blue','red','locomotive'],['red'],['red','blue'],['bad','red']])
  equal(canClaim(routes,game(2),{routeId:cards.length===3?'gray':'r',playerId:'p0',cards}),false,'Invalid/mixed spend');
equal(canClaim(routes,game(2),{...claim,cards:['blue','locomotive']}),false,'Wrong named color');
equal(canClaim(routes,game(2),{...claim,cards:['locomotive','locomotive']}),true,'All locos named route');
const poor=game(2);poor.players[0].cards.red=0;equal(canClaim(routes,poor,claim),false,'Insufficient cards');
poor.players[0].cards.red=20;poor.players[0].trainsRemaining=1;equal(canClaim(routes,poor,claim),false,'Insufficient trains');
for(const mutation of [g=>{g.playerCount=1;},g=>{g.players.pop();},g=>{g.players[1].id='p0';},g=>{g.players[0].trainsRemaining=46;},
  g=>{g.players[0].cards.red=-1;},g=>{g.players[0].cards.extra=1;},g=>{delete g.players[0].cards.blue;},
  g=>{g.players[0].ticketIds=['t','t'];},g=>{g.claims.unknown='p0';},g=>{g.claims.r='unknown';},g=>{g.claims.r='p0';g.claims.parallel='p1';}]) {
  const malformed=game(2);mutation(malformed);equal(canClaim(routes,malformed,claim),false,'Malformed container');
  throws(()=>applyClaim(routes,malformed,claim),'Illegal apply throws');
}
const sameMetadata=[route('x','A','B',1,'red','g'),route('y','C','D',1,'red','g')];
const metaGame=game(2);metaGame.claims.x='p0';
equal(canClaim(sameMetadata,metaGame,{routeId:'y',playerId:'p0',cards:['red']}),true,'Metadata does not imply geographic parallel route');
const proto=applyClaim(routes,game(2),{routeId:'__proto__',playerId:'p0',cards:['blue']});
equal(Object.hasOwn(proto.claims,'__proto__'),true,'Arbitrary route IDs are own safe keys');
equal(proto.claims.__proto__,'p0','Prototype-looking claim ID');

const ticket={id:'t',a:'A',b:'C',points:10};
equal(ticketComplete(routes,['r','gray'],ticket),true,'Connected ticket');
equal(ticketComplete(routes,['r'],ticket),false,'Disconnected ticket');
equal(ticketComplete(routes,[],{...ticket,a:'absent',b:'absent'}),true,'Zero-edge connectivity');
equal(ticketComplete(routes,['r'],{...ticket,b:'absent'}),false,'Absent endpoint disconnected');
throws(()=>ticketComplete(routes,['r','r'],ticket),'Duplicate owned IDs');
throws(()=>ticketComplete(routes,['unknown'],ticket),'Unknown owned IDs');
throws(()=>ticketComplete(routes,[],{...ticket,points:0}),'Malformed ticket');
equal(longestTrail(routes,[]),0,'Empty network');
const star=[route('a','X','A',6),route('b','X','B',5),route('c','X','C',4)];
equal(longestTrail(star,star.map(e=>e.id)),11,'Weighted branching tree diameter');
const loop=[route('l','X','X',6),route('a','X','A',4),route('b','A','B',5),route('p','B','X',3)];
equal(longestTrail(loop,loop.map(e=>e.id)),18,'Self-loop and closed trail');
const figure=[route('a','X','A',1),route('b','A','B',2),route('c','B','X',3),route('d','X','C',4),route('e','C','D',5),route('f','D','X',6)];
equal(longestTrail(figure,figure.map(e=>e.id)),21,'Repeated city figure eight');
const parallel=[route('a','A','B',3),route('b','A','B',4)];
equal(longestTrail(parallel,['a','b']),7,'Distinct parallel edges in a trail');
const largeTree=Array.from({length:80},(_,i)=>route(`e${i}`,`x${i}`,`x${i+1}`,6));
equal(longestTrail(largeTree,largeTree.map(e=>e.id)),480,'Exact beyond twelve/eighty-edge tree');
const largeCycle=Array.from({length:40},(_,i)=>route(`e${i}`,`x${i}`,`x${(i+1)%40}`,1));
for(const at of [0,10,20,30])largeCycle.push(route(`leaf${at}`,`x${at}`,`leaf${at}`,2));
equal(longestTrail(largeCycle,largeCycle.map(e=>e.id)),42,'Forty-four-edge cyclic component; no twelve/thirty-two-edge cap');
throws(()=>longestTrail(routes,['r','r']),'Longest rejects duplicate IDs');
throws(()=>longestTrail([route('bad','A','B',0)],[]),'Malformed route');

function brute(edges) {
  // Independently enumerate every edge subset. A connected subset is a trail
  // exactly when it has zero or two odd vertices (Euler's criterion).
  let maximum=0;
  for(let mask=1;mask<2**edges.length;mask++) {
    const chosen=edges.filter((_,i)=>mask&(1<<i));
    const weight=chosen.reduce((sum,edge)=>sum+edge.length,0);
    if(weight<=maximum)continue;
    const degree=new Map(),adjacency=new Map();
    for(const edge of chosen) {
      degree.set(edge.a,(degree.get(edge.a)??0)+1);degree.set(edge.b,(degree.get(edge.b)??0)+1);
      adjacency.set(edge.a,[...(adjacency.get(edge.a)??[]),edge.b]);
      adjacency.set(edge.b,[...(adjacency.get(edge.b)??[]),edge.a]);
    }
    const odd=[...degree.values()].filter(d=>d%2).length;if(odd>2)continue;
    const reached=new Set([chosen[0].a]),queue=[chosen[0].a];
    for(let i=0;i<queue.length;i++)for(const neighbor of adjacency.get(queue[i]))if(!reached.has(neighbor)){reached.add(neighbor);queue.push(neighbor);}
    if(reached.size===degree.size)maximum=weight;
  }
  return maximum;
}
const randomGraphChecks=[];
for(const seed of [1,2,3]) {
  const rng=seeded(seed);let count=0;
  for(let sample=0;sample<2000;sample++) {
    const vertices=2+Math.floor(rng()*6),n=Math.floor(rng()*13);
    const edges=Array.from({length:n},(_,i)=>route(`r${i}`,`v${Math.floor(rng()*vertices)}`,`v${Math.floor(rng()*vertices)}`,1+Math.floor(rng()*6)));
    equal(longestTrail(edges,edges.map(e=>e.id)),brute(edges),`Exhaustive edge-subset trail seed${seed}/sample${sample}`);count++;
  }
  randomGraphChecks.push({seed,graphs:count,maxEdges:12});
}
const scoreRoutes=[route('a','A','B',1),route('b','B','C',2),route('c','D','E',3),route('d','E','F',4),route('e','G','H',5),route('f','H','I',6)];
const scoreTickets=[{id:'yes',a:'A',b:'C',points:9},{id:'no',a:'A',b:'I',points:20}];
const scoreState=game(3);scoreState.claims={a:'p0',b:'p0',c:'p1',d:'p1',e:'p2',f:'p2'};scoreState.players[0].ticketIds=['no','yes'];
const scores=scoreGame(scoreRoutes,scoreTickets,scoreState);
equal(scores.map(s=>[s.routePoints,s.ticketPoints,s.longestLength,s.longestBonus,s.total]),[[3,-11,3,0,-8],[11,0,7,0,11],[25,0,11,10,35]],'Every route length and ticket sign');
equal(scores[0].completedTicketIds,['yes'],'Completed order');
const tied=game(2);tied.claims={a:'p0',b:'p1'};
equal(scoreGame([route('a','A','B',3),route('b','C','D',3)],[],tied).map(s=>s.longestBonus),[10,10],'Positive ties both receive bonus');
equal(scoreGame([],[],game(2)).map(s=>s.longestBonus),[0,0],'No zero-length bonus');
const unknownTicket=game(2);unknownTicket.players[0].ticketIds=['unknown'];throws(()=>scoreGame([],[],unknownTicket),'Unknown held ticket scoring');
const rng=seeded(1);equal(rng(),1015568748/4294967296,'LCG first value');equal(rng(),1586005467/4294967296,'LCG second value');
const scoringChecks=[];
for(const seed of [1,2,3]) {
  const random=seeded(seed+100);
  for(let sample=0;sample<1000;sample++) {
    const n=2+Math.floor(random()*4),state=game(n),edges=[],pairs=new Set();
    for(let i=0;i<12;i++) {
      let a,b,key;
      do {a=`v${Math.floor(random()*10)}`;b=`v${Math.floor(random()*10)}`;key=[a,b].sort().join(',');}while(a===b||pairs.has(key));
      pairs.add(key);edges.push(route(`r${i}`,a,b,1+Math.floor(random()*6)));
      if(random()<0.8)state.claims[`r${i}`]=`p${Math.floor(random()*n)}`;
    }
    const tickets=Array.from({length:10},(_,i)=>({id:`t${i}`,a:`v${Math.floor(random()*12)}`,b:`v${Math.floor(random()*12)}`,points:1+Math.floor(random()*22)}));
    for(const player of state.players)player.ticketIds=tickets.filter(()=>random()<0.35).map(t=>t.id).reverse();
    const expected=state.players.map(player=>{
      const owned=edges.filter(edge=>state.claims[edge.id]===player.id),roots=new Map();
      function find(v){if(!roots.has(v))roots.set(v,v);while(roots.get(v)!==v)v=roots.get(v);return v;}
      for(const edge of owned)roots.set(find(edge.a),find(edge.b));
      const completedTicketIds=[];let ticketPoints=0;
      for(const id of player.ticketIds){const t=tickets.find(t=>t.id===id);const complete=find(t.a)===find(t.b);ticketPoints+=(complete?1:-1)*t.points;if(complete)completedTicketIds.push(id);}
      return {playerId:player.id,routePoints:owned.reduce((sum,e)=>sum+[0,1,2,4,7,10,15][e.length],0),ticketPoints,
        longestLength:brute(owned),completedTicketIds};
    });
    const max=Math.max(...expected.map(x=>x.longestLength));
    const full=expected.map(row=>{const longestBonus=max>0&&row.longestLength===max?10:0;return {...row,longestBonus,total:row.routePoints+row.ticketPoints+longestBonus};});
    const snapshot=JSON.stringify(state);equal(scoreGame(edges,tickets,state),full,'Independent synthetic full scoring');equal(JSON.stringify(state),snapshot,'Score input immutability');
    const fresh=game(n),edge=edges[Math.floor(random()*edges.length)],cards=Array(edge.length).fill(colors[Math.floor(random()*8)]);
    const request={routeId:edge.id,playerId:'p0',cards};
    equal(canClaim(edges,fresh,request),true,'Synthetic legal claim');
    const after=applyClaim(edges,fresh,request);
    equal(after.players[0].trainsRemaining,45-edge.length,'Synthetic train conservation');
    equal(after.players[0].cards[cards[0]],20-edge.length,'Synthetic card conservation');
  }
  scoringChecks.push({seed,games:1000,legalClaims:1000});
}
for(const seed of [0,1,2,3,-1,4294967295]) {
  const left=seeded(seed),right=seeded(seed);
  for(let i=0;i<100;i++) {const x=left();equal(x,right(),'Replay');equal(x>=0&&x<1,true,'RNG range');}
}
throws(()=>seeded(NaN),'Invalid seed');
const report={passed:true,assertions,randomGraphChecks,scoringChecks,provenance:'Original B12 prompt/root README and public mathematical contract only; no primary source/tests/data/results viewed'};
writeFileSync('AMENDED-SELFCHECK.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
