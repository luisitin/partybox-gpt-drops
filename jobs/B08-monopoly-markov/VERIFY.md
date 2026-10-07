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
