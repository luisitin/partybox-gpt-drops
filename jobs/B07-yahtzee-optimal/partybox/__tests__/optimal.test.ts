// The exact solver port (B07): the same answers as the sealed original, the same rules as this
// game's own scoring, and 'sharp' bots that play it through the real reducer.
import { describe, expect, it } from 'vitest';
import { createRng } from '@partybox/game-sdk';
import type { Settings } from '@partybox/game-sdk';
import golden from './optimal-golden.json' with { type: 'json' };
import { game } from '../server/index';
import { editionOf } from '../server/content';
import { scoreOptions } from '../server/scoring';
import { sampleInput } from '../server/bot';
import { classicIds, optimalInput, scoreChoices, toScorecard } from '../server/optimal-bot';
import { score } from '../server/optimal/rules';
import type { RuleMode } from '../server/optimal/rules';
import { bestCategory, bestHold, expectedValue } from '../server/optimal/solver';
import type { Card, State } from '../server/types';
import { act, start } from './helpers';

const classic = editionOf('classic-us');
const ids = classicIds(classic)!;
const lcg = (seed: number) => {
  let v = seed >>> 0;
  return () => (v = (Math.imul(v, 1664525) + 1013904223) >>> 0) / 4294967296;
};
/** Every sorted roll of five dice. */
const hands: number[][] = [];
const visit = (dice: number[], min: number): void => {
  if (dice.length === 5) hands.push(dice);
  else for (let f = min; f <= 6; f++) visit([...dice, f], f);
};
visit([], 1);
function randomCard(random: () => number, used: number): Card {
  const boxes: Record<string, number | null> = Object.fromEntries(ids.map((id) => [id, null]));
  ids.forEach((id, slot) => {
    if (!(used & (1 << slot))) return;
    if (slot < 6) boxes[id] = Math.floor(random() * 6) * (slot + 1);
    else
      boxes[id] = slot === 11 ? (random() < 0.5 ? 50 : 0) : [0, 17, 25, 30, 40, 0, 22][slot - 6]!;
  });
  return { boxes, bonuses: 0 };
}

describe('exact optimal solver (B07 port)', () => {
  it('reproduces the sealed solver bit for bit', () => {
    expect(expectedValue()).toBe(golden.start.official);
    expect(
      expectedValue({ usedMask: 0, upper: 0, yahtzeeBonus: false, ruleMode: 'published' }),
    ).toBe(golden.start.published);
    expect(expectedValue().toFixed(4)).toBe('254.5877');
    for (const c of golden.cases) {
      const card = { ...c, ruleMode: c.ruleMode as RuleMode };
      const hold = bestHold(c.dice, c.rollsLeft, card);
      const category = bestCategory(c.dice, card);
      expect(expectedValue(card)).toBe(c.stateValue);
      expect(hold.hold).toEqual(c.hold);
      expect(hold.expectedValue).toBe(c.holdValue);
      expect(category.category).toBe(c.category);
      expect(category.expectedValue).toBe(c.categoryValue);
    }
  });

  it("scores every roll exactly like this game's own rules (forced and free Jokers)", () => {
    let compared = 0;
    let jokers = 0;
    const mismatches: string[] = [];
    for (const [jokerRule, mode] of [
      ['forced', 'official'],
      ['free', 'published'],
    ] as const) {
      const settings = { jokerRule, yahtzeeBonus: true, fullHouseYahtzee: false };
      const random = lcg(jokerRule.length);
      for (let i = 0; i < 160; i++) {
        // Every fourth card has the Yahtzee box filled and five alike likely: the Joker paths.
        const used = Math.floor(random() * 8191) | (i % 4 === 0 ? 2048 : 0);
        const card = randomCard(random, used);
        const scorecard = toScorecard(ids, card, mode)!;
        for (const dice of hands) {
          const options = scoreOptions(classic, card, dice, settings);
          if (card.boxes['yahtzee'] !== null && dice.every((d) => d === dice[0])) jokers++;
          ids.forEach((id, slot) => {
            const mine = score(dice, slot, scorecard);
            const theirs = options.find((o) => o.category === id);
            const same = theirs
              ? mine.legal && mine.points === theirs.points && mine.yahtzeeBonus === theirs.bonus
              : !mine.legal;
            if (!same) mismatches.push(`${jokerRule} ${JSON.stringify(card.boxes)} ${dice} ${id}`);
            compared++;
          });
        }
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
    expect(compared).toBe(2 * 160 * 252 * 13);
    expect(jokers).toBeGreaterThan(400); // five alike over a filled Yahtzee box: the Joker paths
  });

  it('plays sharp bots optimally through the real reducer and beats the normal bot', () => {
    const mean = (skill: 'normal' | 'sharp') => {
      let total = 0;
      for (let seed = 1; seed <= 30; seed++) {
        let s: State = start(1, { jokerRule: seed % 2 ? 'forced' : 'free' }, seed);
        for (let steps = 0; s.phase.id !== 'done' && steps < 200; steps++) {
          const input = game.bot.sampleInput(s, s.turn, createRng(seed), skill);
          expect(input).not.toBeNull();
          if (skill === 'sharp') expect(input).toEqual(optimalInput(classic, s));
          const next = act(s, input!);
          expect(next).not.toBe(s);
          s = next;
        }
        expect(s.phase.id).toBe('done');
        total += game.results(s)!.scores['p1']!;
      }
      return total / 30;
    };
    const sharp = mean('sharp');
    expect(sharp).toBeGreaterThan(mean('normal'));
    expect(sharp).toBeGreaterThan(230);
  });

  it('falls back to the normal bot where the solver does not apply', () => {
    const unsolved: Settings[] = [
      { edition: 'triple' },
      { jokerRule: 'original' },
      { jokerRule: 'none' },
      { yahtzeeBonus: false },
      { fullHouseYahtzee: true },
    ];
    for (const settings of unsolved) {
      let s: State = start(2, settings, 5);
      for (let steps = 0; s.phase.id !== 'done' && steps < 60; steps++) {
        const sharp = sampleInput(s, s.turn, 'sharp');
        expect(sharp).toEqual(sampleInput(s, s.turn, 'normal'));
        s = act(s, sharp!);
      }
    }
  });

  it('ranks every legal box for a coach hint', () => {
    const s = start(1, {}, 3);
    const card = s.cards['p1']![0]!;
    const choices = scoreChoices(classic, s.settings, card, [3, 3, 3, 5, 5])!;
    expect(choices.map((c) => c.category).sort()).toEqual(
      scoreOptions(classic, card, [3, 3, 3, 5, 5], s.settings)
        .map((o) => o.category)
        .sort(),
    );
    const best = bestCategory([3, 3, 3, 5, 5], toScorecard(ids, card, 'official')!);
    expect(choices[0]!.category).toBe(ids[best.category]);
    expect(choices[0]!.expectedValue).toBe(best.expectedValue);
  });
});
