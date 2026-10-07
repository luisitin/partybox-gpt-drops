# B02 verification — observed local results

**Historical run (prior oracle): PASS.** The new blind-reference integration is pending its complete rerun. The historical single `npm test` command completed with exit code **0**, with full seeds **1, 2, 3**. Local runtime: Node.js **v22.16.0**; TypeScript **5.8.3**. No reduced/smoke option was used in this run. The source hashes recorded by the runner match the delivered implementation and test sources.

GitHub CI is a separate, subsequent check. Its read-confirmed result belongs in the pull request description; this report does not infer a green run from local success.

## Exact commands actually executed

From `jobs/B02-board-odds/`: `npm test`. For each seed S = 1, 2, 3 the runner executed, in order:

```sh
node hashes.mjs
node node_modules/typescript/bin/tsc -p tsconfig.json
node test.mjs --seed S
node mutate.mjs --seed S
```

Here `S` is replaced literally by `1`, `2`, and `3`; the fully expanded commands and exit codes are in `evidence/local-runs.json`. All 12 subprocess invocations exited 0. Integrity and strict compilation each ran three times. Each strict compilation covered both `.ts` implementations; each mutation additionally passed strict type checking before its runtime test.

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

`evidence/local-runs.json` contains the runner version/source hashes, all actual subprocess commands and exit codes, the per-seed suite counters, and all per-seed mutation kill witnesses. `evidence/raw-report-sha256.json` records the raw run-report digests. `npm test` regenerates detailed per-board, per-outcome simulation data and full mutation witnesses under `.verification/`; these generated files are intentionally not runtime dependencies.

The committed source files are the tested source files; documentation and compact evidence were finalized after the run. The final manifest is regenerated and checked before publication. SHA256SUMS.txt excludes itself and generated/dependency directories, and includes the single allowed root workflow. No file approaches the 30 MB limit.

## UNVERIFIED

- **Current integrated full-suite run:** pending at this milestone. The independent reference is sealed and its authoring self-checks passed, but the prior numerical results below were produced with the historical oracle. Historical raw report hashes and compact results are preserved under `evidence/historical-*`.
- **Universal correctness / formal verification:** no machine-checked proof or claim that bugs are impossible. PROOF.md is a mathematical design argument; tests establish the recorded cases only.
- **Literal infinite-path enumeration:** not performed for zero-cost cycles because those path families can be infinite. Exact state elimination and matrix inversion, plus hand-derived cyclic regressions, are the substitute, explicitly identified above.
- **Unbounded scale:** random-graph coverage is up to 25 nodes and faces 0–10, with targeted enormous-face closed-form cases. Arbitrarily large dense graphs or exploding rational bit sizes are not performance-certified.
- **Fresh local npm installation:** the local container could not resolve the npm registry. Tests used its already installed TypeScript 5.8.3; the portable lockfile uses the official registry integrity value. The CI workflow separately performs a fresh `npm ci` before the same full suite. No local fresh-install success is claimed.
- **Game-specific interpretation:** directed edge-hop distance, dead-end absorption, duplicate-edge deduplication, and explicit nontermination are documented resolutions of the abstract brief, not externally verified rules of a particular game.
