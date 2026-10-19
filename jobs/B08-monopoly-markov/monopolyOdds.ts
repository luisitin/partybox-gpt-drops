/** US classic Monopoly: exact integer transition counts, numerical stationary odds. */
export type JailStrategy = 'leave ASAP' | 'stay max';
export const STATE_COUNT = 120;
export const TRANSITION_DENOMINATOR = 9216;
export const FIRST_JAIL_STATE = 117;

export type MovementState =
  | { readonly kind: 'free'; readonly position: number; readonly doubles: number }
  | { readonly kind: 'jailed'; readonly failedAttempts: number };

export interface TransitionModel {
  readonly strategy: JailStrategy;
  readonly denominator: number;
  readonly counts: readonly (readonly number[])[];
  /** Additional base-rent units due to next-railroad Chance cards. */
  readonly railroadBonusCounts: readonly (readonly number[])[];
  /** Utility entries due to the nearest-utility Chance card. */
  readonly utilityChanceCounts: readonly (readonly number[])[];
}

export interface StationaryResult {
  readonly stateProbabilities: readonly number[];
  readonly landing: readonly number[];
  readonly endTurnLanding: readonly number[];
  readonly turnStartMass: number;
  readonly rollsPerTurn: number;
  readonly iterations: number;
  readonly residual: number;
}

export interface Property {
  readonly position: number;
  readonly name: string;
  readonly kind: 'street' | 'railroad' | 'utility';
  readonly color?: string;
  readonly purchasePrice: number;
  readonly houseCost: number;
  readonly rents: readonly number[];
}

export interface InvestmentReturn {
  readonly scenario: string;
  /** Street levels 0..4 houses, 5 hotel; other property types have no buildings. */
  readonly houseLevel: number | null;
  readonly ownedInSet: number;
  readonly investment: number;
  readonly ordinaryRent: number;
  readonly expectedRentPerRoll: number;
  readonly expectedRentPerOpponentTurn: number;
  readonly rentROIPerRoll: number;
  readonly rentROIPerOpponentTurn: number;
  readonly breakEvenRolls: number;
  readonly breakEvenOpponentTurns: number;
}

export interface PropertyReturns {
  readonly property: Property;
  readonly landingProbability: number;
  readonly levels: readonly InvestmentReturn[];
}

export interface MonopolyOdds extends StationaryResult {
  readonly strategy: JailStrategy;
  readonly properties: readonly PropertyReturns[];
}

export const SQUARE_NAMES: readonly string[] = Object.freeze([
  'GO', 'Mediterranean Avenue', 'Community Chest (2)', 'Baltic Avenue', 'Income Tax',
  'Reading Railroad', 'Oriental Avenue', 'Chance (7)', 'Vermont Avenue', 'Connecticut Avenue',
  'Jail / Just Visiting', 'St. Charles Place', 'Electric Company', 'States Avenue', 'Virginia Avenue',
  'Pennsylvania Railroad', 'St. James Place', 'Community Chest (17)', 'Tennessee Avenue', 'New York Avenue',
  'Free Parking', 'Kentucky Avenue', 'Chance (22)', 'Indiana Avenue', 'Illinois Avenue',
  'B. & O. Railroad', 'Atlantic Avenue', 'Ventnor Avenue', 'Water Works', 'Marvin Gardens',
  'Go To Jail', 'Pacific Avenue', 'North Carolina Avenue', 'Community Chest (33)', 'Pennsylvania Avenue',
  'Short Line Railroad', 'Chance (36)', 'Park Place', 'Luxury Tax', 'Boardwalk',
]);

function validStrategy(strategy: JailStrategy): void {
  if (strategy !== 'leave ASAP' && strategy !== 'stay max') throw new RangeError('Unknown jail strategy');
}

export function freeState(position: number, doubles = 0): number {
  if (!Number.isInteger(position) || position < 0 || position >= 40 || position === 30
    || !Number.isInteger(doubles) || doubles < 0 || doubles > 2) {
    throw new RangeError('Invalid free state');
  }
  return 3 * (position < 30 ? position : position - 1) + doubles;
}

