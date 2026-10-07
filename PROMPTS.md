# ChatGPT batch 2026-10-07: 20 small, triple-verified jobs
Repo: https://github.com/luisitin/partybox-gpt-drops (public, Actions on). R = Deep research / Agent mode; C = Thinking with code (Agent mode if it should push itself). Each prompt is self-contained.

## B01 Jamboree dice blocks + exact odds (R+C)

```
Job B01: Jamboree dice blocks + exact odds. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Research Super Mario Party Jamboree (Switch 2024, plus Jamboree TV on Switch 2): every character's dice block (all faces, incl. coin faces like +2 or -2 coins), the normal Dice Block, Double Dice, Triple Dice, Custom Dice Block and any other dice items, and how coin faces count for movement. Then compute exact odds as fractions (not floats) for one roll of every die and for Double/Triple Dice with every die, including any doubles/triples coin bonus. Deliver dice.json (cited research), odds.json (exact fractions), odds.ts (pure lookup).

Tests: exhaustive enumeration of every combination; 10,000,000 seeded Monte Carlo rolls per die and per combo, every outcome within 4 standard deviations; every distribution sums to exactly 1.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B01.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B01-jamboree-dice, put every file in jobs/B01-jamboree-dice/, open a pull request to main titled "B01 Jamboree dice blocks + exact odds". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B02 Board movement odds engine (C)

```
Job B02: Board movement odds engine. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write boardOdds.ts. Input: a board graph {nodes:[{id, kind, next:[ids], passThrough:boolean}]} where pass-through nodes (shop, star, gate) don't use a step and nodes with several next ids are branch choices; a die distribution (face -> exact fraction); a branch policy ('uniform' or 'toward target' by shortest path, ties uniform). Output: exact landing distribution from every start node (BigInt rationals) and expected passes over each pass-through node.

Tests: brute-force path enumeration on 2,000 random graphs up to 25 nodes, every face, identical results; 500 graphs with cycles; sums exactly 1; 1,000,000 seeded simulated rolls on 50 graphs within 4 standard deviations; dead ends, self-loops and unreachable nodes never throw.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B02.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B02-board-odds, put every file in jobs/B02-board-odds/, open a pull request to main titled "B02 Board movement odds engine". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B03 Every Jamboree minigame, catalogued (R)

```
Job B03: Every Jamboree minigame, catalogued. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Catalogue every minigame in Super Mario Party Jamboree and Jamboree TV (Switch 2 additions included). Per minigame: English name, category (free-for-all, 1v3, 2v2, duel, team, bonus/other: name the real category), format, time limit, controls (buttons/motion), win/score/tie rules, coin/star reward, a 2-sentence summary of what players do, and phoneFit 1-5 (how well it would work on a phone touch screen, with one sentence why). Deliver minigames.json + minigames.csv. Your total count must match the count on at least 2 sources (wiki list pages); list any minigame present on one list but not the other in CONFLICTS.md.

Tests: count check vs 2 lists; every row has every field; no duplicate names (case/punctuation-insensitive); 100% of rows re-checked in pass 2.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B03-jamboree-minigames, put every file in jobs/B03-jamboree-minigames/, open a pull request to main titled "B03 Every Jamboree minigame, catalogued". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B04 All Jamboree boards, space by space (R)

```
Job B04: All Jamboree boards, space by space. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

For each of the 7 Jamboree boards (Mega Wiggler's Tree Party, Rainbow Galleria, Goomba Lagoon, Roll 'em Raceway, King Bowser's Keep, Mario's Rainbow Castle, Western Land, check the list yourself): space counts by type, how the Star moves/costs, shops (where, what they sell, prices), gates/keys/paid paths, events and board gimmicks (every one, with trigger and effect), day/night or phase changes, Homestretch/Last 5 Turns events, and anything Jamboree TV changed. Deliver boards.json + one boards/<board>.md each, plus a cited map description (which spaces connect to which, as best sources allow; mark any guessed link UNVERIFIED).

