import {candidate,minimumPair,pair,seeded,MODES} from '../dist/color.js';
import {writeFile,mkdir} from 'node:fs/promises';
const seeds=process.argv.slice(2).map(Number);if(!seeds.length)seeds.push(1,2,3);
await mkdir('reports-run',{recursive:true});
const threshold=(mode,i,j)=>mode==='normal'&&i<8&&j<8?20:12;
let distanceEvaluations=0;
function edge(a,b,i,j){const distances=pair(a,b);distanceEvaluations+=4;let penalty=0,soft=0,minRatio=Infinity;for(const mode of MODES){const ratio=distances[mode]/threshold(mode,i,j);penalty+=Math.max(0,1-ratio)**2;soft+=Math.exp(-ratio*2)*.00002;minRatio=Math.min(minRatio,ratio);}return{penalty,energy:penalty+soft,minRatio,distances};}
function grid(palette){const matrix=Array.from({length:12},()=>Array(12).fill(null));let energy=0,penalty=0,minRatio=Infinity;for(let i=0;i<12;i++)for(let j=0;j<i;j++){const e=edge(palette[i],palette[j],i,j);matrix[i][j]=matrix[j][i]=e;energy+=e.energy;penalty+=e.penalty;minRatio=Math.min(minRatio,e.minRatio);}return{matrix,energy,penalty,minRatio};}
function valid(c){return c.darkContrast>=3&&c.lightContrast>=3&&c.textContrast>=4.5;}
function draw(random){for(;;){const hex='#'+Array.from({length:3},()=>Math.floor(random()*256).toString(16).padStart(2,'0')).join('');const c=candidate(hex);if(valid(c))return c;}}
function move(old,random,scale){for(let attempt=0;attempt<15;attempt++){const values=old.rgb.map(c=>Math.min(255,Math.max(0,Math.round(c*255+(random()*2-1)*scale))));const c=candidate('#'+values.map(v=>v.toString(16).padStart(2,'0')).join(''));if(valid(c))return c;}return draw(random);}
for(const seed of seeds){
 const random=seeded(seed),before=distanceEvaluations;let best=null,accepted=0,trials=0;
 for(let restart=0;restart<5;restart++){
  let palette;if(best&&restart%2){palette=best.palette.slice();for(let k=0;k<4;k++)palette[Math.floor(random()*12)]=draw(random);}else{palette=[];const pool=Array.from({length:350},()=>draw(random));while(palette.length<12){let winner=pool[0],score=-1;for(const c of pool){let nearest=Infinity;for(const other of palette)nearest=Math.min(nearest,minimumPair(c,other));if(nearest>score){winner=c;score=nearest;}}palette.push(winner);pool.splice(pool.indexOf(winner),1);}}
  let state=grid(palette);
  for(let step=0;step<65000;step++){
   trials++;const progress=step/65000,temp=.0025*(1-progress)**3+.00000015;
   let index=Math.floor(random()*12);
   if(random()<.65){let worst=0;for(let i=0;i<12;i++)for(let j=0;j<i;j++)if(state.matrix[i][j].penalty>worst){worst=state.matrix[i][j].penalty;index=random()<.5?i:j;}}
   const proposal=random()<.12?draw(random):move(palette[index],random,random()<.15?120:6+60*(1-progress));
   let previous=0,next=0,newPenalty=state.penalty;const edges=[];
   for(let j=0;j<12;j++)if(j!==index){const old=state.matrix[index][j],e=edge(proposal,palette[j],index,j);previous+=old.energy;next+=e.energy;newPenalty+=e.penalty-old.penalty;edges[j]=e;}
   const change=next-previous;
   if(change<0||random()<Math.exp(-change/temp)){
    accepted++;palette[index]=proposal;state.energy+=change;state.penalty=newPenalty;state.minRatio=Infinity;
    for(let j=0;j<12;j++)if(j!==index)state.matrix[index][j]=state.matrix[j][index]=edges[j];
    for(let i=0;i<12;i++)for(let j=0;j<i;j++)state.minRatio=Math.min(state.minRatio,state.matrix[i][j].minRatio);
    if(!best||state.penalty<best.penalty-1e-14||(Math.abs(state.penalty-best.penalty)<1e-14&&state.minRatio>best.minRatio)){
     best={palette:palette.slice(),penalty:state.penalty,minRatio:state.minRatio,trial:trials};
     if(best.penalty<1e-12){console.log(`Seed ${seed}: feasible palette at trial ${trials}`);break;}
    }
   }
  }
  console.log(`Search seed ${seed}, restart ${restart+1}/5: best squared deficit ${best.penalty.toFixed(7)}, min normalized distance ${best.minRatio.toFixed(6)}, ${trials} moves`);
  await writeFile(`reports-run/search-seed${seed}.json`,JSON.stringify({seed,requestedFirst8Normal:20,requestedAll12EachView:12,moves:trials,accepted,distanceEvaluations:distanceEvaluations-before,best:{...best,palette:best.palette.map(c=>c.hex)},impossibilityClaim:false},null,2)+'\n');
  if(best.penalty<1e-12)break;
 }
}
