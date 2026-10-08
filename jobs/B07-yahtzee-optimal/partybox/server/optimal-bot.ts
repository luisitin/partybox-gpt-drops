// Exact optimal play for the Classic edition (B07 solver in ./optimal/). The room's 'sharp' bots
// use it (ADR-059); it reads only what the roller's phone shows. Any other edition or house rule
// (Triple, original or no Jokers, no extra bonuses, five alike as Full House) returns null, and
// the caller plays its normal bot. Never throws. Maximizes the expected solitaire score, not the
// chance to beat the table.
import { score } from './optimal/rules';
import type { RuleMode, Scorecard } from './optimal/rules';
import { bestCategory, bestHold, expectedValue } from './optimal/solver';

/** The edition fields read here: structurally a subset of content/schema's Edition. */
export interface OptimalEdition {
  readonly categories: readonly {
    readonly id: string;
    readonly section: string;
    readonly rule: string;
    readonly face: number;
    readonly count: number;
    readonly points: number;
  }[];
  readonly rules: {
    readonly diceCount: number;
    readonly diceSides: number;
    readonly maxRolls: number;
    readonly upperThreshold: number;
    readonly upperBonus: number;
    readonly yahtzeeBonus: number;
    readonly columns: readonly number[];
    readonly bonusPolicy: string;
  };
}
export interface OptimalCard {
  readonly boxes: Readonly<Record<string, number | null>>;
  readonly bonuses: number;
}
export type OptimalSettings = Readonly<Record<string, unknown>>;
/** The game state fields read here: structurally a subset of server/types' State. */
export interface OptimalTurn {
  readonly phase: { readonly id: string };
  readonly turn: string;
  readonly rolls: number;
  readonly dice: readonly number[];
  readonly held: readonly number[];
  readonly settings: OptimalSettings;
  readonly cards: Readonly<Record<string, readonly OptimalCard[]>>;
}
export type OptimalInput =
  { type: 'roll'; keep?: number[] } | { type: 'score'; category: string; column: number };
export interface ScoreChoice {
  readonly category: string;
  readonly points: number;
  readonly yahtzeeBonus: number;
  readonly upperBonus: number;
  /** Points and bonuses now plus the optimal expected rest of the game. */
  readonly expectedValue: number;
}

/** The solver's category index (0..12) of a Classic box, or -1. */
function slotOf(c: OptimalEdition['categories'][number]): number {
  if (c.rule === 'face')
    return c.section === 'upper' && c.face >= 1 && c.face <= 6 ? c.face - 1 : -1;
  if (c.section !== 'lower') return -1;
  if (c.rule === 'kind') return c.count === 3 ? 6 : c.count === 4 ? 7 : -1;
  if (c.rule === 'house') return c.count === 3 && c.points === 25 ? 8 : -1;
  if (c.rule === 'straight')
    return c.count === 4 && c.points === 30 ? 9 : c.count === 5 && c.points === 40 ? 10 : -1;
  if (c.rule === 'all') return c.points === 50 ? 11 : -1;
  return c.rule === 'sum' ? 12 : -1;
}
/** The edition's box id for each solver category, or null when it is not the solved Classic game. */
export function classicIds(edition: OptimalEdition): readonly string[] | null {
  const r = edition.rules;
  if (
    r.diceCount !== 5 ||
    r.diceSides !== 6 ||
    r.maxRolls !== 3 ||
    r.upperThreshold !== 63 ||
    r.upperBonus !== 35 ||
    r.yahtzeeBonus !== 100 ||
    r.bonusPolicy !== 'classic' ||
    r.columns.length !== 1 ||
    r.columns[0] !== 1 ||
    edition.categories.length !== 13
  )
    return null;
  const ids = Array<string>(13).fill('');
  for (const c of edition.categories) {
    const slot = slotOf(c);
    if (slot < 0 || ids[slot] !== '') return null;
    ids[slot] = c.id;
  }
  return ids;
}
/** Which solved table matches the room's settings, or null (play the normal bot). */
export function optimalRuleMode(
  edition: OptimalEdition,
  settings: OptimalSettings,
): RuleMode | null {
  if (!classicIds(edition) || settings['yahtzeeBonus'] === false || settings['fullHouseYahtzee'])
    return null;
  const joker = settings['jokerRule'];
  return joker === 'forced' ? 'official' : joker === 'free' ? 'published' : null;
}
/** A PartyBox card as the solver's scorecard: filled boxes, upper subtotal (capped at 63) and
 *  whether the Yahtzee box holds 50. Null for a box that is neither a number nor null. */
