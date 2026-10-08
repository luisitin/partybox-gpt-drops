# B18 verification record

The complete `npm test` run passed all 20 suites for seeds 1, 2 and 3 after
integration of the sealed independently authored references. The committed
`results/seed{1,2,3}.json` files are exact copies of that run's fresh reports.
The log ended `FULL REQUESTED SUITES PASSED for seeds 1, 2, 3`.

Executed environment: Linux x86-64, Node v24.19.0, TypeScript 5.8.3, and g++
14.2.0. Production uses binary64; the blind C++ oracle uses `__float128` with a
113-bit significand. A clean local dependency installation succeeded with
`npm ci --ignore-scripts --no-audit --no-fund` during the resumed delivery.

Full command from `jobs/B18-motion-ts`: `npm test`. This builds and runs all
seeds and suites, with no skip or reduced-count option. Individual complete seed
commands are listed below. Fresh reports are written to `.work/results/`;
committed measured snapshots are retained in `results/`.

## Required numerical gates

| Seed | RK4 states compared | Max position error | Max velocity error | Blind Bezier max absolute error | Blind named easing max error | Compiled mutants killed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 50,261,267 | 2.4221158412274235e-10 | 7.264086576697082e-08 | 9.094947017729282e-13 | 4.440892098500626e-16 | 25/25 |
| 2 | 50,753,900 | 2.1996271470925421e-10 | 6.468593127806344e-08 | 3.637978807091713e-12 | 4.440892098500626e-16 | 25/25 |
| 3 | 50,924,501 | 1.9971668763218986e-10 | 5.87239235017023e-08 | 3.637978807091713e-12 | 4.440892098500626e-16 | 25/25 |

There are **30,000 spring trajectories and 151,939,668 compared states**, with
both displacement and velocity checked at every state: **303,879,336 component
comparisons**. The sealed RK4 reference uses dt=0.0001 seconds and the strict
error gate is <1e-6. Each seed also checks 10,000 endpoints against the sealed
analytic spring (<1e-7) and 10,000 against the historical matrix exponential
(<1e-7).

Across seeds, **3,000,000 distinct Bezier inputs** and **120,012 named easing
inputs** are each compared with the sealed 113-bit reference to <1e-7. All the
same inputs also retain the historical 113-bit comparison. The 15,000-point
exact-integer Q160 audit is supplemental; it replaces no required comparison.

Gzip level 9 including wrapper: **motion.ts 842 bytes; emitted motion.js 946
bytes**. Actual TypeScript source: **1,614 bytes**. Both gzip files are gated at
**1,200 bytes**. Every delivered file is gated at 30,000,000 bytes.

## Every executed suite, seed, count and command

A spring trajectory counts as one RK4 case; its individual states and both
components are additionally counted above and in JSON. Mutation cases each
contain one bug, compile with strict TypeScript, and must trigger a numeric or
contract assertion. Compiler errors are not kills. Integrity cases count the
32 hashed delivered files, including the workflow and excluding the manifest
itself; the manifest is separately size-checked.

