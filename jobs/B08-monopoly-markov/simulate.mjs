import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { references, strategies } from './checks.mjs';
import { samplingVariance } from './sampling-variance.mjs';

const seed=Number(process.argv[2]);
assert.ok([1,2,3].includes(seed),'Fixed required seed');
const rolls=100000000;
const burnIn=10000;
const output=[];
for(const strategy of strategies) {
  // Mulberry32, fixed 32-bit arithmetic. Dice uses rejection, not rounded floats.
  let stream=(seed ^ (strategy==='leave ASAP' ? 0x6d2b79f5 : 0x9e3779b9)) >>> 0;
  function word() {
    stream=(stream+0x6d2b79f5)>>>0;
    let t=stream;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return (t^(t>>>14))>>>0;
  }
  let position=0,streak=0,jailed=-1;
  const counts=new Float64Array(40);
  for(let roll=-burnIn;roll<rolls;roll++) {
    let draw=word();
    while(draw>=4294967292)draw=word(); // 2^32 remainder 4 modulo 36.
    const joint=draw%36,first=joint%6+1,second=Math.floor(joint/6)+1;
    const double=first===second;
    let move=true;
    if(jailed>=0 && strategy==='stay max') {
      if(!double&&jailed<2){jailed++;move=false;}
      else {jailed=-1;streak=0;position=10;}
    } else {
      if(jailed>=0){jailed=-1;position=10;streak=0;}
      if(double&&streak===2){jailed=0;position=10;streak=0;move=false;}
      else streak=double?streak+1:0;
    }
    if(move) {
      position=(position+first+second)%40;
      if(position===30){position=10;jailed=0;streak=0;}
      else {
        if(position===7||position===22||position===36) {
          const card=word()&15;
          switch(card) {
            case 0:position=0;break;
            case 1:position=10;jailed=0;streak=0;break;
            case 2:position=11;break;
            case 3:position=24;break;
            case 4:position=5;break;
            case 5:position=39;break;
            case 6:case 7:position=position===7?15:position===22?25:5;break;
            case 8:position=position===22?28:12;break;
            case 9:position-=3;break;
          }
        }
        if(position===2||position===17||position===33) {
          const card=word()&15;
          if(card===0)position=0;
          else if(card===1){position=10;jailed=0;streak=0;}
        }
      }
    }
    if(roll>=0)counts[position]++;
    if(roll>=0&&(roll+1)%10000000===0)console.log(`simulation seed=${seed} strategy=${strategy} rolls=${roll+1}`);
  }
  const reference=references.get(strategy);
  const variance=samplingVariance(reference);
  let maxSigma=0;
  const squares=[];
  for(let p=0;p<40;p++) {
    const expected=rolls*reference.landing[p];
    const standardDeviation=Math.sqrt(rolls*variance.variances[p]);
    const difference=counts[p]-expected;
    const sigma=standardDeviation===0?(difference===0?0:Infinity):Math.abs(difference)/standardDeviation;
    squares.push({position:p,count:counts[p],expected,difference,standardDeviation,sigma});
    maxSigma=Math.max(maxSigma,sigma);
  }
  const result={strategy,seed,rolls,burnIn,passed:maxSigma<=4,maxSigma,
    varianceMethod:variance.method,poissonResidual:variance.maxResidual,squares};
  output.push(result);
  writeFileSync(`.verification/simulation-seed-${seed}.json`,JSON.stringify({passed:output.every(r=>r.passed),results:output},null,2)+'\n');
  assert.equal(counts.reduce((a,b)=>a+b,0),rolls,'Every movement roll counted');
  assert.ok(result.passed,`${strategy}/seed ${seed}: ${maxSigma} sigma exceeds predeclared four`);
  console.log(JSON.stringify({suite:'simulation',strategy,seed,rolls,passed:true,maxSigma,poissonResidual:variance.maxResidual}));
}
