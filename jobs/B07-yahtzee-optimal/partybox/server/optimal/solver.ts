// Exact solitaire Yahtzee (B07 port, part 2 of 2): optimal category and hold choices. Every legal
// action and fair-dice outcome is evaluated over the solved start-of-turn table; ties pick the
// lowest category / the lexicographically lowest hold. Same algorithm as B07 yahtzeeOpt.ts.
import { ALL, EMPTY_CARD, cardInput, countsOf, diceInput, fail, write } from './rules';
import type { Card, CategoryResult, HoldResult, Scorecard } from './rules';
import { solvedValue } from './tables';

const FULL_FIRST = 210;
const HAND_COUNT = 462;

function tableValue(card: Card): number {
  const value = solvedValue(card.ruleMode, card.usedMask, card.upper, card.yahtzeeBonus);
  if (!Number.isFinite(value)) return fail('Missing solved state');
  return value;
}
/** Expected remaining points from the start of the next turn (0 for a full card). */
export function expectedValue(scorecard: Scorecard = EMPTY_CARD): number {
  return tableValue(cardInput(scorecard));
}
function categoryChoice(counts: readonly number[], card: Card): CategoryResult {
  if (card.usedMask === ALL) fail('No open categories');
  let best: CategoryResult | undefined;
  for (let category = 0; category < 13; category++) {
    const result = write(counts, category, card);
    if (!result.legal) continue;
    const value =
      result.points + result.yahtzeeBonus + result.upperBonus + tableValue(cardInput(result.next));
    if (best === undefined || value > best.expectedValue)
      best = { ...result, category, expectedValue: value };
  }
  return best ?? fail('No legal category');
}
/** The category that maximizes points now plus the optimal expected rest of the game. */
export function bestCategory(dice: readonly number[], scorecard: Scorecard): CategoryResult {
  return categoryChoice(countsOf(diceInput(dice)), cardInput(scorecard));
}

interface Hand {
  readonly dice: readonly number[];
  readonly counts: readonly number[];
  readonly code: number;
}
const powers: readonly number[] = [1, 6, 36, 216, 1296, 7776];
function handsOf(target: number, minimum: number, dice: readonly number[]): Hand[] {
  if (dice.length === target) {
    const counts = countsOf(dice);
    const code = counts.reduce((sum, count, f) => sum + count * powers[f]!, 0);
    return [{ dice: dice.slice(), counts, code }];
  }
  const hands: Hand[] = [];
  for (let face = minimum; face <= 6; face++) hands.push(...handsOf(target, face, [...dice, face]));
  return hands;
}
/** Every kept multiset of 0..5 dice, smallest first: ids 210..461 are the 252 full hands. */
const handData: readonly Hand[] = [0, 1, 2, 3, 4, 5].flatMap((size) => handsOf(size, 1, []));
if (handData.length !== HAND_COUNT) throw new Error('Hand inventory invariant');
const handIds = new Map(handData.map((hand, id) => [hand.code, id]));
function lex(left: readonly number[], right: readonly number[]): number {
  for (let i = 0; i < Math.min(left.length, right.length); i++)
    if (left[i] !== right[i]) return left[i]! - right[i]!;
  return left.length - right.length;
}
function ranksOf(): number[] {
  const rank = Array<number>(HAND_COUNT).fill(0);
  handData
    .map((_, id) => id)
    .sort((a, b) => lex(handData[a]!.dice, handData[b]!.dice))
    .forEach((id, order) => {
      rank[id] = order;
    });
  return rank;
}
const rank: readonly number[] = ranksOf();
const plus = handData.map((hand) =>
  powers.map((power) => (hand.dice.length < 5 ? handIds.get(hand.code + power)! : -1)),
);
const minus = handData.map((hand) =>
  powers.map((power, f) => (hand.counts[f]! > 0 ? handIds.get(hand.code - power)! : -1)),
);
function average(values: Float64Array): void {
  for (let hand = FULL_FIRST - 1; hand >= 0; hand--) {
    let total = 0;
    for (let face = 0; face < 6; face++) total += values[plus[hand]![face]!]!;
    values[hand] = total / 6;
  }
}
function maximize(values: Float64Array): Int16Array {
  const choices = new Int16Array(HAND_COUNT);
  for (let hand = 0; hand < HAND_COUNT; hand++) {
    choices[hand] = hand;
    for (let face = 0; face < 6; face++) {
      const prior = minus[hand]![face]!;
      if (prior < 0) continue;
      if (
        values[prior]! > values[hand]! ||
        (values[prior] === values[hand] && rank[choices[prior]!]! < rank[choices[hand]!]!)
      ) {
        values[hand] = values[prior]!;
        choices[hand] = choices[prior]!;
      }
    }
  }
  return choices;
}
function endValues(card: Card): Float64Array {
  const values = new Float64Array(HAND_COUNT);
  for (let hand = FULL_FIRST; hand < HAND_COUNT; hand++)
    values[hand] = categoryChoice(handData[hand]!.counts, card).expectedValue;
  return values;
}
/** The dice to keep (sorted faces) with rollsLeft rerolls still allowed. Keeping all five means
 *  "stop and score now"; with rollsLeft 0 it is always the whole roll. */
export function bestHold(
  dice: readonly number[],
  rollsLeft: number,
  scorecard: Scorecard,
): HoldResult {
  const sorted = diceInput(dice),
    card = cardInput(scorecard);
  if (!Number.isInteger(rollsLeft) || rollsLeft < 0 || rollsLeft > 2)
    fail('Invalid remaining rolls');
  if (card.usedMask === ALL) fail('No open categories');
  if (rollsLeft === 0)
    return { hold: sorted, expectedValue: categoryChoice(countsOf(sorted), card).expectedValue };
  const counts = countsOf(sorted),
    code = counts.reduce((sum, count, face) => sum + count * powers[face]!, 0),
    id = handIds.get(code)!;
  const values = endValues(card);
  let choices: Int16Array | undefined;
  for (let remaining = 1; remaining <= rollsLeft; remaining++) {
    average(values);
    choices = maximize(values);
  }
  return { hold: handData[choices![id]!]!.dice.slice(), expectedValue: values[id]! };
}
/** The expected final points of keeping `hold` and rolling the rest (rollsLeft 1 or 2). */
export function valueOfHold(
  dice: readonly number[],
  hold: readonly number[],
  rollsLeft: number,
  scorecard: Scorecard,
): number {
  const sorted = diceInput(dice),
    card = cardInput(scorecard);
  if (
    card.usedMask === ALL ||
    !Number.isInteger(rollsLeft) ||
    rollsLeft < 1 ||
    rollsLeft > 2 ||
    !Array.isArray(hold) ||
    hold.length > 5
  )
    fail('Invalid hold query');
  const available = countsOf(sorted),
    kept = Array<number>(6).fill(0);
  for (const face of hold) {
    if (!Number.isInteger(face) || face < 1 || face > 6) fail('Invalid held face');
    kept[face - 1] = kept[face - 1]! + 1;
  }
  for (let f = 0; f < 6; f++) if (kept[f]! > available[f]!) fail('Hold is not a submultiset');
  const code = kept.reduce((sum, count, f) => sum + count * powers[f]!, 0),
    id = handIds.get(code)!;
  const values = endValues(card);
  if (rollsLeft === 2) {
    average(values);
    maximize(values);
  }
  average(values);
  return values[id]!;
}
