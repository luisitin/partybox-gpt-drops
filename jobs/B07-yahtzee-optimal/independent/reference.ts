export type RuleMode = 'official' | 'published';
export interface Scorecard { readonly usedMask:number; readonly upper:number; readonly yahtzeeBonus:boolean; readonly ruleMode?:RuleMode; }
export interface ScoreResult { readonly legal:boolean; readonly points:number; readonly yahtzeeBonus:number; readonly upperBonus:number; readonly next:Scorecard; }
export interface CategoryResult extends ScoreResult { readonly category:number; readonly expectedValue:number; }
export interface HoldResult { readonly hold:readonly number[]; readonly expectedValue:number; }
type Normalized=Scorecard & { readonly ruleMode:RuleMode };
type Counts=readonly number[];
interface Bag { readonly counts:Counts; readonly dice:readonly number[]; readonly weight:number; }
interface Edge { readonly roll:number; readonly weight:number; }
const FULL=8191;
const reach:ReadonlySet<number>[]=[];
for(let mask=0;mask<64;mask++) {
  let values=new Set([0]);
  for(let face=1;face<=6;face++) if(mask & (1 << (face-1))) {
    const next=new Set<number>();
    for(const v of values)for(let count=0;count<=5;count++)next.add(Math.min(63,v+face*count));
    values=next;
  }
  reach.push(values);
}
function normalized(input:unknown):Normalized {
  if(input===null||typeof input!=='object'||Array.isArray(input))throw new RangeError('scorecard object');
  const o=input as Record<string,unknown>,mask=o['usedMask'],upper=o['upper'],bonus=o['yahtzeeBonus'],mode=o['ruleMode']===undefined?'official':o['ruleMode'];
  if(typeof mask!=='number'||!Number.isInteger(mask)||mask<0||mask>FULL||typeof upper!=='number'||!Number.isInteger(upper)||upper<0||upper>63||typeof bonus!=='boolean'||(mode!=='official'&&mode!=='published')||(bonus&&(mask&2048)===0)||!reach[mask&63]?.has(upper))throw new RangeError('scorecard fields');
  return {usedMask:mask,upper,yahtzeeBonus:bonus,ruleMode:mode};
}
function dice(input:unknown):number[] {
  if(!Array.isArray(input)||input.length!==5)throw new RangeError('five dice');
  const result:number[]=[];
  for(let i=0;i<5;i++){const face:unknown=input[i];if(typeof face!=='number'||!Number.isInteger(face)||face<1||face>6)throw new RangeError('die face');result.push(face);}
  return result.sort((a,b)=>a-b);
}
function factorial(n:number):number {let v=1;for(let i=2;i<=n;i++)v*=i;return v;}
function code(counts:Counts):number {let v=0,m=1;for(const n of counts){v+=n*m;m*=6;}return v;}
function countsOf(roll:readonly number[]):number[]{const c=[0,0,0,0,0,0];for(const face of roll)c[face-1]=(c[face-1]??0)+1;return c;}
const bags:Bag[][]=[];
function enumerate(total:number):Bag[]{
  const rows:Bag[]=[];
  function recurse(face:number,left:number,counts:number[]):void {
    if(face===5){const c=[...counts,left],d:number[]=[];let denominator=1;for(let i=0;i<6;i++){const n=c[i]??0;denominator*=factorial(n);for(let k=0;k<n;k++)d.push(i+1);}rows.push({counts:c,dice:d,weight:factorial(total)/denominator});return;}
    for(let n=0;n<=left;n++)recurse(face+1,left-n,[...counts,n]);
  }
  recurse(0,total,[]);
  rows.sort((a,b)=>lex(a.dice,b.dice));return rows;
}
function lex(a:readonly number[],b:readonly number[]):number {for(let i=0;i<Math.min(a.length,b.length);i++){const d=(a[i]??0)-(b[i]??0);if(d)return d;}return a.length-b.length;}
for(let n=0;n<=5;n++)bags.push(enumerate(n));
const rolls=bags[5]??[];
const rollIndex=new Map(rolls.map((b,i)=>[code(b.counts),i]));
const holds=bags.flat().sort((a,b)=>lex(a.dice,b.dice));
const outcomes:Edge[][]=holds.map(held=>{
  const n=5-held.dice.length;
  return (bags[n]??[]).map(rolled=>{
    const c=held.counts.map((v,i)=>v+(rolled.counts[i]??0));
    const r=rollIndex.get(code(c));if(r===undefined)throw new Error('completion');return {roll:r,weight:rolled.weight/(6**n)};
  });
});
const legalHolds:number[][]=rolls.map(r=>holds.flatMap((h,i)=>h.counts.every((n,f)=>n<=(r.counts[f]??0))?[i]:[]));
const emptyHold=holds.findIndex(h=>h.dice.length===0);
const initial:Scorecard={usedMask:0,upper:0,yahtzeeBonus:false};
function write(d:readonly number[],category:number,card:Normalized):ScoreResult {
  const c=countsOf(d),sum=d.reduce((a,b)=>a+b,0),equal=d[0]===d[4],face=(d[0]??1)-1;
  const extra=equal&&(card.usedMask&2048)!==0,matchingFilled=(card.usedMask&(1<<face))!==0;
  let legal=(card.usedMask&(1<<category))===0;
  if(card.ruleMode==='official'&&extra){
    if(!matchingFilled)legal&&=category===face;
    else if(((FULL^card.usedMask)&8128)!==0)legal&&=category>=6;
  }
  if(!legal)return {legal:false,points:0,yahtzeeBonus:0,upperBonus:0,next:{...card}};
  const joker=extra&&matchingFilled;
  let points=0;
  if(category<6)points=(category+1)*(c[category]??0);
  else if(category===6)points=c.some(n=>n>=3)?sum:0;
  else if(category===7)points=c.some(n=>n>=4)?sum:0;
  else if(category===8)points=joker||(c.includes(3)&&c.includes(2))?25:0;
  else if(category===9){for(let start=0;start<3;start++)if(c.slice(start,start+4).every(n=>n>0))points=30;if(joker)points=30;}
  else if(category===10)points=joker||c.slice(0,5).every(n=>n>0)||c.slice(1,6).every(n=>n>0)?40:0;
  else if(category===11)points=equal?50:0;
  else points=sum;
  const upper=category<6?Math.min(63,card.upper+points):card.upper;
  return {legal:true,points,yahtzeeBonus:extra&&card.yahtzeeBonus?100:0,upperBonus:card.upper<63&&upper===63?35:0,next:{usedMask:card.usedMask|(1<<category),upper,yahtzeeBonus:card.yahtzeeBonus||(category===11&&points===50),ruleMode:card.ruleMode}};
}
export function score(input:unknown,category:unknown,inputCard:unknown=initial):ScoreResult {
  const d=dice(input),card=normalized(inputCard);
  if(typeof category!=='number'||!Number.isInteger(category)||category<0||category>12)throw new RangeError('category');
  return write(d,category,card);
}
function tableIndex(card:Scorecard):number{return card.usedMask+card.upper*8192+(card.yahtzeeBonus?524288:0);}
interface Turn { readonly categories:Int8Array; readonly zero:Float64Array; readonly one:Float64Array; readonly two:Float64Array; readonly holdsOne:Int16Array; readonly holdsTwo:Int16Array; }
export function createReference(officialInput:Readonly<Float64Array>,publishedInput:Readonly<Float64Array>) {
  if(officialInput.length!==1048576||publishedInput.length!==1048576)throw new RangeError('table length');
  const official=new Float64Array(officialInput),published=new Float64Array(publishedInput);
  const cache=new Map<number,Turn>();
  function future(card:Scorecard):number {if(card.usedMask===FULL)return 0;const table=card.ruleMode==='published'?published:official;const v=table[tableIndex(card)];if(v===undefined||!Number.isFinite(v))throw new RangeError('uncomputed valid table state');return v;}
  function evaluate(card:Normalized):Turn {
    if(card.usedMask===FULL)throw new RangeError('full card');
    const key=tableIndex(card)+(card.ruleMode==='published'?1048576:0),found=cache.get(key);if(found)return found;
    const zero=new Float64Array(252),categories=new Int8Array(252);
    for(let r=0;r<252;r++){
      let best=-Infinity,chosen=-1;
      const d=rolls[r]?.dice;if(!d)throw new Error('roll');
      for(let category=0;category<13;category++){const s=write(d,category,card);if(!s.legal)continue;const value=s.points+s.yahtzeeBonus+s.upperBonus+future(s.next);if(value>best){best=value;chosen=category;}}
      zero[r]=best;categories[r]=chosen;
    }
    function reroll(previous:Float64Array):{values:Float64Array;policy:Int16Array}{
      const averaged=new Float64Array(462),values=new Float64Array(252),policy=new Int16Array(252);
      for(let h=0;h<462;h++){let v=0;for(const edge of outcomes[h]??[])v+=edge.weight*(previous[edge.roll]??NaN);averaged[h]=v;}
      for(let r=0;r<252;r++){let best=-Infinity,choice=-1;for(const h of legalHolds[r]??[]){const v=averaged[h]??NaN;if(v>best){best=v;choice=h;}}values[r]=best;policy[r]=choice;}
      return {values,policy};
    }
    const one=reroll(zero),two=reroll(one.values);
    const turn={categories,zero,one:one.values,two:two.values,holdsOne:one.policy,holdsTwo:two.policy};
    if(cache.size>=4096){const old=cache.keys().next().value;if(old!==undefined)cache.delete(old);}
    cache.set(key,turn);return turn;
  }
  function expectedValue(inputCard:unknown=initial):number{return future(normalized(inputCard));}
  function bestCategory(input:unknown,inputCard:unknown):CategoryResult {
    const d=dice(input),card=normalized(inputCard),turn=evaluate(card),r=rollIndex.get(code(countsOf(d)));
    if(r===undefined)throw new Error('roll lookup');const category=turn.categories[r];if(category===undefined||category<0)throw new Error('category lookup');
    return {...write(d,category,card),category,expectedValue:turn.zero[r]??NaN};
  }
  function bestHold(input:unknown,rollsLeft:unknown,inputCard:unknown):HoldResult {
    const d=dice(input),card=normalized(inputCard);
    if(typeof rollsLeft!=='number'||!Number.isInteger(rollsLeft)||rollsLeft<0||rollsLeft>2)throw new RangeError('rerolls');
    const turn=evaluate(card),r=rollIndex.get(code(countsOf(d)));if(r===undefined)throw new Error('roll lookup');
    if(rollsLeft===0)return {hold:[...d],expectedValue:turn.zero[r]??NaN};
    const layer=rollsLeft===1?turn.one:turn.two,policy=rollsLeft===1?turn.holdsOne:turn.holdsTwo;
    const h=policy[r];if(h===undefined)throw new Error('hold policy');
    const bag=holds[h];if(!bag)throw new Error('hold lookup');return {hold:[...bag.dice],expectedValue:layer[r]??NaN};
  }
  // Enumerates every ordered replacement roll rather than using the compressed
  // completion weights. This is a separate within-turn arithmetic cross-check.
  function bruteHoldValue(input:unknown,heldInput:unknown,rollsLeft:unknown,inputCard:unknown):number {
    const d=dice(input),card=normalized(inputCard);
    if(!Array.isArray(heldInput)||heldInput.length>5)throw new RangeError('hold');
    const held:number[]=[];for(let i=0;i<heldInput.length;i++){const f:unknown=heldInput[i];if(typeof f!=='number'||!Number.isInteger(f)||f<1||f>6)throw new RangeError('held face');held.push(f);}
    const dc=countsOf(d),hc=countsOf(held);if(hc.some((n,i)=>n>(dc[i]??0)))throw new RangeError('hold subset');
    if(rollsLeft!==1&&rollsLeft!==2)throw new RangeError('brute rerolls');
    const turn=evaluate(card),layer=rollsLeft===1?turn.zero:turn.one;let sum=0,cases=0;
    function walk(rolled:number[]):void {if(held.length+rolled.length===5){const index=rollIndex.get(code(countsOf([...held,...rolled])));if(index===undefined)throw new Error('brute lookup');sum+=layer[index]??NaN;cases++;return;}for(let face=1;face<=6;face++)walk([...rolled,face]);}
    walk([]);return sum/cases;
  }
  function recomputedExpectedValue(inputCard:unknown=initial):number {
    const card=normalized(inputCard);if(card.usedMask===FULL)return 0;const turn=evaluate(card);let sum=0;for(const e of outcomes[emptyHold]??[])sum+=e.weight*(turn.two[e.roll]??NaN);return sum;
  }
  return {score,expectedValue,bestCategory,bestHold,bruteHoldValue,recomputedExpectedValue};
}
