# Mario's Rainbow Castle

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

These one-publisher count profiles include the Start space. All sums are independently recomputed, and missing independent totals are listed in CONFLICTS.md. Pro/Homestretch counts are not extrapolated.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_CASTLE-Q002 |
| blue | 21 | W_CASTLE-Q003 |
| red | 3 | W_CASTLE-Q004 |
| event | 7 | W_CASTLE-Q005 |
| chance_time | 1 | W_CASTLE-Q002 |
| item | 5 | W_CASTLE-Q006 |
| vs | 2 | W_CASTLE-Q007 |
| rally | 0 | W_CASTLE-Q008 |
| lucky | 7 | W_CASTLE-Q005 |
| unlucky | 2 | W_CASTLE-Q007 |
| bowser | 2 | W_CASTLE-Q007 |
| Total, including Start | 51 | W_CASTLE |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_CASTLE-Q002 |
| blue | 19 | W_CASTLE-Q009 |
| red | 7 | W_CASTLE-Q005 |
| event | 7 | W_CASTLE-Q005 |
| chance_time | 1 | W_CASTLE-Q002 |
| item | 5 | W_CASTLE-Q006 |
| vs | 0 | W_CASTLE-Q008 |
| rally | 1 | W_CASTLE-Q002 |
| lucky | 4 | W_CASTLE-Q010 |
| unlucky | 4 | W_CASTLE-Q010 |
| bowser | 2 | W_CASTLE-Q007 |
| Total, including Start | 51 | W_CASTLE |

## Star movement and cost

- `mario-rainbow-castle:stars:purchase` (single_source, medium): {"movement": "fixed tower Star; alternating Yellow Toad and Impostor Bowser", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q013, MPL_BOARDS-Q002. MPL reports core movement and standard cost. Complete locations, Pro cycle, discounts and post-Homestretch additions are separate qualifiers; no RNG weights inferred.

## Gates, keys and paid paths

UNVERIFIED: no complete board-specific rule retained for this section.

## Events: triggers and effects

- `mario-rainbow-castle:events:tower` (single_source, medium): {"name": "Tower visit", "trigger": "Reach tower service at path end.", "effect": "Yellow Toad offers 20 coinStar; Bowser forces 20 coinZtar; returnStart and tower alternates."} — W_CASTLE-Q018, MPL_BOARDS-Q014, MPL_BOARDS-Q015. 20 coinStar/Ztar prices independently agree, but complete automatic tower/return flow is not independently stated in a current-only wiki passage; historical paragraphs are not blindly imported.
- `mario-rainbow-castle:events:tower_event` (single_source, high): {"name": "Tower Event Space", "trigger": "Land on a tower-turn Event Space.", "effect": "Swap Yellow Toad/Impostor Bowser and corresponding shop management."} — W_GAME-Q005, MPL_BOARDS-Q016. Tower swap corroborated; coupled shop-management qualifier has one publisher.
- `mario-rainbow-castle:events:ztar_shortfall` (single_source, medium): {"name": "Ztar insufficient funds", "trigger": "Bowser tower visit with fewer than 20 coins.", "effect": "Bowser takes all remainingcoins and still gives Ztar; no loss of earned realStar asserted."} — W_GAME-Q006. Separate originalMarioParty 40 coin rule excluded.

## Board state and rule changes

- `mario-rainbow-castle:phases:shop_swap` (conflict, low): {"triggerReports": ["pass shop whether purchase or not", "purchase item"], "effect": "Koopa/Kamek shop swaps; exact trigger is unresolved.", "resolvedTrigger": null} — W_CASTLE-Q019, MPL_BOARDS-Q017. Preserve passing versus purchase-only disagreement.
- `mario-rainbow-castle:phases:tower_turner` (corroborated, high): {"trigger": "Use Tower Turner.", "effect": "Chance to swap tower characters; probability unknown.", "probability": null} — W_GAME-Q007, MPL_GAME-Q004. DS 'about 50%' is an approximate one-source estimate and does not establish RNG weight.
- `mario-rainbow-castle:phases:weather` (single_source, medium): {"trigger": "Bowser occupies tower.", "effect": "Sky turns stormy/dark; heavier/electric-guitar board-music variation. Day/night cycle not asserted."} — W_CASTLE-Q020. 

## Local Homestretch behavior

- `mario-rainbow-castle:homestretch:no_extra_star` (single_source, medium): {"trigger": "Homestretch special-event candidates.", "effect": "Add-one-Star Exchange option excluded due to fixed tower Star."} — W_HOME-Q002. 

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

- `mario-rainbow-castle:shop:0:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom | 3 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Mushroom Tickets | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q012 |
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |
| Pipe | 4 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q015 |
| Payday Double Dice | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |
| Warp Box | 7 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |

### Koopa Troopa Shop — pro_rules

- `mario-rainbow-castle:shop:1:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Mushroom Tickets | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q012 |
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q015 |
| Tower Turner | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q017 |

### Koopa Troopa Shop — tag_team_rules

- `mario-rainbow-castle:shop:2:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Pipe | 4 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q015 |
| Double Dice | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |
| Payday Double Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |
| Tower Turner | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q017 |
| Shop Hop Box | 6 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q012 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": "tag_team"} | single_source | W_CASTLE-Q017 |

### Kamek Shop — party_rules

- `mario-rainbow-castle:shop:3:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Warp Box | 7 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Tower Turner | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q017 |
| Half-Coins Steal Trap (2-piece set) | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Creepy Dice Block Tickets | 5 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Swap Mirror | 7 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |

### Kamek Shop — pro_rules

- `mario-rainbow-castle:shop:4:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Mushroom Tickets | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q012 |
| Creepy Dice Block | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Swap Mirror | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q017 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |

### Kamek Shop — tag_team_rules

- `mario-rainbow-castle:shop:5:location` (single_source, medium): {"region": "early route alternating single booth", "exactSpaceIds": null} — W_GAME-Q004. Host-switch trigger preserves conflict; inventory profiles do not count separate physical shops.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q011 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Half-Coins Steal Trap (2-piece set) | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q013 |
| Warp Box | 7 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Dueling Glove | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Plunder Chest | 20 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q017 |
| Swap Mirror | 7 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_CASTLE-Q014 |

## Cited regional map description

The current image shows a climbing route from Start, an upper loop near the tower and a right-hand loop; visits at the tower return to Start. This describes regions, not a complete route graph.

Evidence: W_CASTLE-Q021. Linked source gallery: https://www.mariowiki.com/Mario%27s_Rainbow_Castle. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `mario-rainbow-castle:map_link:tower_return` (single_source, medium): {"from": "tower service", "to": "Start", "via": "Lakitu's cloud", "condition": "after tower visit"} — W_GAME-Q008, MPL_BOARDS-Q018. Return-to-Start core independently agrees; Lakitu-cloud identity and exact service branch have one explicit current account.

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
