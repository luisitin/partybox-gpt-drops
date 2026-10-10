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

## Polish pass 2026-10-08

Scope: correctness review, product review and documentation. No production file was changed: `cpuPolicy.ts`, `types.ts` and `CONTRACT.md` are sealed (`PRODUCTION-SEALED-SHA256SUMS.txt`, checked by `tests/artifact-check.mjs`), and the seal is part of the job's independence record.

| Check | Command | Result |
| --- | --- | --- |
| Full suite | `npm test` (Node 22) | exit 0, seeds 1, 2 and 3: 5 min 01 s on the first run of this pass; 137 s and 117 s on the last two runs, after all code-free edits (the shared box was less loaded) |
| Per seed | from the suite output | 80 scenarios passed; 400,000 random legal states passed; 25 of 25 mutants killed; Hard 9,971, 9,934 and 9,952 of 10,000 toy games (seeds 1, 2, 3) |
| Seal | `sha256sum cpuPolicy.ts types.ts CONTRACT.md` against `PRODUCTION-SEALED-SHA256SUMS.txt` | all three match |
| Review | `cpuPolicy.ts` read against `CONTRACT.md` line by line | branch, item, shop and Star rules match, including zero turns, full inventory, empty lists and a bad rng; no defect found |
| Hosted CI | GitHub run 37676078976 on head `4f030d4` | success (`B06 CPU policy full verification`) |

Toy-board reading: the Hard rate (99.3 to 99.7 percent) is far above the 65 percent floor. The floor is a smoke test, not a balance target, and the INTEGRATION says so.

UNVERIFIED in this pass: the 24 per-difficulty behaviour rows (branch, item, shop, Star, Buddy and minigame at four levels) are still unverified. No live source was re-fetched; most hosts are blocked from this box.

## Controlled-evidence blocker recovery — 2026-10-09

- Initial exact native Git snapshot: all 52 B06/workflow files verified by size and Git blob SHA. The original policy, reference, contract, all research and both source audits, original full harness and workflow remain unchanged.
- Full inherited-head native log: actual run 37814340582 / job 113438974582, head baf87d4400d832b6fe9356ae0d5f43cd109bbd48, SUCCESS. Read all 22,094 UTF-8 bytes; SHA256 9f1cb698a81d0bdc83b6f5751f82f36accfd0f51033e374498825f1c3cda72e3. Three seeds retain 240 scenarios, 1.2M states, 30K toy games and 75 mutation kills. This is acceptance of the original run, not a fresh local full-suite execution.
- Exact command: `node reports/20261009-recovery/read-original-evidence.mjs`. PASS: all six complete historical seed archives, every explained scenario, all original mutation hashes and assertion witnesses, the full native log and nine seals checked. Separate historical archives are not counted as fresh runs or doubled current coverage.
- Exact command: `node tests/research-strict.mjs`. Fresh actual exit 1: Ajv 8.17.1 validates 33 rows / 11 sources / 44 recorded quote recoveries; 24 coverage gaps remain NOT_MET. Raw stdout and actual exit are archived. No gate is waived.
- Search: six Exa angles, eight requested results each; actual 48 candidates / 43 exact unique URLs. One full fetch call recovered eight authored contexts, all read in full. Candidate discovery and rejection are logged with capture hashes; origin HTTP status unobserved, videos read as transcripts, zero fact promotions. Original source timestamps and audit versions remain historical and unchanged.
- New source checkpoint: its complete hosted npm test is pending at this dated writing; inspect the current exact-head PR17 run and full native log before accepting the blocked delivery. Original workflow intentionally has no uploaded artifact. The evidence is its full native log plus all committed detailed records.

### UNVERIFIED in this recovery

The original 24 per-difficulty branch/item/shop/star/Buddy/minigame behavior rows remain unverified. This bounded search is not an exhaustive proof that no controlled source exists. No physical gameplay experiment, Nintendo probability, CPU win rate, origin HTTP status, personally watched video frame or PartyBox port is claimed.
