# B07 Yahtzee exact optimal solver → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready to port**: the 'sharp' Yahtzee bot. The phone hint is an owner decision (gap 1), not part of the port. |
| Branch | `job/B07-yahtzee-optimal`, kit and tests at `9412e61` (later commits are docs only). PR #21 is open, not draft. CI was green at `7cdb272` before this pass ([run 37670569356](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37670569356/job/112960964191)); the new head's CI status is in the polish section below. |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B07-yahtzee-optimal && npm ci && npm test` takes about 25 min here (8 min on GitHub). `node partybox/test-port.mjs` (port kit only) takes about 2 min. `package.json` is sealed, so it has no script for this. |
| Lands in PartyBox | `games/yahtzee/server/optimal/` (new), `games/yahtzee/server/optimal-bot.ts` (new), `games/yahtzee/server/bot.ts` + `index.ts` (edits), `games/yahtzee/__tests__/optimal*.{ts,json}` (new). Server only. |

## What it is
Exact optimal play for solitaire Yahtzee. Every hold and every box choice maximizes the expected final score over the full game state: 13 boxes, the upper subtotal capped at 63, and the Yahtzee-bonus flag. The solver has no search cutoffs and no sampling. Its empty-card EV is 254.5877 under Hasbro's forced Joker rule (PartyBox `jokerRule: 'forced'`, the default) and 254.5896 under the free-choice Joker (`'free'`). The second number is the published figure. Two solvers, written separately, agree on all 1,072,896 states within 9.4e-13. In a scratch PartyBox copy, solo sharp bots averaged 250.4 ± 3.0 against 211.2 ± 2.5 for normal bots. Two-player sharp won 73.5% against normal.

