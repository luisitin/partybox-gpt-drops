import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import * as ref from './blind-adapter.mjs';
import { jokerCases, N, J, HJ, R, G, P } from './joker-cases.mjs';
import { freeze, rng, int, stock, receipt, seedArg, root, hash } from './helpers.mjs';
const api = await import(pathToFileURL(process.env.B11_IMPL ? resolve(process.env.B11_IMPL)
  : resolve(root, 'dist/rummikub.js')).href);
const seed = seedArg(), random = rng(seed), tests = [];
const add = (name, fn) => tests.push({ name, fn });
function solve(p, value, count) {
  freeze(p); const original = JSON.stringify(p);
  const a = api.findBestPlay(p), b = ref.referenceBestPlay(p);
  assert.ok(a.ok, JSON.stringify(a)); assert.ok(b.ok, JSON.stringify(b));
  assert.equal(a.value, value); assert.equal(a.value, b.value);
  assert.equal(a.played.length, b.playedCount);
  if (count !== undefined) assert.equal(a.played.length, count);
  for (const table of [a.table, b.table]) {
    assert.ok(api.validateTable(table).ok); assert.ok(ref.referenceValidateTable(table));
    if (a.action === 'play') {
      assert.ok(api.validatePlay(p, table).ok); assert.ok(ref.referenceValidatePlay(p, table));
    } else assert.deepEqual(table, p.table);
  }
  assert.equal(JSON.stringify(p), original);
  const repeated=api.findBestPlay(p);
  assert.deepEqual(repeated, a, 'determinism across repeated calls');
  assert.ok(api.validateTable(repeated.table).ok);assert.ok(ref.referenceValidateTable(repeated.table));
  if(repeated.action==='play'){assert.ok(api.validatePlay(p,repeated.table).ok);assert.ok(ref.referenceValidatePlay(p,repeated.table));}
}
assert.equal(jokerCases.length, 40);
for (const c of jokerCases) add(`${c.id}: ${c.name}`, () => {
  freeze(c); assert.ok(JSON.stringify(c).includes('joker'));
  if (c.type === 'table') {
    assert.equal(api.validateTable(c.input).ok, c.expected);
    assert.equal(ref.referenceValidateTable(c.input), c.expected);
  } else {
    assert.equal(api.validatePlay(c.before, c.after).ok, c.expected);
    assert.equal(ref.referenceValidatePlay(c.before, c.after), c.expected);
  }
});
add('S01 three-color group', () => solve(P([], [N('r',9),N('b',9),N('k',9)]), 27, 3));
add('S02 short natural run', () => solve(P([], [N('r',1),N('r',2),N('r',3)]), 6, 3));
add('S03 exactly 30 opening with joker', () => solve(P([], [N('r',9),N('r',10),HJ()],false), 30, 3));
add('S04 under-30 is pass', () => solve(P([], [N('r',8),N('r',9),HJ()],false), 0, 0));
add('S05 only rack value counted when extending table', () => solve(P([R(N('r',1),N('r',2),N('r',3))],[N('r',4)]),4,1));
add('S06 old table tiles are mandatory, not optional', () => solve(P([G(N('r',1),N('b',1),N('k',1))],[N('r',2),N('r',3)]),0,0));
add('S07 a long run is not lost by short-run enumeration', () => solve(P([R(...[1,2,3,4,5,6].map(v=>N('r',v)))],[N('r',7)]),7,1));
add('S08 full rearrangement across colors', () => solve(P([R(N('r',10),N('r',11),N('r',12)),R(N('b',10),N('b',11),N('b',12))],
  [N('k',10),N('o',11),N('k',12)]),33,3));
add('S09 prefer highest legal joker binding', () => solve(P([], [N('r',11),N('r',12),HJ()]),36,3));
add('S10 two rack jokers in high group', () => solve(P([], [N('r',13),HJ(),HJ('J1')]),39,3));
add('S11 two rack jokers in low run', () => solve(P([], [N('r',1),HJ(),HJ('J1')]),6,3));
add('S12 distinguish rack joker from table joker', () => solve(P([G(N('r',3),N('b',3),J('J0','k',3))],
  [N('r',11),N('r',12),HJ('J1')]),36,3));
