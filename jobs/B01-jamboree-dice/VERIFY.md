# B01 verification record
## Result
Final local command: `cd jobs/B01-jamboree-dice && npm test`. Exit code **0**. **30/30 suites passed**, seeds **1,2,3**. **29 models**, **85,777 ordered tuples per pass**, **257,331 ordered tuple comparisons across all three passes**, **870,000,000 Monte Carlo trials**, **25/25 mutations killed per pass (75/75 in total)**. Each pass checked **1,196 joint/marginal Monte Carlo bins** and **612 exact joint rows**.
Research is **PARTIAL**. These execution results prove agreement with the explicit conditional models, not that all Nintendo behavior has been independently verified. No green CI run is asserted by this local report; the actual run URL and conclusion must be checked on the PR.
## UNVERIFIED
The two-independent-source gate is NOT fully met. Fact statuses: {'two-source': 21, 'single-source': 10, 'conflict': 1, 'unknown': 1, 'assumption': 1}. The affected IDs are F05, F07, F09, F11, F16, F22, F25, F28, F30, F31, F32, F33, F34.
- Matching rewards for Double, Triple, Payday variants, Turbo and Together lack a second independent confirmation. They are labeled reported, not silently asserted as certified. Together team-member accounting was not observed.
- F32: equal outcome weights, independence and the actual Nintendo RNG were not reverse-engineered or tested from a hardware roll dataset. Monte Carlo tests the supplied xoshiro sampler and model only. Confidence fields concern rule evidence, not proof of RNG fairness.
- TV carried-over item availability is documented; exact parity of every matching reward and interaction is not independently tested. Per-character aliases describe the documented standard die, not a hardware test of 22 characters in both editions.
- Ticket total/additional wording and quantity probabilities remain unresolved. Luigi activation and the conditional nonactivation distribution remain unknown. Custom + Double/Triple stacking is not fabricated. Other Mario/item compositions are conditional combinations, not all separately observed.
- The original production and Python reference were authored together. A separate context has now authored and sealed an additional TypeScript reference before production access (`tests/blind/AUTHORING.md`); its 41 self-check assertions passed. Integration and the new complete run are in progress; original recorded results below remain historical until replaced.
- All 26 source URLs were attempted on the second pass. **25 were retrieved successfully; S23 failed** with a web error and Exa timeout. S23 is rejected mirror evidence anyway. S18 required an Exa full fetch after web HTTP 403. Some first-pass entries were search excerpts, so this is not falsely described as two full successful page downloads for every source.
- An exhaustive all-modes capture audit, minigame dice props, starting-order/tie-break procedures, unrelated buddy coin income, item-acquisition probabilities, net purchase economics, inventory lifecycle, coin caps and character/buddy eligibility combinations were not certified.
- A passing four-sigma test is not a proof that every possible future seed passes. Seeds 1,2,3 were fixed in advance; none was replaced after a statistical failure. Do not reroll a failing seed to manufacture green CI.
- Source independence is assessed from provenance; independently authored web pages are not necessarily independent controlled gameplay experiments. The short quotes are locators, not full archived pages. No source content hash or screenshot archive is supplied.
## Test log: every suite, every seed
Case counts use the units described by each suite: TypeScript source files, JSON documents, semantic record groups, ordered tuples, exact joint rows, lookup cases, literal goldens, RNG checks, mutants and statistical bins. Auxiliary assertions are not misrepresented as independent test cases. Full machine-readable summary is `reports/verification.json`; the test command regenerates full per-bin observations in `.test-output/`.
| Seed | Test | Cases | Passed | Exact invocation / suite selector |
|---|---|---:|---|---|
| 1 | typescript-strict | 3 | YES | `tsc -p tsconfig.json` |
| 1 | json-schema | 2 | YES | `python3 tests/validate.py 1` |
| 1 | semantic-references | 111 | YES | `npm test → semantic-references (all seeds; no isolated-seed flag)` |
| 1 | exhaustive-A-B | 85,777 | YES | `npm test → exhaustive-A-B (all seeds; no isolated-seed flag)` |
| 1 | exact-invariants | 612 | YES | `npm test → exact-invariants (all seeds; no isolated-seed flag)` |
| 1 | lookup-boundaries | 2,194 | YES | `npm test → lookup-boundaries (all seeds; no isolated-seed flag)` |
| 1 | literal-goldens | 19 | YES | `npm test → literal-goldens (all seeds; no isolated-seed flag)` |
| 1 | seeded-rng | 1,009 | YES | `npm test → seeded-rng (all seeds; no isolated-seed flag)` |
| 1 | mutation-testing | 25 | YES | `npm test → mutation-testing (all seeds; no isolated-seed flag)` |
| 1 | monte-carlo | 1,196 | YES | `npm test → monte-carlo (all seeds; no isolated-seed flag)` |
| 2 | typescript-strict | 3 | YES | `tsc -p tsconfig.json` |
| 2 | json-schema | 2 | YES | `python3 tests/validate.py 2` |
| 2 | semantic-references | 111 | YES | `npm test → semantic-references (all seeds; no isolated-seed flag)` |
| 2 | exhaustive-A-B | 85,777 | YES | `npm test → exhaustive-A-B (all seeds; no isolated-seed flag)` |
| 2 | exact-invariants | 612 | YES | `npm test → exact-invariants (all seeds; no isolated-seed flag)` |
| 2 | lookup-boundaries | 2,194 | YES | `npm test → lookup-boundaries (all seeds; no isolated-seed flag)` |
| 2 | literal-goldens | 19 | YES | `npm test → literal-goldens (all seeds; no isolated-seed flag)` |
| 2 | seeded-rng | 1,009 | YES | `npm test → seeded-rng (all seeds; no isolated-seed flag)` |
| 2 | mutation-testing | 25 | YES | `npm test → mutation-testing (all seeds; no isolated-seed flag)` |
| 2 | monte-carlo | 1,196 | YES | `npm test → monte-carlo (all seeds; no isolated-seed flag)` |
| 3 | typescript-strict | 3 | YES | `tsc -p tsconfig.json` |
| 3 | json-schema | 2 | YES | `python3 tests/validate.py 3` |
| 3 | semantic-references | 111 | YES | `npm test → semantic-references (all seeds; no isolated-seed flag)` |
| 3 | exhaustive-A-B | 85,777 | YES | `npm test → exhaustive-A-B (all seeds; no isolated-seed flag)` |
| 3 | exact-invariants | 612 | YES | `npm test → exact-invariants (all seeds; no isolated-seed flag)` |
| 3 | lookup-boundaries | 2,194 | YES | `npm test → lookup-boundaries (all seeds; no isolated-seed flag)` |
| 3 | literal-goldens | 19 | YES | `npm test → literal-goldens (all seeds; no isolated-seed flag)` |
| 3 | seeded-rng | 1,009 | YES | `npm test → seeded-rng (all seeds; no isolated-seed flag)` |
| 3 | mutation-testing | 25 | YES | `npm test → mutation-testing (all seeds; no isolated-seed flag)` |
| 3 | monte-carlo | 1,196 | YES | `npm test → monte-carlo (all seeds; no isolated-seed flag)` |

