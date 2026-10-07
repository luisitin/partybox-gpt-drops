/** Implementation A: recursive Cartesian enumeration; integer counts and bigint fractions. */
export interface Model {
  readonly id: string; readonly blocks: readonly (readonly number[])[];
  readonly bonusDice: number; readonly bonusRegular: number; readonly bonusSevens: number;
  readonly payday: boolean; readonly offset: number; readonly coinKnown: boolean;
  readonly facts: readonly string[]; readonly confidence: string;
}
export interface Outcome { readonly movement: number; readonly coins: number | null }
export interface Joint extends Outcome { readonly ways: string; readonly probability: string }
export interface Distribution {
  readonly id: string; readonly sampleSpace: string; readonly confidence: string;
  readonly facts: readonly string[]; readonly movement: Readonly<Record<string, string>>;
  readonly coins: Readonly<Record<string, string>> | null; readonly joint: readonly Joint[];
  readonly meanMovement: string; readonly meanCoins: string | null;
}
export function fraction(numerator: bigint, denominator: bigint): string {
  if (denominator === 0n) throw new RangeError('Zero denominator');
  let n = numerator, d = denominator;
  if (d < 0n) { n = -n; d = -d; }
  let a = n < 0n ? -n : n, b = d;
  while (b !== 0n) { const t = a % b; a = b; b = t; }
  return `${n / a}/${d / a}`;
}
function validateModel(model: Model): void {
  if (model.blocks.length < 1 || model.blocks.length > 5) throw new RangeError('Block count');
  for (const block of model.blocks) {
    if (block.length < 1 || block.length > 10 || new Set(block).size !== block.length)
      throw new RangeError('Face count or duplicate');
    for (const face of block)
      if (!Number.isInteger(face) || face < 1 || face > 10) throw new RangeError('Face');
  }
  if (!Number.isInteger(model.offset) || model.offset < 0 || model.offset > 5)
    throw new RangeError('Offset');
  if (!Number.isInteger(model.bonusDice) || model.bonusDice < 0 ||
      model.bonusDice > model.blocks.length || model.bonusDice === 1)
    throw new RangeError('Bonus dice count');
}
export function evaluateRoll(model: Model, roll: readonly number[]): Outcome {
  if (roll.length !== model.blocks.length) throw new RangeError('Roll length');
  for (let i = 0; i < roll.length; ++i) {
    const value = roll[i];
    if (value === undefined || !model.blocks[i]?.includes(value)) throw new RangeError('Invalid face');
  }
  const sum = roll.reduce((a, b) => a + b, 0);
  const movement = sum + model.offset;
  let bonus = 0;
  if (model.bonusDice >= 2 && roll.slice(0, model.bonusDice).every(v => v === roll[0]))
    bonus = roll[0] === 7 ? model.bonusSevens : model.bonusRegular;
  const coins = model.coinKnown ? (model.payday ? sum : 0) + bonus : null;
  return { movement, coins };
}
export function enumerate(model: Model): Distribution {
  validateModel(model);
  const counts = new Map<string, { movement: number; coins: number | null; ways: bigint }>();
  const roll: number[] = [];
  const visit = (index: number): void => {
    if (index === model.blocks.length) {
      const out = evaluateRoll(model, roll);
      const key = `${out.movement}:${out.coins ?? '?'}`;
      const previous = counts.get(key);
      counts.set(key, { ...out, ways: (previous?.ways ?? 0n) + 1n });
      return;
    }
    const block = model.blocks[index];
    if (block === undefined) throw new Error('Missing block');
    for (const value of block) { roll.push(value); visit(index + 1); roll.pop(); }
  };
  visit(0);
  const total = model.blocks.reduce((n, b) => n * BigInt(b.length), 1n);
  const rows = [...counts.values()].sort((a, b) => a.movement - b.movement || (a.coins ?? -1) - (b.coins ?? -1));
  const movements = new Map<number, bigint>(), rewards = new Map<number, bigint>();
  let movementSum = 0n, coinSum = 0n;
  for (const row of rows) {
    movements.set(row.movement, (movements.get(row.movement) ?? 0n) + row.ways);
    movementSum += BigInt(row.movement) * row.ways;
    if (row.coins !== null) {
      rewards.set(row.coins, (rewards.get(row.coins) ?? 0n) + row.ways);
      coinSum += BigInt(row.coins) * row.ways;
    }
  }
  const marginal = (map: Map<number, bigint>): Record<string, string> =>
    Object.fromEntries([...map].sort((a, b) => a[0] - b[0]).map(([key, n]) => [String(key), fraction(n, total)]));
  return {
    id: model.id, sampleSpace: total.toString(), confidence: model.confidence, facts: [...model.facts],
    movement: marginal(movements), coins: model.coinKnown ? marginal(rewards) : null,
    joint: rows.map(row => ({ movement: row.movement, coins: row.coins, ways: row.ways.toString(), probability: fraction(row.ways, total) })),
    meanMovement: fraction(movementSum, total), meanCoins: model.coinKnown ? fraction(coinSum, total) : null
  };
}
