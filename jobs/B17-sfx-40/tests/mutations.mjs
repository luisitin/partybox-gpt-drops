import {readFile,writeFile,mkdir,rm,copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
export const MUTATIONS=[
 ['K shelf gain','meter.ts','1.53512485958697','1.43512485958697'],
 ['High-pass numerator','meter.ts','[1,-2,1]','[1,-1.8,1]'],
 ['Loudness calibration offset','meter.ts','return -0.691+10*Math.log10','return -0.591+10*Math.log10'],
 ['Wrong 400 ms block','meter.ts','rate*0.4','rate*0.3'],
 ['Wrong 75% overlap','meter.ts','rate*0.1','rate*0.2'],
 ['Absolute gate too high','meter.ts',')>-70',')>-20'],
 ['Relative gate too high','meter.ts','average*0.1','average*0.5'],
 ['Corrupt true peak FIR tap','meter.ts','0.97216796875','0.87216796875'],
 ['Power logarithm for true peak','meter.ts','return 20*Math.log10(peak)','return 10*Math.log10(peak)'],
 ['Remove all oversampling phases','meter.ts','i<samples.length+11','i<0'],
 ['Incorrect DC divisor','meter.ts','dc:sum/samples.length','dc:sum/(2*samples.length)'],
 ['Fade shortened tenfold','meter.ts','fadeSamples=240','fadeSamples=24'],
 ['Disable DC correction','meter.ts','const correction=sum/weight','const correction=0*sum/weight'],
 ['Wrong mastering loudness','meter.ts','target=-16','target=-14'],
 ['Wrong sample rate','meter.ts','RATE = 48000','RATE = 44100'],
 ['Incorrect bit depth header','wav.ts','setUint16(34,16,true)','setUint16(34,8,true)'],
 ['Halved PCM encoder gain','wav.ts','Math.round(x*32768)','Math.round(x*16384)'],
 ['Big endian PCM output','wav.ts','Math.round(x*32768))),true)','Math.round(x*32768))),false)'],
 ['Incorrect PCM decoding scale','wav.ts','getInt16(44+2*i,true)/32768','getInt16(44+2*i,true)/16384'],
 ['Incorrect seeded RNG multiplier','sfx.ts','Math.imul(state,1664525)','Math.imul(state,1664523)'],
 ['Half oscillator frequency','sfx.ts','phase+=2*Math.PI*hz/RATE','phase+=Math.PI*hz/RATE'],
 ['Wrong harmonic amplitude','sfx.ts','.22*Math.sin(2*phase)','.12*Math.sin(2*phase)'],
 ['Corrupt noise recursion','sfx.ts','filtered=.72*filtered','filtered=.62*filtered'],
 ['Sequence chooses next note early','sfx.ts','Math.floor(u*sound.notes.length)','Math.ceil(u*sound.notes.length)'],
 ['Linear instead of geometric sweep','sfx.ts','sound.hz*Math.pow(sound.endHz/sound.hz,u)','sound.hz+(sound.endHz-sound.hz)*u']
];
export async function mutations(){
 const root=resolve('.mutations');await rm(root,{recursive:true,force:true});await mkdir(root,{recursive:true});const results=[];
 for(let index=0;index<MUTATIONS.length;index++){
  const [name,file,from,to]=MUTATIONS[index],folder=resolve(root,String(index+1));await mkdir(folder,{recursive:true});
  for(const f of ['meter.ts','wav.ts','sfx.ts','spectrogram.ts','tsconfig.json','package.json'])await copyFile(f,resolve(folder,f));
  const original=await readFile(resolve(folder,file),'utf8');assert.ok(original.includes(from),`mutation ${name} anchor`);await writeFile(resolve(folder,file),original.replace(from,to));
  try{execFileSync(resolve('node_modules/.bin/tsc'),['-p',folder],{stdio:'pipe'});}catch(error){throw new Error(`Mutation ${name} failed to compile instead of being behaviorally detected: ${error.stdout??error}`);}
  const seeds=[];for(const seed of [1,2,3]){let output='',code=0;try{execFileSync(process.execPath,['tests/mutant-probe.mjs',folder, String(seed)],{stdio:'pipe'});}catch(error){code=error.status;output=String(error.stderr).split('\n').filter(Boolean).slice(0,7).join('\n');}assert.equal(code,1,`mutation ${name}, seed ${seed} survived or crashed outside assertions`);assert.match(output,/AssertionError/,`${name} must fail a behavioral assertion`);seeds.push({seed,killed:true,exitCode:code,evidence:output});}results.push({index:index+1,name,file,from,to,compiled:true,seeds});console.log(`Mutation ${index+1}/25 detected for seeds 1,2,3: ${name}`);
 }
 await rm(root,{recursive:true,force:true});return results;
}
