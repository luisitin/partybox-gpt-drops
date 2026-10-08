# B02 verification — observed local results

**PASS:** the integrated single `npm test` command completed with exit code **0**, with full seeds **1, 2, 3**, using the unchanged sealed blind reference for every required comparison. Local runtime: Node.js **v24.19.0**; TypeScript **5.8.3**. No reduced/smoke option was used. Every source hash recorded by the runner matches the delivered file listed there.

GitHub independently completed the same integrated full suite successfully at code milestone `fc7f7b8a5476f0e20d3f65d1478c166b75f1d41c`: [observed green run 37635686808](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37635686808). Fresh locked `npm ci` succeeded there. The run metadata and completed logs were read back, including all three seeds, graph counters, 150 million trajectories, and 75 runtime mutation kills. The final documentation head is checked separately and its observed run is linked in PR #4.

## Exact commands actually executed

From `jobs/B02-board-odds/`: `npm test`. For each seed S = 1, 2, 3 the runner executed, in order:

```sh
node hashes.mjs
node node_modules/typescript/bin/tsc -p tsconfig.json
node test.mjs --seed S
node mutate.mjs --seed S
```

Here `S` is replaced literally by `1`, `2`, and `3`; the fully expanded commands and exit codes are in `evidence/local-runs.json`. All 12 subprocess invocations exited 0. Integrity and strict compilation each ran three times. Each strict compilation covered production, the sealed blind reference, and the historical supplemental oracle; each mutation additionally passed strict type checking before its runtime test.

## Recorded case counts

A graph/policy/face case compares **every start** and every physical landing/pass-through entry. The production binary-power API, its stepwise table API, and the separately implemented oracle are compared exactly, not within a tolerance. The start/face counts below count each start once per graph, policy, and face; they do not inflate counts for checking two production entry points.

