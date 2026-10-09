# Verification

Final local command: `cd jobs/B09-clue-solver && npm ci && npm test` (exit 0). The exact console output is in verification-output.log; raw measurements are in results.json. All original case counts and gates are retained.

| Test | Case count per seed | Passed | Seed | Exact command |
|---|---:|---|---|---|
| Fixed, malformed, contradictory, purity and analytical cases | 194 | All | 1 | `npm test` |
| Reduced deck literal enumeration vs production | 20,000 | All | 1 | `npm test` |
| Classic simulated games | 5,000 | All | 1 | `npm test` |
| Every classic game update independently compared | 45,266 | All | 1 | `npm test` |
| Sparse unknown-refuter six-player updates | 420 | All | 1 | `npm test` |
| 690-suggestion dense BigInt-mask exact count | 1 | All | 1 | `npm test` |
| Six-player timing gate (every call <=200 ms) | 11,795 | All | 1 | `npm test` |
| Fixed, malformed, contradictory, purity and analytical cases | 194 | All | 2 | `npm test` |
| Reduced deck literal enumeration vs production | 20,000 | All | 2 | `npm test` |
| Classic simulated games | 5,000 | All | 2 | `npm test` |
| Every classic game update independently compared | 44,878 | All | 2 | `npm test` |
| Sparse unknown-refuter six-player updates | 420 | All | 2 | `npm test` |
| 690-suggestion dense BigInt-mask exact count | 1 | All | 2 | `npm test` |
| Six-player timing gate (every call <=200 ms) | 11,714 | All | 2 | `npm test` |
| Fixed, malformed, contradictory, purity and analytical cases | 194 | All | 3 | `npm test` |
| Reduced deck literal enumeration vs production | 20,000 | All | 3 | `npm test` |
| Classic simulated games | 5,000 | All | 3 | `npm test` |
| Every classic game update independently compared | 45,247 | All | 3 | `npm test` |
| Sparse unknown-refuter six-player updates | 420 | All | 3 | `npm test` |
| 690-suggestion dense BigInt-mask exact count | 1 | All | 3 | `npm test` |
| Six-player timing gate (every call <=200 ms) | 11,796 | All | 3 | `npm test` |

Each seed includes 1,250 games for each of 3, 4, 5, and 6 players. Total: 60,000 reduced logs; 15,000 full classic games and 135,391 game updates; 1,260 sparse updates; three dense updates. Every successful random case checks exact ownership, category and hand-size conservation. Every simulated update gives all three true envelope cards positive probability. No envelope truth is passed to either solver. The reduced reference literally enumerates deals; classic cases are also compared to the independently authored reference. See INDEPENDENCE.md.

| Six-player local timing | Seed 1 | Seed 2 | Seed 3 |
|---|---:|---:|---:|
| p50 | 1.774928 ms | 1.896878 ms | 1.916553 ms |
| p99 | 7.063844 ms | 12.560378 ms | 13.985191 ms |
| maximum | 86.538105 ms | 180.504030 ms | 161.400834 ms |

The maximum includes game, sparse and dense cases; no warm-cache reuse, percentile substitution, GC exclusion, rerun replacement, or outlier removal is used. The initial implementation failed at 215.745 ms and was improved before this final rerun; LOOP.md preserves that history.

## Individually planted production bugs

Every mutant compiles under the strict production settings before behavioral comparison. Compiler failures abort the suite and never count as kills. Each of these 25 faults was planted alone, rejected, and discarded, for all three seeds (75/75 kills):

| Bug | Cases | Passed | Seeds | Exact command |
|---|---:|---|---|---|
| exclude-envelope | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| exclude-wrong-player | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| own-card-wrong-owner | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| known-owner-union | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| forbid-refuter | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| ignore-no-refuter-denials | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| ignore-refuter-disjunction | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| require-all-refuter-cards | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| reject-exact-full-hand | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| reject-exact-capacity-domains | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| wrong-clause-singleton-owner | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| missing-room-envelope | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| require-unsatisfied-refuter-constraints | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| merge-envelope-categories | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| memo-omits-envelope-state | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| drop-initial-refuter-constraints | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| never-satisfy-refuter-constraints | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| wrong-total-deal-count | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| increment-probability-numerator | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| reverse-player-probabilities | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| wrong-envelope-marginal | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| omit-prefix-multiplicity | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| collapse-prefix-multiplicity | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| shift-fixed-owner | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |
| wrong-clockwise-start | 3 individually seeded runs | Caught 3/3 | 1,2,3 | `node mutations.mjs` (also in `npm test`) |

