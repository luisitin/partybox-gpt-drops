# B04 — All Jamboree boards, space by space

**What this is:** a research file for the seven current Jamboree boards: space-type counts for 16 profiles (baseline, TV Tag Team and angry), 35 shop profiles with 215 item rows, and Star, event, phase, Homestretch and TV rules, each with its source quotes. Seven board documents are checked cell by cell against `boards.json`, and eleven regional map links are cited.
**How to use it:** read `INTEGRATION.md` first (the port plan for the desktop agent), then `DESIGN-DIGEST.md` (the design reading). Query `boards.json` for numbers; every row carries its status. Do not ship names, prices written as text, artwork or map images.
**Status:** reference only. Research PARTIAL; the strict original standard is **NOT_MET** (93 of 518 factual rows corroborated; one of 38 event rows has no source-backed trigger or effect). PR #18 stays a draft. The 2026-10-08 polish pass changed no factual row; it added a verifier suite (board tables equal the JSON) and the integration and design documents.

**Research PARTIAL.** Seven current boards with 16 baseline, Tag Team and angry count profiles; 176 type-count rows; 35 inventory profiles and 215 item rows. Includes sourced Star, event, path, phase, Homestretch and TV rules, seven detailed board documents and eleven cited regional connections. Exact numbered adjacency, event completeness, gate positions and unsupported qualifiers remain explicit gaps.

518 factual rows: **93 corroborated, 406 single-source, eighteen conflicting and one unknown**. Previously recovered independent claims include the Boo Shop landing/Peepa/15-coin purchase and complete Pro Homestretch behavior. The original research standard remains NOT_MET; keep PR18 draft.

Historical 2026-10-07:both passes reopened all22 retained URLs and recovered all 364 quotations (728 recoveries). All 593 retained rows were reviewed twice; 391 numerical/table rows additionally compared against exact fresh source cells twice. Ten map images were retrieved and visually reviewed twice, with 20 actual HTTP 200 responses; only citations and fingerprints are published. Both passes use the same assistant and Exa retrieval may be cached. Each reviewed row now has a canonical content hash, so a subsequent factual edit invalidates its review receipt.

## Verification

The original full structural/schema/reference/negative-fixture command, strict command and complete manifest checks are recorded with actual output in VERIFY.md. Current dated local original structural/checksum and strict commands are reproduced in full in VERIFY.md and validator-output.txt; the current manifest covers every retained job file and the unchanged workflow. The historical2026-10-08 polish pass added `BOARD_DOC_TABLES_MATCH_JSON`,51/51; the current scoped research changes no gate. CI checks the retained artifact and confirms the explicitly unmet strict verdict. Its green result does not certify complete research.

