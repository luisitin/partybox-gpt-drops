/**
 * The 40 B17 recipes as plain data (RECIPES.md documents every field). Presets below only fill
 * defaults; the exported SOUNDS carry fully expanded layers, so the manifest is the full recipe.
 * Musical palette: C/G/F major family, melodic notes kept between C4 and C6 (no shrill
 * fundamentals), soft attacks, layered transient + body + tail, a short room on every sound.
 */
import type {BusSpec, EqBand, Layer, NoiseLayer, PartialSpec, Recipe, RoomSpec, ScatterLayer, ToneLayer} from './dsp.js';

export type SoundGroup = 'flow' | 'timer' | 'verdict' | 'reward' | 'board' | 'menu' | 'power';

/** Every sound id, in catalogue order. */
export const SOUND_IDS = [
  'coin', 'star-get', 'dice-roll', 'dice-stop', 'step', 'buzzer', 'ding', 'whoosh', 'pop',
  'countdown-tick', 'final-tick', 'win-fanfare', 'lose', 'item-use', 'shop-open', 'vote', 'reveal',
  'timer-warning', 'menu-move', 'menu-back', 'confirm', 'cancel', 'join', 'leave', 'ready', 'start',
  'round-end', 'bonus', 'penalty', 'teleport', 'shield', 'power-up', 'power-down', 'notification',
  'achievement', 'error', 'splash', 'bounce', 'swipe', 'connect',
] as const;
export type SoundId = (typeof SOUND_IDS)[number];

export interface Sound extends Recipe {
  readonly id: SoundId;
  readonly name: string;
  readonly group: SoundGroup;
  readonly description: string;
}

const A4 = 440;
/** Equal-tempered note name → Hz (A4 = 440). */
export function note(name: string): number {
  const match = /^([A-G])(#|b)?(-?\d)$/.exec(name);
  if (!match) throw new RangeError(`Bad note ${name}`);
  const steps: Record<string, number> = {C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2};
  const semis = steps[match[1]!]! + (match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0) + 12 * (Number(match[3]) - 4);
  return Math.round(A4 * Math.pow(2, semis / 12) * 1000) / 1000;
}

const p = (ratio: number, gain: number, decay = 1): PartialSpec => ({ratio, gain, decay});
/** Timbres: modal partial sets (ratios from idealised bars, bells and plates, gains by ear-free design). */
const MARIMBA = [p(1, 1), p(3.93, 0.22, 0.3), p(9.2, 0.04, 0.12)];
const TINE = [p(1, 1), p(2, 0.12, 0.55), p(3, 0.04, 0.3)];
const GLASS = [p(1, 1), p(2.76, 0.24, 0.45), p(5.4, 0.07, 0.25), p(8.93, 0.025, 0.15)];
const WOOD = [p(1, 1), p(2.57, 0.38, 0.45), p(4.1, 0.14, 0.3)];
const SINE = [p(1, 1)];
const WARM = [1, 2, 3, 4, 5, 6].map(n => p(n, Math.round(1000 * Math.exp(-(n - 1) / 2.6) / n) / 1000));
const BUZZ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => p(n, Math.round(1000 / Math.pow(n, 0.9)) / 1000, 1));

type Voice = ToneLayer | NoiseLayer;
type ToneOptions = Partial<Omit<ToneLayer, 'kind'>>;
type NoiseOptions = Partial<Omit<NoiseLayer, 'kind'>>;

function tone(hz: number, partials: readonly PartialSpec[], o: ToneOptions = {}): ToneLayer {
  return {kind: 'tone', at: 0, gainDb: 0, pan: 0, panTo: o.pan ?? 0, move: 0, attack: 0.002, hold: 0, t60: 0.6,
    tremoloHz: 0, tremoloDepth: 0, hz, glideTo: hz, glide: 0, partials, vibratoHz: 0, vibratoCents: 0,
    fmRatio: 1, fmIndex: 0, fmT60: 0.1, unison: 1, detuneCents: 0, spread: 0, ...o};
}
function noise(filter: NoiseLayer['filter'], hz: number, o: NoiseOptions = {}): NoiseLayer {
  return {kind: 'noise', at: 0, gainDb: 0, pan: 0, panTo: o.pan ?? 0, move: 0, attack: 0.001, hold: 0, t60: 0.05,
    tremoloHz: 0, tremoloDepth: 0, filter, hz, hzTo: o.hz ?? hz, q: 0.707, ...o};
}
function scatter(layers: readonly (ToneLayer | NoiseLayer)[], o: Partial<Omit<ScatterLayer, 'kind' | 'layers'>>): ScatterLayer {
  return {kind: 'scatter', at: 0, count: 6, span: 0.5, curve: 1, jitter: 0.3, fallDb: 6, gainJitterDb: 2, pitchJitter: 0,
    panSpread: 0.5, ...o, layers};
}

