# Rainbow Galleria

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

These one-publisher count profiles include the Start space. All sums are independently recomputed, and missing independent totals are listed in CONFLICTS.md. Pro/Homestretch counts are not extrapolated.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_GALLERIA-Q002 |
| blue | 23 | W_GALLERIA-Q003 |
| red | 6 | W_GALLERIA-Q004 |
| event | 11 | W_GALLERIA-Q005 |
| chance_time | 1 | W_GALLERIA-Q002 |
| item | 6 | W_GALLERIA-Q004 |
| vs | 3 | W_GALLERIA-Q006 |
| rally | 0 | W_GALLERIA-Q007 |
| lucky | 14 | W_GALLERIA-Q008 |
| unlucky | 2 | W_GALLERIA-Q009 |
| bowser | 2 | W_GALLERIA-Q009 |
| Total, including Start | 69 | W_GALLERIA |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_GALLERIA-Q002 |
| blue | 19 | W_GALLERIA-Q010 |
| red | 11 | W_GALLERIA-Q005 |
| event | 11 | W_GALLERIA-Q005 |
| chance_time | 1 | W_GALLERIA-Q002 |
| item | 6 | W_GALLERIA-Q004 |
| vs | 0 | W_GALLERIA-Q007 |
| rally | 2 | W_GALLERIA-Q009 |
| lucky | 11 | W_GALLERIA-Q005 |
| unlucky | 5 | W_GALLERIA-Q011 |
| bowser | 2 | W_GALLERIA-Q009 |
| Total, including Start | 69 | W_GALLERIA |

## Star movement and cost

