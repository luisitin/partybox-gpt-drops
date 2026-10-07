# B19 blind reference authoring record

This reference was authored in `/workspace/blind-b19` before production or
previous B19 test/reference source was inspected. No previous B19 PR description
was read. The author previously worked on B18, a separate spring/easing job.

The only B19 file read during this phase was the public policy data:
`/workspace/job-B19/jobs/B19-name-filter/data/policy.json`. The original B19
instructions were read from `/workspace/partybox-gpt-drops/PROMPTS.md`; the
repository root README had already been read for the separate B18 task.
The calling agent supplied the public normalization, result and guard contract
as plain text. No production source or generated test corpus was supplied.

`reference.mjs` exports `createReference(policy)`, returning frozen
`nameFilter(unknown)` and `isAllowedName(unknown)` functions. Result objects are
frozen. It contains no imports, dependencies, randomness or clocks.

The independent matching algorithm compiles each forward and reversed term into
a union of regular expressions. Each run requires at least the original number
of repeated letters; additional adjacent repeats are accepted. A synthetic
character represents an independently chosen i/l alternative for `1` and `|`.
Unmapped letters/numbers become barriers, while other unmapped characters are
ignored. Exceptions are applied to the folded, mark/format-stripped name before
aliases, and only when the entire normalized name matches a reviewed exception.

Guard order is type, original Unicode code point length, forbidden controls or
unpaired surrogates, then empty normalized content, then exact exception and
blocked-term matching. The original length limit is applied before trim or
compatibility normalization. C0/C1 and the explicitly supplied bidi-format ranges
are rejected; other Cf characters are removed during normalization.

`selfcheck.mjs` checks all policy terms, all policy exceptions and explicit
normalization, ambiguity, repeated-letter, barrier, reversal, control and guard
order fixtures. Actual counts are retained in `SELFCHECK.json`. These are blind
author self-checks; comparison with production and its full corpora begins only
after SHA256 seals are reported to the calling agent.
