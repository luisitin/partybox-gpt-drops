# Verification

Local full code runs passed for seeds 1, 2 and 3. The final local run including research schema and artifact checks passed all three seeds. Both source passes are recorded, including all 33 rows and all 20 registered excerpts each time. Direct Reddit HTML did not recover its text; the native browser reopened those three sources in both passes and recovered all 12 excerpts. Both failure records and successful browser supplements are preserved. The exact code-and-artifact head `14b48ec930be6f4c97415eba169ed4c8f8d9a95c` also passed the full hosted suite. The final evidence commit will rerun the same full command; its green link is recorded in the PR when observed.

## Code ledger

Exact command: `npm test` from `jobs/B06-cpu-policy/`.

| Suite | Cases per seed | Seeds | Result |
|---|---:|---|---|
| Strict production and independent TypeScript | 2 implementations | 1,2,3 | Passed |
| Hand-written explained decisions | 20 each of 4 functions (80) | 1,2,3 | Passed |
| Random legal states and independent output/draw/purity comparison | 100,000 each of 4 functions (400,000) | 1,2,3 | Passed |
| Included toy games, complete independent decision/state replay | 10,000 games; 960,000 policy decisions | 1,2,3 | Passed |
| Separately strict-compiled actual source mutants | 25 each seed (75) | 1,2,3 | All killed |
| Research JSON schema, two source passes and row mapping | 33 rows; 40 recovered quote checks | 1,2,3 | Passed structure and recorded audit; strict research NOT_MET |
| Artifact SHA-256 and size checks | 39 files in executed final local run; 9 source seals | 1,2,3 | Passed |

Every scenario includes frozen input, draw, expected result, draw count and arithmetic explanation in `reports/seed-*.json`. Every mutant has the actual compiled source hash and failed assertion. Each random test compares the complete function result and RNG calls and checks legal affordable IDs, no throw, and unchanged frozen inputs.

## UNVERIFIED

- Exact Nintendo per-difficulty decision probabilities and measured minigame skill remain unknown. Research is not complete; keep the PR draft.
- Public reports are anecdotal and sometimes contradict each other. The code's exploration, utility and purchase parameters are original design assumptions.
- All 9 source URLs were reopened twice, with all 33 rows reviewed twice and all 20 registered excerpts recovered per pass. Schema validation passes; 26 explicit coverage gaps remain. All executed code and artifact gates pass locally and on GitHub; 26 research coverage gaps prevent complete acceptance. The manifest is regenerated for the final evidence update, and its full hosted rerun must pass. No pending check is labeled passed.

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
| F08 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
| F09 | low | Recovered | qualitative source scope retained; no numeric behavior inferred |
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