- `rainbow-galleria:stars:purchase` (single_source, medium): {"movement": "relocating Star; exact eligible locations/selection law unverified", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q001, MPL_BOARDS-Q002. MPL reports core movement and standard cost. Complete locations, Pro cycle, discounts and post-Homestretch additions are separate qualifiers; no RNG weights inferred.

## Gates, keys and paid paths

- `rainbow-galleria:gatesPaths:elevator` (corroborated, high): {"trigger": "Pass elevator entrance and choose travel.", "effect": "Move between first and third floors for 5 coins per character; Buddy total 10.", "from": "floor1", "to": "floor3", "bidirectional": true, "coinsPerCharacter": 5, "buddyTotalCoins": 10} — W_GALLERIA-Q023, GR_GALLERIA-Q007. 
- `rainbow-galleria:gatesPaths:escalators` (corroborated, high): {"trigger": "Follow an escalator route.", "effect": "Move between floors 1↔2 or 2↔3 via escalators; exact space IDs unverified.", "floors": [1, 2, 3]} — W_GALLERIA-Q024, GR_GALLERIA-Q008. 

## Events: triggers and effects

- `rainbow-galleria:events:stamps` (single_source, medium): {"name": "Stamp collection/redemption", "trigger": "Pass a stamp station to stamp the sheet; pass reception to choose redemption.", "effect": "Redeem 1/2/3/4 distinct stamps for 10/20/30/50 coins; an incomplete sheet may be kept.", "payoutsCoins": [10, 20, 30, 50]} — W_GALLERIA-Q025, GR_GALLERIA-Q009. Payout vector independently agrees; exact passing-only collection/redemption activation has one explicit account, so full row remains single-source.
- `rainbow-galleria:events:last_place_shop` (corroborated, high): {"name": "Last-Place Shop", "trigger": "Last-place player lands exactly on either Event Space outside the third-floor-left shop.", "effect": "Receive 15 coins and choose a purchase; others cannot shop.", "coins": 15} — W_GALLERIA-Q026, GR_GALLERIA-Q010, GR_GALLERIA-Q011. 
- `rainbow-galleria:events:last_place_qualifiers` (single_source, medium): {"name": "Last-Place Shop qualification", "trigger": "Visit as last place, optionally with Buddy.", "effect": "Buddy doubles grant to 30 coins. Purchase remains permitted even when the grant changes rank.", "buddyCoins": 30} — W_GALLERIA-Q027, W_GALLERIA-Q028. 
- `rainbow-galleria:events:super_shop` (single_source, medium): {"name": "Super Shop", "trigger": "Land on the shop's Event Space(s).", "effect": "Buy a listed Super item."} — W_GALLERIA-Q029. Full special-shop stock, trigger and price scope is recorded below; independently supported item costs do not verify all event qualifiers.
- `rainbow-galleria:events:gold_shop` (single_source, medium): {"name": "Gold Shop", "trigger": "Land on the shop's Event Space(s).", "effect": "Buy a listed gold item."} — W_GALLERIA-Q030. Full special-shop stock, trigger and price scope is recorded below; independently supported item costs do not verify all event qualifiers.
- `rainbow-galleria:events:boo_shop` (single_source, medium): {"name": "Boo Shop", "trigger": "Land on the shop's Event Space(s).", "effect": "Buy Boo Bell for 15 coins; hosted by Peepa."} — W_GALLERIA-Q031. Full special-shop stock, trigger and price scope is recorded below; independently supported item costs do not verify all event qualifiers.
- `rainbow-galleria:events:thrift` (corroborated, high): {"name": "Thrift Store", "trigger": "Land on a Whomp Thrift Store Event Space.", "effect": "Whomp forcibly buys one held item, normally paying twice its original shop cost; Loadstone exception unresolved.", "normalShopCostMultiplier": 2} — W_GALLERIA-Q032, GR_GALLERIA-Q012. 
- `rainbow-galleria:events:loadstone` (conflict, low): {"name": "Thrift Loadstone exception", "trigger": "Whomp chooses held Loadstone in Thrift event.", "effect": "Reported payout conflicts: wiki 20 versus GameRant 10.", "resolvedCoins": null, "alternativesCoins": [20, 10]} — W_GALLERIA-Q033, GR_GALLERIA-Q013. No silent resolution.
- `rainbow-galleria:events:raffle` (single_source, medium): {"name": "Raffle", "trigger": "Land on Raffle Event Space after buying items.", "effect": "A draw per purchased item: white 1,green 5,blue 15,red 30 coins or gold Golden Pipe.", "payouts": {"white": 1, "green": 5, "blue": 15, "red": 30, "gold": "Golden Pipe"}, "probabilities": null} — W_GALLERIA-Q034, W_GALLERIA-Q035, GR_GALLERIA-Q014, GR_GALLERIA-Q015, GR_GALLERIA-Q016. Payout table is corroborated, but GameRant does not explicitly state exactly one draw per purchased item. Whole row remains single-source.

## Board state and rule changes

- `rainbow-galleria:phases:stamp_color_labels` (conflict, low): {"reportedWiki": ["blue", "red", "yellow", "green"], "reportedGameRant": ["blue", "pink", "orange", "green"], "resolvedColorNames": null} — W_GALLERIA-Q036, GR_GALLERIA-Q017. Same colored station art may be named differently; preserve labels instead of silently substituting.
- `rainbow-galleria:phases:flash_sale` (corroborated, high): {"trigger": "Every fifth turn in ordinary rules.", "effect": "One turn of half-price Stars/items, excluding One-Coin Shop.", "periodTurns": 5, "durationTurns": 1, "priceMultiplier": "1/2"} — W_GALLERIA-Q037, W_GALLERIA-Q038, GR_GALLERIA-Q018, GR_GALLERIA-Q019. 
- `rainbow-galleria:phases:flash_qualifiers` (single_source, medium): {"frenzySaleTurn": 3, "rounding": "down", "proSaleTurn": 10} — W_GALLERIA-Q039, W_GALLERIA-Q040, W_GALLERIA-Q041. Exact rounding and edition-specific timings have one publisher.
- `rainbow-galleria:phases:markup` (corroborated, high): {"trigger": "Use Markup Sticker on an opponent.", "effect": "Item/Star prices double for their next turn.", "multiplier": 2, "itemPriceCoins": 5} — W_GAME-Q001, W_GAME-Q002, MPL_GAME-Q001, MPL_GAME-Q002. 
- `rainbow-galleria:phases:shop_closure_stock` (single_source, medium): {"trigger": "Final turn, or Pro Rules special shop visit.", "effect": "Every Galleria shop closes on final turn; special Event shops have unlimited stock even in Pro Rules."} — W_GALLERIA-Q042, W_GALLERIA-Q043. 
- `rainbow-galleria:phases:peach_daisy` (conflict, low): {"trigger": "Buddy spawn selection on Galleria.", "effect": "Current wiki excludes Peach/Daisy; older GameRant guide describes Peach flash-sale combination.", "resolvedAvailability": null} — W_GALLERIA-Q044, GR_GALLERIA-Q020. Version/scope disagreement; current game build not observed.

## Local Homestretch behavior

UNVERIFIED: no complete board-specific rule retained for this section.

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

- `rainbow-galleria:shop:0:location` (single_source, medium): {"region": "floor 2 left", "exactSpaceIds": null} — GR_GALLERIA-Q001. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |
| Markup Sticker | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |
| Pipe | 4 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q013 |
| Warp Box | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q014 |
| Shop Hop Box | 6 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | conflict | W_GALLERIA-Q015, GR_GALLERIA-Q002 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q017 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": "tag_team"} | single_source | W_GALLERIA-Q018 |

### Koopa Troopa Shop — pro_rules

- `rainbow-galleria:shop:1:location` (single_source, medium): {"region": "floor 2 left", "exactSpaceIds": null} — GR_GALLERIA-Q001. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |
| Markup Sticker | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |
| Pipe | 4 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q013 |
| Warp Box | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q014 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q017 |

### One-Coin Shop — party_rules

- `rainbow-galleria:shop:2:location` (single_source, medium): {"region": "floor 1 right", "exactSpaceIds": null} — GR_GALLERIA-Q003. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 1 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |
| Mushroom | 1 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |
| 10-Coin Steal Trap | 1 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |
| Pipe | 1 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |

### One-Coin Shop — pro_rules

- `rainbow-galleria:shop:3:location` (single_source, medium): {"region": "floor 1 right", "exactSpaceIds": null} — GR_GALLERIA-Q003. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 1 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |
| Mushroom | 1 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |
| Pipe | 1 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q019 |

### Last-Place Shop — all_reported_rules

- `rainbow-galleria:shop:4:location` (single_source, medium): {"region": "floor 3 left", "exactSpaceIds": null} — GR_GALLERIA-Q004. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Markup Sticker | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |
| Triple Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q017 |
| Swap Mirror | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q014 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q016 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q017 |

### Super Shop — all_reported_rules

- `rainbow-galleria:shop:5:location` (single_source, medium): {"region": "floor 3 left", "exactSpaceIds": null} — GR_GALLERIA-Q004. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Super Swap Mirror | 15 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q020 |
| Super Dueling Glove | 40 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q021 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q012 |

### Gold Shop — all_reported_rules

- `rainbow-galleria:shop:6:location` (single_source, medium): {"region": "floor 3 right", "exactSpaceIds": null} — GR_GALLERIA-Q005. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Payday Double Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q017 |
| Payday Triple Dice | 15 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q020 |
| Golden Pipe | 25 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q022 |

### Boo Shop — all_reported_rules

- `rainbow-galleria:shop:7:location` (single_source, medium): {"region": "floor 2 right", "exactSpaceIds": null} — GR_GALLERIA-Q006. Full floor+side qualifier relies on GameRant; diagram independently inspected but no separate publisher-level confirmation.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Boo Bell | 15 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_GALLERIA-Q020 |

## Cited regional map description

Three floors are joined by directional escalators; the paid elevator links floor 1 and floor 3. Floor 1 holds Start/reception/One-CoinShop, floor 2 the raffle/Boo/Koopa area, and floor 3 the specialized stores and thrift event.

Evidence: W_GALLERIA-Q046. Linked source gallery: https://www.mariowiki.com/Rainbow_Galleria. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `rainbow-galleria:map_link:escalator_1_2` (corroborated, high): {"from": "floor1", "to": "floor2", "via": "escalators", "condition": "follow indicated direction; reciprocal escalators exist, exact space IDs unknown"} — W_GALLERIA-Q045, GR_GALLERIA-Q021. Regional connection only; endpoints are editorial region labels, not game space IDs.
- `rainbow-galleria:map_link:escalator_2_3` (corroborated, high): {"from": "floor2", "to": "floor3", "via": "escalators", "condition": "follow indicated direction; reciprocal escalators exist, exact space IDs unknown"} — W_GALLERIA-Q045, GR_GALLERIA-Q021. Regional connection only; endpoints are editorial region labels, not game space IDs.
- `rainbow-galleria:map_link:elevator` (corroborated, high): {"from": "floor1", "to": "floor3", "via": "elevator", "condition": "pay5coins percharacter; both directions"} — W_GALLERIA-Q023, GR_GALLERIA-Q007. Regional connection only; endpoints are editorial region labels, not game space IDs.

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
- `shared:pro_homestretch` (single_source, medium): {"trigger": "Homestretch in Pro Rules.", "effect": "No special random event; doubled spaces and same-space duel behavior remain."} — W_GAME-Q013, W_GAME-Q014. 
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
