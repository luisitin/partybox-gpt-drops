# B02 correctness argument

This is a mathematical design argument, not a machine-checked proof or a claim that tests establish the absence of all bugs. The movement contract is in README.md.

## 1. Resolve the policy before movement

After duplicate destinations are removed, each nonempty selected successor set defines positive probabilities summing to one. Reverse breadth-first search computes directed hop distances to a target. Retaining all successors with minimum distance implements the documented target policy, including uniform ties and the all-unreachable case. The policy is fixed and memoryless for the roll.

## 2. Separate zero-cost recurrent classes

A zero-cost transition enters a pass-through node. Any closed recurrent class consisting solely of pass-through nodes and with nonempty outgoing choices can be entered while steps remain but cannot ever consume a step or reach a dead end. Replace each such communicating class with a separate absorbing nontermination outcome. Keep separate classes so that infinite expectations are assigned only to members of classes that can actually be reached.

Every remaining zero-cost communicating class has a positive-probability exit, directly or eventually. In a finite graph, its zero-cost substochastic transition matrix Q is transient. Thus the sum I + Q + Q² + ... exists and equals (I − Q)^−1. A pass-through dead end is an exit, not a recurrent class. Unreachable components do not invalidate the argument; they are independently classified and solved.

## 3. Compute one movement-step kernel exactly

Let B contain the immediate boundary probabilities: entry into an ordinary destination, stopping at a dead end, or absorption into a nontermination class. Let H contain the expected immediate entries into each nonrecurrent pass-through node. The exact closure is:

    K = (I − Q)^−1 B
    R = (I − Q)^−1 H

K gives the distribution after one ordinary step, earlier dead-end stopping, or nontermination absorption. R gives expected finite pass counts before that boundary. Dead ends and nontermination outcomes are absorbing in K with zero subsequent finite rewards. For an actual node already inside a trap, a positive movement step moves immediately to that trap's nontermination outcome; zero steps still land at the actual initial node.

Since every path either reaches a boundary or enters one of the identified recurrent classes, every K row sums to one. All its entries are nonnegative. Gauss–Jordan operations use exact rational arithmetic, so no numerical convergence tolerance or finite loop cutoff is introduced.

## 4. Compose movement and rewards

For successive kernels A and B, conditional expectation gives:

    K_AB = K_A K_B
    R_AB = R_A + K_A R_B

The zero-step kernel is the identity transition with zero reward. By induction, composing k copies gives the exact distribution after k movement steps, with early stopping retained by absorbing states, and the exact expected finite pass counts. Kernel composition is associative because ordinary matrix multiplication and distributivity hold over rational numbers. Therefore repeated squaring and binary decomposition of a nonnegative safe integer face give the same result as step-by-step composition.

This argument does not rely on independence of successive rewards; it uses conditional expectation given the current node. Repeated entries into a shop are counted repeatedly. Starting on a shop adds no reward because the identity kernel contains no entry event.

## 5. Combine die faces

For exact die weights w_f ≥ 0 summing to one:

    landing_j = sum_f w_f (K^f)_[start,j]
    nonTermination = sum_f w_f sum_t (K^f)_[start,trap_t]
    finitePasses_j = sum_f w_f R_f[start,j]

Consequently physical landing mass plus nontermination mass is exactly one for every start. Zero weights are discarded before exponentiation or expectation evaluation. No undefined zero-times-infinity expression is evaluated.

Within a finite closed irreducible class, each member is revisited infinitely often with probability one conditional on entering that class. Hence a node in such a class has infinite unconditional expected passes precisely when the weighted probability of reaching the class is positive. Nodes outside these classes retain the finite reward result, including passes accrued on paths that eventually become trapped.

## 6. Independent checks and their limits

The sealed blind oracle restricts its unknowns to each transient pass-through component. It multiplies uniform branch equations by their degree and solves the component with exact forward elimination/back substitution, combining already solved successor components. Its dynamic program recurs only through ordinary entry destinations, treating pass-through dead ends as terminal outputs. This was independently authored before production source exchange. The historical supplemental oracle uses sparse state elimination and geometric self-loop resummation; it does not supply required comparisons.

The third implementation explicitly enumerates all finite edge paths on the acyclic and step-consuming-cycle test families. Its guard detects accidentally supplied zero-cost cyclic inputs; it never truncates them into a guessed answer. Infinite families of paths in zero-cost loops are checked by the resummation oracle and hand-calculated regressions instead of pretending finite enumeration is exhaustive there.

For a landing count C from N trials with exact probability a/b, the four-sigma condition is checked without floating-point comparison:

    (C b − N a)^2 ≤ 16 N a (b − a)

For a pass-count total T, exact mean a/b, and exact single-roll variance v/d, it is:

    (T b − N a)^2 d ≤ 16 N v b²

These equations also handle zero variance with zero tolerance. The simulator's 32-bit rejection sampler removes modulo bias. These statistical checks test the fixed seeded streams; they neither prove random-number-generator independence nor eliminate the multiple-comparisons issue inherent in any four-sigma family of tests.
