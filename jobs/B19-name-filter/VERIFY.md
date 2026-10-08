# B19 verification ledger

## Current exact measured trie adoption, October 8

Current production source SHA256 is
`41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d`.
This is exactly the measured prefix-trie candidate. It retains the external
suggestion keys and three exact benign spellings. Every original policy byte,
reference, 459 fixed case, 43,830-input per-seed workload, original timing
sample, 100,000-call warmup, seed and individually timed 0.05 ms gate remains.

The unchanged full `npm test` on this genuinely changed source has not run yet.
Fresh exact-head hosted acceptance and the mandatory post-green full KEEP
rerun are pending. PR #23 remains draft. Earlier local 43/19/28 timing failures
and historical post-green 31/28/11 failures remain preserved below.

### Current strict build and mutation readiness

One `npm run build` from jobs/B19-name-filter passed strict TypeScript
(case1, shared setup), command exit0 at21:14:38.142896 UTC. Actual production
compiled SHA25634b70d1cd10ded50d5edd85e6061e6eb2b6054b244284ed1bbe41f38c405170c
matches the original measured candidate.

The supplemental command
`node .work/B19-production-acceptance/mutation-anchor-check.mjs`
passed3 actual assertion controls, shared setup, at21:17:00.409 UTC; command
exit0 at21:17:00.424769 UTC. M15/M19/M25 each parse and execute, fail fixed
behavioral truth via actual AssertionError, and have one unique anchor.
The first helper selected Bob for M25; original minimum-length pruning kept
that3-character input safe even in the mutant, so the control attempt failed.
Its source/tool output remains preserved; only the supplemental witness was
corrected to the existing benign case Bobby. The original full mutation suite
and production did not change. These controls do not substitute for all75
original mutant checks. See results/trie-adoption-readiness-20261008/.

### Complete measured candidate evidence

Evidence directory: `results/prefix-trie-diagnostic-20261008/`.
The original command paths are `.work/B19-trie-candidate/`; archived copies
were not executed at their new paths. Strict compile passed one case, shared
setup, with exact command
`node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-trie-candidate/tsconfig.json`.
Its command naturally exited 0 at 20:51:19.715634 UTC.

Behavioral comparison naturally CLOSED at 20:51:36.306 UTC: all 214,308 cases
pass full current result/suggestion/frozen/wrapper agreement, both references,
and recorded expected truth. Original cases total 131,490. All 243 actual
start/end source guards match. The default-gzip diagnostic sizes are
5,010/3,686 bytes; the full required command independently checks level-9 gzip.

| Test | Cases | Passed | Seed | Exact observed command from repository root |
| --- | ---: | ---: | ---: | --- |
| original | 43830 | 43830 | 1 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-policy | 1296 | 1296 | 1 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-ranges | 1422 | 1422 | 1 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| length-boundaries | 24873 | 24873 | 1 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| added-name-bypasses | 15 | 15 | 1 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| original | 43830 | 43830 | 2 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-policy | 1296 | 1296 | 2 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-ranges | 1422 | 1422 | 2 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| length-boundaries | 24873 | 24873 | 2 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| added-name-bypasses | 15 | 15 | 2 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| original | 43830 | 43830 | 3 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-policy | 1296 | 1296 | 3 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| Unicode-ranges | 1422 | 1422 | 3 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| length-boundaries | 24873 | 24873 | 3 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |
| added-name-bypasses | 15 | 15 | 3 | `node .work/B19-trie-candidate/exact-harness.mjs equivalence` |

One balanced ABBA/BAAB diagnostic naturally CLOSED at 21:00:57.928 UTC,
command exit 0 at 21:00:57.976145 UTC. Exact command:
`node .work/B19-trie-candidate/exact-harness.mjs timing`.
All 24 measured 500,000-call phases, 12 million calls, original seeded sample
hashes, output sinks, GC events, and unchanged 243 start/end guards are retained.
The three aggregate improvements are 35.7596%, 37.9846% and 29.6573%; all six
individual ABBA/BAAB blocks favor the candidate. No phase was filtered.
These totals establish private mixed-workload gain; they are not the literal
10,000 individually timed-call acceptance result at any seed.

### UNVERIFIED

Current full original acceptance, exact new-head hosted CI/artifact, and the
required post-green full KEEP rerun remain pending. Supplemental M15/M19/M25 actual assertion controls pass; the newly changed
source must still execute every original mutant and demonstrate actual
behavioral disagreements across all three original seeds.
All original finite-policy/corpus conflicts, unseen-input/language limits,
historical failures and unknown timing causes remain disclosed.


## Historical restored-protocol review before trie adoption, October 8

At restored-protocol heads d1e72a3 and 5155180, production was the external693d9501 module, with its three added exact exceptions
and stable suggestion keys retained. The corrected original workload preserves
48 timed positive names,289 original fixed exceptions,459 handwritten inputs
and43,830 complete differential/mutation inputs perseed. New feature checks
are separate. The timer window,100,000-call warmup,10,000timed calls,
seeds1–3,0.05ms limit and every original corpus byte remain unchanged.

