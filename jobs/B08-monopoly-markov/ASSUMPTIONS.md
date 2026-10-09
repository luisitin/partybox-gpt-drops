# Model conventions

- State means the status before the next movement dice roll. There are 39
  possible final free squares (GoToJail is immediate), three doubles streaks,
  and three jail-attempt states:120 states total.
- One chain observation is the final occupied square after one movement roll,
  including a failed jail attempt. A separate projection records end-turn odds.
- The deck model is independent uniform draws from all 16 cards, without GOJF
  holding or removal. This matches the compared published tables. Actual
  shuffled rotating decks and player card inventories require additional state.
- ASAP pays before rolling, allowing normal repeated doubles. Maximum stay
  attempts doubles even on its third jail turn; all jail release rolls end that
  turn and reset the doubles streak.
- All 36 ordered outcomes of two fair six-sided dice are equiprobable. Third
  consecutive doubles send the token to jail before ordinary movement.
- Chance 36 back-three resolves the Community Chest 33 draw. Card moves into
  jail reset the doubles streak; other card movement preserves it.
- House-level 0 complete-set rent doubles the base rent. Standalone base rent
  is also reported. A hotel represents five house-cost payments.
- ROI is per-property cost attribution, assuming other required group holdings
  already exist, all rent is collected, and no property is mortgaged. It excludes
  taxes, salaries, jail fines, bankruptcy, trading, and financing.
- Utility rent follows the cited 2021 US fresh-dice rule, mean seven. Chance
  nearest-utility overrides to ten-times; nearest-railroad doubles ordinary rent.
- Break-even turns mean opponent turns, with rolls-per-turn derived from the
  stationary distribution. Multiple identical opponents can be accounted for
  by summing their expected incomes per round.

## Recovery scope, 2026-10-09

The clean-start defect applies to all four exposed runners, so each initializes its own output folder after seed validation. A workflow-only edit must trigger the same original full workflow. This repair retains the original scientific model, driver and sealed bytes. Protected original Ready14 remains open/unmerged; a supplemental owned branch carries recovery work. Only genuine whole exact new-head hosted proof qualifies the new delivery. Current private PartyBox full verification and implementation decisions are outside this audit.
