/** Pure deterministic Yahtzee decisions over independently generated solved states. */
import officialTable from './tables/official.json' with { type: 'json' };
import publishedTable from './tables/published.json' with { type: 'json' };

export const CATEGORIES = ['ones','twos','threes','fours','fives','sixes','threeKind','fourKind',
  'fullHouse','smallStraight','largeStraight','yahtzee','chance'] as const;
export type RuleMode = 'official' | 'published';
export interface Scorecard {
  readonly usedMask: number;
  readonly upper: number;
  readonly yahtzeeBonus: boolean;
  readonly ruleMode?: RuleMode;
}
export interface ScoreResult {
  readonly legal: boolean;
  readonly points: number;
  readonly yahtzeeBonus: number;
  readonly upperBonus: number;
  readonly next: Scorecard;
}
export interface CategoryResult extends ScoreResult {
  readonly category: number;
  readonly expectedValue: number;
}
export interface HoldResult { readonly hold: readonly number[]; readonly expectedValue: number }
export const EMPTY_CARD: Scorecard = Object.freeze({ usedMask:0,upper:0,yahtzeeBonus:false,ruleMode:'official' });
const ALL=8191, YAHTZEE=2048, FULL_FIRST=210, HAND_COUNT=462;
const reachability: readonly ReadonlySet<number>[] = Array.from({length:64},(_,mask)=>{
  let sums=new Set<number>([0]);
  for(let face=1;face<=6;face++) if(mask&(1<<(face-1))) {
    const next=new Set<number>();
    for(const sum of sums) for(let count=0;count<=5;count++) next.add(Math.min(63,sum+face*count));
    sums=next;
  }
  return sums;
});
function fail(message:string):never { throw new RangeError(message); }
function cardInput(card:Scorecard):Scorecard & {readonly ruleMode:RuleMode} {
  if(typeof card!=='object'||card===null||Array.isArray(card)||!Number.isInteger(card.usedMask)
    ||card.usedMask<0||card.usedMask>ALL||!Number.isInteger(card.upper)||card.upper<0||card.upper>63
    ||typeof card.yahtzeeBonus!=='boolean'||(card.yahtzeeBonus&&!(card.usedMask&YAHTZEE))
    ||!reachability[card.usedMask&63]!.has(card.upper))fail('Invalid scorecard');
  const ruleMode=card.ruleMode===undefined?'official':card.ruleMode;
  if(ruleMode!=='official'&&ruleMode!=='published')fail('Invalid rule mode');
  return {usedMask:card.usedMask,upper:card.upper,yahtzeeBonus:card.yahtzeeBonus,ruleMode};
}
function diceInput(dice:readonly number[]):number[] {
  if(!Array.isArray(dice)||dice.length!==5)fail('Exactly five dice required');
  const result:number[]=[];
  for(const face of dice) {if(!Number.isInteger(face)||face<1||face>6)fail('Invalid die face');result.push(face);}
  return result.sort((a,b)=>a-b);
}
function categoryInput(category:number):void {
  if(!Number.isInteger(category)||category<0||category>=13)fail('Invalid category');
}
function countsOf(dice:readonly number[]):number[] {
  const counts=Array<number>(6).fill(0);for(const face of dice)counts[face-1]=counts[face-1]!+1;return counts;
}
function baseScore(counts:readonly number[],category:number):number {
  if(category<6)return counts[category]!*(category+1);
  let sum=0,max=0,bits=0,pair=false,triple=false;
  for(let f=0;f<6;f++){const n=counts[f]!;sum+=(f+1)*n;max=Math.max(max,n);if(n)bits|=1<<f;pair ||= n===2;triple ||= n===3;}
  switch(category){
    case 6:return max>=3?sum:0;
    case 7:return max>=4?sum:0;
    case 8:return pair&&triple?25:0;
    case 9:return (bits&15)===15||(bits&30)===30||(bits&60)===60?30:0;
    case 10:return bits===31||bits===62?40:0;
    case 11:return max===5?50:0;
    case 12:return sum;
    default:return fail('Invalid category');
  }
}
function write(counts:readonly number[],category:number,card:Scorecard & {readonly ruleMode:RuleMode}):ScoreResult {
  const open=ALL^card.usedMask;
  const face=counts.findIndex(count=>count===5);
  const extra=face>=0&&Boolean(card.usedMask&YAHTZEE);
  let legal=open;
  if(extra&&card.ruleMode==='official') {
    if(open&(1<<face))legal=1<<face;
    else if(open&~63)legal=open&~63;
  }
  if(!(legal&(1<<category)))return {legal:false,points:0,yahtzeeBonus:0,upperBonus:0,next:card};
  let points=baseScore(counts,category);
  if(extra&&(card.usedMask&(1<<face))) {
    if(category===8)points=25;else if(category===9)points=30;else if(category===10)points=40;
  }
  const upper=category<6?Math.min(63,card.upper+points):card.upper;
  return {legal:true,points,yahtzeeBonus:face>=0&&card.yahtzeeBonus?100:0,
    upperBonus:category<6&&card.upper<63&&card.upper+points>=63?35:0,
    next:{usedMask:card.usedMask|(1<<category),upper,yahtzeeBonus:card.yahtzeeBonus||(category===11&&points===50),ruleMode:card.ruleMode}};
}
export function score(dice:readonly number[],category:number,scorecard:Scorecard=EMPTY_CARD):ScoreResult {
  categoryInput(category);return write(countsOf(diceInput(dice)),category,cardInput(scorecard));
}
function tableValue(card:Scorecard & {readonly ruleMode:RuleMode}):number {
  const index=card.usedMask+card.upper*8192+(card.yahtzeeBonus?524288:0);
  const value=(card.ruleMode==='official'?officialTable:publishedTable)[index];
  if(value===null||value===undefined||!Number.isFinite(value))return fail('Missing solved state');
  return value;
}
export function expectedValue(scorecard:Scorecard=EMPTY_CARD):number {return tableValue(cardInput(scorecard));}
function categoryChoice(counts:readonly number[],card:Scorecard & {readonly ruleMode:RuleMode}):CategoryResult {
  if(card.usedMask===ALL)fail('No open categories');
  let best:CategoryResult|undefined;
  for(let category=0;category<13;category++) {
    const result=write(counts,category,card);if(!result.legal)continue;
    const value=result.points+result.yahtzeeBonus+result.upperBonus+tableValue(cardInput(result.next));
    if(best===undefined||value>best.expectedValue)best={...result,category,expectedValue:value};
  }
  return best??fail('No legal category');
}
export function bestCategory(dice:readonly number[],scorecard:Scorecard):CategoryResult {
  return categoryChoice(countsOf(diceInput(dice)),cardInput(scorecard));
}

