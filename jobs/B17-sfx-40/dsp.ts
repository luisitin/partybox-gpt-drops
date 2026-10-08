/**
 * B17 v2 synthesis engine: pure, deterministic, zero dependencies.
 *
 * A sound is DATA (see RECIPES.md): a list of layers (tone, noise, scatter) rendered into a
 * stereo bus, then drive → EQ → algorithmic room → loudness-aware peak limiter. Randomness only
 * comes from the caller's `rng`; every layer draws exactly one 32-bit sub-seed from it, in
 * layer order, so layers are independent noise streams. No ambient randomness, no clock, no I/O.
 */
import {RATE, biquad, fadeGain, integrated} from './meter.js';

export type Rng = () => number;

/** One sine partial of a tone: frequency ratio, linear gain, decay-time multiplier. */
export interface PartialSpec {readonly ratio: number; readonly gain: number; readonly decay: number}

interface LayerBase {
  /** Start time (s) inside the sound. */
  readonly at: number;
  readonly gainDb: number;
  /** Constant-power pan, −1 left … +1 right; moves linearly to `panTo` over `move` seconds. */
  readonly pan: number;
  readonly panTo: number;
  readonly move: number;
  /** Raised-cosine attack (s), flat hold (s), exponential decay reaching −60 dB after t60 (s). */
  readonly attack: number;
  readonly hold: number;
  readonly t60: number;
  readonly tremoloHz: number;
  readonly tremoloDepth: number;
}

/** Additive (modal) tone with optional FM on the first partial, glide, vibrato and unison. */
export interface ToneLayer extends LayerBase {
  readonly kind: 'tone';
  readonly hz: number;
  /** Exponential glide from `hz` towards `glideTo` with time constant `glide` (s); 0 = none. */
  readonly glideTo: number;
  readonly glide: number;
  readonly partials: readonly PartialSpec[];
  readonly vibratoHz: number;
  readonly vibratoCents: number;
  /** FM on partial 0: modulator at fmRatio × pitch, index decaying to −60 dB in fmT60 (s). */
  readonly fmRatio: number;
  readonly fmIndex: number;
  readonly fmT60: number;
  /** Unison voices spread ±detuneCents and ±spread pan around `pan`. */
  readonly unison: number;
  readonly detuneCents: number;
  readonly spread: number;
}

/** Seeded white noise through a TPT state-variable filter whose cutoff sweeps hz → hzTo. */
export interface NoiseLayer extends LayerBase {
  readonly kind: 'noise';
  readonly filter: 'lp' | 'bp' | 'hp';
  readonly hz: number;
  readonly hzTo: number;
  readonly q: number;
}

/** A burst of `count` copies of `layers` (dice rattle, sparkles, droplets) with seeded jitter. */
export interface ScatterLayer {
  readonly kind: 'scatter';
  readonly at: number;
  readonly count: number;
  /** Event i sits at at + span × (i/(count−1))^curve, ± jitter × span/count. */
  readonly span: number;
  readonly curve: number;
  readonly jitter: number;
  /** Gain falls linearly in dB by fallDb from first to last event, ± gainJitterDb. */
  readonly fallDb: number;
  readonly gainJitterDb: number;
  /** Pitch jitter ± semitones (tones and noise filters), pan offset ± panSpread. */
  readonly pitchJitter: number;
  readonly panSpread: number;
  readonly layers: readonly (ToneLayer | NoiseLayer)[];
}

export type Layer = ToneLayer | NoiseLayer | ScatterLayer;

export interface EqBand {readonly type: 'hp' | 'lp' | 'peak' | 'lowshelf' | 'highshelf'; readonly hz: number; readonly q: number; readonly db: number}

/** 8-line Hadamard feedback delay network. rt60 0 = no room. */
export interface RoomSpec {readonly sendDb: number; readonly rt60: number; readonly damp: number; readonly predelay: number; readonly size: number}

export interface BusSpec {
  /** tanh saturation amount after peak normalisation (0 = clean). */
  readonly drive: number;
  readonly eq: readonly EqBand[];
  readonly room: RoomSpec;
}

