import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';
import{referenceDeltaE,referenceLab,referenceSimulate,referenceLuminance,referenceContrast,referenceFromHex}from'../dist/reference.js';
export const sharma=(await readFile(new URL('../sharma34.txt',import.meta.url),'utf8')).trim().split('\n').map(line=>line.trim().split(/\s+/).map(Number));
export function close(actual,expected,tolerance,label){assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${label}: ${actual} vs ${expected}`);}
export function independentRng(seed){let value=seed>>>0;return()=>{value=(value*1664525+1013904223)%4294967296;return value/4294967296;};}
export function probe(p,seed,count=100){
 for(const v of sharma){const a=v.slice(0,3),b=v.slice(3,6),actual=p.deltaE(a,b),reference=referenceDeltaE(a,b);close(actual,v[6],.00005,'Sharma four decimal tolerance');assert.equal(actual.toFixed(4),v[6].toFixed(4),'Sharma rounded four decimals');close(actual,reference,1e-9,'independent CIEDE2000');}
 const special=[[0,0,0],[1,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[.02,.04,.041],[.0001,.5,.9]],random=independentRng(seed);let maxError=0;
 for(let i=0;i<count+special.length;i++){
  const rgb=i<special.length?special[i]:[random(),random(),random()],other=[random(),random(),random()],before=rgb.slice(),b=p.rgbToLab(other),rb=referenceLab(other);
  for(const mode of ['normal','protan','deutan','tritan']){
   let sim;assert.doesNotThrow(()=>{sim=p.simulate(rgb,mode)},`${mode} valid RGB simulation`);const refSim=referenceSimulate(rgb,mode),lab=p.rgbToLab(sim),refLab=referenceLab(refSim);
   assert.notEqual(sim,rgb,'simulation must return fresh RGB');for(let k=0;k<3;k++){close(sim[k],refSim[k],1e-12,'independent Machado');close(lab[k],refLab[k],1e-10,'independent Lab');maxError=Math.max(maxError,Math.abs(sim[k]-refSim[k]),Math.abs(lab[k]-refLab[k]));assert.ok(sim[k]>=0&&sim[k]<=1,'simulated gamut');}
   const delta=p.deltaE(lab,b),reference=referenceDeltaE(refLab,rb);close(delta,reference,1e-9,'independent color distance');close(p.deltaE(b,lab),delta,1e-9,'CIEDE symmetry');assert.equal(p.deltaE(lab,lab),0,'CIEDE identity');maxError=Math.max(maxError,Math.abs(delta-reference));
  }
  close(p.luminance(rgb),referenceLuminance(rgb),1e-12,'independent luminance');close(p.contrast(rgb,other),referenceContrast(rgb,other),1e-11,'independent contrast');assert.deepEqual(rgb,before,'color math preserves input');
 }
 close(p.linear(.02),.02/12.92,1e-15,'low gamma branch');close(p.encoded(.001),.001*12.92,1e-15,'low encode branch');close(p.encoded(.5),1.055*.5**(1/2.4)-.055,1e-15,'high encode branch');
 assert.equal(p.contrast([0,0,0],[1,1,1]),21);assert.equal(p.contrast([1,1,1],[1,1,1]),1);
 for(const hex of ['#000000','#FFFFFF','#121218','#F7F5F0','#0180FE'])assert.deepEqual(p.fromHex(hex),referenceFromHex(hex),'hex decoding');
 return{sharma:34,rgbCases:count+special.length,modeCases:4*(count+special.length),maxIndependentError:maxError};
}
