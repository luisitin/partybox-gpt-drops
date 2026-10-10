# B05 — Verification and unresolved requirements

## Verdict

**Structural checks PASS; strict research acceptance NOT MET.** Of 95 claim/gap rows, 33 are corroborated, 39 remain single-source, three retain conflicts and 20 remain explicit unknowns. Four new complete confirmations cover the Classic pair/trio, ordinary 20-coin Star price, retained Pro doubled spaces/duels and the full Pro Lucky/Unlucky outcomes. The six other Bonus criteria, all nine tie procedures and complete event priorities remain unresolved.

All 25 retained URLs were actually reopened in both fresh passes; all 192 short registered quotations recovered per pass, 384 total. All 141 claim/bonus/effect/string/policy rows were reviewed in both contextual passes. Each review carries a canonical SHA-256 matching the exact delivered data. The same assistant performed both passes; no independent researcher or primary-frame observation is claimed.

The 22 source-attributed strings include 11 voice and 11 host-text lines. Speaker/when fields follow the actual source headings. Their timestamp fields remain null. An untimed automatic-caption lead was retained separately and is excluded from accepted criterion/tie evidence.

## Executed commands and results

Environment: Python 3.12.14; jsonschema 4.26.0. Seed N/A (deterministic). No Monte Carlo, controlled gameplay replay or exhaustive engine-state test is claimed.

`python verify.py --structural` exits 0: 18 suites, 1129 suite cases. `python verify.py --strict` exits 1 for the documented unresolved research gates. `python verify.py --structural --checksums` additionally checks all 72 manifest hashes. The full CI uses these same commands and expects strict exit 1 while the PR remains a research draft.

| Suite | Cases passed | Seed | Exact command |
|---|---:|---|---|
| JSON_SCHEMA | 6/6 | N/A | `python verify.py --structural` |
| UNIQUE_IDS | 7/7 | N/A | `python verify.py --structural` |
| CLAIM_SOURCE_REFERENCES | 147/147 | N/A | `python verify.py --structural` |
| CATALOG_REFERENCES | 24/24 | N/A | `python verify.py --structural` |
| STRING_SOURCE_COMPLETENESS | 22/22 | N/A | `python verify.py --structural` |
| SOURCE_EXCERPT_BUDGET | 25/25 | N/A | `python verify.py --structural` |
| CITATION_CAPTURE_SCHEMA | 50/50 | N/A | `python verify.py --structural` |
| REGISTERED_QUOTATIONS_RECOVERED | 384/384 | N/A | `python verify.py --structural` |
| AUDIT_REPORT_SCHEMAS_AND_COVERAGE | 2/2 | N/A | `python verify.py --structural` |
| CORROBORATION_LINEAGE_GUARD | 34/34 | N/A | `python verify.py --structural` |
| DOCUMENTED_CATALOG_COUNTS | 2/2 | N/A | `python verify.py --structural` |
| UNKNOWN_BEHAVIOR_REMAINS_NULL | 11/11 | N/A | `python verify.py --structural` |
| RECORDED_ROW_RECHECK_A | 141/141 | N/A | `python verify.py --structural` |
| RECORDED_SOURCE_REOPEN_A | 25/25 | N/A | `python verify.py --structural` |
| RECORDED_ROW_RECHECK_B | 141/141 | N/A | `python verify.py --structural` |
| RECORDED_SOURCE_REOPEN_B | 25/25 | N/A | `python verify.py --structural` |
| NEGATIVE_REJECTION_CASES | 10/10 | N/A | `python verify.py --structural` |
| FILE_SIZE_LIMIT | 73/73 | N/A | `python verify.py --structural` |
| SHA256_MANIFEST | 72/72 | N/A | `python verify.py --structural --checksums` |

The negative cases include a syntactically malformed review hash and an actual post-review claim-text change. Both are rejected. All files are below 30,000,000 bytes. The manifest includes the job files and B05 workflow, excluding itself. Final manifest output is observed locally after this document is finalized.

## Actual schema-validator and strict output

```text
$ python verify.py --structural
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 147/147
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 22/22
PASS SOURCE_EXCERPT_BUDGET: 25/25
PASS CITATION_CAPTURE_SCHEMA: 50/50
PASS REGISTERED_QUOTATIONS_RECOVERED: 384/384
PASS AUDIT_REPORT_SCHEMAS_AND_COVERAGE: 2/2
PASS CORROBORATION_LINEAGE_GUARD: 34/34
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 141/141
PASS RECORDED_SOURCE_REOPEN_A: 25/25
PASS RECORDED_ROW_RECHECK_B: 141/141
PASS RECORDED_SOURCE_REOPEN_B: 25/25
PASS NEGATIVE_REJECTION_CASES: 10/10
PASS FILE_SIZE_LIMIT: 73/73
STRUCTURAL_RESULT=PASS; suites=18; seed=N/A (deterministic)
EXIT=0

$ python verify.py --strict
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 147/147
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 22/22
PASS SOURCE_EXCERPT_BUDGET: 25/25
PASS CITATION_CAPTURE_SCHEMA: 50/50
PASS REGISTERED_QUOTATIONS_RECOVERED: 384/384
PASS AUDIT_REPORT_SCHEMAS_AND_COVERAGE: 2/2
PASS CORROBORATION_LINEAGE_GUARD: 34/34
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 141/141
PASS RECORDED_SOURCE_REOPEN_A: 25/25
PASS RECORDED_ROW_RECHECK_B: 141/141
PASS RECORDED_SOURCE_REOPEN_B: 25/25
PASS NEGATIVE_REJECTION_CASES: 10/10
PASS FILE_SIZE_LIMIT: 73/73
STRUCTURAL_RESULT=PASS; suites=18; seed=N/A (deterministic)
FACTS_DUAL_SOURCE=33/95; FAIL
BONUS_CRITERIA_DUAL_SOURCE=3/9; FAIL
BONUS_TIE_PROCEDURES_EVIDENCED=0/9; FAIL
STRING_PRIMARY_CAPTURES=0/22; descriptive provenance, not an additional prompt requirement
FULL_TIMELINE_COVERAGE=INCOMPLETE
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT=1
```

