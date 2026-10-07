# Verification record

Draft checks cover only the rows actually authored and never establish completion
of the required count or editorial work.

Historical failed check at commit `bdd92bd`: the exact command
`python3 scripts/verify.py --draft > results/draft.json` stopped at the fill-blank
assertion (650 fill rows inspected; 649 had a blank and Q0621 did not). Seed:
not applicable. That failed version and the fresh correction are preserved in
`REVISIONS.md` and `superseded/013-v1/`. The corrected 1,300-row check passed.

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
| JSON Schema / character limit / ID / genre checks | 2600 | 2600 | 0 | not applicable | `npm run check:draft` |
| Complete independent batch record and input-hash match | 2500 | 2500 | 0 | not applicable | `npm run check:draft` |

The independent-record check validates completeness and input identity; it does
not count low editorial grades as passing the humor rubric.

Sixth measured draft milestone: 300 candidates per genre, 600/600 structural
checks, maximum 90 characters. First-pass failures are retained alongside the
stronger rows; unsupported context and generic celebrity substitutions score
below 4 instead of entering the eligible pool automatically.

Seventh measured draft milestone: 350 candidates per genre and 700/700
structural checks, maximum 90 characters. New music references are fictional
performance briefs; no invented real lyrics or alleged real incidents are used.

Eighth measured draft milestone: 400 candidates per genre, 800/800 structural
checks, maximum 90 characters. Television premises are imagined episode briefs
and adult behavior; they do not claim the described episodes actually exist.

Ninth measured draft milestone: 450 candidates per genre, 900/900 structural
checks, maximum 90 characters. All 200 rows in independent batches 001-002 have
complete grade/reason records and matching input hashes. 120 received second
grades of 4+, and 118 meet that threshold in both passes. On these 200 reviewed
rows, exact-grade agreement is 33.5% and keep-threshold agreement is 59%.

Tenth measured draft milestone: 500 candidates per genre, 1,000/1,000 structural
checks, maximum 90 characters. All 400 rows in independent batches 001-004 have
complete grade/reason records and matching input hashes. 288 received second
grades of 4+, and 284 meet that threshold in both passes. On these 400 reviewed
rows, exact-grade agreement is 37.25% and keep-threshold agreement is 71.5%.

Eleventh measured draft milestone: 550 candidates per genre, 1,100/1,100 structural
checks, maximum 90 characters. The exact current independent counts and
agreement rates remain in `results/draft.json`.

Twelfth measured draft milestone: 600 candidates per genre, 1,200/1,200 structural
checks; 400 independent reviews are validated, with 284 meeting 4+ in both passes.
The complete measured partial rates are retained in `results/draft.json`.

Measured milestone 013: 650 candidates per genre, 1,300/1,300 structural
checks, maximum 90 characters. 400 independent rows validated;
284 meet 4+ in both passes. Exact-score agreement is
37.25%; threshold agreement is
71.5% on reviewed rows only.

Measured milestone 014: 700 candidates per genre, 1,400/1,400 structural
checks, maximum 90 characters. 400 independent rows validated;
284 meet 4+ in both passes. Exact-score agreement is
37.25%; threshold agreement is
71.5% on reviewed rows only.

Measured milestone 015: 750 candidates per genre, 1,500/1,500 structural
checks, maximum 90 characters. 600 independent rows validated;
420 meet 4+ in both passes. Exact-score agreement is
36%; threshold agreement is
71.6667% on reviewed rows only.

Measured milestone 016: 800 candidates per genre, 1,600/1,600 structural
checks, maximum 90 characters. 600 independent rows validated;
420 meet 4+ in both passes. Exact-score agreement is
36%; threshold agreement is
71.6667% on reviewed rows only.

Measured milestone 017: 850 candidates per genre, 1,700/1,700 structural
checks, maximum 90 characters. 700 independent rows validated;
501 meet 4+ in both passes. Exact-score agreement is
36.5714%; threshold agreement is
73.1429% on reviewed rows only.

Measured milestone 018: 900 candidates per genre, 1,800/1,800 structural
checks, maximum 90 characters. 800 independent rows validated;
586 meet 4+ in both passes. Exact-score agreement is
37.5%; threshold agreement is
74.875% on reviewed rows only.

Measured milestone 019: 950 candidates per genre, 1,900/1,900 structural
checks, maximum 90 characters. 1100 independent rows validated;
766 meet 4+ in both passes. Exact-score agreement is
38.3636%; threshold agreement is
74.3636% on reviewed rows only.

Measured milestone 020: 1000 candidates per genre, 2,000/2,000 structural
checks, maximum 90 characters. 1500 independent rows validated;
1021 meet 4+ in both passes. Exact-score agreement is
40.3333%; threshold agreement is
73.7333% on reviewed rows only.

Measured milestone 021: 1050 candidates per genre, 2,100/2,100 structural
checks, maximum 90 characters. 1800 independent rows validated;
1197 meet 4+ in both passes. Exact-score agreement is
40.6667%; threshold agreement is
73.4444% on reviewed rows only.

Measured milestone 022: 1100 candidates per genre, 2,200/2,200 structural
checks, maximum 90 characters. 2000 independent rows validated;
1282 meet 4+ in both passes. Exact-score agreement is
40.2%; threshold agreement is
72.35% on reviewed rows only.

Measured milestone 023: 1150 candidates per genre, 2,300/2,300 structural
checks, maximum 90 characters. 2200 independent rows validated;
1403 meet 4+ in both passes. Exact-score agreement is
40.1364%; threshold agreement is
71.9545% on reviewed rows only.

Measured milestone 024: 1200 candidates per genre, 2,400/2,400 structural
checks, maximum 90 characters. 2200 independent rows validated;
1403 meet 4+ in both passes. Exact-score agreement is
40.1364%; threshold agreement is
71.9545% on reviewed rows only.

Measured milestone 025: 1250 candidates per genre, 2,500/2,500 structural
checks, maximum 90 characters. 2400 independent rows validated;
1536 meet 4+ in both passes. Exact-score agreement is
40.375%; threshold agreement is
72.0417% on reviewed rows only.

Measured milestone 026: 1300 candidates per genre, 2,600/2,600 structural
checks, maximum 90 characters. 2500 independent rows validated;
1608 meet 4+ in both passes. Exact-score agreement is
40.96%; threshold agreement is
72.56% on reviewed rows only.

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

- Independent batch 020 identified Q0997 and M0997 as references to the Morton
  Salt child mascot. Both scored 1. These sealed rejected drafts cannot enter the
  adult-only final pack unchanged; a changed current candidate needs a fresh
  second grade. This records a first-author editorial miss.
- Final canonical aggregation must merge Kraft mac and cheese with Kraft and
  Ninja appliances with Ninja, and Reese's Puffs with Reese's. Known mappings are in `named-reference-aliases.json`;
  the complete alias audit remains pending.
- The independent reviewer also flagged Q1040's explicit Wendy's child-mascot
  reference. It cannot enter unchanged; Wendy's restaurant service references
  are distinct from a scene involving the child mascot.

- The 1,500+1,500 candidate pool is not yet complete.
- Independent second grading is complete for batches 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025 only, not all 3,000 rows.
- Final 600+600 selection, agreement rates, near-duplicate resolution, and the
  named-reference cap have not yet been established.
- Adult-only content and no-slur editorial review remains pending.
- Hosted CI has not run for this job's content.
- Humor grades describe editorial judgment, not an audience playtest.
