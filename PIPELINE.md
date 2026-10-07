# ChatGPT project pipeline

_Last refreshed: 2026-10-07 08:58 UTC_

This tracker covers the 20 jobs in [PROMPTS.md](PROMPTS.md). It compares each job branch with main and records open pull request summaries and observed GitHub Actions results.

Live dashboard: https://partybox-project-tracker.artificiallysloppy.chatgpt.site

The notes below describe what the GitHub record suggests is being worked on. A green automated run is evidence about the submitted checks; it does not resolve the research or independent-authorship gaps listed here. No project pull request has been merged.

## Stage meanings

- **Pre-pipeline:** no job branch or pull request exists.
- **Pipeline:** a job branch exists, or a previous pull request was closed without merging.
- **Review:** a pull request is open.
- **Completed:** a project pull request has been merged.

**Current count:** 1 pre-pipeline, 11 pipeline, 8 in review, 0 completed.

## Pre-pipeline (1)

| Job | What seems to be worked on | Checks / open items | Latest evidence |
|---|---|---|---|
| [B06 Jamboree CPU behaviour + cpuPolicy.ts (R+C)](https://github.com/luisitin/partybox-gpt-drops/blob/main/PROMPTS.md) | No job branch or pull request exists yet. | No job files or verification evidence available. | No branch found in current GitHub branch list. |

## Pipeline (11)

| Job | What seems to be worked on | Checks / open items | Latest evidence |
|---|---|---|---|
| [B03 Every Jamboree minigame, catalogued (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B03-jamboree-minigames) | Reserved branch; no job-specific research or deliverables committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B04 All Jamboree boards, space by space (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B04-jamboree-boards) | Reserved branch; no job-specific research or deliverables committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B07 Yahtzee exact optimal solver (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B07-yahtzee-optimal) | Reserved branch; no solver or job-specific research committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B08 Monopoly exact landing odds + ROI (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B08-monopoly-markov) | Added the B08 GitHub verification workflow; no Monopoly model or job deliverables are committed yet. | Workflow is infrastructure only; no project test results to report. | 2026-10-07 03:45 UTC — added .github/workflows/B08.yml. |
| [B09 Clue exact deduction engine (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B09-clue-solver) | Reserved branch; no solver or job-specific research committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B12 Ticket to Ride USA data + longest path (R+C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B12-ttr-usa) | Added the B12 GitHub verification workflow; no map data or route solver is committed yet. | Workflow is infrastructure only; no project test results to report. | 2026-10-07 04:05 UTC — added .github/workflows/B12.yml. |
| [B13 1,000 verified trivia questions (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B13-trivia-1000) | Reserved branch; no question set or source research committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B14 600 comedy prompts + 600 "most likely to" (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B14-comedy-prompts) | Reserved branch; no prompt set or job-specific research committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |
| [B16 12 accessible player colors (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B16-player-colors) | Added and adjusted the B16 verification workflow; no color palette or runtime files are committed yet. | Workflow is infrastructure only; no project test results to report. | 2026-10-07 04:12 UTC — adjusted .github/workflows/B16.yml for the expanded ZIP fallback layout. |
| [B17 40 original synthesized sound effects (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B17-sfx-40) | Added the B17 GitHub full-suite workflow; no sound files or synthesis tools are committed yet. | Workflow is infrastructure only; no project test results to report. | 2026-10-07 03:48 UTC — added .github/workflows/B17.yml. |
| [B20 Every other Jamboree mode, buildable specs (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B20-jamboree-modes) | Reserved branch; no job-specific research or deliverables committed. | Branch currently has no commits beyond main. | Branch comparison: 0 commits ahead of main; no changed files. |

## Review (8)

| Job | What seems to be worked on | Checks / open items | Latest evidence |
|---|---|---|---|
| [B01 Jamboree dice blocks + exact odds (R+C)](https://github.com/luisitin/partybox-gpt-drops/pull/8) | **Draft PR.** Exact dice distributions and odds engine for Jamboree, including conditional blocks and buddy combinations; includes source notes and research audit files. | Full three-seed GitHub Actions run succeeded: 30 suites per seed, exact tuple comparisons, Monte Carlo checks, and 75/75 planted bugs caught. Research remains partial: some game facts lack two independent source families, and independent blind authorship is unverified. | 2026-10-07 04:25 UTC — delivery commit; [successful Actions run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37571394669). |
| [B02 Board movement odds engine (C)](https://github.com/luisitin/partybox-gpt-drops/pull/4) | Exact BigInt-rational board movement and expected pass-through visit engine, with separate reference implementations and a full verification suite. | GitHub Actions succeeded on all three seeds. Evidence includes 2.16 million exact comparisons, 150 million simulated trajectories, and 75/75 mutation kills. Blind independent authorship is not established; modeling assumptions are documented in the PR. | 2026-10-07 04:05 UTC — engine delivery; [successful Actions run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37569828557). |
| [B05 Turn flow, exact strings, bonus stars (R)](https://github.com/luisitin/partybox-gpt-drops/pull/9) | **Draft research PR.** Adds a phased turn-flow draft, 95 claims/gaps, bonus-star and Homestretch data, short sourced string excerpts, schema, and validator. | Structural checks pass, but strict research acceptance is explicitly **NOT MET**: only 22/95 facts have two-source support, 3/9 bonus criteria do, complete string/timeline coverage is missing, and no independent second researcher is claimed. | 2026-10-07 04:26 UTC — research draft commit; no green full research acceptance is claimed. |
| [B10 Battleship probability-density AI (C)](https://github.com/luisitin/partybox-gpt-drops/pull/6) | **Draft PR.** Implements Easy/Medium/Hard play, exact and sampled joint-fleet density, a separate policy oracle, benchmarks, mutation checks, and evidence reports. | The hosted GitHub Actions run has now completed successfully. The local full run still records three calls above the 50 ms maximum (one Medium, two Hard); those failures were not waived. Blind independent authorship is also unverified. | 2026-10-07 04:16 UTC — final delivery commit; [successful hosted run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37570775482). |
| [B11 Rummikub validator + best play (C)](https://github.com/luisitin/partybox-gpt-drops/pull/7) | **Draft PR.** Exact table/transition validation and best rack play for the documented English Classic rule profile, with separate reference solver and mutation/evidence files. | Full local and hosted CI suites passed, including all 75 mutation kills and measured calls below the 500 ms limit. Blind independent authorship is not met; the exhaustive small-position oracle covers up to 14 total tiles, not all large states. | 2026-10-07 04:24 UTC — solver delivery; [successful Actions run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37571347764). |
| [B15 120 original SVG game icons (C)](https://github.com/luisitin/partybox-gpt-drops/pull/10) | 120 individually committed original SVG icons, a dependency-free TypeScript lookup, inventory, checksums, and a downloadable verification ZIP with raster previews and evidence. | Three-seed hosted CI succeeded. Reported gates include 1,196 SVG cases and 7,140 silhouette pairs per size, plus 75/75 mutation kills. Blind independent authorship and an independent human recognition study are unverified. | 2026-10-07 04:44 UTC — icon delivery; [successful Actions run and artifact](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37572974708). |
| [B18 Tiny spring + easing library (C)](https://github.com/luisitin/partybox-gpt-drops/pull/5) | Pure TypeScript spring motion and CSS cubic-Bezier easing, with numerical reference implementations, seeded boundary/fuzz checks, and recorded results. | Hosted CI passed. Evidence includes one million Bezier reference comparisons per seed and 75/75 mutation kills. Blind independent authorship is not met; documented numerical domain limits still apply. | 2026-10-07 04:07 UTC — verification evidence commit; [successful Actions run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37569974594). |
| [B19 Player-name filter (C)](https://github.com/luisitin/partybox-gpt-drops/pull/2) | Bounded TypeScript name filter plus a structurally different bitset-NFA reference, generated obfuscation cases, corpus snapshots, policy records, and mutation tests. | Generated cases, differential checks, and 75/75 mutations passed. Latest hosted run **failed** because one measured call took 0.060363 ms, above the strict 0.05 ms maximum. Blind independent authorship and universal unseen-name coverage are unverified. | 2026-10-07 04:12 UTC — final verification snapshot; [failed Actions run](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37570385902). |

## Completed (0)

_None._
