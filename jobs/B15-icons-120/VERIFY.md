# B15 verification evidence

Automated suites below passed with an independently authored reference sealed before production source inspection. See `test/blind/AUTHORING.md` and the explicit integration boundary below.

## Scope and definitions

- Exactly 120 original SVG files, viewBox `0 0 64 64`, no text or external artwork.
- Largest file: **clover.svg, 1052 UTF-8 bytes**. Maximum distinct paints: **6**. Limits apply to the SVG, not antialiased PNG colors.
- Silhouette = every pixel whose alpha is at least 128, in the original registered canvas. Internal transparent holes remain holes. No pairwise translation, rotation, scaling, silhouette normalization, or hole-filling is performed.
- IoU = intersection / union. The gate uses the exact integer comparison `5 * intersection < 4 * union`; equality at 0.8 fails.
- Every one of 7,140 unordered pairs is tested at 24, 48 and 256 px, in each of seeds 1, 2 and 3. librsvg masks are checked by both arithmetic implementations. CairoSVG provides a second independent rasterization.
- A: TypeScript XML-profile scanner, Sharp/librsvg rasterizer, RGBA alpha extraction and 32-bit popcount.
- B: sealed `test/blind/oracle.py`, independently authored Python ElementTree/profile parser, strict standard-library PNG decoding and mask arithmetic. It imports no production helpers. The historical `test/oracle.py` is supplemental.
- Two rasterizers are not required to have identical antialiasing. Their per-icon binary-mask IoU must be at least 0.90. Identical PNG input must yield **byte-identical masks** in both mask-decoding paths and identical integer intersection/union results for every pair.

## Maximum silhouette pair by renderer and size

| Renderer | Size | Maximum pair | Exact IoU | Decimal |
|---|---:|---|---|---:|
| cairo | 24 | pawn / chess-bishop | 146/184 | 0.7934782609 |
| cairo | 48 | timer / cards-hand | 959/1219 | 0.7867104184 |
| cairo | 256 | timer / cards-hand | 27406/34841 | 0.7866019919 |
| librsvg | 24 | camera / gamepad | 243/308 | 0.7889610390 |
| librsvg | 48 | timer / cards-hand | 960/1220 | 0.7868852459 |
| librsvg | 256 | timer / cards-hand | 27418/34866 | 0.7863821488 |

## Every suite and seed

Commands are run from `jobs/B15-icons-120/`. `npm test` reruns all three seeds, regenerates all PNGs and reports, then packages the evidence.

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---:|---|
| Sealed reference mathematical/profile self-checks | 69 | 69 | 1 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 1 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 9 | 9 | 1 | `npm test` |
| Authored-input SHA-256 seal | 152 | 152 | 1 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 1 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 1 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 1 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 1 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 1 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 1 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 1 | `npm test` |
| Ink theming option, sprite symbols, gallery page and Spanish titles | 851 | 851 | 1 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 1 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 1 | `npm test` |
| Live area (2-unit margin at 256 px) and night-theme visibility (48 px) | 240 | 240 | 1 | `npm test` |
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
| Seven backgrounds incl. PartyBox night and daylight / all 840 raster thumbnails | 840 | 840 | 1 | `npm test` |
| Deterministic raster and contact-sheet hashes | 727 | 727 | 1 | `npm test` |
| Sequential executable source mutants killed | 25 | 25 | 1 | `npm test` |
| Sealed reference mathematical/profile self-checks | 69 | 69 | 2 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 2 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 9 | 9 | 2 | `npm test` |
| Authored-input SHA-256 seal | 152 | 152 | 2 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 2 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 2 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 2 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 2 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 2 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 2 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 2 | `npm test` |
| Ink theming option, sprite symbols, gallery page and Spanish titles | 851 | 851 | 2 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 2 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 2 | `npm test` |
| Live area (2-unit margin at 256 px) and night-theme visibility (48 px) | 240 | 240 | 2 | `npm test` |
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
| Seven backgrounds incl. PartyBox night and daylight / all 840 raster thumbnails | 840 | 840 | 2 | `npm test` |
| Deterministic raster and contact-sheet hashes | 727 | 727 | 2 | `npm test` |
| Sequential executable source mutants killed | 25 | 25 | 2 | `npm test` |
| Sealed reference mathematical/profile self-checks | 69 | 69 | 3 | `npm test` |
| TypeScript strict compilation | 1 | 1 | 3 | `node node_modules/typescript/bin/tsc -p tsconfig.json` |
| Runtime dependency / ambient RNG / clock AST audit | 9 | 9 | 3 | `npm test` |
| Authored-input SHA-256 seal | 152 | 152 | 3 | `sha256sum -c SHA256SUMS.txt` |
| Sealed SVG bundle / generator byte equality / palette | 120 | 120 | 3 | `npm test` |
| Native-size librsvg rasterization | 360 | 360 | 3 | `npm test` |
| Dual XML / SVG profile auditors, all assets and adversarial cases | 1196 | 1196 | 3 | `npm test` |
| Sealed blind SVG auditor plus explicit canonical serialization rule | 1196 | 1196 | 3 | `npm test` |
| Seeded mask arithmetic differential and input immutability | 517 | 517 | 3 | `npm test` |
| Sealed blind exact alpha words and overlap arithmetic | 517 | 517 | 3 | `npm test` |
| Boundary, malformed input and prototype-safe lookup | 23 | 23 | 3 | `npm test` |
| Ink theming option, sprite symbols, gallery page and Spanish titles | 851 | 851 | 3 | `npm test` |
| All five PNG row filters, CRC corruption and truncation | 7 | 7 | 3 | `npm test` |
| Independent PNG decoder / exact mask bytes / dimensions / clipping | 360 | 360 | 3 | `npm test` |
| Live area (2-unit margin at 256 px) and night-theme visibility (48 px) | 240 | 240 | 3 | `npm test` |
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
| Seven backgrounds incl. PartyBox night and daylight / all 840 raster thumbnails | 840 | 840 | 3 | `npm test` |
| Deterministic raster and contact-sheet hashes | 727 | 727 | 3 | `npm test` |
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

