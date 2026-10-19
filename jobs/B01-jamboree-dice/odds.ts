/** Pure, immutable lookup only. No random generator, I/O, or on-demand probability calculation.
 * Fractions are reduced strings. Together Dice coin results are unknown, not zero.
 * See the confidence and facts fields; mathematical correctness is conditional on the model.
 */
import raw from './odds.json';
import type { Distribution } from './engine-a.js';
export type { Distribution, Joint, Outcome } from './engine-a.js';
type DeepReadonly<T> = T extends readonly (infer U)[] ? readonly DeepReadonly<U>[] :
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
function freeze<T>(value: T): DeepReadonly<T> {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value as DeepReadonly<T>;
}
// JSON is validated by schema plus exact enumeration in npm test before publication.
const table: readonly Distribution[] = freeze(raw.distributions);
const characters = freeze(raw.characterAliases);
export function getOdds(id: string): DeepReadonly<Distribution> {
  const result = table.find(row => row.id === id);
  if (result === undefined) throw new RangeError(`Unknown distribution: ${id}`);
  return result;
}
export function getCharacterOdds(characterId: string, diceCount: 1 | 2 | 3 = 1): DeepReadonly<Distribution> {
  if (diceCount !== 1 && diceCount !== 2 && diceCount !== 3) throw new RangeError('diceCount must be 1, 2 or 3');
  const character = characters.find(row => row.id === characterId);
  if (character === undefined) throw new RangeError(`Unknown character: ${characterId}`);
  return getOdds(diceCount === 1 ? character.single : diceCount === 2 ? character.double : character.triple);
}
export function getCustomOdds(choice: number): DeepReadonly<Distribution> {
  if (!Number.isInteger(choice) || choice < 1 || choice > 10) throw new RangeError('Choice must be an integer from 1 to 10');
  return getOdds(`custom-${choice}`);
}
export function movementProbability(id: string, movement: number): string {
  if (!Number.isSafeInteger(movement)) throw new RangeError('Movement must be a safe integer');
  const distribution = getOdds(id);
  return Object.prototype.hasOwnProperty.call(distribution.movement, String(movement)) ? distribution.movement[String(movement)]! : '0/1';
}
export function jointProbability(id: string, movement: number, coins: number): string {
  if (!Number.isSafeInteger(movement) || !Number.isSafeInteger(coins)) throw new RangeError('Integer outcome required');
  const distribution = getOdds(id);
  if (distribution.coins === null) throw new Error('Coin distribution is unverified; no zero-coin assumption is allowed');
  return distribution.joint.find(row => row.movement === movement && row.coins === coins)?.probability ?? '0/1';
}
