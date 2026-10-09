# B04 — All Jamboree boards, space by space

**What this is:** a research file for the seven current Jamboree boards: space-type counts for 16 profiles (baseline, TV Tag Team and angry), 35 shop profiles with 215 item rows, and Star, event, phase, Homestretch and TV rules, each with its source quotes. Seven board documents are checked cell by cell against `boards.json`, and eleven regional map links are cited.
**How to use it:** read `INTEGRATION.md` first (the port plan for the desktop agent), then `DESIGN-DIGEST.md` (the design reading). Query `boards.json` for numbers; every row carries its status. Do not ship names, prices written as text, artwork or map images.
**Status:** reference only. Research PARTIAL; the strict original standard is **NOT_MET** (33 of 518 factual rows corroborated; one of 38 event rows has no source-backed trigger or effect). PR #18 stays a draft. The 2026-10-08 polish pass changed no factual row; it added a verifier suite (board tables equal the JSON) and the integration and design documents.

**Research PARTIAL.** Seven current boards with 16 baseline, Tag Team and angry count profiles; 176 type-count rows; 35 inventory profiles and 215 item rows. Includes sourced Star, event, path, phase, Homestretch and TV rules, seven detailed board documents and eleven cited regional connections. Exact numbered adjacency, event completeness, gate positions and unsupported qualifiers remain explicit gaps.

518 factual rows: **33 corroborated, 475 single-source, nine conflicting and one unknown**. This recovery independently corroborates the Boo Shop landing/Peepa/15-coin purchase and complete Pro Homestretch behavior. The original research standard remains NOT_MET; keep PR18 draft.

Both fresh passes reopened all 22 retained URLs and recovered all 364 quotations (728 recoveries). All 593 retained rows were reviewed twice; 391 numerical/table rows additionally compared against exact fresh source cells twice. Ten map images were retrieved and visually reviewed twice, with 20 actual HTTP 200 responses; only citations and fingerprints are published. Both passes use the same assistant and Exa retrieval may be cached. Each reviewed row now has a canonical content hash, so a subsequent factual edit invalidates its review receipt.

## Verification

The original full structural/schema/reference/negative-fixture command, strict command and complete manifest checks are recorded with actual output in VERIFY.md. The structural run now has 25 suites and 5,391 cases, all PASS (the 2026-10-08 polish pass added `BOARD_DOC_TABLES_MATCH_JSON`, 51/51). CI checks the retained artifact and confirms the explicitly unmet strict verdict. Its green result does not certify complete research.

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
