# B10 verification

The complete hosted suite passed on commit `740d13f3aabb56c4fee3f55b3d1e30c706eea7ae`, run [37647836440](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37647836440). Its three seed jobs and required aggregation check passed. Every seed ran every suite with the original counts and gates. The final evidence publication is followed by another complete exact-head hosted run; its status is linked from PR 6.

## Complete hosted results

| Suite | Per seed | Total | Result |
|---|---:|---:|---|
| Strict TypeScript build | 1 | 3 | Passed |
| Static contract checks | 6 | 18 | Passed |
| Fixed unit fixtures | 29 | 87 | Passed |
| Reduced exact densities against blind enumeration | 10,000 | 30,000 | Passed |
| Reduced Easy/Medium/Hard policy comparisons | 30,000 | 90,000 | Passed |
| Sample world and conditional marginal audits | 200 | 600 | Passed |
| Individually planted, successfully imported mutations | 25 | 75 | All caught |
| Synthetic aggregation metadata checks | 27 | 81 | Passed |
| Full games per difficulty | 100,000 | 900,000 across three difficulties | Passed |

The games produced 47,091,168 independent policy comparisons. All 13,459,483 Hard density returns were checked: 5,099,446 exact counts and 8,360,037 sampled world/marginal reductions. There were zero repeated shots, errors, disagreements or decisions above 50 ms. Maximum sampled discrepancy was 2.776e-15. Reduced enumeration visited 4,687,018 consistent labelled fleets; public feedback replay covered 70,992 reduced updates. Synthetic metadata tests are not gameplay evidence.

### Complete benchmark table

Each row contains 100,000 full games; all ships can touch. Latencies are milliseconds.

| Seed | Difficulty | Mean shots | Median shots | p50 | p99 | Literal maximum | Calls >50 ms |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | Easy | 62.15892 | 62 | 0.013 | 0.027 | 1.970545 | 0 |
| 1 | Medium | 49.88569 | 50 | 0.013 | 0.028 | 1.174172 | 0 |
| 1 | Hard | 44.83574 | 45 | 0.087 | 0.408 | 5.523981 | 0 |
| 2 | Easy | 62.19901 | 62 | 0.013 | 0.026 | 1.213885 | 0 |
| 2 | Medium | 49.94174 | 50 | 0.013 | 0.027 | 1.206098 | 0 |
| 2 | Hard | 44.84903 | 45 | 0.085 | 0.399 | 5.980390 | 0 |
| 3 | Easy | 62.21040 | 62 | 0.013 | 0.027 | 3.061759 | 0 |
| 3 | Medium | 49.92109 | 50 | 0.013 | 0.028 | 1.355497 | 0 |
| 3 | Hard | 44.91006 | 45 | 0.088 | 0.430 | 5.616438 | 0 |

Every Hard mean is below 45. The largest measured production call was 5.980390 ms. The timer brackets only the complete `chooseShot` call, including its validation, state preparation, inference, RNG calls and audit-record creation. Host state construction, independent verification and shot application are outside the timer. No warm-up or outlier is discarded.

The exact commands were `npm test -- --seed=1`, `npm test -- --seed=2`, and `npm test -- --seed=3`, followed by `node test/ci-aggregate.mjs reports/ci-seeds`. Default `npm test` runs all seeds. Each hosted seed job took 19.5–20.3 minutes on Node v22.23.3, Linux x64, AMD EPYC 7763. The workflow retains read-only permissions, major-version action pins and a 30-minute limit for each job.

## Evidence and reruns

`evidence/ci-37647836440.json` contains the complete aggregate and all three seed ledgers, including histograms, actual comparison counts, source hashes and literal maxima. The original aggregate artifact is preserved as `.zip`, full Actions output as `.log`, and exact tested-head job status as `-status.json`.

A previous complete hosted run on the same production and blind reference sources also passed: [37645770091](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37645770091), commit `4a11a948f460d30f6e3bacb0a5dcf9db7c49a14b`. It ran all 900,000 games in one command and recorded a literal maximum of 17.699399 ms. Its full report and log are preserved. The subsequent change added complete seed aggregation and 27 rejection/acceptance ledger checks per seed to address the earlier 30-minute timeout.

Production SHA256: `c01c4754d8933cec7819ebcb7e0d88d3df6f5a1668411d8ddfe95444f2cb620e`. Blind exact reference SHA256: `e0991032fc671fdf5876c2ef9b577f4965bbf778a71663c0e965cfed73a086de`. Blind policy/reduction SHA256: `b23c6cd29700804a8fd5bf38542c50b3e47043d3954ad1a08c450cf83de14c9f`. Final-source allocation correctness and additional independent representation equivalence checks are preserved separately.

## Failed history

The original delivery had three measured decisions above 50 ms and no independent per-shot benchmark replay. Those results remain in `evidence/previous-VERIFY.md` and `evidence/raw-reports.zip`. A new 1,000-game exploratory run had a 72.618 ms decision and remains failed evidence. A later optimization pilot passed but never replaced the required counts.

Run [37642504864](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37642504864) at the older `1b8c93f` head exceeded the 30-minute job limit after all 600,000 Easy/Medium games and recorded 60,000 Hard games per seed. Its incomplete ledgers and full log remain preserved. The complete frozen local run of that older source also failed all nine literal timing cells: 3,474 calls exceeded 50 ms, with a largest call of 2751.387129 ms. All 900,000 games and every independent comparison completed; its shot histograms and exact mean fractions equal the final hosted corpus. The complete report, log, slow public-state witnesses and comparison summary remain in `evidence/local-frozen-1b-*`. Its captured production SHA256 is `5887871a928d0d483f7d93531827c6fdec736a12eece4f6875501d42b31882e1`. These failures are not waived or attributed to a cause without evidence.

## Independence and limits

Blind exact and policy references were sealed and pushed before production, old tests, old reference or implementation notes were inspected. Every benchmark decision is replayed using only public state, returned density and the final tie RNG draw. No private simulator fleet enters independent inference. Exact returns are independently enumerated; sampled returns independently validate complete public audit worlds and reduce weighted uniform conditional marginals. The private proposal sampler is not independently replicated; the retained proposal-weight audit and mutations supplement this boundary. `BLIND-REFERENCE.md` records authoring isolation and post-seal optimizations.

The benchmark uses named classic hit feedback and exact known sunk hulls. Anonymous feedback is supported only with an explicitly revealed sunk hull. Finite-sample densities are estimates, and exact inference can return a budget error. The corpus establishes its measured maxima on the recorded machines; universal all-input/all-machine latency, arbitrary raised budgets, a blind replica of the private proposal sampler and hostile JavaScript objects remain unverified.
