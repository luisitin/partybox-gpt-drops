# B07 exact optimal solitaire Yahtzee

**What this is:** an exact solver for solitaire Yahtzee (every hold and every box choice maximizes the expected final score), plus a PartyBox port kit (`partybox/`) that makes it Yahtzee's 'sharp' bot.
**How to use it:** run `npm ci && npm test` to prove it; `npm run build` builds the library; PartyBox copies `partybox/server/` and `partybox/__tests__/` (steps in INTEGRATION.md).
**Status:** original delivery Ready for review; verification repair in PR24, with final handoff-head hosted proof pending as of this publication. The empty-card EV is 254.5877 under Hasbro's forced Joker rule and 254.5896 under the free-choice Joker (the published figure). CI `verify` was green on PR #21 at `4258453` and `7cdb272`. The port's solved tables now decode once at import, with no mutable cache (`e3591e6`). On 2026-10-08 the port kit passed inside a scratch PartyBox copy: tsc, eslint, prettier, vitest and sim (2p, 4p, 6p). depcruise and check-bundle passed there in an earlier pass, before that change.

## Quick start

```sh
cd jobs/B07-yahtzee-optimal
npm ci              # dev-only TypeScript 5.8.3; needs Node >= 22 and g++ (C++20, OpenMP)
npm test            # the whole proof (seals, both generators, seeds 1-3, 6M paired games, port kit): ~23 to 31 min local (23m20s earlier; 31m14s on a busy machine in the polish pass)
node partybox/test-port.mjs   # the PartyBox port kit alone, ~3 min (builds build/ first if missing)
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

## Complete followup proof, 2026-10-09

Exact source `9c14f8525a2c7eda2acd50974b3781d1e0d74e0b` passed the
unchanged full Ubuntu / Node22.16.0 workflow:
[run37902011418](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37902011418),
job113726516680. Genuine artifact11603280899 is5,058,453 bytes, SHA256
`1c71e460976527b2024ac4911cf9a58c3c7963678bdb6626da9464d74ddb7bc4`.
The independent whole reader accepted it at2026-10-09T08:07:08Z:
all80 safe unique ZIP members with full CRC/EOF,173 native delivery inputs,
99 immutable fingerprints,97 complete native JSON records,72 original report
hashes restored exactly and79 actual fresh output reports bound to the
restoration receipt. The complete87,299-byte native log has SHA256
`aed67ff9a281e8b2164074d310bb1603f33389542e3d1f0f60bf23113abc8315`.

Every mode in every seed executes the actual standalone primary generator:
six full regenerations, each536,448 valid /1,048,576 total entries and359,616
canonical components. Each complete output binary matches its shipped table.
All original three-seed gates also pass:150,000 midgames,606,528 scoring cases,
75 separately strict-compiled/runtime-killed mutants,six million paired games,
234M decisions,78M scoring transitions and985,883 visited component vectors.
The original19/13/14/30-file seals and all port-kit gates pass, including16
port mutants,16,644 bitwise differential states and1,800 adapter games.
The complete report-session47-assertion control suite also ran.

A separate actual expected-failure replay executed the current full wrapper
against a deliberately invalid owned summary. Both child and final delivery
manifest rejected it with exit1; failed outputs were archived and inputs
restored. The controlled fixture was then removed and every published input
restored. This proves rejection/restoration, not a semantic full pass.

The original current903 full evidence remains under
`reports/recovery-20261009/original-current903/`.
The complete9c14 official archive, native log, source metadata, reader and
post-pass receipts are preserved separately under
`reports/recovery-20261009/current-9c14/`.
A handoff commit containing this evidence is a new head: its own whole hosted
verification is pending as of publication. Only the actual exact final-head
workflow and whole fresh archive can close that final gate; see the followup
PR24 body for subsequent native acceptance. Original Ready PR21 and canonical
903 remain unmerged and unchanged.

The official/published mathematical conflict, independent IEEE754 comparison
tolerance and unrun full private PartyBox integration remain explicit.

Post-pass KEEP completed three substantive no-gain audits: exact original gate
preservation,18 actual transport edge/concurrency assertions and1,714 freshly
compiled solver/port assertions over548 golden states. No additional gameplay,
model, table or verifier source changes are needed. Final exact-head acceptance
and the Ready transition are recorded in PR24 only after actual completion.