## Source reopening log

Retrieval times and exact returned-markdown fingerprints are in the linked per-source receipts. Exa text may be cached; these do not claim a direct HTTP 200 or a fresh Nintendo-origin response.

| Source | Pass A | Pass B | Registered quotations per pass |
|---|---|---|---:|
| NIN | [opened, all recovered](reports/source-captures/A-NIN.json) | [opened, all recovered](reports/source-captures/B-NIN.json) | 7 |
| GAME | [opened, all recovered](reports/source-captures/A-GAME.json) | [opened, all recovered](reports/source-captures/B-GAME.json) | 20 |
| BONUS | [opened, all recovered](reports/source-captures/A-BONUS.json) | [opened, all recovered](reports/source-captures/B-BONUS.json) | 11 |
| QUOTE | [opened, all recovered](reports/source-captures/A-QUOTE.json) | [opened, all recovered](reports/source-captures/B-QUOTE.json) | 41 |
| HOME | [opened, all recovered](reports/source-captures/A-HOME.json) | [opened, all recovered](reports/source-captures/B-HOME.json) | 14 |
| MNN | [opened, all recovered](reports/source-captures/A-MNN.json) | [opened, all recovered](reports/source-captures/B-MNN.json) | 9 |
| GR | [opened, all recovered](reports/source-captures/A-GR.json) | [opened, all recovered](reports/source-captures/B-GR.json) | 4 |
| MPL | [opened, all recovered](reports/source-captures/A-MPL.json) | [opened, all recovered](reports/source-captures/B-MPL.json) | 5 |
| MPLTV | [opened, all recovered](reports/source-captures/A-MPLTV.json) | [opened, all recovered](reports/source-captures/B-MPLTV.json) | 7 |
| TV | [opened, all recovered](reports/source-captures/A-TV.json) | [opened, all recovered](reports/source-captures/B-TV.json) | 7 |
| IGN | [opened, all recovered](reports/source-captures/A-IGN.json) | [opened, all recovered](reports/source-captures/B-IGN.json) | 8 |
| ZU | [opened, all recovered](reports/source-captures/A-ZU.json) | [opened, all recovered](reports/source-captures/B-ZU.json) | 6 |
| TRACKER | [opened, all recovered](reports/source-captures/A-TRACKER.json) | [opened, all recovered](reports/source-captures/B-TRACKER.json) | 10 |
| EXCHANGE | [opened, all recovered](reports/source-captures/A-EXCHANGE.json) | [opened, all recovered](reports/source-captures/B-EXCHANGE.json) | 5 |
| MINI | [opened, all recovered](reports/source-captures/A-MINI.json) | [opened, all recovered](reports/source-captures/B-MINI.json) | 4 |
| BOWSER | [opened, all recovered](reports/source-captures/A-BOWSER.json) | [opened, all recovered](reports/source-captures/B-BOWSER.json) | 8 |
| HIDDEN | [opened, all recovered](reports/source-captures/A-HIDDEN.json) | [opened, all recovered](reports/source-captures/B-HIDDEN.json) | 2 |
| RACE | [opened, all recovered](reports/source-captures/A-RACE.json) | [opened, all recovered](reports/source-captures/B-RACE.json) | 1 |
| CGM | [opened, all recovered](reports/source-captures/A-CGM.json) | [opened, all recovered](reports/source-captures/B-CGM.json) | 2 |
| MPLGAME | [opened, all recovered](reports/source-captures/A-MPLGAME.json) | [opened, all recovered](reports/source-captures/B-MPLGAME.json) | 8 |
| FAMI | [opened, all recovered](reports/source-captures/A-FAMI.json) | [opened, all recovered](reports/source-captures/B-FAMI.json) | 1 |
| NINTV | [opened, all recovered](reports/source-captures/A-NINTV.json) | [opened, all recovered](reports/source-captures/B-NINTV.json) | 2 |
| GFAQCLASSIC | [opened, all recovered](reports/source-captures/A-GFAQCLASSIC.json) | [opened, all recovered](reports/source-captures/B-GFAQCLASSIC.json) | 3 |
| GFAQPRO | [opened, all recovered](reports/source-captures/A-GFAQPRO.json) | [opened, all recovered](reports/source-captures/B-GFAQPRO.json) | 6 |
| NINUK | [opened, all recovered](reports/source-captures/A-NINUK.json) | [opened, all recovered](reports/source-captures/B-NINUK.json) | 1 |

## Full per-row review log

Pass A challenges factual scope/composite qualifiers. Pass B challenges same-game applicability, lineage, aliases, numerical implications, speaker headings and unresolved exceptions. A matching row fingerprint is checked before either review can pass validation. Unknown bonus ties keep each full bonus record unverified even when its core criterion is corroborated.

