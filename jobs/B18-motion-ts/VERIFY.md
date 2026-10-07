# B18 verification record
This is a record of executed local tests, not an assertion that the process requirements under **UNVERIFIED** were satisfied. The production numerical tests all passed for seeds 1, 2, and 3.
Environment: Linux x86-64; Node v22.16.0; TypeScript 5.8.3; g++ 14.2.0; binary64 production and a compiler-asserted 113-bit `__float128` reference. The compiler came from the preinstalled toolchain, linked locally as the pinned development dependency.
Full command, from `jobs/B18-motion-ts`: `npm test`. It builds and runs all seeds and all suites, with no skip or reduced-count flag. Fresh JSON is written to `.work/results/`; the committed snapshots are `results/seed1.json`, `results/seed2.json`, and `results/seed3.json`.
## Required numerical gates
| Seed | RK4 frames compared | Max position error | Max velocity error | Bezier max absolute error | Named easing max error | Mutants killed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 50,261,267 | 2.422115841227424e-10 | 7.264086576697082e-08 | 9.094947017729282e-13 | 4.440892098500626e-16 | 25/25 |
| 2 | 50,753,900 | 2.199627147092542e-10 | 6.468593127806344e-08 | 3.637978807091713e-12 | 4.440892098500626e-16 | 25/25 |
| 3 | 50,924,501 | 1.997166876321899e-10 | 5.87239235017023e-08 | 3.637978807091713e-12 | 4.440892098500626e-16 | 25/25 |

There are **30,000 spring cases and 151,939,668 compared trajectory states** across all seeds, with both displacement and velocity checked at each state. RK4 uses dt=0.0001 seconds. Each seed also compares 10,000 endpoints with a matrix exponential. The strict error limits are <1e-6 for RK4 and <1e-7 for the matrix exponential.
Across seeds, **3,000,000 Bezier points** are each compared with the 113-bit reference to <1e-7, plus 120,012 additional named-easing points. The exact-integer Q160 check is an additional 15,000-point audit of that reference; it does not replace any of the million-point comparisons.
Gzip level 9, including wrapper: **motion.ts 842 bytes; emitted motion.js 946 bytes**. Actual TypeScript source size: 1614 bytes. Both are gated at **1,200 bytes**, not 1,228. Every delivered file is separately gated at 30,000,000 bytes.
## Every executed suite, seed, count and exact command
Case counts are defined at the suite level: one spring trajectory is one RK4 case, while all of its individual frames and both components are also counted above and in JSON. Each mutation case contains one bug and must trigger a numeric/contract assertion. Compiler errors are not kills. The checksum case count is the number of files hashed; the manifest itself is excluded from self-hashing but is size-checked.
| Test | Cases | Passed | Failed | Seed | Exact command (job directory) |
| --- | ---: | ---: | ---: | ---: | --- |
| SHA256 integrity and per-file 30 MB limit | 17 | 17 | 0 | 1 | `node tests/run.mjs --seed 1` |
| TypeScript strict compile | 2 | 2 | 0 | 1 | `node tests/run.mjs --seed 1` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 1 | `node tests/run.mjs --seed 1` |
| gzip size (level 9) | 2 | 2 | 0 | 1 | `node tests/run.mjs --seed 1` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 1 | `node tests/run.mjs --seed 1` |
| closed form vs RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 1 | `node tests/run.mjs --seed 1` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 1 | `node tests/run.mjs --seed 1` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 1 | `node tests/run.mjs --seed 1` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 1 | `node tests/run.mjs --seed 1` |
| SHA256 integrity and per-file 30 MB limit | 17 | 17 | 0 | 2 | `node tests/run.mjs --seed 2` |
| TypeScript strict compile | 2 | 2 | 0 | 2 | `node tests/run.mjs --seed 2` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 2 | `node tests/run.mjs --seed 2` |
| gzip size (level 9) | 2 | 2 | 0 | 2 | `node tests/run.mjs --seed 2` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 2 | `node tests/run.mjs --seed 2` |
| closed form vs RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 2 | `node tests/run.mjs --seed 2` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 2 | `node tests/run.mjs --seed 2` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 2 | `node tests/run.mjs --seed 2` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 2 | `node tests/run.mjs --seed 2` |
| SHA256 integrity and per-file 30 MB limit | 17 | 17 | 0 | 3 | `node tests/run.mjs --seed 3` |
| TypeScript strict compile | 2 | 2 | 0 | 3 | `node tests/run.mjs --seed 3` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 3 | `node tests/run.mjs --seed 3` |
| gzip size (level 9) | 2 | 2 | 0 | 3 | `node tests/run.mjs --seed 3` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 3 | `node tests/run.mjs --seed 3` |
| closed form vs RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 3 | `node tests/run.mjs --seed 3` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 3 | `node tests/run.mjs --seed 3` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 3 | `node tests/run.mjs --seed 3` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 3 | `node tests/run.mjs --seed 3` |