export function jailState(failedAttempts = 0): number {
  if (!Number.isInteger(failedAttempts) || failedAttempts < 0 || failedAttempts > 2) {
    throw new RangeError('Invalid jailed state');
  }
  return FIRST_JAIL_STATE + failedAttempts;
}

export function decodeState(state: number): MovementState {
  if (!Number.isInteger(state) || state < 0 || state >= STATE_COUNT) throw new RangeError('Invalid state');
  if (state >= FIRST_JAIL_STATE) return { kind: 'jailed', failedAttempts: state - FIRST_JAIL_STATE };
  const ordinal = Math.floor(state / 3);
  return { kind: 'free', position: ordinal < 30 ? ordinal : ordinal + 1, doubles: state % 3 };
}

export function squareOfState(state: number): number {
  const decoded = decodeState(state);
  return decoded.kind === 'jailed' ? 10 : decoded.position;
}

interface Arrival {
  readonly position: number;
  readonly jailed: boolean;
  readonly count: number;
  readonly railroadBonus: boolean;
  readonly utilityChance: boolean;
}

/** Integer units out of 256; the only nested draw is Chance 36 -> CC 33. */
function arrivals(position: number): readonly Arrival[] {
  const result: Arrival[] = [];
  const put = (at: number, count: number, jailed = false, railroadBonus = false, utilityChance = false): void => {
    result.push({ position: at, count, jailed, railroadBonus, utilityChance });
  };
  const resolve = (at: number, count: number): void => {
    if (at === 30) {
      put(10, count, true);
    } else if (at === 2 || at === 17 || at === 33) {
      const oneCard = count / 16;
      put(0, oneCard);
      put(10, oneCard, true);
      put(at, 14 * oneCard);
    } else if (at === 7 || at === 22 || at === 36) {
      const oneCard = count / 16;
      put(0, oneCard);
      put(10, oneCard, true);
      put(11, oneCard);
      put(24, oneCard);
      put(5, oneCard);
      put(39, oneCard);
      const railroad = at === 7 ? 15 : at === 22 ? 25 : 5;
      put(railroad, 2 * oneCard, false, true);
      const utility = at === 22 ? 28 : 12;
      put(utility, oneCard, false, false, true);
      resolve(at - 3, oneCard);
      put(at, 6 * oneCard);
    } else {
      put(at, count);
    }
  };
  resolve(position, 256);
  return result;
}

/** Exact chain probabilities are counts / 9216, with integer counts only. */
export function buildTransitions(strategy: JailStrategy): TransitionModel {
  validStrategy(strategy);
  const counts = Array.from({ length: STATE_COUNT }, () => Array<number>(STATE_COUNT).fill(0));
  const railroadBonusCounts = Array.from({ length: STATE_COUNT }, () => Array<number>(40).fill(0));
  const utilityChanceCounts = Array.from({ length: STATE_COUNT }, () => Array<number>(40).fill(0));
  const resolved = Array.from({ length: 40 }, (_, position) => arrivals(position));
  for (let state = 0; state < STATE_COUNT; state++) {
    const current = decodeState(state);
    for (let first = 1; first <= 6; first++) {
      for (let second = 1; second <= 6; second++) {
        const double = first === second;
        let position: number;
        let followingDoubles: number;
        if (current.kind === 'jailed' && strategy === 'stay max') {
          if (!double && current.failedAttempts < 2) {
            const destination = jailState(current.failedAttempts + 1);
            counts[state]![destination] = counts[state]![destination]! + 256;
            continue;
          }
          position = 10;
          followingDoubles = 0;
        } else {
          position = current.kind === 'free' ? current.position : 10;
          const streak = current.kind === 'free' ? current.doubles : 0;
          if (double && streak === 2) {
            counts[state]![FIRST_JAIL_STATE] = counts[state]![FIRST_JAIL_STATE]! + 256;
            continue;
          }
          followingDoubles = double ? streak + 1 : 0;
        }
        const moved = (position + first + second) % 40;
        for (const arrival of resolved[moved]!) {
          const destination = arrival.jailed ? FIRST_JAIL_STATE : freeState(arrival.position, followingDoubles);
          counts[state]![destination] = counts[state]![destination]! + arrival.count;
          if (arrival.railroadBonus) {
            railroadBonusCounts[state]![arrival.position] = railroadBonusCounts[state]![arrival.position]! + arrival.count;
          }
          if (arrival.utilityChance) {
            utilityChanceCounts[state]![arrival.position] = utilityChanceCounts[state]![arrival.position]! + arrival.count;
          }
        }
      }
    }
    const total = counts[state]!.reduce((sum, count) => sum + count, 0);
    if (total !== TRANSITION_DENOMINATOR) throw new Error('Transition row mass invariant');
  }
  return { strategy, denominator: TRANSITION_DENOMINATOR, counts, railroadBonusCounts, utilityChanceCounts };
}

