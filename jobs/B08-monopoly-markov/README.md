# B08 US Monopoly exact transition model and rent returns

`monopolyOdds.ts` builds the 120-state classic US model with exact integer
transition counts over 9,216. It reports all 40 final-square probabilities for
`leave ASAP` and `stay max`, doubles/jail states, end-turn probabilities, and
per-property rental ROI and break-even rolls/opponent turns for all legal
house/hotel or railroad/utility ownership levels. Runtime dependencies: none.

The production core and a separately authored blind transition/linear reference
were each completed and sealed before their source exchange. The independent
source is preserved unchanged in `reference.ts` and `blind-authoring/`.
Production uses power iteration; the blind reference solves stationary linear
equations. Initial strict compilation and full transition differential checks
passed; the full simulation/mutation runner is the next implementation milestone.

## Model and observations

Each Markov step is one movement 2d6 roll, including failed jail attempts.
Chance/Community Chest moves resolve before recording the occupied square.
GoToJail final occupancy is zero. Square10 combines Just Visiting and actual
jail occupancy; their states remain distinct. Cards are IID uniform draws from
the standard 16-card decks, with GOJF kept in the deck and not used.

ASAP pays before rolling and then follows normal doubles rules. Maximum stay
tries doubles for up to three jail turns; doubles release grants no extra roll,
and the third unsuccessful attempt pays and moves using that roll.

ROI assumes every rent is collected and properties are unmortgaged. Street
level0 is supplied both without and with a complete color set; levels1–4 are
houses and level5 is a hotel. Investment is purchase price plus building cost
attributed to this property, with other prerequisite holdings assumed. Railroads
and utilities have ownership levels rather than house levels. Next-railroad
Chance doubles rent. The cited 2021 US rulebook directs a fresh utility rent
roll, with mean seven; nearest-utility Chance uses the ten-times rent rule.

## Build

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
node core-selfcheck.mjs
```

The complete `npm test` pipeline is pending at this implementation milestone.
It will run all required suites with seeds1,2,3 and no reduced counts.

Published numeric fixtures in `data/` are comparison inputs only. Production
does not import published probabilities or return a stored probability table.
See `VERIFY.md` for observed checks and pending work.
