import assert from 'node:assert/strict';
export const names=['chooseBranch','chooseItem','chooseShopBuy','buyStar'];
export function seeded(seed){let x=seed>>>0||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};}
const freeze=o=>{if(o&&typeof o==='object'){for(const v of Object.values(o))freeze(v);Object.freeze(o);}return o;};
export function randomState(r){const n=max=>Math.floor(r()*max),distance=()=>n(5)===0?null:n(21);
 const action=(id)=>({id,legal:n(5)!==0,cost:n(41),coinGain:n(21),starGain:n(4),movement:n(11),buddyGain:n(2),risk:n(11)/10});
 return freeze({coins:n(101),starPrice:1+n(40),starDistance:distance(),starAvailable:n(3)!==0,turnsLeft:n(13),buddy:n(2)===1,
 branches:Array.from({length:n(6)},(_,i)=>({id:`b${i}`,cost:n(41),coinGain:n(21),distanceToStar:distance(),buddyGain:n(2),risk:n(11)/10})),
 inventory:Array.from({length:n(4)},(_,i)=>action(`i${i}`)),shop:Array.from({length:n(8)},(_,i)=>action(`s${i}`))});}
export function compare(api,ref,s,d,u,name){let a=0,b=0;const before=JSON.stringify(s);
 const actual=api[name](s,d,()=>{a++;return u;}),expected=ref[name](s,d,()=>{b++;return u;});
 assert.equal(actual,expected,`${name} choice`);assert.equal(a,b,`${name} draw count`);assert.equal(JSON.stringify(s),before,'input purity');
 if(name==='buyStar')assert.equal(typeof actual,'boolean');else if(actual!==null){const list=name==='chooseBranch'?s.branches:name==='chooseItem'?s.inventory:s.shop;
 assert.ok(s.turnsLeft>0&&list.some(x=>x.id===actual&&x.cost<=s.coins&&(name==='chooseBranch'||x.legal)),'returned ID legal and affordable');if(name==='chooseShopBuy')assert.ok(s.inventory.length<3);}
 return actual;
}
export function randomSuite(api,ref,seed,count){const r=seeded(seed);let cases=0;const counts={};
 for(const name of names){counts[name]=0;for(let i=0;i<count;i++){const s=randomState(r),d=['easy','normal','hard','master'][Math.floor(r()*4)],u=r();compare(api,ref,s,d,u,name);counts[name]++;cases++;}}
 return {cases,counts};}
export function toyGame(api,seed){const r=seeded(seed),players=[{coins:20,stars:0,inventory:[{id:'boost',legal:true,cost:0,coinGain:5,starGain:0,movement:0,buddyGain:0,risk:0}]},{coins:20,stars:0,inventory:[{id:'boost',legal:true,cost:0,coinGain:5,starGain:0,movement:0,buddyGain:0,risk:0}]}];const history=[];
 for(let round=0;round<12;round++){
  const minigameWinner=Math.floor(r()*2);players[minigameWinner].coins+=6;
  for(let p=0;p<2;p++){
   const player=players[p],difficulty=p===0?'easy':'hard';player.coins+=2;
   const current=()=>freeze({coins:player.coins,starPrice:20,starDistance:0,starAvailable:true,turnsLeft:12-round,buddy:false,
    branches:[{id:'star',cost:0,coinGain:0,distanceToStar:0,buddyGain:0,risk:0},{id:'work',cost:0,coinGain:8,distanceToStar:1,buddyGain:0,risk:0},{id:'trap',cost:0,coinGain:4,distanceToStar:0,buddyGain:0,risk:1}],inventory:player.inventory.map(x=>({...x})),
    shop:[{id:'bad-deal',legal:true,cost:6,coinGain:0,starGain:0,movement:0,buddyGain:0,risk:1}]});
   const item=api.chooseItem(current(),difficulty,r);if(item==='boost'){player.coins+=5;player.inventory=[];}
   const shop=api.chooseShopBuy(current(),difficulty,r);if(shop==='bad-deal')player.coins-=6;
   const branch=api.chooseBranch(current(),difficulty,r);if(branch==='work')player.coins+=8;if(branch==='trap')player.coins=Math.max(0,player.coins-6);
   const state=current();const bought=api.buyStar({...state,starAvailable:branch==='star'},difficulty,r);if(bought){player.coins-=20;player.stars++;}
   history.push([round,p,item,shop,branch,bought,player.coins,player.stars]);
  }
 }
 const scores=players.map(p=>[p.stars,p.coins]);const comparison=scores[1][0]-scores[0][0]||scores[1][1]-scores[0][1];return {winner:comparison>0?'hard':comparison<0?'easy':'tie',scores,history};}
export function toySuite(api,ref,seed,count){let hard=0,easy=0,ties=0;
 for(let i=0;i<count;i++){const salt=(Math.imul(seed,0x9e3779b1)+i+1)>>>0;const actual=toyGame(api,salt),expected=toyGame(ref,salt);assert.deepEqual(actual,expected,'every toy decision and state');if(actual.winner==='hard')hard++;else if(actual.winner==='easy')easy++;else ties++;}
 const rate=hard/count;assert.ok(rate>=.65,`Hard rate ${rate} below original .65`);return {games:count,hard,easy,ties,rate,decisionComparisons:count*12*2*4};}