| Suite | Seed | Cases | Passed | Exact command |
| --- | ---: | --- | --- | --- |
| Named regression fixtures | 1 | 24 graphs; 336 graph/policy/face-or-mixture cases | PASS | `node test.mjs --seed 1` |
| Seeded exact arithmetic | 1 | 1000 rational pairs; 3 assertions per pair | PASS | `node test.mjs --seed 1` |
| Direct regression assertions | 1 | 24 | PASS | `node test.mjs --seed 1` |
| Malformed-input rejection | 1 | 16 | PASS | `node test.mjs --seed 1` |
| Runtime dependency / forbidden-entropy / implementation import guards | 1 | 2 source files; empty runtime dependency set | PASS | `node test.mjs --seed 1` |
| random-acyclic-brute-force | 1 | 2,000 graphs; 44,000 graph/policy/face cases; 576,576 start/face checks | PASS | `node test.mjs --seed 1` |
| random-acyclic-brute-force — exact die mixtures | 1 | 4,000 graph/policy mixtures | PASS | `node test.mjs --seed 1` |
| random-acyclic-brute-force — order invariance | 1 | 4,000 node/edge permutations | PASS | `node test.mjs --seed 1` |
| random-acyclic-brute-force — literal path enumeration | 1 | 44,000 graph/policy/face cases; 1,400,694 terminal paths | PASS | `node test.mjs --seed 1` |
| cyclic-graphs | 1 | 500 graphs; 11,000 graph/policy/face cases; 153,670 start/face checks | PASS | `node test.mjs --seed 1` |
| cyclic-graphs — exact die mixtures | 1 | 1,000 graph/policy mixtures | PASS | `node test.mjs --seed 1` |
| cyclic-graphs — order invariance | 1 | 1,000 node/edge permutations | PASS | `node test.mjs --seed 1` |
| cyclic-graphs — literal path enumeration | 1 | 5,500 graph/policy/face cases; 734,049 terminal paths | PASS | `node test.mjs --seed 1` |
| Seeded simulated roll trajectories | 1 | 50 boards × 1,000,000 = 50,000,000 rolls | PASS | `node test.mjs --seed 1` |
| Landing-outcome four-sigma tests | 1 | 706 | PASS | `node test.mjs --seed 1` |
| Pass-mean four-sigma tests | 1 | 235 | PASS | `node test.mjs --seed 1` |
| Exact second-moment enumeration | 1 | 4,239 terminal paths | PASS | `node test.mjs --seed 1` |
| Mutation strict compilation + runtime kill | 1 | 25 isolated mutants; 25 compiled; 25 killed | PASS | `node mutate.mjs --seed 1` |
| Named regression fixtures | 2 | 24 graphs; 336 graph/policy/face-or-mixture cases | PASS | `node test.mjs --seed 2` |
| Seeded exact arithmetic | 2 | 1000 rational pairs; 3 assertions per pair | PASS | `node test.mjs --seed 2` |
| Direct regression assertions | 2 | 24 | PASS | `node test.mjs --seed 2` |
| Malformed-input rejection | 2 | 16 | PASS | `node test.mjs --seed 2` |
| Runtime dependency / forbidden-entropy / implementation import guards | 2 | 2 source files; empty runtime dependency set | PASS | `node test.mjs --seed 2` |
| random-acyclic-brute-force | 2 | 2,000 graphs; 44,000 graph/policy/face cases; 568,524 start/face checks | PASS | `node test.mjs --seed 2` |
| random-acyclic-brute-force — exact die mixtures | 2 | 4,000 graph/policy mixtures | PASS | `node test.mjs --seed 2` |
| random-acyclic-brute-force — order invariance | 2 | 4,000 node/edge permutations | PASS | `node test.mjs --seed 2` |
| random-acyclic-brute-force — literal path enumeration | 2 | 44,000 graph/policy/face cases; 1,369,925 terminal paths | PASS | `node test.mjs --seed 2` |
| cyclic-graphs | 2 | 500 graphs; 11,000 graph/policy/face cases; 149,534 start/face checks | PASS | `node test.mjs --seed 2` |
| cyclic-graphs — exact die mixtures | 2 | 1,000 graph/policy mixtures | PASS | `node test.mjs --seed 2` |
| cyclic-graphs — order invariance | 2 | 1,000 node/edge permutations | PASS | `node test.mjs --seed 2` |
| cyclic-graphs — literal path enumeration | 2 | 5,500 graph/policy/face cases; 1,080,031 terminal paths | PASS | `node test.mjs --seed 2` |
| Seeded simulated roll trajectories | 2 | 50 boards × 1,000,000 = 50,000,000 rolls | PASS | `node test.mjs --seed 2` |
| Landing-outcome four-sigma tests | 2 | 608 | PASS | `node test.mjs --seed 2` |
| Pass-mean four-sigma tests | 2 | 177 | PASS | `node test.mjs --seed 2` |
| Exact second-moment enumeration | 2 | 11,972 terminal paths | PASS | `node test.mjs --seed 2` |
| Mutation strict compilation + runtime kill | 2 | 25 isolated mutants; 25 compiled; 25 killed | PASS | `node mutate.mjs --seed 2` |
| Named regression fixtures | 3 | 24 graphs; 336 graph/policy/face-or-mixture cases | PASS | `node test.mjs --seed 3` |
| Seeded exact arithmetic | 3 | 1000 rational pairs; 3 assertions per pair | PASS | `node test.mjs --seed 3` |
| Direct regression assertions | 3 | 24 | PASS | `node test.mjs --seed 3` |
| Malformed-input rejection | 3 | 16 | PASS | `node test.mjs --seed 3` |
| Runtime dependency / forbidden-entropy / implementation import guards | 3 | 2 source files; empty runtime dependency set | PASS | `node test.mjs --seed 3` |
| random-acyclic-brute-force | 3 | 2,000 graphs; 44,000 graph/policy/face cases; 568,810 start/face checks | PASS | `node test.mjs --seed 3` |
| random-acyclic-brute-force — exact die mixtures | 3 | 4,000 graph/policy mixtures | PASS | `node test.mjs --seed 3` |
| random-acyclic-brute-force — order invariance | 3 | 4,000 node/edge permutations | PASS | `node test.mjs --seed 3` |
| random-acyclic-brute-force — literal path enumeration | 3 | 44,000 graph/policy/face cases; 1,388,665 terminal paths | PASS | `node test.mjs --seed 3` |
| cyclic-graphs | 3 | 500 graphs; 11,000 graph/policy/face cases; 145,772 start/face checks | PASS | `node test.mjs --seed 3` |
| cyclic-graphs — exact die mixtures | 3 | 1,000 graph/policy mixtures | PASS | `node test.mjs --seed 3` |
| cyclic-graphs — order invariance | 3 | 1,000 node/edge permutations | PASS | `node test.mjs --seed 3` |
| cyclic-graphs — literal path enumeration | 3 | 5,500 graph/policy/face cases; 511,497 terminal paths | PASS | `node test.mjs --seed 3` |
| Seeded simulated roll trajectories | 3 | 50 boards × 1,000,000 = 50,000,000 rolls | PASS | `node test.mjs --seed 3` |
| Landing-outcome four-sigma tests | 3 | 691 | PASS | `node test.mjs --seed 3` |
| Pass-mean four-sigma tests | 3 | 245 | PASS | `node test.mjs --seed 3` |
| Exact second-moment enumeration | 3 | 2,920 terminal paths | PASS | `node test.mjs --seed 3` |
| Mutation strict compilation + runtime kill | 3 | 25 isolated mutants; 25 compiled; 25 killed | PASS | `node mutate.mjs --seed 3` |

