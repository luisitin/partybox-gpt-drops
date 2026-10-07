# VERIFY — preliminary research only

Final B03 completion: **UNVERIFIED**. Passing checks validate the index, source retrieval records and focused evidence. No final `minigames.json` or `minigames.csv` exists.

## Executed index checks

Python 3.12; jsonschema 4.26.0; Draft 2020-12. All research comparisons are deterministic, seed n/a. Exact command from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json
```

| Test name | Cases | Passed | Seed | Exact command |
| --- | ---: | --- | --- | --- |
| Draft 2020-12 JSON Schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Expected HTTPS publishers, effective scopes, and distinct verified snapshots | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Counts versus two publisher catalogues and official additions count | 14 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Case/punctuation-insensitive duplicate and edition-overlap checks | 660 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Fresh second-pass list rows and all short source quotations | 275 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Every row and HTTPS game link bound to exact pass-two extraction | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Complete exact per-row citation multisets, without duplicates or substitutes | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Every archived/index quotation at most 25 words | 600 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Exact base/TV/combined source sets and spelling disagreements | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Reconstructed exact category-difference groups and membership | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |
| Independent base category and raw TV group count claims | 24 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-index.py --json-output jobs/B03-jamboree-minigames/verification-results.json` |

Actual validator output:

```text
jsonschema 4.26.0 / Draft 2020-12
PASS Draft 2020-12 JSON Schema: 1 cases; seed=n/a
PASS Expected HTTPS publishers, effective scopes, and distinct verified snapshots: 8 cases; seed=n/a; Stored page bytes checked when original outside-checkout snapshot files remain available.
PASS Counts versus two publisher catalogues and official additions count: 14 cases; seed=n/a; Wiki combined list:132; Legacy base112 + TV20:132. Nintendo additions20. Second wiki list page remains missing.
PASS Case/punctuation-insensitive duplicate and edition-overlap checks: 660 cases; seed=n/a
PASS Fresh second-pass list rows and all short source quotations: 275 cases; seed=n/a; 132 wiki +112 Legacy base +20 Legacy TV list rows; list labels/context only, never full game mechanics.
PASS Every row and HTTPS game link bound to exact pass-two extraction: 132 cases; seed=n/a
PASS Complete exact per-row citation multisets, without duplicates or substitutes: 132 cases; seed=n/a
PASS Every archived/index quotation at most 25 words: 600 cases; seed=n/a
PASS Exact base/TV/combined source sets and spelling disagreements: 8 cases; seed=n/a; Base intersection110; TV20; combined130. Two wiki-only and two Legacy-only base names preserved; TV sets identical.
PASS Reconstructed exact category-difference groups and membership: 8 cases; seed=n/a
PASS Independent base category and raw TV group count claims: 24 cases; seed=n/a
UNVERIFIED: final per-game facts, source category/availability conflicts, two wiki list-page counts, final JSON/CSV/schema, full per-game second pass.
Job B03 complete=false. Passing checks validate the preliminary index only.
```

## Validator regression checks

Independent review demonstrated four false-acceptance cases, then a fifth combined curl-option case. They are fixed. The committed before-fix reports record expected failures; they are not counted as passing tests. Six final cases pass: the unchanged baseline validates and all five isolated malformed inputs reject. No insecure network request was executed; the TLS case mutates only recorded command data.

Exact command:

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/check-validator-rejections.py --output jobs/B03-jamboree-minigames/validator-rejections.json
```

| Test | Cases | Passed | Seed | Evidence |
| --- | ---: | --- | --- | --- |
| Accepted baseline + five isolated rejection cases | 6 | yes | n/a | `validator-rejections.json`, source hashes included |

## Focused English-name checks

Historical evidence validates ten separately retained original response hashes before twenty quote-presence/length checks. A fresh root execution also passes twenty quote checks from ten successful requests with distinct response paths. This supports exact quotation presence; independence and semantic scope are reviewed separately. Only Sandwiched gains independent English-name corroboration. Neither Legacy identity linkage is accepted.

Exact root execution:

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/check-name-evidence.py --evidence jobs/B03-jamboree-minigames/name-evidence.json --output jobs/B03-jamboree-minigames/name-evidence-current-recheck.json
```

