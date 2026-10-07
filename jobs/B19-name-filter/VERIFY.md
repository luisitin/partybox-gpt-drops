# B19 verification ledger

**Status: functional regression suite passes; the strict per-call latency requirement fails locally.**

Run: `npm test` from `jobs/B19-name-filter/`. This expands to `npm run build && node tests/run.mjs`; the build command is `tsc -p tsconfig.json`. All seeds are internal and mandatory. The table records the full local run of the final runtime implementation, before delivery-document sealing. The later tuple-only serialization of reviewed decisions does not change the runtime; the PR workflow reruns the complete final harness.

Runtime SHA-256: `858b265ffe53368e41b50bed4ccc0c0d37d9b12f3913abae2ce56dbe09b862a0`.
Reference SHA-256: `962bab309ddf9cc2d8ccc7237f782d69db6aa2b603417f1a8935c3d5b167b5f6`.
Environment: `{"node": "v22.16.0", "platform": "linux", "arch": "x64", "cpu": "INTEL(R) XEON(R) PLATINUM 8573C", "unicode": "16.0"}`.

## Every executed suite

Unless the command column overrides it, the exact suite command is `node tests/run.mjs` (via `npm test`); it runs all three seeds, not a single-seed subset. `Cases` is per seed. `Passed 1/2/3` preserves failures.

| Test name | Cases | Passed seed 1 / 2 / 3 | Command override |
|---|---:|---|---|
| public-corpus-acquisition (setup) | 1 | 1 (shared setup; cached corpus digests checked) | `python3 scripts/fetch-data.py` |
| delivery-file-size-and-checksums | 2 | 2 / 2 / 2 |  |
| immutable-return-values | 3 | 3 / 3 / 3 |  |
| policy-copy-consistency-and-no-duplicate-terms | 3 | 3 / 3 / 3 |  |
| strict-TypeScript | 1 | 1 / 1 / 1 | `tsc -p tsconfig.json --noEmit` |
| generator-byte-identical-replay-and-coverage | 2 | 2 / 2 / 2 |  |
| handwritten-format-and-Scunthorpe | 459 | 459 / 459 / 459 |  |
| exhaustive-declared-single-glyph-substitution | 1371 | 1371 / 1371 / 1371 |  |
| generated-obfuscations | 5000 | 5000 / 5000 / 5000 |  |
| names-count-and-uniqueness | 2 | 2 / 2 / 2 |  |
| names-reviewed-corpus-policy | 20000 | 20000 / 20000 / 20000 |  |
| names-reviewed-baseline-no-stale-entries | 1 | 1 / 1 / 1 |  |
| words-count-and-uniqueness | 2 | 2 / 2 / 2 |  |
| words-reviewed-corpus-policy | 10000 | 10000 / 10000 / 10000 |  |
| words-reviewed-baseline-no-stale-entries | 1 | 1 / 1 / 1 |  |
| places-count-and-uniqueness | 2 | 2 / 2 / 2 |  |
| places-reviewed-corpus-policy | 2000 | 2000 / 2000 / 2000 |  |
| places-reviewed-baseline-no-stale-entries | 1 | 1 / 1 / 1 |  |
| regex-vs-bitset-NFA-differential | 43830 | 43830 / 43830 / 43830 |  |
| repeat-call-purity | 43830 | 43830 / 43830 / 43830 |  |
| boolean-wrapper | 43830 | 43830 / 43830 / 43830 |  |
| mutation-baseline-truth | 43830 | 43830 / 43830 / 43830 |  |
| 25-real-executed-mutations | 25 | 25 / 25 / 25 |  |
| runtime-gzip-size | 2 | 2 / 2 / 2 |  |
| zero-runtime-dependencies-and-forbidden-APIs | 5 | 5 / 5 / 5 |  |
| latency-every-observed-check-under-005ms | 10000 | 9984 / 9993 / 9981 |  |

The local integrity row had no root manifest yet: it checked per-file size and generated a checksum inventory. Final SHA256SUMS.txt verification is rerun by CI after sealing; do not interpret the earlier row as verifying a file that did not yet exist.

## Quantitative outcomes

- Generated obfuscations: 5,000 unique in-domain strings per seed, 15,000 total; misses = 0 for seeds 1, 2, 3. All 63 blocked terms are covered in every seed. Generator replay is byte-identical.
- Differential comparisons: 43,830 inputs per seed, 131,490 total; zero disagreements. This includes every 32,000-entry corpus run, handwritten/exception cases, all declared one-glyph substitutions, generated obfuscations and random Unicode fuzz.
- Corpus allowances per seed: 19,989/20,000 Census names; 9,951/10,000 word tokens; 1,943/2,000 place names. These are the actual accepted counts, not the reviewed-policy passed counts.
- Remaining rejections: 11 real-name false positives; 48 deliberate lexical word rejections; one overlength word; 57 overlength places. Every original string and reason is in data/kept-rejections.json. No corpus entries were dropped or replaced.
- All 289 exact benign exceptions are exercised. Scunthorpe-style cases and the Bob/boob regression are explicit.