export function toScorecard(
  ids: readonly string[],
  card: OptimalCard,
  ruleMode: RuleMode,
): Scorecard | null {
  let usedMask = 0;
  let upper = 0;
  for (let slot = 0; slot < 13; slot++) {
    const value = card.boxes[ids[slot]!];
    if (value === null) continue;
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    usedMask |= 1 << slot;
    if (slot < 6) upper += value;
  }
  return {
    usedMask,
    upper: Math.min(63, upper),
    yahtzeeBonus: card.boxes[ids[11]!] === 50,
    ruleMode,
  };
}
/** Dice indices holding these faces; already-held dice are kept first so nothing jumps on screen. */
export function keepIndices(
  dice: readonly number[],
  faces: readonly number[],
  held: readonly number[] = [],
): number[] {
  const order = [...held.filter((i) => i >= 0 && i < dice.length), ...dice.keys()];
  const taken = new Set<number>();
  for (const face of faces) {
    const index = order.find((i) => !taken.has(i) && dice[i] === face);
    if (index !== undefined) taken.add(index);
  }
  return [...taken].sort((a, b) => a - b);
}
/** The optimal next input for the player whose card this is, or null when the solver does not
 *  apply. `rolls` is how many times this turn's dice were rolled (0 before the first roll). */
export function optimalMove(
  edition: OptimalEdition,
  settings: OptimalSettings,
  card: OptimalCard,
  dice: readonly number[],
  rolls: number,
  held: readonly number[] = [],
): OptimalInput | null {
  try {
    const mode = optimalRuleMode(edition, settings);
    const ids = classicIds(edition);
    const scorecard = mode && ids ? toScorecard(ids, card, mode) : null;
    if (!ids || !scorecard || !Number.isInteger(rolls) || rolls < 0 || rolls > 3) return null;
    expectedValue(scorecard); // throws on a card the solver cannot represent
    if (rolls === 0) return { type: 'roll' };
    if (rolls < 3) {
      const { hold } = bestHold(dice, 3 - rolls, scorecard);
      if (hold.length < 5) return { type: 'roll', keep: keepIndices(dice, hold, held) };
    }
    return { type: 'score', category: ids[bestCategory(dice, scorecard).category]!, column: 0 };
  } catch {
    return null;
  }
}
/** optimalMove for the player whose turn it is in a PartyBox state. */
export function optimalInput(edition: OptimalEdition, s: OptimalTurn): OptimalInput | null {
  try {
    if (s.phase.id !== 'roll' && s.phase.id !== 'choose') return null;
    const card = s.cards[s.turn]?.[0];
    return card ? optimalMove(edition, s.settings, card, s.dice, s.rolls, s.held) : null;
  } catch {
    return null;
  }
}
/** Every legal box for these dice with its optimal expected value, best first (a coach hint or a
 *  post-game "how close to perfect" stat). Null when the solver does not apply. */
export function scoreChoices(
  edition: OptimalEdition,
  settings: OptimalSettings,
  card: OptimalCard,
  dice: readonly number[],
): ScoreChoice[] | null {
  try {
    const mode = optimalRuleMode(edition, settings);
    const ids = classicIds(edition);
    const scorecard = mode && ids ? toScorecard(ids, card, mode) : null;
    if (!ids || !scorecard) return null;
    const choices: { slot: number; choice: ScoreChoice }[] = [];
    for (let slot = 0; slot < 13; slot++) {
      const r = score(dice, slot, scorecard);
      if (!r.legal) continue;
      const future = expectedValue(r.next);
      const value = r.points + r.yahtzeeBonus + r.upperBonus + future;
      choices.push({
        slot,
        choice: {
          category: ids[slot]!,
          points: r.points,
          yahtzeeBonus: r.yahtzeeBonus,
          upperBonus: r.upperBonus,
          expectedValue: value,
        },
      });
    }
    return choices
      .sort((a, b) => b.choice.expectedValue - a.choice.expectedValue || a.slot - b.slot)
      .map((c) => c.choice);
  } catch {
    return null;
  }
}
