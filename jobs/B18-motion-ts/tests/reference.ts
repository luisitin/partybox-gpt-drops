/** Verification-only implementations. No import from the production module.
 * Same author, different algorithms; NOT a claim of blind independent authorship.
 */
export type State = [number, number];

/** Classical explicit RK4, implemented directly from m*x''+c*x'+k*x=0. */
export function rk4(x: number, v: number, m: number, k: number, c: number, h: number): State {
  const force = (p: number, speed: number): number => -(k * p + c * speed) / m;
  const p1 = v, v1 = force(x, v);
  const p2 = v + h * v1 / 2, v2 = force(x + h * p1 / 2, p2);
  const p3 = v + h * v2 / 2, v3 = force(x + h * p2 / 2, p3);
  const p4 = v + h * v3, v4 = force(x + h * p3, p4);
  return [x + h * (p1 + 2 * p2 + 2 * p3 + p4) / 6,
          v + h * (v1 + 2 * v2 + 2 * v3 + v4) / 6];
}

type Matrix = [number, number, number, number];
function product(a: Matrix, b: Matrix): Matrix {
  return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3],
          a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3]];
}

/** Second spring algorithm: exp(t*A), Taylor series + scaling/squaring.
 * Does not classify damping, compute trigonometric functions, or solve roots.
 * Used only over the published, well-conditioned numerical test domain.
 */
export function matrixSpring(t: number, m: number, k: number, c: number, x=1, v=0): State {
  if (m <= 0 || k < 0 || c < 0) return [0,0];
  if (t <= 0) return [x,v];
  const norm = t * Math.max(1, (k+c)/m);
  const squares = Math.max(0, Math.ceil(Math.log2(norm / 0.25)));
  const dt = t / 2**squares;
  const a: Matrix = [0,dt,-dt*k/m,-dt*c/m];
  let total: Matrix = [1,0,0,1], term: Matrix = [1,0,0,1];
  for (let n=1; n<=24; n++) {
    term = product(term,a).map(value => value/n) as Matrix;
    total = total.map((value,i) => value + term[i]!) as Matrix;
  }
  for (let i=0; i<squares; i++) total=product(total,total);
  return [total[0]*x+total[1]*v, total[2]*x+total[3]*v];
}

/** Second settle implementation: binary search on the proved exponential bound.
 * Production inverts its logarithm instead. Bisection, no production imports.
 */
export function referenceSettle(m: number, k: number, c: number, x=1, v=0, epsilon=.001): number {
  if (m <= 0 || k < 0 || c < 0 || (x === 0 && v === 0)) return 0;
  if (k === 0 || c === 0 || epsilon <= 0) return Number.MAX_VALUE;
  const halfDrag = c/(2*m), omegaSquared = k/m;
  const discriminant = halfDrag*halfDrag-omegaSquared;
  const rate = discriminant <= 0 ? halfDrag : omegaSquared/(halfDrag+Math.sqrt(discriminant));
  const first = Math.max(Math.abs(x),Math.abs(v));
  const second = Math.max(Math.abs(v+halfDrag*x),Math.abs(halfDrag*v+omegaSquared*x));
  const coefficient = first + second * (2/Math.E) / rate;
  if (coefficient <= epsilon) return 0;
  let lo=0, hi=1;
  while (coefficient*Math.exp(-rate*hi/2)>epsilon && Number.isFinite(hi)) hi*=2;
  if (!Number.isFinite(hi)) return Number.MAX_VALUE;
  for (let i=0;i<100;i++) {
    const mid=(lo+hi)/2;
    if (coefficient*Math.exp(-rate*mid/2)>epsilon) lo=mid;
    else hi=mid;
  }
  return hi;
}