All randomized graph suites use faces **0 through 10 inclusive**, both policies, and every start node. The 2,000 main graphs per seed are DAGs with 1–25 nodes. Each 500-graph cyclic suite has 2–25 nodes: 250 graphs with step-consuming cycles are also brute-force enumerated; 250 permit zero-step cycles and are compared through exact loop resummation. Every generated board has a cycle before target-policy filtering in the cyclic family.

Physical landing probabilities plus explicit `nonTermination` sum to exactly 1 on every tested start/face and mixture result. Finite probabilities/expectations are checked for nonnegativity and canonical reduction. The literal path enumerator is not used to pretend that infinitely many zero-cost cyclic paths form a finite list.

## Simulation bounds

Each seed used 50 boards and exactly 1,000,000 complete trajectories **per board**, for **150,000,000 official trajectories** total. Each board used one fixed start; exhaustive all-start coverage is supplied by the exact differential suites, not by 1,000,000 simulations for every individual start. Both implementations and finite-path enumeration are cross-checked for the simulation cases. The simulator independently follows edges, with no cutoff, no sampled engine CDF, no seed replacement, and no broadened tolerance.

| Seed | Rolls | Landing outcomes checked | Pass means checked | Largest landing z | Largest pass-mean z | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 50,000,000 | 706 | 235 | 3.414772810506 | 2.057548703890 | PASS |
| 2 | 50,000,000 | 608 | 177 | 2.813716536896 | 2.813716536896 | PASS |
| 3 | 50,000,000 | 691 | 245 | 3.278256273802 | 2.921021740703 | PASS |

Four-sigma decisions use exact BigInt inequalities, including zero-tolerance checks for impossible/deterministic outcomes. The printed z-scores are descriptive floating-point values only. Every comparison passed. Pass-count variances came from exact enumerated second moments, not estimated sample variance. The simulation family excludes zero-step cycles; those are checked by exact solvers and the named regressions.

## Named regression fixture inventory

Each named graph below runs both policies, faces 0–5, and a mixed die: 14 cases per graph per seed. Commands: `node test.mjs --seed 1`, `node test.mjs --seed 2`, `node test.mjs --seed 3`. Every listed fixture passed all three seeds.

| Fixture | Cases per seed | Passed seeds |
| --- | ---: | --- |
| `empty` | 14 | 1, 2, 3 |
| `sink` | 14 | 1, 2, 3 |
| `pass-sink` | 14 | 1, 2, 3 |
| `line` | 14 | 1, 2, 3 |
| `diamond` | 14 | 1, 2, 3 |
| `uneven` | 14 | 1, 2, 3 |
| `target-near` | 14 | 1, 2, 3 |
| `directed` | 14 | 1, 2, 3 |
| `unreachable` | 14 | 1, 2, 3 |
| `duplicate` | 14 | 1, 2, 3 |
| `ordinary-loop` | 14 | 1, 2, 3 |
| `ordinary-ring` | 14 | 1, 2, 3 |
| `pass-loop-exit` | 14 | 1, 2, 3 |
| `pass-ring-exit` | 14 | 1, 2, 3 |
| `closed-pass-loop` | 14 | 1, 2, 3 |
| `closed-pass-ring` | 14 | 1, 2, 3 |
| `multiple-traps` | 14 | 1, 2, 3 |
| `trap-after-last` | 14 | 1, 2, 3 |
| `transient-before-trap` | 14 | 1, 2, 3 |
| `unreachable-trap` | 14 | 1, 2, 3 |
| `return-pass` | 14 | 1, 2, 3 |
| `all-pass-acyclic` | 14 | 1, 2, 3 |
| `unsafe-object-ids` | 14 | 1, 2, 3 |
| `pass-kinds` | 14 | 1, 2, 3 |

