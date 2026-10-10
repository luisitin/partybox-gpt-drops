// Writes demo/curves.html: one self-contained page (no network, opens from disk) that animates the
// easing curves and springs side by side. It inlines dist/motion.js so the demo runs the shipped code.
// Usage: npm run build && node tools/make-demo.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const motion = readFileSync(path.join(root, 'dist/motion.js'), 'utf8')
  .replace(/^export /gm, '')
  .replace(/\n?\/\/# sourceMappingURL=.*$/m, '');
const template = readFileSync(path.join(root, 'demo/curves.template.html'), 'utf8');
writeFileSync(path.join(root, 'demo/curves.html'), template.replace('/*MOTION*/', () => motion));
console.log('wrote demo/curves.html', motion.length, 'bytes of motion code');
