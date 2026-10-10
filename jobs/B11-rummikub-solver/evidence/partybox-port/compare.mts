// Evidence script, not part of npm test. Compares B11 with PartyBox's real games/rummikub server code:
//   A. meld validity and represented points: exhaustive length-3 melds plus sampled length-4 melds,
//      with B11 allowed every legal joker binding (so "valid" means "some binding is legal").
//   B. plays, in both directions: PartyBox bot moves are checked by B11 validatePlay; B11 optimum
//      moves are checked by PartyBox rules.validateCommit; the bot's gap to the optimum is recorded.
// Run from the job folder:  PARTYBOX_ROOT=/home/user/partybox /home/user/partybox/node_modules/.bin/tsx evidence/partybox-port/compare.mts
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { findBestPlay, validatePlay, validateTable } from '../../dist/rummikub.js';
import { rng, smallPosition, largePosition, freeze } from '../../test/helpers.mjs';

const PB = process.env.PARTYBOX_ROOT ?? '/home/user/partybox';
const load = (name: string): Promise<any> => import(pathToFileURL(`${PB}/games/rummikub/server/${name}`).href);
const melds = await load('melds.ts');
const tiles = await load('tiles.ts');
const bot = await load('bot.ts');
const rules = await load('rules.ts');
const deck: Map<string, any> = new Map(tiles.buildDeck().map((t: any) => [t.id, t]));

const COLORS = ['red', 'blue', 'black', 'orange'] as const;
type Face = { color: string; value: number };
const FACES: Face[] = [];
for (const color of COLORS) for (let value = 1; value <= 13; value++) FACES.push({ color, value });

// Id mapping: B11 helper ids are <colour>-<value>-<copy 0|1> and joker-<0|1>; PartyBox uses -a/-b and joker-1/2.
const SUFFIX = ['a', 'b'];
const toPb = (id: string): string => id.startsWith('joker-')
  ? `joker-${Number(id.slice(6)) + 1}`
  : id.replace(/-(\d+)-(\d)$/, (_m, v, c) => `-${v}-${SUFFIX[Number(c)]}`);
const fromPb = (id: string): string => id.startsWith('joker-')
  ? `joker-${Number(id.slice(6)) - 1}`
  : id.replace(/-(\d+)-([ab])$/, (_m, v, c) => `-${v}-${c === 'a' ? 0 : 1}`);

// --- Part A: meld validity and points -------------------------------------------------------------
type Spec = (Face | null)[]; // null = joker
function compareMeld(spec: Spec) {
  const pbTiles = spec.map((f, i) => f
    ? { kind: 'number', id: `n${i}`, color: f.color, value: f.value }
    : { kind: 'joker', id: `j${i}` });
  const pb = melds.analyzeMeld(pbTiles);
  const jokerSlots = spec.map((f, i) => (f ? -1 : i)).filter((i) => i >= 0);
  let b11Valid = false, b11Max = -1;
  const check = (faces: Face[]) => {
    for (const kind of ['run', 'group'] as const) {
      const tiles = spec.map((f, i) => f
        ? { id: `n${i}`, kind: 'number', color: f.color, value: f.value }
        : { id: `j${i}`, kind: 'joker', as: faces[i] });
      if (validateTable([{ kind, tiles }]).ok) {
        b11Valid = true;
        b11Max = Math.max(b11Max, faces.reduce((s, x) => s + x.value, 0));
      }
    }
  };
  const bind = (k: number, faces: Face[]) => {
    if (k === jokerSlots.length) return check(faces);
    for (const f of FACES) { faces[jokerSlots[k]!] = f; bind(k + 1, faces); }
  };
  bind(0, spec.map((f) => f ?? FACES[0]!));
  return { pbValid: pb.valid, pbPoints: pb.valid ? pb.points : null, b11Valid, b11MaxPoints: b11Valid ? b11Max : null,
    agree: pb.valid === b11Valid && (!pb.valid || pb.points === b11Max) };
}
const N = (color: string, value: number): Face => ({ color, value });
const J: null = null;
const named: { name: string; spec: Spec }[] = [
  { name: 'run ending at 13 with joker (12,13,J)', spec: [N('red', 12), N('red', 13), J] },
  { name: 'wrap 13-J-1 (no wrap) ', spec: [N('red', 13), J, N('red', 1)] },
  { name: 'J-1-2 would need a 0 (no low end)', spec: [J, N('red', 1), N('red', 2)] },
  { name: 'J-J-12 cannot reach 14', spec: [J, J, N('red', 12)] },
  { name: 'group 5,5 with joker (distinct colours)', spec: [N('red', 5), N('blue', 5), J] },
  { name: 'group with duplicate colour 5r 5r J', spec: [N('red', 5), N('red', 5), J] },
  { name: 'joker run middle 1 J 3', spec: [N('red', 1), J, N('red', 3)] },
  { name: 'J J 7 (run 5-6-7 or group of 7s)', spec: [J, J, N('red', 7)] },
  { name: 'full red run 1..13 (13 tiles)', spec: Array.from({ length: 13 }, (_, i) => N('red', i + 1)) },
  { name: 'group of four 7s', spec: [N('red', 7), N('blue', 7), N('black', 7), N('orange', 7)] },
  { name: 'group of five 7s (too long)', spec: [N('red', 7), N('blue', 7), N('black', 7), N('orange', 7), J] },
  { name: 'two-tile run 1 2', spec: [N('red', 1), N('red', 2)] },
  { name: 'three jokers', spec: [J, J, J] },
  { name: 'J 2..12 J (13 tiles, both ends)', spec: [J, ...Array.from({ length: 11 }, (_, i) => N('red', i + 2)), J] },
  { name: 'J 1..12 J (run would start at 0)', spec: [J, ...Array.from({ length: 12 }, (_, i) => N('red', i + 1)), J] },
];
const namedResults = named.map(({ name, spec }) => ({ name, ...compareMeld(spec) }));

