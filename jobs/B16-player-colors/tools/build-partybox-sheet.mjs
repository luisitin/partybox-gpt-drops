// Generates partybox/sheet.html (the swatch sheet on the five PartyBox themes) and
// partybox/tokens-player.css (the proposed --pb-player-* tokens) from partybox/palette-12.json.
// Usage: node tools/build-partybox-sheet.mjs   (after npm run build)
import { readFileSync, writeFileSync } from 'node:fs';
import * as p from '../dist/color.js';

const data = JSON.parse(readFileSync('partybox/palette-12.json', 'utf8'));
const cols = data.colors;
const PB8 = [
  ['Pink', '#ff5d8f'], ['Gold', '#ffd166'], ['Mint', '#06d6a0'], ['Sky', '#4cc9f0'],
  ['Lilac', '#b388ff'], ['Orange', '#ff9f43'], ['Cyan', '#48dbfb'], ['Magenta', '#f368e0'],
];
// The five themes (docs/DESIGN_SYSTEM.md; packages/client/src/styles/tokens.css). Ring = the theme's text ink.
const THEMES = [
  { key: 'night', label: 'Night (default)', bg: '#0f1020', surface: '#272a52', ring: '#f5f6ff', text: '#f5f6ff' },
  { key: 'daylight', label: 'Daylight', bg: '#f6f5ff', surface: '#e9e7fb', ring: '#171633', text: '#171633' },
  { key: 'arcade', label: 'Arcade', bg: '#050014', surface: '#23064a', ring: '#f0f6ff', text: '#f0f6ff' },
  { key: 'cabin', label: 'Cabin', bg: '#1d1410', surface: '#3d2e26', ring: '#fbf3e8', text: '#fbf3e8' },
  { key: 'contrast', label: 'High contrast', bg: '#000000', surface: '#242424', ring: '#ffffff', text: '#ffffff' },
];
const MODES = [['protan', 'Protanopia'], ['deutan', 'Deuteranopia'], ['tritan', 'Tritanopia']];
const css = (rgb) => `rgb(${rgb.map((c) => Math.round(c * 255)).join(' ')})`;
const hexOf = (rgb) => p.toHex(rgb);

function disc(slot, name, hex, face, ring, extra = '') {
  const rgb = p.fromHex(hex);
  return `<figure class="disc${extra}"><svg viewBox="0 0 64 64" aria-hidden="true">
<circle cx="32" cy="32" r="29" fill="${css(rgb)}" stroke="${ring}" stroke-width="2.5"${extra.includes('repeat') ? ' stroke-dasharray="4 3"' : ''}/>
<circle cx="24.5" cy="28" r="3.2" fill="${face}"/><circle cx="39.5" cy="28" r="3.2" fill="${face}"/>
<path d="M22.5 40.5 Q32 48.5 41.5 40.5" fill="none" stroke="${face}" stroke-width="3" stroke-linecap="round"/></svg>
<figcaption><b>${slot}</b>${name}</figcaption></figure>`;
}
const rowOf = (title, discs) => `<div class="row"><h4>${title}</h4><div class="discs">${discs}</div></div>`;
const simHex = (hex, mode) => hexOf(p.simulate(p.fromHex(hex), mode));

