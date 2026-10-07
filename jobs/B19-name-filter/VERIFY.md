# B19 verification ledger

The complete functional, corpus-policy, independent differential and mutation
suites passed for seeds 1, 2 and 3. **The unchanged literal 0.05 ms per-observation
latency gate failed locally. This is an incomplete acceptance result.**

Exact command: `npm test` from this job directory, expanding to
`npm run build && node tests/run.mjs`. No corpus suite was skipped. The final
source and full measured reports are committed in `results/`; new runs write
`reports/latest/`. Clean local `npm ci --ignore-scripts --no-audit --no-fund`
succeeded. The source compiler and each seed's repeated strict no-emit check
use the pinned TypeScript 5.8.3 package.

Runtime SHA256: `679235b2f6b3eed9c002d5f3c4d83e4ecae43f87a450351bea8ea2baf2fa0405`.

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
| latency-every-observed-check-under-005ms | 10,000 | 9,978 | 22 | 1 | `node tests/run.mjs` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 2 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 2 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 2 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 2 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1,371 | 1,371 | 0 | 2 | `node tests/run.mjs` |
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
| latency-every-observed-check-under-005ms | 10,000 | 9,992 | 8 | 2 | `node tests/run.mjs` |
| delivery-file-size-and-checksums | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| immutable-return-values | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 | 0 | 3 | `node tests/run.mjs` |
| strict-TypeScript | 1 | 1 | 0 | 3 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 | 0 | 3 | `node tests/run.mjs` |
| handwritten-format-and-Scunthorpe | 459 | 459 | 0 | 3 | `node tests/run.mjs` |
| exhaustive-declared-single-glyph-substitution | 1,371 | 1,371 | 0 | 3 | `node tests/run.mjs` |
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
| latency-every-observed-check-under-005ms | 10,000 | 9,987 | 13 | 3 | `node tests/run.mjs` |

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

Source: **6,838 bytes / 3,186 gzip bytes**. Emitted runtime: **5,897 bytes / 2,572 gzip bytes**. Both gzip artifacts are gated at 6,000 bytes, level 9.

Runtime has zero dependencies, imports, ambient RNG or clocks. It adds no
result cache or benchmark-specific path. Printable ASCII avoids unnecessary
Unicode normalization/replacement. Plain ASCII words enter the matcher without
building a new mapped string. Character-property regexes are compiled once at
module initialization, and one scan handles forward and reversed patterns.
All original policy decisions and guards retain the complete differential and
mutation checks above.

## Literal latency results in milliseconds

| Seed | Calls | Mean | p50 | p99 | Maximum | Above 0.05 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 10000 | 0.003667145 | 0.000847000 | 0.005783000 | 3.485158000 | 22 |
| 2 | 10000 | 0.001489924 | 0.000635000 | 0.003996000 | 3.132775000 | 8 |
| 3 | 10000 | 0.002425181 | 0.000642000 | 0.004188000 | 3.852742000 | 13 |

Each seed warms 100,000 calls and measures 10,000 seeded mixed inputs, using the
original unchanged timer window around the call and result access. No outlier
is discarded or retimed. No average or percentile substitutes for the maximum.
Inputs, indices and times for all measured failures are collected only after
measurement and retained in `results/benchmark-seed*.json`. Outlier witnesses
include ordinary ASCII names as well as obfuscated Unicode strings.

A separate `node --trace-gc tests/run.mjs` diagnostic retained GC events and
slow-input witnesses; it was not substituted for the full `npm test` result.
The direct invocation exposed an ambient tsc-path dependency in the old harness;
the harness now invokes the pinned compiler through Node, so complete direct
invocations also use the correct compiler. The profile does not establish a
hardware-independent bound or prove the cause of every timing outlier.

Historical failures remain in `LOOP.md`. The first optimized hosted run,
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
