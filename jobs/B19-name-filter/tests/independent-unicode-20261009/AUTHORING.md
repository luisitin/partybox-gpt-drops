# Independent B19 reference authorship

This implementation was authored independently in
`/tmp/B19-independent-reference-20261009`. The complete adopted external input
list, selected byte counts, and SHA-256 identities are in `provenance.json`.
Those inputs are public requirements and public policy, not implementation,
reference, test, corpus, or evidence code. No code or cases authored by another
author were opened. The selfchecks were authored here from the declared domain,
finite public lexicon, public exact exceptions, public mappings, and their
direct combinations.

An optional authorized README extraction looked for a Markdown heading containing
`contract`. It found none. No README content was displayed, snapshotted, adopted,
or used to author implementation or selfchecks. This attempted read is explicitly
recorded in provenance as an extraction attempt with no adopted bytes.

The input domain checks run in order: type; original Unicode-codepoint length;
C0/C1 including DEL, lone surrogates, and the Unicode Bidi_Control set; NFKD;
whole-string lowercase; Unicode mark and format removal; trimming; the presence
of a Unicode letter or number; whole exact exceptions; declared alias mapping;
punctuation/symbol/separator removal; substring matching in both directions.
Mapping is after normalization, and the policy group spellings are not themselves
renormalized into a different group. The `#` group key denotes the ambiguous
`1`/`|` mapping; it does not make a literal `#` an alias.

The matcher retains each original run's minimum count and admits extra repeats.
It carries all possible run boundaries so that neighboring `i` and `l` runs can
share different assignments of ambiguous tokens without losing valid matches.
Unknown characters divide the mapped sequence into separate matching segments.
Unknown letters/numbers are barriers by the public contract. **Additional
explicit assumption:** every other unmapped category not already removed by the
documented normalization or P/S/Z rules is also a matching barrier. In particular,
private-use and unassigned characters are not silently deleted to join otherwise
separated letters. This is the requested conservative finite-scope interpretation.

The public polish policy adds failure suggestions. The inferred reason-to-suggestion
mapping is `type` → `use-text`, `length` → `shorten`, `control` →
`remove-characters`, `empty` → `add-letters`, and lexical `blocked` →
`choose-another`. The lexical reason name `blocked` is the straightforward
interpretation of the declared blocking contract, since the permitted policy
text explicitly names the other reasons but does not give a lexical reason key.

`createReference(policy)` returns a frozen object exposing frozen `nameFilter`
and `isAllowedName` functions. Every result is frozen, and the policy is
snapshotted at construction. Filter calls contain no I/O, randomness, clocks, or
runtime dependencies. The selfcheck runner uses Node built-ins only to load the
authorized public policy snapshot, make assertions, and write its report.

Run `node selfcheck.mjs` or `npm test` from this directory. The selfchecks are
finite and untimed. They cover only their recorded actual cases and do not claim
the production implementation agrees, external corpus performance, hidden-case
success, a 0.05 ms bound, mutation coverage, GitHub CI, or complete B19 acceptance.
The seal covers the reference, selfchecks, report, authorship record, provenance,
package script, and authorized input snapshots. Nothing was pushed or written
to any repository, main branch, or claim record.

Actual finite closure: `node selfcheck.mjs` completed once with process exit code
0 and wrote `selfcheck-report.json` after all assertions succeeded: 4,784 cases,
63 public terms, 292 public exact exceptions, and zero failures. No source or
selfcheck change was necessary after this run. This closure refers only to the
independently authored selfchecks, not to other authors' tests or corpus results.