Tests: per-board space-type totals match at least 2 sources or go to CONFLICTS.md; every event has a trigger + effect + source; pass 2 re-checks 100%.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B04-jamboree-boards, put every file in jobs/B04-jamboree-boards/, open a pull request to main titled "B04 All Jamboree boards, space by space". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B05 Turn flow, exact strings, bonus stars (R)

```
Job B05: Turn flow, exact strings, bonus stars. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write the full Jamboree party timeline: game start (order rolls, intro), one player turn step by step (item use, roll, moving, passing spaces, branch choice, landing), end of round, minigame selection, Last 5 Turns event (every possible effect), the ending and every Bonus Star (name, exact criterion, tie rule, how many are given, how they are chosen). Quote the exact English on-screen strings and who says them (host/announcer) wherever a source has them (video timestamps count as a source: URL + mm:ss). Deliver turnflow.md (timeline), strings.json ({id, speaker, text, when, source}) and bonusStars.json.

Tests: every string has a source; every bonus star criterion confirmed by 2 sources; pass 2 re-checks 100%.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B05-jamboree-turn-flow, put every file in jobs/B05-jamboree-turn-flow/, open a pull request to main titled "B05 Turn flow, exact strings, bonus stars". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B06 Jamboree CPU behaviour + cpuPolicy.ts (R+C)

```
Job B06: Jamboree CPU behaviour + cpuPolicy.ts. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Research how Jamboree CPUs behave per difficulty (Easy/Normal/Hard/Master or the real names): branch choices, item use, shop buys, star buying, ally/buddy use, minigame skill. Then write cpuPolicy.ts: pure functions chooseBranch, chooseItem, chooseShopBuy, buyStar(state, difficulty, rng) over a small documented state type you define. Deliver research.md (cited), cpuPolicy.ts, types.ts.

Tests: 20 hand-written scenario tests per decision function with the expected choice explained; 100,000 random legal states per function, every answer legal and never throws; Easy vs Hard over 10,000 simulated mini-games of a toy board you include: Hard wins at least 65% (report the exact rate).

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B06.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B06-cpu-policy, put every file in jobs/B06-cpu-policy/, open a pull request to main titled "B06 Jamboree CPU behaviour + cpuPolicy.ts". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B07 Yahtzee exact optimal solver (C)

```
Job B07: Yahtzee exact optimal solver. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write yahtzeeOpt.ts: the exact solitaire Yahtzee optimal strategy (official rules incl. upper bonus 35 at 63 and Yahtzee bonus 100 + joker rules). Expose expectedValue() which must equal 254.5896 (to 4 decimals), bestHold(dice, rollsLeft, scorecard) and bestCategory(dice, scorecard). Ship the solved state table as compact binary/JSON (each file at most 30 MB) plus the generator.

Tests: EV 254.5896 from both implementations; brute force on 50,000 random mid-game states agrees exactly; 1,000,000 seeded simulated games average within 4 standard errors of the EV; scoring function checked on all 7,776 ordered dice x 13 categories against an independent scorer.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B07.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B07-yahtzee-optimal, put every file in jobs/B07-yahtzee-optimal/, open a pull request to main titled "B07 Yahtzee exact optimal solver". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B08 Monopoly exact landing odds + ROI (C)

```
Job B08: Monopoly exact landing odds + ROI. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write monopolyOdds.ts: the exact Markov chain for US Monopoly (40 squares, 2d6, doubles, three doubles to jail, Chance/Community Chest card moves at the official deck odds, jail strategies 'leave ASAP' and 'stay max'). Output long-run landing probabilities per square for both strategies and, for every property, rent ROI and break-even turns per house level (official US rents/costs; cite the rent table).

Tests: two solvers (power iteration and linear solve) agree within 1e-12; results match at least 2 published tables within 1e-4 (cite them; any gap goes in CONFLICTS.md); 100,000,000 seeded simulated rolls within 4 standard deviations per square; probabilities sum to 1 within 1e-12.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B08.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B08-monopoly-markov, put every file in jobs/B08-monopoly-markov/, open a pull request to main titled "B08 Monopoly exact landing odds + ROI". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B09 Clue exact deduction engine (C)