Size: source 6485 bytes / 3040 bytes gzipped; compiled runtime 5420 bytes / 2393 bytes gzipped. The gate is 6,000 bytes for both gzip artifacts, level 9.

## Latency (milliseconds)

| Seed | Calls | Mean | p50 | p99 | Maximum | Above 0.05 |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 10000 | 0.001798480 | 0.001243000 | 0.004713000 | 0.162469000 | 16 |
| 2 | 10000 | 0.001588267 | 0.001173000 | 0.004252000 | 0.468655000 | 7 |
| 3 | 10000 | 0.001722202 | 0.001176000 | 0.004235000 | 0.473782000 | 19 |

No outliers are discarded. The average includes harness overhead; individual observations enclose the actual check and result access. Each seed warms up 100,000 calls, then measures 10,000 seeded mixed inputs. These observations do not establish a worst-case execution-time proof. The maximum gate fails npm test here.

## All 25 executed mutations

Each mutant replaces exactly one unique compiled-code anchor, imports the modified module successfully, and executes the entire baseline-passing case set. A preexisting baseline error or syntax error cannot count as a kill. Each runs at all three seeds; all 75 executions were killed. The first witness below is from seed 1. Full witness/disagreement logs are in the CI artifact and delivery reports.

| ID | Deliberate bug | First witness | Killed seeds |
|---|---|---|---|
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
| M18 | Disable reversed scan | `"Lana"` | 1, 2, 3 |
| M19 | Disable repetition at single letters | `"Bonner"` | 1, 2, 3 |
| M20 | Delete a blocked lexicon entry | `"fuck"` | 1, 2, 3 |
| M21 | Use substring rather than whole-word exceptions | `"Hancocksex"` | 1, 2, 3 |
| M22 | Admit 17 code points | `"abcdefghijklmnopq"` | 1, 2, 3 |
| M23 | Reject exactly 16 code points | `"\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28\ud801\udc28"` | 1, 2, 3 |
| M24 | Silently delete unmapped letters | `"s\u4e2dex"` | 1, 2, 3 |
| M25 | Forget required original double letters | `"Bob"` | 1, 2, 3 |

## GitHub CI and provenance

PR: https://github.com/luisitin/partybox-gpt-drops/pull/2
Initial unrefined full CI run: https://github.com/luisitin/partybox-gpt-drops/actions/runs/37568665319 (failed). It confirmed 0 generated misses and exposed 84 name, 92 word and 61 place rejections plus three seed-1 timing outliers. That report is not substituted for the final implementation.

The PR description links the inspected final workflow run and states its real conclusion. Every CI run executes npm test, uploads all reports/source/corpus cache even on failure, and has no continue-on-error. A green link is provided only if GitHub actually reports success; the local failed maximum remains disclosed even then.

## UNVERIFIED / unmet requirements

- The original regex/NFA authorship limitation is resolved by the new sealed independent reference; every full case is now compared with it. The historical NFA remains supplemental.
- Literal every-name/every-word/every-place allowance: NOT fulfilled. Identical-string conflicts and overlength inputs remain rejected with per-row explanations. Reviewed-policy passed counts must not be mistaken for all-allowed counts.
- At most 0.05 ms for every call: NOT fulfilled by the local observations; hardware-independent hard real-time behavior is not established.
- Complete slang, languages, Unicode homoglyphs, phonetic/multi-character substitutions, and unseen adversarial obfuscations: not exhaustively verified. The finite policy and transformations are fully declared.
- Zero false positives on unseen names: not established. Exact exception spellings were refined using this corpus, so it is a regression set, not held-out evidence.
- A certified combined 20,000-most-common current U.S. first/last ranking: not established. The exact historical Census selection rule is disclosed in SOURCES.md.
- Future availability of unchanged external corpora: not guaranteed. Changed hashes fail closed; use the retained cache for snapshot replay.

## Resumed verification milestone

A sealed independent author wrote `tests/blind/reference.mjs` before production
or previous test/reference access. Its original SHA256 is
`40449357a616619cc649d6b8efab2f6664a187de178511b8b0f17e28e92eea9a`.
The full resumed run on Node v24.19.0 retained all original counts and added
43,830 blind-reference comparisons per seed. All 131,490 blind comparisons,
15,000 generated obfuscations and 75 executed mutants passed. Census/word/place
accepted counts remained 19,989 / 9,951 / 1,943 per seed.

The printable-ASCII normalization and single regex scan reduced measured
median latency, but the first local optimized run still failed the unchanged
literal maximum: 20 / 12 / 24 calls over 0.05 ms, maxima 0.379979 / 0.274470 /
0.759725 ms. These are measured failures, not an all-pass claim. Final measured
reports and hosted status will be published after the final source is tested.
