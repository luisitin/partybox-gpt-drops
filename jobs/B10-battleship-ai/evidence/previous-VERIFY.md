# B10 verification record

## Verdict

The full local command finished: **900,000 complete games**, all requested seeds.
Overall local exit status: **FAIL**. This is not an all-requirements-passed drop.
The deterministic correctness and mutation checks passed; any timing failures below
remain failures. No outlier was removed, threshold relaxed, or failed run hidden.

Raw machine evidence and complete stdout are bundled with the nine individual
benchmark reports in `evidence/raw-reports.zip` (11 small evidence files). The main
entries are `local-full.json` and `local-full.log`. Pooled statistics are also
available directly in `evidence/aggregate.json`.
The raw report's `complete` field means the complete requested run mode, not success;
`passed` and `failures` record the outcome.

## Commands and environment

All commands run from `jobs/B10-battleship-ai/`.

- Full executed command: `npm test` (build, all seeds, all 900,000 games).
- Recorded runner command: `/opt/nvm/versions/node/v22.16.0/bin/node test/run.mjs`.
- C1: `npm run build && node test/run.mjs --no-bench --seed=1`.
- C2: `npm run build && node test/run.mjs --no-bench --seed=2`.
- C3: `npm run build && node test/run.mjs --no-bench --seed=3`.
  C1/C2/C3 are exact rerun commands for the correctness/weight/mutation rows below;
  they are subsets, not substitutes for the executed full command.
- Individual benchmark: `node test/benchmark.mjs SEED 100000 DIFFICULTY` after build.
- Payload integrity: `sha256sum -c SHA256SUMS.txt`.

Node `v22.16.0`, TypeScript `5.8.3`, `linux/x64`,
CPU `AMD EPYC 9V74 80-Core Processor`, available parallelism `4`.
Game seeds were run in groups of at most three concurrent processes, as in the CI harness.
Full runner duration: 910.623632 seconds (compiler time is additional).
Production SHA-256: `2d4db4fff0ae0335a1cdb41f93919b3ce52289f3508f2ce7e3a7b657b85e6e38`.
Oracle SHA-256: `1e697f98d1c29cfb1f38ba25ea34c4a5d17ad26e584798ad89debbc4540dfec1`.

The existing local compiler ran the build; the local npm registry installation
attempt timed out. `package-lock.json` uses publisher metadata. The hosted workflow
runs `npm ci` independently. TypeScript compilation and static configuration checks
run once per `npm test`; every randomized suite runs seeds 1, 2 and 3.

## Static and API checks

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---|---|
| Strict TypeScript production and oracle compilation | 1 build | 1 | N/A | `npm run build` |
| Strict/indexed/optional configuration, no runtime dependencies, no production imports, no ambient RNG/clock | 6 | 6 | N/A | `npm test` |
| Payload SHA-256 manifest | See manifest file count | All matched before publication | N/A | `sha256sum -c SHA256SUMS.txt` |

## Exact differential and sampled-audit suites

6x6 fleet sequence: `[2]`, `[3]`, `[2,2]`, `[2,3]`, `[3,3]`, `[2,2,3]`.
Named and anonymous observations alternate in balanced fleet blocks. Each generated
state is derived from a real legal hidden fleet. Production masks are compared to
a separately implemented array/set enumerator, using exact BigInt counts/denominators.
No floating tolerance substitutes for equality of exact fractions.

| Test | Seed | Cases | Passed | Additional checked objects | Exact rerun |
|---|---:|---:|---:|---|---|
| Exact 6x6 joint density | 1 | 10000 | 10000 | 1624793 consistent complete fleets | C1 |
| Easy/Medium/Hard exact shot-policy differential | 1 | 30000 | 30000 | Includes terminal decisions | C1 |
| Public-feedback update vs separate simulator | 1 | 23625 | 23625 | No state mutation | C1 |
| Exact 6x6 joint density | 2 | 10000 | 10000 | 1426510 consistent complete fleets | C2 |
| Easy/Medium/Hard exact shot-policy differential | 2 | 30000 | 30000 | Includes terminal decisions | C2 |
| Public-feedback update vs separate simulator | 2 | 23517 | 23517 | No state mutation | C2 |
| Exact 6x6 joint density | 3 | 10000 | 10000 | 1635715 consistent complete fleets | C3 |
| Easy/Medium/Hard exact shot-policy differential | 3 | 30000 | 30000 | Includes terminal decisions | C3 |
| Public-feedback update vs separate simulator | 3 | 23850 | 23850 | No state mutation | C3 |
| Sample validity, proposal weights and conditional marginals | 1 | 200 | 200 | 12694 audited worlds; 0 exhausted batches; max numeric discrepancy 1.1102230246251565e-16 | C1 |
| Sample validity, proposal weights and conditional marginals | 2 | 200 | 200 | 12725 audited worlds; 0 exhausted batches; max numeric discrepancy 1.1102230246251565e-16 | C2 |
| Sample validity, proposal weights and conditional marginals | 3 | 200 | 200 | 12773 audited worlds; 0 exhausted batches; max numeric discrepancy 1.6653345369377348e-16 | C3 |

