# Rules, rents and published comparisons

Sources were accessed on 2026-10-07. The engine targets the classic United States
40-square board and US dollar values. The movement model uses independent draws
from the full 16-card decks. The rotating physical decks and held Get Out of Jail
Free cards are outside this explicitly specified IID model.

## Official rules

[Hasbro, Monopoly Classic US C1009, 2021 rulebook](https://assets-us-01.kc-usercontent.com/500e0a65-283d-00ef-33b2-7f1f20488fe2/6755a913-6560-430c-afdc-890014a82ce7/C10090790_INST_MONOPOLY_CLASSIC_F21.pdf)
is the primary source for dice, buildings, railroads, utilities and jail. It
specifies 16 Chance and 16 Community Chest cards, 28 Title Deed cards, 32 houses,
12 hotels and two dice. The jail options include: “Pay $50 at the start of your
next turn, then roll and move as normal.” For a doubles release: “Use the roll to
move, and that’s the end of your turn.” On the third failed attempt, pay and “use
your last roll to move.” Those instructions define the two modeled strategies.

The same US edition says, under Utilities, “Roll the dice to determine rent,”
then four times for one utility and ten times for two. We therefore use a fresh
fair 2d6 rent roll, mean seven, for utilities. The nearest-utility Chance card
requires ten times the rent dice result; the nearest-railroad card doubles normal
railroad rent. Railroads cost $200 and rent $25/$50/$100/$200 for one through four
owned; utilities cost $150. Unimproved complete color sets double base rent.
A hotel requires four houses plus one further house-cost payment. The illustrated
Oriental/Vermont/Connecticut deeds also corroborate their prices/build costs and
all rent levels. The official PDF does not print every street deed.

## Complete US property data

- [Drexel University, Monopoly board prices](https://www.cs.drexel.edu/~popyack/Courses/CSP/Wi18/assignments/HW5/MonopolyBoard_prices.html)
  provides all 22 street purchase prices, house costs and base/one/two/three/four
  house/hotel rents. These rows were extracted into `data/us-properties.json`.
- [Wikibooks, Monopoly/Properties reference](https://en.wikibooks.org/wiki/Monopoly/Properties_reference)
  independently corroborates the complete modern US/Canada rent table, full-set
  base doubling, all railroad levels and utility multipliers. Its older Marvin
  Gardens note is recorded in `CONFLICTS.md`.

These are comparison fixtures. Production has its own immutable property data;
every price, house cost, rent, name, color group and property type is checked.
All 28 properties are output; streets have standalone plus monopoly levels 0–5,
railroads ownership 1–4, utilities ownership 1–2.

## Published numerical tables

1. [Bill Butler, dice-roll probabilities](https://durangobill.com/MnplyDiceRoll.html)
   publishes eight-decimal final occupancy tables for both jail strategies.
   It lists ordinary doubles states and individual jail-attempt states. We take
   its total column and aggregate all jail states with Just Visiting at square 10.
   GoToJail is zero. Maximum observed absolute errors are 4.783e-9 (ASAP) and
   6.876e-9 (maximum stay), below the required 1e-4.
2. [Bill Butler, turn-ending statistics](https://durangobill.com/MnplyStats.html)
   publishes nine-decimal probabilities at turn boundaries for one-, two- and
   three-turn jail strategies. We select one/three, aggregate all jail statuses
   at square 10 and compare to `endTurnLanding`, not per-roll odds. Maximum errors
   are 4.965e-10 and 4.995e-10. This is a second table and counting convention by
   the same author; it is not presented as a second independent publisher.
3. [Truman Collins, probabilities in Monopoly](http://tkcs-collins.com/truman/monopoly/monopoly.shtml)
   is an additional independent publisher. Its four-decimal percentage ASAP
   table agrees on all 40 squares; largest absolute difference is 1.147e-6. Its
   maximum-stay table agrees within 1e-4 on 39 squares, with the aggregate Jail
   convention/rule gap documented separately. The [Pleacher PDF](https://www.pleacher.com/mp/mlessons/stat/monopoly.pdf)
   reproduces Collins’s table and is not counted as another independent source.

`data/published-tables.json` contains the two Butler tables transcribed from the
source pages, retaining their published rounding without renormalization.
`data/collins-table.json` retains Collins’s percentages converted to probabilities
and combines its separate visiting/in-jail rows. No engine imports these files.
All source fixture entries are compared or reported by the full runner.

[Butler’s model description](https://durangobill.com/Monopoly.html) explicitly
defines the 120-state roll model, the two jail rules, reshuffling after every card
draw, keeping GOJF in the decks, turn and roll counting and independent Rob Pratt
agreement. It gives mean rolls per turn 1.1866239585+ and 1.1658963640, agreeing with
our computed values. [Possibly Wrong, Re-analysis of Monopoly (2012)](https://possiblywrong.wordpress.com/2012/12/26/re-analysis-of-monopoly/)
is further context on 120-state/IID assumptions; its code was accessed only after
both independent cores were sealed and was not adopted as either implementation.

## Research limits

The official rule PDF plus two complete modern property tables support the
stated US rules and data. Published tables validate this IID mathematical model,
not every physical deck ordering or player strategy. No probability table or
ROI value is hardcoded as a production answer. Different historical editions,
deck inventories, payment decisions and utility dice interpretations need their
own models and are identified in `ASSUMPTIONS.md` and `CONFLICTS.md`.
