// Browser-engine differential: cubicBezier (dist/motion.js) vs Chromium's own CSS easing.
// Each curve is a WAAPI animation with easing "cubic-bezier(...)"; the browser's eased value is read back
// through a registered <number> custom property at 41 progress points. Needs a local Chromium and Playwright.
// Usage: CHROME=/path/chrome PLAYWRIGHT=/path/playwright/index.mjs npm run browser-check
import { pathToFileURL } from 'node:url';
import { cubicBezier } from '../dist/motion.js';

const { CHROME, PLAYWRIGHT = 'playwright' } = process.env;
const { chromium } = await import(PLAYWRIGHT.startsWith('/') ? pathToFileURL(PLAYWRIGHT).href : PLAYWRIGHT);
let seed = 11;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const curves = [[0.25, 0.1, 0.25, 1], [0.42, 0, 1, 1], [0, 0, 0.58, 1], [0.42, 0, 0.58, 1]];
for (let i = 0; i < 60; i++) curves.push([rnd(), 4 * rnd() - 1.5, rnd(), 4 * rnd() - 1.5]);
const ts = Array.from({ length: 41 }, (_, i) => i / 40);
const ref = curves.map((c) => ts.map((t) => cubicBezier(t, ...c)));
const browser = await chromium.launch({ executablePath: CHROME || undefined, args: ['--no-sandbox', '--disable-background-networking'] });
const page = await browser.newPage();
await page.setContent('<style>@property --p { syntax: "<number>"; inherits: false; initial-value: 0; }</style><div id="e"></div>');
const got = await page.evaluate(({ curves, ts }) => {
  const el = document.getElementById('e');
  return curves.map((c) => {
    const a = el.animate([{ '--p': '0' }, { '--p': '1' }], { duration: 1000, easing: `cubic-bezier(${c.join(',')})`, fill: 'both' });
    a.pause();
    const out = ts.map((t) => { a.currentTime = t * 1000; return Number(getComputedStyle(el).getPropertyValue('--p')); });
    a.cancel();
    return out;
  });
}, { curves, ts });
await browser.close();
let raw = 0, afterRounding = 0, exact = 0, n = 0, named = 0;
curves.forEach((_, i) => ts.forEach((_, j) => {
  const b = got[i][j], m = ref[i][j];
  n++;
  raw = Math.max(raw, Math.abs(b - m));
  afterRounding = Math.max(afterRounding, Math.abs(b - Number(m.toPrecision(6))));
  if (b === Number(m.toPrecision(6))) exact++;
  if (i < 4) named = Math.max(named, Math.abs(b - m));
}));
console.log(JSON.stringify({ samples: n, curves: curves.length, maxAbsErrRaw: raw, maxAbsErrVsMotionRoundedTo6SigDigits: afterRounding, exactlyEqualAfterRounding: exact, namedCurvesMaxAbsErr: named }));
