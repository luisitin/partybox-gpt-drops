# B05 — Verification and unresolved requirements

## Verdict

**Structural checks PASS; strict research acceptance NOT MET.** The 95 claim/gap records comprise 29 corroborated core claims, 43 single-source reports, three conflicts and 20 explicit unanswered requirements. Three of nine bonus criteria have independent corroboration. Nine tie procedures remain null. The selected 22-string bank contains 11 voice and 11 host-text excerpts with source URLs; it is not a full script or primary-frame capture.

Both fresh source passes retrieved 22/22 URLs and recovered 182/182 registered short quotations, 364 across both passes. All 141 retained claim/bonus/effect/string/policy rows were reviewed in each pass. Bonus-row outcomes remain unverified where complete ties/counters are unresolved. The same assistant performed both passes; cached markdown may have been returned.

## Executed commands and results

Environment: Python 3.12.14; jsonschema 4.26.0. Seed: N/A, deterministic. No Monte Carlo or controlled gameplay replay is claimed.

`python verify.py --structural` exited 0 with **18/18 suites and 1074 suite cases**. `python verify.py --strict` completed the same structural suites and exited 1 for the recorded research gaps. `python verify.py --structural --checksums` adds a nineteenth suite with 65 file hashes. Three final manifest checks passed.

| Suite | Cases passed |
|---|---:|
| JSON_SCHEMA | 6/6 |
| UNIQUE_IDS | 7/7 |
| CLAIM_SOURCE_REFERENCES | 140/140 |
| CATALOG_REFERENCES | 24/24 |
| STRING_SOURCE_COMPLETENESS | 22/22 |
| SOURCE_EXCERPT_BUDGET | 22/22 |
| CITATION_CAPTURE_SCHEMA | 44/44 |
| REGISTERED_QUOTATIONS_RECOVERED | 364/364 |
| AUDIT_REPORT_SCHEMAS_AND_COVERAGE | 2/2 |
| CORROBORATION_LINEAGE_GUARD | 30/30 |
| DOCUMENTED_CATALOG_COUNTS | 2/2 |
| UNKNOWN_BEHAVIOR_REMAINS_NULL | 11/11 |
| RECORDED_ROW_RECHECK_A | 141/141 |
| RECORDED_SOURCE_REOPEN_A | 22/22 |
| RECORDED_ROW_RECHECK_B | 141/141 |
| RECORDED_SOURCE_REOPEN_B | 22/22 |
| NEGATIVE_REJECTION_CASES | 8/8 |
| FILE_SIZE_LIMIT | 66/66 |
| SHA256_MANIFEST | 65/65 |

The final manifest covers all 65 delivered files except itself, including the B05 workflow. Every file is below 30,000,000 bytes. Checks run after this document and manifest are finalized; logs are written outside the checksummed folder.

### Actual schema-validator output

```text
$ python verify.py --structural
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 140/140
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 22/22
PASS SOURCE_EXCERPT_BUDGET: 22/22
PASS CITATION_CAPTURE_SCHEMA: 44/44
PASS REGISTERED_QUOTATIONS_RECOVERED: 364/364
PASS AUDIT_REPORT_SCHEMAS_AND_COVERAGE: 2/2
PASS CORROBORATION_LINEAGE_GUARD: 30/30
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 141/141
PASS RECORDED_SOURCE_REOPEN_A: 22/22
PASS RECORDED_ROW_RECHECK_B: 141/141
PASS RECORDED_SOURCE_REOPEN_B: 22/22
PASS NEGATIVE_REJECTION_CASES: 8/8
PASS FILE_SIZE_LIMIT: 66/66
STRUCTURAL_RESULT=PASS; suites=18; seed=N/A (deterministic)
EXIT=0

$ python verify.py --strict
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 140/140
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 22/22
PASS SOURCE_EXCERPT_BUDGET: 22/22
PASS CITATION_CAPTURE_SCHEMA: 44/44
PASS REGISTERED_QUOTATIONS_RECOVERED: 364/364
PASS AUDIT_REPORT_SCHEMAS_AND_COVERAGE: 2/2
PASS CORROBORATION_LINEAGE_GUARD: 30/30
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 141/141
PASS RECORDED_SOURCE_REOPEN_A: 22/22
PASS RECORDED_ROW_RECHECK_B: 141/141
PASS RECORDED_SOURCE_REOPEN_B: 22/22
PASS NEGATIVE_REJECTION_CASES: 8/8
PASS FILE_SIZE_LIMIT: 66/66
STRUCTURAL_RESULT=PASS; suites=18; seed=N/A (deterministic)
FACTS_DUAL_SOURCE=29/95; FAIL
BONUS_CRITERIA_DUAL_SOURCE=3/9; FAIL
BONUS_TIE_PROCEDURES_EVIDENCED=0/9; FAIL
STRING_PRIMARY_CAPTURES=0/22; descriptive provenance, not an additional prompt requirement
FULL_TIMELINE_COVERAGE=INCOMPLETE
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT=1
```