## Polish pass 2026-10-08

Claude (cloud) polish pass. The port guide is `INTEGRATION.md`. Commands run from `jobs/B15-icons-120/`.

| Check | Command | Result |
|---|---|---|
| Baseline before changes | `npm test` at `b37a00d` | PASS: 78 rows, 278,979 cases, seeds 1-3, 75/75 mutants. Maximum pair camera / gamepad 0.7874 (48 px) |
| Visual review | night `#0f1020` and daylight `#f6f5ff` sheets at 24/48/96 px (Playwright Chromium) | 73 icons redrawn or re-weighted; `handshake` restored to the original drawing |
| Iteration gate | all-pairs librsvg IoU plus a live-area scan after each art round | maximum below 0.79 before the full run |
| Full suite after changes | `npm test` (290 s on 4 shared CPUs) | PASS: 84 rows, 282,990 cases, seeds 1-3, 75/75 mutants killed, exit 0 |
| Highest silhouette pair | both renderers, 24/48/256 px | 0.7935: CairoSVG 24 px pawn / chess-bishop (146/184). librsvg highest is 0.7890, camera / gamepad at 24 px. Gate: below 0.8 |
| Cross-renderer agreement | per-icon mask IoU | minimum 0.9865 (gate 0.90) |
| Size and colour limits | auditor | largest `clover.svg` at 1,052 bytes; at most 6 colours, all from the palette |
| New: ink option, sprite, gallery, Spanish titles | `npm test` row | 851 cases per seed |
| New: live area and night visibility | `npm test` row | 240 cases per seed: nothing opaque within 8 px of the edge at 256 px, and at least 25% of opaque pixels lighter than ink at 48 px |
| Contact sheets | `npm test` row | seven backgrounds (adds PartyBox night and daylight), 840 thumbnails per seed |
| Gallery page | Chromium at 1440x900 and 390x844 | no console errors; no horizontal scroll on the phone |

## Polish pass 2026-10-08 (continuation)

Claude (cloud), second session on the same branch. Commands run from `jobs/B15-icons-120/` in the worktree `/home/user/wt/B15`.

| Check | Command | Result |
|---|---|---|
| Branch state | `git fetch origin job/B15-icons-120`; compare HEAD with origin | HEAD and origin both `c878bc5` before this pass; no merge needed |
| PR and hosted CI | GitHub MCP: PR #10 `get`, `get_check_runs` | PR open, mergeable clean. Check `verify` completed success on `c878bc5` (run 37797964572, job 113382268983, 15:06:19 to 15:07:50 UTC). PR body still cites `b37a00d`; it is stale and was not edited (read-only) |
| Visual review | Playwright Chromium, all 120 icons at 24/48/96 px on night `#0f1020` and daylight `#f6f5ff`, 7 columns | every strip reviewed; set coherent. Weakest: `handshake` (soft at 24 px), `clap` (reads as a wave), `whisper` (an ear with waves, named for a whisper) |
| Redraw trials | two candidates each for `handshake` and `clap`, rendered beside the originals on both backgrounds | both candidates worse at 24 and 96 px. Originals kept; no artwork changed |
| Count audit | plain substring count over non-test `.ts`/`.tsx` under `packages/client/src`, 2026-10-08 | INTEGRATION emoji table corrected (for example `★` 28 uses, not 12; `✕` 21, not 14) |
| PartyBox references | file and line checks in `/home/user/partybox` | `controller/VipMenu.tsx:97`, `controller/ControllerShell.tsx:194` and `tv/HostBar.tsx:89` are correct; the paths and scripts in the port steps exist. Latest ADR on the owner's local main is ADR-081, so INTEGRATION now says "next free number" |
| Seal | `python3 test/package.py --seal-sources` | 152 authored files resealed. In `SHA256SUMS.txt` only the `LOOP.md` line changed |
| Full suite, run once | `npm test` on Node v22.22.0 | PASS, exit 0, 5 min 8.6 s wall (`user` 2 min 50 s). Seeds 1, 2 and 3: 84 rows, 282,990 cases, all passed; 75/75 mutants killed |
| Silhouette pairs | `reports/results.json` | unchanged by the run (git shows no diff). Highest pair 0.7935: CairoSVG 24 px. librsvg highest 0.7890 at 24 px. Gate below 0.8 |
| Size and colours | `reports/results.json` | largest `clover.svg` at 1,052 bytes; at most 6 colours |
| Bundle checksums | `sha256sum -c BUNDLE_SHA256SUMS.txt` | 894 OK, 0 failing |
| Not verified here | none run in this pass | no human recognition study; no PartyBox port; the hosted run of the new head is recorded in the PR, not here |

## Complete-bundle checksums

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---:|---|
| SHA-256 complete bundle | 894 | 894 | 1 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
| SHA-256 complete bundle | 894 | 894 | 2 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
| SHA-256 complete bundle | 894 | 894 | 3 | `sha256sum -c BUNDLE_SHA256SUMS.txt` |