| Test | Cases | Passed | Failed | Seed | Exact command from job directory |
| --- | ---: | ---: | ---: | ---: | --- |
| SHA256 integrity and per-file 30 MB limit | 32 | 32 | 0 | 1 | `node tests/run.mjs --seed 1` |
| TypeScript strict compile | 2 | 2 | 0 | 1 | `node tests/run.mjs --seed 1` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 1 | `node tests/run.mjs --seed 1` |
| gzip size (level 9) | 2 | 2 | 0 | 1 | `node tests/run.mjs --seed 1` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 1 | `node tests/run.mjs --seed 1` |
| closed form vs blindly authored RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| closed form vs blindly authored spring solution | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| cubic Bezier vs blindly authored high-precision oracle | 1,000,000 | 1,000,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| all four CSS named easings vs blindly authored high-precision oracle | 40,004 | 40,004 | 0 | 1 | `node tests/run.mjs --seed 1` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 1 | `node tests/run.mjs --seed 1` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| blindly authored settling-bound tail check | 640,000 | 640,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 1 | `node tests/run.mjs --seed 1` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 1 | `node tests/run.mjs --seed 1` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 1 | `node tests/run.mjs --seed 1` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 1 | `node tests/run.mjs --seed 1` |
| SHA256 integrity and per-file 30 MB limit | 32 | 32 | 0 | 2 | `node tests/run.mjs --seed 2` |
| TypeScript strict compile | 2 | 2 | 0 | 2 | `node tests/run.mjs --seed 2` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 2 | `node tests/run.mjs --seed 2` |
| gzip size (level 9) | 2 | 2 | 0 | 2 | `node tests/run.mjs --seed 2` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 2 | `node tests/run.mjs --seed 2` |
| closed form vs blindly authored RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| closed form vs blindly authored spring solution | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| cubic Bezier vs blindly authored high-precision oracle | 1,000,000 | 1,000,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| all four CSS named easings vs blindly authored high-precision oracle | 40,004 | 40,004 | 0 | 2 | `node tests/run.mjs --seed 2` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 2 | `node tests/run.mjs --seed 2` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| blindly authored settling-bound tail check | 640,000 | 640,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 2 | `node tests/run.mjs --seed 2` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 2 | `node tests/run.mjs --seed 2` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 2 | `node tests/run.mjs --seed 2` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 2 | `node tests/run.mjs --seed 2` |
| SHA256 integrity and per-file 30 MB limit | 32 | 32 | 0 | 3 | `node tests/run.mjs --seed 3` |
| TypeScript strict compile | 2 | 2 | 0 | 3 | `node tests/run.mjs --seed 3` |
| zero runtime deps / no ambient RNG or clock | 3 | 3 | 0 | 3 | `node tests/run.mjs --seed 3` |
| gzip size (level 9) | 2 | 2 | 0 | 3 | `node tests/run.mjs --seed 3` |
| fixed numeric and contract regressions | 86 | 86 | 0 | 3 | `node tests/run.mjs --seed 3` |
| closed form vs blindly authored RK4, every dt=1e-4 frame | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| closed form vs scaling/squaring matrix exponential | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| closed form vs blindly authored spring solution | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| cubic Bezier vs 113-bit reference | 1,000,000 | 1,000,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| cubic Bezier vs blindly authored high-precision oracle | 1,000,000 | 1,000,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| all four CSS named easings vs blindly authored high-precision oracle | 40,004 | 40,004 | 0 | 3 | `node tests/run.mjs --seed 3` |
| all four CSS named easings vs 113-bit reference | 40,004 | 40,004 | 0 | 3 | `node tests/run.mjs --seed 3` |
| 113-bit oracle vs exact-integer Q160 Bernstein reference | 5,000 | 5,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| settle estimate vs independent envelope bisection | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| settle-tail position AND velocity bounds | 640,000 | 640,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| blindly authored settling-bound tail check | 640,000 | 640,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| semigroup / physical scale / time-unit invariance | 60,000 | 60,000 | 0 | 3 | `node tests/run.mjs --seed 3` |
| finite-output boundaries and random IEEE-754 inputs | 466,524 | 466,524 | 0 | 3 | `node tests/run.mjs --seed 3` |
| repeat-call determinism on boundary/fuzz corpus | 3,673 | 3,673 | 0 | 3 | `node tests/run.mjs --seed 3` |
| isolated deliberate mutation kills | 25 | 25 | 0 | 3 | `node tests/run.mjs --seed 3` |

Every seed passed **3,935,349 suite cases**, totaling **11,806,047 suite cases**.
Distinct input counts and repeated algorithm comparisons are described above;
this suite-case total intentionally counts each separately executed comparison.

## Sealed independent implementations

The author of `tests/blind/spring-oracle.mjs` and
`tests/blind/bezier-quad.cpp` read the original B18 instructions, repository
README and supplied public API contract. The author did not read production,
previous reference implementations, previous tests or PR descriptions before
writing and sealing the sources. `tests/blind/AUTHORING.md` records the protocol,
mathematics, permitted reads and accuracy limits. Source SHA256 hashes were
reported before integration and still match `tests/blind/SEALED-SHA256SUMS.txt`.
Later delivery work began only after sealing; the sealed sources were unchanged.

