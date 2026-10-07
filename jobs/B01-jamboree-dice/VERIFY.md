# B01 verification record

Latest local full command: `npm test`, from `jobs/B01-jamboree-dice`. **Exit 0; 48/48 suites passed for seeds 1, 2, and 3.** The same full command is run by `.github/workflows/B01.yml`; the observed hosted run link is recorded in PR 8 after checking its exact head.

Environment: node v24.19.0, python 3.12.14, typescript 5.8.3, jsonschema 4.26.0, g++ g++ (Debian 14.2.0-19) 14.2.0.

**29 models; 85,777 ordered outcomes per pass; 257,331 ordered outcome checks across three passes.** Every outcome is compared against both the original Python reference and the newly sealed blind TypeScript oracle. Each of those two comparisons covers the complete corpus; repeated comparisons do not create additional distinct outcomes. The blind suite also compares all 29 complete tables, 4,020 signed fraction fixtures and 18 invalid model fixtures per seed.

**870,000,000 Monte Carlo trials**: 10,000,000 per model per seed, including every deterministic Custom choice. Each seed checks 1,196 joint/marginal outcome bins. All fixed seeds pass the exact four-sigma inequality. **75/75 isolated mutations compile and are killed by numeric/contract assertion failures against the sealed oracle; zero survivors and zero compiler-error kills.**

The test-only C++ sampler preserves the TypeScript xoshiro128** stream and rejection sampling. Before each full Monte Carlo suite it is compared on 1,024 raw generator values and 1,000 complete sampled outcomes for every model. No trial counts, model IDs or failing seeds are substituted. The pure runtime lookup still has zero dependencies.

## Independent authorship

`tests/blind/reference.ts` was authored in a separate context using the original prompt, root README, plain public contract and dice.json before any B01 production, previous reference, test algorithm or odds table was read. Its SHA-256 was delivered before production access: `c98f59f1372ad59904437e93bfed9f0cc6872b92cc58efc249380beb5bad2718`. It uses mixed-radix tuple decoding and independent BigInt fraction reduction. The original sealed sources, authoring record and 41 self-check assertions are preserved. The full command reruns that original self-check in a transient directory for each seed without altering sealed artifacts. Original Python/production authorship history is retained as an additional comparison.

## UNVERIFIED

Research remains **PARTIAL**. Fact statuses: {'two-source': 22, 'single-source': 9, 'conflict': 1, 'unknown': 1, 'assumption': 1}. Unresolved IDs: F07, F09, F11, F16, F22, F25, F28, F30, F31, F32, F33, F34.

- Triple, Payday, Turbo and Together matching reward amounts still lack a second independent confirmation. The +10 Double Dice matching reward now has independent player corroboration (S27); this does not promote other item rewards. Together team coin accounting was not independently observed.
- Exact outcome frequencies, face independence and Nintendo RNG behavior are model assumptions (F32); no hardware roll dataset or RNG reverse engineering is claimed. Luigi activation and conditional nonactivation probabilities remain unknown.
- Ticket total/additional-use wording remains a recorded conflict. Custom buddy cancellation, full TV bonus parity, Turbo junction details and Mario Payday contribution have the source limitations identified by their individual facts. Unobserved item/buddy combinations are conditional compositions.
- All 28 registered source URLs were reopened in two fresh passes on 2026-10-07. Twenty-seven pages and their registered quotations were recovered in both passes. S23, an explicitly rejected mirror, timed out in both passes; it supplies no accepted fact evidence.
- Every one of the 120 fact, character, face, item, model and compatibility rows was rechecked against its dependency sources. RECHECKED means the evidence was revisited; PARTIAL continues to identify an unmet research gate. Source independence concerns publication provenance and does not certify separate controlled experiments.
- No exhaustive physical capture of every mode, minigame die prop, starting-order/tie-break procedure, coin cap, acquisition probability or character/buddy eligibility combination is claimed. The scope and exclusions are explicit in ASSUMPTIONS.md and CONFLICTS.md.
- A four-sigma gate is statistical and can fail on other future seeds. Seeds 1, 2 and 3 were fixed in advance; no failed seed was discarded.