Sample audits use 64 proposals/state and independently reconstruct each proposal's
importance weight and each Rao–Blackwell conditional marginal. This audits the
sampled estimator, not a claim of zero Monte Carlo error against the true posterior.
Every returned density also checks bounds, hit=1, miss/sunk=0, target<=occupancy,
and total mass equal to remaining ship cells (not equal to one).

## Named regression tests

Each row is one named fixture run independently on each seed. Counts are per seed;
fixtures can contain multiple assertions or parameter combinations. Exact reruns
are C1, C2 and C3 respectively, and all are included in `npm test`.

| Test name | Seed 1 passed/cases | Seed 2 passed/cases | Seed 3 passed/cases | Exact rerun |
|---|---:|---:|---:|---|
| horizontal and vertical edge endpoints | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| one-cell ship orientations counted once | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| all mask words and sign bits 31 32 63 64 95 96 99 | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| blocked cells across every mask word | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| length one on 100 cells | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| joint exclusion and legal touching | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| labelled identical lengths not deduplicated | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| miss excludes every intersecting hull | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| named hits belong to designated ships | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| negative sinking evidence rejects fully hit afloat ship | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| every anonymous hit must be covered | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| sunk hull removed and adjacent ships still allowed | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| all sunk is terminal but empty density has one configuration | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| empty fleet is terminal | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| impossible global fleet returns error without throwing | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| enumeration budget returns no partial density | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| sample exhaustion is not contradiction | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| sample weights and conditional marginals independently reconstructed | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| one ship conditional sampling equals exact posterior | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| easy medium hard match independent policies | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| never select any previously fired cell | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| uniform endpoints of injected RNG | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| invalid RNG is an error value | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| strict malformed model options and observation checks | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| bent overlapping duplicate and mismatched sunk declarations | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| public state updates copied and repeat feedback rejected | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| sinking cannot relabel another ships earlier named hit | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| determinism and frozen inputs | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |
| 100-cell terminal misses are contradictory not a repeat shot | 1/1 | 1/1 | 1/1 | C1 / C2 / C3 |

## Planted faults: 25 separate executable mutants, three seeds

Mutants are real single-site edits to emitted JavaScript, loaded as separate temporary
modules. The unmodified baseline must pass. A module parse/import failure is not
counted as a killed mutant. No production mutation switches are present. Each
mutant is restored by discarding its module before the next mutant is constructed.

| ID | Deliberate fault | Seed 1 | Seed 2 | Seed 3 | Killing fixture (seed 1) | Exact rerun |
|---|---|---|---|---|---|---|
| M01 | Drop the rightmost horizontal placements | caught | caught | caught | horizontal and vertical edge endpoints | C1 / C2 / C3 |
| M02 | Drop the bottommost vertical placements | caught | caught | caught | horizontal and vertical edge endpoints | C1 / C2 / C3 |
| M03 | Double-count length-one orientations | caught | caught | caught | one-cell ship orientations counted once | C1 / C2 / C3 |
| M04 | Put cells in the wrong 32-bit word | caught | caught | caught | all mask words and sign bits 31 32 63 64 95 96 99 | C1 / C2 / C3 |
| M05 | Lose mask bits 96 through 99 | caught | caught | caught | all mask words and sign bits 31 32 63 64 95 96 99 | C1 / C2 / C3 |
| M06 | Ignore overlap in the second mask word | caught | caught | caught | blocked cells across every mask word | C1 / C2 / C3 |
| M07 | Ignore overlap in the fourth mask word | caught | caught | caught | blocked cells across every mask word | C1 / C2 / C3 |
| M08 | Ignore required coverage in the fourth mask word | caught | caught | caught | all mask words and sign bits 31 32 63 64 95 96 99 | C1 / C2 / C3 |
| M09 | Reverse set subtraction in conditional inference | caught | caught | caught | sample weights and conditional marginals independently reconstructed | C1 / C2 / C3 |
| M10 | Allow overlapping ships during joint enumeration | caught | caught | caught | joint exclusion and legal touching | C1 / C2 / C3 |
| M11 | Allow ship placements on blocked cells | caught | caught | caught | blocked cells across every mask word | C1 / C2 / C3 |
| M12 | Leave sunk ships in the remaining fleet | caught | caught | caught | sunk hull removed and adjacent ships still allowed | C1 / C2 / C3 |
| M13 | Do not block identified sunk hull cells | caught | caught | caught | sunk hull removed and adjacent ships still allowed | C1 / C2 / C3 |
| M14 | Assign a named hit to the wrong ship | caught | caught | caught | named hits belong to designated ships | C1 / C2 / C3 |
| M15 | Forbid a ships own named hits instead of foreign hits | caught | caught | caught | named hits belong to designated ships | C1 / C2 / C3 |
| M16 | Permit a fully hit ship to remain afloat | caught | caught | caught | negative sinking evidence rejects fully hit afloat ship | C1 / C2 / C3 |
| M17 | Forget the global anonymous-hit coverage requirement | caught | caught | caught | all mask words and sign bits 31 32 63 64 95 96 99 | C1 / C2 / C3 |
| M18 | Collapse the two distinct length-three ships | caught | caught | caught | joint exclusion and legal touching | C1 / C2 / C3 |
| M19 | Normalize exact density by the wrong count | caught | caught | caught | horizontal and vertical edge endpoints | C1 / C2 / C3 |
| M20 | Increment exact per-cell counts twice | caught | caught | caught | horizontal and vertical edge endpoints | C1 / C2 / C3 |
| M21 | Forget sampled target probability | caught | caught | caught | sample weights and conditional marginals independently reconstructed | C1 / C2 / C3 |
| M22 | Discard importance-sampling correction | caught | caught | caught | sample weights and conditional marginals independently reconstructed | C1 / C2 / C3 |
| M23 | Include overlapping moves in conditional denominator | caught | caught | caught | sample weights and conditional marginals independently reconstructed | C1 / C2 / C3 |
| M24 | Allow already-fired misses into shot choices | caught | caught | caught | easy medium hard match independent policies | C1 / C2 / C3 |
| M25 | Accept RNG value one and index past the candidates | caught | caught | caught | invalid RNG is an error value | C1 / C2 / C3 |

