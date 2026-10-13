import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const ignore = new Set(['node_modules','build','.verification','.git']);
function walk(directory='.') {
  return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    if(ignore.has(entry.name)||(directory==='.'&&entry.name==='SHA256SUMS.txt'))return [];
    const path=directory==='.'?entry.name:`${directory}/${entry.name}`;
    return entry.isDirectory()?walk(path):[path];
  });
}
const files=[...walk(),'../../.github/workflows/B08.yml'].sort();
const manifest=files.map(file=>`${createHash('sha256').update(readFileSync(file)).digest('hex')}  ${file}`).join('\n')+'\n';
if(process.argv.includes('--write'))writeFileSync('SHA256SUMS.txt',manifest);
else assert.equal(readFileSync('SHA256SUMS.txt','utf8'),manifest,'Deliverable inventory/hash mismatch');
console.log(`SHA256: ${files.length} files ${process.argv.includes('--write')?'recorded':'verified'}`);
