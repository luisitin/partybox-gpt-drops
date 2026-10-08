# B13 — 1,000 verified trivia questions

**What this is:** 1,000 four-option trivia questions for US adult players: 10 categories × 100, difficulty 1–3, each row backed by two source quotations, shipped as JSON with a JSON Schema.
**How to use it:** the hosted checker re-validates every row (`python3 scripts/check-data.py --output .work/checks.json`); `python3 scripts/to-partybox.py --out <dir>` writes the lightning-round content files for PartyBox (mapping and exclusions in [INTEGRATION.md](INTEGRATION.md)).
**Status:** delivered in PR #22, not merged. Hosted acceptance is green at commit `60293314`. Polish pass 2026-10-08 added the PartyBox adapter, 51 port-time exclusions and 5 flagged rows; the held rows are unchanged. The full local acceptance needs the author's retained `.work/` bodies and does not run in this clone.

## Quick start

```
cd jobs/B13-trivia-1000
python3 -m pip install -r requirements.txt
mkdir -p .work && python3 scripts/check-data.py --output .work/checks.json   # hosted acceptance, about 30 s, exit 0
sha256sum --check SHA256SUMS.txt
python3 scripts/verify-guard-fixtures.py .
python3 scripts/to-partybox.py --self-test
python3 scripts/to-partybox.py --out .work/partybox                          # PartyBox port files, 949 rows
```

`check-data.py` without `--output` overwrites `reports/checks.json`, the committed acceptance report. Use `--output` for scratch runs.
`--require-local-captures` needs the author's `.work/` bodies. It fails in a fresh clone (1,040 "required local body missing" messages), as recorded in [VERIFY.md](VERIFY.md).

## Data shape

- `categories/<slug>.json`: arrays of rows, ten files. Row fields: `id` (`B13-0001`…`B13-1000`), `category`, `question`, `difficulty` (1 easy, 2 medium, 3 hard), `options` (exactly 4, distinct), `correctIndex`, `correctAnswer`, `funFact`, `confidence` and `confidenceReason`, `sources` (exactly 2: `sourceId`, `url`, `publisher`, `quote`, plus optional `funFactQuote` and `extraQuote`), `claims`.
- `trivia.schema.json`: JSON Schema for one row (the full array is 1,000 items).
- `scripts/to-partybox.py`: pure mapping to PartyBox's lightning-round shape. The held rows are never edited.
- `partybox/`: port decisions. `exclusions.json` has 51 excluded ids with reasons and 5 flagged rows; `overlap-candidates.json` is a review queue; `fit-summary.json` is the port's counts; `validate-with-partybox.ts` runs PartyBox's own schema and speech reader.

## Product vs evidence

- **Product:** `categories/`, `trivia.schema.json`, `scripts/to-partybox.py`, `partybox/`, `requirements.txt`.
- **Evidence (keeps the held rows provable, not needed by a port):** `evidence/`, `reviews/`, `research/`, `reports/`, `SOURCES.md`, `CONFLICTS.md`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`, `CONTRACT.md`, `SHA256SUMS.txt`.

## Known limits

Hosted acceptance proves the quotations match the retained receipts and that the review records exist. It does not prove the facts. Difficulty labels are a reasoned audience judgment with no playtest. Spanish text does not exist. Speech and distractor issues are listed in [INTEGRATION.md](INTEGRATION.md). Full copyrighted source bodies are not in this repo. [SOURCES.md](SOURCES.md) lists every selected quote, [CONFLICTS.md](CONFLICTS.md) records disagreements, and [NEXT.md](NEXT.md) names the open editorial work. No GitHub main changes or merges are made.