From this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # expected exit 1
sha256sum -c SHA256SUMS.txt
```

Fresh research requires reopening source URLs and reviewing qualifiers; the offline verifier makes no live-page-freshness claim. No Nintendo executable, RNG or live game behavior is tested.

## Data interpretation

Inventory profiles are host/ruleset alternatives, not physical shop counts. `conditionRulesScope=tag_team` limits an update qualifier to Tag Team; `itemRulesRestriction=tag_team` specifically restricts Together Dice. Steamer Ticket’s reported price is initial, not a fixed later price. Baseline count tables are not Pro Rules or post-Homestretch layouts. Shared TV rule IDs appear in each board’s tvChanges list.

## 2026-10-09 scoped resumption

Western Land’s complete Silver-rank and ten-achievement unlock row now has a second independently authored publisher. The other 517 factual rows and all nine disputes are preserved. Current coverage is 32/518; known event trigger/effect remains 37/38. This is a research improvement, not completion or executed Nintendo gameplay. The original 2026-10-07 full-source and 593-row audits remain historical; only the changed fact and its containing board were reviewed and re-fingerprinted today. See reports/western-unlock-recovery-20261009.json. PR18 remains draft.

### Galleria qualifier recovery, 2026-10-09

SASKE’s original Japanese play account independently supports the complete narrow Super Shop Event Space landing/sale claim, at medium confidence. Current coverage is33/518, with 475 single-source, nine disputes and one unknown. Gold Shop remains single-source because the inspected guide omits its exact Event Space qualifier. The separate stock, ruleset, location, closure and price profiles are preserved. See reports/galleria-qualifier-recovery-20261009.json. PR18 remains draft; original strict research is NOT_MET.

### Original Korean ordinary-count review, 2026-10-09

Current coverage is87/518:412 single-source,18 disagreements,1 unknown. Paired current original Korean tables and Wiki normal-column cells agree on54 individual ordinary baseline type counts and differ on9 more. All original9 disputes and all integers, sums, totals, Start/Rally, other modes and non-count facts are preserved. Complete profiles remain single-source. Medium confidence reflects community provenance and an unobserved game build; no English mirror, arithmetic or omitted type is treated as independent proof. See reports/namu-baseline-recovery-20261009.json. The prior33/518 UNADOPTED comparison checkpoint remains historical. Original strict research remains NOT_MET; PR18 stays Draft.

### Castle complete Event qualifier recovery, 2026-10-09

Initial Event-only step88/518 corroborated,411 single-source,18 unresolved disputes,1 unknown. SASKE’s current personal Castle account and actual paired original screenshots independently support the entire narrow tower Event landing/Yellow Toad/Impostor Bowser/coupled-shop fact. Medium confidence and source prose/visual naming discrepancy remain. All518 values and other517 verdicts are unchanged; the shop passing/purchase conflict remains. See reports/castle-event-recovery-20261009.json. Earlier87/518 ordinary-count milestone remains dated history. Strict NOT_MET; PR18 Draft.

### Historical combined Castle recovery, 2026-10-09

89/518 corroborated,410 single-source,18 conflicts,1 unknown. Exactly two complete narrow facts gain independent medium support: tower Event/Yellow Toad/Bowser/coupled shop and FakeBowser dark/electric music. All518 values and other516 fact objects remain unchanged. See the two scoped Castle recovery reports; the prior47f UNADOPTED report remains historical. Strict NOT_MET; PR18 remains Draft.

### Historical Gold Shop event recovery, 2026-10-09T09:09:06.322549+00:00

90/518 corroborated,409 single-source,18 conflicts,1 unknown. Only the existing Gold Shop Event Space landing/gold-item purchase fact gains medium independent support; all518 values and other517 full fact objects remain unchanged. Earlier GameRant omission of exact space type remains a dated rejection; current original Korean full shop context supplies the missing qualifier. No complete inventory, price, profile, count, regional position, host or closure promotion. Original strict NOT_MET; PR18 remains Draft. See reports/gold-shop-event-recovery-20261009.json.

### Historical complete Milk Saloon event recovery, 2026-10-09T10:02:16.469208+00:00

91/518 corroborated,408 single-source,18 conflicts,1 unknown;37/38 current events. Only the complete existing Milk invitation event gains medium independent support via every-clause coverage: Wiki all, Namu random/costs, Cel Event trigger. All518 values/517 other full fact objects unchanged. The earlier screenshot-based random inference was rejected and remains history; source20-two/20-all discrepancy disclosed. Original strict NOT_MET; PR18 Draft.


2026-10-09T10:24:34.944093+00:00: Complete fresh Steamer original A/B10683-character articles and all current502-character chapter/12references were read after two real HTTP200 captures naturally closed10:18:16.709828. Ordinary3/6 fares agree with original Namu; availability quotes/photos share Nintendo dialogue provenance, so whole train remains UNADOPTED single-source. Complete Cel1691/Wiki2580 tide scopes received an actual negative independent peer; no tide-switch promotion or extra Cel clips. See reports/train-tide-source-scope-checkpoint-20261009.json. All518 wholefacts/values/593fingerprints/18conflicts/registries/gates byteunchanged; Namu250/Cel131 held. Parent d9 original26/5693/92 and strict91FAIL37FAILNOT_MET remain dated proof; current next exact whole CI required after publication.

2026-10-09T10:50:43.256606+00:00: Current two Skeleton Key gate facts gain independent medium support for the missing3-coin price via complete original H1g editorial table versus Wiki price cell; existing complete MPL item row confirms gate use and both board names but its price is blank. All518values/516otherfacts/18conflicts unchanged; only4review fingerprints. 93/518 corroborated,406single-source,18conflicts,1unknown;37/38 events, originalNOT_MET/PR18Draft. See reports/skeleton-key-price-recovery-20261009.json. Original Namu250/Cel131 ledgers/gates/captures remain unchanged. Parent75900 whole original26/5697/94 structuralPASS/strict91FAIL37FAIL actual1 is historical; exact next whole hosted acceptance remains pending publication.

2026-10-09T11:20:46.113893+00:00: Actual fresh full original MPL5992A/B and Namu ordinary Star452/type5881 A/B scopes read. Four ordinary moving-Star complete candidates remain UNADOPTED pending whole-scope peer; all518facts/values/593fingerprints/18conflicts/registries/capturetimes byteunchanged,93/518 and37/38 originalNOT_MET/PR18Draft. Keep fresh named chapter lacks movement statement; Raceway lap formula does not yet independently close retained arch trigger. No new quotes; sharedNamu250/Cel131 unchanged. Read reports/ordinary-moving-star-scope-UNADOPTED-20261009.json.