export interface Recipe {readonly seconds: number; readonly layers: readonly Layer[]; readonly bus: BusSpec}

export interface Stereo {readonly left: Float64Array; readonly right: Float64Array}

export interface RenderOptions {
  /** Transpose every tone and noise filter by this many semitones (a rising countdown, a join scale). */
  readonly semitones?: number;
}

/** Loudness the limiter works at (matches the mastering target) and its sample ceiling. */
export const LIMIT_LUFS = -16;
/** Limiter ceiling on the 4× interpolated (true-peak) envelope, dBTP. */
export const LIMIT_CEILING_DBTP = -2;
/** The leveller searches up to this much limiting, in this many bisection steps (24 dB / 2^14 ≈ 0.0015 dB). */
export const LEVEL_SEARCH_DB = 24;
export const LEVEL_STEPS = 14;
/** A render already within this of LIMIT_LUFS without limiting is left alone (keeps twins in step). */
export const LEVEL_TOLERANCE_DB = 1e-6;
/** Upper bounds that keep a hand-written recipe from running away (counts multiply render time). */
export const MAX_PARTIALS = 32;
export const MAX_UNISON = 8;
export const MAX_SCATTER = 64;
const LIMIT_LOOKAHEAD = 72; // 1.5 ms
const LIMIT_RELEASE = 0.06; // s
const TWO_PI = 2 * Math.PI;

/** The seeded generator (32-bit LCG, Numerical Recipes constants); state/2^32 in [0,1). */
export function seeded(seed: number): Rng {
  let state = seed >>> 0;
  return () => {state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296;};
}

/** One sub-seed per layer, validating the caller's generator. */
export function drawSeed(rng: Rng): number {
  const value = rng();
  if (!(value >= 0 && value < 1)) throw new RangeError('RNG must return [0,1)');
  return Math.floor(value * 4294967296) >>> 0;
}

/** Raised-cosine attack, hold, then exponential decay to −60 dB at t60 (decay × t60 for a partial). */
export function envelope(t: number, attack: number, hold: number, t60: number): number {
  if (t < 0) return 0;
  if (t < attack) return 0.5 - 0.5 * Math.cos(Math.PI * t / attack);
  const after = t - attack - hold;
  return after <= 0 ? 1 : Math.pow(10, -3 * after / t60);
}

/** Samples a layer can be audible for: attack + hold + 1.5 × the slowest decay (−90 dB). */
function lifeSeconds(layer: ToneLayer | NoiseLayer): number {
  let slowest = 1;
  if (layer.kind === 'tone') for (const p of layer.partials) slowest = Math.max(slowest, p.decay);
  return layer.attack + layer.hold + 1.5 * layer.t60 * slowest;
}

/** Constant-power pan gains for p in [−1, 1]. */
export function panGains(p: number): readonly [number, number] {
  const clamped = Math.max(-1, Math.min(1, p)), theta = (clamped + 1) * Math.PI / 4;
  return [Math.cos(theta), Math.sin(theta)];
}

function panAt(layer: LayerBase, t: number, offset: number): number {
  const progress = layer.move > 0 ? Math.min(1, t / layer.move) : 1;
  return layer.pan + (layer.panTo - layer.pan) * (layer.move > 0 ? progress : 0) + offset;
}