Command: npm test. Actual local run 2026-10-08T16:54:26.156921+00:00 to 2026-10-08T16:54:44.534384+00:00
completedEXIT1. All100 suites execute. Only latency fails:43/19/28 outliers,
maxima6.040182/1.243285/0.507256ms. All fresh receipts and observed source
bytes are in results/corrected-original-workload-20261008/. Actual observed
196-file integrity passed before the archive expanded the current manifest.

The mandatory post-green old2b54431 KEEP rerun also failed31/28/11timings;
its complete91-suite receipts remain separatelyhistorical in
results/postgreen-keep-20261008/. That old source is not current-source proof.

Actual native complete logs were read:2b54431 run37809073933SUCCESS(91suites),
303f4f0 run37810714023FAILURE(94),0974951 run37810885025FAILURE(94), and
ccc610f run37811077768SUCCESS(94). The external94-suite variants include
three added positive names and six additional baseline inputs; their timing
samples differ. No green status transfers to a new head or restored protocol.

Weakest-five review and stop status are in requirement-review.json. KEEP is
incomplete; remaining latency work is substantive. No unchanged timing retry,
threshold waiver, source/toolBLOCKED state or finished cosmetic round is claimed.

### Every corrected-protocol suite, seed and exact command

| Test | Cases | Passed | Failed | Seed | Exact command |
| --- | ---: | ---: | ---: | --- | --- |
| public-corpus-acquisition | 1 | 1 | 0 | shared setup | `node tests/run.mjs` |
| retained-original-snapshot-offline-and-corruption | 8 | 8 | 0 | 1 | `python3 tests/retained-snapshot.py` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 1 | `node tests/run.mjs` |
| failure-suggestions-map-and-frozen | 5 | 5 | 0 | 1 | `node tests/run.mjs` |
| additional-given-names-and-exception-bypass | 30 | 30 | 0 | 1 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 1 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 1 | `tsc -p tsconfig.json --noEmit` |
| length-pruned-matcher-blind-boundaries | 24873 | 24873 | 0 | 1 | `node tests/run.mjs` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 1 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1371 | 1371 | 0 | 1 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1296 | 1296 | 0 | 1 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1422 | 1422 | 0 | 1 | `node tests/run.mjs` |
| generated-obfuscations | 5000 | 5000 | 0 | 1 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20000 | 20000 | 0 | 1 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10000 | 10000 | 0 | 1 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2000 | 2000 | 0 | 1 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| original-workload-policy-and-counts | 6 | 6 | 0 | 1 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43830 | 43830 | 0 | 1 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43830 | 43830 | 0 | 1 | `node tests/run.mjs` |
| repeat-call-purity | 43830 | 43830 | 0 | 1 | `node tests/run.mjs` |
| boolean-wrapper | 43830 | 43830 | 0 | 1 | `node tests/run.mjs` |
| mutation-baseline-truth | 43830 | 43830 | 0 | 1 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 1 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 1 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10000 | 9957 | 43 | 1 | `node tests/run.mjs` |
| retained-original-snapshot-offline-and-corruption | 8 | 8 | 0 | 2 | `python3 tests/retained-snapshot.py` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| failure-suggestions-map-and-frozen | 5 | 5 | 0 | 2 | `node tests/run.mjs` |
| additional-given-names-and-exception-bypass | 30 | 30 | 0 | 2 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 2 | `tsc -p tsconfig.json --noEmit` |
| length-pruned-matcher-blind-boundaries | 24873 | 24873 | 0 | 2 | `node tests/run.mjs` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 2 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1371 | 1371 | 0 | 2 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1296 | 1296 | 0 | 2 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1422 | 1422 | 0 | 2 | `node tests/run.mjs` |
| generated-obfuscations | 5000 | 5000 | 0 | 2 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20000 | 20000 | 0 | 2 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10000 | 10000 | 0 | 2 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2000 | 2000 | 0 | 2 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| original-workload-policy-and-counts | 6 | 6 | 0 | 2 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43830 | 43830 | 0 | 2 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43830 | 43830 | 0 | 2 | `node tests/run.mjs` |
| repeat-call-purity | 43830 | 43830 | 0 | 2 | `node tests/run.mjs` |
| boolean-wrapper | 43830 | 43830 | 0 | 2 | `node tests/run.mjs` |
| mutation-baseline-truth | 43830 | 43830 | 0 | 2 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 2 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 2 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10000 | 9981 | 19 | 2 | `node tests/run.mjs` |
| retained-original-snapshot-offline-and-corruption | 8 | 8 | 0 | 3 | `python3 tests/retained-snapshot.py` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| failure-suggestions-map-and-frozen | 5 | 5 | 0 | 3 | `node tests/run.mjs` |
| additional-given-names-and-exception-bypass | 30 | 30 | 0 | 3 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 3 | `tsc -p tsconfig.json --noEmit` |
| length-pruned-matcher-blind-boundaries | 24873 | 24873 | 0 | 3 | `node tests/run.mjs` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 3 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1371 | 1371 | 0 | 3 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1296 | 1296 | 0 | 3 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1422 | 1422 | 0 | 3 | `node tests/run.mjs` |
| generated-obfuscations | 5000 | 5000 | 0 | 3 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20000 | 20000 | 0 | 3 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10000 | 10000 | 0 | 3 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2000 | 2000 | 0 | 3 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| original-workload-policy-and-counts | 6 | 6 | 0 | 3 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43830 | 43830 | 0 | 3 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43830 | 43830 | 0 | 3 | `node tests/run.mjs` |
| repeat-call-purity | 43830 | 43830 | 0 | 3 | `node tests/run.mjs` |
| boolean-wrapper | 43830 | 43830 | 0 | 3 | `node tests/run.mjs` |
| mutation-baseline-truth | 43830 | 43830 | 0 | 3 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 3 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 3 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10000 | 9972 | 28 | 3 | `node tests/run.mjs` |

