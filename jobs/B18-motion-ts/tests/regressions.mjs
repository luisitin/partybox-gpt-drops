import assert from 'node:assert/strict';
import {matrixSpring, referenceSettle} from '../dist/tests/reference.js';

export function regressions(api, seed) {
  let count=0;
  function check(name, actual, expected, tol=1e-10) {
    count++;
    const aa=Array.isArray(actual)?actual:[actual], bb=Array.isArray(expected)?expected:[expected];
    assert.equal(aa.length,bb.length,name);
    for(let j=0;j<aa.length;j++) assert.ok(Number.isFinite(aa[j]) && Math.abs(aa[j]-bb[j])<=tol,
      `${name}: got ${JSON.stringify(aa)} expected ${JSON.stringify(bb)}`);
  }
  function finite(name, actual) {
    count++;
    assert.ok((Array.isArray(actual)?actual:[actual]).every(Number.isFinite),name);
  }
  const {spring:s,settleTime:st,cubicBezier:b,easings}=api;
  for(const t of [0,.1,.5,1,5,seed/7]) {
    const e=Math.exp(-t), e3=Math.exp(-3*t), e2=Math.exp(-2*t);
    check('underdamped published form',s(t,1,5,2),[e*(Math.cos(2*t)+Math.sin(2*t)/2),-2.5*e*Math.sin(2*t)]);
    check('critical published form',s(t,1,4,4),[(1+2*t)*e2,-4*t*e2]);
    check('overdamped published form',s(t,1,3,4),[1.5*e-.5*e3,-1.5*e+1.5*e3]);
    check('mass normalization',s(t,2,10,4),s(t,1,5,2));
  }
  for(const [m,k,c,x,v] of [[1,9,1,-2,3],[1,4,4,.2,-7],[2,6,8,-1,3],[3,0,0,4,2],[1,0,2,3,4]])
    check('matrix exponential independent initial conditions',s(.4,m,k,c,x,v),matrixSpring(.4,m,k,c,x,v));
  check('zero mass at t=0',s(0,0,4,4,7,3),[0,0]);
  check('zero mass at t>0',s(1,0,4,4,7,3),[0,0]);
  check('negative mass disabled',s(1,-1,4,4),[0,0]);
  check('negative stiffness disabled',s(1,1,-4,4),[0,0]);
  check('negative damping disabled',s(1,1,4,-4),[0,0]);
  check('negative time holds initial state',s(-1,1,5,2,3,7),[3,7]);
  check('free particle',s(2,2,0,0,3,4),[11,4]);
  check('viscous free particle',s(1,1,0,2,3,4),[3+2*(1-Math.exp(-2)),4*Math.exp(-2)]);
  const M=Number.MAX_VALUE;
  finite('spring overflow is saturated',s(2,1,0,0,M,M));
  finite('spring extreme intermediates',s(M,Number.MIN_VALUE,M,M,M,M));
  check('CSS start primary tangent',b(-.5,.25,1,.8,.3),-2);
  check('CSS start secondary tangent',b(-.5,0,7,.5,2),-2);
  check('CSS start absent tangent',b(-.5,0,7,0,2),0);
  check('CSS end primary tangent',b(1.5,.2,0,.5,.75),1.25);
  check('CSS end secondary tangent',b(1.5,.4,.1,1,5),1.75);
  check('CSS end absent tangent',b(1.5,1,0,1,0),1);
  check('endpoint zero',b(0,0,2,0,3),0,0);
  check('endpoint one',b(1,1,2,1,3),1,0);
  check('invalid controls identity fallback',b(.3,-1,2,.5,3),.3,0);
  check('cubic inversion not parameter evaluation',b(.001,0,1,0,1),.271);
  check('bisection flat start',b(1e-12,0,1,0,1),.000299970001);
  for(const p of [.5-2**-53,.5,.5+2**-53]) {
    const t=.5+Math.cbrt((p-.5)/4);
    check('interior zero slope',b(p,1,0,0,1),3*t*t-2*t*t*t);
  }
  finite('bezier extrapolation saturated',b(-M,Number.MIN_VALUE,M,.5,0));
  const named={ease:[.25,.1,.25,1],'ease-in':[.42,0,1,1],'ease-out':[0,0,.58,1],'ease-in-out':[.42,0,.58,1]};
  for(const [name,points] of Object.entries(named)) for(const t of [-1,.25,.5,1,2])
    check('named easing '+name,easings[name](t),b(t,...points));
  for(const [m,k,c,x,v] of [[1,5,2,1,0],[1,4,4,1,0],[1,3,4,1,0],[2,6,8,-2,3],[1,1,2,0,2]])
    check('settle reference bisection',st(m,k,c,x,v),referenceSettle(m,k,c,x,v));
  check('settle stationary',st(1,4,4,0,0),0,0);
  check('settle undamped sentinel',st(1,4,0),M,0);
  check('settle zero stiffness sentinel',st(1,0,2),M,0);
  check('settle zero tolerance sentinel',st(1,4,4,1,0,0),M,0);
  check('settle negative tolerance sentinel',st(1,4,4,1,0,-1),M,0);
  check('settle invalid mass disabled',st(0,4,4),0,0);
  finite('settle extreme intermediates',st(Number.MIN_VALUE,M,M,M,M,Number.MIN_VALUE));
  return count;
}