## Take these files (the product)
| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `partybox/server/optimal/tables-official.generated.ts` | 359,616 solved values, Float64 LE, base64 (3.8 MB). Built by `partybox/build-tables.mjs` | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/tables-published.generated.ts` | the same for the free-choice Joker (3.8 MB) | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/tables.ts` | `solvedValue(mode, usedMask, upper, yahtzeeBonus)`: unpacks once per mode (about 45 ms), then O(1) lookups | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/rules.ts` | scorecard model and `score()` (both Joker rules) | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/solver.ts` | `expectedValue`, `bestCategory`, `bestHold`, `valueOfHold` | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal-bot.ts` | adapter on PartyBox's State and Edition (structural types, no imports from the game). Exports `optimalInput(edition, state)`, `optimalMove`, `scoreChoices`, `classicIds`, `toScorecard`, `optimalRuleMode`. Returns null where the solver does not apply, and never throws | `games/yahtzee/server/` |
| `partybox/__tests__/optimal.test.ts` + `optimal-golden.json` | vitest: bit-for-bit golden (548 cases); rule equivalence with `scoreOptions` (2 × 160 cards × 252 rolls × 13 boxes); sharp bots through the real reducer; fallbacks; the hint ranking | `games/yahtzee/__tests__/` |

## Leave these (evidence, tooling, reports)
Leave these in this repo; the port does not need them:
- `yahtzeeOpt.ts` and `tables/*.json` (25 MB of JSON imports);
- `generator.cpp`, `independent/`, `primary-snapshot/`;
- `run.mjs`, `test.mjs`, `verify-seed.mjs`, `mutate.mjs`, `simulate.mjs`, `paired-sim.cpp`, `*-selfcheck.mjs`, `component-proofs.mjs`, `primary-bridge.mjs`;
- `reports/`, `*SHA256SUMS*.txt` and every `*.md`.

They prove the work. `partybox/build-tables.mjs`, `build-golden.mjs` and `test-port.mjs` rebuild and re-prove the kit from here. `test-port.mjs` covers:
- a byte-identical table rebuild;
- every slot of the table;
- the job's own suites (seeds 1–3);
- a bitwise comparison of the root and the port;
- 1,800 adapter games;
- 16 planted port bugs, all caught.

## Port steps
1. Copy the files in the table above. Change no import paths: the kit already uses extensionless relative imports, named exports, no `await` and no module-level `let`/`var`, and prettier formatting.
   - The `*.generated.ts` files are prettier-ignored and lint-relaxed by the existing globs (`.prettierignore`, `eslint.config.js` relaxedFiles).
   - Every other file is 300 lines or fewer.
2. Edit `games/yahtzee/server/bot.ts`:
   - `import type { BotSkill } from '@partybox/game-sdk';` and `import { optimalInput } from './optimal-bot';`.
   - Give `sampleInput` a third parameter `skill: BotSkill = 'normal'`.
   - Right after its existing guard line, add `if (skill === 'sharp') { const best = optimalInput(editionOf(s.edition), s); if (best) return best; }`.
   - Normal and easy stay byte-identical to today's bot, as ADR-059 requires, so `check:golden` does not move.
3. Edit `games/yahtzee/server/index.ts`: change the bot entry to `sampleInput: (s, id, _rng, skill) => sampleInput(s, id, skill)`.
4. Update the docs in the same commit:
   - `games/yahtzee/README.md`, Players section: "Sharp bots play the exact optimal strategy (Classic, forced or free Jokers); other editions and house rules use the normal bot."
   - `games/yahtzee/server/bot.ts` header comment: drop "not the … optimal whole-game solver".
   - `docs/games/yahtzee.md`: a short Bots note.
   - `CHANGELOG.md` Unreleased: `yahtzee: 'sharp' bots play the exact optimal strategy (B07)`.
5. Provenance: add a B07 line to the Yahtzee SOURCES report (`reports/yahtzee/`). The code is original, written for this job. The algorithm is the standard one (Glenn 2007, Verhoeff), and SOURCES.md here lists what was read. No third-party code was copied, so `THIRD_PARTY_NOTICES.md` does not change.
6. Optional: write an ADR (≥ ADR-088) for "7.7 MB of generated solver data in a game server". It is server-only, `check-bundle` keeps it off phones and the TV, and it is regenerated only when a rule changes. No new dependency.
7. Run `pnpm gen-registry` (unchanged, no new game), then `pnpm verify`.

## Make it feel AAA in PartyBox (not a 2D bootleg)
This is a bot upgrade, so it changes no screens. The work is pacing and an optional payoff.
- **Bot turn pacing.** The solver answers in under 1 ms, so a sharp bot must not feel instant.
  - Take the harness's bot timing as is: roll, then hold.
  - On the TV, the held dice lift with the existing gold ring before the reroll (`Dice3d` in `Stage3d.tsx`). That makes the "thinking" visible.
  - On the phone, spectators see "Bot keeps 3-3-3" on the live strip.
- **Lobby skill row** (ADR-059). Label sharp as "Perfect" in EN and ES (`client/strings.ts`) only if the owner wants to advertise it. It is exact only on Classic with forced or free Jokers, and it falls back silently elsewhere.
- **Optional post-game "how close to perfect" stat** (owner's call; it obeys "never suggest the best box" because it shows only after the game).
  - The server keeps, per player, the summed EV lost against `scoreChoices`/`bestHold` at each decision. That is a few numbers in state.
  - Results then show "You played 97% of perfect" and an award via `pickAwards`.
  - The TV reveal uses the F03 win screen language with a count-up (`Juice` `NumberPop`), a `Confetti` burst for the sharpest human, and a B17 sting. The phone shows its own percentage.
- **Not recommended: a live hint during play.** It contradicts docs/games/yahtzee.md ("we only highlight a Yahtzee and never suggest the best box").

## Known gaps and risks
1. **should (owner decision):** a phone coach hint. `scoreChoices` is ready, tested and server-side; compute it inside `controllerView` and never import the solver on the client. The design doc says no, so it is left out of the port.
2. **should:** repository weight. The two generated files add 7.7 MB raw (5.5 MB gzip) to git, and every table change adds that much again. Halving it by shipping only the forced Joker table would send `'free'` rooms to the normal bot.
3. **should:** the solver maximizes expected solitaire score, not the chance to win. A trailing sharp bot does not take extra risk late in a multiplayer game. That is honest and still strong (73.5% two-player wins against normal).
4. **should:** not re-checked here:
   - the full `pnpm verify` (fuzz replay, build, drift, i18n) on the port;
   - anything against the owner's local main, which is ahead of the checkout used (`26b85ba6`).

   The individual gates all passed in scratch: tsc, eslint, depcruise, prettier, vitest, check-bundle and sim.
5. **nit:** pre-existing, not caused by this port. `pnpm sim --game yahtzee` with the default `mixed` strategy reports `stuck×76`, because yahtzee's roll and choose phases set no deadline and idle bots never act. It reproduces with and without `--skills`. `--strategy fast` runs clean.
6. **nit:** no solver for Triple, `original` or `none` Jokers, `yahtzeeBonus: false` or `fullHouseYahtzee`. These fall back to the normal bot. `generator.cpp` could be extended per rule.
7. **nit:** cold start. Importing the kit takes about 70 ms and the first sharp move per mode about 45 ms to decode (Node 22 here). Under `pnpm dev`, tsx adds about 130–150 ms cached and 474 ms uncached to the yahtzee server import. Memory is about 6 MB of Float64Array plus the 7.7 MB of source strings.
8. **nit:** NEXT.md in this folder is stale: the PR #21 workflow it waits for has passed.

## Verify after porting
- `pnpm verify`
- `pnpm vitest run games/yahtzee`: 13 files and 105 tests in scratch. `optimal.test.ts` takes about 8 s.
- `pnpm sim --game yahtzee --players 2 --runs 200 --seed 1 --skills normal,sharp --strategy fast`: expect about 73.5% / 26.5%, 0 failed.
- `pnpm sim --game yahtzee --players 6 --runs 200 --seed 1 --strategy fast`
- `pnpm check-bundle --list yahtzee --modules`: no `optimal` module in the phone or TV closures (the phone was 8.4 KB gz).
- `pnpm e2e:snap --game yahtzee` and `pnpm polish-check --game yahtzee --port <own>`: unchanged screens; run them only if a hint or stat ships.

## Polish pass 2026-10-08 (Claude, cloud)
- Checked that the PR #21 CI run was green at `7cdb272`, and that the EVs (254.58772873449593 / 254.58960948196315) match the known values.
- Found a port blocker. The root module imports two 12.4 MB JSON tables, which is 25 MB of source for a game server with no fs. Prettier-formatted, it is also over the 300-line lint limit. Fixed it with `4bf8e9c` (kit: lossless compact tables, split solver, adapter).
- Added `9412e61`: kit tests and the `test-port.mjs` step in `npm test`. It checks:
  - a byte-identical rebuild;
  - all 2 × 2^20 table slots;
  - the job suites on the port for seeds 1–3, and 5,548 states per seed bitwise against the root;
  - 6 adapter cells of 300 games each, all within 4 SE;
  - 16 port mutants, all caught.
- Validated in a scratch copy of PartyBox `26b85ba6`, with the files byte-identical to the kit:
  - tsc, eslint (0 problems), depcruise (no violations) and prettier;
  - vitest yahtzee: 105 tests passed;
  - sim: 2p sharp 73.5% against normal, 4p 40.1% against 9.9% per seat, 0 failed;
  - check-bundle: in bounds, with no solver code on the phone or TV.
- Rewrote README.md with the What / How / Status block, quick start, API, and product vs evidence list.