The blind RK4 stepper now checks every required trajectory state. The blind
analytic spring checks all 10,000 generated endpoints per seed. The blind quad
Bezier evaluator checks all 1,000,000 generated inputs plus all 40,004 named
inputs per seed. The historical `tests/reference.ts`, `tests/oracle.cpp` and
`tests/exact.mjs` remain supplemental numerical algorithms; blind authorship is
not asserted for these older sources. No reference imports production code.

The blind author also derived a separate conservative settling envelope. Its
estimate is checked with 640,000 tail samples per seed; the production estimate
retains its own 640,000 tail samples and 10,000 historical envelope-inversion
comparisons per seed. Conservative bounds need not equal one another. The
largest sampled fractions of epsilon were 0.06068469951048798 for production
and 0.05642503788327169 for the blind estimate. These sampled checks accompany
the analytic all-future-time derivations in README and the authoring record.

The author's recorded self-check additionally passed 63 curve fixtures, 37
spring fixtures, 50,000 RK4 frames and 4,004 settling samples. Its maximum RK4
error was 2.5512925105886097e-13. This preliminary author self-check is separate
from the complete three-seed production comparison above.

## All 25 deliberately planted bugs

Each mutant is a separate TypeScript module with exactly one source replacement.
Every seed compiled and killed all 25: **75 compiled assertion kills, zero
survivors, zero compiler-error kills**. Exact mutated-source SHA256 values and
failure messages are recorded in each seed's JSON.

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

## Reproducibility and hosted CI

`npm test` prints gzip sizes, counts, maxima, worst inputs, digests and mutation
failures. Every corpus is regenerated. JSON contains no timestamps or
performance-dependent pass conditions. The source hash in all three reports is
`aafcd38287f38219e945852de786b465cc3cfa127d5414ef9a3688239c3bd964`.

