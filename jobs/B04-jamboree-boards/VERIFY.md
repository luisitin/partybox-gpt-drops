# B04 — Verification

**Original research standard NOT_MET.** Keep PR18 draft: 100/518 complete factual rows have independent publisher agreement. All 16 complete type-count profiles use the original permitted CONFLICTS.md route. One current event retains unknown trigger/effect.

## Historical completed checks and commands, 2026-10-07

Python 3.12.14; jsonschema 4.26.0. Every check is deterministic, seed N/A. These checks validate retained data, citations, review receipts and integrity; they do not execute Nintendo gameplay.

From this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # expected exit 1
sha256sum -c SHA256SUMS.txt
```

| Test | Cases / passed | Seed | Exact command |
|---|---:|---|---|
| CLOSED_JSON_SCHEMAS | 50/50 | N/A | `python3 verify.py --structural` |
| UNIQUE_ID_COLLECTIONS | 26/26 | N/A | `python3 verify.py --structural` |
| SEVEN_BOARD_TWO_PUBLISHER_ROSTER | 7/7 | N/A | `python3 verify.py --structural` |
| EVERY_RECORDED_FACT_HAS_SOURCE | 518/518 | N/A | `python3 verify.py --structural` |
| FACT_QUOTATION_REFERENCES | 634/634 | N/A | `python3 verify.py --structural` |
| SHORT_QUOTE_BUDGETS_AND_LINEAGES | 24/24 | N/A | `python3 verify.py --structural` |
| EVERY_SOURCE_REOPENED_A_B | 44/44 | N/A | `python3 verify.py --structural` |
| QUOTATIONS_RECOVERED_BOTH_PASSES | 728/728 | N/A | `python3 verify.py --structural` |
| SOURCE_CAPTURE_REPORT_REFERENCES | 44/44 | N/A | `python3 verify.py --structural` |
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
| REVIEWED_ROW_CONTENT_FINGERPRINTS | 593/593 | N/A | `python3 verify.py --structural` |
| BOARD_DOCUMENT_REQUIRED_SECTIONS | 7/7 | N/A | `python3 verify.py --structural` |
| ALL_FACTUAL_CONFLICTS_PRESERVED | 9/9 | N/A | `python3 verify.py --structural` |
| DELIBERATE_REJECTION_FIXTURES | 14/14 | N/A | `python3 verify.py --structural` |
| FILE_SIZE_LIMIT | 70/70 | N/A | `python3 verify.py --structural` |
| SHA256_MANIFEST | 69/69 | N/A | `python3 verify.py --structural --checksums` |
| Separate final manifest processes | 69/69, repeated twice | N/A | `sha256sum -c SHA256SUMS.txt` |

Actual structural run: 24/24 suites, 5,338/5,338 cases, exit 0. Fourteen meaningful invalid fixtures are rejected, including malformed reviewed-row hashes and a changed Star price after its recorded review. All 70 delivery files, including the own workflow and manifest, are below 30,000,000 bytes.
Final complete manifest run: 25/25 suites, 5,407/5,407 cases, exit 0. All 69 manifest entries also pass two separate sha256sum processes.

The strict command completes with expected exit 1: full facts 31/518 FAIL; known current event trigger/effect 37/38 FAIL. Numbered maps remain descriptive provenance; the original request permits sourced map descriptions as best sources allow. No additional human-review or gameplay-build gate is introduced.

## Historical actual validator output, 2026-10-07

```text
$ python3 verify.py --structural
PASS CLOSED_JSON_SCHEMAS: 50/50
PASS UNIQUE_ID_COLLECTIONS: 26/26
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 634/634
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 24/24
PASS EVERY_SOURCE_REOPENED_A_B: 44/44
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 728/728
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 44/44
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 9/9
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 70/70
STRUCTURAL_RESULT=PASS; suites=24; cases=5338; seed=N/A (deterministic)
EXIT_CODE=0

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 50/50
PASS UNIQUE_ID_COLLECTIONS: 26/26
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 634/634
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 24/24
PASS EVERY_SOURCE_REOPENED_A_B: 44/44
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 728/728
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 44/44
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 9/9
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 70/70
STRUCTURAL_RESULT=PASS; suites=24; cases=5338; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=31/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT_CODE=1

