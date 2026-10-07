/** Independently authored from public B08 contract; no production imports. */
import { referenceStationary, type JailStrategy } from './reference.js';
export interface Property {
  readonly position:number; readonly name:string;
  readonly kind:'street'|'railroad'|'utility'; readonly color?:string;
  readonly purchasePrice:number; readonly houseCost:number; readonly rents:readonly number[];
}
export interface ROIRow {
  readonly position:number; readonly name:string; readonly scenario:string;
  readonly houseLevel:number|null; readonly ownedInSet:number;
  readonly investment:number; readonly ordinaryRent:number;
  readonly expectedRentPerRoll:number; readonly expectedRentPerOpponentTurn:number;
  readonly rentROIPerRoll:number; readonly rentROIPerOpponentTurn:number;
  readonly breakEvenRolls:number; readonly breakEvenOpponentTurns:number;
}
/** Direct enumeration of raw roll arrivals; extra rent applies only to Chance's nearest cards. */
export function referenceSpecialArrivalMass(strategy:JailStrategy):{railroad:number[];utility:number[]} {
  const result=referenceStationary(strategy);
  const railroad=Array<number>(40).fill(0),utility=Array<number>(40).fill(0);
  for(let state=0;state<120;state++) {
    const jailed=state>=117;
    const square=jailed?10:Math.floor(state/3)+(Math.floor(state/3)>=30?1:0);
    for(let d1=1;d1<=6;d1++)for(let d2=1;d2<=6;d2++) {
      const double=d1===d2;
      if(!jailed&&double&&state%3===2)continue;
      if(jailed&&strategy==='stay max'&&!double&&state<119)continue;
      const destination=(square+d1+d2)%40;
      if(destination!==7&&destination!==22&&destination!==36)continue;
      const mass=result.stateProbabilities[state]!/(36*16);
      const rail=destination===7?15:destination===22?25:5;
      const util=destination===22?28:12;
      railroad[rail]=railroad[rail]!+2*mass;
      utility[util]=utility[util]!+mass;
    }
  }
  return {railroad,utility};
}
export function referenceROI(strategy:JailStrategy,properties:readonly Property[]):ROIRow[] {
  const result=referenceStationary(strategy),special=referenceSpecialArrivalMass(strategy);
  const rows:ROIRow[]=[];
  for(const property of properties) {
    const add=(scenario:string,houseLevel:number|null,ownedInSet:number,ordinaryRent:number,specialRent:number):void=>{
      const investment=property.purchasePrice+(houseLevel===null?0:houseLevel*property.houseCost);
      const extra=property.kind==='railroad'?special.railroad[property.position]!:property.kind==='utility'?special.utility[property.position]!:0;
      const income=ordinaryRent*result.landing[property.position]!+extra*(specialRent-ordinaryRent);
      const perTurn=income/result.turnStartMass;
      rows.push({position:property.position,name:property.name,scenario,houseLevel,ownedInSet,investment,ordinaryRent,
        expectedRentPerRoll:income,expectedRentPerOpponentTurn:perTurn,rentROIPerRoll:income/investment,
        rentROIPerOpponentTurn:perTurn/investment,breakEvenRolls:investment/income,breakEvenOpponentTurns:investment/perTurn});
    };
    if(property.kind==='street') {
      const setSize=properties.filter(other=>other.kind==='street'&&other.color===property.color).length;
      add('street-alone',0,1,property.rents[0]!,property.rents[0]!);
      for(let level=0;level<=5;level++)add(`street-monopoly-${level}`,level,setSize,level===0?2*property.rents[0]!:property.rents[level]!,0);
    } else if(property.kind==='railroad') {
      for(let owned=1;owned<=4;owned++){const rent=property.rents[owned-1]!;add(`railroad-${owned}`,null,owned,rent,2*rent);}
    } else {
      for(let owned=1;owned<=2;owned++)add(`utility-${owned}`,null,owned,7*property.rents[owned-1]!,70);
    }
  }
  return rows;
}
