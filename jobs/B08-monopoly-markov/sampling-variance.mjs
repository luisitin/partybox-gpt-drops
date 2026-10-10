import assert from 'node:assert/strict';

/** Markov CLT variance via (I-P+1*pi)h=f; forty right-hand sides. */
export function samplingVariance(reference) {
  const {transitionCounts:counts,stateProbabilities:pi,landing} = reference;
  const square = state => state >= 117 ? 10 : Math.floor(state/3) + (state >= 90 ? 1 : 0);
  const n = 120;
  const f = Array.from({length:n},(_,s) => Array.from({length:40},(_,p) => (square(s) === p ? 1 : 0) - landing[p]));
  const a = Array.from({length:n},(_,s) => [
    ...Array.from({length:n},(_,t) => (s === t ? 1 : 0) - counts[s][t]/9216 + pi[t]), ...f[s]
  ]);
  for (let col=0;col<n;col++) {
    let pivot=col;
    for(let row=col+1;row<n;row++) if(Math.abs(a[row][col])>Math.abs(a[pivot][col])) pivot=row;
    [a[col],a[pivot]]=[a[pivot],a[col]];
    const divisor=a[col][col];
    assert.ok(Math.abs(divisor)>1e-15,'Nonsingular Poisson system');
    for(let t=col;t<n+40;t++) a[col][t]/=divisor;
    for(let row=0;row<n;row++) if(row!==col) {
      const factor=a[row][col]; a[row][col]=0;
      for(let t=col+1;t<n+40;t++) a[row][t]-=factor*a[col][t];
    }
  }
  const variances=[];
  let maxResidual=0;
  for(let p=0;p<40;p++) {
    let fh=0,f2=0;
    for(let s=0;s<n;s++) {
      fh+=pi[s]*f[s][p]*a[s][n+p]; f2+=pi[s]*f[s][p]*f[s][p];
      let residual=a[s][n+p]-f[s][p];
      let mean=0;
      for(let t=0;t<n;t++) {residual-=counts[s][t]/9216*a[t][n+p];mean+=pi[t]*a[t][n+p];}
      maxResidual=Math.max(maxResidual,Math.abs(residual+mean));
    }
    const variance=2*fh-f2;
    assert.ok(variance>=-1e-14,'Nonnegative asymptotic variance');
    variances.push(Math.max(0,variance));
  }
  assert.ok(maxResidual<1e-12,`Poisson residual ${maxResidual}`);
  return {variances,maxResidual,method:'Markov CLT: 2*pi(f*h)-pi(f^2), (I-P+1*pi)h=f'};
}
