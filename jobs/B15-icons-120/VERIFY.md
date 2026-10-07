# B15 verification evidence

Automated suites below passed with an independently authored reference sealed before production source inspection. See `test/blind/AUTHORING.md` and the explicit integration boundary below.

## Scope and definitions

- Exactly 120 original SVG files, viewBox `0 0 64 64`, no text or external artwork.
- Largest file: **skull.svg, 716 UTF-8 bytes**. Maximum distinct paints: **6**. Limits apply to the SVG, not antialiased PNG colors.
- Silhouette = every pixel whose alpha is at least 128, in the original registered canvas. Internal transparent holes remain holes. No pairwise translation, rotation, scaling, silhouette normalization, or hole-filling is performed.
- IoU = intersection / union. The gate uses the exact integer comparison `5 * intersection < 4 * union`; equality at 0.8 fails.
- Every one of 7,140 unordered pairs is tested at 24, 48 and 256 px, in each of seeds 1, 2 and 3. librsvg masks are checked by both arithmetic implementations. CairoSVG provides a second independent rasterization.
- A: TypeScript XML-profile scanner, Sharp/librsvg rasterizer, RGBA alpha extraction and 32-bit popcount.
- B: sealed `test/blind/oracle.py`, independently authored Python ElementTree/profile parser, strict standard-library PNG decoding and mask arithmetic. It imports no production helpers. The historical `test/oracle.py` is supplemental.
- Two rasterizers are not required to have identical antialiasing. Their per-icon binary-mask IoU must be at least 0.90. Identical PNG input must yield **byte-identical masks** in both mask-decoding paths and identical integer intersection/union results for every pair.

## Maximum silhouette pair by renderer and size

| Renderer | Size | Maximum pair | Exact IoU | Decimal |
|---|---:|---|---|---:|
| cairo | 24 | camera / battery | 225/286 | 0.7867132867 |
| cairo | 48 | camera / gamepad | 974/1237 | 0.7873888440 |
| cairo | 256 | shopping-bag / lock | 24141/30710 | 0.7860957343 |
| librsvg | 24 | camera / battery | 225/286 | 0.7867132867 |
| librsvg | 48 | camera / gamepad | 974/1237 | 0.7873888440 |
| librsvg | 256 | shopping-bag / lock | 24172/30724 | 0.7867465174 |

## Every suite and seed

