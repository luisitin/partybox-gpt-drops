# B08 observed verification

Full local `npm test` passed on Node v24.19.0 with pinned TypeScript 5.8.3. Fresh installation `npm ci --ignore-scripts --no-audit --no-fund` passed; runtime dependencies are empty. The full command runs all suites with the same unabridged counts for seeds 1, 2, 3. No seed was discarded or replaced.

| Test | Cases per seed | Passed | Seeds | Exact component command |
| --- | ---: | --- | --- | --- |
| Strict production/blind build | 3 TypeScript modules, all committed strict flags | yes | shared build for all seed suites | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Authoring/source/deliverable integrity | 3 authoring seals, all inventoried files, 17 before/after execution source hashes | yes | each full run | `npm test` and `node hashes.mjs` |
| Exact independent transition differential | 28,800 integer cells; 240 exact row totals | yes | 1,2,3 | `node test.mjs <seed>` |
| Power/linear stationary differential | 240 states; 80 roll + 80 turn projections; 2 normalizations each | yes | 1,2,3 | `node test.mjs <seed>` |
| Complete source property fixture | 28 properties, all prices/build costs/rents/names/colors | yes | 1,2,3 | `node test.mjs <seed>` |
| Blind special-card/ROI differential | 348 ownership/build scenarios; 160 labelled special-arrival masses | yes | 1,2,3 | `node test.mjs <seed>` |
| Two required Butler published tables | 160 square values, both strategies, tolerance 1e-4 | yes | 1,2,3 | `node test.mjs <seed>` |
| Additional Collins published table | 80 values: 79 within 1e-4; one documented maximum-stay Jail gap | diagnostic recorded, all 40 ASAP pass | 1,2,3 | `node test.mjs <seed>` |
| Poisson sampling-variance solve | 80 square variances; 9,600 equation residuals | yes, residual below 1e-12 | 1,2,3 | `node test.mjs <seed>` and simulation |
| Direct dice/card simulation | 200,000,000 counted rolls; 80 square four-sigma checks | yes | 1,2,3 | `node simulate.mjs <seed>` |
| Isolated strict/runtime mutation checks | 25 strict compilations and 25 runtime kills | yes | 1,2,3 | `node mutate.mjs <seed>` |
| Computed delivered outputs | 80 roll/80 turn square values, 240 states, 348 ROI rows | yes | each full run | `node export.mjs` |

Each exact suite passed 37,981 assertions (113,943 across the three seeds). ROI numeric fields use relative tolerance 1e-12 scaled by max(1, absolute expected value); probability comparisons use absolute 1e-12.

Three seed suites comprise 86,400 exact cells, 720 stationary states, 1,044 ROI scenarios, 600,000,000 simulated movement rolls, 240 statistical square checks and 75 strictly compiled runtime-killed mutants. Published comparisons examine 720 values: 717 within 1e-4 and the same known Collins maximum-stay Jail gap in each seed. All 480 required Butler comparisons pass. There is no accepted gap between the independently authored implementations.

Power/linear maximum state differences: 9.194034422677078e-16 (ASAP), 8.847089727481716e-16 (maximum stay), below 1e-12. Power stationary residuals: 3.469446951953614e-17 and 2.7755575615628914e-17; 197 and 255 iterations. Butler roll maximum errors: 4.782849027e-9 and 6.875744224e-9; turn errors: 4.964513661e-10 and 4.994465015e-10. Collins ASAP maximum error 1.146819755e-6; maximum-stay aggregate Jail error 0.00068354687574421 (`CONFLICTS.md`).

| Seed | ASAP largest simulation deviation | Maximum-stay largest deviation |
| --- | ---: | ---: |
| 1 | 1.9794398221 sigma | 2.3897315455 sigma |
| 2 | 2.5024991114 sigma | 1.5708221816 sigma |
| 3 | 2.1157739420 sigma | 2.1360733084 sigma |

Every square is below the predeclared four standard deviations. Standard deviations use the Markov-chain Poisson variance, accounting for correlated jail and doubles observations. Each sample has a fixed 10,000 uncounted burn-in rolls. The largest Poisson residual is 2.8171909249863347e-15. See `PROOF.md` for the method and statistical scope.

## Raw evidence and mutations

