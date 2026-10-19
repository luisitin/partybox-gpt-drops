/**
 * TEST TWIN (evidence, not product): a second implementation of the v2 recipe maths in RECIPES.md,
 * written by the same author as dsp.ts but structured differently so shared slips are less likely
 * to cancel out. It is NOT blind. Differences from dsp.ts by design:
 *   - sample-major: every output sample sums all active voices, instead of one layer at a time;
 *   - closed forms for decay, glide, FM index and pan (dsp.ts multiplies recursively);
 *   - Zavalishin's SVF solution (dsp.ts uses Simper's tick), transposed direct form II biquads,
 *     an explicit 8×8 Hadamard matrix, whole-signal delay lines instead of ring buffers;
 *   - a sparse forward minimum and prefix sums in the limiter (dsp.ts: monotonic deque, running sum);
 *   - loudness from the sealed blind meter in reference.ts, never from meter.ts.
 * Only the types are shared. The tests diff every sound, every seed, both channels against dsp.ts.
 */
import {referenceMeter} from './reference.js';
import type {EqBand, NoiseLayer, Recipe, RoomSpec, ScatterLayer, Stereo, ToneLayer} from './dsp.js';

const SR = 48000;
const TAU = Math.PI * 2;

function generator(seed: number): () => number {
  let state = seed % 4294967296;
  return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
}
function subSeed(next: () => number): number {
  const value = next();
  if (!(value >= 0 && value < 1)) throw new RangeError('RNG must return [0,1)');
  return Math.floor(value * 4294967296);
}
function pan(position: number): [number, number] {
  const p = position < -1 ? -1 : position > 1 ? 1 : position;
  return [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];
}
function rise(j: number, samples: number): number {
  return j < samples ? 0.5 - 0.5 * Math.cos(Math.PI * j / samples) : 1;
}
function wobble(depth: number, hz: number, t: number): number {
  return depth > 0 ? 1 - depth * (0.5 - 0.5 * Math.cos(TAU * hz * t)) : 1;
}
function placeAt(layer: ToneLayer | NoiseLayer, t: number, offset: number): number {
  return layer.move > 0 ? layer.pan + (layer.panTo - layer.pan) * Math.min(1, t / layer.move) + offset : layer.pan + offset;
}

/** A tone voice (one unison copy) or a noise voice, with its running state. */
interface Voice {
  readonly layer: ToneLayer | NoiseLayer;
  readonly from: number;
  readonly to: number;
  readonly position: number;
  readonly noise: (() => number) | null;
  readonly phases: Float64Array;
  carrier: number;
  s1: number;
  s2: number;
}

function voicesOf(layer: ToneLayer | NoiseLayer, seed: number, n: number): Voice[] {
  let slowest = 1;
  if (layer.kind === 'tone') for (const partial of layer.partials) if (partial.decay > slowest) slowest = partial.decay;
  const from = Math.round(layer.at * SR);
  const to = Math.min(n, from + Math.ceil((layer.attack + layer.hold + 1.5 * layer.t60 * slowest) * SR));
  if (layer.kind === 'noise') return [{layer, from, to, position: 0, noise: generator(seed), phases: new Float64Array(0), carrier: 0, s1: 0, s2: 0}];
  const copies = Math.max(1, Math.round(layer.unison));
  return Array.from({length: copies}, (_, v) => ({layer, from, to, position: copies > 1 ? 2 * v / (copies - 1) - 1 : 0, noise: null,
    phases: new Float64Array(layer.partials.length), carrier: 0, s1: 0, s2: 0}));
}

function scatterVoices(scatter: ScatterLayer, seed: number, n: number): Voice[] {
  const next = generator(seed), out: Voice[] = [];
  const events = Math.max(1, Math.round(scatter.count));
  for (let e = 0; e < events; e++) {
    const x = events > 1 ? e / (events - 1) : 0;
    const when = scatter.at + scatter.span * Math.pow(x, scatter.curve) + scatter.jitter * scatter.span / events * (2 * next() - 1);
    const db = scatter.gainJitterDb * (2 * next() - 1) - scatter.fallDb * x;
    const ratio = Math.pow(2, scatter.pitchJitter * (2 * next() - 1) / 12);
    const shift = scatter.panSpread * (2 * next() - 1);
    for (const template of scatter.layers) {
      const common = {at: Math.max(0, when + template.at), gainDb: template.gainDb + db, pan: template.pan + shift, panTo: template.panTo + shift, hz: template.hz * ratio};
      const layer: ToneLayer | NoiseLayer = template.kind === 'tone'
        ? {...template, ...common, glideTo: template.glideTo * ratio}
        : {...template, ...common, hzTo: template.hzTo * ratio};
      out.push(...voicesOf(layer, subSeed(next), n));
    }
  }
  return out;
}

