import {writeFileSync,mkdirSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import * as AI from '../dist/battleshipAI.js';
import {rng,worldGenerator,applyShot,unwrap} from './support.mjs';
export function benchmark({seed=1,games=1000,difficulty='hard',named=true,samples=8,progress=false}={}) {
  const model=unwrap(AI.createModel()),boardRng=rng(seed),shotRng=AI.seededRng(seed^0xb10b10);
  const next=worldGenerator(10,model.fleet,boardRng),hist=Array(101).fill(0),latencies=new Uint32Array(1_000_001);
  let shots=0,sum=0,sum2=0,repeat=0,errors=0,maxMs=0,over50=0,sampled=0,exact=0;
  const start=performance.now();
  for(let game=0;game<games;game++) {
    const world=next();let state=AI.initialState(model),turns=0;
    while(state.sunk.length<5) {
      const t=performance.now();
      const result=AI.chooseShot(model,state,difficulty,shotRng,{samples});
      const ms=performance.now()-t;
      maxMs=Math.max(maxMs,ms);if(ms>50)over50++;
      latencies[Math.min(1_000_000,Math.ceil(ms*1000))]++;
      if(!result.ok) {errors++;throw new Error(`game=${game} difficulty=${difficulty} turns=${turns} error=${JSON.stringify(result)} state=${JSON.stringify(state)}`);}
      const {cell,method}=result.value;if(method==='exact')exact++;if(method==='sampled')sampled++;
      if(state.cells[cell]!==0){repeat++;throw new Error('Repeated shot');}
      state=applyShot(state,cell,world,named).state;
      turns++;shots++;if(turns>100)throw new Error('Game exceeded 100 shots');
    }
    hist[turns]++;sum+=turns;sum2+=turns*turns;
    if(progress&&(game+1)%10000===0)console.log(JSON.stringify({progress:true,seed,difficulty,games:game+1,mean:sum/(game+1),seconds:(performance.now()-start)/1000}));
  }
  function quantile(h,count,q){let cumulative=0;for(let i=0;i<h.length;i++){cumulative+=h[i];if(cumulative>=count*q)return i;}return h.length-1;}
  function order(k){let count=0;for(let i=0;i<hist.length;i++){count+=hist[i];if(count>k)return i;}return 100;}
  return {seed,games,difficulty,feedback:named?'named hits; named exact sunk hulls':'anonymous hits; revealed exact sunk hulls',samples,
    mean:sum/games,meanExact:`${sum}/${games}`,median:games%2?order(Math.floor(games/2)):(order(games/2-1)+order(games/2))/2,
    standardDeviation:Math.sqrt((sum2-sum*sum/games)/(games-1)),min:hist.findIndex(x=>x),max:hist.findLastIndex(x=>x),histogram:hist,
    shots,repeatedShots:repeat,errors,latency:{unit:'milliseconds',p50:quantile(latencies,shots,.5)/1000,p99:quantile(latencies,shots,.99)/1000,max:maxMs,over50},
    elapsedSeconds:(performance.now()-start)/1000,sampledShots:sampled,exactShots:exact,
    hardUnder45:difficulty==='hard'?sum/games<45:null,allShotsUnder50ms:over50===0};
}
if(process.argv[1]?.endsWith('benchmark.mjs')) {
  const seed=+(process.argv[2]??1),games=+(process.argv[3]??1000),difficulty=process.argv[4]??'hard',samples=+(process.argv[5]??8);
  const r=benchmark({seed,games,difficulty,samples,progress:true,named:process.argv[6]!=='anonymous'});
  mkdirSync('reports',{recursive:true});writeFileSync(`reports/benchmark-${difficulty}-seed${seed}-${games}.json`,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));
}
