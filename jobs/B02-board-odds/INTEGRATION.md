# B02 Board movement odds engine → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Ready to port** (`boardOdds.ts`, pure, verified). Port the tests as vitest (see Port steps 4). |
| Branch | `job/B02-board-odds` @ head of this branch (the commit that adds this file follows `0c7236c`, the die-key and adapter fix) · PR #4 · CI: green at `4ee574b` (read 2026-10-08); the polish head needs its own green run before merge |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B02-board-odds && npm ci --ignore-scripts --no-audit --no-fund && npm test` (about 9 min for seeds 1-3: 527 s on the loaded polish-pass box; the Python check needs `python3`) |
| Lands in PartyBox | new game `games/party-world/server/board-odds.ts` (the board game does not exist yet; see Port steps). Promote to `packages/game-sdk/src/board-odds.ts` only when a second game imports it (ADR-009 forbids cross-game imports). |

## What it is
`boardOdds(board, die, policy, target)` is a pure function over a directed board graph. For every start node it
returns exact BigInt-rational landing probabilities for every node, the probability that movement never ends
(`nonTermination`), and the expected number of visits to each shop-like pass-through node. Pass-through nodes
cost zero die steps; ordinary nodes cost one. Branch choice is uniform or "toward target" by edge-hop distance.
It is verified against a sealed independent reference, 25 mutants per seed, a literal path enumerator, and a
separate Python exact implementation (`tools/python_bruteforce.py`: 300 graphs per seed; seed 1 passed with
3,961 starts, 43,571 face comparisons and 1,558,733 landing values). Honest limit: it computes exact odds for the
model it is given; it does not know any game's rules.

## Take these files (the product)
| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `boardOdds.ts` | The module: `boardOdds`, `boardOddsByFace`, `dieFromFractions`, `rational`, `add`, `multiply`, `ZERO`, `ONE` | `games/party-world/server/board-odds.ts` (rename to kebab-case, keep it under ~300 lines; named exports only) |
| `README.md` (API sections only) | Semantics: pass-through cost, dead ends, `toward target` as hop distance, `nonTermination` | `docs/games/party-world.md` section "Board odds" (paraphrase; keep the semantics list) |

