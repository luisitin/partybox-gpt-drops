import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const cards=['pink','white','blue','yellow','orange','black','red','green','locomotive'];
export const inventory=n=>Object.fromEntries(cards.map(c=>[c,n]));
export const game=n=>({playerCount:n,players:Array.from({length:n},(_,i)=>({id:`p${i}`,cards:inventory(12),trainsRemaining:45,ticketIds:[]})),claims:{}});
export const edge=(id,a,b,length,color='gray')=>({id,a,b,length,color});
export const hash=text=>createHash('sha256').update(text).digest('hex');
const frozen=new WeakSet();export function freeze(value){if(value&&typeof value==='object'&&!frozen.has(value)){Object.freeze(value);frozen.add(value);for(const v of Object.values(value))freeze(v);}return value;}
export function compare(p,r,name,args,label){const before=JSON.stringify(args);freeze(args);const call=fn=>{try{return{value:fn(...args)};}catch(e){return{error:e.constructor.name};}};const a=call(p[name]),b=call(r[name]);assert.deepEqual(a,b,label);assert.equal(JSON.stringify(args),before,`${label}: pure inputs`);return a;}