| Row | Pass A | Pass B | Canonical SHA-256 |
|---|---|---|---|
| claim:SET01 | single_source | single_source | `514d5039fa83b4abb8bb64075afe76035d5082299c4447fafc38476f906a3afc` |
| claim:SET02 | corroborated | corroborated | `002a3dc1270a2935a10ec0f6bb72e98274f64f12e64f33a1b436267edfa35cdb` |
| claim:SET03 | single_source | single_source | `37dcc9c147b8e08f5d78b9bddf4d2274a5fed7a5f0d23097c891cc49d01f4ff2` |
| claim:SET04 | single_source | single_source | `efe52ec8d052248a81435db451b13533c85746dc853677d523f150d527afda68` |
| claim:START01 | single_source | single_source | `207fc95eb776cbb9e479a29171338efa7eed4452ad8dd20344d7dfbbee76f213` |
| claim:START02 | single_source | single_source | `bcb4df3e0937cb9c7f8588037e9423b0d1d672640390ee29dc9c1a65b7b437c9` |
| claim:START03 | single_source | single_source | `e9cb59638d44c7bfaabfde249b5cf761d88b736700c56ee07cbdf4dc8b670326` |
| claim:START04 | single_source | single_source | `baae9f36a42916db51a4c46c8aeb63a2d405819d6b1cbb2d5d15e8085bbb3e5a` |
| claim:TURN01 | corroborated | corroborated | `844e57fface79c519ecedbf4f56b998eca631aa139ec13991110359b7d7f73d2` |
| claim:TURN02 | corroborated | corroborated | `3ed6e2bf1357e2a9db69496355c1f5e438b64350994f0caf703211bd30e807e9` |
| claim:TURN03 | single_source | single_source | `1f6add62450f7aa2c500eb4ae5a8d0f0de0e77b9d6427633a88c4499771d8ca1` |
| claim:TURN04 | corroborated | corroborated | `143923aafcef95f8529bb2961f729450045915869d52e79f0556df5869da18eb` |
| claim:TURN05 | corroborated | corroborated | `6375b3e8ddd9c5af403e5337dda4f481e3c26bd71d5dab9b5657aaceb1211aec` |
| claim:TURN06 | corroborated | corroborated | `2e47f7810f75fc0a94996c92cd0b969fb7bb1622ff36390cd2195ced1fdfe3cc` |
| claim:TURN07 | corroborated | corroborated | `7b3b6d35158bcbd3fff39bdd4e4de71c2639ef6a516367b823fa4b4afa36f83c` |
| claim:TURN08 | corroborated | corroborated | `e185921a47efe93051e1a78cffec09cee15da2ebc3d8c96f1120201e896d736c` |
| claim:TURN09 | corroborated | corroborated | `2c9c4b7b5bbda17f98656c3b6654ca08790498a2e359a11848037c9a9240e6ae` |
| claim:LAND01 | corroborated | corroborated | `654dee9161fda5def6049c7df8280d2f7553dc783ef8808269e8c08321176769` |
| claim:LAND02 | corroborated | corroborated | `338e2fb9a139cd68803ac7f244c0e89f7b27849c12ce6a222d99abc280bb8c76` |
| claim:LAND03 | single_source | single_source | `aeda5ddf554f067981e31efca791d05738d61d3e5dfe894193a729e9319f6702` |
| claim:LAND04 | corroborated | corroborated | `aa8bca535740ac28540f6f2176a980fdc2a8d2fba4392291a24e48090c12f721` |
| claim:LAND05 | corroborated | corroborated | `ca75ab1f0c6559593f22dbbcfa6c0daa562a0639239fcdc2574fd7f7c425e29f` |
| claim:LAND06 | corroborated | corroborated | `37d1f98089859dbb1ced66dd4a03ba072f8ab5f853b3ee6f0b1a259f39f36073` |
| claim:LAND07 | corroborated | corroborated | `2c224fc628a9eb6fc443ea9985f6bc44d8db1e41d62dc30b329339a7a894a76b` |
| claim:ROUND01 | single_source | single_source | `dc33cd67f158a3d2a249b8ebb2466567cdbd8948e4d59927a213a181374d6220` |
| claim:ROUND02 | single_source | single_source | `14836bdbf34791310907b928fec3ce03bb989896c5f6b8d53a67a4ee587d063a` |
| claim:ROUND03 | single_source | single_source | `920f046a6b6f8652bb7080cb995745ec994de295facc90e8bc35b805fbcbb927` |
| claim:ROUND04 | single_source | single_source | `a9a0f273b57408a11f5742a0d31ab9e4e84391d3a522a369b72d64dd0ae0fca5` |
| claim:HOME01 | single_source | single_source | `b8724b985909eb877d55570facf44811a5f71dc04d0d878faabedaf843473de1` |
| claim:HOME02 | single_source | single_source | `59bef118084d0fe24f97f7791df5ba4c71020c96cd186faabb6821b7ad1dbbdb` |
| claim:HOME03 | single_source | single_source | `fac1fb016a55141b61fddad91851dd785c6a24ac0cbcc74da5357078a53318e8` |
| claim:HOME04 | conflict | conflict | `b852202e56f0553cae77621bffd9a00e5573b45b1eb07de86ae710262948abb8` |
| claim:HOME05 | single_source | single_source | `b05ca60b9c973347370bbd8b2e150fa8ec708d314f753eaef777f716c5ed9394` |
| claim:END01 | single_source | single_source | `adb1278e52fb3d237c5bc5d5c1fff7b9fb5d4210f3e4fb081d8d2b73d499ba0f` |
| claim:END02 | single_source | single_source | `2a52e4ed356d732d28a59cb7257ab6e1b9144b0108198b3a88802ee9d8d9b871` |
| claim:END03 | corroborated | corroborated | `b26f9efc165f222a27b8a773f43248bcd0524bc537aebc3f0ab3fcd9f83603a4` |
| claim:END04 | corroborated | corroborated | `e2889a5a288476a671c00a5385c301fa5c4395e14a887726ee664a4c3bc4e6ac` |
| claim:END05 | single_source | single_source | `b673e8ed5acff6e0694fb3fb06bdc1ed7ca3d64329a80c39549037af81275e91` |
| claim:END06 | single_source | single_source | `8c50ec9040e973125dc228207370b5789deee2abdecca62ce2e7aec591da2161` |
| claim:COUNT01 | corroborated | corroborated | `001dbde453e6dbf069acfee971137e8feafff8751af2656404b2474d48d70b5e` |
| claim:COUNT02 | corroborated | corroborated | `ce62f12b47566f5dcbd36756dae59f857fac7331e4b14b4ec3c78942bc6eca2c` |
| claim:COUNT03 | corroborated | corroborated | `745b1ef921194d14bd2722760167594842e5bf639605c41fc409a5aec32b2c18` |
| claim:COUNT04 | corroborated | corroborated | `32836ea264f8cd1edd7285f0692ca67322c209ef54224e2eb583c1f8550a8450` |
| claim:TIE01 | conflict | conflict | `c8261cb6ea4ec13dd50bceb66f8195bd79dfd2c5f4ed1b9156d3bf79cbb25336` |
| claim:TIE02 | single_source | single_source | `af625c79b5ae72f96dea12d4e4fa3b6200415233bf324d9f0bd5b6a2a027bd43` |
| claim:PRO01 | corroborated | corroborated | `18150633784c7532ba81fef396dea549b95f15716b4ed2d35a88664bb7bc7380` |
| claim:PRO02 | corroborated | corroborated | `c824ee30b743a8fec8b2035dda58d56f1759d4a7889b19398f233d0f638e7bb9` |
| claim:PRO03 | corroborated | corroborated | `835a613b25e792f8ca9e01d8a30ce7b2466e875b7af01e462657ce6bc36e85b2` |
| claim:PRO04 | corroborated | corroborated | `1f3414a355b713f650ee2b6d9c7a30814ac6a6425b329ab3b91fa508519e5d44` |
| claim:PRO05 | single_source | single_source | `96184aa8fc3faaad31496ab1af527e2d566b5318ebed1d1fac83243ad0c71cd5` |
| claim:PRO06 | single_source | single_source | `50d579e161adec81008be460e4cfa78ff9c5403a046c31158f9c6a582d9e28a6` |
| claim:PRO07 | corroborated | corroborated | `ae29ad36b9c4dfc6823c5f49bc509dd9cad4dcda21c43c52dfe2e7e8a9b00e9a` |
| claim:PRO08 | single_source | single_source | `dcde25de990717437893ad610ddb2f378354772b3db576379f17d9348615a9bd` |
| claim:PRO09 | conflict | conflict | `1a8f1a91cc2a53ceda3659c6c82180622a2691ca2ca81df0fb47597905f578b6` |
| claim:TV01 | corroborated | corroborated | `5e45791349abdd12ebf41147910e0ec8f0728f89aa59d1432c1d5bef4b303e34` |
| claim:TV02 | corroborated | corroborated | `0c91e768369ef982291cea7a37ae9373dbc187a653db248dc3c1f8b234cb7cba` |
| claim:TV03 | single_source | single_source | `7ce8c8909e7bbc86ace0bc2a8263b3a089dc82755a9500ad65c0449d601a8bec` |
| claim:TV04 | corroborated | corroborated | `8eb5fa542be1d129467120351388c13d9b4e331c2dc9de45180da25f0f46854c` |
| claim:U01 | unverified | unverified | `4bdf0e3a0d2beb4c0680116502de62a0a7ddbfe75e84e173e65712d73548886b` |
| claim:U02 | unverified | unverified | `65e504acc1c5e6d9ce6b899906d51c022d61892dbe09e1da1cbaf7327b7d2add` |
| claim:U03 | unverified | unverified | `9c782e426e94f1ccd4a11773a4a945199ebf8ce946daa42507ee831f7183b066` |
| claim:U04 | unverified | unverified | `fa3f9e813ce829a3b56417057b258b2d316010e9d7bbc94de492b0540d36c38a` |
| claim:U05 | unverified | unverified | `87a135a388e738c4982a02427bf54b839d47c813d5797d3776052acba71e8a09` |
| claim:U06 | unverified | unverified | `8fc5ca8e6f0b95b9cb912135b39b5c3ab8ba80b976873013eb87a358b9dcb52b` |
| claim:U07 | unverified | unverified | `16785795976a549b8f831924db22215bb03ccf1ac9cd1e1d617165beccbcfa37` |
| claim:U08 | unverified | unverified | `c4247dbdf686f105c6d887080a27d048b3776eb5b8d56c0c388057796a33ba8b` |
| claim:U09 | unverified | unverified | `e12cfe9ec8b6a189a87e485de4fbe38a3896f7ac4ce69b5dfc7dff02e9d8243d` |
| claim:U10 | unverified | unverified | `e8a0b8d5abdc3d74b77458c4bf84ccb1991a779192665ce1f7fe999d41716b1a` |
| claim:U11 | unverified | unverified | `9d0ebecc3a31bb84a2ef857cb61a6d361d357e347db15154b9bbc180f66c5d33` |
| claim:U12 | unverified | unverified | `9062846450ebc128a10a73cf9eff3d07886caa3fdb2b37ca3110385802943173` |
| claim:U13 | unverified | unverified | `520f0174fe15177079588f98d2054892cb80c719aa2d35b758278b505d6eb6dd` |
| claim:U14 | unverified | unverified | `969e2ebdb560e2b600d171d6a637d5d052443035542265dc29b32abba785f476` |
| claim:U15 | unverified | unverified | `40de563150f21e71149154177347c49d9a1f2851754eebad7eb5e16fcaa154cf` |
| claim:U16 | unverified | unverified | `f3fc415f90050d7da5e24fd9313b4691547e03f7d6beb6aa40b21385de382d6b` |
| claim:U17 | unverified | unverified | `e25587890daa98c8ada4010894b278ec09eab033513fff79b75b3b3d4ac255d8` |
| claim:U18 | unverified | unverified | `93f58f7cb896cd4d292e1fd17440df7e30cf2130c590bf32d8ab706820656aa6` |
| claim:U19 | unverified | unverified | `b9ba95ee5bea02b44d14475d3dac32b73e64a96ff75663382ea810e076f710d7` |
| claim:U20 | unverified | unverified | `a32f56eb58d33713c6215359a58695749699e67bcf3cde2484f84b01fb6874d9` |
| claim:BONUS01 | single_source | single_source | `5b079dd6089b5b50028790d56f169df52d197a4ba0f7720808cbcb7572e70b40` |
| claim:BONUS02 | corroborated | corroborated | `4b86354390bc019053c2a2ada8c6b5478bfca235879234a1645958eaaaad4fb1` |
| claim:BONUS03 | single_source | single_source | `5faf94ee596a82e9e0aeab34f2bb409ede97815973c0ee987c5829e55dd4be5a` |
| claim:BONUS04 | single_source | single_source | `77b1263ab4c893eec734483787ac244a576b2155501978aebb818199a8c1ecb9` |
| claim:BONUS05 | single_source | single_source | `03a5b9fe5521f97412a7bfa936043a4238fe8d820c6fcd79d52e207ebc4cdc40` |
| claim:BONUS06 | single_source | single_source | `02c60b6b0023dd03b0f048d1724540bd1b8fe25a4a863d87a51ed64349ed38e0` |
| claim:BONUS07 | single_source | single_source | `595dca62b875cffc104cd8c7c4b87f52d4d465e728170b259eacdc88a1e583ab` |
| claim:BONUS08 | corroborated | corroborated | `4daeb9e79c40c7c33f4a63cce601c6500d4e3e0991b8c66c63eccbc90255a785` |
| claim:BONUS09 | corroborated | corroborated | `9016baee74490548bde962eea61af95698e0505cb9c546a542bc40f7f9e436dc` |
| claim:EFFECT01 | single_source | single_source | `28a2a68df9b403c24e8d67b484ebd4aec6e745d0035ce373a4e7c9ed1e9ed9ed` |
| claim:EFFECT02 | single_source | single_source | `1e79d9a1d58619df5f44fd2582ba695a75c31681827bc52e35050c3d5cba2dd0` |
| claim:EFFECT03 | single_source | single_source | `cd3513aafb13ff0f8570ae68fddcb6d1473de09424aa10c443403347128a4f22` |
| claim:EFFECT04 | single_source | single_source | `8b8868813622c5bd433a09b9a97a72bddcc745c70d587df2f20dd5c196f76aa0` |
| claim:EFFECT05 | corroborated | corroborated | `bef7cb6937465de3d18af2ab70c8626c3f416fe22aed7a733c7376fa6e91126b` |
| claim:EFFECT06 | single_source | single_source | `55f52ea144f35d52be946546a2381173393a32b87bb46a2381720bae25a9ba02` |
| claim:EFFECT07 | single_source | single_source | `9ef4d6653aee56881288338613e553d000e0f3d984c3cb25222f7e8d65038d1f` |
| claim:EFFECT08 | single_source | single_source | `f6e8f38737c0fb4f5c92ddaf29fe18900a40b30c78a3c5b71118ce69bbc0415e` |
| bonus:bowser-space | unverified | unverified | `3b75fdd95d2f427ccdd356cd31c39a76fac1f2c3d3a91410037609ae0fb7530f` |
| bonus:eventful | unverified | unverified | `f3915738f691f235f4260cefbebf0bc27235d1948cad2ca454206a3f4531359d` |
| bonus:item | unverified | unverified | `6b513576eac7f6945021080049a3d081774aa5f65d7e356bacd658f59f380f4e` |
| bonus:minigame | unverified | unverified | `7082cec4ec0a9113d7134768a0c61cc4ad40b799e64a11c424a7389fd410d71b` |
| bonus:misfortune | unverified | unverified | `8367c906822478b1809f595bd677ff7d715797bb19ed3d2cd2e37ee4191dc796` |
| bonus:rich | unverified | unverified | `2b114ee42396cd91e0868471d691859305bfefc913e08fe5ff290b3321f6c770` |
| bonus:shopping | unverified | unverified | `376719c3281a8e3413ad0b772eafeed55bebede19949c17499f7b968e6c93958` |
| bonus:sightseer | unverified | unverified | `f6279ad5fc95fccad769da40913d79a9aebdb1a0f516d5464787fff96ed87395` |
| bonus:slowpoke | unverified | unverified | `4d4480cb08366696218735dbf5a3d58dd45f237caef422015eb576de624c655c` |
| effect:mushroom | single_source | single_source | `68aaeca06afded5f1fbd92029ca3b307b116513fe01f7a142c43f74255fe89dd` |
| effect:extra-star | single_source | single_source | `3dfb0583249232d23baed2ac643a27eb49f87cba75a9d00f5d184708e31617c6` |
| effect:star-steal-traps | single_source | single_source | `6213436e7cfe66c248e342ec608e6556340ded550cdde519dc2884a0670eead1` |
| effect:double-dice | single_source | single_source | `ec569f26f1fa737485f6edb69612f7064820a9dd57a812f9e3bd656523300a5f` |
| effect:space-coins | corroborated | corroborated | `eed1dc1f8468b2770ab7b7360b6a1bef9315a010bf5d25c601ecd359614ba7e1` |
| effect:wallet-coins | single_source | single_source | `3d79b6fee9ded3e92816686dcb2dcae25b24031154e0b55750db391c916e745c` |
| effect:more-bowser | single_source | single_source | `1a37a40a4df3ba6b509f3aa5de4d6a4b7134f1b59774f0309166998d0c57a35f` |
| effect:more-chance | single_source | single_source | `654a95ac36193120dadf62ed80a30fd350a332541a698aca6b7ecd0dc4452f0d` |
| string:ann-start | single_source | single_source | `3df520a98cb9f4bf95e9053812c212c7654302878d3319d10976121a759b1feb` |
| string:ann-minigame | single_source | single_source | `12061a72492902c52cbfbc01b0b946df9d20e63c90e0ce30793d2c2721e06b88` |
| string:ann-new-turn | single_source | single_source | `dfc410d3b00760d21396058064ec7c9b48b86be1100f0d7f6c6c95826d8c5865` |
| string:ann-homestretch | single_source | single_source | `23668d6a0c12f6d63be98986940b033e34c2dbae72c0904d037328334a801ae0` |
| string:ann-final-turn | single_source | single_source | `25a8f616e986fea28b83cf68c573b9a9cc318d13c5e63f82c75b5e09a554112f` |
| string:ann-final-minigame | single_source | single_source | `9332d5b18637c09b792b7461330933e29752816cd67938b4a2e2a0d0089f4c28` |
| string:ann-congratulations | single_source | single_source | `3168cc35890ce2a940d0eb2a0155273559bf4d5db86abec36486aad6981c53e3` |
| string:ann-game-start | single_source | single_source | `4ba76b831f2761648fa8cb88cf41bc54eba051affc017228c4cacecfcc63c687` |
| string:ann-finish | single_source | single_source | `d6b36c415e3d0de7bea13952b4b822bfc1856f8270e1c0bb210840e6c35dba5f` |
| string:ann-winner | single_source | single_source | `9f90ac0465198ced9ec0a7a01e78220a0c14bca08a763fde930e02cbbed29b32` |
| string:ann-tie | single_source | single_source | `735eed5b780ffaada2982cb8b55c8e9baa6dcfba215a9d0a7cde4a259ff0d1f9` |
| string:host-welcome | single_source | single_source | `a110cfff159fe1f61a4639f712ec9333aec5de3147d34210f43a13d53eab82bf` |
| string:host-choose-event | single_source | single_source | `923ae9160424b6bba98914a0fbb7f7950712e9066f5342d2ca1855413d85c8eb` |
| string:host-bonus-01 | single_source | single_source | `63f67fde7d4e8e18d0a8f8a761421dc7fb47e36064cd773feac51b028215c1b7` |
| string:host-bonus-02 | single_source | single_source | `efa9cb67f8e33032066151fad1d062e986c1db70ea0432dd13c177528df310f8` |
| string:host-bonus-03 | single_source | single_source | `faa9fabc560a084cd5a8d4de5e650350ddbba06bce6b536d23e8450988b9ce92` |
| string:host-bonus-04 | single_source | single_source | `39c6b6e0dd6e71fffce58dc2bd64e83d084c300d0d78342a8981b9262e3bbef2` |
| string:host-bonus-05 | single_source | single_source | `801c254cd92acf8254b1a1f1f028a981e69ee81a1bd554949abe1f48cec53fa8` |
| string:host-bonus-06 | single_source | single_source | `64751af31adc6851a6e61049b667a9ff6d9697788a0a0d93418110ab4d8a8eed` |
| string:host-bonus-07 | single_source | single_source | `20bfa577c63b2862576a5359556a5a0eaf1608627cf1c91afc6c1dee28557e56` |
| string:host-bonus-08 | single_source | single_source | `beae4348f7fa88ddfed9edb2f3d0c251094804e2f4b6d8639b54d8f20a19e60d` |
| string:host-bonus-09 | single_source | single_source | `3ea9367bcd349b249ca650aeb5abbf3735adee07102d34f3341dbaeb5ad27e79` |
| policy:party-off | corroborated | corroborated | `dc4953e4ff4ec2ee34e6c5e92b765c16d4a2a1e6ff2221a0cfa9d4d67cda0466` |
| policy:party-random-below-30 | corroborated | corroborated | `6f959e799db92de3dadcea2f6e7d805a8ec380b63f1c040948594597479b88e1` |
| policy:party-random-30 | corroborated | corroborated | `b8adc413fad0e8d72867315e632f4b44a179bf9bb62032766ecb1e8016c82c19` |
| policy:party-classic-below-30 | corroborated | corroborated | `992440e8e0e07f4bf4ca52f8483f099ad3cd965b4705e0f856a9fb5dc29cc317` |
| policy:party-classic-30 | corroborated | corroborated | `cf3a506639929680e6b09b50e7bc58fc278cbdd133d2c8799c031cef97fa95e2` |
| policy:pro-12 | corroborated | corroborated | `824eb7e1575258debcf24ce023a5fc2ee3eb6af830d7631edbcb2b1a2673cc99` |
| policy:tv-frenzy-5 | corroborated | corroborated | `2062ecc5ab4c36be9c796a3d62a53b5f623fcf3a3a855d27070d7082df0d5288` |

