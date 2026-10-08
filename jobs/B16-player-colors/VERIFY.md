# Verification

Completed on Node v22.16.0, TypeScript 5.9.3. Runtime-specific generated assets were regenerated under the pinned runtime before the passing run. Raw completed evidence: reports/verification.json; independent root selfcheck and search logs are preserved separately. No acceptance epsilon or rounded display value is used.

## Full command

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
sha256sum -c SHA256SUMS.txt
```

Local command used to select the exact runtime: `npm exec --yes --package node@22.16.0 -c 'node --version && npm test'`. Each numerical/asset suite is independently executed for seeds 1, 2, 3; compile-only checks have no random seed.

| Test name | Cases per seed | Passed | Seeds | Exact command |
| --- | --- | --- | --- | --- |
| Strict TypeScript (all three production/reference TS files) | 3 files, all strict flags | yes | deterministic | npm test |
| Sharma published calibration to four decimals | 34 pairs | yes | 1, 2, 3 | npm test |
| Independent random/special RGB, simulation, Lab, DE, symmetry, identity | 10,010 RGB vectors × 4 views = 40,040 | yes | 1, 2, 3 | npm test |
| Independent luminance and contrast | 10,010 RGB/other pairs | yes | 1, 2, 3 | npm test |
| Transfer endpoints/hex calibration | 3 explicit transfer branches, 2 contrasts, 5 hex values | yes | 1, 2, 3 | npm test |
| Original delivered pair thresholds, independent reference agrees | 264 pair/view rows | yes | 1, 2, 3 | npm test |
| Delivered normal text/dark/light contrast, independent agrees | 36 ratios | yes | 1, 2, 3 | npm test |
| Exact CSS vector round trips and fresh candidate inputs | 12 colors | yes | 1, 2, 3 | npm test |
| Seeded RNG independent state transitions and exact replay | 10,000 | yes | 1, 2, 3 | npm test |
| Invalid primary inputs rejected (validation contract; not a reference numerical diff) | 14 | yes | 1, 2, 3 | npm test |
| PNG independent CRC/zlib/filter/depth/dimensions + every channel matches independent simulation | 4 sheets, 2,949,120 channels | yes | 1, 2, 3 | npm test |
| Actual decoded PNG pair distances and canonical normal fill equality | 264 pair/view rows, 12 exact normal fills | yes | 1, 2, 3 | npm test |
| Pure encoder 8/16-bit roundtrip and caller immutability | 2 tiny rasters | yes | 1, 2, 3 | npm test |
| Exact asset regeneration | 10 files | yes | 1, 2, 3 | npm test |
| No runtime dependencies, pure source imports/no implicit randomness, file-size ceiling | package + 3 core files + 59 job files | yes | deterministic | npm test |
| Real isolated deliberate mutations | 25 separately compiled altered sources, 75 failed probes | yes | 1, 2, 3 | npm test |

Largest observed production/reference numerical discrepancy per seed: 7.105427357601002e-14, 1.3500311979441904e-13, 1.1368683772161603e-13. The 34 expected calibration values all round exactly to the published four decimals. The independently authored reference source remains byte-identical to its initial seal; see ORACLE.md.

Canonical acceptance: first-eight normal minimum 20.098712848158538; all twelve {"normal":16.40907103297625,"protan":12.099351808360753,"deutan":12.099695429109461,"tritan":12.34720618476687}. All 264 original distance rows and 36 original contrast ratios pass. Optional first-eight/all-views minimum 12.099351808360753; this optional ≥20 condition does not pass and is not imposed by the primary reading.

## Deliberate mutations

Each mutation begins from the unmodified source in its own directory, compiles under the complete strict configuration, then fails an actual numerical assertion under every seed. Syntax/compiler failure is rejected as a kill. The probe does not depend on palette acceptance. Full assertion stderr is in reports/verification.json.

| # | Mutation | Compiler | Behavioral test |
| --- | --- | --- | --- |
| 1 | wrong sRGB gamma threshold | strict compilation passed | caught under 1, 2, 3 |
| 2 | wrong linear low-branch divisor | strict compilation passed | caught under 1, 2, 3 |
| 3 | wrong sRGB gamma exponent | strict compilation passed | caught under 1, 2, 3 |
| 4 | wrong encoded gamma exponent | strict compilation passed | caught under 1, 2, 3 |
| 5 | corrupt protan matrix | strict compilation passed | caught under 1, 2, 3 |
| 6 | corrupt deutan matrix | strict compilation passed | caught under 1, 2, 3 |
| 7 | corrupt tritan matrix | strict compilation passed | caught under 1, 2, 3 |
| 8 | negative linear channel mirrored instead of clipped | strict compilation passed | caught under 1, 2, 3 |
| 9 | remove simulation upper gamut clipping | strict compilation passed | caught under 1, 2, 3 |
| 10 | wrong luminance red weight | strict compilation passed | caught under 1, 2, 3 |
| 11 | wrong luminance green weight | strict compilation passed | caught under 1, 2, 3 |
| 12 | wrong contrast luminance offset | strict compilation passed | caught under 1, 2, 3 |
| 13 | wrong D65 white X | strict compilation passed | caught under 1, 2, 3 |
| 14 | wrong RGB-to-XYZ red contribution | strict compilation passed | caught under 1, 2, 3 |
| 15 | wrong D65 white Z | strict compilation passed | caught under 1, 2, 3 |
| 16 | wrong Lab linear branch | strict compilation passed | caught under 1, 2, 3 |
| 17 | wrong chroma compensation | strict compilation passed | caught under 1, 2, 3 |
| 18 | wrong chroma seventh power | strict compilation passed | caught under 1, 2, 3 |
| 19 | wrong positive hue wrap | strict compilation passed | caught under 1, 2, 3 |
| 20 | wrong negative hue wrap | strict compilation passed | caught under 1, 2, 3 |
| 21 | wrong average hue wrap | strict compilation passed | caught under 1, 2, 3 |
| 22 | wrong hue weighting cosine coefficient | strict compilation passed | caught under 1, 2, 3 |
| 23 | wrong lightness weighting | strict compilation passed | caught under 1, 2, 3 |
| 24 | wrong chroma weighting | strict compilation passed | caught under 1, 2, 3 |
| 25 | reverse rotation correction | strict compilation passed | caught under 1, 2, 3 |

## UNVERIFIED

- Perceived distinguishability on actual TVs/phones, vision conditions beyond the specified model, browser/display color management, and subjective viewing.
- Eight-bit approximate hex values meeting all original gates. Only the exact canonical CSS/vector/16-bit palette is certified.
- Bitwise generation across different Node/V8 versions or architectures. Node 24 to Node 22 exposed a ~1e-14 table difference; this is why the requested exact byte reproduction is pinned to Node 22.16.0.
- The stronger optional first-eight/all-simulations ≥20 interpretation: measured and does not pass.
- Global optimality, uniqueness, or an impossibility proof for alternative palettes. The adopted palette is an independently checked feasible result.
- GitHub CI status is recorded externally in the PR body with the exact head SHA after the hosted run completes.

## Polish pass 2026-10-08

Scope: PartyBox integration (INTEGRATION.md), an 8-bit PartyBox palette, sheet, tokens, gate test.

Commands and results (Node 22.22.0, TypeScript 5.9.3, 4 CPUs shared with other jobs):

| Command | Result |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | ok |
| `npm test` (build, `tests/run.mjs` seeds 1-3, `tests/partybox.mjs`) | see the run table below |
| `npm run canonical` (`tools/canonical-8bit.mjs`) | exact first-8 20.10, all-12 12.10: PASS; 8-bit rounded first-8 19.54, all-12 11.77: FAIL |
| `node tools/search-partybox.mjs 1 30000 out.json ring` with `HUE_MIN=20` | reproduced `partybox/palette-12.json` byte for byte; score 1.0562 |
| `node tests/partybox.mjs` | 264 production-vs-reference pair rows, max disagreement 2.84e-14; first-8 21.39 (>= 20); all-12 four-view 12.67 (>= 12); min OKLCH chroma 0.106; min hue spread 21.4 deg; ring >= 3:1 on all five themes |
| `npm run partybox` (`tools/build-partybox-sheet.mjs`) + Chromium screenshot | `partybox/sheet.html`, looked at on all five themes |

UNVERIFIED in this pass: perception on real TVs and phones; colour-vision viewing by a person; the Spanish names; the search is a heuristic (no optimality claim). The mutation harness shares `.mutations/` between runs, so two concurrent `npm test` runs in one folder collide; this pass ran them one at a time.

### Full `npm test` run of this pass

Started 15:48:35 UTC and finished 15:52:32 UTC on 2026-10-08 (about four minutes),
Node 22.22.0, `EXIT=0`. It ran the delivered code and tests as they stood at
the start of the run. Afterwards only documents, this table and `SHA256SUMS.txt`
changed; no test reads them.

| Suite | Seeds | Result |
| --- | --- | --- |
| `tsc -p tsconfig.json` (strict build) | all | pass |
| independent math views, delivered pairs and four 16-bit PNGs (`tests/run.mjs`) | 1, 2, 3 | 40,040 views and 264 exact pair rows per seed; pass |
| contrast checks | 1 (per seed JSON) | 36 checks; pass |
| 25 deliberate mutations, each caught under all three seeds | 1, 2, 3 | 25 of 25 caught; `failures: []` |
| `tests/partybox.mjs` (PartyBox gates on the 8-bit set) | - | 264 production-vs-reference pair rows, max disagreement 2.84e-14; first-8 normal dE00 21.39 (>= 20); all-12 four-view dE00 12.67 (>= 12); min OKLCH chroma 0.106; min hue spread 21.4 deg; 5 themes ring-checked; `PARTYBOX PALETTE GATES PASSED` |

The log is kept outside the repository. The final rerun on the committed state
is recorded in the PR body, with its head SHA.

