# ChatGPT project pipeline

_Last refreshed: 2026-10-07 03:55 UTC_

This tracker covers the 20 jobs in [PROMPTS.md](PROMPTS.md). It reads branch commits, changed files, and pull-request notes from GitHub.

Live dashboard: https://partybox-project-tracker.artificiallysloppy.chatgpt.site

The notes below describe what the GitHub record suggests is being worked on. They are evidence from commits and pull requests, not a claim that a job has passed verification.

## Stage meanings

- **Pre-pipeline:** no job branch or pull request exists.
- **Pipeline:** a job branch exists, but its pull request is not open.
- **Review:** a pull request is open.
- **Completed:** a pull request has been merged.

**Current count:** 1 pre-pipeline, 18 pipeline, 1 in review, 0 completed.

## Pre-pipeline (1)

| Job | What seems to be worked on | Latest evidence |
|---|---|---|
| [B06 Jamboree CPU behaviour + cpuPolicy.ts (R+C)](https://github.com/luisitin/partybox-gpt-drops/blob/main/PROMPTS.md) | No branch or pull request exists yet. | No commit details available |

## Pipeline (18)

| Job | What seems to be worked on | Latest evidence |
|---|---|---|
| [B01 Jamboree dice blocks + exact odds (R+C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B01-jamboree-dice) | Added the job-specific GitHub verification workflow; no job deliverables are committed yet. | 2026-10-07T03:49:52Z — B01: add read-only full-suite PR verification workflow; files: .github/workflows/B01.yml |
| [B02 Board movement odds engine (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B02-board-odds) | Added the job-specific GitHub verification workflow; no job deliverables are committed yet. | 2026-10-07T03:48:23Z — B02: add isolated read-only verification workflow; files: .github/workflows/B02.yml |
| [B03 Every Jamboree minigame, catalogued (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B03-jamboree-minigames) | Branch exists; no change details were returned. | No commit details available |
| [B04 All Jamboree boards, space by space (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B04-jamboree-boards) | Branch exists; no change details were returned. | No commit details available |
| [B05 Turn flow, exact strings, bonus stars (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B05-jamboree-turn-flow) | Branch exists; no change details were returned. | No commit details available |
| [B07 Yahtzee exact optimal solver (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B07-yahtzee-optimal) | Branch exists; no change details were returned. | No commit details available |
| [B08 Monopoly exact landing odds + ROI (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B08-monopoly-markov) | Added the job-specific GitHub verification workflow; no job deliverables are committed yet. | 2026-10-07T03:45:53Z — B08: add isolated full-suite PR workflow; files: .github/workflows/B08.yml |
| [B09 Clue exact deduction engine (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B09-clue-solver) | Branch exists; no change details were returned. | No commit details available |
| [B10 Battleship probability-density AI (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B10-battleship-ai) | Project files committed: jobs/B10-battleship-ai/battleshipAI.ts; job-specific verification workflow also added | 2026-10-07T03:54:09Z — B10: implement exact and sampled joint-fleet Battleship AI; files: .github/workflows/B10.yml, jobs/B10-battleship-ai/battleshipAI.ts |
| [B11 Rummikub validator + best play (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B11-rummikub-solver) | Branch exists; no change details were returned. | No commit details available |
| [B12 Ticket to Ride USA data + longest path (R+C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B12-ttr-usa) | Branch exists; no change details were returned. | No commit details available |
| [B13 1,000 verified trivia questions (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B13-trivia-1000) | Branch exists; no change details were returned. | No commit details available |
| [B14 600 comedy prompts + 600 "most likely to" (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B14-comedy-prompts) | Branch exists; no change details were returned. | No commit details available |
| [B15 120 original SVG game icons (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B15-icons-120) | Branch exists; no change details were returned. | No commit details available |
| [B16 12 accessible player colors (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B16-player-colors) | Added the job-specific GitHub verification workflow; no job deliverables are committed yet. | 2026-10-07T03:50:37Z — B16: add full verification workflow with strict acceptance gate; files: .github/workflows/B16.yml |
| [B17 40 original synthesized sound effects (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B17-sfx-40) | Added the job-specific GitHub verification workflow; no job deliverables are committed yet. | 2026-10-07T03:48:32Z — B17: add read-only full-suite workflow on job branch; files: .github/workflows/B17.yml |
| [B18 Tiny spring + easing library (C)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B18-motion-ts) | Branch exists; no change details were returned. | No commit details available |
| [B20 Every other Jamboree mode, buildable specs (R)](https://github.com/luisitin/partybox-gpt-drops/tree/job/B20-jamboree-modes) | Branch exists; no change details were returned. | No commit details available |

## Review (1)

| Job | What seems to be worked on | Latest evidence |
|---|---|---|
| [B19 Player-name filter (C)](https://github.com/luisitin/partybox-gpt-drops/pull/2) | Project files committed: jobs/B19-name-filter/.gitignore, jobs/B19-name-filter/README.md, jobs/B19-name-filter/VERIFY.md, jobs/B19-name-filter/data/kept-rejections.json, jobs/B19-name-filter/data/policy.json, and 6 more; job-specific verification workflow also added PR says: Implements the bounded TypeScript name filter plus a structurally different bitset-NFA reference, 5,000 unique generated obfuscations per seed, 25 executed mutants per seed, public-corpus acquisition and checks, and a literal per-observation latency gate. All suites run at seeds 1, 2, 3 using npm test. Verification note: Local core runs block all 15,000 generated obfuscations and kill 25/25 mutants in all three seeds. The local strict 0.05 ms latency gate has observed outliers, so no complete pass is claimed. Full corpus results and the Actions link will be recorded after inspecting the execution. Clean-room independent authorship is UNVERIFIED: the reference is a separate algorithm but was written in the same session and shares policy data. Corpus collisions, unverified coverage, and performance failures will remain explicit in VE | 2026-10-07T03:50:44Z — B19: add full seeded differential, mutation, corpus and latency verification; files: .github/workflows/B19.yml, jobs/B19-name-filter/.gitignore, jobs/B19-name-filter/README.md, jobs/B19-name-filter/VERIFY.md, jobs/B19-name-filter/data/kept-rejections.json, jobs/B19-name-filter/data/policy.json, +6 more; [PR #2](https://github.com/luisitin/partybox-gpt-drops/pull/2) |

## Completed (0)

_None._
