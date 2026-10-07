# B04 — Conflicts and missing independent totals

## Per-board count gaps

The original count test permits unresolved totals in this file. Every normal/TagTeam/angry profile has only one retained publisher; correct arithmetic is not a second source. Historical Mario Party / 2 totals are excluded.

| Board | Profile | Reported total inclStart | Source |
|---|---|---:|---|
| Mega Wiggler's Tree Party | baseline_party | 63 | W_WIGGLER |
| Mega Wiggler's Tree Party | tv_tag_team | 63 | W_WIGGLER |
| Mega Wiggler's Tree Party | baseline_party_angry | 63 | W_WIGGLER |
| Mega Wiggler's Tree Party | tv_tag_team_angry | 63 | W_WIGGLER |
| Rainbow Galleria | baseline_party | 69 | W_GALLERIA |
| Rainbow Galleria | tv_tag_team | 69 | W_GALLERIA |
| Goomba Lagoon | baseline_party | 91 | W_LAGOON |
| Goomba Lagoon | tv_tag_team | 91 | W_LAGOON |
| Roll 'em Raceway | baseline_party | 78 | W_RACEWAY |
| Roll 'em Raceway | tv_tag_team | 78 | W_RACEWAY |
| King Bowser's Keep | baseline_party | 84 | W_KEEP |
| King Bowser's Keep | tv_tag_team | 84 | W_KEEP |
| Mario's Rainbow Castle | baseline_party | 51 | W_CASTLE |
| Mario's Rainbow Castle | tv_tag_team | 51 | W_CASTLE |
| Western Land | baseline_party | 104 | W_WESTERN |
| Western Land | tv_tag_team | 104 | W_WESTERN |

## Preserved source disagreements

- `mega-wiggler-tree-party:phases:anger` (conflict, low): {"trigger": "A bell produces its unpleasant sound during the second half of the match.", "effect": "Wiggler becomes angry; its back's Lucky spaces become Red and Blue spaces become Bowser. A later bell restores normal.", "probability": null} — W_WIGGLER-Q028, PT_BOARDS-Q001. Wiki and PocketTactics disagree on converted space types. No anger probability inferred.
- `rainbow-galleria:shop:0:item:4` (conflict, low): {"name": "Shop Hop Box", "coins": 6, "condition": {"inventoryPeriod": "before_update", "purchaseRaisesPrice": false, "conditionRulesScope": "profile_rules", "itemRulesRestriction": null}, "priceBasis": "reported_standard_shop_price"} — W_GALLERIA-Q015, GR_GALLERIA-Q002. Current wiki lists 6; GameRant lists 8. Value preserves the wiki report, alternatives retained.
- `rainbow-galleria:events:loadstone` (conflict, low): {"name": "Thrift Loadstone exception", "trigger": "Whomp chooses held Loadstone in Thrift event.", "effect": "Reported payout conflicts: wiki 20 versus GameRant 10.", "resolvedCoins": null, "alternativesCoins": [20, 10]} — W_GALLERIA-Q033, GR_GALLERIA-Q013. No silent resolution.
- `rainbow-galleria:phases:stamp_color_labels` (conflict, low): {"reportedWiki": ["blue", "red", "yellow", "green"], "reportedGameRant": ["blue", "pink", "orange", "green"], "resolvedColorNames": null} — W_GALLERIA-Q036, GR_GALLERIA-Q017. Same colored station art may be named differently; preserve labels instead of silently substituting.
- `rainbow-galleria:phases:peach_daisy` (conflict, low): {"trigger": "Buddy spawn selection on Galleria.", "effect": "Current wiki excludes Peach/Daisy; older GameRant guide describes Peach flash-sale combination.", "resolvedAvailability": null} — W_GALLERIA-Q044, GR_GALLERIA-Q020. Version/scope disagreement; current game build not observed.
- `goomba-lagoon:events:eruption` (conflict, low): {"name": "Volcano eruption", "trigger": "Pass the volcano eruption interaction.", "effect": "Erupt Golden Goombas or Lava Bubbles onto spaces, or no eruption. Passing Lava Bubble loses 3 coins; Gold Goomba payout unresolved.", "lavaLossCoins": 3, "goldCoins": null, "alternativesGoldCoins": [5, 3], "probabilities": null} — W_LAGOON-Q033, W_LAGOON-Q034, MPL_BOARDS-Q007. Preserve 5 vs 3; event trigger and probabilities have one complete detailed account.
- `goomba-lagoon:phases:tides` (conflict, low): {"trigger": "Reported automatic tide change, Tide Shell use, or tide Event Space.", "effect": "Low tide opens connecting paths; high tide isolates islands and submerges paths. Fixed automatic cadence is unresolved.", "automaticPeriodTurns": null, "reportedCadences": [{"sourceId": "N_AU", "text": "every turn"}, {"sourceId": "DS_BOARDS", "text": "every two turns"}, {"sourceId": "W_LAGOON", "text": "every few turns"}]} — W_LAGOON-Q035, N_AU-Q001, DS_BOARDS-Q001. Official marketing, DS and current wiki disagree on cadence; no schedule guessed.
- `king-bowser-keep:phases:unlock` (conflict, low): {"baseRequirement": {"achievementCount": 30, "rank": null, "alternate": "complete Party-Planner Trek and view credits"}, "tvDefaultReported": true, "rankAlternatives": ["Platinum", "Diamond"]} — W_KEEP-Q044, MPL_BOARDS-Q012, W_KEEP-Q045, N_AU-Q002. Current wiki saysPlatinum 30; MPL and freshly retrieved NintendoAU stillsayDiamond. Wiki reports an official error correction, but AU marketing currently retains the wording. TV default qualifier remains single-source.
- `mario-rainbow-castle:phases:shop_swap` (conflict, low): {"triggerReports": ["pass shop whether purchase or not", "purchase item"], "effect": "Koopa/Kamek shop swaps; exact trigger is unresolved.", "resolvedTrigger": null} — W_CASTLE-Q019, MPL_BOARDS-Q017. Preserve passing versus purchase-only disagreement.

