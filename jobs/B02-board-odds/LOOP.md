# Improvement log

## 2026-10-07: blind independent reference

Weakest recorded requirement: prior code and CI results could not establish
blind independent authorship, because both historical implementations came from
one assistant. A separate agent authored an exact reference without access to
production, test, oracle, or algorithm-documentation source. It passed strict
compilation, 24 hand fixtures, 36,460 DAG path comparisons, and 34,280 cyclic
result invariant checks, then sealed its source before integration.

The unchanged sealed reference now supplies every required differential and
mutation comparison. The historical oracle remains a supplemental artifact.
The full integrated `npm test` exited zero on Node v24.19.0 and TypeScript 5.8.3. All 7,500 seeded random graphs, every start/faces 0–10 under both policies, 150,000,000 simulated rolls, and all 75 strictly compiled/runtime-killed mutants passed. GitHub independently completed the same full suite at milestone fc7f7b8 (run 37635686808), with a fresh locked npm installation. Exact counts, source hashes, per-seed witnesses, and raw-report digests were regenerated from this run. The final documentation head is independently checked and linked in PR #4.
