# B03: every Jamboree minigame, catalogued

**What this is:** a research catalogue of 132 minigames (112 base games, 20 Jamboree TV additions) with name, category, format, time limit, controls, win, score, tie and reward rules, a two-sentence summary, and a 1-5 phone-touch fit. Data is JSON and CSV, checked by a JSON Schema and an offline verifier.
**How to use it:** read `DESIGN-DIGEST.md` for the design reading, `INTEGRATION.md` for what PartyBox does with it. Query `minigames.json` (or `minigames.csv`, see below). Do not ship names, art or strings.
**Status:** reference only. Draft research, strict gate **NOT_MET**: 303 of 1,320 narrow fact fields corroborated, 1,017 still open, 0 of 132 rows complete. Nothing here is Nintendo-verified gameplay.

## Quick start (from the repo root)

```bash
python3 -m pip install -r jobs/B03-jamboree-minigames/requirements.txt
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --hashes            # integrity checks
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --strict --hashes   # exit 1 by design (NOT_MET)
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/quote-support-check.py        # prints the quote-support report
```

## Data shape

- `minigames.json`: `{job, scope, complete: false, fieldStatusMeaning, minigames: [132 rows]}`. Ids are `MG001`..`MG132`.
- Row: `id, name, edition (base | jamboree_tv), category, format, timeLimit {reportedLabel, wholeGameSeconds, variants, unresolved}, controls {inputTypes, bindings}, winRules, scoreRules, tieRules, reward {coins, stars, other, scope}, summary, phoneFit (1-5), phoneFitReason, phoneFitBasis, confidence, fieldEvidence, complete`.
- Text fields hold the claim as written, or `null` when unknown. Rewards are text descriptions, never numbers: `stars` is null on all 132 rows and `coins` is known on 4.
- `fieldEvidence.<field>` = `{status, quoteIds, limitation}`. Status is one of `corroborated`, `single_source`, `conflict`, `unverified` (meaning in `fieldStatusMeaning`). Quote ids point into `catalogue-sources.json`.
- `confidence` is `low` on every row, because no row has every field corroborated.
- **phoneFit** (editorial, not a test): 5 = taps or discrete choices with clear targets; 4 = pointer drag or aim (finger occlusion needs big targets); 3 = touch fits, with a timing or multi-input compromise; 2 = a physical sensing action has only a weaker touch stand-in; 1 = the core action is camera or microphone input that a touch screen cannot sense.
- `minigames.csv`: the same 18 columns in the same order. Object-valued columns are compact JSON (parse with `json.loads`); plain text columns are plain. The verifier round-trips every cell.

## Status (2026-10-08 polish)

| Measure | Before polish | After polish |
| --- | ---: | ---: |
| Corroborated narrow fields | 481 | **189** |
| Single-source fields | 527 | 812 |
| Unverified fields | 297 | 304 |
| Conflict fields | 15 | 15 |
| Fields still open (1,320 minus corroborated) | 839 | **1,131** |
| Claims checked by the quote-support check | n/a | 869 (325 flagged for re-read; 7 fragment-only summaries are unverified) |

Why the numbers fell: 175 corroborated `category` and `format` fields rested on the minigame title alone, and 117
corroborated `summary` evidence rested on headings or fragments. The rules now applied are in `ASSUMPTIONS.md`.
The verifier enforces them (`Narrow summary status follows...`, `Quote-support report reproduces...`).

## Files: product vs evidence

- **Product** (what a reader uses): `minigames.json`, `minigames.csv`, `minigames.schema.json`, `DESIGN-DIGEST.md`, `INTEGRATION.md`.
- **Checks** (run by the verifier): `verify.py`, `quote-support-check.py`, `reports/quote-support-check.json`, `reports/research-gaps.json` (the exact open ledger), `catalogue-second-pass.json` (per-row fingerprints).
- **Evidence** (proves the rows, not needed by a port): `catalogue-sources.json` and `SOURCES.md` (147 URLs, 1,938 clips), `catalogue-conflicts.json` and `CONFLICTS.md`, the `reports/source-reopens-*` captures, the earlier gameplay leads and the legacy helpers. `HISTORICAL-INDEX-NOTES.md` explains the preserved history.
- **Process**: `LOOP.md`, `NEXT.md`, `VERIFY.md`, `ASSUMPTIONS.md`, `SHA256SUMS.txt` (every file except itself).

## Known limits

