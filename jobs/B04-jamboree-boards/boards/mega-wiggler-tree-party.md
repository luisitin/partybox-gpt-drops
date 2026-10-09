# Mega Wiggler's Tree Party

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

Whole count profiles remain single-source and include Start. The scoped original Korean comparison corroborates some ordinary type cells and records differing cells below, without supplying Start/Rally or verifying complete totals. All original integers and sums are preserved; see CONFLICTS.md and the dated recovery report. Pro/Homestretch, angry and TV profiles are not promoted.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_WIGGLER-Q002 |
| blue | 26 | W_WIGGLER-Q003, NAMU_KR_COUNTS-Q017 (conflict/low; Namu 23) |
| red | 4 | W_WIGGLER-Q004, NAMU_KR_COUNTS-Q004 (corroborated/medium) |
| event | 10 | W_WIGGLER-Q005, NAMU_KR_COUNTS-Q011 (conflict/low; Namu 11) |
| chance_time | 1 | W_WIGGLER-Q002, NAMU_KR_COUNTS-Q001 (corroborated/medium) |
| item | 3 | W_WIGGLER-Q006, NAMU_KR_COUNTS-Q003 (corroborated/medium) |
| vs | 2 | W_WIGGLER-Q007, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| rally | 0 | W_WIGGLER-Q008 |
| lucky | 13 | W_WIGGLER-Q009, NAMU_KR_COUNTS-Q012 (corroborated/medium) |
| unlucky | 1 | W_WIGGLER-Q002, NAMU_KR_COUNTS-Q001 (corroborated/medium) |
| bowser | 2 | W_WIGGLER-Q010, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| Total, including Start | 63 | W_WIGGLER |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_WIGGLER-Q002 |
| blue | 22 | W_WIGGLER-Q011 |
| red | 8 | W_WIGGLER-Q012 |
| event | 10 | W_WIGGLER-Q005 |
| chance_time | 1 | W_WIGGLER-Q002 |
| item | 3 | W_WIGGLER-Q006 |
| vs | 0 | W_WIGGLER-Q008 |
| rally | 2 | W_WIGGLER-Q007 |
| lucky | 11 | W_WIGGLER-Q013 |
| unlucky | 3 | W_WIGGLER-Q006 |
| bowser | 2 | W_WIGGLER-Q010 |
| Total, including Start | 63 | W_WIGGLER |

### baseline_party_angry

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_WIGGLER-Q002 |
| blue | 24 | W_WIGGLER-Q003 |
| red | 6 | W_WIGGLER-Q004 |
| event | 10 | W_WIGGLER-Q005 |
| chance_time | 1 | W_WIGGLER-Q002 |
| item | 3 | W_WIGGLER-Q006 |
| vs | 2 | W_WIGGLER-Q007 |
| rally | 0 | W_WIGGLER-Q008 |
| lucky | 11 | W_WIGGLER-Q009 |
| unlucky | 1 | W_WIGGLER-Q002 |
| bowser | 4 | W_WIGGLER-Q010 |
| Total, including Start | 63 | W_WIGGLER |

### tv_tag_team_angry

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_WIGGLER-Q002 |
| blue | 20 | W_WIGGLER-Q011 |
| red | 10 | W_WIGGLER-Q012 |
| event | 10 | W_WIGGLER-Q005 |
| chance_time | 1 | W_WIGGLER-Q002 |
| item | 3 | W_WIGGLER-Q006 |
| vs | 0 | W_WIGGLER-Q008 |
| rally | 2 | W_WIGGLER-Q007 |
| lucky | 9 | W_WIGGLER-Q013 |
| unlucky | 3 | W_WIGGLER-Q006 |
| bowser | 4 | W_WIGGLER-Q010 |
| Total, including Start | 63 | W_WIGGLER |

## Star movement and cost

- `mega-wiggler-tree-party:stars:purchase` (single_source, medium): {"movement": "relocating Star; exact eligible locations/selection law unverified", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q001, MPL_BOARDS-Q002. MPL reports core movement and standard cost. Complete locations, Pro cycle, discounts and post-Homestretch additions are separate qualifiers; no RNG weights inferred.

## Gates, keys and paid paths

UNVERIFIED: no complete board-specific rule retained for this section.

## Events: triggers and effects

- `mega-wiggler-tree-party:events:bell_move` (corroborated, high): {"name": "Wiggler bridge move", "trigger": "Land on a bell Event Space or use Wiggler Bell.", "effect": "Mega Wiggler moves and changes the connected central route."} — W_WIGGLER-Q023, MPL_BOARDS-Q003. 
- `mega-wiggler-tree-party:events:plant` (single_source, medium): {"name": "Piranha penalty", "trigger": "Land on a Piranha Plant Event Space.", "effect": "The visited plant takes 5 coins initially and grows its own penalty by 1 per paid encounter; no coins means no growth. Buddy visits hit twice.", "initialCoins": 5, "increasePerEncounter": 1, "independentPlants": 2} — W_WIGGLER-Q024, W_WIGGLER-Q025. MPL confirms increasing penalties but not the complete trigger/numeric/zero-coin qualifiers.
- `mega-wiggler-tree-party:events:honey` (single_source, medium): {"name": "Hive choices", "trigger": "Land on one of the two honey Event Spaces.", "effect": "Pick among three hives: two contain honey and one bees. A honey pick awards coins and permits another; bees end the attempt without losing earned coins. Buddy grants a second attempt.", "reportedMaximumCoinsPerAttempt": 34} — W_WIGGLER-Q026, W_WIGGLER-Q027. Individual payout distribution is unknown.

## Board state and rule changes

- `mega-wiggler-tree-party:phases:anger` (conflict, low): {"trigger": "A bell produces its unpleasant sound during the second half of the match.", "effect": "Wiggler becomes angry; its back's Lucky spaces become Red and Blue spaces become Bowser. A later bell restores normal.", "probability": null} — W_WIGGLER-Q028, PT_BOARDS-Q001. Wiki and PocketTactics disagree on converted space types. No anger probability inferred.

## Local Homestretch behavior

- `mega-wiggler-tree-party:homestretch:preserved_back_spaces` (single_source, medium): {"trigger": "Homestretch adds Bowser or Chance Time spaces on Wiggler's back.", "effect": "Those inserted space types remain fixed through later happy/angry states."} — W_WIGGLER-Q029. 

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Wiggler Bell | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Custom Dice Block | 12 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q015 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q016 |
| Shop Hop Box | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q017 |
| Golden Pipe | 25 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q018 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": "tag_team"} | single_source | W_WIGGLER-Q019 |

### Koopa Troopa Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Wiggler Bell | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q015 |
| Golden Pipe | 25 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q018 |
| Shop Hop Box | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q017 |

### Kamek Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 3 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q020 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Wiggler Bell | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q017 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q021 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q022 |

### Kamek Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q014 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q021 |
| Warp Box | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q021 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q019 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_WIGGLER-Q022 |

## Cited regional map description

The shown board has an outer route and a central Wiggler-back bridge. The bell changes the bridge connection, so one screenshot cannot define every traversable state.

Evidence: W_WIGGLER-Q031. Linked source gallery: https://www.mariowiki.com/Mega_Wiggler%27s_Tree_Party. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `mega-wiggler-tree-party:map_link:variable_bridge` (single_source, medium): {"from": "one outer-route fork", "to": "another central/outer-route fork", "via": "Wiggler back", "condition": "Wiggler current position; exact directional endpoint IDs unknown"} — MPL_BOARDS-Q004, W_WIGGLER-Q030. Regional connection only; endpoints are editorial region labels, not game space IDs.

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