function renderTone(layer: ToneLayer, k: number, left: Float64Array, right: Float64Array): void {
  const start = Math.round(layer.at * RATE);
  const end = Math.min(left.length, start + Math.ceil(lifeSeconds(layer) * RATE));
  const voices = Math.max(1, Math.round(layer.unison)), count = layer.partials.length;
  const voiceGain = Math.pow(10, layer.gainDb / 20) / Math.sqrt(voices);
  const ratios = Float64Array.from(layer.partials, partial => partial.ratio);
  const gains = Float64Array.from(layer.partials, partial => partial.gain);
  // Recursive forms of the continuous definitions (RECIPES.md): decay, glide and FM index
  // multiply by a constant per sample once started; error stays far below 1e-9.
  const rates = Float64Array.from(layer.partials, partial => Math.pow(10, -3 / (layer.t60 * partial.decay * RATE)));
  const attackSamples = layer.attack * RATE, decayStart = (layer.attack + layer.hold) * RATE;
  const glideRate = layer.glide > 0 ? Math.exp(-1 / (layer.glide * RATE)) : 0;
  const fmRate = layer.fmIndex > 0 ? Math.pow(10, -3 / (layer.fmT60 * RATE)) : 0;
  for (let v = 0; v < voices; v++) {
    const position = voices > 1 ? 2 * v / (voices - 1) - 1 : 0;
    const detune = Math.pow(2, layer.detuneCents * position / 1200), panOffset = layer.spread * position;
    const phases = new Float64Array(count), decays = new Float64Array(count);
    let modulator = 0, offset = layer.hz - layer.glideTo, index = layer.fmIndex, decaying = false;
    let [gl, gr] = panGains(layer.pan + panOffset), panSettled = layer.move <= 0;
    for (let i = start; i < end; i++) {
      const j = i - start, t = j / RATE;
      let hz = layer.glide > 0 ? layer.glideTo + offset : layer.hz;
      offset *= glideRate;
      if (layer.vibratoCents !== 0) hz *= Math.pow(2, layer.vibratoCents * Math.sin(TWO_PI * layer.vibratoHz * t) / 1200);
      hz *= detune * k;
      const attack = j < attackSamples ? 0.5 - 0.5 * Math.cos(Math.PI * j / attackSamples) : 1;
      if (j >= decayStart) {
        if (decaying) for (let p = 0; p < count; p++) decays[p] = decays[p]! * rates[p]!;
        else { for (let p = 0; p < count; p++) decays[p] = Math.pow(rates[p]!, j - decayStart); decaying = true; }
      }
      const fm = index > 0 ? index * Math.sin(modulator) : 0;
      let sum = 0;
      for (let p = 0; p < count; p++) {
        const f = hz * ratios[p]!, phase = phases[p]!;
        const alias = f <= 16000 ? 1 : f >= 20000 ? 0 : (20000 - f) / 4000;
        sum += gains[p]! * (decaying ? decays[p]! : 1) * alias * Math.sin(p === 0 ? phase + fm : phase);
        phases[p] = phase + TWO_PI * f / RATE;
      }
      modulator += TWO_PI * hz * layer.fmRatio / RATE;
      index *= fmRate;
      const tremolo = layer.tremoloDepth > 0 ? 1 - layer.tremoloDepth * (0.5 - 0.5 * Math.cos(TWO_PI * layer.tremoloHz * t)) : 1;
      if (!panSettled) { [gl, gr] = panGains(panAt(layer, t, panOffset)); panSettled = t >= layer.move; }
      const value = sum * attack * tremolo * voiceGain;
      left[i] = left[i]! + value * gl;
      right[i] = right[i]! + value * gr;
    }
  }
}

function renderNoise(layer: NoiseLayer, seed: number, k: number, left: Float64Array, right: Float64Array): void {
  const start = Math.round(layer.at * RATE);
  const end = Math.min(left.length, start + Math.ceil(lifeSeconds(layer) * RATE));
  const level = Math.pow(10, layer.gainDb / 20), damping = 1 / layer.q, random = seeded(seed);
  const attackSamples = layer.attack * RATE, decayStart = (layer.attack + layer.hold) * RATE;
  const rate = Math.pow(10, -3 / (layer.t60 * RATE));
  let ic1 = 0, ic2 = 0, decay = 1, decaying = false, a1 = 0, a2 = 0, a3 = 0, settled = false;
  let [gl, gr] = panGains(layer.pan), panSettled = layer.move <= 0;
  for (let i = start; i < end; i++) {
    const j = i - start, t = j / RATE;
    if (!settled) {
      const progress = layer.move > 0 ? Math.min(1, t / layer.move) : 0;
      const cutoff = Math.max(20, Math.min(20000, layer.hz * Math.pow(layer.hzTo / layer.hz, progress) * k));
      const g = Math.tan(Math.PI * cutoff / RATE);
      a1 = 1 / (1 + g * (g + damping)); a2 = g * a1; a3 = g * a2;
      settled = progress >= 1 || layer.move <= 0;
    }
    const x = 2 * random() - 1;
    const v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
    ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2;
    const filtered = layer.filter === 'lp' ? v2 : layer.filter === 'bp' ? damping * v1 : x - damping * v1 - v2;
    const attack = j < attackSamples ? 0.5 - 0.5 * Math.cos(Math.PI * j / attackSamples) : 1;
    if (j >= decayStart) { decay = decaying ? decay * rate : Math.pow(rate, j - decayStart); decaying = true; }
    const tremolo = layer.tremoloDepth > 0 ? 1 - layer.tremoloDepth * (0.5 - 0.5 * Math.cos(TWO_PI * layer.tremoloHz * t)) : 1;
    if (!panSettled) { [gl, gr] = panGains(panAt(layer, t, 0)); panSettled = t >= layer.move; }
    const value = filtered * attack * decay * tremolo * level;
    left[i] = left[i]! + value * gl;
    right[i] = right[i]! + value * gr;
  }
}

