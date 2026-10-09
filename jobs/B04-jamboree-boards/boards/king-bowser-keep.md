# King Bowser's Keep

Research PARTIAL; overall confidence low. Reported facts and exact qualifiers retain their evidence status.

## Space counts

Whole count profiles remain single-source and include Start. The scoped original Korean comparison corroborates some ordinary type cells and records differing cells below, without supplying Start/Rally or verifying complete totals. All original integers and sums are preserved; see CONFLICTS.md and the dated recovery report. Pro/Homestretch, angry and TV profiles are not promoted.

### baseline_party

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_KEEP-Q002 |
| blue | 27 | W_KEEP-Q003, NAMU_KR_COUNTS-Q018 (conflict/low; Namu 26) |
| red | 5 | W_KEEP-Q004, NAMU_KR_COUNTS-Q005 (corroborated/medium) |
| event | 6 | W_KEEP-Q005, NAMU_KR_COUNTS-Q006 (corroborated/medium) |
| chance_time | 3 | W_KEEP-Q006, NAMU_KR_COUNTS-Q003 (corroborated/medium) |
| item | 10 | W_KEEP-Q007, NAMU_KR_COUNTS-Q010 (corroborated/medium) |
| vs | 3 | W_KEEP-Q008, NAMU_KR_COUNTS-Q003 (corroborated/medium) |
| rally | 0 | W_KEEP-Q009 |
| lucky | 26 | W_KEEP-Q010, NAMU_KR_COUNTS-Q017 (conflict/low; Namu 23) |
| unlucky | 1 | W_KEEP-Q002, NAMU_KR_COUNTS-Q001 (corroborated/medium) |
| bowser | 2 | W_KEEP-Q011, NAMU_KR_COUNTS-Q002 (corroborated/medium) |
| Total, including Start | 84 | W_KEEP |

### tv_tag_team

| Type | Count | Evidence |
|---|---:|---|
| start | 1 | W_KEEP-Q002 |
| blue | 23 | W_KEEP-Q012 |
| red | 11 | W_KEEP-Q013 |
| event | 6 | W_KEEP-Q005 |
| chance_time | 3 | W_KEEP-Q006 |
| item | 10 | W_KEEP-Q007 |
| vs | 0 | W_KEEP-Q009 |
| rally | 2 | W_KEEP-Q014 |
| lucky | 22 | W_KEEP-Q015 |
| unlucky | 4 | W_KEEP-Q016 |
| bowser | 2 | W_KEEP-Q011 |
| Total, including Start | 84 | W_KEEP |

## Star movement and cost

- `king-bowser-keep:stars:purchase` (single_source, medium): {"movement": "relocating Star; exact eligible locations/selection law unverified", "normalCostCoins": 20, "selectionProbabilities": null} — MPL_BOARDS-Q001, MPL_BOARDS-Q002. MPL reports core movement and standard cost. Complete locations, Pro cycle, discounts and post-Homestretch additions are separate qualifiers; no RNG weights inferred.

## Gates, keys and paid paths

- `king-bowser-keep:gatesPaths:skeleton_gate` (single_source, high): {"trigger": "Reach closed Skeleton Key gate with key.", "effect": "Use key to access separate path; precise gate endpoints unknown.", "keyPriceCoins": 3, "exactEndpoints": null} — W_GAME-Q003, MPL_GAME-Q003. Gate use/sourceboard scope corroborated; keyprice 3 has one complete price source.

## Events: triggers and effects

