# B07 Yahtzee exact optimal solver → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready to port**: the 'sharp' Yahtzee bot. The phone hint is an owner decision (gap 1), not part of the port. |
| Branch | `job/B07-yahtzee-optimal`, kit and tests at `e3591e6` (the polish pass's kit commit; the docs commit after it changes docs and the manifest only). PR #21 is open, not draft. CI `verify` is green on `4258453`, the head before this pass (check run 113378096795), and was green at `7cdb272` ([run 37670569356](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37670569356/job/112960964191)). The pushed head's CI is on PR #21. |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B07-yahtzee-optimal && npm ci && npm test` took 31 min 14 s in this pass's full run on a busy machine (23 min 20 s in the earlier run that NEXT.md records); the GitHub run time was not re-measured. `node partybox/test-port.mjs` (port kit only) takes about 3 min here (176 s). `package.json` is sealed, so it has no script for this. |
| Lands in PartyBox | `games/yahtzee/server/optimal/` (new), `games/yahtzee/server/optimal-bot.ts` (new), `games/yahtzee/server/bot.ts` + `index.ts` (edits), `games/yahtzee/__tests__/optimal*.{ts,json}` (new). Server only. |

## What it is
Exact optimal play for solitaire Yahtzee. Every hold and every box choice maximizes the expected final score over the full game state: 13 boxes, the upper subtotal capped at 63, and the Yahtzee-bonus flag. The solver has no search cutoffs and no sampling. Its empty-card EV is 254.5877 under Hasbro's forced Joker rule (PartyBox `jokerRule: 'forced'`, the default in `games/yahtzee/manifest.json`) and 254.5896 under the free-choice Joker (`'free'`). The second number is the published figure. Two solvers, written separately, agree on all 1,072,896 valid states (worst gap 9.4e-13, VERIFY.md). In a scratch PartyBox copy, the 2-player sim (200 runs, seed 1) gave the sharp seat 73.5% of the wins against 26.5% for normal. With 4 players, each sharp seat won 40.1% of games and each normal seat 9.9%. No solo-average figure is quoted: no log in the job or the scratch copy backs the one an earlier pass wrote.

## Take these files (the product)
| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `partybox/server/optimal/tables-official.generated.ts` | 359,616 solved values, Float64 LE, base64 (3.8 MB). Built by `partybox/build-tables.mjs` | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/tables-published.generated.ts` | the same for the free-choice Joker (3.8 MB) | `games/yahtzee/server/optimal/` |
| `partybox/server/optimal/tables.ts` | `solvedValue(mode, usedMask, upper, yahtzeeBonus)`: both tables decode once, when the module loads (time in gap 7), then O(1) lookups. The module keeps no mutable state (changed in this polish pass: it used to cache the decoded tables in a `Map`) | `games/yahtzee/server/optimal/` |
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
5. Provenance: add a B07 line to `chatgpt/board-games/reports/yahtzee/SOURCES.md` (the report that `games/yahtzee/THIRD_PARTY_NOTICES.md` cites; the root `reports/` folder has no yahtzee report). The code is original, written for this job. The job's `SOURCES.md` is the record: Glenn, IEEE CIG 2007, is the published algorithm, and jdh8/yahtzee-engine was reviewed with no code copied. Verhoeff's published Joker interpretation is named in `ASSUMPTIONS.md`, but no source for it was re-read in the polish pass (most hosts are blocked here). So `THIRD_PARTY_NOTICES.md` does not change.
6. Optional: write an ADR for "7.7 MB of generated solver data in a game server". Use the next free number: `docs/DECISIONS.md` ends at ADR-081 (checked at `26b85ba6`), so ADR-082 unless another decision lands first. It is server-only, `check-bundle` keeps it off phones and the TV, and it is regenerated only when a rule changes. No new dependency.
7. Run `pnpm gen-registry` (unchanged, no new game), then `pnpm verify`.

## Make it feel AAA in PartyBox (not a 2D bootleg)
This is a bot upgrade, so it changes no screens. The work is pacing and an optional payoff.
- **Bot turn pacing.** A table lookup takes under 0.2 ms (gap 7). The whole sharp decision was not timed in this pass, but the bot's answer is fast enough that it must not feel instant.
  - Take the harness's bot timing as is: roll, then hold.
  - On the TV, a kept die already gets the gold ring in `games/yahtzee/client/Stage3d.tsx` (`#ffd166`, opacity 0.95 when held, 0.16 when not). So the bot's keep shows before the reroll with no new effect. Only the pause length is new, and it belongs to the existing `Dice3d` timing.
  - On the phone, the roll log says only "X rolled …" today: `games/yahtzee/server/phases/roll.ts` emits it, `games/yahtzee/client/log-text.ts` parses it (pattern and key), and `games/yahtzee/client/strings.ts` has the Spanish text (English is the key). A "Bot keeps 3 · 3 · 3" line is a proposal that needs a new event text in all three. It is not in the port.
- **Lobby skill row** (ADR-059). It already exists: "Sharp" / "Experto", with the copy "the bots rarely miss" (`packages/client/src/i18n-en-phone.ts`, `i18n-es-phone.ts`). Keep it. A stronger label such as "Perfect" would overpromise, because sharp is exact only on Classic with forced or free Jokers and falls back silently elsewhere.
- **Optional post-game "how close to perfect" stat** (owner's call; it obeys "never suggest the best box" because it shows only after the game).
  - The server keeps, per player, the summed EV lost against `scoreChoices`/`bestHold` at each decision. That is a few numbers in state.
  - Results then show a line such as "You played 97% of perfect". The 97% is an example, not a measured number. The award goes through `pickAwards` (`packages/game-sdk/src/awards.ts`).
  - The TV reveal can use `NumberPop` (`packages/game-sdk/src/ui/Juice.tsx`) for the count-up and `Confetti` (`packages/game-sdk/src/tv/Confetti.tsx`) for the sharpest human. The F03 win-screen language (fx-lab) and the B17 sting (gpt-drops) are not in PartyBox yet, so they are later work. The phone shows its own percentage.
- **Not recommended: a live hint during play.** It contradicts docs/games/yahtzee.md ("we only highlight a Yahtzee and never suggest the best box").

## Known gaps and risks
1. **should (owner decision):** a phone coach hint. `scoreChoices` is ready, tested and server-side; compute it inside `controllerView` and never import the solver on the client. The design doc says no, so it is left out of the port.
2. **should:** repository weight. The two generated files add 7.7 MB raw (5.5 MB gzip, measured with `gzip -9` in this pass) to git, and every table change adds that much again. Halving it by shipping only the forced Joker table would send `'free'` rooms to the normal bot.
3. **should:** the solver maximizes expected solitaire score, not the chance to win. A trailing sharp bot does not take extra risk late in a multiplayer game. That is honest and still strong (73.5% two-player wins against normal).
4. **should:** not re-checked here:
   - the full `pnpm verify` (fuzz replay, build, drift, i18n) on the port;
   - anything against the owner's local main, which is ahead of the checkout used (`26b85ba6`).

   In this pass, tsc, eslint, prettier, vitest and the sims passed in scratch on the final files. depcruise and check-bundle passed in an earlier pass, before the `tables.ts` change.
5. **nit:** pre-existing, not caused by this port. `pnpm sim --game yahtzee --players 6 --runs 200 --seed 1` with the default `mixed` strategy fails 152 runs of 200 with `stuck×152` ("phase roll has no deadline and nobody can act"), because yahtzee's roll phase sets no deadline and idle bots never act. A clean export of PartyBox `26b85ba6` with no port gives the same 152 of 200, and `--skills normal,sharp` gives the same 152 of 200. `--strategy fast` runs clean. An earlier note said `stuck×76`; the 200-run count is 152.
6. **nit:** no solver for Triple, `original` or `none` Jokers, `yahtzeeBonus: false` or `fullHouseYahtzee`. These fall back to the normal bot. `generator.cpp` could be extended per rule.
7. **nit:** cold start, measured on the current eager `tables.ts` in this pass (CommonJS transpile of the kit, Node 22.22.0, three runs): importing the module, which decodes both tables, takes 148–164 ms; the first `solvedValue` lookup takes under 0.2 ms in either mode; heap is about 20 MB after import (two 2.9 MB Float64Arrays plus the 7.7 MB of source strings). The earlier lazy version imported in 55–66 ms and then paid 34–57 ms on the first lookup per mode. The `pnpm dev` (tsx) path was not re-measured after the change.
8. **nit:** NEXT.md in this folder is stale: the PR #21 workflow it waits for has passed on `4258453`, and its "exact resume step" predates this pass. It is left as it was.

## Verify after porting
- `pnpm verify`
- `pnpm vitest run games/yahtzee`: 13 files and 105 tests passed in scratch (117 s here, on a busy machine).
- `pnpm sim --game yahtzee --players 2 --runs 200 --seed 1 --skills normal,sharp --strategy fast`: sharp 73.5%, normal 26.5%, 0 failed (measured this pass).
- `pnpm sim --game yahtzee --players 4 --runs 200 --seed 1 --skills normal,sharp --strategy fast`: 40.1% per sharp seat, 9.9% per normal seat, 0 failed (measured this pass).
- `pnpm sim --game yahtzee --players 6 --runs 200 --seed 1 --strategy fast`: 0 failed, about 104 s (measured this pass).
- The default `mixed` strategy is not a pass gate: it fails 152 of 200 with `stuck×152` on the port and on a clean export (gap 5).
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

### This pass (continued): commit `e3591e6` and the docs commit after it
- Changed `partybox/server/optimal/tables.ts`. It cached decoded tables in a lazily filled `Map`, which is mutable module state under `games/*/server` (AGENTS.md invariant 2). Both tables now decode once at import into a constant record, and `solvedValue` is a pure lookup. The cost is the import time in gap 7.
- Changed `partybox/test-port.mjs`. Mutant P07 now swaps both table entries. The one-line swap left `SOLVED_OFFICIAL` unused, which strict TypeScript rejects (TS6133), so the mutant check crashed once (exit 1). With the fix, all 16 port mutants are caught.
- Corrected the docs against the real PartyBox repo: the roll-log files (`roll.ts` emits, `client/log-text.ts` parses, `client/strings.ts` has the Spanish text), the `bot.ts` header line and the current `sampleInput(s, id)` signature, the ADR number (ADR-082 is the next free one; ADR-081 is last), and the Joker default (`manifest.json`).
- Removed figures that no log backs: the solo sharp and normal averages in "What it is", and the `stuck×76` count (the 200-run count is 152, and it matches a clean export of `26b85ba6`).
- Measured this pass: cold start (gap 7), gzip size of the tables (gap 2), the 2p, 4p and 6p sims, and the mixed-strategy stuck count against a clean export.
- Gates in a scratch PartyBox copy of `26b85ba6`, using the final kit files (byte-identical): typecheck, eslint, prettier, vitest (yahtzee) and the sims above. depcruise and check-bundle ran in an earlier pass, before the `tables.ts` change.
- Restored `reports/partybox-port.json` and `reports/visited-official-seed-1.bin` from git. An interrupted run had left them modified, and each `test-port.mjs` run rewrites `partybox-port.json`.
- Full `npm test` in this pass: exit 0 after 31 min 14 s (16:22 to 16:53 UTC on a busy machine). All three seeds PASS and the port kit PASS (16 of 16 mutants killed). Details are in VERIFY.md, section "Polish pass 2026-10-08".
- Pushed to `origin job/B07-yahtzee-optimal` in the commit that carries this section. A file cannot name its own commit, so the branch head is what `git ls-remote` shows. The CI for that head is on PR #21.
