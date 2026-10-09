# VERIFY — complete draft catalogue, incomplete research

Current proof is the final machine report, current catalogue-second-pass row fingerprints and the latest authored-tip section below. Earlier pasted outputs and row tables retain their historical checkpoint scope.


**Original B03 acceptance: NOT_MET.** All 132 requested JSON/CSV rows exist and the full structural/evidence suite passes. Detailed independent mechanics and the second complete wiki roster remain unverified. CI integrity success is separate from research completion.

Executed under Python 3.12.14, jsonschema 4.26.0 and beautifulsoup4 4.15.0. Deterministic research checks use seed n/a. Reports include actual counts, never estimated gameplay execution.

## Full offline verification

Exact command from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes
```

| Test name | Case count | Passed | Seed | Exact command |
| --- | ---: | --- | --- | --- |
| Six closed Draft 2020-12 data schemas | 6 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| All delivery JSON rejects duplicate keys | 44 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Canonical 132-row union and 112/20 edition scope | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Every row has every required field and exact canonical name | 2376 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Case/punctuation-insensitive name uniqueness | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Counts versus independently reopened lists and raw disagreements | 10 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Exact JSON/CSV field round trip | 2376 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Field citations and true publisher lineage boundaries | 1320 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Short clips, quote budgets and complete A/B recovery | 2301 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Literal controller labels and 25 base motion entries | 370 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Original two-sentence summaries and phone assessments | 396 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Independent publisher families for all 132 narrow core-gameplay summaries | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| ScreenRant/TheGamer shared-Valnet lineage rejection | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Full row audit bindings and complete reopened source contexts | 563 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Unknown awards, returning editions, timer scopes and conflict retention | 157 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Fifteen material conflicts preserved | 15 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Exact reward/gameplay quote witnesses bound to both article captures | 84 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Four isolated malformed reward-capture fixtures | 4 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Closed schema and exact per-row remaining research-gap ledger | 133 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Three closed source-reopening report schemas | 3 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| All 148 source URLs reopened twice with ordered HTTPS/TLS records | 296 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Every recovered reopen quotation bound to the original registry | 3738 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Sixteen isolated malformed reopening-proof fixtures | 16 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Fifteen isolated hostile catalogue/evidence fixtures | 15 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Draft 2020-12 JSON Schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Expected HTTPS publishers, effective scopes, and distinct verified snapshots | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Counts versus two publisher catalogues and official additions count | 14 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Case/punctuation-insensitive duplicate and edition-overlap checks | 660 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Fresh second-pass list rows and all short source quotations | 275 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Every row and HTTPS game link bound to exact pass-two extraction | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Complete exact per-row citation multisets, without duplicates or substitutes | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Every archived/index quotation at most 25 words | 600 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Exact base/TV/combined source sets and spelling disagreements | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Reconstructed exact category-difference groups and membership | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical index / Independent base category and raw TV group count claims | 24 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Draft 2020-12 JSON Schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Expected HTTPS publishers, effective scopes, and distinct verified snapshots | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Counts versus two publisher catalogues and official additions count | 14 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Case/punctuation-insensitive duplicate and edition-overlap checks | 660 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Fresh second-pass list rows and all short source quotations | 275 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Every row and HTTPS game link bound to exact pass-two extraction | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Complete exact per-row citation multisets, without duplicates or substitutes | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Every archived/index quotation at most 25 words | 600 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Exact base/TV/combined source sets and spelling disagreements | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Reconstructed exact category-difference groups and membership | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh index / Independent base category and raw TV group count claims | 24 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / json_schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / unique_index_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / index_bound_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / short_quotes | 987 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / field_reference_lists | 1056 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / source_pass_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / https_url_tls_hash_byte_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / ordered_pass_timestamps | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved historical article / coverage_totals | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / json_schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / unique_index_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / index_bound_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / short_quotes | 987 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / field_reference_lists | 1056 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / source_pass_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / https_url_tls_hash_byte_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / ordered_pass_timestamps | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved fresh article / coverage_totals | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved guard / check-validator-rejections.py | 6 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved guard / test-gameplay-evidence.py --evidence gameplay-leads.json | 16 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Preserved guard / test-gameplay-evidence.py --evidence current-article-leads.json | 16 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Every delivered file below 30 MB | 71 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |
| Complete SHA-256 delivery manifest | 70 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes` |

Current complete manifest verification: **69 suites / 24,475 cases**, covering 70 hashes. The retained machine report and pasted output below describe the non-manifest stage; the final command additionally checks every hash.

All preserved index/article suites run against both original evidence and fresh retained captures. Original helper files remain unchanged. Fifteen catalogue fixtures reject missing controls, invalid ratings/names/citations, invented star awards, false completion, wrong summary/timer scopes, lost availability/motion conflicts, false lineage, overlong clips and altered row fingerprints. Sixteen reopen fixtures reject incomplete/duplicated/invented sources, changed URLs/passes, failed TLS/HTTP, false byte/hash data, reordered timestamps, changed/missing clips, full-HTML publication and false summaries.

Actual validator output before final manifest pass (68 suites / 24,405 cases):

```text
PASS Six closed Draft 2020-12 data schemas: 6 cases; seed=n/a
PASS All delivery JSON rejects duplicate keys: 44 cases; seed=n/a
PASS Canonical 132-row union and 112/20 edition scope: 132 cases; seed=n/a
PASS Every row has every required field and exact canonical name: 2376 cases; seed=n/a
PASS Case/punctuation-insensitive name uniqueness: 132 cases; seed=n/a
PASS Counts versus independently reopened lists and raw disagreements: 10 cases; seed=n/a
PASS Exact JSON/CSV field round trip: 2376 cases; seed=n/a
PASS Field citations and true publisher lineage boundaries: 1320 cases; seed=n/a
PASS Short clips, quote budgets and complete A/B recovery: 2301 cases; seed=n/a
PASS Literal controller labels and 25 base motion entries: 370 cases; seed=n/a
PASS Original two-sentence summaries and phone assessments: 396 cases; seed=n/a
PASS Independent publisher families for all 132 narrow core-gameplay summaries: 132 cases; seed=n/a
PASS ScreenRant/TheGamer shared-Valnet lineage rejection: 1 cases; seed=n/a
PASS Full row audit bindings and complete reopened source contexts: 563 cases; seed=n/a
PASS Unknown awards, returning editions, timer scopes and conflict retention: 157 cases; seed=n/a
PASS Fifteen material conflicts preserved: 15 cases; seed=n/a
PASS Exact reward/gameplay quote witnesses bound to both article captures: 84 cases; seed=n/a
PASS Four isolated malformed reward-capture fixtures: 4 cases; seed=n/a
PASS Closed schema and exact per-row remaining research-gap ledger: 133 cases; seed=n/a
PASS Three closed source-reopening report schemas: 3 cases; seed=n/a
PASS All 148 source URLs reopened twice with ordered HTTPS/TLS records: 296 cases; seed=n/a
PASS Every recovered reopen quotation bound to the original registry: 3738 cases; seed=n/a
PASS Sixteen isolated malformed reopening-proof fixtures: 16 cases; seed=n/a
PASS Fifteen isolated hostile catalogue/evidence fixtures: 15 cases; seed=n/a
PASS Preserved historical index / Draft 2020-12 JSON Schema: 1 cases; seed=n/a
PASS Preserved historical index / Expected HTTPS publishers, effective scopes, and distinct verified snapshots: 8 cases; seed=n/a
PASS Preserved historical index / Counts versus two publisher catalogues and official additions count: 14 cases; seed=n/a
PASS Preserved historical index / Case/punctuation-insensitive duplicate and edition-overlap checks: 660 cases; seed=n/a
PASS Preserved historical index / Fresh second-pass list rows and all short source quotations: 275 cases; seed=n/a
PASS Preserved historical index / Every row and HTTPS game link bound to exact pass-two extraction: 132 cases; seed=n/a
PASS Preserved historical index / Complete exact per-row citation multisets, without duplicates or substitutes: 132 cases; seed=n/a
PASS Preserved historical index / Every archived/index quotation at most 25 words: 600 cases; seed=n/a
PASS Preserved historical index / Exact base/TV/combined source sets and spelling disagreements: 8 cases; seed=n/a
PASS Preserved historical index / Reconstructed exact category-difference groups and membership: 8 cases; seed=n/a
PASS Preserved historical index / Independent base category and raw TV group count claims: 24 cases; seed=n/a
PASS Preserved fresh index / Draft 2020-12 JSON Schema: 1 cases; seed=n/a
PASS Preserved fresh index / Expected HTTPS publishers, effective scopes, and distinct verified snapshots: 8 cases; seed=n/a
PASS Preserved fresh index / Counts versus two publisher catalogues and official additions count: 14 cases; seed=n/a
PASS Preserved fresh index / Case/punctuation-insensitive duplicate and edition-overlap checks: 660 cases; seed=n/a
PASS Preserved fresh index / Fresh second-pass list rows and all short source quotations: 275 cases; seed=n/a
PASS Preserved fresh index / Every row and HTTPS game link bound to exact pass-two extraction: 132 cases; seed=n/a
PASS Preserved fresh index / Complete exact per-row citation multisets, without duplicates or substitutes: 132 cases; seed=n/a
PASS Preserved fresh index / Every archived/index quotation at most 25 words: 600 cases; seed=n/a
PASS Preserved fresh index / Exact base/TV/combined source sets and spelling disagreements: 8 cases; seed=n/a
PASS Preserved fresh index / Reconstructed exact category-difference groups and membership: 8 cases; seed=n/a
PASS Preserved fresh index / Independent base category and raw TV group count claims: 24 cases; seed=n/a
PASS Preserved historical article / json_schema: 1 cases; seed=n/a
PASS Preserved historical article / unique_index_rows: 132 cases; seed=n/a
PASS Preserved historical article / index_bound_rows: 132 cases; seed=n/a
PASS Preserved historical article / short_quotes: 987 cases; seed=n/a
PASS Preserved historical article / field_reference_lists: 1056 cases; seed=n/a
PASS Preserved historical article / source_pass_records: 264 cases; seed=n/a
PASS Preserved historical article / https_url_tls_hash_byte_records: 264 cases; seed=n/a
PASS Preserved historical article / ordered_pass_timestamps: 132 cases; seed=n/a
PASS Preserved historical article / coverage_totals: 8 cases; seed=n/a
PASS Preserved fresh article / json_schema: 1 cases; seed=n/a
PASS Preserved fresh article / unique_index_rows: 132 cases; seed=n/a
PASS Preserved fresh article / index_bound_rows: 132 cases; seed=n/a
PASS Preserved fresh article / short_quotes: 987 cases; seed=n/a
PASS Preserved fresh article / field_reference_lists: 1056 cases; seed=n/a
PASS Preserved fresh article / source_pass_records: 264 cases; seed=n/a
PASS Preserved fresh article / https_url_tls_hash_byte_records: 264 cases; seed=n/a
PASS Preserved fresh article / ordered_pass_timestamps: 132 cases; seed=n/a
PASS Preserved fresh article / coverage_totals: 8 cases; seed=n/a
PASS Preserved guard / check-validator-rejections.py: 6 cases; seed=n/a
PASS Preserved guard / test-gameplay-evidence.py --evidence gameplay-leads.json: 16 cases; seed=n/a
PASS Preserved guard / test-gameplay-evidence.py --evidence current-article-leads.json: 16 cases; seed=n/a
PASS Every delivered file below 30 MB: 71 cases; seed=n/a
```