/** Expand a scatter into concrete layers (with their noise seeds), drawing from its own stream. */
export function expandScatter(scatter: ScatterLayer, seed: number): {layer: ToneLayer | NoiseLayer; seed: number}[] {
  const random = seeded(seed), out: {layer: ToneLayer | NoiseLayer; seed: number}[] = [];
  const count = Math.max(1, Math.round(scatter.count));
  for (let i = 0; i < count; i++) {
    const position = count > 1 ? i / (count - 1) : 0;
    const time = scatter.at + scatter.span * Math.pow(position, scatter.curve) + scatter.jitter * scatter.span / count * (2 * random() - 1);
    const gain = -scatter.fallDb * position + scatter.gainJitterDb * (2 * random() - 1);
    const pitch = Math.pow(2, scatter.pitchJitter * (2 * random() - 1) / 12);
    const pan = scatter.panSpread * (2 * random() - 1);
    for (const template of scatter.layers) {
      const at = Math.max(0, time + template.at), gainDb = template.gainDb + gain;
      const moved = {pan: template.pan + pan, panTo: template.panTo + pan};
      const layer: ToneLayer | NoiseLayer = template.kind === 'tone'
        ? {...template, ...moved, at, gainDb, hz: template.hz * pitch, glideTo: template.glideTo * pitch}
        : {...template, ...moved, at, gainDb, hz: template.hz * pitch, hzTo: template.hzTo * pitch};
      out.push({layer, seed: drawSeed(random)});
    }
  }
  return out;
}

/** RBJ cookbook biquad, normalised so a0 = 1. */
export function eqCoefficients(band: EqBand): {b: readonly number[]; a: readonly number[]} {
  const w = TWO_PI * band.hz / RATE, cos = Math.cos(w), alpha = Math.sin(w) / (2 * band.q), A = Math.pow(10, band.db / 40);
  let b0: number, b1: number, b2: number, a0: number, a1: number, a2: number;
  switch (band.type) {
    case 'lp': b0 = (1 - cos) / 2; b1 = 1 - cos; b2 = b0; a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha; break;
    case 'hp': b0 = (1 + cos) / 2; b1 = -(1 + cos); b2 = b0; a0 = 1 + alpha; a1 = -2 * cos; a2 = 1 - alpha; break;
    case 'peak': b0 = 1 + alpha * A; b1 = -2 * cos; b2 = 1 - alpha * A; a0 = 1 + alpha / A; a1 = -2 * cos; a2 = 1 - alpha / A; break;
    case 'lowshelf': {
      const s = 2 * Math.sqrt(A) * alpha;
      b0 = A * ((A + 1) - (A - 1) * cos + s); b1 = 2 * A * ((A - 1) - (A + 1) * cos); b2 = A * ((A + 1) - (A - 1) * cos - s);
      a0 = (A + 1) + (A - 1) * cos + s; a1 = -2 * ((A - 1) + (A + 1) * cos); a2 = (A + 1) + (A - 1) * cos - s; break;
    }
    case 'highshelf': {
      const s = 2 * Math.sqrt(A) * alpha;
      b0 = A * ((A + 1) + (A - 1) * cos + s); b1 = -2 * A * ((A - 1) + (A + 1) * cos); b2 = A * ((A + 1) + (A - 1) * cos - s);
      a0 = (A + 1) - (A - 1) * cos + s; a1 = 2 * ((A - 1) - (A + 1) * cos); a2 = (A + 1) - (A - 1) * cos - s; break;
    }
  }
  return {b: [b0 / a0, b1 / a0, b2 / a0], a: [1, a1 / a0, a2 / a0]};
}