## JSON Schema validator output (actual stdout)
```text
dice.json: VALID
odds.json: VALID
Draft 2020-12: schema valid; documents=2; errors=0; seed=1
```
```text
dice.json: VALID
odds.json: VALID
Draft 2020-12: schema valid; documents=2; errors=0; seed=2
```
```text
dice.json: VALID
odds.json: VALID
Draft 2020-12: schema valid; documents=2; errors=0; seed=3
```
## Monte Carlo: per model and seed
Each row is 10,000,000 complete rolls. The maximum tested squared z statistic is shown as an exact fraction. The acceptance bound is 16. Every joint movement/reward bin and every known marginal was checked; these are outcome bins, not a claim to run separate four-sigma tests on all individual ordered tuples.
| Seed | Model | Trials | Bins | Maximum z² | Passed |
|---|---|---:|---:|---|---|
| 1 | normal | 10,000,000 | 21 | 264062500/90000000 | YES |
| 1 | double | 10,000,000 | 48 | 4455562500/490000000 | YES |
| 1 | triple | 10,000,000 | 67 | 55696000000/9990000000 | YES |
| 1 | payday-double | 10,000,000 | 69 | 2970250000/990000000 | YES |
| 1 | payday-triple | 10,000,000 | 97 | 143641000000/21690000000 | YES |
| 1 | turbo | 10,000,000 | 85 | 3071256250000/520590000000 | YES |
| 1 | together | 10,000,000 | 38 | 4323062500/1410000000 | YES |
| 1 | creepy | 10,000,000 | 7 | 2067844/20000000 | YES |
| 1 | mushroom | 10,000,000 | 21 | 276224400/90000000 | YES |
| 1 | mario-extra | 10,000,000 | 13 | 267387904/50000000 | YES |
| 1 | custom-1 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-2 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-3 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-4 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-5 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-6 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-7 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-8 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-9 | 10,000,000 | 3 | 0/1 | YES |
| 1 | custom-10 | 10,000,000 | 3 | 0/1 | YES |
| 1 | mario-normal | 10,000,000 | 31 | 935748100/90000000 | YES |
| 1 | mario-double | 10,000,000 | 72 | 9682560000/1990000000 | YES |
| 1 | mario-triple | 10,000,000 | 106 | 226576000000/29990000000 | YES |
| 1 | mario-payday-double | 10,000,000 | 103 | 30625000000/5990000000 | YES |
| 1 | mario-payday-triple | 10,000,000 | 161 | 3489424000000/426590000000 | YES |
| 1 | mario-turbo | 10,000,000 | 131 | 470542864000000/84479990000000 | YES |
| 1 | mario-creepy | 10,000,000 | 17 | 73685056/50000000 | YES |
| 1 | mario-mushroom | 10,000,000 | 31 | 327972100/90000000 | YES |
| 1 | together-reported-bonus | 10,000,000 | 48 | 3579030625/460000000 | YES |
| 2 | normal | 10,000,000 | 21 | 450712900/90000000 | YES |
| 2 | double | 10,000,000 | 48 | 1652422500/240000000 | YES |
| 2 | triple | 10,000,000 | 67 | 54756000000/9990000000 | YES |
| 2 | payday-double | 10,000,000 | 69 | 4389062500/460000000 | YES |
| 2 | payday-triple | 10,000,000 | 97 | 970225000000/205590000000 | YES |
| 2 | turbo | 10,000,000 | 85 | 2924100000000/520590000000 | YES |
| 2 | together | 10,000,000 | 38 | 1772410000/490000000 | YES |
| 2 | creepy | 10,000,000 | 7 | 20921476/20000000 | YES |
| 2 | mushroom | 10,000,000 | 21 | 236544400/90000000 | YES |
| 2 | mario-extra | 10,000,000 | 13 | 63552784/50000000 | YES |
| 2 | custom-1 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-2 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-3 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-4 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-5 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-6 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-7 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-8 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-9 | 10,000,000 | 3 | 0/1 | YES |
| 2 | custom-10 | 10,000,000 | 3 | 0/1 | YES |
| 2 | mario-normal | 10,000,000 | 31 | 116424100/90000000 | YES |
| 2 | mario-double | 10,000,000 | 72 | 14065960000/1990000000 | YES |
| 2 | mario-triple | 10,000,000 | 106 | 7430440000/990000000 | YES |
| 2 | mario-payday-double | 10,000,000 | 103 | 1444000000/190000000 | YES |
| 2 | mario-payday-triple | 10,000,000 | 161 | 270400000000/29990000000 | YES |
| 2 | mario-turbo | 10,000,000 | 131 | 4851122500000000/504166310000000 | YES |
| 2 | mario-creepy | 10,000,000 | 17 | 136656100/50000000 | YES |
| 2 | mario-mushroom | 10,000,000 | 31 | 644144400/190000000 | YES |
| 2 | together-reported-bonus | 10,000,000 | 48 | 6107422500/490000000 | YES |
| 3 | normal | 10,000,000 | 21 | 204776100/90000000 | YES |
| 3 | double | 10,000,000 | 48 | 1628122500/240000000 | YES |
| 3 | triple | 10,000,000 | 67 | 1138489000000/205590000000 | YES |
| 3 | payday-double | 10,000,000 | 69 | 8308322500/1410000000 | YES |
| 3 | payday-triple | 10,000,000 | 97 | 19488160000/5910000000 | YES |
| 3 | turbo | 10,000,000 | 85 | 6515256250000/520590000000 | YES |
| 3 | together | 10,000,000 | 38 | 583705600/90000000 | YES |
| 3 | creepy | 10,000,000 | 7 | 76457536/20000000 | YES |
| 3 | mushroom | 10,000,000 | 21 | 543356100/90000000 | YES |
| 3 | mario-extra | 10,000,000 | 13 | 16630084/50000000 | YES |
| 3 | custom-1 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-2 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-3 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-4 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-5 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-6 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-7 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-8 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-9 | 10,000,000 | 3 | 0/1 | YES |
| 3 | custom-10 | 10,000,000 | 3 | 0/1 | YES |
| 3 | mario-normal | 10,000,000 | 31 | 2021401600/590000000 | YES |
| 3 | mario-double | 10,000,000 | 72 | 76176000000/13510000000 | YES |
| 3 | mario-triple | 10,000,000 | 106 | 3667225000000/426590000000 | YES |
| 3 | mario-payday-double | 10,000,000 | 103 | 113164960000/24310000000 | YES |
| 3 | mario-payday-triple | 10,000,000 | 161 | 3444736000000/532710000000 | YES |
| 3 | mario-turbo | 10,000,000 | 131 | 3610000000000/599990000000 | YES |
| 3 | mario-creepy | 10,000,000 | 17 | 356152384/80000000 | YES |
| 3 | mario-mushroom | 10,000,000 | 31 | 1048464400/140000000 | YES |
| 3 | together-reported-bonus | 10,000,000 | 48 | 2751002500/490000000 | YES |