The final complete report is `reports/final-validation.json`; all delivery files are bound by `SHA256SUMS.txt`.

## Actual complete source reopens

Retained `reports/source-reopens-passA.json` and `passB.json` record every request start/end timestamp, exact URL, successful HTTP 200, TLS result 0, response byte count/hash, original short quote and every recovered quote ID. Both passes cover the same **148 unique URLs**, including three preserved historical supplements. **296 requests, 3,738 quote recoveries, zero missing quotations.** Every second request began after its first request completed. The offline suite validates every record against the original source registry and independently rejects malformed proofs. The network collector uses inherited proxy/CA settings and does not disable TLS verification.

Initial compact source records retain Exa text hashes and request order where the tool did not expose a request timestamp; no timestamp is invented. Later complete curl reopens supply real observed timestamps and response hashes for every retained URL. Matching cached bytes do not imply publisher independence. Full article captures remain external; the source-reopen collector stores compact records and discards temporary complete bodies.

The initial article-capture audit additionally checked 264 raw response hashes/byte lengths and 1,974 section-located quotes against preserved external captures. Its actual report is `reports/capture-bound-validation.json`; `capture-guard-validation.json` retains 18 rejected guard fixtures and 264 raw-capture preflights. Those recorded raw-capture checks are not represented as automatically rerunnable after a fresh clone without the external bodies.

## Second full pass: all 132 published rows

Each row below binds every published field to its exact canonical JSON SHA-256. Both complete article scopes were compared, every retained article clip recovered, and all independent guide contexts reopened. This rechecks the draft including explicit unknowns; it does not convert single-source mechanics into accepted facts.

