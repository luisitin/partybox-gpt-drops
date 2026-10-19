import assert from 'node:assert/strict';
export function manual(api) {
const {chooseBranch,chooseItem,chooseShopBuy,buyStar}=api;
const records=[];

const action = (id, fields = {}) => Object.freeze({ id, legal: true, cost: 0,
  coinGain: 0, starGain: 0, movement: 0, buddyGain: 0, risk: 0, ...fields });
const branch = (id, fields = {}) => Object.freeze({ id, cost: 0, coinGain: 0,
  distanceToStar: null, buddyGain: 0, risk: 0, ...fields });
const state = (fields = {}) => Object.freeze({ coins: 20, starPrice: 20,
  starDistance: 5, starAvailable: true, turnsLeft: 3, buddy: false,
  branches: Object.freeze([branch('near', { distanceToStar: 1 }), branch('far', { distanceToStar: 9 })]),
  inventory: Object.freeze([action('star', { starGain: 1 }), action('loss', { cost: 1 })]),
  shop: Object.freeze([action('star', { starGain: 1 }), action('loss', { cost: 1 })]), ...fields });
const counts = { chooseBranch: 0, chooseItem: 0, chooseShopBuy: 0, buyStar: 0 };
function check(fn, input, difficulty, drawValue, expected, draws = 1) {
  let calls = 0;
  const before = JSON.stringify(input);
  const actual = fn(input, difficulty, () => { ++calls; if (drawValue === 'throws') throw new Error('rng'); return drawValue; });
  assert.equal(actual, expected);
  assert.equal(calls, draws);
  assert.equal(JSON.stringify(input), before);
  ++counts[fn.name];
  records.push({function:fn.name,input,difficulty,draw:Number.isFinite(drawValue)?drawValue:String(drawValue),expected,draws,explanation:explain(fn.name,input,difficulty,drawValue,expected,draws)});
}

for (const [d, u, expected] of [['easy', 0, 'near'], ['easy', .75, 'far'],
  ['normal', .4, 'far'], ['normal', .5, 'near'], ['hard', .09, 'far'],
  ['hard', .1, 'near'], ['master', .99, 'near']]) check(chooseBranch, state(), d, u, expected);
check(chooseBranch, state({ turnsLeft: 0 }), 'master', 0, null, 0);
check(chooseBranch, state({ branches: [] }), 'master', 0, null, 0);
check(chooseBranch, state({ coins: 0, branches: [branch('costly', { cost: 1 })] }), 'master', 0, null, 0);
for (const u of [NaN, Infinity, -1, 1, 'throws']) check(chooseBranch, state(), 'master', u, null);
check(chooseBranch, state({ branches: [branch('a'), branch('b')] }), 'master', .75, 'b');
check(chooseBranch, state({ branches: [branch('a'), branch('b')] }), 'master', .25, 'a');
check(chooseBranch, state({ branches: [branch('risk', { risk: 1 }), branch('cost', { cost: 1 })] }), 'master', 0, 'cost');
check(chooseBranch, state({ buddy: true, branches: [branch('a'), branch('b', { buddyGain: 1 })] }), 'master', 0, 'a');
check(chooseBranch, state({ coins: 19, branches: [branch('gain', { distanceToStar: 0, coinGain: 1 }), branch('near', { distanceToStar: 0 })] }), 'master', 0, 'gain');

for (const fn of [chooseItem, chooseShopBuy]) {
  const list = fn === chooseItem ? 'inventory' : 'shop';
  for (const [d, u, expected] of [['easy', 0, 'star'], ['easy', .5, 'loss'],
    ['easy', .9, null], ['normal', .3, 'loss'], ['normal', .8, 'star'],
    ['hard', .09, null], ['hard', .1, 'star'], ['master', .99, 'star']]) check(fn, state(), d, u, expected);
  check(fn, state({ turnsLeft: 0 }), 'master', 0, null, 0);
  check(fn, state({ [list]: [] }), 'master', 0, null, 0);
  check(fn, state({ [list]: [action('illegal', { legal: false })] }), 'master', 0, null, 0);
  check(fn, state({ coins: 0, [list]: [action('costly', { cost: 1 })] }), 'master', 0, null, 0);
  for (const u of [NaN, 1, 'throws']) check(fn, state(), 'master', u, null);
  if (fn === chooseItem) check(fn, state({ [list]: [action('zero')] }), 'master', .1, 'zero');
  else check(fn, state({ shop: [action('gain', { cost: 1, coinGain: 10 })] }), 'master', 0, null);
  check(fn, state({ [list]: [action('zero')] }), 'master', .9, null);
  check(fn, state({ [list]: [action('movement', { movement: 5 }), action('coins', { coinGain: 20 })] }), 'master', 0, 'movement');
  check(fn, state({ starDistance: null, [list]: [action('movement', { movement: 5 })] }), 'master', .9, null);
  if (fn === chooseItem) check(fn, state({ inventory: [action('gain', { cost: 1, coinGain: 10 })] }), 'master', 0, 'gain');
  else check(fn, state({ inventory: [action('a'), action('b'), action('c')] }), 'master', 0, null, 0);
}
for (const [d, u, expected] of [['easy', .49, true], ['easy', .5, false],
  ['normal', .84, true], ['normal', .85, false], ['hard', .97, true],
  ['hard', .98, false], ['master', 0, true], ['master', 1 - 2 ** -53, true]]) check(buyStar, state(), d, u, expected);
for (const input of [state({ turnsLeft: 0 }), state({ starAvailable: false }), state({ coins: 19 })]) {
  check(buyStar, input, 'master', 0, false, 0);
}
for (const u of [NaN, Infinity, -Infinity, -1, 1, 'throws']) check(buyStar, state(), 'master', u, false);
check(buyStar, state({ coins: 100 }), 'normal', .1, true);
check(buyStar, state({ coins: 0, starPrice: 1 }), 'easy', .1, false, 0);
check(buyStar, state({ turnsLeft: 1 }), 'hard', .5, true);

assert.deepEqual(Object.values(counts), [20, 20, 20, 20]);
const result = { counts, totalScenarios: 80, status: 'passed' };
return {...result,records};
}

