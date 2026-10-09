import assert from 'node:assert/strict';
import {solveClue} from '../../jobs/B09-clue-solver/dist/clueSolver.js';
import {solveReference} from '../../jobs/B09-clue-solver/dist/reference.js';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
const root='/tmp/gpt-drops-B09-audit-20261009',work=root+'/.work/20261009-audit';
const expected=JSON.parse(readFileSync(work+'/frozen-original-source-files.json','utf8'));
const freeze=()=>{for(const[n,e]of Object.entries(expected))assert.equal(createHash('sha256').update(readFileSync(root+'/'+n)).digest('hex'),e.sha256,n);};
freeze();
const base={deck:{suspects:['s0','s1','s2'],weapons:['w0','w1','w2'],rooms:['r0','r1','r2','r3']},handSizes:[3,2,2],me:0,ownHand:['s0','w0','r0'],suggestions:[]};
const cases=[];
for(let k=0;k<3;k++){const cards=['s1','w1','r1'];delete cards[k];cases.push({name:'sparse-suggestion-hole-'+k,log:{...base,suggestions:[{player:0,cards,refutedBy:1}]},presentIndices:[0,1,2].map(i=>Object.hasOwn(cards,i))});}
const classic={handSizes:[3,3,3,3,3,3],me:0,ownHand:['Green','Candlestick','Ballroom'],suggestions:[]};
cases.push({name:'explicit-null-deck',log:{...classic,deck:null}});
const records=cases.map(c=>{const a=solveClue(c.log),b=solveReference(c.log);assert.equal(b.ok,false,c.name);assert.equal(b.code,'INVALID_INPUT',c.name);assert.equal(a.ok,true,c.name);return{name:c.name,actualOriginalProductionOK:a.ok,actualOriginalProductionDeals:String(a.totalDeals),actualUnchangedReferenceOK:b.ok,actualUnchangedReferenceCode:b.code,presentIndices:c.presentIndices??null,realDefectReproduced:true};});
for(const log of[base,classic]){const a=solveClue(log),b=solveReference(log);assert(a.ok&&b.ok);assert.equal(a.totalDeals,b.totalDeals);}
freeze();
const receipt={reproduced:true,source:'2b39550d395bab5ea0ad5c18cae19c3f78fdd84c',actualOriginalFailures:records,knownValidControls:2,sourceInputsFrozen:29,independentReferenceUnchanged:true,currentLocalTimingNotMeasured:true,completedUTC:new Date().toISOString(),scope:'Four actual original production false successes on malformed runtime inputs while the unchanged independent reference correctly returns INVALID_INPUT.'};
writeFileSync(work+'/ORIGINAL-VALIDATION-DEFECTS.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
