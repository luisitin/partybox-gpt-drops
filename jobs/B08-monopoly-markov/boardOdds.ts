/**
 * Board odds for PartyBox's classic 40-square board: the PartyBox-facing entry point of B08.
 *
 * Pure, total and dependency-free (no imports, no clocks, no randomness, no module state), so it can be
 * copied into `games/monopoly/server/` unchanged. Every table is indexed by board position 0..39 and
 * carries no names: names, prices and rents come from the game's own edition data. The functions take
 * PartyBox's `Edition['spaces'][number]` and `Edition['rules']` shapes as they are.
 *
 * The tables are the exact long-run results of `monopolyOdds.ts`, written by `partybox-export.mjs`;
 * `npm test` checks them bit for bit. Model: two fair dice, third doubles to jail, independent draws
 * from 16-card decks (10 Chance and 2 Community Chest movers), up to three jail attempts.
 * It does not describe the Speed Die or the one-attempt jail of the "newer" short-game preset.
 */

/** 'leave ASAP' pays (or uses a card) at once; 'stay max' tries for doubles up to three times. */
export type JailPlan = 'leave ASAP' | 'stay max';
export const JAIL_PLANS: readonly JailPlan[] = ['leave ASAP', 'stay max'];

/** Long-run odds for one jail plan. Every array has 40 entries, one per board position. */
export interface PlanOdds {
  /** Mean movement rolls in a turn: doubles roll again, and a failed jail attempt counts as a roll. */
  readonly rollsPerTurn: number;
  /** Chance that a movement roll ends on each square, after cards and Go To Jail (10 = jail + visiting). */
  readonly perRoll: readonly number[];
  /** Chance that a turn ends on each square. */
  readonly perTurn: readonly number[];
  /** Per roll: arrivals by the two "nearest railroad" Chance cards, which pay double rent. */
  readonly railroadCard: readonly number[];
  /** Per roll: arrivals by the "nearest utility" Chance card. */
  readonly utilityCard: readonly number[];
  /** Per roll: the movement-dice total summed over ordinary (dice) arrivals at each utility. */
  readonly utilityDice: readonly number[];
  /** Per roll: the movement-dice total summed over "nearest utility" card arrivals. */
  readonly utilityCardDice: readonly number[];
}

/** The deed facts the odds need. PartyBox's `Edition['spaces'][number]` satisfies it. */
export interface DeedFacts {
  /** 'street' | 'railroad' | 'utility'; any other kind earns no rent. */
  readonly kind: string;
  readonly price: number;
  readonly buildingCost: number;
  /** Streets: base rent, one to four houses, hotel. */
  readonly rents: readonly number[];
}

/** The rent rules the odds need. PartyBox's `Edition['rules']` satisfies it. */
export interface RentRules {
  readonly railroadRents: readonly number[];
  readonly utilityMultipliers: readonly number[];
  readonly monopolyRentMultiplier: number;
}

/** What the owner holds around one deed. */
export interface Holding {
  /** Buildings on this street: 0-4 houses, 5 = hotel. Ignored for railroads and utilities. */
  readonly level: number;
  /** The owner holds the street's whole colour group (doubles unimproved rent, allows building). */
  readonly fullGroup: boolean;
  /** Railroads or utilities the owner holds, this one included. Ignored for streets. */
  readonly sameKind: number;
}

export interface OddsOptions {
  /** Default 'leave ASAP'. */
  readonly plan?: JailPlan;
  /**
   * Utility rent dice. 'movement' (default, PartyBox's engine today): the dice that moved the piece.
   * 'fresh': a new throw, mean 7 (the 2021 US rulebook and the card's own text; B08's roi.csv).
   */
  readonly utilityDice?: 'movement' | 'fresh';
}

export interface HotSquare {
  readonly square: number;
  readonly chance: number;
}

const SQUARES = 40;
const MEAN_DICE = 7;

function planOdds(plan: unknown): PlanOdds | null {
  return plan === 'leave ASAP' || plan === 'stay max' ? BOARD_ODDS[plan] : null;
}

