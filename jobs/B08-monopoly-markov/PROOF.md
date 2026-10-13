# Mathematical model and verification rationale

## Exact transition probabilities

A free token has 39 possible final squares and doubles streak 0/1/2, hence 117
states. Three jail-attempt states make 120. Each transition is one movement roll,
including a failed jail attempt. A third consecutive double enters jail before
movement. Card moves resolve at their destinations; only Chance 36 back-three
reaches another draw (Community Chest 33). All 36 ordered dice outcomes and up to
two independent 16-card draws therefore share denominator 36×16×16=9216. Card
branch weights are integers in units of 1/256. Both independently written exact
builders enumerate all 120 rows and every integer cell is compared, not just
their stationary summaries. Each row sums to 9216 exactly.

## Stationary solution and turn projection

Production starts at GO and repeatedly applies the sparse transition matrix,
normalizing floating mass until the L1 change is at most 1e-15. It then reports
the largest residual in `pi P - pi`. The blind solver replaces one stationary
linear equation with normalization and uses pivoted Gauss–Jordan elimination.
All 120 state probabilities and 40 roll/40 turn projections agree within 1e-12.
The final free squares communicate through positive-probability ordinary rolls
and nonmovement cards; jail is reachable and exits. Failed jail attempts and
varied roll lengths remove periodicity. Unreachable ASAP jail-attempt states
have stationary mass zero; the linear solver accommodates them.

A stationary observation is the state after a roll, equivalent to the state
before the next roll. A free streak 0 or a jailed state marks a turn boundary.
Their stationary mass q is the number of completed turns per movement roll.
Conditioning on that set gives end-turn probabilities; mean rolls per turn is
1/q. This treatment includes failed jail turns and excludes extra doubles rolls.

## Rent and investment

For a street at levelh, expected income per roll is landing probability times
rent; h=0 full set doubles base rent and h=5 represents a hotel. Attributed
investment is price+h×houseCost. Other prerequisite holdings are assumed, so
the result is per-property attributed ROI, not a full-color-set acquisition ROI.
Railroad rent gets one additional base-rent unit on a next-railroad Chance
arrival. Utility ordinary expected rent is 7×multiplier; nearest-utility Chance
uses 70, giving an extra 42 on a one-utility arrival and zero extra for two.
The blind ROI helper independently enumerates those labelled dice/card events.
Income per opponent turn is per-roll income/q. ROI is income/investment and
break-even rolls/turns are investment/income. These are gross expected rent
returns, assuming collection and excluding all other cash flows.

## Simulation uncertainty

The direct simulator rolls actual seeded dice and chooses actual IID cards.
It does not sample a transition CDF. It records 100,000,000 final occupancies
after a fixed 10,000-roll burn-in for each strategy and seed 1/2/3. All draws and
thresholds were fixed before these runs; no seed was discarded or replaced.

Successive occupancies are correlated, particularly during jail stays. For a
square, let f(s)=1{square(s)=square}-p and solve
`(I-P+1*pi) h = f`. The asymptotic variance per observation is
`v = 2 sum(pi*f*h) - sum(pi*f*f)`. Forty right-hand sides are solved together;
the Poisson residual must be below 1e-12. The count standard deviation is
`sqrt(N*v)`, and every square must be within four such standard deviations of
the independently solved Np. A zero-variance square requires exact zero count.
The test uses the Markov CLT variance for 100-million-roll samples, not an IID
binomial variance. Fixed burn-in makes the initialization bias negligible at
this scale; this statistical check supplements exact differential agreement.

## Mutation checks

Each of 25 committed mutations changes one source site in isolation. A compiler
host supplies changed production text to the same strict TypeScript options;
compiler failures do not count as kills. Each emitted module is executed against
the blind transitions, stationary odds, special-arrival ROI and independent
property fixtures. The mutants cover denominator, dice/doubles, all jail rules,
movement, both decks and nested cards, railroad/utility destinations, turn
projection, property rents, set doubling, hotel cost and special-card/turn ROI.
The original source never changes. All executed sources are hashed before and
after the full three-seed run, with authoring seals and deliverable hashes also
verified at both boundaries.