## Deliberate bugs: 25 distinct source mutations
The pristine implementation passed before mutation testing. Each mutant was compiled separately with exactly one replacement; compile failures do not count as a kill. A counterexample against the Python distribution killed each mutant. Each was restored by loading the pristine source for the next mutation. All 25 were tested in every seed run.
| ID | Deliberate bug | First failing model | Seeds killed |
|---|---|---|---|
| M01 | Movement starts one too high | normal | 1, 2, 3 |
| M02 | Movement ignores final die | normal | 1, 2, 3 |
| M03 | Movement subtracts mushroom | mushroom | 1, 2, 3 |
| M04 | Any pair awards triple bonus | triple | 1, 2, 3 |
| M05 | Buddy must also match | mario-double | 1, 2, 3 |
| M06 | Disable double matching | double | 1, 2, 3 |
| M07 | Sevens receive ordinary bonus | triple | 1, 2, 3 |
| M08 | Every match receives sevens bonus | triple | 1, 2, 3 |
| M09 | Double sevens use old 30 reward | double | 1, 2, 3 |
| M10 | Add ordinary and special triple rewards | double | 1, 2, 3 |
| M11 | Payday loses roll coins | payday-double | 1, 2, 3 |
| M12 | Payday pays first die only | payday-double | 1, 2, 3 |
| M13 | Everyone receives Payday coins | normal | 1, 2, 3 |
| M14 | Unknown coin reward silently zero | together | 1, 2, 3 |
| M15 | Subtract matching bonus | double | 1, 2, 3 |
| M16 | Double matching reward only nine | double | 1, 2, 3 |
| M17 | Ordinary triple bonus wrong | triple | 1, 2, 3 |
| M18 | Turbo ordinary bonus wrong | turbo | 1, 2, 3 |
| M19 | Turbo sevens reward wrong | turbo | 1, 2, 3 |
| M20 | Double the buddy addend | mario-extra | 1, 2, 3 |
| M21 | Enumeration omits smallest face | normal | 1, 2, 3 |
| M22 | Enumeration counts every tuple twice | normal | 1, 2, 3 |
| M23 | Wrong sample-space denominator | normal | 1, 2, 3 |
| M24 | Fractions not reduced | normal | 1, 2, 3 |
| M25 | Expected movement one high | normal | 1, 2, 3 |

