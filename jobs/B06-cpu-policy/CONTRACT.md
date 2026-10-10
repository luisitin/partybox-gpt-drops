# Public model contract

This is a small original decision model for a party game, not an assertion that
Nintendo uses these formulas. Research records observed behavior separately.
No decompiled CPU program or controlled hardware experiment was available.

All functions take `(state, difficulty, rng)`. `chooseBranch`, `chooseItem` and
`chooseShopBuy` return the selected ID or `null`. `buyStar` returns a boolean.
Inputs and returned outcomes must never be modified. Legal states have finite
nonnegative integer coins/costs; starPrice is positive; distances are nonnegative
integers or null; turnsLeft is a nonnegative integer; IDs are unique within each
list. Inventory has at most three actions. Action movement, coinGain and starGain
are nonnegative integers; buddyGain is 0 or 1; risk is in [0,1]. Lists may be empty.
The host supplies actual effect estimates and legal-action flags.

No action is possible with zero turns left. Branches require affordable cost;
items and shop offers require legal=true and affordable cost. Shopping is disabled
with three inventory items. When no actual item or shop action is eligible,
return null without consuming a random draw. Item and shop selection includes a null (decline)
option with utility zero. Branch selection includes null only if no branch is
affordable. Input order determines tie order; null is last when included.

Model utilities are fully specified so independently authored implementations
can be compared. An action's utility is:

`50*starGain + coinGain - cost + 4*buddyGain - 20*risk + progress`.

When a star's distance is known, progress is min(movement,distance); otherwise
it is zero. If distance is positive and movement reaches it and coins after cost
can pay starPrice, add 30. When a buddy is already present, buddyGain has no value.
For shop purchases, subtract 30 when spending leaves less than starPrice and a
star lies at distance<=10 (including zero). Decline still has zero utility.

A branch's utility is coinGain-cost +4*buddyGain-20*risk, plus
`100/(distanceToStar+1)` when that distance is known and coins-cost+coinGain can
pay starPrice. Otherwise, with a known distance, add `10/(distanceToStar+1)`.
Existing buddies suppress additional buddy value. The highest utility is greedy.
Ties require exact utility equality and retain input order.

Easy chooses uniformly among eligible options. Normal explores uniformly with
probability .5; Hard with .1; Master with zero. Otherwise selection is uniform
among maximum-utility options. One RNG draw u is used: exploration when u<q,
index floor((u/q)*eligibleCount); greedy otherwise, index
floor(((u-q)/(1-q))*tieCount). Master still consumes one draw for ties. If there
are no eligible options, no RNG call occurs. Invalid RNG (throws, nonfinite,
outside [0,1)) makes the selection decline rather than throwing.

Star purchase requires turnsLeft>0, starAvailable and coins>=starPrice. Easy
buys with probability .5, Normal with .85, Hard with .98, Master with 1; one RNG
draw is always consumed for an otherwise legal purchase. These probabilities
are model design assumptions, not measured Nintendo CPU frequencies.

The toy board benchmark is documented independently and uses these policies
without private opponent information. Its result does not establish a win rate
against Nintendo CPUs or human players.