| ID | English name | Article clips A/B | Independent contexts | Fields checked | Published row SHA-256 |
| --- | --- | ---: | ---: | ---: | --- |
| MG001 | Lumber Tumble | 10/10 | 3 | 18 | `3eea5b44662896d714125186dce32b90fa8dd035efe0116ac3f7a00dd2d64d78` |
| MG002 | Big-Top Quiz | 10/10 | 3 | 18 | `be9996687fbcce9d253d01e1dde07b70ce45adb5c426bcaa58969b36497e2810` |
| MG003 | Camera-Ready | 13/13 | 3 | 18 | `5f17a5238df131e897efc13de98de759b756e98e0383e540562a3907407d3a61` |
| MG004 | Scare-ousel | 11/11 | 3 | 18 | `3b46ff71dc9140c2e8c159faa31dd4a3f5770b91df33a0d72f81589e4a21dd0a` |
| MG005 | Snag the Flags | 9/9 | 3 | 18 | `135e76a45810cb3a58311400b435c3d8960f4b5577a448da64f3ff92c8ebad5b` |
| MG006 | Sandwiched | 10/10 | 3 | 18 | `e8d0779374acd9a43bf26a599643cda81752e8c6615502dee0467430096b1a95` |
| MG007 | Hot Cross Blocks | 9/9 | 3 | 18 | `97f9d00655198a8e04849d6e007a6e795b8f14d726f7e494ca5b32fce22638cf` |
| MG008 | Light-Wave Battle | 8/8 | 3 | 18 | `ab208a02e92bfda866508b577f34d520bc653c707fc752658e6e2e00515b3291` |
| MG009 | Thwomp the Difference | 10/10 | 3 | 18 | `ff377c07b23ec86b6823bb45c46a8ff841d9437465246f8c63ef0ff359e74ef8` |
| MG010 | Cold Front | 10/10 | 3 | 18 | `426b706e680f3e4d225e3bb2dc40d1968491fed5328c0f410eec7ad38baa6688` |
| MG011 | Hot-Hot Hop | 9/9 | 3 | 18 | `2bf3d9cec047d4a0002df753fdd01675b26643578364dae266a73f4d3e06d3fe` |
| MG012 | Domination | 5/5 | 3 | 18 | `87623b57dc03906bb66d75cf1c98699680caee992ee9c73378bf1bd8897a994d` |
| MG013 | Three Throw | 9/9 | 3 | 18 | `15ea2eb053aa197607019ce4f76483978a163492e6a25a7f28a6d0374f3998bb` |
| MG014 | Granite Getaway | 4/4 | 3 | 18 | `3a155027966429770fbec1fbf0e50cd1ee433a6e751d0efbeb80ca029da08ad4` |
| MG015 | Tilt-a-Golf | 12/12 | 3 | 18 | `84fe9f02e73b6bae5ef0dc0ddd03c54867b62ebf2dd108e41f67948c3d7505e5` |
| MG016 | Night Lights | 8/8 | 3 | 18 | `52cc0fc77fafc02f4d5e90dd0f9d1ca4e5af57bba2ef2d4e9ed71ec5d2156af6` |
| MG017 | Hammer It Home | 9/9 | 3 | 18 | `796780007fe5b95544094bd6e2fe09adb700204ea79e5455defc366393532fa3` |
| MG018 | Twist and Sort | 7/7 | 3 | 18 | `12697acd1434fbf343b02786b1bca97d21d7bc0fff28180d86f8374cc9d34976` |
| MG019 | Shuttle Scuttle | 7/7 | 3 | 18 | `5e1e591f5981efd0c3553efe6888e9c6201b75c51362547f2f5a17e5acd9d7da` |
| MG020 | Tiny Triathlon | 10/10 | 3 | 18 | `48dda500ea2d320bb3c07d2652697dc4099bb623654b5dc3254fe70eb43f958d` |
| MG021 | Pickax Dash | 9/9 | 3 | 18 | `3810d199a302111c9c8b44643d455f31858230220d7ca4c9e98f3c1048f6cdc9` |
| MG022 | Gate Key-pers | 10/10 | 3 | 18 | `c7689601cb4713c0e53f96ff2812ddc58f9d72d5e0b19d4b806c4cde4dbf95c7` |
| MG023 | Sled to the Edge | 10/10 | 3 | 18 | `c6881cce6086c192cc0b028242d2521caa4d9c2051f8567e0ad9ddf1b2b89c6e` |
| MG024 | Rinks to Riches | 12/12 | 3 | 18 | `9967ffa9fa9a4c2e3f80b7a869a860acc5dab0b30532412643c11dd681fdd48a` |
| MG025 | Treetop Treasure | 13/13 | 3 | 18 | `0ed303138469d2635c07a8a5933f0cbd9f74bf59799d1343a133c1168f290d01` |
| MG026 | Treasure Divers | 5/5 | 3 | 18 | `c3c3fdb7eac0fd8a1952fabe51b3896f21e643e69ecce0ae77d47321cdb2cc66` |
| MG027 | Platform Peril | 5/5 | 3 | 18 | `971694fe90cbe16cf47bc8ab8ace309fe806ec1ff8296e580b92bbdbab86d49b` |
| MG028 | Stamp Out! | 5/5 | 3 | 18 | `d812d9c15e4be61a3b126b617ed573f8feac34afae8347544e402fd64eda568a` |
| MG029 | Trample-line | 8/8 | 3 | 18 | `8e183fa66e96584280c1285697985556c0d5b215bc69f930093c7513220b0e43` |
| MG030 | Sunset Standoff | 6/6 | 3 | 18 | `292c7038e84aa55c82c08e1cb1cf074fab5d8999766823f4b96a5643be64bc2c` |
| MG031 | Cookie Cutters | 11/11 | 3 | 18 | `aa9e48c5593c9b1473ab814670e3c823e170396725e5bc106daca18e8298b4a9` |
| MG032 | Unfriendly Flying Object | 10/10 | 3 | 18 | `ff5b517ce249e7e0c93d9ec18bf89dd2845a83368c16d33cbe8e401518ba07ce` |
| MG033 | Lost and Pound | 7/7 | 3 | 18 | `e890571b20a00a5f6a59bd3f2d84718cd2a798978bb76a452fa4f02ee44ca68a` |
| MG034 | Arch Rivals | 10/10 | 3 | 18 | `a091f3010d4551b4a725871308f661c0bf63e852aec1b1d355a7791e0a7e86f7` |
| MG035 | On-Again, Off-Again | 10/10 | 3 | 18 | `3be777d49463edf96080ff9f5507d6fe513e8f9c50175b0d742e905d76b6b5e4` |
| MG036 | Broozer Bash | 10/10 | 3 | 18 | `1f8f968199a2ec3048ca84f8362ebd861bd86170b74d711db5be707f670ac040` |
| MG037 | Cage Catch | 10/10 | 3 | 18 | `c3ae3ce067c0832ccf949aa8284ee6d3cef1d4141487cefd95d3d94ad1cce038` |
| MG038 | Income Stream | 8/8 | 3 | 18 | `c423bf737c15391146471bde5ae5a839799a8f79c76127b14eaedc5c6241ef96` |
| MG039 | Blame It on the Crane | 7/7 | 3 | 18 | `389105c916efb6cbd20d38daaebf976da14b96cff09214a4f5e9fcbb8d94748c` |
| MG040 | Snow Brawl | 6/6 | 3 | 18 | `167766b5885246263bd5a0eb8b76e11a74d3d1fe4185d1b1179fdae6f51896f7` |
| MG041 | Squeaky Shakedown | 12/12 | 3 | 18 | `09e8e1cf0b54952baefbf191bcb3969d9ed2f5d4d023be9de3180faecdf69ac1` |
| MG042 | Rocky Rope Race | 7/7 | 3 | 18 | `a731e5f101373ac74c1661a20b44e3e20eba8fd4360b5444db425da0b04fe9ec` |
| MG043 | Pickin' Produce | 9/9 | 3 | 18 | `7ace2636df74ce869193161a1b67c6f5651f2caed278a80b8c57f8758f597093` |
| MG044 | Prime Cut | 12/12 | 3 | 18 | `86f7e299f493252c5179fa96b801a454e6706b4e5e4f40a9d0dac9f060efd910` |
| MG045 | Dorrie Pedal-Paddle | 10/10 | 3 | 18 | `5bcb2978a951921605cdcc4f1e743c413a80857d5730b71194f269f10818a644` |
| MG046 | Robo Arm Wrestle | 6/6 | 3 | 18 | `9baa5e39ba08505d102f5c1367a33f8a18bb74b4e984c0deb519e6122c478caa` |
| MG047 | Shadow Play | 10/10 | 3 | 18 | `c4c3f254086d86418ffaf6ebdfd8f9fd11977e05f1f4bbd1625510e695f60e43` |
| MG048 | Match Makers | 9/9 | 3 | 18 | `469463f507d5bd15ef8fb5e82fcb23a8e53729a4575627ea65b10da402005959` |
| MG049 | Defuse or Lose | 5/5 | 3 | 18 | `dd591775399d2413ba04cad80f053c31139211a0a8c06d47131bf70810bf26a1` |
| MG050 | Jump the Gun | 9/9 | 3 | 18 | `5381a61f93328906ab0a3d712971ddd80982729897dcbce70daa2386f5319e9b` |
| MG051 | Two-Axis Taxi | 9/9 | 3 | 18 | `f002c63fb8d113c3c6ce9d0fc2746467817262f37e5c3b1cff83dfae64482753` |
| MG052 | Tricky Turntable | 8/8 | 3 | 18 | `dbd8c6d77d1fd28f14e85078cda063c6e67f35c93bcb79fb6f01f15b8a02678f` |
| MG053 | Coin Corral | 11/11 | 3 | 18 | `4fb774920d87272e1cd83820f0d95f872044dd036d22937e85c511bd76738bf1` |
| MG054 | Fast Fishing | 8/8 | 3 | 18 | `e69b8d16422d459aa269c75cde201a346be93b81c4f377817f80727240106b40` |
| MG055 | Slappy-Go-Round | 8/8 | 3 | 18 | `7298d7c4b0113a868d338dcc929887071b1c3bd0dd6e4e13e35b342476b573e4` |
| MG056 | Stone-Eye Bowling | 11/11 | 3 | 18 | `acca599b6ebe958fc24ff6c1876b8e9d5cb77736890661ccb5413d3bcd20f1b4` |
| MG057 | Fuzzy Heights | 11/11 | 3 | 18 | `db7e8722a1599b833f09c144cde1f8e909bc0a53f0b6ff51a5777ac3e76833b9` |
| MG058 | All the Marbles | 10/10 | 3 | 18 | `ac502bd17672789502c806e0250da864acf093ed2adcda54d13474c11f5ac399` |
| MG059 | Roll with It | 13/13 | 3 | 18 | `723b0536b8d07b1a3e67890c8fdb226f2170da236ce5f87008c77884fa6586d0` |
| MG060 | Prize Line | 14/14 | 3 | 18 | `61223677c79b9ef07d2058a45a8d88725456d2bb278fee3e1fb3a9dba384a52b` |
| MG061 | A Stone's Throw | 13/13 | 3 | 18 | `4d404224f0e2ba1519331f78ebbe9604a7c9ada67172f187c63c125f17714552` |
| MG062 | Flip 'n Find | 17/17 | 3 | 18 | `054619a05072fe3650e5ea9454c9b2bf822f32bbda896e392c47772f6116a3f5` |
| MG063 | Prize Drop | 9/9 | 3 | 18 | `80e358d28f668e1f501fe4a11cc344813f7f4c8331188caf23649a9208f824c6` |
| MG064 | Mario's Three-peat | 13/13 | 4 | 18 | `6473394e26c0db0b0e483c0d50ebfb395394aa42aaaf33cd3cd31c03598c5f6e` |
| MG065 | Luigi Rescue Operation | 12/12 | 4 | 18 | `90d085b158721fa70e84e8999af45abd35daebf510297d609fec6bc11ba6dfed` |
| MG066 | Peach's Day Off | 13/13 | 4 | 18 | `0bc204ee65d5573be31239a37a943ce584c841ff05633ed81af07aa39c471e4b` |
| MG067 | Daisy's Field Day | 15/15 | 4 | 18 | `88e3e59fe0f7d80bc756f1d15c23257f917d8d00539796109fb3b3e60f062cd9` |
| MG068 | Wario's Buzzer Beater | 12/12 | 4 | 18 | `c807fe563423c29a90ee2fcd8c5bb5164cbbc186f9189530afc65ce9f746ca4c` |
| MG069 | Waluigi's Pinball Arcade | 11/11 | 4 | 18 | `9e44e4dd8820536eb6c237578ccb88f011476ff15d9e1b939aa4aa1589433654` |
| MG070 | Yoshi's Mountain Race | 12/12 | 4 | 18 | `6e19b0d7d93736f39c4dcd8e43e6efa12181eb445e72d21862da223b94403f4f` |
| MG071 | Rosalina's Radical Race | 11/11 | 4 | 18 | `f84b34c4d677d00a9bae3c44ccd4b1a5b009ff37d73f1e3e564b43a3a30084b2` |
| MG072 | DK's Konga Line | 12/12 | 4 | 18 | `3eac664f70bda718a8919c21520c961baa1bc51897b8224bac4ccbd15117f2a8` |
| MG073 | Jr.'s Jauntlet | 14/14 | 4 | 18 | `f1537b561e992801c01cf961c4e1e88284c6f40e82956a44e7276628cd60ad1d` |
| MG074 | Dragoneel Slayers | 10/10 | 3 | 18 | `18da2f139d5bdf114cbe3b3b791dd7d0b33f0be98abcae3845c9b17a32b87d87` |
| MG075 | Mega Stingby Stompers | 8/8 | 3 | 18 | `d261cab1ecd01e1efbcbfed8dff19ce048c81b3fdef2d105a07b3a4d7372dde5` |
| MG076 | Mega Rocky Wrench Wreckers | 8/8 | 3 | 18 | `7f87a2d6a7298b380c772ff832053967ca1c4b7c6ec8d89f09eb7bf5cf24c12c` |
| MG077 | Boss Sumo Bro Blitzers | 11/11 | 3 | 18 | `c1cddbbb7ee732f5bf512859bee97816ed0e4f6a48d982e1fa16d8287925378f` |
| MG078 | Bowser Crashers | 9/9 | 3 | 18 | `0480b5520d7df8dbc1fd1473b75c94972a3d3a39ad42202696d669235c457ef9` |
| MG079 | Noggin Knock | 11/11 | 3 | 18 | `6d0b1db8667fbc8de10cb27f6a9be4db201b849595dfcdffd15f7a456b1988cc` |
| MG080 | Brick Breaker | 11/11 | 3 | 18 | `813cc777e87baafd180924086957bf61c33d1175247a84bb0d0a261d035f160a` |
| MG081 | Gold 'n Brown | 10/10 | 3 | 18 | `6387a8a568983fe07e99d06dde34bd7560a81c46d172944f1e02e100fb1585be` |
| MG082 | Spike's Gambit | 12/12 | 3 | 18 | `4d402c43829cb141e82bc766ca339aa89149a7c4436291d7792473f7a0054b63` |
| MG083 | Down the Hatch | 10/10 | 3 | 18 | `01353f0b13428556fc6bceb07dd79ed34b6091feca2d941352bb7dcdf03a907d` |
| MG084 | Lane Change | 10/10 | 3 | 18 | `a60d363eee74de2b1505e361711a6458592526496bdfb73588cb82268e401322` |
| MG085 | Coin Conveyor | 12/12 | 3 | 18 | `bf1c75fa6e5a417e99ea712c45b6f615151024027748e6cad9999e7d3a0fdcff` |
| MG086 | Which Door Has More? | 9/9 | 3 | 18 | `566333565b7917eb2a2561957a555a1b8bb1c679fecbce18b1d87fb64366b33d` |
| MG087 | Sky-High Cannons | 10/10 | 3 | 18 | `f4ef4cb5e40a6e1a21a44f53a3658bc5076ab8353f4481a57f68f59e1b7f842c` |
| MG088 | Burning Bridges | 9/9 | 3 | 18 | `bc733da4610b0a1cfbe515075adc22a6c4f652af5bb81bce6b2850a83771c5aa` |
| MG089 | Castle Hassle | 10/10 | 3 | 18 | `35e23bc5cab5a975cbb0a0b600fed9ee3827f539aab8c3aae9c2a9bb699852ee` |
| MG090 | Sleight of Shell | 11/11 | 3 | 18 | `3f46b8e20e103fff7a2b1dab2fbd0d56a6c8654b7ff53410bd7336e624f5eb37` |
| MG091 | Fire Away | 8/8 | 3 | 18 | `b22a73999e31516fd602ecc9ebc9cf08cfbedd0bb04f2a24dbf0f06121ea2c19` |
| MG092 | The Floor Is Falling | 10/10 | 3 | 18 | `5e77f1a595925f0e2557c25863e0d48704df95b9413d23b5ebb6660a7a5f0100` |
| MG093 | Juiceworks | 14/14 | 3 | 18 | `de87a054b0851b571591cc640625b42605c4cf401da5c15d7e29e07248956229` |
| MG094 | Ball Volley | 13/13 | 3 | 18 | `7650fcac48caa47bf06d872b53416589f9b71d1920a4712166f26954fb1d70d4` |
| MG095 | Ballistic Bingo | 10/10 | 3 | 18 | `e43bd9881de197bbc635db7fbb4b8f2e7b1e6919ecea69d0dee2678c1f267a1d` |
| MG096 | Bath Bob-ombs | 11/11 | 3 | 18 | `4b487a39cfe4cb6dbed7870b9ce64b22bef2af0184374d1c4374809f7bc1cb61` |
| MG097 | Chomp Wash | 12/12 | 3 | 18 | `7464a5b0bf5d33b78e98979c3d73682af69776f01d4c93ce60d043c60cc4d389` |
| MG098 | Match! That! Item! | 14/14 | 3 | 18 | `0071db64e3d44e67cfe4f3fe083a0993342434560dd1f38c0f25b646cb6a655f` |
| MG099 | Trading Cards | 13/13 | 3 | 18 | `6efef0467622231d1a0e0fff73067be48ac48d017e301446a658a6e42215830a` |
| MG100 | Ski-daddle | 11/11 | 3 | 18 | `ecd81c29856da76e37207f7b19fc7112b07bf6dc0ceab162f4647c6ab0e7283b` |
| MG101 | Look This Way | 12/12 | 3 | 18 | `3847945e856e7c08f44504d13630d9bb1539bd330cd89b6328d692d2de67fa74` |
| MG102 | Puzzle Pandemonium | 14/14 | 3 | 18 | `8b3ae91bf04ef8e308e128c7fec3912117656441bca18b0e1e76dbd35c46bebf` |
| MG103 | Soup Troupe | 9/9 | 4 | 18 | `85db3d4e66567fae3773468c2978e52a453ff436e3d4ce9ac1cf5dad765a11e6` |
| MG104 | Parfait the Course | 9/9 | 4 | 18 | `d063f6a7b228e569c561ac6731a19a7203b9c11595858104d1927c226c099b7a` |
| MG105 | Whisk Cream | 7/7 | 4 | 18 | `eeeac79bbc7437bd01fc6eae4f0db9d03668210a8163be32f02836491db12b3d` |
| MG106 | Spread 'n Butter | 9/9 | 4 | 18 | `f28a313a4c3dcd55979d34c88aeaa2dbcca18ed35017ab313b7c919f97c90693` |
| MG107 | Short-Stack Chef | 7/7 | 4 | 18 | `8cc14afdf6223d043befff4e014ccbf44edcc743839e1924e77ceca469c608c7` |
| MG108 | Burger Builders | 8/8 | 4 | 18 | `702dcbc717aa9e05b4982e32afd574f5471edc02559da902f79e1ccff35c129a` |
| MG109 | Footlong Frenzy | 8/8 | 4 | 18 | `47db2a0153a098e30b24d475c2d3a1ce4c4b44c1de6a5a70cfbbefe12deef3fe` |
| MG110 | Copycat Curry | 9/9 | 4 | 18 | `e71c8dda5513c7393deb6a94fd1757e92b6dbb6202e185817dba9954f120b859` |
| MG111 | En Barb! | 8/8 | 4 | 18 | `eaa52db558c1b9cb68dcd276c35cc3a7224a8f3b09e3b5472f28ef30edee835a` |
| MG112 | On the Beet | 7/7 | 4 | 18 | `6f567eccfb26ceefdf42b942bd6f70555012f8d5507ece6b3300270e26b286da` |
| MG113 | Shell Hockey | 14/14 | 4 | 18 | `df6bfa055b66dcd1c4f17d824be6156992e39b9c485e1dd81aca6e2c3c05c7df` |
| MG114 | Bowser Filter | 10/10 | 4 | 18 | `3f7827ddef3be5866733d9a6936ef1ff74e38773b9afb0ec5cbbe78064b6f062` |
| MG115 | Stuffie Stacker | 9/9 | 4 | 18 | `fa85408a1607de31c08ce57981f04b8c95ae61fd7787f13cfe49815405b7ed92` |
| MG116 | Pull-Back Attack | 14/14 | 4 | 18 | `52aba07f5fb85b875ae1f99a7d4d4343934fbcdb81f94c96657743b99268e78d` |
| MG117 | Domino Effect | 10/10 | 4 | 18 | `a14230be8c54a9dcfd646c3e474cd2c8adf584b3edb7bdc32725a757cdab8459` |
| MG118 | Bob-omb Makeover | 13/13 | 4 | 18 | `c68e1617f941987d82fa9012fcdfc5538dd8dea40762d8caa6abc1777cff8413` |
| MG119 | Toad-ally Electric Escape | 9/9 | 4 | 18 | `70b6b3d8d41da9296470bafd7364592b4ddfaca517f544965e25cce286597b33` |
| MG120 | Ice and Easy | 19/19 | 4 | 18 | `ad3a4655d7cf646978fca809d47e26c6be1f8ce6f70645cb7434c225ba9d56b1` |
| MG121 | Bob-omb Toss | 10/10 | 4 | 18 | `335d75450734d362d4c070de4d97b565aad1534fd7fcef7d8d81c9f0345766de` |
| MG122 | Net Gains | 16/16 | 4 | 18 | `8d7b33b5aacc5c11fb5eafa91a6ffd5796ffaee4caa8cdd9955f89cc1d664685` |
| MG123 | Get a Grip | 15/15 | 4 | 18 | `007e2bb068b4da002728e252c14e6b8d687bb2e8f7db4e6570078771c5334b2c` |
| MG124 | What's the Scoop? | 15/15 | 4 | 18 | `8bab88056c861d8d993e97a00493f894612e2d9bc4868d96e9a8062667e570e2` |
| MG125 | Knock-Knock Match | 10/10 | 4 | 18 | `d1cac45736c0170ddbe885c1a275c094114a51e0c272d1a251356f3f5695c95d` |
| MG126 | Goomba Scoopas | 18/18 | 4 | 18 | `ba89cd8e21af0c874d23bc876386739c250091192d80be8341916e797a919b49` |
| MG127 | Talking Flower Says | 8/8 | 3 | 18 | `b4f976b30b6b048e7c980f16e288bb3b4abbf15580ed9ef7d3566094c87e78b6` |
| MG128 | Hitting It Rich | 9/9 | 4 | 18 | `f04ffb0021ef835416c244197079b15104d8bd376d9d2a29f64465f74cd3fa16` |
| MG129 | Goombalancing Act | 8/8 | 3 | 18 | `657e612f7c496465a5fb9b1949dbdf6c97f61b13807a3f0678f7979faf396c19` |
| MG130 | Bowser Chicken | 7/7 | 3 | 18 | `531f35252395738fca267fe02ee7d3b9aa1850dc22524cd9b515b1e2ed4ef4dd` |
| MG131 | Speak Up, Junior! | 7/7 | 3 | 18 | `e2969d586395785297c39f7dbfe7886c9eb3806cf685016bd6f4e8cab3c75097` |
| MG132 | Bowser Beats | 7/7 | 3 | 18 | `e33dafdbfffb1bfa70ad0e050cd9901f10c4983ffaa11c9931ef2c51d5f19bf0` |