| Test | Cases | Passed | Seed | Evidence |
| --- | ---: | --- | --- | --- |
| Quote presence/length across five sources and two requests each | 20 | yes | n/a | `name-evidence-current-recheck.json` |
| Separate response paths, successful requests and byte hashes | 10 | yes | n/a | same report |

## Actual fresh list retrievals

Curl retained its default certificate verification and inherited proxy. Original page bytes are retained outside the checkout and represented here by short extracts and hashes. Snapshot hashes are checked when those retained files exist; after a fresh clone without them, recorded metadata/extract consistency alone cannot establish the original bytes. The collector can produce new distinct snapshots without overwriting the originals.

wiki pass1: 2026-10-07T15:59:30.205547Z; HTTP200; 200673 bytes; SHA256 `a38f52d833467bbfc4ac69ef853c1ea3646ce68178190d740fe46415bbaa134e`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass1/wiki.html --write-out '%{http_code} %{url_effective}' https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames
```

wiki pass2: 2026-10-07T15:59:31.335346Z; HTTP200; 200673 bytes; SHA256 `a38f52d833467bbfc4ac69ef853c1ea3646ce68178190d740fe46415bbaa134e`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass2/wiki.html --write-out '%{http_code} %{url_effective}' https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames
```

legacy pass1: 2026-10-07T15:59:30.206110Z; HTTP200; 138782 bytes; SHA256 `d4327873395fcaa86d4ca3e18c4f47c2dcdcc39b9f404b8562ef0677e79993d7`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass1/legacy.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables
```

legacy pass2: 2026-10-07T15:59:31.335253Z; HTTP200; 138782 bytes; SHA256 `c3ea68af3c2a852a37ba2c490982cb8ab61f35ca48bfde6eba5232c5f8768130`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass2/legacy.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables
```

legacyTv pass1: 2026-10-07T15:59:30.206587Z; HTTP200; 88132 bytes; SHA256 `32278c21f1c8a5bb80fa8929bd8de50ea10b6eb83acdb6966d533741a0f44381`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass1/legacyTv.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/
```

legacyTv pass2: 2026-10-07T15:59:31.336053Z; HTTP200; 88132 bytes; SHA256 `27c34793a46264a2c3179b88a3763517a64e4442a2c685d7331087a91181ed89`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass2/legacyTv.html --write-out '%{http_code} %{url_effective}' https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/
```