// Exhaustive length-3 melds (every colour/value per slot, every joker position, at most two jokers).
const exhaustive3: Spec[] = [];
for (const a of FACES) for (const b of FACES) for (const c of FACES) exhaustive3.push([a, b, c]);
for (let k = 0; k < 3; k++) for (const f1 of FACES) for (const f2 of FACES) {
  const s: Spec = [f1, f2, f2]; s[k] = null; const rest = [0, 1, 2].filter((x) => x !== k);
  s[rest[0]!] = f1; s[rest[1]!] = f2; exhaustive3.push(s);
}
for (let k1 = 0; k1 < 3; k1++) for (let k2 = k1 + 1; k2 < 3; k2++) for (const f of FACES) {
  const s: Spec = [f, f, f]; s[k1] = null; s[k2] = null; exhaustive3.push(s);
}
const sampler = rng(0xA11CE + 1);
const pick = (n: number) => Math.floor(sampler() * n);
const sampled4: Spec[] = [];
for (let i = 0; i < 2500; i++) {
  const s: Spec = []; let jokers = 0;
  for (let k = 0; k < 4; k++) {
    if (jokers < 2 && sampler() < 0.2) { s.push(null); jokers++; } else s.push(FACES[pick(52)]!);
  }
  sampled4.push(s);
}
const partA = { exhaustiveLength3: exhaustive3.length, sampledLength4: sampled4.length, disagreements: [] as unknown[], checked: 0 };
for (const spec of [...exhaustive3, ...sampled4]) {
  const r = compareMeld(spec);
  partA.checked++;
  if (!r.agree && partA.disagreements.length < 40) partA.disagreements.push({ spec: spec.map((f) => (f ? `${f.color[0]}${f.value}` : 'J')), ...r });
  else if (!r.agree) (partA as any).disagreementCount = ((partA as any).disagreementCount ?? 0) + 1;
}

// --- Part B: plays in both directions ---------------------------------------------------------------
const toB11Table = (pbTable: string[][]): any[] | null => {
  const out: any[] = [];
  for (const m of pbTable) {
    const objs = m.map((id) => deck.get(id));
    const a = melds.analyzeMeld(objs);
    if (!a.valid) return null;
    const numbered = objs.map((t: any, i: number) => ({ t, i })).filter((x) => x.t.kind === 'number');
    const faces: Face[] = [];
    if (a.kind === 'run') {
      const color = numbered[0]!.t.color, start = numbered[0]!.t.value - numbered[0]!.i;
      objs.forEach((_: unknown, i: number) => faces.push(N(color, start + i)));
    } else {
      const value = numbered[0]!.t.value, used = new Set(numbered.map((x) => x.t.color));
      const missing = COLORS.filter((c) => !used.has(c));
      let next = 0;
      objs.forEach((t: any) => faces.push(t.kind === 'number' ? N(t.color, t.value) : N(missing[next++]!, value)));
    }
    out.push({ kind: a.kind, tiles: objs.map((t: any, i: number) => t.kind === 'number'
      ? { id: fromPb(t.id), kind: 'number', color: t.color, value: t.value }
      : { id: fromPb(t.id), kind: 'joker', as: faces[i] }) });
  }
  return out;
};

const SKILLS = ['easy', 'normal', 'sharp'] as const;
const positions: { kind: string; p: any }[] = [];
const rs = rng(7000 + 1), rl = rng(8000 + 1);
for (let i = 0; i < 400; i++) positions.push({ kind: 'small', p: freeze(smallPosition(rs, i)) });
for (let i = 0; i < 40; i++) positions.push({ kind: 'large', p: freeze(largePosition(rl, i)) });

