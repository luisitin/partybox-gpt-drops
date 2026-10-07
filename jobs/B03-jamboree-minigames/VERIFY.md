# VERIFY — preliminary index only

Final B03 completion: **UNVERIFIED**. Passing results below validate the preliminary catalogue index and recorded list evidence, not complete per-game research. No final `minigames.json` or `minigames.csv` exists.

## Executed validation

Python 3; jsonschema 4.26.0; JSON Schema Draft 2020-12. Research comparisons are deterministic; seed is not applicable. Exact command from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json
```

| Test name | Cases | Passed | Seed | Exact command |
| --- | ---: | --- | --- | --- |
| Draft 2020-12 JSON Schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Successful TLS-preserving fresh retrieval records | 6 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Source count claims versus extracted rows and independent counts | 10 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Case/punctuation-insensitive duplicate checks | 620 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Fresh second-pass list rows and official count quote | 245 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| All preliminary rows tied to pass-two source names/categories | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Short verbatim source citations and locators | 530 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Source-set disagreements retained without spelling corrections | 5 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Legacy declared category totals versus table rows | 20 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |

Actual validator output:

```text
jsonschema 4.26.0 / Draft 2020-12
PASS Draft 2020-12 JSON Schema: 1 cases; seed=n/a
PASS Successful TLS-preserving fresh retrieval records: 6 cases; seed=n/a
PASS Source count claims versus extracted rows and independent counts: 10 cases; seed=n/a; 112 base on wiki and Legacy; 20 additions on wiki and Nintendo; wiki lists 132 combined. Independent full TV list remains missing.
PASS Case/punctuation-insensitive duplicate checks: 620 cases; seed=n/a
PASS Fresh second-pass list rows and official count quote: 245 cases; seed=n/a; 132 wiki rows and 112 Legacy rows reopened; 1 Nintendo count quote reopened. Index-only check.
PASS All preliminary rows tied to pass-two source names/categories: 132 cases; seed=n/a
PASS Short verbatim source citations and locators: 530 cases; seed=n/a
PASS Source-set disagreements retained without spelling corrections: 5 cases; seed=n/a; 110 normalized base-name matches; wiki-only base 2; Legacy-only base 2; wiki-only TV 20.
PASS Legacy declared category totals versus table rows: 20 cases; seed=n/a
UNVERIFIED: final per-game facts, independent complete TV list, two wiki list-page counts, final JSON/CSV/schema, full per-game second pass.
Job B03 complete=false. These passing checks validate the preliminary index only.
```

## Fresh retrieval commands and hashes

These were real requests to each source URL in pass 1 and then pass 2. Curl used its default certificate verification and inherited proxy configuration. Original page bodies are represented by their byte hashes and short extracted citations, rather than committed webpages. Wiki/Nintendo returned byte-identical cached bodies on both requests.

wiki pass1: 2026-10-07T15:34:53Z; HTTP 200; 200673 bytes; SHA256 `a38f52d833467bbfc4ac69ef853c1ea3646ce68178190d740fe46415bbaa134e`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-hcbwr_pp/source.html --write-out '%{http_code} %{url_effective}' https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames
```

wiki pass2: 2026-10-07T15:34:55Z; HTTP 200; 200673 bytes; SHA256 `a38f52d833467bbfc4ac69ef853c1ea3646ce68178190d740fe46415bbaa134e`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-mdsiv501/source.html --write-out '%{http_code} %{url_effective}' https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames
```

legacy pass1: 2026-10-07T15:34:53Z; HTTP 200; 138782 bytes; SHA256 `322a6ec826546e16332b6bdc2201b7d2895450cf591d1aea4d9106e12bb9b6c4`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-og_26op6/source.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables
```

legacy pass2: 2026-10-07T15:34:55Z; HTTP 200; 138782 bytes; SHA256 `efd9ee865453ba2505270202af0320c5f57d02198292a5a7d7e5db845a0f5291`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-x263lazs/source.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables
```

nintendo pass1: 2026-10-07T15:34:53Z; HTTP 200; 708001 bytes; SHA256 `faba7d2c2ca3e03a086ec8cc7c358b46dba741b8b88eff00802bb50bd6c1ba62`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-335gyfv6/source.html --write-out '%{http_code} %{url_effective}' https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/
```