- Two publisher families are not two independent verifications: the same sites can share a lineage, and a clip is an anchor, not a proof of the full rule.
- The exact coin and star awards are unknown; the in-game scoring tokens are not board rewards and are not substituted.
- Any mechanic here is a claim about a Nintendo game; no gameplay was run, and PhoneFit is not Nintendo's support statement.
- Full history and every remaining open field: `reports/research-gaps.json`, and `VERIFY.md`.

## First category recovery 2026-10-08 (historical checkpoint a327dc1)

Fresh ordered A/B HTTPS captures of Mario Wiki and Mario Party Legacy now support 82 additional category fields (76 base, 6 Bowser Live). Real headings are registered as short quotations and exact source-spelled table membership is retained in `reports/category-heading-repair.json`; the checker accepts only case/punctuation normalization, never spelling correction. Current strict coverage is **271/1,320 fields; 1,049 open; 0/132 complete rows**. Categories now have 92 corroborated and 40 single-source entries. The earlier polish table above remains historical.

That checkpoint's registry had 145 URLs and 1,884 clips, with 3,774 recorded A/B quote recoveries across all 148 current/historical URLs. Only the three category sources were newly reopened in that recovery; every other source retained its actual earlier timestamp.

## Second recovery (historical checkpoint 4a60fc7)

Sixteen verified HTTPS requests reopened Family Game Squad and seven individual Wiki articles in ordered A/B passes. Exact independently captured category headings and complete group membership support 12 more category facts: ten Kaboom-Squad games and the canonical Sandwiched/Squeaky Shakedown names. The historical Legacy spellings remain preserved. Categories now have **104 corroborated and 28 single-source entries**; the broad Koopathlon labels and fourteen Mouse entries remain qualified.

Seven gameplay evidence sets now quote actual Wiki instruction sentences instead of headings or fragments. They remain single-source: **15 gameplay fields corroborated, 117 single-source, none fragment-only**. Product summaries and all unrelated product values are unchanged. The full guide's sections were read, but detailed independent summary support is still missing. `reports/category-summary-recovery.json` and its checker preserve the actual receipts, complete guide membership, original quotations and every unrelated row value.

Current registry: **145 URLs / 1,894 clips / 3,794 recorded A/B quote recoveries** across 148 current/historical URLs. Eight sources were freshly reopened for this second recovery; the Wiki list records reused for the category comparison are explicitly historical. The independent two-wiki roster requirement remains unmet. The earlier checkpoint's successful hosted workflow and artifact receipt are historical evidence, not acceptance of a newer commit.

## Third recovery (historical checkpoint 5e6ad25)

Domination, Snow Brawl and Jump the Gun now have narrowly rewritten two-sentence summaries supported by real Wiki and independent guide action descriptions. Both full retained source captures were reread; exact timers, bindings, win/score/tie parameters and payouts keep their separate qualifiers. Gameplay evidence is now **18 corroborated / 114 single-source**, and strict overall coverage is **286/1,320 corroborated / 1,034 open / zero complete rows**. All 129 other summaries and every unrelated product value/evidence field are preserved.

`reports/common-gameplay-recovery.json` binds eight retained actual HTTPS records and the three row repairs. Its checker verifies source independence, both complete scopes, original row/quote preservation and the exact 200-word guide budget. Registry: **145 URLs / 1,898 short clips / 3,802 recorded A/B quote recoveries**. No new source timestamp or HTTP request is invented for rereading these retained bodies.

The separate NamuWiki candidate packet records six fresh roster captures, an actual 112-name English base list and twenty Korean TV names. Its raw base spelling disagreement and missing literal bilingual TV witnesses remain explicit in CONFLICTS and VERIFY. The required exact second-wiki roster acceptance remains unclosed.

## First authored-tip recovery 2026-10-09 (historical checkpoint dd1e54f)

Granite Getaway and Defuse or Lose now have narrower two-sentence common-action summaries supported by complete Wiki contexts and independently authored original Korean NamuWiki Tip cells. The adjacent translated Nintendo-description cells are excluded. This adds exactly two gameplay fields: **288/1,320 corroborated, 1,032 open, zero complete rows**. Gameplay is **20 corroborated / 112 single-source**; categories remain **104 corroborated / 28 single-source**. Every other 130 summary and all detailed controls, timers, scoring, tie and reward evidence are preserved.

`reports/namu-gameplay-recovery.json` and its checker bind the actual original-language A/B bodies, literal English names, both complete authored-tip contexts, the exact accepted 132-row/145-source baseline and all 1,898 old quotation classifications. Unicode word counting admits Korean sentences while rejecting headings and short fragments; it does not itself prove semantic support. The complete original source registry is preserved, including the exhausted 200-word guide budget. Current registry: **146 URLs / 1,900 clips / 3,806 A/B recoveries across 149 current/historical URLs**. Namu's two literal clauses total 22 quoted words.

