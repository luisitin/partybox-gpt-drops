# B08 US Monopoly exact transition model and rent returns

`monopolyOdds.ts` builds the 120-state US classic model with exact integer transition counts over 9,216. Its power solver computes 40 long-run final-square probabilities for both jail strategies, 120 state probabilities, end-turn odds, and rent ROI/break-even rolls and opponent turns for every property and building or ownership level. Runtime dependencies: zero. The pure module imports no published answer tables, clocks, randomness or other runtime modules.

## Use and outputs

```ts
import { monopolyOdds, allMonopolyOdds } from './build/monopolyOdds.js';
const asap = monopolyOdds('leave ASAP');
const maximumStay = monopolyOdds('stay max');
const both = allMonopolyOdds();
```

`odds.json` contains both computed results and square names. `roi.csv` contains all 348 property/scenario rows across both strategies: 22 streets × 7 scenarios, four railroads × 4 and two utilities × 2 per strategy. Street scenarios are standalone base rent and complete-set levels 0–4 houses/5 hotel. Railroads and utilities use ownership counts. Investment is attributed to this property, assuming other prerequisite holdings; all rent is collected. Utility rent uses the cited 2021 US fresh rent roll. Chance railroad/utility premiums are included. Income/break-even turns mean opponent turns, derived from stationary rolls per turn. See `ASSUMPTIONS.md`.

Landing means final occupancy after a movement roll, including failed jail attempts and card relocations. Physical square 10 aggregates visiting and jailed states; square 30 is zero. `endTurnLanding` supplies the separate turn-boundary convention. Both 16-card decks use independent uniform draws with GOJF retained as a nonmovement card. Maximum stay attempts doubles through its third jail turn, and jail doubles release ends that turn. ASAP pays before rolling and then permits normal repeated doubles.

## Full reproduction

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The single full command verifies all authoring/deliverable seals, strictly builds with pinned TypeScript 5.8.3, checks computed delivered outputs and runs every suite with seeds 1/2/3. Each seed compares both exact matrices and all stationary/ROI values to independently authored implementations, checks published tables and normalization, directly simulates 100,000,000 movement rolls for each strategy, and strictly compiles/runtime-kills 25 isolated mutants. Total: 600M rolls and 75 runtime kills. The workflow runs the same full command after fresh locked installation on Node 22.16.0.

To regenerate delivered outputs after a deliberate implementation change: `npm run build && node export.mjs --write`. Run the full tests and update the manifest with `node hashes.mjs --write` after updating reviewed artifacts. Normal `npm test` checks rather than rewrites the outputs.

## Evidence and sources

`VERIFY.md` records exact commands, counts and observed results. `reports/` preserves full local raw evidence; each run also creates `.verification/`, which CI uploads. `SOURCES.md` cites the official US rulebook, complete rents and published tables. Two Butler tables match both strategies within 1e-4; an additional independent Collins ASAP table matches. The Collins maximum-stay Jail gap and edition/counting differences are recorded in `CONFLICTS.md` without changing thresholds or replacing seeds.

Production and its blind transition/linear reference were each authored and sealed before source exchange. The separate blind ROI helper was also sealed before its exchange. Sources and pre-exchange records remain unchanged; see `INTEGRATION-AUTHORING.md`, `PRODUCTION-AUTHORING.md` and `blind-authoring/`. `PROOF.md` explains the exact transition model, turn conversion, rent formulas, correlated simulation variance and mutations. `SHA256SUMS.txt` inventories every delivered job file and the required workflow.
