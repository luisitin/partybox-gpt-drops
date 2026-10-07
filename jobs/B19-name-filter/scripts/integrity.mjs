import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export function integrity() {
  function walk(dir='.') {
    return readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
      const path=(dir==='.'?'':dir+'/')+entry.name;
      if(['node_modules','dist','reports/latest','data/cache','.git','SHA256SUMS.txt'].includes(path))return [];
      return entry.isDirectory()?walk(path):[path];
    });
  }
  const files=walk().sort();
  if(existsSync('../../.github/workflows/B19.yml'))files.push('../../.github/workflows/B19.yml');
  const lines=files.map(file=>`${digest(file)}  ${file}`);
  const actual=lines.join('\n')+'\n';
  writeFileSync('reports/latest/SHA256SUMS.txt',actual);
  let checked=0,failed=[];
  if(existsSync('SHA256SUMS.txt')) {
    const expected=readFileSync('SHA256SUMS.txt','utf8');
    const rows=expected.trim().split('\n');
    for(const row of rows) {
      const match=/^([0-9a-f]{64})  (.+)$/.exec(row);
      if(!match || !files.includes(match[2]) || digest(match[2])!==match[1])failed.push(row);
      else checked++;
    }
    if(expected!==actual)failed.push('Manifest must include every delivery source/document file in canonical order.');
  }
  return {files:files.length,checked,failures:failed,rootManifestPresent:existsSync('SHA256SUMS.txt'),maxFileBytes:Math.max(...files.map(f=>readFileSync(f).length))};
}
