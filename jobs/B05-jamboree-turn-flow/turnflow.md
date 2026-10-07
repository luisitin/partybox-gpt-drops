# B05 — Party timeline and award rules

**Research draft, not a verified implementation specification.** This document covers the requested phases, but preserves unresolved behavior instead of filling gaps from other Mario Party games. Read the status on each claim. `corroborated` means the retained core statement agrees across independent source lineages; it does not certify every related edge case. The strict acceptance gate fails.

The ordered headings below are an editorial framework, not proof of a complete engine event queue. In particular, item/Buddy ordering, branch prompts, landing-effect priority and board phase hooks remain open. Source URLs, locators, excerpt references and conflicts are in [SOURCES.md](SOURCES.md), [claims.json](claims.json), and [CONFLICTS.md](CONFLICTS.md).

## 1. Choose the rules and configure the party

Party turn limits: 10, 15, 20, 25, or 30. [SET01](SOURCES.md#set01) — single_source; medium confidence. MNN lists every permitted length; IGN confirms only the endpoints 10 and 30. Do not treat endpoints as a second enumeration.

Party settings include bonus awards Off, random selection, or Classic; minigames can use Random or Vote. [SET02](SOURCES.md#set02) — corroborated; high confidence. Random selection is a description here, not a certified exact menu label.

Motion minigames and minigame explanations can be disabled; handicaps can grant 1–5 starting Stars. [SET03](SOURCES.md#set03) — single_source; medium confidence.

Yellow Toad supplies Party host text; Purple Toad supplies Pro host text. [SET04](SOURCES.md#set04) — single_source; medium confidence.

## 2. Board introduction, order rolls, starting resources

The host welcomes players and offers a board explanation. [START01](SOURCES.md#start01) — single_source; medium confidence.

Players roll dice to establish turn order. [START02](SOURCES.md#start02) — single_source; medium confidence.

The host distributes 10 starting coins to each player. [START03](SOURCES.md#start03) — single_source; medium confidence.

The host introduces the first Star target before ordinary movement; the transcript marks its roaming-Star prompt as excluding Mario's Rainbow Castle. [START04](SOURCES.md#start04) — single_source; medium confidence. Board-specific introduction variants are not fully transcribed or independently checked.

**UNVERIFIED U01:** Exact opening-roll range, descending-order display, and tied-order-roll resolution.

The short source-transcribed introduction entries are `host-welcome` and `ann-start` in [strings.json](strings.json). They are not a complete opening transcript.

## 3. One player turn

### 3.1 Pre-roll decisions and item use

An exact pre-roll state machine has not been established. Do not ship a guessed one-item rule or infer that every item is used from the same menu.

**UNVERIFIED U02:** Exact input menu strings, input order, and whether all item classes obey a one-item-per-turn limit.

**UNVERIFIED U03:** Item-use versus Buddy-start-effect ordering, cancellation and unavailable-target behavior.

### 3.2 Dice and movement

Ordinary movement uses a Dice Block numbered 1–10. [TURN01](SOURCES.md#turn01) — single_source; medium confidence.

Players take turns rolling and traversing the board to collect coins and obtain Stars. [TURN02](SOURCES.md#turn02) — corroborated; high confidence.

### 3.3 Passing interactions and Star purchases

A Star purchase can be offered while passing its bearer; exact landing is not required. [TURN03](SOURCES.md#turn03) — single_source; medium confidence.

The usual Star price is 20 coins; board and Buddy modifiers require separate handling. [TURN04](SOURCES.md#turn04) — single_source; medium confidence.

A recruited Buddy can allow two Star purchases instead of one. [TURN05](SOURCES.md#turn05) — corroborated; high confidence.

Turbo Dice on Roll em Raceway bypasses interactions en route, including Star purchases. [TURN09](SOURCES.md#turn09) — corroborated; high confidence. Pass A added independent IGN hands-on corroboration; passing stops must not be unconditional.

**UNVERIFIED U04:** Exact movement decrement rules for every shop, Star, Boo, gate and branch node; forced movement versus dice movement.

### 3.4 Branch choice and gates

**UNVERIFIED U05:** The complete branch-choice interface, legal-edge constraints, gate/key consumption and prompt order.

This is an explicit missing phase, not a claim that the game lacks branching. The final legality and step-counting rules must be established before using this document to implement board graphs.

### 3.5 Buddy encounters during the turn

Reaching an unclaimed Buddy starts a Showdown; the initiating player has an advantage and the winner recruits the Buddy. [TURN06](SOURCES.md#turn06) — corroborated; high confidence.

Another player passing the Buddy holder can take the Buddy. [TURN07](SOURCES.md#turn07) — corroborated; high confidence.

Buddy effects include repeated landing-space interactions, including repeated harmful Bowser encounters. [TURN08](SOURCES.md#turn08) — corroborated; high confidence.

### 3.6 Landing and interruptions

Blue adds 3 coins and Red removes 3 before Homestretch. [LAND01](SOURCES.md#land01) — single_source; medium confidence.

Event spaces invoke the board-specific event; Lucky and Unlucky spaces resolve their respective reward or penalty. [LAND02](SOURCES.md#land02) — single_source; medium confidence.

An Item Space can use a roulette or item minigame; no item is awarded on the final turn. [LAND03](SOURCES.md#land03) — single_source; medium confidence.

Chance Time can transfer or exchange Stars or coins between selected players. [LAND04](SOURCES.md#land04) — single_source; medium confidence.

VS spaces interrupt play for a pooled-coin minigame. [LAND05](SOURCES.md#land05) — single_source; medium confidence.

Hidden Blocks can appear after landing on Blue or Red spaces in Party Rules. [LAND06](SOURCES.md#land06) — corroborated; high confidence. MPL explicitly confirms both colors. Its speculation about probabilities is excluded. Pro removal is separate in PRO02.

A Bowser Space invokes Impostor Bowser; Party outcomes include coin or Star losses, redistribution, and position shuffling. [LAND07](SOURCES.md#land07) — single_source; medium confidence.

Showdown, Item, Duel and VS interruptions are distinct from the ordinary round-ending minigame. [ROUND04](SOURCES.md#round04) — single_source; medium confidence. Exact interruption/resumption event priority remains unverified.

**UNVERIFIED U06:** Complete priority order among traps, landing effects, Buddy repeats, Hidden Blocks and same-space duels.

## 4. End of round and minigame selection

After all four players have moved, a minigame concludes the round. [ROUND01](SOURCES.md#round01) — single_source; medium confidence.

Vote offers three minigame choices; all four players vote. [ROUND02](SOURCES.md#round02) — single_source; medium confidence.

Bonus Minigames double the coins won. [ROUND03](SOURCES.md#round03) — single_source; medium confidence.

**UNVERIFIED U07:** Board phase/tide/sale/conveyor hooks relative to round minigame, Buddy lifetime decrement and the next player.

**UNVERIFIED U08:** Complete landed-space-color to team mapping, green-space randomization and category probabilities in Jamboree.

**UNVERIFIED U09:** Vote aggregation, weighting, ties, unvoted options, repeat suppression and candidate-pool algorithm.

**UNVERIFIED U10:** Exact standard/coin/team/tied/Bonus Minigame payouts and which minigames count toward the Minigame award.

The catalog distinguishes announcement voice from host dialogue. `ann-minigame`, `ann-game-start`, `ann-finish`, `ann-winner`, and `ann-tie` are short transcript excerpts, not a substitute for game-specific win/tie rules. No rule is inferred from an announcer saying that a minigame tied.

## 5. Homestretch / final five turns

Homestretch occurs with five turns remaining, before those remaining turns are played. [HOME01](SOURCES.md#home01) — single_source; medium confidence.

The host announces standings, then Blue/Red become +6/−6 and same-space landings can trigger duels. [HOME02](SOURCES.md#home02) — single_source; medium confidence.

Party adds a special event chosen by a player or randomly; Pro omits this extra event. [HOME03](SOURCES.md#home03) — single_source; medium confidence. ZU corroborates Pro omission only. Chooser rules remain single-lineage.

Eight possible special effects are listed, while the source wording refers to five; full menu-generation rules are unresolved. [HOME04](SOURCES.md#home04) — conflict; low confidence. C01. Do not infer eight simultaneous choices or uniform sampling.

After the special event, the host gives two tips and board play resumes. [HOME05](SOURCES.md#home05) — single_source; medium confidence.

### Reported special-event pool

Each row below is triggered when that extra **Party Rules** Homestretch event is selected. All eight remain single-lineage reports, not independently verified exhaustive coverage. Five offered menu choices must not be confused with eight reported possible effects. No uniform probabilities are asserted.

| Effect | Reported result and exception | Claim | Confidence |
|---|---|---|---|
| mushroom | Grant one player a Mushroom. If a player selects it, that player receives it; host selection uses a random recipient. No exclusion is documented here; this is not proof that none exists. | [EFFECT01](SOURCES.md#effect01) | medium; single_source |
| extra-star | Add one temporary Star Exchange. It disappears permanently after its one purchase. Excluded on Mario's Rainbow Castle. | [EFFECT02](SOURCES.md#effect02) | medium; single_source |
| star-steal-traps | Give all players a Star Steal Trap. Inventory-overflow resolution is unverified. No exclusion is documented here; this is not proof that none exists. | [EFFECT03](SOURCES.md#effect03) | medium; single_source |
| double-dice | Give all players Double Dice. Inventory-overflow resolution is unverified. No exclusion is documented here; this is not proof that none exists. | [EFFECT04](SOURCES.md#effect04) | medium; single_source |
| space-coins | Double Blue/Red values again to +12/−12. This is additional to the mandatory +6/−6 change. No exclusion is documented here; this is not proof that none exists. | [EFFECT05](SOURCES.md#effect05) | medium; single_source |
| wallet-coins | Double each player's coins. Coin-cap and overflow behavior are unverified. No exclusion is documented here; this is not proof that none exists. | [EFFECT06](SOURCES.md#effect06) | medium; single_source |
| more-bowser | Replace two or three spaces with Bowser Spaces. Exact candidate-space selection is unverified. Excluded on King Bowser's Keep. | [EFFECT07](SOURCES.md#effect07) | medium; single_source |
| more-chance | Replace two to four spaces with Chance Time Spaces. Exact candidate-space selection is unverified. No exclusion is documented here; this is not proof that none exists. | [EFFECT08](SOURCES.md#effect08) | medium; single_source |

**UNVERIFIED U11:** Chooser selection, rank ties, five-option sampling, event weights, slot order beyond reported Mushroom rule and board restrictions.

**UNVERIFIED U12:** Inventory overflow, coin-cap behavior and atomic ordering when Homestretch grants items or doubles wallets.

The JSON preserves `selectionProbabilities: null` and `completePoolIndependentlyVerified: false`. Individual Frenzy eligibility of these eight effects has not been certified.

## 6. Final turn, final minigame and ending

The final round still has a final minigame before the results ceremony. [END01](SOURCES.md#end01) — single_source; medium confidence. NIN supplies the round loop, not direct evidence of the final-round exception boundary.

The ceremony reviews Star totals and notable acquisitions before presenting enabled bonus awards. [END02](SOURCES.md#end02) — single_source; medium confidence.

Enabled bonus awards are added before the winner is determined. [END03](SOURCES.md#end03) — corroborated; high confidence.

The largest final Star total wins. [END04](SOURCES.md#end04) — corroborated; high confidence.

The quote list attests a two-winner announcement for equal Stars and coins. [END05](SOURCES.md#end05) — single_source; medium confidence. Evidence of a co-winner case, not proof of every tie-cardinality rule or a generic dice tiebreaker.

Postgame statistical Awards are separate from the nine scoring Bonus Star categories. [END06](SOURCES.md#end06) — single_source; medium confidence.

**UNVERIFIED U13:** Final ranking tie rules for every cardinality, coin secondary ranking confirmation and animation ordering.

`ann-final-turn`, `ann-final-minigame`, and `ann-congratulations` in the string excerpt bank mark documented announcements. The exact results animation order and all alternative dialogue are not captured.

## 7. All nine documented Bonus Star categories

These are normalized English category labels, reported by the cited tracker/transcript sources. The label transcription itself is not a primary-screen capture. Overall bonus-record confidence is **low** because ties, eligibility and precise internal counters remain open; criterion confidence is separate.

| Category | Reported criterion | Criterion evidence | Unresolved implementation detail |
|---|---|---|---|
| Bowser Space Bonus | Maximize Bowser-space landings. | [BONUS01](SOURCES.md#bonus01); single_source; medium | Whether repeated Buddy encounters, Bowser Phones, and one physical landing increment this counter differently. |
| Eventful Bonus | Maximize Event-space landings. | [BONUS02](SOURCES.md#bonus02); corroborated; high | Whether repeated effects count once per physical landing or once per activation. |
| Item Bonus | Maximize items used. | [BONUS03](SOURCES.md#bonus03); single_source; medium | Ticket uses, passive items, keys consumed while passing, item bundles and cancelled uses. |
| Minigame Bonus | Maximize minigame wins, not minigame coin income. | [BONUS04](SOURCES.md#bonus04); single_source; medium | Team wins, ties, coin minigames, Duel, VS, Item and Showdown inclusion. |
| Misfortune Bonus | Maximize combined Red-space and Unlucky-space landings. | [BONUS05](SOURCES.md#bonus05); single_source; medium | Whether Buddy repeats change the combined Red/Unlucky landing count. |
| Rich Bonus | Maximize cumulative coins collected, including coins subsequently spent or stolen; not peak wallet size. | [BONUS06](SOURCES.md#bonus06); single_source; medium | Starting coins, gifts, stolen coins, redistribution, wallet doubling and other counter inclusions. |
| Shopping Bonus | Maximize items bought at shops, not coins spent there. | [BONUS07](SOURCES.md#bonus07); single_source; medium | Free purchases, bundles, remote/event shops and two Buddy purchases. |
| Sightseer Bonus | Maximize spaces traveled. | [BONUS08](SOURCES.md#bonus08); corroborated; high | Forced transport, teleports, interrupted movement and actual distance versus rolled totals. |
| Slowpoke Bonus | Minimize spaces traveled. | [BONUS09](SOURCES.md#bonus09); corroborated; high | Forced transport, teleports, interrupted movement and zero-distance eligibility. |


### How many categories and how chosen

The number of selected categories is not automatically the number of individual Stars distributed: an independently verified tied-recipient algorithm is missing.

With random bonuses enabled, 10/15/20/25 turns award two categories; 30 turns award three. [COUNT01](SOURCES.md#count01) — corroborated; high confidence.

Classic below 30 turns uses Rich and Eventful; Classic at 30 additionally uses Minigame. [COUNT02](SOURCES.md#count02) — single_source; medium confidence. BONUS explicitly states the 30-turn exception; MNN omits it and MPL does not identify the particular pair below 30. Full combined policy lacks a second explicit statement. See C02.

Off disables Bonus Stars. [COUNT03](SOURCES.md#count03) — corroborated; high confidence.

Pro lasts 12 turns and announces one bonus category before play: Eventful, Sightseer or Slowpoke. [COUNT04](SOURCES.md#count04) — corroborated; high confidence. Some prose says Happening instead of Eventful. Name normalization is logged, not proof of a Pro-specific on-screen label.

The machine-readable policies are in `bonusStars.json.awardPolicies`. In particular, do not import an “always three Classic bonuses” rule from Mario Party Superstars, or treat random selection as proven uniform sampling.

### Bonus ties and eligibility

A series-level source describes tied bonus leaders each receiving a Star, but its adjacent Battle Royale/Tag Team exception is ambiguous for Jamboree. [TIE01](SOURCES.md#tie01) — conflict; low confidence. C03. No unconditional tie algorithm is certified in this drop.

The host transcript attests that an award can have no recipient. [TIE02](SOURCES.md#tie02) — single_source; medium confidence. All-zero thresholds and Slowpoke zero-distance handling are not established.

**UNVERIFIED U14:** Independent second evidence for six non-Pro bonus criteria; exact internal counters for all nine categories.

**UNVERIFIED U15:** All tied-award cardinalities, zero-activity eligibility and whether a non-awarded category is replaced.

**UNVERIFIED U16:** Random category sampling, probabilities, timing of selection, duplicate avoidance and complete Frenzy/Tag-Team award pools.

Every bonus has `tieRule.value: null`, `eligibilityMinimum: null`, and `counterEdgeCasesVerified: false`. One Star per qualifying recipient is preserved as a single-lineage report, not a fully certified award algorithm. No bonus is implemented as executable scoring code in this drop.

## 8. Pro Rules: changes to the base timeline

Players choose a starting item; shop stock is limited to two copies per item without replenishment. [PRO01](SOURCES.md#pro01) — corroborated; high confidence.

Pro removes Chance Time, Hidden Blocks and the extra Homestretch event. [PRO02](SOURCES.md#pro02) — corroborated; high confidence.

Pro keeps Homestretch ±6 Blue/Red values and same-space duels. [PRO03](SOURCES.md#pro03) — single_source; medium confidence.

Pro Lucky spaces offer 10 coins or Double Dice; Unlucky transfers 7 coins to last place. [PRO04](SOURCES.md#pro04) — single_source; medium confidence.

Pro uses item roulette without item minigames. [PRO05](SOURCES.md#pro05) — single_source; medium confidence.

Pro marks future Star sites; a used site becomes eligible again after the other sites have been used. [PRO06](SOURCES.md#pro06) — single_source; medium confidence.

Pro permits Star wagers in duels. [PRO07](SOURCES.md#pro07) — corroborated; high confidence. The additional requirement that both participants have a Star is stated only by GAME and is not promoted to a dual-confirmed rule.

Pro VS stakes are 20 coins; the landing player selects the minigame. [PRO08](SOURCES.md#pro08) — single_source; medium confidence.

Pro Bowser takes a Star; without one, the reported fallback is half the coins, or all coins at King Bowser Keep. [PRO09](SOURCES.md#pro09) — conflict; low confidence. C05: GAME omits the board exception and ZU says zero exceptions. Preserve the board-specific report without calling it independently settled.

**UNVERIFIED U18:** All board-specific Pro substitutions and every exception, including final-turn item/Lucky behavior.

Pro's preannounced category and fixed length are described in COUNT04. The Purple Toad host assignment is only source-transcribed here; no Purple Toad dialogue has been added to the excerpt bank without retained quote evidence.

## 9. Jamboree TV variants — separate context

Frenzy has five turns; players begin with 50 coins, one Star and Double Dice. [TV01](SOURCES.md#tv01) — corroborated; high confidence.

Frenzy begins with two Homestretch effects and same-space duels, and ends with one bonus category. [TV02](SOURCES.md#tv02) — corroborated; high confidence.

Tag-Team shares Stars and coins; higher combined opening rolls act first, and teams alternate players. [TV03](SOURCES.md#tv03) — single_source; medium confidence. Both sources confirm shared Stars/coins; only MPLTV explicitly supplies the opening-roll and alternating-order rules. Entire row is not dual-confirmed.

Jamboree TV does not offer Pro Rules within its own Mario Party rulesets. [TV04](SOURCES.md#tv04) — corroborated; high confidence. The original game remains a separate context; do not infer Pro was removed from the base game.

**UNVERIFIED U19:** Complete Tag-Team turn resolution, team tie rules, bonus counters, modifiers and final presentation.

The five-turn Frenzy start must not receive an additional invented midgame Homestretch trigger. The exact pool of Frenzy effects and Tag-Team bonus counter aggregation remain unresolved. Do not apply TV restrictions to the separately available original-game rules.

## 10. Exact-string coverage and remaining verification

**UNVERIFIED U17:** Complete exact English on-screen text inventory, regional/version variants, visual capture, voice attribution and punctuation.

**UNVERIFIED U20:** Controlled game replay, independent second researcher and exhaustive event-priority tests were not performed.

[strings.json](strings.json) contains **13 short exact source-transcribed excerpts**, including **11 voice lines and two host-text entries**. It is deliberately not the full dialogue script. Every entry has a URL, speaker attribution, medium, occurrence description, confidence and explicit absence of visual capture. No guessed timestamps are included. All remaining requested exact dialogue stays unverified.
