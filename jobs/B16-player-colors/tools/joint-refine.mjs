import {readFile,writeFile}from'node:fs/promises';import{candidate,pair,MODES}from'../dist/color.js';
let evaluations=0;function edge(a,b,i,j){const d=pair(a,b);evaluations+=4;let cost=0;for(const m of MODES){const t=m==='normal'&&i<8&&j<8?20:12;cost+=Math.max(0,1-d[m]/t)**2;}return cost;}
function score(p){let cost=0;for(let i=0;i<12;i++)for(let j=0;j<i;j++)cost+=edge(p[i],p[j],i,j);return cost;}
function neighbors(old){const found=new Map();for(let r=-1;r<=1;r++)for(let g=-1;g<=1;g++)for(let b=-1;b<=1;b++){const off=[r,g,b],bytes=old.rgb.map((v,i)=>Math.min(255,Math.max(0,Math.round(v*255)+off[i]))),c=candidate('#'+bytes.map(v=>v.toString(16).padStart(2,'0')).join(''));if(c.darkContrast>=3&&c.lightContrast>=3&&c.textContrast>=4.5)found.set(c.hex,c);}return [...found.values()];}
const start=JSON.parse(await readFile('reports-run/best-palette.json'));let p=start.palette.map(candidate),energy=score(p),round=0;
for(;round<180&&energy>0;round++){
 const variants=p.map(neighbors),cache=variants.map((list,i)=>list.map(v=>{const edges=p.map((other,j)=>i===j?0:edge(v,other,i,j));return{color:v,edges,sum:edges.reduce((a,b)=>a+b,0)};})),old=p.map((v,i)=>{const edges=p.map((other,j)=>i===j?0:edge(v,other,i,j));return{edges,sum:edges.reduce((a,b)=>a+b,0)};});
 let best=0,change=null;
 for(let i=0;i<12;i++)for(let j=0;j<i;j++){const prior=old[i].sum+old[j].sum-old[i].edges[j];for(const a of cache[i])for(const b of cache[j]){const next=a.sum+b.sum-a.edges[j]-b.edges[i]+edge(a.color,b.color,i,j),delta=next-prior;if(delta<best-1e-16){best=delta;change={i,j,a:a.color,b:b.color};}}}
 if(!change)break;p[change.i]=change.a;p[change.j]=change.b;energy=score(p);console.log(`Joint round ${round+1}: penalty ${energy.toExponential(12)}`);
}
const result={criterion:start.criterion,penalty:energy,palette:p.map(c=>c.hex),jointRounds:round,evaluatedDeltaE:evaluations,method:'exhaustive simultaneous one-code-value RGB moves for all 66 index pairs',impossibilityClaim:false};await writeFile('reports-run/joint-refine.json',JSON.stringify(result,null,2)+'\n');if(energy<start.penalty)await writeFile('reports-run/best-palette.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
