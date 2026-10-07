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
The full integrated suite and final-head CI are pending at this milestone.
