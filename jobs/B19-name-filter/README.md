# B19 Player-name filter

**What this is:** one pure TypeScript function, `nameFilter(input)`, that rejects player names containing a finite English list of sexual terms and slurs (leetspeak, repeated letters, separators, confusables, reversals) and accepts a reviewed list of benign names and words. Zero runtime dependencies.
**How to use it:** `import { nameFilter } from './nameFilter.js'`; it returns `{ ok: true }` or `{ ok: false, reason, suggestion }`. Test with `npm ci --ignore-scripts --no-audit --no-fund && npm test` (Node 22+).
**Status:** PR #23 is an isolated draft targeting `job/B19-name-filter`, preserving original PR #2. Production adopts the measured raw ASCII-letter DFA shortcut: all 214,308 complete comparisons agree, every original seed-1 mutant is caught, and one balanced comparison measures 8.37–13.84% faster whole calls against the preceding scanner, with all six blocks favorable. Strict production compile reproduces the exact measured JavaScript; six real assertion controls pass. Current changed-source original full acceptance and KEEP remain pending. The predecessor's genuine 559/39 full hosted greens and binding 6/3/5 after-green local failure remain separately preserved. Complete acceptance and KEEP stay open. Phase gains use the original warmup and exclude startup; no first-call bound, whole-function allocation-free claim or outlier cause is established. VERIFY.md identifies every actual source and scope.

## Quick start

```sh
cd jobs/B19-name-filter
npm ci --ignore-scripts --no-audit --no-fund
npm test          # strict tsc, then every suite at seeds 1, 2 and 3
npm run test:core # same, without public corpora (NOT full verification)
```

Clean corpus acquisition restores the fully validated retained snapshot without network;
`tests/retained-snapshot.py` checks restoration and corruption rejection for all 32,000 original rows. Results, fixtures, rejections and
mutation witnesses land in `reports/latest/` (git-ignored).

## API

```ts
import { nameFilter, isAllowedName } from './nameFilter.js';
nameFilter('Scunthorpe');  // { ok: true }
nameFilter('s.e.x');       // { ok: false, reason: 'blocked', suggestion: 'choose-another' }
nameFilter('a'.repeat(17)); // { ok: false, reason: 'length', suggestion: 'shorten' }
isAllowedName('Bob');      // true
```

| `reason` | when | `suggestion` (stable key; the host writes the copy) |
| --- | --- | --- |
| `type` | input is not a string | `use-text` |
| `length` | more than 16 Unicode code points, counted before trimming | `shorten` |
| `empty` | no letter or number after cleaning | `add-letters` |
| `control` | C0/C1 controls, lone surrogates, bidi formatting | `remove-characters` |
| `blocked` | a blocked term after mapping, outside the exact exceptions | `choose-another` |

Results are frozen and safe to reuse. Render the original text with `textContent`, never `innerHTML`.
The filter is not an HTML sanitizer.

## Policy and acceptance

- `POLICY.md` is the contract: domain and order, 292 exact benign spellings (`data/policy.json`), 63
  English terms, the declared confusable groups and the Scunthorpe cases.
- Eleven Census names remain blocked; 48 sexual/profanity words and 57 over-long place names remain
  rejected. Every kept rejection has a reason in `data/kept-rejections.json`. Reviewed-corpus tests enforce
  that baseline, not an all-pass corpus claim.
- Not claimed: Spanish or other languages, every confusable (the table is finite, not UTS #39), intent,
  unseen names, or a hard real-time bound. See `CONFLICTS.md` and `INTEGRATION.md`.
- The 0.05 ms gate is literal: every observed call is timed and outliers are never discarded.
  Hosted measurements include passes and failures; the cause of a specific slow call is unproved.
  Finite passing measurements do not establish a hardware-independent bound.

## Product files and evidence

- **Product:** `nameFilter.ts` (the only runtime file; no imports), `POLICY.md`, `INTEGRATION.md`,
  `data/policy.json` (the lists the source copies; checked for consistency).
- **Evidence:** `tests/` (`run.mjs` harness, `reference.ts` historical NFA oracle, `blind/` sealed
  independent reference, `retained-snapshot.py`), `scripts/` (fetch, integrity, profilers), `results/`,
  `historical/`, `data/kept-rejections.json`, `data/exception-review.json`, `data/snapshot-manifest.json`.
- **Job record:** `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`, `CONFLICTS.md`, `SOURCES.md`,
  `SHA256SUMS.txt`. The workflow `../../.github/workflows/B19.yml` runs `npm test` on pull requests.
