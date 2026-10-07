# B05 — Verification and unresolved requirements

## Verdict

**Structural result: PASS. Strict research acceptance: NOT MET.** There are 95 claim/gap rows: 22 corroborated, 50 single_source, three conflict and 20 explicit unknown requirements. Three of nine bonus criteria are independently corroborated. Zero complete bonus tie/counter specifications are certified. The 13-string bank is a limited excerpt selection, not the requested complete exact-text inventory.

A second source can be present without covering every qualifier in a row. The lineage guard prevents counting dependent wikis as independent, but it cannot prove source truth. Schema success only establishes a correctly shaped, internally linked research draft.

## Executed tests

All commands ran from this job folder. Seed: **N/A — deterministic**. No Monte Carlo, emulator, game replay or independent-researcher test is claimed.

| Test | Cases | Passed | Seed | Exact command |
|---|---:|---:|---|---|
| JSON_SCHEMA | 6 | 6 | N/A | `python verify.py --structural` |
| UNIQUE_IDS | 7 | 7 | N/A | `python verify.py --structural` |
| CLAIM_SOURCE_REFERENCES | 135 | 135 | N/A | `python verify.py --structural` |
| CATALOG_REFERENCES | 24 | 24 | N/A | `python verify.py --structural` |
| STRING_SOURCE_COMPLETENESS | 13 | 13 | N/A | `python verify.py --structural` |
| SOURCE_EXCERPT_BUDGET | 18 | 18 | N/A | `python verify.py --structural` |
| CORROBORATION_LINEAGE_GUARD | 23 | 23 | N/A | `python verify.py --structural` |
| DOCUMENTED_CATALOG_COUNTS | 2 | 2 | N/A | `python verify.py --structural` |
| UNKNOWN_BEHAVIOR_REMAINS_NULL | 11 | 11 | N/A | `python verify.py --structural` |
| RECORDED_ROW_RECHECK_A | 125 | 125 | N/A | `python verify.py --structural` |
| RECORDED_SOURCE_REOPEN_A | 18 | 18 | N/A | `python verify.py --structural` |
| RECORDED_ROW_RECHECK_B | 125 | 125 | N/A | `python verify.py --structural` |
| RECORDED_SOURCE_REOPEN_B | 18 | 18 | N/A | `python verify.py --structural` |
| NEGATIVE_REJECTION_CASES | 8 | 8 | N/A | `python verify.py --structural` |
| FILE_SIZE_LIMIT | 16 | 16 | N/A | `python verify.py --structural` |
| Research dual-source gate | 95 | 22 | N/A | `python verify.py --strict` |
| Bonus criterion dual-source gate | 9 | 3 | N/A | `python verify.py --strict` |
| Complete bonus behavior gate | 9 | 0 | N/A | `python verify.py --strict` |
| Primary string captures | 13 | 0 | N/A | `python verify.py --strict` |
| Full timeline/string coverage | 1 | 0 | N/A | `python verify.py --strict` |
| SHA-256 file integrity | 15 | 15 | N/A | `python verify.py --structural --checksums` and `sha256sum -c SHA256SUMS.txt` |

The checksum manifest excludes itself. The full checksum command was run after this report was finalized. The negative tests actually injected six schema defects and two duplicate-key/ID defects; all eight were rejected. Recheck tests validate the recorded audit coverage, not live website content.

## Validator output (executed)

```text
$ python verify.py --structural
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 135/135
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 13/13
PASS SOURCE_EXCERPT_BUDGET: 18/18
PASS CORROBORATION_LINEAGE_GUARD: 23/23
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 125/125
PASS RECORDED_SOURCE_REOPEN_A: 18/18
PASS RECORDED_ROW_RECHECK_B: 125/125
PASS RECORDED_SOURCE_REOPEN_B: 18/18
PASS NEGATIVE_REJECTION_CASES: 8/8
PASS FILE_SIZE_LIMIT: 16/16
STRUCTURAL_RESULT=PASS; suites=15; seed=N/A (deterministic)
EXIT=0

$ python verify.py --strict
PASS JSON_SCHEMA: 6/6
PASS UNIQUE_IDS: 7/7
PASS CLAIM_SOURCE_REFERENCES: 135/135
PASS CATALOG_REFERENCES: 24/24
PASS STRING_SOURCE_COMPLETENESS: 13/13
PASS SOURCE_EXCERPT_BUDGET: 18/18
PASS CORROBORATION_LINEAGE_GUARD: 23/23
PASS DOCUMENTED_CATALOG_COUNTS: 2/2
PASS UNKNOWN_BEHAVIOR_REMAINS_NULL: 11/11
PASS RECORDED_ROW_RECHECK_A: 125/125
PASS RECORDED_SOURCE_REOPEN_A: 18/18
PASS RECORDED_ROW_RECHECK_B: 125/125
PASS RECORDED_SOURCE_REOPEN_B: 18/18
PASS NEGATIVE_REJECTION_CASES: 8/8
PASS FILE_SIZE_LIMIT: 16/16
STRUCTURAL_RESULT=PASS; suites=15; seed=N/A (deterministic)
FACTS_DUAL_SOURCE=22/95; FAIL
BONUS_CRITERIA_DUAL_SOURCE=3/9; FAIL
FULL_BONUS_BEHAVIOR_VERIFIED=0/9; FAIL
STRING_PRIMARY_CAPTURES=0/13; FAIL
FULL_TIMELINE_AND_STRING_COVERAGE=INCOMPLETE; FAIL
STRICT_RESEARCH_RESULT=NOT_MET; exit=1
EXIT=1
```

