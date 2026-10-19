// PartyBox palette gate: the 12 8-bit colours in partybox/palette-12.json.
// Original B16 gates (CIEDE2000, Machado 2009 severity 1.0, WCAG) on the values a browser paints,
// every pair cross-checked against the independent reference implementation, plus the design gates
// the PartyBox sheet needs (chroma, hue spread, a light colour, ring contrast on all five themes).
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as p from '../dist/color.js';
import { referenceDeltaE, referenceLab, referenceSimulate, referenceContrast } from '../dist/reference.js';

const file = new URL('../partybox/palette-12.json', import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));
const colors = data.colors;
assert.equal(colors.length, 12, 'twelve colours');
const MODES = ['normal', 'protan', 'deutan', 'tritan'];
const rgbOf = (hex) => p.fromHex(hex);
const rgb = colors.map((c) => rgbOf(c.hex));

// 1. Exact 8-bit hex: every channel is an integer, so the tokens reproduce the palette exactly.
for (const c of colors) {
  assert.match(c.hex, /^#[0-9A-F]{6}$/, `${c.name} hex`);
  assert.equal(p.toHex(rgbOf(c.hex)), c.hex, `${c.name} round trip`);
}

// 2. Production and reference agree on every pair and view (diff on every case).
const prodCands = rgb.map((c) => p.candidateRgb(c));
const refLabs = rgb.map((c) => MODES.map((m) => referenceLab(referenceSimulate(c, m))));
let pairChecks = 0, maxDisagreement = 0;
const pair = [];
for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
  const prod = p.pair(prodCands[i], prodCands[j]);
  const ref = MODES.map((m, k) => referenceDeltaE(refLabs[i][k], refLabs[j][k]));
  MODES.forEach((m, k) => {
    const diff = Math.abs(prod[m] - ref[k]);
    maxDisagreement = Math.max(maxDisagreement, diff);
    assert.ok(diff < 1e-9, `pair ${i + 1}/${j + 1} ${m}: production ${prod[m]} reference ${ref[k]}`);
    pairChecks++;
  });
  pair.push({ i, j, min4: Math.min(...MODES.map((m) => prod[m])), normal: prod.normal });
}

// 3. The original B16 gates, on 8-bit values.
const first8Normal = Math.min(...pair.filter((x) => x.i < 8 && x.j < 8).map((x) => x.normal));
const all12Four = Math.min(...pair.map((x) => x.min4));
assert.ok(first8Normal >= 20, `first eight normal dE00 ${first8Normal} >= 20`);
assert.ok(all12Four >= 12, `all twelve, four views, dE00 ${all12Four} >= 12`);
for (let i = 0; i < 12; i++) {
  const text = Math.max(referenceContrast(rgb[i], [0, 0, 0]), referenceContrast(rgb[i], [1, 1, 1]));
  assert.ok(text >= 4.5, `${colors[i].name} text ${text} >= 4.5`);
}

// 4. PartyBox themes: the fill itself is judged against each theme ground (advisory: informs the ring rule).
const THEMES = {
  night: ['#0f1020', '#272a52'],
  daylight: ['#f6f5ff', '#e9e7fb'],
  arcade: ['#050014', '#23064a'],
  cabin: ['#1d1410', '#3d2e26'],
  contrast: ['#000000', '#242424'],
};
const ringRows = [];
for (const [theme, [bg, surface]] of Object.entries(THEMES)) {
  const ink = theme === 'daylight' ? '#171633' : theme === 'contrast' ? '#ffffff' : theme === 'cabin' ? '#fbf3e8' : theme === 'arcade' ? '#f0f6ff' : '#f5f6ff';
  const ringVsBg = referenceContrast(rgbOf(ink), rgbOf(bg));
  const ringVsSurface = referenceContrast(rgbOf(ink), rgbOf(surface));
  const fillVsBg = Math.min(...rgb.map((c) => referenceContrast(c, rgbOf(bg))));
  ringRows.push({ theme, bg, surface, ring: ink, ringVsBg, ringVsSurface, fillVsBg });
  // Design gate: the ring (the disc's boundary) is at least 3:1 on every theme ground and every surface.
  assert.ok(ringVsBg >= 3, `${theme}: ring vs background ${ringVsBg} >= 3`);
  assert.ok(ringVsSurface >= 3, `${theme}: ring vs surface ${ringVsSurface} >= 3`);
}

// 5. Face ink: every avatar face (graphics) is at least 3:1 on its disc.
for (const c of colors) {
  const ratio = referenceContrast(rgbOf(c.face), rgbOf(c.hex));
  assert.ok(ratio >= 3, `${c.name} face ${ratio} >= 3`);
}

// 6. Design gates: no greys, a real light colour, and hue spread (OKLCH).
const oklch = (c) => {
  const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = c.map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), h: Math.atan2(B, A) };
};
const ok = rgb.map(oklch);
const minChroma = Math.min(...ok.map((o) => o.C));
assert.ok(minChroma >= 0.1, `minimum OKLCH chroma ${minChroma} >= 0.10`);
assert.ok(Math.max(...ok.map((o) => o.L)) >= 0.85, 'a light colour (L >= 0.85)');
let minHue = 360;
const chromatic = ok.filter((o) => o.C >= 0.05);
for (let i = 0; i < chromatic.length; i++) for (let j = i + 1; j < chromatic.length; j++) {
  let d = Math.abs(chromatic[i].h - chromatic[j].h) * 180 / Math.PI;
  d = Math.min(d, 360 - d);
  minHue = Math.min(minHue, d);
}
assert.ok(minHue >= 20, `hue spread ${minHue.toFixed(1)} >= 20 degrees`);

// 7. Slots 13-16 are documented as repeats (the rule, not a colour check).
assert.equal(data.rule.includes('13-16'), true, 'the repeat rule is written down');

console.log(`partybox palette: ${pairChecks} production/reference pair rows (max disagreement ${maxDisagreement.toExponential(2)})`);
console.log(`first-8 normal dE00 ${first8Normal.toFixed(2)} (>= 20); all-12 four-view dE00 ${all12Four.toFixed(2)} (>= 12)`);
console.log(`min OKLCH chroma ${minChroma.toFixed(3)}; min hue spread ${minHue.toFixed(1)} deg; ${ringRows.length} themes ring-checked`);
console.log('PARTYBOX PALETTE GATES PASSED');
