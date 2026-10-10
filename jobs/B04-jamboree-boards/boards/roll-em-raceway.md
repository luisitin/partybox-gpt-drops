# Roll 'em Raceway

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

Whole count profiles remain single-source and include Start. The scoped original Korean comparison corroborates some ordinary type cells and records differing cells below, without supplying Start/Rally or verifying complete totals. All original integers and sums are preserved; see CONFLICTS.md and the dated recovery report. Pro/Homestretch, angry and TV profiles are not promoted.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_RACEWAY-Q002 |
| blue | 32 | W_RACEWAY-Q003, NAMU_KR_COUNTS-Q019 (conflict/low; Namu 33) |
| red | 3 | W_RACEWAY-Q004, NAMU_KR_COUNTS-Q003 (corroborated/medium) |
| event | 11 | W_RACEWAY-Q005, NAMU_KR_COUNTS-Q011 (corroborated/medium) |
| chance_time | 1 | W_RACEWAY-Q002, NAMU_KR_COUNTS-Q001 (corroborated/medium) |
| item | 10 | W_RACEWAY-Q006, NAMU_KR_COUNTS-Q010 (corroborated/medium) |
| vs | 2 | W_RACEWAY-Q007, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| rally | 0 | W_RACEWAY-Q008 |
| lucky | 14 | W_RACEWAY-Q009, NAMU_KR_COUNTS-Q013 (corroborated/medium) |
| unlucky | 2 | W_RACEWAY-Q007, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| bowser | 2 | W_RACEWAY-Q007, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| Total, including Start | 78 | W_RACEWAY |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_RACEWAY-Q002 |
| blue | 30 | W_RACEWAY-Q010 |
| red | 7 | W_RACEWAY-Q011 |
| event | 11 | W_RACEWAY-Q005 |
| chance_time | 1 | W_RACEWAY-Q002 |
| item | 10 | W_RACEWAY-Q006 |
| vs | 0 | W_RACEWAY-Q008 |
| rally | 2 | W_RACEWAY-Q007 |
| lucky | 9 | W_RACEWAY-Q012 |
| unlucky | 5 | W_RACEWAY-Q013 |
| bowser | 2 | W_RACEWAY-Q007 |
| Total, including Start | 78 | W_RACEWAY |

## Star movement and cost