### UNVERIFIED

The restored-protocol d1e72a3 and 5155180 hosted passes are historical after
trie adoption. New-source complete acceptance remains pending. A finite pass does
not establish a hardware-independent maximum or explain an observed outlier.
All existing finite-policy,corpus-selection,unseen-name and language limits
remain. Other-session PartyBox integration paths have not been rechecked here.

## Historical ledgers retained below

The complete functional, corpus-policy, independent differential and mutation
suites passed for seeds 1, 2 and 3. **The unchanged literal 0.05 ms per-observation
latency gate failed locally. This is an incomplete acceptance result.**

Exact command: `npm test` from this job directory, expanding to
`npm run build && node tests/run.mjs`. No corpus suite was skipped. The final
source and full measured reports are committed in `results/optimization-width-latin1/`; earlier failures remain in `results/` and `results/optimization-ascii-word/`. New runs write
`reports/latest/`. Clean local `npm ci --ignore-scripts --no-audit --no-fund`
succeeded. The source compiler and each seed's repeated strict no-emit check
use the pinned TypeScript 5.8.3 package.

Runtime SHA256: `124dce60c560faf5c101be03e0d24856f7bcbd293b5bcecbd0ad4d0b2e93502b`.

Sealed blind reference SHA256: `40449357a616619cc649d6b8efab2f6664a187de178511b8b0f17e28e92eea9a`.

Executed environment: `{"node": "v24.19.0", "platform": "linux", "arch": "x64", "cpu": "INTEL(R) XEON(R) PLATINUM 8573C", "unicode": "17.0"}`.

## Every executed suite, seed and exact command

The acquisition setup verifies every pinned source and output digest, and
selects all 20,000 names, 10,000 words and 2,000 places without moderation-based
exclusion. Reviewed-policy passed counts include explicitly retained rejections;
they are not all-allowed counts. Every differential input is also checked
against the sealed reference; none is replaced with a sample.

| Test | Cases | Passed | Failed | Seed | Exact command |
| --- | ---: | ---: | ---: | --- | --- |
| public-corpus-acquisition | 1 | 1 | 0 | shared setup | `node tests/run.mjs` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 1 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 1 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 1 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 1 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1,371 | 1,371 | 0 | 1 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1,296 | 1,296 | 0 | 1 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1,422 | 1,422 | 0 | 1 | `node tests/run.mjs` |
| generated-obfuscations | 5,000 | 5,000 | 0 | 1 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20,000 | 20,000 | 0 | 1 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10,000 | 10,000 | 0 | 1 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2,000 | 2,000 | 0 | 1 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 1 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43,830 | 43,830 | 0 | 1 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43,830 | 43,830 | 0 | 1 | `node tests/run.mjs` |
| repeat-call-purity | 43,830 | 43,830 | 0 | 1 | `node tests/run.mjs` |
| boolean-wrapper | 43,830 | 43,830 | 0 | 1 | `node tests/run.mjs` |
| mutation-baseline-truth | 43,830 | 43,830 | 0 | 1 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 1 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 1 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 1 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10,000 | 9,995 | 5 | 1 | `node tests/run.mjs` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 2 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 2 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1,371 | 1,371 | 0 | 2 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1,296 | 1,296 | 0 | 2 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1,422 | 1,422 | 0 | 2 | `node tests/run.mjs` |
| generated-obfuscations | 5,000 | 5,000 | 0 | 2 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20,000 | 20,000 | 0 | 2 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10,000 | 10,000 | 0 | 2 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2,000 | 2,000 | 0 | 2 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 2 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43,830 | 43,830 | 0 | 2 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43,830 | 43,830 | 0 | 2 | `node tests/run.mjs` |
| repeat-call-purity | 43,830 | 43,830 | 0 | 2 | `node tests/run.mjs` |
| boolean-wrapper | 43,830 | 43,830 | 0 | 2 | `node tests/run.mjs` |
| mutation-baseline-truth | 43,830 | 43,830 | 0 | 2 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 2 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 2 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10,000 | 9,989 | 11 | 2 | `node tests/run.mjs` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 3 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 3 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1,371 | 1,371 | 0 | 3 | `node tests/run.mjs` |
| precompiled-Unicode-policy-context-differential | 1,296 | 1,296 | 0 | 3 | `node tests/run.mjs` |
| precompiled-printable-width-and-latin1-context-differential | 1,422 | 1,422 | 0 | 3 | `node tests/run.mjs` |
| generated-obfuscations | 5,000 | 5,000 | 0 | 3 | `node tests/run.mjs` |
| names-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| names-reviewed-corpus-policy | 20,000 | 20,000 | 0 | 3 | `node tests/run.mjs` |
| names-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| words-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| words-reviewed-corpus-policy | 10,000 | 10,000 | 0 | 3 | `node tests/run.mjs` |
| words-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| places-count-and-uniqueness | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| places-reviewed-corpus-policy | 2,000 | 2,000 | 0 | 3 | `node tests/run.mjs` |
| places-reviewed-baseline-no-stale-entries | 1 | 1 | 0 | 3 | `node tests/run.mjs` |
| regex-vs-bitset-NFA-differential | 43,830 | 43,830 | 0 | 3 | `node tests/run.mjs` |
| sealed-blind-reference-differential | 43,830 | 43,830 | 0 | 3 | `node tests/run.mjs` |
| repeat-call-purity | 43,830 | 43,830 | 0 | 3 | `node tests/run.mjs` |
| boolean-wrapper | 43,830 | 43,830 | 0 | 3 | `node tests/run.mjs` |
| mutation-baseline-truth | 43,830 | 43,830 | 0 | 3 | `node tests/run.mjs` |
| 25-real-executed-mutations | 25 | 25 | 0 | 3 | `node tests/run.mjs` |
| runtime-gzip-size | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 | 0 | 3 | `node tests/run.mjs` |
| latency-every-observed-check-under-005ms | 10,000 | 9,991 | 9 | 3 | `node tests/run.mjs` |