Commands are run from `jobs/B15-icons-120/`. `npm test` reruns all three seeds, regenerates all PNGs and reports, then packages the evidence.

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---:|---|
| Sealed reference mathematical/profile self-checks | 69 | 69 | 1 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 1 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 8 | 8 | 1 | `npm test` |
| Authored-input SHA-256 seal | 149 | 149 | 1 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 1 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 1 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 1 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 1 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 1 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 1 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 1 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 1 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 1 | `npm test` |
| Independent CairoSVG native-size rasterization | 360 | 360 | 1 | `npm test` |
| Sealed blind PNG decoder / exact RGBA and mask bytes, both renderers | 720 | 720 | 1 | `npm test` |
| librsvg silhouette pairs at 24 px | 7140 | 7140 | 1 | `npm test` |
| librsvg silhouette pairs at 48 px | 7140 | 7140 | 1 | `npm test` |
| librsvg silhouette pairs at 256 px | 7140 | 7140 | 1 | `npm test` |
| cairo silhouette pairs at 24 px | 7140 | 7140 | 1 | `npm test` |
| cairo silhouette pairs at 48 px | 7140 | 7140 | 1 | `npm test` |
| cairo silhouette pairs at 256 px | 7140 | 7140 | 1 | `npm test` |
| Sealed blind exact silhouette pair counts, both renderers and all sizes | 42840 | 42840 | 1 | `npm test` |
| Cross-renderer alpha-mask agreement >= 0.90 | 360 | 360 | 1 | `npm test` |
| Five backgrounds / all 600 raster thumbnails | 600 | 600 | 1 | `npm test` |
| Deterministic raster and contact-sheet hashes | 725 | 725 | 1 | `npm test` |
| Sequential executable source mutants killed | 25 | 25 | 1 | `npm test` |
| Sealed reference mathematical/profile self-checks | 69 | 69 | 2 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 2 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 8 | 8 | 2 | `npm test` |
| Authored-input SHA-256 seal | 149 | 149 | 2 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 2 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 2 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 2 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 2 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 2 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 2 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 2 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 2 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 2 | `npm test` |
| Independent CairoSVG native-size rasterization | 360 | 360 | 2 | `npm test` |
| Sealed blind PNG decoder / exact RGBA and mask bytes, both renderers | 720 | 720 | 2 | `npm test` |
| librsvg silhouette pairs at 24 px | 7140 | 7140 | 2 | `npm test` |
| librsvg silhouette pairs at 48 px | 7140 | 7140 | 2 | `npm test` |
| librsvg silhouette pairs at 256 px | 7140 | 7140 | 2 | `npm test` |
| cairo silhouette pairs at 24 px | 7140 | 7140 | 2 | `npm test` |
| cairo silhouette pairs at 48 px | 7140 | 7140 | 2 | `npm test` |
| cairo silhouette pairs at 256 px | 7140 | 7140 | 2 | `npm test` |
| Sealed blind exact silhouette pair counts, both renderers and all sizes | 42840 | 42840 | 2 | `npm test` |
| Cross-renderer alpha-mask agreement >= 0.90 | 360 | 360 | 2 | `npm test` |
| Five backgrounds / all 600 raster thumbnails | 600 | 600 | 2 | `npm test` |
| Deterministic raster and contact-sheet hashes | 725 | 725 | 2 | `npm test` |
| Sequential executable source mutants killed | 25 | 25 | 2 | `npm test` |
| Sealed reference mathematical/profile self-checks | 69 | 69 | 3 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 3 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 8 | 8 | 3 | `npm test` |
| Authored-input SHA-256 seal | 149 | 149 | 3 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 3 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 3 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 3 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 3 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 3 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 3 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 3 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 3 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 3 | `npm test` |
| Independent CairoSVG native-size rasterization | 360 | 360 | 3 | `npm test` |
| Sealed blind PNG decoder / exact RGBA and mask bytes, both renderers | 720 | 720 | 3 | `npm test` |
| librsvg silhouette pairs at 24 px | 7140 | 7140 | 3 | `npm test` |
| librsvg silhouette pairs at 48 px | 7140 | 7140 | 3 | `npm test` |
| librsvg silhouette pairs at 256 px | 7140 | 7140 | 3 | `npm test` |
| cairo silhouette pairs at 24 px | 7140 | 7140 | 3 | `npm test` |
| cairo silhouette pairs at 48 px | 7140 | 7140 | 3 | `npm test` |
| cairo silhouette pairs at 256 px | 7140 | 7140 | 3 | `npm test` |
| Sealed blind exact silhouette pair counts, both renderers and all sizes | 42840 | 42840 | 3 | `npm test` |
| Cross-renderer alpha-mask agreement >= 0.90 | 360 | 360 | 3 | `npm test` |
| Five backgrounds / all 600 raster thumbnails | 600 | 600 | 3 | `npm test` |
| Deterministic raster and contact-sheet hashes | 725 | 725 | 3 | `npm test` |
| Sequential executable source mutants killed | 25 | 25 | 3 | `npm test` |

## Source mutation tests

Each mutant is a real one-location rewrite of compiled checker source, dynamically imported and executed. Mutants run sequentially. Syntax/import failure is not counted as a kill. Every SVG vector, mask vector and threshold vector is run for every mutant; tests do not stop at the first failure. The original module is checked for contamination afterward.

`reports/mutations.json` contains all 75 executions, complete replacements, mutated-module SHA-256 hashes, first killing case, total killing cases and executed case counts.