Static checks: strict TypeScript build passes (`npm run build`); zero runtime dependencies and no `Math.random` or `Date.now` in production pass (`node mutations.mjs`); all committed artifact hashes pass (`sha256sum -c SHA256SUMS.txt`); whitespace validation passes (`git diff --check`); every deliverable is below 30 MB (largest: reference.ts, 23,984 bytes). These checks are deterministic.

## Hosted CI

The complete implementation and current full suite passed [GitHub Actions run 37635467292](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37635467292) at source-and-suite commit `99cf1e464339e176f26a0bccb89b6a0daf411558`. It ran all three seeds, all original counts, all 25 mutations per seed, and the unchanged 200 ms maximum gate. Raw hosted measurements are in hosted-results.json. Hosted six-player maxima were 14.680535 ms, 9.942586 ms, 19.007507 ms. The PR description links the check for the final evidence commit after its hosted run completes.

## UNVERIFIED

Timing outside the recorded cases, on other hardware or other runtimes, is not verified. The 200 ms test is empirical; the exact solver never switches to approximate counting.

## 2026-10-09 recovery observations

Whole original exact2b395 native full run37636605896/job112844372241 accepted09:40:48:29native inputs/24manifest,60000reduced logs,15000games/135391updates,1260sparse/3dense,25strict compiling variants with75seeded behavioral kills. Actual original artifact inventory is empty by workflow design; no archive proof claimed. Twelve actual malformed false successes were reproduced against the unchanged reference. After narrow shape repairs, strict TypeScript5.9.3 build and all three seeded206-case smoke suites passed09:49:47, retaining all original194fixed cases and12new invalid-shape regressions. All29inputs were frozen, and the retained original compiled solver actually accepts all12new malformed cases. No current local timing measurement. Complete raw streams/receipts, original native logs and failed observer attempts: `reports/recovery-20261009/`. Current exact-head hosted full random/timing/mutation proof and post-pass KEEP remain pending. Timing outside actual recorded seeded cases/hardware remains UNVERIFIED.


## Final validation repair handoff (2026-10-09)

Implementation source c47cdf5570896c0ca80869c2cfca8116d945db16 passed the complete original hosted workflow. The whole official archive and native log were independently accepted at 10:00:38 UTC: 60,000 reduced logs, 15,000 full games, 135,391 full updates, 1,260 sparse cases, three dense cases, 25 actually strict-compiled variants tested across three seeds (75 kills), 618 fixed cases and all 35,305 raw six-player timings. Recorded per-seed maxima were 15.252885000008973, 9.986858000018401 and 19.564508999988902 ms, each below the unchanged literal 200 ms maximum. Every raw sample, quantile, maximum, archive member and native result was checked; these are measured results for these tested logs and hosted hardware.

Three successful substantive no-gain reviews completed in actual order at 10:08:40, 10:11:48.625 and 10:15:44.158 UTC. The earlier failed observer attempt is preserved and never credited. The reviews cover 21 extra seeded validation reversion kills; 141 ordinary malformed-data differential checks plus 18 separate production accessor controls; and 294 valid/error calls checking exact closed-form deal counts, conservation and call-order purity. These checks supplement the original gates and do not inflate their counts. Full evidence, original failed observer output and the actual strict-compiled reversion modules are under reports/recovery-20261009/current-c47.

UNVERIFIED: the raw private independent reference's error-return behavior for caller-defined throwing accessors. It actually throws on the six probed effectful getters; production solveClue returned INVALID_INPUT. These production-only probes do not count as differential passes. The independent reference is unchanged and is not wrapped. The original mandatory plain-data gates remain intact.

No runtime, model, reference, contract, workflow, package, fixture or mandatory count changes were made after c47. This final handoff source must receive its own exact-head original hosted workflow and complete archive/native reader acceptance before supplemental PR26 can become Ready. Original Ready PR12 and canonical source 2b39550d395bab5ea0ad5c18cae19c3f78fdd84c remain preserved and unmerged.
