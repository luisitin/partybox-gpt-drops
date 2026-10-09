# B13 next steps (after the 2026-10-08 polish pass)

All 1,000 held rows, their reviews and the hosted acceptance are unchanged. The original full local checker needs the author's `.work/` bodies and cannot run in a fresh clone. Delivery stays unmerged for maintainer review. Never merge or push main.

**Exact next step.** The owner's desktop agent ports the content following [INTEGRATION.md](INTEGRATION.md): run `scripts/to-partybox.py`, merge into `games/lightning-round/content/`, then run the verify commands. First decide these four points. None requires editing a held row.

1. Spanish: keep the 949 kept rows English-only (list them under `dropped`), or commission a translation.
2. Fun facts: add an optional `funFact` field to the lightning-round schema (needs an ADR and a reveal-screen change), or keep `funfacts.json` as a sidecar.
3. Roman numerals read letter by letter (27 kept rows, 39 strings, for example "Louis XVI" → "X V I"): fix with per-item pronunciations or an SDK rule.
4. Review `partybox/overlap-candidates.json` (481 pairs) and the subcategory defaults (490 rows) before the merge.

**Author work (a separate fresh review is required; affected row-bound acceptance is invalidated; preserve the held versions):**

- B13-0110: distractors 1,430 / 430 / 4,430 m orbit the correct 2,430 m. Rewrite the distractors, then reread and reopen.
- B13-0846 and B13-0889: distractor words appear in the stem. Reword the stem.
- B13-0074 and B13-0427: difficulty labels are doubtful. Reviewer calibration.
- B13-0137, 0158, 0337, 0514 and 0911: the answer appears in the question. Already excluded for PartyBox; rewrite and re-add only if the owner wants them.
- 46 duplicate rows (32 same-fact, 14 state-capital) of PartyBox bank items: excluded for PartyBox, no author action needed unless the owner wants rewrites.

**Checks to repeat after any change:**

```
mkdir -p .work && python3 scripts/check-data.py --output .work/checks.json
sha256sum --check SHA256SUMS.txt
python3 scripts/verify-guard-fixtures.py .
python3 scripts/to-partybox.py --self-test
```

Regenerate `SHA256SUMS.txt` and `reports/delivery-inventory.json` after every change to a delivered file.
