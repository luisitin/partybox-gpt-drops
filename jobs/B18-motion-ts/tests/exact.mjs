// Verification-only exact-integer Bernstein evaluator, separate from the C++
// de Casteljau oracle. Binary64 input values in the test corpus fit Q160 exactly.
const bits=new DataView(new ArrayBuffer(8)), S=1n<<160n, S3=S*S*S, S4=S3*S;
function fixed(x) {
  bits.setFloat64(0,x,false);
  const raw=bits.getBigUint64(0,false), negative=raw>>63n;
  const exponent=Number((raw>>52n)&2047n);
  const mantissa=(raw&((1n<<52n)-1n))+(exponent?1n<<52n:0n);
  const shift=(exponent?exponent-1023-52:-1074)+160;
  if(shift<0 && (mantissa&((1n<<BigInt(-shift))-1n))) throw new Error('Q160 input not exact');
  const result=shift>=0?mantissa<<BigInt(shift):mantissa>>BigInt(-shift);
  return negative?-result:result;
}
function value(t,a,b) {const u=S-t;return 3n*t*u*u*a+3n*t*t*u*b+t*t*t*S;}
function ratio(a,b) {return Number(a)/Number(b);}
export function exactBezier(p,a,b,c,d) {
  const P=fixed(p), A=fixed(a), B=fixed(b), C=fixed(c), D=fixed(d);
  if(P===0n||P===S) return p;
  if(P<0n) return A>0n?ratio(P*B,A*S):C>0n?ratio(P*D,C*S):0;
  if(P>S) return C<S?1+ratio((P-S)*(S-D),(S-C)*S):A<S?1+ratio((P-S)*(S-B),(S-A)*S):1;
  let lo=0n,hi=S;
  for(let i=0;i<160;i++) {const t=(lo+hi)>>1n; if(value(t,A,C)<P*S3)lo=t;else hi=t;}
  return ratio(value((lo+hi)>>1n,B,D),S4);
}