interface TransitionEdge { readonly destination: number; readonly probability: number }
function sparseTransitions(model: TransitionModel): readonly (readonly TransitionEdge[])[] {
  if (model.counts.length !== STATE_COUNT || model.denominator !== TRANSITION_DENOMINATOR) {
    throw new RangeError('Invalid transition model');
  }
  return model.counts.map(row => {
    if (row.length !== STATE_COUNT || row.some(count => !Number.isSafeInteger(count) || count < 0)
      || row.reduce((sum, count) => sum + count, 0) !== model.denominator) {
      throw new RangeError('Invalid transition row');
    }
    return row.flatMap((count, destination) => count === 0 ? [] : [{ destination, probability: count / model.denominator }]);
  });
}

function advance(probabilities: readonly number[], rows: readonly (readonly TransitionEdge[])[]): number[] {
  const next = Array<number>(STATE_COUNT).fill(0);
  for (let from = 0; from < STATE_COUNT; from++) {
    const mass = probabilities[from]!;
    if (mass === 0) continue;
    for (const edge of rows[from]!) next[edge.destination] = next[edge.destination]! + mass * edge.probability;
  }
  return next;
}

/** Power iteration, kept separate from the independently authored linear solver. */
export function stationary(model: TransitionModel, tolerance = 1e-15, maxIterations = 100000): StationaryResult {
  if (!(tolerance > 0) || !Number.isFinite(tolerance) || !Number.isSafeInteger(maxIterations) || maxIterations < 1) {
    throw new RangeError('Invalid solver controls');
  }
  const rows = sparseTransitions(model);
  let probabilities = Array<number>(STATE_COUNT).fill(0);
  probabilities[freeState(0)] = 1;
  let iterations = 0;
  let converged = false;
  for (iterations = 1; iterations <= maxIterations; iterations++) {
    const next = advance(probabilities, rows);
    const sum = next.reduce((total, p) => total + p, 0);
    for (let state = 0; state < STATE_COUNT; state++) next[state] = next[state]! / sum;
    let distance = 0;
    for (let state = 0; state < STATE_COUNT; state++) distance += Math.abs(next[state]! - probabilities[state]!);
    probabilities = next;
    if (distance <= tolerance) { converged = true; break; }
  }
  if (!converged) throw new Error('Stationary iteration did not converge');
  const moved = advance(probabilities, rows);
  let residual = 0;
  for (let state = 0; state < STATE_COUNT; state++) residual = Math.max(residual, Math.abs(moved[state]! - probabilities[state]!));
  const landing = Array<number>(40).fill(0);
  const endTurnLanding = Array<number>(40).fill(0);
  let turnStartMass = 0;
  for (let state = 0; state < STATE_COUNT; state++) {
    const decoded = decodeState(state);
    const square = decoded.kind === 'jailed' ? 10 : decoded.position;
    landing[square] = landing[square]! + probabilities[state]!;
    if (decoded.kind === 'jailed' || decoded.doubles === 0) {
      endTurnLanding[square] = endTurnLanding[square]! + probabilities[state]!;
      turnStartMass += probabilities[state]!;
    }
  }
  for (let square = 0; square < 40; square++) endTurnLanding[square] = endTurnLanding[square]! / turnStartMass;
  return { stateProbabilities: probabilities, landing, endTurnLanding, turnStartMass,
    rollsPerTurn: 1 / turnStartMass, iterations, residual };
}