nintendo pass2: 2026-10-07T15:34:55Z; HTTP 200; 708001 bytes; SHA256 `faba7d2c2ca3e03a086ec8cc7c358b46dba741b8b88eff00802bb50bd6c1ba62`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /tmp/b03-index-wauj19gw/source.html --write-out '%{http_code} %{url_effective}' https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/
```

## Per-row second-pass audit

Every wiki name/category pair was reparsed from the fresh pass-two URL request. All 112 Legacy names/category pairs were also reparsed; 110 match index rows, while the two source-only rows are logged separately below. “Verified” here refers only to those list labels, never the unresearched game mechanics.

| Index row | Wiki name | Edition | Wiki name/category pass 2 | Legacy name/category pass 2 |
| ---: | --- | --- | --- | --- |
| 1 | Lumber Tumble | base | verified | verified: Lumber Tumble |
| 2 | Big-Top Quiz | base | verified | verified: Big-Top Quiz |
| 3 | Camera-Ready | base | verified | verified: Camera-Ready |
| 4 | Scare-ousel | base | verified | verified: Scare-ousel |
| 5 | Snag the Flags | base | verified | verified: Snag the Flags |
| 6 | Sandwiched | base | verified | no independent normalized match; UNVERIFIED |
| 7 | Hot Cross Blocks | base | verified | verified: Hot Cross Blocks |
| 8 | Light-Wave Battle | base | verified | verified: Light-Wave Battle |
| 9 | Thwomp the Difference | base | verified | verified: Thwomp the Difference |
| 10 | Cold Front | base | verified | verified: Cold Front |
| 11 | Hot-Hot Hop | base | verified | verified: Hot-Hot Hop |
| 12 | Domination | base | verified | verified: Domination |
| 13 | Three Throw | base | verified | verified: Three Throw |
| 14 | Granite Getaway | base | verified | verified: Granite Getaway |
| 15 | Tilt-a-Golf | base | verified | verified: Tilt-a-Golf |
| 16 | Night Lights | base | verified | verified: Night Lights |
| 17 | Hammer It Home | base | verified | verified: Hammer It Home |
| 18 | Twist and Sort | base | verified | verified: Twist and Sort |
| 19 | Shuttle Scuttle | base | verified | verified: Shuttle Scuttle |
| 20 | Tiny Triathlon | base | verified | verified: Tiny Triathlon |
| 21 | Pickax Dash | base | verified | verified: Pickax Dash |
| 22 | Gate Key-pers | base | verified | verified: Gate Key-pers |
| 23 | Sled to the Edge | base | verified | verified: Sled to the Edge |
| 24 | Rinks to Riches | base | verified | verified: Rinks to Riches |
| 25 | Treetop Treasure | base | verified | verified: Treetop Treasure |
| 26 | Treasure Divers | base | verified | verified: Treasure Divers |
| 27 | Platform Peril | base | verified | verified: Platform Peril |
| 28 | Stamp Out! | base | verified | verified: Stamp Out! |
| 29 | Trample-line | base | verified | verified: Trample-line |
| 30 | Sunset Standoff | base | verified | verified: Sunset Standoff |
| 31 | Cookie Cutters | base | verified | verified: Cookie Cutters |
| 32 | Unfriendly Flying Object | base | verified | verified: Unfriendly Flying Object |
| 33 | Lost and Pound | base | verified | verified: Lost and Pound |
| 34 | Arch Rivals | base | verified | verified: Arch Rivals |
| 35 | On-Again, Off-Again | base | verified | verified: On-Again, Off-Again |
| 36 | Broozer Bash | base | verified | verified: Broozer Bash |
| 37 | Cage Catch | base | verified | verified: Cage Catch |
| 38 | Income Stream | base | verified | verified: Income Stream |
| 39 | Blame It on the Crane | base | verified | verified: Blame It on the Crane |
| 40 | Snow Brawl | base | verified | verified: Snow Brawl |
| 41 | Squeaky Shakedown | base | verified | no independent normalized match; UNVERIFIED |
| 42 | Rocky Rope Race | base | verified | verified: Rocky Rope Race |
| 43 | Pickin' Produce | base | verified | verified: Pickin’ Produce |
| 44 | Prime Cut | base | verified | verified: Prime Cut |
| 45 | Dorrie Pedal-Paddle | base | verified | verified: Dorrie Pedal-Paddle |
| 46 | Robo Arm Wrestle | base | verified | verified: Robo Arm Wrestle |
| 47 | Shadow Play | base | verified | verified: Shadow Play |
| 48 | Match Makers | base | verified | verified: Match Makers |
| 49 | Defuse or Lose | base | verified | verified: Defuse or Lose |
| 50 | Jump the Gun | base | verified | verified: Jump the Gun |
| 51 | Two-Axis Taxi | base | verified | verified: Two-Axis Taxi |
| 52 | Tricky Turntable | base | verified | verified: Tricky Turntable |
| 53 | Coin Corral | base | verified | verified: Coin Corral |
| 54 | Fast Fishing | base | verified | verified: Fast Fishing |
| 55 | Slappy-Go-Round | base | verified | verified: Slappy-Go-Round |
| 56 | Stone-Eye Bowling | base | verified | verified: Stone-Eye Bowling |
| 57 | Fuzzy Heights | base | verified | verified: Fuzzy Heights |
| 58 | All the Marbles | base | verified | verified: All the Marbles |
| 59 | Roll with It | base | verified | verified: Roll With It |
| 60 | Prize Line | base | verified | verified: Prize Line |
| 61 | A Stone's Throw | base | verified | verified: A Stone’s Throw |
| 62 | Flip 'n Find | base | verified | verified: Flip ‘n Find |
| 63 | Prize Drop | base | verified | verified: Prize Drop |
| 64 | Mario's Three-peat | base | verified | verified: Mario’s Three-peat |
| 65 | Luigi Rescue Operation | base | verified | verified: Luigi Rescue Operation |
| 66 | Peach's Day Off | base | verified | verified: Peach’s Day Off |
| 67 | Daisy's Field Day | base | verified | verified: Daisy’s Field Day |
| 68 | Wario's Buzzer Beater | base | verified | verified: Wario’s Buzzer Beater |
| 69 | Waluigi's Pinball Arcade | base | verified | verified: Waluigi’s Pinball Arcade |
| 70 | Yoshi's Mountain Race | base | verified | verified: Yoshi’s Mountain Race |
| 71 | Rosalina's Radical Race | base | verified | verified: Rosalina’s Radical Race |
| 72 | DK's Konga Line | base | verified | verified: DK’s Konga Line |
| 73 | Jr.'s Jauntlet | base | verified | verified: Jr.’s Jauntlet |
| 74 | Dragoneel Slayers | base | verified | verified: Dragoneel Slayers |
| 75 | Mega Stingby Stompers | base | verified | verified: Mega Stingby Stompers |
| 76 | Mega Rocky Wrench Wreckers | base | verified | verified: Mega Rocky Wrench Wreckers |
| 77 | Boss Sumo Bro Blitzers | base | verified | verified: Boss Sumo Bro Blitzers |
| 78 | Bowser Crashers | base | verified | verified: Bowser Crashers |
| 79 | Noggin Knock | base | verified | verified: Noggin Knock |
| 80 | Brick Breaker | base | verified | verified: Brick Breaker |
| 81 | Gold 'n Brown | base | verified | verified: Gold ‘n Brown |
| 82 | Spike's Gambit | base | verified | verified: Spike’s Gambit |
| 83 | Down the Hatch | base | verified | verified: Down the Hatch |
| 84 | Lane Change | base | verified | verified: Lane Change |
| 85 | Coin Conveyor | base | verified | verified: Coin Conveyor |
| 86 | Which Door Has More? | base | verified | verified: Which Door Has More? |
| 87 | Sky-High Cannons | base | verified | verified: Sky-High Cannons |
| 88 | Burning Bridges | base | verified | verified: Burning Bridges |
| 89 | Castle Hassle | base | verified | verified: Castle Hassle |
| 90 | Sleight of Shell | base | verified | verified: Sleight of Shell |
| 91 | Fire Away | base | verified | verified: Fire Away |
| 92 | The Floor Is Falling | base | verified | verified: The Floor Is Falling |
| 93 | Juiceworks | base | verified | verified: Juiceworks |
| 94 | Ball Volley | base | verified | verified: Ball Volley |
| 95 | Ballistic Bingo | base | verified | verified: Ballistic Bingo |
| 96 | Bath Bob-ombs | base | verified | verified: Bath Bob-ombs |
| 97 | Chomp Wash | base | verified | verified: Chomp Wash |
| 98 | Match! That! Item! | base | verified | verified: Match! That! Item! |
| 99 | Trading Cards | base | verified | verified: Trading Cards |
| 100 | Ski-daddle | base | verified | verified: Ski-daddle |
| 101 | Look This Way | base | verified | verified: Look This Way |
| 102 | Puzzle Pandemonium | base | verified | verified: Puzzle Pandemonium |
| 103 | Soup Troupe | base | verified | verified: Soup Troupe |
| 104 | Parfait the Course | base | verified | verified: Parfait the Course |
| 105 | Whisk Cream | base | verified | verified: Whisk Cream |
| 106 | Spread 'n Butter | base | verified | verified: Spread ‘n Butter |
| 107 | Short-Stack Chef | base | verified | verified: Short Stack Chef |
| 108 | Burger Builders | base | verified | verified: Burger Builders |
| 109 | Footlong Frenzy | base | verified | verified: Footlong Frenzy |
| 110 | Copycat Curry | base | verified | verified: Copycat Curry |
| 111 | En Barb! | base | verified | verified: En Barb! |
| 112 | On the Beet | base | verified | verified: On the Beet |
| 113 | Shell Hockey | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 114 | Bowser Filter | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 115 | Stuffie Stacker | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 116 | Pull-Back Attack | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 117 | Domino Effect | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 118 | Bob-omb Makeover | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 119 | Toad-ally Electric Escape | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 120 | Ice and Easy | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 121 | Bob-omb Toss | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 122 | Net Gains | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 123 | Get a Grip | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 124 | What's the Scoop? | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 125 | Knock-Knock Match | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 126 | Goomba Scoopas | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 127 | Talking Flower Says | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 128 | Hitting It Rich | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 129 | Goombalancing Act | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 130 | Bowser Chicken | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 131 | Speak Up, Junior! | jamboree_tv | verified | no independent normalized match; UNVERIFIED |
| 132 | Bowser Beats | jamboree_tv | verified | no independent normalized match; UNVERIFIED |

Legacy-only rows reopened in pass 2:

| Name | Category | Recheck |
| --- | --- | --- |
| Sandwhiched | Free-for-All Minigames | verified exact list name/category; identity disagreement unresolved |
| Squeaky Showdown | 1-vs-3 Minigames | verified exact list name/category; identity disagreement unresolved |

## UNVERIFIED

- Complete independent named TV list and per-entry categories. Nintendo’s count quotation does not cover these facts.
- Prompt-required total count agreement against two complete wiki lists, including Switch 2 additions.
- Resolution of `Sandwiched`/`Sandwhiched` and `Squeaky Shakedown`/`Squeaky Showdown`; sources remain separate.
- Format, time limit, controls, win/score/tie rules, coin/star rewards, two-sentence summary, phoneFit and rationale for all 132 index rows.
- Two independent sources for every final fact, all final confidence assessments, and the full per-game source reopening/audit.
- Final `minigames.json`, `minigames.csv` and final per-game JSON Schema validation. The supplied schema validates the preliminary index only.
- Any PR completion/check or KEEP GOING completion claim. This is an early research milestone.
- Single-source mode availability exclusions and mouse Co-op markers need independent corroboration before becoming final specifications.

## Integrity

`SHA256SUMS.txt` covers every delivered file except itself. Exact command from this job folder: `sha256sum -c SHA256SUMS.txt`. Hash checking establishes file integrity, not research completeness.
