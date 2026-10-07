# Verification record

Draft checks cover only the rows actually authored and never establish completion
of the required count or editorial work.

| Check | Cases | Passed | Failed | Seed | Exact command |
| --- | ---: | ---: | ---: | --- | --- |
| Draft JSON Schema validation | 100 | 100 | 0 | not applicable | `npm run check:draft` |
| Draft character length, ID uniqueness, genre format | 100 | 100 | 0 | not applicable | `npm run check:draft` |

Measured milestone: 50 fill candidates and 50 most-likely candidates; maximum
length 86 characters. All have individual first-author grades and reasons. This
does not meet the required 1,500 candidates of each kind.

The first grade-free batch is `review-inputs/001-household-names.json`. Authoring
and input seals are recorded in `seals/001-household-names.json`. The serializer
refuses to overwrite a batch whose authored wording, grades, or review input has
changed after sealing.

## UNVERIFIED

- The 1,500+1,500 candidate pool is not yet complete.
- Independent second grading has not begun.
- Final 600+600 selection, agreement rates, near-duplicate resolution, and the
  named-reference cap have not yet been established.
- Adult-only content and no-slur editorial review remains pending.
- Hosted CI has not run for this job's content.
- Humor grades describe editorial judgment, not an audience playtest.