const ROOM_LINES = [1153, 1327, 1559, 1733, 1999, 2203, 2459, 2687];
const DIFFUSERS = [142, 107, 379, 277];
const IN_SIGNS = [1, -1, 1, 1, -1, 1, -1, -1];
const LEFT_SIGNS = [1, 1, -1, -1, 1, 1, -1, -1];
const RIGHT_SIGNS = [1, -1, -1, 1, 1, -1, -1, 1];

/** In-place unnormalised fast Walsh–Hadamard transform of length 8. */
function hadamard8(v: Float64Array): void {
  for (let size = 1; size < 8; size *= 2) for (let start = 0; start < 8; start += 2 * size) for (let j = start; j < start + size; j++) {
    const a = v[j]!, b = v[j + size]!; v[j] = a + b; v[j + size] = a - b;
  }
}

/** Stereo room from a mono send: predelay → 4 Schroeder allpasses → 8-line Hadamard FDN with damping. */
export function room(input: Float64Array, spec: RoomSpec): Stereo {
  const n = input.length, left = new Float64Array(n), right = new Float64Array(n);
  if (spec.rt60 <= 0) return {left, right};
  const pre = Math.round(spec.predelay * RATE), norm = 1 / Math.sqrt(8);
  const delays = ROOM_LINES.map(d => Math.max(8, Math.round(d * spec.size)));
  const lines = delays.map(d => new Float64Array(d)), cursors = new Int32Array(8);
  const feedback = delays.map(d => Math.pow(10, -3 * d / (spec.rt60 * RATE)));
  const pole = Math.exp(-TWO_PI * spec.damp / RATE), lows = new Float64Array(8);
  const diffusers = DIFFUSERS.map(d => new Float64Array(d)), diffCursors = new Int32Array(DIFFUSERS.length);
  const mix = new Float64Array(8), gain = Math.pow(10, spec.sendDb / 20);
  for (let i = 0; i < n; i++) {
    let x = i >= pre ? input[i - pre]! : 0;
    for (let d = 0; d < diffusers.length; d++) {
      const buffer = diffusers[d]!, at = diffCursors[d]!, delayed = buffer[at]!;
      const v = x + 0.62 * delayed;
      x = delayed - 0.62 * v;
      buffer[at] = v;
      diffCursors[d] = at + 1 === buffer.length ? 0 : at + 1;
    }
    let outL = 0, outR = 0;
    for (let j = 0; j < 8; j++) {
      const out = lines[j]![cursors[j]!]!;
      outL += LEFT_SIGNS[j]! * out; outR += RIGHT_SIGNS[j]! * out;
      const low = (1 - pole) * out + pole * lows[j]!;
      lows[j] = low;
      mix[j] = low * feedback[j]!;
    }
    hadamard8(mix);
    for (let j = 0; j < 8; j++) {
      const line = lines[j]!, at = cursors[j]!;
      line[at] = mix[j]! * norm + IN_SIGNS[j]! * x * norm;
      cursors[j] = at + 1 === line.length ? 0 : at + 1;
    }
    left[i] = outL * norm * gain; right[i] = outR * norm * gain;
  }
  return {left, right};
}