| Mutant | Deliberate bug | Seed 1 first detection | Seed 2 first detection | Seed 3 first detection |
|---|---|---|---|---|
| M01 | Allow a 1501-byte file | bytes-1501 | bytes-1501 | bytes-1501 |
| M02 | Wrong required viewBox | generated-332 | asset:arrow-right | generated-464 |
| M03 | Allow seven colors | stroke-colors-count | stroke-colors-count | stroke-colors-count |
| M04 | Skip SVG namespace validation | wrong-namespace | no-namespace | no-namespace |
| M05 | Wrong root outline width | generated-332 | asset:arrow-right | generated-464 |
| M06 | Require square rather than round caps | generated-332 | asset:arrow-right | generated-464 |
| M07 | Require miter rather than round joins | generated-332 | asset:arrow-right | generated-464 |
| M08 | Allow two XML roots | two-roots | two-roots | two-roots |
| M09 | Allow silhouette equality at 0.8 | limit-4-5 | limit-4-5 | limit-4-5 |
| M10 | Allow an empty SVG | empty-svg | empty-svg | empty-svg |
| M11 | Allow zero circle radius | generated-717 | generated-945 | generated-115 |
| M12 | Allow zero horizontal ellipse radius | zero-ellipse-rx | zero-ellipse-rx | zero-ellipse-rx |
| M13 | Allow zero rectangle width | zero-rect-width | zero-rect-width | zero-rect-width |
| M14 | Allow zero rectangle height | zero-rect-height | zero-rect-height | zero-rect-height |
| M15 | Allow zero vertical ellipse radius | zero-ellipse-ry | zero-ellipse-ry | zero-ellipse-ry |
| M16 | Accept an incomplete line command | path-missing-coordinate | path-missing-coordinate | path-missing-coordinate |
| M17 | Allow script and unknown elements | foreign-object | animation | animation |
| M18 | Allow duplicate XML attributes | duplicate-attribute | duplicate-attribute | duplicate-attribute |
| M19 | Ignore mismatched closing tags | mismatched-close | mismatched-close | mismatched-close |
| M20 | Allow inline event-handler attributes | inline-handler | inline-style | inline-handler |
| M21 | Allow infinite coordinates | nonfinite-coordinate | nonfinite-coordinate | nonfinite-coordinate |
| M22 | Allow non-hex and external paints | named-paint | named-paint | external-paint |
| M23 | Corrupt the population-count mask | alpha-128-inclusive | alpha-128-inclusive | alpha-128-inclusive |
| M24 | Use intersection instead of union | alpha-128-inclusive | alpha-128-inclusive | alpha-128-inclusive |
| M25 | Exclude alpha exactly 128 | alpha-128-inclusive | alpha-128-inclusive | alpha-128-inclusive |

## Evidence files

`reports/results.json`: suite counts, environment versions, byte/color table, maximum pairs, cross-renderer minimum and seed summaries. `reports/oracle-seed-1.json` through `-3.json`: every pair for every size and both renderers, exact intersections/unions, independent PNG mask hashes and all oracle results. `reports/cases-seed-*.json`: every SVG truth label, both historical checker decisions, raw sealed decisions and explicit-profile decisions. `reports/blind-seed-*.json` records all sealed SVG, mask, PNG and exact pair results.

`SHA256SUMS.txt` seals authored inputs. `BUNDLE_SHA256SUMS.txt` covers all files in the delivered bundle except itself; generated outputs are intentionally not part of the immutable source seal. Both manifests are verified with the system sha256sum implementation. ZIP member timestamps are fixed to 1980-01-01 for reproducibility.

## Verification boundaries

**Independent reference provenance:** the second author read the original brief, root README, public measurement summary and supplied API contract, but no checker, artwork or fixture source before sealing. The unchanged source hash is `a53cf7584c586ab925fab7dff6f0b1b403b848342cee079b7543570674036b66`. Its 69 mathematical/profile self-checks are recorded. The post-seal adapter applies the existing canonical attribute serialization rule, absent from the supplied contract; raw sealed decisions are saved and exactly the `spaces-around-equals` fixture differs before that extra rule. No raw disagreement is hidden.

**Independent 24 px recognition study:** no blinded human-panel recognition experiment was performed. Native 24 px raster proofs are supplied for review. Readability is a visual design judgment, not something XML validity or IoU proves.

**Renderer universality:** the full run tests the recorded librsvg and CairoSVG versions. Pixel identity across every browser, operating system, GPU and future renderer is not claimed.

## GitHub delivery

This local run does not itself establish a green GitHub Actions run. The pull-request description must link a run actually observed as successful. PNGs and complete generated reports are delivered in the full ZIP and CI artifact; the Git tree stores authored source and all 120 individual SVG files.

## Runtime and development dependencies

Runtime dependencies: zero. The UI lookup and checker are pure functions. The build/test harness necessarily performs file I/O and starts a Python oracle. Development tools are pinned in package.json and requirements-dev.txt. There are no calls to Math.random or Date.now in the TypeScript source AST. Randomized tests receive a seeded RNG function.

## Complete-bundle checksums

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---:|---|
| SHA-256 complete bundle | 888 | 888 | 1 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
| SHA-256 complete bundle | 888 | 888 | 2 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
| SHA-256 complete bundle | 888 | 888 | 3 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
