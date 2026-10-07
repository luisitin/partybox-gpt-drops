# B13 — 1,000 verified trivia questions

Target: ten categories of 100 four-option questions, with two independent source
quotes for every answer and fun fact, followed by a fresh adversarial review and
a second full reopening of sources. See [CONTRACT.md](CONTRACT.md).

Current milestone: 181 real authored rows across four category files, with
363 quote fields matched against actual source captures and no schema/data
errors. Fresh adversarial review and source reopening remain 0/181. The 2,566
question pairs with normalized similarity >0.8 are retained for revision or
specific editorial resolution. See [reports/checks.json](reports/checks.json).

The branch initially contained only repository instructions, with no previous
B13 content to overwrite. These rows are an authoring milestone; they have not
completed the research acceptance gates.

Source collection begins with official institutional pages and independently
authored reference works. Searches discover candidates; only actual body reads
and supporting quotations qualify as evidence. See [VERIFY.md](VERIFY.md) for
actual completed checks and unfinished gates, and [NEXT.md](NEXT.md) for the next
concrete step. Authoring and review workers use disjoint category files.

The original B13 prompt is the acceptance contract. Progress commits preserve
work; they are not claims that all 1,000 questions or research gates have passed.

Draft checks: `python3 scripts/check-data.py --draft`. Full validation uses
`python3 scripts/check-data.py` and fails while required rows/reviews are absent.
