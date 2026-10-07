# B05 — Sources and per-row evidence index

**Strict two-independent-source acceptance is not met.** Different wiki pages and the tracker that credits those wikis count as one lineage. Independent-source status applies to the full retained claim, not merely to the existence of two URLs.

The short verbatim excerpt catalog is stored once in `sources.json`; QUOTE excerpt IDs point to the exact strings in `strings.json`. This index lists URLs, excerpt IDs and contextual locators. **An empty excerpt list is missing requested per-row quote evidence**, not a passed quotation check. Short fragments locate passages; they do not independently establish every qualifier. Full claim text and notes are in `claims.json` and `turnflow.md`.

## Sources

### NIN

[Nintendo: quick overview](https://www.nintendo.com/au/news-and-articles/super-mario-party-jamboree-heres-a-quick-overview-of-the-game/)

Lineage: `nintendo`; primary. 

Excerpt IDs: NIN-E1, NIN-E2, NIN-E3, NIN-E4, NIN-E5, NIN-E6, NIN-E7.

### GAME

[Super Mario Wiki: Jamboree](https://www.mariowiki.com/Super_Mario_Party_Jamboree)

Lineage: `mariowiki`; secondary. 

Excerpt IDs: GAME-E1, GAME-E2, GAME-E3, GAME-E4, GAME-E5, GAME-E6, GAME-E7, GAME-E8, GAME-E9, GAME-E10.

### BONUS

[Super Mario Wiki: Bonus Star](https://www.mariowiki.com/Bonus_Star)

Lineage: `mariowiki`; secondary. Cross-series article. Only explicitly Jamboree-applicable passages accepted; tie paragraph is ambiguous.

Excerpt IDs: BONUS-E1, BONUS-E2, BONUS-E3, BONUS-E4, BONUS-E5, BONUS-E6, BONUS-E7.

### QUOTE

[Super Mario Wiki: Jamboree quotes](https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_quotes)

Lineage: `mariowiki`; secondary_transcript. Not a direct game capture. Separate Voice from Text headings. Regional variants are not interchangeable.

Excerpt IDs: QUOTE-E1, QUOTE-E2, QUOTE-E3, QUOTE-E4, QUOTE-E5, QUOTE-E6, QUOTE-E7, QUOTE-E8, QUOTE-E9, QUOTE-E10, QUOTE-E11, QUOTE-E12, QUOTE-E13.

### HOME

[Super Mario Wiki: Homestretch](https://www.mariowiki.com/Homestretch)

Lineage: `mariowiki`; secondary. Only the Jamboree subsection is applicable. Eight effects listed despite wording about five.

Excerpt IDs: HOME-E1, HOME-E2, HOME-E3, HOME-E4, HOME-E5, HOME-E6, HOME-E7, HOME-E8, HOME-E9, HOME-E10.

### MNN

[My Nintendo News hands-on preview](https://mynintendonews.com/2024/10/01/preview-super-mario-party-jamboree/)

Lineage: `my-nintendo-news`; hands_on_review. Pre-release review copy; its abbreviated Classic explanation omits the 30-turn exception.

Excerpt IDs: MNN-E1, MNN-E2, MNN-E3, MNN-E4, MNN-E5, MNN-E6, MNN-E7, MNN-E8, MNN-E9.

### GR

[GamesRadar: hands-on Pro Rules analysis](https://www.gamesradar.com/games/puzzle/with-super-mario-party-jamboree-nintendos-finally-letting-you-cut-out-the-random-nonsense-thats-defined-its-multiplayer-games-for-decades/)

Lineage: `gamesradar`; hands_on_review. Use Lucky stars section, not introductory jokes about hypothetical bonuses.

Excerpt IDs: GR-E1, GR-E2, GR-E3, GR-E4.

### MPL

[Mario Party Legacy: unlockables](https://mariopartylegacy.com/super-mario-party-jamboree/unlockables-rewards-achievements)

Lineage: `mario-party-legacy`; secondary. Uses Event/Coin/Minigame Star aliases. Does not identify which two Classic categories apply below 30 turns.

Excerpt IDs: MPL-E1, MPL-E2, MPL-E3, MPL-E4, MPL-E5.

### MPLTV

[Mario Party Legacy: Jamboree TV](https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/)

Lineage: `mario-party-legacy`; secondary. 

Excerpt IDs: MPLTV-E1, MPLTV-E2, MPLTV-E3, MPLTV-E4, MPLTV-E5, MPLTV-E6, MPLTV-E7.

### TV

[Super Mario Wiki: Jamboree TV](https://www.mariowiki.com/Jamboree_TV)

Lineage: `mariowiki`; secondary. Alias for the enhanced-edition article; not an independent wiki source.

Excerpt IDs: TV-E1, TV-E2, TV-E3, TV-E4, TV-E5, TV-E6, TV-E7.

### IGN

[IGN: Logan Plant review](https://me.ign.com/en/super-mario-party-jamboree/225526/review/super-mario-party-jamboree-review)

Lineage: `ign-logan-plant`; hands_on_review. web.open failed. Readable via Exa. Syndicated IGN copies count as one source.

Excerpt IDs: IGN-E1, IGN-E2, IGN-E3, IGN-E4, IGN-E5, IGN-E6, IGN-E7, IGN-E8.

### ZU

[Zelda Universe: Jamboree review](https://zeldauniverse.net/features/review-super-mario-party-jamboree/)

Lineage: `zelda-universe`; hands_on_review. Bowser zero-exceptions wording is overbroad; do not use for no-Star fallback.

Excerpt IDs: ZU-E1, ZU-E2, ZU-E3, ZU-E4, ZU-E5, ZU-E6.

### TRACKER

[blueYOSHI bonus tracker](https://blueyoshi9000.github.io/MarioPartyOverlay/bonus.html)

Lineage: `mariowiki`; derived. Explicitly credits both wikis. NOT independent confirmation. Rich/Shopping sections include tentative language.

Excerpt IDs: TRACKER-E1, TRACKER-E2, TRACKER-E3, TRACKER-E4, TRACKER-E5, TRACKER-E6, TRACKER-E7, TRACKER-E8, TRACKER-E9, TRACKER-E10.

### EXCHANGE

[Super Mario Wiki: Star Exchange](https://www.mariowiki.com/Star_Exchange)

Lineage: `mariowiki`; secondary. Non-counting-space statement is series-general, not a captured Jamboree movement test.

Excerpt IDs: EXCHANGE-E1, EXCHANGE-E2, EXCHANGE-E3, EXCHANGE-E4, EXCHANGE-E5.

### MINI

[Super Mario Wiki: Minigame](https://www.mariowiki.com/Minigame)

Lineage: `mariowiki`; secondary. Cross-series selection descriptions must not be imported without a Jamboree-specific check.

Excerpt IDs: MINI-E1, MINI-E2, MINI-E3, MINI-E4.

### BOWSER

[Super Mario Wiki: Bowser Space](https://www.mariowiki.com/Bowser_Space)

Lineage: `mariowiki`; secondary. 

Excerpt IDs: BOWSER-E1, BOWSER-E2, BOWSER-E3, BOWSER-E4, BOWSER-E5, BOWSER-E6, BOWSER-E7, BOWSER-E8.

### HIDDEN

[Super Mario Wiki: Hidden Block](https://www.mariowiki.com/Hidden_Block_(Mario_Party_series))

Lineage: `mariowiki`; secondary. 

Excerpt IDs: HIDDEN-E1, HIDDEN-E2.

### RACE

[Super Mario Wiki: Roll em Raceway](https://www.mariowiki.com/Roll_%27em_Raceway)

Lineage: `mariowiki`; secondary. 

Excerpt IDs: RACE-E1.

## Row index

Status/confidence and source-ID → locator/excerpt mapping follow. Resolve each source ID to the URL above. No source was established for U01–U20; these are unanswered requirements, not asserted rules.

### SET01

single_source; medium. MNN lists every permitted length; IGN confirms only the endpoints 10 and 30. Do not treat endpoints as a second enumeration. 

- MNN: Party rules/settings paragraphs. Excerpts: MNN-E1.
- IGN: Party rules/settings paragraphs. Excerpts: IGN-E1.

### SET02

corroborated; high. Random selection is a description here, not a certified exact menu label. 

- MNN: Party rules/settings paragraphs. Excerpts: MNN-E2, MNN-E3, MNN-E4.
- IGN: Party rules/settings paragraphs. Excerpts: IGN-E2, IGN-E3.

### SET03

single_source; medium. 

- MNN: Before starting the game. Excerpts: MNN-E5.

### SET04

single_source; medium. 

- QUOTE: Text / Yellow Toad; Text / Purple Toad. Excerpts: **MISSING**.

### START01

single_source; medium. 

- QUOTE: Text / Yellow Toad / pre-game board introduction. Excerpts: QUOTE-E12.

### START02

single_source; medium. 

- QUOTE: Text / Yellow Toad / determine the turn order. Excerpts: **MISSING**.

### START03

single_source; medium. 

- QUOTE: Text / Yellow Toad / before we begin. Excerpts: **MISSING**.

### START04

single_source; medium. Board-specific introduction variants are not fully transcribed or independently checked. 

- QUOTE: Text / Yellow Toad / first Star. Excerpts: **MISSING**.

### TURN01

single_source; medium. 

- GAME: Game modes / Mario Party. Excerpts: GAME-E1.

### TURN02

corroborated; high. 

- NIN: Mario Party overview. Excerpts: NIN-E2.
- MNN: Mario Party overview. Excerpts: MNN-E8, MNN-E9.

### TURN03

single_source; medium. 

- EXCHANGE: Star Exchange opening paragraphs; Yellow Toad Star purchase dialogue. Excerpts: EXCHANGE-E1.
- QUOTE: Star Exchange opening paragraphs; Yellow Toad Star purchase dialogue. Excerpts: **MISSING**.

### TURN04

single_source; medium. 

- QUOTE: Yellow Toad Star exchange; Star Exchange opening paragraphs. Excerpts: **MISSING**.
- EXCHANGE: Yellow Toad Star exchange; Star Exchange opening paragraphs. Excerpts: EXCHANGE-E2.

### TURN05

corroborated; high. 

- NIN: Jamboree Buddy descriptions. Excerpts: NIN-E4.
- IGN: Jamboree Buddy descriptions. Excerpts: IGN-E5.

### TURN06

corroborated; high. 

- GAME: Mario Party Buddy paragraph. Excerpts: **MISSING**.
- MNN: Mario Party Buddy paragraph. Excerpts: MNN-E6.

### TURN07

corroborated; high. 

- NIN: Jamboree Buddy ownership. Excerpts: NIN-E5.
- MNN: Mario Party Buddy ownership. Excerpts: MNN-E7.

### TURN08

corroborated; high. 

- GAME: Buddy effects. Excerpts: GAME-E3.
- IGN: Buddy effects. Excerpts: IGN-E6.

### TURN09

corroborated; high. Pass A added independent IGN hands-on corroboration; passing stops must not be unconditional. 

- RACE: Opening / Turbo Dice. Excerpts: RACE-E1.
- IGN: Board-specific items / Turbo Dice. Excerpts: IGN-E7.

### LAND01

single_source; medium. 

- GAME: Spaces table. Excerpts: GAME-E9.

### LAND02

single_source; medium. 

- GAME: Spaces table. Excerpts: **MISSING**.

### LAND03

single_source; medium. 

- GAME: Spaces / Item Space. Excerpts: GAME-E8.

### LAND04

single_source; medium. 

- GAME: Spaces / Chance Time; Yellow Toad Chance Time dialogue. Excerpts: **MISSING**.
- QUOTE: Spaces / Chance Time; Yellow Toad Chance Time dialogue. Excerpts: **MISSING**.

### LAND05

single_source; medium. 

- GAME: Spaces / VS Space; Yellow Toad VS dialogue. Excerpts: **MISSING**.
- QUOTE: Spaces / VS Space; Yellow Toad VS dialogue. Excerpts: **MISSING**.

### LAND06

corroborated; high. MPL explicitly confirms both colors. Its speculation about probabilities is excluded. Pro removal is separate in PRO02. 

- HIDDEN: Jamboree subsection; return of prior Blue-space behavior plus Red. Excerpts: HIDDEN-E1.
- MPL: Achievements / Lucky Star. Excerpts: MPL-E4.

### LAND07

single_source; medium. 

- BOWSER: Super Mario Party Jamboree subsection. Excerpts: BOWSER-E1, BOWSER-E2, BOWSER-E3, BOWSER-E4, BOWSER-E5.

### ROUND01

single_source; medium. 

- NIN: Mario Party mode overview. Excerpts: NIN-E1, NIN-E3.

### ROUND02

single_source; medium. 

- IGN: Pro Rules paragraph. Excerpts: IGN-E3.

### ROUND03

single_source; medium. 

- GAME: Game modes / Mario Party. Excerpts: GAME-E2.

### ROUND04

single_source; medium. Exact interruption/resumption event priority remains unverified. 

- GAME: Mario Party and minigame-category sections. Excerpts: **MISSING**.
- MINI: Mario Party and minigame-category sections. Excerpts: MINI-E1.

### HOME01

single_source; medium. 

- HOME: Jamboree subsection; Yellow Toad Homestretch dialogue. Excerpts: **MISSING**.
- QUOTE: Jamboree subsection; Yellow Toad Homestretch dialogue. Excerpts: **MISSING**.

### HOME02

single_source; medium. 

- HOME: Jamboree subsection; Yellow Toad Homestretch dialogue. Excerpts: **MISSING**.
- QUOTE: Jamboree subsection; Yellow Toad Homestretch dialogue. Excerpts: **MISSING**.

### HOME03

single_source; medium. ZU corroborates Pro omission only. Chooser rules remain single-lineage. 

- HOME: Jamboree subsection; Pro Rules paragraph. Excerpts: HOME-E10.
- ZU: Jamboree subsection; Pro Rules paragraph. Excerpts: ZU-E2.

### HOME04

conflict; low. C01. Do not infer eight simultaneous choices or uniform sampling. 

- HOME: Jamboree subsection. Excerpts: HOME-E9.

### HOME05

single_source; medium. 

- HOME: Jamboree subsection final paragraph. Excerpts: **MISSING**.

### END01

single_source; medium. NIN supplies the round loop, not direct evidence of the final-round exception boundary. 

- QUOTE: Announcer / final minigame; Yellow Toad / results. Excerpts: **MISSING**.
- NIN: Announcer / final minigame; Yellow Toad / results. Excerpts: **MISSING**.

### END02

single_source; medium. 

- QUOTE: Text / Yellow Toad / ending. Excerpts: **MISSING**.

### END03

corroborated; high. 

- BONUS: Bonus Star introduction; IGN standard-rules paragraph. Excerpts: **MISSING**.
- IGN: Bonus Star introduction; IGN standard-rules paragraph. Excerpts: IGN-E4.

### END04

corroborated; high. 

- NIN: Mario Party overview. Excerpts: NIN-E6.
- MNN: Mario Party overview. Excerpts: MNN-E9.

### END05

single_source; medium. Evidence of a co-winner case, not proof of every tie-cardinality rule or a generic dice tiebreaker. 

- QUOTE: Yellow Toad / ending / two winners. Excerpts: **MISSING**.

### END06

single_source; medium. 

- QUOTE: Yellow Toad / finer details; Bonus Star / Availability. Excerpts: **MISSING**.
- BONUS: Yellow Toad / finer details; Bonus Star / Availability. Excerpts: **MISSING**.

### COUNT01

corroborated; high. 

- BONUS: Bonus Star distribution; IGN settings paragraph; Classic unlock section. Excerpts: **MISSING**.
- IGN: Bonus Star distribution; IGN settings paragraph; Classic unlock section. Excerpts: IGN-E4.
- MPL: Bonus Star distribution; IGN settings paragraph; Classic unlock section. Excerpts: MPL-E3.

### COUNT02

single_source; medium. BONUS explicitly states the 30-turn exception; MNN omits it and MPL does not identify the particular pair below 30. Full combined policy lacks a second explicit statement. See C02. 

- BONUS: Classic distribution passages. Excerpts: **MISSING**.
- MPL: Classic distribution passages. Excerpts: MPL-E2, MPL-E3.
- MNN: Classic distribution passages. Excerpts: MNN-E3.

### COUNT03

corroborated; high. 

- MNN: Party rules settings. Excerpts: MNN-E2.
- IGN: Party rules settings. Excerpts: IGN-E2.

### COUNT04

corroborated; high. Some prose says Happening instead of Eventful. Name normalization is logged, not proof of a Pro-specific on-screen label. 

- GAME: Pro Rules; Lucky stars; Pro overview. Excerpts: GAME-E4.
- GR: Pro Rules; Lucky stars; Pro overview. Excerpts: GR-E1, GR-E2, GR-E3, GR-E4.
- NIN: Pro Rules; Lucky stars; Pro overview. Excerpts: NIN-E7.

### TIE01

conflict; low. C03. No unconditional tie algorithm is certified in this drop. 

- BONUS: Introduction tie paragraph. Excerpts: **MISSING**.

### TIE02

single_source; medium. All-zero thresholds and Slowpoke zero-distance handling are not established. 

- QUOTE: Yellow Toad / ending / no one got the bonus. Excerpts: **MISSING**.

### PRO01

corroborated; high. 

- GAME: Pro Rules. Excerpts: GAME-E5.
- ZU: Pro Rules. Excerpts: ZU-E4, ZU-E5.

### PRO02

corroborated; high. 

- GAME: Pro Rules. Excerpts: **MISSING**.
- ZU: Pro Rules. Excerpts: ZU-E1, ZU-E2.

### PRO03

single_source; medium. 

- GAME: Pro Rules / Homestretch. Excerpts: **MISSING**.
- HOME: Pro Rules / Homestretch. Excerpts: **MISSING**.

### PRO04

single_source; medium. 

- GAME: Pro Rules changes. Excerpts: GAME-E6.

### PRO05

single_source; medium. 

- GAME: Pro Rules changes. Excerpts: GAME-E8.

### PRO06

single_source; medium. 

- GAME: Pro Rules Star Stop Signs. Excerpts: **MISSING**.

### PRO07

corroborated; high. The additional requirement that both participants have a Star is stated only by GAME and is not promoted to a dual-confirmed rule. 

- GAME: Pro Rules duel. Excerpts: **MISSING**.
- ZU: Pro Rules duel. Excerpts: ZU-E6.

### PRO08

single_source; medium. 

- GAME: Pro Rules VS. Excerpts: GAME-E7.

### PRO09

conflict; low. C05: GAME omits the board exception and ZU says zero exceptions. Preserve the board-specific report without calling it independently settled. 

- BOWSER: Jamboree / Pro Rules. Excerpts: BOWSER-E3, BOWSER-E6, BOWSER-E7, BOWSER-E8.
- GAME: Jamboree / Pro Rules. Excerpts: **MISSING**.
- ZU: Jamboree / Pro Rules. Excerpts: ZU-E3.

### TV01

corroborated; high. 

- TV: Frenzy Rules. Excerpts: TV-E1, TV-E2, TV-E3.
- MPLTV: Frenzy Rules. Excerpts: MPLTV-E1, MPLTV-E2.

### TV02

corroborated; high. 

- TV: Frenzy Rules. Excerpts: TV-E4, TV-E5.
- MPLTV: Frenzy Rules. Excerpts: MPLTV-E3, MPLTV-E4.
- HOME: Frenzy Rules. Excerpts: **MISSING**.

### TV03

single_source; medium. Both sources confirm shared Stars/coins; only MPLTV explicitly supplies the opening-roll and alternating-order rules. Entire row is not dual-confirmed. 

- TV: Tag-Team Rules. Excerpts: TV-E6.
- MPLTV: Tag-Team Rules. Excerpts: MPLTV-E5, MPLTV-E6.

### TV04

corroborated; high. The original game remains a separate context; do not infer Pro was removed from the base game. 

- MPLTV: Mario Party / rulesets. Excerpts: MPLTV-E7.
- TV: Mario Party / rulesets. Excerpts: TV-E7.

### U01

unverified; low. UNVERIFIED: Exact opening-roll range, descending-order display, and tied-order-roll resolution.

### U02

unverified; low. UNVERIFIED: Exact input menu strings, input order, and whether all item classes obey a one-item-per-turn limit.

### U03

unverified; low. UNVERIFIED: Item-use versus Buddy-start-effect ordering, cancellation and unavailable-target behavior.

### U04

unverified; low. UNVERIFIED: Exact movement decrement rules for every shop, Star, Boo, gate and branch node; forced movement versus dice movement.

### U05

unverified; low. UNVERIFIED: The complete branch-choice interface, legal-edge constraints, gate/key consumption and prompt order.

### U06

unverified; low. UNVERIFIED: Complete priority order among traps, landing effects, Buddy repeats, Hidden Blocks and same-space duels.

### U07

unverified; low. UNVERIFIED: Board phase/tide/sale/conveyor hooks relative to round minigame, Buddy lifetime decrement and the next player.

### U08

unverified; low. UNVERIFIED: Complete landed-space-color to team mapping, green-space randomization and category probabilities in Jamboree.

### U09

unverified; low. UNVERIFIED: Vote aggregation, weighting, ties, unvoted options, repeat suppression and candidate-pool algorithm.

### U10

unverified; low. UNVERIFIED: Exact standard/coin/team/tied/Bonus Minigame payouts and which minigames count toward the Minigame award.

### U11

unverified; low. UNVERIFIED: Chooser selection, rank ties, five-option sampling, event weights, slot order beyond reported Mushroom rule and board restrictions.

### U12

unverified; low. UNVERIFIED: Inventory overflow, coin-cap behavior and atomic ordering when Homestretch grants items or doubles wallets.

### U13

unverified; low. UNVERIFIED: Final ranking tie rules for every cardinality, coin secondary ranking confirmation and animation ordering.

### U14

unverified; low. UNVERIFIED: Independent second evidence for six non-Pro bonus criteria; exact internal counters for all nine categories.

### U15

unverified; low. UNVERIFIED: All tied-award cardinalities, zero-activity eligibility and whether a non-awarded category is replaced.

### U16

unverified; low. UNVERIFIED: Random category sampling, probabilities, timing of selection, duplicate avoidance and complete Frenzy/Tag-Team award pools.

### U17

unverified; low. UNVERIFIED: Complete exact English on-screen text inventory, regional/version variants, visual capture, voice attribution and punctuation.

### U18

unverified; low. UNVERIFIED: All board-specific Pro substitutions and every exception, including final-turn item/Lucky behavior.

### U19

unverified; low. UNVERIFIED: Complete Tag-Team turn resolution, team tie rules, bonus counters, modifiers and final presentation.

### U20

unverified; low. UNVERIFIED: Controlled game replay, independent second researcher and exhaustive event-priority tests were not performed.

### BONUS01

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E6.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E5.

### BONUS02

corroborated; high. GR independently corroborates this core criterion. Precise counters remain unverified. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E6.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- GR: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: GR-E1.

### BONUS03

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E2.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E9.

### BONUS04

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E1.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E2.

### BONUS05

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E3.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E4.

### BONUS06

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E4.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E3.

### BONUS07

single_source; medium. No independent second criterion source established. TRACKER is derived and is excluded from independence counts. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E5.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- TRACKER: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: TRACKER-E8.

### BONUS08

corroborated; high. GR independently corroborates this core criterion. Precise counters remain unverified. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: BONUS-E7.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- GR: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: GR-E1.

### BONUS09

corroborated; high. GR independently corroborates this core criterion. Precise counters remain unverified. 

- BONUS: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- QUOTE: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: **MISSING**.
- GR: Jamboree-applicable criterion; Yellow Toad ending; GamesRadar Lucky stars when present. Excerpts: GR-E1.

### EFFECT01

single_source; medium. If a player selects it, that player receives it; host selection uses a random recipient. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E1.

### EFFECT02

single_source; medium. It disappears permanently after its one purchase. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E2.
- EXCHANGE: Homestretch / Jamboree effect list. Excerpts: EXCHANGE-E4, EXCHANGE-E5.
- QUOTE: Homestretch / Jamboree effect list. Excerpts: **MISSING**.

### EFFECT03

single_source; medium. Inventory-overflow resolution is unverified. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E3.

### EFFECT04

single_source; medium. Inventory-overflow resolution is unverified. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E4.

### EFFECT05

single_source; medium. This is additional to the mandatory +6/−6 change. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E5.
- QUOTE: Homestretch / Jamboree effect list. Excerpts: **MISSING**.

### EFFECT06

single_source; medium. Coin-cap and overflow behavior are unverified. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E6.

### EFFECT07

single_source; medium. Exact candidate-space selection is unverified. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E7.

### EFFECT08

single_source; medium. Exact candidate-space selection is unverified. 

- HOME: Homestretch / Jamboree effect list. Excerpts: HOME-E8.

## Rejected access and evidence

<https://www.dailymotion.com/video/x9t9gs8> failed video playback with a browser-compatibility error. No frames, host identity, duration or timestamps were verified. Automatic captions and the browser agent's guessed interpretations were rejected and did not become evidence. The failed attempt is recorded in `recheck.json.failedAccess`.

Wiki mirrors and syndicated copies of the same review were not treated as independent sources. Cross-series rules were not silently imported into Jamboree. No comprehensive dialogue dump, game assets or source-page snapshots are included.
