import {writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {SOUNDS,synthesize,seeded,soundSeed} from '../dist/sfx.js';
import {encodeWav,decodeWav} from '../dist/wav.js';
import {meter} from '../dist/meter.js';
import {spectrogram} from '../dist/spectrogram.js';
await mkdir('audio',{recursive:true}); await mkdir('spectrograms',{recursive:true});
const sounds=[];
for(const sound of SOUNDS){
 const bytes=encodeWav(synthesize(sound,seeded(soundSeed(sound.id,1)))),decoded=decodeWav(bytes),png=spectrogram(decoded);
 await writeFile(`audio/${sound.id}.wav`,bytes); await writeFile(`spectrograms/${sound.id}.png`,png);
 sounds.push({...sound,...meter(decoded),seed:1,samples:decoded.length,audio:`audio/${sound.id}.wav`,spectrogram:`spectrograms/${sound.id}.png`,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await writeFile('manifest.json',JSON.stringify({format:'PCM16LE',sampleRate:48000,channels:1,loudnessTarget:-16,truePeakLimit:-1.5,version:1,sounds},null,2)+'\n');
const cards=sounds.map(s=>`<article><img src="${s.spectrogram}" alt="Log frequency spectrogram of ${s.name}"><div><span class="kind">${s.kind}</span><h2>${s.name}</h2><p>${s.description}</p><audio controls preload="none" src="${s.audio}"></audio><footer>${s.seconds.toFixed(2)} s · ${s.lufs.toFixed(2)} LUFS · ${s.truePeakDb.toFixed(2)} dBTP <a href="${s.audio}" download>WAV ↓</a></footer></div></article>`).join('\n');
await writeFile('gallery.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B17 / Signal Arcade</title><style>*{box-sizing:border-box}body{margin:0;background:#10111b;color:#f1efff;font:16px/1.6 system-ui}main{max-width:1200px;margin:auto;padding:48px 24px}header{margin-bottom:40px;border-bottom:1px solid #41405c;padding-bottom:30px}.eyebrow,.kind{font:12px/1.5 monospace;letter-spacing:.16em;text-transform:uppercase;color:#ffba76}h1{font-size:clamp(38px,7vw,80px);line-height:1.05;letter-spacing:-.06em;margin:18px 0}header p{max-width:720px;color:#bcb7d7}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}article{overflow:hidden;border:1px solid #353449;border-radius:14px;background:#191927}article img{width:100%;height:150px;object-fit:fill;display:block}article div{padding:22px}h2{font-size:22px;margin:6px 0}article p{color:#bcb7d7;min-height:50px;margin:0 0 18px}audio{width:100%;height:36px}footer{font:11px/1.7 monospace;color:#bcb7d7;margin-top:16px}a{color:#ffba76;float:right}aside{color:#9891b4;font:12px/1.7 monospace;margin-top:36px}</style><main><header><div class="eyebrow">B17 / Original code synthesis</div><h1>Signal Arcade.</h1><p>Forty little sounds for a game in motion. Oscillators, shaped noise, and musical gestures, delivered as mono 48 kHz / 16-bit WAVs. Every effect is normalized to −16 LUFS and measured after encoding.</p></header><section>${cards}</section><aside>Seed 1 · Spectrograms: 1024-sample Hann FFT, logarithmic 47 Hz–24 kHz frequency axis, 70 dB magnitude window. Top is high frequency; left is start. Open this file locally or serve the folder with any static server.</aside></main></html>\n`);
console.log(`Generated ${sounds.length} original WAVs and spectrograms.`);
