/**
 * B17 public entry point: forty original synthesized sound effects, rendered deterministically.
 * `renderCue(id)` is the one call a port needs; the rest exposes the stages for tests and tools.
 * Pure: no I/O, no clock, no ambient randomness; every function returns fresh arrays.
 */
import {RATE, fadeGain, finishAudio, integrated, truePeak} from './meter.js';
import {renderRecipe, seeded, type RenderOptions, type Rng, type Stereo} from './dsp.js';
import {SOUNDS, type Sound, type SoundId} from './recipes.js';

export {RATE} from './meter.js';
export {seeded, LIMIT_LUFS, LIMIT_CEILING_DBTP, type Rng, type Stereo, type RenderOptions} from './dsp.js';
export {SOUNDS, SOUND_IDS, note, type Sound, type SoundGroup, type SoundId} from './recipes.js';
export {CUES, type CueLink} from './cues.js';
export {LEGACY_SOUNDS, synthesizeLegacyRaw, type LegacySound} from './legacy.js';

/** Delivery target for every master (spec: −16 LUFS ± 0.5, true peak ≤ −1.5 dBTP). */
export const TARGET_LUFS = -16;
export const MAX_TRUE_PEAK_DBTP = -1.5;

/** Levelled stereo before mastering: mid at −16 LUFS, true peak ≤ −2 dBTP, 5 ms edge fades applied. */
export function renderSound(sound: Sound, rng: Rng, options: RenderOptions = {}): Stereo {
  return renderRecipe(sound, rng, options);
}

/** The mono mid, (L + R) / 2, of renderSound: the "raw" signal the mono master consumes. */
export function synthesizeRaw(sound: Sound, rng: Rng, options: RenderOptions = {}): Float64Array {
  const {left, right} = renderRecipe(sound, rng, options);
  return Float64Array.from(left, (value, i) => (value + right[i]!) / 2);
}

/** Mono delivery master: finishAudio(synthesizeRaw), i.e. DC-corrected, 5 ms fades, −16 LUFS. */
export function synthesize(sound: Sound, rng: Rng, options: RenderOptions = {}): Float64Array {
  return finishAudio(synthesizeRaw(sound, rng, options));
}

/** Stereo delivery master of the same render: see finishStereo. */
export function synthesizeStereo(sound: Sound, rng: Rng, options: RenderOptions = {}): Stereo {
  return finishStereo(renderRecipe(sound, rng, options));
}

/**
 * Master a stereo pair the way finishAudio masters mono: per channel, remove DC through the fade
 * basis (so the 5 ms raised-cosine edges stay exact), then apply the one gain that brings the mid
 * to −16 LUFS. Because every step is linear, the mid of the result equals finishAudio(mid) up to
 * rounding. Throws a RangeError on a bad length, silence, or a channel above −1.5 dBTP.
 */
export function finishStereo(input: Stereo): Stereo {
  const n = input.left.length;
  if (input.right.length !== n) throw new RangeError('Channels differ in length');
  if (n < RATE * 0.05 || n > RATE * 3) throw new RangeError('Duration outside delivery range');
  const correct = (raw: Float64Array): Float64Array => {
    const out = new Float64Array(n);
    let sum = 0, weight = 0;
    for (let i = 0; i < n; i++) { const f = fadeGain(i, n); out[i] = raw[i]! * f; sum += out[i]!; weight += f; }
    const correction = sum / weight;
    for (let i = 0; i < n; i++) out[i] = out[i]! - correction * fadeGain(i, n);
    return out;
  };
  const left = correct(input.left), right = correct(input.right);
  const measured = integrated(Float64Array.from(left, (value, i) => (value + right[i]!) / 2));
  if (!Number.isFinite(measured)) throw new RangeError('Silent raw signal');
  const gain = Math.pow(10, (TARGET_LUFS - measured) / 20);
  for (let i = 0; i < n; i++) { left[i] = left[i]! * gain; right[i] = right[i]! * gain; }
  if (truePeak(left) > MAX_TRUE_PEAK_DBTP || truePeak(right) > MAX_TRUE_PEAK_DBTP) {
    throw new RangeError('A channel exceeds the true-peak limit');
  }
  return {left, right};
}

/** Per-sound seed: FNV-style mix of the id into the caller's seed (v1 rule, unchanged). */
export function soundSeed(id: string, seed: number): number {
  let value=seed>>>0; for(const ch of id) value=Math.imul(value^ch.charCodeAt(0),16777619)>>>0; return value;
}

export interface CueRequest {
  /** Variation seed (scatter layers and noise); default 1, the committed files. */
  readonly seed?: number;
  /** Transposition in semitones, −24…24 (PartyBox's countdown and join steps); default 0. */
  readonly semitones?: number;
}

export interface RenderedCue {
  readonly id: SoundId;
  readonly sampleRate: typeof RATE;
  /** Mastered stereo: −16 LUFS on the mid, ≤ −1.5 dBTP per channel. */
  readonly left: Float64Array;
  readonly right: Float64Array;
  /** Mastered mono (the delivered WAV for seed 1, semitones 0). */
  readonly mono: Float64Array;
}

/**
 * The one call a port needs: id → mastered stereo and mono at 48 kHz. Deterministic: the same id,
 * seed and semitones always give the same samples. Throws a RangeError for an unknown id or an
 * out-of-range transposition.
 */
export function renderCue(id: SoundId, request: CueRequest = {}): RenderedCue {
  const sound = SOUNDS.find(candidate => candidate.id === id);
  if (!sound) throw new RangeError(`Unknown sound ${String(id)}`);
  const options: RenderOptions = request.semitones === undefined ? {} : {semitones: request.semitones};
  const stereo = renderRecipe(sound, seeded(soundSeed(id, request.seed ?? 1)), options);
  const mid = Float64Array.from(stereo.left, (value, i) => (value + stereo.right[i]!) / 2);
  const {left, right} = finishStereo(stereo);
  return {id, sampleRate: RATE, left, right, mono: finishAudio(mid)};
}