const q = (v: number[], x: number) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.ceil(s.length * x) - 1)]! : null; };
const partB: Record<string, any> = {};
for (const skill of SKILLS) {
  const agg: any = { positions: 0, pbPlays: 0, b11Plays: 0, missedByBot: 0, botBelowOptimum: 0, botAtOptimum: 0,
    gapValueSum: 0, gapValueMax: 0, gapCountOnTie: 0, flags: {} as Record<string, number>, examples: [] as unknown[],
    pbMs: [] as number[], b11Ms: [] as number[] };
  const flag = (name: string, detail: unknown) => {
    agg.flags[name] = (agg.flags[name] ?? 0) + 1;
    if (agg.examples.length < 8) agg.examples.push({ flag: name, detail });
  };
  for (const { kind, p } of positions) {
    agg.positions++;
    const pbTable = p.table.map((m: any) => m.tiles.map((t: any) => toPb(t.id)));
    const pbRack = p.hand.map((t: any) => toPb(t.id));
    let t0 = performance.now();
    const move = bot.planMove(pbTable, pbRack, p.initialMeldDone, skill);
    agg.pbMs.push(performance.now() - t0);
    t0 = performance.now();
    const solved = findBestPlay(p);
    agg.b11Ms.push(performance.now() - t0);
    if (!solved.ok) { flag('B11_SOLVE_FAILED', { kind, error: (solved as any).error }); continue; }
    const b11Plays = solved.action === 'play';
    if (b11Plays) agg.b11Plays++;
    let pbValue: number | null = null;
    if (move) {
      agg.pbPlays++;
      const table = toB11Table(move.table);
      if (!table) { flag('PB_MOVE_UNBINDABLE', { kind }); continue; }
      const v = validatePlay(p, table);
      if (!v.ok) { flag('B11_REJECTS_PB_MOVE', { kind, reason: v.error.message }); continue; }
      pbValue = v.value;
    }
    if (b11Plays && !move) agg.missedByBot++;
    if (!b11Plays && move) flag('B11_PASSED_WHERE_PB_PLAYED', { kind, pbValue });
    if (b11Plays && move && pbValue !== null) {
      const gap = solved.value - pbValue;
      if (gap < 0) flag('PB_BEATS_B11_OPTIMUM', { kind, gap });
      else if (gap === 0) { agg.botAtOptimum++; }
      else { agg.botBelowOptimum++; agg.gapValueSum += gap; agg.gapValueMax = Math.max(agg.gapValueMax, gap); }
    }
    if (solved.action === 'play') {
      const after = solved.table.map((m: any) => m.tiles.map((t: any) => toPb(t.id)));
      const afterRack = solved.remainingHand.map((t: any) => toPb(t.id));
      const r = rules.validateCommit({ beforeTable: pbTable, afterTable: after, beforeRack: pbRack, afterRack,
        index: deck, hasMadeInitialMeld: p.initialMeldDone });
      if (!r.ok) flag('PB_REJECTS_B11_OPTIMUM', { kind, reason: r.reason });
    }
  }
  agg.gapValueAvg = agg.botBelowOptimum ? agg.gapValueSum / agg.botBelowOptimum : 0;
  agg.pbMsP50 = q(agg.pbMs, 0.5); agg.pbMsP99 = q(agg.pbMs, 0.99); agg.pbMsMax = Math.max(...agg.pbMs);
  agg.b11MsP50 = q(agg.b11Ms, 0.5); agg.b11MsP99 = q(agg.b11Ms, 0.99); agg.b11MsMax = Math.max(...agg.b11Ms);
  delete agg.pbMs; delete agg.b11Ms;
  partB[skill] = agg;
}

const out = {
  script: 'evidence/partybox-port/compare.mts', partyBoxRoot: PB, nodeNote: 'tsx run; timings on a loaded 4-CPU host',
  partA: { ...partA, disagreementCount: (partA as any).disagreementCount ?? 0, namedCases: namedResults },
  partB,
};
writeFileSync(new URL('./compare-seed-1.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({
  partA: { checked: partA.checked, disagreements: out.partA.disagreementCount, named: namedResults.map((x) => [x.name, x.pbValid, x.b11Valid, x.agree]) },
  partB: Object.fromEntries(Object.entries(partB).map(([k, v]: any) => [k, { positions: v.positions, pbPlays: v.pbPlays, b11Plays: v.b11Plays,
    missedByBot: v.missedByBot, botAtOptimum: v.botAtOptimum, botBelowOptimum: v.botBelowOptimum, gapValueAvg: v.gapValueAvg,
    gapValueMax: v.gapValueMax, flags: v.flags, pbMsP50: v.pbMsP50, pbMsP99: v.pbMsP99, pbMsMax: v.pbMsMax, b11MsP50: v.b11MsP50, b11MsMax: v.b11MsMax }])),
}, null, 1));
