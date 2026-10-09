# Measured verification

The full release validator passed for all 3,000 original candidates and the
final 600 fill + 600 most-likely prompts. The complete verbatim validator output
is in `results/release.json`; exhaustive scan evidence is in
`results/pool-similarity.json`. Previous draft measurements and known failures
remain in `verification-history/` and the original grading records.

| Check | Cases | Passed | Seed | Exact command |
| --- | ---: | ---: | --- | --- |
| Original JSON Schema, IDs, genre, 90-character limit | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Actual independent grade/reason coverage and input hashes | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Sealed original authored batch integrity | 30 | 30 | not applicable | `python3 scripts/verify.py` |
| Complete original-pool pair comparisons, two text forms and both directions | 4498500 | 4498500 | not applicable | `python3 scripts/scan_pool.py` |
| Final JSON Schema, unchanged graded text, grades 4+ in both passes | 1200 | 1200 | not applicable | `python3 scripts/verify.py` |
| Independent final-pack pair comparisons and flag resolutions | 719400 | 719400 | not applicable | `python3 scripts/verify.py` |
| Final adult-only, no-slur and literal named-reference editorial audit | 1200 | 1200 | not applicable | `python3 scripts/verify.py` |
| All original candidates' editorial confidence records | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Combined canonical reference buckets, cap three | 630 | 630 | not applicable | `python3 scripts/verify.py` |
| Delivered-file size limit | 164 | 164 | not applicable | `python3 scripts/checksums.py` |
| Delivered-file SHA256 integrity | 163 | 163 | not applicable | `sha256sum -c SHA256SUMS.txt` |

Independent grade coverage does not mean all candidate jokes passed the humor
rubric: 1,978 qualified at grade 4+ in both passes. Only unchanged qualifying
rows were eligible for selection. Exact-grade agreement was 1,343/3,000
(44.76666667%); keep-threshold agreement was 2,217/3,000 (73.9%). Every rejected
grade and reason remains visible. All first-author grades were sealed before
grade-free handoff to the named independent reviewers.

The final editor read all 1,200 initially selected rows plus the replacement
rows, checked actual name spans, and excluded child mascots, unsupported tags
and repeated premises. `editorial-review.json` logs checks and confidence per
selected row; `named-reference-audit.json` records canonical aggregation. The
final pack contains no selected child-mascot scene. Rejected original child
mascots remain preserved and explicitly excluded rather than silently deleted.

The original-pool scan flagged 57 pairs above 0.75 similarity and retained all
55 earlier one-direction flags. Both full wording and wording after removing
the shared most-likely prefix are compared in both argument directions using
`difflib.SequenceMatcher(..., autojunk=False)`. The symmetric `quick_ratio`
upper bound skips an exact ratio only when neither direction can exceed 0.75;
it does not sample or reduce pair coverage. Fixed right-hand string indexes
are cached; no pair result is assumed. All 12 disjoint left-index segments and
their exact counts are recorded. The complete scan took 695.593576 seconds on
this local machine. All four flags in the final pack have individual distinct-
mechanism explanations. Removed candidates and earlier curation iterations
are retained; no selected joke or its independent grade was rewritten.

These are original fictional prompts with zero nonfiction fact claims, so
factual-source pairs and source reopenings are not invented. `SOURCES.md`
documents that scope. Editorial confidence is high for two grades of 5,
medium for two grades of at least 4, and low for rejected candidates below 4.

Full packaging rerun: `npm test` runs the complete exhaustive pool scan again,
all release checks, and every manifest hash. `SHA256SUMS.txt` covers all
delivered job files except itself; its generation checks every file against
the 30,000,000-byte size limit. Hosted CI uses one read-only Ubuntu job with
a 30-minute timeout and pinned major-version `actions/*` steps. The exact
GitHub workflow run is linked in the PR after it completes.

## UNVERIFIED

- Humor and confidence are editorial judgments, not an audience playtest.
- Textual similarity cannot prove absence of every conceivable semantic
  resemblance. Individually flagged pairs and actual final curation are
  provided for maintainer review.
- The exact-head hosted CI conclusion and run link are recorded in the PR;
  local validation alone does not establish a hosted result.
- This delivery remains unmerged and requires the repository maintainer's review.

## 2026-10-09 follow-up evidence and remaining gates

Original whole receipt: reports/audit-20261009/original-7985/ORIGINAL-7985-FULL-ACCEPTANCE.json. Artifact5385B SHA256ba8f481a977e3ab0f46542f35301f194e3f3e966e74e95bc2c2b77214646b3f6; complete native38937B SHA25687005174996cef36e16c1288dde5be99acff3e481c80d826714649e4d5276b79. Exact original run37675775829/job112978767591/artifact11506704793. Original size compliance was independently observed, but its CI did not run the size/coverage checker; do not inherit that missing check as a passing workflow gate.

New command python3 scripts/test_delivery.py:10negative+2positive immutable actual CLI cases including both oversized false-greens; no seeds/randomness. npm test now includes python3 scripts/checksums.py --check as a read-only size/coverage/hash gate. No source text or grade is regenerated.

UNVERIFIED: current hosted whole suite; revised both-genre curation; semantic Folgers repetition; real cultural cues in all1200 rows. Original zero-nonfiction-facts exemption does not verify existing real associations. The current candidate inventory promotes zero facts. Two complete initial ten-source transport passes had18useful full responses and2LA Times403 failures; author independence, quotes, per-fact confidence, conflicts and all-row research qualification remain pending. No audience testing or new formal KEEP completion is claimed.


## Actual research checkpoint qualification
Exact70f51 whole hosted packet/run37932915642 accepted13:11:31UTC:217native blobs,215manifestpayloads,216observedsizes,3ZIP CRC,4,498,500+719,400pairs,30seals/3000grades,600independentselectorcontrols,14deliverycontrols. Current added research metadata:9 scoped associations, schema validated;10 genuine CLI controls (9negative/1positive) verify incomplete coverage, independentauthors, missingsecondpass, quote bounds, stalewording and falsefullrow promotions. Commands npm run test:research:partial; npm run test:research is a deliberately failing strict readiness command: all1200 current whole rows UNVERIFIED. Partial metadata green confers no Ready/KEEP credit. See full actual outputs in reports/audit-20261009/research-checkpoint. Separate local22-row semantic adoption/fullcontroller is not adopted or qualified by this source.


## Current actual semantic and research checks
Full frozen230-input controller closed13:20:17.927240UTC: all4,498,500pool+719,400final pairs passed,12coverage intervals/57flags/4resolved/55historical/30seals/3000independentgrades intact;644combinedreferencebuckets/max3. Command python3 scripts/scan_pool.py then python3 scripts/verify.py, rawcompleteoutputs/immutablehashreceipt insemantic-recovery. Actual28semantic controls:27negative1positive same1200/600pergenre, all27exact maximumratios<=.75inbothforms/directions. Command npm run test:semantic; fixtureinputs unchanged/temporaryfixturesremoved/allchildrennatural. Currentresearchschema/metadata validator:9facts/1200rows/13qualified/1187UNVERIFIED/ready:false; strict npm run test:research fails on1187.12actual CLI controls(11negative1positive), including missing row-specific secondpass and altered capture binding; command npm run test:research:partial. Every13qualifiedrow recordsactualfulltext,cue/creative classification,exactfactIDs,independentauthors,and captured first/secondopening hashes andtimestamps inresearch-second-pass.json. This is noall1200researchorReady/KEEPclaim. Whole exact new hosted proof still pending.
