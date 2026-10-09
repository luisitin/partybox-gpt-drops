# B09 Clue exact deduction engine

An exact, dependency-free TypeScript solver for classic Clue and reduced decks. All consistent physical deals carry equal weight, and probabilities use reduced BigInt fractions. No sampling, heuristic probabilities, global cache, or player card-selection model is used.

## Run

```sh
cd jobs/B09-clue-solver
npm ci
npm test
```

Node 24 and TypeScript 5.9.3 are used. TypeScript is a development dependency; the compiled solver has zero runtime dependencies. `npm test` performs strict compilation, all original random-case counts for seeds 1, 2, and 3, then 25 individually planted production mutations for all three seeds. A mutant must compile successfully before its behavioral rejection counts. Results are written to `results.json` and `mutation-results.json`.

## API

```ts
import { solveClue } from "./clueSolver.js";
const result = solveClue({
  handSizes: [3, 3, 3, 3, 3, 3],
  me: 0,
  ownHand: ["Green", "Candlestick", "Ballroom"],
  suggestions: [{
    player: 0,
    cards: ["Mustard", "Rope", "Study"],
    refutedBy: 2,
    shownCard: "Rope"
  }]
});
```

`types.ts` defines the complete contract and classic card names. Players are clockwise indices. `cards` is ordered suspect, weapon, room. Player 1 in this example cannot hold any suggested card; player 2 holds Rope. A null refuter excludes the suggested cards from every other hand. An unknown shown card creates an existential constraint: the first refuter holds at least one suggested card. `shown` can record additional previously observed owners. `ownHand` must be complete.

Success returns `ok: true`, exact `totalDeals: bigint`, and each card's envelope and per-player probabilities as `{numerator: bigint, denominator: bigint}`. BigInts require an explicit serialization strategy for JSON. Invalid input and logically contradictory evidence return `ok: false` with `INVALID_INPUT` or `CONTRADICTION`; the public function catches malformed runtime objects and never throws. Input is not mutated.

The optional deck permits unique nonempty identifiers in three nonempty categories with at most 21 total cards. Three to six exact public hand sizes must sum to deck size minus three. Zero-size hands and unequal sizes are supported. The normal classic deal uses the usual balanced sizes.

## Counting proof

The production solver propagates forced ownership, capacity, envelope-category, and refuter constraints. Each propagation removes only owners that cannot appear in a legal deal. It then assigns every remaining labeled card to each allowed owner exactly once. A memoized suffix count records the number of completions for the remaining hand capacities, envelope categories, and unsatisfied refuter clauses. Terminal states count one if all conditions hold and zero otherwise. Prefix multiplicities times suffix counts give each card-owner marginal without enumerating the same state repeatedly. Up to 30 unresolved refuter constraints use compact number masks; larger logs use BigInt masks. The suffix traversal avoids temporary transition objects.

Internal counts use exact JavaScript integers. With at most 21 cards, the envelope has at most `7*7*7 = 343` choices. After fixing the complete observer hand and envelope, at most 18 cards remain to at most five other hands. Their multinomial count is maximized by sizes `4,4,4,3,3`: `18!/(4!^3*3!^2)`. Therefore the total is at most `343*18!/(4!^3*3!^2) = 4,412,644,236,000`, below `2^53`. Smaller decks or fewer unfixed cards cannot increase this bound. Every stored count, prefix-times-suffix product, and marginal is bounded by that total. Conversion to BigInt and fraction reduction are exact. Numeric state keys are also exact: at most `4^6` capacity states, eight envelope masks, and `2^30` refuter masks give a bound below `2^53`.

The independent implementation in `reference.ts` literally enumerates deals for the required reduced 3/3/4 deck. On larger decks it enumerates envelope candidates and grouped hand allocations with multinomial weights. See `INDEPENDENCE.md` for the authoring boundary. Neither implementation reads envelope truth from test fixtures.

## Verification scope

Each seed compares 20,000 random reduced logs and every update of 5,000 simulated classic games, evenly covering 3, 4, 5, and 6 players. Games include known shows, unknown refuter constraints, no-refuter events, complete observer hands, and 4–12 suggestions. Every update preserves positive probability for the true envelope, and exact ownership/category/capacity conservation is checked. Sixty additional six-player logs retain unknown refuter cards, with seven updates each. A deterministic 690-suggestion case exercises the BigInt mask path and has exactly one deal. Six-player timing reports p50, p99, and the literal maximum across game, sparse, and dense cases, and any observed call over 200 ms fails the suite.

Measured results and hosted CI are recorded in `VERIFY.md`. Timing is an empirical gate for these seeded cases on the execution hardware, not a proof for every possible log or every machine. Exact counting can require more states as constraints accumulate.

## 2026-10-09 recovery audit

Original Ready PR12/source2b395 is protected. An isolated followup repairs12 genuinely reproduced malformed-input false successes while leaving the exact counting algorithm and independent reference unchanged. Strict build/three seeded206-case smoke suites pass; every original194 fixed case remains. The original full random/mutation/200ms gates remain, with complete timing samples and actual compiled mutant bytes now retained for independent hosted verification. Exact new-head full proof and KEEP are pending. See [recovery evidence](reports/recovery-20261009/README.md) and [NEXT.md](NEXT.md).
