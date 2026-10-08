# B19 Player-name filter

Pure TypeScript name moderation, a sealed independently authored reference,
and a supplemental bitset-NFA reference,
seeded generation, public-corpus regression tests, 25 actual executable mutations,
and a literal per-observation latency gate. There are no runtime dependencies.

## Rerun

Node 22+, Python 3, and TypeScript 5.8.3 (development dependency):

```sh
cd jobs/B19-name-filter
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

The single command compiles strict TypeScript and runs every behavioral suite at
seeds 1, 2, 3. It also repeats the strict no-emit type check at each seed. First
corpus acquisition requires network access; subsequent runs use a SHA-256-checked
snapshot. The delivery archive includes that cache for offline data replay.
`npm run test:core` explicitly skips corpora and is NOT full verification.

Results, complete generated fixtures, every corpus rejection, source checksums,
and all mutation witnesses are written to `reports/latest/`. CI uploads these
alongside the source files and cached public corpora, including on failure.
Upstream data changes fail the snapshot lock rather than silently changing tests.
GeoNames is a daily source: a future fresh download may need the retained cache.
The latest length-pruned attempt is in `results/resume-length-pruning/` and still
fails literal latency. The October7 summary, benchmarks, mutations and corpus
rejections are retained in `results/optimization-width-latin1/`, with earlier measured failures retained in `results/` and `results/optimization-ascii-word/`. Its timing failures remain visible.

## API

```ts
import { nameFilter, isAllowedName } from './nameFilter.js';
nameFilter('Scunthorpe'); // { ok: true }
nameFilter('s.e.x');     // { ok: false, reason: 'blocked' }
isAllowedName('Bob');   // true
```

Results are frozen and safe to reuse. The 16-character limit means Unicode code
points BEFORE trimming or normalization, not UTF-16 units or grapheme clusters.
Combining marks count separately. No input is silently truncated. Render original
text with textContent, never innerHTML; moderation is not an HTML sanitizer.

## Acceptance status and policy

See VERIFY.md for measured results and UNVERIFIED items. This delivery does not
claim universal vocabulary coverage or zero real-name false
positives. A finite English-policy lexicon, selected lookalikes, NFKD, letter-run
matching, reversed matching, and exact benign-word exceptions are documented in
POLICY.md and data/policy.json.

Eleven Census names remain rejected; some have exactly the same spelling as a
blocked term and others are supported whole-word obfuscations. Common-word data
contains genuine blocked words, and 57 place names exceed the API length limit.
Every kept rejection is listed with a reason in data/kept-rejections.json.
Reviewed-corpus tests enforce that explicit policy baseline, NOT an all-pass
corpus claim. Exact exceptions were refined using these corpora, so the measured
false positives are regression results, not held-out generalization estimates.

The 0.05 ms gate measures individual calls without discarding outliers. Failures
stay failures; an average or p99 does not substitute for the requested maximum.
The final local run still fails that maximum, so the PR remains a draft with
unmet acceptance requirements. It passes every complete behavioral and mutation
suite, including all comparisons with the sealed independent reference.
The sealed reference was authored from the original instructions, public API
contract and policy JSON before its author read production or existing tests.
All 43,830 inputs per seed are compared with it, in addition to the historical
NFA comparison. Its authoring record and source hashes are in tests/blind/.
A finite private table compiles declared glyphs/case variants/known ignorable
formats, printable fullwidth ASCII and Latin-1 once, preserving whole-string contextual lowercasing and the full
normalization fallback for other Unicode. Another 1,296 context checks per seed
agree with the sealed reference; a further 1,422 new character/context checks per seed cover the additional ranges. No input or result cache is used.

## Contents

nameFilter.ts is the only runtime file. tests/blind/reference.mjs is the sealed
independent oracle; tests/reference.ts is the historical supplemental NFA oracle;
tests/run.mjs generates and executes suites and mutants. scripts/fetch-data.py
retrieves aggregate corpora and verifies the committed snapshot manifest.
scripts/integrity.mjs verifies delivery checksums and size. data/ records policy,
review choices, and corpus hashes. SOURCES.md and CONFLICTS.md explain provenance
and requirement conflicts. The authorized repository-level workflow is
../../.github/workflows/B19.yml. SHA256SUMS.txt excludes itself, generated
reports/latest, data/cache (separately snapshot-locked), dist, and node_modules.
