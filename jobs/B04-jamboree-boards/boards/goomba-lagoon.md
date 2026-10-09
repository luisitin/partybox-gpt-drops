# Goomba Lagoon

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

Whole count profiles remain single-source and include Start. The scoped original Korean comparison corroborates some ordinary type cells and records differing cells below, without supplying Start/Rally or verifying complete totals. All original integers and sums are preserved; see CONFLICTS.md and the dated recovery report. Pro/Homestretch, angry and TV profiles are not promoted.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_LAGOON-Q002 |
| blue | 34 | W_LAGOON-Q003, NAMU_KR_COUNTS-Q020 (corroborated/medium) |
| red | 9 | W_LAGOON-Q004, NAMU_KR_COUNTS-Q009 (corroborated/medium) |
| event | 8 | W_LAGOON-Q005, NAMU_KR_COUNTS-Q008 (corroborated/medium) |
| chance_time | 2 | W_LAGOON-Q006, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| item | 8 | W_LAGOON-Q005, NAMU_KR_COUNTS-Q008 (corroborated/medium) |
| vs | 4 | W_LAGOON-Q007, NAMU_KR_COUNTS-Q004 (corroborated/medium) |
| rally | 0 | W_LAGOON-Q008 |
| lucky | 19 | W_LAGOON-Q009, NAMU_KR_COUNTS-Q014 (conflict/low; Namu 18) |
| unlucky | 4 | W_LAGOON-Q007, NAMU_KR_COUNTS-Q003 (conflict/low; Namu 3) |
| bowser | 2 | W_LAGOON-Q006, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| Total, including Start | 91 | W_LAGOON |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_LAGOON-Q002 |
| blue | 33 | W_LAGOON-Q010 |
| red | 14 | W_LAGOON-Q011 |
| event | 8 | W_LAGOON-Q005 |
| chance_time | 2 | W_LAGOON-Q006 |
| item | 8 | W_LAGOON-Q005 |
| vs | 0 | W_LAGOON-Q008 |
| rally | 3 | W_LAGOON-Q012 |
| lucky | 14 | W_LAGOON-Q011 |
| unlucky | 6 | W_LAGOON-Q013 |
| bowser | 2 | W_LAGOON-Q006 |
| Total, including Start | 91 | W_LAGOON |

## Star movement and cost