## Independent reference and complete behavioral results

The independent author read only the original B19 instructions, repository
README, supplied public contract and `data/policy.json` before authoring and
sealing `tests/blind/reference.mjs`. The author did not inspect production,
existing tests/references or prior PR descriptions during authoring.
`tests/blind/AUTHORING.md`, `SELFCHECK.json` and `SEALED-SHA256SUMS.txt` retain
provenance, 1,000 passed author self-checks and the original reported hashes.
Production inspection and integration began after sealing; the reference stayed
unchanged. The original bitset-NFA is a supplemental reference and is not
asserted to have blind authorship.

- All 43,830 inputs per seed agree with the sealed reference: **131,490 complete
  independent comparisons, zero disagreements**. The historical NFA also
  agrees on every case. This includes all 32,000 corpus inputs, generated
  obfuscations, fixed/Scunthorpe/exception cases, declared single-glyph mappings
  and Unicode fuzz.
- Each seed has 5,000 unique generated in-domain obfuscations, covering all 63
  terms: **15,000 total, zero misses**. Generator replay is byte-identical.
- All 1,371 declared single-glyph substitutions and all 289 exact benign
  exceptions are exercised at every seed. Original required repeats are
  preserved; Bob/boob and ambiguous i/l have explicit regressions.
- Each seed allows **19,989/20,000 Census names, 9,951/10,000 words, and
  1,943/2,000 places**. Retained rejections are 11 names, 48 lexical words, one
  overlength word and 57 overlength places. All originals and explanations
  remain in `data/kept-rejections.json`; actual per-seed rejection reports are
  delivered in `results/`. Zero unexpected rejections and zero stale reviewed
  rows were observed. No entry was dropped, changed or silently truncated.

## Size, dependencies and source optimization

Source: **9,912 bytes / 4,239 gzip bytes**. Emitted runtime: **8,220 bytes / 3,225 gzip bytes**. Both gzip artifacts are gated at 6,000 bytes, level 9.

Runtime has zero dependencies, imports, ambient RNG or clocks. It adds no
result cache or benchmark-specific path. Printable ASCII avoids unnecessary
Unicode normalization/replacement. Plain ASCII words enter the matcher without
building a new mapped string. Character-property regexes are compiled once at
module initialization, and one scan handles forward and reversed patterns.
A private table compiled at module initialization contains NFKD expansions,
mapping results and letter/number classification for declared glyphs, case
variants, printable fullwidth ASCII, Latin-1 and known ignorable formats. Those inputs avoid repeated normalization
and mark/format replacement. Other Unicode keeps the original fallback.
Whole-string lowercasing preserves contextual Greek final sigma; only
Case_Ignorable marks/formats may be removed before that operation. No names or
filter results are cached. All original policy decisions and guards retain the
complete differential and mutation checks above. An additional 1,296 mixed
character/context cases per seed agree with the sealed reference: 3,888 passed
checks, including Greek sigma and fallback boundaries. A further 1,422 independent contexts per seed exercise every one of the 158 extra compiled range code points: 4,266 additional passed checks. Both supplemental suites use the original sealed reference without changing its source or the original differential suite counts.

## Literal latency results in milliseconds

