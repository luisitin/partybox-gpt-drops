// Solved start-of-turn values for the exact solver (B07), unpacked on first use. A state is the
// used-box mask (13 bits), the upper subtotal capped at 63 and Yahtzee-bonus eligibility: 536,448
// valid states, kept as 359,616 Float64 values per Joker rule because an upper subtotal that can
// no longer reach 63 has exactly the value of subtotal 0 (B07 build-tables.mjs checks each copy).
import { SOLVED_OFFICIAL } from './tables-official.generated';
import { SOLVED_PUBLISHED } from './tables-published.generated';

export type SolvedRuleMode = 'official' | 'published';
export const SOLVED_ENTRIES = 359616;
const UPPER_GOAL = 63;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

interface Layout {
  /** Upper subtotals this filled-upper mask can reach (index 0..63). */
  readonly reach: readonly boolean[];
  /** Points the open upper boxes can still add (5 of each open face). */
  readonly left: number;
  /** Position of each canonical subtotal inside one block, -1 when it is not stored. */
  readonly slots: readonly number[];
  /** Stored subtotals per block. */
  readonly width: number;
}

function layoutOf(mask: number): Layout {
  let sums = new Set<number>([0]);
  let left = 0;
  for (let face = 1; face <= 6; face++) {
    if (!(mask & (1 << (face - 1)))) {
      left += 5 * face;
      continue;
    }
    const next = new Set<number>();
    for (const sum of sums)
      for (let n = 0; n <= 5; n++) next.add(Math.min(UPPER_GOAL, sum + face * n));
    sums = next;
  }
  const reach = Array.from({ length: 64 }, (_, upper) => sums.has(upper));
  const slots = Array<number>(64).fill(-1);
  let width = 0;
  for (let upper = 0; upper < 64; upper++)
    if (reach[upper] && (upper === 0 || upper + left >= UPPER_GOAL)) slots[upper] = width++;
  return { reach, left, slots, width };
}

/** Where each used-box mask's block starts: one block, two when the Yahtzee box is filled. */
function offsetsOf(layouts: readonly Layout[]): number[] {
  const offsets = [0];
  for (let mask = 0; mask < 8192; mask++)
    offsets.push(offsets[mask]! + layouts[mask & 63]!.width * (mask & 2048 ? 2 : 1));
  return offsets;
}

const LAYOUTS: readonly Layout[] = Array.from({ length: 64 }, (_, mask) => layoutOf(mask));
const OFFSETS: readonly number[] = offsetsOf(LAYOUTS);
if (OFFSETS[8192] !== SOLVED_ENTRIES) throw new Error('Solved table layout invariant');

function decode(text: string): Float64Array {
  const lookup = new Int16Array(128).fill(-1);
  for (let i = 0; i < ALPHABET.length; i++) lookup[ALPHABET.charCodeAt(i)] = i;
  const bytes = new Uint8Array(SOLVED_ENTRIES * 8);
  let written = 0;
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < text.length && written < bytes.length; i++) {
    const code = text.charCodeAt(i);
    const digit = code < 128 ? lookup[code]! : -1;
    if (digit < 0) break;
    buffer = ((buffer << 6) | digit) & 0xffffff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[written++] = (buffer >> bits) & 255;
    }
  }
  if (written !== bytes.length) throw new Error('Solved table is truncated');
  const view = new DataView(bytes.buffer);
  return Float64Array.from({ length: SOLVED_ENTRIES }, (_, i) => view.getFloat64(i * 8, true));
}

// Both solved tables, decoded once when the module loads (about 80 ms each on Node 22; ~2.9 MB of
// Float64 apiece). This is constant derived data that nothing writes, so the module keeps no
// mutable state and solvedValue is a pure lookup. A game server imports it once, at boot.
const TABLES: Readonly<Record<SolvedRuleMode, Float64Array>> = {
  official: decode(SOLVED_OFFICIAL),
  published: decode(SOLVED_PUBLISHED),
};

/** Expected remaining points before the next turn's first roll; NaN for an unreachable state. */
export function solvedValue(
  mode: SolvedRuleMode,
  usedMask: number,
  upper: number,
  yahtzeeBonus: boolean,
): number {
  if (mode !== 'official' && mode !== 'published') return NaN;
  if (!Number.isInteger(usedMask) || usedMask < 0 || usedMask > 8191) return NaN;
  if (!Number.isInteger(upper) || upper < 0 || upper > UPPER_GOAL) return NaN;
  const layout = LAYOUTS[usedMask & 63]!;
  if (!layout.reach[upper] || (yahtzeeBonus && !(usedMask & 2048))) return NaN;
  const slot = layout.slots[upper + layout.left < UPPER_GOAL ? 0 : upper]!;
  return TABLES[mode][OFFSETS[usedMask]! + (yahtzeeBonus ? layout.width : 0) + slot]!;
}
