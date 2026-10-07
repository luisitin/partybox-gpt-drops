# Verification record

Draft checks cover only the rows actually authored and never establish completion
of the required count or editorial work.

| Check | Cases | Passed | Failed | Seed | Exact command |
| --- | ---: | ---: | ---: | --- | --- |
| Draft JSON Schema validation | 100 | 100 | 0 | not applicable | `npm run check:draft` |
| Draft character length, ID uniqueness, genre format | 100 | 100 | 0 | not applicable | `npm run check:draft` |

Second measured draft milestone: 100 fill candidates and 100 most-likely
candidates, 200/200 JSON Schema and structural checks, maximum 86 characters.

Third measured draft milestone: 150 fill candidates and 150 most-likely
candidates, 300/300 JSON Schema and structural checks, maximum 87 characters.
Batch 003 applies the independent reviewer's feedback to concrete banking,
insurance, and adult drinking premises rather than generic product replacements.

Fourth measured draft milestone: 200 fill candidates and 200 most-likely
candidates, 400/400 JSON Schema and structural checks, maximum 90 characters.
The exact current validator output is retained in `results/draft.json`.

Fifth measured draft milestone: 250 fill candidates and 250 most-likely
candidates, 500/500 JSON Schema and structural checks, maximum 90 characters.
The current output is copied verbatim from `python3 scripts/verify.py --draft`
into `results/draft.json`; the npm alias runs the same validator.

| Current measured check | Cases | Passed | Failed | Seed | Exact command |
| --- | ---: | ---: | ---: | --- | --- |
| JSON Schema / character limit / ID / genre checks | 600 | 600 | 0 | not applicable | `npm run check:draft` |
| Complete independent batch record and input-hash match | 100 | 100 | 0 | not applicable | `npm run check:draft` |

The independent-record check validates completeness and input identity; it does
not count low editorial grades as passing the humor rubric.

Sixth measured draft milestone: 300 candidates per genre, 600/600 structural
checks, maximum 90 characters. First-pass failures are retained alongside the
stronger rows; unsupported context and generic celebrity substitutions score
below 4 instead of entering the eligible pool automatically.

At milestone 005, `npm run checksums` size-checked 36 files (largest 185,166
bytes), and `sha256sum -c SHA256SUMS.txt` passed all 35 listed file hashes.
These packaging checks do not establish content or editorial completion.

The strict release gate scans every selected pair using punctuation-insensitive,
lowercase `difflib.SequenceMatcher` character similarity with `autojunk=False`.
It compares both full wording and wording without the shared most-likely prefix.
Any ratio strictly above 0.75 requires an individual editorial resolution; stale
resolutions are rejected. This is a deterministic textual scan, not a claim of
exhaustive semantic duplicate detection. Final review also checks substantive
repetition and mechanical premise reuse.

Independent batch 001 grading was performed by the root coordinator without
opening first-pass scores or reasons. All 100 candidates have specific second
grades and reasons in `grading/pass2-001.json`; 65 received grade 4 or 5. Failed
grades remain in the record; 63 meet the 4+ threshold in both passes. Exact-grade
agreement was 41%, and agreement on the 4+ keep threshold was 63% for these 100
reviewed rows. These are partial-review rates, not complete-pool agreement.
The reviewer rejected broad bad-product setups and
identified two reference tags not explicitly present in the text (Q0007 and
Q0017); both scored below 4 and cannot enter the final pack unchanged.

Measured milestone: 50 fill candidates and 50 most-likely candidates; maximum
length 86 characters. All have individual first-author grades and reasons. This
does not meet the required 1,500 candidates of each kind.

The first grade-free batch is `review-inputs/001-household-names.json`. Authoring
and input seals are recorded in `seals/001-household-names.json`. The serializer
refuses to overwrite a batch whose authored wording, grades, or review input has
changed after sealing.

## UNVERIFIED

- The 1,500+1,500 candidate pool is not yet complete.
- Independent second grading is complete for batch 001 only, not all 3,000 rows.
- Final 600+600 selection, agreement rates, near-duplicate resolution, and the
  named-reference cap have not yet been established.
- Adult-only content and no-slur editorial review remains pending.
- Hosted CI has not run for this job's content.
- Humor grades describe editorial judgment, not an audience playtest.