- `king-bowser-keep:events:byway_reverse` (corroborated, high): {"name": "Byway reversal", "trigger": "Land on Byway direction Event Space or use Bowser Byway Lever.", "effect": "Reverse allowed direction around square Byway."} — W_KEEP-Q026, MPL_BOARDS-Q011. 
- `king-bowser-keep:events:red_pipe` (single_source, medium): {"name": "Bob-omb red pipe", "trigger": "Land on Event Space near red pipe.", "effect": "Bob-omb forces transfer to a RedSpace near Byway; no coin loss for transfer and no Dry Bones return bonus."} — W_KEEP-Q027, W_KEEP-Q028. 
- `king-bowser-keep:events:bill_blaster` (single_source, medium): {"name": "BulletBill sweep", "trigger": "Land on either of two BillBlaster Event Spaces.", "effect": "Both blasters launch; hit players lose 5 coins, or 10 withBuddy.", "normalLossCoins": 5, "buddyLossCoins": 10} — W_KEEP-Q029. 
- `king-bowser-keep:events:green_pipe` (single_source, medium): {"name": "GreenPipe return", "trigger": "Take a green pipe.", "effect": "Return to Start; Dry Bones grants 10 coins or 20 withBuddy.", "normalCoins": 10, "buddyCoins": 20} — W_KEEP-Q030. 
- `king-bowser-keep:events:gear` (single_source, medium): {"name": "Rotating gear", "trigger": "Pass gear on Byway.", "effect": "Claim current face:3..10 coins or Bob-omb causing 5 coinloss. Rotateclockwise aftervisit/reset afterallclaimed; Buddy also claims next clockwise face.", "coinRange": [3, 10], "bobombLossCoins": 5} — W_KEEP-Q031, W_KEEP-Q032. 
- `king-bowser-keep:events:mechakoopa` (single_source, medium): {"name": "Persistent Mechakoopa health", "trigger": "Pass a Mechakoopa encounter.", "effect": "Separate dice damage; small 3 HP reward 6/loss 3; large 7 HP reward 15/loss 5. Survivinghealth persists, defeatedrespawnsfull; Buddy extraroll.", "small": {"hitpoints": 3, "winCoins": 6, "lossCoins": 3}, "large": {"hitpoints": 7, "winCoins": 15, "lossCoins": 5}} — W_KEEP-Q033, W_KEEP-Q034, W_KEEP-Q035. 
- `king-bowser-keep:events:vault` (single_source, medium): {"name": "Bowser's vault", "trigger": "Pass vault.", "effect": "One two-digit 1..9 guess, two withBuddy; collect seizedStars/coins on success. Correctdigits lock, wrongdigits eliminated; starts/refills 10 coins.", "digits": 2, "digitMin": 1, "digitMax": 9, "normalAttempts": 1, "buddyAttempts": 2, "initialCoins": 10, "refillCoins": 10, "independentUniformPasscodeWeights": null} — W_KEEP-Q036, W_KEEP-Q037. Wiki's 1 in 81 assumes independent uniform digits. No empirical passcode weights or exact seed law established, so odds not asserted.
- `king-bowser-keep:events:bowser_byway` (single_source, medium): {"name": "Byway Bowser penalty", "trigger": "Land on a Bowser Space on Byway.", "effect": "Bowser picks player up locally; may skip roulette and seize 1 Star, else allcoins when noStars, else dismiss zero-resource player.", "starLoss": 1, "coinLossWithoutStars": "all"} — W_KEEP-Q038, W_KEEP-Q039. Optional direct penalty timing/probabilities remain unknown.

## Board state and rule changes

- `king-bowser-keep:phases:fire_growth` (single_source, high): {"trigger": "Start of every third turn.", "effect": "Bowser changes two eligible Byway spaces to Bowser Spaces; turn 24 adds final one then stops.", "periodTurns": 3, "normalConversions": 2, "lastConversionTurn": 24, "lastConversionCount": 1} — W_KEEP-Q040, W_KEEP-Q041, DS_BOARDS-Q004. Three-turn/two-space core independently matches; turn 24 final stop qualifier has one publisher.
- `king-bowser-keep:phases:retype_bounds` (single_source, medium): {"trigger": "Impostor Bowser progressively replaces eligible Byway spaces.", "effect": "Possible Star Blue and direction Event spaces are protected; final normal blue count 22 versus Tag 17 reported. Item 8, VS 2 or Rally 1, Lucky 19(normal)/16(Tag) are conditional replacement minima; maxBowser 17.", "reportedNormal": {"blue": 22, "itemPossibleMinimum": 8, "vsPossibleMinimum": 2, "luckyPossibleMinimum": 19}, "reportedTag": {"blue": 17, "itemPossibleMinimum": 8, "rallyPossibleMinimum": 1, "luckyPossibleMinimum": 16}, "maximumBowserSpaces": 17} — W_KEEP-Q042, W_KEEP-Q043. Conditional minima are not asserted to be simultaneous realized counts; replacement order and RNG unknown.
- `king-bowser-keep:phases:unlock` (conflict, low): {"baseRequirement": {"achievementCount": 30, "rank": null, "alternate": "complete Party-Planner Trek and view credits"}, "tvDefaultReported": true, "rankAlternatives": ["Platinum", "Diamond"]} — W_KEEP-Q044, MPL_BOARDS-Q012, W_KEEP-Q045, N_AU-Q002. Current wiki saysPlatinum 30; MPL and freshly retrieved NintendoAU stillsayDiamond. Wiki reports an official error correction, but AU marketing currently retains the wording. TV default qualifier remains single-source.

