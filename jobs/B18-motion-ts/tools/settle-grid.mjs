// Supplemental probe: is settleTime a true bound? For a grid of over/under/critically damped springs
// with adversarial initial velocities, sample the closed form for 20 rates' worth of time after the
// returned settle time and check that displacement and velocity stay within epsilon.
// Usage: npm run build && node tools/settle-grid.mjs
import { spring, settleTime } from '../dist/motion.js';

const eps = 1e-3;
let checked = 0, violations = 0;
const worst = [];
for (const z of [1.0001, 1.01, 1.5, 3, 10, 50, 200]) for (const w of [0.2, 1, 7, 40]) for (const x0 of [1, -1, 0.001]) for (const vr of [-3, -1, -0.5, 0, 0.5, 1, 3]) {
  const m = 1, k = w * w, c = 2 * z * w;
  const a = c / 2, q = Math.sqrt(a * a - k), rho = k / (a + q);
  for (const v0 of [vr * a * Math.abs(x0), -a * x0, -rho * x0, vr * rho * Math.abs(x0) + 1e-9]) {
    const T = settleTime(m, k, c, x0, v0, eps);
    if (!(T < Number.MAX_VALUE / 2)) continue;
    checked++;
    for (let s = 0; s <= 3000; s++) {
      const t = T + (20 / rho) * (s / 3000);
      const [dx, dv] = spring(t, m, k, c, x0, v0);
      if (Math.max(Math.abs(dx), Math.abs(dv)) > eps * (1 + 1e-9)) {
        violations++;
        if (worst.length < 5) worst.push({ z, w, x0, v0, T, t, dx, dv });
        break;
      }
    }
  }
}
console.log(JSON.stringify({ overdampedAndOtherGridCases: checked, violations, worst }));
if (violations) process.exitCode = 1;
