import {oraclePositions} from '../dist/test/oracle.js';
export function rng(seed) {
  let a=seed>>>0;
  return ()=>{a^=a<<13;a^=a>>>17;a^=a<<5;return (a>>>0)/4294967296;};
}
export function shuffle(items,random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/** Independent product-uniform placement followed by WHOLE-FLEET rejection.
 * Thus all legal labelled fleets have the same acceptance probability. */
export function worldGenerator(size,fleet,random) {
  const choices=fleet.map(l=>oraclePositions(size,l));
  const marks=new Uint8Array(size*size);
  return ()=>{
    for(let attempt=0;attempt<1_000_000;attempt++) {
      marks.fill(0);const world=[];let okay=true;
      for(const positions of choices) {
        const p=positions[Math.floor(random()*positions.length)];
        if(p.some(c=>marks[c])){okay=false;break;}
        for(const c of p)marks[c]=1;
        world.push(p);
      }
      if(okay)return world;
    }
    throw new Error('Independent board generator exhausted its rejection budget');
  };
}
export function observed(size,fleet,world,shots,named=true) {
  const cells=Array(size*size).fill(0),hitShip=Array(size*size).fill(null),sunk=[];
  const owners=new Map(world.flatMap((p,s)=>p.map(c=>[c,s])));
  for(const c of shots){const ship=owners.get(c);cells[c]=ship===undefined?1:2;if(named&&ship!==undefined)hitShip[c]=ship;}
  world.forEach((p,ship)=>{if(p.every(c=>cells[c]===2)){sunk.push({ship,cells:[...p]});for(const c of p){cells[c]=3;hitShip[c]=ship;}}});
  return {cells,hitShip,sunk};
}
export function applyShot(state,cell,world,named=true) {
  if(state.cells[cell]!==0)throw new Error('repeated shot');
  const ship=world.findIndex(p=>p.includes(cell));
  const cells=[...state.cells],hitShip=[...state.hitShip],sunk=[...state.sunk];
  let feedback;
  if(ship<0){cells[cell]=1;feedback={result:'miss'};}
  else {
    cells[cell]=2;hitShip[cell]=named?ship:null;
    if(world[ship].every(c=>cells[c]===2)) {
      feedback={result:'sunk',ship,cells:[...world[ship]]};
      sunk.push({ship,cells:[...world[ship]]});for(const c of world[ship]){cells[c]=3;hitShip[c]=ship;}
    }else feedback=named?{result:'hit',ship}:{result:'hit'};
  }
  return {state:{cells,hitShip,sunk},feedback};
}
export function unwrap(result){if(!result.ok)throw new Error(JSON.stringify(result));return result.value;}
export function smallCase(seed,index) {
  const random=rng((Math.imul(seed+1,0x9e3779b1)^Math.imul(index+1,0x85ebca6b))>>>0||1);
  const fleet=[[2],[3],[2,2],[2,3],[3,3],[2,2,3]][index%6];
  const world=worldGenerator(6,fleet,random)();
  const n=fleet.length===3?12+Math.floor(random()*25):Math.floor(random()*37);
  const state=observed(6,fleet,world,shuffle(Array.from({length:36},(_,i)=>i),random).slice(0,n),index%12<6);
  return {size:6,fleet,world,state,named:index%12<6};
}