The six original data documents, 44 citation captures and two audit reports all underwent their closed Draft 2020-12 schemas. Eight deliberate malformed schema/duplicate fixtures were rejected. The lineage guard prevents the derived tracker, wiki aliases, or same-publisher pages from being counted independently. A retained quotation can support only part of a composite claim; all accepted full-core corroboration decisions were reviewed against the cited passages.

### Integrity commands

```sh
python verify.py --structural --checksums
sha256sum -c SHA256SUMS.txt
sha256sum -c SHA256SUMS.txt
```

## Second-pass row log

Canonical confidence and source references remain on each JSON record. `bonus:` outcomes cover the full record, including unknown ties; criterion confidence is separately recorded.

| Row | Pass A | Pass B |
|---|---|---|
| claim:SET01 | single_source | single_source |
| claim:SET02 | corroborated | corroborated |
| claim:SET03 | single_source | single_source |
| claim:SET04 | single_source | single_source |
| claim:START01 | single_source | single_source |
| claim:START02 | single_source | single_source |
| claim:START03 | single_source | single_source |
| claim:START04 | single_source | single_source |
| claim:TURN01 | corroborated | corroborated |
| claim:TURN02 | corroborated | corroborated |
| claim:TURN03 | single_source | single_source |
| claim:TURN04 | single_source | single_source |
| claim:TURN05 | corroborated | corroborated |
| claim:TURN06 | corroborated | corroborated |
| claim:TURN07 | corroborated | corroborated |
| claim:TURN08 | corroborated | corroborated |
| claim:TURN09 | corroborated | corroborated |
| claim:LAND01 | corroborated | corroborated |
| claim:LAND02 | corroborated | corroborated |
| claim:LAND03 | single_source | single_source |
| claim:LAND04 | corroborated | corroborated |
| claim:LAND05 | corroborated | corroborated |
| claim:LAND06 | corroborated | corroborated |
| claim:LAND07 | corroborated | corroborated |
| claim:ROUND01 | single_source | single_source |
| claim:ROUND02 | single_source | single_source |
| claim:ROUND03 | single_source | single_source |
| claim:ROUND04 | single_source | single_source |
| claim:HOME01 | single_source | single_source |
| claim:HOME02 | single_source | single_source |
| claim:HOME03 | single_source | single_source |
| claim:HOME04 | conflict | conflict |
| claim:HOME05 | single_source | single_source |
| claim:END01 | single_source | single_source |
| claim:END02 | single_source | single_source |
| claim:END03 | corroborated | corroborated |
| claim:END04 | corroborated | corroborated |
| claim:END05 | single_source | single_source |
| claim:END06 | single_source | single_source |
| claim:COUNT01 | corroborated | corroborated |
| claim:COUNT02 | single_source | single_source |
| claim:COUNT03 | corroborated | corroborated |
| claim:COUNT04 | corroborated | corroborated |
| claim:TIE01 | conflict | conflict |
| claim:TIE02 | single_source | single_source |
| claim:PRO01 | corroborated | corroborated |
| claim:PRO02 | corroborated | corroborated |
| claim:PRO03 | single_source | single_source |
| claim:PRO04 | single_source | single_source |
| claim:PRO05 | single_source | single_source |
| claim:PRO06 | single_source | single_source |
| claim:PRO07 | corroborated | corroborated |
| claim:PRO08 | single_source | single_source |
| claim:PRO09 | conflict | conflict |
| claim:TV01 | corroborated | corroborated |
| claim:TV02 | corroborated | corroborated |
| claim:TV03 | single_source | single_source |
| claim:TV04 | corroborated | corroborated |
| claim:U01 | unverified | unverified |
| claim:U02 | unverified | unverified |
| claim:U03 | unverified | unverified |
| claim:U04 | unverified | unverified |
| claim:U05 | unverified | unverified |
| claim:U06 | unverified | unverified |
| claim:U07 | unverified | unverified |
| claim:U08 | unverified | unverified |
| claim:U09 | unverified | unverified |
| claim:U10 | unverified | unverified |
| claim:U11 | unverified | unverified |
| claim:U12 | unverified | unverified |
| claim:U13 | unverified | unverified |
| claim:U14 | unverified | unverified |
| claim:U15 | unverified | unverified |
| claim:U16 | unverified | unverified |
| claim:U17 | unverified | unverified |
| claim:U18 | unverified | unverified |
| claim:U19 | unverified | unverified |
| claim:U20 | unverified | unverified |
| claim:BONUS01 | single_source | single_source |
| claim:BONUS02 | corroborated | corroborated |
| claim:BONUS03 | single_source | single_source |
| claim:BONUS04 | single_source | single_source |
| claim:BONUS05 | single_source | single_source |
| claim:BONUS06 | single_source | single_source |
| claim:BONUS07 | single_source | single_source |
| claim:BONUS08 | corroborated | corroborated |
| claim:BONUS09 | corroborated | corroborated |
| claim:EFFECT01 | single_source | single_source |
| claim:EFFECT02 | single_source | single_source |
| claim:EFFECT03 | single_source | single_source |
| claim:EFFECT04 | single_source | single_source |
| claim:EFFECT05 | corroborated | corroborated |
| claim:EFFECT06 | single_source | single_source |
| claim:EFFECT07 | single_source | single_source |
| claim:EFFECT08 | single_source | single_source |
| bonus:bowser-space | unverified | unverified |
| bonus:eventful | unverified | unverified |
| bonus:item | unverified | unverified |
| bonus:minigame | unverified | unverified |
| bonus:misfortune | unverified | unverified |
| bonus:rich | unverified | unverified |
| bonus:shopping | unverified | unverified |
| bonus:sightseer | unverified | unverified |
| bonus:slowpoke | unverified | unverified |
| effect:mushroom | single_source | single_source |
| effect:extra-star | single_source | single_source |
| effect:star-steal-traps | single_source | single_source |
| effect:double-dice | single_source | single_source |
| effect:space-coins | corroborated | corroborated |
| effect:wallet-coins | single_source | single_source |
| effect:more-bowser | single_source | single_source |
| effect:more-chance | single_source | single_source |
| string:ann-start | single_source | single_source |
| string:ann-minigame | single_source | single_source |
| string:ann-new-turn | single_source | single_source |
| string:ann-homestretch | single_source | single_source |
| string:ann-final-turn | single_source | single_source |
| string:ann-final-minigame | single_source | single_source |
| string:ann-congratulations | single_source | single_source |
| string:ann-game-start | single_source | single_source |
| string:ann-finish | single_source | single_source |
| string:ann-winner | single_source | single_source |
| string:ann-tie | single_source | single_source |
| string:host-welcome | single_source | single_source |
| string:host-choose-event | single_source | single_source |
| string:host-bonus-01 | single_source | single_source |
| string:host-bonus-02 | single_source | single_source |
| string:host-bonus-03 | single_source | single_source |
| string:host-bonus-04 | single_source | single_source |
| string:host-bonus-05 | single_source | single_source |
| string:host-bonus-06 | single_source | single_source |
| string:host-bonus-07 | single_source | single_source |
| string:host-bonus-08 | single_source | single_source |
| string:host-bonus-09 | single_source | single_source |
| policy:party-off | corroborated | corroborated |
| policy:party-random-below-30 | corroborated | corroborated |
| policy:party-random-30 | corroborated | corroborated |
| policy:party-classic-below-30 | single_source | single_source |
| policy:party-classic-30 | single_source | single_source |
| policy:pro-12 | corroborated | corroborated |
| policy:tv-frenzy-5 | corroborated | corroborated |