add('S13 duplicate natural copies', () => solve(P([], [N('r',1),N('r',2),N('r',3),N('r',1,'b'),N('r',2,'b'),N('r',3,'b')]),12,6));
add('S14 standalone 13-tile run', () => solve(P([], Array.from({length:13},(_,i)=>N('r',i+1))),91,13));
add('S15 no move with empty hand', () => solve(P([R(N('r',1),N('r',2),N('r',3))],[]),0,0));
add('S16 empty position', () => solve(P([],[],false),0,0));
add('S17 opening cannot borrow old table', () => solve(P([R(N('r',1),N('r',2),N('r',3))], [N('r',4)],false),0,0));
add('V01 identity conservation even when resulting faces make valid sets', () => {
  const p=P([R(N('r',1),N('r',2),N('r',3))],[N('b',4),N('b',5),N('b',6)]);
  const q=[...p.table,R({...N('b',4),value:7},{...N('b',5),value:8},{...N('b',6),value:9})];
  assert.equal(api.validatePlay(p,q).ok,false); assert.equal(ref.referenceValidatePlay(p,q),false);
});
add('V02 duplicate ID across table and hand', () => {
  const p=P([R(N('r',1),N('r',2),N('r',3))],[N('r',1)]);
  assert.equal(api.validatePosition(p).ok,false); assert.equal(ref.referenceValidatePosition(p),false);
  assert.equal(api.findBestPlay(p).ok,false); assert.equal(ref.referenceBestPlay(p).ok,false);
});
add('V03 malformed JSON-shaped inputs never throw', () => {
  const bad=[null,{},[],{table:[],hand:null,initialMeldDone:true},P([], [{id:'x',kind:'number',value:NaN,color:'red'}]),
    P([], [{id:'x',kind:'number',value:1.5,color:'red'}]),P([], [{id:'x',kind:'number',value:3,color:'green'}]),
    P([], [HJ(),HJ('J1'),HJ('J2')]),{...P([],[]),initialMeldDone:'yes'}];
  for(const p of bad) {
    assert.doesNotThrow(()=>api.findBestPlay(p));
    assert.equal(api.validatePosition(p).ok,false); assert.equal(ref.referenceValidatePosition(p),false);
    assert.equal(api.findBestPlay(p).ok,false); assert.equal(ref.referenceBestPlay(p).ok,false);
  }
});
add('V04 106 physical tiles accepted by inventory validation', () => {
  const s=stock(), table=[];
  for(const c of ['red','blue','black','orange']) {
    table.push(R(...s.filter(t=>t.kind==='number'&&t.color===c&&t.id.endsWith('-0')&&t.value>=2)));
    table.push(R(...s.filter(t=>t.kind==='number'&&t.color===c&&t.id.endsWith('-1'))));
  }
  const ones=s.filter(t=>t.kind==='number'&&t.value===1&&t.id.endsWith('-0'));
  table.push(G(ones[0],{id:'joker-0',kind:'joker',as:{color:'blue',value:1}},
    {id:'joker-1',kind:'joker',as:{color:'black',value:1}}),G(...ones.slice(1)));
  const p=P(table,[]); assert.equal(table.flatMap(m=>m.tiles).length,106);
  assert.ok(api.validatePosition(p).ok);assert.ok(ref.referenceValidatePosition(p));
});
// Execute the same entire suite in a different seeded order on each pass.
for(let i=tests.length-1;i>0;i--) { const j=int(random,i+1); [tests[i],tests[j]]=[tests[j],tests[i]]; }
const results=[];
for(const t of tests) {
  try {t.fn();results.push({name:t.name,passed:true});}
  catch(e) {results.push({name:t.name,passed:false,error:String(e)});console.error(`B11_ASSERTION_FAILURE ${t.name}: ${e}`);}
}
const data={suite:'hand-written',seed,cases:tests.length,passed:results.filter(x=>x.passed).length,
  jokerCases:40,jokerPassed:results.filter(x=>x.name.startsWith('J')&&x.passed).length,
  command:`SEED=${seed} node test/unit.mjs`,orderSha256:hash(results.map(x=>x.name).join('\n')),results};
if(!process.env.B11_IMPL) receipt(`unit-seed-${seed}`,data);
console.log(JSON.stringify({...data,results:undefined}));
if(data.passed!==data.cases) process.exitCode=1;