/** Presets. Each returns layers; `at` is the onset, `db` the layer gain. */
const mallet = (n: string, at: number, db = 0, o: ToneOptions = {}): Voice[] => [
  tone(note(n), MARIMBA, {at, gainDb: db, attack: 0.0015, t60: 0.55, ...o}),
  noise('lp', 2600, {at, gainDb: db - 26, t60: 0.012}),
];
const tine = (n: string, at: number, db = 0, o: ToneOptions = {}): Voice[] => [
  tone(note(n), TINE, {at, gainDb: db, attack: 0.002, t60: 0.9, fmRatio: 1, fmIndex: 1.4, fmT60: 0.16, ...o}),
];
const bell = (n: string, at: number, db = 0, o: ToneOptions = {}): Voice[] => [
  tone(note(n), GLASS, {at, gainDb: db, attack: 0.002, t60: 0.8, fmRatio: 3.5, fmIndex: 0.35, fmT60: 0.04, ...o}),
];
const knock = (n: string, at: number, db = 0, o: ToneOptions = {}): Voice[] => [
  tone(note(n), WOOD, {at, gainDb: db, attack: 0.0015, t60: 0.22, ...o}),
  noise('bp', note(n) * 2.1, {at, gainDb: db - 12, q: 2.2, t60: 0.016}),
];
const pad = (notes: readonly string[], at: number, db: number, o: ToneOptions = {}): Voice[] => notes.map(n =>
  tone(note(n), WARM, {at, gainDb: db, attack: 0.04, hold: 0.15, t60: 0.9, unison: 3, detuneCents: 7, spread: 0.55, ...o}));
const thump = (at: number, db = -6, o: ToneOptions = {}): Voice[] => [
  tone(140, SINE, {at, gainDb: db, attack: 0.0015, t60: 0.2, glideTo: 52, glide: 0.028, ...o}),
];
const air = (at: number, from: number, to: number, o: NoiseOptions = {}): Voice[] => [
  noise('bp', from, {at, hzTo: to, q: 1, attack: 0.2, t60: 0.3, move: 0.3, ...o}),
];
const sparkles = (at: number, count: number, span: number, n: string, db = -20, o: Partial<Omit<ScatterLayer, 'kind' | 'layers'>> = {}): Layer[] => [
  scatter([tone(note(n), GLASS, {gainDb: db, attack: 0.001, t60: 0.28})], {at, count, span, pitchJitter: 4, panSpread: 0.8, fallDb: 6, ...o}),
];

const eq = (...bands: EqBand[]): EqBand[] => bands;
const hp = (hz: number): EqBand => ({type: 'hp', hz, q: 0.707, db: 0});
const lp = (hz: number): EqBand => ({type: 'lp', hz, q: 0.707, db: 0});
const shelf = (hz: number, db: number): EqBand => ({type: 'highshelf', hz, q: 0.707, db});
const dip = (hz: number, db: number, q = 1.2): EqBand => ({type: 'peak', hz, q, db});
const roomOf = (rt60: number, sendDb: number, o: Partial<RoomSpec> = {}): RoomSpec => ({sendDb, rt60, damp: 4200, predelay: 0.012, size: 1, ...o});
const bus = (drive: number, bands: readonly EqBand[], space: RoomSpec): BusSpec => ({drive, eq: bands, room: space});
/** Default polish chain: rumble cut, a gentle presence dip and a soft top. */
const POLISH = eq(hp(70), dip(3400, -2.5), shelf(7000, -3));