## Scoped Buddy follow-up

The credited independent Buddy guide and original full Wiki contexts add nine explicit four-player Party encounter formats and nine named-character Buddy awards. Peach's misnamed guide game and Waluigi's unstated player count are excluded from their respective upgrades. All affected full row versions and actual quote/body comparisons are bound in `reports/buddy-recovery-audit.md`. Null coin/star payouts and every separate rule uncertainty remain unchanged.

The current registry contains 145 URLs and 1,866 clips, with 431 independent contexts checked. All 148 retained current/historical URLs were reopened twice: 296 verified HTTPS responses and 3,738 short-clip recoveries. The current reward audit contains 84 exact comparisons, including the additional guide award statements. Fifteen material conflicts are preserved.

The earlier weakest-evidence result below is historical: its 48 comparison / 1,835 clip / 147 URL counts describe the preceding delivery. Offline CI checks retained receipt integrity and exact evidence bindings; it does not reopen live URLs. Full copyright bodies remain outside the delivery.

## Weakest-evidence improvement (historical)

Nineteen reward reports previously cited introductory article clips. Each now cites the exact scoped coin payout, item outcome or Jamboree Buddy statement, matched against both preserved complete article captures: **48 exact quote/capture comparisons** including Ice and Easy, bound to the response hashes in the original source registry. Four isolated malformed capture-witness fixtures reject missing, changed, hash-mismatched and duplicate proofs. The initial 1,796-clip documentation count was stale after additional list-comparison clips; the current registry count is exactly **1,835**, validated against the audit total.

Ice and Easy’s summary was narrowed to the sliding action and shared balloon objective explicitly described by both Wiki and ScreenRant. Only that narrow gameplay field becomes corroborated; its timings, scoring, tie and reward fields retain their prior qualifiers. Whole-row confidence remains low. A new complete reopen of all 147 URLs recovered every updated short clip twice, with **3,676 recoveries**, no missing clips and successful verified HTTPS throughout.


## Earlier gameplay milestone (historical; superseded by the polish audit)

Actual two-pass HTTPS captures of TheGamer's original hands-on review corroborate Net Gains' mouse-controlled net fishing and Goomba Scoopas' Goomba-corralling action. Actual two-pass captures of GameNChick's released-game review corroborate Knock-Knock Match's partner matching of characters behind doors. Complete corresponding contexts match across both captures; updated source reopens recover every quote again. These three summaries were narrowed to the common actions, retaining all separate rule uncertainties.

All **132 narrow core-gameplay fields** now have at least two publisher families. TheGamer and ScreenRant both belong to Valnet: a targeted fixture with these two brands alone is rejected for lacking independence. The complete source registry now contains **145 URLs / 1,866 clips**, with **431 independent publisher contexts** rechecked and **148 current/historical URLs** reopened twice. This does not satisfy the original requirement for complete independently corroborated timers, bindings, scores, ties and payouts: **481 narrow fields accepted, 839 gaps, zero complete rows**.

## UNVERIFIED

**Current strict research gate: NOT_MET; 286/1,320 narrowly corroborated fields, 1,034 remaining fields, zero of 132 complete rows.** Detailed timers, controls, scoring, ties and coin/star awards still require independent corroboration. The full two-wiki roster condition is unmet. No Nintendo gameplay or phone adaptation was executed; phone fit is editorial. Null payouts and all 15 material conflicts remain preserved. Current per-row coverage is reproduced in `reports/research-gaps.json`; all registered clips are bound to actual response records, and those records retain their individual dates.

The first 2026-10-08 category recovery reopened only Mario Wiki's list, Legacy base and Legacy TV twice. The second recovery freshly reopened Family Game Squad and seven individual Wiki articles, sixteen verified HTTPS requests. Its Wiki-list comparison reuses two explicitly historical captures. Every other source retains its actual historical dates. Source access and quote presence do not prove a complete gameplay rule.

| Fact field | Corroborated | Single source | Conflict | Unknown |
| --- | ---: | ---: | ---: | ---: |
| name | 132 | 0 | 0 | 0 |
| category | 104 | 28 | 0 | 0 |
| format | 23 | 108 | 1 | 0 |
| gameplay | 18 | 114 | 0 | 0 |
| controls | 0 | 121 | 11 | 0 |
| timeLimit | 0 | 100 | 3 | 29 |
| winRules | 0 | 132 | 0 | 0 |
| scoreRules | 0 | 78 | 0 | 54 |
| tieRules | 0 | 31 | 0 | 101 |
| reward | 9 | 10 | 0 | 113 |

Strict command remains `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --strict --hashes`; expected exit code 1 for the deliberate incomplete-research verdict.

## Polish pass 2026-10-08 (Claude, cloud)

Environment: Python 3.13.16, jsonschema 4.26.0, beautifulsoup4 4.15.0 (`requirements.txt`), from the repo root, with `PYTHONDONTWRITEBYTECODE=1`. Seed: n/a (deterministic; no RNG).

| Command | Result on this pass |
| --- | --- |
| `verify.py --hashes` at the baseline head `93d7848` | exit 0; 69 content suites PASS, then the manifest check |
| `verify.py --strict --hashes` at the baseline | exit 1; verdict NOT_MET; 481 corroborated of 1,320 (before the pass; this is the expected gate) |
| `quote-support-check.py --write` | 869 claims checked; 325 flagged for re-read; 121 category and 100 format claims title-only; 7 fragment-only summaries; gameplay rule: 15 corroborated, 110 single_source, 7 unverified |
| `verify.py --hashes` after the pass | exit 0 once `SHA256SUMS.txt` is regenerated for the 74 files in the folder (the manifest check is the last suite) |
| `verify.py --strict --hashes` after the pass | exit 1; verdict NOT_MET; 189 corroborated of 1,320; 1,131 open; 0 of 132 rows complete (expected) |
| `sha256sum -c SHA256SUMS.txt` | every line OK |

