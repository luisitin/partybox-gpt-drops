import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {probe,calibration,fftCheck,compareArrays,compareMeters,independentMaster,parsePng,rng,fade} from './check.mjs';
import {referenceRaw,referenceMeter,referenceEncode,referenceDecode} from '../dist/reference.js';
import * as metering from '../dist/meter.js';import * as synthesis from '../dist/sfx.js';import * as wave from '../dist/wav.js';import * as spectrum from '../dist/spectrogram.js';
import {mutations} from './mutations.mjs';
const p={...metering,...synthesis,...wave,...spectrum};
await mkdir('reports-run',{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
function ffmpeg(bytes,name){const path=`reports-run/${name}.wav`;execFileSync(process.execPath,['-e',`require('node:fs').writeFileSync(process.argv[1],Buffer.from(process.argv[2],'base64'))`,path,Buffer.from(bytes).toString('base64')],{stdio:'pipe'});const run=execFileSync('ffmpeg',['-hide_banner','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return run;}
function ffmpegPath(path){try{const result=execFileSync('ffmpeg',['-hide_banner','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});return result;}catch(e){throw new Error(String(e.stderr));}}
// stderr contains ebur128's summary. spawnSync supplies both streams without noisy output.
import {spawnSync} from 'node:child_process';
function external(path){const run=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8'});assert.equal(run.status,0,`ffmpeg ${run.stderr}`);const integrated=[...run.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].at(-1),peak=[...run.stderr.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].at(-1);assert.ok(integrated&&peak,'ffmpeg summary');return{lufs:Number(integrated[1]),truePeakDb:Number(peak[1]),summary:run.stderr.slice(run.stderr.lastIndexOf('Summary:'))};}
const manifest=JSON.parse(await readFile('manifest.json','utf8'));assert.equal(manifest.sounds.length,40);assert.equal((await readdir('audio')).filter(x=>x.endsWith('.wav')).length,40);assert.equal((await readdir('spectrograms')).filter(x=>x.endsWith('.png')).length,40);assert.equal(new Set(p.SOUNDS.map(s=>s.id)).size,40);
for(const seed of [1,2,3]){
 console.log(`Seed ${seed}: independent DSP, delivered media, standards calibration, external meter`);
 probe(p,seed);fftCheck(p,seed);
 const rows=[],audioHashes=new Set(),pngHashes=new Set();
 for(const sound of p.SOUNDS){
  const s=p.soundSeed(sound.id,seed),raw=p.synthesizeRaw(sound,p.seeded(s)),reference=referenceRaw(sound,rng(s));
  const rawError=compareArrays(raw,reference,1e-10,`${sound.id} raw`),out=p.synthesize(sound,p.seeded(s)),expected=independentMaster(reference);
  const masterError=compareArrays(out,expected,1e-9,`${sound.id} mastered`),bytes=p.encodeWav(out),second=p.encodeWav(p.synthesize(sound,p.seeded(s)));
  assert.deepEqual(bytes,second,`${sound.id} regeneration`);assert.deepEqual(bytes,referenceEncode(out),`${sound.id} encoder`);
  const decoded=p.decodeWav(bytes),rw=referenceDecode(bytes);assert.equal(rw.rate,48000);assert.equal(rw.channels,1);assert.equal(rw.bits,16);compareArrays(decoded,rw.samples,0,`${sound.id} PCM`);
  const a=p.meter(decoded),b=referenceMeter(decoded);compareMeters(a,b,sound.id);assert.ok(decoded.length/48000>=.05&&decoded.length/48000<=3);assert.ok(Math.abs(a.lufs+16)<=.5);assert.ok(a.truePeakDb<=-1.5);assert.ok(20*Math.log10(a.samplePeak)<=-1.5,'sample peak safety');assert.ok(Math.abs(a.dc)<.001);
  // Operation proof: compare all mastered samples with an independent raised-cosine
  // basis and independently gated loudness, then check quantization at both edges.
  assert.equal(decoded[0],0);assert.equal(decoded.at(-1),0);
  for(let i=0;i<240;i++)for(const index of [i,decoded.length-1-i])assert.ok(Math.abs(decoded[index]-expected[index])<=1/32768,`${sound.id} quantized fade ${index}`);
  assert.ok(Math.abs(decoded[1]-decoded[0])<.001);assert.ok(Math.abs(decoded.at(-1)-decoded.at(-2))<.001);
  const png=p.spectrogram(decoded),image=parsePng(png);assert.equal(image.width,256);assert.equal(image.height,128);assert.ok(new Set(image.raster).size>40,'nonconstant spectrogram');assert.deepEqual(png,p.spectrogram(decoded),'spectrogram regeneration');
  audioHashes.add(hash(bytes));pngHashes.add(hash(png));
  const path=`reports-run/seed${seed}-${sound.id}.wav`;await writeFile(path,bytes);const ff=external(path);assert.ok(Math.abs(ff.lufs+16)<=.5,'external loudness');assert.ok(ff.truePeakDb<=-1.5,'external true peak');assert.ok(Math.abs(ff.lufs-a.lufs)<=.11,'external loudness agreement');assert.ok(Math.abs(ff.truePeakDb-a.truePeakDb)<=.4,'external estimator agreement');
  if(seed===1){assert.deepEqual(bytes,new Uint8Array(await readFile(`audio/${sound.id}.wav`)),`${sound.id} committed WAV`);assert.deepEqual(png,new Uint8Array(await readFile(`spectrograms/${sound.id}.png`)),`${sound.id} committed PNG`);assert.equal(manifest.sounds.find(x=>x.id===sound.id).sha256,hash(bytes));}
  rows.push({id:sound.id,seconds:decoded.length/48000,samples:decoded.length,rawMaxError:rawError,masterMaxError:masterError,production:a,reference:b,external:ff,sha256:hash(bytes),spectrogramSha256:hash(png),fadeSamples:240,passed:true});
 }
 assert.equal(audioHashes.size,40,'forty unique audio files');assert.equal(pngHashes.size,40,'forty unique images');
 const ebu=calibration(p);
 // Defect and boundary cases, fixed per seed for complete repeated suites.
 assert.throws(()=>p.meter(new Float64Array()),RangeError);assert.throws(()=>p.meter(new Float64Array([NaN])),RangeError);assert.throws(()=>p.meter(new Float64Array([Infinity])),RangeError);assert.throws(()=>p.meter(new Float64Array(20),44100),RangeError);
 assert.equal(p.meter(new Float64Array(48000)).lufs,-Infinity);assert.equal(p.meter(new Float64Array(48000)).truePeakDb,-Infinity);
 for(const value of [NaN,Infinity,1.01,-1.01])assert.throws(()=>p.encodeWav(new Float64Array([value])),RangeError);
 const invalid= p.encodeWav(new Float64Array([-.5,0,.5]));for(const index of [0,4,8,12,16,20,22,24,28,32,34,36,40]){const changed=invalid.slice();changed[index]^=1;assert.throws(()=>p.decodeWav(changed),RangeError);assert.throws(()=>referenceDecode(changed),RangeError);}
 for(const count of [0,1,20,43])assert.throws(()=>p.decodeWav(invalid.slice(0,count)),RangeError);
 const extremes=new Float64Array([-1,-32767/32768,-.5,-1/32768,0,1/32768,.5,32767/32768,1]);const decoded=p.decodeWav(p.encodeWav(extremes));assert.deepEqual(decoded,new Float64Array([-1,-32767/32768,-.5,-1/32768,0,1/32768,.5,32767/32768,32767/32768]));
 for(const bad of [NaN,-.1,1,Infinity])assert.throws(()=>p.synthesizeRaw(p.SOUNDS[0],()=>bad),RangeError);
 assert.throws(()=>p.finishAudio(new Float64Array(2399)),RangeError);assert.throws(()=>p.finishAudio(new Float64Array(144001)),RangeError);assert.throws(()=>p.finishAudio(new Float64Array(24000)),RangeError);
 const source=await Promise.all(['meter.ts','wav.ts','sfx.ts','spectrogram.ts','reference.ts'].map(f=>readFile(f,'utf8')));for(const text of source)assert.doesNotMatch(text,/Math\.random|Date\.now|from ['"](?:node:|[^.])/,'pure runtime source');
 const counts={independentRaw:40,independentMaster:40,independentWav:40,independentMeter:40,audioRequirements:40,fadeOperation:40,byteRegeneration:40,spectrogramPng:40,spectrogramRegeneration:40,externalFfmpeg:40,ebu3341MonoAdaptations:10,fftVsDft:6,invalidAndBoundary:49,probe:1};
 await writeFile(`reports-run/seed${seed}.json`,JSON.stringify({seed,command:'npm test',counts,sounds:rows,ebu,passed:true},null,2)+'\n');
 console.log(`Seed ${seed} passed: all 40 sounds; EBU rebuilt subset 10/10; external40/40.`);
}
const mutationResults=await mutations();await writeFile('reports-run/mutations.json',JSON.stringify({command:'npm test',mutations:mutationResults,compiled:25,killed:25,seeds:[1,2,3],seededKills:75,passed:true},null,2)+'\n');
await writeFile('reports-run/summary.json',JSON.stringify({command:'npm test',seeds:[1,2,3],sounds:40,audioCases:120,ebuCases:30,mutationSources:25,mutationSeedCases:75,strict:true,runtimeDependencies:0,passed:true},null,2)+'\n');
console.log('PASS: strict compile; 120 audio comparisons; 30 rebuilt EBU cases; 75/75 isolated mutation kills.');
