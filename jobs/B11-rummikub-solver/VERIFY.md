# B11 verification

The complete independent suite passed in hosted run [37652457475](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37652457475) at exact head `1738f8c9466a370d57d2b9fbf34f4052e3c3b3d6`. The same complete command also passed locally. Both runs used all three seeds and every original count and gate. A subsequent improvement measures the distinct cold-start warmup calls too; the complete final publication-head rerun is linked from PR 7.

## Complete actual results

| Suite | Per seed | Total | Result |
|---|---:|---:|---|
| Strict build of all three TypeScript sources | 1 build | 3 builds | Passed |
| Fixed semantic fixtures | 61, including 40 joker cases | 183, including 120 joker cases | Passed |
| Contract/metamorphic checks | 1,005 | 3,015 | Passed |
| Literal physical-subset differential, at most 14 resources | 50,000 | 150,000 | Passed |
| Fresh integer-model versus literal oracle crosschecks | 1,000 | 3,000 | Passed |
| Fresh independent large optimum certificates | 200 main + 8 distinct warmups | 624 | Passed |
| Derived full-inventory-key audit versus both solvers | 200 | 600 | Passed |
| Individually planted, strictly compiling source mutations | 25 | 75 | All caught |
| Main 40-table/20-hand latency cases | 200 | 600 | Passed |

Every optimum comparison agrees in new-rack represented value and new-rack tile count. Both implementations' table and play witnesses are revalidated by both validators. All large inputs contain exactly 40 table tiles and 20 rack tiles. Every independent numerical solve has OPTIMAL status, exact integer resource rows, verified physical metadata and a reported dual gap below one encoded objective unit. The largest reported gap was 2.984e-10. Of 624 large optima, 211 also close the elementary exact inventory upper bound.

The actual commands for both complete runs were `npm test`; each serially runs all suites for seeds 1, 2 and 3. Standalone commands and source hashes are recorded in every receipt. Hosted elapsed time was 280.164 seconds; local elapsed time was 766.205 seconds. Runtime production dependencies are zero. Development versions are TypeScript 5.8.3, Python 3.12.14, NumPy 2.3.5 and SciPy 1.17.0; the full suite checks those Python package versions on every seed.

### Original complete timing results

The numbers below cover the 200 main calls per seed. The previous eight distinct warmup calls were independently checked but untimed; the improved final harness records and gates all 208 calls per seed. Latencies are milliseconds.

| Seed | Hosted p50 | Hosted p99 | Hosted literal maximum | Local p99 | Local literal maximum |
|---:|---:|---:|---:|---:|---:|
| 1 | 8.560 | 103.229 | 174.651 | 273.533 | 410.982 |
| 2 | 7.597 | 83.949 | 128.637 | 144.271 | 209.270 |
| 3 | 8.660 | 76.644 | 263.521 | 154.204 | 426.301 |

Both complete runs passed the unchanged 500 ms p99 and maximum gates. Production timers bracket only fresh `findBestPlay` calls, including production input validation, search, reconstruction and its own output validation. Host generation, independent inference and separate witness checks are outside the timer. The final harness also records every cold-start warmup timer and requires its maximum at most 500 ms; it retains main p99 and separate main/warmup maxima. No measured outlier is discarded.

## Evidence

`evidence/ci-37652457475/` preserves all 28 hosted receipts, including the complete full-run ledger, all 624 independent answers/certificates with per-input/model/validator/generator hashes, all 3,000 accelerator certificates, 600 individual main timing samples and each worst public input. The original artifact ZIP, complete Actions log and exact-head job status are preserved beside that directory. `evidence/local-1738f8c-full.zip` preserves the complete local receipts and raw output; its summary records the actual timing boundary. Historical same-author evidence remains in `evidence/previous-VERIFY.md`.

The original blind TypeScript source remains SHA256 `dd1439b64a5f46124ba452a2bd54091ab05006f45b1bf1e110bc31645212a3c8`, and the unchanged blind integer model remains `ab4ee25d308423d25d3a03fd8ac44861b91a3e937768d949f41800e0c0edb920`. Both immutable authorship seals and their original selfcheck reports are preserved. The amended author note's future-count typo of 608 is explicitly corrected to 624 in ALGORITHM.md; the seal itself is untouched.

## Independence and certificates

The reference author read only the original task, root repository rules, public API and official English 2019 rule evidence before sealing the TypeScript reference. The amendment used only those materials, the author's own prior work and ten public positions without answers. Production, legacy reference, tests, generators and algorithm notes were never inspected by that author. Each source/provenance hash was delivered before integration and pushed separately. The lead inspected production only after the original seal was published.

All 150,000 small comparisons use the unchanged literal physical-subset oracle. Large reference answers are freshly computed from public positions without production answers. Audit and benchmark reuse only the identical freshly solved corpus, with every input/model/source hash checked and both witnesses revalidated. Production calls have no cross-call cache. The mechanically derived full-state audit supplements the separately authored reference; it is not described as blind authorship.

The model enumerates all legal run/group bindings, imposes mandatory old resources, and optimizes `128 * newRepresentedValue + newRackCount`. Its exact integer witness rows and objective are checked, but optimality for cases not closing the inventory bound relies on the floating-point HiGHS reported primal/dual bound. This is not an exact rational or interval-arithmetic dual certificate. No timeout, approximation, sampled answer, compiler error, crash or launch failure counts as success. Mutation testing requires a passing baseline and every mutant must compile strictly before an assertion kill can count.

## Limits and remaining checks

The original full-size physical-cover reference and a later count-cover draft were too slow in exploration and were stopped without a result; neither replaces any required case. The separately sealed integer model completed every large integration case.

The final improvement's complete publication-head hosted rerun must pass before PR readiness is marked. Universal all-input/all-machine latency, exact rational numerical certificates, intermediate animated joker retrieval/reuse sequences, other rule editions and hostile JavaScript objects remain outside the verified scope. The declared English 2019 end-of-turn profile and its official joker interpretation are documented in SOURCES.md and CONFLICTS.md.