function at(values: readonly number[], index: number): number {
  const value = values[index];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function validSquare(position: number): boolean {
  return Number.isInteger(position) && position >= 0 && position < SQUARES;
}

/** The rent one arrival is worth when ordinary dice bring the piece, or 0 when it earns nothing. */
function streetRent(deed: DeedFacts, holding: Holding, rules: RentRules): number {
  const level = holding.level;
  if (!Number.isInteger(level) || level < 0 || level > 5) return 0;
  if (level > 0 && !holding.fullGroup) return 0;
  const base = at(deed.rents, level);
  return level === 0 && holding.fullGroup ? base * rules.monopolyRentMultiplier : base;
}

function rentPerRoll(
  position: number,
  deed: DeedFacts,
  holding: Holding,
  rules: RentRules,
  options: OddsOptions,
): number {
  const odds = planOdds(options.plan ?? 'leave ASAP');
  if (!odds || !validSquare(position)) return 0;
  if (deed.kind === 'street') return at(odds.perRoll, position) * streetRent(deed, holding, rules);
  const owned = holding.sameKind;
  if (!Number.isInteger(owned) || owned < 1) return 0;
  if (deed.kind === 'railroad') {
    const rent = at(rules.railroadRents, owned - 1);
    return rent * (at(odds.perRoll, position) + at(odds.railroadCard, position));
  }
  if (deed.kind !== 'utility') return 0;
  const multiplier = at(rules.utilityMultipliers, owned - 1);
  if (multiplier === 0) return 0;
  // The nearest-utility card always charges the top multiplier (PartyBox's rent(): `utility || n === 2`).
  const cardMultiplier = at(rules.utilityMultipliers, 1);
  const card = at(odds.utilityCard, position);
  if (options.utilityDice === 'fresh')
    return (
      MEAN_DICE * multiplier * (at(odds.perRoll, position) - card) +
      MEAN_DICE * cardMultiplier * card
    );
  return (
    multiplier * at(odds.utilityDice, position) +
    cardMultiplier * at(odds.utilityCardDice, position)
  );
}

/**
 * Expected rent one opponent pays this deed per turn they take, in the edition's money.
 * Multiply by the number of opponents for income per round. Invalid input gives 0, never a throw.
 */
export function rentPerOpponentTurn(
  position: number,
  deed: DeedFacts,
  holding: Holding,
  rules: RentRules,
  options: OddsOptions = {},
): number {
  const odds = planOdds(options.plan ?? 'leave ASAP');
  const value = odds ? rentPerRoll(position, deed, holding, rules, options) * odds.rollsPerTurn : 0;
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Money sunk into this deed at this holding: the price plus every building (a hotel is five). */
export function investmentOf(deed: DeedFacts, holding: Holding): number {
  const level =
    deed.kind === 'street' && Number.isInteger(holding.level) ? Math.max(0, holding.level) : 0;
  const value = deed.price + Math.min(level, 5) * deed.buildingCost;
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Rent per opponent turn per unit invested (B08's `rentROIPerOpponentTurn`); 0 when undefined. */
export function rentReturn(
  position: number,
  deed: DeedFacts,
  holding: Holding,
  rules: RentRules,
  options: OddsOptions = {},
): number {
  const investment = investmentOf(deed, holding);
  return investment > 0
    ? rentPerOpponentTurn(position, deed, holding, rules, options) / investment
    : 0;
}

/**
 * Rent per opponent turn gained per unit of building cost when this street goes from its level up to
 * `target` (default: the next building; 5 = hotel). 0 when it cannot (not a street, group incomplete,
 * target not above the level). On the classic board the step to three houses earns the most per unit
 * of cost on 20 of the 22 streets (the two cheapest peak later), so a bot that ranks its build options
 * by `buildGain(..., Math.max(3, level + 1))` takes groups to three houses first.
 */
export function buildGain(
  position: number,
  deed: DeedFacts,
  holding: Holding,
  rules: RentRules,
  target: number = holding.level + 1,
  options: OddsOptions = {},
): number {
  if (deed.kind !== 'street' || !holding.fullGroup || !(deed.buildingCost > 0)) return 0;
  const level = holding.level;
  if (!Number.isInteger(level) || !Number.isInteger(target)) return 0;
  if (level < 0 || target <= level || target > 5) return 0;
  const now = rentPerOpponentTurn(position, deed, holding, rules, options);
  const then = rentPerOpponentTurn(position, deed, { ...holding, level: target }, rules, options);
  const gain = (then - now) / ((target - level) * deed.buildingCost);
  return Number.isFinite(gain) && gain > 0 ? gain : 0;
}

/** The squares moves most often end on, hottest first (ties by position): the TV's stats moment. */
export function hottestSquares(
  count: number,
  plan: JailPlan = 'leave ASAP',
  per: 'roll' | 'turn' = 'roll',
): readonly HotSquare[] {
  const odds = planOdds(plan);
  if (!odds || !Number.isFinite(count) || count < 1) return [];
  const values = per === 'turn' ? odds.perTurn : odds.perRoll;
  const squares: HotSquare[] = [];
  for (let square = 0; square < SQUARES; square++)
    squares.push({ square, chance: at(values, square) });
  squares.sort((a, b) => b.chance - a.chance || a.square - b.square);
  return squares.slice(0, Math.min(SQUARES, Math.floor(count)));
}

/** The combined chance for a set of squares (a colour group, the railroads): duplicates count once. */
export function shareOf(
  squares: readonly number[],
  plan: JailPlan = 'leave ASAP',
  per: 'roll' | 'turn' = 'roll',
): number {
  const odds = planOdds(plan);
  if (!odds) return 0;
  const values = per === 'turn' ? odds.perTurn : odds.perRoll;
  let total = 0;
  for (let square = 0; square < SQUARES; square++)
    if (squares.includes(square)) total += at(values, square);
  return total;
}

// BEGIN GENERATED BOARD_ODDS (partybox-export.mjs; npm test checks it bit for bit)
export const BOARD_ODDS: Readonly<Record<JailPlan, PlanOdds>> = {
  'leave ASAP': {
    rollsPerTurn: 1.186623958525926,
    perRoll: [
      0.030961230334104268, 0.021313773374645625, 0.018848800052371745, 0.02162402189535374,
      0.023285230189612423, 0.029631032008512328, 0.02262139678893012, 0.008650478139361513,
      0.02320960171215176, 0.023003350088667763, 0.062195146819755215, 0.027016578177709857,
      0.026040375217150972, 0.02372090292590736, 0.0246488842550867, 0.02919969335250791,
      0.027924168535581554, 0.02594464843407427, 0.029355854595096882, 0.030851688778357925,
      0.02883601285165896, 0.028358431390015208, 0.01048032937331525, 0.027356858038021868,
      0.0318576628665498, 0.030659047386530067, 0.027072038246359585, 0.026788576944276343,
      0.028074183829090747, 0.025860488874876554, 0, 0.026773704752817384, 0.026251730101095373,
      0.0236605488084604, 0.025006280074660565, 0.024326379827060273, 0.008668733545006057,
      0.021863976221719438, 0.021798527663545588, 0.026259633530000846,
    ],
    perTurn: [
      0.03135795872241765, 0.02052001343938027, 0.019177431019301614, 0.021038161859139395,
      0.02308565411074898, 0.029179283428997973, 0.0226857351758316, 0.00852310264979409,
      0.023462684248905855, 0.023154033066926438, 0.06925388491250473, 0.026903674343520662,
      0.024454996735733866, 0.023936063847446256, 0.023534917666226413, 0.029773624901201255,
      0.027237460913883585, 0.02680920054401775, 0.02878736156944229, 0.03177217046810351,
      0.02795429502542895, 0.028494082102396696, 0.0100205643124911, 0.027128837340166145,
      0.03208656508967788, 0.03022829192382529, 0.027193861928389337, 0.026216741342798392,
      0.027903863503548634, 0.02519582036983199, 0, 0.026288120399723492, 0.027088043922145987,
      0.02315710583489172, 0.02568945104143521, 0.02368019551194271, 0.008615329044630497,
      0.02086135411187377, 0.02215440580055457, 0.02539565777072338,
    ],
    railroadCard: [
      0, 0, 0, 0, 0, 0.0028895778483353507, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002883492713120509, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0.0034934431244384146, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityCard: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0028865352807279296, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0.0017467215622192073, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityDice: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1592467691167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0.18607181853290586, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityCardDice: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.020453304575140895, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0.012353935119755084, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  'stay max': {
    rollsPerTurn: 1.165896364009171,
    perRoll: [
      0.02918262494561797, 0.020100287633106402, 0.01777507663008745, 0.0203976443525019,
      0.021965935085617925, 0.0280496003556905, 0.02134574265848863, 0.008163625941513446,
      0.021903430392911448, 0.021711771211689643, 0.11527745312425577, 0.025595521243550332,
      0.026154825106106103, 0.02176000258759027, 0.024252704185338977, 0.02636572803883625,
      0.026789186650523482, 0.022951308644971823, 0.02819684076886212, 0.02811562219246808,
      0.028247973397189527, 0.026142143168788004, 0.010449534808390299, 0.02567279322009348,
      0.029954920405779073, 0.028928474098033164, 0.025400841080186986, 0.02519201375861856,
      0.02654752202094439, 0.02438722406332153, 0, 0.025249150999753965, 0.024769213909871777,
      0.022291895161098536, 0.02357635905289837, 0.02292474618103958, 0.008174454393005057,
      0.020616191594829796, 0.020558414364580186, 0.02486120257184875,
    ],
    perTurn: [
      0.02910202689196477, 0.01900886845897071, 0.017769476241323745, 0.019495064650000657,
      0.021398611230633607, 0.027220461780091264, 0.021036045691269756, 0.007901184022890253,
      0.021758482682716258, 0.02146759624068707, 0.13018664547134, 0.025121657818208208,
      0.025725936913871483, 0.02145855398541293, 0.024134399499446502, 0.026232234102616474,
      0.026887614578683307, 0.02311642351577694, 0.028374431080744528, 0.0284649717054312,
      0.028214956694136113, 0.025834186633285468, 0.01033746829358947, 0.025143147527849522,
      0.029513693212871367, 0.0283188494486676, 0.024917837715058365, 0.0243491244627789,
      0.02591071527784451, 0.023449158175010726, 0, 0.02441242544476507, 0.02505077205453139,
      0.021451174941961346, 0.023770102594597206, 0.02192561923653156, 0.007979819052922553,
      0.01932585479996333, 0.020525266101218888, 0.023709141770337023,
    ],
    railroadCard: [
      0, 0, 0, 0, 0, 0.0027248181310016825, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002721208647171151, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0.0034831782694634333, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityCard: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0027230133890864157, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0.0017415891347317167, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityDice: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.15347815773058876, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0.17507942644077934, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    utilityCardDice: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.019293384675544915, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0.012841359306279266, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
};
// END GENERATED BOARD_ODDS
