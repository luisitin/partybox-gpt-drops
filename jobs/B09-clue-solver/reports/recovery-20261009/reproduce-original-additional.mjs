import assert from 'node:assert/strict';
import {solveClue} from '../../jobs/B09-clue-solver/dist/clueSolver.js';
import {solveReference} from '../../jobs/B09-clue-solver/dist/reference.js';
import {createHash} from 'node:crypto';import{readFileSync,writeFileSync}from'node:fs';
const root='/tmp/gpt-drops-B09-audit-20261009',work=root+'/.work/20261009-audit';
const expected=JSON.parse(readFileSync(work+'/frozen-original-source-files.json','utf8'));
const freeze=()=>{for(const[n,e]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(root+'/'+n)).digest('hex'),e.sha256,n);};freeze();
const base={deck:{suspects:['s0','s1','s2'],weapons:['w0','w1','w2'],rooms:['r0','r1','r2','r3']},handSizes:[3,2,2],me:0,ownHand:['s0','w0','r0'],suggestions:[]};
const cases=[
{name:'array-shaped-game-log',log:Object.assign([],base)},
{name:'array-shaped-deck',log:{...base,deck:Object.assign([],base.deck)}},
{name:'typed-array-hand-sizes',log:{...base,handSizes:new Uint8Array([3,2,2])}},
{name:'explicit-null-shown',log:{...base,shown:null}},
{name:'set-shaped-shown',log:{...base,shown:new Set()}},
];
for(const category of['suspects','weapons','rooms']){const deck=structuredClone(base.deck);delete deck[category][2];cases.push({name:'sparse-deck-'+category,log:{...base,deck,handSizes:[3,2,1]}});}
const records=cases.map(c=>{const a=solveClue(c.log),b=solveReference(c.log);assert.equal(b.ok,false,c.name);assert.equal(b.code,'INVALID_INPUT',c.name);assert.equal(a.ok,true,c.name);return{name:c.name,actualOriginalProductionOK:a.ok,actualOriginalProductionDeals:String(a.totalDeals),actualUnchangedReferenceCode:b.code,realDefectReproduced:true};});
freeze();const receipt={reproduced:true,source:'2b39550d395bab5ea0ad5c18cae19c3f78fdd84c',additionalActualMalformedFalseSuccesses:records,sourceInputsFrozen:29,independentReferenceUnchanged:true,noLocalTimingMeasurement:true,completedUTC:new Date().toISOString(),scope:'Eight actual additional malformed runtime shapes accepted by original production and correctly rejected by unchanged independent reference. Same API validation weakness; counting algorithm untouched.'};writeFileSync(work+'/ORIGINAL-ADDITIONAL-VALIDATION-DEFECTS.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
