import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {probe,productProbe,calibration,fftCheck,compareArrays,compareMeters,independentMaster,independentMasterDetail,parsePng,rng} from './check.mjs';
import {referenceRaw,referenceMeter,referenceEncode,referenceDecode,referenceFade} from '../dist/reference.js';
import * as metering from '../dist/meter.js';import * as synthesis from '../dist/sfx.js';import * as wave from '../dist/wav.js';import * as spectrum from '../dist/spectrogram.js';import * as twin from '../dist/twin.js';
import {mutations,SOURCE_FILES} from './mutations.mjs';
const p={...metering,...synthesis,...wave,...spectrum,...twin};
await mkdir('reports-run',{recursive:true});await rm('reports-run/summary.json',{force:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const toMid=s=>Float64Array.from(s.left,(v,i)=>(v+s.right[i])/2);
// stderr carries ebur128's summary; spawnSync returns both streams without noisy output.
function external(path){const run=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8'});assert.equal(run.status,0,`ffmpeg ${run.stderr}`);const integrated=[...run.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].at(-1),peak=[...run.stderr.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].at(-1);assert.ok(integrated&&peak,'ffmpeg summary');return{lufs:Number(integrated[1]),truePeakDb:Number(peak[1]),summary:run.stderr.slice(run.stderr.lastIndexOf('Summary:'))};}
const ffmpegVersion=spawnSync('ffmpeg',['-version'],{encoding:'utf8'}).stdout.split('\n')[0];
const manifest=JSON.parse(await readFile('manifest.json','utf8'));
async function deliverablePaths(directory=''){const paths=[];for(const entry of await readdir(directory||'.',{withFileTypes:true})){const path=directory?`${directory}/${entry.name}`:entry.name;if(['node_modules','dist','reports-run','.mutations'].includes(entry.name))continue;if(entry.isDirectory())paths.push(...await deliverablePaths(path));else if(entry.isFile()&&path!=='SHA256SUMS.txt')paths.push(path);}return paths.sort();}
const GROUPS=new Set(['flow','timer','verdict','reward','board','menu','power']);
for(const seed of [1,2,3]){
 assert.equal(manifest.sounds.length,40);assert.equal((await readdir('audio')).filter(x=>x.endsWith('.wav')).length,40);assert.equal((await readdir('spectrograms')).filter(x=>x.endsWith('.png')).length,40);assert.equal(new Set(p.SOUNDS.map(s=>s.id)).size,40);assert.equal(p.LEGACY_SOUNDS.length,40);
 const checksumLines=(await readFile('SHA256SUMS.txt','utf8')).trim().split('\n');const listedPaths=[];for(const line of checksumLines){const match=/^([a-f0-9]{64})  (.+)$/.exec(line);assert.ok(match,'checksum line');const bytes=await readFile(match[2]);assert.ok(bytes.length<=30000000,'file size cap');assert.equal(hash(bytes),match[1],`checksum ${match[2]}`);listedPaths.push(match[2]);}assert.deepEqual(listedPaths.sort(),await deliverablePaths(),'complete checksum coverage');
 console.log(`Seed ${seed}: blind oracle on the shared stack, shipped v2 engine against its twin, delivered media, EBU calibration, external meter`);
 probe(p,seed);productProbe(p,seed);fftCheck(p,seed);
 // Block A: blind oracle. The first-delivery recipe (legacy.ts) through the shared master, encoder and meter.
 const legacyRows=[];
 for(const sound of p.LEGACY_SOUNDS){
  const s=p.soundSeed(sound.id,seed),raw=p.synthesizeLegacyRaw(sound,p.seeded(s)),reference=referenceRaw(sound,rng(s));
  const rawError=compareArrays(raw,reference,1e-10,`${sound.id} v1 raw`);
  const mastered=p.finishAudio(raw),expected=independentMaster(reference);
  assert.ok(referenceFade(mastered,240,independentMasterDetail(reference).preFadePeak),`${sound.id} v1 five ms edge envelope`);
  const masterError=compareArrays(mastered,expected,1e-9,`${sound.id} v1 mastered`);
  const bytes=p.encodeWav(mastered);
  assert.ok(Buffer.from(bytes).equals(Buffer.from(referenceEncode(expected))),`${sound.id} v1 complete independent PCM pipeline`);
  assert.deepEqual(bytes,referenceEncode(mastered),`${sound.id} v1 encoder`);
  const decoded=p.decodeWav(bytes),rw=referenceDecode(bytes);assert.equal(rw.rate,48000);assert.equal(rw.channels,1);assert.equal(rw.bits,16);compareArrays(decoded,rw.samples,0,`${sound.id} v1 PCM`);
  const a=p.meter(decoded),b=referenceMeter(decoded);compareMeters(a,b,`${sound.id} v1`);
  legacyRows.push({id:sound.id,samples:decoded.length,rawMaxError:rawError,masterMaxError:masterError,production:a,reference:b});
 }
 // Block B: the shipped v2 engine. Each sound: dsp.ts against twin.ts, the master against an independent master of the twin,
 // then the delivered WAV against the spec, the independent meter, FFmpeg and the committed evidence.
 const rows=[],audioHashes=new Set(),pngHashes=new Set();
 for(const sound of p.SOUNDS){
  assert.ok(GROUPS.has(sound.group),`${sound.id} group`);assert.ok(sound.description.length>0,`${sound.id} description`);
  const s=p.soundSeed(sound.id,seed);
  const stereo=p.renderSound(sound,p.seeded(s)),twinStereo=p.twinRender(sound,p.twinRng(s));
  const stereoError=Math.max(compareArrays(stereo.left,twinStereo.left,1e-9,`${sound.id} left twin`),compareArrays(stereo.right,twinStereo.right,1e-9,`${sound.id} right twin`));
  const twinMid=toMid(twinStereo),expected=independentMaster(twinMid),detail=independentMasterDetail(twinMid);
  const out=p.synthesize(sound,p.seeded(s));
  const masterError=compareArrays(out,expected,1e-9,`${sound.id} v2 mastered`);
  assert.ok(referenceFade(out,240,detail.preFadePeak),`${sound.id} v2 five ms edge envelope`);
  const bytes=p.encodeWav(out),second=p.encodeWav(p.synthesize(sound,p.seeded(s)));
  assert.deepEqual(bytes,second,`${sound.id} regeneration`);
  assert.ok(Buffer.from(bytes).equals(Buffer.from(referenceEncode(expected))),`${sound.id} complete independent PCM pipeline`);
  assert.deepEqual(bytes,referenceEncode(out),`${sound.id} encoder`);
  const decoded=p.decodeWav(bytes),rw=referenceDecode(bytes);assert.equal(rw.rate,48000);assert.equal(rw.channels,1);assert.equal(rw.bits,16);compareArrays(decoded,rw.samples,0,`${sound.id} PCM`);
  const a=p.meter(decoded),b=referenceMeter(decoded);compareMeters(a,b,sound.id);
  assert.ok(decoded.length/48000>=.05&&decoded.length/48000<=3,`${sound.id} duration`);
  assert.ok(Math.abs(a.lufs+16)<=.5,`${sound.id} loudness ${a.lufs}`);assert.ok(a.truePeakDb<=-1.5,`${sound.id} true peak ${a.truePeakDb}`);assert.ok(20*Math.log10(a.samplePeak)<=-1.5,'sample peak safety');assert.ok(Math.abs(a.dc)<.001,`${sound.id} DC`);
  // Operation proof: every sample of the five ms edges against the independent master, and both endpoints exact.
  assert.equal(decoded[0],0);assert.equal(decoded.at(-1),0);
  for(let i=0;i<240;i++)for(const index of [i,decoded.length-1-i])assert.ok(Math.abs(decoded[index]-expected[index])<=1/32768,`${sound.id} quantized fade ${index}`);
  assert.ok(Math.abs(decoded[1]-decoded[0])<.001);assert.ok(Math.abs(decoded.at(-1)-decoded.at(-2))<.001);
  const png=p.spectrogram(decoded),image=parsePng(png);assert.equal(image.width,256);assert.equal(image.height,128);assert.ok(new Set(image.raster).size>40,'nonconstant spectrogram');assert.deepEqual(png,p.spectrogram(decoded),'spectrogram regeneration');
  audioHashes.add(hash(bytes));pngHashes.add(hash(png));
  const path=`reports-run/seed${seed}-${sound.id}.wav`;await writeFile(path,bytes);const ff=external(path);
  assert.ok(Math.abs(ff.lufs+16)<=.5,'external loudness');assert.ok(ff.truePeakDb<=-1.5,'external true peak');assert.ok(Math.abs(ff.lufs-a.lufs)<=.11,'external loudness agreement');assert.ok(Math.abs(ff.truePeakDb-a.truePeakDb)<=.4,'external estimator agreement');
  const canonical=seed===1?bytes:p.encodeWav(p.synthesize(sound,p.seeded(p.soundSeed(sound.id,1)))),canonicalPng=seed===1?png:p.spectrogram(p.decodeWav(canonical));
  assert.ok(Buffer.from(canonical).equals(await readFile(`audio/${sound.id}.wav`)),`${sound.id} committed WAV`);
  assert.ok(Buffer.from(canonicalPng).equals(await readFile(`spectrograms/${sound.id}.png`)),`${sound.id} committed PNG`);
  assert.equal(manifest.sounds.find(x=>x.id===sound.id).sha256,hash(canonical));
  if(seed===1)assert.deepEqual(p.encodeWav(p.renderCue(sound.id).mono),bytes,`${sound.id} renderCue equals the delivered WAV`);
  rows.push({id:sound.id,group:sound.group,seconds:decoded.length/48000,samples:decoded.length,stereoMaxError:stereoError,masterMaxError:masterError,production:a,reference:b,external:ff,sha256:hash(bytes),spectrogramSha256:hash(png),fadeSamples:240,passed:true});
 }
 assert.equal(audioHashes.size,40,'forty unique audio files');assert.equal(pngHashes.size,40,'forty unique images');
 // Block C: the port API. Every sound has a cue, transposed cues keep the delivery limits, cue rendering is deterministic.
 const cueIds=new Set(p.CUES.map(c=>c.sound));assert.equal(cueIds.size,40,'every sound maps to a PartyBox moment');
 for(const cue of p.CUES)assert.ok(cue.trimDb<=0&&cue.trimDb>=-30,`${cue.cue} trim`);
 assert.throws(()=>p.renderCue('no-such-cue'),RangeError);assert.throws(()=>p.renderCue('coin',{semitones:25}),RangeError);
 const first=p.renderCue('coin',{seed}),again=p.renderCue('coin',{seed});assert.deepEqual(first.mono,again.mono,'renderCue deterministic');assert.deepEqual(first.left,again.left,'renderCue stereo deterministic');
 if(seed===1)for(const [id,semitones] of [['countdown-tick',-12],['join',2],['bonus',7],['connect',-5]]){const shifted=p.renderCue(id,{semitones});const m=p.meter(shifted.mono);assert.ok(Math.abs(m.lufs+16)<=.5,`${id} ${semitones} loudness ${m.lufs}`);assert.ok(m.truePeakDb<=-1.5,`${id} ${semitones} true peak`);}
 const ebu=calibration(p);
 // Block D: defect and boundary cases, fixed per seed for complete repeated suites.
 assert.throws(()=>p.meter(new Float64Array()),RangeError);assert.throws(()=>p.meter(new Float64Array([NaN])),RangeError);assert.throws(()=>p.meter(new Float64Array([Infinity])),RangeError);assert.throws(()=>p.meter(new Float64Array(20),44100),RangeError);
 assert.equal(p.meter(new Float64Array(48000)).lufs,-Infinity);assert.equal(p.meter(new Float64Array(48000)).truePeakDb,-Infinity);
 for(const value of [NaN,Infinity,1.01,-1.01])assert.throws(()=>p.encodeWav(new Float64Array([value])),RangeError);
 const invalid=p.encodeWav(new Float64Array([-.5,0,.5]));for(const index of [0,4,8,12,16,20,22,24,28,32,34,36,40]){const changed=invalid.slice();changed[index]^=1;assert.throws(()=>p.decodeWav(changed),RangeError);assert.throws(()=>referenceDecode(changed),RangeError);}
 for(const count of [0,1,20,43])assert.throws(()=>p.decodeWav(invalid.slice(0,count)),RangeError);
 const extremes=new Float64Array([-1,-32767/32768,-.5,-1/32768,0,1/32768,.5,32767/32768,1]);const decoded=p.decodeWav(p.encodeWav(extremes));assert.deepEqual(decoded,new Float64Array([-1,-32767/32768,-.5,-1/32768,0,1/32768,.5,32767/32768,32767/32768]));
 for(const bad of [NaN,-.1,1,Infinity])assert.throws(()=>p.synthesizeRaw(p.SOUNDS[0],()=>bad),RangeError);
 assert.throws(()=>p.finishAudio(new Float64Array(2399)),RangeError);assert.throws(()=>p.finishAudio(new Float64Array(144001)),RangeError);assert.throws(()=>p.finishAudio(new Float64Array(24000)),RangeError);
 // Block E: purity. Source text of every module the suite trusts is free of ambient randomness, clocks and I/O imports.
 const pureFiles=['meter.ts','wav.ts','sfx.ts','spectrogram.ts','reference.ts','dsp.ts','recipes.ts','cues.ts','legacy.ts','twin.ts'];
 const source=await Promise.all(pureFiles.map(f=>readFile(f,'utf8')));for(const text of source)assert.doesNotMatch(text,/Math\.random|Date\.now|from ['"](?:node:|[^.])/,'pure runtime source');
 const counts={sha256Files:checksumLines.length,legacyRawComparisons:40,legacyMasterComparisons:40,legacyFullPcmComparisons:40,legacyMeterComparisons:40,stereoTwinComparisons:40,productMasterComparisons:40,productFullPcmComparisons:40,audioRequirements:40,fadeOperation:40,byteRegeneration:40,spectrogramPng:40,spectrogramRegeneration:40,externalFfmpeg:40,ebu3341MonoAdaptations:10,fftVsDft:6,productCueApi:4,canonicalDeliverables:120,catalogAndDistinctness:6,meterInvalidAndSilence:6,encodeInvalid:4,decodeInvalid:30,pcmExtrema:1,rngInvalid:4,masterInvalid:3,pureSource:10,probe:1,productProbe:1,legacyRawSampleComparisons:legacyRows.reduce((sum,row)=>sum+row.samples,0),stereoSampleComparisons:2*rows.reduce((sum,row)=>sum+row.samples,0),masteredSampleComparisons:rows.reduce((sum,row)=>sum+row.samples,0),pcmFadeSampleComparisons:19200};
 await writeFile(`reports-run/seed${seed}.json`,JSON.stringify({seed,command:'npm test',node:process.version,ffmpeg:ffmpegVersion,counts,legacy:legacyRows,sounds:rows,ebu,passed:true},null,2)+'\n');
 console.log(`Seed ${seed} passed: 40 blind-oracle sounds, 40 shipped sounds against the twin, 40/40 external meter, 10/10 EBU rebuilt subset.`);
}
const mutationResults=await mutations();
const killed=mutationResults.filter(m=>m.seeds.every(s=>s.killed)).length;assert.equal(killed,25,'all 25 planted bugs must be killed under every seed');
await writeFile('reports-run/mutations.json',JSON.stringify({command:'npm test',mutations:mutationResults,compiled:25,killed,seeds:[1,2,3],seededKills:killed*3,passed:true},null,2)+'\n');
const sourceSha256={};for(const file of [...SOURCE_FILES.filter(f=>!['tsconfig.json','package.json'].includes(f)),'reference.snapshot.ts.txt','tests/run.mjs','tests/check.mjs','tests/mutations.mjs','tests/mutant-probe.mjs','tools/generate.mjs','tools/record.mjs','tools/checksums.mjs','tsconfig.json','package.json','package-lock.json'])sourceSha256[file]=hash(await readFile(file));
const dependencies=Object.keys(JSON.parse(await readFile('package.json','utf8')).dependencies??{}).length;
await writeFile('reports-run/summary.json',JSON.stringify({sourceSha256,command:'npm test',seeds:[1,2,3],sounds:40,audioCases:120,ebuCases:30,mutationSources:25,mutationSeedCases:75,strict:true,runtimeDependencies:dependencies,node:process.version,ffmpeg:ffmpegVersion,passed:true},null,2)+'\n');
console.log('PASS: strict compile; blind oracle on the shared stack; shipped v2 engine against its twin; 30 rebuilt EBU cases; 75/75 isolated mutation kills.');
