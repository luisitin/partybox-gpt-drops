# B20 — Verification

**Original research standard NOT_MET.** The 28-record roster still has two independent publisher lineages. Four narrowly scoped factual rows gained corroboration; current counts are **60/85 corroborated, 23 single-source, two conflicts**, with **84/168 empty category fields**. Keep PR16 draft.

## Actual complete checks

Executed environment: Python 3.12.14 and jsonschema 4.26.0. Seed N/A for deterministic research/schema/graph checks. Exact commands from this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # completed expected exit 1
sha256sum -c SHA256SUMS.txt
```

| Test | Cases / passed | Seed | Exact command |
| --- | ---: | --- | --- |
| CLOSED_JSON_SCHEMAS | 56/56 | N/A | `python3 verify.py --structural --checksums` |
| UNIQUE_ID_COLLECTIONS | 28/28 | N/A | `python3 verify.py --structural --checksums` |
| MODE_LIST_TWO_PUBLISHER_LINEAGES | 28/28 | N/A | `python3 verify.py --structural --checksums` |
| EVERY_RECORDED_RULE_HAS_SOURCE | 85/85 | N/A | `python3 verify.py --structural --checksums` |
| SOURCE_QUOTATION_REFERENCES | 234/234 | N/A | `python3 verify.py --structural --checksums` |
| QUOTE_BUDGETS_AND_LINEAGE_GUARDS | 28/28 | N/A | `python3 verify.py --structural --checksums` |
| SOURCE_REOPEN_PASSES | 50/50 | N/A | `python3 verify.py --structural --checksums` |
| QUOTATIONS_RECOVERED_IN_BOTH_PASSES | 458/458 | N/A | `python3 verify.py --structural --checksums` |
| SOURCE_REPORT_COUNTS_AND_LINKS | 50/50 | N/A | `python3 verify.py --structural --checksums` |
| RULE_LINKS_AND_EXPLICIT_FIELD_GAPS | 168/168 | N/A | `python3 verify.py --structural --checksums` |
| ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS | 196/196 | N/A | `python3 verify.py --structural --checksums` |
| PHASE_TRANSITION_TARGETS_AND_GUARDS | 672/672 | N/A | `python3 verify.py --structural --checksums` |
| PHONE_TV_PROTOCOL_BOUNDARY | 1/1 | N/A | `python3 verify.py --structural --checksums` |
| FULL_RETAINED_ROW_PASS_A | 309/309 | N/A | `python3 verify.py --structural --checksums` |
| FULL_RETAINED_ROW_PASS_B | 309/309 | N/A | `python3 verify.py --structural --checksums` |
| MODE_DOCUMENT_COVERAGE | 28/28 | N/A | `python3 verify.py --structural --checksums` |
| DELIBERATE_REJECTION_FIXTURES | 12/12 | N/A | `python3 verify.py --structural --checksums` |
| FILE_SIZE_LIMIT | 118/118 | N/A | `python3 verify.py --structural --checksums` |
| SHA256_MANIFEST | 117/117 | N/A | `python3 verify.py --structural --checksums` |
| Independent manifest process | 117/117 | N/A | `sha256sum -c SHA256SUMS.txt` |

The substantive structural run passes 18/18 suites and 2,830/2,830 cases. Final full checksum validation adds 117 hashes: 19/19 suites and 2,947/2,947 cases. All 12 original deliberate invalid fixtures remain rejected. All 118 delivered files, including the manifest and original read-only B20 workflow, are below 30,000,000 bytes. The full unchanged strict command returns 1 because research still lacks full independent rule/field coverage; schema success does not substitute for those gates.

## Incremental factual recovery

All original audits, source registries, rule/mode values, both changed mode documents, eight refreshed original source captures and previous verification output are preserved under `reports/historical-before-pro-coaster/`. Seven relevant full authored sources were reopened/read in each of two separate incremental Exa calls. All 106 registered source/quote combinations in these fresh captures were recovered. Across the retained original and incremental audits, all 25 sources have two captures and all 229 registered excerpts have two recovery records: 458 checks. Unchanged sources/rows retain their original complete-pass evidence; they are not falsely described as newly fetched or newly re-reviewed.

Exa may return cached extraction. Retrieval fingerprints describe extracted text, not origin HTML HTTP status, personally watched game frames, primary gameplay execution or an installed Nintendo build. Each quote is contiguous and at most 25 words; full third-party captures remain outside the repository. Authored paragraph context was checked for each of the four changed rows in both passes.

| Changed row | Pass A | Pass B | Confidence | Scope retained |
| --- | --- | --- | --- | --- |
| PRO_LENGTH | corroborated | corroborated | medium | 12 turns; exact game/build not inspected |
| PRO_UNLOCK | corroborated | corroborated | medium | Complete one Mario Party game; board/length/win qualifiers explicitly supported |
| COASTER_FAIL | corroborated | corroborated | medium | Reach the end before countdown expiry; exact initial clocks and animations unknown |
| COASTER_PLAYERS | corroborated | corroborated | medium | Up to four humans and two/four participant groups; solo CPU fill, each course/variant and patch scope unknown |

Nintendo Life describes a two-player option without asserting a maximum of two. Nintendo World Report independently names two/four participants, and ScreenRant independently names four-player support. This clarifies the narrow published counts while retaining all unresolved fill/version qualifiers and the original assessment. Candidate Boss Rush/rank descriptions were not counted as corroboration because counter/rank scope is ambiguous or inconsistent. See CONFLICTS.md C03/C10.

Every one of the original 28 phone/TV spec objects and 196 phase graphs was compared against the preserved snapshot and is unchanged as JSON. Their equations, sensors and gameplay have **not** been executed; only data/reference/schema/phase-exit checks are claimed.

## Actual validator output

```text
$ python3 verify.py --structural
PASS CLOSED_JSON_SCHEMAS: 56/56
PASS UNIQUE_ID_COLLECTIONS: 28/28
PASS MODE_LIST_TWO_PUBLISHER_LINEAGES: 28/28
PASS EVERY_RECORDED_RULE_HAS_SOURCE: 85/85
PASS SOURCE_QUOTATION_REFERENCES: 234/234
PASS QUOTE_BUDGETS_AND_LINEAGE_GUARDS: 28/28
PASS SOURCE_REOPEN_PASSES: 50/50
PASS QUOTATIONS_RECOVERED_IN_BOTH_PASSES: 458/458
PASS SOURCE_REPORT_COUNTS_AND_LINKS: 50/50
PASS RULE_LINKS_AND_EXPLICIT_FIELD_GAPS: 168/168
PASS ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS: 196/196
PASS PHASE_TRANSITION_TARGETS_AND_GUARDS: 672/672
PASS PHONE_TV_PROTOCOL_BOUNDARY: 1/1
PASS FULL_RETAINED_ROW_PASS_A: 309/309
PASS FULL_RETAINED_ROW_PASS_B: 309/309
PASS MODE_DOCUMENT_COVERAGE: 28/28
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 118/118
STRUCTURAL_RESULT=PASS; suites=18; cases=2830; seed=N/A (deterministic)
EXIT_CODE=0

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 56/56
PASS UNIQUE_ID_COLLECTIONS: 28/28
PASS MODE_LIST_TWO_PUBLISHER_LINEAGES: 28/28
PASS EVERY_RECORDED_RULE_HAS_SOURCE: 85/85
PASS SOURCE_QUOTATION_REFERENCES: 234/234
PASS QUOTE_BUDGETS_AND_LINEAGE_GUARDS: 28/28
PASS SOURCE_REOPEN_PASSES: 50/50
PASS QUOTATIONS_RECOVERED_IN_BOTH_PASSES: 458/458
PASS SOURCE_REPORT_COUNTS_AND_LINKS: 50/50
PASS RULE_LINKS_AND_EXPLICIT_FIELD_GAPS: 168/168
PASS ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS: 196/196
PASS PHASE_TRANSITION_TARGETS_AND_GUARDS: 672/672
PASS PHONE_TV_PROTOCOL_BOUNDARY: 1/1
PASS FULL_RETAINED_ROW_PASS_A: 309/309
PASS FULL_RETAINED_ROW_PASS_B: 309/309
PASS MODE_DOCUMENT_COVERAGE: 28/28
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 118/118
STRUCTURAL_RESULT=PASS; suites=18; cases=2830; seed=N/A (deterministic)
MODE_LIST_TWO_SOURCE=28/28; PASS
RULES_TWO_SOURCE=60/85; FAIL
FIELDS_WITH_RECORDED_RULES=84/168; FAIL
PROPOSED_PHASE_EXIT_GRAPHS=196/196; PASS
PROPOSAL_GAMEPLAY_EXECUTED=NO; only schema/reference/phase-graph checks claimed
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT_CODE=1
```

## UNVERIFIED

- All 84 empty field slots remain explicit in modes.json and the individual mode documents. No unsupported reward, unlock, clock, RNG or reaction behavior was supplied.
- Original phone/TV gameplay equations remain design proposals, with no physical gameplay execution or Nintendo-faithful reconstruction claim.
- Exact source qualifier gaps remain in the following 25 rows; the two unresolved conflicts preserve their competing reports.

| Rule | Status | Confidence | Remaining qualifier / scope |
| --- | --- | --- | --- |
| KOOP_SPACE | single_source | medium | Only the one-space-per-coin component has two-source support; 150-space lap length has one source. |
| KOOP_PENALTY | single_source | medium | Range only; placement-to-penalty mapping remains unverified. |
| KOOP_ONLINE_UNLOCK | single_source | medium | Full independent corroboration not recovered. |
| KABOOM_ROUNDS | single_source | medium | Five rounds is independently corroborated; 90 seconds currently has only one retained source. |
| KABOOM_ONLINE_UNLOCK | single_source | medium | Full independent corroboration not recovered. |
| SKY_RULE | single_source | medium | Core collection contest is corroborated; stealing and exact 120-second limit currently have only dedicated-wiki evidence. |
| SKY_TIMER | single_source | medium | Full independent corroboration not recovered. |
| TAXI_RULE | single_source | medium | Rank rule is one source; two independent texts corroborate cooperative passenger transport. |
| TAXI_DIFFICULTIES | single_source | medium | Full independent corroboration not recovered. |
| FREE_FLIGHT_COLLECT | single_source | medium | Optional activities; absence of an overall timer does not imply all side activities are untimed. |
| REMIX_RULE | conflict | low | Sources describe Remix differently; exact chunk count and sequencing remain a conflict. |
| TREK_PAYOUT | single_source | medium | Exact payout mapping has one source; the array's interpretation follows the explicit first/second/third placement description. |
| TAG_SELECT | single_source | medium | Full independent corroboration not recovered. |
| SURVIVAL_RULE | single_source | medium | Online scope is corroborated; duel trigger threshold is not independently established. |
| BOSS_RULE | single_source | medium | The independent article confirms activity presence/cooperative bosses; detailed point scoring is one source. |
| BOSS_UNLOCK | single_source | medium | Full independent corroboration not recovered. |
| TV_REWARDS | single_source | medium | Full independent corroboration not recovered. |
| TV_TAG_ORDER | single_source | medium | Full independent corroboration not recovered. |
| TV_FREE_RULE | single_source | medium | Mode presence is independently confirmed; detailed Battle/Co-op scope is retained as one-source. |
| TV_FREE_CATALOG | single_source | medium | Do not infer that the full 132-game union is available in TV Free Play. |
| LIVE_TIE | single_source | medium | Full independent corroboration not recovered. |
| COASTER_RANK_TIME | single_source | medium | Rank thresholds and exact base countdowns remain unverified. |
| BUDDY_WALUIGI | conflict | low | Two same-publisher articles disagree; DualShockers also reports 3–8. No verified RNG weights or same-opponent-repeat rule is inferred. |
| BUDDY_GALLERIA | single_source | medium | Older published Galleria combo advice conflicts with this rule; patch/version scope must be established before treating it as universal. |
| BUDDY_TV_TAG | single_source | medium | Together Dice supplies similar doubled interactions without a literal Buddy. |

## GitHub delivery

The final-head hosted structural/checksum/strict-result conclusion is recorded in PR16 after observation. A green artifact CI result does not certify unresolved Nintendo behavior or execute the original phone/TV prototypes.

## Polish pass 2026-10-08

Scope: correctness, product review and documentation only. No rule row, field value or evidence capture was changed.

| Check | Command | Result |
| --- | --- | --- |
| Structural suites | `python3 verify.py --structural --checksums` | PASS, 19 suites, 2,947 cases, about 2 s before this pass; 2,951 cases after the two new files joined the manifest suites |
| Manifest | `sha256sum -c SHA256SUMS.txt` | 117 of 117 OK before this pass; regenerated for the files this pass changed |
| Strict gate | `python3 verify.py --strict` | exit 1, as documented: MODE_LIST_TWO_SOURCE 28/28, RULES_TWO_SOURCE 60/85, FIELDS_WITH_RECORDED_RULES 84/168, PROPOSED_PHASE_EXIT_GRAPHS 196/196 |
| Hosted CI | GitHub run 37679418437 on head `de8cc66` | success (`B20 research and prototype specification checks`) |
| Evidence quotes against captures | inline python: every `rules.json` evidence quote checked against the quotations in `reports/source-captures/` (passes A and B) | 178 of 178 exact matches; no missing capture |
| Cross-job check | Pro, Frenzy and Tag-Team against B05 `claims.json` (COUNT04, TV01, TV02, TV03, PRO02, PRO03, PRO04) | no conflict; both drops agree on Pro's 12 turns and announced category and on Frenzy's 5 turns, 50 coins, one Star and double-dice start |
| Port constraint | `packages/shared/src/constants.ts` `roomCapacity` in the main repo | 16 players; the 20-racer race is capped and the INTEGRATION says so |

Seed: not applicable (deterministic). Case counts are as `verify.py` reports them.

UNVERIFIED in this pass: no live re-fetch of any source (most hosts are blocked from this box). Evidence was checked against stored captures, not live pages. No gameplay, installed game or primary-frame capture was observed. The phase specs are proposals and were not executed.