Three new Exa searches produced 16 inspected result entries and 15 unique URLs; their full result ledger stays private and a concise decision ledger is in `reports/remaining-source-research.json`. The potentially useful actual Jamboree GameFAQs thread returned HTTP400 Request Blocked on both native TLS-verified attempts; no forum claim is adopted. Prize Drop's authored Tip cell is empty. The exact second independent full 132-name wiki roster gate still remains unmet, so original PR20 stays draft.

## Historical eleven-action recovery 2026-10-09

Eleven additional common-action summaries now have independent originally authored Korean Tip support and complete freshly reopened Wiki contexts: Lumber Tumble, Camera-Ready, Hammer It Home, Stamp Out!, Pickin' Produce, Spike's Gambit, Lane Change, Coin Conveyor, Which Door Has More?, Burning Bridges and The Floor Is Falling. Coverage is **299/1,320 corroborated /1,021 open /zero complete rows**. Gameplay is **31 corroborated /101 single-source**; categories remain **104/28**. All 121 other summaries, all unrelated row values/evidence and every old quote remain intact.

The actual 24 native HTTPS requests naturally CLOSED **01:15:27.558651 UTC**, with HTTP200 and TLS verification for both full captures of twelve Wiki candidates. Twenty-two responses are registered for the eleven repairs; Gate Key-pers remains excluded because its memory advice attributes the in-game explanation. Original Korean Namu bodies retain their actual earlier 00:10 timestamps. The translated Nintendo-description column is excluded. Namu now uses **195/200 quoted words**; the guide remains **200/200**, with no history deletion. Registry **146 URLs /1,931 clips /3,868 A/B quote recoveries**.

`reports/namu-batch-recovery.json` and its checker bind the exact accepted dd1e54f 132-row/146-source/A+B baseline, preserve all 1,900 earlier quote classifications and reject ten malformed source/scope/history fixtures. The old authored-tip/category/common-action checks still run on exact-hash validated historical views. The complete initial content verifier passes **79 suites /31,337 cases**. Strict research, the independent exact full second-wiki roster and original KEEP GOING completion remain unmet; PR20 stays draft.


Historical original-author tips research checkpoint: 14 actual native HTTPS/TLS A/B requests naturally CLOSED 2026-10-09 01:47:48.610964 UTC. Four candidates are explicitly UNADOPTED in reports/family-tips-candidate.json. Every original product value, evidence status and source/quote/A+B history remains exactly accepted76880fa; current299/1021/zero,31gameplay/101single stays unchanged. The separate Gaming Chickadee tips-and-tricks page has73 bounded original words; the old guide200 and Namu195 histories remain intact. Big-Top/Burger are excluded for insufficient shared-summary scope. Six negative controls reject premature promotion or altered provenance. Actual current full CI/artifact acceptance is required after this push. No strict KEEP GOING/completion claim.

## Current four-action recovery — 2026-10-09

The exact accepted parent is 9e43a19e256538d57b8334ffdafd5d656804c712 (normal push CLOSED 02:02:10.663895 UTC; complete exact-head native/official artifact reader CLOSED 02:03:48.955081). Its historical receipt is reports/hosted-ci-9e43a19-artifact.json. This checkpoint adds four independently corroborated common-action summaries: Hot Cross Blocks, Blame It on the Crane, Match! That! Item! and Short-Stack Chef. Current coverage is **303/1,320 narrow fields corroborated /1,017 open /zero of 132 whole rows complete**; gameplay **35 corroborated /97 single-source**, categories **104/28**.

Gaming Chickadee's original article, Super Mario Party Jamboree – Tips and Tricks, published 2024-11-05, is https://familygamesquad.com/super-mario-party-jamboree-tips-and-tricks/. Four exact clips total **73/200 unique quoted words**. Separate pages of Family Game Squad share one publisher lineage. Complete named-game paragraphs and adjacent advice were reread in both retained full bodies; corresponding full Wiki narratives provide the other independent publisher. Every exact control binding, timer, scoring parameter, tie, board reward, category, unrelated evidence field and whole-row confidence remains unchanged. All128 other summaries remain byte-semantically equal to the accepted parent.

