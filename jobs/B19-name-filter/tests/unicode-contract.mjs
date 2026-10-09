import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

// These are additive untimed contract cases. They do not enter the original
// 43,830-input mutation or 10,000-call performance workloads.
export function makeUnicodeCases(seed,rng){
 const rows=[];
 const add=(input,expected,kind)=>rows.push({input,expected,kind});
 const controls=[...Array.from({length:32},(_,i)=>i),...Array.from({length:33},(_,i)=>127+i),0x061c,0x200e,0x200f,0x202a,0x202b,0x202c,0x202d,0x202e,0x2066,0x2067,0x2068,0x2069];
 for(const point of controls){
  const c=String.fromCodePoint(point);
  for(const input of [c,'Alice'+c,c+'Alice','an'+c+'al','s'+c+'ex','analysis'+c,c.repeat(16)])add(input,'control','declared-control');
  add(c.repeat(17),'length','original-length-before-control');
 }
 for(let point=0xd800;point<=0xdfff;point++){
  const c=String.fromCharCode(point);
  for(const input of [c,'Alice'+c,c+'Alice',c.repeat(16)])add(input,'control','every-lone-surrogate');
  add(c.repeat(17),'length','original-length-before-surrogate');
 }
 const random=rng(seed^0x6b19c0de);
 const used=new Set();
 const categories=[['Cn',/^\p{Cn}$/u],['Co',/^\p{Co}$/u]];
 for(const [category,match] of categories){
  let count=0;
  while(count<2500){
   const point=Math.floor(random()*0x110000);
   const c=String.fromCodePoint(point);
   if(used.has(point)||!match.test(c))continue;
   used.add(point);count++;
   // Unspecified categories divide matching segments. Existing offending
   // substrings remain blocked; the character alone has no letter/number.
   add('an'+c+'al','ok',`${category}-barrier`);
   add(c+'Alex','ok',`${category}-benign`);
   add('sex'+c,'blocked',`${category}-no-exception`);
   add(c,'empty',`${category}-not-meaningful`);
  }
 }
 return rows;
}

export function verifyIndependentSeal(){
 const folder=new URL('./independent-unicode-20261009/',import.meta.url);
 const errors=[];
 const lines=readFileSync(new URL('SHA256SUMS.txt',folder),'utf8').trim().split('\n');
 const paths=new Set();let passed=0;
 for(const line of lines){
  const match=/^([0-9a-f]{64})  ([A-Za-z0-9._-]+)$/.exec(line);
  if(!match||paths.has(match[2])){errors.push({line,error:'Invalid or duplicate sealed path'});continue;}
  paths.add(match[2]);
  const bytes=readFileSync(new URL(match[2],folder));
  const actual=createHash('sha256').update(bytes).digest('hex');
  if(actual===match[1])passed++;else errors.push({path:match[2],expected:match[1],actual});
 }
 // Bind the externally authored code and original authored policy to their
 // actual pre-exposure seal, rather than accepting a self-rewritten manifest.
 const identities=[['reference.mjs','a93b35e3170122b2fd0a77619eff36716c3b9fc2f4c47f3bfce1971778a76e71'],['seal.json','a8cded0ef5e4bf8da574184baabdfa57e9103c43981e8bc9019085ff0b9b1511']];
 for(const [path,expected] of identities){
  const actual=createHash('sha256').update(readFileSync(new URL(path,folder))).digest('hex');
  if(actual===expected)passed++;else errors.push({path,expected,actual});
 }
 const policyMatches=readFileSync(new URL('policy.json',folder)).equals(readFileSync(new URL('../data/policy.json',import.meta.url)));
 if(policyMatches)passed++;else errors.push({path:'data/policy.json',error:'Current policy differs from authored public snapshot'});
 return {cases:lines.length+identities.length+1,passed,errors};
}

const controls=String.raw`const CONTROLS = /[\u0000-\u001f\u007f-\u009f\ud800-\udfff\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;`;
export const unicodeMutations=[
 ...['061c','200e','200f'].map(code=>[`U-${code}`,`Accept U+${code.toUpperCase()} bidi control`,controls,controls.replace(`\\u${code}`,'')]),
 ['U-unknown','Delete unmapped private-use and unassigned barriers',"text += '~';","text += '';"],
];