/** The BS.1770-4 Annex 2 polyphase 4× interpolator (four 12-tap phases), the same table as meter.ts. */
const OVERSAMPLE: readonly (readonly number[])[] = [
  [0.001708984375, 0.010986328125, -0.0196533203125, 0.033203125, -0.0594482421875, 0.1373291015625, 0.97216796875, -0.102294921875, 0.047607421875, -0.026611328125, 0.014892578125, -0.00830078125],
  [-0.0291748046875, 0.029296875, -0.0517578125, 0.089111328125, -0.16650390625, 0.465087890625, 0.77978515625, -0.2003173828125, 0.1015625, -0.0582275390625, 0.0330810546875, -0.0189208984375],
  [-0.0189208984375, 0.0330810546875, -0.0582275390625, 0.1015625, -0.2003173828125, 0.77978515625, 0.465087890625, -0.16650390625, 0.089111328125, -0.0517578125, 0.029296875, -0.0291748046875],
  [-0.00830078125, 0.014892578125, -0.026611328125, 0.047607421875, -0.102294921875, 0.97216796875, 0.1373291015625, -0.0594482421875, 0.033203125, -0.0196533203125, 0.010986328125, 0.001708984375],
];

/**
 * Linked peak envelope: entry k is the largest magnitude of either channel at samples k and k + 1 and
 * at every 4× interpolated point between them (interpolator output i lies between samples i − 6 and
 * i − 5, so it is charged to k = i − 6, clamped to the signal).
 */
export function peakEnvelope(left: Float64Array, right: Float64Array): Float64Array {
  const n = left.length, out = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const next = k + 1 < n ? Math.max(Math.abs(left[k + 1]!), Math.abs(right[k + 1]!)) : 0;
    out[k] = Math.max(Math.abs(left[k]!), Math.abs(right[k]!), next);
  }
  for (const signal of [left, right]) {
    for (let i = 0; i < n + 11; i++) {
      const k = Math.min(n - 1, Math.max(0, i - 6));
      for (const phase of OVERSAMPLE) {
        let value = 0;
        for (let j = 0; j < 12; j++) { const at = i - j; if (at >= 0 && at < n) value += signal[at]! * phase[j]!; }
        if (Math.abs(value) > out[k]!) out[k] = Math.abs(value);
      }
    }
  }
  return out;
}

/**
 * Gain curve of the linked look-ahead limiter: no entry of `peaks` may exceed `ceiling` (linear)
 * after gain. The requirement ceiling / peak gets LOOKAHEAD − 1 virtual samples of pre-roll, then a
 * forward minimum over the look-ahead window, a release, and a moving average of the same length:
 * every window that averages into sample j contains j's requirement, so gain[j] ≤ ceiling / peaks[j].
 */
export function limiterGain(peaks: Float64Array, ceiling: number): Float64Array {
  const n = peaks.length, pre = LIMIT_LOOKAHEAD - 1, total = n + pre, need = new Float64Array(total).fill(1);
  for (let i = 0; i < n; i++) if (peaks[i]! > ceiling) need[i + pre] = ceiling / peaks[i]!;
  const held = new Float64Array(total), queue = new Int32Array(total);
  let head = 0, tail = 0;
  for (let i = total - 1; i >= 0; i--) {
    while (tail > head && need[queue[tail - 1]!]! >= need[i]!) tail--;
    queue[tail++] = i;
    while (queue[head]! > i + LIMIT_LOOKAHEAD - 1) head++;
    held[i] = need[queue[head]!]!;
  }
  const release = 1 - Math.exp(-1 / (LIMIT_RELEASE * RATE));
  let previous = 1;
  for (let i = 0; i < total; i++) { previous = Math.min(held[i]!, previous + (1 - previous) * release); held[i] = previous; }
  const gain = new Float64Array(n);
  let window = 0;
  for (let i = 0; i < pre; i++) window += held[i]!;
  for (let i = 0; i < n; i++) {
    window += held[i + pre]!;
    gain[i] = window / LIMIT_LOOKAHEAD;
    window -= held[i]!;
  }
  return gain;
}

/** Apply the limiter to a stereo pair; `peaks` defaults to the per-sample stereo maximum. */
export function limit(left: Float64Array, right: Float64Array, ceiling: number, peaks?: Float64Array): Stereo {
  const gain = limiterGain(peaks ?? Float64Array.from(left, (value, i) => Math.max(Math.abs(value), Math.abs(right[i]!))), ceiling);
  return {left: left.map((value, i) => value * gain[i]!), right: right.map((value, i) => value * gain[i]!)};
}

function mid(left: Float64Array, right: Float64Array): Float64Array {
  return Float64Array.from(left, (value, i) => (value + right[i]!) / 2);
}