`reports/summary.json`, `reports/exact-seed-*.json`, `reports/simulation-seed-*.json`, `reports/mutations-seed-*.json` and `reports/full-run.log` preserve the successful full local run. Every mutant record lists its name, strict compilation success and actual runtime failure. The 25-site list and one-site replacement text is in `mutate.mjs`; compiler errors fail the suite and are never credited as kills. Original production source remains unchanged after every mutant and full run.

Pre-exchange self-checks are additional archived evidence: production 30,494, blind transition/linear 1,217 and blind ROI 290. Original drivers, reports and seals are preserved; they are not substituted for the full integrated run. Production and both blind sources retain their original sealed hashes.

## CI

`.github/workflows/B08.yml` performs a fresh locked install on Node 22.16.0, runs the same full `npm test` and uploads complete `.verification/` evidence. The PR description records the observed green run and exact final head after completion. Observed green full run: [37642906455](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37642906455), head `fded37c9d208377386c0b1730eb90b487a10406f`, Node v22.16.0, TypeScript 5.8.3. The complete logs and metadata are preserved in `reports/github-fded37c.log` and `.json`: fresh install, 54-file hash checks at both boundaries, all three seeds, 600M rolls and 75 strict/runtime kills actually ran. A further full workflow run verifies this evidence-documentation commit; its actual final head and green run URL are recorded in [PR14](https://github.com/luisitin/partybox-gpt-drops/pull/14). No reduced-count CI or historical run is treated as final-head evidence.

## UNVERIFIED

Physical rotating decks, held/used GOJF, other US editions, competitive ownership/payment/bankruptcy policies and net-profit forecasting are outside the specified IID/gross-rent model and have not been verified by these results.

## Polish pass 2026-10-08

Claude (cloud). Added the PartyBox-facing `boardOdds.ts` and its suite; no sealed file changed (the authoring seals and `PRODUCTION-SEALED-SHA256SUMS.txt` still verify in every run).

- **Full run:** `rm -rf node_modules build && npm ci --ignore-scripts --no-audit --no-fund && npm test` at `9689ac0` (Node v22.22.0, TypeScript 5.8.3). It took 1 min 32 s locally and passed. Every earlier suite reproduces its recorded numbers exactly: 37,981 exact assertions per seed, the same simulation maxima (seed 1: 1.9794 / 2.3897 sigma) and 75/75 solver mutants killed. Raw evidence: `reports/polish-2026-10-08/` (`summary.json`, `partybox-seed-*.json`, `full-run.log`).
- **PartyBox suite** (`node partybox.mjs <seed>`, run inside `npm test`):

| Seed | Exact assertions | Fuzz cases | Max \|z\| leave ASAP | Max \|z\| stay max | Mutants killed |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 24,023 | 20,000 | 2.0857 | 2.8009 | 20/20 |
| 2 | 24,023 | 20,000 | 2.6056 | 3.0767 | 20/20 |
| 3 | 24,023 | 20,000 | 2.5419 | 3.6393 | 20/20 |

  - **Exact:** the tables match the sealed solver bit for bit, and all 348 `roi.csv` rows per seed are reproduced through the PartyBox-shaped API within 1e-12. The movement-dice weights match the sealed transition counts cell by cell (120 states × 2 utilities × 2 plans).
  - **Simulation:** 20M rolls per plan per seed of what `simulate.mjs` never measured: turn ends overall and per square, the nearest-railroad and nearest-utility card arrivals, and the movement dice summed at each utility. 48 statistics per plan from 200 batch means, against a predeclared |z| ≤ 4.5; exact zeros (turn ends on 30) must be zero. Simulated rolls per turn at seed 1: 1.186754 vs exact 1.186624 ('leave ASAP'), 1.165897 vs 1.165896 ('stay max').
  - **Mutants:** P01–P20, each strictly compiled through the TypeScript API, each failing `verifyBoardOdds()`. Equivalent mutants (guards made redundant by the final clamp) were not planted.
  - Totals: 1,044 ROI rows, 120M simulated rolls, 288 statistics and 60 killed mutants. With the original suite that makes 720M simulated rolls and 135 killed mutants.
- **PartyBox fit (one-off, not in `npm test`):**
  - Edition data: against luisitin/partybox `main` @ `26b85ba6`, the classic-us, classic-1999 and classic-us-legacy editions have the same 28 deeds (kind, price, building cost, rents), the same rent rules and the same movement cards (10 Chance, 2 Community Chest; 16 per deck) as B08's data. `rentPerOpponentTurn` differs by 0 on edition data.
  - Lint and types: a temporary copy at `games/monopoly/server/board-odds.ts` passed PartyBox's prettier and ESLint, and `tsc` under `tsconfig.base.json`. The copy was then removed.
- **Rule reading:**
  - PartyBox charges ordinary utility arrivals on the movement dice (`flow.ts:125`). A nearest-utility card arrival throws fresh dice (`flow.ts:126-131`, `cards.ts:47-55`), so `boardOdds.ts` models that by default.
  - Exact effect of the movement dice on one-utility rent, compared with a fresh throw: −1.33% / −4.98% at position 12, +0.83% / +0.70% at position 28 ('leave ASAP' / 'stay max'). The mean movement dice on an ordinary arrival at 12 are 6.878 / 6.550.
- **Preview:** `preview/hottest-squares.html` rendered in Chromium (Playwright) with no console errors at 1920×1080 (en, es, plan toggle, intro frames), 390×844 (en, es) and 1280×720 with reduced motion.

## Independent review 2026-10-08

Reviewer: Claude (cloud), who did not write the polish pass. Branch `job/B08-monopoly-markov` at `9e54f29` (fetched; no other commits). Scope: the six Claude commits since `e090828` touch only `jobs/B08-monopoly-markov/**`. No file was deleted, and `.github/workflows/B08.yml` is unchanged in that range.

- **Tests:** `rm -rf node_modules build .verification && npm ci --ignore-scripts --no-audit --no-fund && npm test` on Node v22.22.0 exited 0. Every suite passed: 24,023 PartyBox exact assertions per seed, 600M + 120M simulated rolls, 75 + 60 killed mutants, 67 files hash-verified. PR #14's `verify` check on `9e54f29` is green (run 37795796856).
- **PartyBox lint and types** (stdin against `/home/user/partybox`, nothing written there): `boardOdds.ts` passes PartyBox's ESLint (`games/**/server` purity rules, `max-lines` 300 after skipping comments and blanks), prettier (no diff) and `tsc` under `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`).
- **Numbers, recomputed from PartyBox's own data:** all 348 `roi.csv` rows match `rentPerOpponentTurn` on the `classic-us` edition (utility rows with `utilityDice: 'fresh'`) to 2e-16 relative. The three editions have identical street, railroad and utility facts and rent rules, and each has 10 Chance and 2 Community Chest movement cards. B08's `us-properties.json` agrees with the classic-us streets (22 of 22). Illinois at level 3 gives 28.3523. `hottestSquares(3)` is [10, 24, 0]. Orange is 8.81%, red 8.76%, yellow 7.97%. Go To Jail is 0. Per-roll and per-turn sums are 1 within 4e-16. `cards.ts:47-55` is the nearest railroad and utility branch.
- **Preview:** rendered in Chromium at 1920×1080 (en; es with `plan=stay`) and 390×844 (en; es). No console errors and no overflow. Labels, percentages and the "1 move in 16" and "1 de cada 9" figures are right. Not re-rendered: 1280×720 with reduced motion.
- **Fixed in this review:**
  - README listed `utilityCardDice`, which the 688d59e model fix removed. Its headline sentence now names the step it means.
  - INTEGRATION said `boardOdds.ts` is 320 lines; it is 306.
  - Two paths were incomplete: `choreo.ts` is `server/choreo.ts`, and `jail.ts` is `server/phases/jail.ts`.
  - The CI row now states the exact green run.
  - The 20-of-22 claim is the single 2→3 step (`partybox-checks.mjs:126-129`). The bot ranks by the average to three houses, so "takes groups to three houses first" is marked unverified.
  - "The phone chunk is near its budget" was never measured. It now says so and gives the command.
- **Left open (not fixable inside this job):** the bot wiring; `InitContext.botSkill`, which `packages/shared/src/contract.ts` does not have; the Speed Die; the one-attempt jail; and the utility-rent variant decision. PR #14's body still cites `e090828`, 56 files and a Node 24 run. It is stale and was not edited.
- **Verdict:** approve-with-fixes. The model, its tests and the port file hold up against PartyBox. The fixes above were the only problems found in the claims.