## Source second pass: every registered URL
The following IDs are retrieval trace identifiers from this task, not invented independent publications. URL and quote are in SOURCES.md and dice.json. A failed retrieval stays failed.
| Source | First retrieval | Second pass | Result |
|---|---|---|---|
| S01 | turn428442view0 | turn623746view1 | RETRIEVED |
| S02 | turn428442view1 | turn623746view2; expanded turn909794view2 | RETRIEVED |
| S03 | turn445734view2 | turn423534view1 | RETRIEVED |
| S04 | turn804362search8 | turn621310view0 | RETRIEVED |
| S05 | turn295705view0 | turn623746view3 | RETRIEVED |
| S06 | turn445734view1 | turn621310view1; expanded turn909794view3 | RETRIEVED |
| S07 | turn723713search0 | turn621310view2; expanded turn909794view0 | RETRIEVED |
| S08 | turn723713search3 | turn621310view3; expanded turn909794view1 | RETRIEVED |
| S09 | turn723713search1 | turn830415view0 | RETRIEVED |
| S10 | turn295705view1 | turn830415view1; expanded turn909794view4 | RETRIEVED |
| S11 | turn956974search2 | turn423534view3 | RETRIEVED |
| S12 | turn295705view2 | turn830415view2; expanded turn909794view5 | RETRIEVED |
| S13 | turn295705view3 | turn830415view3; expanded turn909794view6 | RETRIEVED |
| S14 | turn445734view0 | turn830415view4 | RETRIEVED |
| S15 | turn428442view2 | turn308817view0 | RETRIEVED |
| S16 | turn445734view3 | turn308817view1 | RETRIEVED |
| S17 | turn444636search17 | turn308817view2; reconfirmed turn394677view2 | RETRIEVED |
| S18 | turn804362search1 | web HTTP403; Exa full fetch succeeded 2026-10-06 | RETRIEVED |
| S19 | turn444636search3 | turn423534view2; reconfirmed turn412326view1 | RETRIEVED |
| S20 | turn444636search4 | turn899409view0 | RETRIEVED |
| S21 | turn804362search7 | turn899409view1 | RETRIEVED |
| S22 | turn723713search10 | turn899409view2; expanded turn909794view7 | RETRIEVED |
| S23 | turn723713search8 | FAILED: web internal error and Exa live-crawl timeout | FAILED |
| S24 | Exa search 2 | turn899409view4 | RETRIEVED |
| S25 | turn423534view0 | turn394677view0 | RETRIEVED |
| S26 | turn394677view1 | turn412326view0 | RETRIEVED |