## UNVERIFIED

- Complete original research acceptance remains NOT MET: 62 of 95 claim/gap rows lack complete independent confirmation.
- Six Bonus criteria and all nine tie/zero-activity procedures remain open. Random category sampling and probabilities remain null.
- Exact item/Buddy ordering, branches, trap/landing priorities, board phase hooks, payouts and all ending tie cardinalities remain incomplete.
- Selected strings match the retrieved transcript, not captured game frames. Region/build variants and a complete script remain unknown.
- Independent second researcher, controlled replay and exhaustive engine-state testing were not performed.
- The direct video URL access failed with an actual 403 tunnel response; its untimed auto-caption lead was not promoted to accepted evidence.

### Every unresolved claim/gap row

- **SET01 — single_source; medium:** Party turn limits: 10, 15, 20, 25, or 30. MNN lists every permitted length; IGN confirms only the endpoints 10 and 30. Do not treat endpoints as a second enumeration.
- **SET03 — single_source; medium:** Motion minigames and minigame explanations can be disabled; handicaps can grant 1–5 starting Stars.
- **SET04 — single_source; medium:** Yellow Toad supplies Party host text; Purple Toad supplies Pro host text.
- **START01 — single_source; medium:** The host welcomes players and offers a board explanation.
- **START02 — single_source; medium:** Players roll dice to establish turn order.
- **START03 — single_source; medium:** The host distributes 10 starting coins to each player.
- **START04 — single_source; medium:** The host introduces the first Star target before ordinary movement; the transcript marks its roaming-Star prompt as excluding Mario's Rainbow Castle. Board-specific introduction variants are not fully transcribed or independently checked.
- **TURN03 — single_source; medium:** A Star purchase can be offered while passing its bearer; exact landing is not required.
- **LAND03 — single_source; medium:** An Item Space can use a roulette or item minigame; no item is awarded on the final turn.
- **ROUND01 — single_source; medium:** After all four players have moved, a minigame concludes the round.
- **ROUND02 — single_source; medium:** Vote offers three minigame choices; all four players vote. The independent player report confirms three choices and a random player-choice selection, but omits explicit four-voter cardinality. The complete row remains single_source; weights, tie effects and repeat suppression are not inferred.
- **ROUND03 — single_source; medium:** Bonus Minigames double the coins won.
- **ROUND04 — single_source; medium:** Showdown, Item, Duel and VS interruptions are distinct from the ordinary round-ending minigame. Exact interruption/resumption event priority remains unverified.
- **HOME01 — single_source; medium:** Homestretch occurs with five turns remaining, before those remaining turns are played.
- **HOME02 — single_source; medium:** The host announces standings, then Blue/Red become +6/−6 and same-space landings can trigger duels.
- **HOME03 — single_source; medium:** Party adds a special event chosen by a player or randomly; Pro omits this extra event. ZU corroborates Pro omission only. Chooser rules remain single-lineage.
- **HOME04 — conflict; low:** Eight possible special effects are listed, while the source wording refers to five; full menu-generation rules are unresolved. C01. Do not infer eight simultaneous choices or uniform sampling.
- **HOME05 — single_source; medium:** After the special event, the host gives two tips and board play resumes.
- **END01 — single_source; medium:** The final round still has a final minigame before the results ceremony. NIN supplies the round loop, not direct evidence of the final-round exception boundary.
- **END02 — single_source; medium:** The ceremony reviews Star totals and notable acquisitions before presenting enabled bonus awards.
- **END05 — single_source; medium:** The quote list attests a two-winner announcement for equal Stars and coins. Evidence of a co-winner case, not proof of every tie-cardinality rule or a generic dice tiebreaker.
- **END06 — single_source; medium:** Postgame statistical Awards are separate from the nine scoring Bonus Star categories.
- **TIE01 — conflict; low:** A series-level source describes tied bonus leaders each receiving a Star, but its adjacent Battle Royale/Tag Team exception is ambiguous for Jamboree. C03. No unconditional tie algorithm is certified in this drop.
- **TIE02 — single_source; medium:** The host transcript attests that an award can have no recipient. All-zero thresholds and Slowpoke zero-distance handling are not established.
- **PRO05 — single_source; medium:** Pro uses item roulette without item minigames. The independent player report confirms absence of Item minigames, but not the precise roulette presentation. The complete row remains single_source.
- **PRO06 — single_source; medium:** Pro marks future Star sites; a used site becomes eligible again after the other sites have been used. The independent player report confirms marked spawn sites but omits the used-site reset cycle. The complete row remains single_source.
- **PRO08 — single_source; medium:** Pro VS stakes are 20 coins; the landing player selects the minigame.
- **PRO09 — conflict; low:** Pro Bowser takes a Star; without one, the reported fallback is half the coins, or all coins at King Bowser Keep. C05: GAME omits the board exception and ZU says zero exceptions. Preserve the board-specific report without calling it independently settled.
- **TV03 — single_source; medium:** Tag-Team shares Stars and coins; higher combined opening rolls act first, and teams alternate players. Both sources confirm shared Stars/coins; only MPLTV explicitly supplies the opening-roll and alternating-order rules. Entire row is not dual-confirmed.
- **U01 — unverified; low:** Exact opening-roll range, descending-order display, and tied-order-roll resolution. Unanswered requirement; this row is a question, not a proposed game rule.
- **U02 — unverified; low:** Exact input menu strings, input order, and whether all item classes obey a one-item-per-turn limit. Unanswered requirement; this row is a question, not a proposed game rule.
- **U03 — unverified; low:** Item-use versus Buddy-start-effect ordering, cancellation and unavailable-target behavior. Unanswered requirement; this row is a question, not a proposed game rule.
- **U04 — unverified; low:** Exact movement decrement rules for every shop, Star, Boo, gate and branch node; forced movement versus dice movement. Unanswered requirement; this row is a question, not a proposed game rule.
- **U05 — unverified; low:** The complete branch-choice interface, legal-edge constraints, gate/key consumption and prompt order. Unanswered requirement; this row is a question, not a proposed game rule.
- **U06 — unverified; low:** Complete priority order among traps, landing effects, Buddy repeats, Hidden Blocks and same-space duels. Unanswered requirement; this row is a question, not a proposed game rule.
- **U07 — unverified; low:** Board phase/tide/sale/conveyor hooks relative to round minigame, Buddy lifetime decrement and the next player. Unanswered requirement; this row is a question, not a proposed game rule.
- **U08 — unverified; low:** Complete landed-space-color to team mapping, green-space randomization and category probabilities in Jamboree. Unanswered requirement; this row is a question, not a proposed game rule.
- **U09 — unverified; low:** Vote aggregation, weighting, ties, unvoted options, repeat suppression and candidate-pool algorithm. Unanswered requirement; this row is a question, not a proposed game rule.
- **U10 — unverified; low:** Exact standard/coin/team/tied/Bonus Minigame payouts and which minigames count toward the Minigame award. Unanswered requirement; this row is a question, not a proposed game rule.
- **U11 — unverified; low:** Chooser selection, rank ties, five-option sampling, event weights, slot order beyond reported Mushroom rule and board restrictions. Unanswered requirement; this row is a question, not a proposed game rule.
- **U12 — unverified; low:** Inventory overflow, coin-cap behavior and atomic ordering when Homestretch grants items or doubles wallets. Unanswered requirement; this row is a question, not a proposed game rule.
- **U13 — unverified; low:** Final ranking tie rules for every cardinality, coin secondary ranking confirmation and animation ordering. Unanswered requirement; this row is a question, not a proposed game rule.
- **U14 — unverified; low:** Independent second evidence for six non-Pro bonus criteria; exact internal counters for all nine categories. Unanswered requirement; this row is a question, not a proposed game rule.
- **U15 — unverified; low:** All tied-award cardinalities, zero-activity eligibility and whether a non-awarded category is replaced. Unanswered requirement; this row is a question, not a proposed game rule.
- **U16 — unverified; low:** Random category sampling, probabilities, timing of selection, duplicate avoidance and complete Frenzy/Tag-Team award pools. Unanswered requirement; this row is a question, not a proposed game rule.
- **U17 — unverified; low:** Complete exact English on-screen text inventory, regional/version variants, visual capture, voice attribution and punctuation. Unanswered requirement; this row is a question, not a proposed game rule.
- **U18 — unverified; low:** All board-specific Pro substitutions and every exception, including final-turn item/Lucky behavior. Unanswered requirement; this row is a question, not a proposed game rule.
- **U19 — unverified; low:** Complete Tag-Team turn resolution, team tie rules, bonus counters, modifiers and final presentation. Unanswered requirement; this row is a question, not a proposed game rule.
- **U20 — unverified; low:** Controlled game replay, independent second researcher and exhaustive event-priority tests were not performed. Unanswered requirement; this row is a question, not a proposed game rule.
- **BONUS01 — single_source; medium:** Maximize Bowser-space landings. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **BONUS03 — single_source; medium:** Maximize items used. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **BONUS04 — single_source; medium:** Maximize minigame wins, not minigame coin income. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **BONUS05 — single_source; medium:** Maximize combined Red-space and Unlucky-space landings. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **BONUS06 — single_source; medium:** Maximize cumulative coins collected, including coins subsequently spent or stolen; not peak wallet size. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **BONUS07 — single_source; medium:** Maximize items bought at shops, not coins spent there. No independent second criterion source established. TRACKER is derived and is excluded from independence counts.
- **EFFECT01 — single_source; medium:** Grant one player a Mushroom. If a player selects it, that player receives it; host selection uses a random recipient.
- **EFFECT02 — single_source; medium:** Add one temporary Star Exchange. It disappears permanently after its one purchase.
- **EFFECT03 — single_source; medium:** Give all players a Star Steal Trap. Inventory-overflow resolution is unverified.
- **EFFECT04 — single_source; medium:** Give all players Double Dice. Inventory-overflow resolution is unverified.
- **EFFECT06 — single_source; medium:** Double each player's coins. Coin-cap and overflow behavior are unverified.
- **EFFECT07 — single_source; medium:** Replace two or three spaces with Bowser Spaces. Exact candidate-space selection is unverified.
- **EFFECT08 — single_source; medium:** Replace two to four spaces with Chance Time Spaces. Exact candidate-space selection is unverified.

