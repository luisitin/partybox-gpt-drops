import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runUnit} from './suites.mjs';
/** One live emitted-JavaScript edit at a time. No mutation switches in production. */
export const mutations=[
 ['M01','Drop the rightmost horizontal placements','c + length <= size','c + length < size'],
 ['M02','Drop the bottommost vertical placements','r + length <= size','r + length < size'],
 ['M03','Double-count length-one orientations','length > 1 && r + length','length >= 1 && r + length'],
 ['M04','Put cells in the wrong 32-bit word','words[c >>> 5] = words[c >>> 5]','words[c >>> 4] = words[c >>> 4]'],
 ['M05','Lose mask bits 96 through 99','d: words[3]','d: 0'],
 ['M06','Ignore overlap in the second mask word','(x.b & y.b) | (x.c & y.c)','0 | (x.c & y.c)'],
 ['M07','Ignore overlap in the fourth mask word','| (x.d & y.d));','| 0);'],
 ['M08','Ignore required coverage in the fourth mask word','&& ((x.d & y.d) === y.d);','&& true;'],
 ['M09','Reverse set subtraction in conditional inference','a: x.a & ~y.a','a: x.a & y.a'],
 ['M10','Allow overlapping ships during joint enumeration','if (overlaps(q, used))','if (false)'],
 ['M11','Allow ship placements on blocked cells','!overlaps(p, blockedMask) &&','true &&'],
 ['M12','Leave sunk ships in the remaining fleet','if (sunken.has(ship))','if (false)'],
 ['M13','Do not block identified sunk hull cells','if (status === 1 || status === 3)','if (status === 1)'],
 ['M14','Assign a named hit to the wrong ship','own[owner].push(c);','own[(owner + 1) % own.length].push(c);'],
 ['M15','Forbid a ships own named hits instead of foreign hits','state.hitShip[c] !== ship','state.hitShip[c] === ship'],
 ['M16','Permit a fully hit ship to remain afloat','&& p.cells.some(c => state.cells[c] === 0)','&& true'],
 ['M17','Forget the global anonymous-hit coverage requirement','const hitMask = mask(hits);','const hitMask = zero();'],
 ['M18','Collapse the two distinct length-three ships','fleet: [...fleet]','fleet: [...new Set(fleet)]'],
 ['M19','Normalize exact density by the wrong count','probability: counts.map(x => x / total)','probability: counts.map(x => x / (total + 1))'],
 ['M20','Increment exact per-cell counts twice','counts[c]++;','counts[c] += 2;'],
 ['M21','Forget sampled target probability','hit = !empty(need);','hit = false;'],
 ['M22','Discard importance-sampling correction','weight *= z / (g.weights?.[pick] ?? 1);','weight *= 1;'],
 ['M23','Allow overlapping conditional moves','if (!overlaps(move, other) && contains(move, need))','if (contains(move, need))'],
 ['M24','Allow already-fired misses into shot choices','status === 0 ? [c] : []','status !== 3 ? [c] : []'],
 ['M25','Accept RNG value one and index past the candidates','x >= 0 && x < 1','x >= 0 && x <= 1']
];
export async function runMutations(AI,seed=1) {
  runUnit(AI,seed); // A failing baseline can never count as a killed mutant.
  const source=readFileSync(new URL('../dist/battleshipAI.js',import.meta.url),'utf8');
  const folder=mkdtempSync(join(tmpdir(),'b10-mutants-')),results=[];
  try {
    for(const [id,name,from,to] of mutations) {
      assert.ok(source.includes(from),`${id}: mutation site absent`);
      // replace changes the FIRST occurrence only; M23 deliberately mutates only the denominator loop.
      const altered=source.replace(from,to);assert.notEqual(altered,source);
      const path=join(folder,`${id}-seed${seed}.mjs`);writeFileSync(path,altered);
      const mutant=await import(pathToFileURL(path).href); // Import/parse errors are NOT kills.
      let killedBy=null;
      try {runUnit(mutant,seed);}catch(error){killedBy=error.message;}
      results.push({id,name,seed,killed:killedBy!==null,killedBy,from,to});
    }
  }finally{rmSync(folder,{recursive:true,force:true});}
  return {name:'25 one-at-a-time planted implementation bugs',seed,cases:25,passed:results.filter(r=>r.killed).length,results};
}
