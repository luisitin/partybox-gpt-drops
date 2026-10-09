import assert from 'node:assert/strict';
import{solveClue}from'../../jobs/B09-clue-solver/dist/clueSolver.js';
import{solveReference}from'../../jobs/B09-clue-solver/dist/reference.js';
import{createHash}from'node:crypto';import{readFileSync,writeFileSync}from'node:fs';
const root='/tmp/gpt-drops-B09-audit-20261009',work=root+'/.work/20261009-audit';
const expected=JSON.parse(readFileSync(work+'/first-source-files.json','utf8'));
const frozenSource=()=>{for(const[n,e]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(root+'/'+n)).digest('hex'),e.sha256,n);};
frozenSource();
const base={deck:{suspects:['s0','s1','s2'],weapons:['w0','w1','w2'],rooms:['r0','r1','r2','r3']},handSizes:[3,2,2],me:0,ownHand:['s0','w0','r0'],suggestions:[]};
const clone=()=>structuredClone(base),cases=[];
for(let mask=1;mask<8;mask++)for(const refutedBy of[1,null]){const cards=['s1','w1','r1'];for(let k=0;k<3;k++)if(mask&(1<<k))delete cards[k];cases.push({name:'tuple-hole-mask-'+mask+'-refuter-'+refutedBy,log:{...clone(),suggestions:[{player:0,cards,refutedBy}]}});}
for(let slot=0;slot<3;slot++)for(const value of[undefined,null,0,{},[]]){const cards=['s1','w1','r1'];cards[slot]=value;cases.push({name:'bad-slot-'+slot+'-'+String(value),log:{...clone(),suggestions:[{player:0,cards,refutedBy:1}]}});}
for(const category of['suspects','weapons','rooms'])for(let slot=0;slot<base.deck[category].length;slot++){const log=clone();delete log.deck[category][slot];log.handSizes=[3,2,1];cases.push({name:'deck-hole-'+category+'-'+slot,log});}
for(const field of['ownHand','handSizes'])for(let slot=0;slot<3;slot++){const log=clone();delete log[field][slot];cases.push({name:field+'-hole-'+slot,log});}
for(const field of['shown','suggestions']){const log=clone();log[field]=new Array(1);cases.push({name:field+'-sparse-list',log});}
const trap=(o,k)=>Object.defineProperty(o,k,{get(){throw new Error('deliberate accessor rejection');},enumerable:true,configurable:true});
for(const kind of['deck','deck-room','hand-size','suggestion-card','refuter','shown-card']){const log=clone();if(kind==='deck')trap(log,'deck');else if(kind==='deck-room')trap(log.deck,'rooms');else if(kind==='hand-size')trap(log.handSizes,'0');else if(kind==='shown-card'){log.shown=[{player:1,card:'s1'}];trap(log.shown[0],'card');}else{log.suggestions=[{player:0,cards:['s1','w1','r1'],refutedBy:1}];if(kind==='suggestion-card')trap(log.suggestions[0].cards,'1');else trap(log.suggestions[0],'refutedBy');}cases.push({name:'throwing-accessor-'+kind,log});}
assert.equal(cases.length,53);
const freeze=(o,seen=new WeakSet())=>{if(o&&typeof o==='object'&&!seen.has(o)){seen.add(o);for(const d of Object.values(Object.getOwnPropertyDescriptors(o)))if('value'in d)freeze(d.value,seen);Object.freeze(o);}};
for(const c of cases)freeze(c.log);
const records=[],accessorObservations=[];
for(const seed of[1,2,3]){for(const c of cases){const a=solveClue(c.log);assert.equal(a.ok,false,c.name);assert.equal(a.code,'INVALID_INPUT',c.name);
 if(c.name.startsWith('throwing-accessor-')){let raw,exception;try{raw=solveReference(c.log);}catch(error){exception=error;}accessorObservations.push({seed,name:c.name,productionCode:a.code,productionReturnedErrorWithoutThrow:true,rawOracleThrew:exception!==undefined,rawOracleException:exception?String(exception.stack):null,rawOracleReturnedResult:raw??null,differentialPassCredited:false});}
 else{const b=solveReference(c.log);assert.equal(b.ok,false,c.name);assert.equal(b.code,a.code,c.name);records.push({seed,name:c.name,productionCode:a.code,unchangedReferenceCode:b.code,deeplyFrozenInput:true,returnedErrorWithoutThrow:true});}}
 frozenSource();}
assert.equal(records.length,141);assert.equal(accessorObservations.length,18);
const receipt={passed:true,attempt:4,consecutiveSuccessfulNoGainRound:2,concreteAudit:'All47 ordinary frozen malformed game-log shapes compared for all3seeds, plus6 separately scoped production throwing-accessor error controls. Raw reference getter exceptions remain actual oracle limitations; no wrapper or differential pass substituted.',ordinaryMalformedCases:47,actualSeededOrdinaryDifferentialCases:records.length,records,productionAccessorControls:accessorObservations.length,rawReferenceAccessorThrows:accessorObservations.filter(x=>x.rawOracleThrew).length,accessorObservations,referenceAccessorErrorAgreement:'UNVERIFIED: effectful getters are outside recorded data-log differential coverage',failedAttempt2NotCredited:true,currentPublicInputsFrozen:72,noLocalTimingMeasurement:true,additionalSubstantivePlayerGainFound:false,completedUTC:new Date().toISOString()};
writeFileSync(work+'/KEEP-4-FROZEN-DATA-PRODUCTION-ACCESSORS.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({...receipt,records:undefined,accessorObservations:undefined}));
