# B13 — 1,000 verified trivia questions

Target: ten categories of 100 four-option questions, with two independent source
quotes for every answer and fun fact, followed by a fresh adversarial review and
second full reopening of sources. The original B13 prompt is the acceptance
contract; [CONTRACT.md](CONTRACT.md) fixes row/source formats and ownership.

Latest authoring milestone (2026-10-07T19:17:08.893321+00:00): 682 real authored rows across 9 category files; 2281/2281 quote fields matched against actual source captures; 0 schema/data errors; 60 current fresh adversarial acceptances and 60 current source-reopen reviews.
Research acceptance remains unfinished. Draft structural success is not a claim
of independently verified questions. Every similarity flag and incomplete review
remains visible in [reports/checks.json](reports/checks.json) and [VERIFY.md](VERIFY.md).

Files: `categories/` contains current rows; `evidence/` contains actual source
receipts and row-version evidence reads; `research/` records collection decisions;
[SOURCES.md](SOURCES.md) lists row quotations and URLs; [CONFLICTS.md](CONFLICTS.md)
records exclusions. Full copyrighted captures remain in ignored `.work/` locally.

Rerun: `python3 -m pip install -r requirements.txt`, then
`python3 scripts/check-data.py --draft`. Full acceptance command:
`python3 scripts/check-data.py`, which fails while required rows/reviews are absent.
Source collection uses actual body reads; search results alone are not evidence.
No files exceed 30 MB. [NEXT.md](NEXT.md) records the concrete next work.