## Leave these (evidence, tooling, reports)
- `blind-reference.ts`, `blind-authoring/`, `reference.ts`, `INDEPENDENCE.md`, `PROOF.md`, `support.mjs`, `test.mjs`, `mutate.mjs`, `run.mjs`, `hashes.mjs`: they prove the module and stay in this repo. The port needs one vitest file (step 4), not this harness.
- `tools/`, `connect-b01.mjs`, `fixtures/`, `evidence/`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`: records, cross-checks, and fixtures only.
- The `.github/workflows/B02.yml` file stays in the drops repo.

## Port steps
1. Copy `boardOdds.ts` to `games/party-world/server/board-odds.ts`. It has no imports and no runtime dependency, so it passes the pure-server rules (no `Date`, `Math.random`, `Intl`, timers or module-level `let`). Check that `ZERO` and `ONE` stay `Object.freeze`d (they are frozen today).
2. Build the board. Model a board as `{ nodes: [{ id, kind, next, passThrough }] }`, generated from `content/` in the port (the owner's space-by-space data, not Nintendo's). Validate ids at content load with the same rules as the module (unique ids, `next` an array of known ids), then call the module. Do not rely on the module to report a typo in `target`: an unknown target silently falls back to uniform (documented, see Gaps).
3. Dice: use `dieFromFractions({ '1': '1/10', ... })` for the port's own table, or build `Map<number, Rational>` directly. Faces are nonnegative safe integers and weights must sum to exactly one.
4. Tests: add `games/party-world/__tests__/board-odds.test.ts` (vitest, the repo's runner) with the cases that matter for the game: a line board against the closed form, a shop loop with an exit (`P -> {P, A}`, expected passes at `P` = 1 from `P`), a dead end, an unreachable target, the nontermination example (`S -> {P, A}`, `P` a shop self-loop, landing `A` = 1/2), and a die whose weights sum to one. Keep the B02 golden fixtures for the port as a regression file if the team wants them.
5. Bot and turn use: the Party World bot should call `boardOdds` once per (board, die, policy, target) per turn and cache the result. Read `landing` for the start and rank candidate moves by it. Use `expectedPasses` for shop value. Compute on the server only (the module is server code; the client never imports it).
6. Docs in the same commit: `docs/games/party-world.md`, the `README.md` spec section, and a `CHANGELOG.md` line. If the module is promoted to the SDK later: `docs/sdk/board-odds.md` plus a README line in `packages/game-sdk`.
7. Registry and checks: `pnpm new-game party-world` (only when the game is scaffolded), then `pnpm gen-registry`, `pnpm verify`.

## Make it feel AAA in PartyBox (not a 2D bootleg)
This module has no screen. It decides what the TV and phones may show, so the look comes from the game:
- Beat → TV → phone: the roll starts on the TV (the die tumbles on the server clock, `Dice3d`-style, ADR-071; the 1–10 die needs a `faces` prop, the same extension the Shake Up drop needs). The phone shows the bot's or player's options as lit paths.
- Movement: each step hops along the path with a spring settle (game-pack motion rules, B18), a shop visit pops a Juice `Burst` and counts up coins, and a pass-through node shows its visit count as a number tick, not a text dump.
- Odds on screen (optional, party-friendly): show "about 1 in 3" or a coloured bar, never raw fractions. Keep the exact fractions for tests and the bot only.
- Camera (fx-lab F05, Monopoly's `camera3d.ts` and `choreo.ts`) follows the moving token; the board is a surface in perspective (CSS 3D or `table3d`, no second 3D library).
- Sound: a short tick per step and a chime on a shop, from `SOUND_CUES`; no sound on load.

## Known gaps and risks
Must:
1. **Unknown `target` IDs silently use uniform choice.** Documented and tested as "unreachable", not an error. The port must validate target IDs at content load (step 2). Changing this would alter the sealed reference, so it is a port-side guard.
2. **Output is O(nodes²) per call** (about 100 KB JSON for 40 nodes, 200 KB for 60, all starts). Keep it server-side; never serialize it to a phone. A single-start API is a reasonable follow-up (needs its own test pass against the reference).
3. **"Toward target" is edge-hop distance, not movement cost.** The owner must decide whether a board should steer by hops or by expected steps. The module implements hops and says so.

Should:
4. Exact arithmetic is tested to 60 nodes (about 4–30 ms here). Denominators grow with many branches; measure a real board before shipping and add a benchmark to the port's tests.
5. Gate and star semantics are not in the module (only `passThrough`). The game must map shops, stars, and gates to `passThrough` and decide what stopping on them means outside the odds.
6. The Python cross-check and the blind reference are evidence. Keep them in the drops repo.

Nits:
7. The module uses `Object.entries` and `Number(key)` for object dice; the canonical-key rule now rejects `'01'`-style keys. Keep the same rule in any content loader.

## Verify after porting
`pnpm verify`; the port's `board-odds.test.ts` (vitest project for the game); `pnpm sim --game party-world --players 6 --runs 200 --seed 1` once the game exists; `pnpm e2e:snap --game party-world`; `pnpm polish-check --game party-world`. Also rerun this job's `npm test` once in the drops repo to confirm the exact values the port relies on.

## Connection to the other satellite deliverables
- **B01** (dice): `dieFromFractions(b01.movement)` turns each B01 table into this module's die. The check is `connect-b01.mjs` against `fixtures/b01-odds.json`. The B01 port notes are `jobs/B01-jamboree-dice/INTEGRATION.md`; the table itself is not copied into the game by this job.
- **B04** (all Jamboree boards, space by space): the board graph input. Its `next` lists and `passThrough` flags are the shape this module expects.
- **B05** (turn flow) and **B03** (minigames): when a roll ends, and whether stopping on a shop or star ends movement. The module stops at the final ordinary step; turn flow owns anything after that.
- **B06** (CPU policy): the bot's move ranking reads `landing` and `expectedPasses` from this module.
- **B20** (other modes): reuses the same odds for any mode that moves on a board.

## Polish pass 2026-10-08 (Claude, cloud)
What this pass checked and changed (commands and results are in VERIFY.md):
- Malformed die keys were silently repaired (`''` became face 0; `'01'` plus `'1'` duplicated face 1). Fixed with canonical-key checks in `0c7236c`; 20 new invalid-input cases.
- Added `dieFromFractions`, a strict adapter for B01's exact "n/d" strings, and `connect-b01.mjs`, which proves that B01's dice reproduce exactly through B02.
- Added `tools/python_bruteforce.py` and `tools/independent-check.mjs`, a third, independent exact implementation, wired into `npm test` (300 graphs per seed) and CI (python3 version step).
- Measured runtime and output size (above); read the hosted CI for PR #4 at `4ee574b` (green).
