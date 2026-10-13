// Writes (--write) or checks (default) the generated parts of the PartyBox-facing deliverables:
// the BOARD_ODDS block in boardOdds.ts and the data block in preview/hottest-squares.html.
// Every number comes from the sealed, independently verified solver in build/monopolyOdds.js.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import * as solver from './build/monopolyOdds.js';

export const plans = ['leave ASAP', 'stay max'];
const UTILITIES = [12, 28];
const CHANCE = [7, 22, 36];
const nearestUtility = chance => (chance === 22 ? 28 : 12);

/**
 * Movement-dice weights for utility rent on ordinary arrivals, by enumerating every state and all 36
 * ordered rolls with the same jail/doubles rules as the sealed model. Also returns the integer arrival
 * counts per state (units of 1/9216, ordinary and by the nearest-utility card) so the checks can compare
 * them cell by cell with the sealed transition counts.
 */
export function utilityWeights(plan, stateProbabilities) {
  const dice = new Array(40).fill(0);
  const directCounts = [], cardCounts = [];
  for (let state = 0; state < solver.STATE_COUNT; state++) {
    const current = solver.decodeState(state), mass = stateProbabilities[state];
    const direct = new Array(40).fill(0), card = new Array(40).fill(0);
    for (let first = 1; first <= 6; first++) for (let second = 1; second <= 6; second++) {
      const double = first === second;
      let from;
      if (current.kind === 'jailed' && plan === 'stay max') {
        if (!double && current.failedAttempts < 2) continue; // stays in jail, no movement
        from = 10;
      } else {
        from = current.kind === 'free' ? current.position : 10;
        const streak = current.kind === 'free' ? current.doubles : 0;
        if (double && streak === 2) continue; // third doubles: straight to jail
      }
      const total = first + second, to = (from + total) % 40;
      if (UTILITIES.includes(to)) {
        direct[to] += 256;
        dice[to] += mass * total / 36;
      } else if (CHANCE.includes(to)) {
        card[nearestUtility(to)] += 16; // one card of sixteen
      }
    }
    directCounts.push(direct);
    cardCounts.push(card);
  }
  return { dice, directCounts, cardCounts };
}

/** Same expression as the sealed eventFrequency(): Σ π(state)·counts[state][square] / 9216. */
function eventFrequency(stateProbabilities, counts, square) {
  let total = 0;
  for (let state = 0; state < solver.STATE_COUNT; state++) total += stateProbabilities[state] * counts[state][square];
  return total / solver.TRANSITION_DENOMINATOR;
}

export function boardOdds() {
  return Object.fromEntries(plans.map(plan => {
    const result = solver.monopolyOdds(plan), model = solver.buildTransitions(plan);
    const weights = utilityWeights(plan, result.stateProbabilities);
    const squares = Array.from({ length: 40 }, (_, square) => square);
    return [plan, {
      rollsPerTurn: result.rollsPerTurn,
      perRoll: [...result.landing],
      perTurn: [...result.endTurnLanding],
      railroadCard: squares.map(square => eventFrequency(result.stateProbabilities, model.railroadBonusCounts, square)),
      utilityCard: squares.map(square => eventFrequency(result.stateProbabilities, model.utilityChanceCounts, square)),
      utilityDice: weights.dice,
    }];
  }));
}

/** Prettier's "fill" layout for a number array (printWidth 100, two-space indent, trailing commas). */
function fill(values, indent) {
  const items = values.map(value => String(value));
  const oneLine = `[${items.join(', ')}],`;
  if (indent.length + oneLine.length <= 100) return [oneLine];
  const lines = ['['];
  let line = '';
  for (const item of items) {
    const next = line ? `${line} ${item},` : `${indent}  ${item},`;
    if (line && next.length > 100) { lines.push(line); line = `${indent}  ${item},`; }
    else line = next;
  }
  lines.push(line, `${indent}],`);
  return lines;
}

const BEGIN = '// BEGIN GENERATED BOARD_ODDS (partybox-export.mjs; npm test checks it bit for bit)';
const END = '// END GENERATED BOARD_ODDS';
export function boardOddsBlock(odds = boardOdds()) {
  const lines = [BEGIN, 'export const BOARD_ODDS: Readonly<Record<JailPlan, PlanOdds>> = {'];
  for (const plan of plans) {
    lines.push(`  '${plan}': {`, `    rollsPerTurn: ${String(odds[plan].rollsPerTurn)},`);
    for (const key of ['perRoll', 'perTurn', 'railroadCard', 'utilityCard', 'utilityDice']) {
      const [first, ...rest] = fill(odds[plan][key], '    ');
      lines.push(`    ${key}: ${first}`, ...rest);
    }
    lines.push('  },');
  }
  lines.push('};', END);
  return lines.join('\n');
}

const PREVIEW_BEGIN = '<script type="application/json" id="board-odds">';
const PREVIEW_END = '</script>';
export function previewData(odds = boardOdds()) {
  return JSON.stringify({
    source: 'B08 boardOdds.ts (exact long-run odds, classic 40-square board)',
    plans: Object.fromEntries(plans.map(plan => [plan,
      { rollsPerTurn: odds[plan].rollsPerTurn, perRoll: odds[plan].perRoll, perTurn: odds[plan].perTurn }])),
  });
}

function replaceBetween(text, begin, end, replacement, label) {
  const start = text.indexOf(begin);
  assert.ok(start >= 0, `${label}: start marker`);
  const stop = text.indexOf(end, start + begin.length);
  assert.ok(stop >= 0, `${label}: end marker`);
  assert.equal(text.indexOf(begin, start + 1), -1, `${label}: one start marker`);
  return text.slice(0, start) + replacement + text.slice(stop + end.length);
}

export function expectedFiles() {
  const odds = boardOdds();
  const ts = readFileSync(new URL('./boardOdds.ts', import.meta.url), 'utf8');
  const html = readFileSync(new URL('./preview/hottest-squares.html', import.meta.url), 'utf8');
  return [
    ['boardOdds.ts', ts, replaceBetween(ts, BEGIN, END, boardOddsBlock(odds), 'boardOdds.ts')],
    ['preview/hottest-squares.html', html,
      replaceBetween(html, PREVIEW_BEGIN, PREVIEW_END, `${PREVIEW_BEGIN}${previewData(odds)}${PREVIEW_END}`, 'preview')],
  ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const write = process.argv.includes('--write');
  for (const [file, actual, expected] of expectedFiles()) {
    if (write) writeFileSync(new URL(`./${file}`, import.meta.url), expected);
    else assert.equal(actual, expected, `Generated block of ${file} matches the sealed solver`);
  }
  console.log(JSON.stringify({ suite: 'partybox-generated', passed: true, mode: write ? 'written' : 'checked',
    files: ['boardOdds.ts', 'preview/hottest-squares.html'] }));
}
