import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root,hash } from './helpers.mjs';
const lines=readFileSync(resolve(root,'SHA256SUMS.txt'),'utf8').trim().split('\n');
const seen=new Set();
for(const line of lines){
 const match=/^([a-f0-9]{64})  (.+)$/.exec(line);assert.ok(match,'invalid manifest line');
 const [,expected,path]=match;
 assert.ok(!seen.has(path),'duplicate manifest path');seen.add(path);
 assert.ok(path==='../../.github/workflows/B11.yml'||(!path.startsWith('/')&&!path.split('/').includes('..')));
 assert.equal(hash(readFileSync(resolve(root,path))),expected,`checksum mismatch: ${path}`);
}
console.log(`SHA256: ${seen.size}/${seen.size} files passed (manifest itself excluded)`);