```
Job B09: Clue exact deduction engine. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write clueSolver.ts: from a game log (who suggested what, who showed/couldn't show, my own hand, cards shown to me) compute the exact probability that each card is in the envelope and in each hand, by counting consistent deals (no heuristics). Classic Clue: 6 suspects, 6 weapons, 9 rooms, 3-6 players.

Tests: brute force on a reduced deck (3/3/4 cards, 3 players) across 20,000 random logs, identical exact fractions; 5,000 full simulated games: the envelope is never assigned probability 0; at most 200 ms per update for 6 players (report p50/p99); contradictory logs return an error value, never throw.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B09.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B09-clue-solver, put every file in jobs/B09-clue-solver/, open a pull request to main titled "B09 Clue exact deduction engine". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B10 Battleship probability-density AI (C)

```
Job B10: Battleship probability-density AI. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write battleshipAI.ts: Easy (random with hunt), Medium (hunt/target parity), Hard (exact or sampled probability density over all legal placements consistent with hits/misses/sunk). Classic 10x10 board, ships 5,4,3,3,2.

Tests: on 6x6 with small fleets, the exact density from full enumeration matches the AI's density on 10,000 random states; 100,000 games per difficulty against random placements: report mean/median shots (Hard must average under 45 on 10x10, report exactly); never fires twice at a cell; at most 50 ms per shot.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B10.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B10-battleship-ai, put every file in jobs/B10-battleship-ai/, open a pull request to main titled "B10 Battleship probability-density AI". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B11 Rummikub validator + best play (C)

```
Job B11: Rummikub validator + best play. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write rummikub.ts: validate a table (runs and groups, 2 jokers, official rules incl. 30-point initial meld) and find the play that lays down the most tile value from a hand, allowing full table rearrangement.

Tests: brute force on 50,000 small cases (at most 14 tiles total) gives the same best value; 40 hand-written joker edge cases; never returns an invalid table (validator re-check on every output); at most 500 ms on a 40-tile table + 20-tile hand (report p99).

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B11.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B11-rummikub-solver, put every file in jobs/B11-rummikub-solver/, open a pull request to main titled "B11 Rummikub validator + best play". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B12 Ticket to Ride USA data + longest path (R+C)

```
Job B12: Ticket to Ride USA data + longest path. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Research the official Ticket to Ride (USA) map: every city, every route (length, color, double routes), all 30 destination tickets (+ USA 1910 tickets as a separate list), card counts, scoring table. Then write ttr.ts: route-claim legality, ticket completion check, exact longest continuous path (edges used once, nodes reusable).