## Unresolved interpretation and provenance

- Raceway generic shop-page singular wording initially appeared to clash with plural local wording. Reopening both normal/swapped diagrams shows one displayed host at a time; this is recorded as a single-source scope qualifier, not an invented factual contradiction.
- Wiggler’s PocketTactics lowercase “unlucky spaces” may be generic language rather than the named Unlucky tile; no literal tile substitution is inferred from it.
- DS “10 Coins per lap completed” can describe the incrementing lap reward ambiguously; it is not used as independent confirmation of the complete payout formula.
- DS Tower Turner “about 50%” is an approximation from one publisher, not a verified RNG weight. Wiki vault 1 in 81 similarly does not establish independent uniform passcode generation.
- Historical Castle 40 coin Ztar, Western 5 coin train/banks and historical EventSpace direction logic are not imported into current Jamboree. Current Steamer Event Space exact movement remains explicitly unknown.
- Wiggler’s second JPEG retrieval differs in bytes; both representations were reopened visually and regional observations agree. No origin-byte identity or installed game-version claim is made.
- All single-source rows, partial qualifier support, absent physical shop positions and exact numbered topology remain UNVERIFIED in VERIFY.md.

## Recovery evidence, 2026-10-07

- The earlier Wiggler map reopen returned 614,963 bytes with SHA-256 `06f746d3129df6d1afd0243a32a4afe538329f40fc19181f54f9fb567fe8610c`, followed by 185,497 bytes with SHA-256 `2f3b5f83b1b1fd1a68674227593086a8e48fb5249c96b96bcdeebddc276403f8`. That earlier representation difference remains preserved here and in commit a35e62d73139c7be43403f1c4efb98879e749227. This recovery fetched all ten original image URLs twice: each returned HTTP 200, all current A/B pairs are byte-identical, and the Wiggler pair uses the latter representation. The images were visually reviewed in both new passes. No installed-game or origin-version claim follows from identical bytes.
- The fresh credited GameRant guide closes only the complete Boo Shop event row. It does not establish Super Shop landing activation, exactly one raffle draw per purchase, stamp passing-only activation, or Buddy/rank stock qualifiers.
- Ice_Dragon14’s original post #10 independently closes Pro Homestretch. Its statement of two shop items for the entire game does not independently establish inventory sharing between shops with the same host; the composite stock row remains single-source.
- Bounded searches found no independent complete current type-count tables or numbered gate endpoints. Historical tables, copied Fandom content, fan fiction and apparently generated guides were excluded. A twice-opened NamuWiki English translation was retained privately as a rejected lead: its unattributed translated totals differ from the current detailed tables, and no clear build/ruleset provenance was recovered. It certifies no row in this delivery.
