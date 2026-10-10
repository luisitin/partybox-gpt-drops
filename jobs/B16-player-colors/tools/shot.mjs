// Screenshot helper for the swatch sheet. Needs a local Chromium and Playwright (not a package dependency).
// Usage: CHROME=/path/to/chrome PLAYWRIGHT=/path/to/playwright/index.mjs node tools/shot.mjs <in.html> <out.png> [width]
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { CHROME, PLAYWRIGHT = 'playwright' } = process.env;
const { chromium } = await import(PLAYWRIGHT.startsWith('/') ? pathToFileURL(PLAYWRIGHT).href : PLAYWRIGHT);
const [, , input, output, width = '1280'] = process.argv;
const browser = await chromium.launch({ executablePath: CHROME || undefined, args: ['--no-sandbox', '--disable-background-networking'] });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(input)).href, { waitUntil: 'load' });
await page.screenshot({ path: output, fullPage: true });
await browser.close();
console.log('wrote', output);
