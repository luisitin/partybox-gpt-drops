import{readFile,writeFile,mkdir,rm,copyFile}from'node:fs/promises';import{execFileSync}from'node:child_process';import{resolve}from'node:path';import assert from'node:assert/strict';
export const BUGS=[
 ['wrong sRGB gamma threshold','c<=.04045','c<=.004045'],
 ['wrong linear low-branch divisor','c/12.92','c/12.29'],
 ['wrong sRGB gamma exponent','((c+.055)/1.055)**2.4','((c+.055)/1.055)**2.2'],
 ['wrong encoded gamma exponent','c**(1/2.4)','c**(1/2.2)'],
 ['corrupt protan matrix','[[.152286,1.052583','[[.252286,1.052583'],
 ['corrupt deutan matrix','[[.367322,.860646','[[.467322,.860646'],
 ['corrupt tritan matrix','[[1.255528,-.076749','[[1.155528,-.076749'],
 ['negative linear channel mirrored instead of clipped','Math.max(0,row[0]*input[0]+row[1]*input[1]+row[2]*input[2])','Math.abs(row[0]*input[0]+row[1]*input[1]+row[2]*input[2])'],
 ['remove simulation upper gamut clipping','encoded(Math.min(1,Math.max(0,','encoded(Math.max(0,Math.max(0,'],
 ['wrong luminance red weight','return .2126*linear','return .2216*linear'],
 ['wrong luminance green weight','+.7152*linear','+.7052*linear'],
 ['wrong contrast luminance offset','return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)','return(Math.max(x,y)+.04)/(Math.min(x,y)+.04)'],
 ['wrong D65 white X','/ .95047','/ .95000'],
 ['wrong RGB-to-XYZ red contribution','(.4124564*r','(.4224564*r'],
 ['wrong D65 white Z','/1.08883','/1.18883'],
 ['wrong Lab linear branch','24389/27*v','24389/24*v'],
 ['wrong chroma compensation','G=.5*(1-Math.sqrt','G=.4*(1-Math.sqrt'],
 ['wrong chroma seventh power','(25/chroma)**7','(25/chroma)**6'],
 ['wrong positive hue wrap','dh-=360','dh-=180'],
 ['wrong negative hue wrap','dh+=360','dh+=180'],
 ['wrong average hue wrap','(h1+h2+360)/2','(h1+h2+180)/2'],
 ['wrong hue weighting cosine coefficient','T=1-.17*','T=1-.07*'],
 ['wrong lightness weighting','SL=1+.015*','SL=1+.025*'],
 ['wrong chroma weighting','SC=1+.045*','SC=1+.035*'],
 ['reverse rotation correction','RT=-RC*','RT=RC*']
];
export async function runMutations(){const root=resolve('.mutations');await rm(root,{recursive:true,force:true});await mkdir(root,{recursive:true});const results=[];for(let i=0;i<BUGS.length;i++){const[name,from,to]=BUGS[i],folder=resolve(root,String(i+1));await mkdir(folder,{recursive:true});for(const f of ['color.ts','png.ts','tsconfig.json','package.json'])await copyFile(f,resolve(folder,f));const file=resolve(folder,'color.ts'),original=await readFile(file,'utf8');let anchor=from;if(name==='wrong D65 white X')anchor='/.95047';assert.ok(original.includes(anchor),`mutation anchor ${name}`);await writeFile(file,original.replace(anchor,to.replace('/ .','/.')));try{execFileSync(resolve('node_modules/.bin/tsc'),['-p',folder],{stdio:'pipe'});}catch(e){throw Error(`Mutation must compile: ${name}\n${e.stdout}`);}const seeds=[];for(const seed of[1,2,3]){let status=0,stderr='';try{execFileSync(process.execPath,['tests/mutant-probe.mjs',folder,String(seed)],{stdio:'pipe'});}catch(e){status=e.status;stderr=String(e.stderr).split('\n').filter(Boolean).slice(0,9).join('\n');}assert.equal(status,1,`mutation ${name} must be killed`);assert.match(stderr,/AssertionError/,`${name} must fail an actual math assertion`);seeds.push({seed,killed:true,exitCode:status,evidence:stderr});}results.push({number:i+1,name,source:'color.ts',from:anchor,to:to.replace('/ .','/.'),compiled:true,seeds});console.log(`Mutation ${i+1}/25 caught under all3 seeds: ${name}`);}await rm(root,{recursive:true,force:true});return results;}
