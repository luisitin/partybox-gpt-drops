// Authored independently from the ODE, without reading any B18 implementation.
const saturated = value => Number.isNaN(value) ? 0 :
  Math.max(-Number.MAX_VALUE, Math.min(Number.MAX_VALUE, value));

// Double-precision analytic convenience evaluator. The separate quad binary's
// --spring mode is the semantic reference at extreme coefficient scales.
export function spring(t, mass, stiffness, damping, x0 = 1, v0 = 0) {
  if (![t, mass, stiffness, damping, x0, v0].every(Number.isFinite) ||
      mass <= 0 || stiffness < 0 || damping < 0) return [0, 0];
  if (t <= 0) return [x0, v0];
  if (stiffness === 0) {
    if (damping === 0) return [saturated(x0 + v0 * t), v0];
    const rate = damping / mass;
    const decay = Math.exp(-rate * t);
    return [saturated(x0 - v0 * Math.expm1(-rate * t) / rate),
      saturated(v0 * decay)];
  }
  const alpha = damping / mass / 2;
  const omega = Math.sqrt(stiffness) / Math.sqrt(mass);
  let x, v;
  if (alpha < omega) {
    const beta = omega * Math.sqrt((1 - alpha / omega) * (1 + alpha / omega));
    const decay = Math.exp(-alpha * t);
    const sine = Math.sin(beta * t) / beta;
    const cosine = Math.cos(beta * t);
    x = decay * (x0 * cosine + (v0 + alpha * x0) * sine);
    v = decay * (v0 * cosine - (alpha * v0 + omega * omega * x0) * sine);
  } else if (alpha === omega) {
    const z = v0 + alpha * x0;
    const decay = Math.exp(-alpha * t);
    x = decay * (x0 + z * t);
    v = decay * (v0 - alpha * z * t);
  } else {
    const radical = alpha * Math.sqrt((1 - omega / alpha) * (1 + omega / alpha));
    const slow = -(omega / (alpha + radical)) * omega;
    const fast = -alpha - radical;
    const gap = 2 * radical;
    const z = v0 - slow * x0;
    const span = -Math.expm1(-gap * t) / gap;
    x = Math.exp(slow * t) * (x0 + z * span);
    v = slow * x + z * Math.exp(fast * t);
  }
  return [saturated(x), saturated(v)];
}

export function rk4Step(state, dt, mass, stiffness, damping) {
  const x = state[0];
  const v = state[1];
  const acceleration = (position, velocity) =>
    (-stiffness * position - damping * velocity) / mass;
  const a1 = acceleration(x, v);
  const x2 = x + dt * v / 2;
  const v2 = v + dt * a1 / 2;
  const a2 = acceleration(x2, v2);
  const x3 = x + dt * v2 / 2;
  const v3 = v + dt * a2 / 2;
  const a3 = acceleration(x3, v3);
  const x4 = x + dt * v3;
  const v4 = v + dt * a3;
  const a4 = acceleration(x4, v4);
  return [
    x + dt * (v + 2 * v2 + 2 * v3 + v4) / 6,
    v + dt * (a1 + 2 * a2 + 2 * a3 + a4) / 6,
  ];
}

export function rk4Trajectory(mass, stiffness, damping, x0, v0, steps,
                              dt = 1e-4) {
  const result = [[x0, v0]];
  let state = result[0];
  for (let i = 0; i < steps; ++i) {
    state = rk4Step(state, dt, mass, stiffness, damping);
    result.push(state);
  }
  return result;
}

const logSum = (a, b) => {
  const high = Math.max(a, b);
  if (high === -Infinity) return high;
  return high + Math.log1p(Math.exp(Math.min(a, b) - high));
};

// A valid conservative bound; equality with another conservative bound is not
// part of the contract. Number.MAX_VALUE denotes no representable estimate.
export function settleTime(mass, stiffness, damping, x0 = 1, v0 = 0,
                           epsilon = 0.001) {
  if (![mass, stiffness, damping, x0, v0, epsilon].every(Number.isFinite) ||
      mass <= 0 || stiffness < 0 || damping < 0 || epsilon <= 0) return 0;
  if (x0 === 0 && v0 === 0) return 0;
  if (stiffness === 0 || damping === 0) return Number.MAX_VALUE;
  const lx = Math.log(Math.abs(x0));
  const lv = Math.log(Math.abs(v0));
  const la = Math.log(damping) - Math.log(mass) - Math.LN2;
  const lw2 = Math.log(stiffness) - Math.log(mass);
  // r <= alpha in underdamping and r <= the slow root in overdamping.
  const lr = Math.min(la, Math.log(stiffness) - Math.log(damping));
  const lA = Math.max(lx, lv);
  const lB = Math.max(logSum(lv, la + lx), logSum(la + lv, lw2 + lx));
  const le = Math.log(epsilon);
  let y = 1;
  while (logSum(lA, lB - lr + Math.log(y)) - y > le) y *= 2;
  const logTime = Math.log(y) - lr;
  if (logTime >= Math.log(Number.MAX_VALUE)) return Number.MAX_VALUE;
  const answer = Math.exp(logTime) * (1 + 1e-12);
  return Number.isFinite(answer) ? answer : Number.MAX_VALUE;
}

export const namedControlPoints = Object.freeze({
  ease: Object.freeze([0.25, 0.1, 0.25, 1]),
  'ease-in': Object.freeze([0.42, 0, 1, 1]),
  'ease-out': Object.freeze([0, 0, 0.58, 1]),
  'ease-in-out': Object.freeze([0.42, 0, 0.58, 1]),
});