## Every executed suite

Case units are recorded by suite; one exhaustive case is one ordered roll. The native parity model case contains 1,000 sampled tuples. Fraction and invalid-model assertions are auxiliary counts in the blind suite metadata. Fresh full per-bin reports are regenerated in `.test-output/` and uploaded by CI. The committed compact report retains the complete local stdout, environment and input source hashes.

| Seed | Test | Cases | Passed | Failed | Exact command / selector |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | artifact-integrity | 58 | 58 | 0 | `npm test (all delivered hashes and per-file 30000000-byte gate)` |
| 1 | typescript-strict | 4 | 4 | 0 | `tsc -p tsconfig.json` |
| 1 | native-sampler-compile | 1 | 1 | 0 | `g++ -std=c++17 -O3 -Wall -Wextra -Werror tests/montecarlo.cpp -o .test-output/montecarlo` |
| 1 | json-schema | 2 | 2 | 0 | `python3 tests/validate.py 1` |
| 1 | semantic-references | 113 | 113 | 0 | `npm test (semantic references, aliases, quote budgets, dependency/purity scan)` |
| 1 | research-source-recheck | 148 | 148 | 0 | `npm test (complete per-row second-pass coverage and all accepted source quotes recovered in both archived passes)` |
| 1 | exhaustive-A-B | 85,777 | 85,777 | 0 | `npm test (TypeScript Cartesian enumeration versus Python convolution and independent per-tuple evaluator)` |
| 1 | blind-independent-odds | 85,777 | 85,777 | 0 | `npm test (sealed blind mixed-radix oracle versus every production tuple, table, fraction and invalid model fixture)` |
| 1 | blind-author-selfcheck | 41 | 41 | 0 | `npm test (rerun original sealed author self-check in transient directory)` |
| 1 | exact-invariants | 612 | 612 | 0 | `npm test (bigint normalization, marginals, expectations and reduction)` |
| 1 | lookup-boundaries | 2,194 | 2,194 | 0 | `npm test (lookup equality, all characters, custom choices, immutability, rejected inputs)` |
| 1 | literal-goldens | 19 | 19 | 0 | `npm test (literal arithmetic goldens; game inputs retain their research confidence)` |
| 1 | seeded-rng | 1,009 | 1,009 | 0 | `npm test (RNG reproducibility, rejection branch and uint32 bounds)` |
| 1 | mutation-testing | 25 | 25 | 0 | `npm test (25 individual compiled-source mutants; only assertion failures against sealed blind distributions count as kills)` |
| 1 | native-sampler-equivalence | 1,053 | 1,053 | 0 | `npm test (C++ versus TypeScript PRNG values and 1000 complete sampled tuples for every model)` |
| 1 | monte-carlo | 1,196 | 1,196 | 0 | `npm test (10000000 independent face-sampled tuples per model; exact bigint 4-sigma inequalities)` |
| 2 | artifact-integrity | 58 | 58 | 0 | `npm test (all delivered hashes and per-file 30000000-byte gate)` |
| 2 | typescript-strict | 4 | 4 | 0 | `tsc -p tsconfig.json` |
| 2 | native-sampler-compile | 1 | 1 | 0 | `g++ -std=c++17 -O3 -Wall -Wextra -Werror tests/montecarlo.cpp -o .test-output/montecarlo` |
| 2 | json-schema | 2 | 2 | 0 | `python3 tests/validate.py 2` |
| 2 | semantic-references | 113 | 113 | 0 | `npm test (semantic references, aliases, quote budgets, dependency/purity scan)` |
| 2 | research-source-recheck | 148 | 148 | 0 | `npm test (complete per-row second-pass coverage and all accepted source quotes recovered in both archived passes)` |
| 2 | exhaustive-A-B | 85,777 | 85,777 | 0 | `npm test (TypeScript Cartesian enumeration versus Python convolution and independent per-tuple evaluator)` |
| 2 | blind-independent-odds | 85,777 | 85,777 | 0 | `npm test (sealed blind mixed-radix oracle versus every production tuple, table, fraction and invalid model fixture)` |
| 2 | blind-author-selfcheck | 41 | 41 | 0 | `npm test (rerun original sealed author self-check in transient directory)` |
| 2 | exact-invariants | 612 | 612 | 0 | `npm test (bigint normalization, marginals, expectations and reduction)` |
| 2 | lookup-boundaries | 2,194 | 2,194 | 0 | `npm test (lookup equality, all characters, custom choices, immutability, rejected inputs)` |
| 2 | literal-goldens | 19 | 19 | 0 | `npm test (literal arithmetic goldens; game inputs retain their research confidence)` |
| 2 | seeded-rng | 1,009 | 1,009 | 0 | `npm test (RNG reproducibility, rejection branch and uint32 bounds)` |
| 2 | mutation-testing | 25 | 25 | 0 | `npm test (25 individual compiled-source mutants; only assertion failures against sealed blind distributions count as kills)` |
| 2 | native-sampler-equivalence | 1,053 | 1,053 | 0 | `npm test (C++ versus TypeScript PRNG values and 1000 complete sampled tuples for every model)` |
| 2 | monte-carlo | 1,196 | 1,196 | 0 | `npm test (10000000 independent face-sampled tuples per model; exact bigint 4-sigma inequalities)` |
| 3 | artifact-integrity | 58 | 58 | 0 | `npm test (all delivered hashes and per-file 30000000-byte gate)` |
| 3 | typescript-strict | 4 | 4 | 0 | `tsc -p tsconfig.json` |
| 3 | native-sampler-compile | 1 | 1 | 0 | `g++ -std=c++17 -O3 -Wall -Wextra -Werror tests/montecarlo.cpp -o .test-output/montecarlo` |
| 3 | json-schema | 2 | 2 | 0 | `python3 tests/validate.py 3` |
| 3 | semantic-references | 113 | 113 | 0 | `npm test (semantic references, aliases, quote budgets, dependency/purity scan)` |
| 3 | research-source-recheck | 148 | 148 | 0 | `npm test (complete per-row second-pass coverage and all accepted source quotes recovered in both archived passes)` |
| 3 | exhaustive-A-B | 85,777 | 85,777 | 0 | `npm test (TypeScript Cartesian enumeration versus Python convolution and independent per-tuple evaluator)` |
| 3 | blind-independent-odds | 85,777 | 85,777 | 0 | `npm test (sealed blind mixed-radix oracle versus every production tuple, table, fraction and invalid model fixture)` |
| 3 | blind-author-selfcheck | 41 | 41 | 0 | `npm test (rerun original sealed author self-check in transient directory)` |
| 3 | exact-invariants | 612 | 612 | 0 | `npm test (bigint normalization, marginals, expectations and reduction)` |
| 3 | lookup-boundaries | 2,194 | 2,194 | 0 | `npm test (lookup equality, all characters, custom choices, immutability, rejected inputs)` |
| 3 | literal-goldens | 19 | 19 | 0 | `npm test (literal arithmetic goldens; game inputs retain their research confidence)` |
| 3 | seeded-rng | 1,009 | 1,009 | 0 | `npm test (RNG reproducibility, rejection branch and uint32 bounds)` |
| 3 | mutation-testing | 25 | 25 | 0 | `npm test (25 individual compiled-source mutants; only assertion failures against sealed blind distributions count as kills)` |
| 3 | native-sampler-equivalence | 1,053 | 1,053 | 0 | `npm test (C++ versus TypeScript PRNG values and 1000 complete sampled tuples for every model)` |
| 3 | monte-carlo | 1,196 | 1,196 | 0 | `npm test (10000000 independent face-sampled tuples per model; exact bigint 4-sigma inequalities)` |