| Seed | Calls | Mean | p50 | p99 | Maximum | Above 0.05 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10000 | 0.001119125 | 0.000616000 | 0.004343000 | 0.154320000 | 5 |
| 2 | 10000 | 0.001075296 | 0.000546000 | 0.004276000 | 0.582158000 | 11 |
| 3 | 10000 | 0.001004105 | 0.000541000 | 0.004139000 | 0.227552000 | 9 |

Each seed warms 100,000 calls and measures 10,000 seeded mixed inputs, using the
original unchanged timer window around the call and result access. No outlier
is discarded or retimed. No average or percentile substitutes for the maximum.
Inputs, indices and times for all measured failures are collected only after
measurement and retained in `results/optimization-width-latin1/benchmark-seed*.json`; all earlier attempt reports remain delivered. Outlier witnesses
include ordinary ASCII names as well as obfuscated Unicode strings.

A separate `node --trace-gc tests/run.mjs` diagnostic retained GC events and
slow-input witnesses; it was not substituted for the full `npm test` result.
The direct invocation exposed an ambient tsc-path dependency in the old harness;
the harness now invokes the pinned compiler through Node, so complete direct
invocations also use the correct compiler. The profile does not establish a
hardware-independent bound or prove the cause of every timing outlier.

Historical failures remain in `LOOP.md` and their original result files. The ASCII-letter-only predecessor failed 19/21/12 calls, with maxima 0.470704/0.480532/0.196494 ms. The new finite-range compilation failed 5/11/9 calls. These observations are separate measurements, not a controlled attribution of the difference or a waiver of either failure. The first optimized hosted run,
https://github.com/luisitin/partybox-gpt-drops/actions/runs/37637661735,
failed only latency: one 0.065583 ms call in seed 1 and one 0.308360 ms call in
seed 3; seed 2's maximum was 0.013380 ms. Later source improvements do not erase
those observed failures. PR #2 records the inspected final-head hosted result.

## All 25 actual executed mutations

Each mutant replaces one unique emitted-code anchor, parses/imports successfully,
and executes the complete baseline-passing case set. A baseline failure or
syntax/import error cannot count as a kill. All 25 mutations were caught in
all three seeds: **75 executed kills, zero survivors**. Source digests, numbers
of disagreements and first witnesses are retained in each delivered mutation
report. The normalization and reversed-scan anchors were updated to the actual
optimized expressions while preserving the same deliberate bugs.

| ID | Deliberate bug | First seed-1 witness | Caught seeds |
| --- | --- | --- | --- |
| M01 | Remove lowercasing | `"Lana"` | 1, 2, 3 |
| M02 | Lose compatibility normalization | `"\uff53\uff45\uff58"` | 1, 2, 3 |
| M03 | Keep combining marks | `"s\u0301ex"` | 1, 2, 3 |
| M04 | Keep zero-width format characters | `"s\u200bex"` | 1, 2, 3 |
| M05 | Treat spaces as letter barriers | `"s e x"` | 1, 2, 3 |
| M06 | Treat dots as letter barriers | `"s.e.x"` | 1, 2, 3 |
| M07 | Drop zero-to-o mapping | `"p0rn"` | 1, 2, 3 |
| M08 | Drop one ambiguity mapping | `"d1ck"` | 1, 2, 3 |
| M09 | Drop three-to-e mapping | `"s3x"` | 1, 2, 3 |
| M10 | Drop four-to-a mapping | `"4nal"` | 1, 2, 3 |
| M11 | Drop five-to-s mapping | `"5ex"` | 1, 2, 3 |
| M12 | Drop seven-to-t mapping | `"7wat"` | 1, 2, 3 |
| M13 | Drop at-sign mapping | `"@nal"` | 1, 2, 3 |
| M14 | Drop dollar-sign mapping | `"$ex"` | 1, 2, 3 |
| M15 | Resolve ambiguous one only as i | `"c1it"` | 1, 2, 3 |
| M16 | Drop Cyrillic e mapping | `"s\u0435x"` | 1, 2, 3 |
| M17 | Drop Greek epsilon mapping | `"s\u03b5x"` | 1, 2, 3 |
| M18 | Disable reversed scan | `"Titus"` | 1, 2, 3 |
| M19 | Disable repetition at single letters | `"Bonner"` | 1, 2, 3 |
| M20 | Delete a blocked lexicon entry | `"fuck"` | 1, 2, 3 |
| M21 | Use substring rather than whole-word exceptions | `"Hancocksex"` | 1, 2, 3 |
| M22 | Admit 17 code points | `"abcdefghijklmnopq"` | 1, 2, 3 |
| M23 | Reject exactly 16 code points | `"\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28"` | 1, 2, 3 |
| M24 | Silently delete unmapped letters | `"s\u4e2dex"` | 1, 2, 3 |
| M25 | Forget required original double letters | `"Bob"` | 1, 2, 3 |

## Packaging and hosted CI

