# Reference solver independence

`reference.ts` was authored by a separate agent given only the shared `types.ts`
contract, `ASSUMPTIONS.md`, and contract clarifications supplied by its parent:
three to six players, at most 21 cards, nonempty unique names (including whitespace
names), positional suspect/weapon/room suggestions, and reduced BigInt fractions.
The author did not inspect `clueSolver.ts`, any production solver implementation,
the README, or production tests. No production code was copied or used to derive
the reference counting algorithm.

For every reduced 3/3/4 deck, the reference literally enumerates physical deals:
each card receives an owner, exact hand capacities and one envelope card per
category are enforced, and every refuter's existential condition is checked.
Every surviving labeled deal contributes one to the total and its ownership
counts. Necessary evidence deductions prune branches without changing their
weight.

For larger decks, the independent oracle enumerates envelope triples, propagates
necessary ownership facts, then groups remaining cards with identical allowed
owners and identical memberships in still-unsatisfied refuter conditions. It
enumerates integer allocations of each group among players. The multinomial
coefficient converts an allocation into its number of labeled physical deals.
Per-card marginals follow from symmetry within each group. This method does not
enumerate assignments one card at a time or use a production probability model.
Its memoization is local to one invocation. Arithmetic is exact BigInt; no random
generator, clock, runtime dependency, sampling, or approximation is used.

An exact shortcut handles evidence whose remaining cards all have identical hand
eligibility and whose refuter conditions are already satisfied by known owners.
It multiplies the number of independent envelope choices by the multinomial for
the remaining hand capacities. Each envelope candidate is symmetric within its
category; conditional on staying outside the envelope, each unknown card's hand
marginal is its player's remaining capacity divided by the number still dealt.
This avoids enumerating envelope triples for initial logs and suitable later
prefixes. The literal reduced-deck enumeration remains unchanged.

Both paths condition uniformly on complete physical deals. An unobserved show
requires only that the first refuter hold at least one suggested card. All
clockwise intervening players are forbidden those cards. A null refuter forbids
the cards to every player other than the suggester. Recorded shown cards force
ownership. The observer's hand is complete, and the envelope has one card from
each category.
