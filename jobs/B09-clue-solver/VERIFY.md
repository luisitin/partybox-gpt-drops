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