/** One voice's stereo contribution at sample i (advances its state). */
function tick(voice: Voice, i: number, k: number): [number, number] {
  const layer = voice.layer, j = i - voice.from, t = j / SR;
  const lead = (layer.attack + layer.hold) * SR;
  const tremolo = wobble(layer.tremoloDepth, layer.tremoloHz, t), onset = rise(j, layer.attack * SR);
  if (layer.kind === 'noise') {
    const sweep = layer.move > 0 ? Math.min(1, t / layer.move) : 0;
    const cutoff = Math.min(20000, Math.max(20, layer.hz * Math.pow(layer.hzTo / layer.hz, sweep) * k));
    const g = Math.tan(Math.PI * cutoff / SR), r2 = 1 / layer.q, input = 2 * voice.noise!() - 1;
    const high = (input - (r2 + g) * voice.s1 - voice.s2) / (1 + r2 * g + g * g);
    const band = g * high + voice.s1, low = g * band + voice.s2;
    voice.s1 = g * high + band; voice.s2 = g * band + low;
    const shaped = layer.filter === 'lp' ? low : layer.filter === 'bp' ? r2 * band : high;
    const fall = j >= lead ? Math.pow(10, -3 * (j - lead) / (layer.t60 * SR)) : 1;
    const value = shaped * onset * fall * tremolo * Math.pow(10, layer.gainDb / 20);
    const [l, r] = pan(placeAt(layer, t, 0));
    return [value * l, value * r];
  }
  const copies = Math.max(1, Math.round(layer.unison));
  let hz = layer.glide > 0 ? layer.glideTo + (layer.hz - layer.glideTo) * Math.exp(-j / (layer.glide * SR)) : layer.hz;
  if (layer.vibratoCents !== 0) hz *= Math.pow(2, layer.vibratoCents * Math.sin(TAU * layer.vibratoHz * t) / 1200);
  hz *= Math.pow(2, layer.detuneCents * voice.position / 1200) * k;
  const index = layer.fmIndex > 0 ? layer.fmIndex * Math.pow(10, -3 * j / (layer.fmT60 * SR)) : 0;
  const modulation = index > 0 ? index * Math.sin(voice.carrier) : 0;
  let sum = 0;
  layer.partials.forEach((partial, p) => {
    const f = hz * partial.ratio;
    const fade = f >= 20000 ? 0 : f > 16000 ? (20000 - f) / 4000 : 1;
    const fall = j >= lead ? Math.pow(10, -3 * (j - lead) / (layer.t60 * partial.decay * SR)) : 1;
    sum += partial.gain * fall * fade * Math.sin(voice.phases[p]! + (p === 0 ? modulation : 0));
    voice.phases[p] = voice.phases[p]! + TAU * f / SR;
  });
  voice.carrier += TAU * hz * layer.fmRatio / SR;
  const value = sum * onset * tremolo * Math.pow(10, layer.gainDb / 20) / Math.sqrt(copies);
  const [l, r] = pan(placeAt(layer, t, layer.spread * voice.position));
  return [value * l, value * r];
}

