import assert from 'node:assert/strict';
import{solveClue}from'../../jobs/B09-clue-solver/dist/clueSolver.js';
import{solveReference}from'../../jobs/B09-clue-solver/dist/reference.js';
import{CLASSIC_DECK}from'../../jobs/B09-clue-solver/dist/types.js';
import{adversarialCases,denseClassic,reduced}from'../../jobs/B09-clue-solver/fixtures.mjs';
import{createHash}from'node:crypto';import{readFileSync,writeFileSync}from'node:fs';
const root='/tmp/gpt-drops-B09-audit-20261009',work=root+'/.work/20261009-audit';
const expected=JSON.parse(readFileSync(work+'/first-source-files.json','utf8'));
const frozenSource=()=>{for(const[n,e]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(root+'/'+n)).digest('hex'),e.sha256,n);};frozenSource();
const factorial=n=>{let v=1n;for(let i=2;i<=n;i++)v*=BigInt(i);return v;};
const exactPrior=log=>{const d=log.deck??CLASSIC_DECK,groups=[d.suspects,d.weapons,d.rooms];const choices=groups.reduce((n,g)=>n*BigInt(g.filter(c=>!log.ownHand.includes(c)).length),1n);const sizes=log.handSizes.filter((_,p)=>p!==log.me),dealt=sizes.reduce((a,b)=>a+b,0);return choices*factorial(dealt)/sizes.reduce((n,k)=>n*factorial(k),1n);};
const{base,contradiction}=adversarialCases();const cases=[{name:'reduced-own-three',log:base},{name:'classic-default-deck',log:{handSizes:[3,3,3,3,3,3],me:0,ownHand:['Green','Candlestick','Ballroom'],suggestions:[]}}];
for(const sizes of[[0,3,4],[0,3,2,2],[0,2,2,2,1],[0,2,2,1,1,1]])cases.push({name:'reduced-zero-own-'+sizes.length+'-players',log:{deck:reduced,handSizes:sizes,me:0,ownHand:[],suggestions:[]}});
for(const c of cases)c.expected=exactPrior(c.log);
const dense=denseClassic();cases.push({name:'dense-690-suggestions-BigInt-mask',log:dense.log,expected:1n});assert.equal(cases.length,7);
const badCards=['s1','w1','r1'];delete badCards[1];const errors=[{name:'logical-contradiction',log:contradiction[0][1],code:'CONTRADICTION'},{name:'sparse-tuple',log:{...structuredClone(base),suggestions:[{player:0,cards:badCards,refutedBy:1}]},code:'INVALID_INPUT'},{name:'explicit-null-deck',log:{...cases[1].log,deck:null},code:'INVALID_INPUT'}];
const freeze=(v,seen=new WeakSet())=>{if(v&&typeof v==='object'&&!seen.has(v)){seen.add(v);for(const d of Object.values(Object.getOwnPropertyDescriptors(v)))if('value'in d)freeze(d.value,seen);Object.freeze(v);}};
for(const c of[...cases,...errors])freeze(c.log);
const stringify=o=>JSON.stringify(o,(_,v)=>typeof v==='bigint'?String(v):v);
const plus=(a,b)=>({numerator:a.numerator*b.denominator+b.numerator*a.denominator,denominator:a.denominator*b.denominator});
const equal=(a,b)=>a.numerator*b.denominator===b.numerator*a.denominator;
const zero={numerator:0n,denominator:1n},one={numerator:1n,denominator:1n};
const records=[];let validCalls=0,errorCalls=0;
for(const repetition of[1,2,3]){for(const c of cases){const before=stringify(c.log),a=solveClue(c.log),b=solveReference(c.log);validCalls+=2;assert(a.ok&&b.ok);assert.deepEqual(a,b);assert.equal(a.totalDeals,c.expected);
 for(const p of Object.values(a.cards)){assert(equal(p.hands.reduce(plus,p.envelope),one));for(const f of[p.envelope,...p.hands])assert(f.denominator>0n&&f.numerator>=0n&&f.numerator<=f.denominator);}
 for(let owner=0;owner<c.log.handSizes.length;owner++){const sum=Object.values(a.cards).reduce((v,p)=>plus(v,p.hands[owner]),zero);assert(equal(sum,{numerator:BigInt(c.log.handSizes[owner]),denominator:1n}));}
 const deck=c.log.deck??CLASSIC_DECK;for(const group of[deck.suspects,deck.weapons,deck.rooms])assert(equal(group.reduce((v,name)=>plus(v,a.cards[name].envelope),zero),one));
 for(const invalid of errors){const x=solveClue(invalid.log),y=solveReference(invalid.log);errorCalls+=2;assert.equal(x.ok,false);assert.equal(y.ok,false);assert.equal(x.code,invalid.code);assert.equal(y.code,invalid.code);assert.deepEqual(solveClue(c.log),a);assert.deepEqual(solveReference(c.log),b);validCalls+=2;}
 assert.equal(stringify(c.log),before);records.push({repetition,name:c.name,expectedExactDeals:String(c.expected),actualExactDeals:String(a.totalDeals),inputDeeplyFrozenAndUnchanged:true,referenceWholeResultEqual:true,exactCardCapacityAndEnvelopeConservation:true,postErrorRepeatabilityPassed:true,resultSHA256:createHash('sha256').update(stringify(a)).digest('hex')});}
 frozenSource();}
assert.equal(validCalls,168);assert.equal(errorCalls,126);
const receipt={passed:true,attempt:5,consecutiveSuccessfulNoGainRound:3,concreteAudit:'Seven deeply frozen valid exact cases, including independent combinatorial priors for3–6players/zero-size own hands and690-clause BigInt masks, repeated in mixed error→valid call order. Exact fractions/conservation/reference equality and result bytes repeat without mutation or cross-call contamination.',validCases:7,actualRepeatedCaseChecks:records.length,actualValidSolverCalls:validCalls,actualErrorSolverCalls:errorCalls,records,currentPublicInputsFrozen:72,noLocalTimingMeasurement:true,additionalSubstantivePlayerGainFound:false,completedUTC:new Date().toISOString()};
writeFileSync(work+'/KEEP-5-EXACT-PURITY-CALL-ORDER.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({...receipt,records:undefined}));
