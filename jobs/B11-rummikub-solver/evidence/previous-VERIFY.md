# B11 verification report

**Observed local result: `npm test` passed with seeds 1, 2 and 3; exit status 0.** Elapsed time: 221.893381 seconds. All reported receipts match the exact runtime/test-source hashes in `evidence/local-results.json`. Generated `dist/` files and temporary mutants are not delivery files.

## Reproduce

```sh
cd jobs/B11-rummikub-solver
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The full runner is serial and reruns every suite for each seed. A failure aborts the command. All individual commands below are run from the job directory after the strict build; the `npm test` command includes those builds automatically. `SEED` only controls test fixtures/order; production search itself needs no randomness.

## Executed suite ledger

| Test name | Seed | Cases | Passed | Exact command |
|---|---:|---:|---:|---|
| strict-TypeScript | 1 | 2 | 2 | `SEED=1 node node_modules/typescript/bin/tsc -p tsconfig.json` |
| hand-written | 1 | 61 | 61 | `SEED=1 node test/unit.mjs` |
| contracts-and-metamorphic | 1 | 1,004 | 1,004 | `SEED=1 node test/contracts.mjs` |
| physical-subset-brute-force | 1 | 50,000 | 50,000 | `SEED=1 node test/small.mjs` |
| full-state-key-large-differential | 1 | 200 | 200 | `SEED=1 node test/audit.mjs` |
| one-at-a-time-mutations | 1 | 25 | 25 | `SEED=1 node test/mutations.mjs` |
| 40-table-20-hand-latency | 1 | 200 | 200 | `SEED=1 node test/bench.mjs` |
| strict-TypeScript | 2 | 2 | 2 | `SEED=2 node node_modules/typescript/bin/tsc -p tsconfig.json` |
| hand-written | 2 | 61 | 61 | `SEED=2 node test/unit.mjs` |
| contracts-and-metamorphic | 2 | 1,004 | 1,004 | `SEED=2 node test/contracts.mjs` |
| physical-subset-brute-force | 2 | 50,000 | 50,000 | `SEED=2 node test/small.mjs` |
| full-state-key-large-differential | 2 | 200 | 200 | `SEED=2 node test/audit.mjs` |
| one-at-a-time-mutations | 2 | 25 | 25 | `SEED=2 node test/mutations.mjs` |
| 40-table-20-hand-latency | 2 | 200 | 200 | `SEED=2 node test/bench.mjs` |
| strict-TypeScript | 3 | 2 | 2 | `SEED=3 node node_modules/typescript/bin/tsc -p tsconfig.json` |
| hand-written | 3 | 61 | 61 | `SEED=3 node test/unit.mjs` |
| contracts-and-metamorphic | 3 | 1,004 | 1,004 | `SEED=3 node test/contracts.mjs` |
| physical-subset-brute-force | 3 | 50,000 | 50,000 | `SEED=3 node test/small.mjs` |
| full-state-key-large-differential | 3 | 200 | 200 | `SEED=3 node test/audit.mjs` |
| one-at-a-time-mutations | 3 | 25 | 25 | `SEED=3 node test/mutations.mjs` |
| 40-table-20-hand-latency | 3 | 200 | 200 | `SEED=3 node test/bench.mjs` |

The hand-written totals include the 40 joker cases; do not add those again to the 61. Each mutation executes all 61 tests; the mutation ledger counts 25 planted bugs rather than inflating the count to 1,525 assertions. Strict compilation covers two TypeScript files each pass. The metamorphic suite counts four contract tests and 1,000 transformed positions; the RNG contract internally compares 10,000 draws. Each latency pass also validates eight distinct warm-up calls: 8/8 passed for each seed, outside the 200 timed samples.

## Every hand-written test

For each row: one case per seed, **1/1 passed for each of seeds 1, 2, 3**. Exact commands are `SEED=1 node test/unit.mjs`, `SEED=2 node test/unit.mjs`, `SEED=3 node test/unit.mjs`. The same 61 cases execute in a separately seeded shuffled order.

| Test name | Seed 1 | Seed 2 | Seed 3 |
|---|---|---|---|
| J01: Leading joker can represent 1 | 1/1 | 1/1 | 1/1 |
| J02: Trailing joker can represent 13 | 1/1 | 1/1 | 1/1 |
| J03: Interior gap filled by joker | 1/1 | 1/1 | 1/1 |
| J04: Two consecutive jokers in a run | 1/1 | 1/1 | 1/1 |
| J05: Two endpoint jokers with one natural tile | 1/1 | 1/1 | 1/1 |
| J06: Two jokers in a three-tile group | 1/1 | 1/1 | 1/1 |
| J07: Two jokers in a four-tile group | 1/1 | 1/1 | 1/1 |
| J08: First absent color in a three-tile group | 1/1 | 1/1 | 1/1 |
| J09: Other absent color in a three-tile group | 1/1 | 1/1 | 1/1 |
| J10: Two joker bindings cannot duplicate a group color | 1/1 | 1/1 | 1/1 |
| J11: Joker group number must agree | 1/1 | 1/1 | 1/1 |
| J12: Joker cannot duplicate a natural group color | 1/1 | 1/1 | 1/1 |
| J13: Joker run color must agree | 1/1 | 1/1 | 1/1 |
| J14: An incorrectly bound joker does not bridge a gap | 1/1 | 1/1 | 1/1 |
| J15: No 13-to-1 wrap through a joker | 1/1 | 1/1 | 1/1 |
| J16: A joker cannot represent zero | 1/1 | 1/1 | 1/1 |
| J17: A joker cannot represent fourteen | 1/1 | 1/1 | 1/1 |
| J18: Unbound table joker is rejected | 1/1 | 1/1 | 1/1 |
| J19: The whole table may not contain three physical jokers | 1/1 | 1/1 | 1/1 |
| J20: One physical joker cannot occur in two melds | 1/1 | 1/1 | 1/1 |
| J21: Two distinct jokers may occur in separate melds | 1/1 | 1/1 | 1/1 |
| J22: A represented face does not count as a third physical numbered copy | 1/1 | 1/1 | 1/1 |
| J23: Three physical numbered copies remain illegal with a joker present | 1/1 | 1/1 | 1/1 |
| J24: Two jokers alone are not a meld | 1/1 | 1/1 | 1/1 |
| J25: Fractional joker bindings are invalid | 1/1 | 1/1 | 1/1 |
| J26: Exactly 30 opens; joker contributes 11, not 30 | 1/1 | 1/1 | 1/1 |
| J27: A 27-point joker opening fails | 1/1 | 1/1 | 1/1 |
| J28: Exactly 29 fails even across two sets | 1/1 | 1/1 | 1/1 |
| J29: Opening turn cannot also extend the table | 1/1 | 1/1 | 1/1 |
| J30: Opening cannot retrieve an old table joker | 1/1 | 1/1 | 1/1 |
| J31: Opening preserves the explicit bindings of old jokers | 1/1 | 1/1 | 1/1 |
| J32: One rack tile anywhere on turn suffices for joker retrieval | 1/1 | 1/1 | 1/1 |
| J33: The other absent group color also retrieves the joker | 1/1 | 1/1 | 1/1 |
| J34: A shifted run can free a joker without an exact-number replacement | 1/1 | 1/1 | 1/1 |
| J35: Splitting the old run can free its interior joker | 1/1 | 1/1 | 1/1 |
| J36: Dissolving a joker run into other groups is allowed | 1/1 | 1/1 | 1/1 |
| J37: A retrieved joker cannot return to the rack | 1/1 | 1/1 | 1/1 |
| J38: A foreign joker cannot replace an owned one | 1/1 | 1/1 | 1/1 |
| J39: Table-only rearrangement is not a play | 1/1 | 1/1 | 1/1 |
| J40: Both table jokers may be rearranged in one legal turn | 1/1 | 1/1 | 1/1 |
| S01 three-color group | 1/1 | 1/1 | 1/1 |
| S02 short natural run | 1/1 | 1/1 | 1/1 |
| S03 exactly 30 opening with joker | 1/1 | 1/1 | 1/1 |
| S04 under-30 is pass | 1/1 | 1/1 | 1/1 |
| S05 only rack value counted when extending table | 1/1 | 1/1 | 1/1 |
| S06 old table tiles are mandatory, not optional | 1/1 | 1/1 | 1/1 |
| S07 a long run is not lost by short-run enumeration | 1/1 | 1/1 | 1/1 |
| S08 full rearrangement across colors | 1/1 | 1/1 | 1/1 |
| S09 prefer highest legal joker binding | 1/1 | 1/1 | 1/1 |
| S10 two rack jokers in high group | 1/1 | 1/1 | 1/1 |
| S11 two rack jokers in low run | 1/1 | 1/1 | 1/1 |
| S12 distinguish rack joker from table joker | 1/1 | 1/1 | 1/1 |
| S13 duplicate natural copies | 1/1 | 1/1 | 1/1 |
| S14 standalone 13-tile run | 1/1 | 1/1 | 1/1 |
| S15 no move with empty hand | 1/1 | 1/1 | 1/1 |
| S16 empty position | 1/1 | 1/1 | 1/1 |
| S17 opening cannot borrow old table | 1/1 | 1/1 | 1/1 |
| V01 identity conservation even when resulting faces make valid sets | 1/1 | 1/1 | 1/1 |
| V02 duplicate ID across table and hand | 1/1 | 1/1 | 1/1 |
| V03 malformed JSON-shaped inputs never throw | 1/1 | 1/1 | 1/1 |
| V04 106 physical tiles accepted by inventory validation | 1/1 | 1/1 | 1/1 |

## Contract subtests

- `rummikub.ts: no runtime imports or ambient clocks/randomness`: 1/1 per seed, seeds 1/2/3; `SEED=<seed> node test/contracts.mjs`.
- `reference.ts: no runtime imports or ambient clocks/randomness`: 1/1 per seed, seeds 1/2/3; `SEED=<seed> node test/contracts.mjs`.
- `strict compiler settings and zero runtime dependencies`: 1/1 per seed, seeds 1/2/3; `SEED=<seed> node test/contracts.mjs`.
- `seeded RNG determinism and range for 10000 draws`: 1/1 per seed, seeds 1/2/3; `SEED=<seed> node test/contracts.mjs`.

The additional 1,000 cases per seed rename IDs, rotate colors, reverse rack/meld order and repeat calls. They compare primary and brute-force optimum value/count and run both validators on every returned table. Frozen inputs guard against accidental mutation. The selected static AST checks are not a formal purity proof.

## Exact brute-force comparison

50,000 generated positions per seed, **150,000/150,000 passed**. Every position contains at most 14 physical tiles. The oracle enumerates physical subsets and partitions independently of the production candidate generator. Both exact integer values and played tile counts match; both validators check both returned tables and actual plays. No tolerance or floating-point optimum is used.

Ten stratified generator families include openings, natural and joker-heavy hands, table extensions, rearrangements, duplicate copies and long runs. Samples are generated with replacement, not represented as an enumeration of every possible small position. The corpus hashes and histograms are in the JSON evidence.

## Large-table performance and differential audit

Machine: AMD EPYC 9V74 80-Core Processor; linux/x64; Node v22.16.0. Each timed input has exactly 40 old table tiles and 20 rack tiles. Times use a monotonic test-only timer around the entire production call, including its own input validation, search, reconstruction and output validation. Additional reference validation is outside the timer. No previously solved input is used for warm-up, and no cross-call memo survives.

| Seed | Timed cases passed | p50 ms | p99 ms | Maximum ms |
|---|---:|---:|---:|---:|
| 1 | 200/200 | 8.993883 | 114.710225 | 179.630259 |
| 2 | 200/200 | 8.183629 | 84.221543 | 120.530901 |
| 3 | 200/200 | 8.667487 | 74.686406 | 274.606131 |

Quantiles are nearest-rank (`ceil(p*n)-1`), not interpolated. Both p99 and maximum are hard test gates at 500 ms. `evidence/latency.csv` includes every measured latency, value and played count. Results vary across machines/runs.

The **same 600 benchmark positions** also passed a differential audit using full-inventory string memo keys and a built-in Map in place of the compressed key/custom memo. Both optimum value/count and the deterministic table witness match. Corpus hashes match the latency corpus for each seed. That audit is mechanically derived search logic, not independently authored brute force.

## Mutations, integrity and implementation history

`MUTATIONS.md` lists all 25 bugs and actual killing tests for all seeds. **75/75** mutants compiled strictly and were killed by semantic assertion failures. No survivor, compile error or timeout was credited as a kill.

The final delivery manifest was separately checked three times with `SEED=1 node test/checksums.mjs`, `SEED=2 node test/checksums.mjs`, and `SEED=3 node test/checksums.mjs`. The manifest covers all delivery files except itself, including the root workflow. Adding documentation/evidence after the full run did not change runtime or test sources. The initial full-run manifest covered 23 pre-evidence files; the final manifest covers 25 files.

During development, an earlier search version exceeded the latency requirement; one later pre-indexing run measured 547.187349 ms. These are not hidden as passing results. The final joker-availability indexing version was rerun with the entire command above. An initially malformed M18 mutant failed strict compilation and was corrected before the successful mutation runs; that compile failure was not counted.

## UNVERIFIED

**Blind independent authorship:** not achieved. The reference was written first and uses different representations/algorithms with no production imports, but both implementations were authored by the same assistant in the same session. This does not satisfy “written without looking at each other” by separate isolated authors.

**Independent exhaustive optimality for large positions:** not established. The physical-subset oracle is limited to 14 total tiles. Large results have independent legality checks and the derived full-state memo comparison, not a second independently exhaustive solver.

**Universal 500 ms bound:** not established for every valid 40+20 input, every runtime, every machine, or every cold-start condition. The finite measured corpus passed; the production exact search is deliberately unbounded rather than returning an unproved approximation on timeout. The informal algorithm argument is not a machine-checked proof of correctness.

**Clean local dependency installation:** container DNS prevented a fresh registry install. Local runs used preinstalled TypeScript 5.8.3 via a development symlink (not shipped). The lockfile release/integrity was checked against the official registry. CI is configured to perform a fresh `npm ci`; its outcome must be observed separately.

**GitHub Actions status at this local evidence snapshot:** not yet observed. A workflow file and successful local tests are not a green run. The PR description must record the actual run URL and conclusion after GitHub executes it; never substitute an invented link.

**Edition-neutral rule compliance and hostile JavaScript objects:** not claimed. The English rule profile is explicit, incompatible official-language details are in `CONFLICTS.md`, and validation targets ordinary JSON-shaped values. The English manual page-4 diagram screenshot was blocked; parsed text was available and the German diagram was inspected. A full game engine, timers, draw rules and intermediate animation steps are outside this module, not silently simulated.