The actual 14 native HTTPS/TLS requests naturally CLOSED 01:47:48.610964 UTC; adoption invents **zero** new HTTP requests. Ten responses supply the five registered source pairs; four excluded research-lead responses remain retained. The writer naturally CLOSED 02:17:50.110958 UTC. Registry: **147 URLs /1,938 short clips /3,882 recorded A+B recoveries**, with150 current/historical source records per pass. The old Family Game Squad guide remains200/200 and Namu remains195/200; every1931 old clip and classification is preserved. The historical unadopted candidate packet remains unchanged and is checked against a validated restored parent view; it is not the current product status.

The new checker binds all four full-context hashes and actual transport receipts, restores exact132-row/146-source/full A+B accepted-parent hashes before supplying any historical view, and rejects ten malformed scope/source/history cases after2600 exact comparisons. The old candidate82-comparison/six-negative-control suites still run. The first full verifier correctly rejected stale closed-schema array maxima (146/149); its complete failed log/controller are retained. The three explicit maxima now exactly allow147 registered sources and150 historical reopen records; object schemas, baseline gates and all negative controls remain active.

Actual full controller naturally CLOSED **2026-10-09 02:24:20.539498 UTC**: content **83 suites /34,075 cases**, EXIT0; integrity **84 suites /34,171 cases /all96 manifest files**, EXIT0; deliberate strict same84/34,171, EXIT1 with **NOT_MET303/zero**. Seeds n/a. Exact commands are the Quick start verifier commands (content additionally uses --report jobs/B03-jamboree-minigames/reports/final-validation.json). Only delivery documentation changes afterward; every regenerated manifest entry and immutable staged Git byte is verified before the normal canonical push. Early bound02:27:10.663895 UTC; hard02:32:10.663895 UTC. Actual push/CI/artifact times are recorded after observation in original draft PR20. Strict research, exact independent two-wiki full roster and original KEEP GOING completion remain unmet.

## Current original-review research checkpoint — 2026-10-09

Four current single-source summary candidates remain explicitly UNADOPTED in reports/tv-author-candidate.json: Sunset Standoff, Shell Hockey, Stuffie Stacker and Domino Effect. No catalogue product value/status/evidence, all132rows/147sources/1938oldclips/complete A+B history, or current303/1017/zero coverage changes. Gameplay remains35/97. The original accepted38ec475 full native/official artifact reader CLOSED02:26:56.203123 UTC; its receipt is historical for this new research checkpoint.

Actual34native HTTPS attempts naturally CLOSED02:36:19.847612 UTC:32fullHTTP200/TLS0 responses, plus two JamesSubstack curl56/HTTP000 failures that received no response body. Both failures retain actual headers/stderr/zero-byte metadata; no empty response was invented. Six source pairs support the four candidates; all other captures remain unadopted research leads. Complete full bodies and named authored paragraphs stay private. Bobby Pashalidis is verified by ConsoleCreatures JSON-LD; Jon Scarr by BestBuy native metadata. Four proposed action scopes have complete paired named paragraphs and Wiki contexts. Known B03 cumulative page quotations:BestBuy94/200(including30old), ConsoleCreatures23/200. Parent must reconcile any remote same-page quotation use before adoption. Namu195/guide200/FGStips73 stay unchanged; no new Namu quotation.

Six cloud searches actually returned37requested/37reviewed entries; two known-URL fetch calls requested8pages. Raw tool results are private. Anonymous review examples, duplicate author Jon Scarr atCloudDosage, native-failed Substack, Nintendo instruction copies and exact-name errors do not establish new accepted sources. CGMagazine's coins vsWiki Bowser medals forSpeakUpJunior is explicit and unadopted; Goombalance/Gooombalancing spellings and incorrect generic mode claims stay excluded. Seven initially proposed descriptions were already corroborated; the first private writer stopped before publication rather than claiming11new facts. That failure and the first absent-response helper assumption remain preserved.

Workspace overlay ENOSPC actually blocked the first native collector before mkdir/ANYrequest at02:31:25 UTC. The private isolated RAM clone CLOSED02:42:53.613726; shared writable storage was restored by root02:43:15. Exact32successful body/text hashes and all28old registered quote recoveries passed the finite parser CLOSED02:40:21.356419. Writer naturally CLOSED02:50:45.877577 UTC, withzero product writes. New candidate checker actually passed452comparisons and8malformed source/scope/history/premature-promotion rejections; original checked() native logger is used. All inherited fullchecks/integrity/deliberate strict remain required for actual current delivery. The02:50:36.305164 early target passed during the space/source-scope work; hard02:55:36.305164 remains the actual push bound. No deadline/result is backdated. No strict KEEP GOING,whole-row completion,Ready or cosmetic-only stopping claim.
