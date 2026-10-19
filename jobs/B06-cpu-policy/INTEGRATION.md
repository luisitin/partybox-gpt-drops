# B06 Jamboree CPU behaviour + cpuPolicy.ts → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes.** The policy is small, pure and checked against its own contract by two independent implementations (80 scenarios, 100,000 random legal states per function, 25 mutants killed). It is an original design model. None of its numbers is a measured Nintendo CPU value. |
| Branch | `job/B06-cpu-policy`, polish commit recorded in PR #17 history (prior head `4f030d4`) · PR #17 (draft) · CI: green (`B06 CPU policy full verification`, run 37676078976, head `4f030d4`, checked 2026-10-08) |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B06-cpu-policy && npm ci --ignore-scripts --no-audit --no-fund && npm test` (Node 22 or later). Runtime about 5 minutes on the shared box (measured 2026-10-08: 5 min 01 s, exit 0). |
| Lands in PartyBox | `games/party-world/server/cpu-policy.ts` (new; the port of `cpuPolicy.ts` and `types.ts`), called from `games/party-world/server/bot.ts` (new), with tests in `games/party-world/__tests__/`. The board game is B05's port. |

## What it is

Four pure functions over a small documented state: `chooseBranch`, `chooseItem`, `chooseShopBuy` and `buyStar`. Each takes `(state, difficulty, rng)`. The rng is a plain `() => number`. The contract (`CONTRACT.md`) fixes every rule: which options are legal, how utility is computed, the one-draw-per-decision budget, and what happens on a bad rng (decline, never throw).

It is good for: a readable, testable bot with two knobs per difficulty (how often it explores, how often it buys a Star). It is not a model of Nintendo's CPU. The research (`research.md`) records only what players reported, at low confidence, and 24 per-difficulty rows remain unverified. Read `DESIGN-DIGEST.md` for what to copy.

## Take these files (the product)

| File | What it gives | Goes to (PartyBox path) |
| --- | --- | --- |
| `cpuPolicy.ts` | The four decision functions. Pure. About 3 KB. | `games/party-world/server/cpu-policy.ts` (copy; rewrite the import to `./types` with no `.js` suffix) |
| `types.ts` | The state, action and branch types | Merged into the same file, or `games/party-world/server/cpu-types.ts` |
| `CONTRACT.md` | The rules the code must obey | `docs/games/party-world.md`, the bot section. Copy the rules, not the file. |
| `tests/scenarios.mjs` cases (80) | Hand-written expected answers, each with its arithmetic | `games/party-world/__tests__/cpu-policy.test.ts` (rewrite as Vitest with `testKit`) |
| `tests/core.mjs` random-state generator | 100,000 random legal states per function, checks legality and that nothing throws | The same test file, one property test per function |

## Leave these (evidence and the seal)

