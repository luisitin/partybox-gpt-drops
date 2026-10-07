# B07 exact optimal solitaire Yahtzee

Pure strict TypeScript scoring and optimal hold/category decisions, backed by
complete solved state tables and independently authored generators. Every legal
action and fair-dice outcome is evaluated, without search cutoffs or Monte Carlo
values in the solver. Expectations use IEEE754 doubles.

| Rule mode | Primary empty-card EV | Independent empty-card EV |
|---|---:|---:|
| `official` (default) | 254.58772873449593 | 254.5877287344961 |
| `published` | 254.58960948196315 | 254.58960948196366 |

The requested 254.5896 benchmark belongs to the published convention. Hasbro's
forced Joker convention has a different result. Both are exposed explicitly;
see CONFLICTS.md and the pre-exchange PUBLIC-CONTRACT.md. Neither generator nor
the production API receives a starting target as input.

Run `npm ci && npm test` from this folder. This single command strictly builds
both TypeScript cores, checks all historical seals and file hashes, regenerates
both full tables with each generator, then executes all full suites with seeds
1, 2 and 3. The readonly 30-minute Ubuntu workflow runs this same command.
Development tools are Node 22, TypeScript 5.8.3 and g++; production has zero
runtime dependencies. `npm run build` creates `build/yahtzeeOpt.js` and its
TypeScript declarations plus the shipped JSON tables. Import `score`,
`expectedValue`, `bestCategory`, `bestHold` and `valueOfHold` from that module.

The public contract documents category order, reachable scorecards, transitions,
rerolls and deterministic ties. Production functions perform no I/O, random
sampling or clock reads. Their finite internal memoization preserves results.
Each binary table is 8,388,608 bytes and each compact JSON table is under 13 MB.
Of 1,048,576 slots per mode, 536,448 are valid reachable scorecards. Invalid
slots are NaN in binary and null in JSON.

To regenerate just the primary tables:

```sh
mkdir -p .verification
g++ -std=c++20 -O3 -ffp-contract=off -fopenmp -Wall -Wextra -Werror generator.cpp -o .verification/generator
OMP_NUM_THREADS=2 .verification/generator --mode official --output tables/official.bin
OMP_NUM_THREADS=2 .verification/generator --mode published --output tables/published.bin
node convert-tables.mjs
```

`independent/` retains the separately sealed core, generator, its own full tables
and original selfchecks. Original seals, primary snapshot and amendments make
post-exchange corrections auditable. Native simulation is a development-only
accelerator: six million complete games compare every hold, category and score
transition between the two independently authored policies. Every visited
component's full native values/actions are tied back to both actual TypeScript
bodies; fingerprint-bound proof reuse within one fresh invocation compares all
8,572 bytes again, and never skips games or samples component records.

VERIFY.md gives actual counts, commands, simulation means, tolerance and the
remaining literal prompt conflict. Reports retain an earlier complete local
pass separately from the final integration rerun. The pull request links the
observed GitHub run for its exact final commit; an unmerged PR is for review.
