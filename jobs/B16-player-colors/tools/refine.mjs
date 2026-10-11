import {readFile,writeFile} from 'node:fs/promises';
import {candidate,pair,MODES,seeded} from '../dist/color.js';
let evaluations=0;
function edge(a,b,i,j){let cost=0;const d=pair(a,b);evaluations+=4;for(const mode of MODES){const threshold=mode==='normal'&&i<8&&j<8?20:12;cost+=Math.max(0,1-d[mode]/threshold)**2;}return cost;}
function score(p){let cost=0;for(let i=0;i<12;i++)for(let j=0;j<i;j++)cost+=edge(p[i],p[j],i,j);return cost;}
function valid(c){return c.darkContrast>=3&&c.lightContrast>=3&&c.textContrast>=4.5;}
function moved(old,offset){const bytes=old.rgb.map((c,i)=>Math.min(255,Math.max(0,Math.round(c*255)+offset[i])));const c=candidate('#'+bytes.map(v=>v.toString(16).padStart(2,'0')).join(''));return valid(c)?c:null;}
const offsets=[];for(const size of [1,2,4])for(let r=-1;r<=1;r++)for(let g=-1;g<=1;g++)for(let b=-1;b<=1;b++)if(r||g||b)offsets.push([r*size,g*size,b*size]);
function descend(start){let palette=start.slice(),energy=score(palette);for(let round=0;round<220;round++){let delta=0,replacement=null,index=-1;for(let i=0;i<12;i++){let prior=0;for(let j=0;j<12;j++)if(i!==j)prior+=edge(palette[i],palette[j],i,j);for(const offset of offsets){const c=moved(palette[i],offset);if(!c)continue;let next=0;for(let j=0;j<12;j++)if(i!==j)next+=edge(c,palette[j],i,j);if(next-prior<delta-1e-15){delta=next-prior;replacement=c;index=i;}}}if(!replacement)break;palette[index]=replacement;energy+=delta;if(energy<1e-13)break;}return{palette,penalty:Math.max(0,energy)};}
let globalBest=null;
for(const seed of [1,2,3]){
 const random=seeded(seed),original=JSON.parse(await readFile(`reports-run/search-seed${seed}.json`)),before=evaluations;let best=descend(original.best.palette.map(candidate));
 for(let kick=0;kick<28&&best.penalty>1e-13;kick++){
  let p=best.palette.slice();for(let k=0;k<3;k++){const at=Math.floor(random()*12),offset=Array.from({length:3},()=>Math.round((random()*2-1)*10));const c=moved(p[at],offset);if(c)p[at]=c;}const refined=descend(p);if(refined.penalty<best.penalty)best=refined;
  if(kick%7===6)console.log(`Refine seed ${seed}, kick ${kick+1}/28: squared deficit ${best.penalty.toExponential(8)}`);
 }
 if(!globalBest||best.penalty<globalBest.penalty)globalBest=best;
 await writeFile(`reports-run/refine-seed${seed}.json`,JSON.stringify({seed,evaluatedDeltaE:evaluations-before,method:'exhaustive local 1/2/4-code-value RGB moves + 28 seeded 3-color kicks',best:{penalty:best.penalty,palette:best.palette.map(c=>c.hex)},impossibilityClaim:false},null,2)+'\n');console.log(`Seed ${seed} refined penalty ${best.penalty}, palettes ${best.palette.map(c=>c.hex).join(' ')}`);
}
await writeFile('reports-run/best-palette.json',JSON.stringify({criterion:'lowest sum of squared normalized positive deficits found',penalty:globalBest.penalty,palette:globalBest.palette.map(c=>c.hex),impossibilityClaim:false},null,2)+'\n');