## JSON Schema validator output

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

## Monte Carlo by model and seed

| Seed | Model | Trials | Bins | Maximum z² | RNG draws | Rejections | Passed |
| --- | --- | ---: | ---: | --- | ---: | ---: | --- |
| 1 | normal | 10,000,000 | 21 | 845/288 | 10,000,000 | 0 | YES |
| 1 | double | 10,000,000 | 48 | 71289/7840 | 20,000,000 | 0 | YES |
| 1 | triple | 10,000,000 | 67 | 27848/4995 | 30,000,000 | 0 | YES |
| 1 | payday-double | 10,000,000 | 69 | 11881/3960 | 20,000,000 | 0 | YES |
| 1 | payday-triple | 10,000,000 | 97 | 143641/21690 | 30,000,000 | 0 | YES |
| 1 | turbo | 10,000,000 | 85 | 2457005/416472 | 40,000,000 | 0 | YES |
| 1 | together | 10,000,000 | 38 | 69169/22560 | 20,000,000 | 0 | YES |
| 1 | creepy | 10,000,000 | 7 | 516961/5000000 | 10,000,000 | 0 | YES |
| 1 | mushroom | 10,000,000 | 21 | 76729/25000 | 10,000,000 | 0 | YES |
| 1 | mario-extra | 10,000,000 | 13 | 2088968/390625 | 10,000,000 | 0 | YES |
| 1 | custom-1 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-2 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-3 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-4 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-5 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-6 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-7 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-8 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-9 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | custom-10 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 1 | mario-normal | 10,000,000 | 31 | 9357481/900000 | 20,000,000 | 0 | YES |
| 1 | mario-double | 10,000,000 | 72 | 121032/24875 | 30,000,000 | 0 | YES |
| 1 | mario-triple | 10,000,000 | 106 | 113288/14995 | 40,000,000 | 0 | YES |
| 1 | mario-payday-double | 10,000,000 | 103 | 6125/1198 | 30,000,001 | 1 | YES |
| 1 | mario-payday-triple | 10,000,000 | 161 | 1744712/213295 | 40,000,000 | 0 | YES |
| 1 | mario-turbo | 10,000,000 | 131 | 235271432/42239995 | 50,000,000 | 0 | YES |
| 1 | mario-creepy | 10,000,000 | 17 | 1151329/781250 | 20,000,000 | 0 | YES |
| 1 | mario-mushroom | 10,000,000 | 31 | 3279721/900000 | 20,000,000 | 0 | YES |
| 1 | together-reported-bonus | 10,000,000 | 48 | 5726449/736000 | 20,000,000 | 0 | YES |
| 2 | normal | 10,000,000 | 21 | 4507129/900000 | 10,000,001 | 1 | YES |
| 2 | double | 10,000,000 | 48 | 220323/32000 | 20,000,000 | 0 | YES |
| 2 | triple | 10,000,000 | 67 | 1014/185 | 30,000,000 | 0 | YES |
| 2 | payday-double | 10,000,000 | 69 | 14045/1472 | 20,000,000 | 0 | YES |
| 2 | payday-triple | 10,000,000 | 97 | 194045/41118 | 30,000,000 | 0 | YES |
| 2 | turbo | 10,000,000 | 85 | 97470/17353 | 40,000,000 | 0 | YES |
| 2 | together | 10,000,000 | 38 | 177241/49000 | 20,000,000 | 0 | YES |
| 2 | creepy | 10,000,000 | 7 | 5230369/5000000 | 10,000,000 | 0 | YES |
| 2 | mushroom | 10,000,000 | 21 | 591361/225000 | 10,000,000 | 0 | YES |
| 2 | mario-extra | 10,000,000 | 13 | 3972049/3125000 | 10,000,000 | 0 | YES |
| 2 | custom-1 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-2 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-3 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-4 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-5 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-6 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-7 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-8 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-9 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | custom-10 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 2 | mario-normal | 10,000,000 | 31 | 1164241/900000 | 20,000,000 | 0 | YES |
| 2 | mario-double | 10,000,000 | 72 | 351649/49750 | 30,000,000 | 0 | YES |
| 2 | mario-triple | 10,000,000 | 106 | 185761/24750 | 40,000,000 | 0 | YES |
| 2 | mario-payday-double | 10,000,000 | 103 | 38/5 | 30,000,000 | 0 | YES |
| 2 | mario-payday-triple | 10,000,000 | 161 | 27040/2999 | 40,000,000 | 0 | YES |
| 2 | mario-turbo | 10,000,000 | 131 | 485112250/50416631 | 50,000,000 | 0 | YES |
| 2 | mario-creepy | 10,000,000 | 17 | 1366561/500000 | 20,000,000 | 0 | YES |
| 2 | mario-mushroom | 10,000,000 | 31 | 1610361/475000 | 20,000,000 | 0 | YES |
| 2 | together-reported-bonus | 10,000,000 | 48 | 2442969/196000 | 20,000,000 | 0 | YES |
| 3 | normal | 10,000,000 | 21 | 227529/100000 | 10,000,000 | 0 | YES |
| 3 | double | 10,000,000 | 48 | 217083/32000 | 20,000,000 | 0 | YES |
| 3 | triple | 10,000,000 | 67 | 103499/18690 | 30,000,000 | 0 | YES |
| 3 | payday-double | 10,000,000 | 69 | 3323329/564000 | 20,000,000 | 0 | YES |
| 3 | payday-triple | 10,000,000 | 97 | 243602/73875 | 30,000,000 | 0 | YES |
| 3 | turbo | 10,000,000 | 85 | 5212205/416472 | 40,000,000 | 0 | YES |
| 3 | together | 10,000,000 | 38 | 182408/28125 | 20,000,000 | 0 | YES |
| 3 | creepy | 10,000,000 | 7 | 1194649/312500 | 10,000,000 | 0 | YES |
| 3 | mushroom | 10,000,000 | 21 | 603729/100000 | 10,000,000 | 0 | YES |
| 3 | mario-extra | 10,000,000 | 13 | 4157521/12500000 | 10,000,000 | 0 | YES |
| 3 | custom-1 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-2 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-3 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-4 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-5 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-6 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-7 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-8 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-9 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | custom-10 | 10,000,000 | 3 | 0 | 10,000,000 | 0 | YES |
| 3 | mario-normal | 10,000,000 | 31 | 631688/184375 | 20,000,000 | 0 | YES |
| 3 | mario-double | 10,000,000 | 72 | 38088/6755 | 30,000,000 | 0 | YES |
| 3 | mario-triple | 10,000,000 | 106 | 733445/85318 | 40,000,000 | 0 | YES |
| 3 | mario-payday-double | 10,000,000 | 103 | 1414562/303875 | 30,000,000 | 0 | YES |
| 3 | mario-payday-triple | 10,000,000 | 161 | 1722368/266355 | 40,000,000 | 0 | YES |
| 3 | mario-turbo | 10,000,000 | 131 | 361000/59999 | 50,000,000 | 0 | YES |
| 3 | mario-creepy | 10,000,000 | 17 | 5564881/1250000 | 20,000,000 | 0 | YES |
| 3 | mario-mushroom | 10,000,000 | 31 | 2621161/350000 | 20,000,000 | 0 | YES |
| 3 | together-reported-bonus | 10,000,000 | 48 | 1100401/196000 | 20,000,001 | 1 | YES |