## Local Homestretch behavior

- `king-bowser-keep:homestretch:no_extra_bowser` (single_source, medium): {"trigger": "Choose Homestretch special-event candidates.", "effect": "Add-more-Bowser Spaces option excluded on KingBowserKeep."} — W_HOME-Q001. 

## Shops and prices

The following are 35 inventory profiles across the job, not 35 physical shops. Party profiles retain explicit TagTeam-only update conditions; TogetherDice is restricted to TagTeam. Price5 for SteamerTicket is initial, not a fixed later fare.

### Koopa Troopa Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": null} | single_source | W_KEEP-Q017 |
| Skeleton Key | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q018 |
| Pipe | 4 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q019 |
| Swap Mirror | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q020 |
| Chomp Call | 6 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q021 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q022 |
| Payday Double Dice | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |
| Golden Pipe | 25 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q024 |
| Together Dice | 20 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "tag_team", "itemRulesRestriction": "tag_team"} | single_source | W_KEEP-Q025 |

### Koopa Troopa Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Double Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q017 |
| Payday Double Dice | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |
| Skeleton Key | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q018 |
| Custom Dice Block | 12 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q022 |
| Swap Mirror | 7 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q020 |
| Golden Pipe | 25 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q024 |

### Kamek Shop — party_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Creepy Dice Block | 3 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q018 |
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q017 |
| Mushroom | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q018 |
| Bowser Byway Lever | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q021 |
| Dueling Glove | 7 | {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q020 |
| Shop Hop Box | 6 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q021 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "after_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |

### Kamek Shop — pro_rules

Location: UNVERIFIED; exact numbered approach/exit spaces unknown.

| Item | Coins | Availability qualifier | Status | Evidence |
|---|---:|---|---|---|
| Super Creepy Dice | 5 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q017 |
| Mushroom | 3 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q018 |
| Shop Hop Box | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q021 |
| Chomp Call | 6 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q021 |
| Bowser Byway Lever | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |
| Star Steal Trap (2-piece set) | 10 | {"inventoryPeriod": "any", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null} | single_source | W_KEEP-Q023 |

## Cited regional map description

A central reversible square Byway joins outer branches. Pipes return toward Start/Byway; the vault and large Mechakoopa sit on the far branch. Gate endpoints and full directed numbered paths remain unresolved.

Evidence: W_KEEP-Q047. Linked source gallery: https://www.mariowiki.com/King_Bowser%27s_Keep. Exact image URLs and both retrieval fingerprints are in map-assets.json; images are not republished.

- `king-bowser-keep:map_link:green_pipe` (single_source, medium): {"from": "green pipe entrance", "to": "Start", "via": "green pipe", "condition": "take pipe"} — W_KEEP-Q046. Regional connection only; endpoints are editorial region labels, not game space IDs.
- `king-bowser-keep:map_link:red_pipe` (single_source, medium): {"from": "red-pipe EventSpace", "to": "RedSpace near Byway", "via": "forced red pipe", "condition": "land corresponding event"} — W_KEEP-Q027. Regional connection only; endpoints are editorial region labels, not game space IDs.

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
