# Assumptions

- Every legal physical deal is equally likely after conditioning on the recorded observations. Unknown card selection by a refuter is existential evidence, not a likelihood model of their choice.
- Player indices are clockwise. A suggestion records its first refuter; every intervening player cannot hold any suggested card. A null refuter means all other players could not show.
- Hand sizes are public and exact; their sum is the deck size minus three. Own hand is complete. Known cards may also be supplied independently through `shown`.
- The envelope contains exactly one suspect, weapon, and room. The classic deck is 6/6/9; an optional deck supports the required reduced 3/3/4 verification.
- Invalid inputs and contradictory observations return an error value. Timing is measured per complete solve of an accumulated game log, with no warm cache or heuristic approximation.

## Runtime validation recovery

Optional deck/shown values default only when undefined; explicit null and non-array shape substitutes are malformed. Every suggested category slot must contain a valid card, and sparse deck categories are invalid. These are the existing contract's expectations, already enforced by the unchanged independent reference. Production now rejects12actually reproduced malformed false successes. Exact counting, uniform physical-deal semantics and empirical200ms gate remain unchanged. Historical timing/CI evidence is kept separate from current exact-head acceptance; no native local timing rerun is used for this repair.


## Final validation repair handoff (2026-10-09)

Implementation source c47cdf5570896c0ca80869c2cfca8116d945db16 passed the complete original hosted workflow. The whole official archive and native log were independently accepted at 10:00:38 UTC: 60,000 reduced logs, 15,000 full games, 135,391 full updates, 1,260 sparse cases, three dense cases, 25 actually strict-compiled variants tested across three seeds (75 kills), 618 fixed cases and all 35,305 raw six-player timings. Recorded per-seed maxima were 15.252885000008973, 9.986858000018401 and 19.564508999988902 ms, each below the unchanged literal 200 ms maximum. Every raw sample, quantile, maximum, archive member and native result was checked; these are measured results for these tested logs and hosted hardware.

Three successful substantive no-gain reviews completed in actual order at 10:08:40, 10:11:48.625 and 10:15:44.158 UTC. The earlier failed observer attempt is preserved and never credited. The reviews cover 21 extra seeded validation reversion kills; 141 ordinary malformed-data differential checks plus 18 separate production accessor controls; and 294 valid/error calls checking exact closed-form deal counts, conservation and call-order purity. These checks supplement the original gates and do not inflate their counts. Full evidence, original failed observer output and the actual strict-compiled reversion modules are under reports/recovery-20261009/current-c47.

UNVERIFIED: the raw private independent reference's error-return behavior for caller-defined throwing accessors. It actually throws on the six probed effectful getters; production solveClue returned INVALID_INPUT. These production-only probes do not count as differential passes. The independent reference is unchanged and is not wrapped. The original mandatory plain-data gates remain intact.

No runtime, model, reference, contract, workflow, package, fixture or mandatory count changes were made after c47. This final handoff source must receive its own exact-head original hosted workflow and complete archive/native reader acceptance before supplemental PR26 can become Ready. Original Ready PR12 and canonical source 2b39550d395bab5ea0ad5c18cae19c3f78fdd84c remain preserved and unmerged.