- `research.md`, `research.json`, `research.schema.json`, `SOURCES.md`, `CONFLICTS.md`, `reports/`: the evidence trail. Stay in the drops repo.
- `reference.ts` and `blind-authoring/`: the independent implementation and its authoring record. They prove the two implementations agree. Do not ship them into PartyBox.
- `tests/run.mjs`, `tests/mutations.mjs`, `tests/research-*.mjs`, `tests/artifact-check.mjs`: the job's own harness. PartyBox uses its own suites.
- `PRODUCTION-SEALED-SHA256SUMS.txt`, `SHA256SUMS.txt`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`: job bookkeeping.

**The seal.** `tests/artifact-check.mjs` fails if `cpuPolicy.ts`, `types.ts` or `CONTRACT.md` change. This is deliberate: the two implementations were written without seeing each other, and the seal keeps that record honest. Do not edit these three files in the drops repo. Port them as copies, and keep the drops copies as the reference.

## Port steps

1. **Copy, do not edit.** Copy `cpuPolicy.ts` and `types.ts` into `games/party-world/server/`. Remove the `.js` suffixes (PartyBox uses extensionless imports). Keep the exports named (no default exports). Run the PartyBox lint: the file must have no `Date`, `Math.random`, module-level `let` or `var`, or `await`. It has none today.
2. **Difficulty mapping.** The drop has four levels (`easy`, `normal`, `hard`, `master`). PartyBox's bots have three (`BOT_SKILLS = ['easy', 'normal', 'sharp']`, `packages/shared/src/constants.ts`). Map `easy` to `easy`, `normal` to `normal`, and `sharp` to `hard`. Do not ship `master` (it would be a fourth level the `setBotSkill` action cannot select). Record the mapping in the game README.
3. **The rng adapter.** PartyBox's `Rng` is an object with `float()` (`packages/shared/src/rng.ts`), not a function. Pass `() => rng.float()`. Each decision draws exactly as the contract says (one draw when there is at least one eligible option, none otherwise). The engine supplies the rng to `sampleInput`, so confirm how that rng is seeded: replays must stay byte-identical (invariant 4). `pnpm sim --replay` checks it.
4. **Null on a bad rng.** `chooseBranch` returns `null` when the rng fails, even when affordable branches exist. The contract allows that, but a board must never stall. In the adapter, fall back to the first affordable branch, deterministically, and log the fallback. Items and shop return `null` for both "declined" and "rng failed", so the adapter cannot tell them apart. That is acceptable for a bot, because a decline is also a legal result. Record that choice.
5. **Build the state.** The host builds `State` from the live game: `coins`, `starPrice`, `starDistance` (null when no Star is in view), `starAvailable`, `turnsLeft`, `buddy`, and the `branches`, `inventory` and `shop` lists. Each `Action` needs `legal`, `cost`, `coinGain`, `starGain`, `movement`, `buddyGain` and `risk` in [0, 1]. Write one documented definition of `risk` for each board space and item, in the game README. No source gives these values, so they are design choices.
6. **Bot entry.** In `games/party-world/server/bot.ts`, export `sampleInput(state, playerId, rng, skill)`, as `GameBot` requires (`packages/shared/src/contract.ts`). It returns an `Input` the game's `inputSchema` accepts, or `null` when this player has nothing to do. The contract also requires the same state, rng and skill to give the same input. Call the policy for the decision that is due and map its ID back to an input. A `null` from the policy is a decline only if the phase's schema has an explicit decline input; otherwise return `null` and let the phase timer resolve it. Never return an input the phase would reject.
7. **Tests.** Port the 80 scenarios as one Vitest case each, with the expected choice and its arithmetic in the test name. Port the random-state property test with a fixed seed and the same legal-state generator. Add one test for the rng adapter (draw count) and one for the fallback in step 4.
8. **Measure the real game, not the toy.** The drop's toy board gives Hard a 99.3 to 99.7 percent win rate (seeds 1 to 3, 10,000 games each). That is a sanity floor (the test asserts at least 65 percent), not a balance target. Run `pnpm sim --game party-world --skills easy,normal,sharp --players 4 --runs 200 --seed 1` and set any target band from the sim results and a playtest, not from the toy.
9. **Docs and registry.** The bot section of `docs/games/party-world.md` (the contract rules, the four-to-three mapping, the risk definitions), `pnpm gen-registry`, and a CHANGELOG line.

## Make it feel AAA in PartyBox (not a 2D bootleg)

The bot is server-side and invisible. What a person sees is the CPU's turn, so make that turn read as deliberate:

- **A think beat.** A short, fixed pause before a CPU decision, with the active seat lifted and a small "thinking" mark on its chip. Choose the length in playtest. It is a presentation value, not a policy value, so do not put it in `cpuPolicy.ts`.
- **The choice reveals.** A CPU item is shown leaving its slot (`Burst` and a `reveal` cue), and a CPU branch shows the arrow it took. A person should read the decision in one glance.
- **Purchases.** A CPU Star purchase uses the same `wager` cue and coin arc as a human's, so the table cannot tell the difference by feel.
- **Reduced motion.** The think beat becomes instant. Nothing else changes.
- **Phones during CPU turns.** The phone shows the same `WaitingScreen` as during any other player's turn. Never reveal the CPU's choice on a phone before the TV does.

## Known gaps and risks

Must:
1. **The seal.** Copy the three sealed files; do not edit them in the drops repo.
2. **Difficulty mapping.** Four levels become three. Decide and record the mapping (step 2).
3. **Stall on a bad rng.** Without the fallback in step 4, a branch decision can return `null` and stall the turn.
4. **Balance target.** The toy's 99 percent Hard rate says nothing about the real board. Do not set a target from it.

Should:
5. **Typed decisions.** `null` means "declined" for items and shop, and also "rng failed". A typed result (`pick`, `decline`, `none`) would separate them. That would change the contract, so it belongs in PartyBox's own version and must come with its own tests.
6. **Design values are not evidence.** The exploration rates (1, 0.5, 0.1 and 0) and purchase rates (0.5, 0.85, 0.98 and 1) are tuned assumptions (CONTRACT.md says so). Label them as design values in PartyBox, and do not attribute them to Nintendo.
7. **Research gaps.** 24 per-difficulty rows (branch, item, shop, Star, Buddy and minigame, for each of four levels) are unverified. The drop's VERIFY records them as gaps; keep that record.
8. **Risk definitions.** The `risk` field and the `movement` values must come from PartyBox's real board. Until they are defined per space, the policy's bad-space avoidance is untested in the real game.

Nit:
9. The 65 percent floor in `tests/core.mjs` is a smoke test. Keep it, and say so next to the test.

## Verify after porting

- `pnpm verify`
- The ported unit tests: all 80 scenarios and the random-state property test, with a fixed seed.
- `pnpm sim --game party-world --skills easy,normal,sharp --players 4 --runs 200 --seed 1` and `--players 6`, with the random and idle bots as well.
- `pnpm sim --game party-world --replay <file>` for one failing seed, if any (determinism check).
- `pnpm e2e:snap --game party-world` (the CPU think beat and reveal, on TV and phone).
- The drop's own check, unchanged: `cd jobs/B06-cpu-policy && npm test`.

## Polish pass 2026-10-08 (Claude, cloud)

- Re-ran the full `npm test` on the unchanged code: exit 0 in 5 min 01 s. Per seed: 80 scenarios passed, 400,000 random legal states passed, Hard 9,971, 9,934 and 9,952 of 10,000 (seeds 1, 2, 3), 25 of 25 mutants killed each seed.
- Confirmed the seal: the hashes of `cpuPolicy.ts`, `types.ts` and `CONTRACT.md` match `PRODUCTION-SEALED-SHA256SUMS.txt`. None was edited.
- Reviewed `cpuPolicy.ts` against `CONTRACT.md` line by line: branch, item, shop and Star rules match, including the zero-turn, full-inventory, empty-list and bad-rng cases. No defect found. Ran no new code.
- Added this file, `DESIGN-DIGEST.md`, a status block at the top of the README, `NEXT.md`, and LOOP and VERIFY entries. Checksums regenerated for the changed files.