New or changed checks: `Quote-support report reproduces; no title-only corroborated category or format` (869 cases) and `Narrow summary status follows the two-lineage substantive-quote rule` (132 cases). The former `Independent publisher families for all 132 narrow core-gameplay summaries` check required every summary to be corroborated; the evidence showed that was not true of the registered quotes, so it was replaced by the rule check.

### What the sampling found (per row, in plain words)

- **category / format (175 corroborated fields).** The registered quotes are the minigame title. The category was carried by a heading locator; the format's four-player wording appears in no retained excerpt. Both became `single_source` with a limitation. Rows: all 108 category and 67 format claims that were corroborated and title-only.
- **summary (117 corroborated evidence sets).** 110 had one sentence-length registered quote from one lineage and no more; 7 had no sentence-length quote (headings such as "In-game description:" or one-word clips). The rule now gives 15 corroborated, 110 single_source, 7 unverified.
- **phone rationales (31 rows).** Motion, camera and microphone reasons were rewritten to name the phone's own sensors and microphone. Ratings are unchanged; each rationale is still one sentence.
- **Not changed, flagged only.** 325 claim-fields are flagged for a human re-read (`reports/quote-support-check.json`): numbers the claim states that its quotes do not contain (format 95, score 34, timer 22, win 14, summary 11, controls 6, tie 1), and the title-only categories and formats that stay single_source. Some timer flags are unit conversions ("1 minute" against 60 seconds); they need a reader, not a rule.

### Limits of these checks

They are lexical. They prove that a quote is or is not in the registry and that numbers are or are not present, not that a source supports a claim. A human re-read of each flagged source is still required before any exact value is used.

### UNVERIFIED in this pass

- No live source was reopened in this pass: the offline suite does not make network requests, and the previous pass's reopen records are unchanged.
- The legacy list heading (for "Free-for-All Minigames" and similar) is recorded in `SOURCES.md` but not as a registry quote, so no category was re-corroborated from it.
- Phone fit remains an editorial judgement, not a test.

## Category capture repair 2026-10-08

Seed: n/a, deterministic. Environment actually reported by the recovered execution: Python 3.12.14, jsonschema 4.26.0, BeautifulSoup 4.15.0. The six finite native HTTPS requests naturally CLOSED at 22:58:22.153956 UTC. Actual source-body SHA/bytes, request start/completion, verified TLS and source-spelled rows are in `reports/category-heading-repair.json`; full source bodies remain private. The material writer naturally CLOSED at 23:20:41.000484 UTC.

`PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/check-category-heading-repair.py`: PASS, 420 actual receipt/membership comparisons plus 5 malformed proof rejection cases (wrong category, unmatched spelling, same source family, changed response hash, omitted second-pass row). 82 category repairs; no mechanics/format inference.

`PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --report .work/registry-repair-2255/validation-before-manifest.json`: PASS, 71 suites / 25,925 cases, seed n/a, exit 0. This first full run preceded the final documentation and delivery manifest; its original result remains private. Complete final commands are rerun after those writes. All 132 JSON/CSV rows and published-row fingerprints are compared; new category evidence is scoped separately from unchanged historical article contexts.

Final content command `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --report jobs/B03-jamboree-minigames/reports/final-validation.json`: PASS, 71 suites / 25925 cases, exit 0, observed after B19's direct release at 23:24:33.285692 UTC. Exact test names, case counts, seed and validator output are in `reports/final-validation.json`. The complete hash and strict commands are required before this checkpoint is committed; current CI acceptance is observed after push and linked in the draft PR.

Full hash verification and full strict verification both completed naturally before 23:25:37 UTC: **72 suites / 26,001 cases**, all 76 delivery hashes matched. Integrity exit 0; strict exit 1 with NOT_MET (271/1,320, zero complete rows). A subsequent `git diff --check` found the CSV writer's default CRLF record endings; record serialization was corrected to LF with every parsed value unchanged, the complete manifest regenerated, and the same complete commands rerun before commit. Every row's non-category field evidence and product values were independently compared against source commit `81fbd529eecdab39d2aaf7d4781a149634884420` and remain byte-value identical.

Final LF serialization full hash and strict checks naturally CLOSED: 72 suites / 26,001 cases, all 76 manifest files; integrity exit 0 and strict exit 1 with the deliberate NOT_MET verdict. No source field changed during serialization. This paragraph corrects the recovery environment from the prior worker’s Python version to the actual version above. Only documentation metadata changed afterward; all delivery hashes were regenerated and checked directly before commit.

## Second material recovery 2026-10-08/09 (historical checkpoint 4a60fc7)

The sixteen finite verified HTTPS responses naturally CLOSED at 2026-10-08 23:46:08.790810 UTC, before any adopted change. Complete source bodies remain private. Both guide captures independently parse all 112 source-spelled base-game names; the complete 29-game four-player, 12-game one-versus-three and ten-game Kaboom-Squad memberships agree with the Wiki category sets after case/punctuation normalization. Twelve category facts are newly corroborated. The Legacy misspellings and broad Koopathlon/Mouse labels are retained.

Seven former fragment-only gameplay evidence sets now quote full in-game instruction sentences from the appropriate Jamboree Wiki sections. Every quote is at most 25 words and actually appears in both source responses. These fields remain single-source; a second publisher's title or action fragment is insufficient. All 132 product summaries and every unrelated product value/evidence field are unchanged. All 145 prior source quote arrays are retained without alteration; exact reuse avoids duplicating one already-registered quote. Registry: 145 URLs / 1,894 clips, with 3,794 recovered clips across ordered current/historical A/B records. Guide budget: 151 unique quoted words of 200.

`check-category-summary-recovery.py` passed 438 receipt, full-group membership, independent-lineage, substantive-quote and preservation comparisons plus five malformed-proof rejections (missing guide-pass row, unmatched spelling, changed receipt hash, false independent-summary promotion, changed original-quote fingerprint). The first category proof remains historical; its 82 repaired memberships and five malformed fixtures still run. Only the twelve newly evidenced rows may supersede its original non-promoted list.

The successful material writer naturally CLOSED at 2026-10-08 23:59:31.999256 UTC. Both preceding local quote-count assertions failed before any tracked write and remain in private logs. Full final content verification naturally exited 0 on 2026-10-09: **73 suites / 26,434 cases**, seed n/a, Python 3.12.14, jsonschema 4.26.0, BeautifulSoup 4.15.0. `reports/final-validation.json` contains every actual test name, count, qualifier and NOT_MET verdict. Complete `verify.py --hashes` and `verify.py --strict --hashes` then naturally closed before actual observation 00:06:08.901956 UTC: **74 suites / 26,513 cases / all 79 delivery hashes**. Integrity exited 0; strict exited 1 with deliberate NOT_MET (283/1,320 and zero complete rows). Only documentation metadata changed afterward; the manifest is regenerated and all 79 files checked directly before commit.

Historical hosted acceptance for a327dc1 is recorded in `reports/hosted-ci-a327dc1-artifact.json`: run 37859517729 / job 113591645239 succeeded; the complete 103,932-character native log contains two full 72-suite / 26,001-case / 76-hash reports. The actual 2,673-byte artifact 11585436884's complete SHA-256 is recorded in that receipt. The ZIP was read in full, safe paths/CRC checked, its complete report compared to both native reports and all immutable source manifest files checked. Reader naturally CLOSED PASS 23:50:05.659053. This older workflow proves no newer source commit and does not close the research gate.

The 23:57:17.332286 checkpoint bound was missed during the mandatory 23:51:04–23:57:29.128565 B19 HOLD. B03 owned no reader, writer or process during that hold. Actual source requests, writer, checks, push and workflow observations are never backdated.

## Current common-action recovery 2026-10-09

The finite material writer naturally CLOSED exit 0 at **00:18:34.856351 UTC**. A preceding quote-count assertion exited 1 before any tracked write and remains private: an exact Wiki sentence already existed, so the adopted repair reuses it. Four genuinely new clips are added, not five. Three full guide paragraphs and the appropriate Wiki instructions/shared released-game overview were read in both actual retained bodies from 2026-10-08 23:46. No new HTTP request or source date is claimed for those rereads.

The only product changes are three narrower two-sentence summaries and their independent gameplay evidence. Domination keeps the shared button-mashing/Whomp objective, omitting exact switch, mallet, timing and scoring limits. Snow Brawl keeps the fight and computer-controlled assistance, omitting helper count/species and older-edition details. Jump the Gun keeps the two path-making/crossing roles and goal, omitting its cannon/projectile/bindings/timer/tie details. Every unrelated value and evidence field across all 132 rows is compared to baseline 4a60fc7; all prior quotations and gameplay citations are preserved.

`check-common-gameplay-recovery.py`: PASS **297** actual source/row/budget/preservation comparisons plus **eight** malformed proofs rejected (extra timer claim, same-lineage guide, missing second-pass clip, changed actual capture, invented original summary, changed prior quotation fingerprint, 201-word budget and changed unrelated timer). The earlier category and seven Wiki-quote recovery proofs still run; they allow only the three later changes after this independent proof actually passes. Their historical source records and original assertions remain intact.

First complete content verification naturally exited 0, observed by 00:22:43 UTC: **75 suites / 26,761 cases**, seed n/a, actual Python 3.12.14 / jsonschema 4.26.0. Strict research remains NOT_MET: **286 corroborated / 1,034 open / zero complete rows**; gameplay 18 corroborated / 114 single-source. Current guide quote budget is exactly 200 unique quoted words, with the original 151 words retained. Registry: 145 URLs / 1,898 clips / 3,802 A/B recoveries. Complete final report, manifest and strict commands must be rerun after documentation and before push.

Historical accepted checkpoint 4a60fc7 is preserved in `reports/hosted-ci-4a60fc7-artifact.json`: exact-head run 37863086499 / job 113603249892 SUCCESS 00:07:19 UTC; the entire 106,493-character native log has two complete 74-suite / 26,513-case / 79-hash reports and 148 PASS lines. Actual artifact 11587211660 (2,813 bytes, SHA-256 `07d6e5cf950d4cbe824cd3ece609a315b81b65110b59ca33d8ae8253272ce37f`) was fully read, safe ZIP/CRC checked, its complete JSON compared to both native reports and all 79 immutable source hashes validated. Independent reader CLOSED PASS 00:08:35.142392. This is historical acceptance only; the next source commit requires its own exact-head workflow.