type StreetData = readonly [number, string, string, number, number, readonly number[]];
const streets: readonly StreetData[] = [
  [1, 'Mediterranean Avenue', 'brown', 60, 50, [2, 10, 30, 90, 160, 250]],
  [3, 'Baltic Avenue', 'brown', 60, 50, [4, 20, 60, 180, 320, 450]],
  [6, 'Oriental Avenue', 'light blue', 100, 50, [6, 30, 90, 270, 400, 550]],
  [8, 'Vermont Avenue', 'light blue', 100, 50, [6, 30, 90, 270, 400, 550]],
  [9, 'Connecticut Avenue', 'light blue', 120, 50, [8, 40, 100, 300, 450, 600]],
  [11, 'St. Charles Place', 'pink', 140, 100, [10, 50, 150, 450, 625, 750]],
  [13, 'States Avenue', 'pink', 140, 100, [10, 50, 150, 450, 625, 750]],
  [14, 'Virginia Avenue', 'pink', 160, 100, [12, 60, 180, 500, 700, 900]],
  [16, 'St. James Place', 'orange', 180, 100, [14, 70, 200, 550, 750, 950]],
  [18, 'Tennessee Avenue', 'orange', 180, 100, [14, 70, 200, 550, 750, 950]],
  [19, 'New York Avenue', 'orange', 200, 100, [16, 80, 220, 600, 800, 1000]],
  [21, 'Kentucky Avenue', 'red', 220, 150, [18, 90, 250, 700, 875, 1050]],
  [23, 'Indiana Avenue', 'red', 220, 150, [18, 90, 250, 700, 875, 1050]],
  [24, 'Illinois Avenue', 'red', 240, 150, [20, 100, 300, 750, 925, 1100]],
  [26, 'Atlantic Avenue', 'yellow', 260, 150, [22, 110, 330, 800, 975, 1150]],
  [27, 'Ventnor Avenue', 'yellow', 260, 150, [22, 110, 330, 800, 975, 1150]],
  [29, 'Marvin Gardens', 'yellow', 280, 150, [24, 120, 360, 850, 1025, 1200]],
  [31, 'Pacific Avenue', 'green', 300, 200, [26, 130, 390, 900, 1100, 1275]],
  [32, 'North Carolina Avenue', 'green', 300, 200, [26, 130, 390, 900, 1100, 1275]],
  [34, 'Pennsylvania Avenue', 'green', 320, 200, [28, 150, 450, 1000, 1200, 1400]],
  [37, 'Park Place', 'dark blue', 350, 200, [35, 175, 500, 1100, 1300, 1500]],
  [39, 'Boardwalk', 'dark blue', 400, 200, [50, 200, 600, 1400, 1700, 2000]],
];

/** US rent table is sourced and cross-checked in SOURCES.md. */
export const PROPERTIES: readonly Property[] = Object.freeze([
  ...streets.map(([position, name, color, purchasePrice, houseCost, rents]) =>
    Object.freeze({ position, name, color, purchasePrice, houseCost, rents: Object.freeze(rents.slice()), kind: 'street' as const })),
  ...[5, 15, 25, 35].map(position => Object.freeze({ position, name: SQUARE_NAMES[position]!,
    kind: 'railroad' as const, purchasePrice: 200, houseCost: 0, rents: Object.freeze([25, 50, 100, 200]) })),
  ...[12, 28].map(position => Object.freeze({ position, name: SQUARE_NAMES[position]!,
    kind: 'utility' as const, purchasePrice: 150, houseCost: 0, rents: Object.freeze([4, 10]) })),
].sort((a, b) => a.position - b.position));