## Deliberate mutations

Each mutant is compiled separately from pristine source. Only an AssertionError caused by disagreement with the sealed blind distribution is a kill; compiler and runtime failures fail the suite. Full source hashes and assertion messages are in reports/verification.json.

| ID | Bug | First failing model | Compiled and killed in seeds |
| --- | --- | --- | --- |
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

## Source second pass

| Source | First page + quotes | Second page + quotes | Second capture |
| --- | --- | --- | --- |
| S01 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch1.json` |
| S02 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch1.json` |
| S03 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch1.json` |
| S04 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch1.json` |
| S05 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch1.json` |
| S06 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch2.json` |
| S07 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch2.json` |
| S08 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch2.json` |
| S09 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch2.json` |
| S10 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch2.json` |
| S11 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch3.json` |
| S12 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch3.json` |
| S13 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch3.json` |
| S14 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch3.json` |
| S15 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch3.json` |
| S16 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch4.json` |
| S17 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch4.json` |
| S18 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch4.json` |
| S19 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch4.json` |
| S20 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch4.json` |
| S21 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch5.json` |
| S22 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch5.json` |
| S23 | FAILED: rejected mirror | FAILED: rejected mirror | `reports/source-captures/pass2-batch5.json: rejected mirror live-crawl timeout` |
| S24 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch5.json` |
| S25 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch5.json` |
| S26 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch6.json` |
| S27 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch6.json` |
| S28 | RETRIEVED | RETRIEVED | `reports/source-captures/pass2-batch6.json` |

