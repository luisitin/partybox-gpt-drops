/** B01 odds oracle authored from the public contract before production access. */
export interface Model {
  id: string;
  blocks: readonly (readonly number[])[];
  bonusDice: number;
  bonusRegular: number;
  bonusSevens: number;
  payday: boolean;
  offset: number;
  coinKnown: boolean;
  facts: readonly string[];
  confidence: string;
}
export interface Outcome { movement: number; coins: number | null }
export interface Joint extends Outcome { ways: string; probability: string }
export interface Distribution {
  id: string;
  sampleSpace: string;
  confidence: string;
  facts: readonly string[];
  movement: Record<string, string>;
  coins: Record<string, string> | null;
  joint: Joint[];
  meanMovement: string;
  meanCoins: string | null;
}

function requireCondition(condition: boolean, message: string): asserts condition {
  if (!condition) throw new RangeError(message);
}

export function validateModel(model: Model): void {
  requireCondition(Array.isArray(model.blocks) && model.blocks.length >= 1 && model.blocks.length <= 5,
    'one to five blocks required');
  for (const faces of model.blocks) {
    requireCondition(Array.isArray(faces) && faces.length >= 1 && faces.length <= 10,
      'one to ten faces required');
    requireCondition(faces.every(face => Number.isInteger(face) && face >= 1 && face <= 10),
      'face values must be integers one through ten');
    requireCondition(new Set(faces).size === faces.length, 'face values must be distinct');
  }
  requireCondition(Number.isInteger(model.offset) && model.offset >= 0 && model.offset <= 5,
    'offset must be an integer zero through five');
  requireCondition(Number.isInteger(model.bonusDice) && model.bonusDice >= 0 &&
    model.bonusDice <= model.blocks.length && model.bonusDice !== 1, 'invalid bonus prefix');
  requireCondition(Number.isSafeInteger(model.bonusRegular) && model.bonusRegular >= 0 &&
    Number.isSafeInteger(model.bonusSevens) && model.bonusSevens >= 0, 'invalid coin bonus');
  requireCondition(typeof model.payday === 'boolean' && typeof model.coinKnown === 'boolean',
    'boolean payday and coinKnown required');
}

export function fraction(numerator: bigint, denominator: bigint): string {
  requireCondition(denominator !== 0n, 'zero denominator');
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  if (numerator === 0n) return '0/1';
  let a = numerator < 0n ? -numerator : numerator;
  let b = denominator;
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return `${numerator / a}/${denominator / a}`;
}

export function addFractions(left: string, right: string): string {
  const [ln, ld] = left.split('/').map(BigInt);
  const [rn, rd] = right.split('/').map(BigInt);
  requireCondition(ln !== undefined && ld !== undefined && rn !== undefined && rd !== undefined,
    'fractions require numerator and denominator');
  return fraction(ln * rd + rn * ld, ld * rd);
}

function evaluateValidated(model: Model, roll: readonly number[]): Outcome {
  let raw = 0;
  for (const face of roll) raw += face;
  let bonus = 0;
  if (model.bonusDice >= 2) {
    let equal = true;
    for (let i = 1; i < model.bonusDice; i++) if (roll[i] !== roll[0]) equal = false;
    if (equal) bonus = roll[0] === 7 ? model.bonusSevens : model.bonusRegular;
  }
  return { movement: raw + model.offset,
    coins: model.coinKnown ? bonus + (model.payday ? raw : 0) : null };
}

export function evaluateRoll(model: Model, roll: readonly number[]): Outcome {
  validateModel(model);
  requireCondition(Array.isArray(roll) && roll.length === model.blocks.length, 'wrong roll length');
  for (let i = 0; i < roll.length; i++)
    requireCondition(model.blocks[i]!.includes(roll[i]!), 'roll face outside its block');
  return evaluateValidated(model, roll);
}

export function enumerate(model: Model): Distribution {
  validateModel(model);
  const radix = model.blocks.map(faces => faces.length);
  const count = radix.reduce((product, length) => product * length, 1);
  const movementCounts = new Map<number, bigint>();
  const coinCounts = new Map<number, bigint>();
  const jointCounts = new Map<string, { outcome: Outcome; ways: bigint }>();
  let movementSum = 0n;
  let coinSum = 0n;
  // Decode every ordered face-index tuple from its mixed-radix integer ordinal.
  for (let ordinal = 0; ordinal < count; ordinal++) {
    let remainder = ordinal;
    const roll: number[] = [];
    for (let block = 0; block < radix.length; block++) {
      const index = remainder % radix[block]!;
      remainder = Math.floor(remainder / radix[block]!);
      roll.push(model.blocks[block]![index]!);
    }
    const outcome = evaluateValidated(model, roll);
    movementCounts.set(outcome.movement, (movementCounts.get(outcome.movement) ?? 0n) + 1n);
    movementSum += BigInt(outcome.movement);
    if (outcome.coins !== null) {
      coinCounts.set(outcome.coins, (coinCounts.get(outcome.coins) ?? 0n) + 1n);
      coinSum += BigInt(outcome.coins);
    }
    const key = `${outcome.movement}:${outcome.coins ?? 'unknown'}`;
    const entry = jointCounts.get(key);
    if (entry) entry.ways++;
    else jointCounts.set(key, { outcome, ways: 1n });
  }
  const total = BigInt(count);
  const probabilities = (counts: Map<number, bigint>): Record<string, string> =>
    Object.fromEntries([...counts].sort((a, b) => a[0] - b[0])
      .map(([outcome, ways]) => [String(outcome), fraction(ways, total)]));
  const joint = [...jointCounts.values()]
    .sort((a, b) => a.outcome.movement - b.outcome.movement ||
      (a.outcome.coins ?? -1) - (b.outcome.coins ?? -1))
    .map(({ outcome, ways }) => ({ ...outcome, ways: String(ways), probability: fraction(ways, total) }));
  return { id: model.id, sampleSpace: String(total), confidence: model.confidence, facts: [...model.facts],
    movement: probabilities(movementCounts), coins: model.coinKnown ? probabilities(coinCounts) : null,
    joint, meanMovement: fraction(movementSum, total),
    meanCoins: model.coinKnown ? fraction(coinSum, total) : null };
}
