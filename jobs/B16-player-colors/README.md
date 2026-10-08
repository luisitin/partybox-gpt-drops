# B16 — 12 accessible player colors

**What this is:** twelve named player colours that pass the B16 numerical gates (CIEDE2000 under normal, protan, deutan and tritan views; WCAG text and fill contrast), with independent verification. Plus a PartyBox-ready 8-bit set of twelve colours with the same gates, a sheet and tokens.
**How to use it:** `npm ci --ignore-scripts && npm test` (all gates, three seeds, 25 mutations). PartyBox values: `partybox/palette-12.json`, `partybox/tokens-player.css`, the sheet `partybox/sheet.html`. Port notes: [INTEGRATION.md](INTEGRATION.md).
**Status:** polish pass 2026-10-08. The canonical 16-bit palette passes its gates at full precision but **fails after rounding to 8-bit hex** (first eight 19.54 vs 20; all twelve four-view 11.77 vs 12), which is what a browser paints (`npm run canonical`). The PartyBox set passes on 8-bit values with margin and needs a 2.5 px theme-coloured ring on each disc. Owner decision needed: see INTEGRATION.md.

Twelve named colors satisfying the original numerical constraints. Open [gallery.html](gallery.html) for exact CSS sRGB fills on both specified backgrounds, or see the four numbered 16-bit PNG sheets in `swatches/`.

**Use the exact `color(srgb …)` values or `rgb` vectors in `palette.json` for the math record only.** Eight-bit hex values in the tables are labeled approximations, and the polish pass measured that rounding to 8 bits breaks the gates (`npm run canonical`). For PartyBox use `partybox/palette-12.json`. Each canonical channel is an integer divided by 65535, so the normal PNG represents the delivered palette exactly. Simulated PNGs round only after Machado transformation; their decoded pixels also pass the required pair distances.

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

## PartyBox set (polish pass, 2026-10-08)

`partybox/palette-12.json` holds twelve 8-bit colours, each with an English and Spanish slot name and a face ink (the avatar ink with the higher contrast). They come from `tools/search-partybox.mjs` (seeded, reproducible: `HUE_MIN=20 node tools/search-partybox.mjs 1 30000 out.json ring`, then `node tools/build-partybox-palette.mjs out.json`). `tests/partybox.mjs` (in `npm test`) checks, on those 8-bit values and cross-checked against `reference.ts` for every pair and view:

- first eight normal CIEDE2000 >= 20; all twelve, four views, >= 12 (the B16 gates);
- text (best of black or white) >= 4.5 and face ink >= 3 on every disc;
- each disc's ring (the theme's text ink) >= 3:1 on the ground and on the surface of all five themes;
- OKLCH chroma >= 0.10 (no greys), a colour with L >= 0.85, hue spread >= 20 degrees (design gates).

`partybox/sheet.html` shows the set on all five themes with the current PartyBox eight, the three CVD simulations and the 13-16 repeats. `partybox/tokens-player.css` is the proposed token block. Build both with `npm run partybox`.
