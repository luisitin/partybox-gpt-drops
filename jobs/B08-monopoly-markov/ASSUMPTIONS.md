# Model conventions

- State means the status before the next movement dice roll. There are39
  possible final free squares (GoToJail is immediate), three doubles streaks,
  and three jail-attempt states:120 states total.
- One chain observation is the final occupied square after one movement roll,
  including a failed jail attempt. A separate projection records end-turn odds.
- The deck model is independent uniform draws from all16 cards, without GOJF
  holding or removal. This matches the compared published tables. Actual
  shuffled rotating decks and player card inventories require additional state.
- ASAP pays before rolling, allowing normal repeated doubles. Maximum stay
  attempts doubles even on its third jail turn; all jail release rolls end that
  turn and reset the doubles streak.
- All36 ordered outcomes of two fair six-sided dice are equiprobable. Third
  consecutive doubles send the token to jail before ordinary movement.
- Chance36 back-three resolves the Community Chest33 draw. Card moves into
  jail reset the doubles streak; other card movement preserves it.
- House-level0 complete-set rent doubles the base rent. Standalone base rent
  is also reported. A hotel represents five house-cost payments.
- ROI is per-property cost attribution, assuming other required group holdings
  already exist, all rent is collected, and no property is mortgaged. It excludes
  taxes, salaries, jail fines, bankruptcy, trading, and financing.
- Utility rent follows the cited2021 US fresh-dice rule, mean seven. Chance
  nearest-utility overrides to ten-times; nearest-railroad doubles ordinary rent.
- Break-even turns mean opponent turns, with rolls-per-turn derived from the
  stationary distribution. Multiple identical opponents can be accounted for
  by summing their expected incomes per round.