## UNVERIFIED

### Every claim without complete independent corroboration

- **SET01 — single_source; medium:** Party turn limits: 10, 15, 20, 25, or 30.
- **SET03 — single_source; medium:** Motion minigames and minigame explanations can be disabled; handicaps can grant 1–5 starting Stars.
- **SET04 — single_source; medium:** Yellow Toad supplies Party host text; Purple Toad supplies Pro host text.
- **START01 — single_source; medium:** The host welcomes players and offers a board explanation.
- **START02 — single_source; medium:** Players roll dice to establish turn order.
- **START03 — single_source; medium:** The host distributes 10 starting coins to each player.
- **START04 — single_source; medium:** The host introduces the first Star target before ordinary movement; the transcript marks its roaming-Star prompt as excluding Mario's Rainbow Castle.
- **TURN03 — single_source; medium:** A Star purchase can be offered while passing its bearer; exact landing is not required.
- **TURN04 — single_source; medium:** The usual Star price is 20 coins; board and Buddy modifiers require separate handling.
- **LAND03 — single_source; medium:** An Item Space can use a roulette or item minigame; no item is awarded on the final turn.
- **ROUND01 — single_source; medium:** After all four players have moved, a minigame concludes the round.
- **ROUND02 — single_source; medium:** Vote offers three minigame choices; all four players vote.
- **ROUND03 — single_source; medium:** Bonus Minigames double the coins won.
- **ROUND04 — single_source; medium:** Showdown, Item, Duel and VS interruptions are distinct from the ordinary round-ending minigame.
- **HOME01 — single_source; medium:** Homestretch occurs with five turns remaining, before those remaining turns are played.
- **HOME02 — single_source; medium:** The host announces standings, then Blue/Red become +6/−6 and same-space landings can trigger duels.
- **HOME03 — single_source; medium:** Party adds a special event chosen by a player or randomly; Pro omits this extra event.
- **HOME04 — conflict; low:** Eight possible special effects are listed, while the source wording refers to five; full menu-generation rules are unresolved.
- **HOME05 — single_source; medium:** After the special event, the host gives two tips and board play resumes.
- **END01 — single_source; medium:** The final round still has a final minigame before the results ceremony.
- **END02 — single_source; medium:** The ceremony reviews Star totals and notable acquisitions before presenting enabled bonus awards.
- **END05 — single_source; medium:** The quote list attests a two-winner announcement for equal Stars and coins.
- **END06 — single_source; medium:** Postgame statistical Awards are separate from the nine scoring Bonus Star categories.
- **COUNT02 — single_source; medium:** Classic below 30 turns uses Rich and Eventful; Classic at 30 additionally uses Minigame.
- **TIE01 — conflict; low:** A series-level source describes tied bonus leaders each receiving a Star, but its adjacent Battle Royale/Tag Team exception is ambiguous for Jamboree.
- **TIE02 — single_source; medium:** The host transcript attests that an award can have no recipient.
- **PRO03 — single_source; medium:** Pro keeps Homestretch ±6 Blue/Red values and same-space duels.
- **PRO04 — single_source; medium:** Pro Lucky spaces offer 10 coins or Double Dice; Unlucky transfers 7 coins to last place.
- **PRO05 — single_source; medium:** Pro uses item roulette without item minigames.
- **PRO06 — single_source; medium:** Pro marks future Star sites; a used site becomes eligible again after the other sites have been used.
- **PRO08 — single_source; medium:** Pro VS stakes are 20 coins; the landing player selects the minigame.
- **PRO09 — conflict; low:** Pro Bowser takes a Star; without one, the reported fallback is half the coins, or all coins at King Bowser Keep.
- **TV03 — single_source; medium:** Tag-Team shares Stars and coins; higher combined opening rolls act first, and teams alternate players.
- **U01 — unverified; low:** Exact opening-roll range, descending-order display, and tied-order-roll resolution.
- **U02 — unverified; low:** Exact input menu strings, input order, and whether all item classes obey a one-item-per-turn limit.
- **U03 — unverified; low:** Item-use versus Buddy-start-effect ordering, cancellation and unavailable-target behavior.
- **U04 — unverified; low:** Exact movement decrement rules for every shop, Star, Boo, gate and branch node; forced movement versus dice movement.
- **U05 — unverified; low:** The complete branch-choice interface, legal-edge constraints, gate/key consumption and prompt order.
- **U06 — unverified; low:** Complete priority order among traps, landing effects, Buddy repeats, Hidden Blocks and same-space duels.
- **U07 — unverified; low:** Board phase/tide/sale/conveyor hooks relative to round minigame, Buddy lifetime decrement and the next player.
- **U08 — unverified; low:** Complete landed-space-color to team mapping, green-space randomization and category probabilities in Jamboree.
- **U09 — unverified; low:** Vote aggregation, weighting, ties, unvoted options, repeat suppression and candidate-pool algorithm.
- **U10 — unverified; low:** Exact standard/coin/team/tied/Bonus Minigame payouts and which minigames count toward the Minigame award.
- **U11 — unverified; low:** Chooser selection, rank ties, five-option sampling, event weights, slot order beyond reported Mushroom rule and board restrictions.
- **U12 — unverified; low:** Inventory overflow, coin-cap behavior and atomic ordering when Homestretch grants items or doubles wallets.
- **U13 — unverified; low:** Final ranking tie rules for every cardinality, coin secondary ranking confirmation and animation ordering.
- **U14 — unverified; low:** Independent second evidence for six non-Pro bonus criteria; exact internal counters for all nine categories.
- **U15 — unverified; low:** All tied-award cardinalities, zero-activity eligibility and whether a non-awarded category is replaced.
- **U16 — unverified; low:** Random category sampling, probabilities, timing of selection, duplicate avoidance and complete Frenzy/Tag-Team award pools.
- **U17 — unverified; low:** Complete exact English on-screen text inventory, regional/version variants, visual capture, voice attribution and punctuation.
- **U18 — unverified; low:** All board-specific Pro substitutions and every exception, including final-turn item/Lucky behavior.
- **U19 — unverified; low:** Complete Tag-Team turn resolution, team tie rules, bonus counters, modifiers and final presentation.
- **U20 — unverified; low:** Controlled game replay, independent second researcher and exhaustive event-priority tests were not performed.
- **BONUS01 — single_source; medium:** Maximize Bowser-space landings.
- **BONUS03 — single_source; medium:** Maximize items used.
- **BONUS04 — single_source; medium:** Maximize minigame wins, not minigame coin income.
- **BONUS05 — single_source; medium:** Maximize combined Red-space and Unlucky-space landings.
- **BONUS06 — single_source; medium:** Maximize cumulative coins collected, including coins subsequently spent or stolen; not peak wallet size.
- **BONUS07 — single_source; medium:** Maximize items bought at shops, not coins spent there.
- **EFFECT01 — single_source; medium:** Grant one player a Mushroom.
- **EFFECT02 — single_source; medium:** Add one temporary Star Exchange.
- **EFFECT03 — single_source; medium:** Give all players a Star Steal Trap.
- **EFFECT04 — single_source; medium:** Give all players Double Dice.
- **EFFECT06 — single_source; medium:** Double each player's coins.
- **EFFECT07 — single_source; medium:** Replace two or three spaces with Bowser Spaces.
- **EFFECT08 — single_source; medium:** Replace two to four spaces with Chance Time Spaces.

