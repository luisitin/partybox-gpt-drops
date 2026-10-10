import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
export const colors = ['red', 'blue', 'black', 'orange'];
export const root = fileURLToPath(new URL('../', import.meta.url));
export function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const int = (r, n) => Math.floor(r() * n);
export function stock() {
  const a = [];
  for (const color of colors) for (let value = 1; value <= 13; value++) for (let copy = 0; copy < 2; copy++)
    a.push({ id: `${color}-${value}-${copy}`, kind: 'number', color, value });
  a.push({ id: 'joker-0', kind: 'joker' }, { id: 'joker-1', kind: 'joker' });
  return a;
}
export function take(pool, r, filter = () => true) {
  const choices = pool.map((t, i) => filter(t) ? i : -1).filter(i => i >= 0);
  assert.ok(choices.length, 'generator: no eligible physical tile');
  return pool.splice(choices[int(r, choices.length)], 1)[0];
}
export function meld(pool, r, length, jokerChance = 0.12) {
  for (let attempt = 0; attempt < 10000; attempt++) {
    const group = length <= 4 && r() < 0.45;
    let faces;
    if (group) {
      const value = 1 + int(r, 13), missing = int(r, 4);
      faces = colors.filter((_, i) => length === 4 || i !== missing).map(color => ({ color, value }));
    } else {
      const color = colors[int(r, 4)], start = 1 + int(r, 14 - length);
      faces = Array.from({ length }, (_, i) => ({ color, value: start + i }));
    }
    const used = new Set(), picked = [];
    for (const f of faces) {
      const numbers = pool.map((t, i) => !used.has(i) && t.kind === 'number'
        && t.color === f.color && t.value === f.value ? i : -1).filter(i => i >= 0);
      const jokers = pool.map((t, i) => !used.has(i) && t.kind === 'joker' ? i : -1).filter(i => i >= 0);
      const wild = jokers.length && (!numbers.length || r() < jokerChance);
      const candidates = wild ? jokers : numbers;
      if (!candidates.length) break;
      const i = candidates[int(r, candidates.length)];
      used.add(i);
      picked.push(pool[i].kind === 'joker' ? { ...pool[i], as: f } : pool[i]);
    }
    if (picked.length !== length) continue;
    for (const i of [...used].sort((a, b) => b - a)) pool.splice(i, 1);
    return { kind: group ? 'group' : 'run', tiles: picked };
  }
  throw new Error('generator: no meld found after 10000 attempts');
}
export function smallPosition(r, index) {
  const pool = stock(), family = index % 10;
  let table = [], hand = [];
  const opened = family === 0 ? false : r() < 0.72;
  const n = family === 0 ? int(r, 15) : 3 + int(r, 12);
  if (family >= 3 && family <= 6 && n >= 6) {
    const length = 3 + int(r, Math.min(5, n - 2) - 2);
    table.push(meld(pool, r, length, family === 5 ? 0.5 : 0.12));
    if (n - length >= 6 && r() < 0.5) table.push(meld(pool, r, 3, 0.15));
  } else if (family === 7 && n >= 7) table.push(meld(pool, r, Math.min(n - 1, 6 + int(r, 8)), 0.15));
  if (family === 2 && n >= 3) {
    const m = meld(pool, r, 3 + int(r, Math.min(n, 5) - 2), 0.3);
    hand.push(...m.tiles.map(t => t.kind === 'joker' ? { id: t.id, kind: 'joker' } : t));
  }
  const start = 1 + int(r, 9), color = colors[int(r, 4)];
  const handSize = n - table.flatMap(m => m.tiles).length;
  while (hand.length < handSize) {
    const needJoker = family === 9 && hand.filter(t => t.kind === 'joker').length < 2;
    let filter;
    if (needJoker) filter = t => t.kind === 'joker';
    else if (family === 1 || family === 8) filter = t => t.kind === 'joker' ||
      (t.value >= start && t.value < start + 5 && (family === 1 || t.color === color));
    else if (family >= 3 && family <= 6 && r() < 0.7) {
      const all = table.flatMap(m => m.tiles).map(t => t.kind === 'joker' ? t.as : t);
      filter = t => t.kind === 'joker' || all.some(f => t.value === f.value ||
        (t.color === f.color && Math.abs(t.value - f.value) <= 2));
    } else filter = () => true;
    if (!pool.some(filter)) filter = () => true;
    hand.push(take(pool, r, filter));
  }
  return { table, hand, initialMeldDone: opened };
}
export function largePosition(r, index) {
  const pool = stock(), table = [];
  let left = 40;
  const jokerChance = [0, 0.05, 0.2, 0.8][index % 4];
  while (left) {
    const lengths = [3, 4, 5, 6, 7].filter(n => n <= left && left - n !== 1 && left - n !== 2);
    const length = lengths[int(r, lengths.length)];
    table.push(meld(pool, r, length, jokerChance));
    left -= length;
  }
  const hand = [];
  while (hand.length < 20) hand.push(take(pool, r));
  return { table, hand, initialMeldDone: true };
}
export function freeze(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    Object.freeze(x); for (const y of Object.values(x)) freeze(y);
  }
  return x;
}
export const hash = x => createHash('sha256').update(x).digest('hex');
export function sourceHashes() {
  const files=['rummikub.ts','reference.ts','blindReference.ts','package.json','package-lock.json','tsconfig.json',
    'requirements-dev.txt','test/milp-reference.py',
    ...readdirSync(resolve(root,'test')).filter(f=>f.endsWith('.mjs')).map(f=>`test/${f}`)];
  return Object.fromEntries(files.sort().map(f=>[f,hash(readFileSync(resolve(root,f)))]));
}
export function receipt(name, data) {
  const dir = resolve(root, '.test-output'); mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${name}.json`), JSON.stringify({ ...data, sourceHashes: sourceHashes() }, null, 2) + '\n');
}
export function seedArg() {
  const s = Number(process.env.SEED ?? process.argv.find(x => /^--seed=/.test(x))?.split('=')[1] ?? 1);
  assert.ok(Number.isInteger(s) && s >= 1 && s <= 0xffffffff); return s;
}