### UNVERIFIED NamuWiki roster candidate

`reports/namu-roster-candidate.json` retains six new verified HTTPS receipts, naturally CLOSED 00:10:29.983007, for original Namu base, its exact linked TV article and the Wiki list in ordered A/B passes. The complete Namu base has 112 numbered English names in both passes, including the raw `Thwormp the Difference` disagreement. The complete TV article enumerates fourteen Korean Mouse names, three microphone names and three camera names. Numerical 112 + 20 = 132 agrees, but literal bilingual witnesses for the twenty TV identities are missing; no automatic translation or guessed alias is adopted. Three known-URL Exa extracts show no Korean name witness in the sampled Wiki articles. These fetches are not new native pass records or search results. The second full exact-wiki-roster gate remains unclosed; this candidate promotes no fact field.

Actual holds: B19 ACK 00:17:11 through direct release 00:17:50.697578; G01 coordination ACK 00:19:36 through the root's direct finite-work release before candidate writer 00:22:36.714252 (release clock not separately sampled). No owned reader/writer/process ran during either HOLD; none was paused or stopped. The hard next checkpoint bound remains 00:36:54.057127 until the next actual normal push.

Final content report was regenerated after documentation. Complete full hash and strict commands naturally closed before actual observation 2026-10-09T00:26:21.840141+00:00: **76 suites / 26,844 cases / all 83 hashes**, integrity exit 0 and strict deliberate exit 1 (NOT_MET 286/1,320, zero complete rows). Only documentation metadata changed afterward; the manifest is regenerated and every file directly checked before commit.

## Current authored-tip source checkpoint 2026-10-09

The complete initial current verifier actually exited0: **77 suites /28,970 cases**, coverage 288/1,320, open 1,032, zero complete. Two authored Korean clauses are independent narrow action witnesses, with translated Nintendo-description cells excluded. The checker preserves the exact accepted 132-row and145-source baseline, checks all 1,898 old substantive classifications and rejects eight actual malformed confidence/receipt/copyright-column/baseline fixtures. All prior category/common-action negative fixtures remain active on a validated exact historical view. Regenerated schemas require146 current sources and149 current/historical reopening records per pass.

Full final content/hash/strict verification is recorded in the final report and checkpoint receipt. Integrity passing is distinct from strict research NOT_MET/exit 1. The 5e6ad25 hosted artifact receipt is explicitly historical; every later source needs its own complete exact-head native log, downloadable artifact JSON, CRC and immutable-file manifest check before acceptance. Original PR20 remains draft.

Actual complete final commands naturally CLOSED 2026-10-09T00:48:44.829862+00:00: **78 suites / 29,059 cases / all 87 hashes** in each full run. Integrity exited 0; deliberate strict exited 1 with NOT_MET, coverage 288 / 1,320 and zero complete rows. Subsequent delivery notes are metadata only; the manifest is regenerated and all file hashes rechecked before the normal push.

## Current eleven-action packet 2026-10-09

Actual full native collector CLOSED **01:15:27.558651 UTC**: **24 requests**, HTTP200/TLS verified, ordered A/B for twelve candidate Wiki URLs. Eleven pairs are registered; Gate remains unadopted because its memory advice attributes the in-game explanation. Complete original Korean authored Tip contexts were read in both retained actual earlier Namu bodies. Raw source bodies are private, and no new Namu request, fabricated retrieval date or hardware execution is claimed.

Writer naturally CLOSED **01:22:30.564985 UTC**, exit0: **299/1,320 corroborated /1,021 open /zero complete rows**, **31 gameplay corroborated /101 single-source**, categories104/28. Registry146 sources /1,931 clips /3,868 A/B recoveries. Source quotation budgets retain the inherited unique-text definition; Namu195/200 and guide200/200. The first pre-write batch assertion accidentally counted duplicate historical clips twice; it failed before data writes, its code/failure are preserved, and the original unique-text budget definition was restored. The inherited hard expected gameplay total was updated from20 to31 only after the exact eleven-row proof passed; its earlier failing full log is retained.

