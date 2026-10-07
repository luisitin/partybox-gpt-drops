# B08 production authoring before independent source exchange

The production owner authored `monopolyOdds.ts` from the original B08 prompt,
root README, and the public state/jail/card/counting contract sent to the
coordinator. The remote B08 branch contained a workflow stub and no job source;
its job tree was inspected by file names only before this new source was written.

The coordinator separately authored a blind transition builder and linear
solver. Its file path and seal were announced, but that implementation, its
tests, algorithm source, and generated probability answers have not been opened
by the production owner before this production seal. No production source was
sent to that author. The independently chosen production method is sparse power
iteration on an integer transition count matrix.

Permitted shared mathematical inputs define 120 states, 36 ordered dice
outcomes, IID uniform 16-card decks, destination card resolution, exact counts
over 9216, ordinary doubles streaks, paid ASAP release, and the maximum-stay
three-attempt jail rule with no repeat roll after a jail doubles release.
Landing counts mean final occupancy per movement roll, including failed jail
attempts; final GoToJail occupancy is zero. A separate end-turn projection is
provided for comparison with published conventions.

Public research reviewed before this seal includes Bill Butler's documented
jail/card conventions, Truman Collins's published tables, Hasbro's 2021 US
classic rulebook, and Drexel University's complete classic US rent table.
Initial search output also displayed excerpts of third-party simulation C code;
no such code was copied or used as this module's implementation. The sealed
independent counterpart source remained excluded. Data values and rules are
public mathematical inputs, not exchanged implementation source.

Rent calculations use the cited Hasbro 2021 fresh utility-rent dice instruction
(mean seven), the nearest-utility Chance ten-times rule, and the next-railroad
Chance double-rent rule. Street zero-house complete-set rents are doubled;
unimproved standalone returns are also reported. A hotel costs five house
payments in total. Investment is attributed per property, assuming prerequisite
set ownership; the other properties' costs are not attributed again. Returns
are per movement roll and per opponent turn.

The core has no runtime imports or npm runtime dependencies. It has no
`Math.random` or `Date.now`, and its functions do not read clocks or sample dice.

Strict compilation before counterpart-source access passed with ES2022,
NodeNext, strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes,
noUnusedLocals, noUnusedParameters, noEmitOnError, noImplicitOverride, and
noFallthroughCasesInSwitch. Exact command:

```sh
node /workspace/job-B02/jobs/B02-board-odds/node_modules/typescript/bin/tsc -p /workspace/job-B08/jobs/B08-monopoly-markov/tsconfig.json
```

`node core-selfcheck.mjs` passed 30,494 assertions before source exchange.
They include the state bijection, all exact row totals and integer weights,
hand-derived nested Chance/CC and jail counts, jail-release doubles rules,
stationary and end-turn normalization, residual below 1e-13, every property,
hotel purchase/build cost, and rental break-even algebra. Observed power
iteration required 197 iterations for ASAP and 255 for maximum stay, with
maximum residuals 3.47e-17 and 2.78e-17. `CORE-SELFCHECK.json` preserves the
full observation record.

`PRODUCTION-SEALED-SHA256SUMS.txt` is created after these successful checks and
before reading the independent implementation or performing integration. It
seals this authoring record, the production core, its pre-exchange self-check
driver, and its raw self-check report.

## UNVERIFIED at this authoring boundary

Independent differential agreement, complete published-table comparisons,
100-million-roll simulation suites, 25 isolated mutations, and GitHub CI are
integration work following this seal. No completed result for those suites is
claimed by this pre-exchange record.