Result: 25/25 final mutants killed on each seed, **75/75 mutation trials**.
During mutation design, two earlier candidate faults only removed redundant
ownership constraints and survived. They were replaced by the actual wrong-owner
faults M14/M15 before the final frozen 25-mutant run. This is a curated mutation
suite, not proof that every possible program defect is caught.

## Full game benchmarks: 100,000 games per difficulty per seed

Contract: 10x10, labelled lengths 5/4/3/3/2; ships may touch. Public named-hit
feedback follows the classic Hasbro instructions cited in SOURCES.md. Sunk hulls
contain only already-hit public cells. Boards are uniformly sampled over complete
legal labelled fleets using whole-fleet rejection. A game finishes when all five
ships are sunk. Neither the AI nor its RNG sees the hidden fleet.

| Difficulty | Seed | Games passed/completed | Exact mean fraction | Mean shots | Median | Repeated shots | Errors | Exact command |
|---|---:|---:|---|---:|---:|---:|---:|---|
| easy | 1 | 100000/100000 | 6215892/100000 | 62.15892 | 62 | 0 | 0 | `node test/benchmark.mjs 1 100000 easy` |
| easy | 2 | 100000/100000 | 6219901/100000 | 62.19901 | 62 | 0 | 0 | `node test/benchmark.mjs 2 100000 easy` |
| easy | 3 | 100000/100000 | 6221040/100000 | 62.21040 | 62 | 0 | 0 | `node test/benchmark.mjs 3 100000 easy` |
| medium | 1 | 100000/100000 | 4988569/100000 | 49.88569 | 50 | 0 | 0 | `node test/benchmark.mjs 1 100000 medium` |
| medium | 2 | 100000/100000 | 4994174/100000 | 49.94174 | 50 | 0 | 0 | `node test/benchmark.mjs 2 100000 medium` |
| medium | 3 | 100000/100000 | 4992109/100000 | 49.92109 | 50 | 0 | 0 | `node test/benchmark.mjs 3 100000 medium` |
| hard | 1 | 100000/100000 | 4483574/100000 | 44.83574 | 45 | 0 | 0 | `node test/benchmark.mjs 1 100000 hard` |
| hard | 2 | 100000/100000 | 4484903/100000 | 44.84903 | 45 | 0 | 0 | `node test/benchmark.mjs 2 100000 hard` |
| hard | 3 | 100000/100000 | 4491006/100000 | 44.91006 | 45 | 0 | 0 | `node test/benchmark.mjs 3 100000 hard` |

The completion column only asserts completed, error-free games; timing is a separate
gate below. Benchmark commands are independent rerun commands and are invoked by
`npm test`. Each difficulty's Hard gate is checked independently for every seed.