function explain(name,s,d,u,expected,draws) {
 if(draws===0)return 'No decision draw: turn ended, no legal affordable option, full shop inventory, or unavailable/unaffordable star, as shown by the input.';
 if(typeof u!=='number'||!Number.isFinite(u)||u<0||u>=1)return 'Invalid or throwing random input declines the decision.';
 if(name==='buyStar'){const threshold={easy:.5,normal:.85,hard:.98,master:1}[d];return `Buy iff draw ${u} is strictly below ${threshold}: ${expected}.`;}
 const q={easy:1,normal:.5,hard:.1,master:0}[d];
 const list=name==='chooseBranch'?s.branches:name==='chooseItem'?s.inventory:s.shop;
 const options=list.filter(x=>(name==='chooseBranch'||x.legal)&&x.cost<=s.coins).map(x=>{
 let value=x.coinGain-x.cost+4*(s.buddy?0:x.buddyGain)-20*x.risk;
 if(name==='chooseBranch'){if(x.distanceToStar!==null)value+=(s.coins-x.cost+x.coinGain>=s.starPrice?100:10)/(x.distanceToStar+1);}
 else{value+=50*x.starGain;if(s.starDistance!==null){value+=Math.min(x.movement,s.starDistance);if(s.starDistance>0&&x.movement>=s.starDistance&&s.coins-x.cost>=s.starPrice)value+=30;if(name==='chooseShopBuy'&&s.starDistance<=10&&s.coins-x.cost<s.starPrice)value-=30;}}
 return {id:x.id,value};});
 if(name!=='chooseBranch')options.push({id:null,value:0});
 const eligible=u<q?options:options.filter(x=>x.value===Math.max(...options.map(y=>y.value)));
 const index=Math.floor((u<q?u/q:(u-q)/(1-q))*eligible.length);
 return `Utilities ${JSON.stringify(options)}; exploration threshold ${q}, draw ${u}, ${u<q?'all legal options':'maximum utility ties'} in input order, index ${index}, expected ${JSON.stringify(expected)}.`;
}
