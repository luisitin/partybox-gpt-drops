# Verification ledger

The authoritative executed ledger is generated as `reports/latest/summary.json`: every suite records its name, case count, passed count, seed, and exact command. This document will be updated with the PR execution results.

## Local core execution

Command: `npm run test:core` (strict TypeScript build, then `node tests/run.mjs --core`). Seeds: 1, 2, 3.

Generated obfuscations: 5,000 per seed, misses = 0 in all three runs after the mapping correction. All 25 executed mutants were killed per seed. Handwritten cases and the declared single-glyph substitution sweep passed. Local per-observation latency had outliers over 0.05 ms, so the strict timing gate failed.

## UNVERIFIED

- The public 20,000-name, 10,000-word, 2,000-place corpora have not yet been run in the local offline environment; the full PR workflow fetches and tests them without silently substituting synthetic data.
- Blinded independent authorship: both implementations were written in one session, although their matching algorithms differ and neither calls the other.
- Universal slur/sexual-term coverage, all Unicode homoglyphs, all languages, intent classification, unseen obfuscations, and hard real-time behavior on every machine.
- A green GitHub Actions run has not yet been observed. A failing run will not be relabeled as green.
