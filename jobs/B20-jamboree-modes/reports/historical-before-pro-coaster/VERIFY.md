# B20 — Verification

**Original research standard NOT_MET.** The 28-record roster is corroborated by two independent publisher lineages, but 29/85 rule rows lack full independent agreement and 84/168 category coverage fields remain empty and explicitly UNVERIFIED. Keep PR16 draft.

## Reproducible completed checks

Environment: Python 3.12.14; jsonschema 4.26.0. Seed is N/A for every deterministic research, schema and graph check. No gameplay equations, sensor behavior, Nintendo RNG or primary game capture are executed.

From `jobs/B20-jamboree-modes/`:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # completed expected exit 1
sha256sum -c SHA256SUMS.txt
```

| Test | Cases / passed | Seed | Exact command |
|---|---:|---|---|
| CLOSED_JSON_SCHEMAS | 50/50 | N/A | `python3 verify.py --structural` |
| UNIQUE_ID_COLLECTIONS | 25/25 | N/A | `python3 verify.py --structural` |
| MODE_LIST_TWO_PUBLISHER_LINEAGES | 28/28 | N/A | `python3 verify.py --structural` |
| EVERY_RECORDED_RULE_HAS_SOURCE | 85/85 | N/A | `python3 verify.py --structural` |
| SOURCE_QUOTATION_REFERENCES | 228/228 | N/A | `python3 verify.py --structural` |
| QUOTE_BUDGETS_AND_LINEAGE_GUARDS | 25/25 | N/A | `python3 verify.py --structural` |
| SOURCE_REOPEN_PASSES | 44/44 | N/A | `python3 verify.py --structural` |
| QUOTATIONS_RECOVERED_IN_BOTH_PASSES | 446/446 | N/A | `python3 verify.py --structural` |
| SOURCE_REPORT_COUNTS_AND_LINKS | 44/44 | N/A | `python3 verify.py --structural` |
| RULE_LINKS_AND_EXPLICIT_FIELD_GAPS | 168/168 | N/A | `python3 verify.py --structural` |
| ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS | 196/196 | N/A | `python3 verify.py --structural` |
| PHASE_TRANSITION_TARGETS_AND_GUARDS | 672/672 | N/A | `python3 verify.py --structural` |
| PHONE_TV_PROTOCOL_BOUNDARY | 1/1 | N/A | `python3 verify.py --structural` |
| FULL_RETAINED_ROW_PASS_A | 309/309 | N/A | `python3 verify.py --structural` |
| FULL_RETAINED_ROW_PASS_B | 309/309 | N/A | `python3 verify.py --structural` |
| MODE_DOCUMENT_COVERAGE | 28/28 | N/A | `python3 verify.py --structural` |
| DELIBERATE_REJECTION_FIXTURES | 12/12 | N/A | `python3 verify.py --structural` |
| FILE_SIZE_LIMIT | 91/91 | N/A | `python3 verify.py --structural` |
| SHA256_MANIFEST | 90/90 | N/A | `python3 verify.py --structural --checksums` |
| Independent final manifest checks | 90/90, repeated twice | N/A | `sha256sum -c SHA256SUMS.txt` |

Structural result: 18/18 suites, 2,761/2,761 cases, exit 0. With the complete manifest: 19/19 suites, 2,851/2,851 cases, exit 0. Three final manifest passes check all 90 entries: one validator pass and two separate sha256sum processes. All 91 files, including the manifest and own B20 workflow, are below 30,000,000 bytes. These counts include deterministic reference and evidence checks, not simulated game trials.

## Actual validator output

```text
$ python3 verify.py --structural
PASS CLOSED_JSON_SCHEMAS: 50/50
PASS UNIQUE_ID_COLLECTIONS: 25/25
PASS MODE_LIST_TWO_PUBLISHER_LINEAGES: 28/28
PASS EVERY_RECORDED_RULE_HAS_SOURCE: 85/85
PASS SOURCE_QUOTATION_REFERENCES: 228/228
PASS QUOTE_BUDGETS_AND_LINEAGE_GUARDS: 25/25
PASS SOURCE_REOPEN_PASSES: 44/44
PASS QUOTATIONS_RECOVERED_IN_BOTH_PASSES: 446/446
PASS SOURCE_REPORT_COUNTS_AND_LINKS: 44/44
PASS RULE_LINKS_AND_EXPLICIT_FIELD_GAPS: 168/168
PASS ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS: 196/196
PASS PHASE_TRANSITION_TARGETS_AND_GUARDS: 672/672
PASS PHONE_TV_PROTOCOL_BOUNDARY: 1/1
PASS FULL_RETAINED_ROW_PASS_A: 309/309
PASS FULL_RETAINED_ROW_PASS_B: 309/309
PASS MODE_DOCUMENT_COVERAGE: 28/28
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 91/91
STRUCTURAL_RESULT=PASS; suites=18; cases=2761; seed=N/A (deterministic)
EXIT_CODE=0

