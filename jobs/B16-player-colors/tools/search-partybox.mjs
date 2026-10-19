// Bounded hill-climb: find 12 vivid sRGB colours that keep every numeric gate of the B16 spec
// (first-8 normal dE00 >= 20; all 12 pairs >= 12 under normal + protan/deutan/tritan; text 4.5:1).
// Two extra premium terms: OKLCH chroma >= 0.10 (no greys), and one gold-light colour (L >= 0.85).
// Mode "ring": the fill-on-light rule (>= 3:1 vs #F7F5F0) is NOT required; the disc gets a ring instead.
// Usage: node vivid-search.mjs <seed> <iterations> <out.json>
import { writeFileSync } from 'node:fs';
import * as p from '../dist/color.js';

const [, , seedArg = '1', itersArg = '20000', outFile = '/dev/stdout', modeArg = 'ring'] = process.argv;
const LITERAL = modeArg === 'literal';
const CHROMA_MIN = Number(process.env.CHROMA_MIN ?? '0.10');
const q8 = (c) => Math.round(c * 255) / 255;
let seed = Number(seedArg) >>> 0;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const N = 12;
const DARK = p.fromHex('#121218'); // B16 spec dark ground; text-free fill rule is dropped in ring mode
const NIGHT = p.fromHex('#0f1020');
const LIGHT = p.fromHex('#F7F5F0');
const DAY = p.fromHex('#f6f5ff');

function oklch(rgb) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const r = lin(rgb[0]), g = lin(rgb[1]), b = lin(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), A, B };
}

const clamp = (x) => Math.min(1, Math.max(0, x));
// state: array of 12 rgb triples in [0,1]
function views(rgb0) {
  const rgb = rgb0.map(q8);
  return ['normal', 'protan', 'deutan', 'tritan'].map((mode) => p.rgbToLab(p.simulate(rgb, mode)));
}
function score(cols, V) {
  let worst = Infinity;
  const term = (v) => { if (v < worst) worst = v; };
  const Q = cols.map((c) => c.map(q8));
  for (let i = 0; i < N; i++) {
    const c = Q[i];
    const o = oklch(c);
    term(o.C / CHROMA_MIN);
    const text = Math.max(p.contrast(c, [0, 0, 0]), p.contrast(c, [1, 1, 1]));
    term(text / 4.5);
    if (!process.env.NO_PB) term(p.contrast(c, NIGHT) / 3);
    if (LITERAL) { term(p.contrast(c, DARK) / 3); term(p.contrast(c, LIGHT) / 3); if (!process.env.NO_PB) term(p.contrast(c, DAY) / 3); }
  }
  // hue spread: every pair of chromatic colours at least HUE_MIN degrees apart (OKLCH hue)
  const HUE_MIN = Number(process.env.HUE_MIN ?? '0');
  if (HUE_MIN > 0) {
    const hs = Q.map((c) => { const o = oklch(c); return o.C < 0.05 ? null : Math.atan2(o.B, o.A); }).filter((h) => h !== null);
    let minDiff = 360;
    for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++) { let d = Math.abs(hs[i] - hs[j]) * 180 / Math.PI; d = Math.min(d, 360 - d); if (d < minDiff) minDiff = d; }
    term(minDiff / HUE_MIN);
  }
  // ring mode only: one gold-light colour (a real yellow for the party palette)
  if (!LITERAL) term(Math.max(...Q.map((c) => oklch(c).L)) / 0.85);
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    const d = (k) => p.deltaE(V[i][k], V[j][k]);
    const normal = d(0);
    if (i < 8 && j < 8) term(normal / 20);
    term(Math.min(d(0), d(1), d(2), d(3)) / 12);
  }
  return worst; // >= 1 means every gate passes with this margin
}

const iters = Number(itersArg);
let best = null;
for (let restart = 0; restart < 3; restart++) {
  let cols = Array.from({ length: N }, () => [rnd(), rnd(), rnd()]);
  let V = cols.map(views);
  let cur = score(cols, V);
  let step = 0.12;
  for (let it = 0; it < iters; it++) {
    const i = Math.floor(rnd() * N);
    const trial = cols[i].map((c) => clamp(c + step * (rnd() * 2 - 1)));
    const old = cols[i], oldV = V[i];
    cols[i] = trial; V[i] = views(trial);
    const s = score(cols, V);
    if (s >= cur) cur = s; else { cols[i] = old; V[i] = oldV; }
    if (it % 2000 === 1999) step = Math.max(0.005, step * 0.8);
  }
  if (!best || cur > best.score) best = { score: cur, cols: cols.map((c) => c.slice()) };
  console.error(`restart ${restart}: score ${cur.toFixed(4)}`);
}
const out = {
  note: 'bounded hill-climb, ring mode; continuous values; 8-bit rounding and gates are checked separately',
  seed: Number(seedArg), iterations: iters, score: best.score,
  colors: best.cols.map((rgb, i) => ({ name: `V${i + 1}`, rgb: rgb.map((c) => Math.round(c * 255) / 255) })),
};
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.error('best score', best.score.toFixed(4));