function filterBand(x: Float64Array, band: EqBand): Float64Array {
  const w = TAU * band.hz / SR, c = Math.cos(w), al = Math.sin(w) / (2 * band.q), A = Math.pow(10, band.db / 40), rs = 2 * Math.sqrt(A) * al;
  const raw: Record<EqBand['type'], [number, number, number, number, number, number]> = {
    lp: [(1 - c) / 2, 1 - c, (1 - c) / 2, 1 + al, -2 * c, 1 - al],
    hp: [(1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al],
    peak: [1 + al * A, -2 * c, 1 - al * A, 1 + al / A, -2 * c, 1 - al / A],
    lowshelf: [A * (A + 1 - (A - 1) * c + rs), 2 * A * (A - 1 - (A + 1) * c), A * (A + 1 - (A - 1) * c - rs), A + 1 + (A - 1) * c + rs, -2 * (A - 1 + (A + 1) * c), A + 1 + (A - 1) * c - rs],
    highshelf: [A * (A + 1 + (A - 1) * c + rs), -2 * A * (A - 1 + (A + 1) * c), A * (A + 1 + (A - 1) * c - rs), A + 1 - (A - 1) * c + rs, 2 * (A - 1 - (A + 1) * c), A + 1 - (A - 1) * c - rs],
  };
  const [b0, b1, b2, a0, a1, a2] = raw[band.type];
  const y = new Float64Array(x.length);
  let z1 = 0, z2 = 0;
  for (let i = 0; i < x.length; i++) {
    const out = (b0 / a0) * x[i]! + z1;
    z1 = (b1 / a0) * x[i]! - (a1 / a0) * out + z2;
    z2 = (b2 / a0) * x[i]! - (a2 / a0) * out;
    y[i] = out;
  }
  return y;
}

const HADAMARD = Array.from({length: 8}, (_, r) => Array.from({length: 8}, (_, c) => {
  let bits = r & c, sign = 1; while (bits) { sign = -sign; bits &= bits - 1; } return sign;
}));

function space(send: Float64Array, spec: RoomSpec): Stereo {
  const n = send.length, left = new Float64Array(n), right = new Float64Array(n);
  if (!(spec.rt60 > 0)) return {left, right};
  const skip = Math.round(spec.predelay * SR), scale = Math.SQRT1_2 / 2;
  let x = Float64Array.from(send, (_, i) => i >= skip ? send[i - skip]! : 0);
  for (const length of [142, 107, 379, 277]) {
    const v = new Float64Array(n), y = new Float64Array(n);
    for (let i = 0; i < n; i++) { const late = i >= length ? v[i - length]! : 0; v[i] = x[i]! + 0.62 * late; y[i] = late - 0.62 * v[i]!; }
    x = y;
  }
  const lengths = [1153, 1327, 1559, 1733, 1999, 2203, 2459, 2687].map(d => Math.max(8, Math.round(d * spec.size)));
  const loss = lengths.map(d => Math.pow(10, -3 * d / (spec.rt60 * SR))), pole = Math.exp(-TAU * spec.damp / SR);
  const written = lengths.map(() => new Float64Array(n)), smooth = new Float64Array(8);
  const inSign = [1, -1, 1, 1, -1, 1, -1, -1], leftSign = [1, 1, -1, -1, 1, 1, -1, -1], rightSign = [1, -1, -1, 1, 1, -1, -1, 1];
  const level = Math.pow(10, spec.sendDb / 20);
  for (let i = 0; i < n; i++) {
    const taps = lengths.map((d, line) => i >= d ? written[line]![i - d]! : 0);
    left[i] = taps.reduce((acc, tap, line) => acc + leftSign[line]! * tap, 0) * scale * level;
    right[i] = taps.reduce((acc, tap, line) => acc + rightSign[line]! * tap, 0) * scale * level;
    const damped = taps.map((tap, line) => (smooth[line] = (1 - pole) * tap + pole * smooth[line]!) * loss[line]!);
    for (let row = 0; row < 8; row++) {
      let mixed = 0; for (let col = 0; col < 8; col++) mixed += HADAMARD[row]![col]! * damped[col]!;
      written[row]![i] = mixed * scale + inSign[row]! * x[i]! * scale;
    }
  }
  return {left, right};
}

const PHASES = [
  [0.001708984375, 0.010986328125, -0.0196533203125, 0.033203125, -0.0594482421875, 0.1373291015625, 0.97216796875, -0.102294921875, 0.047607421875, -0.026611328125, 0.014892578125, -0.00830078125],
  [-0.0291748046875, 0.029296875, -0.0517578125, 0.089111328125, -0.16650390625, 0.465087890625, 0.77978515625, -0.2003173828125, 0.1015625, -0.0582275390625, 0.0330810546875, -0.0189208984375],
];

/** 4× interpolated stereo peak per sample interval [k, k + 1] (phases 2 and 3 are 1 and 0 reversed). */
function peaksOf(left: Float64Array, right: Float64Array): Float64Array {
  const n = left.length, out = new Float64Array(n);
  const at = (x: Float64Array, i: number): number => i >= 0 && i < n ? x[i]! : 0;
  for (let k = 0; k < n; k++) out[k] = Math.max(Math.abs(left[k]!), Math.abs(right[k]!), k + 1 < n ? Math.max(Math.abs(left[k + 1]!), Math.abs(right[k + 1]!)) : 0);
  for (const x of [left, right]) for (let i = 0; i < n + 11; i++) {
    const k = Math.min(n - 1, Math.max(0, i - 6));
    for (const phase of [PHASES[0]!, PHASES[1]!, [...PHASES[1]!].reverse(), [...PHASES[0]!].reverse()]) {
      let value = 0; for (let j = 0; j < 12; j++) value += at(x, i - j) * phase[j]!;
      out[k] = Math.max(out[k]!, Math.abs(value));
    }
  }
  return out;
}

function squeeze(left: Float64Array, right: Float64Array, peaks: Float64Array, ceiling: number): Stereo {
  const n = left.length, window = 72, total = n + window - 1, held = new Float64Array(total).fill(1);
  for (let i = 0; i < n; i++) if (peaks[i]! > ceiling) {
    const need = ceiling / peaks[i]!, at = i + window - 1;
    for (let k = Math.max(0, at - window + 1); k <= at; k++) if (need < held[k]!) held[k] = need;
  }
  const back = 1 - Math.exp(-1 / (0.06 * SR));
  for (let k = 0, last = 1; k < total; k++) { last = Math.min(held[k]!, last + (1 - last) * back); held[k] = last; }
  const sums = new Float64Array(total + 1);
  for (let k = 0; k < total; k++) sums[k + 1] = sums[k]! + held[k]!;
  return {left: left.map((v, i) => v * (sums[i + window]! - sums[i]!) / window), right: right.map((v, i) => v * (sums[i + window]! - sums[i]!) / window)};
}

/** Twin of dsp.renderRecipe: layers → drive → EQ → room → fade → true-peak leveller. */
export function twinRender(recipe: Recipe, rng: () => number, semitones = 0): Stereo {
  const n = Math.round(recipe.seconds * SR), k = Math.pow(2, semitones / 12);
  const voices: Voice[] = [];
  for (const layer of recipe.layers) {
    const seed = subSeed(rng);
    voices.push(...(layer.kind === 'scatter' ? scatterVoices(layer, seed, n) : voicesOf(layer, seed, n)));
  }
  let left: Float64Array = new Float64Array(n), right: Float64Array = new Float64Array(n);
  for (let i = 0; i < n; i++) for (const voice of voices) if (i >= voice.from && i < voice.to) {
    const [l, r] = tick(voice, i, k); left[i] = left[i]! + l; right[i] = right[i]! + r;
  }
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(left[i]!), Math.abs(right[i]!));
  const drive = recipe.bus.drive;
  const shape = (v: number): number => drive > 0 ? Math.tanh(drive * v / peak) / Math.tanh(drive) : v / peak;
  left = left.map(shape); right = right.map(shape);
  for (const band of recipe.bus.eq) { left = filterBand(left, band); right = filterBand(right, band); }
  const wet = space(left.map((v, i) => (v + right[i]!) / 2), recipe.bus.room);
  const edge = (i: number): number => { const d = Math.min(i, n - 1 - i); return d >= 240 ? 1 : Math.sin(Math.PI * d / 480) ** 2; };
  const fl = left.map((v, i) => (v + wet.left[i]!) * edge(i)), fr = right.map((v, i) => (v + wet.right[i]!) * edge(i));
  const loud = (s: Stereo): number => referenceMeter(s.left.map((v, i) => (v + s.right[i]!) / 2)).lufs;
  const peaks = peaksOf(fl, fr), ceiling = Math.pow(10, -2 / 20);
  const tryDb = (db: number): Stereo => { const g = Math.pow(10, db / 20); return squeeze(fl.map(v => v * g), fr.map(v => v * g), peaks.map(v => v * g), ceiling); };
  let low = -16 - loud({left: fl, right: fr});
  const first = tryDb(low);
  if (loud(first) >= -16 - 1e-6) return first;
  let high = low + 24;
  if (loud(tryDb(high)) < -16) throw new RangeError('Recipe needs more limiting than the leveller allows');
  for (let step = 0; step < 14; step++) { const middle = (low + high) / 2; if (loud(tryDb(middle)) < -16) low = middle; else high = middle; }
  return tryDb(high);
}

/** Twin seed generator for the tests (same LCG definition, float arithmetic). */
export function twinRng(seed: number): () => number {
  return generator(seed >>> 0);
}