## Differential implementations and reference checks
Production uses closed-form under/critical/over branches. Its full trajectory is compared to a direct ODE RK4 implementation at every integration step, and a matrix exponential (Taylor + scaling/squaring, no damping classification) at each final point. Production logarithmic settling estimates are compared to a separate exponential-envelope bisection. Each of the 1,000,000 Bezier points per seed is compared to C++ de Casteljau evaluation plus 113-bit bisection; 5,000 of those also cross-check against exact-integer Bernstein arithmetic. No reference imports or executes production code.
The numerical domains are explicitly specified in README.md. Finite-input fuzzing is a separate safety/property suite, not a claim that RK4 or an arbitrary-precision physical oracle was evaluated for every extreme IEEE-754 tuple. The fixed contract regressions also serve as mutation kill assertions.
## All 25 deliberately planted bugs
Every mutant is a separate TypeScript module with exactly one source replacement. All 25 compile with strict TypeScript. They are tested one at a time against the passing fixed suite for each of seeds 1, 2, 3: **75 kills, 0 survivors, 0 compiler-error kills**. Exact mutated-source SHA-256 values and failure messages are recorded per seed in JSON.
| ID | Deliberate bug | First assertion that caught it | Seeds |
| --- | --- | --- | --- |
| M01 | accept zero mass | zero mass at t=0 | 1, 2, 3 |
| M02 | accept negative stiffness | negative stiffness disabled | 1, 2, 3 |
| M03 | omit division by mass | mass normalization | 1, 2, 3 |
| M04 | lose initial velocity | negative time holds initial state | 1, 2, 3 |
| M05 | double decay coefficient | underdamped published form | 1, 2, 3 |
| M06 | wrong discriminant sign | underdamped published form | 1, 2, 3 |
| M07 | treat underdamping as critical | underdamped published form | 1, 2, 3 |
| M08 | exponential growth instead of decay | underdamped published form | 1, 2, 3 |
| M09 | omit sine frequency divisor | underdamped published form | 1, 2, 3 |
| M10 | wrong restoring-force velocity sign | underdamped published form | 1, 2, 3 |
| M11 | lose critical polynomial time | critical published form | 1, 2, 3 |
| M12 | use fast rather than slow root | overdamped published form | 1, 2, 3 |
| M13 | wrong expm1 sign | overdamped published form | 1, 2, 3 |
| M14 | halve overdamped root gap | overdamped published form | 1, 2, 3 |
| M15 | wrong overdamped initial coefficient | overdamped published form | 1, 2, 3 |
| M16 | remove finite-output guard | spring overflow is saturated | 1, 2, 3 |
| M17 | drop settling polynomial envelope | settle reference bisection | 1, 2, 3 |
| M18 | use decay rather than slow settling rate | settle reference bisection | 1, 2, 3 |
| M19 | halve settling bound | settle reference bisection | 1, 2, 3 |
| M20 | mistake either zero for equilibrium | settle reference bisection | 1, 2, 3 |
| M21 | evaluate Bezier at progress not root | cubic inversion not parameter evaluation | 1, 2, 3 |
| M22 | stop before bisection converges | cubic inversion not parameter evaluation | 1, 2, 3 |
| M23 | lose start secondary tangent | CSS start secondary tangent | 1, 2, 3 |
| M24 | lose end secondary tangent | CSS end secondary tangent | 1, 2, 3 |
| M25 | wrong named ease-in control | named easing ease-in | 1, 2, 3 |

## Reproducibility and CI
`npm test` prints both gzip sizes, suite counts, maxima, worst-case inputs, digests and mutation failures. The C++ corpus is regenerated and streamed; no unverified cached fixture substitutes for a run. JSON records contain no timestamps or performance-dependent pass conditions. The workflow reruns `npm ci --ignore-scripts` and the full `npm test` on the PR, and uploads its newly generated results. Its observed run URL belongs in the PR description; this static report does not predeclare a hosted result.
After copying the final measured snapshots and this report into the delivery, the final checksum manifest is regenerated and checked with `sha256sum -c SHA256SUMS.txt` three times. These packaging checks do not replace the numerical suites. The manifest includes the root workflow and all delivered job files except itself.
## UNVERIFIED
**Blinded independent authorship / “written without looking at each other”: NOT MET.** One assistant authored production and verification code in one session. Algorithmic separation, different languages, and differential tests are supplied; genuinely isolated authorship is not claimed. A separate implementer or reviewer is still needed for that requested process guarantee.
**Universal numerical accuracy for every finite tuple: NOT CLAIMED.** The finite-output guard is a structural guarantee under ordinary JS built-ins, exercised by the boundary/fuzz suites. It intentionally sacrifices physical accuracy for unrepresentable intermediate values. The accuracy tolerances apply to the documented, actually exercised domains, not arbitrarily large finite coefficients, y controls, or elapsed times. No exhaustive enumeration of all binary64 input tuples is claimed.
**Browser-engine differential test: NOT RUN.** Numeric CSS semantics and named controls are checked against the W3C specification and the high-precision reference, not sampled from live Web Animations/browser rendering engines. This is not a CSS parser.
**Clean local registry install: NOT RUN.** Local shell networking was unavailable. The installed compiler version was checked and used for all local tests. The supplied lockfile is checked against official registry metadata; a clean install is exercised by the GitHub workflow rather than asserted as a local result.
