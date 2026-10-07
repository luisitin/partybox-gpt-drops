# B16 — 12 accessible player colors

Twelve named colors satisfying the original numerical constraints. Open [gallery.html](gallery.html) for exact CSS sRGB fills on both specified backgrounds, or see the four numbered 16-bit PNG sheets in `swatches/`.

**Use the exact `color(srgb …)` values or `rgb` vectors in `palette.json`.** Eight-bit hex values in the tables are labeled approximations; they are not the canonical palette. Each canonical channel is an integer divided by 65535, so the normal PNG represents the delivered palette exactly. Simulated PNGs round only after Machado transformation; their decoded pixels also pass the required pair distances.

| # | Name | Exact 16-bit RGB integers (divide by 65535) |
| --- | --- | --- |
| 1 | Rose | 46951, 15155, 28262 |
| 2 | Emerald | 0, 41742, 17742 |
| 3 | Sky | 0, 36430, 65535 |
| 4 | Sand | 40911, 35514, 32326 |
| 5 | Lavender | 35226, 31278, 45690 |
| 6 | Mist | 31365, 37636, 39210 |
| 7 | Teal | 0, 28030, 25854 |
| 8 | Crimson | 50626, 0, 1744 |
| 9 | Olive | 25029, 27056, 16367 |
| 10 | Orchid | 35492, 17433, 39766 |
| 11 | Orange | 65535, 19482, 0 |
| 12 | Cobalt | 0, 18561, 65535 |

## Numerical results

First eight normal CIEDE2000 minimum: **20.098712848158538**. All twelve minima: normal **16.40907103297625**, protan **12.099351808360753**, deutan **12.099695429109461**, tritan **12.34720618476687**. Selected black/white text contrast minimum **5.446343441951846**; normal fill minima **3.000296605104743** against `#121218` and **3.000190395492848** against `#F7F5F0`.

Full unrounded values, requirements, and acceptance booleans are in `tables/pairwise.json` and `tables/contrast.json`; CSV and complete square Markdown tables are included. Display rounding never decides acceptance. The stronger optional first-eight/all-simulations ≥20 condition is recorded as a diagnostic and is not an original gate.

## Rerun

Node 22.16.0; pinned TypeScript 5.9.3 is the only development dependency. Production code has zero runtime dependencies.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
sha256sum -c SHA256SUMS.txt
```

`npm test` strictly compiles all TypeScript, runs seeds 1, 2, 3, diffs every valid numerical case against the independently authored sealed reference, reproduces every delivered asset byte, independently decodes every PNG pixel, checks actual palette constraints, and compiles/kills 25 isolated mutations under all three seeds. Its evidence is written to `reports-run/summary.json`; the committed completed run is in `reports/verification.json`.

`npm run generate` regenerates tables, gallery, and PNGs. `npm run search` reruns the seeded 8-bit search; `tools/refine.mjs` and `tools/joint-refine.mjs` reproduce the local follow-up searches. The optional author-time `tools/continuous.py` uses NumPy/SciPy and a deterministic seeded SLSQP restart. It is not needed to use, generate, or test the delivered palette. Its original source snapshot, actual stdout, candidate, and independently checked result are preserved in `reports/search/` and `tools/`; see [SEARCH.md](SEARCH.md).

## Provenance and scope

[ORACLE.md](ORACLE.md) records independent authorship, immutable initial sources, hashes, and the source-exchange boundary. [SOURCES.md](SOURCES.md) cites the actual Sharma fixture and Machado coefficient table. [VERIFY.md](VERIFY.md) distinguishes numerical verification from unverified device perception and display conversion. Swatch numbering maps to the names above; each cell shows the fill on both backgrounds. The full scene, including background and label, is transformed in each simulation.