// Each entry changes exactly one production-source occurrence. Compiler errors
// and import failures are NOT kills; only failed numeric/contract assertions are.
export const mutations=[
  ['M01','accept zero mass','m>0&&k>=0&&c>=0','m>=0&&k>=0&&c>=0',2,0],
  ['M02','accept negative stiffness','m>0&&k>=0&&c>=0','m>0&&true&&c>=0',2,0],
  ['M03','omit division by mass','w=k/m,d=a*a-w','w=k,d=a*a-w'],
  ['M04','lose initial velocity','if(t<=0)return[F(x),F(v)]','if(t<=0)return[F(x),0]'],
  ['M05','double decay coefficient','let a=c/m/2,w=k/m,d','let a=c/m,w=k/m,d'],
  ['M06','wrong discriminant sign','d=a*a-w','d=a*a+w'],
  ['M07','treat underdamping as critical','sqrt(abs(d))','sqrt(max(0,d))'],
  ['M08','exponential growth instead of decay','exp(-a*t)','exp(a*t)'],
  ['M09','omit sine frequency divisor','sin(q*t)/q','sin(q*t)'],
  ['M10','wrong restoring-force velocity sign','(a*v+w*x)*s','(a*v-w*x)*s'],
  ['M11','lose critical polynomial time','q?sin(q*t)/q:t','q?sin(q*t)/q:1'],
  ['M12','use fast rather than slow root','r=-w/(a+q)','r=-w/(a-q)'],
  ['M13','wrong expm1 sign','(-expm1(-2*q*t))','expm1(-2*q*t)'],
  ['M14','halve overdamped root gap','/(2*q)','/q'],
  ['M15','wrong overdamped initial coefficient','z=v-r*x','z=v+r*x'],
  ['M16','remove finite-output guard','n===n?max(-M,min(M,n)):0','n+0*min(M,M)'],
  ['M17','drop settling polynomial envelope','2*b/(Math.E*r)','0*b'],
  ['M18','use decay rather than slow settling rate','w/(a+sqrt(a*a-w))','a+0*sqrt(a*a-w)'],
  ['M19','halve settling bound','2/r*(log','1/r*(log'],
  ['M20','mistake either zero for equilibrium','||!x&&!v','||!x||!v'],
  ['M21','evaluate Bezier at progress not root','return F(B(t,b,d))','return F(B(p,b,d))'],
  ['M22','stop before bisection converges','i<64','i<8'],
  ['M23','lose start secondary tangent','a?b/a:c?d/c:0','a?b/a:0'],
  ['M24','lose end secondary tangent','a<1?(1-b)/(1-a):0','0'],
  ['M25','wrong named ease-in control','"ease-in":(t:number)=>cubicBezier(t,.42','"ease-in":(t:number)=>cubicBezier(t,.25']
];
