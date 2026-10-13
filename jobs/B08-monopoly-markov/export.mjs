import assert from 'node:assert/strict';
import { readFileSync,writeFileSync } from 'node:fs';
import { monopolyOdds,SQUARE_NAMES } from './build/monopolyOdds.js';
const strategies=['leave ASAP','stay max'];
const odds=strategies.map(strategy=>monopolyOdds(strategy));
const json=JSON.stringify({model:'US classic; IID 16-card decks; final occupancy per movement roll',
  squareNames:SQUARE_NAMES,strategies:odds},null,2)+'\n';
const columns=['strategy','position','name','kind','scenario','houseLevel','ownedInSet','investment','ordinaryRent',
  'landingProbability','expectedRentPerRoll','expectedRentPerOpponentTurn','rentROIPerRoll','rentROIPerOpponentTurn','breakEvenRolls','breakEvenOpponentTurns'];
const quote=value=>`"${String(value??'').replaceAll('"','""')}"`;
const rows=[columns,...odds.flatMap(result=>result.properties.flatMap(property=>property.levels.map(level=>
  columns.map(column=>({strategy:result.strategy,...property.property,landingProbability:property.landingProbability,...level})[column]))))];
const csv=rows.map(row=>row.map(quote).join(',')).join('\n')+'\n';
for(const [file,content] of [['odds.json',json],['roi.csv',csv]]) {
  if(process.argv.includes('--write'))writeFileSync(file,content);
  else assert.equal(readFileSync(file,'utf8'),content,`Computed ${file} agrees with delivered output`);
}
console.log(JSON.stringify({suite:'computed-outputs',passed:true,strategies:2,squares:80,roiRows:rows.length-1}));
