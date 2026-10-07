# Public B07 mathematical contract

This file contains the shared interface and game rules only. Each author writes
its own implementation before source exchange. No production/generator source,
algorithm details, tests or privately computed results are shared here.

## Types and order

Category is an integer0..12, in this order: ones, twos, threes, fours, fives,
sixes, threeKind, fourKind, fullHouse, smallStraight, largeStraight, yahtzee,
chance. Dice are exactly five integer faces1..6; a hold is an ascending
submultiset with length0..5. rollsLeft is the integer number of additional
rerolls available,0..2.

```ts
type RuleMode = 'official' | 'published';
interface Scorecard {
  readonly usedMask: number; // filled category bits, 0..8191
  readonly upper: number; // upper subtotal capped at63, integer0..63
  readonly yahtzeeBonus: boolean; // Yahtzee box has50 rather than0
  readonly ruleMode?: RuleMode; // default 'official'
}
interface ScoreResult {
  readonly legal: boolean;
  readonly points: number; // written category value
  readonly yahtzeeBonus: number; //0 or100
  readonly upperBonus: number; //0 or35
  readonly next: Scorecard;
}
interface CategoryResult extends ScoreResult {
  readonly category: number;
  readonly expectedValue: number; // reward now plus optimal future reward
}
interface HoldResult {
  readonly hold: readonly number[];
  readonly expectedValue: number;
}
```

`score(dice, category, scorecard?) -> ScoreResult` defaults to the empty card.
`bestCategory(dice, scorecard) -> CategoryResult`;
`bestHold(dice, rollsLeft, scorecard) -> HoldResult`;
`expectedValue(scorecard?) -> number` defaults to the empty official card and
means remaining rewards from the beginning of the next turn, excluding all
already earned scores/bonuses.

All malformed inputs throw RangeError. Validate masks, integer bounds, array
holes, booleans and rule modes. `yahtzeeBonus=true` requires Yahtzee category
bit11 already filled. A given upper subtotal must be reachable by adding
0..5 matching dice for every already-filled upper category, capped at63.
There is no additional history restriction. Card normalization adds the
explicit ruleMode default but does not replace the caller's actual upper
subtotal by an equivalent optimization representation.

An already-filled/forced-out category on an otherwise valid input yields
`legal=false`, all three reward fields0, and next equal in value to the
normalized unchanged input card. A legal write fills its bit, updates upper
only for categories0..5, sets yahtzeeBonus eligibility if scoring50 in bit11,
and returns an explicit ruleMode. Inputs are never mutated. Full cards have
expectedValue0; bestCategory and bestHold throw RangeError on a full card.
With rollsLeft0, bestHold returns the entire sorted dice and bestCategory's
value; it does not authorize another reroll.

## Scoring

Upper categories score sum of matching faces. Three/four of a kind score sum
of all five dice iff at least three/four match. Full house is25 iff a distinct
triple and pair exist. Small straight is30 for any consecutive four distinct
faces; large straight is40 for five. Yahtzee is50 for five equal. Chance is
the dice sum. Otherwise base score is0. A first Yahtzee is not a full house or
straight joker; it can still be assigned to any open category at its base score.

Upper bonus35 is awarded exactly on a write that first takes upper from below63
to63 or more; upper is then capped63. Previously earned bonuses are excluded
from expectedValue and never earned again. Extra Yahtzee bonus100 is awarded
whenever all five dice match and yahtzeeBonus eligibility was already true,
independent of the selected legal category. It never contributes to upper.

Five equal dice while Yahtzee bit11 is already filled (with50 OR0) invoke the
following convention; scoring0 in Yahtzee removes only the100 bonus.

- **official:** if the matching face's upper category is open, it is the only
  legal choice. Otherwise choose any open lower category. If no lower category
  remains, choose any other open upper category for0. With matching upper
  filled, joker full-house/small-straight/large-straight values are25/30/40.
- **published:** any open category is legal. Full-house/small-straight/large-
  straight joker values apply only when the matching upper category is already
  filled. This is Verhoeff's documented historical interpretation, exposed
  explicitly rather than described as the forced official rule.

A player can reroll any submultiset, including dice previously held. Holding
all dice represents skipping a remaining reroll, hence stopping early remains
available. No approximation of chance outcomes, search cutoff or sampled
strategy is permitted.

## Numerical and deterministic boundaries

All chance branches use their exact fair-dice probabilities; expectations are
reported as IEEE754 doubles approximating those rational values. Decisions
maximize the computed double, with equality ties choosing the lowest category
index or lexicographically lowest ascending hold (shorter prefix first). No
epsilon is used to suppress a real candidate's advantage. Independent solvers
may differ in arithmetic evaluation order; compare value/residual with a
declared roundoff tolerance and directly evaluate any alternate chosen hold
against the independent optimum. Equality fixtures have deterministic answers.
Do not claim bitwise equality or exact rational output for doubles.

## Public start-of-turn table exchange format

For independent generators, an optional raw table has2^20 little-endianFloat64
entries per rule mode. Index is `usedMask + upper*8192 + (yahtzeeBonus?524288:0)`.
Entries are expected remaining reward before the next first roll; full-card
entries are0. Unreachable/inconsistent entries may beNaN; all publicly valid
reachable states must be finite. The two modes are separate files. Each author
must compute its own values rather than obtain them from the other author.
This encoding is a mathematical/public data contract, not a generation algorithm.

## Primary rule sources

- Hasbro2003 US Game Folio rules:
  https://www.hasbro.com/common/instruct/40958.pdf
  (matching upper forced, then lower, then remaining upper; applies with Yahtzee0)
- Hasbro customer support:
  https://hasbro-apac-eng.custhelp.com/app/answers/detail/a_id/211
- Verhoeff's explicitly interpreted OSYP rules:
  https://www-set.win.tue.nl/~wstomv/misc/yahtzee/rules.html
- His published exact-expectation discussion:
  https://www-set.win.tue.nl/~wstomv/misc/yahtzee/trivia.html

The original target number and forced-rule wording conflict under these two
conventions. Deliver both independently computed modes and document the gap;
do not hardcode a target or silently weaken the official rule.
