// Writes SHA256SUMS.txt for every deliverable file in the job folder (everything except dependencies,
// build output, scratch evidence and the checksum file itself). Run it after the last edit of any
// deliverable; tests/run.mjs fails on any stale or missing line. Importable: running it writes the file.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const EXCLUDED=['node_modules','dist','reports-run','.mutations'];
export async function deliverables(directory=''){
 const paths=[];
 for(const entry of await readdir(directory||'.',{withFileTypes:true})){
  const path=directory?`${directory}/${entry.name}`:entry.name;
  if(EXCLUDED.includes(entry.name))continue;
  if(entry.isDirectory())paths.push(...await deliverables(path));
  else if(entry.isFile()&&path!=='SHA256SUMS.txt')paths.push(path);
 }
 return paths.sort();
}
const paths=await deliverables();
let sums='';
for(const path of paths)sums+=`${createHash('sha256').update(await readFile(path)).digest('hex')}  ${path}\n`;
await writeFile('SHA256SUMS.txt',sums);
console.log(`Checksummed ${paths.length} deliverable files.`);