$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 50/50
PASS UNIQUE_ID_COLLECTIONS: 26/26
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 634/634
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 24/24
PASS EVERY_SOURCE_REOPENED_A_B: 44/44
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 728/728
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 44/44
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 9/9
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 70/70
PASS SHA256_MANIFEST: 69/69
STRUCTURAL_RESULT=PASS; suites=25; cases=5407; seed=N/A (deterministic)
EXIT_CODE=0
```

## Historical full second-pass evidence, 2026-10-07

Both fresh passes reopened all 22 retained publisher URLs and recovered all 364 registered short quotations: 728 recoveries across 44 capture records. Each capture records its actual UTC retrieval time, URL, exact excerpts and retrieved-markdown SHA-256. Exa may be cached; tool reopening is not a claim of direct origin freshness. See reports/source-reopen-audit.json.

All 176 type-count rows and 215 inventory rows were compared against the exact freshly retrieved source cells and qualifiers in both passes: 391 rows and 782 comparisons. reports/context-checks.json retains each observed normalized value; table comparison does not add a publisher.

All ten original map-image URLs were fetched and visually reviewed in both fresh passes, with 20 actual native HTTP 200 responses. All current A/B pairs are byte-identical. The earlier Wiggler JPEG representation change is preserved with both former hashes in CONFLICTS.md and the prior commit; identical current bytes establish no installed game version. Images are not republished.

All 593 retained rows were reviewed in both passes: 518 factual rows, seven board records, seven regional map descriptions, 16 count profiles, 35 inventory profiles and ten map assets. Both passes use the same assistant. Each recorded canonical content hash binds the reviewed row to its current data; later edits invalidate the review. The historical row log follows. Current reports/research-row-audit.json supersedes only the specifically changed rows with dated scoped fingerprints; this old static table is not a claim that every retained source was reread today.

| Row | Pass A | Pass B | Reviewed content SHA-256 |
|---|---|---|---|
| mega-wiggler-tree-party:presence | corroborated | corroborated | b1c373a1614fab145ec650b590baffbd18dc5c05763349d649df1b823f815089 |
| mega-wiggler-tree-party:space:baseline_party:start | single_source | single_source | 1a07783b2b10c5e7273a0ec1482f727b52bd296fe981d26b220fd074b350a94f |
| mega-wiggler-tree-party:space:baseline_party:blue | single_source | single_source | e3639e82003bc541fb7d4a54a3227c1e91c5f64185b76a6d86c45b17e831c730 |
| mega-wiggler-tree-party:space:baseline_party:red | single_source | single_source | c81aadffb027996c4a60d144b9aeed49737f81409f2ccf14b2945a953ff2fb4b |
| mega-wiggler-tree-party:space:baseline_party:event | single_source | single_source | 4d78666b4fdbf4e3c70c32ec724d8cee0572bd56a7d0e9a499b10270c33e9be3 |
| mega-wiggler-tree-party:space:baseline_party:chance_time | single_source | single_source | 50d9e203e6119f485c8c75e7d771a348a41bda5a723f5b7c5afb75ed081be269 |
| mega-wiggler-tree-party:space:baseline_party:item | single_source | single_source | 49011e8925f1c068873056ffa67b095ee5204dca2c0d1d58a4c8ee4ebe7ee8aa |
| mega-wiggler-tree-party:space:baseline_party:vs | single_source | single_source | 727ce658949640287be323576b30798c3f3b7226a86466f428bf0caf26098434 |
| mega-wiggler-tree-party:space:baseline_party:rally | single_source | single_source | f30f63c3427b63119c7888878ea044b20de7e9ba47062a3355dfb8c62f92eebc |
| mega-wiggler-tree-party:space:baseline_party:lucky | single_source | single_source | d5239d0e36534da8e350b9c017c3a614d586eb459ac9b6f743a5edab90a39d62 |
| mega-wiggler-tree-party:space:baseline_party:unlucky | single_source | single_source | 58cc995d29fc2709535758e347fb1638a0ff349119922f05480177de8a41121e |
| mega-wiggler-tree-party:space:baseline_party:bowser | single_source | single_source | c64fcdfc704344b6040942271465525729cc6f49922324f4ed949ae022bd932b |
| mega-wiggler-tree-party:space:tv_tag_team:start | single_source | single_source | a58edf74ac95b01d5ae8601c42fa0eb45250ac7b655c4e186f330da955f0e280 |
| mega-wiggler-tree-party:space:tv_tag_team:blue | single_source | single_source | 6141690f59fd2adfe10e22c306c100b0196b3798510e01ed0f82cbe9ca0ab56e |
| mega-wiggler-tree-party:space:tv_tag_team:red | single_source | single_source | 2947f14a18f405c294f20394b2cd2feda5e70aba8f6da600f869491cf311c706 |
| mega-wiggler-tree-party:space:tv_tag_team:event | single_source | single_source | 71e29ba9cb23cddc3b357e87ca00c1c34dfa41fc5b2b4d2302dc9073f4c769ff |
| mega-wiggler-tree-party:space:tv_tag_team:chance_time | single_source | single_source | 52f03c98d9a963ce57599831a24020969fcd6e13a5c5236d18b1ad7152fb1390 |
| mega-wiggler-tree-party:space:tv_tag_team:item | single_source | single_source | 8c7021534bea447765591f43e31aa1d487fdc96cc051365a31bc09cd6a10b17e |
| mega-wiggler-tree-party:space:tv_tag_team:vs | single_source | single_source | 978a2959c18b3de016794c407aa4e55961960fee541ff17353435f57fdd47cfc |
| mega-wiggler-tree-party:space:tv_tag_team:rally | single_source | single_source | 95743dce8e2b6ffd1c945707c5e69d45bdb34d51c18967568f4e7ff87191ff4a |
| mega-wiggler-tree-party:space:tv_tag_team:lucky | single_source | single_source | 4dcca211ff7bcc91f5bd1df36bb5b986634260b3a90cd7e668fa33b4201d0bcc |
| mega-wiggler-tree-party:space:tv_tag_team:unlucky | single_source | single_source | 32ad610f4401d372d31d7d231f0f3b6d9cefdcf3ae4201f9fb213ef3cb9ce05e |
| mega-wiggler-tree-party:space:tv_tag_team:bowser | single_source | single_source | 23f82b2308b8614ed2b0f86018512cf250fdc203e52e749997c047435f2ae240 |
| mega-wiggler-tree-party:space:baseline_party_angry:start | single_source | single_source | a90a0953e8d471f447b5adab81820e97569d37271a7bfdd8d5778588a5dd5697 |
| mega-wiggler-tree-party:space:baseline_party_angry:blue | single_source | single_source | 208697048035b29fd037e80771763d4ca4734e1854fb35e6a0ed066f96905b2b |
| mega-wiggler-tree-party:space:baseline_party_angry:red | single_source | single_source | 970aacbc0b1165d8a92a31b812d9af6d14e6056d2d048a41db2dc4a68e70f65c |
| mega-wiggler-tree-party:space:baseline_party_angry:event | single_source | single_source | 3943fac177375ed128649e275997f7f24e6ef1b598c742f1e67d39e0f1541133 |
| mega-wiggler-tree-party:space:baseline_party_angry:chance_time | single_source | single_source | a78c3e8526727f6c159597c10c37e4065e04831d903cdad80cd587b9ffdd7300 |
| mega-wiggler-tree-party:space:baseline_party_angry:item | single_source | single_source | ee71c8e5e3e8aab5e5638309f64c841fc91d3c5b31e3983d11c66b271e3c28fa |
| mega-wiggler-tree-party:space:baseline_party_angry:vs | single_source | single_source | b17406132ab38cd9fe422f7143c73426bdf031ea8c37d01835eedbb22d4e73ee |
| mega-wiggler-tree-party:space:baseline_party_angry:rally | single_source | single_source | 2bd4ec9596f674f926556fb55813d36db7afc5f279207f2148421e52b3d4e3b5 |
| mega-wiggler-tree-party:space:baseline_party_angry:lucky | single_source | single_source | ac135cbb5010610155fcf3484b6d1ac40ffa75dff9369ad47cd00dd523e8ed6e |
| mega-wiggler-tree-party:space:baseline_party_angry:unlucky | single_source | single_source | ba1cb2134e7208ef423681f4e90c7698ecacc7dbfa0d4e13c4886711ea32aeb6 |
| mega-wiggler-tree-party:space:baseline_party_angry:bowser | single_source | single_source | c746c046fa00a8e570ce40225bd9779fb41c5f62ca58b330c83dc00698da19cd |
| mega-wiggler-tree-party:space:tv_tag_team_angry:start | single_source | single_source | a643f689774ce57611af899e9e7f474529eeefe8d90964d50f4319025ab13f88 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:blue | single_source | single_source | 6e3caf3933a8593b984ba71f1f92ae5ab4268f1369feb0d636fa282e59231b8b |
| mega-wiggler-tree-party:space:tv_tag_team_angry:red | single_source | single_source | e78eb9b4e54895056e64d95d5a800b5847c43b9a3c8dcc44a0821e7c8efbd574 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:event | single_source | single_source | 84a707900ba6dad686e8fd8bf29134f4e969efcdb721d9cce4b4fb672566725e |
| mega-wiggler-tree-party:space:tv_tag_team_angry:chance_time | single_source | single_source | 843aa88c227b0b67c27e37b292cf3f92795b5bd4e475c99e8d2e2f0a7c83ecd9 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:item | single_source | single_source | 252f310f6b3cb616e887dcd8f9032136d38ee1c39dccf51820ca3efcf25b3865 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:vs | single_source | single_source | fe5a529d576d3be94f0dbc7f449fd1bed3b75115a887c42de11aa9da75710b88 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:rally | single_source | single_source | 939d63f6143d73d70996d9363cd4dc2bbd1a367fd058cdd1508f41a5c35f8950 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:lucky | single_source | single_source | 201dae293d4491295ae9135bcdb08aff7cfcd71b7c3ea5c1228bab0dd59ff049 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:unlucky | single_source | single_source | 6cf184431b5b9d05573f073744262e783dce4d2178cd956a22d53ceef8f435c8 |
| mega-wiggler-tree-party:space:tv_tag_team_angry:bowser | single_source | single_source | 4b66f05e10d4cfc2d9320289af68e2c079d5ad58b5d2a92e991ebc574fb57b19 |
| mega-wiggler-tree-party:stars:purchase | single_source | single_source | d0987a6b820f4305034ee50fc2279a67be10532de37548022c1e7932c8e53021 |
| mega-wiggler-tree-party:shop:0:item:0 | single_source | single_source | 900a20e249f9b598dcf747a1b0d295a16b022954c3c4f4ce2fb6de703864289e |
| mega-wiggler-tree-party:shop:0:item:1 | single_source | single_source | bd04fb40dfaeb7dd429fe4bae3b01dfe9cfadfff1eddafca1caf35008f29abd6 |
| mega-wiggler-tree-party:shop:0:item:2 | single_source | single_source | 1fac154ce3339ac0e50853efd3557edd3acf964f267173625c2b0d3c5dd5ff23 |
| mega-wiggler-tree-party:shop:0:item:3 | single_source | single_source | cd6caeef55cf2ddb0a5f33874dae6399f54fc4973424fcfdbde48bedab597680 |
| mega-wiggler-tree-party:shop:0:item:4 | single_source | single_source | ccb1bf9df2505ed0195f5df0e746fa08796a50b4ff756e850b8c138861e53f7c |
| mega-wiggler-tree-party:shop:0:item:5 | single_source | single_source | f28d70f3510db4320bf6cec9c21428277de598b6bab1af152f47d4a655545838 |
| mega-wiggler-tree-party:shop:0:item:6 | single_source | single_source | 42695e6f1619af2ae4651a598bdc520133111e78dfd8a7e27cbbb7810d4b76df |
| mega-wiggler-tree-party:shop:1:item:0 | single_source | single_source | e8cf243e856112bdc7f43d19f2685995322b0675c32c73e65bf216c459d5d17a |
| mega-wiggler-tree-party:shop:1:item:1 | single_source | single_source | 972643ddbe86fec0cbab3265852a81a1d9a4b58832e7cdcfbb1f3b33a984e13e |
| mega-wiggler-tree-party:shop:1:item:2 | single_source | single_source | 59e6f73175297310674865bafbf9b503597e6f9e0e624ea5821063fab4fdd9c4 |
| mega-wiggler-tree-party:shop:1:item:3 | single_source | single_source | a06c36f6547c3a07f5a7636e66a2e1ff1b1afa0004620590daca2e6353b77608 |
| mega-wiggler-tree-party:shop:1:item:4 | single_source | single_source | fe399feaf1186bee4d7821e4eac833d1fe818e9e30b89b7bbfacc42f849a6d2b |
| mega-wiggler-tree-party:shop:2:item:0 | single_source | single_source | e00a82454f57db3a7c970077a29120e0ac82b2dee6e4bcd3c5afc0289dc1a217 |
| mega-wiggler-tree-party:shop:2:item:1 | single_source | single_source | 2af381923fcef49dd6d61a7f686aac33d435dee3a8a8470ff0e7234f25e98115 |
| mega-wiggler-tree-party:shop:2:item:2 | single_source | single_source | 87c126a1201c21f9cc789831c06fcbd155721d4853ea8b4e3a35a970904c45f6 |
| mega-wiggler-tree-party:shop:2:item:3 | single_source | single_source | c5c9ba58280d589b3f6206f3bc73d24a4c69108ea9a7683615868ece43a89524 |
| mega-wiggler-tree-party:shop:2:item:4 | single_source | single_source | 7f449fa85409579e097bd62fd3a3332fccfc9c6b9dfa664d6477e2d76a8c7be5 |
| mega-wiggler-tree-party:shop:2:item:5 | single_source | single_source | 6bddb36ed9d40fcf4c224dbfd89a35836b2c6e08f849d7d991cc75175e4605d5 |
| mega-wiggler-tree-party:shop:3:item:0 | single_source | single_source | 4c88a96dd091ba2112c0114a3fa59a5a4e17651e8ac4e31f374c86e1b958b727 |
| mega-wiggler-tree-party:shop:3:item:1 | single_source | single_source | c3a4f646c12bb2da411a398a9ac81adec40eee3be036e3a080860c86fcca708b |
| mega-wiggler-tree-party:shop:3:item:2 | single_source | single_source | 081d903aeffb59d0d9292b02bad24a4f928f6bb40cc8d01add54d4f40a7f8c53 |
| mega-wiggler-tree-party:shop:3:item:3 | single_source | single_source | 0411b52f34590f7d387c4d414548d340d101e94ad2cbea2b93875f2e1209eb1e |
| mega-wiggler-tree-party:shop:3:item:4 | single_source | single_source | a6bbdfb02bc21dcde2fd14fd065604e2c709954b8917f177454d818e6297fa58 |
| mega-wiggler-tree-party:events:bell_move | corroborated | corroborated | f4463dbb7655d6215164f533c6901ba31769f9b0b0e7f9b23d6204cefca7b0ee |
| mega-wiggler-tree-party:events:plant | single_source | single_source | ed08813792473c99d8895a383fcc91985b2758ee912c82373e95c683f43714ce |
| mega-wiggler-tree-party:events:honey | single_source | single_source | fb1b521ef0919ad6d146df8391990c1c75c575a33b414d39c328e68f3195cf8f |
| mega-wiggler-tree-party:phases:anger | conflict | conflict | 533a17689e0fa17c057947e18e566fbab2a01e92a25fc5e843825a750b674f58 |
| mega-wiggler-tree-party:homestretch:preserved_back_spaces | single_source | single_source | 5545dea90c64058da3e130e1c0f8667b29e8259e88b33f7b0ffd3eddfe9da10b |
| mega-wiggler-tree-party:map_link:variable_bridge | single_source | single_source | c17529a23d30d1dcab33923ad6b2f71f45df89c2725ec07addc551296130cc7f |
| rainbow-galleria:presence | corroborated | corroborated | 5dbeedaf16a3f97c6e460977bc48f1320800c6305bb9a24546559e006aab0f5f |
| rainbow-galleria:space:baseline_party:start | single_source | single_source | 46272225332e75094ef11158fa2344cbe3f9f6ad8b8c02478990f4f156fca60d |
| rainbow-galleria:space:baseline_party:blue | single_source | single_source | 960b828ac218d92e98253a6d036a0f8fa1317226d2998ce1f187ad352bf9004d |
| rainbow-galleria:space:baseline_party:red | single_source | single_source | 99639ef856857f1eb2c9b1bcfb782e39e27dd60ee41c5da62f2e97905d316a32 |
| rainbow-galleria:space:baseline_party:event | single_source | single_source | a1b57869e6aec2baef44186d6280691860e7b5b8874517852253615bd5533b22 |
| rainbow-galleria:space:baseline_party:chance_time | single_source | single_source | 8083529e1a959f4d6961635d05b31a9938565438fb9e24e5877ec87884606f2e |
| rainbow-galleria:space:baseline_party:item | single_source | single_source | 57c1f7754905e4f16cc9def02314a54a34572294d4f654a8835458297a5b6732 |
| rainbow-galleria:space:baseline_party:vs | single_source | single_source | 5b05d15e64c31e7f22ff1bf57644c0fd2fea7fc03ade110236b19513bbb47593 |
| rainbow-galleria:space:baseline_party:rally | single_source | single_source | 00b082a78246c4fae12eebca6e75527d6daf56e4fbec2b4380767c7f51533f82 |
| rainbow-galleria:space:baseline_party:lucky | single_source | single_source | ae448f8ff41885384fc47773c706ecd71ac42ca4b0f8eff5a4642b572473b32c |
| rainbow-galleria:space:baseline_party:unlucky | single_source | single_source | e42ff620b4a8c15727f68877bbe726dfb91b3fdd4a440e8d0cbb5f9c9faa42c7 |
| rainbow-galleria:space:baseline_party:bowser | single_source | single_source | 7c588aa5ae0a00362a25ff345729cab46ee614e30d6c0898237a380b4f6aa724 |
| rainbow-galleria:space:tv_tag_team:start | single_source | single_source | 036ec56a5b1558340736257d3c8597944f48b1989e87045d7b379b7d53f53ccd |
| rainbow-galleria:space:tv_tag_team:blue | single_source | single_source | e0ee35d51dc097e6af0f50dab8e665c03d7f4921831643d82ecbaeab98b7e11f |
| rainbow-galleria:space:tv_tag_team:red | single_source | single_source | 1fa6fc077e1f22e90e6c28e198122c974b24f567f3b98453fd8841d56e911f38 |
| rainbow-galleria:space:tv_tag_team:event | single_source | single_source | 3f943d05614d8574c1e53bec0e84f2d9c27e3c7bc403c0cfa4f90bebb777d529 |
| rainbow-galleria:space:tv_tag_team:chance_time | single_source | single_source | 4c5ea2dd5d51cda6f471e46d26c52cc6f7d6f634f2fe92f568413d630f66a9b9 |
| rainbow-galleria:space:tv_tag_team:item | single_source | single_source | 879fbcb7587abd6eefc2c1a209f4784e7c9cee625702c0317e05e045ebdfaca6 |
| rainbow-galleria:space:tv_tag_team:vs | single_source | single_source | 5182b3f5fed47ed617723ef89967e4f28ffa3cec52849a1acfa667d71c245ac8 |
| rainbow-galleria:space:tv_tag_team:rally | single_source | single_source | 3daf480181010476112b0b536f7c2064fbb3531b054ca0839be435c496473f34 |
| rainbow-galleria:space:tv_tag_team:lucky | single_source | single_source | 61957bcc4b6fddff2b3be5487396827605c5038928a5b5b15c7336e27027fa7a |
| rainbow-galleria:space:tv_tag_team:unlucky | single_source | single_source | 28849a36947d0dcbcbe9be7f255a10afa2d934af3d1c613ad712e0e51b3bcdd2 |
| rainbow-galleria:space:tv_tag_team:bowser | single_source | single_source | ab196f9cd7646475658f00253deb2cd3f958faf7eabfa3e9752abf8c41fa48ff |
| rainbow-galleria:stars:purchase | single_source | single_source | f74b8fe196ada77a89a1b9f426fcd90e3036413eb0438739369f85d77a98d9c5 |
| rainbow-galleria:shop:0:location | single_source | single_source | 6a088956b5634e9da3a7fa80a3d478e39b2b100e58f9015042990417afe848a0 |
| rainbow-galleria:shop:0:item:0 | single_source | single_source | 7ad58aff38568edd836ef2f29ca6561e8f888f68fbfb4711ba72bf57c4e556ac |
| rainbow-galleria:shop:0:item:1 | single_source | single_source | 753fbdf6566071735ddce8971e594e26e040d61705ab605c98f04dec9c112cc2 |
| rainbow-galleria:shop:0:item:2 | single_source | single_source | 29b891ff65c2873701d4f3dac17b4d8d1d20dee6218af8181690b25a22fee374 |
| rainbow-galleria:shop:0:item:3 | single_source | single_source | d63bcd90fa3e52d672159ca78084e89b20dbde24b7786b89b30eecb061d4532b |
| rainbow-galleria:shop:0:item:4 | conflict | conflict | 57a22da4091a2b7867943deb6470d4bf990cf4ad512291af109065ad61d8cbe3 |
| rainbow-galleria:shop:0:item:5 | single_source | single_source | 4479a24a439a6e6682a73c0207a2621caa353c0645253e9bf020cc080ec32b37 |
| rainbow-galleria:shop:0:item:6 | single_source | single_source | c3fd7638b6361f3bd2392578b27d32c0c079b201f7ced8830748443d4405ef07 |
| rainbow-galleria:shop:0:item:7 | single_source | single_source | 445e3f9c6b348212b17c24aabb4b4a9cb95281ea0bcc935db95fd4a62d5fbfa9 |
| rainbow-galleria:shop:1:location | single_source | single_source | 64e12010ca277c1fe1d26da9591f8a2abc4dd4a8eca30c91abb5aba596cc970f |
| rainbow-galleria:shop:1:item:0 | single_source | single_source | 1db2c272a5dcd1fe68eb719e78738758174ebe8b9e19acc636d102a69eccc498 |
| rainbow-galleria:shop:1:item:1 | single_source | single_source | f7e0a82948287409c601fe189ef4807baa862364ab826bb6e9dd5ba93ecfe35f |
| rainbow-galleria:shop:1:item:2 | single_source | single_source | 9c293bff7b5c594fcb0e17ae289761feefec162713f6a629f1962217bc158a89 |
| rainbow-galleria:shop:1:item:3 | single_source | single_source | e6cc57150f340621747fdcd24525bf70d1a676dad257c9ce27e8bcf4dde6659d |
| rainbow-galleria:shop:1:item:4 | single_source | single_source | 06c4b6fc77faab4ab351fd3b38d9f0e54f5e8989a6c0efc8297df6f4c37cd0c8 |
| rainbow-galleria:shop:1:item:5 | single_source | single_source | 9987931f1b0352994faac70e0ea5def749b1dc969f69b13c799f42daf0fcd11e |
| rainbow-galleria:shop:2:location | single_source | single_source | b43acd18f594441d310ca987f2a29bf426f8066b1083f28b610519585159bd0a |
| rainbow-galleria:shop:2:item:0 | single_source | single_source | 7b7e1d1267b734f5b72495914b3057f379a068e3fab63741a0b528821ff46f66 |
| rainbow-galleria:shop:2:item:1 | single_source | single_source | 1338010fbc5d994f35cbbca476e20c73538d058d72cd05171ebf3f1e503994f1 |
| rainbow-galleria:shop:2:item:2 | single_source | single_source | 753a871ef6e4146b9ee8a26129bbd40bec7df61a4b0883fcf48b63b43310a809 |
| rainbow-galleria:shop:2:item:3 | single_source | single_source | edc3529b737bee6c15dbbbe0d523920d2c2d7a7db81140cb9fd1771ab4b21fc5 |
| rainbow-galleria:shop:3:location | single_source | single_source | 2495ab890d32a510ddfb288f66957266d3d588c1ce17be012f2675f1b503bf43 |
| rainbow-galleria:shop:3:item:0 | single_source | single_source | ef988af9a4ff9124b1832d1b2db8d9e3eb5feb07b6360a7da8b4457cd76cd167 |
| rainbow-galleria:shop:3:item:1 | single_source | single_source | 4380b30730dcd9e65325488f0f9266746b322e88118a1e6585925f8d96aa1b09 |
| rainbow-galleria:shop:3:item:2 | single_source | single_source | dc8b15bb91f79f891a40c03037d5d628a597a8faba8efd4924d0e704a1b08c28 |
| rainbow-galleria:shop:4:location | single_source | single_source | ef98c7917b689bc1ebdfbdae532c633d11d9379037df339f12b963a7f219683d |
| rainbow-galleria:shop:4:item:0 | single_source | single_source | 9522edc4aba84fcd0e22344eb86c47602a294b102f942f7f295def8d2747e7b5 |
| rainbow-galleria:shop:4:item:1 | single_source | single_source | ee6e1fcb18b7180e66b833eee50e7767584e6b693a79cfae2aea3f13499b91ec |
| rainbow-galleria:shop:4:item:2 | single_source | single_source | 6846a05611869f15b1fb41bf1a104a690604a6e2e036ef6c0b691ff830f29141 |
| rainbow-galleria:shop:4:item:3 | single_source | single_source | d79ab303ee786f1a1e676a5d5c34df105119d2f08ab457a9490453dc6bed54e9 |
| rainbow-galleria:shop:4:item:4 | single_source | single_source | a8061493387db45a80faeec9d01d99400090b71c76c37cfec5ed17b6432a1892 |
| rainbow-galleria:shop:5:location | single_source | single_source | 876d470617a41b988bce2be2aa42c264f271400a9a6e8cfd658557f876614beb |
| rainbow-galleria:shop:5:item:0 | single_source | single_source | 49f6fc30bb98d2d3bcf065ac3b7ccee505c999fffbfa65ee17f2ef111ab13ee9 |
| rainbow-galleria:shop:5:item:1 | single_source | single_source | f4b34f8af38e9a667605fac06473f82937c0a317b77f463eb88f6e0fd0a402dc |
| rainbow-galleria:shop:5:item:2 | single_source | single_source | faad35b31fb774081c65148ecd8381c56015635bf6ce4379c919e1f64936e93e |
| rainbow-galleria:shop:6:location | single_source | single_source | 03d949a757bfe24894d6314a87abd55c9f6c99fd7bf8a92ee3ec9da740002e94 |
| rainbow-galleria:shop:6:item:0 | single_source | single_source | f30193cc6a6a7e456b20f9398068815a207ccb71067cb60858780d6301689325 |
| rainbow-galleria:shop:6:item:1 | single_source | single_source | 81be193e999634f11015ad142e22b9c88eb1672e704c519a4a8bb788a329ca10 |
| rainbow-galleria:shop:6:item:2 | single_source | single_source | 9cd1fab5f37ff4e6a2a125617e7975876f075b88538699040120756d346b6283 |
| rainbow-galleria:shop:7:location | single_source | single_source | 682d01cef51b09af4024d464e5f32776d93970e7074c520f7e393fde938d1a63 |
| rainbow-galleria:shop:7:item:0 | single_source | single_source | ae9b610f97fd0079999d0a68c1434199a07f1b7edd7f1ec98b11ecb69d7ae711 |
| rainbow-galleria:gatesPaths:elevator | corroborated | corroborated | 3d46ea6453c6ef1e7502a4f448a79a0a696c00bf0cfc95b19f583b778f446de0 |
| rainbow-galleria:gatesPaths:escalators | corroborated | corroborated | 0578ff39e1dfed4ea366304f3019a17c86edc60520079524b88c085a3cc39cfc |
| rainbow-galleria:events:stamps | single_source | single_source | 6a593b720fa33e974f70f726020e31b24095deaa012a068a582bf61c0413929a |
| rainbow-galleria:events:last_place_shop | corroborated | corroborated | 479524b2a5fd4f268ca7af4971970587e380b9159f0bc2cbf7c94f38b2d7abab |
| rainbow-galleria:events:last_place_qualifiers | single_source | single_source | 86e573661474ed41064bb499c6a1e62cd13df4ecc79172516d87b9a09fad4e50 |
| rainbow-galleria:events:super_shop | single_source | single_source | bbd8705b4ef2627c1e37f1341092866df3f0a874166de0bffc025dcf4ed386a8 |
| rainbow-galleria:events:gold_shop | single_source | single_source | e706b8534870a57c4a7cc47ec58597379dbf2af7101509eb7da69dd279098c46 |
| rainbow-galleria:events:boo_shop | corroborated | corroborated | e3c4f24202c5b78ba4c942fbb4b91e1c04cd7ab1153faa56fc70cef5417a5eff |
| rainbow-galleria:events:thrift | corroborated | corroborated | 99c9d227fbfcbd2332043218e387088aafecc147293f614fcf5553013dfbff99 |
| rainbow-galleria:events:loadstone | conflict | conflict | f7dbeca10b7cb069376fa264f1ab82f7bcf9e69f3d6ec8c7a5fe6014238044ce |
| rainbow-galleria:events:raffle | single_source | single_source | 6892da6f60a3f83a5fde281cdcd0bb8078d767e485c9be036b6bbd6e5401b878 |
| rainbow-galleria:phases:stamp_color_labels | conflict | conflict | 7e2575a0b9fb2adb598e8351e45a33a52b5490da0535acbe570967314de11d7e |
| rainbow-galleria:phases:flash_sale | corroborated | corroborated | 208ff864f6bf0a035d4c67bf73e7fce272d801631fa6a16f15928b2e7e82949f |
| rainbow-galleria:phases:flash_qualifiers | single_source | single_source | b0e3598f74182f86bd34ec1883d767deb06cf917bc8ddac538681f169dd3ada1 |
| rainbow-galleria:phases:markup | corroborated | corroborated | 41dd8f153e4e0c4ee7006c95ca728f20993099c228a877be1d997a843cbc4fba |
| rainbow-galleria:phases:shop_closure_stock | single_source | single_source | 852e925cb58d82a17ea3069e65dbc17037647bab79f3daacb6f62b28bbdb08a9 |
| rainbow-galleria:phases:peach_daisy | conflict | conflict | 7336d82c139f8b1de0ba6d1530e55544056728195dd93479f2695266cb12d9a0 |
| rainbow-galleria:map_link:escalator_1_2 | corroborated | corroborated | db0b3f722838664e47cdeffd74f65664bdfa7d094706507f58d906f670efe1d8 |
| rainbow-galleria:map_link:escalator_2_3 | corroborated | corroborated | f65a3e26dbaa4948581a86a3fb4f842f3a7b11c4a41a12ae11762ae3d8bb4604 |
| rainbow-galleria:map_link:elevator | corroborated | corroborated | 853c8a2dcf6da98f6f32e3a424055f32b4a2888734ee539b52d926f635128c0a |
| goomba-lagoon:presence | corroborated | corroborated | ce9ce7910c65e57e9325cd6ceca399ffe2b571a39fb684421c2fb93b6f2da0d8 |
| goomba-lagoon:space:baseline_party:start | single_source | single_source | 090222adde8c131e50bd26aaaf9bbd25e110609098b3430df0111add939cf708 |
| goomba-lagoon:space:baseline_party:blue | single_source | single_source | c35e72950d0559d0033616a1886d70b8e207fc335f26594cec2453e2b4be07ee |
| goomba-lagoon:space:baseline_party:red | single_source | single_source | da0bbd499c466068cd15822fb76471c94faca7745c1c590004b9ea82503168ec |
| goomba-lagoon:space:baseline_party:event | single_source | single_source | 889d0b876a6527f809d0247937e85d745dfb579421a69aaa7e82f4f82d6bd4c7 |
| goomba-lagoon:space:baseline_party:chance_time | single_source | single_source | 1b107309bec0cd9df04450920d9fe72b6fa282ee36e92a8ce045934c51edf763 |
| goomba-lagoon:space:baseline_party:item | single_source | single_source | 23bc64d6130d144a00ce208cd8078462b6c58aeb1c09a9a548dcf405879aec88 |
| goomba-lagoon:space:baseline_party:vs | single_source | single_source | c0c8186efe30fb9c9f0eafe2061ba310a7e332e7c2f41722d1d47046fd7b274b |
| goomba-lagoon:space:baseline_party:rally | single_source | single_source | 751038d5967cbf2ca1f3e3b78ebc1080daa4fe3a778595e4f08bf8a2dce55e6e |
| goomba-lagoon:space:baseline_party:lucky | single_source | single_source | 71f3a3a2b5e528217c0167c17e46ef82ff9a5098fff63c9e94eceef8b4b494c3 |
| goomba-lagoon:space:baseline_party:unlucky | single_source | single_source | a3c1f10bae6bce27c1c8f75a1de87692d5c24d2c4f12d7b61722bed7ff198aab |
| goomba-lagoon:space:baseline_party:bowser | single_source | single_source | 9f7989c48c9068d94516b6d4062246533be1e317596603235e3a808e504b5a71 |
| goomba-lagoon:space:tv_tag_team:start | single_source | single_source | 823efa6c8b35ff43441c737e741d19cad62b8d29e6f13cfd0b278bd5dd5e7154 |
| goomba-lagoon:space:tv_tag_team:blue | single_source | single_source | 8a4b8836d786fc253ddd3491c7cfb91c1f4e5a0179df923762c08472c4bacbd2 |
| goomba-lagoon:space:tv_tag_team:red | single_source | single_source | 3c9b0f205651d1fd9c6aeff1e261a076c0e6ad58f47abaa65de7aa8a94e5cbcd |
| goomba-lagoon:space:tv_tag_team:event | single_source | single_source | 817e2b2940e0b44971c38644f4b4db9c3403477bef6aaf69e270d1803f387456 |
| goomba-lagoon:space:tv_tag_team:chance_time | single_source | single_source | 3d2bb92237e701b55860cce822545a05fae5c643ee5f320e4c30e88239eb7963 |
| goomba-lagoon:space:tv_tag_team:item | single_source | single_source | 8dd73a312f44051a72153302f4eaf6afa2f68814ec55f22bbc5d87b3f4436919 |
| goomba-lagoon:space:tv_tag_team:vs | single_source | single_source | f326a74940c53f81bd0c23e5b663b4297e96da32b97494c92d04b9d11410ee8a |
| goomba-lagoon:space:tv_tag_team:rally | single_source | single_source | 1443280884e16fa4dc14c76355a447c686c599820e35d3d2172f5ad20dde128b |
| goomba-lagoon:space:tv_tag_team:lucky | single_source | single_source | 129f4bd41dd9db745d46118d89bcb4bd87ced292bcf0144816cb2e0d682198d0 |
| goomba-lagoon:space:tv_tag_team:unlucky | single_source | single_source | 210cf9b4291c4a288b91a371eee89eefb540a30775ec3dc84003432f35c6fc89 |
| goomba-lagoon:space:tv_tag_team:bowser | single_source | single_source | 2c3a275f46e056af03193ff83bd94a16339c78a5f20c3285e2715b151a84374b |
| goomba-lagoon:stars:purchase | single_source | single_source | e715e2980b1ad40a6c4915cfda31ae39842f153c14ad8d35f14136ca058d5aa8 |
| goomba-lagoon:shop:0:item:0 | single_source | single_source | fa3a067bdeeb2a66d02b6c922f6eb3fde15090909b1f2e9026a81bb6f814ac3f |
| goomba-lagoon:shop:0:item:1 | single_source | single_source | 0c158e151bd39f15b03aca5a40864e9ef60b62e6f59adddebf0e0b9b73500e29 |
| goomba-lagoon:shop:0:item:2 | single_source | single_source | 0ca489ac072ec86bdf1aee8fbb7590375b5d1680a6705fedf82b826df53f3158 |
| goomba-lagoon:shop:0:item:3 | single_source | single_source | b2688b3cf54c47171e698dc22e05b467a90f2450ad8e20c74cd29d7390d67cf2 |
| goomba-lagoon:shop:0:item:4 | single_source | single_source | 2da98908eee97cf6aaaa80926c99974e280d3a1098ae99e7db1b413796d3fa43 |
| goomba-lagoon:shop:0:item:5 | single_source | single_source | 2cb3ea918ff72817cdb80b33fc85320d10509e611a8cfd8e21da18a4663934ec |
| goomba-lagoon:shop:0:item:6 | single_source | single_source | 87c55dc761aa2f5159ddaf0188a26b1d5ef895e43442d88337613d176745706e |
| goomba-lagoon:shop:0:item:7 | single_source | single_source | fca30b2f6535a4d9532bf28b402b1db0d7e8c28ce8ac2fbf1eed238b19b7596c |
| goomba-lagoon:shop:0:item:8 | single_source | single_source | 23b700c5ce50dcab1b342b8f950be85f86b8e1fc5091a86fe85fae12cdab0636 |
| goomba-lagoon:shop:1:item:0 | single_source | single_source | 9ce4e088a98d5270d50ca51c13a2781391f03c095de50bf908b7698c11305c6e |
| goomba-lagoon:shop:1:item:1 | single_source | single_source | 38045b7c9e11ddeb066a386b134164e3209f0cd66ca870b30727d6277fc9c837 |
| goomba-lagoon:shop:1:item:2 | single_source | single_source | df5e3f8c1d4061566a3385fecd804559ea4e66248251a0e1c04c35ba227c2314 |
| goomba-lagoon:shop:1:item:3 | single_source | single_source | 8afb36197ac3cf271caed53eb0fe94f8324531ca4904ef2f6a262fe035198096 |
| goomba-lagoon:shop:1:item:4 | single_source | single_source | 4489ba9a3c3700eb213fb6182ea9df6908d5c9061b6f9ba98217b4c68a9065ff |
| goomba-lagoon:shop:1:item:5 | single_source | single_source | ad9879ac252ddd4037eee7e0b16b6439915c322a57f971427f643e1991cb6715 |
| goomba-lagoon:shop:2:item:0 | single_source | single_source | 5084e309fbe1e642603382bb8c3f3e58a55947a174dfc8ba9b8a2abf90999151 |
| goomba-lagoon:shop:2:item:1 | single_source | single_source | 49d79c92a61af0b27efcd8b9dbd3e562da099168bed6a784f2f59f22c607f251 |
| goomba-lagoon:shop:2:item:2 | single_source | single_source | 398ae3feafc05a4cf8de0dd3059bf0f3d74d2d1d9f3f7c7163e58a3f6f1e91a3 |
| goomba-lagoon:shop:2:item:3 | single_source | single_source | d4b9562c9aba043bc1437f9bd68af64fcd5d9891a27ea5701676b85d8084a824 |
| goomba-lagoon:shop:2:item:4 | single_source | single_source | ec68ec2521822ec85d7b0bb96a3cfb60a269f78a137b17a8b4439e07ce66937e |
| goomba-lagoon:shop:2:item:5 | single_source | single_source | eead59a93af2578978ea0366e12d0362ea6ae2f52cab672178f4f80e51aec77b |
| goomba-lagoon:shop:2:item:6 | single_source | single_source | 6e523636656791c191e8a7ce1bbaa2073d99a88e9b4962ae27609920eed978fd |
| goomba-lagoon:shop:3:item:0 | single_source | single_source | 6ab5592627b6408d0a825501f29a2a3cca49b509823fa40c952676d5af43b596 |
| goomba-lagoon:shop:3:item:1 | single_source | single_source | 403b99c331b48f3a8a07fa89a6b7ca7cb999022134abc9ed0081ab40b414c855 |
| goomba-lagoon:shop:3:item:2 | single_source | single_source | a88a1ae93426a773066c33da0dad831ac2bb4075295d9cc2da60ab3e5d2d5cba |
| goomba-lagoon:shop:3:item:3 | single_source | single_source | 753c414622e8d036ff1390e9ee6fb32549b6889211142cf39523058f6f1e8951 |
| goomba-lagoon:shop:3:item:4 | single_source | single_source | e74ad08ceca685dfeb4533a20a78897c0531e254bc4001aae29d5e92a5bc143d |
| goomba-lagoon:shop:3:item:5 | single_source | single_source | 42ae48aff7bd0f37188e1698e06e8c67c4a7c73a867fbecc11c054e673ceec92 |
| goomba-lagoon:gatesPaths:tide_routes | corroborated | corroborated | 473f50d972f8305c4a836fc3ec3decda30c3a6f9ec32501aa9f01c97d6f4bf0d |
| goomba-lagoon:events:tide_event | single_source | single_source | 65aee962b2d552b0b73ea3c5bc0daa79e1a312993dc426699f5bfa3bc11a3b27 |
| goomba-lagoon:events:submerged_rescue | single_source | single_source | 0d9f1abb79fc5cc956fdadb07dcfe28ca15f4285216f84a2a0355ee8e303331e |
| goomba-lagoon:events:zipline | single_source | single_source | b303c2710ab401349fca6078090fbc7664b66b0997bc4b24c79b8111069ad25b |
| goomba-lagoon:events:chests | single_source | single_source | 861be46e378321b63165a28901783cd5be83d69f93215df4547226a63046c56e |
| goomba-lagoon:events:fishing | single_source | single_source | 2b46b446401daa5e4221dc79299710be2027561a7b50c721dd68076e447c76f1 |
| goomba-lagoon:events:eruption | conflict | conflict | 59506a6c2777c918383389539e4bf5fd40d651df4485064f53c89762cbd15aec |
| goomba-lagoon:phases:tides | conflict | conflict | b56b454427b19f7d9936fc4ca7b185b1920813128734b15a87c6f11a239098a2 |
| goomba-lagoon:phases:pro_chest | single_source | single_source | 595d8b0c1164144b67382a4770b4449f97beca41954725aba2cb3843c0d039f1 |
| goomba-lagoon:homestretch:submerged_retypes | single_source | single_source | c022be6ba380a9d6a0d47210764491fabbacb9aa9a59e4ad42294fbd0156e714 |
| goomba-lagoon:map_link:island_paths | corroborated | corroborated | e5d058901ca2254b14833d4f08ab40e76c353ca66977574b13795d2fcd30a44a |
| goomba-lagoon:map_link:zipline | single_source | single_source | 22b904a3c9965367f4ff986ed26cd5ca170c6c51f786f76e1a9afb74f936c6dc |
| roll-em-raceway:presence | corroborated | corroborated | fccf72a2c875e5407e73ccc9c9d0426daf0bc44818dad9c569c0ef5f2038ef98 |
| roll-em-raceway:space:baseline_party:start | single_source | single_source | 7fbaf6a7fbe8da7bcdaf8cabf5557c4f7a1709f250e87dc52697b2292dae5a10 |
| roll-em-raceway:space:baseline_party:blue | single_source | single_source | b390fd8dab410a9f67242a3650b8debbc9810890ea4c1fb75ac4859f4cf096b2 |
| roll-em-raceway:space:baseline_party:red | single_source | single_source | 96b52dcc1bc29b89a7270bce60c14cd2e6515c3d5f912aa36bc7cdeb909db09b |
| roll-em-raceway:space:baseline_party:event | single_source | single_source | 9cdbe3619831a1c3dea27d5ad2b65abd4efa87e4e750de8bd0e14c4cb8ed435f |
| roll-em-raceway:space:baseline_party:chance_time | single_source | single_source | 0126a541d049e77d4b191fd13894ce3563862717be8914d396378ccbb2840df1 |
| roll-em-raceway:space:baseline_party:item | single_source | single_source | 19f8ba0b35ccc464b9a3e038240b9931bb4c826c07ae54ae9ecd7c2e125b8407 |
| roll-em-raceway:space:baseline_party:vs | single_source | single_source | 6490f882b929d9a59b37df63b5bc42aef7619649e35692b6e72352ea289e03b1 |
| roll-em-raceway:space:baseline_party:rally | single_source | single_source | f9f9091081d7c1d2cb4fb03166fa4ca27155f14547c4a2e4ca767a0718ba75b5 |
| roll-em-raceway:space:baseline_party:lucky | single_source | single_source | ccccb2d23ab5d0a3ae9431e6edc052adb6a1b1dc5e9475b57fbdf393c3f8f1c4 |
| roll-em-raceway:space:baseline_party:unlucky | single_source | single_source | 12562ecd3daac52395d2b24c8503170d130355ff61353c6de2871200a74ebfe5 |
| roll-em-raceway:space:baseline_party:bowser | single_source | single_source | 099bd61dd4044796f882e6cfaf6cb5e757067f976860660cb415ac86f000b588 |
| roll-em-raceway:space:tv_tag_team:start | single_source | single_source | df6b30139e81ecd329e3569040fb48e4b1bddaccd014fdfc492b5345430a0d75 |
| roll-em-raceway:space:tv_tag_team:blue | single_source | single_source | 15827fb9762a6f16b4a87a8a59d5d66bd0f8f518bd6ce21d0efe2411f0797723 |
| roll-em-raceway:space:tv_tag_team:red | single_source | single_source | ef6fbb7d8dededb9b37b3ae1cd6113cd896c88d8b8e2af63eeef09b402a31658 |
| roll-em-raceway:space:tv_tag_team:event | single_source | single_source | a6059846c612a06498c91babb0162035d3e0064e6b24b6146c5078962e0532f7 |
| roll-em-raceway:space:tv_tag_team:chance_time | single_source | single_source | 9aa85d7754131586bb468e406824cbeda24dd649632456358c81ed9336496a4c |
| roll-em-raceway:space:tv_tag_team:item | single_source | single_source | 49202078ef659ff38e1b8532dd8f7c4ab4fd755774f6868d9aef042a15d34a0d |
| roll-em-raceway:space:tv_tag_team:vs | single_source | single_source | 78c977f6e74cdd4ab34f453a7301280666f2c9b71cf20a2aba17dbcf343ef2d6 |
| roll-em-raceway:space:tv_tag_team:rally | single_source | single_source | 1a4fbbed85142d158a9cd2fc2b6bfefa61d7f4133a4cff106153bcad2cf459c3 |
| roll-em-raceway:space:tv_tag_team:lucky | single_source | single_source | 012454becc1f9f9d4097ca09ab87983691c8dff99a89741cd45f78ef38f88891 |
| roll-em-raceway:space:tv_tag_team:unlucky | single_source | single_source | 3369e1a8cf38fdabd13b468e185954d9d4c0fb5728d4cde62063dd74a06ece63 |
| roll-em-raceway:space:tv_tag_team:bowser | single_source | single_source | 019cad56953543e25053788329bad04f1953c74c016dd61d7fe07cadd2e96dc7 |
| roll-em-raceway:stars:purchase | single_source | single_source | 7f8fac6842345221f8009ab95ff7928571a91494129ee20fead5b06c9af991f7 |
| roll-em-raceway:stars:alternating_qualifiers | single_source | single_source | 1c81931ecdb8fd9db922d2fbb30cb83902ffae44f8e14f1f9cd37d13358cc7a4 |
| roll-em-raceway:shop:0:item:0 | single_source | single_source | 0570f02ff15b5b4e68fe594bcbb9a4576e9f978afcecf476ca07fbed86860f87 |
| roll-em-raceway:shop:0:item:1 | single_source | single_source | 484e3591a1fb8722f420883ff985cb94ad30d8ae11117b8c7f57f9d12f92fc46 |
| roll-em-raceway:shop:0:item:2 | single_source | single_source | 474ddc89afb4d69f0594055c6509cb911681ce62db67fbeec2fcb084a66f9877 |
| roll-em-raceway:shop:0:item:3 | single_source | single_source | f882f18dbb6dd704dd9655abd2af1ec4dc511e59988620ce2ec95b34f9a2d9f9 |
| roll-em-raceway:shop:0:item:4 | single_source | single_source | 7ec4b487c6cf07666ca9255d0d246f68b4bf5643e3cf58931e85b0a4b61a9204 |
| roll-em-raceway:shop:0:item:5 | single_source | single_source | ff228b6cb959ca6f56c356a50768998d0e79f83f5a8a9778ee3184adede37306 |
| roll-em-raceway:shop:0:item:6 | single_source | single_source | 691c5ab63050511c891b77070c81da97c4438db1383e8788f94cd9f4e518f9eb |
| roll-em-raceway:shop:0:item:7 | single_source | single_source | ba82b500680c32ce45c33590c6b421a4a15d616f36b9af82622c6c427e0775c2 |
| roll-em-raceway:shop:0:item:8 | single_source | single_source | d1d6ed2167e290a173a19abce1b90251444244aae55d7b0fafd3348724581891 |
| roll-em-raceway:shop:1:item:0 | single_source | single_source | 14ddabf93e650010e9cfd8dc783f5e7985c1607d53ced2deef05f101a2f8ae1b |
| roll-em-raceway:shop:1:item:1 | single_source | single_source | e15cf21fa9ca26eef9344cb5ec2bc1ed3142961f64f0a18e7c6154e61bbafc27 |
| roll-em-raceway:shop:1:item:2 | single_source | single_source | d5d664a36434945318c361f6dbae76c8514ff7d0658d3f4c3d76d98927d2db67 |
| roll-em-raceway:shop:1:item:3 | single_source | single_source | 3669ec405851263caa7c5c893f9e9c6e456f8bedd739dcce4eed8c5f23c78bde |
| roll-em-raceway:shop:1:item:4 | single_source | single_source | 78c81bd2318afc5ab4c536148a353ba315287a0b4be565c2a09faa81aa10694c |
| roll-em-raceway:shop:1:item:5 | single_source | single_source | e778035b7c0182440b50ebac789ba54becf50a10d8f33201f844d1c2eb3fcec4 |
| roll-em-raceway:shop:2:item:0 | single_source | single_source | 41bb0e7283e176235961af394a3fdc627e19f9258ef313ff4289618501c5a43d |
| roll-em-raceway:shop:2:item:1 | single_source | single_source | 36b1b666229fb57ada198da54df18bd518339f09a976e4ed921970125f30b1cc |
| roll-em-raceway:shop:2:item:2 | single_source | single_source | e738849817662d8e41beb08ff7439dcc77678c822a760fcc57250ea0515fef91 |
| roll-em-raceway:shop:2:item:3 | single_source | single_source | 161c96b9a5cad77f832f2b5e359696d71804065cd5a8b98d58d44a4c3e1f1a5c |
| roll-em-raceway:shop:2:item:4 | single_source | single_source | 1592b4cfb1636cdd1a69ea07c4b9ba98b6efe4b4f3ed4cb7b9411f90bfdc4746 |
| roll-em-raceway:shop:2:item:5 | single_source | single_source | 0dfa0c58515f011d088f4c88528731e21c6ceab61c7182e9b12718715c941993 |
| roll-em-raceway:shop:2:item:6 | single_source | single_source | be09423f8161538fdd5bf976236536ec3eaa3a7238cc5cde901f702760e1c597 |
| roll-em-raceway:shop:2:item:7 | single_source | single_source | b1772ccf916770bc7a67814649fd72b239d971246c858acbe4e0711ff925e287 |
| roll-em-raceway:shop:3:item:0 | single_source | single_source | 30146cf375b456040a0d56d631e5ea991ed9d6e4b1d5b0c41f1823e7a7e2877d |
| roll-em-raceway:shop:3:item:1 | single_source | single_source | bb0d8e011c13934ac41b3be8d8b6d4e6c9b2810dea44373b571c80eb2ad24b75 |
| roll-em-raceway:shop:3:item:2 | single_source | single_source | f2a1d4faa69cc97f4df13df9a5df4c573f957b3df4363432d3678f9d33517511 |
| roll-em-raceway:shop:3:item:3 | single_source | single_source | 4ed29063eee5f381288ef156cc345b0b4f02474f0d9f783b2267ca2ad0a93517 |
| roll-em-raceway:shop:3:item:4 | single_source | single_source | 2b8600a37ee2eb063d24f2a81185d5f3d34f00c49a760395f1c134d922ca51c1 |
| roll-em-raceway:shop:3:item:5 | single_source | single_source | c1a07908a1104d40dd6f83b43899529c40daa712535358447b70dfd5f151d1f2 |
| roll-em-raceway:events:runaway | single_source | single_source | 6c83dbc7c3f5b1434a100bb302c5ef65b2a5a43b3631dad78bd326c12028e51e |
| roll-em-raceway:events:jump_pad | single_source | single_source | e1753f134363134c3f3af00d7309b2dc748678a7b864209fee06df3dbe6cd7c2 |
| roll-em-raceway:events:swap | single_source | single_source | af861650d4baee7ca5a0ae8eaecb8536118fd85f71aaa13beb7d3815108a2012 |
| roll-em-raceway:events:dice_stop | corroborated | corroborated | a4b71a46dfe140c8e0c582ad3391f5850745a68e11f6ab2d09953d9e44a401eb |
| roll-em-raceway:events:laps | single_source | single_source | 0ec223aafd6e80ad2615cb80c2b4e93ce09de8c63593ac4483b86f283520071d |
| roll-em-raceway:phases:dice_pool | single_source | single_source | 72798989bf774b2359d87e4796afc606c7d94e3f4d1146d455a97b6939b9e30f |
| roll-em-raceway:phases:turbo | single_source | single_source | 06d8201314fed5b65b53937bfafd8fbd83620306b79a4c055dd0beb1220b1235 |
| roll-em-raceway:phases:creepy_availability | single_source | single_source | e189a3ff6e4ab7b432e8a41114b4a462d81ead7792bcf5548166af42ed1b6546 |
| roll-em-raceway:phases:shop_count_scope | single_source | single_source | d98d4b11988686addb65c82be417ed2ae0cffedd2af9595c18b0e4019a649800 |
| roll-em-raceway:map_link:pad | single_source | single_source | f397e91c00301eb0b5fbff4c478afc3513367c3cb13b660659784b0d9dba1eb8 |
| king-bowser-keep:presence | corroborated | corroborated | 9cd9ebb9bf9d367f56ecf029de6129fcc7bb6ff66bb1ffa91d3ef2f288c1361f |
| king-bowser-keep:space:baseline_party:start | single_source | single_source | 39396e5b52b9b63c074a1e06d3981a8cc4772b8bdaff740639e4e598e85cf5a3 |
| king-bowser-keep:space:baseline_party:blue | single_source | single_source | 372362fd24fab4c9a1dd82ce0ec9dfdd874117d0afc3995aeec8d8d7a1b8fd43 |
| king-bowser-keep:space:baseline_party:red | single_source | single_source | 9afd91ee9d223fc29374b60c27ff5b0519eb7eef07c3ce0a7280252f5c2af9d3 |
| king-bowser-keep:space:baseline_party:event | single_source | single_source | 40e62877c5197a6fb7aa45c13f14e81f7ff53fa25458f14ef9ac8bc4cd60168b |
| king-bowser-keep:space:baseline_party:chance_time | single_source | single_source | ed4e4abe587efd26a2fc118f39ab7d07788170c8c20ba916c7815fab0df91cd4 |
| king-bowser-keep:space:baseline_party:item | single_source | single_source | e879746d44e5a9cd2f71cc163581384d9098a4ea1aac2139afa230a0c13a5af8 |
| king-bowser-keep:space:baseline_party:vs | single_source | single_source | c35bc63032908026c0ff99a50a24619181794017a972a6103673d66c8133db11 |
| king-bowser-keep:space:baseline_party:rally | single_source | single_source | c8ad5168fdc9212993c9b154a9ab6274067945874924fb3e84534457df424d8b |
| king-bowser-keep:space:baseline_party:lucky | single_source | single_source | 7b04ebd957d9b57a8c2e9c3c42933541d4092638bf5f7d6303eb3021990b7274 |
| king-bowser-keep:space:baseline_party:unlucky | single_source | single_source | 168ef2952350527ae9db3d552cfcc56f10f247b0d5adbb64a82ad7a2225d0626 |
| king-bowser-keep:space:baseline_party:bowser | single_source | single_source | b49b5f392749119ad38bdf3e0e3b6dbb9ba6eaf074e359a5fd87cda75b11b1df |
| king-bowser-keep:space:tv_tag_team:start | single_source | single_source | 2350520afa64b593736add7638c14dca941194657f8cd2ce6c3ba8834b0ed53d |
| king-bowser-keep:space:tv_tag_team:blue | single_source | single_source | cbb755a33d5ae65d0e9cf308060488306f301e6aa788c8824ebdb79a8365f126 |
| king-bowser-keep:space:tv_tag_team:red | single_source | single_source | ac779b5aeb2d8ec7f6348d62020d6d4e5ccdf0bc475698e3345858d54a9e99e4 |
| king-bowser-keep:space:tv_tag_team:event | single_source | single_source | 1f555a5d89fee622e074dd8567a8d68da1d1040dcf44853d7df7216f7bf53faa |
| king-bowser-keep:space:tv_tag_team:chance_time | single_source | single_source | a49682689d98d1e36714d4bcfb162a06f17703616729b9fe413605146874c77a |
| king-bowser-keep:space:tv_tag_team:item | single_source | single_source | 8d14bbb23acfd798e5a2ba3ed72a0fdb1de52a0c5739c942bf5b580927de9187 |
| king-bowser-keep:space:tv_tag_team:vs | single_source | single_source | 42f2562a7b5d0ed9898753c77ebdabc44ea0b1c9cee8a8c6ef138df189e5a23d |
| king-bowser-keep:space:tv_tag_team:rally | single_source | single_source | a3ac39bbfb6920e423d06ddf212c01aa66fee024be2969c38217e14bca289313 |
| king-bowser-keep:space:tv_tag_team:lucky | single_source | single_source | 55a8f82ee1445d4064c6843e440620ea18d322145abe9a5759ced9facf3730b0 |
| king-bowser-keep:space:tv_tag_team:unlucky | single_source | single_source | c2739406dcd838c49337c75a7d67cb9e63ff58de2d12cbf4a94c6c004a4366f2 |
| king-bowser-keep:space:tv_tag_team:bowser | single_source | single_source | 65a5c7eb9fd72e89f4e3261c99e0964dfc9acc3ff0a5d1b842e7f920026e9135 |
| king-bowser-keep:stars:purchase | single_source | single_source | 0af053f3137559c5565ba6af58453cafd15cae34ef88ca61c4833c3f5d1448a6 |
| king-bowser-keep:shop:0:item:0 | single_source | single_source | ff5f9c5ea11fd6d465e075968103d90d0b114f9ca9387e0cbbd17963520bd8ac |
| king-bowser-keep:shop:0:item:1 | single_source | single_source | 61a58557ef3015b4710abf78eaa1324ff04c9afc42f5b380db529df500a4ef3e |
| king-bowser-keep:shop:0:item:2 | single_source | single_source | 1ec191279238caa597598735fa45f22925bcf9aa82d88210cbea5702d2cebb2a |
| king-bowser-keep:shop:0:item:3 | single_source | single_source | e0a8d1e1bea4c5e3c96466cdc69d8b953e7addf7ecd7dd5284cf15fc04c3a83c |
| king-bowser-keep:shop:0:item:4 | single_source | single_source | 849969099e97393244fadd2fe1ffa88e78d6f8d3a419e44ef6576097b1fc836c |
| king-bowser-keep:shop:0:item:5 | single_source | single_source | 968df5868c497f9b0dcf749fa2c22aaf109520e83200fc01b20bef34b7e237a4 |
| king-bowser-keep:shop:0:item:6 | single_source | single_source | 6c84d3c45ced60cb499268ee5e709deace5b460d9ca478ed8206fec3a41042b1 |
| king-bowser-keep:shop:0:item:7 | single_source | single_source | 105f2eaab9d30094a6633aea10ad75f46df0e0c4d43289ea7e32fbe06b8eb1c6 |
| king-bowser-keep:shop:0:item:8 | single_source | single_source | 3ab04d80ec14a715c715138b1fb64136e49a2dac3c86ccd076303fc85ed5143b |
| king-bowser-keep:shop:1:item:0 | single_source | single_source | b13c4788141c76a4c6c251f87f07eb81bc13fe8bf0d026ca98377294091f0a9a |
| king-bowser-keep:shop:1:item:1 | single_source | single_source | 2d164751718bd46d09d49286ec0e4236d76bb687f0965459e996c8fefd7e254d |
| king-bowser-keep:shop:1:item:2 | single_source | single_source | 3508e57f7ca4c1ca5182e2f3c855d7dc49e10d3207c6f7cde7cd9807570c3302 |
| king-bowser-keep:shop:1:item:3 | single_source | single_source | 6fa45c28d4e359db318fa9ec6f610b6b08cd0a1207c8dd493b34fe5f90553924 |
| king-bowser-keep:shop:1:item:4 | single_source | single_source | 26d29b6e4494bd01c978718479b65ce5cf77a66f4031ce0582bedc323aaad87e |
| king-bowser-keep:shop:1:item:5 | single_source | single_source | cfecdd072227abb85d9f61c7b87782d8a4d20933018bafbcd99e6bca128b3f5d |
| king-bowser-keep:shop:2:item:0 | single_source | single_source | 52957985bf4cf26d321dc0870067417292d4f29e4ba10839feb81eee514daf86 |
| king-bowser-keep:shop:2:item:1 | single_source | single_source | dc22090893aec231933aaed88b637a6ad7f99fc51ba2990d06cb281ab834e845 |
| king-bowser-keep:shop:2:item:2 | single_source | single_source | 0e8f0534a6a1e66d8b90178cfceff085f40912f2fa369670a9458ac42f7af442 |
| king-bowser-keep:shop:2:item:3 | single_source | single_source | 5421fd354767686029b5f44d5738a7e8f43e88a7f0d318369bf4dead2f709a4d |
| king-bowser-keep:shop:2:item:4 | single_source | single_source | f41885847a0c8d408f1695f254a5406a5a8d0497c36d636cf4f25fb86fc2217b |
| king-bowser-keep:shop:2:item:5 | single_source | single_source | fc98feaf0bd8c4c813f6e1571b8394c8bd646582b177ec23c6a684720d17bc4c |
| king-bowser-keep:shop:2:item:6 | single_source | single_source | 0dd43b49487e7e7c99ab47cbe973942880513f8453da05ab59a5d61ac964dbb5 |
| king-bowser-keep:shop:2:item:7 | single_source | single_source | 16b4035e61bddddd2767f8e2eebbcac156170c3595e27363fc3508b3cc1cb659 |
| king-bowser-keep:shop:3:item:0 | single_source | single_source | 4d07368c742d393546e6c84a7ff71461fa96d94714054d1e283533c6ccea977a |
| king-bowser-keep:shop:3:item:1 | single_source | single_source | f9e59d973c0e73a987d3ec59cde9878ec45778c804674381f27060bc3d411ec9 |
| king-bowser-keep:shop:3:item:2 | single_source | single_source | 135266933d5ab494ef46e5945303fe90c87dada52d528ee0afa93cf722d67e51 |
| king-bowser-keep:shop:3:item:3 | single_source | single_source | a90232cd0ba2209a8a5cd6838aff529b12a0b927a5840ab46ee25e67d7ed4518 |
| king-bowser-keep:shop:3:item:4 | single_source | single_source | c3db71fac90ade8d9894f60c8c1880401a192b4182ef8aff0eee2e913ee7de8d |
| king-bowser-keep:shop:3:item:5 | single_source | single_source | 3d1bddf75a19848cf612e8a78a866bfa7ff957d542af1a89f6d7e42f0c34858c |
| king-bowser-keep:gatesPaths:skeleton_gate | single_source | single_source | 6f1e2c7fafd9adcc4d0ccad0072956be839c9c0fd1d0d9d2233431c3af63c22c |
| king-bowser-keep:events:byway_reverse | corroborated | corroborated | 670d2d412b44d709834158a5a74214ec89df2f8c647eb6715ccd11500cd7cced |
| king-bowser-keep:events:red_pipe | single_source | single_source | 318603187d731c81d5f0d030a7fa9550674ddba351d9f2e21611ca48f0f684d5 |
| king-bowser-keep:events:bill_blaster | single_source | single_source | f7f797b51d48cb66b87f8681b4d600131bb862a060efb380d823a93f8758f2bf |
| king-bowser-keep:events:green_pipe | single_source | single_source | b9ce8f4998f9f2d04b6393be6a855d40d22e7b87c45180d8f0a29eed4bea8ff3 |
| king-bowser-keep:events:gear | single_source | single_source | 4b5d7822368217c534a82469ba5dc6ae84a6aba351b8a71abba834e4619e0f37 |
| king-bowser-keep:events:mechakoopa | single_source | single_source | b6a345f5abacc2b157f3671e91b517b2231e2ac59c2637e159e2b70e1f4f5b13 |
| king-bowser-keep:events:vault | single_source | single_source | eaa77f804716c57c513f3b9d0305826e8451efc6f5ed0d357a277f0e73c1e288 |
| king-bowser-keep:events:bowser_byway | single_source | single_source | 9aa248dfa3788d0f7f64c9ddd498894ce49b500797b7f239fbfa070e707225b9 |
| king-bowser-keep:phases:fire_growth | single_source | single_source | 0457aca09657a1183ae569a66e7a6f331923713ca393e5a80603c4712c8284a5 |
| king-bowser-keep:phases:retype_bounds | single_source | single_source | 7916ec030209c7a1b3691635a977a5d220a7b1399ca79d7f6f97c42a53929ca5 |
| king-bowser-keep:phases:unlock | conflict | conflict | 2265a44c50c912b0e638d47cdd5cfd64fbea936d4e80e4b0ea4e52c4201e149b |
| king-bowser-keep:homestretch:no_extra_bowser | single_source | single_source | 21e327150b47f0cc78f05212ee67868eb7b353cd2f569f3dcdd80b44611864be |
| king-bowser-keep:map_link:green_pipe | single_source | single_source | f6ab8cb3d12383f927dec16ea2c61ac3c713d39bfe004dc86888767e7d0a0e80 |
| king-bowser-keep:map_link:red_pipe | single_source | single_source | 2a99f0d9853c07407960a40f6f1bee6ed47367196ae884fbd76306f359f65fe1 |
| mario-rainbow-castle:presence | corroborated | corroborated | 2ba0aa4e5c6763aef0f8fc155dd568e6b89776f6519b6a3bcfab79138106c8e5 |
| mario-rainbow-castle:space:baseline_party:start | single_source | single_source | 4abcb1820a7b707a944f5b31eff8409146c2283b8026919498af95b0b47477cf |
| mario-rainbow-castle:space:baseline_party:blue | single_source | single_source | 8a6c66f4dfa6afd9e5ab95d2e7422b31459d30bbe9ca4ea2696cd7e1b05e0d41 |
| mario-rainbow-castle:space:baseline_party:red | single_source | single_source | 01abed7eb34e4e2a105e62ec3033ae9d5948c7a26da5f3990c91f8c522935e48 |
| mario-rainbow-castle:space:baseline_party:event | single_source | single_source | 39b2302afd4975a90e741404b29fba45f595cbdf733382fc20827795e95f383e |
| mario-rainbow-castle:space:baseline_party:chance_time | single_source | single_source | f8fe1348a9ac787e40be770d8406a90bac64c5c045256eb51ce7a44dcd03a5ba |
| mario-rainbow-castle:space:baseline_party:item | single_source | single_source | f338af48708ca07ad5227a38953dc6816117b98c36874733de9e12678d26c29c |
| mario-rainbow-castle:space:baseline_party:vs | single_source | single_source | 17096eb464a4036bb932a7745b818002abb0122c60b089739d819a534b693a7a |
| mario-rainbow-castle:space:baseline_party:rally | single_source | single_source | 8853b293e48b873b1c9b33dd943797f6df022c6513b9cf27e259dc5a7d1fbea3 |
| mario-rainbow-castle:space:baseline_party:lucky | single_source | single_source | 1aee1811ec21e50abe40902a284d739a7c87103e7b2b2f14b69442e5e66071e7 |
| mario-rainbow-castle:space:baseline_party:unlucky | single_source | single_source | ffb5ecf2fe0af3648830ea82a1016688323bcc94c458bddd465120c1996e9dde |
| mario-rainbow-castle:space:baseline_party:bowser | single_source | single_source | 730c79e6e10736881f32235d60e0b211fe5cc93ec775e7b889a5918994bb9f20 |
| mario-rainbow-castle:space:tv_tag_team:start | single_source | single_source | 56cec73fc258c4c11ced9d4f05cb68b72f2291250619e4c67b8a2365dce3bfa7 |
| mario-rainbow-castle:space:tv_tag_team:blue | single_source | single_source | 71ffa0a68e64e0dee550886ed9a819f9ce3b7ea937a3231771ef1051b4738d55 |
| mario-rainbow-castle:space:tv_tag_team:red | single_source | single_source | 4cbe9c3163f1f126ae9b1bb9567802e62eccfe7bcaeeecce642c3e57c13ebfe0 |
| mario-rainbow-castle:space:tv_tag_team:event | single_source | single_source | 1ed54493918feee8743109d41f1439e4578226aee48951aa849d0f378597446e |
| mario-rainbow-castle:space:tv_tag_team:chance_time | single_source | single_source | 92d4ae937555a6094635c2f072c21cc3573dc830f9d25856bf97ebfe122da869 |
| mario-rainbow-castle:space:tv_tag_team:item | single_source | single_source | 12e59b644374dd4cc3930d13f2aab0bb9aaad4ea17b3d242c4239c421bc71ead |
| mario-rainbow-castle:space:tv_tag_team:vs | single_source | single_source | 4640b958a486fe711a90a045f3206e945edddfab3df2fa401803f3617d25f9da |
| mario-rainbow-castle:space:tv_tag_team:rally | single_source | single_source | e89c30bb268813d55b8397357ba38c89b0ff6091c5e71c05cfa05532740b173d |
| mario-rainbow-castle:space:tv_tag_team:lucky | single_source | single_source | f0f1d07e470dddcbcabcdc32973682c072566600d0edc183768c70513e6b7dde |
| mario-rainbow-castle:space:tv_tag_team:unlucky | single_source | single_source | 17ec760345260899e747d6eab8687ae309102a101aafb1586b542a3047509597 |
| mario-rainbow-castle:space:tv_tag_team:bowser | single_source | single_source | a660d45594a0e440bdb7fa6dae741d99c00497bce5106a018dc3cc205edc831e |
| mario-rainbow-castle:stars:purchase | single_source | single_source | 8003150e6466715babe251a1f37880d48cf1d45a3f82dcd4cac1e8dbf46f2f19 |
| mario-rainbow-castle:shop:0:location | single_source | single_source | 24a5469ba6bad604a47ad852e3ec0e8e76814c945f751f447b6819119bab7493 |
| mario-rainbow-castle:shop:0:item:0 | single_source | single_source | bc247db09dccc7462951d222328a8c71515f6308fd4b0d01ea3268aa82db1ee3 |
| mario-rainbow-castle:shop:0:item:1 | single_source | single_source | 895757e27393054f31bf756117c7c5b6c3b716d1e6e70e936cbe8b719d92ed73 |
| mario-rainbow-castle:shop:0:item:2 | single_source | single_source | 6c4c52c4c149cc0e7cb45805383e248b72560817c1963058962622818dc21592 |
| mario-rainbow-castle:shop:0:item:3 | single_source | single_source | 4dbb6304406b3384a18b44e81773a9ca35841addf6af9b30847ce4b1503243eb |
| mario-rainbow-castle:shop:0:item:4 | single_source | single_source | 6d3f36407d803c51749559bbb3720e17c702c35b6ca648466ea6f6c8519d6cdd |
| mario-rainbow-castle:shop:0:item:5 | single_source | single_source | facddab11a0b1a2aa903fb36ceb3a67081902bd338186c1f77e10273c19f39ba |
| mario-rainbow-castle:shop:0:item:6 | single_source | single_source | 5f29c06be5e2cc6bc8c6e18e5b50c2237a3af4bdecd7064b523cfe04de26638d |
| mario-rainbow-castle:shop:1:location | single_source | single_source | 5fbf0dedd98223b22d0b10bc6faaa7d7c68b9cb087ec6fa018cbcf82952a392f |
| mario-rainbow-castle:shop:1:item:0 | single_source | single_source | 738f1405033d7ccaff21d6adc53ea7fe49084f6b4f33c0a01b45a029cee3a1e2 |
| mario-rainbow-castle:shop:1:item:1 | single_source | single_source | 8b525de952e034760968831b9952c33c3df29aa90841d2a73205c989a12b7e47 |
| mario-rainbow-castle:shop:1:item:2 | single_source | single_source | 87b7e2146c01f99b6c2a182e35a5a522458ec81ee194c2be3947a917bc083aa0 |
| mario-rainbow-castle:shop:1:item:3 | single_source | single_source | aec0aa1932cb005b3815484859779fb4c2c7598cfb465acfde5f2bda66b78435 |
| mario-rainbow-castle:shop:1:item:4 | single_source | single_source | d8ac394b9b10a2b6adf5ab72fa0621b6ea6088fa7c448aeaee4cba54ae724f8b |
| mario-rainbow-castle:shop:1:item:5 | single_source | single_source | 1988cb43987ef3b032666aea8ee680fe79a727dded4c566de2082406c3a1c1d3 |
| mario-rainbow-castle:shop:2:location | single_source | single_source | becbb29705ef4c1ca5c970595decf86c62677e096f91a6ec6115a5b3171c69b9 |
| mario-rainbow-castle:shop:2:item:0 | single_source | single_source | c66ce362786f1903971cb03650a5663f1ac6a3452966f39a374e7bb1f4c7174d |
| mario-rainbow-castle:shop:2:item:1 | single_source | single_source | 9ba4e707013ca3974bb2d925ac4ef5888941e926b45ff8bd37d76d60f6afed5d |
| mario-rainbow-castle:shop:2:item:2 | single_source | single_source | b485614d01930d05c86b891e60359d495c4c1ed6e92e2f1418d2680cdc027694 |
| mario-rainbow-castle:shop:2:item:3 | single_source | single_source | b9f0d92fe0dcfed60749db12bd6fa46cbcf55ca513706a78e6c88cb168a09c67 |
| mario-rainbow-castle:shop:2:item:4 | single_source | single_source | 43b012da5fa8078f8cd753b6dfa1b09167fdbb9c654808759b3c27099a2ca300 |
| mario-rainbow-castle:shop:2:item:5 | single_source | single_source | 58cc929ccaebdc2399266473a1fe4f7d11fd61c7aeaf96d6154878fa2e028441 |
| mario-rainbow-castle:shop:2:item:6 | single_source | single_source | 3b7f3bd3de6842db3ee21d0ec3055450e04c255753f15bb7edb7a39097d6c992 |
| mario-rainbow-castle:shop:2:item:7 | single_source | single_source | 22b6e372191a1eb4620c8547a4e434df0be5607af9f627bd19c880c80f5d64e1 |
| mario-rainbow-castle:shop:3:location | single_source | single_source | bafc6346f8eaa35bf56aa4297cfdfee0216d4494ffe61ffc1df91e37d5a66160 |
| mario-rainbow-castle:shop:3:item:0 | single_source | single_source | a6302564840df74cb26e8524f2c816ca628d24336d8fb09b37818097a718481c |
| mario-rainbow-castle:shop:3:item:1 | single_source | single_source | 05a58aa2d7b6b9bcf34d40fb255139bfa8f31283a230b60980186a60bcb8df5d |
| mario-rainbow-castle:shop:3:item:2 | single_source | single_source | 62746401f63e5382f582531eb7ddebe3980ac16682961a6fdb3585547ccd8cf0 |
| mario-rainbow-castle:shop:3:item:3 | single_source | single_source | b192fde16d9a5d0720c44c04f42173c0ba5e0be2990348f297ad563b865b2c54 |
| mario-rainbow-castle:shop:3:item:4 | single_source | single_source | 8a9a36e5ad74160ad16b885eaa432cb4af6a11a1bb2e7a3f18a6acbd21292a0c |
| mario-rainbow-castle:shop:3:item:5 | single_source | single_source | 9b848d986bd6cf01d6825c8f83dde69456dc3f614cc2760a80b296527efac18d |
| mario-rainbow-castle:shop:3:item:6 | single_source | single_source | 54b9c4f2a7340dbf90c6ca74870144a2f9e85dce4708cce335422eb344ea9dfd |
| mario-rainbow-castle:shop:3:item:7 | single_source | single_source | 242215277f38af1d7d716d97e54033e2c034173e804d3d59bdde4c3042bfc205 |
| mario-rainbow-castle:shop:4:location | single_source | single_source | 7c98ffcce7090b13e36a01ed4ef37257aa7ec08692ef1dd2c5f789ebee9f54f2 |
| mario-rainbow-castle:shop:4:item:0 | single_source | single_source | 986b071fad189de5c0bec2073ac98cd4aeb3fb4fafb4d55811efd393bfdf116a |
| mario-rainbow-castle:shop:4:item:1 | single_source | single_source | d29c4458ff02d80734d1b7170afdc56b94c988a3bbd089b0ff1714c2f1816ed1 |
| mario-rainbow-castle:shop:4:item:2 | single_source | single_source | acb97f4327ce8f994fe69e073ac21eeb036c8520e08afc52a92da1a6a19c8e0b |
| mario-rainbow-castle:shop:4:item:3 | single_source | single_source | 5a996787dcd9325554fe58dc8090096f38087b8a1b52c34e519c539822b9c994 |
| mario-rainbow-castle:shop:4:item:4 | single_source | single_source | 92e4eefd169f72e70f9f285508413a1edc53d2c9a35acde1ee480e1ebfcaeab2 |
| mario-rainbow-castle:shop:4:item:5 | single_source | single_source | fcd1fbd2825d4887749cc0ffd536d705a66e75cba13cd66275e97649963695f1 |
| mario-rainbow-castle:shop:5:location | single_source | single_source | 9e17ff3ad6e6a128bd4fa2f4677edf9ab8244c82f44be13a6f9fc06206f6a351 |
| mario-rainbow-castle:shop:5:item:0 | single_source | single_source | 7da311bac27710fc19c5110db8c9a14d2afee020b63a4b543a3454790221cd24 |
| mario-rainbow-castle:shop:5:item:1 | single_source | single_source | c39f1a1f1ef4c0fa7c6728d10f1c58fa75cfe8d7b069cb2c9acd1823da3da053 |
| mario-rainbow-castle:shop:5:item:2 | single_source | single_source | d9af9d39254c3653d9d7798366b45ff6daa26aa943c17be87b609b468102fca9 |
| mario-rainbow-castle:shop:5:item:3 | single_source | single_source | 4516c4518ca4398da5135a437bb5869e1d73f36e2d731ab7d4bdc10f9ac8c9e5 |
| mario-rainbow-castle:shop:5:item:4 | single_source | single_source | 3f1f21037f4217dbb793fe271ba2dc28a9413069ee6ebaf3b9d04a2b85bd33fc |
| mario-rainbow-castle:shop:5:item:5 | single_source | single_source | 95cf114e6dae7440e514173102d30cc9146a408055e66091bb5c5da8b1333169 |
| mario-rainbow-castle:shop:5:item:6 | single_source | single_source | 87bb5171303aa1af50a280d6ce08bb179b2ae17f7acc7a44de4879fe4520d24a |
| mario-rainbow-castle:shop:5:item:7 | single_source | single_source | 5486c193c862e81474a106e0f0063295544766d095ca58ea17c8dc257c4fb18e |
| mario-rainbow-castle:events:tower | single_source | single_source | 82ce4973fcac17df195fa40d08849608593aab63ee8fae8b3bf8b6a2b7ee334f |
| mario-rainbow-castle:events:tower_event | single_source | single_source | dd0128b10e331ad58ccda934ae25ad5cdf96f9f5436f47035caa704ba4713cb4 |
| mario-rainbow-castle:events:ztar_shortfall | single_source | single_source | 0948905ea88a31b951da0dae5875271f03a38620fd3ca6b94e4652c501c522f5 |
| mario-rainbow-castle:phases:shop_swap | conflict | conflict | 15b6afe014af56079e1649b06e705472584b5ab6411ef8cbe83e694b99527b96 |
| mario-rainbow-castle:phases:tower_turner | corroborated | corroborated | f12d939f6a11081929ed15174bbdc8ed1b5edaf6b0c003b4690db03871075c40 |
| mario-rainbow-castle:phases:weather | single_source | single_source | 7c8d7c1879308960c57ffeb7cad32138c51e96757cd1ac1c58553dbec3fcb91a |
| mario-rainbow-castle:homestretch:no_extra_star | single_source | single_source | 0b9aa9eafcb77387fd5cbab8ab21a227ade7630bd47589dac7bffe85fe2a1ead |
| mario-rainbow-castle:map_link:tower_return | single_source | single_source | 3b6fcd1ca7aa0f09a5d745f3fd6ba912ae66ecf913a902a35dd1c44bd0409019 |
| western-land:presence | corroborated | corroborated | 70bac25c3b0b1c013a4060783dcc1a3278c3bea63533efaa5c7913a3c505b857 |
| western-land:space:baseline_party:start | single_source | single_source | 290b529af8fbfb7e27afc5bbc0cef08d39d7db323f684a52948e55729dbb211a |
| western-land:space:baseline_party:blue | single_source | single_source | c298dbee93b3833e602b928b0b075cf2f43851132e792c659ac5aa3f7d71f598 |
| western-land:space:baseline_party:red | single_source | single_source | 7171271ba9d80916ea5bd419b466714f22c3f49ce2e6179aca9820d0c6ad8428 |
| western-land:space:baseline_party:event | single_source | single_source | 4e3e9f2907e8fe5c11b7f7ac9afa2e92ac7a216b348cd480f34b37a536efe112 |
| western-land:space:baseline_party:chance_time | single_source | single_source | dbc0cfa2ac8a486739ed8815957f777accef244762024aeb68475c33baff4016 |
| western-land:space:baseline_party:item | single_source | single_source | bfe903f36031b9144600b8f5dbd21c61adc84f4733213b1df47f97a94b45d71d |
| western-land:space:baseline_party:vs | single_source | single_source | a757df9c26195b8256ecf01080e2889bf87f4f0f7d2f63abb5aa3387fba885df |
| western-land:space:baseline_party:rally | single_source | single_source | fc1c8e36897aa9f8d82c87923b5d94e4224f5f24100ccf06c3cca777545b7267 |
| western-land:space:baseline_party:lucky | single_source | single_source | 3928cd8ae48a90f9755b971ff00f96f6e52032830df2a97bbc111f1f311c4cb7 |
| western-land:space:baseline_party:unlucky | single_source | single_source | ac112cdcf0b979f131a7945aba22b404c06f5a4d36dc97ead93a479bfd657465 |
| western-land:space:baseline_party:bowser | single_source | single_source | dbf449fca1a1f5a13da90406299113827832c0850228422b41241e987ed416a6 |
| western-land:space:tv_tag_team:start | single_source | single_source | 01333633d10626d8070e4d73dd575e5bf8ffd1b792a389046cd1e7952f64aba1 |
| western-land:space:tv_tag_team:blue | single_source | single_source | 5d158d152e86ec70393e74cbb5af6c79a86fe88e022404c32e157e3087bbf3b1 |
| western-land:space:tv_tag_team:red | single_source | single_source | 0549b9fb040e4d00694113915d2fc87af10061579a7df1fc055e5e999e46ff47 |
| western-land:space:tv_tag_team:event | single_source | single_source | 44a922255978fe0aa88b7e8a7f7061ef83c24fa3b9d1cb14895da16d6c255baf |
| western-land:space:tv_tag_team:chance_time | single_source | single_source | 1a899b7ef92c98488bda8bcc6ca921383f0c13ba809d0b1feaf338c024e1ef81 |
| western-land:space:tv_tag_team:item | single_source | single_source | 5c096451dfb72e871c1689e97f773dce3c7a90c2dcd3ba75f65e98095917fc9a |
| western-land:space:tv_tag_team:vs | single_source | single_source | 333d915b4e6ccd49b6b232975f5eab39f26b63645790b402f9140c661e36f345 |
| western-land:space:tv_tag_team:rally | single_source | single_source | f5b13d69f40e9686a5cc7131f45bda3f2fde3a7424965220f82597ba161ada76 |
| western-land:space:tv_tag_team:lucky | single_source | single_source | 02f425b2fded497d92a99b870b94acf3aed1f21a2299aae9a71e418473c7dae3 |
| western-land:space:tv_tag_team:unlucky | single_source | single_source | 93287700ae1618a4b7555f9241808df73c6db503225d372b647185afddb73054 |
| western-land:space:tv_tag_team:bowser | single_source | single_source | 1b0fab13bb1a8a14504b136b83adca668398aad55771d94ae811587cc9cf4d12 |
| western-land:stars:purchase | single_source | single_source | d2dff3a3febfe54a7c5c90d6964532ad8a437f5230450476fc08c3309b69f05b |
| western-land:shop:0:item:0 | single_source | single_source | ab60d4a68f11d75d8fbee40e023480cb758985ec0801de5334312d16a48ebce0 |
| western-land:shop:0:item:1 | single_source | single_source | 09a0e086aaea02e35852bcf65f01a850b22563f61aac4224c801781de7ed8ad1 |
| western-land:shop:0:item:2 | single_source | single_source | 63784a756ce7cc98909b2e1666354521533315a60249617161aa261e5f07a212 |
| western-land:shop:0:item:3 | single_source | single_source | 1c2def303299619174f58518fe3e7cff9ce8766080a10189ec0460824dd3bc7b |
| western-land:shop:0:item:4 | single_source | single_source | 0d64addda00cb21fff47ade50a14870ee64aeea43072aa823cb8ebd22309342e |
| western-land:shop:0:item:5 | single_source | single_source | 6ce051a4ab3e066cf88d67b9a78366bffff30d0fe810dd8a40fe5776d5b78415 |
| western-land:shop:0:item:6 | single_source | single_source | 54a37c3271425ce62db0814e55162db5ab5f3a3639833bf444f5aa514a9d61c6 |
| western-land:shop:0:item:7 | single_source | single_source | 4ad714c3b39a082c64ac32b48552a16ec088b93aca09b47819f3fc385446bb00 |
| western-land:shop:0:item:8 | single_source | single_source | 1940b599b033808a89326bedcd1e1da8a43ff663c15e8934d0e768a84aa3a308 |
| western-land:shop:1:item:0 | single_source | single_source | 87391aabcef142c31ad64eb895251c99c255d0ba0257032b276ee535b89fa5b3 |
| western-land:shop:1:item:1 | single_source | single_source | ab417bcfa1dda18c4474146a2e5c890d57823b12dca4dfc08e6a54f5883aa975 |
| western-land:shop:1:item:2 | single_source | single_source | 35a5a374d21a39a4f189546a65beb7194f7c2f051980e66fc205730060f1cb1a |
| western-land:shop:1:item:3 | single_source | single_source | 4b989afd0467f7b9d90ca5593136ea8a146cc251ae0221654c6cb44f00b8c1ef |
| western-land:shop:1:item:4 | single_source | single_source | e252b84b15403474c6bf7eb294da2e72fe65622aad3aac95946fe208e6f071dc |
| western-land:shop:1:item:5 | single_source | single_source | a5318973e3fb886a7fc22c72627c6a6de13be312cc997c4811df9180b578639d |
| western-land:shop:2:item:0 | single_source | single_source | 176e1048d3a4264c4c5b02b0a680e44e03dbd6d04bddf28db26f9dfb8cc771d6 |
| western-land:shop:2:item:1 | single_source | single_source | 912f4bfa008de598f92f33514e52bc77d07b436a601db3cf802979d02a97e3cd |
| western-land:shop:2:item:2 | single_source | single_source | 64f3bfe4d72023f48ca82f04ac64cf1049e45e38304e8d47bc407e5ba0707770 |
| western-land:shop:2:item:3 | single_source | single_source | 4878788e972cc1ca850572cba88f3ba7b817b3f1fe9868d329a509f746af9f4d |
| western-land:shop:2:item:4 | single_source | single_source | aaa44be4964a6006ae2751807ed594bfb58c3d1c9a1d8397bc5232f3bf4eef80 |
| western-land:shop:2:item:5 | single_source | single_source | 3b3d8adc83b74a55e127beb5798d1a39c90204d38535c1c25d76cac56c2bfbf7 |
| western-land:shop:2:item:6 | single_source | single_source | 9ed3275db522fb1560b31bf111d6389d3ddff1637b18f000eb35438d11a24683 |
| western-land:shop:2:item:7 | single_source | single_source | cedae42e1ad1d5e1fb2e86192a6e891f44cb5d9fa841f1c06ad1a5b0e19d12fc |
| western-land:shop:3:item:0 | single_source | single_source | 26d577497bfc08547ddc3a6b49dbd7a5d608d6c9e04db895043f4ee308a13f13 |
| western-land:shop:3:item:1 | single_source | single_source | cf3b16c7375f68e0025c8b87a4bc2115534125e8000a3fb17fb0aada7cb85ff9 |
| western-land:shop:3:item:2 | single_source | single_source | 7399694d75a4847886a246005269ba40ab58d11ecbc769c416f471802a8f9d5f |
| western-land:shop:3:item:3 | single_source | single_source | 7f09fac1870cfbbbc0c8399eba0fa743e3bb499fee5557d7a89d6d4052d34b49 |
| western-land:shop:3:item:4 | single_source | single_source | a2aa253346be1ceb629585e2b3759eb49e135c35573fcf2b0c220ec357b9f2cf |
| western-land:shop:3:item:5 | single_source | single_source | 80f1221874b11cb702d72e0785538af9a2e2ca4c4e35b01f8d30f1a101c32bdc |
| western-land:shop:4:location | single_source | single_source | 4a312a936196898e40f384e5cc93c98647abc842962f918ae62847ac53cc17c7 |
| western-land:shop:4:item:0 | single_source | single_source | bac82d7c4f3c2de2743c8839dc1c59a3b243d631edb083f1305ab7f9da6ba403 |
| western-land:gatesPaths:train | single_source | single_source | a16d1cff0adb706ea6e4882e5e931a69d944a758314d800b5c36fb40f2945aa9 |
| western-land:gatesPaths:skeleton_gate | single_source | single_source | 772d38aa773bae5a70185d1982f1c5f31a44ad2b809b1e94b8a8a450004e47e7 |
| western-land:events:train_hit | corroborated | corroborated | 74d45c04f8197ba093383032ebc94eaf2560e6be3523fbea4bfdfdabad30d329 |
| western-land:events:train_event | unverified | unverified | c9f5638033639b3b018656270daee05de31bf081dfd5bcd4353ecfaca08b4131 |
| western-land:events:hootenanny | single_source | single_source | 5a2a887e935bfee246af2ede7da66965d58fa566a28b12388a83502a24f2cfa0 |
| western-land:events:steamer_ticket | single_source | single_source | cce3387363538cb6beded58f31656c4106032e6bd232f606eb73863cc373f0ad |
| western-land:phases:unlock | single_source | single_source | 7657bd120a891563c8962026526d0c6b7cd633c3527026ca7e4bc3c4e330efbc |
| western-land:map_link:train_transfer | single_source | single_source | 2c9fa461d099547a65bbbaeb8598b2fb18133d2baf4a4c53b4a2833e15cff530 |
| shared:star_cost | corroborated | corroborated | 8a321753f5680b794f5d68fd6a2b08b11a4e7fa4624639b4e372a53eb0e28692 |
| shared:homestretch_base | single_source | single_source | e50775dfd4132a6a14fab66c99c32358812c6e590852dfd87eabc44893d4ee97 |
| shared:mushroom | single_source | single_source | 56354c4d12283099170f025d03cce5c84935985970e0d28d3f68e4218bd5970f |
| shared:extra_star | single_source | single_source | 571e3f3787dbf6aa7b62f9f34c81d4297668d0ceb2a112e4aa17620a97a9f47f |
| shared:star_traps | single_source | single_source | f20c8759db48ba9898e59d424aa0174afe62c68e2767b67b5f354b0987ade17f |
| shared:double_dice | single_source | single_source | b40c4915fa28db493e851f57972d4a4a2c7cc3d0d8ee1c56e5126bd316905f14 |
| shared:double_spaces | corroborated | corroborated | 0939cd2f609c8ef12b5cf7811093a4b4a8a290174063b7531542347ecf316056 |
| shared:double_coins | single_source | single_source | ae666e68bea319b9325ab3af65cacaced2ac488c1ddbd83a16f776865567d6fa |
| shared:extra_bowser | single_source | single_source | 289e73500a1e480f8e840057ae2f306ca4f7a91defaa2883433a0ae3a93b3f96 |
| shared:extra_chance | single_source | single_source | a0c961decfc33a6a55b83c265cff7880db35437e20f1b3a097b558cbc018fcdc |
| shared:pro_homestretch | corroborated | corroborated | 08ae1535669db05a733b380d6e016d79d4470c1b8d00de8de6de7222c1019441 |
| shared:shop_period | single_source | single_source | eb9dcc415f0a7fb68b6922f5890cc9553781a21fd9867ab8b0bd142d19cd1fbf |
| shared:pro_stock | single_source | single_source | f7a9770cab82e53144aab23707434810c95f28e9ae432a78b820d8fbaa7bfa32 |
| shared:tv_camera_pro | corroborated | corroborated | 5c658e8425a1b2e5c07a8ddd72548f1068273d0ced338897a9ec98405b1899fc |
| shared:tv_frenzy | corroborated | corroborated | f3ecac6f2cd0c99addbe73e0ca73866c2429e964fbc6a7f2c17814b05849a894 |
| shared:tv_tag | corroborated | corroborated | 1550d2497a9480afa0475c5b95740f32fa47b29ef19661a6ea1664a065898a3c |
| shared:tv_tag_qualifiers | single_source | single_source | a1f1aec00046a95177e777c6d04feece65f44ce0956d14235aeeec0b09ed63e2 |
| shared:no_new_boards | corroborated | corroborated | 88d470283715ae70a4b625a4aae5a6760b86c6d799abff9b959c87579100d5d6 |
| mega-wiggler-tree-party:board_record | partial | partial | 59b49845f7d2986bee88026e09524e822c801b2ed97bcad4f741917cd40cddd3 |
| mega-wiggler-tree-party:map_description | single_source | single_source | 2d9a57767a1012e83d6c32a49aefdfbeb5e896eb5a9d57c1d395fda5a1fb8d1f |
| mega-wiggler-tree-party:profile:baseline_party | single_source | single_source | d4172a12513f811dc3612e93e3241b7f684d0cf100641ed2c0c51227836517d8 |
| mega-wiggler-tree-party:profile:tv_tag_team | single_source | single_source | 917662e248afdc2d813ed80a9a9b34603a54f0f19dc61861a2aa4a058e3f89b4 |
| mega-wiggler-tree-party:profile:baseline_party_angry | single_source | single_source | 547a35b5eedb59dc04ca94c11da2cd8d3b05c46c7a58b2c1e607a85de8b0b6ab |
| mega-wiggler-tree-party:profile:tv_tag_team_angry | single_source | single_source | e97517dc961a1b5cef9c56ed19950150808dc6973240cf063091290a1d0ac10e |
| mega-wiggler-tree-party:shop:0 | single_source | single_source | 28f29b05fd66082597c98eeb6c72daa1720d3a3ab666c1e220b60f10af4a7467 |
| mega-wiggler-tree-party:shop:1 | single_source | single_source | 05e10d5ec9632b9c3ff0f1d343a100f3379472eacb9d0cb0ea2ba6203ebeb333 |
| mega-wiggler-tree-party:shop:2 | single_source | single_source | 948d426adcb6199c58ecc5608198d69a7e0131c4b50cf7c15c42f3ce86973d8f |
| mega-wiggler-tree-party:shop:3 | single_source | single_source | f7fb8bf53f7b67561b9fc145d94d7ca810bf0f60c09af1e395eaa5a29769f575 |
| rainbow-galleria:board_record | partial | partial | 0a9293c198eab4808fa91bb903b3e890aa43cac539244c84d59b2dfeb919fbe0 |
| rainbow-galleria:map_description | single_source | single_source | ee048cca86737b344acb0b0dcdf7b79c3fd33692b69fb682b488bd079d70f74a |
| rainbow-galleria:profile:baseline_party | single_source | single_source | 0366866ea16c65069ae024e0bfba29d23816852704c91b759da4162da7eceb45 |
| rainbow-galleria:profile:tv_tag_team | single_source | single_source | a2b5209c5580ef02dcf8d2d7a2393231318e77aa5e0adf0d1a8a782fb8a944ad |
| rainbow-galleria:shop:0 | single_source | single_source | f0a889279a31e9f009fd531acb759990d5d176eb6a03f18cf110d367129a58cc |
| rainbow-galleria:shop:1 | single_source | single_source | 196defc7f50c8576032e4fbf99833119d194c012fa8aca73ed3b34a0a30de0cc |
| rainbow-galleria:shop:2 | single_source | single_source | 5669f5b0d495e51788615017194a58e6e76533cf158d1fea0f4ae20780acfe2c |
| rainbow-galleria:shop:3 | single_source | single_source | d9eec14cc23fa0c84e38e18f15099e0e16ad2cea5b31909be4497b00693dece9 |
| rainbow-galleria:shop:4 | single_source | single_source | d8ad39bfdbbdbf3987063a0c45ebe3d5d733e01cab31f6c8d8fd8f927cb883fc |
| rainbow-galleria:shop:5 | single_source | single_source | dcf76d13d9a233e9c58c842b3bc648b8f0b724007eb86f60ae1e294888d581ca |
| rainbow-galleria:shop:6 | single_source | single_source | 01f40ac6bfa0582312b99748ea8267d4c75407a177a30e33f6bc3370adc11476 |
| rainbow-galleria:shop:7 | single_source | single_source | 166972fa2be98a5c8c04b84d2cad686bafc4746b8882dc4b7003351cef7e152c |
| goomba-lagoon:board_record | partial | partial | 6eff43a24767418a6f199d67702d0595cf51096832358663f7f1a0796a2fc826 |
| goomba-lagoon:map_description | single_source | single_source | 772678da66eadb492006941ddbe8fccd7d5ce6e80e813e8555fc676f17bf79bb |
| goomba-lagoon:profile:baseline_party | single_source | single_source | 144afbc6f0ced097610190970c165046b7e99346cca6a00c90e16943af68c3bc |
| goomba-lagoon:profile:tv_tag_team | single_source | single_source | 4869817da3f4c34c5f5ee24411f906d1653063c662cb6c3a86ca43834020de84 |
| goomba-lagoon:shop:0 | single_source | single_source | 98a319bc6de155a3f2191e026c1504989eb3aa73ed08a6a42b8d457e0eee4445 |
| goomba-lagoon:shop:1 | single_source | single_source | 6047d3e9a8f93a61b29fc0b462dc74028d6d7ce742ad38ca0e2d2e42fa2c3d64 |
| goomba-lagoon:shop:2 | single_source | single_source | e8f163b2a2bb33625eb978f7714b9b013a756bde1b7b82556fd74ac3c030d26e |
| goomba-lagoon:shop:3 | single_source | single_source | 566d2c121503a2f35c9c938ea306f1319d69a888d9c0f66a8f273c7bf1ff6ee5 |
| roll-em-raceway:board_record | partial | partial | 483f2f979b69ff96394443bf47dab4b2632df75df53b099e0e4725f5d27b2827 |
| roll-em-raceway:map_description | single_source | single_source | b4c8afaf8f782d06b42bbe677f02dcdee713a8609de25e6a94363c6f1a484156 |
| roll-em-raceway:profile:baseline_party | single_source | single_source | 21795e0c824b65e83b96e386b1b8a9f2d0b32ed1737b5c10a8bef3420d0a0b86 |
| roll-em-raceway:profile:tv_tag_team | single_source | single_source | 4974f928477b7d556afd770c3daea96a94d965d9c2c12987354662e7cd50e99b |
| roll-em-raceway:shop:0 | single_source | single_source | 0e872df2ed96e375000c8722b7584952449e6b1a3ffa7eb5ea137f46518431ae |
| roll-em-raceway:shop:1 | single_source | single_source | 5938239a24f1955a95c8494155b56ebd4447cdf69f49c49ffd27f7cb064e202f |
| roll-em-raceway:shop:2 | single_source | single_source | 0555900785036b0254555cffbb425329504b85adeef4b82ad0a60748517ff229 |
| roll-em-raceway:shop:3 | single_source | single_source | 4edcb85c2cf754253c5a24389513730009b3889ddc06e73fed11c83dca04ae61 |
| king-bowser-keep:board_record | partial | partial | 2b42ce3a52460e931ad16287b2c9fda484a418c4e63bd78f1636b0cd2f5625e6 |
| king-bowser-keep:map_description | single_source | single_source | 10aee0a3069b7b0b4ec441044389b5b02060b2ffaf0f5b923437b263c1c96da3 |
| king-bowser-keep:profile:baseline_party | single_source | single_source | 3a70221e668d6ecd1efbef8156cadca59bde3ad1d313718a79a5ba2ed76fc988 |
| king-bowser-keep:profile:tv_tag_team | single_source | single_source | 4c5c897c741cdbfe1f871f9445ddbff7e40647bc1da536a8a95496cea9b40251 |
| king-bowser-keep:shop:0 | single_source | single_source | 0bc516445c7ed8da31b23ca2a3a3ce81adfe81eff61db82d415a3e4595dcf0ed |
| king-bowser-keep:shop:1 | single_source | single_source | 50214f7026e87f3162e9b6dda83f7efbd4f60a295c34ca030483e0c97183eefb |
| king-bowser-keep:shop:2 | single_source | single_source | 98323f8e499237f25f60802fa9b7ca2a656b3d6a1771df3575730df109133251 |
| king-bowser-keep:shop:3 | single_source | single_source | d56a27eb5aa79b99c58af521b338252c0b1bfca0f62d2e4824bb2c99b5871dd4 |
| mario-rainbow-castle:board_record | partial | partial | a760908c2882ff4c820ea0b874bac8806e18ee36e3679c949e424eb01cea779e |
| mario-rainbow-castle:map_description | single_source | single_source | 9ee51e3f4d714c3789340242450ffb91673fddb066daa744bd95fbc2220463b7 |
| mario-rainbow-castle:profile:baseline_party | single_source | single_source | e415581d7ca9229f642a76cd2f68406cddaad0812be6c6632df212bb685debda |
| mario-rainbow-castle:profile:tv_tag_team | single_source | single_source | d7c8a57914f46500d780fcb5dcf5f58ad91d49cd5a121c0705e7a82b8800dd60 |
| mario-rainbow-castle:shop:0 | single_source | single_source | e6cb718de3df6f9525331be54d2757c5555442608710223b1fa7db60add17ed4 |
| mario-rainbow-castle:shop:1 | single_source | single_source | a60c2fa5abaa1e14a5d53e0ccf66e222106986966f5dd4b38357cd79b4235f1e |
| mario-rainbow-castle:shop:2 | single_source | single_source | 0177200394b6033df670cb19999dd738025953c64e0039a76b88716af89ff56c |
| mario-rainbow-castle:shop:3 | single_source | single_source | 89df8fbb2afe68cfc30da37b53018fc5b2a84ee7e5016a3de9620fd08d1b9e95 |
| mario-rainbow-castle:shop:4 | single_source | single_source | 4533f4ee06a3c2fdce0259bdb972b3e2a329529d6518559d5e2a025644f26d4b |
| mario-rainbow-castle:shop:5 | single_source | single_source | bafcf36a15728b2ad14001bf94103e9169b297dec4f57f87011c9853d439bf0c |
| western-land:board_record | partial | partial | 9a44d8d979940aba5f4d3faa82b75d9f9c3e46c5c90560a91d2dfc67b171660b |
| western-land:map_description | single_source | single_source | f3c3de46e8145a6e025febd7bdf86d463e6647d4e25c0366596de7590c734efa |
| western-land:profile:baseline_party | single_source | single_source | 9d00177de9dec4f3e08a0602cd1e6ca0db202f6e786793a61ba6f0122efb6a83 |
| western-land:profile:tv_tag_team | single_source | single_source | ae86959a3acde82fbd21bf99330b7cf32aae30c765a0e026f70d2c4ae2ad615f |
| western-land:shop:0 | single_source | single_source | 122a92bb9f85fcf2d9a144d4859db91641baa135e62a0bb34923892d14f05e5f |
| western-land:shop:1 | single_source | single_source | 9dcad4b2d43248567e2b79e2b926956be72c8c15314460767ed289a3b929debc |
| western-land:shop:2 | single_source | single_source | 901da26844d1d9bc2d1189cbc2d6f3a6ffe75bf8795a1de8d465b0064dd874da |
| western-land:shop:3 | single_source | single_source | 88b7d8ee27b26ac730a3f0cf95e2c429e97471555d2b196c7798fcf109710374 |
| western-land:shop:4 | single_source | single_source | 737a502fed7d6535cd5f8af77af7c117d35283b0360ad57e9407bd86e26c3ae0 |
| map_asset:wiggler | single_source | single_source | 8c5bcb5558766d151ad09be3c8eee4f0034724b74315801b332678c9d2b15751 |
| map_asset:galleria | single_source | single_source | c67edb0493377a8e9da8bbe2b4b151f40c30d0134e48b151d4dc9c38047e4b2d |
| map_asset:lagoon-low | single_source | single_source | cd697fa8c59888502cac488a850bb8fbb03043e7c46e5258d5a63763fcf3d902 |
| map_asset:lagoon-high | single_source | single_source | 5f9c362452813654208c666af8c25851d3106501972730a514dbd71ad22668f3 |
| map_asset:raceway | single_source | single_source | 0da30d633f29f742658c1f2747d058d188b712b043e2469d9bb685e448a7035e |
| map_asset:raceway-swapped | single_source | single_source | a861b94adae7fba1f0da98cad4b62663ee416dac08a6fc3053e7812dbd210c36 |
| map_asset:keep | single_source | single_source | 0a4a420dc0ed8e6a8c96fc2b115f480746a9ab5e2294349713a47fb1c1f0117b |
| map_asset:castle | single_source | single_source | 827fa40cca13e4092a11225c5de9ab5a0012f9eb822920c54e2da58565b8380a |
| map_asset:castle-bowser | single_source | single_source | 94b80dcedf48140a3793c45ea6b694767fed7bdbf3163ef2ee10d8c0c7fc9b14 |
| map_asset:western | single_source | single_source | 0a6de4f5d9cfc1856d18e0279f2a43aa13874a3ced0d78bed472035f6077c8d9 |

## UNVERIFIED

487/518 full factual rows remain unresolved: 477 single-source, nine conflicting and one explicitly unknown. All are labeled individually in boards.json, SOURCES.md and board documents; the full row log above retains each outcome. Source agreement on a payout or core rule does not verify a different passing trigger, condition, actor or edition qualifier.

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

## Polish pass 2026-10-08 (Claude, cloud)

Commands, run from `jobs/B04-jamboree-boards` with `PYTHONDONTWRITEBYTECODE=1` (no bytecode left in the folder):

```
$ python3 verify.py --structural
   25 PASS lines, as in validator-output.txt, plus the new suite:
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
STRUCTURAL_RESULT=PASS; suites=25; cases=5391; seed=N/A (deterministic)
EXIT_CODE=0

