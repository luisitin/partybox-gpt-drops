import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
process.chdir(dirname(fileURLToPath(import.meta.url)));
const ignored = new Set(['node_modules', 'build', '.verification', '.git']);
function walk(path = '.') {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name) || entry.name === 'SHA256SUMS.txt') return [];
    const name = join(path, entry.name).replaceAll('\\', '/');
    return entry.isDirectory() ? walk(name) : [name];
  });
}
const files = [...walk(), '../../.github/workflows/B02.yml'].sort();
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const text = files.map(file => `${digest(file)}  ${file}`).join('\n') + '\n';
if (process.argv.includes('--write')) writeFileSync('SHA256SUMS.txt', text);
else assert.equal(readFileSync('SHA256SUMS.txt', 'utf8'), text, 'SHA256 mismatch or an unmanifested deliverable');
console.log(`SHA256: ${files.length} files ${process.argv.includes('--write') ? 'recorded' : 'verified'}`);
