// Exact solitaire Yahtzee (B07 port, part 1 of 2): the scorecard model, input checks and scoring.
// Same code as B07 yahtzeeOpt.ts, split for PartyBox's file-size rule. Pure: no I/O, clock or
// randomness; malformed input throws RangeError (callers that must not throw wrap the call).
export const CATEGORIES = [
  'ones',
  'twos',
  'threes',
  'fours',
  'fives',
  'sixes',
  'threeKind',
  'fourKind',
  'fullHouse',
  'smallStraight',
  'largeStraight',
  'yahtzee',
  'chance',
] as const;
/** 'official': Hasbro's forced Joker (matching upper box, then lower, then upper for 0).
 *  'published': Verhoeff's free-choice Joker (any open box; fixed Joker scores once the matching
 *  upper box is filled). */
export type RuleMode = 'official' | 'published';
export interface Scorecard {
  /** Filled categories, bit i = CATEGORIES[i]. */
  readonly usedMask: number;
  /** Upper subtotal capped at 63. */
  readonly upper: number;
  /** The Yahtzee box holds 50, so each later Yahtzee earns 100. */
  readonly yahtzeeBonus: boolean;
  readonly ruleMode?: RuleMode;
}
export interface ScoreResult {
  readonly legal: boolean;
  readonly points: number;
  readonly yahtzeeBonus: number;
  readonly upperBonus: number;
  readonly next: Scorecard;
}
export interface CategoryResult extends ScoreResult {
  readonly category: number;
  /** Points, bonuses and the optimal expected rest of the game. */
  readonly expectedValue: number;
}
export interface HoldResult {
  readonly hold: readonly number[];
  readonly expectedValue: number;
}
/** A checked scorecard with its rule mode filled in. */
export type Card = Scorecard & { readonly ruleMode: RuleMode };
export const EMPTY_CARD: Scorecard = Object.freeze({
  usedMask: 0,
  upper: 0,
  yahtzeeBonus: false,
  ruleMode: 'official',
});
export const ALL = 8191;
const YAHTZEE = 2048;
const reachability: readonly ReadonlySet<number>[] = Array.from({ length: 64 }, (_, mask) => {
  let sums = new Set<number>([0]);
  for (let face = 1; face <= 6; face++)
    if (mask & (1 << (face - 1))) {
      const next = new Set<number>();
      for (const sum of sums)
        for (let count = 0; count <= 5; count++) next.add(Math.min(63, sum + face * count));
      sums = next;
    }
  return sums;
});
export function fail(message: string): never {
  throw new RangeError(message);
}
export function cardInput(card: Scorecard): Card {
  if (
    typeof card !== 'object' ||
    card === null ||
    Array.isArray(card) ||
    !Number.isInteger(card.usedMask) ||
    card.usedMask < 0 ||
    card.usedMask > ALL ||
    !Number.isInteger(card.upper) ||
    card.upper < 0 ||
    card.upper > 63 ||
    typeof card.yahtzeeBonus !== 'boolean' ||
    (card.yahtzeeBonus && !(card.usedMask & YAHTZEE)) ||
    !reachability[card.usedMask & 63]!.has(card.upper)
  )
    fail('Invalid scorecard');
  const ruleMode = card.ruleMode === undefined ? 'official' : card.ruleMode;
  if (ruleMode !== 'official' && ruleMode !== 'published') fail('Invalid rule mode');
  return { usedMask: card.usedMask, upper: card.upper, yahtzeeBonus: card.yahtzeeBonus, ruleMode };
}
export function diceInput(dice: readonly number[]): number[] {
  if (!Array.isArray(dice) || dice.length !== 5) fail('Exactly five dice required');
  const result: number[] = [];
  for (const face of dice) {
    if (!Number.isInteger(face) || face < 1 || face > 6) fail('Invalid die face');
    result.push(face);
  }
  return result.sort((a, b) => a - b);
}
function categoryInput(category: number): void {
  if (!Number.isInteger(category) || category < 0 || category >= 13) fail('Invalid category');
}
export function countsOf(dice: readonly number[]): number[] {
  const counts = Array<number>(6).fill(0);
  for (const face of dice) counts[face - 1] = counts[face - 1]! + 1;
  return counts;
}
function baseScore(counts: readonly number[], category: number): number {
  if (category < 6) return counts[category]! * (category + 1);
  let sum = 0,
    max = 0,
    bits = 0,
    pair = false,
    triple = false;
  for (let f = 0; f < 6; f++) {
    const n = counts[f]!;
    sum += (f + 1) * n;
    max = Math.max(max, n);
    if (n) bits |= 1 << f;
    pair ||= n === 2;
    triple ||= n === 3;
  }
  switch (category) {
    case 6:
      return max >= 3 ? sum : 0;
    case 7:
      return max >= 4 ? sum : 0;
    case 8:
      return pair && triple ? 25 : 0;
    case 9:
      return (bits & 15) === 15 || (bits & 30) === 30 || (bits & 60) === 60 ? 30 : 0;
    case 10:
      return bits === 31 || bits === 62 ? 40 : 0;
    case 11:
      return max === 5 ? 50 : 0;
    case 12:
      return sum;
    default:
      return fail('Invalid category');
  }
}
export function write(counts: readonly number[], category: number, card: Card): ScoreResult {
  const open = ALL ^ card.usedMask;
  const face = counts.findIndex((count) => count === 5);
  const extra = face >= 0 && Boolean(card.usedMask & YAHTZEE);
  let legal = open;
  if (extra && card.ruleMode === 'official') {
    if (open & (1 << face)) legal = 1 << face;
    else if (open & ~63) legal = open & ~63;
  }
  if (!(legal & (1 << category)))
    return { legal: false, points: 0, yahtzeeBonus: 0, upperBonus: 0, next: card };
  let points = baseScore(counts, category);
  if (extra && card.usedMask & (1 << face)) {
    if (category === 8) points = 25;
    else if (category === 9) points = 30;
    else if (category === 10) points = 40;
  }
  const upper = category < 6 ? Math.min(63, card.upper + points) : card.upper;
  return {
    legal: true,
    points,
    yahtzeeBonus: face >= 0 && card.yahtzeeBonus ? 100 : 0,
    upperBonus: category < 6 && card.upper < 63 && card.upper + points >= 63 ? 35 : 0,
    next: {
      usedMask: card.usedMask | (1 << category),
      upper,
      yahtzeeBonus: card.yahtzeeBonus || (category === 11 && points === 50),
      ruleMode: card.ruleMode,
    },
  };
}
/** Writes these dice into one category (the empty card by default). */
export function score(
  dice: readonly number[],
  category: number,
  scorecard: Scorecard = EMPTY_CARD,
): ScoreResult {
  categoryInput(category);
  return write(countsOf(diceInput(dice)), category, cardInput(scorecard));
}
