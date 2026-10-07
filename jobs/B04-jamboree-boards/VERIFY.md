# B04 — Verification

**Original research standard NOT_MET.** Keep PR18 draft: only 29/518 complete factual rows have independent publisher agreement. The count test’s permitted CONFLICTS.md route is used for all 16 reported profiles; arithmetic checks do not make a second source. One current event has unknown trigger/effect.

## Completed checks and commands

Python 3.12.14; jsonschema 4.26.0. All checks below are deterministic, with seed N/A. They validate retained data, evidence references and recorded review outcomes; they do not execute Nintendo gameplay or independently establish research truth.

From this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # completed expected exit 1
sha256sum -c SHA256SUMS.txt
```

| Test | Cases / passed | Seed | Exact command |
|---|---:|---|---|
| CLOSED_JSON_SCHEMAS | 48/48 | N/A | `python3 verify.py --structural` |
| UNIQUE_ID_COLLECTIONS | 25/25 | N/A | `python3 verify.py --structural` |
| SEVEN_BOARD_TWO_PUBLISHER_ROSTER | 7/7 | N/A | `python3 verify.py --structural` |
| EVERY_RECORDED_FACT_HAS_SOURCE | 518/518 | N/A | `python3 verify.py --structural` |
| FACT_QUOTATION_REFERENCES | 627/627 | N/A | `python3 verify.py --structural` |
| SHORT_QUOTE_BUDGETS_AND_LINEAGES | 23/23 | N/A | `python3 verify.py --structural` |
| EVERY_SOURCE_REOPENED_A_B | 42/42 | N/A | `python3 verify.py --structural` |
| QUOTATIONS_RECOVERED_BOTH_PASSES | 714/714 | N/A | `python3 verify.py --structural` |
| SOURCE_CAPTURE_REPORT_REFERENCES | 42/42 | N/A | `python3 verify.py --structural` |
| SPACE_PROFILE_SUMS_AND_CONFLICT_DISCLOSURE | 16/16 | N/A | `python3 verify.py --structural` |
| INDIVIDUAL_TYPE_COUNT_ROWS | 176/176 | N/A | `python3 verify.py --structural` |
| SHOP_INVENTORY_ITEM_ROWS | 215/215 | N/A | `python3 verify.py --structural` |
| FRESH_SOURCE_CELL_COMPARISONS_A_B | 782/782 | N/A | `python3 verify.py --structural` |
| EVENT_TRIGGER_EFFECT_SOURCE_OR_EXPLICIT_GAP | 38/38 | N/A | `python3 verify.py --structural` |
| SHARED_RULE_REFERENCES | 126/126 | N/A | `python3 verify.py --structural` |
| CITED_REGIONAL_MAP_LINKS | 11/11 | N/A | `python3 verify.py --structural` |
| MAP_IMAGE_REOPEN_AND_VISUAL_REVIEW_A_B | 20/20 | N/A | `python3 verify.py --structural` |
| ALL_RETAINED_ROWS_PASS_A | 593/593 | N/A | `python3 verify.py --structural` |
| ALL_RETAINED_ROWS_PASS_B | 593/593 | N/A | `python3 verify.py --structural` |
| BOARD_DOCUMENT_REQUIRED_SECTIONS | 7/7 | N/A | `python3 verify.py --structural` |
| ALL_FACTUAL_CONFLICTS_PRESERVED | 9/9 | N/A | `python3 verify.py --structural` |
| DELIBERATE_REJECTION_FIXTURES | 12/12 | N/A | `python3 verify.py --structural` |
| FILE_SIZE_LIMIT | 68/68 | N/A | `python3 verify.py --structural` |
| SHA256_MANIFEST | 67/67 | N/A | `python3 verify.py --structural --checksums` |
| Separate final manifest processes | 67/67, repeated twice | N/A | `sha256sum -c SHA256SUMS.txt` |

Actual structural run: 23/23 suites and 4,712/4,712 cases, exit 0. Final complete manifest run: 24/24 suites and 4,779/4,779 cases, exit 0. Twelve deliberately invalid fixtures are rejected. Three final manifest checks cover all 67 entries: one validator pass plus two independent sha256sum processes. All 68 delivery files, including the own B04 workflow and manifest, are below 30,000,000 bytes.

The strict run completes with exit 1: full facts 29/518 FAIL; known current event trigger/effect 37/38 FAIL. Exact numbered map availability is descriptive provenance, not an added acceptance requirement: the original prompt permits cited maps as best sources allow. Regional maps and explicit missing links are supplied. No game-build, independent-person or primary-capture requirement is added to the original prompt.

## Actual validator output

```text
$ python3 verify.py --structural
PASS CLOSED_JSON_SCHEMAS: 48/48
PASS UNIQUE_ID_COLLECTIONS: 25/25
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 627/627
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 23/23
PASS EVERY_SOURCE_REOPENED_A_B: 42/42
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 714/714
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 42/42
PASS SPACE_PROFILE_SUMS_AND_CONFLICT_DISCLOSURE: 16/16
PASS INDIVIDUAL_TYPE_COUNT_ROWS: 176/176
PASS SHOP_INVENTORY_ITEM_ROWS: 215/215
PASS FRESH_SOURCE_CELL_COMPARISONS_A_B: 782/782
PASS EVENT_TRIGGER_EFFECT_SOURCE_OR_EXPLICIT_GAP: 38/38
PASS SHARED_RULE_REFERENCES: 126/126
PASS CITED_REGIONAL_MAP_LINKS: 11/11
PASS MAP_IMAGE_REOPEN_AND_VISUAL_REVIEW_A_B: 20/20
PASS ALL_RETAINED_ROWS_PASS_A: 593/593
PASS ALL_RETAINED_ROWS_PASS_B: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 9/9
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 68/68
STRUCTURAL_RESULT=PASS; suites=23; cases=4712; seed=N/A (deterministic)
EXIT_CODE=0

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 48/48
PASS UNIQUE_ID_COLLECTIONS: 25/25
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 627/627
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 23/23
PASS EVERY_SOURCE_REOPENED_A_B: 42/42
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 714/714
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 42/42
PASS SPACE_PROFILE_SUMS_AND_CONFLICT_DISCLOSURE: 16/16
PASS INDIVIDUAL_TYPE_COUNT_ROWS: 176/176
PASS SHOP_INVENTORY_ITEM_ROWS: 215/215
PASS FRESH_SOURCE_CELL_COMPARISONS_A_B: 782/782
PASS EVENT_TRIGGER_EFFECT_SOURCE_OR_EXPLICIT_GAP: 38/38
PASS SHARED_RULE_REFERENCES: 126/126
PASS CITED_REGIONAL_MAP_LINKS: 11/11
PASS MAP_IMAGE_REOPEN_AND_VISUAL_REVIEW_A_B: 20/20
PASS ALL_RETAINED_ROWS_PASS_A: 593/593
PASS ALL_RETAINED_ROWS_PASS_B: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 9/9
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 68/68
STRUCTURAL_RESULT=PASS; suites=23; cases=4712; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=29/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT_CODE=1
```

## Full second-pass evidence

Every retained publisher URL was reopened in A and B: 21/21 each pass, all 357 registered short quotations recovered each pass, 714 recoveries across 42 capture records. The captures contain only short quotes, URLs and retrieved-markdown hashes. Retrieval may be cached; this records tool reopening, not origin-byte freshness. See reports/source-reopen-audit.json.

All 176 type-count and 215 inventory rows (391) were compared against exact located source cells and qualifiers in both passes (782 comparisons). reports/context-checks.json retains the normalized observed values and links each row. It does not add an independent publisher source.

All ten linked map images were retrieved and visually inspected in A and B. Nine were byte-identical; Wiggler returned a different JPEG representation. Its regional observations agree after both visual reviews. map-assets.json preserves both fingerprints and discloses the change. Image bytes are not published. No installed game version is asserted.

All 593 retained rows reviewed in both passes: 518 factual rows, seven board records, seven regional descriptions, 16 count profiles, 35 inventory profiles and ten map assets. Both passes use the same assistant. Complete row log follows and is also machine-readable in reports/research-row-audit.json.

| Row | Pass A | Pass B |
|---|---|---|
| mega-wiggler-tree-party:presence | corroborated | corroborated |
| mega-wiggler-tree-party:space:baseline_party:start | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:blue | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:red | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:event | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:chance_time | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:item | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:vs | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:rally | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:lucky | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:unlucky | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party:bowser | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:start | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:blue | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:red | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:event | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:chance_time | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:item | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:vs | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:rally | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:lucky | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:unlucky | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team:bowser | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:start | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:blue | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:red | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:event | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:chance_time | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:item | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:vs | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:rally | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:lucky | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:unlucky | single_source | single_source |
| mega-wiggler-tree-party:space:baseline_party_angry:bowser | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:start | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:blue | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:red | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:event | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:chance_time | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:item | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:vs | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:rally | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:lucky | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:unlucky | single_source | single_source |
| mega-wiggler-tree-party:space:tv_tag_team_angry:bowser | single_source | single_source |
| mega-wiggler-tree-party:stars:purchase | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:0 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:1 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:2 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:3 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:4 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:5 | single_source | single_source |
| mega-wiggler-tree-party:shop:0:item:6 | single_source | single_source |
| mega-wiggler-tree-party:shop:1:item:0 | single_source | single_source |
| mega-wiggler-tree-party:shop:1:item:1 | single_source | single_source |
| mega-wiggler-tree-party:shop:1:item:2 | single_source | single_source |
| mega-wiggler-tree-party:shop:1:item:3 | single_source | single_source |
| mega-wiggler-tree-party:shop:1:item:4 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:0 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:1 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:2 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:3 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:4 | single_source | single_source |
| mega-wiggler-tree-party:shop:2:item:5 | single_source | single_source |
| mega-wiggler-tree-party:shop:3:item:0 | single_source | single_source |
| mega-wiggler-tree-party:shop:3:item:1 | single_source | single_source |
| mega-wiggler-tree-party:shop:3:item:2 | single_source | single_source |
| mega-wiggler-tree-party:shop:3:item:3 | single_source | single_source |
| mega-wiggler-tree-party:shop:3:item:4 | single_source | single_source |
| mega-wiggler-tree-party:events:bell_move | corroborated | corroborated |
| mega-wiggler-tree-party:events:plant | single_source | single_source |
| mega-wiggler-tree-party:events:honey | single_source | single_source |
| mega-wiggler-tree-party:phases:anger | conflict | conflict |
| mega-wiggler-tree-party:homestretch:preserved_back_spaces | single_source | single_source |
| mega-wiggler-tree-party:map_link:variable_bridge | single_source | single_source |
| rainbow-galleria:presence | corroborated | corroborated |
| rainbow-galleria:space:baseline_party:start | single_source | single_source |
| rainbow-galleria:space:baseline_party:blue | single_source | single_source |
| rainbow-galleria:space:baseline_party:red | single_source | single_source |
| rainbow-galleria:space:baseline_party:event | single_source | single_source |
| rainbow-galleria:space:baseline_party:chance_time | single_source | single_source |
| rainbow-galleria:space:baseline_party:item | single_source | single_source |
| rainbow-galleria:space:baseline_party:vs | single_source | single_source |
| rainbow-galleria:space:baseline_party:rally | single_source | single_source |
| rainbow-galleria:space:baseline_party:lucky | single_source | single_source |
| rainbow-galleria:space:baseline_party:unlucky | single_source | single_source |
| rainbow-galleria:space:baseline_party:bowser | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:start | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:blue | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:red | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:event | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:chance_time | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:item | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:vs | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:rally | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:lucky | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:unlucky | single_source | single_source |
| rainbow-galleria:space:tv_tag_team:bowser | single_source | single_source |
| rainbow-galleria:stars:purchase | single_source | single_source |
| rainbow-galleria:shop:0:location | single_source | single_source |
| rainbow-galleria:shop:0:item:0 | single_source | single_source |
| rainbow-galleria:shop:0:item:1 | single_source | single_source |
| rainbow-galleria:shop:0:item:2 | single_source | single_source |
| rainbow-galleria:shop:0:item:3 | single_source | single_source |
| rainbow-galleria:shop:0:item:4 | conflict | conflict |
| rainbow-galleria:shop:0:item:5 | single_source | single_source |
| rainbow-galleria:shop:0:item:6 | single_source | single_source |
| rainbow-galleria:shop:0:item:7 | single_source | single_source |
| rainbow-galleria:shop:1:location | single_source | single_source |
| rainbow-galleria:shop:1:item:0 | single_source | single_source |
| rainbow-galleria:shop:1:item:1 | single_source | single_source |
| rainbow-galleria:shop:1:item:2 | single_source | single_source |
| rainbow-galleria:shop:1:item:3 | single_source | single_source |
| rainbow-galleria:shop:1:item:4 | single_source | single_source |
| rainbow-galleria:shop:1:item:5 | single_source | single_source |
| rainbow-galleria:shop:2:location | single_source | single_source |
| rainbow-galleria:shop:2:item:0 | single_source | single_source |
| rainbow-galleria:shop:2:item:1 | single_source | single_source |
| rainbow-galleria:shop:2:item:2 | single_source | single_source |
| rainbow-galleria:shop:2:item:3 | single_source | single_source |
| rainbow-galleria:shop:3:location | single_source | single_source |
| rainbow-galleria:shop:3:item:0 | single_source | single_source |
| rainbow-galleria:shop:3:item:1 | single_source | single_source |
| rainbow-galleria:shop:3:item:2 | single_source | single_source |
| rainbow-galleria:shop:4:location | single_source | single_source |
| rainbow-galleria:shop:4:item:0 | single_source | single_source |
| rainbow-galleria:shop:4:item:1 | single_source | single_source |
| rainbow-galleria:shop:4:item:2 | single_source | single_source |
| rainbow-galleria:shop:4:item:3 | single_source | single_source |
| rainbow-galleria:shop:4:item:4 | single_source | single_source |
| rainbow-galleria:shop:5:location | single_source | single_source |
| rainbow-galleria:shop:5:item:0 | single_source | single_source |
| rainbow-galleria:shop:5:item:1 | single_source | single_source |
| rainbow-galleria:shop:5:item:2 | single_source | single_source |
| rainbow-galleria:shop:6:location | single_source | single_source |
| rainbow-galleria:shop:6:item:0 | single_source | single_source |
| rainbow-galleria:shop:6:item:1 | single_source | single_source |
| rainbow-galleria:shop:6:item:2 | single_source | single_source |
| rainbow-galleria:shop:7:location | single_source | single_source |
| rainbow-galleria:shop:7:item:0 | single_source | single_source |
| rainbow-galleria:gatesPaths:elevator | corroborated | corroborated |
| rainbow-galleria:gatesPaths:escalators | corroborated | corroborated |
| rainbow-galleria:events:stamps | single_source | single_source |
| rainbow-galleria:events:last_place_shop | corroborated | corroborated |
| rainbow-galleria:events:last_place_qualifiers | single_source | single_source |
| rainbow-galleria:events:super_shop | single_source | single_source |
| rainbow-galleria:events:gold_shop | single_source | single_source |
| rainbow-galleria:events:boo_shop | single_source | single_source |
| rainbow-galleria:events:thrift | corroborated | corroborated |
| rainbow-galleria:events:loadstone | conflict | conflict |
| rainbow-galleria:events:raffle | single_source | single_source |
| rainbow-galleria:phases:stamp_color_labels | conflict | conflict |
| rainbow-galleria:phases:flash_sale | corroborated | corroborated |
| rainbow-galleria:phases:flash_qualifiers | single_source | single_source |
| rainbow-galleria:phases:markup | corroborated | corroborated |
| rainbow-galleria:phases:shop_closure_stock | single_source | single_source |
| rainbow-galleria:phases:peach_daisy | conflict | conflict |
| rainbow-galleria:map_link:escalator_1_2 | corroborated | corroborated |
| rainbow-galleria:map_link:escalator_2_3 | corroborated | corroborated |
| rainbow-galleria:map_link:elevator | corroborated | corroborated |
| goomba-lagoon:presence | corroborated | corroborated |
| goomba-lagoon:space:baseline_party:start | single_source | single_source |
| goomba-lagoon:space:baseline_party:blue | single_source | single_source |
| goomba-lagoon:space:baseline_party:red | single_source | single_source |
| goomba-lagoon:space:baseline_party:event | single_source | single_source |
| goomba-lagoon:space:baseline_party:chance_time | single_source | single_source |
| goomba-lagoon:space:baseline_party:item | single_source | single_source |
| goomba-lagoon:space:baseline_party:vs | single_source | single_source |
| goomba-lagoon:space:baseline_party:rally | single_source | single_source |
| goomba-lagoon:space:baseline_party:lucky | single_source | single_source |
| goomba-lagoon:space:baseline_party:unlucky | single_source | single_source |
| goomba-lagoon:space:baseline_party:bowser | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:start | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:blue | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:red | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:event | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:chance_time | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:item | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:vs | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:rally | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:lucky | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:unlucky | single_source | single_source |
| goomba-lagoon:space:tv_tag_team:bowser | single_source | single_source |
| goomba-lagoon:stars:purchase | single_source | single_source |
| goomba-lagoon:shop:0:item:0 | single_source | single_source |
| goomba-lagoon:shop:0:item:1 | single_source | single_source |
| goomba-lagoon:shop:0:item:2 | single_source | single_source |
| goomba-lagoon:shop:0:item:3 | single_source | single_source |
| goomba-lagoon:shop:0:item:4 | single_source | single_source |
| goomba-lagoon:shop:0:item:5 | single_source | single_source |
| goomba-lagoon:shop:0:item:6 | single_source | single_source |
| goomba-lagoon:shop:0:item:7 | single_source | single_source |
| goomba-lagoon:shop:0:item:8 | single_source | single_source |
| goomba-lagoon:shop:1:item:0 | single_source | single_source |
| goomba-lagoon:shop:1:item:1 | single_source | single_source |
| goomba-lagoon:shop:1:item:2 | single_source | single_source |
| goomba-lagoon:shop:1:item:3 | single_source | single_source |
| goomba-lagoon:shop:1:item:4 | single_source | single_source |
| goomba-lagoon:shop:1:item:5 | single_source | single_source |
| goomba-lagoon:shop:2:item:0 | single_source | single_source |
| goomba-lagoon:shop:2:item:1 | single_source | single_source |
| goomba-lagoon:shop:2:item:2 | single_source | single_source |
| goomba-lagoon:shop:2:item:3 | single_source | single_source |
| goomba-lagoon:shop:2:item:4 | single_source | single_source |
| goomba-lagoon:shop:2:item:5 | single_source | single_source |
| goomba-lagoon:shop:2:item:6 | single_source | single_source |
| goomba-lagoon:shop:3:item:0 | single_source | single_source |
| goomba-lagoon:shop:3:item:1 | single_source | single_source |
| goomba-lagoon:shop:3:item:2 | single_source | single_source |
| goomba-lagoon:shop:3:item:3 | single_source | single_source |
| goomba-lagoon:shop:3:item:4 | single_source | single_source |
| goomba-lagoon:shop:3:item:5 | single_source | single_source |
| goomba-lagoon:gatesPaths:tide_routes | corroborated | corroborated |
| goomba-lagoon:events:tide_event | single_source | single_source |
| goomba-lagoon:events:submerged_rescue | single_source | single_source |
| goomba-lagoon:events:zipline | single_source | single_source |
| goomba-lagoon:events:chests | single_source | single_source |
| goomba-lagoon:events:fishing | single_source | single_source |
| goomba-lagoon:events:eruption | conflict | conflict |
| goomba-lagoon:phases:tides | conflict | conflict |
| goomba-lagoon:phases:pro_chest | single_source | single_source |
| goomba-lagoon:homestretch:submerged_retypes | single_source | single_source |
| goomba-lagoon:map_link:island_paths | corroborated | corroborated |
| goomba-lagoon:map_link:zipline | single_source | single_source |
| roll-em-raceway:presence | corroborated | corroborated |
| roll-em-raceway:space:baseline_party:start | single_source | single_source |
| roll-em-raceway:space:baseline_party:blue | single_source | single_source |
| roll-em-raceway:space:baseline_party:red | single_source | single_source |
| roll-em-raceway:space:baseline_party:event | single_source | single_source |
| roll-em-raceway:space:baseline_party:chance_time | single_source | single_source |
| roll-em-raceway:space:baseline_party:item | single_source | single_source |
| roll-em-raceway:space:baseline_party:vs | single_source | single_source |
| roll-em-raceway:space:baseline_party:rally | single_source | single_source |
| roll-em-raceway:space:baseline_party:lucky | single_source | single_source |
| roll-em-raceway:space:baseline_party:unlucky | single_source | single_source |
| roll-em-raceway:space:baseline_party:bowser | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:start | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:blue | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:red | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:event | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:chance_time | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:item | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:vs | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:rally | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:lucky | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:unlucky | single_source | single_source |
| roll-em-raceway:space:tv_tag_team:bowser | single_source | single_source |
| roll-em-raceway:stars:purchase | single_source | single_source |
| roll-em-raceway:stars:alternating_qualifiers | single_source | single_source |
| roll-em-raceway:shop:0:item:0 | single_source | single_source |
| roll-em-raceway:shop:0:item:1 | single_source | single_source |
| roll-em-raceway:shop:0:item:2 | single_source | single_source |
| roll-em-raceway:shop:0:item:3 | single_source | single_source |
| roll-em-raceway:shop:0:item:4 | single_source | single_source |
| roll-em-raceway:shop:0:item:5 | single_source | single_source |
| roll-em-raceway:shop:0:item:6 | single_source | single_source |
| roll-em-raceway:shop:0:item:7 | single_source | single_source |
| roll-em-raceway:shop:0:item:8 | single_source | single_source |
| roll-em-raceway:shop:1:item:0 | single_source | single_source |
| roll-em-raceway:shop:1:item:1 | single_source | single_source |
| roll-em-raceway:shop:1:item:2 | single_source | single_source |
| roll-em-raceway:shop:1:item:3 | single_source | single_source |
| roll-em-raceway:shop:1:item:4 | single_source | single_source |
| roll-em-raceway:shop:1:item:5 | single_source | single_source |
| roll-em-raceway:shop:2:item:0 | single_source | single_source |
| roll-em-raceway:shop:2:item:1 | single_source | single_source |
| roll-em-raceway:shop:2:item:2 | single_source | single_source |
| roll-em-raceway:shop:2:item:3 | single_source | single_source |
| roll-em-raceway:shop:2:item:4 | single_source | single_source |
| roll-em-raceway:shop:2:item:5 | single_source | single_source |
| roll-em-raceway:shop:2:item:6 | single_source | single_source |
| roll-em-raceway:shop:2:item:7 | single_source | single_source |
| roll-em-raceway:shop:3:item:0 | single_source | single_source |
| roll-em-raceway:shop:3:item:1 | single_source | single_source |
| roll-em-raceway:shop:3:item:2 | single_source | single_source |
| roll-em-raceway:shop:3:item:3 | single_source | single_source |
| roll-em-raceway:shop:3:item:4 | single_source | single_source |
| roll-em-raceway:shop:3:item:5 | single_source | single_source |
| roll-em-raceway:events:runaway | single_source | single_source |
| roll-em-raceway:events:jump_pad | single_source | single_source |
| roll-em-raceway:events:swap | single_source | single_source |
| roll-em-raceway:events:dice_stop | corroborated | corroborated |
| roll-em-raceway:events:laps | single_source | single_source |
| roll-em-raceway:phases:dice_pool | single_source | single_source |
| roll-em-raceway:phases:turbo | single_source | single_source |
| roll-em-raceway:phases:creepy_availability | single_source | single_source |
| roll-em-raceway:phases:shop_count_scope | single_source | single_source |
| roll-em-raceway:map_link:pad | single_source | single_source |
| king-bowser-keep:presence | corroborated | corroborated |
| king-bowser-keep:space:baseline_party:start | single_source | single_source |
| king-bowser-keep:space:baseline_party:blue | single_source | single_source |
| king-bowser-keep:space:baseline_party:red | single_source | single_source |
| king-bowser-keep:space:baseline_party:event | single_source | single_source |
| king-bowser-keep:space:baseline_party:chance_time | single_source | single_source |
| king-bowser-keep:space:baseline_party:item | single_source | single_source |
| king-bowser-keep:space:baseline_party:vs | single_source | single_source |
| king-bowser-keep:space:baseline_party:rally | single_source | single_source |
| king-bowser-keep:space:baseline_party:lucky | single_source | single_source |
| king-bowser-keep:space:baseline_party:unlucky | single_source | single_source |
| king-bowser-keep:space:baseline_party:bowser | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:start | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:blue | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:red | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:event | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:chance_time | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:item | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:vs | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:rally | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:lucky | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:unlucky | single_source | single_source |
| king-bowser-keep:space:tv_tag_team:bowser | single_source | single_source |
| king-bowser-keep:stars:purchase | single_source | single_source |
| king-bowser-keep:shop:0:item:0 | single_source | single_source |
| king-bowser-keep:shop:0:item:1 | single_source | single_source |
| king-bowser-keep:shop:0:item:2 | single_source | single_source |
| king-bowser-keep:shop:0:item:3 | single_source | single_source |
| king-bowser-keep:shop:0:item:4 | single_source | single_source |
| king-bowser-keep:shop:0:item:5 | single_source | single_source |
| king-bowser-keep:shop:0:item:6 | single_source | single_source |
| king-bowser-keep:shop:0:item:7 | single_source | single_source |
| king-bowser-keep:shop:0:item:8 | single_source | single_source |
| king-bowser-keep:shop:1:item:0 | single_source | single_source |
| king-bowser-keep:shop:1:item:1 | single_source | single_source |
| king-bowser-keep:shop:1:item:2 | single_source | single_source |
| king-bowser-keep:shop:1:item:3 | single_source | single_source |
| king-bowser-keep:shop:1:item:4 | single_source | single_source |
| king-bowser-keep:shop:1:item:5 | single_source | single_source |
| king-bowser-keep:shop:2:item:0 | single_source | single_source |
| king-bowser-keep:shop:2:item:1 | single_source | single_source |
| king-bowser-keep:shop:2:item:2 | single_source | single_source |
| king-bowser-keep:shop:2:item:3 | single_source | single_source |
| king-bowser-keep:shop:2:item:4 | single_source | single_source |
| king-bowser-keep:shop:2:item:5 | single_source | single_source |
| king-bowser-keep:shop:2:item:6 | single_source | single_source |
| king-bowser-keep:shop:2:item:7 | single_source | single_source |
| king-bowser-keep:shop:3:item:0 | single_source | single_source |
| king-bowser-keep:shop:3:item:1 | single_source | single_source |
| king-bowser-keep:shop:3:item:2 | single_source | single_source |
| king-bowser-keep:shop:3:item:3 | single_source | single_source |
| king-bowser-keep:shop:3:item:4 | single_source | single_source |
| king-bowser-keep:shop:3:item:5 | single_source | single_source |
| king-bowser-keep:gatesPaths:skeleton_gate | single_source | single_source |
| king-bowser-keep:events:byway_reverse | corroborated | corroborated |
| king-bowser-keep:events:red_pipe | single_source | single_source |
| king-bowser-keep:events:bill_blaster | single_source | single_source |
| king-bowser-keep:events:green_pipe | single_source | single_source |
| king-bowser-keep:events:gear | single_source | single_source |
| king-bowser-keep:events:mechakoopa | single_source | single_source |
| king-bowser-keep:events:vault | single_source | single_source |
| king-bowser-keep:events:bowser_byway | single_source | single_source |
| king-bowser-keep:phases:fire_growth | single_source | single_source |
| king-bowser-keep:phases:retype_bounds | single_source | single_source |
| king-bowser-keep:phases:unlock | conflict | conflict |
| king-bowser-keep:homestretch:no_extra_bowser | single_source | single_source |
| king-bowser-keep:map_link:green_pipe | single_source | single_source |
| king-bowser-keep:map_link:red_pipe | single_source | single_source |
| mario-rainbow-castle:presence | corroborated | corroborated |
| mario-rainbow-castle:space:baseline_party:start | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:blue | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:red | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:event | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:chance_time | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:item | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:vs | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:rally | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:lucky | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:unlucky | single_source | single_source |
| mario-rainbow-castle:space:baseline_party:bowser | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:start | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:blue | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:red | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:event | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:chance_time | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:item | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:vs | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:rally | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:lucky | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:unlucky | single_source | single_source |
| mario-rainbow-castle:space:tv_tag_team:bowser | single_source | single_source |
| mario-rainbow-castle:stars:purchase | single_source | single_source |
| mario-rainbow-castle:shop:0:location | single_source | single_source |
| mario-rainbow-castle:shop:0:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:0:item:6 | single_source | single_source |
| mario-rainbow-castle:shop:1:location | single_source | single_source |
| mario-rainbow-castle:shop:1:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:1:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:1:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:1:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:1:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:1:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:2:location | single_source | single_source |
| mario-rainbow-castle:shop:2:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:6 | single_source | single_source |
| mario-rainbow-castle:shop:2:item:7 | single_source | single_source |
| mario-rainbow-castle:shop:3:location | single_source | single_source |
| mario-rainbow-castle:shop:3:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:6 | single_source | single_source |
| mario-rainbow-castle:shop:3:item:7 | single_source | single_source |
| mario-rainbow-castle:shop:4:location | single_source | single_source |
| mario-rainbow-castle:shop:4:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:4:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:4:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:4:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:4:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:4:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:5:location | single_source | single_source |
| mario-rainbow-castle:shop:5:item:0 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:1 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:2 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:3 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:4 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:5 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:6 | single_source | single_source |
| mario-rainbow-castle:shop:5:item:7 | single_source | single_source |
| mario-rainbow-castle:events:tower | single_source | single_source |
| mario-rainbow-castle:events:tower_event | single_source | single_source |
| mario-rainbow-castle:events:ztar_shortfall | single_source | single_source |
| mario-rainbow-castle:phases:shop_swap | conflict | conflict |
| mario-rainbow-castle:phases:tower_turner | corroborated | corroborated |
| mario-rainbow-castle:phases:weather | single_source | single_source |
| mario-rainbow-castle:homestretch:no_extra_star | single_source | single_source |
| mario-rainbow-castle:map_link:tower_return | single_source | single_source |
| western-land:presence | corroborated | corroborated |
| western-land:space:baseline_party:start | single_source | single_source |
| western-land:space:baseline_party:blue | single_source | single_source |
| western-land:space:baseline_party:red | single_source | single_source |
| western-land:space:baseline_party:event | single_source | single_source |
| western-land:space:baseline_party:chance_time | single_source | single_source |
| western-land:space:baseline_party:item | single_source | single_source |
| western-land:space:baseline_party:vs | single_source | single_source |
| western-land:space:baseline_party:rally | single_source | single_source |
| western-land:space:baseline_party:lucky | single_source | single_source |
| western-land:space:baseline_party:unlucky | single_source | single_source |
| western-land:space:baseline_party:bowser | single_source | single_source |
| western-land:space:tv_tag_team:start | single_source | single_source |
| western-land:space:tv_tag_team:blue | single_source | single_source |
| western-land:space:tv_tag_team:red | single_source | single_source |
| western-land:space:tv_tag_team:event | single_source | single_source |
| western-land:space:tv_tag_team:chance_time | single_source | single_source |
| western-land:space:tv_tag_team:item | single_source | single_source |
| western-land:space:tv_tag_team:vs | single_source | single_source |
| western-land:space:tv_tag_team:rally | single_source | single_source |
| western-land:space:tv_tag_team:lucky | single_source | single_source |
| western-land:space:tv_tag_team:unlucky | single_source | single_source |
| western-land:space:tv_tag_team:bowser | single_source | single_source |
| western-land:stars:purchase | single_source | single_source |
| western-land:shop:0:item:0 | single_source | single_source |
| western-land:shop:0:item:1 | single_source | single_source |
| western-land:shop:0:item:2 | single_source | single_source |
| western-land:shop:0:item:3 | single_source | single_source |
| western-land:shop:0:item:4 | single_source | single_source |
| western-land:shop:0:item:5 | single_source | single_source |
| western-land:shop:0:item:6 | single_source | single_source |
| western-land:shop:0:item:7 | single_source | single_source |
| western-land:shop:0:item:8 | single_source | single_source |
| western-land:shop:1:item:0 | single_source | single_source |
| western-land:shop:1:item:1 | single_source | single_source |
| western-land:shop:1:item:2 | single_source | single_source |
| western-land:shop:1:item:3 | single_source | single_source |
| western-land:shop:1:item:4 | single_source | single_source |
| western-land:shop:1:item:5 | single_source | single_source |
| western-land:shop:2:item:0 | single_source | single_source |
| western-land:shop:2:item:1 | single_source | single_source |
| western-land:shop:2:item:2 | single_source | single_source |
| western-land:shop:2:item:3 | single_source | single_source |
| western-land:shop:2:item:4 | single_source | single_source |
| western-land:shop:2:item:5 | single_source | single_source |
| western-land:shop:2:item:6 | single_source | single_source |
| western-land:shop:2:item:7 | single_source | single_source |
| western-land:shop:3:item:0 | single_source | single_source |
| western-land:shop:3:item:1 | single_source | single_source |
| western-land:shop:3:item:2 | single_source | single_source |
| western-land:shop:3:item:3 | single_source | single_source |
| western-land:shop:3:item:4 | single_source | single_source |
| western-land:shop:3:item:5 | single_source | single_source |
| western-land:shop:4:location | single_source | single_source |
| western-land:shop:4:item:0 | single_source | single_source |
| western-land:gatesPaths:train | single_source | single_source |
| western-land:gatesPaths:skeleton_gate | single_source | single_source |
| western-land:events:train_hit | corroborated | corroborated |
| western-land:events:train_event | unverified | unverified |
| western-land:events:hootenanny | single_source | single_source |
| western-land:events:steamer_ticket | single_source | single_source |
| western-land:phases:unlock | single_source | single_source |
| western-land:map_link:train_transfer | single_source | single_source |
| shared:star_cost | corroborated | corroborated |
| shared:homestretch_base | single_source | single_source |
| shared:mushroom | single_source | single_source |
| shared:extra_star | single_source | single_source |
| shared:star_traps | single_source | single_source |
| shared:double_dice | single_source | single_source |
| shared:double_spaces | corroborated | corroborated |
| shared:double_coins | single_source | single_source |
| shared:extra_bowser | single_source | single_source |
| shared:extra_chance | single_source | single_source |
| shared:pro_homestretch | single_source | single_source |
| shared:shop_period | single_source | single_source |
| shared:pro_stock | single_source | single_source |
| shared:tv_camera_pro | corroborated | corroborated |
| shared:tv_frenzy | corroborated | corroborated |
| shared:tv_tag | corroborated | corroborated |
| shared:tv_tag_qualifiers | single_source | single_source |
| shared:no_new_boards | corroborated | corroborated |
| mega-wiggler-tree-party:board_record | partial | partial |
| mega-wiggler-tree-party:map_description | single_source | single_source |
| mega-wiggler-tree-party:profile:baseline_party | single_source | single_source |
| mega-wiggler-tree-party:profile:tv_tag_team | single_source | single_source |
| mega-wiggler-tree-party:profile:baseline_party_angry | single_source | single_source |
| mega-wiggler-tree-party:profile:tv_tag_team_angry | single_source | single_source |
| mega-wiggler-tree-party:shop:0 | single_source | single_source |
| mega-wiggler-tree-party:shop:1 | single_source | single_source |
| mega-wiggler-tree-party:shop:2 | single_source | single_source |
| mega-wiggler-tree-party:shop:3 | single_source | single_source |
| rainbow-galleria:board_record | partial | partial |
| rainbow-galleria:map_description | single_source | single_source |
| rainbow-galleria:profile:baseline_party | single_source | single_source |
| rainbow-galleria:profile:tv_tag_team | single_source | single_source |
| rainbow-galleria:shop:0 | single_source | single_source |
| rainbow-galleria:shop:1 | single_source | single_source |
| rainbow-galleria:shop:2 | single_source | single_source |
| rainbow-galleria:shop:3 | single_source | single_source |
| rainbow-galleria:shop:4 | single_source | single_source |
| rainbow-galleria:shop:5 | single_source | single_source |
| rainbow-galleria:shop:6 | single_source | single_source |
| rainbow-galleria:shop:7 | single_source | single_source |
| goomba-lagoon:board_record | partial | partial |
| goomba-lagoon:map_description | single_source | single_source |
| goomba-lagoon:profile:baseline_party | single_source | single_source |
| goomba-lagoon:profile:tv_tag_team | single_source | single_source |
| goomba-lagoon:shop:0 | single_source | single_source |
| goomba-lagoon:shop:1 | single_source | single_source |
| goomba-lagoon:shop:2 | single_source | single_source |
| goomba-lagoon:shop:3 | single_source | single_source |
| roll-em-raceway:board_record | partial | partial |
| roll-em-raceway:map_description | single_source | single_source |
| roll-em-raceway:profile:baseline_party | single_source | single_source |
| roll-em-raceway:profile:tv_tag_team | single_source | single_source |
| roll-em-raceway:shop:0 | single_source | single_source |
| roll-em-raceway:shop:1 | single_source | single_source |
| roll-em-raceway:shop:2 | single_source | single_source |
| roll-em-raceway:shop:3 | single_source | single_source |
| king-bowser-keep:board_record | partial | partial |
| king-bowser-keep:map_description | single_source | single_source |
| king-bowser-keep:profile:baseline_party | single_source | single_source |
| king-bowser-keep:profile:tv_tag_team | single_source | single_source |
| king-bowser-keep:shop:0 | single_source | single_source |
| king-bowser-keep:shop:1 | single_source | single_source |
| king-bowser-keep:shop:2 | single_source | single_source |
| king-bowser-keep:shop:3 | single_source | single_source |
| mario-rainbow-castle:board_record | partial | partial |
| mario-rainbow-castle:map_description | single_source | single_source |
| mario-rainbow-castle:profile:baseline_party | single_source | single_source |
| mario-rainbow-castle:profile:tv_tag_team | single_source | single_source |
| mario-rainbow-castle:shop:0 | single_source | single_source |
| mario-rainbow-castle:shop:1 | single_source | single_source |
| mario-rainbow-castle:shop:2 | single_source | single_source |
| mario-rainbow-castle:shop:3 | single_source | single_source |
| mario-rainbow-castle:shop:4 | single_source | single_source |
| mario-rainbow-castle:shop:5 | single_source | single_source |
| western-land:board_record | partial | partial |
| western-land:map_description | single_source | single_source |
| western-land:profile:baseline_party | single_source | single_source |
| western-land:profile:tv_tag_team | single_source | single_source |
| western-land:shop:0 | single_source | single_source |
| western-land:shop:1 | single_source | single_source |
| western-land:shop:2 | single_source | single_source |
| western-land:shop:3 | single_source | single_source |
| western-land:shop:4 | single_source | single_source |
| map_asset:wiggler | single_source | single_source |
| map_asset:galleria | single_source | single_source |
| map_asset:lagoon-low | single_source | single_source |
| map_asset:lagoon-high | single_source | single_source |
| map_asset:raceway | single_source | single_source |
| map_asset:raceway-swapped | single_source | single_source |
| map_asset:keep | single_source | single_source |
| map_asset:castle | single_source | single_source |
| map_asset:castle-bowser | single_source | single_source |
| map_asset:western | single_source | single_source |

## UNVERIFIED

489/518 full factual rows remain unresolved: 479 single-source, nine conflicting and one explicitly unknown. All are labeled individually in boards.json, SOURCES.md and board documents; the full row log above retains each outcome. Source agreement on a payout or core rule does not verify a different passing trigger, condition, actor or edition qualifier.

All 16 reported space-type profiles lack independent complete numerical tables, including all TV Tag Team profiles and Wiggler angry states. CONFLICTS.md lists every board/profile/total/source. Pro Rules, post-Homestretch layout changes and Bowser’s conditional retyping order are not extrapolated.

The complete unresolved current event is western-land:events:train_event: trigger and effect are null. Its cited historical Mario Party 2 behavior is explicitly excluded from current Jamboree facts.

The nine preserved disagreement rows are:

- `mega-wiggler-tree-party:phases:anger` — Wiki and PocketTactics disagree on converted space types. No anger probability inferred.
- `rainbow-galleria:shop:0:item:4` — Current wiki lists 6; GameRant lists 8. Value preserves the wiki report, alternatives retained.
- `rainbow-galleria:events:loadstone` — No silent resolution.
- `rainbow-galleria:phases:stamp_color_labels` — Same colored station art may be named differently; preserve labels instead of silently substituting.
- `rainbow-galleria:phases:peach_daisy` — Version/scope disagreement; current game build not observed.
- `goomba-lagoon:events:eruption` — Preserve 5 vs 3; event trigger and probabilities have one complete detailed account.
- `goomba-lagoon:phases:tides` — Official marketing, DS and current wiki disagree on cadence; no schedule guessed.
- `king-bowser-keep:phases:unlock` — Current wiki saysPlatinum 30; MPL and freshly retrieved NintendoAU stillsayDiamond. Wiki reports an official error correction, but AU marketing currently retains the wording. TV default qualifier remains single-source.
- `mario-rainbow-castle:phases:shop_swap` — Preserve passing versus purchase-only disagreement.

Complete numbered adjacency and exact gate/Star/physical shop coordinates, full event exhaustiveness, unrecorded prices/update boundaries, detailed reward distributions, RNG weights, tide cadence, patch-specific Buddy availability and live gameplay behavior remain unresolved where stated. Regional topology and current source figures are provided without guessing. Party-Planner Trek’s complete NPC/task catalog is outside the retained party-layout evidence and remains unverified.

CI checks closed schemas, references, all hashes and the documented strict exit 1. A green artifact check does not certify missing source corroboration or current Nintendo behavior. The observed exact latest-head run is linked in the PR description.