After publishing measured snapshots and documentation, the final manifest is
regenerated and checked with `sha256sum -c SHA256SUMS.txt`. It covers every
tracked delivered job file except itself and `../../.github/workflows/B18.yml`.
The workflow uses the required scoped pull-request trigger, read-only
permissions, Ubuntu, a 30-minute timeout and actions/* major pins. It reruns
`npm ci --ignore-scripts` and the full `npm test`, then uploads freshly produced
JSON. PR #5 records the observed run URL and exact final head; this document
does not predeclare a hosted outcome.

## UNVERIFIED

**Universal numerical accuracy for every finite tuple is not claimed.**
Finite-output guards are exercised by 466,524 boundary/fuzz cases per seed.
They intentionally sacrifice physical accuracy for unrepresentable intermediate
values. Accuracy tolerances apply to the domains stated in README, including
ordinary physical scales for the blind JavaScript spring. Arbitrarily large
coefficients, elapsed times and y controls are outside those accuracy claims.
Ordinary JavaScript built-ins are assumed; exhaustive binary64 enumeration was
not performed.

**Browser-engine differential sampling is supplemental.** CSS numerical semantics
and named controls were checked against W3C and numeric references. This API is
not a CSS parser; invalid x controls use the documented identity fallback. One
Chromium differential ran in the polish pass (below). It is not part of `npm test`,
and its precision is limited by six-digit CSS serialization.

`settleTime` supplies a conservative bound, not the first crossing or exact
minimum. `Number.MAX_VALUE` means no representable finite bound was supplied;
it does not prove that every such trajectory can never rest within epsilon.

## Polish pass 2026-10-08

Environment: Linux x86-64, Node v22.22.0 (the package requires >=22), TypeScript
5.8.3, Chromium 1194 and Playwright from the cloud image, using the existing
`node_modules` (no fresh registry install in this pass). `motion.ts` and the
sealed references are unchanged. Hosted CI on the delivered commit is the
authoritative run; the PR description records its link and result.

| Check | Cases | Result | Exact command from job directory |
| --- | ---: | --- | --- |
| settle-bound grid (probe, not in `npm test`) | 2,352 | 0 violations; 7 z x 4 w x 3 x0 x 7 v-rate x 4 v0 forms | `npm run probes` |
| Chromium CSS easing vs `cubicBezier` (WAAPI, registered `<number>` property) | 64 curves x 41 points = 2,624 | raw maximum 4.99e-6 (serialization); against values rounded to six significant digits, maximum 1.0e-6 and 2,582 exact; the four named curves 6.1e-7 raw | `CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PLAYWRIGHT=/opt/node22/lib/node_modules/playwright/index.mjs npm run browser-check` |
| demo build | 1 page, 2,145 bytes of motion code inlined | built | `npm run demo` |
| demo in headless Chromium (1100 px, 390 px, reduced motion) | 3 viewports | no console errors, no network requests, no horizontal overflow (`scrollWidth` = `clientWidth`) | scratch harness outside the job folder |

Defect found and fixed in the demo: a finished WAAPI animation rewinds to zero
when `play()` is called on it, so a resize (or the full-page screenshot that
resizes the viewport) restarted the browser lanes. Browser lanes now resume only
while time remains. Re-checked: after 3.0 s and after a full-page capture, every
browser lane sits at its end position.

Reduced motion sets every lane to its final state without starting a loop.

Full seeded suite: `npm test` (seeds 1, 2 and 3, 25 mutations each, the same
commands and counts as the table above, with 32 integrity cases now that the
delivered set includes the demo, tools and INTEGRATION.md). The baseline run
before this pass, on the unchanged runtime at 15:41 UTC, passed every suite for
all three seeds with 26 integrity cases.

## Independent review 2026-10-08

Reviewer: Claude (Haiku 5.5), on 8c49aaa. The reviewer did not write the polish pass.

| Check | Result |
| --- | --- |
| Scope, `git diff --stat c0570a8..8c49aaa` | only `jobs/B18-motion-ts/**`; `.github/workflows/B18.yml` unchanged (sha `3b9a6c0b…`, matches the manifest) |
| `motion.ts` | unchanged: 1,614 bytes, sha `aafcd382…`; gzip 842 (TS) and 946 (JS) against the 1,200 gate |
| `sha256sum -c SHA256SUMS.txt` | all 32 OK before the review's document edits; every tracked file except the manifest is listed |
| Hosted CI on 8c49aaa | run 37806545473, job `verify`, success; Node 22.23.3; seeds 1, 2, 3 all pass; 32/32 integrity; 25/25 mutations per seed |
| `npm ci --ignore-scripts && npm test` (local, Node 22.22.0) | EXIT=0; seeds 1, 2 and 3 each `PASS` (about 57 to 61 s per seed on the loaded box) |
| Independent RK4 (Python, dt 1e-4, integrated to exactly T) against `spring()`, 12 random springs | max difference 7.3e-12 |
| `spring(0, …)` | returns `[x0, v0]` |
| `cubicBezier` endpoints; named easings at t = 0.5 | 0 and 1 at the ends; ease 0.80240, ease-in 0.31536, ease-out 0.68464, ease-in-out 0.5 |
| Settle bounds for the demo presets (m 1, x0 1, v0 0, e 0.001) | bounds 3.51, 1.43, 1.81, 7.66 s; first moment both position and speed are inside e (0.5 ms grid): 1.16, 0.64, 1.17, 2.97 s; largest excursion after the bound 0.26 % of e |
| `npm run build && node tools/make-demo.mjs` | the rebuilt `demo/curves.html` is byte-identical to the committed file (sha `e10ef385…`) |
| `npm run browser-check` (Chromium 1194) | 2,624 samples; raw max 4.99e-6; after six-digit rounding max 1.0e-6; 2,582 exact; named curves 6.1e-7; matches the table above |
| Demo in headless Chromium at 1100 px and 390 px | no console errors, no network requests, no horizontal overflow; the 1100 px render was looked at |

Not re-checked by the reviewer: reduced motion in the demo (the polish pass reports it, from a harness outside the job).

Left open, not changed in this review:
- The demo checks in the polish table ran from a scratch harness outside the job folder, so they cannot be re-run from this job. A committed `tools/demo-check.mjs` would change the integrity count (32 to 33) and need another full run.
- No person has judged the feel on a TV or a phone.
- `spring` returns `[0, 0]` and `settleTime` returns 0 for a non-positive mass, with no error (documented gap).
- PR #5's body still describes c0570a8 and run 37635529608. It was not edited.

Fixed in this review: `INTEGRATION.md`, the feel-target paragraph, now states the inputs behind the 1.43 s bound and the 0.64 s first crossing with the same inputs.
