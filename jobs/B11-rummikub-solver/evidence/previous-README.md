# B11 — Rummikub validator + exact maximum-value play

A standalone, deterministic TypeScript implementation. **Read `VERIFY.md` before treating this as an accepted drop.** Algorithmically different implementations were tested against one another, but blind, separately authored independence was not achieved.

## Run

Use Node 22 (CI pins 22.16.0), then from this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

`npm test` checks the bundle hashes, strictly compiles both TypeScript files, and runs every suite with seeds **1, 2, and 3**, serially. It includes 50,000 small brute-force cases per seed, the 40 explicit joker cases, source mutation tests, metamorphic tests, an uncompressed-state memo audit, and the 40-table/20-hand latency gate. No reduced CI mode, cached answers, disabled assertions, or probabilistic answers are used. TypeScript is the only development dependency; there are **zero runtime dependencies**. Fresh receipts go to `.test-output/`; committed evidence describes the local execution, not a future CI run.

## Files

`rummikub.ts` is the public API and production search. `reference.ts` is a separately structured, exhaustive physical-subset oracle limited to 14 total tiles, with its own validators. `test/` holds all deterministic generators and executable checks. `ALGORITHM.md` explains completeness, scoring, count constraints, memoization and tie handling. `SOURCES.md` and `CONFLICTS.md` pin the rules rather than mixing editions. `MUTATIONS.md` lists the 25 planted bugs and observed killing tests. `evidence/` contains measured results. The sole file outside this job is `../../.github/workflows/B11.yml`, as authorized by the repository README.

## API

```ts
import { findBestPlay, validatePlay, type Position } from './dist/rummikub.js';

const position: Position = {
  table: [],
  hand: [
    { id: 'r9-a', kind: 'number', color: 'red', value: 9 },
    { id: 'r10-a', kind: 'number', color: 'red', value: 10 },
    { id: 'joker-a', kind: 'joker' }
  ],
  initialMeldDone: false
};
const result = findBestPlay(position);
if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
if (result.action === 'play') {
  // This example scores 30: red 9, red 10, joker explicitly bound to red 11.
  const checked = validatePlay(position, result.table);
  if (!checked.ok) throw new Error(checked.error.message);
}
```

`validateTable(unknown)` checks a complete table; it cannot establish a player's opening eligibility without a before-position. `validatePosition(unknown)` additionally checks hand/table inventory and the opening flag. `validatePlay(before, after)` checks conservation, ownership, opening restrictions and newly contributed value; it validates an actual play, not a pass. `findBestPlay(unknown)` returns an error value or an exact optimal play/pass with `table`, `played` physical IDs, `remainingHand`, `value`, `rackPenaltyShed`, `initialMeldDone`, and search statistics. There is no timeout-success or approximate-success result.

Use stable, unique physical IDs. Numbered tiles carry `kind`, `color`, `value`; rack jokers carry `kind: 'joker'`. Every table joker requires `as: {color, value}`. Runs are given in ascending order; groups need not be sorted. The color vocabulary is `red`, `blue`, `black`, `orange`; adapt a yellow-named client color at your boundary. Input arrays/objects are not mutated, and production outputs are copied. Unknown extra fields are ignored. Runtime validation targets ordinary JSON-shaped inputs, not malicious getters, proxies or resource-exhaustion payloads.

## Objective and rules boundary

The primary objective is the **sum of represented values of newly played rack tiles**, including a rack joker's chosen binding. Higher value wins; equal value prefers more rack tiles. Old table points never contribute to the objective. This is deliberately not “most tiles first,” not expected future win rate, and not “maximize end-of-game penalty removed.” `rackPenaltyShed` separately reports the latter measure, without optimizing it.

The chosen rule profile is the English Classic manual identified in `SOURCES.md`. The opening is rack-only and leaves previous melds unchanged; full table rearrangement is available after opening. All existing physical table tiles, including jokers, must remain in legal final melds. The caller owns draw/pool handling, timers, turn ownership and persistence of `initialMeldDone`. A returned `pass` is a no-play proposal; the caller must apply its normal draw/end-turn logic. This module does not animate or certify a sequence of intermediate hand movements.

Measured latency is conditional on the recorded corpus, runtime and machine. The exact search has no hard 500 ms deadline and offers no all-input, all-hardware latency guarantee. The exhaustive independent algorithm is deliberately restricted to small positions; larger positions get independent legality checks plus a derived full-state memo comparison, not an independent exhaustive optimality proof.

## Integrity and CI

From this directory, `npm run check:hashes` verifies every delivery file listed in `SHA256SUMS.txt`, including the root workflow. The manifest excludes only itself and generated working directories. Every individual file is below 30 MB.

The workflow uses read-only contents permission, no secrets, `actions/*` major-pinned actions, Ubuntu, a 30-minute timeout, a PR path filter for this job, and the same `npm test`. It uploads fresh receipts even on a failed run. The PR description is the place for the observed GitHub Actions run URL and conclusion; a checked-in workflow alone is not evidence of green CI.