Complete initial current command, seed n/a:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify.py --report .work/remaining-research-0038/second-batch-content-report.json
```

Actual exit0: **79 suites /31,337 cases**. The new independent packet performs **2,246** source/row/classification/capture comparisons and **ten** actual malformed-proof rejections. All1,900 earlier quote classifications, exact132-row and146-source accepted baseline, complete accepted A/B records, all121 other summaries and every unrelated field remain hash-bound. The original category, common-action and first Korean Tip checks still run, including all earlier negative cases, on validated exact historical views. No general exception strips an unchecked source.

Historical accepted dd1e54f receipt is `reports/hosted-ci-dd1e54f-artifact.json`: full run37867934315/job113619054067 SUCCESS, actual artifact11589366040 (3,100bytes/SHA3368371729bbf76b2a701670f256f7bd5ab59a08a5ea0ca05d934fe44214da1c), complete111,736-character native log/two78-suite29,059-case reports/156PASS lines/all87 immutable source hashes. Reader naturally CLOSED01:05:37.307014 UTC. This accepts that previous source only; a newer head needs its own full hosted run/native/official artifact reader.

Final content, integrity and deliberate strict commands are recorded in the final delivery receipt and report. Strict remains NOT_MET; exact detailed gameplay parameters and the second full independent wiki roster remain UNVERIFIED. No completed strict KEEP GOING or Ready claim is made.

Actual final full commands naturally CLOSED 2026-10-09T01:27:21.722116+00:00: content79suites/31,337cases; integrity80suites/31,427cases/all90hashes EXIT0; strict the same80suites/31,427cases/all90hashes deliberateEXIT1/NOT_MET299fields,zero complete. Only delivery metadata changed after these checks; every staged immutable Git byte and regenerated manifest entry is verified before the normal push.


Original-author tips research checkpoint: 14 actual native HTTPS/TLS A/B requests naturally CLOSED 2026-10-09 01:47:48.610964 UTC. Four candidates are explicitly UNADOPTED in reports/family-tips-candidate.json. Every original product value, evidence status and source/quote/A+B history remains exactly accepted76880fa; current299/1021/zero,31gameplay/101single stays unchanged. The separate Gaming Chickadee tips-and-tricks page has73 bounded original words; the old guide200 and Namu195 histories remain intact. Big-Top/Burger are excluded for insufficient shared-summary scope. Six negative controls reject premature promotion or altered provenance. Actual current full CI/artifact acceptance is required after this push. No strict KEEP GOING/completion claim.


Actual candidate checkpoint full controller naturally CLOSED 2026-10-09T01:57:26.792681+00:00: content81suites/31,430cases EXIT0; integrity82suites/31,523cases/all93hashes EXIT0; strict82suites/31,523cases/all93hashes deliberateEXIT1/NOT_MET299,zero complete. Only delivery notes change after these full checks; the regenerated manifest and every staged immutable Git byte are checked before normal canonical push.


Candidate logger repair: exact82faed hosted run37872314164 succeeded with both82suite/31,523case reports, but the acceptance helper correctly stopped before artifact acceptance because direct appends omitted the two new per-run PASS lines (160actual/164expected). The entire115,990-character native log and failed reader are preserved privately. Both candidate suites now use the original checked() logger; no check, gate, source wording or product classification changes. Full exact new-head verification/artifact acceptance is required.


Actual candidate logger-fix full controller naturally CLOSED 2026-10-09T02:01:31.804169+00:00: content81/31,430 EXIT0; integrity82/31,523/all93hashes EXIT0; strictsame82/31,523 deliberateEXIT1/NOT_MET299,zero complete. All native candidate suites now emit their usual PASS lines. Only these delivery notes change afterward; every regenerated manifest entry and staged Git byte is checked before the normal canonical push.

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

Actual complete current candidate controller naturally CLOSED2026-10-09 02:54:02.847470 UTC:content85suites/34,540cases EXIT0;integrity86/34,639/all99hashes EXIT0;deliberate strictsame86/34,639 EXIT1 NOT_MET303/zero. Only these delivery notes change afterward; every regenerated manifest entry and immutable staged Git byte is checked before normal canonical push.

## Current four original-review shared actions — 2026-10-09

This material checkpoint changes exactly four narrow two-sentence gameplay summaries: Sunset Standoff, Shell Hockey, Stuffie Stacker and Domino Effect. Current coverage is307/1320 supported narrow fields,1013 open,zero complete rows; gameplay39 corroborated/93 single-source and category104/28. Every other128 summary, unrelated value/evidence and low whole-row confidence restores exactly accepted34fd5936284bb1a83cb06e9c43713213a8704e75. That parent was normal-pushed02:55:03.345178 UTC, and its full genuine hosted native log/official ZIP reader passed02:56:21.041254. Its receipt is reports/hosted-ci-34fd593-artifact.json; it does not accept this newer source.

The sources are the complete original review paragraphs by Jon Scarr at https://blog.bestbuy.ca/video-games/super-mario-party-jamboree-nintendo-switch-2-edition-jamboree-tv-review and Bobby Pashalidis at https://www.consolecreatures.com/super-mario-party-jamboree-tv-review/, compared with each entire corresponding Wiki narrative. BestBuy cumulative94/200 quoted words includes its old30; ConsoleCreatures23/200. Four full Wiki action clauses are appended, while every old quotation object stays exact. The actual available cross-job search covered54 job roots and found zero foreign matches for these review URLs; this is not an inventory of unseen remote branches. CloudDosage's same Jon Scarr author is not counted as independent. Namu195, old FamilyGameSquad guide200 and tips73 histories remain intact; no new Namu clip is added.

The original collector naturally CLOSED02:36:19.847612 UTC after34 actual requests:32 complete HTTP200/TLS-verified responses and two curl56/HTTP000 Substack attempts with no received response bodies. Twelve recorded response replacements/additions use retained receipts; adoption makes zero new HTTP requests. Full received bodies and complete named paragraphs remain private. Public registry148URLs/1948 short clips/3902 recorded A+B quote recoveries,151 current/historical records per pass. Numbers are recorded historical recoveries, not new HTTP requests. Controls, exact mode/player counts, timers, scores, ties, rewards, categories, roster and every whole-row completion gate remain separately qualified.

The writer naturally CLOSED03:18:58.924348 UTC. New checker2529 actual comparisons and ten malformed fixtures passed; it restores exact accepted132-row/147-source/full A+B hashes and every1938 old substantive classification before handing any historical view to inherited checks. Historical candidate packets remain UNADOPTED descriptions of their own old checkpoints; the current four actions are adopted only by the new exact restoration proof. Closed schema maxima advance only147→148 registered sources and150→151 reopen records. Original predicates and malformed controls remain active. Full current verifier/manifest/strict output and exact-source current hosted official acceptance are required after the normal canonical push. No strict completed KEEP GOING round, Ready, exact two-wiki full roster or complete-row claim.

Early push target03:20:03.345178 UTC; hard03:25:03.345178. Coordinated native quiet03:09:15.224602 through direct release after G01 actual whole controllerCLOSED03:13:10.239188. Every owned command naturally closed before HOLD. Actual push/CI/reader times are observed and reported in original draftPR20, never inferred or backdated.

Actual current full controller naturally CLOSED2026-10-09 03:21:28.519384 UTC:content87suites/37123cases EXIT0;integrity88suites/37225cases/all102manifestfiles EXIT0;deliberate strictsame88/37225/all102 EXIT1 NOT_MET307/zero. New original-review proof2529comparisons+ten malformed fixtures and all inherited controls passed. Early03:20:03.345178 target was missed while completing literal source restoration and full checks after coordinated quiet; actual hard03:25:03.345178 remains binding. Only these delivery notes change afterward; every regenerated manifest entry and immutable staged Git byte is verified before the normal canonical push. Actual push/hosted official acceptance is observed in originaldraftPR20.

## Current Knock-Knock Match group-scope correction — 2026-10-09

The exact accepted parent is f7af530b2ac281675d8952021beb4a798e1174ab, normal-pushed03:22:06.498688 UTC; its whole current hosted native log/official artifact reader passed03:23:32.831596, and originalPR20exact4907-character body was read back03:24:21. Its historical receipt is reports/hosted-ci-f7af530-artifact.json. This new checkpoint corrects one existing corroborated summary; coverage stays307/1320 supported narrow fields,1013open,zero complete rows and39/93gameplay. It is not a308th fact or a new40th gameplay status.

Knock-Knock Match previously said 'matching pair' without an edition/mode restriction, although the complete primary Co-op4 narrative requires groups of four matching characters. The corrected generic two-sentence summary is: 'Players match characters behind doors. They try to find all the matches.' Complete Battle and Co-op narratives and GameNChick's full original review paragraph both support these common actions. No exact group count, binding, time penalty, ranking, scoring, tie, reward or category is newly promoted. All131other rows and every unrelated MG125value/evidence restore exactly to the accepted parent.

The actual six-request native collector naturally CLOSED03:29:43.149580 UTC:four complete HTTP200/TLS-verified GNC/W125 responses and two FandomHTTP402 responses. The latter each received55bytes, with actual headers/stderr/body/receipt retained; curl itself exited0, but actual source acceptance is false. The cloud Fandom lead claims98minigames, not132, and never closes the native exact independent roster gate. Source errors and count disagreement remain excluded, not silently reconciled.

Actual GNC responses each contain1487284bytes and the complete21797-character article; A/B full scopes are identical. The complete2572-character named-game paragraph is bound by SHA256c6dc7c2906a4855351cc756c46aadceb0d200261d78f3e9d4f9b4d39ce023f9c; native JSONLD authorGameNChick/publishergamenchickgaming was checked. The exact new clause 'to complete your objective, you must match all characters,' is **nine words**, so historical17+new9=26/200uniquequoted words. A preliminary estimated10/27 was corrected before any writer; the original negative HotelMario door-closing comparison remains in full private context and is not adopted as an action. All anonymous minigame examples and mode errors stay excluded. Available54-job-root exactURL search found zero foreign uses; unseen remote branches are outside that bounded audit.

The new exact restoration checker passed2438actual comparisons plus eight rejected malformed fixtures. All1948old quotation classifications, all132accepted rows, all148source objects and complete A+B history restore before any inherited historical view is supplied. One nine-word clause is appended; no old quotation or control icon changes. Current148URLs/1949clips/3904recorded A+B quote recoveries across151current/historical source records per pass. BestBuy94/ConsoleCreatures23/oldguide200/tips73/Namu195 budgets remain untouched. Source adoption uses zero newHTTP requests; four existing03:29native receipts replace the two sources' registered scopes.

The writer naturally CLOSED03:38:16.354713 UTC. New and inherited exact restoration/negative-control checks passed. Full current verifier/manifest/deliberate strict and genuine exact new-source hosted native/official ZIP acceptance are required before current delivery acceptance. Early03:47:06.498688/hard03:52:06.498688; actual delivery timestamps belong in originaldraftPR20. Source/controller bodies are private; bounded quotes and complete actual metadata are public. Strict research, exact independent full second-wiki roster and original KEEP GOING whole completion remain unmet.

Actual full current protocol naturally CLOSED2026-10-09 03:41:12.375976 UTC:content89suites/39577cases EXIT0;integrity90suites/39682cases/all105manifestfiles EXIT0;deliberate strictsame90/39682/all105 EXIT1 NOT_MET307/zero. Mode-scope checker2438comparisons/eight rejectedfixtures and every inherited control passed. Current307facts/39gameplay stays unchanged; no newstatus gain. Early03:47:06.498688/hard03:52:06.498688 are observed against the actual normal push receipt. Only these delivery notes change afterward; every regenerated manifest and immutable staged Git byte is verified before normal canonical push; exact current hosted/native/official acceptance is required afterward.

## Hosted proof and remaining category research — 2026-10-09

The accepted ed7e36b56a30d728789b7ff58377c3762d48453e checkpoint was normally pushed 2026-10-09 03:41:46.272233 UTC. Its complete genuine hosted run37880451180/job113658700720 succeeded; the official3659-byte artifact11594335549 has SHA25670d2ddf2ae063dd7c09fdd3dda92726eab69882a1ebd6558f7bf5b2173df9cb6. The whole126311-character native log, both90-suite/39682-case reports,180actual PASS lines, safe unique ZIP entry/CRC/EOF/full JSON and all105 immutable source hashes passed the reader naturally CLOSED03:44:21.099275. OriginalPR20 remained draft/open after exact5684-character body readback03:45:22. This acceptance is historical for the new proof-publication checkpoint, not acceptance of a future head.

Four new category lead requests naturally CLOSED04:01:51.635984:ordered A/B fullHTTP200/TLS0 NintendoLifeTV and MarioPartyLegacybase responses. Full native article scopes and all received bodies/headers/stderr/receipts remain private. NintendoLife's actual PJ O'Reilly byline and literal Mouse Minigames heading contain all14 source-spelled TV entries; paired complete scopes agree. Actual retained historical W_LIST bodies were rehashed, withzero new WikiHTTP requests. The14 candidates in reports/remaining-category-research.json are UNADOPTED: current307/1320 supported facts,1013open,zero whole rows and104/28category statuses are unchanged. MarioPartyLegacy groups the other14 under a generic Koopathlon heading and does not independently assign Coin/Survivathon subdivisions. No precise mechanics are inferred from headings.

Public bounded heading metadata adds two words forW_LIST, two forNL_TV and three forMPL_BASE outside the accepted quotation registry; account for these when reconciling cumulative canonical-page reuse. The accepted148sources1949clips3904recorded recoveries and every original row/source/quote classification/full A+B remain exact. Namu195/oldguide200/tips73/GNC26/BestBuy94/ConsoleCreatures23 remain unchanged. The first category read helper used an incorrect data/ path and failed before any source request or public write; its corrected read used the actual root JSON files.

Global ZERO/HOLD was acknowledged03:49:01 and refreshed03:55:14/03:59:10, with last owned native closure03:44:21.099275. No native process or research started during HOLD; rootdirectrelease was received after03:59:00. No local native performance experiment or timing grant occurred. This milestone publishes genuine prior acceptance and literal unadopted research, without a308th fact or completed strict KEEP GOING claim. Early checkpoint target04:06:46.272233; hard04:11:46.272233. Exact current full checks, immutable staged bytes, normal push and genuine new-head hosted/official acceptance remain required and actual times are recorded after observation.

Actual full current proof-publication controller naturally CLOSED 2026-10-09T04:06:50.429976+00:00: content89suites/39581cases EXIT0; integrity90suites/39688cases/all107manifestfiles EXIT0; deliberate strictsame90/39688/all107 EXIT1 NOT_MET307/zero. Every inherited restoration and malformed control passed. All product/source/quote classifications remain unchanged;14mouse-category leads stayUNADOPTED and14Koopathlon subdivisions unsupported. Acceptedparented7 official readerCLOSED03:44:21.099275 is published as historical proof only. The early04:06:46.272233 target and hard04:11:46.272233 bound were missed. A malformed tool-construction call failed before native execution; delivery subsequently stalled until the actual04:40:00 recovery clock. This delay is not attributed to source transport or a workspace outage. Only delivery notes change after the full checks; every regenerated manifest entry and immutable staged Git byte is verified before normal push. The actual late push and genuine new-head full hosted/official acceptance are recorded after observation in originaldraftPR20, never backdated. No new factual coverage or whole-row completion is claimed.

## Restart Mouse-category preflight — 2026-10-09

Restart preflight preserves the genuinely accepted ecae0f8bba7ab8f6761b73aeffbbc09776c69c28 source. Actual original hosted run37885022310/job113672974663 succeeded and its full official3661-byte artifact11595837686 SHA25678f51b4298ce7073fafa9754314303eaf35efd9c3fae4993105124f4b9f699a5, both complete126304-character native reports/180PASS/90suites39688cases and107immutable source files passed the original reader CLOSED04:42:51.552151 UTC. The retained full archive/native reports/immutable Git hashes were checked again during this recovery. That exact acceptance is historical for this new validator checkpoint.

The new default candidate validator makes239 actual assertions over the exact accepted132-row148-source1949-quote/full151-record A+B history and the literal14-entry Mouse category membership. Ten malformed fixtures reject premature promotion, shared lineage, missing pass/member, unsupported spelling correction, failed transport, altered timer/history and unsupported Koopathlon subdivision promotion. No category or gameplay status is promoted in this checkpoint. Independent lineages are mariowiki and hookshot; complete actual NintendoLife scopes explicitly use the Mouse heading. A third publisher is not required to establish the two-source category fact. Controlled adoption still requires an exact accepted-baseline restoration adapter, registered bounded heading quotes, complete row audits and every original check.

Current307/1320 corroborated facts,1013open,zero complete rows; gameplay39/93 and category104/28 remain unchanged. All old quote/source/history classifications and cumulative budgets remain intact. No source body is published, no new HTTP request is invented, no strict completion/Ready/original KEEP GOING completion is claimed. The earlier29m11.765544 delivery miss remains historical and unchanged. The current hard push bound is05:10:58.037777 UTC, measured from the actual04:40:58.037777 normal push; actual new delivery is observed separately.

Actual complete restart preflight controller naturally CLOSED05:09:45.558035 UTC: content91suites/39833cases EXIT0, integrity92suites/39942cases/all109manifest files EXIT0, deliberate strict same92/39942/all109 EXIT1 NOT_MET307/zero. All closed source and actual Python runtime hashes stayed unchanged before/after every complete command. Ten real malformed candidate fixtures and every inherited predicate passed. Only delivery notes change after those checks; every final staged Git byte and regenerated manifest entry is checked before the normal canonical push. Actual new-source hosted/official acceptance remains required.

## Fourteen independent Mouse categories — 2026-10-09

Exactly14 Jamboree TV Mouse category fields now have registered literal heading witnesses from two independent publisher lineages: Super Mario Wiki (mariowiki) and NintendoLife (hookshot). Full actual original-language/English native scopes were reread, including NintendoLife's PJ O'Reilly byline and its complete14-entry section, and the entire retained Wiki132-name parser scope. Paired membership agrees after case/punctuation normalization only; no misspelling or alias is guessed. The fourteen current category values stay exactly as written, while their narrow evidence status changes single_source→corroborated.

The new check-mouse-category-recovery.py validates2738 actual comparisons and rejects12 malformed adoption/restoration fixtures. It restores exact accepted1bbc43dc78cb62b06704d9bef17b43d4a0f71ed4:all132 rows,148 sources,1949 historical quotation classifications and both complete151-record A+B histories before inherited checks receive any historical view. Every118 other row and every unrelated field of the14 affected rows remains exact. All old malformed fixtures remain active. The candidate packet remains an unchanged historical UNADOPTED packet at its307 baseline; the current adopted data is separately proved by reports/mouse-category-recovery.json.

Only two two-word headings are appended: Wiki's Mouse minigames and NintendoLife's Mouse Minigames. All original short quote objects and prior substantive classifications stay exact. W_LIST's cumulative registered unique quoted words are158/200; NL_TV25/200, including the same heading words already exposed in the earlier bounded candidate metadata. Namu195, original guide200, separate tips73, GameNChick26, BestBuy94 and ConsoleCreatures23 remain unchanged; no new shared-Namu use. Current registry148 URLs/1951 short clips/3908 recorded A+B quote recoveries across151 current/historical records per pass. These are registered recoveries, not3908 new HTTP requests.

Adoption makes zero new HTTP requests. Wiki retains actual native22:58 original capture dates and complete132-member scope hash678b0ce991b009dba6548dd04fc1bec662d24a5a38f33cff10d0e30fd7665e41. NintendoLife reuses the actual04:01 nativeA+B responses (172147bytes each, full7561-character authored article f8d7495b31d5608751c24deb15ab2bd913d8c2f5c48dc51cb6c0318b7c1bdbf7). The original four-request collector closed04:01:51.635984; only its two NintendoLife responses replace that source's earlier registered scope. The two MarioPartyLegacy lead responses remain preserved but do not establish the14 Koopathlon Coin/Survivathon subdivisions. Full bodies/headers/stderr stay private; source hashes were physically verified before and after the writer.

The writer naturally CLOSED05:17:29.428418 UTC. A first complete original content verifier naturally exited0 (93 suites/42622 cases), closure observed05:18:27 UTC. Final exact current full content/integrity/deliberate strict checks, source/runtime guards, immutable staged bytes, normal canonical push and genuine new-head hosted/native/official artifact acceptance remain required. No first-run closure timestamp is backdated. Current proposed coverage321/1320 corroborated narrow facts/999 open/zero complete rows; categories118corroborated/14single-source; gameplay39/93 unchanged. No format, exact controls, timer, win/score/tie, payout, Nintendo gameplay, exact independent second-wiki roster, whole-row, Ready or completed strict KEEP GOING claim.

Acceptedparent1bbc43d genuine original run37887292236/job113680039676 and official11597295220 (3725bytes, SHA256b2937708da86efb53d3d5ca54cb88602539292dad4d821d8b5caee46e2c384ba) were fully accepted by the actual whole reader CLOSED05:13:08.265944:128607native characters, two92-suite39942-case reports,184PASS, safeCRC/EOF/fullJSON/all109 immutable local+Git bytes and actual reader/Python runtime guards. That receipt is historical for this new adoption source. The original PR20 remained draft/open/unmerged after exact4683-character body readback05:13:21. Current hard push bound05:40:15.685135 UTC follows the actual1bbc normal push05:10:15.685135. Earlier failed tool construction/late publication remain retained. One overlong native argument was rejected before execution during the1bbc artifact-spec write; the corrected ten private chunks and sole genuine download succeeded.

Actual complete14-category adoption controller naturally CLOSED05:22:46.067034 UTC: content93suites/42622cases EXIT0, integrity94suites/42734cases/all112manifest files EXIT0, deliberate strict same94/42734/all112 EXIT1 NOT_MET321/zero. All closed source and actual Python runtime hashes stayed unchanged before/after every complete command. The new2738comparison/12malformed-fixture recovery proof and all inherited candidate/restoration/rejection predicates passed. Only delivery notes change after those checks; every final staged immutable Git byte and regenerated manifest entry is checked before normal canonical publication. Actual exact new-source full hosted/native/official artifact acceptance remains required; acceptedparent1bbc is historical only.


## Original independent-review candidates (UNADOPTED)

Current delivered facts remain exactly accepted e679464bea11348d76bb0a579a3cd54d391d38af:321/1320 supported,999 open,0 complete rows; categories118/14 and gameplay39/93. No product row, source registry, old quotation, source timestamp, A+B record, confidence or precise mechanics has changed. The new reports/original-review-candidates.json is explicitly UNADOPTED. New checker390 comparisons and12 genuine malformed fixtures reject premature promotion, false independence, missing category membership, failed/insecure transport, unordered passes, incomplete quotations/control history, guessed aliases and excluded motion. Every inherited original gate remains active.

Material source recovery: CelStudios' own2024-10-20 review at https://simplestreviews.blogspot.com/2024/10/super-mario-party-jamboree-board.html was actually recovered twice over nativeHTTPS/TLS. The sole2-request collector naturally CLOSED05:26:56.741654 UTC; both120543-byte bodies have SHA256c40d3ffa3f71019ca01ce96ab6cf6b5e9f88e3867ad026f767d3fa20123a7d65. Each complete56574-character .post-body has SHA256bc2d31c7452fe43211d93e05d51844334b8f14edd485803d7d9bdf8c468b85a0. The actual visible author is CelStudios, recovered from [rel=author].profile-name-link and its Blogger profile13789188290026471568; the empty .post-author element is explicitly not an author witness. All11 named original paragraphs were reread in full and paired.

A fresh finite24-request collector for12 complete Wiki articles naturally CLOSED05:34:35.808640 UTC. Every actual request returned200 with TLSverified and complete #mw-content-text; native concurrency was2, retry0, and passB started only after all passA children naturally closed. Both complete captures recover every retained quotation of the11 proposed action articles, including controller-image metadata. These26 requests are actual new research requests, not registered quote recoveries. The two original full132-member Wiki list bodies were separately physically rehashed, preserving actual Oct8 22:58 receipts and full scope678b0ce991b009dba6548dd04fc1bec662d24a5a38f33cff10d0e30fd7665e41; no historical request is counted as new. Full received bodies, headers, stderr, finite closures and parser failures stay private at .work/remaining-research-0038/restart-original-reviews-0526 and .work/registry-repair-2255.

Five proposed category witnesses match literal Survivathon headings and full named membership: Burning Bridges, Castle Hassle, Sleight of Shell, Fire Away and The Floor Is Falling. Eleven proposed narrow action summaries cover Big-Top Quiz, Snag the Flags, Light-Wave Battle, Thwomp the Difference, Cold Front, Three Throw, Shuttle Scuttle, Tiny Triathlon, Pickax Dash, Treasure Divers and Lost and Pound. New author clips plus the one-word heading total122 words, each clip<=25; reserve at most150 of250 cumulative canonical-page words across jobs and coordinate B04 use. An accessible /workspace and /tmp JSON/Markdown/CSV search before this packet found no previous registry use; unseen remote branches were not audited. Current registry remains148 URLs/1951 old clips/3908 recorded A+B recoveries. No author URL was registered yet. W_LIST158/200, NL_TV25/200, Namu195, old guide200, separate tips73, GameNChick26, BestBuy94 and ConsoleCreatures23 remain exact.

Night Lights is excluded because Wiki says shake while this reviewer says rotate the Joy-Con. The9 Coin categories still lack a literal independent Coin-subdivision heading; genericKoopathlon is insufficient. Eight bare-parent paragraphs remain excluded. The first bold/strong label parser found zero because labels are underlined; a paragraph-only attempt raised before public/product writes. The corrected parser handles5 literal Survivathon names in document order, including the bare Floor label, without inventing an alias or complete gameplay paragraph.

Accepted e679 genuine original run37888380006/job113683458491 and official11596724776 were fully accepted by the secure sole reader CLOSED05:28:45.301125 UTC:3793 bytes/SHA25697a17e9a1d9466838e7f6b96517348db46c564415ce79d6b563503be4116805e,131039 native characters, two94-suite42734-case reports,188 realPASS lines, safe uniqueZIP/CRC/EOF/fullJSON equality, all112 immutable local+Git bytes and actual Python/reader guards. Historical acceptance is reports/hosted-ci-e679464-artifact.json. OriginalPR20 exact5030-character body readback05:28:55 retaineddraft/open/unmerged. This accepts e679 only, not a newer checkpoint.

First finish current full original content/integrity/deliberate strict protocol, exact staged immutable source bytes and normal canonical push before hard05:53:52.323866 UTC, measured from actual e679 normalpush05:23:52.323866. Then inspect the entire new exact-source hosted native log and genuine official ZIP/report/source hashes; update originaldraftPR20 and read back exact source/body/state. Actual closure and delivery times belong in private receipts and originalPR20; no proposed timestamp is presented as observed. Root is arranging a bounded Checkers timing window: finish this owned finite checkpoint, send actual closure/HOLD ACK, and start no new parse/adoption/ZIP/hash work until released. No complete-row/Ready/strict KEEP GOING claim.

After release, adopt only genuinely supported candidates through a new exact e679132-row148-source1951-classification/full151-record A+B restoration. Keep the historical candidate packet unchanged and validate current truth before serving its restored e679 view. Validate source independence and122-word shared-page budget, complete original-author scopes and all retained primary/controller quotes; append only bounded new heading/common-action clauses. Night Lights and9 Coin categories stay excluded. Restore e679 then call old Mouse.validate directly, never recursively call its historical_view from the new recovery validator. Layer old Mouse historical_view carefully for inputs already restored to1bbc: first validate current new truth through new recovery, then old Mouse.validate at e679. Keep all old classifiers/malformed fixtures. RegenerateCSV, every row/source/A+B audit and manifest, run full original gates, deliver only this canonicalbranch/draftPR20 and genuinely accept its new artifact. These candidates are16 possible future fields, not16 delivered gains. Detailed controls/timers/win/score/tie/payout and exact independent second-wiki English roster remain open.