- `roll-em-raceway:stars:purchase` (single_source, medium): {"movement": "alternate between two marked northern lane spots", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q008, MPL_BOARDS-Q002. MPL reports core movement and standard cost. Complete locations, Pro cycle, discounts and post-Homestretch additions are separate qualifiers; no RNG weights inferred.
- `roll-em-raceway:stars:alternating_qualifiers` (single_source, high): {"trigger": "Purchase a Star at one of the two marked northern-lane spots.", "effect": "Star alternates to the other marked spot; first Star is on top lane.", "initialLane": "top", "spotCount": 2} — W_RACEWAY-Q014, DS_BOARDS-Q002. Alternation corroborated; initial top-lane qualifier remains one-source.

## Gates, keys and paid paths

UNVERIFIED: no complete board-specific rule retained for this section.

## Events: triggers and effects

- `roll-em-raceway:events:runaway` (single_source, medium): {"name": "Runaway race car", "trigger": "Land on one of the two upper-path Event Spaces.", "effect": "Broozer, occasionally Whomp/Snifit, chases players along upper lane; complete stopping-space rule unknown."} — W_RACEWAY-Q022. 
- `roll-em-raceway:events:jump_pad` (single_source, high): {"name": "Jump pad", "trigger": "Land on a Jump Pad Event Space.", "effect": "Launch to the other side of the track."} — W_RACEWAY-Q023, MPL_BOARDS-Q009. Independent text corroborates launch mechanic; exact landing trigger/target identifiers have one account.
- `roll-em-raceway:events:swap` (single_source, medium): {"name": "Swap shops and jump pads", "trigger": "Land on one of the two swap Event Spaces.", "effect": "Item shops and Jump Pads exchange locations for two turns.", "durationTurns": 2} — W_RACEWAY-Q024. 
- `roll-em-raceway:events:dice_stop` (corroborated, high): {"name": "Dice Stop", "trigger": "Pass Dice Stop and choose purchase.", "effect": "Pay 10 coins to fill inventory with random dice items.", "coins": 10} — W_RACEWAY-Q025, MPL_BOARDS-Q010. Independent complete core purchase; candidate pool/weights separate.
- `roll-em-raceway:events:laps` (single_source, medium): {"name": "Lap reward", "trigger": "Pass under the lap arch.", "effect": "First lap pays 10 coins, second 20, then +10 per subsequent lap.", "firstCoins": 10, "secondCoins": 20, "incrementCoins": 10} — W_RACEWAY-Q026. DS wording '10 Coins per lap completed' is ambiguous and not independent algorithm confirmation.

## Board state and rule changes

- `roll-em-raceway:phases:dice_pool` (single_source, medium): {"trigger": "Dice Stop purchase.", "effect": "Candidate items reported Creepy Dice,Double,Triple,Custom,Payday Double,Payday Triple,Turbo; weights unknown.", "candidates": ["Creepy Dice Block", "Double Dice", "Triple Dice", "Custom Dice Block", "Payday Double Dice", "Payday Triple Dice", "Turbo Dice"], "probabilities": null} — W_RACEWAY-Q027. 
- `roll-em-raceway:phases:turbo` (single_source, medium): {"trigger": "Use Turbo Dice.", "effect": "Roll four dice and move their sum; skip passing interactions including Star exchanges.", "dice": 4, "range": [4, 40]} — W_RACEWAY-Q028, W_RACEWAY-Q029, DS_BOARDS-Q003. Four-dice/skip core independently corroborated; reported 4..40 range has only one explicit complete source. No roll weights inferred.
- `roll-em-raceway:phases:creepy_availability` (single_source, medium): {"trigger": "Obtain ordinary Creepy Dice Block on Raceway.", "effect": "No ordinary shop sells it; ItemSpaces or Dice Stop may supply it."} — W_RACEWAY-Q030. 
- `roll-em-raceway:phases:shop_count_scope` (single_source, low): {"reportedSimultaneousShopCount": 1, "hostSwitching": "Koopa/Kamek depends on board events", "visualStates": "normal diagram shows the brown-roof stall; swapped diagram shows the purple-roof stall at the other position", "durationTurns": 2} — W_SHOPS-Q001, W_RACEWAY-Q031. Second map review resolves the initial plural-wording ambiguity: profiles represent host/ruleset inventory alternatives, not simultaneous shop counts. Full physical positions remain single-source visual observations.

## Local Homestretch behavior

UNVERIFIED: no complete board-specific rule retained for this section.

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom Tickets | 6 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q015 |
| Double Dice | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |
| Turbo Dice | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q018 |
| Pipe | 4 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q019 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q018 |
| Payday Double Dice | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": "tag_team"} | single_source | W_RACEWAY-Q020 |

### Koopa Troopa Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom Tickets | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q015 |
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q018 |
| Turbo Dice | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q018 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |

### Kamek Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block Tickets | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q015 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q019 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q021 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q020 |
| Half-Coins Steal Trap (2-piece set) | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |

### Kamek Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q016 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q015 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q019 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q021 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q020 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_RACEWAY-Q017 |

## Cited regional map description

Two northern Star lanes feed a lap route around the circuit, with Jump Pads and shops whose positions can swap. The lap arch and Dice Stop are separate passing interactions.

Evidence: W_RACEWAY-Q033. Linked source gallery: https://www.mariowiki.com/Roll_%27em_Raceway. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `roll-em-raceway:map_link:pad` (single_source, medium): {"from": "JumpPadEventSpace", "to": "other side of track", "via": "jump pad", "condition": "pad location depends on swap state"} — W_RACEWAY-Q032. Regional connection only; endpoints are editorial region labels, not game space IDs.

## Shared Homestretch and Jamboree TV rules

The shared records below apply subject to local exceptions, such as Castle’s fixed Star and Keep’s managed Bowser spaces. Frenzy and TagTeam are TV application rules; base ProRules remains a separate application.

- `shared:star_cost` (corroborated, high): {"standardCoins": 20} — N_AU-Q003, MPL_BOARDS-Q002. Discount and cost-multiplier interactions are separate.
- `shared:homestretch_base` (single_source, medium): {"trigger": "Final five turns under normal finite-turn board play.", "effect": "Blue/Red coins double from 3 to 6 and same-space landings may trigger duels.", "blueGainCoins": 6, "redLossCoins": 6} — W_HOME-Q003, W_HOME-Q004. Complete current trigger and exact duel qualifiers lack independent detailed confirmation.
- `shared:mushroom` (single_source, medium): {"trigger": "Homestretch special event selected.", "effect": "One selected player receivesMushroom; if host chooses, recipient random."} — W_HOME-Q005. Detailed full candidate has one publisher.
- `shared:extra_star` (single_source, medium): {"trigger": "Homestretch special event selected, excludingCastle.", "effect": "Add one single-use Star Exchange that disappears after purchase."} — W_HOME-Q006. Detailed full candidate has one publisher.
- `shared:star_traps` (single_source, medium): {"trigger": "Homestretch special event selected.", "effect": "Every player receivesStar Steal Trap."} — W_HOME-Q007. Detailed full candidate has one publisher.
- `shared:double_dice` (single_source, medium): {"trigger": "Homestretch special event selected.", "effect": "Every player receivesDouble Dice."} — W_HOME-Q008. Detailed full candidate has one publisher.
- `shared:double_spaces` (corroborated, high): {"trigger": "Further double-Blue/Red Homestretch event selected.", "effect": "Blue/Red grant/loss doubles again to 12 coins.", "blueGainCoins": 12, "redLossCoins": 12} — W_HOME-Q009, FAMI-Q001. Independent firsthand report agrees with 12 coin result.
- `shared:double_coins` (single_source, medium): {"trigger": "Homestretch special event selected.", "effect": "Double every player's coins."} — W_HOME-Q010. Detailed full candidate has one publisher.
- `shared:extra_bowser` (single_source, medium): {"trigger": "Homestretch event selected, excludingKeep.", "effect": "Replace 2 or 3 spaces withBowser.", "replacementCountRange": [2, 3]} — W_HOME-Q011. Detailed full candidate has one publisher.
- `shared:extra_chance` (single_source, medium): {"trigger": "Homestretch event selected.", "effect": "Replace 2..4 spaces withChance Time.", "replacementCountRange": [2, 4]} — W_HOME-Q012. Detailed full candidate has one publisher.
- `shared:pro_homestretch` (corroborated, high): {"trigger": "Homestretch in Pro Rules.", "effect": "No special random event; doubled spaces and same-space duel behavior remain."} — W_GAME-Q013, W_GAME-Q014, GFAQ_PRO-Q001. Opened original credited player report independently states all retained Pro Homestretch qualifiers. Party Rules special-event candidates remain separate unverified records.
- `shared:shop_period` (single_source, medium): {"trigger": "Ordinary shop inventory update halfway through game.", "effect": "Switch Party Rules first-half inventory to second-half inventory; exact boundary turn rounding not established.", "boundaryTurnFormula": null} — W_SHOPS-Q002, W_SHOPS-Q003. Do not invent odd-length cutoff rounding or conflate this with last-five-turn event.
- `shared:pro_stock` (single_source, medium): {"trigger": "Buy from standard Koopa or Kamek shop in Pro Rules.", "effect": "Two of each item, shared across shops with same host; no restock and no halfway-update.", "initialStockPerItem": 2} — W_SHOPS-Q004, W_SHOPS-Q005. Galleria special Event shops explicitly exempted in local rules.
- `shared:tv_camera_pro` (corroborated, high): {"trigger": "Launch TV Mario Party rather than base application.", "effect": "CameraPlay faces may appear on board UI/events; Pro Rules absent.", "proRulesAvailable": false} — W_TV-Q001, W_TV-Q002, MPL_TV-Q001, MPL_TV-Q002. 
- `shared:tv_frenzy` (corroborated, high): {"trigger": "Start Frenzy Rules.", "effect": "Five turns,50 coins+Double Dice+oneStar each; two Homestretch events at start, duels active, oneBonus Star at end.", "turns": 5, "startingCoins": 50, "startingStars": 1, "startingItem": "Double Dice", "startingHomestretchEvents": 2, "bonusStars": 1} — W_TV-Q003, W_TV-Q004, MPL_TV-Q003, MPL_TV-Q004. 
- `shared:tv_tag` (corroborated, high): {"trigger": "Play Tag Team Rules.", "effect": "Two teams of two share coins/Stars; Rally calls partner and awards 5 coins. Together Dice brings partner and combines rolls, providing doubled Star/item effects.", "teams": 2, "playersPerTeam": 2, "rallyCoins": 5} — W_TV-Q005, W_TV-Q006, MPL_TV-Q005, MPL_TV-Q006. Common core only; stock/layout/Buddy/return timing qualifiers remain separate.
- `shared:tv_tag_qualifiers` (single_source, medium): {"trigger": "TagTeam layout and Buddy mechanics.", "effect": "VSspaces removed, Rally added and negatives increased; Buddies absent, Together Dice second-half item reported 20 coins.", "buddyAvailable": false, "togetherDiceCoins": 20} — W_TV-Q007, W_TV-Q008, W_TV-Q009. Layout count tables remain one publisher; full item availability/stock qualifiers require independent evidence.
- `shared:no_new_boards` (corroborated, high): {"trigger": "Compare TV edition with base board roster.", "effect": "No additional board added; same seven-board roster.", "boardCount": 7} — MPL_TV-Q007, W_TV-Q010, CD_TV-Q001. Wiki does not explicitly corroborate complete no-new-board claim.

## UNVERIFIED

- Independent complete space-type totals absent; all profile totals are recorded in CONFLICTS.md.
- Exact numbered directed map adjacency, Star-spawn law, complete event exhaustiveness, shop gate positions and applicable Pro/Frenzy updates remain UNVERIFIED.
- Source-backed single-source values are reported, not accepted as fully corroborated.
- Exact numbered directed adjacency is UNVERIFIED; no missing edge is inferred.
- Image-derived regional details have one underlying game screenshot lineage and no identified game build.
- No image is republished; map-assets.json supplies cited URLs and retrieval fingerprints.
- Every single_source/conflict/unverified record above lacks full independent agreement; schema and sum checks do not certify Nintendo gameplay.
- Exact event probabilities, passcode weights, complete reward distributions, RNG, fixed tide cadence, all event exhaustiveness and full numbered adjacency remain unverified.