$ python3 verify.py --strict
   the same 25 PASS lines, then:
FULL_FACTS_TWO_SOURCE=31/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT_CODE=1 (by design)
```

Manifest: `SHA256SUMS.txt` is regenerated last, from every file in the folder except itself (sorted with `LC_ALL=C`), plus the workflow line `../../.github/workflows/B04.yml`. `verify.py --structural --checksums` and `sha256sum -c SHA256SUMS.txt` are run on the regenerated file before the commit.

What was checked:
- `BOARD_DOC_TABLES_MATCH_JSON` (new suite): the 16 count tables and the 35 shop tables in `boards/*.md` equal `boards.json` cell for cell. Before this suite nothing in the verifier compared the document tables with the JSON.
- Board figures in `DESIGN-DIGEST.md` (space mix, shop price bands, event and phase counts, Star and Homestretch facts) were recomputed from `boards.json` with a scratch script; the scratch files are not committed.
- The seven boards' events, phases, Homestretch and star rows were read in `boards.json`. The Mega Wiggler document was read in full. The prose of the other six documents was not re-read line by line.
- PR #18 at the start of this pass: draft, open, head `484dbbf`, read through the REST API. Its CI run 37679637130 for `484dbbf` concluded success.

Changed:
- `verify.py`: `BOARD_DOC_TABLES_MATCH_JSON` and the markdown table parser (structural suites 24 to 25; cases 5,338 to 5,391).
- `DESIGN-DIGEST.md` (new): design reading with [C], [S], [X], [?] tags, PartyBox mapping, limits.
- `INTEGRATION.md` (new): status Reference only, port steps, presentation plan, gaps, polish-pass record.
- `README.md`: top block (what, how, status) and the verification counts.
- `ASSUMPTIONS.md`, `LOOP.md`: one appended line each.
- `VERIFY.md`: this section. `SHA256SUMS.txt`: regenerated.

Not changed: no factual row in `boards.json` or any `boards/*.md` table. No source was re-fetched in this pass (the offline verifier makes no freshness claim), no map image was retrieved, and no PR comment, review, merge or close was made. PR #18 stays a draft.

### 2026-10-09 scoped addition

Western Land unlock is now 32/518 complete facts, with 476 single-source, nine conflicts and one unknown. Only that factual row and its board-content fingerprint changed. The original broad audits retain their original dates and unchanged gates; today’s checks validate current file integrity, not a new human review of all historical source facts. PR18 stays draft and strict research is expected to fail. Current exact command results are recorded in validator-output.txt after execution.

The first scoped structural run returned actual exit2 because the containing western-land:board_record fingerprint had not yet been updated. The unchanged original check caught the omission. The exact original retained-row identity was then refreshed; no validator or acceptance gate was changed. Subsequent command results are recorded, and the manifest is regenerated after this receipt.

### Galleria full-qualifier check, 2026-10-09

The single narrow Super Shop event now has two independently authored sources;33/518 complete facts,475 single-source,9 conflicts,1 unknown. Only that fact and its containing board have new row fingerprints. All original checks, schema, strict requirements and workflow are unchanged. Original667hostedCI run 37894352773 / verify 113702166642 succeeded 06:35:57; its complete 21,432-byte native log SHA220e4481dca0c5384b9472cbc81a37c808bafcf82f2eda89d10b17ed274c6973 is historical for this new source milestone and documents strict 32/518 FAIL / 37/38 FAIL. New exact command output follows in validator-output.txt after execution.

Current full structural command:25/25suites,5,426/5,426cases PASS, exit0. The full original strict command actually returns1:33/518complete facts FAIL,37/38known current events FAIL. Manifest is regenerated after these results and checked separately; structural integrity does not certify completed research.

### Scoped original Korean numeric review, 2026-10-09

Current87/518 independent complete facts;412 single-source,18 unresolved disputes,1 unknown. Exactly63 ordinary type facts reviewed against both publishers in actualA/B captures (252 numeric observations),54 medium matches and9 low disagreements. Only those63 facts and their7 containing profiles/7 boards receive refreshed fingerprints; all518 values, profile totals and prior9 conflicts remain identical. Broad original audits retain historical dates. No source body, expressive author quotation or English-mirror second source is published. Unchanged original checks must pass; strict remains NOT_MET. Whole genuine prior44b5 hosted run37899943053/job113719886950 accepted original26 suites/5505 cases/78 manifest and strict33/518FAIL at07:36:07, full21429-byte native SHAac09f12b5aba9eb135e98631be0dfa176516e1af664a2494859a90a1862bf37e; that is historical for this new adoption, not current CI proof. Current original local outputs are recorded in validator-output.txt after actual execution.

Actual local original commands completed2026-10-09T07:47:24–25Z:structural/checksum exit0,26 suites/5633 cases/81 manifest PASS;strict exit1,87/518FACTS FAIL and37/38EVENTS FAIL/NOT_MET. Whole current outputs are in validator-output.txt. Manifest regeneration and final unchanged command/readback remain required after packaging.

### Castle scoped qualifier review, 2026-10-09

Exactly one full fact and its containing board fingerprint change. Current88/518 facts,411 single-source,18 conflicts,1 unknown;37/38 events. All original schema/verifier/requirements/workflow unchanged. Whole exact parent47f hosted run37904587791/job113734870677 succeeded08:22:56:26 suites/5635 cases/82 manifest, but strict87/518 and37/38 FAIL. Complete21434-byte original native SHA faf2288e3a1c82dc0bef6a07d4d6704211ff3aa0a78c0b5fc27304051daddeee is historical for this new milestone. Current local original full output is validator-output.txt after actual execution; new hosted whole proof remains pending publication. Original old broad audits remain dated historical.

2026-10-09T08:42:05.358282+00:00:Combined Castle scope is89/518,410single-source,18conflicts,1unknown; exactly2 fact verdicts and3 containing fingerprints updated. All518 values and516 other objects, all original gates and18 conflicts unchanged. Current local original outputs follow actual commands in validator-output.txt; new complete hosted native acceptance remains pending publication. Previous47f whole26/5635/82 proof is dated history.

2026-10-09T09:09:06.322549+00:00: Gold Shop current scoped recovery90/518,409single-source,18conflict,1unverified. Exactly one complete fact verdict and its containing board fingerprint change; all518 factual values and517 other full fact objects unchanged. Original verifier/schema/workflow/gates and18 conflicts remain unchanged. Prior1fc full original run37907122367/job113743154384 naturally closed08:47:29:26suites/5663cases/86manifestPASS; strict89/518FAIL37/38FAILactual1; entire21436-byte nativeSHA b1622ac23487ab3f49051977c7c02d062e15a3cfc10fb253973850ed1cdddbd1. This is historical for the new Gold source. Its own complete current original acceptance remains pending publication. Prior47f source lateness92seconds remains recorded;1fc source interval24m31s met cadence.

2026-10-09T09:10:10.648638+00:00: Actual new Gold local original command outputs recorded in validator-output.txt: structural/checksum exit0, strict actual1/90of518FAIL/37of38FAIL/NOT_MET. Both complete command stdout/stderr and timestamps retained privately. New source-candidate report adds zero original author words and no additional factual promotions; launch-day advance play scope is explicit. After recording these real outputs, all88 exact manifest entries are resealed and original full checks rerun to cover the final packaged bytes.

- 2026-10-09T09:33:36.137849+00:00: Parent5dd full original run37909673282/job113751529217 naturally closed09:11:40:26suites/5671cases/88manifest structural PASS, strict actual1/90of518FAIL/37of38FAIL/NOT_MET. Entire native21436B SHA51a497233308ecd0535d0379c0e7436049a8671aef9a51d3d4d6b99426f811c0 personally read, checkout04bc8c3aac0de047ca9eeaf1bb473e88e09879e9 explicitly merges exact5dd into92ef1b3dded085727509345aa22bd8b59fa0c1b8. This is dated parent proof for the new substantive visual checkpoint, whose exact full native remains pending. All original product/source registries/verifier/schema/workflow/rejection fixtures/gates/conflicts remain byte-identical.

2026-10-09T10:02:16.469208+00:00: One complete Milk event independently corroborated91/518 with two refreshed row fingerprints; all518 values/517 other full facts/18 conflicts/gates unchanged. Parent cfce full original26/5673/89 naturallyclosed09:36:28, nativeSHA2f57ce7deb80379ca61464b920867c5e0be6721462d2f85beb920abfbb06a4c9, is dated historical proof for this new source. Current local original commands and exact hosted whole run remain required.


2026-10-09T10:24:34.944093+00:00: Complete fresh Steamer original A/B10683-character articles and all current502-character chapter/12references were read after two real HTTP200 captures naturally closed10:18:16.709828. Ordinary3/6 fares agree with original Namu; availability quotes/photos share Nintendo dialogue provenance, so whole train remains UNADOPTED single-source. Complete Cel1691/Wiki2580 tide scopes received an actual negative independent peer; no tide-switch promotion or extra Cel clips. See reports/train-tide-source-scope-checkpoint-20261009.json. All518 wholefacts/values/593fingerprints/18conflicts/registries/gates byteunchanged; Namu250/Cel131 held. Parent d9 original26/5693/92 and strict91FAIL37FAILNOT_MET remain dated proof; current next exact whole CI required after publication.

Actual original local commands for train/tide UNADOPTED checkpoint (no product or quote changes):

```text
$ python verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 60/60
PASS UNIQUE_ID_COLLECTIONS: 31/31
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 710/710
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 29/29
PASS EVERY_SOURCE_REOPENED_A_B: 54/54
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 792/792
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 54/54
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 95/95
PASS SHA256_MANIFEST: 94/94
STRUCTURAL_RESULT=PASS; suites=26; cases=5697; seed=N/A (deterministic)
Actual exit 0

$ python verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 60/60
PASS UNIQUE_ID_COLLECTIONS: 31/31
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 710/710
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 29/29
PASS EVERY_SOURCE_REOPENED_A_B: 54/54
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 792/792
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 54/54
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 95/95
STRUCTURAL_RESULT=PASS; suites=25; cases=5603; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=91/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
Actual exit 1
```

2026-10-09T10:50:43.256606+00:00: Current two Skeleton Key gate facts gain independent medium support for the missing3-coin price via complete original H1g editorial table versus Wiki price cell; existing complete MPL item row confirms gate use and both board names but its price is blank. All518values/516otherfacts/18conflicts unchanged; only4review fingerprints. 93/518 corroborated,406single-source,18conflicts,1unknown;37/38 events, originalNOT_MET/PR18Draft. See reports/skeleton-key-price-recovery-20261009.json. Original Namu250/Cel131 ledgers/gates/captures remain unchanged. Parent75900 whole original26/5697/94 structuralPASS/strict91FAIL37FAIL actual1 is historical; exact next whole hosted acceptance remains pending publication.


2026-10-09T10:50:44.803799+00:00: Actual full original local Skeleton Key recovery commands, source parent75900; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 712/712
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 99/99
PASS SHA256_MANIFEST: 98/98
STRUCTURAL_RESULT=PASS; suites=26; cases=5717; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 712/712
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 99/99
STRUCTURAL_RESULT=PASS; suites=25; cases=5619; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=93/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```

2026-10-09T11:20:46.113893+00:00: Actual fresh full original MPL5992A/B and Namu ordinary Star452/type5881 A/B scopes read. Four ordinary moving-Star complete candidates remain UNADOPTED pending whole-scope peer; all518facts/values/593fingerprints/18conflicts/registries/capturetimes byteunchanged,93/518 and37/38 originalNOT_MET/PR18Draft. Keep fresh named chapter lacks movement statement; Raceway lap formula does not yet independently close retained arch trigger. No new quotes; sharedNamu250/Cel131 unchanged. Read reports/ordinary-moving-star-scope-UNADOPTED-20261009.json.


2026-10-09T11:20:47.658264+00:00: Actual full original local unadopted ordinary-Star full-scope checkpoint commands, source parent150324; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 712/712
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 100/100
PASS SHA256_MANIFEST: 99/99
STRUCTURAL_RESULT=PASS; suites=26; cases=5719; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 712/712
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 100/100
STRUCTURAL_RESULT=PASS; suites=25; cases=5620; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=93/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```

2026-10-09T11:25:34.542209+00:00: Current four ordinary moving-Star purchase facts gain complete medium independent support via whole named MPL chapters and whole Namu ordinary Star/type contexts. All518values/514otherfacts/18conflicts unchanged,8fingerprints, zero new quotes/registry/capture changes. 97/518corroborated,402single-source,18conflicts,1unknown;37/38events,originalNOT_MET/PR18Draft. Read reports/ordinary-moving-star-recovery-20261009.json. Parent8ae2 whole26/5719/99PASS/strict93FAIL37FAILactual1 is historical; new actual entire hosted acceptance pending publication.


2026-10-09T11:25:37.718741+00:00: Actual full original local four ordinary-Star recovery commands, source parent8ae2; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 716/716
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 102/102
PASS SHA256_MANIFEST: 101/101
STRUCTURAL_RESULT=PASS; suites=26; cases=5727; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 716/716
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 102/102
STRUCTURAL_RESULT=PASS; suites=25; cases=5626; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=97/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T11:54:05.000862+00:00: Actual full original local unadopted Wiggler and Atwiki scope checkpoint commands, source parentbbad3; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 716/716
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 106/106
PASS SHA256_MANIFEST: 105/105
STRUCTURAL_RESULT=PASS; suites=26; cases=5735; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 716/716
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 18/18
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 106/106
STRUCTURAL_RESULT=PASS; suites=25; cases=5630; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=97/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```

2026-10-09T12:05:23.144038+00:00: Current100/518corroborated,398single-source,19unresolveddisagreements,1unknown;37/38events. Only4ordinary angry-Wiggler typed facts change:11/6/4mediumagree,blueNamu21vWiki24LOWconflict retaining24. All518values/514otherfullfacts/18oldconflicts/profilemetadata+totals unchanged;6fingerprints,0newquotes. Complete source state labels and normal-v-TagTeam columns guarded; no fullprofile/othermode/total promotion. Read reports/wiggler-angry-count-recovery-20261009.json; originalNOT_MET/PR18Draft. Historical67f whole26/5735/105PASS and strict97FAIL37FAILactual1 is parent proof; new next exact hosted acceptance pending publication.


2026-10-09T12:05:43.997909+00:00: Actual full original local four explicit ordinary angry-Wiggler type comparisons commands, source parent67f380; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 108/108
PASS SHA256_MANIFEST: 107/107
STRUCTURAL_RESULT=PASS; suites=26; cases=5744; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 108/108
STRUCTURAL_RESULT=PASS; suites=25; cases=5637; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=100/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T12:27:52.155712+00:00: Actual full original local three complete native source-scope negatives checkpoint commands, source parent488ea; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 111/111
PASS SHA256_MANIFEST: 110/110
STRUCTURAL_RESULT=PASS; suites=26; cases=5750; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 111/111
STRUCTURAL_RESULT=PASS; suites=25; cases=5640; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=100/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T12:49:27.071440+00:00: Actual full original local two complete original shop/TV scope checkpoint commands, source parenteddb9a; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 114/114
PASS SHA256_MANIFEST: 113/113
STRUCTURAL_RESULT=PASS; suites=26; cases=5756; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 114/114
STRUCTURAL_RESULT=PASS; suites=25; cases=5643; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=100/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T13:20:00.257518+00:00: Actual full original local whole original Raceway scope checkpoint commands, source parentbfd836; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 117/117
PASS SHA256_MANIFEST: 116/116
STRUCTURAL_RESULT=PASS; suites=26; cases=5762; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 117/117
STRUCTURAL_RESULT=PASS; suites=25; cases=5646; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=100/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T13:48:05.785246+00:00: Actual full original local Keep Star citation-scope correction commands, source parent122356; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 121/121
PASS SHA256_MANIFEST: 120/120
STRUCTURAL_RESULT=PASS; suites=26; cases=5770; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 720/720
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 121/121
STRUCTURAL_RESULT=PASS; suites=25; cases=5650; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=100/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T14:08:45.061354+00:00: Actual full original local one ordinary regional train-link adoption commands, source parente731; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 722/722
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 124/124
PASS SHA256_MANIFEST: 123/123
STRUCTURAL_RESULT=PASS; suites=26; cases=5778; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 722/722
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 124/124
STRUCTURAL_RESULT=PASS; suites=25; cases=5655; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=101/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```


2026-10-09T14:31:43.382382+00:00: Actual full original local material native ticket image scope checkpoint commands, source parent316; whole outputs below. Source-specific hosted original CI pending next publication. Gates/schema/workflow unchanged.

```text
$ python3 verify.py --structural --checksums
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 722/722
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 128/128
PASS SHA256_MANIFEST: 127/127
STRUCTURAL_RESULT=PASS; suites=26; cases=5786; seed=N/A (deterministic)

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 62/62
PASS UNIQUE_ID_COLLECTIONS: 32/32
PASS SEVEN_BOARD_TWO_PUBLISHER_ROSTER: 7/7
PASS EVERY_RECORDED_FACT_HAS_SOURCE: 518/518
PASS FACT_QUOTATION_REFERENCES: 722/722
PASS SHORT_QUOTE_BUDGETS_AND_LINEAGES: 30/30
PASS EVERY_SOURCE_REOPENED_A_B: 56/56
PASS QUOTATIONS_RECOVERED_BOTH_PASSES: 794/794
PASS SOURCE_CAPTURE_REPORT_REFERENCES: 56/56
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
PASS REVIEWED_ROW_CONTENT_FINGERPRINTS: 593/593
PASS BOARD_DOCUMENT_REQUIRED_SECTIONS: 7/7
PASS BOARD_DOC_TABLES_MATCH_JSON: 51/51
PASS ALL_FACTUAL_CONFLICTS_PRESERVED: 19/19
PASS DELIBERATE_REJECTION_FIXTURES: 14/14
PASS FILE_SIZE_LIMIT: 128/128
STRUCTURAL_RESULT=PASS; suites=25; cases=5659; seed=N/A (deterministic)
FULL_FACTS_TWO_SOURCE=101/518; FAIL
CURRENT_EVENT_TRIGGER_EFFECT=37/38; FAIL
EXACT_NUMBERED_MAPS=0/7; descriptive UNVERIFIED provenance; cited regional maps supplied
NINTENDO_GAMEPLAY_EXECUTED=NO
STRICT_RESEARCH_RESULT=NOT_MET; exit=1

Actual exit codes0 and1 respectively.
```
