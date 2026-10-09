# Assumptions

- Every legal physical deal is equally likely after conditioning on the recorded observations. Unknown card selection by a refuter is existential evidence, not a likelihood model of their choice.
- Player indices are clockwise. A suggestion records its first refuter; every intervening player cannot hold any suggested card. A null refuter means all other players could not show.
- Hand sizes are public and exact; their sum is the deck size minus three. Own hand is complete. Known cards may also be supplied independently through `shown`.
- The envelope contains exactly one suspect, weapon, and room. The classic deck is 6/6/9; an optional deck supports the required reduced 3/3/4 verification.
- Invalid inputs and contradictory observations return an error value. Timing is measured per complete solve of an accumulated game log, with no warm cache or heuristic approximation.

## Runtime validation recovery

Optional deck/shown values default only when undefined; explicit null and non-array shape substitutes are malformed. Every suggested category slot must contain a valid card, and sparse deck categories are invalid. These are the existing contract's expectations, already enforced by the unchanged independent reference. Production now rejects12actually reproduced malformed false successes. Exact counting, uniform physical-deal semantics and empirical200ms gate remain unchanged. Historical timing/CI evidence is kept separate from current exact-head acceptance; no native local timing rerun is used for this repair.
