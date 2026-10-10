import assert from 'node:assert/strict';import fs from 'node:fs';
import {referenceStationary}from './dist/reference.js';
import{referenceROI,referenceSpecialArrivalMass}from './dist/roi-reference.js';
let checks=0;const near=(a,b)=>{assert.ok(Math.abs(a-b)<1e-12);checks++;};
const properties=[{position:1,name:'Brown A',kind:'street',color:'brown',purchasePrice:60,houseCost:50,rents:[2,10,30,90,160,250]}, {position:3,name:'Brown B',kind:'street',color:'brown',purchasePrice:60,houseCost:50,rents:[4,20,60,180,320,450]}, {position:5,name:'Rail',kind:'railroad',purchasePrice:200,houseCost:0,rents:[25,50,100,200]}, {position:12,name:'Utility',kind:'utility',purchasePrice:150,houseCost:0,rents:[4,10]}];
for(const strategy of ['leave ASAP','stay max']){
 const pi=referenceStationary(strategy),mass=referenceSpecialArrivalMass(strategy),rows=referenceROI(strategy,properties);
 assert.equal(rows.length,20);checks++;
 const brown=rows.filter(x=>x.position===1);near(brown[0].ordinaryRent,2);near(brown[1].ordinaryRent,4);near(brown[6].investment,310);near(brown[6].ordinaryRent,250);
 for(const x of rows){near(x.expectedRentPerOpponentTurn*pi.turnStartMass,x.expectedRentPerRoll);near(x.rentROIPerRoll*x.investment,x.expectedRentPerRoll);near(x.breakEvenRolls*x.expectedRentPerRoll,x.investment);}
 const utility=rows.filter(x=>x.position===12);near(utility[0].expectedRentPerRoll,28*pi.landing[12]+42*mass.utility[12]);near(utility[1].expectedRentPerRoll,70*pi.landing[12]);
 const rail=rows.filter(x=>x.position===5);near(rail[0].expectedRentPerRoll,25*(pi.landing[5]+mass.railroad[5]));near(rail[3].expectedRentPerRoll,200*(pi.landing[5]+mass.railroad[5]));
 for(let i=0;i<40;i++) {if(![5,15,25].includes(i))near(mass.railroad[i],0);if(![12,28].includes(i))near(mass.utility[i],0);}
 near(mass.railroad.reduce((a,b)=>a+b,0),2*mass.utility.reduce((a,b)=>a+b,0));
}
fs.writeFileSync('/workspace/blind-b08/ROI-SELFCHECK.json',JSON.stringify({checks,status:'passed',limitations:'Selfchecks test internal equations and direct arrival enumeration; production comparison follows sealing.'},null,2)+'\n');console.log({checks,status:'passed'});
