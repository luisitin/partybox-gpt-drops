// Writes partybox/palette-12.json from the seeded search output (tools/search-partybox.mjs).
// Names are slot labels for the sheet and the port; face ink is whichever avatar ink has the higher WCAG ratio.
// Usage: node tools/build-partybox-palette.mjs <search-output.json>
import { readFileSync, writeFileSync } from 'node:fs';
import * as p from '../dist/color.js';

const [, , input] = process.argv;
const search = JSON.parse(readFileSync(input, 'utf8'));
const NAMES = [
  ['Ocean', 'Océano'], ['Berry', 'Frambuesa'], ['Coral', 'Coral'], ['Violet', 'Violeta'],
  ['Forest', 'Bosque'], ['Peach', 'Melocotón'], ['Aqua', 'Aguamarina'], ['Butter', 'Mantequilla'],
  ['Lime', 'Lima'], ['Periwinkle', 'Azul lavanda'], ['Turquoise', 'Turquesa'], ['Ochre', 'Ocre'],
];
const INK = p.fromHex('#1a0b12'); // PartyBox avatar ink (game-sdk ui/avatarArt.tsx)
const LIGHT = p.fromHex('#fff7fb'); // PartyBox avatar light
const colors = search.colors.map((c, i) => {
  const rgb = c.rgb.map((x) => Math.round(x * 255) / 255);
  const hex = p.toHex(rgb);
  const inkRatio = p.contrast(rgb, INK), lightRatio = p.contrast(rgb, LIGHT);
  return {
    slot: i + 1,
    name: NAMES[i][0],
    es: NAMES[i][1],
    hex,
    face: inkRatio >= lightRatio ? '#1a0b12' : '#fff7fb',
    faceContrast: Number(Math.max(inkRatio, lightRatio).toFixed(3)),
  };
});
const out = {
  schema: 1,
  name: 'PartyBox 12 (ring boundary)',
  method: 'tools/search-partybox.mjs, seed 1, 30000 steps x 3 restarts, ring mode, HUE_MIN=20, CHROMA_MIN=0.10 (search score ' + search.score.toFixed(4) + ')',
  rule: 'Values are 8-bit sRGB hex: they are the values a browser paints. Slots 13-16 reuse slots 1-4 with a dashed outer ring; the avatar face id still tells players apart.',
  boundary: 'Every disc has a 2.5px ring in the theme text colour (tokens.css), so its edge is >= 3:1 on every theme; this replaces the literal fill-on-light rule that the search could not satisfy with vivid colours.',
  colors,
};
writeFileSync('partybox/palette-12.json', JSON.stringify(out, null, 2) + '\n');
console.log(colors.map((c) => `${c.slot} ${c.name} ${c.hex} face ${c.face} ${c.faceContrast}`).join('\n'));
