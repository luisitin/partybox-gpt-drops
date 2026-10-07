# B14 comedy prompts

This branch is an authoring milestone, not a finished 600+600 prompt pack.
The required pool is 1,500 original fill-in-the-blank candidates and 1,500
original most-likely candidates. Each candidate receives a specific first-author
grade and reason. A fresh independent reviewer must grade every candidate before
the final 600 of each kind can be selected.

`batches/*.tsv` contains hand-authored wording and grades; `npm run build` only
converts those rows to JSON. It neither writes jokes nor assigns grades.
`review-input.json` deliberately omits first-pass grades and reasons.

Install Python dependencies with `python3 -m pip install -r requirements.txt`.
Use `npm run build`, `npm run check:draft`, and finally `npm test`.
The last command requires the complete pool and completed independent grading.

Every scenario is original fiction. Named references supply cultural context;
the pack does not assert real misconduct by any person or organization.
See `VERIFY.md` for measured checks and outstanding requirements.
