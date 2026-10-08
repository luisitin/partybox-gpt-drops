import {writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {SOUNDS,CUES,synthesize,seeded,soundSeed} from '../dist/sfx.js';
import {encodeWav,decodeWav} from '../dist/wav.js';
import {meter} from '../dist/meter.js';
import {spectrogram} from '../dist/spectrogram.js';
await mkdir('audio',{recursive:true}); await mkdir('spectrograms',{recursive:true});
const GROUP_ORDER=[['flow','Flow','Joins, starts, turns, connections'],['timer','Clock','Ticks and the last seconds'],['verdict','Verdicts','Right, wrong, confirm, cancel'],['reward','Rewards','Points, wins and bonuses'],['board','On the board','Dice, tokens and things landing'],['menu','Menus','Moving, opening and leaving screens'],['power','Power','Effects that grow, weaken or protect']];
const esc=(text)=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sounds=[];
for(const sound of SOUNDS){
 const bytes=encodeWav(synthesize(sound,seeded(soundSeed(sound.id,1)))),decoded=decodeWav(bytes),png=spectrogram(decoded);
 await writeFile(`audio/${sound.id}.wav`,bytes); await writeFile(`spectrograms/${sound.id}.png`,png);
 const cues=CUES.filter(cue=>cue.sound===sound.id).map(({cue,action,trimDb,moment,semitones})=>({cue,action,trimDb,semitones,moment}));
 sounds.push({id:sound.id,name:sound.name,group:sound.group,description:sound.description,seconds:+(decoded.length/48000).toFixed(3),samples:decoded.length,seed:1,audio:`audio/${sound.id}.wav`,spectrogram:`spectrograms/${sound.id}.png`,sha256:createHash('sha256').update(bytes).digest('hex'),...meter(decoded),cues});
}
await writeFile('manifest.json',JSON.stringify({format:'PCM16LE',sampleRate:48000,channels:1,loudnessTarget:-16,truePeakLimit:-1.5,version:2,engine:'dsp.ts + recipes.ts (v2); first delivery kept as legacy.ts',sounds},null,2)+'\n');
const groupSection=(key,title,blurb)=>{
 const items=sounds.filter(s=>s.group===key);
 return `<section class="group" id="${key}"><header><h2>${esc(title)}</h2><p>${esc(blurb)}</p></header><div class="grid">${items.map(s=>`<article class="card"><figure><img src="${s.spectrogram}" alt="Spectrogram of ${esc(s.name)}" loading="lazy" width="256" height="128"></figure><div class="body"><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><div class="cues">${s.cues.map(c=>`<span class="cue ${c.action}" title="${esc(c.moment)}">${c.action==='new'?'new cue':'PartyBox'} · ${esc(c.cue)}</span>`).join('')}</div><audio controls preload="none" src="${s.audio}" aria-label="${esc(s.name)}"></audio><footer><span>${s.seconds.toFixed(2)} s</span><span>${s.lufs.toFixed(1)} LUFS</span><span>${s.truePeakDb.toFixed(1)} dBTP</span><a href="${s.audio}" download>WAV</a></footer></div></article>`).join('')}</div></section>`;
};
const css=`:root{--pb-bg:#0f1020;--pb-surface:#1c1e3a;--pb-surface-2:#272a52;--pb-text:#f5f6ff;--pb-text-muted:#b3b7d9;--pb-accent:#ff5d8f;--pb-accent-2:#ffd166;--pb-accent-3:#06d6a0;--pb-info:#4cc9f0;--pb-on-accent:#1a0b12;--pb-radius:24px;--pb-radius-sm:12px;--pb-ease:cubic-bezier(.2,.8,.2,1);--pb-fast:150ms;--pb-base:300ms;--pb-font:'Nunito Variable','Segoe UI Variable Display','Segoe UI',system-ui,-apple-system,Roboto,sans-serif}
*{box-sizing:border-box}html,body{margin:0}body{background:radial-gradient(1200px 600px at 10% -10%,#262a5c 0%,transparent 60%),var(--pb-bg);color:var(--pb-text);font:16px/1.5 var(--pb-font);min-height:100vh;overflow-x:hidden}
main{max-width:1180px;margin:0 auto;padding:24px 16px 64px}
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:16px}
.mark{display:inline-flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.02em}
.mark i{display:grid;place-items:center;width:34px;height:34px;border-radius:12px;background:linear-gradient(140deg,var(--pb-accent),var(--pb-accent-2));color:var(--pb-on-accent);font-style:normal;font-weight:900}
.mark span{color:var(--pb-text-muted);font-weight:600}
.stat{font-size:13px;color:var(--pb-text-muted);background:var(--pb-surface);border-radius:999px;padding:8px 14px;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 6px 18px rgba(0,0,0,.25)}
.hero{padding:40px 0 28px}
.hero h1{font-size:clamp(40px,8vw,84px);line-height:1;margin:0 0 14px;font-weight:900;letter-spacing:-.03em}
.hero p{max-width:640px;color:var(--pb-text-muted);font-size:18px;margin:0}
.jump{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 8px;padding:0;list-style:none}
.jump a{display:inline-block;min-height:44px;line-height:44px;padding:0 16px;border-radius:999px;background:var(--pb-surface);color:var(--pb-text);text-decoration:none;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.25);transition:transform var(--pb-fast) var(--pb-ease),background var(--pb-fast)}
.jump a:hover{transform:translateY(-2px);background:var(--pb-surface-2)}
.jump a:focus-visible,.card a:focus-visible,audio:focus-visible{outline:3px solid var(--pb-info);outline-offset:3px}
.group{padding-top:40px}
.group>header h2{margin:0 0 4px;font-size:28px;font-weight:900;letter-spacing:-.01em}
.group>header p{margin:0 0 18px;color:var(--pb-text-muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.card{background:linear-gradient(180deg,var(--pb-surface-2),var(--pb-surface));border-radius:var(--pb-radius);overflow:hidden;box-shadow:0 1px 0 rgba(255,255,255,.07) inset,0 18px 40px rgba(0,0,0,.35);transition:transform var(--pb-base) var(--pb-ease),box-shadow var(--pb-base) var(--pb-ease);display:flex;flex-direction:column}
.card:hover{transform:translateY(-3px);box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 26px 48px rgba(0,0,0,.45)}
.card figure{margin:0;background:#0b0c18;position:relative}
.card img{display:block;width:100%;height:auto;aspect-ratio:2/1;image-rendering:auto}
.card .body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:8px;flex:1}
.card h3{margin:0;font-size:22px;font-weight:800}
.card p{margin:0;color:var(--pb-text-muted);font-size:14px;min-height:2.6em}
.cues{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
.cue{font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(255,93,143,.14);color:#ffc2d6}
.cue.new{background:rgba(6,214,160,.14);color:#9ff0d8}
audio{width:100%;height:44px;margin-top:4px;border-radius:var(--pb-radius-sm)}
.card footer{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--pb-text-muted);font-variant-numeric:tabular-nums}
.card footer a{margin-left:auto;color:var(--pb-accent-2);font-weight:800;text-decoration:none;min-height:44px;line-height:44px;padding:0 4px}
.foot{margin-top:56px;color:var(--pb-text-muted);font-size:13px;max-width:760px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}.card:hover,.jump a:hover{transform:none}}`;
const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>B17 sound set · PartyBox</title>
<style>${css}</style>
</head>
<body>
<main>
 <div class="top">
  <div class="mark"><i aria-hidden="true">PB</i>PartyBox <span>/ B17 sound set</span></div>
  <div class="stat">40 cues · 48 kHz mono · −16 LUFS</div>
 </div>
 <section class="hero">
  <h1>Forty little sounds, made for a party.</h1>
  <p>Every cue is original: synthesized from code, layered (a transient, a body and a short room), levelled to the same loudness and kept under the true-peak ceiling. Tap a cue to hear it; each card names the PartyBox moment it can voice.</p>
  <ul class="jump">${GROUP_ORDER.map(([key,title])=>`<li><a href="#${key}">${esc(title)}</a></li>`).join('')}</ul>
 </section>
 ${GROUP_ORDER.map(([key,title,blurb])=>groupSection(key,title,blurb)).join('\n')}
 <p class="foot">Spectrograms: 1024-point Hann FFT, log frequency 47 Hz to 24 kHz, brighter is louder. Each WAV is the seed-1 master the test suite checks byte for byte. Open this file from disk or serve the folder with any static server; nothing loads from the network.</p>
</main>
</body>
</html>
`;
await writeFile('gallery.html',html);
console.log(`Generated ${sounds.length} original WAVs, spectrograms, manifest and gallery.`);