## Per-row research recheck
All fact, character, die-face, item, compatibility and model rows are logged below. The expanded per-row reopening references are in `reports/research-row-audit.json`. RECHECKED means the row was reviewed against the cited sections; it does not mean missing independent support was found. A PARTIAL gate remains a failure of the requested two-source standard. The model assumption F32 necessarily makes random model rows partial.
| Row | Fact dependencies | Confidence | Rechecked | Research gate |
|---|---|---|---|---|
| facts/F01 | F01 | high | YES | PASS |
| facts/F02 | F02 | high | YES | PASS |
| facts/F03 | F03 | high | YES | PASS |
| facts/F04 | F04 | high | YES | PASS |
| facts/F05 | F05 | medium | YES | PARTIAL |
| facts/F06 | F06 | high | YES | PASS |
| facts/F07 | F07 | medium | YES | PARTIAL |
| facts/F08 | F08 | high | YES | PASS |
| facts/F09 | F09 | medium | YES | PARTIAL |
| facts/F10 | F10 | high | YES | PASS |
| facts/F11 | F11 | medium | YES | PARTIAL |
| facts/F12 | F12 | high | YES | PASS |
| facts/F13 | F13 | high | YES | PASS |
| facts/F14 | F14 | high | YES | PASS |
| facts/F15 | F15 | high | YES | PASS |
| facts/F16 | F16 | medium | YES | PARTIAL |
| facts/F17 | F17 | high | YES | PASS |
| facts/F18 | F18 | high | YES | PASS |
| facts/F19 | F19 | high | YES | PASS |
| facts/F20 | F20 | high | YES | PASS |
| facts/F21 | F21 | high | YES | PASS |
| facts/F22 | F22 | medium | YES | PARTIAL |
| facts/F23 | F23 | high | YES | PASS |
| facts/F24 | F24 | high | YES | PASS |
| facts/F25 | F25 | medium | YES | PARTIAL |
| facts/F26 | F26 | high | YES | PASS |
| facts/F27 | F27 | high | YES | PASS |
| facts/F28 | F28 | medium | YES | PARTIAL |
| facts/F29 | F29 | high | YES | PASS |
| facts/F30 | F30 | low | YES | PARTIAL |
| facts/F31 | F31 | medium | YES | PARTIAL |
| facts/F32 | F32 | low | YES | PARTIAL |
| facts/F33 | F33 | medium | YES | PARTIAL |
| facts/F34 | F34 | medium | YES | PARTIAL |
| characters/mario | F01,F02,F03 | high | YES | PASS |
| characters/luigi | F01,F02,F03 | high | YES | PASS |
| characters/peach | F01,F02,F03 | high | YES | PASS |
| characters/daisy | F01,F02,F03 | high | YES | PASS |
| characters/wario | F01,F02,F03 | high | YES | PASS |
| characters/waluigi | F01,F02,F03 | high | YES | PASS |
| characters/yoshi | F01,F02,F03 | high | YES | PASS |
| characters/rosalina | F01,F02,F03 | high | YES | PASS |
| characters/bowser | F01,F02,F03 | high | YES | PASS |
| characters/goomba | F01,F02,F03 | high | YES | PASS |
| characters/shy-guy | F01,F02,F03 | high | YES | PASS |
| characters/koopa-troopa | F01,F02,F03 | high | YES | PASS |
| characters/monty-mole | F01,F02,F03 | high | YES | PASS |
| characters/bowser-jr | F01,F02,F03 | high | YES | PASS |
| characters/boo | F01,F02,F03 | high | YES | PASS |
| characters/spike | F01,F02,F03 | high | YES | PASS |
| characters/donkey-kong | F01,F02,F03 | high | YES | PASS |
| characters/birdo | F01,F02,F03 | high | YES | PASS |
| characters/toad | F01,F02,F03 | high | YES | PASS |
| characters/toadette | F01,F02,F03 | high | YES | PASS |
| characters/ninji | F01,F02,F03 | high | YES | PASS |
| characters/pauline | F01,F02,F03 | high | YES | PASS |
| dice/normal/face/1 | F02,F03 | high | YES | PASS |
| dice/normal/face/2 | F02,F03 | high | YES | PASS |
| dice/normal/face/3 | F02,F03 | high | YES | PASS |
| dice/normal/face/4 | F02,F03 | high | YES | PASS |
| dice/normal/face/5 | F02,F03 | high | YES | PASS |
| dice/normal/face/6 | F02,F03 | high | YES | PASS |
| dice/normal/face/7 | F02,F03 | high | YES | PASS |
| dice/normal/face/8 | F02,F03 | high | YES | PASS |
| dice/normal/face/9 | F02,F03 | high | YES | PASS |
| dice/normal/face/10 | F02,F03 | high | YES | PASS |
| dice/creepy/face/1 | F13,F14 | high | YES | PASS |
| dice/creepy/face/2 | F13,F14 | high | YES | PASS |
| dice/creepy/face/3 | F13,F14 | high | YES | PASS |
| dice/mario-extra/face/3 | F27 | medium | YES | PASS |
| dice/mario-extra/face/4 | F27 | medium | YES | PASS |
| dice/mario-extra/face/5 | F27 | medium | YES | PASS |
| dice/mario-extra/face/6 | F27 | medium | YES | PASS |
| dice/mario-extra/face/7 | F27 | medium | YES | PASS |
| dice/mario-extra/face/8 | F27 | medium | YES | PASS |
| items/double-dice | F04,F05 | medium | YES | PARTIAL |
| items/triple-dice | F06,F07 | medium | YES | PARTIAL |
| items/custom-dice-block | F12,F31 | medium | YES | PARTIAL |
| items/payday-double-dice | F08,F09 | medium | YES | PARTIAL |
| items/payday-triple-dice | F10,F11 | medium | YES | PARTIAL |
| items/creepy-dice-block | F13,F19 | high | YES | PASS |
| items/super-creepy-dice | F14,F19 | high | YES | PASS |
| items/creepy-dice-block-tickets | F15,F16 | medium | YES | PARTIAL |
| items/mushroom | F17,F19 | high | YES | PASS |
| items/mushroom-tickets | F18,F16 | medium | YES | PARTIAL |
| items/turbo-dice | F20,F21,F22 | medium | YES | PARTIAL |
| items/together-dice | F23,F24,F25 | medium | YES | PARTIAL |
| compatibility/0 | F02,F04,F06 | high | YES | PASS |
| compatibility/1 | F19 | high | YES | PASS |
| compatibility/2 | F27 | high | YES | PASS |
| compatibility/3 | F12 | high | YES | PASS |
| models/normal | F02,F03,F32 | high | YES | PARTIAL |
| models/double | F04,F05,F32 | medium | YES | PARTIAL |
| models/triple | F06,F07,F32 | medium | YES | PARTIAL |
| models/payday-double | F08,F09,F32 | medium | YES | PARTIAL |
| models/payday-triple | F10,F11,F32 | medium | YES | PARTIAL |
| models/turbo | F20,F21,F22,F32 | medium | YES | PARTIAL |
| models/together | F23,F24,F25,F32 | medium | YES | PARTIAL |
| models/creepy | F13,F32 | high | YES | PARTIAL |
| models/mushroom | F17,F32 | high | YES | PARTIAL |
| models/mario-extra | F27,F32 | medium | YES | PARTIAL |
| models/custom-1 | F12 | high | YES | PASS |
| models/custom-2 | F12 | high | YES | PASS |
| models/custom-3 | F12 | high | YES | PASS |
| models/custom-4 | F12 | high | YES | PASS |
| models/custom-5 | F12 | high | YES | PASS |
| models/custom-6 | F12 | high | YES | PASS |
| models/custom-7 | F12 | high | YES | PASS |
| models/custom-8 | F12 | high | YES | PASS |
| models/custom-9 | F12 | high | YES | PASS |
| models/custom-10 | F12 | high | YES | PASS |
| models/mario-normal | F02,F03,F32,F27 | medium | YES | PARTIAL |
| models/mario-double | F04,F05,F32,F27 | medium | YES | PARTIAL |
| models/mario-triple | F06,F07,F32,F27 | medium | YES | PARTIAL |
| models/mario-payday-double | F08,F09,F32,F27,F28 | medium | YES | PARTIAL |
| models/mario-payday-triple | F10,F11,F32,F27,F28 | medium | YES | PARTIAL |
| models/mario-turbo | F20,F21,F22,F32,F27 | medium | YES | PARTIAL |
| models/mario-creepy | F13,F32,F27 | medium | YES | PARTIAL |
| models/mario-mushroom | F17,F32,F27 | medium | YES | PARTIAL |
| models/together-reported-bonus | F23,F24,F25,F32 | medium | YES | PARTIAL |

