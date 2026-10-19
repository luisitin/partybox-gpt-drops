import type { Action, Branch, Difficulty, Rng, State } from './types.js';
const exploration: Readonly<Record<Difficulty,number>> = Object.freeze({easy:1,normal:.5,hard:.1,master:0});
const purchase: Readonly<Record<Difficulty,number>> = Object.freeze({easy:.5,normal:.85,hard:.98,master:1});
function draw(rng:Rng):number|null {
  try {const value=rng();return Number.isFinite(value)&&value>=0&&value<1?value:null;} catch {return null;}
}
function select(options:readonly {readonly id:string|null;readonly value:number}[],difficulty:Difficulty,rng:Rng):string|null {
  if(options.length===0)return null;
  const unit=draw(rng);if(unit===null)return null;
  const q=exploration[difficulty];
  if(unit<q)return options[Math.min(options.length-1,Math.floor(unit/q*options.length))]!.id;
  let maximum=-Infinity;
  for(const option of options)maximum=Math.max(maximum,option.value);
  const best=options.filter(option=>option.value===maximum);
  return best[Math.min(best.length-1,Math.floor((unit-q)/(1-q)*best.length))]!.id;
}
function branchValue(branch:Branch,state:State):number {
  let value=branch.coinGain-branch.cost+4*(state.buddy?0:branch.buddyGain)-20*branch.risk;
  if(branch.distanceToStar!==null)
    value+=(state.coins-branch.cost+branch.coinGain>=state.starPrice?100:10)/(branch.distanceToStar+1);
  return value;
}
function actionValue(action:Action,state:State,shopping:boolean):number {
  let value=50*action.starGain+action.coinGain-action.cost+4*(state.buddy?0:action.buddyGain)-20*action.risk;
  if(state.starDistance!==null){
    value+=Math.min(action.movement,state.starDistance);
    if(state.starDistance>0&&action.movement>=state.starDistance&&state.coins-action.cost>=state.starPrice)value+=30;
    if(shopping&&state.starDistance<=10&&state.coins-action.cost<state.starPrice)value-=30;
  }
  return value;
}
/** Select an affordable branch using only public effect estimates. */
export function chooseBranch(state:State,difficulty:Difficulty,rng:Rng):string|null {
  if(state.turnsLeft===0)return null;
  const available=state.branches.filter(branch=>branch.cost<=state.coins);
  return select(available.map(branch=>({id:branch.id,value:branchValue(branch,state)})),difficulty,rng);
}
function chooseAction(state:State,difficulty:Difficulty,rng:Rng,shopping:boolean):string|null {
  if(state.turnsLeft===0||(shopping&&state.inventory.length===3))return null;
  const available=(shopping?state.shop:state.inventory).filter(action=>action.legal&&action.cost<=state.coins);
  if(available.length===0)return null;
  const options: {id:string|null;value:number}[]=available.map(action=>({id:action.id,value:actionValue(action,state,shopping)}));
  options.push({id:null,value:0});
  return select(options,difficulty,rng);
}
export function chooseItem(state:State,difficulty:Difficulty,rng:Rng):string|null {return chooseAction(state,difficulty,rng,false);}
export function chooseShopBuy(state:State,difficulty:Difficulty,rng:Rng):string|null {return chooseAction(state,difficulty,rng,true);}
export function buyStar(state:State,difficulty:Difficulty,rng:Rng):boolean {
  if(state.turnsLeft===0||!state.starAvailable||state.coins<state.starPrice)return false;
  const unit=draw(rng);return unit!==null&&unit<purchase[difficulty];
}