function scale(signal: Float64Array, gain: number): Float64Array {
  return Float64Array.from(signal, value => value * gain);
}

function check(ok: boolean, message: string): void {
  if (!ok) throw new RangeError(message);
}

function validateVoice(layer: ToneLayer | NoiseLayer): void {
  const numbers = [layer.at, layer.gainDb, layer.pan, layer.panTo, layer.move, layer.attack, layer.hold, layer.t60, layer.tremoloHz, layer.tremoloDepth];
  if (layer.kind === 'tone') {
    numbers.push(layer.hz, layer.glideTo, layer.glide, layer.vibratoHz, layer.vibratoCents, layer.fmRatio, layer.fmIndex, layer.fmT60, layer.unison, layer.detuneCents, layer.spread);
    for (const partial of layer.partials) numbers.push(partial.ratio, partial.gain, partial.decay);
  } else numbers.push(layer.hz, layer.hzTo, layer.q);
  check(numbers.every(Number.isFinite), 'Every recipe number must be finite');
  check(layer.at >= 0 && layer.attack >= 0 && layer.hold >= 0 && layer.move >= 0 && layer.t60 > 0, 'Times must be ≥ 0 and t60 > 0');
  check(layer.tremoloDepth >= 0 && layer.tremoloDepth <= 1, 'Tremolo depth within 0…1');
  if (layer.kind === 'tone') {
    check(layer.hz > 0 && layer.glideTo > 0 && layer.glide >= 0 && layer.fmT60 > 0, 'Tone pitches and times must be positive');
    check(layer.partials.length >= 1 && layer.partials.length <= MAX_PARTIALS, `A tone needs 1…${MAX_PARTIALS} partials`);
    check(layer.partials.every(partial => partial.ratio > 0 && partial.decay > 0), 'Partial ratios and decays must be positive');
    check(Math.round(layer.unison) >= 1 && Math.round(layer.unison) <= MAX_UNISON, `Unison within 1…${MAX_UNISON}`);
  } else {
    check(layer.hz > 0 && layer.hzTo > 0 && layer.q > 0, 'Noise cutoffs and q must be positive');
  }
}

function validate(recipe: Recipe, semitones: number): void {
  check(Number.isFinite(semitones) && Math.abs(semitones) <= 24, 'Transpose within ±24 semitones');
  check(recipe.seconds >= 0.05 && recipe.seconds <= 3, 'Duration outside delivery range');
  check(recipe.layers.length > 0, 'A recipe needs at least one layer');
  for (const layer of recipe.layers) {
    check(layer.at >= 0 && layer.at < recipe.seconds, 'Layer onset outside the sound');
    if (layer.kind === 'scatter') {
      check([layer.count, layer.span, layer.curve, layer.jitter, layer.fallDb, layer.gainJitterDb, layer.pitchJitter, layer.panSpread].every(Number.isFinite), 'Every recipe number must be finite');
      check(Math.round(layer.count) >= 1 && Math.round(layer.count) <= MAX_SCATTER && layer.span >= 0 && layer.curve > 0, `Scatter count within 1…${MAX_SCATTER}, span ≥ 0, curve > 0`);
      check(layer.layers.length > 0, 'A scatter needs at least one layer');
      layer.layers.forEach(validateVoice);
    } else validateVoice(layer);
  }
  const bus = recipe.bus;
  check([bus.drive, bus.room.sendDb, bus.room.rt60, bus.room.damp, bus.room.predelay, bus.room.size].every(Number.isFinite) && bus.drive >= 0 && bus.room.rt60 >= 0 && bus.room.predelay >= 0 && bus.room.predelay < 1 && bus.room.size > 0 && bus.room.damp > 0, 'Bus values out of range');
  for (const band of bus.eq) check([band.hz, band.q, band.db].every(Number.isFinite) && band.hz > 0 && band.hz < RATE / 2 && band.q > 0, 'EQ band out of range');
}

