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

## Latest authoring milestone — 2026-10-07T18:33:45.906638+00:00

Exact command: `python3 scripts/check-data.py --draft --exclude-in-progress music`.
The recovered music draft is excluded from this publication snapshot while its author repairs23 unmatched quote fields and stale hashes; its actual failed run is preserved in `reports/music-recovery-failure.json`. Full acceptance forbids all category exclusions.
Deterministic data checks; seed n/a. Full output: `reports/checks.json`.

| Check | Cases | Passed |
|---|---:|---:|
| Authored rows against draft JSON Schema and row/index/source/hash checks | 310 | 310 |
| Quote fields present in actual hash-checked source bodies | 832 | 832 |
| Current fresh adversarial acceptances | 310 | 0 |
| Current second source-reopen reviews | 310 | 0 |
| Similarity >0.8 flagged pairs with concrete resolution | 2567 | 0 |

Category counts: us-geography: 100, world-geography: 1, science-space: 100, animals-nature: 33, us-history-civics: 0, world-history: 76, movies-tv: 0, music: 0, sports-games: 0, food-everyday-life: 0.

Quote matching demonstrates actual captured text presence. It does not replace
fresh review of claim support, source independence, ambiguity or distractors.
Root science100 is an authoring snapshot; US geography100 is being diversified.
The authoring team is completing disjoint ranges and reserving cross-author
review after final row-version hashes are held. Length metrics are in the report;
editorial assessment remains pending.

## UNVERIFIED

- Remaining 690 authored rows and final category balances.
- Fresh adversarial disproof attempts and source-independence/support review on all1,000 finalized rows.
- Second actual reopening of both source pages for every final row.
- Every retained similarity flag’s concrete editorial resolution.
- Final option-length editorial assessment and full1,000-row validator output.
- Final checksum verification and ready-for-review GitHub delivery.

Author milestones preserve unfinished evidence. No missing review or structural
scaffold is reported as a passed research gate.