- `goomba-lagoon:stars:purchase` (corroborated, medium): {"movement": "relocating Star; exact eligible locations/selection law unverified", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q001, MPL_BOARDS-Q002, NAMU_KR_COUNTS-Q015. 2026-10-09: full fresh MPL board guide explicitly names this board as having a rotating Star and gives the shared20-coin objective; independent Namu complete ordinary Star Exchange paragraph gives the normal20-coin price and generally relocates the Star after a purchase. Medium confidence preserves the general ordinary scope and unobserved installed build. Exact eligible locations, selection law/probabilities, Pro cycles, price discounts/Markup/Buddy effects, Homestretch additions and mode variants remain separate unverified qualifiers; no deterministic location or special-mode claim. Existing registered numeral20 is reused, with zero new quotes, source-registry/capture edits or expressive words.

## Gates, keys and paid paths

- `goomba-lagoon:gatesPaths:tide_routes` (corroborated, high): {"trigger": "Tide state changes.", "effect": "Low tide connects raised regions; high tide removes connecting paths and leaves regional loops.", "exactSpaceIds": null} — W_LAGOON-Q024, MPL_BOARDS-Q005, MPL_BOARDS-Q006. 

## Events: triggers and effects

- `goomba-lagoon:events:tide_event` (single_source, medium): {"name": "Tide change", "trigger": "Land on a tide-change Event Space.", "effect": "Change tide state and available paths."} — W_LAGOON-Q025. 
- `goomba-lagoon:events:submerged_rescue` (single_source, medium): {"name": "Lakitu rescue", "trigger": "A tide change submerges the player's current space.", "effect": "Fishin'Lakitu transports the player to their last visited on-land space."} — W_LAGOON-Q026. 
- `goomba-lagoon:events:zipline` (single_source, medium): {"name": "Zipline travel", "trigger": "Land on one of the two zipline Event Spaces.", "effect": "Forced transfer to other zipline end; Goomba fee reported 1..7 coins.", "feeCoinsMin": 1, "feeCoinsMax": 7} — W_LAGOON-Q027. NintendoLife corroborates ziplines across flooded regions but not exact fees.
- `goomba-lagoon:events:chests` (single_source, medium): {"name": "Shuffled treasure chests", "trigger": "Land on a chest Event Space before final turn.", "effect": "Choose one of five shuffled chests, two with Buddy: Tide Shell,Shop Hop Box,Swap Mirror,Bowser Phone or Goomba costing 5 coins. Remove chosen chest; reset only after all five picked.", "normalPicks": 1, "buddyPicks": 2, "chests": 5, "goombaLossCoins": 5, "items": ["Tide Shell", "Shop Hop Box", "Swap Mirror", "Bowser Phone"], "selectionWeights": null} — W_LAGOON-Q028, W_LAGOON-Q029, W_LAGOON-Q030. Identity of items and reset/final-turn qualifiers transcribed from the full located paragraph. Chest shuffling/RNG weights are not inferred.
- `goomba-lagoon:events:fishing` (single_source, medium): {"name": "Fishing push-your-luck", "trigger": "Land on a fishing Event Space.", "effect": "Repeat catches or stop; total above 15 tips bucket and loses earned event coins. Buddy allows reported 30 coin maximum.", "normalCapCoins": 15, "buddyCapCoins": 30} — W_LAGOON-Q031, W_LAGOON-Q032. Catch distribution unverified.
- `goomba-lagoon:events:eruption` (conflict, low): {"name": "Volcano eruption", "trigger": "Pass the volcano eruption interaction.", "effect": "Erupt Golden Goombas or Lava Bubbles onto spaces, or no eruption. Passing Lava Bubble loses 3 coins; Gold Goomba payout unresolved.", "lavaLossCoins": 3, "goldCoins": null, "alternativesGoldCoins": [5, 3], "probabilities": null} — W_LAGOON-Q033, W_LAGOON-Q034, MPL_BOARDS-Q007. Preserve 5 vs 3; event trigger and probabilities have one complete detailed account.

## Board state and rule changes

- `goomba-lagoon:phases:tides` (conflict, low): {"trigger": "Reported automatic tide change, Tide Shell use, or tide Event Space.", "effect": "Low tide opens connecting paths; high tide isolates islands and submerges paths. Fixed automatic cadence is unresolved.", "automaticPeriodTurns": null, "reportedCadences": [{"sourceId": "N_AU", "text": "every turn"}, {"sourceId": "DS_BOARDS", "text": "every two turns"}, {"sourceId": "W_LAGOON", "text": "every few turns"}]} — W_LAGOON-Q035, N_AU-Q001, DS_BOARDS-Q001. Official marketing, DS and current wiki disagree on cadence; no schedule guessed.
- `goomba-lagoon:phases:pro_chest` (single_source, medium): {"trigger": "Treasure-chest event in Pro Rules.", "effect": "Bowser Phone chest replaced by Creepy Dice Block."} — W_LAGOON-Q036. 

## Local Homestretch behavior

- `goomba-lagoon:homestretch:submerged_retypes` (single_source, medium): {"trigger": "Add Bowser or Chance Time spaces while high tide.", "effect": "Retyped submerged spaces may remain hidden until tide recedes."} — W_LAGOON-Q037. 

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom | 3 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q014 |
| Double Dice | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": null} | single_source | W_LAGOON-Q015 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q016 |
| Shop Hop Box | 6 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q017 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q018 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q019 |
| Payday Double Dice | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q020 |
| Golden Pipe | 25 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q021 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": "tag_team"} | single_source | W_LAGOON-Q022 |

### Koopa Troopa Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q015 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q020 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q019 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q017 |
| Warp Box | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q018 |
| Golden Pipe | 25 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q021 |

### Kamek Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Tide Shell | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q014 |
| Creepy Dice Block | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q014 |
| Warp Box | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q018 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q017 |
| Half-Coins Steal Trap (2-piece set) | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q015 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q022 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q020 |

### Kamek Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom Tickets | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q017 |
| Creepy Dice Block | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q014 |
| Swap Mirror | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q018 |
| Shop Hop Box | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q017 |
| Payday Triple Dice | 15 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q023 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_LAGOON-Q020 |

## Cited regional map description

Low-tide board routes connect elevated islands using lower paths; high tide removes those paths and leaves island loops. Ziplines can move between their endpoints even over water.

Evidence: W_LAGOON-Q039. Linked source gallery: https://www.mariowiki.com/Goomba_Lagoon. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `goomba-lagoon:map_link:island_paths` (corroborated, high): {"from": "elevated island region", "to": "other elevated region", "via": "lower connecting path", "condition": "low tide only; exact islands/space IDs not identified"} — W_LAGOON-Q024, MPL_BOARDS-Q005, MPL_BOARDS-Q006. Regional connection only; endpoints are editorial region labels, not game space IDs.
- `goomba-lagoon:map_link:zipline` (single_source, medium): {"from": "zipline EventSpace end", "to": "opposite zipline end", "via": "zipline", "condition": "landing trigger and Goomba fee"} — W_LAGOON-Q038. Regional connection only; endpoints are editorial region labels, not game space IDs.

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