function eventFrequency(model: TransitionModel, stateProbabilities: readonly number[],
  counts: readonly (readonly number[])[], position: number): number {
  let total = 0;
  for (let state = 0; state < STATE_COUNT; state++) total += stateProbabilities[state]! * counts[state]![position]!;
  return total / model.denominator;
}

/** Per-property attribution; prerequisite ownership costs are not reattributed. */
export function rentReturns(model: TransitionModel, result: StationaryResult): readonly PropertyReturns[] {
  return PROPERTIES.map(property => {
    const probability = result.landing[property.position]!;
    const railroadBonus = property.kind === 'railroad'
      ? eventFrequency(model, result.stateProbabilities, model.railroadBonusCounts, property.position) : 0;
    const utilityChance = property.kind === 'utility'
      ? eventFrequency(model, result.stateProbabilities, model.utilityChanceCounts, property.position) : 0;
    const levels: InvestmentReturn[] = [];
    const add = (scenario: string, houseLevel: number | null, ownedInSet: number,
      ordinaryRent: number, expectedRentPerRoll: number): void => {
      const investment = property.purchasePrice + (houseLevel ?? 0) * property.houseCost;
      const expectedRentPerOpponentTurn = expectedRentPerRoll / result.turnStartMass;
      levels.push({ scenario, houseLevel, ownedInSet, investment, ordinaryRent,
        expectedRentPerRoll, expectedRentPerOpponentTurn,
        rentROIPerRoll: expectedRentPerRoll / investment,
        rentROIPerOpponentTurn: expectedRentPerOpponentTurn / investment,
        breakEvenRolls: investment / expectedRentPerRoll,
        breakEvenOpponentTurns: investment / expectedRentPerOpponentTurn });
    };
    if (property.kind === 'street') {
      const groupSize = PROPERTIES.filter(p => p.kind === 'street' && p.color === property.color).length;
      add('unimproved without color set', 0, 1, property.rents[0]!, probability * property.rents[0]!);
      for (let houses = 0; houses <= 5; houses++) {
        const rent = houses === 0 ? 2 * property.rents[0]! : property.rents[houses]!;
        add(houses === 5 ? 'hotel with color set' : 'complete color set', houses, groupSize, rent, probability * rent);
      }
    } else if (property.kind === 'railroad') {
      for (let owned = 1; owned <= 4; owned++) {
        const rent = property.rents[owned - 1]!;
        add(`${owned} railroad${owned === 1 ? '' : 's'} owned`, null, owned, rent, (probability + railroadBonus) * rent);
      }
    } else {
      for (let owned = 1; owned <= 2; owned++) {
        // Hasbro's cited 2021 US rulebook directs a fresh rent roll. Its mean
        // is seven; nearest-utility Chance always uses the ten-times rule.
        const ordinaryRent = 7 * property.rents[owned - 1]!;
        const extra = owned === 1 ? 42 * utilityChance : 0;
        add(`${owned} utilit${owned === 1 ? 'y' : 'ies'} owned`, null, owned, ordinaryRent, probability * ordinaryRent + extra);
      }
    }
    return { property, landingProbability: probability, levels };
  });
}

export function monopolyOdds(strategy: JailStrategy = 'leave ASAP'): MonopolyOdds {
  const model = buildTransitions(strategy);
  const result = stationary(model);
  return { strategy, ...result, properties: rentReturns(model, result) };
}

export function allMonopolyOdds(): ReadonlyMap<JailStrategy, MonopolyOdds> {
  return new Map<JailStrategy, MonopolyOdds>([
    ['leave ASAP', monopolyOdds('leave ASAP')],
    ['stay max', monopolyOdds('stay max')],
  ]);
}