| Difficulty | Pooled games | Exact pooled mean | Decimal mean | Pooled median |
|---|---:|---|---:|---:|
| easy | 300000 | 18656833/300000 | 62.189443333333 | 62 |
| medium | 300000 | 14974852/300000 | 49.916173333333 | 50 |
| hard | 300000 | 13459483/300000 | 44.864943333333 | 45 |

Pooled medians are calculated from combined shot-count histograms, not by averaging
three medians. Exact unreduced fractions are supplied to avoid rounding ambiguity.

## Per-shot wall-clock latency and hard gates

`performance.now()` surrounds the complete `chooseShot` call, including validation,
state preparation, inference and RNG consumption. No warm-up removal, GC-pause
removal, scheduling adjustment, or latency outlier trimming is applied. The p50/p99
histogram bins round up to the next microsecond; maxima retain the raw measured
precision. The production AI itself reads no clock.

| Difficulty | Seed | Measured calls | p50 ms | p99 ms | Maximum ms | Calls >50 ms | <=50 ms gate | Hard mean <45 |
|---|---:|---:|---:|---:|---:|---:|---|---|
| easy | 1 | 6215892 | 0.019 | 0.096 | 49.163416999989 | 0 | PASS | N/A |
| easy | 2 | 6219901 | 0.019 | 0.099 | 28.159213999999 | 0 | PASS | N/A |
| easy | 3 | 6221040 | 0.020 | 0.096 | 15.853793000000 | 0 | PASS | N/A |
| medium | 1 | 4988569 | 0.025 | 0.138 | 60.436359999992 | 1 | FAIL | N/A |
| medium | 2 | 4994174 | 0.025 | 0.138 | 10.153057000000 | 0 | PASS | N/A |
| medium | 3 | 4992109 | 0.025 | 0.146 | 47.012173999999 | 0 | PASS | N/A |
| hard | 1 | 4483574 | 0.096 | 0.477 | 55.889908999990 | 1 | FAIL | PASS |
| hard | 2 | 4484903 | 0.095 | 0.471 | 177.159786000004 | 1 | FAIL | PASS |
| hard | 3 | 4491006 | 0.096 | 0.488 | 46.553183000011 | 0 | PASS | PASS |

Recorded full-run failures:

- `medium seed 1: 1 calls exceeded 50 ms (max 60.43635999999242)`
- `hard seed 2: 1 calls exceeded 50 ms (max 177.1597860000038)`
- `hard seed 1: 1 calls exceeded 50 ms (max 55.88990899999044)`

## UNVERIFIED / unmet requirements

**Strict <=50 ms on every observed call is not satisfied by this local run** whenever
a FAIL appears in the latency table. The harness exits nonzero on these observations.
A fast p99 does not excuse a slower maximum. No cause (GC, OS scheduling, contention)
is asserted without a trace. A universal wall-time bound across other machines,
loads or caller-raised inference budgets is also not established.

**Blind independent authorship is not met.** The implementations use distinct data
structures and do not import production helpers, but were authored in one assistant
session. The initial oracle preceded production code; later extensions occurred in
the same session. They were not produced by two isolated authors unable to inspect
each other's work.

**Per-shot comparison to a second complete sampled AI throughout all 900,000 games
is not met.** All 30,000 small-board cases compare exact densities and all three
policies; 600 sampled states independently audit worlds/weights/reduction. That is
not equivalent to independently implementing and diffing the entire sampled AI on
every shot of the large benchmark.

**Literal triple execution of static build/configuration suites is not met by the
single full command.** These deterministic checks run once; randomized correctness,
mutations, and full-game suites run seeds 1, 2, and 3.

**Anonymous-hit under-45 performance is not established.** The primary benchmark
uses classic named hits. An additional 1,000-game anonymous-hit smoke run, seed 101,
with exact sunk hulls revealed, averaged 45.066 shots; it is not a 100,000-game
validation and does not meet the under-45 target. The AI does not guess sunk hulls
from adjacency. Length-only sink logs without identifiable hulls are unsupported.

**No universal sampled posterior error bound is certified.** Joint samples have full
support and correct importance weights; finite self-normalized estimates may be
biased. Exhausted budgets are explicit error values, never a made-up density.
Full 10x10 exhaustive enumeration within the latency budget is not claimed.

**Hosted CI status is recorded separately in the pull-request description.** This
file is a frozen local test record, not a claim that a hosted run succeeded. Only an
actually completed successful Actions run may be linked as green. A green hosted
run does not erase the recorded local failure or independence limitations.

## Publication checks

Only `jobs/B10-battleship-ai/**` and the expressly authorized
`.github/workflows/B10.yml` are part of this drop. The manifest covers every delivered
payload file except itself, including the workflow by its relative path. It is
regenerated after freezing evidence and documentation, and checked before publication.
Every delivered file is below 30 MB. No split/JOIN step is necessary.