## Polish pass 2026-10-08

Scope: correctness, product review and documentation only. No research row, data value or evidence capture was changed.

| Check | Command | Result |
| --- | --- | --- |
| Structural suites | `python3 verify.py --structural --checksums` | PASS, 19 suites, about 2 s |
| Manifest | `sha256sum -c SHA256SUMS.txt` | 72 of 72 OK before this pass; regenerated for the files this pass changed |
| Strict gate | `python3 verify.py --strict` | exit 1, as documented: FACTS_DUAL_SOURCE 33/95, BONUS_CRITERIA_DUAL_SOURCE 3/9, BONUS_TIE_PROCEDURES_EVIDENCED 0/9, STRING_PRIMARY_CAPTURES 0/22 |
| Hosted CI | GitHub run 37675945275 on head `a84fd4e` | success (`verify`) |
| Strings against capture | inline python: each `strings.json` `text` checked against the recovered quotations in `reports/source-captures/A-QUOTE.json` | 22 of 22 exact matches; all 22 single-source; none visually captured |
| Evidence spot-check | COUNT01, COUNT02, TURN04, TIE02, HOME04 excerpts read in the captures | support their claims; COUNT01's excerpt is partial, scope noted in INTEGRATION.md |

Seed: not applicable (deterministic). Case counts are as `verify.py` reports them.

UNVERIFIED in this pass: no live re-fetch of any source (most hosts are blocked from this box). Evidence was checked against the captures this job stored, not against live pages. No gameplay, installed game or primary-frame capture was observed.