interface Hand {readonly dice:readonly number[];readonly counts:readonly number[];readonly code:number}
const powers:readonly number[]=[1,6,36,216,1296,7776];
const handData:Hand[]=[];
function enumerateDice(target:number,minimum:number,dice:readonly number[]):void {
  if(dice.length===target){const counts=countsOf(dice);const code=counts.reduce((sum,count,f)=>sum+count*powers[f]!,0);
    handData.push({dice:dice.slice(),counts,code});return;}
  for(let face=minimum;face<=6;face++)enumerateDice(target,face,[...dice,face]);
}
for(let size=0;size<=5;size++)enumerateDice(size,1,[]);
if(handData.length!==HAND_COUNT)throw new Error('Hand inventory invariant');
const handIds=new Map(handData.map((hand,id)=>[hand.code,id]));
function lex(left:readonly number[],right:readonly number[]):number {
  for(let i=0;i<Math.min(left.length,right.length);i++)if(left[i]!==right[i])return left[i]!-right[i]!;
  return left.length-right.length;
}
const rank=Array<number>(HAND_COUNT).fill(0);
handData.map((_,id)=>id).sort((a,b)=>lex(handData[a]!.dice,handData[b]!.dice)).forEach((id,order)=>{rank[id]=order;});
const plus=handData.map(hand=>powers.map(power=>hand.dice.length<5?handIds.get(hand.code+power)!:-1));
const minus=handData.map(hand=>powers.map((power,f)=>hand.counts[f]!>0?handIds.get(hand.code-power)!:-1));
function average(values:Float64Array):void {
  for(let hand=FULL_FIRST-1;hand>=0;hand--){let total=0;for(let face=0;face<6;face++)total+=values[plus[hand]![face]!]!;values[hand]=total/6;}
}
function maximize(values:Float64Array):Int16Array {
  const choices=new Int16Array(HAND_COUNT);
  for(let hand=0;hand<HAND_COUNT;hand++) {
    choices[hand]=hand;
    for(let face=0;face<6;face++){const prior=minus[hand]![face]!;if(prior<0)continue;
      if(values[prior]!>values[hand]!||(values[prior]===values[hand]&&rank[choices[prior]!]!<rank[choices[hand]!]!)){
        values[hand]=values[prior]!;choices[hand]=choices[prior]!;}}
  }
  return choices;
}
function endValues(card:Scorecard & {readonly ruleMode:RuleMode}):Float64Array {
  const values=new Float64Array(HAND_COUNT);
  for(let hand=FULL_FIRST;hand<HAND_COUNT;hand++)values[hand]=categoryChoice(handData[hand]!.counts,card).expectedValue;
  return values;
}
export function bestHold(dice:readonly number[],rollsLeft:number,scorecard:Scorecard):HoldResult {
  const sorted=diceInput(dice),card=cardInput(scorecard);
  if(!Number.isInteger(rollsLeft)||rollsLeft<0||rollsLeft>2)fail('Invalid remaining rolls');
  if(card.usedMask===ALL)fail('No open categories');
  if(rollsLeft===0)return {hold:sorted,expectedValue:categoryChoice(countsOf(sorted),card).expectedValue};
  const counts=countsOf(sorted),code=counts.reduce((sum,count,face)=>sum+count*powers[face]!,0),id=handIds.get(code)!;
  const values=endValues(card);let choices:Int16Array|undefined;
  for(let remaining=1;remaining<=rollsLeft;remaining++){average(values);choices=maximize(values);}
  return {hold:handData[choices![id]!]!.dice.slice(),expectedValue:values[id]!};
}
/** Independent tests can directly value a proposed hold without trusting bestHold. */
export function valueOfHold(dice:readonly number[],hold:readonly number[],rollsLeft:number,scorecard:Scorecard):number {
  const sorted=diceInput(dice),card=cardInput(scorecard);
  if(card.usedMask===ALL||!Number.isInteger(rollsLeft)||rollsLeft<1||rollsLeft>2||!Array.isArray(hold)||hold.length>5)fail('Invalid hold query');
  const available=countsOf(sorted),kept=Array<number>(6).fill(0);
  for(const face of hold){if(!Number.isInteger(face)||face<1||face>6)fail('Invalid held face');kept[face-1]=kept[face-1]!+1;}
  for(let f=0;f<6;f++)if(kept[f]!>available[f]!)fail('Hold is not a submultiset');
  const code=kept.reduce((sum,count,f)=>sum+count*powers[f]!,0),id=handIds.get(code)!;
  const values=endValues(card);
  if(rollsLeft===2){average(values);maximize(values);}
  average(values);return values[id]!;
}