## Source reopens and two full retained-row reviews

Pass A and pass B each reopened all **18 retained source URLs** using `web.open` or `Exa.web_fetch_exa`. URLs are in `sources.json` and `SOURCES.md`; retrieval references and tools are recorded in `recheck.json.sourceReopens`. Each retained claim, bonus, effect and string has a separate A/B decision below, **125/125 records reviewed in each pass**. The statuses show that many rechecks did not establish verification. An unanswered requirement was reviewed as a gap, not passed as a game rule.

Both passes were by the same assistant. Tool reads may be cached. No immutable source snapshots, source byte hashes, fresh-origin guarantee or independent second researcher is claimed. The review includes scope/contradiction checks; it is not an exhaustive observation of every possible game state.

| Source | Pass A | Pass B | Tool |
|---|---|---|---|
| NIN | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| GAME | reopened (2 retained retrieval references) | reopened (3 retained retrieval references) | web.open |
| BONUS | reopened (2 retained retrieval references) | reopened (3 retained retrieval references) | web.open |
| QUOTE | reopened (4 retained retrieval references) | reopened (6 retained retrieval references) | web.open |
| HOME | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| MNN | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| GR | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| MPL | reopened (1 retained retrieval references) | reopened (2 retained retrieval references) | web.open |
| MPLTV | reopened (2 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| TV | reopened (2 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| IGN | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | Exa.web_fetch_exa |
| ZU | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| TRACKER | reopened (1 retained retrieval references) | reopened (2 retained retrieval references) | web.open |
| EXCHANGE | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| MINI | reopened (1 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| BOWSER | reopened (2 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| HIDDEN | reopened (2 retained retrieval references) | reopened (1 retained retrieval references) | web.open |
| RACE | reopened (2 retained retrieval references) | reopened (1 retained retrieval references) | web.open |

### Per-row review log

Confidence and source lists are held on the canonical JSON row; this matrix does not duplicate or override them. `bonus:` decisions cover the whole record, so an independently supported criterion still has an unverified complete-row outcome.

| Row | Pass A result | Pass B result |
|---|---|---|
| claim:SET01 | single_source | single_source |
| claim:SET02 | corroborated | corroborated |
| claim:SET03 | single_source | single_source |
| claim:SET04 | single_source | single_source |
| claim:START01 | single_source | single_source |
| claim:START02 | single_source | single_source |
| claim:START03 | single_source | single_source |
| claim:START04 | single_source | single_source |
| claim:TURN01 | single_source | single_source |
| claim:TURN02 | corroborated | corroborated |
| claim:TURN03 | single_source | single_source |
| claim:TURN04 | single_source | single_source |
| claim:TURN05 | corroborated | corroborated |
| claim:TURN06 | corroborated | corroborated |
| claim:TURN07 | corroborated | corroborated |
| claim:TURN08 | corroborated | corroborated |
| claim:TURN09 | corroborated | corroborated |
| claim:LAND01 | single_source | single_source |
| claim:LAND02 | single_source | single_source |
| claim:LAND03 | single_source | single_source |
| claim:LAND04 | single_source | single_source |
| claim:LAND05 | single_source | single_source |
| claim:LAND06 | corroborated | corroborated |
| claim:LAND07 | single_source | single_source |
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
| claim:EFFECT05 | single_source | single_source |
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
| effect:space-coins | single_source | single_source |
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

## UNVERIFIED

### Every claim not independently established

- **SET01 — single_source; medium:** Party turn limits: 10, 15, 20, 25, or 30.
- **SET03 — single_source; medium:** Motion minigames and minigame explanations can be disabled; handicaps can grant 1–5 starting Stars.
- **SET04 — single_source; medium:** Yellow Toad supplies Party host text; Purple Toad supplies Pro host text.
- **START01 — single_source; medium:** The host welcomes players and offers a board explanation.
- **START02 — single_source; medium:** Players roll dice to establish turn order.
- **START03 — single_source; medium:** The host distributes 10 starting coins to each player.
- **START04 — single_source; medium:** The host introduces the first Star target before ordinary movement; the transcript marks its roaming-Star prompt as excluding Mario's Rainbow Castle.
- **TURN01 — single_source; medium:** Ordinary movement uses a Dice Block numbered 1–10.
- **TURN03 — single_source; medium:** A Star purchase can be offered while passing its bearer; exact landing is not required.
- **TURN04 — single_source; medium:** The usual Star price is 20 coins; board and Buddy modifiers require separate handling.
- **LAND01 — single_source; medium:** Blue adds 3 coins and Red removes 3 before Homestretch.
- **LAND02 — single_source; medium:** Event spaces invoke the board-specific event; Lucky and Unlucky spaces resolve their respective reward or penalty.
- **LAND03 — single_source; medium:** An Item Space can use a roulette or item minigame; no item is awarded on the final turn.
- **LAND04 — single_source; medium:** Chance Time can transfer or exchange Stars or coins between selected players.
- **LAND05 — single_source; medium:** VS spaces interrupt play for a pooled-coin minigame.
- **LAND07 — single_source; medium:** A Bowser Space invokes Impostor Bowser; Party outcomes include coin or Star losses, redistribution, and position shuffling.
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
- **EFFECT05 — single_source; medium:** Double Blue/Red values again to +12/−12.
- **EFFECT06 — single_source; medium:** Double each player's coins.
- **EFFECT07 — single_source; medium:** Replace two or three spaces with Bowser Spaces.
- **EFFECT08 — single_source; medium:** Replace two to four spaces with Chance Time Spaces.

### All nine bonus records still have open fields

- **bowser-space:** Whether repeated Buddy encounters, Bowser Phones, and one physical landing increment this counter differently. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **eventful:** Whether repeated effects count once per physical landing or once per activation. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **item:** Ticket uses, passive items, keys consumed while passing, item bundles and cancelled uses. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **minigame:** Team wins, ties, coin minigames, Duel, VS, Item and Showdown inclusion. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **misfortune:** Whether Buddy repeats change the combined Red/Unlucky landing count. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **rich:** Starting coins, gifts, stolen coins, redistribution, wallet doubling and other counter inclusions. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **shopping:** Free purchases, bundles, remote/event shops and two Buddy purchases. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **sightseer:** Forced transport, teleports, interrupted movement and actual distance versus rolled totals. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.
- **slowpoke:** Forced transport, teleports, interrupted movement and zero-distance eligibility. Independent tie and zero-activity behavior. Tie algorithm and eligibility minimum remain null.

### Exact strings and timestamps

All 13 strings have source URLs and transcript speaker attribution, but **none has a verified primary gameplay capture or independent second transcript**. Eleven are voiced announcements, not certified on-screen captions; only two are host-text excerpts. The remaining opening, item, branch, landing, Homestretch, bonus-award and ending dialogue is not comprehensively transcribed. Source typography and regional/version differences are not guaranteed by a wiki transcription. No fabricated timestamps are supplied.

### Coverage and evidence limits

The full Homestretch menu-generation algorithm, exact probabilities, all restrictions, inventory overflow, complete Frenzy eligibility, complete Tag-Team scoring/turn order, minigame team/vote selection and payout algorithms, exact item/Buddy/landing event priority, all coin/Star tie cardinalities, and precise bonus counter inclusions remain unresolved. See U01–U20 and all entries in `CONFLICTS.md`.

Not every per-row citation has a retained quotation. `SOURCES.md` explicitly marks missing excerpts; even present one-word fragments are locators, not complete proposition proofs. Therefore the requested universal two-independent-URL-plus-quote evidence standard is **not satisfied**.

The Dailymotion browser attempt could not play the game footage. Its auto-captions, guessed duration and inferred countdown meaning were rejected. No controlled gameplay tests were performed. No green GitHub Actions run is claimed, and no outside-folder workflow was added.