nintendo pass1: 2026-10-07T15:59:30.207225Z; HTTP200; 708005 bytes; SHA256 `260211938de49aa52e8267fec821034cc23108e9137abcce792e3ec63bf51881`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass1/nintendo.html --write-out '%{http_code} %{url_effective}' https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/
```

nintendo pass2: 2026-10-07T15:59:31.336538Z; HTTP200; 708005 bytes; SHA256 `260211938de49aa52e8267fec821034cc23108e9137abcce792e3ec63bf51881`.

```bash
curl --fail --silent --show-error --location --connect-timeout 10 --max-time 45 --output /workspace/b03-tv-research/confirmed-snapshots/pass2/nintendo.html --write-out '%{http_code} %{url_effective}' https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/
```

## Per-row list-label second pass

All 132 wiki rows,112 Legacy base rows and20 Legacy TV rows were reparsed from later requests. The audit below is for list names/raw headings, never detailed mechanics.

| Row | Wiki name | Edition | Wiki name/category pass two | Legacy name/category pass two |
| ---: | --- | --- | --- | --- |
| 1 | Lumber Tumble | base | verified | verified (legacy): Lumber Tumble |
| 2 | Big-Top Quiz | base | verified | verified (legacy): Big-Top Quiz |
| 3 | Camera-Ready | base | verified | verified (legacy): Camera-Ready |
| 4 | Scare-ousel | base | verified | verified (legacy): Scare-ousel |
| 5 | Snag the Flags | base | verified | verified (legacy): Snag the Flags |
| 6 | Sandwiched | base | verified | no normalized match; identity UNVERIFIED |
| 7 | Hot Cross Blocks | base | verified | verified (legacy): Hot Cross Blocks |
| 8 | Light-Wave Battle | base | verified | verified (legacy): Light-Wave Battle |
| 9 | Thwomp the Difference | base | verified | verified (legacy): Thwomp the Difference |
| 10 | Cold Front | base | verified | verified (legacy): Cold Front |
| 11 | Hot-Hot Hop | base | verified | verified (legacy): Hot-Hot Hop |
| 12 | Domination | base | verified | verified (legacy): Domination |
| 13 | Three Throw | base | verified | verified (legacy): Three Throw |
| 14 | Granite Getaway | base | verified | verified (legacy): Granite Getaway |
| 15 | Tilt-a-Golf | base | verified | verified (legacy): Tilt-a-Golf |
| 16 | Night Lights | base | verified | verified (legacy): Night Lights |
| 17 | Hammer It Home | base | verified | verified (legacy): Hammer It Home |
| 18 | Twist and Sort | base | verified | verified (legacy): Twist and Sort |
| 19 | Shuttle Scuttle | base | verified | verified (legacy): Shuttle Scuttle |
| 20 | Tiny Triathlon | base | verified | verified (legacy): Tiny Triathlon |
| 21 | Pickax Dash | base | verified | verified (legacy): Pickax Dash |
| 22 | Gate Key-pers | base | verified | verified (legacy): Gate Key-pers |
| 23 | Sled to the Edge | base | verified | verified (legacy): Sled to the Edge |
| 24 | Rinks to Riches | base | verified | verified (legacy): Rinks to Riches |
| 25 | Treetop Treasure | base | verified | verified (legacy): Treetop Treasure |
| 26 | Treasure Divers | base | verified | verified (legacy): Treasure Divers |
| 27 | Platform Peril | base | verified | verified (legacy): Platform Peril |
| 28 | Stamp Out! | base | verified | verified (legacy): Stamp Out! |
| 29 | Trample-line | base | verified | verified (legacy): Trample-line |
| 30 | Sunset Standoff | base | verified | verified (legacy): Sunset Standoff |
| 31 | Cookie Cutters | base | verified | verified (legacy): Cookie Cutters |
| 32 | Unfriendly Flying Object | base | verified | verified (legacy): Unfriendly Flying Object |
| 33 | Lost and Pound | base | verified | verified (legacy): Lost and Pound |
| 34 | Arch Rivals | base | verified | verified (legacy): Arch Rivals |
| 35 | On-Again, Off-Again | base | verified | verified (legacy): On-Again, Off-Again |
| 36 | Broozer Bash | base | verified | verified (legacy): Broozer Bash |
| 37 | Cage Catch | base | verified | verified (legacy): Cage Catch |
| 38 | Income Stream | base | verified | verified (legacy): Income Stream |
| 39 | Blame It on the Crane | base | verified | verified (legacy): Blame It on the Crane |
| 40 | Snow Brawl | base | verified | verified (legacy): Snow Brawl |
| 41 | Squeaky Shakedown | base | verified | no normalized match; identity UNVERIFIED |
| 42 | Rocky Rope Race | base | verified | verified (legacy): Rocky Rope Race |
| 43 | Pickin' Produce | base | verified | verified (legacy): Pickin’ Produce |
| 44 | Prime Cut | base | verified | verified (legacy): Prime Cut |
| 45 | Dorrie Pedal-Paddle | base | verified | verified (legacy): Dorrie Pedal-Paddle |
| 46 | Robo Arm Wrestle | base | verified | verified (legacy): Robo Arm Wrestle |
| 47 | Shadow Play | base | verified | verified (legacy): Shadow Play |
| 48 | Match Makers | base | verified | verified (legacy): Match Makers |
| 49 | Defuse or Lose | base | verified | verified (legacy): Defuse or Lose |
| 50 | Jump the Gun | base | verified | verified (legacy): Jump the Gun |
| 51 | Two-Axis Taxi | base | verified | verified (legacy): Two-Axis Taxi |
| 52 | Tricky Turntable | base | verified | verified (legacy): Tricky Turntable |
| 53 | Coin Corral | base | verified | verified (legacy): Coin Corral |
| 54 | Fast Fishing | base | verified | verified (legacy): Fast Fishing |
| 55 | Slappy-Go-Round | base | verified | verified (legacy): Slappy-Go-Round |
| 56 | Stone-Eye Bowling | base | verified | verified (legacy): Stone-Eye Bowling |
| 57 | Fuzzy Heights | base | verified | verified (legacy): Fuzzy Heights |
| 58 | All the Marbles | base | verified | verified (legacy): All the Marbles |
| 59 | Roll with It | base | verified | verified (legacy): Roll With It |
| 60 | Prize Line | base | verified | verified (legacy): Prize Line |
| 61 | A Stone's Throw | base | verified | verified (legacy): A Stone’s Throw |
| 62 | Flip 'n Find | base | verified | verified (legacy): Flip ‘n Find |
| 63 | Prize Drop | base | verified | verified (legacy): Prize Drop |
| 64 | Mario's Three-peat | base | verified | verified (legacy): Mario’s Three-peat |
| 65 | Luigi Rescue Operation | base | verified | verified (legacy): Luigi Rescue Operation |
| 66 | Peach's Day Off | base | verified | verified (legacy): Peach’s Day Off |
| 67 | Daisy's Field Day | base | verified | verified (legacy): Daisy’s Field Day |
| 68 | Wario's Buzzer Beater | base | verified | verified (legacy): Wario’s Buzzer Beater |
| 69 | Waluigi's Pinball Arcade | base | verified | verified (legacy): Waluigi’s Pinball Arcade |
| 70 | Yoshi's Mountain Race | base | verified | verified (legacy): Yoshi’s Mountain Race |
| 71 | Rosalina's Radical Race | base | verified | verified (legacy): Rosalina’s Radical Race |
| 72 | DK's Konga Line | base | verified | verified (legacy): DK’s Konga Line |
| 73 | Jr.'s Jauntlet | base | verified | verified (legacy): Jr.’s Jauntlet |
| 74 | Dragoneel Slayers | base | verified | verified (legacy): Dragoneel Slayers |
| 75 | Mega Stingby Stompers | base | verified | verified (legacy): Mega Stingby Stompers |
| 76 | Mega Rocky Wrench Wreckers | base | verified | verified (legacy): Mega Rocky Wrench Wreckers |
| 77 | Boss Sumo Bro Blitzers | base | verified | verified (legacy): Boss Sumo Bro Blitzers |
| 78 | Bowser Crashers | base | verified | verified (legacy): Bowser Crashers |
| 79 | Noggin Knock | base | verified | verified (legacy): Noggin Knock |
| 80 | Brick Breaker | base | verified | verified (legacy): Brick Breaker |
| 81 | Gold 'n Brown | base | verified | verified (legacy): Gold ‘n Brown |
| 82 | Spike's Gambit | base | verified | verified (legacy): Spike’s Gambit |
| 83 | Down the Hatch | base | verified | verified (legacy): Down the Hatch |
| 84 | Lane Change | base | verified | verified (legacy): Lane Change |
| 85 | Coin Conveyor | base | verified | verified (legacy): Coin Conveyor |
| 86 | Which Door Has More? | base | verified | verified (legacy): Which Door Has More? |
| 87 | Sky-High Cannons | base | verified | verified (legacy): Sky-High Cannons |
| 88 | Burning Bridges | base | verified | verified (legacy): Burning Bridges |
| 89 | Castle Hassle | base | verified | verified (legacy): Castle Hassle |
| 90 | Sleight of Shell | base | verified | verified (legacy): Sleight of Shell |
| 91 | Fire Away | base | verified | verified (legacy): Fire Away |
| 92 | The Floor Is Falling | base | verified | verified (legacy): The Floor Is Falling |
| 93 | Juiceworks | base | verified | verified (legacy): Juiceworks |
| 94 | Ball Volley | base | verified | verified (legacy): Ball Volley |
| 95 | Ballistic Bingo | base | verified | verified (legacy): Ballistic Bingo |
| 96 | Bath Bob-ombs | base | verified | verified (legacy): Bath Bob-ombs |
| 97 | Chomp Wash | base | verified | verified (legacy): Chomp Wash |
| 98 | Match! That! Item! | base | verified | verified (legacy): Match! That! Item! |
| 99 | Trading Cards | base | verified | verified (legacy): Trading Cards |
| 100 | Ski-daddle | base | verified | verified (legacy): Ski-daddle |
| 101 | Look This Way | base | verified | verified (legacy): Look This Way |
| 102 | Puzzle Pandemonium | base | verified | verified (legacy): Puzzle Pandemonium |
| 103 | Soup Troupe | base | verified | verified (legacy): Soup Troupe |
| 104 | Parfait the Course | base | verified | verified (legacy): Parfait the Course |
| 105 | Whisk Cream | base | verified | verified (legacy): Whisk Cream |
| 106 | Spread 'n Butter | base | verified | verified (legacy): Spread ‘n Butter |
| 107 | Short-Stack Chef | base | verified | verified (legacy): Short Stack Chef |
| 108 | Burger Builders | base | verified | verified (legacy): Burger Builders |
| 109 | Footlong Frenzy | base | verified | verified (legacy): Footlong Frenzy |
| 110 | Copycat Curry | base | verified | verified (legacy): Copycat Curry |
| 111 | En Barb! | base | verified | verified (legacy): En Barb! |
| 112 | On the Beet | base | verified | verified (legacy): On the Beet |
| 113 | Shell Hockey | jamboree_tv | verified | verified (legacyTv): Shell Hockey |
| 114 | Bowser Filter | jamboree_tv | verified | verified (legacyTv): Bowser Filter |
| 115 | Stuffie Stacker | jamboree_tv | verified | verified (legacyTv): Stuffie Stacker |
| 116 | Pull-Back Attack | jamboree_tv | verified | verified (legacyTv): Pull-Back Attack |
| 117 | Domino Effect | jamboree_tv | verified | verified (legacyTv): Domino Effect |
| 118 | Bob-omb Makeover | jamboree_tv | verified | verified (legacyTv): Bob-omb Makeover |
| 119 | Toad-ally Electric Escape | jamboree_tv | verified | verified (legacyTv): Toad-ally Electric Escape |
| 120 | Ice and Easy | jamboree_tv | verified | verified (legacyTv): Ice and Easy |
| 121 | Bob-omb Toss | jamboree_tv | verified | verified (legacyTv): Bob-omb Toss |
| 122 | Net Gains | jamboree_tv | verified | verified (legacyTv): Net Gains |
| 123 | Get a Grip | jamboree_tv | verified | verified (legacyTv): Get a Grip |
| 124 | What's the Scoop? | jamboree_tv | verified | verified (legacyTv): What’s the Scoop? |
| 125 | Knock-Knock Match | jamboree_tv | verified | verified (legacyTv): Knock-Knock Match |
| 126 | Goomba Scoopas | jamboree_tv | verified | verified (legacyTv): Goomba Scoopas |
| 127 | Talking Flower Says | jamboree_tv | verified | verified (legacyTv): Talking Flower Says |
| 128 | Hitting It Rich | jamboree_tv | verified | verified (legacyTv): Hitting It Rich |
| 129 | Goombalancing Act | jamboree_tv | verified | verified (legacyTv): Goombalancing Act |
| 130 | Bowser Chicken | jamboree_tv | verified | verified (legacyTv): Bowser Chicken |
| 131 | Speak Up, Junior! | jamboree_tv | verified | verified (legacyTv): Speak Up, Junior! |
| 132 | Bowser Beats | jamboree_tv | verified | verified (legacyTv): Bowser Beats |

Legacy-only base rows reopened: **Sandwhiched** (Free-for-All) and **Squeaky Showdown** (1-vs-3). Their exact labels are retained; their identity linkages remain unverified. No source-only TV row remains.

## UNVERIFIED

- Prompt-required second complete wiki list page and its combined count. Legacy is an independent publisher, not a second wiki.
- Final per-game format, time limit, controls, win/score/tie rules, coin/star rewards, two-sentence summaries, phoneFit scores and rationales for all 132 rows. Preliminary category headings do not complete these fields.
- Independent sources for every final gameplay fact, all final confidence assessments and the full per-game fact second pass.
- Identity linkage for Sandwiched/Sandwhiched and Squeaky Shakedown/Squeaky Showdown; independent English Squeaky Shakedown corroboration. Sandwiched spelling itself now has wiki/Destructoid support.
- Category interpretations and conflicting Pull-Back Attack four-player availability.
- Final minigames.json, minigames.csv and final per-game JSON Schema validation. The supplied schema validates the preliminary index only.
- Completion PR and KEEP GOING completion gate. This remains a research milestone.

## Integrity

SHA256SUMS.txt covers every delivered file except itself. From this job folder run `sha256sum -c SHA256SUMS.txt`. Integrity checking does not establish research completeness.

## Preliminary gameplay evidence checks

All 132 actual game URLs returned article content in both fresh HTTPS passes. The following executed checks bind compact quotations to the retained raw captures. Every mechanics lead remains **UNVERIFIED, one source family**. Schema/evidence integrity does not complete final fields, independence, summaries or phoneFit.

Exact capture-bound command from the repository root (original raw captures must still exist):

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research
```

