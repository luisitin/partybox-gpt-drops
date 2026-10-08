# Preserved production versions

nameFilter-pre-ascii-word-path.ts is the original committed finite-policy-glyph
version (SHA-256 in PRE-ASCII-SHA256SUMS.txt); its actual failed measurements
remain in results/benchmark-seed*.json.

nameFilter-ascii-word-only.ts is the next general ASCII-letter shortcut, source
SHA-256 58c8fa49eb8a72522da4b13f41121a54c15b76bb6ca72f9b93bc8da561debace.
Its full failed local receipts remain in results/optimization-ascii-word/.

Current nameFilter.ts additionally compiles printable fullwidth ASCII and
Latin-1. Its own raw full receipts are in results/optimization-width-latin1/.
No historical failure or original sealed independent-reference source has been
rewritten. These are preserved algorithm versions, not alternative timing runs
used to select favorable results.

The October 7 source before mapped-length pruning is retained exactly as
`nameFilter-pre-length-pruning.ts` (SHA256
`124dce60c560faf5c101be03e0d24856f7bcbd293b5bcecbd0ad4d0b2e93502b`).
