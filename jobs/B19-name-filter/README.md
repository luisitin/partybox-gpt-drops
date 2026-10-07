# B19 Player-name filter

A small, pure TypeScript player-name filter, a separately structured bitset-NFA reference, seeded adversarial tests, and 25 executable mutation tests. The production file has zero runtime dependencies.

## Rerun

Requires Node 22+, Python 3, and network access on the first full corpus run.

```sh
cd jobs/B19-name-filter
npm install --ignore-scripts --no-audit --no-fund
npm test
```

`npm test` compiles with strict TypeScript and runs all suites at seeds 1, 2, and 3. Results, every corpus rejection, obfuscation fixtures, and mutation witnesses go to `reports/latest/`. Failed downloads, failed assertions, and measured latency violations fail the command. `npm run test:core` is explicitly a partial offline run, not a substitute for full verification.

## API

```ts
import { nameFilter, isAllowedName } from './nameFilter.js';
nameFilter('Scunthorpe'); // { ok: true }
nameFilter('s.e.x');     // { ok: false, reason: 'blocked' }
isAllowedName('Bob');   // true
```

The limit is 16 Unicode code points before trimming/normalization, not 16 UTF-16 units or grapheme clusters. Render user text using textContent, never innerHTML. The filter is moderation, not an HTML sanitizer.

## Honest acceptance status

This is a finite English-policy filter, not a proof that every slur or every Unicode lookalike is recognized. Real names and blocked strings can coincide; literal all-pass corpora and block-all policy cannot both hold on identical inputs. No false-positive exceptions are silently manufactured from corpus results. All remaining failures stay visible in the reports and VERIFY.md.

Two different matching algorithms are implemented, but they were authored in the same session and share policy data. Blinded independent authorship is not claimed. The literal 0.05 ms per-observation benchmark is enforced; outliers are not hidden behind an average.
