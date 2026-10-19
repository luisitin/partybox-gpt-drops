// Gate report for the canonical 16-bit palette (palette.json) at full precision and after rounding
// each channel to 8 bits, which is what a browser paints. Prints the B16 gates for both.
// Usage: node tools/canonical-8bit.mjs   (after npm run build)
import { readFileSync } from 'node:fs';
import * as p from '../dist/color.js';

const colors = JSON.parse(readFileSync('palette.json', 'utf8')).colors;
function gates(label, list) {
  const cands = list.map((c) => p.candidateRgb(c.rgb));
  const pairs = [];
  for (let i = 0; i < cands.length; i++) for (let j = i + 1; j < cands.length; j++) {
    const d = p.pair(cands[i], cands[j]);
    pairs.push({ i, j, normal: d.normal, min4: Math.min(d.normal, d.protan, d.deutan, d.tritan) });
  }
  const first8 = Math.min(...pairs.filter((x) => x.i < 8 && x.j < 8).map((x) => x.normal));
  const all4 = Math.min(...pairs.map((x) => x.min4));
  const pass = first8 >= 20 && all4 >= 12;
  console.log(`${label.padEnd(26)} first-8 normal dE00 min ${first8.toFixed(2)} (need 20)   all-12 four-view min ${all4.toFixed(2)} (need 12)   ${pass ? 'PASS' : 'FAIL'}`);
  return { first8, all4, pass };
}
const exact = gates('canonical 16-bit (exact)', colors);
const rounded = gates('canonical rounded to 8-bit', colors.map((c) => ({ name: c.name, rgb: c.rgb.map((x) => Math.round(x * 255) / 255) })));
const hexes = colors.map((c) => p.toHex(c.rgb.map((x) => Math.round(x * 255) / 255)));
console.log('8-bit hex:', hexes.join(' '));
if (exact.pass !== true) throw new Error('canonical exact values must pass (B16 acceptance)');
console.log(rounded.pass ? 'rounded palette passes' : 'rounded palette FAILS the B16 gates: use partybox/palette-12.json');