/** Layers → drive → EQ → room, before the leveller. Exposed so tests can bound limiting. */
export function renderUnlimited(recipe: Recipe, rng: Rng, options: RenderOptions = {}): Stereo {
  const semitones = options.semitones ?? 0;
  validate(recipe, semitones);
  const n = Math.round(recipe.seconds * RATE), k = Math.pow(2, semitones / 12);
  let left: Float64Array = new Float64Array(n), right: Float64Array = new Float64Array(n);
  for (const layer of recipe.layers) {
    const seed = drawSeed(rng);
    if (layer.kind === 'scatter') {
      for (const item of expandScatter(layer, seed)) {
        if (item.layer.kind === 'tone') renderTone(item.layer, k, left, right);
        else renderNoise(item.layer, item.seed, k, left, right);
      }
    } else if (layer.kind === 'tone') renderTone(layer, k, left, right);
    else renderNoise(layer, seed, k, left, right);
  }
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(left[i]!), Math.abs(right[i]!));
  check(Number.isFinite(peak), 'Recipe produced a non-finite sample');
  check(peak > 0, 'Silent recipe');
  const bus = recipe.bus, drive = bus.drive;
  const shape = (value: number): number => drive > 0 ? Math.tanh(drive * value / peak) / Math.tanh(drive) : value / peak;
  left = left.map(shape); right = right.map(shape);
  for (const band of bus.eq) {
    const {b, a} = eqCoefficients(band);
    left = biquad(left, b, a); right = biquad(right, b, a);
  }
  const wet = room(mid(left, right), bus.room);
  for (let i = 0; i < n; i++) { left[i] = left[i]! + wet.left[i]!; right[i] = right[i]! + wet.right[i]!; }
  return {left, right};
}

/**
 * Apply the master's 5 ms raised-cosine edge fades to both channels, then find by bisection the input
 * gain at which the linked true-peak look-ahead limiter (ceiling LIMIT_CEILING_DBTP) leaves the mid at LIMIT_LUFS.
 * Fading first means the limiter never spends gain on samples the master would silence, and the
 * master's own measurement then agrees with this one to a few hundredths of a dB. The search always
 * restarts from the faded input, so limiting never compounds. Throws when even 24 dB of limiting
 * cannot reach the target (a recipe that is all transient and no body).
 */
export function level(input: Stereo): Stereo {
  const ceiling = Math.pow(10, LIMIT_CEILING_DBTP / 20);
  const n = input.left.length;
  const left = input.left.map((value, i) => value * fadeGain(i, n));
  const right = input.right.map((value, i) => value * fadeGain(i, n));
  const centre = mid(left, right), base = integrated(centre);
  if (!Number.isFinite(base)) throw new RangeError('Silent recipe');
  const peaks = peakEnvelope(left, right), work = new Float64Array(n);
  // The limiter gain is shared by both channels, so the mid's loudness is all the search needs.
  const curve = (db: number): Float64Array => {
    const g = Math.pow(10, db / 20);
    const gain = limiterGain(scale(peaks, g), ceiling);
    for (let i = 0; i < n; i++) gain[i] = gain[i]! * g;
    return gain;
  };
  const loudness = (gain: Float64Array): number => {
    for (let i = 0; i < n; i++) work[i] = centre[i]! * gain[i]!;
    return integrated(work);
  };
  let low = LIMIT_LUFS - base, chosen = curve(low);
  if (loudness(chosen) < LIMIT_LUFS - LEVEL_TOLERANCE_DB) {
    let high = low + LEVEL_SEARCH_DB;
    chosen = curve(high);
    if (loudness(chosen) < LIMIT_LUFS) throw new RangeError('Recipe needs more limiting than the leveller allows');
    for (let step = 0; step < LEVEL_STEPS; step++) {
      const middle = (low + high) / 2, gain = curve(middle);
      if (loudness(gain) < LIMIT_LUFS) low = middle; else { high = middle; chosen = gain; }
    }
  }
  return {left: left.map((value, i) => value * chosen[i]!), right: right.map((value, i) => value * chosen[i]!)};
}

/** Render a recipe to an unmastered stereo pair. Pure: same recipe + same rng ⇒ same samples. */
export function renderRecipe(recipe: Recipe, rng: Rng, options: RenderOptions = {}): Stereo {
  return level(renderUnlimited(recipe, rng, options));
}
