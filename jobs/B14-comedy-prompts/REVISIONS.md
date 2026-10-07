# Authoring revisions

## Batch 013 before independent handoff

Commit `bdd92bd` contained 1,300 candidate rows, but draft validation failed:
Q0621 was a fill prompt without `___`. The command sequence incorrectly
continued to commit and push after that failure. The prior validated milestone
was 1,200 rows at `7160e6b`. No independent reviewer received the invalid
batch 013 handoff.

The original authored TSV, grade-free input, and seal are preserved verbatim in
`superseded/013-v1/`. The invalidated input SHA256 was `f4405aa46390b6c48adde124e07c9ce483c036534dfa6bcba25e459a5a2598b5`;
the original first-author TSV SHA256 was `a03d8c1844f24a96c2f4631e0a4396d9ec1f15c88db66b4da6cc645f29cbcd8a`.
The first author rewrote and regraded Q0621, retaining the old grade/reason in
the archive. The batch was resealed only after documenting this invalidation;
any later second review must use the new hash.

The serializer now checks genre structure before writing a seal. The corrected
batch will receive complete independent grading with no reuse of an old grade.
