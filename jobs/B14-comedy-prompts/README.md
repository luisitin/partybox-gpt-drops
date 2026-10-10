# B14: 600 comedy prompts + 600 most-likely prompts

`prompts.json` is the final adult-party fiction pack: 600 fill-in-the-blank
prompts and 600 most-likely prompts, each at most 90 Unicode characters.
Every selected row was graded 4 or 5 by both its author and a fresh independent
reviewer. The complete 1,500+1,500 original candidate pool, every low grade and
all grading reasons remain in `candidates.json`, `batches/` and `grading/`.

The combined final pack has 630 canonical named references, at most three
appearances each across both genres. `named-reference-audit.json` and
`editorial-review.json` record the actual names visible in each selected row;
`similarity-resolutions.json` explains every retained pair above 0.75 similarity.
The full original pool also receives an exhaustive pair scan, comparing both
argument directions because SequenceMatcher can be order-sensitive.

Install the pinned validator and rerun all checks:

```sh
python3 -m pip install -r requirements.txt
npm test
```

`npm test` reruns every original-pool pair comparison, the final selection
checks and the file manifest. It uses no randomness; seeds are not applicable.
`npm run build` serializes hand-authored TSVs and refuses to modify sealed
batches. It never writes jokes or assigns grades. `npm run checksums` rebuilds
the manifest only when deliberately publishing a changed artifact.

`prompts.schema.json` validates the final import file; `candidates.schema.json`
validates the full candidate pool. Confidence describes editorial agreement,
not factual reliability or an audience playtest: high means two grades of 5,
medium means two grades of at least 4. The rejected pool also contains low
confidence records in `candidate-confidence.json`.

All scenarios, quoted fictional labels and imagined dialogue are original
fiction. Cultural references do not assert real incidents, endorsements,
product features, or misconduct. Read `SOURCES.md` and `ASSUMPTIONS.md` for
that scope. Humor was independently reviewed, but has not been audience-tested.