Direct regressions additionally check a `Number.MAX_SAFE_INTEGER` face on an ordinary ring, a `2^40`-step repeated pass count, probabilities with denominators above `2^60`, zero-weight infinite expectations, negative denominator normalization, an object-form die, frozen inputs, repeatability, and output isolation. The enormous-face cases use hand-derived closed forms instead of asking the linear-step reference table to materialize trillions of rows. Malformed-input rejection is a production API contract test, not an oracle-output comparison.

## 25 isolated deliberate bugs — all caught

Each mutation was applied alone to an in-memory copy of the original source, strictly type-checked, then exercised by the regression/oracle/arithmetic/validation suite. Compiler errors were not counted as kills. The original production source hash was checked unchanged afterward. All 25 were killed separately with seeds 1, 2, and 3: **75/75**. Mutation testing uses the focused suite, not the full Monte Carlo workload per mutant.

Exact commands: `node mutate.mjs --seed 1`; `node mutate.mjs --seed 2`; `node mutate.mjs --seed 3`.

| ID | Deliberate defect | First runtime failure witness | Seeds killed |
| --- | --- | --- | --- |
| M01 | Subtract instead of adding rational numerators | `Die probabilities must sum to exactly one` | 1, 2, 3 |
| M02 | Add instead of multiplying rational numerators | `sink/uniform/0: landings from S` | 1, 2, 3 |
| M03 | Stop reducing fractions to lowest terms | `sink/mixture: landings from S` | 1, 2, 3 |
| M04 | Charge a step for pass-through destinations | `pass-sink/uniform/1: passes from S` | 1, 2, 3 |
| M05 | Make ordinary destinations cost zero steps | `line/uniform/1: landings from S` | 1, 2, 3 |
| M06 | Count every pass-through entry twice | `pass-sink/uniform/1: passes from S` | 1, 2, 3 |
| M07 | Do not count an entered pass-through dead end | `pass-sink/uniform/1: passes from S` | 1, 2, 3 |
| M08 | Count the initial pass-through node as an entry | `pass-sink/uniform/0: passes from P` | 1, 2, 3 |
| M09 | Divide branch probabilities by one too many choices | `pass-sink/uniform/1: landings from S` | 1, 2, 3 |
| M10 | Uniform policy always selects the first branch | `diamond/uniform/1: landings from S` | 1, 2, 3 |
| M11 | Break target-distance ties by taking only the first branch | `diamond/toward target/1: landings from S` | 1, 2, 3 |
| M12 | Select the farthest rather than the nearest target route | `uneven/toward target/1: landings from S` | 1, 2, 3 |
| M13 | Use forward edges in the reverse target-distance search | `uneven/toward target/1: landings from S` | 1, 2, 3 |
| M14 | Choose the first route when the target is unreachable | `unreachable/toward target/1: landings from S` | 1, 2, 3 |
| M15 | Treat duplicate next IDs as extra probability tickets | `duplicate/uniform/1: landings from S` | 1, 2, 3 |
| M16 | Drop self-loop edges | `pass-loop-exit/uniform/1: passes from S` | 1, 2, 3 |
| M17 | Lose probability mass at dead ends | `sink/uniform/1: landings from S` | 1, 2, 3 |
| M18 | Zero-step movement loses its identity distribution | `sink/uniform/0: landings from S` | 1, 2, 3 |
| M19 | Move one extra step on every die face | `pass-sink/uniform/0: landings from S` | 1, 2, 3 |
| M20 | Ignore die weights when accumulating landing mass | `sink/mixture: landings from S` | 1, 2, 3 |
| M21 | Discard the nontermination probability | `closed-pass-loop/uniform/1: nontermination from S` | 1, 2, 3 |
| M22 | Report recurrent expected pass counts as finite zero | `closed-pass-loop/uniform/1: passes from S` | 1, 2, 3 |
| M23 | Misclassify mixed ordinary/pass-through cycles as zero-cost traps | `pass-ring-exit/uniform/1: landings from S` | 1, 2, 3 |
| M24 | Omit geometric resummation of pass-through self-loops | `pass-loop-exit/uniform/1: landings from S` | 1, 2, 3 |
| M25 | Forget rewards earned in the first part of composed movement | `pass-sink/table/1: passes from S` | 1, 2, 3 |

## Evidence and integrity

Blind independent authorship is now established by the pre-exchange seal and the preserved authoring record in `blind-authoring/`. The integrated `blind-reference.ts` is byte-for-byte the sealed source. The author only viewed existing production/tests after its independent implementation was completed, self-checked, sealed, and reported. `INDEPENDENCE.md` records that boundary; the runner verifies all four sealed artifacts and the integrated reference hash. The author's separate local self-checks passed 24 fixtures, 600 DAGs / 36,460 comparisons, and 600 cyclic graphs / 34,280 result checks across seeds 1–3.