const make = (id: SoundId, name: string, group: SoundGroup, seconds: number, description: string, layers: readonly Layer[], b: BusSpec): Sound =>
  ({id, name, group, seconds, description, layers, bus: b});

export const SOUNDS: readonly Sound[] = [
  make('coin', 'Coin', 'reward', 0.95, 'Two glassy pings a fifth apart over a soft low body', [
    ...bell('G5', 0, -2, {t60: 0.45, pan: -0.15}), ...bell('D6', 0.068, 0, {t60: 0.6, pan: 0.15}),
    tone(note('G4'), SINE, {gainDb: -18, t60: 0.25}),
  ], bus(0.4, POLISH, roomOf(0.7, -10))),
  make('star-get', 'Star get', 'reward', 1.7, 'Rolled C-major mallet arpeggio, warm pad bloom, sparkle tail', [
    ...mallet('C5', 0, -2), ...mallet('E5', 0.065, -2), ...mallet('G5', 0.13, -2), ...tine('C6', 0.195, -1, {t60: 1.1}),
    ...thump(0.195, -12), ...pad(['C5', 'G5'], 0.2, -16, {attack: 0.12, hold: 0.15}),
    ...sparkles(0.24, 9, 0.75, 'G6', -24),
  ], bus(0.5, POLISH, roomOf(1.2, -7))),
  make('dice-roll', 'Dice roll', 'board', 1.25, 'Thirteen seeded wooden clacks slowing down over a rolling rumble', [
    ...thump(0, -14, {t60: 0.18}),
    noise('lp', 520, {attack: 0.03, hold: 0.5, t60: 0.4, gainDb: -9}),
    scatter([...knock('G5', 0, -2, {t60: 0.12})], {count: 13, span: 0.85, curve: 1.5, jitter: 0.35, fallDb: 9, gainJitterDb: 3, pitchJitter: 3, panSpread: 0.45}),
  ], bus(1.6, POLISH, roomOf(0.45, -12, {size: 0.6}))),
  make('dice-stop', 'Dice stop', 'board', 0.8, 'Wooden landing with a sub thump and a small settle bounce', [
    ...knock('C5', 0, 0, {t60: 0.3}), ...thump(0, -9, {t60: 0.26}), ...knock('D5', 0.085, -10, {t60: 0.14}),
    noise('lp', 600, {attack: 0.002, t60: 0.25, gainDb: -14}),
  ], bus(1.6, POLISH, roomOf(0.45, -12, {size: 0.7}))),
  make('step', 'Step', 'board', 0.55, 'Soft felt-and-wood token hop', [
    ...knock('G4', 0, 0, {t60: 0.3}), ...thump(0, -9, {glideTo: 70, t60: 0.22}),
    noise('lp', 900, {attack: 0.002, t60: 0.15, gainDb: -14}), noise('lp', 1400, {attack: 0.002, t60: 0.05, gainDb: -16}),
  ], bus(1.6, POLISH, roomOf(0.35, -13, {size: 0.6}))),
  make('buzzer', 'Buzzer', 'verdict', 0.85, 'Warm low-passed game-show buzz, two detuned voices', [
    tone(110, BUZZ, {attack: 0.006, hold: 0.36, t60: 0.22, gainDb: -2, unison: 2, detuneCents: 18, spread: 0.3}),
    tone(116.5, BUZZ, {attack: 0.006, hold: 0.36, t60: 0.22, gainDb: -4}),
    ...thump(0, -10),
  ], bus(2.2, eq(hp(70), lp(1500), dip(2800, -4), shelf(5000, -6)), roomOf(0.4, -15, {size: 0.7}))),
  make('ding', 'Ding', 'verdict', 1.3, 'FM tine and glass bell on A5 with a warm undertone', [
    ...tine('A5', 0, 0, {t60: 1.1, fmIndex: 1.2}), ...bell('A5', 0, -9, {t60: 0.9}),
    tone(note('A4'), SINE, {gainDb: -16, t60: 0.6}),
  ], bus(0.4, POLISH, roomOf(1.3, -8))),
  make('whoosh', 'Whoosh', 'menu', 0.85, 'Airy band-passed sweep moving left to right', [
    ...air(0, 250, 1600, {attack: 0.3, t60: 0.35, move: 0.45, pan: -0.7, panTo: 0.7, q: 0.9}),
    noise('lp', 400, {hzTo: 1500, q: 0.7, attack: 0.25, t60: 0.3, move: 0.45, pan: -0.7, panTo: 0.7, gainDb: -6}),
  ], bus(0.3, eq(hp(120), dip(3400, -2), shelf(7000, -3)), roomOf(0.6, -11))),
  make('pop', 'Pop', 'board', 0.5, 'Round rising bubble pop with a tiny click', [
    tone(380, [p(1, 1), p(2, 0.15, 0.6)], {glideTo: 820, glide: 0.02, attack: 0.002, t60: 0.2}),
    noise('bp', 1400, {q: 1.2, t60: 0.008, gainDb: -18}), ...thump(0, -16, {glideTo: 90, t60: 0.08}),
  ], bus(1.4, POLISH, roomOf(0.35, -13, {size: 0.6}))),
  make('countdown-tick', 'Countdown tick', 'timer', 0.5, 'Woody clock tock on A4 with a soft sub; transposes cleanly per second', [
    ...knock('A4', 0, 0, {t60: 0.26}), ...tine('A4', 0, -7, {t60: 0.35, fmIndex: 0.8}),
    ...thump(0, -10, {glideTo: 110, t60: 0.12}),
  ], bus(1.6, POLISH, roomOf(0.35, -12, {size: 0.6}))),
  make('final-tick', 'Final tick', 'timer', 0.75, 'Double tock, the second brighter with a glass overtone', [
    ...knock('A4', 0, -6, {t60: 0.18}), ...knock('D5', 0.12, 0, {t60: 0.28}), ...bell('D5', 0.12, -12, {t60: 0.45}),
    ...thump(0.12, -9, {t60: 0.15}),
  ], bus(1.6, POLISH, roomOf(0.45, -11, {size: 0.7}))),
  make('win-fanfare', 'Win fanfare', 'reward', 2.6, 'Mallet pickup into a full C-major bloom, melody tines, sparkle and air', [
    ...mallet('G4', 0, -6), ...mallet('C5', 0.08, -6), ...mallet('E5', 0.16, -6),
    ...thump(0.26, -6, {t60: 0.3}),
    ...pad(['C4', 'E4', 'G4', 'C5'], 0.26, -9, {attack: 0.02, hold: 0.25, t60: 1.4}),
    ...tine('G5', 0.26, -2, {t60: 1.0}), ...tine('C6', 0.42, 0, {t60: 1.5}), ...bell('E6', 0.42, -16, {t60: 1.0}),
    ...sparkles(0.3, 10, 1.2, 'G6', -22),
    noise('hp', 7000, {at: 0.26, attack: 0.01, t60: 1.1, gainDb: -30}),
  ], bus(1.2, POLISH, roomOf(1.6, -6))),
  make('lose', 'Lose', 'reward', 1.9, 'Gentle falling C-minor tines with a drooping held note', [
    ...tine('G4', 0, -2, {t60: 0.6}), ...tine('Eb4', 0.22, -2, {t60: 0.6}),
    ...tine('C4', 0.44, 0, {t60: 1.6, vibratoHz: 5, vibratoCents: 22, glideTo: note('C4') * 0.985, glide: 0.6}),
    ...pad(['C4', 'Eb4', 'G4'], 0.4, -14, {attack: 0.2, hold: 0.2, t60: 1.2}),
    ...thump(0.44, -16),
  ], bus(0.4, eq(hp(70), dip(3400, -3), shelf(4000, -6)), roomOf(1.4, -8))),
  make('item-use', 'Item use', 'power', 1.0, 'Rising FM chirp, sparkles and a fifth swelling underneath', [
    tone(330, [p(1, 1), p(2, 0.3, 0.6)], {glideTo: 1320, glide: 0.12, attack: 0.02, t60: 0.45, fmRatio: 2, fmIndex: 0.8, fmT60: 0.3}),
    ...sparkles(0.08, 6, 0.35, 'E6', -18),
    ...pad(['G4', 'D5'], 0.05, -15, {attack: 0.1, hold: 0.1, t60: 0.6}),
    noise('bp', 800, {hzTo: 3000, move: 0.25, attack: 0.15, t60: 0.2, gainDb: -18, q: 1.2}),
  ], bus(1.2, POLISH, roomOf(1.0, -8))),
  make('shop-open', 'Shop open', 'menu', 1.4, 'G-major mallet roll with a little door bell', [
    ...mallet('G4', 0, -2), ...mallet('B4', 0.07, -2), ...mallet('D5', 0.14, -2), ...mallet('G5', 0.21, -1, {t60: 0.8}),
    ...bell('B5', 0.28, -12, {t60: 0.6}), ...bell('D6', 0.33, -15, {t60: 0.5}),
    ...pad(['G4', 'B4', 'D5'], 0.2, -17, {attack: 0.1}),
  ], bus(0.5, POLISH, roomOf(1.0, -8))),
  make('vote', 'Vote', 'verdict', 0.5, 'Small affirmative mallet pluck with a tine lift', [
    ...mallet('D5', 0, 0, {t60: 0.3}), ...tine('A5', 0.045, -7, {t60: 0.3}),
  ], bus(0.7, POLISH, roomOf(0.4, -11, {size: 0.7}))),
  make('reveal', 'Reveal', 'flow', 2.0, 'Breathing noise riser into a bright E-major hit', [
    ...air(0, 400, 3200, {attack: 0.72, t60: 0.08, move: 0.72, pan: -0.3, panTo: 0.3, q: 0.9, gainDb: -4}),
    ...pad(['E3', 'B3'], 0, -12, {attack: 0.7, hold: 0, t60: 0.12, tremoloHz: 8, tremoloDepth: 0.3}),
    ...thump(0.74, -2, {t60: 0.3}),
    ...tine('E5', 0.74, -4, {t60: 1.0}), ...tine('G#5', 0.75, -5, {t60: 1.0}), ...tine('B5', 0.76, -5, {t60: 1.0}),
    ...bell('E6', 0.76, -16, {t60: 0.9}), ...sparkles(0.78, 6, 0.6, 'B6', -24),
  ], bus(0.6, POLISH, roomOf(1.4, -6))),
  make('timer-warning', 'Timer warning', 'timer', 1.0, 'Three urgent tines (D D F) over woody knocks', [
    ...tine('D5', 0, -2, {t60: 0.35, fmIndex: 2}), ...knock('D5', 0, -9, {t60: 0.07}),
    ...tine('D5', 0.16, -2, {t60: 0.35, fmIndex: 2}), ...knock('D5', 0.16, -9, {t60: 0.07}),
    ...tine('F5', 0.32, 0, {t60: 0.5, fmIndex: 2}), ...knock('F5', 0.32, -8, {t60: 0.08}),
    ...thump(0.32, -12),
  ], bus(0.7, POLISH, roomOf(0.5, -11, {size: 0.8}))),
  make('menu-move', 'Menu move', 'menu', 0.45, 'Muted marimba tap for moving a selection', [
    ...mallet('G5', 0, 0, {t60: 0.22}), noise('bp', 1800, {q: 2.5, t60: 0.006, gainDb: -18}),
  ], bus(0.8, POLISH, roomOf(0.4, -9, {size: 0.6}))),
  make('menu-back', 'Menu back', 'menu', 0.55, 'Two soft marimba notes falling a fourth', [
    ...mallet('E5', 0, -1, {t60: 0.25}), ...mallet('B4', 0.06, 0, {t60: 0.3}),
  ], bus(0.7, POLISH, roomOf(0.4, -10, {size: 0.6}))),
  make('confirm', 'Confirm', 'verdict', 0.7, 'FM tines rising a fifth (C → G)', [
    ...tine('C5', 0, -2, {t60: 0.4}), ...tine('G5', 0.07, 0, {t60: 0.55}), ...mallet('G5', 0.07, -10, {t60: 0.3}),
  ], bus(0.5, POLISH, roomOf(0.6, -10))),
  make('cancel', 'Cancel', 'verdict', 0.7, 'Muted tines falling a fifth (E → A)', [
    ...tine('E5', 0, -1, {t60: 0.35, fmIndex: 0.9}), ...tine('A4', 0.08, 0, {t60: 0.45, fmIndex: 0.9}),
  ], bus(0.5, eq(hp(70), dip(3400, -3), shelf(4500, -6)), roomOf(0.6, -11))),
  make('join', 'Player join', 'flow', 1.1, 'Warm rolled C-major arrival with a tine on top', [
    ...mallet('C5', 0, -3), ...mallet('E5', 0.045, -3), ...mallet('G5', 0.09, -2),
    ...tine('C6', 0.09, -9, {t60: 0.8}), ...pad(['C4', 'G4'], 0.05, -17, {attack: 0.08}), ...thump(0, -14),
  ], bus(0.5, POLISH, roomOf(0.9, -9))),
  make('leave', 'Player leave', 'flow', 1.0, 'The join roll mirrored downward, darker', [
    ...mallet('G5', 0, -4), ...mallet('E5', 0.05, -3), ...mallet('C5', 0.1, -2, {t60: 0.7}),
    ...pad(['C4', 'G4'], 0.08, -18, {attack: 0.08}),
  ], bus(0.5, eq(hp(70), dip(3400, -3), shelf(4500, -6)), roomOf(0.9, -9))),
  make('ready', 'Ready', 'flow', 0.9, 'Sound-check bloom: C/G tine dyad, sub and a breath of air', [
    ...air(0, 600, 1800, {attack: 0.06, t60: 0.2, gainDb: -18}),
    ...tine('C5', 0.04, -2, {t60: 0.7}), ...tine('G5', 0.09, -2, {t60: 0.8}), ...thump(0.04, -10),
  ], bus(0.5, POLISH, roomOf(0.9, -9))),
  make('start', 'Game start', 'flow', 1.7, 'Short riser into a strummed C-major hit with sparkle', [
    ...air(0, 400, 2400, {attack: 0.3, t60: 0.05, move: 0.3, gainDb: -6}),
    tone(130.81, WARM, {attack: 0.28, t60: 0.05, glideTo: 261.63, glide: 0.15, gainDb: -14}),
    ...thump(0.3, -2, {t60: 0.3}), ...pad(['C4', 'E4', 'G4'], 0.3, -11, {attack: 0.02, hold: 0.2, t60: 1.1}),
    ...tine('C5', 0.3, -5), ...tine('E5', 0.32, -5), ...tine('G5', 0.34, -4), ...tine('C6', 0.36, -3, {t60: 1.2}),
    ...sparkles(0.36, 7, 0.7, 'G6', -24),
  ], bus(0.7, POLISH, roomOf(1.3, -7))),
  make('round-end', 'Round end', 'flow', 1.6, 'Relaxed IV → I cadence on mallets and pad', [
    ...mallet('F5', 0, -3), ...mallet('E5', 0.12, -3), ...mallet('C5', 0.24, -1, {t60: 1.0}),
    ...pad(['F4', 'A4'], 0, -16, {hold: 0.1, t60: 0.3}), ...pad(['C4', 'E4', 'G4'], 0.24, -15, {attack: 0.06, t60: 1.1}),
  ], bus(0.5, POLISH, roomOf(1.2, -8))),
  make('bonus', 'Bonus', 'reward', 1.4, 'Pentatonic glass cascade down and back up, with sparkle', [
    ...bell('C6', 0, -4, {t60: 0.5}), ...bell('A5', 0.05, -4, {t60: 0.5}), ...bell('G5', 0.1, -4, {t60: 0.5}),
    ...bell('E5', 0.15, -3, {t60: 0.5}), ...bell('G5', 0.2, -3, {t60: 0.5}), ...bell('C6', 0.25, -2, {t60: 0.9}),
    ...mallet('C5', 0.25, -10), ...sparkles(0.25, 7, 0.6, 'G6', -24), ...pad(['C5', 'E5'], 0.2, -18),
  ], bus(0.5, POLISH, roomOf(1.2, -7))),
  make('penalty', 'Penalty', 'power', 0.95, 'Low falling "womp" with a muffled thud', [
    tone(220, [p(1, 1), p(2, 0.35, 0.8), p(3, 0.12, 0.6)], {glideTo: 98, glide: 0.18, attack: 0.005, hold: 0.1, t60: 0.55}),
    noise('lp', 700, {t60: 0.2, gainDb: -12}), ...thump(0, -6),
  ], bus(1.4, eq(hp(60), lp(2000), shelf(4000, -6)), roomOf(0.6, -12))),
  make('teleport', 'Teleport', 'power', 1.4, 'Two detuned shimmering sweeps flying across the stereo field', [
    tone(300, WARM.slice(0, 4), {glideTo: 1500, glide: 0.25, attack: 0.05, hold: 0.2, t60: 0.5, tremoloHz: 14, tremoloDepth: 0.5, pan: -0.8, panTo: 0.8, move: 0.6, gainDb: -2}),
    tone(303, WARM.slice(0, 4), {glideTo: 1515, glide: 0.25, attack: 0.05, hold: 0.2, t60: 0.5, tremoloHz: 11, tremoloDepth: 0.5, pan: 0.8, panTo: -0.8, move: 0.6, gainDb: -4}),
    noise('bp', 600, {hzTo: 4000, move: 0.6, attack: 0.2, hold: 0.1, t60: 0.3, gainDb: -16, q: 1.4}),
    ...sparkles(0.3, 6, 0.5, 'E6', -22),
  ], bus(0.6, POLISH, roomOf(1.4, -5, {size: 1.3}))),
  make('shield', 'Shield', 'power', 1.4, 'Warm humming A-major field with a glass strike', [
    ...pad(['A3', 'E4', 'A4'], 0, -4, {attack: 0.08, hold: 0.35, t60: 0.7, tremoloHz: 7, tremoloDepth: 0.35, spread: 0.35}),
    ...bell('A5', 0, -12, {t60: 0.6}), ...thump(0, -12),
  ], bus(0.8, eq(hp(70), dip(3400, -3), shelf(5000, -5)), roomOf(1.0, -8))),
  make('power-up', 'Power up', 'power', 1.5, 'Fast rising C-major tine run over a climbing warm tone', [
    ...['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'].flatMap((n, i) => tine(n, i * 0.04, -4, {t60: i === 6 ? 1.0 : 0.45})),
    tone(130.81, WARM, {glideTo: 523.25, glide: 0.12, attack: 0.08, hold: 0.15, t60: 0.5, gainDb: -12}),
    ...sparkles(0.26, 6, 0.5, 'G6', -22), ...thump(0.24, -12),
  ], bus(0.5, POLISH, roomOf(1.1, -7))),
  make('power-down', 'Power down', 'power', 1.5, 'Slowing falling tine run with a sinking warm tone', [
    ...['C6', 'G5', 'E5', 'C5', 'G4', 'E4', 'C4'].flatMap((n, i) => tine(n, [0, 0.05, 0.11, 0.18, 0.26, 0.35, 0.45][i]!, -4, {t60: i === 6 ? 0.9 : 0.4, fmIndex: 1})),
    tone(523.25, WARM, {glideTo: 110, glide: 0.35, attack: 0.02, hold: 0.2, t60: 0.6, gainDb: -12}),
  ], bus(0.5, eq(hp(70), dip(3400, -3), shelf(4500, -5)), roomOf(1.1, -8))),
  make('notification', 'Notification', 'flow', 1.0, 'Gentle E → A tine call with a glass halo', [
    ...tine('E5', 0, -2, {t60: 0.5}), ...tine('A5', 0.09, 0, {t60: 0.8}), ...bell('A5', 0.09, -13, {t60: 0.6}),
  ], bus(0.5, POLISH, roomOf(0.9, -9))),
  make('achievement', 'Achievement', 'reward', 2.4, 'Mallet pickup into a Cmaj9 bloom with strummed tines and air', [
    ...mallet('C5', 0, -4), ...mallet('E5', 0.06, -4), ...mallet('G5', 0.12, -4),
    ...thump(0.2, -2, {t60: 0.3}), ...pad(['C4', 'E4', 'G4', 'B4', 'D5'], 0.2, -11, {attack: 0.03, hold: 0.3, t60: 1.4}),
    ...tine('E5', 0.2, -5), ...tine('G5', 0.23, -5), ...tine('B5', 0.26, -5), ...tine('D6', 0.29, -4, {t60: 1.4}),
    ...sparkles(0.3, 10, 1.1, 'G6', -23), noise('hp', 7000, {at: 0.2, attack: 0.01, t60: 1.0, gainDb: -30}),
  ], bus(0.7, POLISH, roomOf(1.6, -6))),
  make('error', 'Error', 'verdict', 0.8, 'Two muted low pulses, soft and dark', [
    tone(196, BUZZ.slice(0, 8), {attack: 0.004, hold: 0.09, t60: 0.12, gainDb: 0}),
    tone(185, BUZZ.slice(0, 8), {at: 0.17, attack: 0.004, hold: 0.11, t60: 0.15, gainDb: 0}),
    noise('lp', 500, {t60: 0.08, gainDb: -16}), noise('lp', 500, {at: 0.17, t60: 0.08, gainDb: -16}),
  ], bus(1.5, eq(hp(70), lp(1200), shelf(3000, -6)), roomOf(0.4, -14, {size: 0.7}))),
  make('splash', 'Splash', 'board', 1.1, 'Falling filtered spray with rising droplet plips', [
    noise('lp', 3200, {hzTo: 500, q: 0.8, attack: 0.015, hold: 0.06, t60: 0.55, move: 0.45}),
    noise('bp', 1200, {q: 0.8, attack: 0.006, t60: 0.15, gainDb: -10}), ...thump(0, -18, {glideTo: 50}),
    scatter([tone(600, SINE, {glideTo: 1400, glide: 0.015, attack: 0.001, t60: 0.06, gainDb: -8})], {at: 0.05, count: 7, span: 0.5, pitchJitter: 5, fallDb: 8}),
  ], bus(2.5, eq(hp(80), dip(3400, -3), shelf(6000, -4)), roomOf(0.8, -10))),
  make('bounce', 'Bounce', 'board', 0.7, 'Elastic spring "boing" with a smaller second hop', [
    tone(180, [p(1, 1), p(2, 0.2, 0.6)], {glideTo: 440, glide: 0.05, vibratoHz: 9, vibratoCents: 35, attack: 0.006, t60: 0.42}),
    tone(220, [p(1, 1), p(2, 0.2, 0.6)], {at: 0.2, glideTo: 520, glide: 0.05, vibratoHz: 9, vibratoCents: 30, attack: 0.006, t60: 0.28, gainDb: -8}),
    ...thump(0, -16, {t60: 0.1}),
  ], bus(1.2, POLISH, roomOf(0.5, -11, {size: 0.8}))),
  make('swipe', 'Swipe', 'menu', 0.5, 'Short papery air gesture right to left (also a card slide)', [
    noise('bp', 1400, {hzTo: 380, q: 0.9, attack: 0.04, hold: 0.08, t60: 0.2, move: 0.22, pan: 0.5, panTo: -0.5}),
    noise('lp', 700, {attack: 0.04, hold: 0.06, t60: 0.15, gainDb: -8, pan: 0.5, panTo: -0.5, move: 0.22}),
    noise('hp', 2200, {attack: 0.02, t60: 0.05, gainDb: -20, pan: 0.5, panTo: -0.5, move: 0.1}),
  ], bus(1.5, eq(hp(150), dip(3400, -2), shelf(7000, -3)), roomOf(0.4, -13, {size: 0.6}))),
  make('connect', 'Connect', 'flow', 1.1, 'Rising A-major tine triad with a soft pad', [
    ...tine('A4', 0, -3, {t60: 0.5}), ...tine('E5', 0.08, -3, {t60: 0.6}), ...tine('A5', 0.16, -1, {t60: 0.9}),
    ...pad(['A4', 'E5'], 0.1, -17, {attack: 0.08}), ...thump(0, -14),
  ], bus(0.5, POLISH, roomOf(1.0, -9))),
];
