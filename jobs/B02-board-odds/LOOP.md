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

## 2026-10-07T15:19:49Z: malformed adjacency boundary

The weakest reviewed boundary silently accepted undefined/null adjacency as a dead end and strings as character-by-character edges. Added ten malformed adjacency inputs tested through both public odds APIs, demonstrated an assertion failure against the original implementation, and added array/string-ID guards. Added a named regression distinguishing shortest edge hops from movement cost through pass-through nodes. A separate reviewer confirmed the 20 rejections, policy outputs and unchanged independent-reference seal.

The full npm test passed seeds 1, 2, 3, all 7,500 random graphs, 150M rolls and 75 mutants. Exact evidence is under evidence/cloud-*. Publication is blocked by GitHub server rejection and new-head CI has not run. The earlier initial full run was stopped when the boundary defect was found and is not counted as a pass. Further queue claims require functional delivery.

2026-10-07: Network/API and Git delivery recovered. Checkpoints were read back from remote; stale blocker was removed. A separate review confirmed 20 malformed-next API rejections, the shortest-hop fixture and unchanged reference seal. Earlier additional dense-graph audit found no valid-input odds defect across 48,000 comparisons. Full hosted CI on the final head reruns every required seed/check; pending observations are completed in the PR before queue completion.
