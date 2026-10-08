# B07 exact optimal solitaire Yahtzee

**What this is:** an exact solver for solitaire Yahtzee (every hold and every box choice maximizes the expected final score), plus a PartyBox port kit (`partybox/`) that makes it Yahtzee's 'sharp' bot.
**How to use it:** run `npm ci && npm test` to prove it; `npm run build` builds the library; PartyBox copies `partybox/server/` and `partybox/__tests__/` (steps in INTEGRATION.md).
**Status:** complete. The empty-card EV is 254.5877 under Hasbro's forced Joker rule and 254.5896 under the free-choice Joker (the published figure). CI on PR #21 was green before this pass. On 2026-10-08 the port kit passed inside a scratch PartyBox copy: tsc, eslint, depcruise, prettier, vitest and sim.

## Quick start

```sh
cd jobs/B07-yahtzee-optimal
npm ci              # dev-only TypeScript 5.8.3; needs Node >= 22 and g++ (C++20, OpenMP)
npm test            # the whole proof (seals, both generators, seeds 1-3, 6M paired games, port kit): ~25 min local, ~8 min on GitHub
npm run test:port   # the PartyBox port kit alone, ~2 min (builds build/ first if it is missing)
npm run build       # build/yahtzeeOpt.js + .d.ts + build/tables/*.json
```

## Rule modes

| Mode | Joker rule (a second Yahtzee) | PartyBox setting | Empty-card EV |
| --- | --- | --- | ---: |
| `official` (default) | Hasbro US40958, forced: the matching upper box if open, else any lower box, else an upper box for 0 | `jokerRule: 'forced'` | 254.58772873449593 |
| `published` | Verhoeff, free: any open box; fixed Joker scores once the matching upper box is filled | `jokerRule: 'free'` | 254.58960948196315 |

The commonly quoted 254.5896 is the free-choice convention. CONFLICTS.md and SOURCES.md explain the difference. Neither generator receives a target value as input.

## API (`build/yahtzeeOpt.js`, pure, zero runtime dependencies)

```ts
CATEGORIES   // ones..sixes, threeKind, fourKind, fullHouse, smallStraight, largeStraight, yahtzee, chance (index 0..12)
interface Scorecard { usedMask: number; upper: number; yahtzeeBonus: boolean; ruleMode?: 'official' | 'published' }
// usedMask: bit i = category i filled. upper: upper subtotal capped at 63. yahtzeeBonus: the Yahtzee box holds 50.
score(dice, category, card?)         // { legal, points, yahtzeeBonus, upperBonus, next: Scorecard }
expectedValue(card?)                 // optimal expected points still to come before the next turn
bestCategory(dice, card)             // ScoreResult + { category, expectedValue }
bestHold(dice, rollsLeft, card)      // { hold: sorted faces to keep, expectedValue }; holding all 5 means score now
valueOfHold(dice, hold, rollsLeft, card)
```

Invalid input throws `RangeError`. Ties pick the lowest category, or the lexicographically lowest hold (PUBLIC-CONTRACT.md).

**Tables:** each `tables/<mode>.bin` holds 1,048,576 Float64 LE slots at index `usedMask + upper*8192 + (yahtzeeBonus ? 524288 : 0)`. 536,448 slots are reachable; the rest are NaN (`null` in the JSON form).

**PartyBox kit:** the same tables, losslessly compacted to 359,616 values per mode (3.8 MB of base64 each). The kit also has the solver, split to fit PartyBox lint, and an adapter (`optimalInput`, `optimalMove`, `scoreChoices`, `classicIds`, `toScorecard`). INTEGRATION.md documents it. Its answers match the root module bit for bit.

## Product vs evidence

| Kind | Files |
| --- | --- |
| Product: library | `yahtzeeOpt.ts`, `tables/*`, `tables.d.ts`, `generator.cpp`, `convert-tables.mjs`, `copy-tables.mjs`, `tsconfig.json`, `package.json` |
| Product: PartyBox port | `partybox/server/**` (solver, tables, adapter), `partybox/__tests__/**` (vitest + golden) |
| Port tooling | `partybox/build-tables.mjs`, `partybox/build-golden.mjs`, `partybox/test-port.mjs`, `partybox/tsconfig.json` |
| Evidence | `independent/` (a separately written solver and generator), `primary-snapshot/`, `*SHA256SUMS*.txt`, `run.mjs`, `test.mjs`, `verify-seed.mjs`, `mutate.mjs`, `simulate.mjs`, `paired-sim.cpp`, `*-selfcheck.mjs`, `component-proofs.mjs`, `primary-bridge.mjs`, `CORE-SELFCHECK.json`, `reports/` |
| Record | `PUBLIC-CONTRACT.md`, `CONFLICTS.md`, `ASSUMPTIONS.md`, `AMENDMENT.md`, `AUTHORING.md`, `SOURCES.md`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `INTEGRATION.md` |

## Regenerate the tables

```sh
mkdir -p .verification
g++ -std=c++20 -O3 -ffp-contract=off -fopenmp -Wall -Wextra -Werror generator.cpp -o .verification/generator
OMP_NUM_THREADS=2 .verification/generator --mode official --output tables/official.bin
OMP_NUM_THREADS=2 .verification/generator --mode published --output tables/published.bin
node convert-tables.mjs && node partybox/build-tables.mjs   # JSON form, then the PartyBox *.generated.ts
```

After any file change, regenerate `SHA256SUMS.txt`. Its format is `<sha256>  <repo-relative path>` for every job file except itself, plus `.github/workflows/B07.yml`. `npm test` refuses to run if the file is stale.

## How it was proven

VERIFY.md has the counts. Two solvers, written separately, agree on all 1,072,896 valid states (worst gap 9.4e-13). Three seeds of exhaustive scoring checks, 150,000 mid-game states and 75 mutants all pass. Six million complete paired games stay within 4 standard errors of the EV.
