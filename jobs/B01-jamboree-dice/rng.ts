/** Seeded test generator: xoshiro128** 1.1, Blackman/Vigna (public domain).
 * Reference: https://prng.di.unimi.it/xoshiro128starstar.c
 * This is NOT Nintendo's RNG. Only this returned RNG closure holds mutable state.
 */
export type Rng = () => number;
export function seededRng(seed: number): Rng {
  if (!Number.isSafeInteger(seed) || seed < 1 || seed > 0xffffffff)
    throw new RangeError('Seed must be a positive uint32');
  let a = seed >>> 0, b = 0x9e3779b9, c = 0x243f6a88, d = 0xb7e15162;
  return (): number => {
    const x = Math.imul(b, 5);
    const result = Math.imul((x << 7) | (x >>> 25), 9) >>> 0;
    const t = b << 9;
    c ^= a; d ^= b; b ^= c; a ^= d; c ^= t;
    d = (d << 11) | (d >>> 21);
    return result;
  };
}
/** Rejection sampling avoids modulo bias. Inputs and every supplied RNG value are checked. */
export function randomIndex(size: number, rng: Rng): number {
  if (!Number.isInteger(size) || size < 1 || size > 0x100000000)
    throw new RangeError('Size must be 1..2^32');
  const limit = 0x100000000 - (0x100000000 % size);
  for (;;) {
    const value = rng();
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff)
      throw new RangeError('RNG must return a uint32');
    if (value < limit) return value % size;
  }
}
