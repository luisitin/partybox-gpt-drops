# B08 observed verification at the production integration milestone

Passed: strict TypeScript5.8.3 compilation with ES2022/NodeNext,
noUncheckedIndexedAccess, exactOptionalPropertyTypes, noUnusedLocals,
noUnusedParameters, noEmitOnError, and the other committed strict flags.

Observed checks on Node v24.19.0:

| Check | Cases | Passed | Seed | Exact command |
| --- | ---: | --- | --- | --- |
| Production pre-exchange self-check | 30,494 assertions | yes | deterministic | `node core-selfcheck.mjs` |
| Blind pre-exchange self-check | 1,217 assertions | yes | deterministic | command preserved in `blind-authoring/AUTHORING.md` |
| Exact transition differential | 28,800 integer cells, both strategies | yes | deterministic | initial integration Node module command |
| Power/linear stationary differential | 240 state probabilities | yes, maximum9.20e-16 | deterministic | initial integration Node module command |
| Published per-roll/end-turn comparisons | 160 square probabilities, both strategies | yes, below1e-4 | deterministic | initial integration Node module command |
| Official US street data fixture | 22 complete price/build/rent records | yes | deterministic | initial integration Node module command |
| Locked fresh dependency installation | one pinned compiler, zero runtime dependencies | yes | deterministic | `npm ci --ignore-scripts --no-audit --no-fund` |

Both independent transition implementations and the production core were sealed
before source exchange. Original authoring records and self-check reports are
preserved; production SHA256 is
`b43bcb333a028cb622e027ea4563b3bfc86afbada8e189e7fae892b01b538c58`.

## UNVERIFIED

- Full 100-million-roll simulation for every strategy and seed.
- All25 isolated strictly compiled/runtime-killed mutants for each seed.
- Complete single-command runner and all required repeated suites.
- Independently authored ROI computation and full source/conflict record.
- GitHub full-suite CI and final-head observation.

No completion of those pending checks is claimed by this milestone.
