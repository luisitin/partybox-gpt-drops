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

## UNVERIFIED

- Remaining 819 authored rows.
- Fresh assessment of two independent sources supporting every factual claim.
- Row-specific confidence judgments.
- Fresh adversarial disproof attempts on every row.
- Second full pass reopening both sources for every row.
- All similarity >0.8 flags and their actual resolutions.
- Difficulty and correct-index balance, option uniqueness and length-bias reports.
- Full 1,000-row JSON Schema validation and recorded validator output.
- Final checksum verification and final GitHub delivery.

No source candidate, search snippet, structural scaffold or absent review is
reported as an accepted question or passed research gate.