| Test | Cases | Passed | Seed | Exact command |
| --- | ---: | --- | --- | --- |
| json_schema | 1 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| unique_index_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| index_bound_rows | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| short_quotes | 987 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| field_reference_lists | 1056 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| source_pass_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| https_url_tls_hash_byte_records | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| raw_capture_hashes | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| quotes_located_in_capture_sections | 1974 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| fresh_pass_extraction_comparisons | 264 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| ordered_pass_timestamps | 132 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| returning_game_scoped_quotes | 84 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |
| coverage_totals | 8 | yes | n/a | `PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /workspace/b03-gameplay-research` |

Actual validator output, scope and case counters (field coverage is in the full committed report):

```json
{
  "passed": true,
  "scope": "Preliminary evidence integrity only; final B03 research remains UNVERIFIED.",
  "caseCounts": {
    "json_schema": 1,
    "unique_index_rows": 132,
    "index_bound_rows": 132,
    "short_quotes": 987,
    "field_reference_lists": 1056,
    "source_pass_records": 264,
    "https_url_tls_hash_byte_records": 264,
    "raw_capture_hashes": 264,
    "quotes_located_in_capture_sections": 1974,
    "fresh_pass_extraction_comparisons": 264,
    "ordered_pass_timestamps": 132,
    "returning_game_scoped_quotes": 84,
    "coverage_totals": 8
  }
}
```

