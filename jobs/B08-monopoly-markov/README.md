# B08 Monopoly exact landing odds + ROI

**What this is:** exact long-run odds for the classic 40-square board (where moves and turns end, card arrivals) and the expected rent per opponent turn for every deed and building level, from an exact 120-state Markov chain.
**How to use it:** PartyBox copies one file, `boardOdds.ts` (pure, no imports, no names), into `games/monopoly/server/` to value bot buys, builds and trades and to drive a TV "hottest squares" moment. See `INTEGRATION.md`.
**Status:** done and verified. `npm test` runs exact checks, independent re-derivations, 720M simulated rolls and 135 killed mutants. Port with fixes: PartyBox's utility-rent rule, the Speed Die and the one-attempt jail each need a decision (`INTEGRATION.md`).

## Quick start

```sh
cd jobs/B08-monopoly-markov
npm ci --ignore-scripts --no-audit --no-fund   # TypeScript 5.8.3 only; zero runtime dependencies
npm test                                       # the full suite, about a minute; writes .verification/
start preview/hottest-squares.html             # Windows (macOS: open). TV stats moment; ?view=phone ?lang=es ?plan=stay, keys 1/2/R
```

```ts
import { buildGain, hottestSquares, rentPerOpponentTurn } from './build/boardOdds.js';
hottestSquares(3); // [{ square: 10, chance: 0.0622 }, { square: 24, chance: 0.0319 }, { square: 0, chance: 0.0310 }]
const deed = edition.spaces[24]; // PartyBox's own data: { kind: 'street', price: 240, buildingCost: 150, rents: [...] }
rentPerOpponentTurn(24, deed, { level: 3, fullGroup: true, sameKind: 0 }, edition.rules); // 28.35
buildGain(24, deed, { level: 2, fullGroup: true, sameKind: 0 }, edition.rules); // 0.113 per unit of cost
```

## The product API: `boardOdds.ts`

Everything is indexed by board position 0–39 and takes PartyBox's `Edition['spaces'][number]` and `Edition['rules']` as they are. Every function is total: bad input returns 0 or `[]`, never a throw, NaN or a negative number.

| Export | What it gives |
| --- | --- |
| `BOARD_ODDS[plan]` | `rollsPerTurn` and 40-entry `perRoll`, `perTurn`, `railroadCard`, `utilityCard`, `utilityDice` (generated, bit-exact) |
| `rentPerOpponentTurn(position, deed, holding, rules, options?)` | expected rent one opponent pays per turn they take |
| `rentReturn(...)` / `investmentOf(deed, holding)` | rent per turn per unit invested / price plus buildings (a hotel counts five) |
| `buildGain(position, deed, holding, rules, target?, options?)` | extra rent per unit of building cost from `level` to `target` (default: the next building) |
| `hottestSquares(count, plan?, per?)` | squares by landing chance, hottest first (ties by position) |
| `shareOf(squares, plan?, per?)` | combined chance of a set of squares (duplicates count once) |

`holding` is `{ level: 0-5, fullGroup, sameKind }`, where `sameKind` counts the railroads or utilities the owner holds. `options` is `{ plan?: 'leave ASAP' | 'stay max', utilityDice?: 'movement' | 'fresh' }`. The defaults are `'leave ASAP'` and `'movement'`, because PartyBox's engine today charges utility rent on the dice that moved the piece; `'fresh'` is the rulebook's new throw and reproduces `roi.csv`.

Headline numbers ('leave ASAP' / 'stay max'): Jail ends 6.22% / 11.53% of all moves, then Illinois Avenue at 24 (3.19% / 3.00%) and GO (3.10% / 2.92%); Go To Jail is 0%. Orange is the hottest colour set (8.81% / 8.31%), red next (8.76% / 8.18%). A turn has 1.187 / 1.166 movement rolls. The third-house step (2 to 3 houses) has the highest single-step gain per unit of cost on 20 of the 22 streets; the two browns peak later (`partybox-checks.mjs`).

## The engine and data behind it

`monopolyOdds.ts` (sealed) builds the chain: 117 free states (square × doubles streak 0–2) plus 3 jail-attempt states, with every transition an exact integer count over 9,216 (36 dice outcomes × up to two 16-card draws). `monopolyOdds(plan)` returns the state probabilities, `landing` (per roll), `endTurnLanding` (per turn), `rollsPerTurn` and per-deed `properties[].levels[]` returns; `allMonopolyOdds()` gives both plans. `odds.json` and `roi.csv` are its exported results (348 rows: 22 streets × 7 scenarios, 4 railroads × 4 and 2 utilities × 2, for each plan).

Model conventions: "landing" is where a movement roll ends after cards and Go To Jail, and includes failed jail attempts; square 10 adds jail and Just Visiting together. Decks are independent uniform draws from 16 cards (10 Chance and 2 Community Chest movers). 'Stay max' tries for doubles three times and a doubles release ends the turn; 'leave ASAP' pays first and keeps normal doubles. Railroad cards pay double; the utility card pays ten times the dice. Details: `ASSUMPTIONS.md`, `PROOF.md`, `CONFLICTS.md`.

## Product vs evidence

| Kind | Files |
| --- | --- |
| **Product (port this)** | `boardOdds.ts` |
| Design reference (rebuild in React, do not ship) | `preview/hottest-squares.html` |
| Engine and data (stay here) | `monopolyOdds.ts`, `odds.json`, `roi.csv`, `data/*.json` |
| Generators and tests | `partybox-export.mjs`, `partybox-checks.mjs`, `partybox.mjs`, `export.mjs`, `checks.mjs`, `test.mjs`, `simulate.mjs`, `sampling-variance.mjs`, `mutate.mjs`, `run.mjs`, `hashes.mjs`, `core-selfcheck.mjs` |
| Evidence and records | `VERIFY.md`, `LOOP.md`, `NEXT.md`, `reports/`, `blind-authoring/`, `reference.ts`, `roi-reference.ts`, `*-AUTHORING.md`, `CORE-SELFCHECK.json`, `PRODUCTION-SEALED-SHA256SUMS.txt`, `SHA256SUMS.txt`, `SOURCES.md` |

## Changing things

- After a deliberate solver change, run `npm run build && node export.mjs --write && node partybox-export.mjs --write`, then `npm test`, then `node hashes.mjs --write` (the inventory of every file here plus the workflow). `npm test` only checks; it never rewrites.
- `npm test` checks the authoring seals and builds strictly. Then, for seeds 1, 2 and 3, it runs:
  - the exact suites against independently authored solvers and published tables (Butler, Collins);
  - 100M simulated rolls per plan and 25 solver mutants;
  - the PartyBox suite: exact checks and a fuzz, 20M simulated rolls per plan of turn ends, card arrivals and utility dice, and 20 `boardOdds.ts` mutants.
- CI (`.github/workflows/B08.yml`) runs the same command on Node 22.16.0 and uploads `.verification/`.
- Production and the blind references were authored and sealed before any exchange (`PRODUCTION-AUTHORING.md`, `INTEGRATION-AUTHORING.md`, `blind-authoring/`); the seals must stay unchanged.