$ python3 verify.py --strict
PASS CLOSED_JSON_SCHEMAS: 50/50
PASS UNIQUE_ID_COLLECTIONS: 25/25
PASS MODE_LIST_TWO_PUBLISHER_LINEAGES: 28/28
PASS EVERY_RECORDED_RULE_HAS_SOURCE: 85/85
PASS SOURCE_QUOTATION_REFERENCES: 228/228
PASS QUOTE_BUDGETS_AND_LINEAGE_GUARDS: 25/25
PASS SOURCE_REOPEN_PASSES: 44/44
PASS QUOTATIONS_RECOVERED_IN_BOTH_PASSES: 446/446
PASS SOURCE_REPORT_COUNTS_AND_LINKS: 44/44
PASS RULE_LINKS_AND_EXPLICIT_FIELD_GAPS: 168/168
PASS ORIGINAL_PROPOSAL_PHASE_EXIT_GRAPHS: 196/196
PASS PHASE_TRANSITION_TARGETS_AND_GUARDS: 672/672
PASS PHONE_TV_PROTOCOL_BOUNDARY: 1/1
PASS FULL_RETAINED_ROW_PASS_A: 309/309
PASS FULL_RETAINED_ROW_PASS_B: 309/309
PASS MODE_DOCUMENT_COVERAGE: 28/28
PASS DELIBERATE_REJECTION_FIXTURES: 12/12
PASS FILE_SIZE_LIMIT: 91/91
STRUCTURAL_RESULT=PASS; suites=18; cases=2761; seed=N/A (deterministic)
MODE_LIST_TWO_SOURCE=28/28; PASS
RULES_TWO_SOURCE=56/85; FAIL
FIELDS_WITH_RECORDED_RULES=84/168; FAIL
PROPOSED_PHASE_EXIT_GRAPHS=196/196; PASS
PROPOSAL_GAMEPLAY_EXECUTED=NO; only schema/reference/phase-graph checks claimed
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT_CODE=1
```

## Source reopening and second review

Both passes reopened all 22 retained URLs. Each recovered all 223 registered short quotations: 44 capture records and 446 quotation recoveries. Captures archive source IDs, URLs, retrieval fingerprints, quote IDs and recovery outcomes; they omit full articles. See `reports/source-reopen-audit.json` and `reports/source-captures/`. Retrieval may be cached; no origin-page byte freshness is asserted.

All 309 retained rows were reviewed in A and B by the same assistant: 28 mode-presence rows, 85 Nintendo-rule rows and 196 original proposal phases. The phase verdict is proposal_reviewed and has no external source assertion. The following complete per-row log is also machine-readable in `reports/research-row-audit.json`.

| Row | Pass A | Pass B |
|---|---|---|
| phase:pro-rules:lobby | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:briefing | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:setup | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:play | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:resolve | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:results | proposal_reviewed | proposal_reviewed |
| phase:pro-rules:done | proposal_reviewed | proposal_reviewed |
| mode:pro-rules | corroborated | corroborated |
| phase:jamboree-buddies:lobby | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:briefing | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:setup | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:play | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:resolve | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:results | proposal_reviewed | proposal_reviewed |
| phase:jamboree-buddies:done | proposal_reviewed | proposal_reviewed |
| mode:jamboree-buddies | corroborated | corroborated |
| phase:koopathlon:lobby | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:briefing | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:setup | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:play | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:resolve | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:results | proposal_reviewed | proposal_reviewed |
| phase:koopathlon:done | proposal_reviewed | proposal_reviewed |
| mode:koopathlon | corroborated | corroborated |
| phase:bowser-kaboom-squad:lobby | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:briefing | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:setup | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:play | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:resolve | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:results | proposal_reviewed | proposal_reviewed |
| phase:bowser-kaboom-squad:done | proposal_reviewed | proposal_reviewed |
| mode:bowser-kaboom-squad | corroborated | corroborated |
| phase:paratroopa-flight-school:lobby | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:briefing | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:setup | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:play | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:resolve | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:results | proposal_reviewed | proposal_reviewed |
| phase:paratroopa-flight-school:done | proposal_reviewed | proposal_reviewed |
| mode:paratroopa-flight-school | corroborated | corroborated |
| phase:toads-item-factory:lobby | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:briefing | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:setup | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:play | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:resolve | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:results | proposal_reviewed | proposal_reviewed |
| phase:toads-item-factory:done | proposal_reviewed | proposal_reviewed |
| mode:toads-item-factory | corroborated | corroborated |
| phase:rhythm-kitchen:lobby | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:briefing | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:setup | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:play | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:resolve | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:results | proposal_reviewed | proposal_reviewed |
| phase:rhythm-kitchen:done | proposal_reviewed | proposal_reviewed |
| mode:rhythm-kitchen | corroborated | corroborated |
| phase:party-planner-trek:lobby | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:briefing | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:setup | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:play | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:resolve | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:results | proposal_reviewed | proposal_reviewed |
| phase:party-planner-trek:done | proposal_reviewed | proposal_reviewed |
| mode:party-planner-trek | corroborated | corroborated |
| phase:minigame-bay:lobby | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:briefing | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:setup | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:play | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:resolve | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:results | proposal_reviewed | proposal_reviewed |
| phase:minigame-bay:done | proposal_reviewed | proposal_reviewed |
| mode:minigame-bay | corroborated | corroborated |
| phase:tv-mario-party:lobby | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:briefing | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:setup | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:play | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:resolve | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:results | proposal_reviewed | proposal_reviewed |
| phase:tv-mario-party:done | proposal_reviewed | proposal_reviewed |
| mode:tv-mario-party | corroborated | corroborated |
| phase:tv-free-play:lobby | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:briefing | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:setup | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:play | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:resolve | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:results | proposal_reviewed | proposal_reviewed |
| phase:tv-free-play:done | proposal_reviewed | proposal_reviewed |
| mode:tv-free-play | corroborated | corroborated |
| phase:bowser-live:lobby | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:briefing | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:setup | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:play | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:resolve | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:results | proposal_reviewed | proposal_reviewed |
| phase:bowser-live:done | proposal_reviewed | proposal_reviewed |
| mode:bowser-live | corroborated | corroborated |
| phase:carnival-coaster:lobby | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:briefing | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:setup | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:play | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:resolve | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:results | proposal_reviewed | proposal_reviewed |
| phase:carnival-coaster:done | proposal_reviewed | proposal_reviewed |
| mode:carnival-coaster | corroborated | corroborated |
| phase:bay-free-play:lobby | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:briefing | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:setup | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:play | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:resolve | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:results | proposal_reviewed | proposal_reviewed |
| phase:bay-free-play:done | proposal_reviewed | proposal_reviewed |
| mode:bay-free-play | corroborated | corroborated |
| phase:daily-challenge:lobby | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:briefing | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:setup | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:play | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:resolve | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:results | proposal_reviewed | proposal_reviewed |
| phase:daily-challenge:done | proposal_reviewed | proposal_reviewed |
| mode:daily-challenge | corroborated | corroborated |
| phase:tag-match:lobby | proposal_reviewed | proposal_reviewed |
| phase:tag-match:briefing | proposal_reviewed | proposal_reviewed |
| phase:tag-match:setup | proposal_reviewed | proposal_reviewed |
| phase:tag-match:play | proposal_reviewed | proposal_reviewed |
| phase:tag-match:resolve | proposal_reviewed | proposal_reviewed |
| phase:tag-match:results | proposal_reviewed | proposal_reviewed |
| phase:tag-match:done | proposal_reviewed | proposal_reviewed |
| mode:tag-match | corroborated | corroborated |
| phase:survival:lobby | proposal_reviewed | proposal_reviewed |
| phase:survival:briefing | proposal_reviewed | proposal_reviewed |
| phase:survival:setup | proposal_reviewed | proposal_reviewed |
| phase:survival:play | proposal_reviewed | proposal_reviewed |
| phase:survival:resolve | proposal_reviewed | proposal_reviewed |
| phase:survival:results | proposal_reviewed | proposal_reviewed |
| phase:survival:done | proposal_reviewed | proposal_reviewed |
| mode:survival | corroborated | corroborated |
| phase:showdown-minigame-battle:lobby | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:briefing | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:setup | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:play | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:resolve | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:results | proposal_reviewed | proposal_reviewed |
| phase:showdown-minigame-battle:done | proposal_reviewed | proposal_reviewed |
| mode:showdown-minigame-battle | corroborated | corroborated |
| phase:boss-rush:lobby | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:briefing | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:setup | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:play | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:resolve | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:results | proposal_reviewed | proposal_reviewed |
| phase:boss-rush:done | proposal_reviewed | proposal_reviewed |
| mode:boss-rush | corroborated | corroborated |
| phase:sky-battle:lobby | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:briefing | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:setup | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:play | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:resolve | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:results | proposal_reviewed | proposal_reviewed |
| phase:sky-battle:done | proposal_reviewed | proposal_reviewed |
| mode:sky-battle | corroborated | corroborated |
| phase:koopa-paratroopa-taxi:lobby | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:briefing | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:setup | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:play | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:resolve | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:results | proposal_reviewed | proposal_reviewed |
| phase:koopa-paratroopa-taxi:done | proposal_reviewed | proposal_reviewed |
| mode:koopa-paratroopa-taxi | corroborated | corroborated |
| phase:free-flight:lobby | proposal_reviewed | proposal_reviewed |
| phase:free-flight:briefing | proposal_reviewed | proposal_reviewed |
| phase:free-flight:setup | proposal_reviewed | proposal_reviewed |
| phase:free-flight:play | proposal_reviewed | proposal_reviewed |
| phase:free-flight:resolve | proposal_reviewed | proposal_reviewed |
| phase:free-flight:results | proposal_reviewed | proposal_reviewed |
| phase:free-flight:done | proposal_reviewed | proposal_reviewed |
| mode:free-flight | corroborated | corroborated |
| phase:kitchen-normal:lobby | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:briefing | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:setup | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:play | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:resolve | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:results | proposal_reviewed | proposal_reviewed |
| phase:kitchen-normal:done | proposal_reviewed | proposal_reviewed |
| mode:kitchen-normal | corroborated | corroborated |
| phase:kitchen-long:lobby | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:briefing | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:setup | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:play | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:resolve | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:results | proposal_reviewed | proposal_reviewed |
| phase:kitchen-long:done | proposal_reviewed | proposal_reviewed |
| mode:kitchen-long | corroborated | corroborated |
| phase:kitchen-challenging:lobby | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:briefing | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:setup | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:play | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:resolve | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:results | proposal_reviewed | proposal_reviewed |
| phase:kitchen-challenging:done | proposal_reviewed | proposal_reviewed |
| mode:kitchen-challenging | corroborated | corroborated |
| phase:kitchen-remix:lobby | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:briefing | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:setup | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:play | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:resolve | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:results | proposal_reviewed | proposal_reviewed |
| phase:kitchen-remix:done | proposal_reviewed | proposal_reviewed |
| mode:kitchen-remix | corroborated | corroborated |
| phase:tag-team-rules:lobby | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:briefing | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:setup | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:play | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:resolve | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:results | proposal_reviewed | proposal_reviewed |
| phase:tag-team-rules:done | proposal_reviewed | proposal_reviewed |
| mode:tag-team-rules | corroborated | corroborated |
| phase:frenzy-rules:lobby | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:briefing | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:setup | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:play | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:resolve | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:results | proposal_reviewed | proposal_reviewed |
| phase:frenzy-rules:done | proposal_reviewed | proposal_reviewed |
| mode:frenzy-rules | corroborated | corroborated |
| rule:PRO_LENGTH | single_source | single_source |
| rule:PRO_BONUS | corroborated | corroborated |
| rule:PRO_ITEMS | corroborated | corroborated |
| rule:PRO_UNLOCK | single_source | single_source |
| rule:BUDDY_RECRUIT | corroborated | corroborated |
| rule:BUDDY_LIFETIME | corroborated | corroborated |
| rule:BUDDY_STEAL | corroborated | corroborated |
| rule:KOOP_PLAYERS | corroborated | corroborated |
| rule:KOOP_LAPS | corroborated | corroborated |
| rule:KOOP_SPACE | single_source | single_source |
| rule:KOOP_CADENCE | corroborated | corroborated |
| rule:KOOP_WIN | corroborated | corroborated |
| rule:KOOP_PENALTY | single_source | single_source |
| rule:KOOP_ONLINE_UNLOCK | single_source | single_source |
| rule:KABOOM_PLAYERS | corroborated | corroborated |
| rule:KABOOM_ROUNDS | single_source | single_source |
| rule:KABOOM_BOMBS | corroborated | corroborated |
| rule:KABOOM_BONUS | corroborated | corroborated |
| rule:KABOOM_REVIVE | corroborated | corroborated |
| rule:KABOOM_REWARDS | corroborated | corroborated |
| rule:KABOOM_ONLINE_UNLOCK | single_source | single_source |
| rule:FLIGHT_PLAYERS | corroborated | corroborated |
| rule:FLIGHT_CONTROLS | corroborated | corroborated |
| rule:SKY_RULE | single_source | single_source |
| rule:SKY_TIMER | single_source | single_source |
| rule:TAXI_RULE | single_source | single_source |
| rule:TAXI_DIFFICULTIES | single_source | single_source |
| rule:FREE_FLIGHT_END | corroborated | corroborated |
| rule:FREE_FLIGHT_COLLECT | single_source | single_source |
| rule:FACTORY_PLAYERS | corroborated | corroborated |
| rule:FACTORY_LEVELS | corroborated | corroborated |
| rule:FACTORY_GOAL | corroborated | corroborated |
| rule:KITCHEN_PLAYERS | corroborated | corroborated |
| rule:KITCHEN_SCORE | corroborated | corroborated |
| rule:NORMAL_LENGTH | corroborated | corroborated |
| rule:LONG_LENGTH | corroborated | corroborated |
| rule:CHALLENGING_LENGTH | corroborated | corroborated |
| rule:REMIX_RULE | conflict | conflict |
| rule:TREK_PLAYERS | corroborated | corroborated |
| rule:TREK_BOARDS | corroborated | corroborated |
| rule:TREK_FLOW | corroborated | corroborated |
| rule:TREK_GATE | corroborated | corroborated |
| rule:TREK_REWARDS | corroborated | corroborated |
| rule:TREK_PAYOUT | single_source | single_source |
| rule:BAY_PLAYERS | corroborated | corroborated |
| rule:BAY_FREE_RULE | corroborated | corroborated |
| rule:DAILY_RULE | corroborated | corroborated |
| rule:TAG_RULE | corroborated | corroborated |
| rule:TAG_SELECT | single_source | single_source |
| rule:SURVIVAL_RULE | single_source | single_source |
| rule:SHOWDOWN_RULE | corroborated | corroborated |
| rule:BOSS_RULE | single_source | single_source |
| rule:BOSS_UNLOCK | single_source | single_source |
| rule:TV_CONTEXT | corroborated | corroborated |
| rule:TV_REWARDS | single_source | single_source |
| rule:FRENZY_START | corroborated | corroborated |
| rule:FRENZY_EVENTS | corroborated | corroborated |
| rule:TV_TAG_POOL | corroborated | corroborated |
| rule:TV_TAG_ORDER | single_source | single_source |
| rule:TV_TAG_DICE | corroborated | corroborated |
| rule:TV_FREE_RULE | single_source | single_source |
| rule:TV_FREE_CATALOG | single_source | single_source |
| rule:LIVE_TEAMS | corroborated | corroborated |
| rule:LIVE_FLOW | corroborated | corroborated |
| rule:LIVE_SCORE | corroborated | corroborated |
| rule:LIVE_TIE | single_source | single_source |
| rule:COASTER_RULE | corroborated | corroborated |
| rule:COASTER_FAIL | single_source | single_source |
| rule:COASTER_COURSES | corroborated | corroborated |
| rule:COASTER_PLAYERS | conflict | conflict |
| rule:COASTER_RANK_TIME | single_source | single_source |
| rule:BUDDY_MARIO | corroborated | corroborated |
| rule:BUDDY_LUIGI | corroborated | corroborated |
| rule:BUDDY_PEACH | corroborated | corroborated |
| rule:BUDDY_DAISY | corroborated | corroborated |
| rule:BUDDY_WARIO | corroborated | corroborated |
| rule:BUDDY_WALUIGI | conflict | conflict |
| rule:BUDDY_YOSHI | corroborated | corroborated |
| rule:BUDDY_ROSALINA | corroborated | corroborated |
| rule:BUDDY_DK | corroborated | corroborated |
| rule:BUDDY_JUNIOR | corroborated | corroborated |
| rule:BUDDY_GALLERIA | single_source | single_source |
| rule:BUDDY_TV_TAG | single_source | single_source |
| rule:BUDDY_DOUBLE | corroborated | corroborated |
| rule:BUDDY_PLAYERS | corroborated | corroborated |

## UNVERIFIED

The strict command reports roster 28/28 PASS; full rule corroboration 56/85 FAIL; populated required categories 84/168 FAIL; original proposal exit graphs 196/196 PASS. The strict command returns 1. Every recorded rule has a quotation, but source presence and schema success do not make a partially supported qualifier verified.

The 29 unresolved sourced rule rows are:

- `PRO_LENGTH` — single_source; independent evidence for the complete value is absent.
- `PRO_UNLOCK` — single_source; independent evidence for the complete value is absent.
- `KOOP_SPACE` — single_source; Only the one-space-per-coin component has two-source support; 150-space lap length has one source.
- `KOOP_PENALTY` — single_source; Range only; placement-to-penalty mapping remains unverified.
- `KOOP_ONLINE_UNLOCK` — single_source; independent evidence for the complete value is absent.
- `KABOOM_ROUNDS` — single_source; Five rounds is independently corroborated; 90 seconds currently has only one retained source.
- `KABOOM_ONLINE_UNLOCK` — single_source; independent evidence for the complete value is absent.
- `SKY_RULE` — single_source; Core collection contest is corroborated; stealing and exact 120-second limit currently have only dedicated-wiki evidence.
- `SKY_TIMER` — single_source; independent evidence for the complete value is absent.
- `TAXI_RULE` — single_source; Rank rule is one source; two independent texts corroborate cooperative passenger transport.
- `TAXI_DIFFICULTIES` — single_source; independent evidence for the complete value is absent.
- `FREE_FLIGHT_COLLECT` — single_source; Optional activities; absence of an overall timer does not imply all side activities are untimed.
- `REMIX_RULE` — conflict; Sources describe Remix differently; exact chunk count and sequencing remain a conflict.
- `TREK_PAYOUT` — single_source; Exact payout mapping has one source; the array's interpretation follows the explicit first/second/third placement description.
- `TAG_SELECT` — single_source; independent evidence for the complete value is absent.
- `SURVIVAL_RULE` — single_source; Online scope is corroborated; duel trigger threshold is not independently established.
- `BOSS_RULE` — single_source; The independent article confirms activity presence/cooperative bosses; detailed point scoring is one source.
- `BOSS_UNLOCK` — single_source; independent evidence for the complete value is absent.
- `TV_REWARDS` — single_source; independent evidence for the complete value is absent.
- `TV_TAG_ORDER` — single_source; independent evidence for the complete value is absent.
- `TV_FREE_RULE` — single_source; Mode presence is independently confirmed; detailed Battle/Co-op scope is retained as one-source.
- `TV_FREE_CATALOG` — single_source; Do not infer that the full 132-game union is available in TV Free Play.
- `LIVE_TIE` — single_source; independent evidence for the complete value is absent.
- `COASTER_FAIL` — single_source; independent evidence for the complete value is absent.
- `COASTER_PLAYERS` — conflict; Nintendo Life describes two participants; 1-4 humans may include CPU-filled slots. Exact solo/fill/version scope remains under audit.
- `COASTER_RANK_TIME` — single_source; Rank thresholds and exact base countdowns remain unverified.
- `BUDDY_WALUIGI` — conflict; Two same-publisher articles disagree; DualShockers also reports 3–8. No verified RNG weights or same-opponent-repeat rule is inferred.
- `BUDDY_GALLERIA` — single_source; Older published Galleria combo advice conflicts with this rule; patch/version scope must be established before treating it as universal.
- `BUDDY_TV_TAG` — single_source; Together Dice supplies similar doubled interactions without a literal Buddy.

All absent category slots are retained explicitly in each mode’s `unverified` list; the full list of 84 slots is:

- `pro-rules`: players, rewards.
- `jamboree-buddies`: rewards, unlocks.
- `koopathlon`: rewards.
- `paratroopa-flight-school`: length, flow, scoring, rewards, unlocks.
- `toads-item-factory`: scoring, rewards, unlocks.
- `rhythm-kitchen`: length, flow, rewards, unlocks.
- `minigame-bay`: length, flow, scoring, rewards, unlocks.
- `tv-mario-party`: players, length, scoring, unlocks.
- `tv-free-play`: players, scoring, rewards, unlocks.
- `bowser-live`: length, rewards, unlocks.
- `carnival-coaster`: rewards, unlocks.
- `bay-free-play`: length, scoring, rewards, unlocks.
- `daily-challenge`: length, scoring, rewards, unlocks.
- `tag-match`: length, rewards, unlocks.
- `survival`: length, scoring, rewards, unlocks.
- `showdown-minigame-battle`: length, flow, rewards, unlocks.
- `boss-rush`: length, scoring, rewards.
- `sky-battle`: flow, rewards, unlocks.
- `koopa-paratroopa-taxi`: scoring, rewards, unlocks.
- `free-flight`: flow, rewards, unlocks.
- `kitchen-normal`: flow, rewards, unlocks.
- `kitchen-long`: flow, rewards, unlocks.
- `kitchen-challenging`: flow, rewards, unlocks.
- `kitchen-remix`: length, rewards, unlocks.
- `tag-team-rules`: players, length, unlocks.
- `frenzy-rules`: players, scoring, unlocks.

Specific limitations include exact reward/unlock qualifiers, controller allocations, complete timer and tie tables, CPU versus connected-human counts, Remix structure, Waluigi range, Tag Team space changes and Buddy patch exceptions. CONFLICTS.md preserves disagreements. The phone/TV protocols, clocks, equations, layouts, scores and sensor substitutions are original proposals and do not complete missing Nintendo rules. No executable gameplay implementation is supplied or tested.

CI runs structural/hash checks and verifies that strict returns the documented 1. Its exact green latest-head run is linked in the PR description after observation.