## Complete research row audit

| Row | Fact dependencies | Confidence | Rechecked | Research gate |
| --- | --- | --- | --- | --- |
| facts/F01 | F01 | high | YES | PASS |
| facts/F02 | F02 | high | YES | PASS |
| facts/F03 | F03 | high | YES | PASS |
| facts/F04 | F04 | high | YES | PASS |
| facts/F05 | F05 | high | YES | PASS |
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
| characters/mario | F01, F02, F03 | high | YES | PASS |
| characters/luigi | F01, F02, F03 | high | YES | PASS |
| characters/peach | F01, F02, F03 | high | YES | PASS |
| characters/daisy | F01, F02, F03 | high | YES | PASS |
| characters/wario | F01, F02, F03 | high | YES | PASS |
| characters/waluigi | F01, F02, F03 | high | YES | PASS |
| characters/yoshi | F01, F02, F03 | high | YES | PASS |
| characters/rosalina | F01, F02, F03 | high | YES | PASS |
| characters/bowser | F01, F02, F03 | high | YES | PASS |
| characters/goomba | F01, F02, F03 | high | YES | PASS |
| characters/shy-guy | F01, F02, F03 | high | YES | PASS |
| characters/koopa-troopa | F01, F02, F03 | high | YES | PASS |
| characters/monty-mole | F01, F02, F03 | high | YES | PASS |
| characters/bowser-jr | F01, F02, F03 | high | YES | PASS |
| characters/boo | F01, F02, F03 | high | YES | PASS |
| characters/spike | F01, F02, F03 | high | YES | PASS |
| characters/donkey-kong | F01, F02, F03 | high | YES | PASS |
| characters/birdo | F01, F02, F03 | high | YES | PASS |
| characters/toad | F01, F02, F03 | high | YES | PASS |
| characters/toadette | F01, F02, F03 | high | YES | PASS |
| characters/ninji | F01, F02, F03 | high | YES | PASS |
| characters/pauline | F01, F02, F03 | high | YES | PASS |
| dice/normal/face/1 | F02, F03 | high | YES | PASS |
| dice/normal/face/2 | F02, F03 | high | YES | PASS |
| dice/normal/face/3 | F02, F03 | high | YES | PASS |
| dice/normal/face/4 | F02, F03 | high | YES | PASS |
| dice/normal/face/5 | F02, F03 | high | YES | PASS |
| dice/normal/face/6 | F02, F03 | high | YES | PASS |
| dice/normal/face/7 | F02, F03 | high | YES | PASS |
| dice/normal/face/8 | F02, F03 | high | YES | PASS |
| dice/normal/face/9 | F02, F03 | high | YES | PASS |
| dice/normal/face/10 | F02, F03 | high | YES | PASS |
| dice/creepy/face/1 | F13, F14 | high | YES | PASS |
| dice/creepy/face/2 | F13, F14 | high | YES | PASS |
| dice/creepy/face/3 | F13, F14 | high | YES | PASS |
| dice/mario-extra/face/3 | F27 | medium | YES | PASS |
| dice/mario-extra/face/4 | F27 | medium | YES | PASS |
| dice/mario-extra/face/5 | F27 | medium | YES | PASS |
| dice/mario-extra/face/6 | F27 | medium | YES | PASS |
| dice/mario-extra/face/7 | F27 | medium | YES | PASS |
| dice/mario-extra/face/8 | F27 | medium | YES | PASS |
| items/double-dice | F04, F05 | high | YES | PASS |
| items/triple-dice | F06, F07 | medium | YES | PARTIAL |
| items/custom-dice-block | F12, F31 | medium | YES | PARTIAL |
| items/payday-double-dice | F08, F09 | medium | YES | PARTIAL |
| items/payday-triple-dice | F10, F11 | medium | YES | PARTIAL |
| items/creepy-dice-block | F13, F19 | high | YES | PASS |
| items/super-creepy-dice | F14, F19 | high | YES | PASS |
| items/creepy-dice-block-tickets | F15, F16 | medium | YES | PARTIAL |
| items/mushroom | F17, F19 | high | YES | PASS |
| items/mushroom-tickets | F18, F16 | medium | YES | PARTIAL |
| items/turbo-dice | F20, F21, F22 | medium | YES | PARTIAL |
| items/together-dice | F23, F24, F25 | medium | YES | PARTIAL |
| models/normal | F02, F03, F32 | high | YES | PARTIAL |
| models/double | F04, F05, F32 | high | YES | PARTIAL |
| models/triple | F06, F07, F32 | medium | YES | PARTIAL |
| models/payday-double | F08, F09, F32 | medium | YES | PARTIAL |
| models/payday-triple | F10, F11, F32 | medium | YES | PARTIAL |
| models/turbo | F20, F21, F22, F32 | medium | YES | PARTIAL |
| models/together | F23, F24, F25, F32 | medium | YES | PARTIAL |
| models/creepy | F13, F32 | high | YES | PARTIAL |
| models/mushroom | F17, F32 | high | YES | PARTIAL |
| models/mario-extra | F27, F32 | medium | YES | PARTIAL |
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
| models/mario-normal | F02, F03, F32, F27 | medium | YES | PARTIAL |
| models/mario-double | F04, F05, F32, F27 | medium | YES | PARTIAL |
| models/mario-triple | F06, F07, F32, F27 | medium | YES | PARTIAL |
| models/mario-payday-double | F08, F09, F32, F27, F28 | medium | YES | PARTIAL |
| models/mario-payday-triple | F10, F11, F32, F27, F28 | medium | YES | PARTIAL |
| models/mario-turbo | F20, F21, F22, F32, F27 | medium | YES | PARTIAL |
| models/mario-creepy | F13, F32, F27 | medium | YES | PARTIAL |
| models/mario-mushroom | F17, F32, F27 | medium | YES | PARTIAL |
| models/together-reported-bonus | F23, F24, F25, F32 | medium | YES | PARTIAL |
| compatibility/0 | F02, F04, F06 | high | YES | PASS |
| compatibility/1 | F19 | high | YES | PASS |
| compatibility/2 | F27 | high | YES | PASS |
| compatibility/3 | F12 | high | YES | PASS |

## Integrity and repeated verification

The initial integration run passed 42/42 suites. After the fresh evidence and source-row audit were added, the complete run passed 48/48. The final repeated run additionally requires assertion-only mutant kills and also passed 48/48. No Monte Carlo failure was discarded.

The delivered manifest covers all tracked job artifacts and the B01 workflow, excluding itself, installed tools and transient outputs. Final reports and documentation are packaged after the numerical run, followed by regeneration and three explicit manifest checks. These packaging checks supplement the numerical run; GitHub CI repeats the complete numerical command on the final published manifest. Every individual delivered file is below 30,000,000 bytes.