`SHA256SUMS.txt` covers all delivered source, documentation and measured report
files plus `../../.github/workflows/B19.yml`, excluding itself and generated
`reports/latest`, `dist`, `node_modules` and the separately snapshot-locked
corpus cache. `sha256sum -c SHA256SUMS.txt` verifies the final delivery.

The scoped read-only Ubuntu workflow uses actions/* major pins and a 30-minute
timeout. It performs clean `npm ci --ignore-scripts --no-audit --no-fund`, runs
the full `npm test`, and uploads fresh reports/corpora even on failure. There is
no continue-on-error. The PR description gives the observed exact final head,
run URL and actual conclusion. A green link is asserted only for a run GitHub
reports successful, and cannot erase separately recorded local failures.

## UNVERIFIED and unmet acceptance requirements

- The literal all-name/all-word/all-place allowance target is not fulfilled.
  Identical-string conflicts such as Lana/reversed anal and Bonner/repeated
  boner, actual blocked words and overlength inputs remain rejected with
  per-row explanations. Reviewed-policy passes do not imply universal allowance.
- The 0.05 ms maximum is not fulfilled by the final local measurements. A hard
  real-time wall-clock bound on arbitrary hardware, scheduler or garbage
  collection conditions is not established.
- All languages, slang, Unicode lookalikes, intent and unseen adversarial
  transformations are not exhaustively verified. This is the explicit finite
  English policy and declared transformations.
- Zero unseen-name false positives are not established. Exact exceptions were
  refined on these corpora, so this is regression coverage, not held-out evidence.
- The historical 5,000-given-plus-distinct-surname selection is not a certified
  current combined U.S. top-20,000 ranking; selection and sources are disclosed.
- Future availability of identical upstream snapshots is not guaranteed.
  Changed hashes fail closed; the retained cache reproduces the measured data.

## October 8 length-pruning continuation: incomplete acceptance

The source-bound command `npm ci --ignore-scripts --no-audit --no-fund &&
npm test` completed EXIT1 at approximately15:52UTC. Complete receipts are in
`results/resume-length-pruning/`; no original receipt was overwritten.
Runtime source SHA256:
`5371665d9df3721f5b4d6d4c923120d2944fa3ae396008c74ca80006a03e25e9`.
All88 suites executed; the only3 failed suite rows are the unchanged literal
latency gate. Original131,490 sealed comparisons,15,000 obfuscations and75
real mutants pass. Added24,873 short/term-boundary comparisons pass at each of
seeds1,2,3 (74,619 total), without changing the original43,830-input workloads.
Source/runtime gzip4477/3358bytes, each below6000. Corpora, guards, purity and
strict types pass with all original counts.

| Seed | Calls | Above0.05ms | Maximum ms | Passed |
| --- | ---: | ---: | ---: | ---: |
| 1 | 10000 | 36 | 0.472961 | 9964 |
| 2 | 10000 | 8 | 0.246780 | 9992 |
| 3 | 10000 | 16 | 0.456415 | 9984 |

The bounded instrumentation report is separate in
`results/resume-witness-diagnostic/` and
`results/resume-length-pruning-diagnostic/`. Original fixed-witness full
matcher23–29ms/500,000 calls versus eligible matcher11–15ms supports skipping
impossible patterns. Whole-filter fixed-witness measurements show only a small
gain; the full mixed attempt still fails. Timer-only controls also record long
observations; GC/CPU sampling does not establish any historical outlier cause.
Neither diagnostic is an acceptance pass. Exact-head hosted CI is pending.

## Fresh hosted failure and exact offline corpus restoration

Actual current-head run37804648793 at b7709fe completedFAILURE15:55:24UTC.
Its complete28,579-byte decoded log was read. It executed61suite rows: corpus
acquisition failed because pinned GeoNames bytes changed; therefore sealed
comparisons were only11,830 perseed and prescribed corpora did not execute.
Seed1 also failed literal latency: one0.050564ms observation; seed2/3 maxima
0.026660/0.033302ms. No incomplete hosted run is called a full pass.
Source-bound summary: results/resume-length-pruning/hosted-current.json.

The exact retained original32,000-row cache is now delivered, matching every
original snapshot-lock digest. Command `python3 tests/retained-snapshot.py`
passed8/8 checks in each of3deterministic repetitions (24/24,0network calls):
real clean restoration, exact hashes/counts, verified cache reuse, changed byte,
missing corpus, missing manifest, changed manifest, valid-but-truncated JSON,
and corrupt existing cache. The original lock/rows/counts remain unchanged.
Fresh hosted npmtest will run these at each originalseed and then all corpora.

The private lowercasing candidates were not installed. All37,005 mixed input
comparisons matched the sealed reference; all timing/GC receipts and exact
harnesses remain in results/rejected-ascii-allocation/,
results/ascii-scan-allocation-diagnostic/ and
results/ascii-scan-balanced-diagnostic/. Balanced single-scan mixed totals
509.47/525.65/519.58ms baseline versus509.76/535.22/555.13ms candidate did not
show a whole-call gain. Runtime source remains5371665d, and its prior complete
local literal-latency failures still stand. No unchanged local full retry was
performed for this packaging fix; exact new hosted checks are pending.

## Current complete hosted replay, still failed literal latency

https://github.com/luisitin/partybox-gpt-drops/actions/runs/37807137561 at exact
b3f5231 completedFAILURE2026-10-08T16:14:08Z. The actual complete59,313-character
decoded job log was read. The snapshot fix restores all91suite rows, all32,000
original corpus entries and43,830sealed comparisons perseed;24snapshot tests,
156checksums,75mutants,15,000obfuscations and74,619added length boundaries pass.
Only literal latency fails: maxima0.045157/0.015059/0.063416ms;0/0/1outliers.
The seed3witness is index6880,5-codepoint mixed knownUnicode. Source-bound
actual-log summary is results/retained-snapshot-checks/current-hosted.json.
No artifact bytes or additional raw timings were independently downloaded.

Two further known-character candidates also remain rejected. Lazy string
building and a compiled policy proof that replacements are unchanged retain
39,728independent contextual agreements each, but balanced mixed500,000-call
batches do not establish a consistent whole-call speed gain. All reports,
private code and exact scripts are in results/known-plain-{lazy,regex}-diagnostic/.
The first regex diagnostic had a private-harness String.replace substitution
error before import/measurements. Its exact failed harness/metadata remains
results/known-regex-diagnostic-harness-error/; callback replacement corrected
only the diagnostic. No production defect or acceptance attempt occurred.

Production is frozen at source5371665d absent a justified general improvement.
No failed receipt is deleted, no timing gate/count/warmup/seed is changed, and
no unchanged local full rerun is used to hunt a passing observation.

## Polish pass 2026-10-08 (Claude, cloud)

Scope: fetch and reconcile the branch, check hosted CI, probe real names, add two product changes
(stable `suggestion` keys on failures; exact given-name exceptions `analia`, `analise`, `sexto`), and
write INTEGRATION.md. The matching, timer windows, counts, seeds and mutation anchors are unchanged. Source
SHA256 moved from `5371665d…` to `693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f`.

**Branch reconciliation.** `git fetch origin` did not refresh `job/B19-name-filter`. An explicit
`git fetch origin +refs/heads/job/B19-name-filter:refs/remotes/origin/job/B19-name-filter` found three
commits from another session (`b7709fe`, `b3f5231`, `2b54431`), scoped to this job. Fast-forwarded with
`git merge --ff-only`; nothing rewritten.

**Hosted CI (read-only, GitHub MCP).**
- Run `37809073933` on head `2b5443136b94e2fca3bff07285cd53a531c5a0b9`: `success`, full mode, 91 suites,
  `failures: []`, latency 10,000/10,000 on each seed; maxima 0.046337 / 0.037950 / 0.022141 ms.
- Run `37807137561` on `b3f5231`: `failure` (seed 3 latency, 0.063416 ms). Superseded by `2b54431`.
- The PR body still describes `b3f5231` as the head and cites the older failure. It was not edited.

**Local, before the source change (`2b54431`, shared 4-CPU box).** `npm run test:core`: every behavioral suite
passed; latency failed (9 / 9 / 11 calls above 0.05 ms; maxima 8.9 and 4.4 ms). The hosted pass and this local
failure are the same source on different hardware. The gate was not changed.

**Real-name probes** (built `dist/nameFilter.js`, `scratchpad/B19/probe.mjs`):
- Blocked before, now `ok`: `Analia`, `Analía` (through `anal`), `Analise`, `Sexto` (through `sex`).
- Still `ok`: `Dickens`, `Cumming`, `Cummings`, `Scunthorpe`, `Penistone`, `Analisa`, `Sexton`, `Titus`,
  `Titania`, `Essex`, `Hancock`, `Dickinson`, `Chinook`, `Matthias`, `Mohammed`, `Iñigo`, `Ólafur`.
- Still blocked by design: `Dick` (a documented collision), `Clitheroe`, `Gookin`, `Cumbia`, `Cumbre`,
  `Cumulus`, `Cocksure`, `Testicles`, `Sexy`, `Boob`, `Anal`.
- Spanish profanity passes (gap, not changed): `Puta`, `Pendejo`, `Joder`, `Mierda`, `Culo`, `Verga`,
  `Maricón`, `Cabrón`, `Coño`, `Polla`, `Zorra`, `Pajero`.

**Product change 1: suggestion keys.** `NameReason` and `NameSuggestion` types; failures carry
`suggestion`. New suite `failure-suggestions-map-and-frozen` (5 cases per seed).

**Product change 2: exact exceptions.** `analia`, `analise`, `sexto` added to `SAFE` and to `data/policy.json`
(now 292, sorted; source set equals policy set). A first edit dropped two trailing spaces and merged tokens
(`analoganalogies`, `sextonsextuple`), which the policy-copy check caught; repaired and rechecked: 292/292.
Three names added to the handwritten `positive` list.

**Commands and results (final source).**

| Command | Result |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | added 1 package (TypeScript 5.8.3 only) |
| `npm run test:core` (after the repair) | every behavioral row passes: handwritten 465/465, exceptions, glyph and Unicode differentials, 5,000 obfuscations (0 misses), `failure-suggestions-map-and-frozen` 5/5, 25/25 mutations; failing rows: delivery checksum (stale manifest until regeneration) and latency only |
| `npm test` (full, final source `693d9501…`, 52 s) | 94 suite rows; `public-corpus-acquisition` passed; failing rows exactly 6: `delivery-file-size-and-checksums` ×3 (stale manifest before regeneration, see below) and `latency-every-observed-check-under-005ms` ×3 (passed 9,994 / 9,993 / 9,992 of 10,000; 6 / 7 / 8 calls above 0.05 ms on this box) |
| `(cd tests/blind && sha256sum -c SEALED-SHA256SUMS.txt)` | `reference.mjs`, `selfcheck.mjs`, `AUTHORING.md`, `SELFCHECK.json`: all OK |
| `git diff --quiet HEAD -- tests/blind` | unchanged (the sealed reference file itself) |
| runtime gzip (final) | source 4,691 B, compiled 3,419 B (limit 6,000) |
| `npm test` then `reports/latest/SHA256SUMS.txt` copied to `SHA256SUMS.txt` | manifest regenerated after the last content edit; delivery checksums checked in the core rerun below |

**Honest notes.**
- The sealed reference reads `data/policy.json`, which gained three exact exceptions. Its code is unchanged;
  the policy input changed. This is recorded in POLICY.md, CONFLICTS.md (item 11) and INTEGRATION.md (gap 8).
- The latency gate remains literal and unchanged. It fails on this loaded box (6–14 calls per seed across
  runs) and passes on the idle GitHub runner. Not a hard real-time guarantee.
- The hosted run for the new head (the commit that adds this section) has not been read yet at the time of
  writing. The result is in the final record, not here.

**UNVERIFIED.** Spanish profanity and slurs (no lexicon; see INTEGRATION.md gap 1). Spanish given names beyond
the three added. Confusables outside the finite table. The 0.05 ms gate on any machine other than the
GitHub runner.

**Hosted result for the pushed head `303f4f0` (recorded after the push).** Run `37810714023` (workflow
`B19 Player-name filter`, pull_request): `failure`. The only failing row was
`latency-every-observed-check-under-005ms` on seed 1 (9,997 / 10,000; 3 calls above 0.05 ms: `celebration`
0.093244 ms, `simultaneously` 0.065843 ms, `кnAW` 0.052819 ms). Seeds 2 and 3 passed 10,000 / 10,000
(maxima 0.025307 and 0.049913 ms). The runner's `delivery-file-size-and-checksums` rows passed on all seeds,
and `FINAL_SUMMARY` reports `mode: full`, `suites: 94`. The same source family passed on `2b54431`
(run 37809073933, 10,000 / 10,000 on every seed). So the literal gate is nondeterministic on the hosted runner
too. The run was not repeated to hunt a pass. Local and hosted runs disagree on the same kind of input; no
cause is proven. The gate remains literal and unchanged.

**Hosted results for the two later heads (recorded at the final push).** `303f4f0` run 37810714023 and
`0974951` run 37810885025 are both `failure`. In each run the only failing row is the literal latency gate on
seed 1 (9,997 and 9,999 of 10,000; max 0.093 and 0.054 ms). Seeds 2 and 3 pass, and so do the checksum and all
behavioral rows. Source is the same (`693d9501…`) for both. Caveat: the benchmark samples its inputs from the
`positive` list, and this pass added three names to it, so the seed-1 sample changed. The runs are not a clean
comparison with the earlier green run on `2b54431` (source `5371665d…`, run 37809073933). Whether the source
change causes the seed-1 outliers is not established. The gate was not changed and no run was repeated to get a
pass.

## Restored original-workload hosted acceptance, October8

Actual head `d1e72a38524c9292319f5405bcc405fff09cebe1`, run `37813059491`,
job `113434580260`: full `npm test` SUCCESS at16:59:51UTC. The actual61,239-character
job log was read. All100 suites, three original43,830-input comparisons,15,000
obfuscations,75 real mutants,24 retained-snapshot controls,90 separate new-name
checks,18 original-protocol guards and227 delivery hashes pass. The original
benchmark sinks are94721/93467/94479; each10,000-call observed sample has zero
outliers, with maxima0.048922/0.024586/0.037194ms. Production source remains
`693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f`.

The genuine artifact11566575269 is2,906,746bytes, ZIP SHA256
`d33f7e9e0d0d547b028c348ab069ceb5d23134fa75730310ea6c5275b9ef690c`.
Independent extraction/structural/byte validation passed989 assertions;
its retained receipt specifies exact source/workload and verification scope.
The original local43/19/28 timing failures and older post-green KEEP failure
remain failures. The artifact includes recorded summaries/outliers rather than
all individual call times; those times were not independently recomputed.

**UNVERIFIED.** Original KEEP is unfinished; no only-cosmetic stopping point,
universal0.05ms guarantee, timing cause, or new-checkpoint green status is claimed.