The numerical counts and outcomes below were freshly reproduced with the blind reference and checked against the archived historical counters before this report was finalized. `evidence/historical-*` retains the earlier prior-oracle evidence as historical provenance.

`evidence/local-runs.json` contains the runner version/source hashes, all actual subprocess commands and exit codes, the per-seed suite counters, and all per-seed mutation kill witnesses. `evidence/raw-report-sha256.json` records the raw run-report digests. `npm test` regenerates detailed per-board, per-outcome simulation data and full mutation witnesses under `.verification/`; these generated files are intentionally not runtime dependencies.

The committed source files are the tested source files; documentation and compact evidence were finalized after the run. The final manifest is regenerated and checked before publication. SHA256SUMS.txt excludes itself and generated/dependency directories, and includes the single allowed root workflow. No file approaches the 30 MB limit.

## UNVERIFIED

- **Universal correctness / formal verification:** no machine-checked proof or claim that bugs are impossible. PROOF.md is a mathematical design argument; tests establish the recorded cases only.
- **Literal infinite-path enumeration:** not performed for zero-cost cycles because those path families can be infinite. Exact independent component equations and production matrix inversion, plus hand-derived cyclic regressions, are the substitute, explicitly identified above.
- **Unbounded scale:** random-graph coverage is up to 25 nodes and faces 0–10, with targeted enormous-face closed-form cases. Arbitrarily large dense graphs or exploding rational bit sizes are not performance-certified.
- **Game-specific interpretation:** directed edge-hop distance, dead-end absorption, duplicate-edge deduplication, and explicit nontermination are documented resolutions of the abstract brief, not externally verified rules of a particular game.

## Cloud fix revalidation — 2026-10-07T15:19:49Z

`npm ci --ignore-scripts --no-audit --no-fund --cache /workspace/.cache/npm` exited 0. New regression command `node test.mjs --seed 1 --mode golden` failed against the original compiled production code with `Missing expected exception (TypeError)`; see evidence/cloud-regression-before-fix.log. After the fix, `npm test > /workspace/b02-fixed-test.log 2>&1` exited 0. All 12 subprocesses completed with exit 0; exact commands and new production/test source hashes are in evidence/cloud-full-suite.json.

| Suite | Seeds | Case count per seed | Passed | Exact command per seed S |
| --- | --- | --- | --- | --- |
| Named fixtures plus direct boundary checks | 1,2,3 | 25 graphs; 350 differential cases; 25 direct assertions; 36 malformed-input cases (20 new) | All | `node test.mjs --seed S` |
| Rational arithmetic | 1,2,3 | 1,000 pairs | All | `node test.mjs --seed S` |
| Random DAGs, both policies/every start | 1,2,3 | 2,000 graphs; 44,000 graph/policy/face cases | All | `node test.mjs --seed S` |
| Cyclic graphs | 1,2,3 | 500 graphs; 11,000 graph/policy/face cases | All | `node test.mjs --seed S` |
| Seeded complete roll trajectories | 1,2,3 | 50 graphs x 1,000,000 = 50,000,000 | All four-sigma gates | `node test.mjs --seed S` |
| Isolated compiled/runtime mutants | 1,2,3 | 25 each, 75 total | All compiled and killed | `node mutate.mjs --seed S` |

Here S is literally 1, 2 or 3; every expansion is recorded in evidence/cloud-full-suite.json. Detailed per-case, per-bin, mutation results and exact seed counters are in evidence/cloud-tests-seed-*.json, cloud-simulation-seed-*.json and cloud-mutations-seed-*.json. All 150,000,000 required trajectories ran. The integrated blind reference and archived authoring source remain byte-identical to their original seal, SHA256 fb3358b51f3c8d6f00ca649da54d283129613cd0229ac33e626519f7daf22e5f.

### UNVERIFIED for the cloud checkpoint

Publishing the claim/checkpoint and hosted CI for this new source hash are blocked. The existing PR4 green run verified the earlier 952733df head only. See BLOCKED.md; no completed-job claim is made for the new checkpoint. The interrupted pre-fix full run is not counted. Packaging checks supplement the numerical run and do not substitute for fresh hosted CI.

## Access recovery