let body = '';
for (const t of THEMES) {
  const bg = p.fromHex(t.bg);
  const minFill = Math.min(...cols.map((c) => p.contrast(p.fromHex(c.hex), bg)));
  const minPb = Math.min(...PB8.map(([, h]) => p.contrast(p.fromHex(h), bg)));
  const ringRatio = p.contrast(p.fromHex(t.ring), bg);
  body += `<section class="theme" style="background:${t.bg};color:${t.text}">
<header><h2>${t.label}</h2>
<span class="chip">ground ${t.bg}</span>
<span class="chip">fill vs ground: now ${minPb.toFixed(1)}:1 · candidate ${minFill.toFixed(1)}:1</span>
<span class="chip ok">ring ${ringRatio.toFixed(1)}:1 on every disc</span></header>
${rowOf('PartyBox now', PB8.map(([n, h], i) => disc(i + 1, n, h, '#1a0b12', t.bg)).join(''))}
${rowOf('Candidate', cols.map((c) => disc(c.slot, c.name, c.hex, c.face, t.ring)).join(''))}
${MODES.map(([m, label]) => rowOf(label, cols.map((c) => disc(c.slot, c.name, simHex(c.hex, m), c.face, t.ring)).join(''))).join('\n')}
${rowOf('Room of 16', cols.slice(0, 4).map((c) => disc(c.slot + 12, c.name, c.hex, c.face, t.ring, ' repeat')).join(''))}
</section>`;
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PartyBox player colours</title>
<style>
:root { --pb-font: 'Nunito Variable','Segoe UI Variable Display','Segoe UI',system-ui,-apple-system,Roboto,sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; padding: 32px; background: #0b0c18; color: #f5f6ff; font-family: var(--pb-font); }
h1 { font-size: 28px; margin: 0 0 6px; } p.lede { margin: 0 0 24px; color: #b3b7d9; font-size: 15px; max-width: 90ch; }
.theme { border-radius: 24px; padding: 20px 24px 12px; margin: 0 0 20px; border: 1px solid rgba(127,127,160,.25); }
.theme header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; }
.theme h2 { font-size: 20px; margin: 0 12px 0 0; }
.chip { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: rgba(127,127,160,.18); }
.chip.ok { background: rgba(6,214,160,.2); }
.row { display: flex; align-items: flex-start; gap: 14px; margin: 8px 0; }
.row h4 { width: 128px; flex: none; margin: 18px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; opacity: .75; }
.discs { display: flex; flex-wrap: nowrap; gap: 6px; }
.disc { margin: 0; width: 70px; text-align: center; }
.disc svg { width: 56px; height: 56px; display: block; margin: 0 auto; }
.disc figcaption { font-size: 11px; line-height: 1.25; margin-top: 4px; white-space: nowrap; }
.disc figcaption b { display: block; font-size: 13px; }
.disc.repeat figcaption::after { content: ' (13-16)'; opacity: .7; font-size: 9px; }
</style></head><body>
<h1>PartyBox player colours: now (8) vs candidate (12)</h1>
<p class="lede">Each disc is a player's avatar face in the candidate's exact 8-bit sRGB. Rows under "Candidate" are the same colours simulated for protanopia, deuteranopia and tritanopia (Machado 2009, severity 1.0, applied to the whole disc). The ring is the theme's text ink, 2.5 px, so every disc edge is at least 3:1 on its ground. Slots 13-16 repeat 1-4 with a dashed ring; the avatar face still tells players apart.</p>
${body}
</body></html>
`;
writeFileSync('partybox/sheet.html', html);

const tokens = `/* PartyBox player tokens (proposal from the B16 job). Generated by tools/build-partybox-sheet.mjs
   from partybox/palette-12.json. Replaces the eight --pb-player-1..8 lines in
   packages/client/src/styles/tokens.css and their "% 8" use in game-sdk ui/Avatar.tsx (12 slots + 4 repeats). */
:root {
${cols.map((c) => `  --pb-player-${c.slot}: ${c.hex.toLowerCase()};
  --pb-player-${c.slot}-face: ${c.face.toLowerCase()};`).join('\n')}
  --pb-player-count: 12;
  /* a disc's edge: the theme's text ink, 2.5 px; dashed on the repeated slots 13-16 */
  --pb-player-ring: #f5f6ff;
  --pb-player-ring-width: 2.5px;
}
${THEMES.filter((t) => t.key !== 'night').map((t) => `[data-theme='${t.key}'] { --pb-player-ring: ${t.ring}; }`).join('\n')}
`;
writeFileSync('partybox/tokens-player.css', tokens);
console.log('wrote partybox/sheet.html and partybox/tokens-player.css');