### Bonus counter/tie details

- **bowser-space:** Whether repeated Buddy encounters, Bowser Phones, and one physical landing increment this counter differently. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **eventful:** Whether repeated effects count once per physical landing or once per activation. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **item:** Ticket uses, passive items, keys consumed while passing, item bundles and cancelled uses. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **minigame:** Team wins, ties, coin minigames, Duel, VS, Item and Showdown inclusion. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **misfortune:** Whether Buddy repeats change the combined Red/Unlucky landing count. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **rich:** Starting coins, gifts, stolen coins, redistribution, wallet doubling and other counter inclusions. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **shopping:** Free purchases, bundles, remote/event shops and two Buddy purchases. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **sightseer:** Forced transport, teleports, interrupted movement and actual distance versus rolled totals. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.
- **slowpoke:** Forced transport, teleports, interrupted movement and zero-distance eligibility. Independent tie and zero-activity behavior. Tie rule and eligibility minimum remain null.

### Exact strings and scope

All 22 strings cite the retrieved Jamboree quote page. They remain one-lineage transcriptions; visual capture and independent second transcript fields are explicitly absent. No guessed timestamp is supplied. Exact to the source is distinct from visually confirmed in a particular Nintendo build or region. The original prompt accepts source-attributed strings; primary-frame capture is follow-up evidence and is not introduced as an extra universal gate.

### Limits on delivery evidence

The requested universal two-independent-source standard is not met for 66 claim/gap rows. Six non-Pro bonus criteria remain one lineage, and ties/no-recipient thresholds remain ambiguous. Full Homestretch option generation, Classic qualifiers, several Pro/TV exceptions, hidden probabilities and the implementation-level event/counter details in U01–U19 remain open. U20 records unperformed controlled observation and independent-researcher work; no claim that these ran is made.

The prior public-video playback failed; its captions and guessed timestamps were rejected. Short quotation captures fingerprint retrieved markdown, not origin HTML or installed game data. Green CI will check artifact integrity and the documented strict exit 1; it will not certify research completeness. The PR remains draft.