Native Git checkpoint pushes and standard gh API reads now succeed with existing authentication. The prior delivery blocker is resolved and BLOCKED.md is removed. The source fix and full local run remain unchanged. GitHub reruns the complete suite for this documentation checkpoint; its exact-head result and green URL are recorded in PR #4 only after successful completion is observed. No publication or new-task restoration is inferred from saving the environment draft.

## Polish pass 2026-10-08

Environment: Node v22.22.0, TypeScript 5.8.3, `python3 -I` (Python 3), 4 CPUs shared with other jobs. Structured results: `evidence/polish-2026-10-08-*.json` (copied from the git-ignored `.verification/`). Full console log: `evidence/polish-2026-10-08-full-test.log`.

| Check | Command | Result |
| --- | --- | --- |
| Full suite, seeds 1, 2, 3 | `npm test` (from `jobs/B02-board-odds`, tree before the docs-only edits) | EXIT 0 in 527 s; `PASS: full suite, seeds 1/2/3, all 75 isolated mutations caught.` |
| Golden fixtures and arithmetic, per seed | `node test.mjs --seed S` | pass: 25 fixture graphs, 350 differential cases, 1,000 rational pairs, 60 malformed-input rejections (20 new: die keys, values, `dieFromFractions` strings, `__proto__`), 26 direct assertions |
| Random DAGs, both policies, every start and face 0-10 | `node test.mjs --seed S` | pass: 2,000 graphs, 44,000 graph/policy/face cases per seed |
| Cyclic graphs | `node test.mjs --seed S` | pass: 500 graphs, 11,000 graph/policy/face cases per seed |
| B01 connection | `node test.mjs --seed S` | pass: `fixtures/b01-odds.json` (SHA-256 `3874aeeb...`) through `dieFromFractions`; normal, double and triple dice each give 36 exact landing checks and 35 shop-visit checks |
| Seeded roll trajectories | `node test.mjs --seed S` | pass: 50 graphs x 1,000,000 rolls = 50,000,000 per seed; 706 / 608 / 691 landing and 235 / 177 / 245 pass-count four-sigma checks; zero failures; largest |z| 3.41 (landing, seed 1) and 2.92 (pass, seed 3) |
| Isolated compiled mutants | `node mutate.mjs --seed S` | 25 of 25 killed per seed (75 total) |
| Independent Python exact check | `node tools/independent-check.mjs --seed S --graphs 300` | pass for all seeds: 300 graphs each; 3,961 / 4,000 / 3,773 starts; 43,571 / 44,000 / 41,503 face comparisons; 1,558,733 / 1,570,992 / 1,449,483 landing values compared exactly |
| Sensitivity of the Python comparator | a scratch copy with one injected bug in `boardOdds` | the comparator failed as intended: `graph=0 policy=uniform start=n7 face=1 landing n6`, actual `1/18`, expected `1/4`; exit 1 |
| Die-key strictness | scratch `keys-probe.mjs` | `''`, `'01'`, `'1e0'`, `' 1'`, `'-0'`, `'1.0'`, `'0x1'` now throw; before `0c7236c` they were silently accepted or duplicated |
| Runtime and size | scratch `perf.mjs`, `perf2.mjs` (not committed) | 4-30 ms per `boardOdds` call at 10-60 nodes on the loaded box; about 100 KB JSON at 40 nodes and 200 KB at 60 (all starts) |
| Manifest | `node hashes.mjs` | checks every file's SHA-256 and the complete inventory; regenerated with `--write` after the last docs edit, then verified |
| Hosted CI at the earlier head `4ee574b` (PR #4) | `gh api repos/luisitin/partybox-gpt-drops/commits/4ee574b/check-runs` | `verify`: completed, success (run 37644498365) |

### UNVERIFIED for the polish pass

- **Hosted CI for the polish head:** not run when this section was written. Its result is read back from GitHub after the push; until a green check run for the new head is read, the head is not claimed green.
- **Independence of the Python check:** it was written in the same session as the polish changes and shares the author's reading of the semantic brief (hop distance, dead ends, unknown-target fallback). It catches arithmetic and enumeration errors, not semantic disagreements.
- **Unknown target fallback:** still uniform. Pinned by the sealed reference, not changed here; the port must validate targets.
- **Timings:** measured on a shared 4-CPU box with other jobs running; not a benchmark on the owner's machine.
- **B01 numbers:** the connection test proves that B02 reproduces the vendored B01 tables exactly. It does not validate B01's research; B01's 12 evidence gates remain open (see the B01 job's VERIFY.md).
