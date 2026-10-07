# Verification

Local full code runs passed for seeds 1, 2 and 3. The final local run including research schema and artifact checks passed all three seeds. Both source passes are recorded, including all 33 rows and all 20 original registered excerpts each time; two new excerpts are now recovered in both incremental passes. Direct Reddit HTML did not recover its text; the native browser reopened those three sources in both passes and recovered all 12 excerpts. Both failure records and successful browser supplements are preserved. The exact code-and-artifact head `14b48ec930be6f4c97415eba169ed4c8f8d9a95c` also passed the full hosted suite. The latest substantive label/Buddy evidence recovery also passed the complete unchanged `npm test` for all three seeds; actual reports are in `reports/evidence-recovery-full/`. Its exact-head hosted conclusion is recorded in PR17 when observed, while strict research acceptance remains NOT_MET.

## Code ledger

Exact command: `npm test` from `jobs/B06-cpu-policy/`.

| Suite | Cases per seed | Seeds | Result |
|---|---:|---|---|
| Strict production and independent TypeScript | 2 implementations | 1,2,3 | Passed |
| Hand-written explained decisions | 20 each of 4 functions (80) | 1,2,3 | Passed |
| Random legal states and independent output/draw/purity comparison | 100,000 each of 4 functions (400,000) | 1,2,3 | Passed |
| Included toy games, complete independent decision/state replay | 10,000 games; 960,000 policy decisions | 1,2,3 | Passed |
| Separately strict-compiled actual source mutants | 25 each seed (75) | 1,2,3 | All killed |
| Research JSON schema, two source passes and row mapping | 33 rows; 44 recovered quote checks | 1,2,3 | Passed structure and recorded audit; strict research NOT_MET |
| Artifact SHA-256 and size checks | 43 files in latest complete local run; 9 source seals | 1,2,3 | Passed |

Every scenario includes frozen input, draw, expected result, draw count and arithmetic explanation in `reports/seed-*.json`. Every mutant has the actual compiled source hash and failed assertion. Each random test compares the complete function result and RNG calls and checks legal affordable IDs, no throw, and unchanged frozen inputs.

## UNVERIFIED

- Exact Nintendo per-difficulty decision probabilities and measured minigame skill remain unknown. Research is not complete; keep the PR draft.
- Public reports are anecdotal and sometimes contradict each other. The code's exploration, utility and purchase parameters are original design assumptions.
- All nine original source URLs were reopened twice and all 33 rows reviewed twice. Two additional extracted sources now have two separately read captures; 22 registered excerpts have two recorded recoveries. Schema validation passes; 24 explicit coverage gaps remain. All executed code and artifact gates pass locally and on GitHub; 24 research coverage gaps prevent complete acceptance. The complete local command after this evidence recovery passed every code gate; the final delivery manifest is independently checked after archiving those actual reports. The hosted full rerun still needs its actual conclusion inspected. No pending check is labeled passed.

## Measured toy outcomes

| Seed | Hard wins | Easy wins | Ties | Exact Hard rate |
|---|---:|---:|---:|---:|
| 1 | 9971 | 28 | 1 | 9971/10000 |
| 2 | 9934 | 56 | 10 | 9934/10000 |
| 3 | 9952 | 46 | 2 | 9952/10000 |

## Complete second source pass

Exact source commands: `python /workspace/recheck-b06-sources.py` for two actual direct retrieval passes; native web `open` reopened all three Reddit URLs for each supplement. These are historical executed commands; the external authoring scripts are not required runtime dependencies. Only registered short excerpts and retrieved hashes are stored.

| Row | Confidence | Pass 2 quotes | Scope assessment |
|---|---|---|---|
| F01 | high | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F02 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F03 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F04 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F05 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F06 | medium | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F07 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F08 | medium | Both independent labels recovered | original-game selector and walkthrough; mode scope retained |
| F09 | low | Both independent reports recovered | Hard+ / Master anecdotes; no numeric behavior inferred |
| G-easy-branches | low | No qualifying evidence; gap retained | coverage gap retained |
| G-easy-items | low | No qualifying evidence; gap retained | coverage gap retained |
| G-easy-shop | low | No qualifying evidence; gap retained | coverage gap retained |
| G-easy-stars | low | No qualifying evidence; gap retained | coverage gap retained |
| G-easy-buddy | low | No qualifying evidence; gap retained | coverage gap retained |
| G-easy-minigames | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-branches | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-items | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-shop | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-stars | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-buddy | low | No qualifying evidence; gap retained | coverage gap retained |
| G-normal-minigames | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-branches | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-items | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-shop | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-stars | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-buddy | low | No qualifying evidence; gap retained | coverage gap retained |
| G-hard-minigames | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-branches | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-items | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-shop | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-stars | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-buddy | low | No qualifying evidence; gap retained | coverage gap retained |
| G-master-minigames | low | No qualifying evidence; gap retained | coverage gap retained |

## Incremental label and Buddy recovery

`reports/labels-buddy-recovery.json` records the two separate full-source Exa fetch calls and exact quote recovery, with extraction hashes and origin status explicitly unobserved. The video transcript was read in full: its four-label passage concerns Koopathlon, its board-mode passage says Easy through Master, and its three-level Bowser setting is stage difficulty. Both fresh direct Speedrun reopens returned HTTP 200 with all labels. ResetEra post #200 was read in full on both passes, including the author's Master-AI context and Monty Mole Buddy/Boo account. No probabilities were inferred from anecdotes.

Both original audit files and original changed-row claims remain in `reports/historical-before-labels-buddy/`. Updated audit files retain all unchanged original source timestamps and reviews, add the two new source captures, refresh the Speedrun capture, and recheck each changed row in both passes. All 22 registered excerpts across 11 sources have two recorded recoveries (44 source/quote checks), while the 24 exact Nintendo behavior gaps remain UNVERIFIED. Full code validation and exact final-head CI are recorded in PR17 after actually finishing.
