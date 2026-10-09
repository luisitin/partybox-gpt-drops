import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import * as p from '../dist/ttr.js';
import * as r from '../dist/reference.js';
mkdirSync('test-output',{recursive:true});
const rows=[];
for(const seed of [1,2,3]) {
 let assertions=0;const eq=(a,b)=>{assert.deepEqual(a,b);assertions++;};
 const routes=[{id:'r',a:'A',b:'B',length:1,color:'red'}];
 const cards=()=>Object.fromEntries(p.CARDS.map(c=>[c,2]));
 const game=()=>({playerCount:2,players:[{id:'p',cards:cards(),trainsRemaining:45,ticketIds:['t']},{id:'q',cards:cards(),trainsRemaining:45,ticketIds:[]}],claims:{}});
 const claim={routeId:'r',playerId:'p',cards:['red']},ticket={id:'t',a:'A',b:'B',points:4};
 const shaped=(kind,value)=>Object.assign(kind==='array'?[]:function(){},value);
 const invalid=(g,c=claim,oracle=false)=>{eq(p.canClaim(routes,g,c),false);eq(r.canClaim(routes,g,c),oracle);assert.throws(()=>p.applyClaim(routes,g,c),RangeError);assertions++;assert.throws(()=>p.scoreGame(routes,[ticket],g),RangeError);assertions++;};
 for(const shape of ['array','function']){
  const c=shaped(shape,claim);eq(p.canClaim(routes,game(),c),false);eq(r.canClaim(routes,game(),c),false);assert.throws(()=>p.applyClaim(routes,game(),c),RangeError);assertions++;
  invalid(shaped(shape,game()));const g=game();g.players[0]=shaped(shape,g.players[0]);invalid(g);
  const t=shaped(shape,ticket);assert.throws(()=>p.ticketComplete(routes,['r'],t),RangeError);assert.throws(()=>r.ticketComplete(routes,['r'],t),RangeError);assert.throws(()=>p.scoreGame(routes,[t],game()),RangeError);assertions+=3;
 }
 const inherited=Object.create(cards());for(let i=0;i<9;i++)inherited['unrelated'+i]=0;const gi=game();gi.players[0].cards=inherited;invalid(gi);
 const ga=game();ga.players[0].cards=Object.assign([],cards());invalid(ga);
 const hidden={};for(const c of p.CARDS)Object.defineProperty(hidden,c,{value:2,enumerable:false});for(let i=0;i<9;i++)hidden['unrelated'+i]=0;
 const gh=game();gh.players[0].cards=hidden;invalid(gh,claim,true);
 for(const inheritedGame of [false,true])for(const inheritedPlayer of [false,true]){
 const original=game();if(inheritedPlayer)original.players[0]=Object.assign(Object.create(original.players[0]),{displayName:'Alice'});
 const g=inheritedGame?Object.assign(Object.create(original),{title:'Table'}):original;
 eq(p.canClaim(routes,g,claim),true);eq(r.canClaim(routes,g,claim),true);
 const next=p.applyClaim(routes,g,claim),raw=r.applyClaim(routes,g,claim);
 eq(next.playerCount,raw.playerCount);eq(next.players[0].id,raw.players[0].id);
 eq(p.scoreGame(routes,[ticket],next),r.scoreGame(routes,[ticket],raw));
 if(inheritedGame)eq(next.title,'Table');if(inheritedPlayer)eq(next.players[0].displayName,'Alice');
}
 const random=p.seeded(seed);
 for(let i=0;i<40;i++){
  const g=game();g.metadata={id:i,seed,colour:'blue'};g.displayName='Table '+i;const extra=Symbol('player extra');
  for(const player of g.players){player.displayName=player.id;player.metadata={score:Math.floor(random()*100)};player[extra]=seed;}
  for(const player of g.players){Object.freeze(player.cards);Object.freeze(player.ticketIds);Object.freeze(player.metadata);Object.freeze(player);}
  Object.freeze(g.players);Object.freeze(g.claims);Object.freeze(g.metadata);Object.freeze(g);
  const before=JSON.stringify(g);eq(p.canClaim(routes,g,claim),true);eq(r.canClaim(routes,g,claim),true);
  const next=p.applyClaim(routes,g,claim);eq(JSON.stringify(g),before);eq(next.metadata,g.metadata);eq(next.displayName,g.displayName);
  eq(next.players.map(x=>x.displayName),['p','q']);eq(next.players.map(x=>x[extra]),[seed,seed]);
  eq(next.players[0].cards.red,1);eq(next.players[0].trainsRemaining,44);eq(next.claims,{r:'p'});
  assert.notEqual(next,g);assert.notEqual(next.players,g.players);assert.notEqual(next.players[0].cards,g.players[0].cards);assertions+=3;
  eq(p.scoreGame(routes,[ticket],next).map(x=>({...x})),r.scoreGame(routes,[ticket],{playerCount:next.playerCount,players:next.players,claims:next.claims}).map(x=>({...x})));
 }
 rows.push({seed,passed:true,assertions,validExtensionPreservationControls:40,originalOracleLimitation:'Raw reference still accepts non-enumerable card counts and drops extension fields; untouched and explicitly excluded as a correctness oracle for those two controls.'});
}
const tools=spawnSync(process.execPath,['tests/review-tools.mjs'],{encoding:'utf8',maxBuffer:4*1024*1024});
writeFileSync('test-output/review-tools.log',tools.stdout+tools.stderr);assert.equal(tools.status,0,'verification-tool controls failed\n'+tools.stdout+tools.stderr);
const report={passed:true,seeds:rows,toolControls:JSON.parse(tools.stdout.trim().split('\n').at(-1)),timingClaim:false};
writeFileSync('test-output/review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