Exact guard-suite command:

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/.partybox-python/bin/python jobs/B03-jamboree-minigames/test-gameplay-evidence.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --snapshots /workspace/b03-gameplay-research
```

The unchanged compact baseline and a new external output directory validate; **18** deliberately invalid cases reject. The raw-capture preflight validates **264** records. Actual `networkRequests` is **0**. This report is `gameplay-guard-validation-results.json`. Without `--snapshots`, sixteen invalid cases execute and raw-capture cases do not execute. They must not be counted as run.

| Candidate field | Rows with a lead | TV rows with a lead |
| --- | ---: | ---: |
| controls | 132 | 20 |
| winRules | 82 | 19 |
| scoreRules | 57 | 11 |
| timeLimit | 30 | 5 |
| tieRules | 22 | 4 |
| coinReward | 10 | 1 |
| starReward | 0 | 0 |
| gameplay | 132 | 20 |

Quoted timer mentions can describe a round or component; coin mentions can describe an internal game/mode payout. They do not establish a whole-game timer or a universal Party-mode award. No star-reward lead exists; absent evidence is not a zero reward. `GAMEPLAY-RESEARCH.md` documents ten returning-game scope exclusions and all remaining limitations.

The full original retrieval commands and raw webpages are outside the checkout. To make a new independent retrieval run, use `collect-gameplay.py` with a new external output directory as shown in the research notes. To validate committed metadata/schema alone, omit `--snapshots`; that does not execute raw-byte/location comparisons.
