# B13 verification

## Completed at initial contract milestone

| Check | Cases | Passed | Seed | Command / evidence |
|---|---:|---:|---|---|
| Original B13 prompt and repository rules read | 2 documents | 2 | n/a | PROMPTS.md B13; root README.md |
| Existing B13 work preserved | 1 branch/worktree | 1 | n/a | `git status --short`; branch `job/B13-trivia-1000`; no pre-existing B13 folder |
| Category/ID ranges specified | 10 ranges | 10 | n/a | CONTRACT.md, disjoint 100-ID ranges |

## First actual data milestone

Command: `python3 scripts/check-data.py --draft` (Python 3.12.14,
jsonschema 4.26.0). Actual output is retained in `reports/checks.json`.

| Check | Actual result |
|---|---:|
| Authored rows | 181/1,000 |
| Source ledger records | 12 |
| Quote fields matched to actual captured bodies | 363/363 |
| Schema/data errors | 0 |
| US geography initial balance | 100 rows; difficulties 34/33/33; positions 25/25/25/25 |
| Current fresh adversarial acceptance | 0/181 |
| Current second source-reopen review | 0/181 |
| Similarity >0.8 flagged pairs, unresolved | 2,566 |

The 79 science rows and two one-row categories are incomplete. Quote matching
checks actual text presence; the fresh reviewer must still challenge factual
support, source independence, wording, and distractors. Capital/year/unit
templates are a known diversity weakness and are being revised. Length metrics
are recorded with their editorial assessment pending.

## Latest authoring milestone — 2026-10-07T19:17:08.893321+00:00

Exact command: `python3 scripts/check-data.py --draft`.
All currently authored category files are checked, including repaired music. The earlier actual failed music recovery is preserved in `reports/music-recovery-failure.json`. No missing row or pending independent review is waived.
Deterministic data checks; seed n/a. Full output: `reports/checks.json`.

| Check | Cases | Passed |
|---|---:|---:|
| Authored rows against draft JSON Schema and row/index/source/hash checks | 682 | 682 |
| Quote fields present in actual hash-checked source bodies | 2281 | 2281 |
| Current fresh adversarial acceptances | 682 | 60 |
| Current second source-reopen reviews | 682 | 60 |
| Similarity >0.8 flagged pairs with concrete resolution | 2207 | 0 |

Category counts: us-geography: 100, world-geography: 15, science-space: 100, animals-nature: 100, us-history-civics: 0, world-history: 100, movies-tv: 100, music: 100, sports-games: 60, food-everyday-life: 7.

Quote matching demonstrates actual captured text presence. It does not replace
fresh review of claim support, source independence, ambiguity or distractors.
Root science100 and diversified US geography100 are authoring snapshots.
The authoring team is completing disjoint ranges and reserving cross-author
review after final row-version hashes are held. Length metrics are in the report;
editorial assessment remains pending.

## UNVERIFIED

- Remaining 318 authored rows and final category balances.
- Fresh adversarial disproof attempts and source-independence/support review on all1,000 finalized rows.
- Second actual reopening of both source pages for every final row.
- Every retained similarity flag’s concrete editorial resolution.
- Final option-length editorial assessment and full1,000-row validator output.
- Final checksum verification and ready-for-review GitHub delivery.

Author milestones preserve unfinished evidence. No missing review or structural
scaffold is reported as a passed research gate.
