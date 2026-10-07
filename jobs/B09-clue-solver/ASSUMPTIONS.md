# Assumptions

- Every legal physical deal is equally likely after conditioning on the recorded observations. Unknown card selection by a refuter is existential evidence, not a likelihood model of their choice.
- Player indices are clockwise. A suggestion records its first refuter; every intervening player cannot hold any suggested card. A null refuter means all other players could not show.
- Hand sizes are public and exact; their sum is the deck size minus three. Own hand is complete. Known cards may also be supplied independently through `shown`.
- The envelope contains exactly one suspect, weapon, and room. The classic deck is 6/6/9; an optional deck supports the required reduced 3/3/4 verification.
- Invalid inputs and contradictory observations return an error value. Timing is measured per complete solve of an accumulated game log, with no warm cache or heuristic approximation.
