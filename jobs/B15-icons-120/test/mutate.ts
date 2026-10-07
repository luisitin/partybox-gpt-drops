/** Actual, sequential source-rewrite mutants, imported and exercised as executable JS. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { SvgCase,MaskCase } from './fixtures.js';
import type * as Check from '../src/check.js';
export interface Mutation { readonly id:string; readonly name:string; readonly from:string; readonly to:string; }
export const mutations:readonly Mutation[]=[
  {id:'M01',name:'Allow a 1501-byte file',from:'if (bytes > 1500)',to:'if (bytes > 1501)'},
  {id:'M02',name:'Wrong required viewBox',from:"root.viewBox !== '0 0 64 64'",to:"root.viewBox !== '0 0 63 64'"},
  {id:'M03',name:'Allow seven colors',from:'if (colors.length > 6)',to:'if (colors.length > 7)'},
  {id:'M04',name:'Skip SVG namespace validation',from:'if (root.xmlns !== NS)',to:'if (false && root.xmlns !== NS)'},
  {id:'M05',name:'Wrong root outline width',from:"root['stroke-width'] !== '4'",to:"root['stroke-width'] !== '3'"},
  {id:'M06',name:'Require square rather than round caps',from:"root['stroke-linecap'] !== 'round'",to:"root['stroke-linecap'] !== 'square'"},
  {id:'M07',name:'Require miter rather than round joins',from:"root['stroke-linejoin'] !== 'round'",to:"root['stroke-linejoin'] !== 'miter'"},
  {id:'M08',name:'Allow two XML roots',from:'if (roots !== 1)',to:'if (roots < 1)'},
  {id:'M09',name:'Allow silhouette equality at 0.8',from:'intersection * 5 < union * 4',to:'intersection * 5 <= union * 4'},
  {id:'M10',name:'Allow an empty SVG',from:'if (shapes === 0)',to:'if (shapes < 0)'},
  {id:'M11',name:'Allow zero circle radius',from:"name === 'circle' && Number(attrs.r) <= 0",to:"name === 'circle' && Number(attrs.r) < 0"},
  {id:'M12',name:'Allow zero horizontal ellipse radius',from:"name === 'ellipse' && Number(attrs.rx) <= 0",to:"name === 'ellipse' && Number(attrs.rx) < 0"},
  {id:'M13',name:'Allow zero rectangle width',from:"name === 'rect' && Number(attrs.width) <= 0",to:"name === 'rect' && Number(attrs.width) < 0"},
  {id:'M14',name:'Allow zero rectangle height',from:"name === 'rect' && Number(attrs.height) <= 0",to:"name === 'rect' && Number(attrs.height) < 0"},
  {id:'M15',name:'Allow zero vertical ellipse radius',from:"name === 'ellipse' && Number(attrs.ry) <= 0",to:"name === 'ellipse' && Number(attrs.ry) < 0"},
  {id:'M16',name:'Accept an incomplete line command',from:'L: 2, H: 1',to:'L: 1, H: 1'},
  {id:'M17',name:'Allow script and unknown elements',from:'if (!tags.has(name))',to:'if (false && !tags.has(name))'},
  {id:'M18',name:'Allow duplicate XML attributes',from:'if (Object.hasOwn(attrs, key))',to:'if (false && Object.hasOwn(attrs, key))'},
  {id:'M19',name:'Ignore mismatched closing tags',from:'if (stack.pop() !== name)',to:'if ((stack.pop(), false))'},
  {id:'M20',name:'Allow inline event-handler attributes',from:'if (!allowed.has(key))',to:'if (false && !allowed.has(key))'},
  {id:'M21',name:'Allow infinite coordinates',from:'if (!Number.isFinite(value))',to:'if (false && !Number.isFinite(value))'},
  {id:'M22',name:'Allow non-hex and external paints',from:'if (!/^#[\\da-f]{6}$/i.test(value))',to:'if (false && !/^#[\\da-f]{6}$/i.test(value))'},
  {id:'M23',name:'Corrupt the population-count mask',from:'0x55555555',to:'0x55555554'},
  {id:'M24',name:'Use intersection instead of union',from:'union += popcount((a[i] ?? 0) | (b[i] ?? 0));',to:'union += popcount((a[i] ?? 0) & (b[i] ?? 0));'},
  {id:'M25',name:'Exclude alpha exactly 128',from:'if (rgba[i + 3] >= 128)',to:'if (rgba[i + 3] > 128)'}
];
export const limitCases:readonly (readonly [number,number,boolean])[]=[
 [4,5,false],[3,5,true],[0,1,true],[1,1,false],[0,0,false],[-1,5,false],[6,5,false],[4.1,6,false],[799,1000,true],[800,1000,false],[801,1000,false]
];
export interface MutationResult extends Mutation { readonly seed:number;readonly killed:boolean;readonly killingCases:number;readonly firstFailure:string;readonly executedCases:number;readonly moduleSha256:string; }
export async function runMutations(root:string,seed:number,svgCases:readonly SvgCase[],maskCases:readonly MaskCase[],expectedMasks:readonly (readonly number[])[]):Promise<MutationResult[]> {
  const original=fs.readFileSync(path.join(root,'dist/src/check.js'),'utf8'),results:MutationResult[]=[];
  for(const mutation of mutations){
    if(original.split(mutation.from).length!==2) throw new Error('Mutation target not unique: '+mutation.id);
    const source=original.replace(mutation.from,mutation.to);
    const lib=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')+'#seed'+seed+'-'+mutation.id) as typeof Check;
    const failures:string[]=[];let executed=0;
    // Every vector is run, even after an earlier vector has already killed this mutant.
    for(const test of svgCases){executed++;try{if(lib.auditSvg(test.svg).valid!==test.valid)failures.push(test.name);}catch{failures.push(test.name+':exception');}}
    for(const [index,test] of maskCases.entries()){
      executed++;
      try{
        const left=lib.alphaMask(Uint8Array.from(test.a)),right=lib.alphaMask(Uint8Array.from(test.b));
        const value=left&&right?lib.compareMasks(left,right):undefined,expect=expectedMasks[index]!;
        if(!value||value.intersection!==expect[0]||value.union!==expect[1])failures.push(test.name);
      }catch{failures.push(test.name+':exception');}
    }
    for(const [i,u,expected] of limitCases){executed++;if(lib.belowLimit(i,u)!==expected)failures.push('limit-'+i+'-'+u);}
    results.push({...mutation,seed,killed:failures.length>0,killingCases:failures.length,firstFailure:failures[0]??'SURVIVED',executedCases:executed,moduleSha256:createHash('sha256').update(source).digest('hex')});
  }
  if(fs.readFileSync(path.join(root,'dist/src/check.js'),'utf8')!==original)throw new Error('Mutation polluted original module');
  return results;
}