## Exact-odds recheck: complete coverage
Every ordered tuple and every joint row in `odds.json` was compared by implementations A and B, for seeds 1,2,3. The full outcome values and per-model confidence are in `odds.json`; this table identifies the exact coverage rather than duplicating those values. All listed rows passed arithmetic checks, not independent hardware verification. Command: `npm test`, suites `exhaustive-A-B` and `exact-invariants`.

| Model | Ordered tuples per seed | Joint rows per seed | Seeds | Passed | Rule confidence |
|---|---:|---:|---|---|---|
| normal | 10 | 10 | 1,2,3 | YES | high |
| double | 100 | 27 | 1,2,3 | YES | medium |
| triple | 1000 | 36 | 1,2,3 | YES | medium |
| payday-double | 100 | 27 | 1,2,3 | YES | medium |
| payday-triple | 1000 | 36 | 1,2,3 | YES | medium |
| turbo | 10000 | 45 | 1,2,3 | YES | medium |
| together | 100 | 19 | 1,2,3 | YES | medium |
| creepy | 3 | 3 | 1,2,3 | YES | high |
| mushroom | 10 | 10 | 1,2,3 | YES | high |
| mario-extra | 6 | 6 | 1,2,3 | YES | medium |
| custom-1 | 1 | 1 | 1,2,3 | YES | high |
| custom-2 | 1 | 1 | 1,2,3 | YES | high |
| custom-3 | 1 | 1 | 1,2,3 | YES | high |
| custom-4 | 1 | 1 | 1,2,3 | YES | high |
| custom-5 | 1 | 1 | 1,2,3 | YES | high |
| custom-6 | 1 | 1 | 1,2,3 | YES | high |
| custom-7 | 1 | 1 | 1,2,3 | YES | high |
| custom-8 | 1 | 1 | 1,2,3 | YES | high |
| custom-9 | 1 | 1 | 1,2,3 | YES | high |
| custom-10 | 1 | 1 | 1,2,3 | YES | high |
| mario-normal | 60 | 15 | 1,2,3 | YES | medium |
| mario-double | 600 | 46 | 1,2,3 | YES | medium |
| mario-triple | 6000 | 70 | 1,2,3 | YES | medium |
| mario-payday-double | 600 | 46 | 1,2,3 | YES | medium |
| mario-payday-triple | 6000 | 70 | 1,2,3 | YES | medium |
| mario-turbo | 60000 | 86 | 1,2,3 | YES | medium |
| mario-creepy | 18 | 8 | 1,2,3 | YES | medium |
| mario-mushroom | 60 | 15 | 1,2,3 | YES | medium |
| together-reported-bonus | 100 | 27 | 1,2,3 | YES | medium |

## Development failures and limitations retained
Two early harness starts stopped at a JavaScript syntax error before any suite executed; an extra parenthesis was removed. Two later foreground runs were interrupted by tool timeouts, not accepted as completed runs. The final full command completed with exit 0 and all 30 suites, and only that final report supplies the counts above. Initial 28-model results were superseded by the 29-model final rerun after the Together source correction. No Monte Carlo failing seed was discarded.
## Artifact integrity
`SHA256SUMS.txt` covers delivered job files and the root workflow, excluding itself, generated build outputs, transient test outputs and installed development dependencies. Every file is below 30,000,000 bytes. A lossless JSON whitespace compaction for publication does not change any parsed data; rerun schema validation and `npm test` on the published checkout. ZIP content uses the same repository-relative layout.