Tests: city/route/ticket counts match 2 sources (78 routes incl. doubles? check, don't assume); route-length totals cross-checked; longest path brute force on 20,000 random small graphs (at most 12 edges) identical; 2,000 random full games scored by two independent implementations, identical.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B12.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B12-ttr-usa, put every file in jobs/B12-ttr-usa/, open a pull request to main titled "B12 Ticket to Ride USA data + longest path". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B13 1,000 verified trivia questions (R)

```
Job B13: 1,000 verified trivia questions. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write 1,000 multiple-choice trivia questions for an adult party (US audience): 10 categories x 100, 4 options each, difficulty 1-3 balanced. Each: question, correct answer, 3 plausible wrong answers, a 1-line fun fact, category, difficulty, 2 sources (URL + quote). No questions whose answer changes over time unless dated "as of 2025".

Tests: adversarial second pass: a fresh pass tries to prove each answer wrong (log result per row); near-duplicate scan (normalized text similarity over 0.8 flagged and resolved); correct-answer index balanced 25% plus/minus 2% per position; no option repeated inside a question; length of correct answer not systematically longest (report mean length per position).

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B13-trivia-1000, put every file in jobs/B13-trivia-1000/, open a pull request to main titled "B13 1,000 verified trivia questions". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B14 600 comedy prompts + 600 "most likely to" (R)

```
Job B14: 600 comedy prompts + 600 "most likely to". Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write 600 fill-in-the-blank comedy prompts (Quiplash style) and 600 "Who's most likely to..." prompts for adult friends at a party. The humor that lands with this group: it makes perfect sense on first read AND it is outrageous or a bit morbid, AND it leans on household names (brands, celebrities, TV shows, chains everyone knows). Random non sequiturs are NOT funny to them. Each prompt is at most 90 characters. Write 1,500 of each, then grade each 1-5 against that rubric with a one-line reason, keep only grade 4+ (best 600 each).

Tests: length check on all; duplicate/near-duplicate scan (similarity over 0.75 flagged); a second, independent grading pass, and keep only prompts both passes graded 4+ (report agreement rate); no slurs, nothing about minors; at most 3 prompts per named brand/person.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B14-comedy-prompts, put every file in jobs/B14-comedy-prompts/, open a pull request to main titled "B14 600 comedy prompts + 600 "most likely to"". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B15 120 original SVG game icons (C)

```
Job B15: 120 original SVG game icons. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Draw 120 original SVG icons for party-game UI (dice, coin, star, crown, timer, mic, vote, skip, trophy, card back, heart, bomb, shop bag, key, lock, gift, arrow set, etc.; full list in your README). Rules: viewBox 0 0 64 64, at most 1,500 bytes each after minifying, at most 6 colors, a consistent chunky friendly style, readable at 24 px, no text, no traced or copied art.

Tests: validate every file as XML/SVG; rasterize each at 24, 48 and 256 px (show the PNGs); pairwise silhouette IoU under 0.8 for all 7,140 pairs (report the max pair); contact sheet on 5 backgrounds (white, black, mid-grey, saturated blue, saturated yellow); byte and color limits checked by script.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B15.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B15-icons-120, put every file in jobs/B15-icons-120/, open a pull request to main titled "B15 120 original SVG game icons". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B16 12 accessible player colors (C)

```
Job B16: 12 accessible player colors. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Pick 12 player colors (with names) for a party game on TV and phones. Rules: first 8 pairwise CIEDE2000 at least 20; all 12 pairwise at least 12, also under Machado 2009 protan, deutan and tritan simulation (severity 1.0); each color has a text color (black or white) at WCAG contrast 4.5 or more; each also works as a fill on a dark (#121218) and light (#F7F5F0) background (contrast 3 or more).

Tests: your CIEDE2000 implementation must pass all 34 test pairs from Sharma et al. 2005 to 4 decimals; a second independent implementation agrees; Machado matrices cited; full pairwise tables in the delivery; swatch sheet PNG under each simulation.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B16.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B16-player-colors, put every file in jobs/B16-player-colors/, open a pull request to main titled "B16 12 accessible player colors". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B17 40 original synthesized sound effects (C)

```
Job B17: 40 original synthesized sound effects. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Synthesize 40 original UI/game SFX from code (no samples): coin, star get, dice roll, dice stop, step, buzzer, ding, whoosh, pop, countdown tick, final tick, win fanfare (short), lose, item use, shop open, vote, reveal, timer warning, etc. (full list in README). WAV 48 kHz 16-bit mono, 0.05-3 s each.

Tests: integrated loudness -16 LUFS plus/minus 0.5 (EBU R128/BS.1770-4, show your meter passes the EBU tech 3341 test signals you can build); true peak at most -1.5 dBTP (4x oversampled); DC offset under 0.001; no clicks at start/end (first/last 5 ms fade, check by script); regenerating from the code gives byte-identical files; a spectrogram PNG per sound.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B17.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B17-sfx-40, put every file in jobs/B17-sfx-40/, open a pull request to main titled "B17 40 original synthesized sound effects". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B18 Tiny spring + easing library (C)

```
Job B18: Tiny spring + easing library. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write motion.ts (at most 1.2 KB gzipped, zero deps): damped spring (mass, stiffness, damping) with closed-form solution for under/critically/over-damped cases, settle-time estimate, and cubic-bezier easing (CSS-equivalent, Newton + bisection).

Tests: 10,000 random springs: closed form vs RK4 at dt 1e-4, max error under 1e-6; 1,000,000 bezier points vs a high-precision reference under 1e-7; matches the CSS named easings (ease, ease-in, ease-out, ease-in-out) to 1e-7; never NaN/Infinity for any finite input incl. zero mass guarded; gzip size printed.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B18.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B18-motion-ts, put every file in jobs/B18-motion-ts/, open a pull request to main titled "B18 Tiny spring + easing library". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B19 Player-name filter (C)

```
Job B19: Player-name filter. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

Write nameFilter.ts (at most 6 KB gzipped): blocks slurs and sexual terms in player names (max 16 chars) including obfuscations (leetspeak, repeated letters, inserted spaces/dots, homoglyphs, reversed), while letting real names through.

Tests: 5,000 generated obfuscations of the blocked list, all blocked (report misses = 0); false positives: 20,000 most common US first/last names (census lists), 10,000 common English words and 2,000 place names all pass (report every false positive; target 0, explain any kept); Scunthorpe-style cases listed; at most 0.05 ms per check.

CODE CHECKS: two independent implementations written without looking at each other, diffed on every test case; every suite runs 3 times (seeds 1, 2, 3); plant 25 deliberate bugs one at a time and show the tests catch all 25 (list them); TypeScript strict, zero runtime dependencies, pure functions, no Math.random or Date.now (randomness comes in as a seeded rng function); include package.json with one `npm test` command that runs everything. Add .github/workflows/B19.yml (rules in the repo README) so GitHub Actions reruns the full suite on your pull request, and link the green run.

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B19-name-filter, put every file in jobs/B19-name-filter/, open a pull request to main titled "B19 Player-name filter". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```

## B20 Every other Jamboree mode, buildable specs (R)

```
Job B20: Every other Jamboree mode, buildable specs. Be extremely aggressive about verification: belt and suspenders, small but impossible to get wrong.

For every Jamboree mode beyond the basic party (Pro Rules, Koopathlon, Bowser Kaboom Squad, Paratroopa Flight School, Toad's Item Factory, Rhythm Kitchen, Bowser Live / Jamboree TV modes, Jamboree Buddies, any others): exact rules, players, length, flow step by step, scoring, rewards, unlocks, and a buildable spec (phases, timers, inputs, end conditions) a programmer could implement for phones + one TV. Deliver modes.json + one modes/<mode>.md each.

Tests: mode list matches 2 sources; every rule has a source; every spec has phases with exit conditions (no phase without a way out); pass 2 re-checks 100%.

RESEARCH CHECKS: every fact has 2 independent sources (URL + quote of 25 words or less) listed in SOURCES.md; disagreements go in CONFLICTS.md, never silently resolved; a confidence level (high/medium/low) per row; a second full pass re-opens every source and re-checks 100% of rows (log per row in VERIFY.md); data as JSON + a JSON Schema, validated (paste the validator output).

DELIVERY (GitHub): read https://github.com/luisitin/partybox-gpt-drops README first. Create branch job/B20-jamboree-modes, put every file in jobs/B20-jamboree-modes/, open a pull request to main titled "B20 Every other Jamboree mode, buildable specs". Never push to main or touch other folders. Each file at most 30 MB (split into -part1, -part2... + JOIN.md if bigger). Include README.md (what is here, how to rerun), VERIFY.md (every test: name, case count, passed, seed, exact command) and SHA256SUMS.txt. Anything not verified goes under UNVERIFIED in VERIFY.md, never guessed. If you cannot push to GitHub, give me the same folder as .zip downloads of at most 30 MB each instead.
```
