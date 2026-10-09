# B19 verification ledger

## Current raw ASCII-letter DFA shortcut adoption, October 8

Production adopts exactly source SHA256
`7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d`,
compiled `e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9`.
Original type and full raw-length guards run first. Nonempty ASCII letters
of raw length <=16 scan the unchanged 539-state DFA through a startup table
derived via the unique original lower(). Proven misses return frozen OK
before plain-string/lowercase and SAFE work; hits retain the single original
exception anchor and avoid a second scan. SCAN.empty, undefined fallback,
Unicode/controls/separators, results, suggestions and wrapper stay exact.
There is no input/result cache. Startup and normalization still allocate;
no allocation-free whole-function or first-call-bound claim is made.

| Test | Cases | Passed | Seed | Exact command from repository root |
| --- | ---: | ---: | --- | --- |
| Private strict build | 1 | 1 | shared setup | `node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-ascii-DFA-fold-candidate/tsconfig.json` |
| Original complete comparisons | 43830 | 43830 | 1, 2, 3 separately | `node .work/B19-ascii-DFA-fold-candidate/exact-harness.mjs equivalence` |
| Unicode-policy comparisons | 1296 | 1296 | 1, 2, 3 separately | same equivalence command |
| Unicode-range comparisons | 1422 | 1422 | 1, 2, 3 separately | same equivalence command |
| Length-boundary comparisons | 24873 | 24873 | 1, 2, 3 separately | same equivalence command |
| Added-name bypass comparisons | 15 | 15 | 1, 2, 3 separately | same equivalence command |
| Actual M01/M15/M18/M19/M21/M25 AssertionError controls | 6 | 6 | shared setup | `node .work/B19-ascii-DFA-fold-candidate/structural-control.mjs` |
| Original actual mutants, 43830 truth rows each | 25 | 25 | 1 (supplemental) | `node .work/B19-ascii-DFA-fold-mutation/full-mutation.mjs` |
| Mixed 24 phases / 12 million whole calls, guards/sinks | 24 | 24 | 1, 2, 3 | `node .work/B19-ascii-DFA-fold-candidate/exact-harness.mjs timing` |
| Production strict compile | 1 | 1 | shared setup | `npm run build` from jobs/B19-name-filter |
| Actual production AssertionError controls | 6 | 6 | shared setup | `node .work/B19-ascii-DFA-production-acceptance/mutation-anchor-check.mjs` |

All 214,308 full result/suggestion/frozen/wrapper/both-reference comparisons
pass, including 131,490 original inputs. Equivalence naturally closes
22:46:55.502 UTC with all 669 guards unchanged. Strict private build closes
22:46:21.152079; six assertion controls close 22:46:45.599. All 25 original
mutants execute and are killed on 43,830 rows with zero excluded baseline
failures, natural CLOSED 22:47:01.464; all 671 guards remain unchanged.
Default diagnostic gzip is 5,271 source / 5,064 compiled bytes; original
level-9 size and complete acceptance checks remain unchanged.

One fresh-owner coordinated ABBA/BAAB run has actual grant
22:51:59.355368 UTC; natural CLOSED 22:52:05.726 / command CLOSED
22:52:05.758797 / EXIT 0. Every 24 phase / 12 million whole call, raw GC
observation, complete stdout/stderr and all 669 + 12 external guards remain.
Seed gains are 13.840704%, 10.520572%, 8.367045%; all six balanced blocks
favor the shortcut: 14.269282/13.399731%, 9.246314/11.770452%,
15.094991/2.049884%. All seeded sinks agree; the smaller final block is
retained. Original 10k sampled rows and 100k warmup per variant/seed stay
fixed. Startup construction is excluded; these warmed diagnostic gains do
not establish the original literal gate, startup gain or an outlier cause.
Timing report SHA256
907a33c9ed5b0536e2baf89e0b42734ffa279c06ac5ef38e56d531973047431a.

Independent actual-byte static acceptance naturally closes 22:53:43 UTC,
without executing new tests or timing. Exact source adoption is
22:54:58.870981; strict production build closes 22:54:59.829508 and emits
the exact measured e4b bytes. Six actual production assertion controls close
22:55:00.854989. Complete evidence is in
results/ascii-DFA-fold-diagnostic-20261008/, preserving original .work paths;
copied archives were not executed. Every owner is directly released after
natural closure; uncaptured first-message times and later receipt times
remain accurately labeled. No STOP/pause, fake clock, filter, settling or
extra phase is used. All historical greens, failures and rejections remain.

### Current original full checks: actual failures retained

| Test | Cases | Passed | Seed | Exact command |
| --- | ---: | ---: | --- | --- |
| Hosted full suite rows | 100 | 99 | 1,2,3 | `npm test`, job113583058802/run37856872614 |
| Hosted actual executable mutants | 75 | 75 | 1,2,3 | same original full command |
| Hosted literal calls | 10000 each | 9998/10000/10000 | 1,2,3 | same original full command |
| Genuine failed artifact actual-byte assertions | 3786 | 3786 | immutable5a | `python3 .work/B19-failed-hosted-5a/validate.py` from repository root |
| First local full suite rows | 100 | 97 | 1,2,3 | `python3 .work/B19-ascii-DFA-first-local-preparation/run-first-full.py` from repository root, runs original `npm test` |
| First local actual executable mutants | 75 | 75 | 1,2,3 | same original full command |
| First local literal calls | 10000 each | 9988/9991/9998 | 1,2,3 | same original full command |
| First local source/runtime/controller guards | 760 | 760 | before/after | same first-local controller |

Hosted2/0/0 fails, maxima0.053330/0.013736/0.016556ms. Genuine artifact
11584531927,10319256 bytes,SHA256
c640c891e31f215b86968a094dfddcc3c9be2c87fdf570c440a6ff693587b760.
All740 immutable delivered files, original corpora/all75 actual mutants and
all100 fresh rows equal the complete native log. Independent reader natural
CLOSED PASS23:19:19.410668UTC. This proves failure, not latency acceptance.

Actual grant23:24:15.063016; original first-local START23:24:16.514021;
natural CLOSED23:24:33.285692UTC/EXIT1. All760 guards unchanged. Literal
12/9/2 fails, maxima0.168686/0.165839/0.076408ms. Every non-latency row/
all75 mutants pass. Full raw reports/logs/controllers/guards/source/compiled
maps, actual outliers and direct release provenance remain in
results/first-ascii-DFA-original-acceptance-20261008/.

This is first local only, not after-green KEEP, since hosted full failed.
No unchanged retry/pause/SIGSTOP/filter/settling/extra warmup/threshold change
or outlier cause. Original runner records summaries/outliers, not every
individual elapsed value; absent values and absent hosted compiled runtime
bytes are not reconstructed. Copied archives were not executed. Original
sources/reference/corpus/driver/workload stay fixed; supplementary helper
preparation errors are preserved and corrected separately.

### UNVERIFIED: complete acceptance and KEEP

Both actual current-source full attempts fail the literal0.05ms gate.
Complete acceptance/KEEP remain incomplete; PR23 draft. Previous ae8 source
hosted greens and required6/3/5 local failure stay historical. No cosmetic
stop. Prospective indexed UTF16 length preflight is not authored or measured;
original genuine M22/M23 boundaries must stay live. No further elapsed work
is authorized while the coordinated G10 trial is pending.

## Historical exact deterministic scanner ae8 adoption, October 8

The predecessor scanner has exact source SHA256
`ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a`,
compiled `330968b37089918bf450bb0a8a4546133e855c55df2aafe462d36be7aa4c6b8e`.
The existing pattern() language is compiled into a bounded 539-state table;
normalization, controls, exact exceptions, result/suggestion/frozen values
and wrapper are unchanged. Original minima, ambiguity and substring matching
remain, with complete regex fallback for long expansions/construction bounds.
Only table matching avoids per-call allocation; normalization and startup
still allocate. The measured whole calls use the original existing warmup;
startup construction is not included and no startup time/bound is claimed.

The exact source passes strict TypeScript and all 214,308 private complete
comparisons, including 131,490 original inputs. One coordinated experiment
retains every 24 ABBA/BAAB phase / 12 million whole calls and all 480 guards,
which remain unchanged. Gains are 53.300560%, 46.667906%, 35.853386%; all
six blocks favor the candidate (21.73–55.06%). These are diagnostic gains,
not the original literal per-call acceptance. Every original policy, fixture,
459 fixed cases / 43,830 comparisons per seed, 48 timed positives, seeded
samples, 100,000-call warmups, timers, references and 0.05 ms gate remains.

| Test | Cases | Passed | Seed | Exact command from repository root |
| --- | ---: | ---: | --- | --- |
| Strict candidate build | 1 | 1 | shared setup | `node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-dfa-compact-candidate/tsconfig.json` |
| Original comparisons | 43830 | 43830 | 1, 2, 3 separately | `node .work/B19-dfa-compact-candidate/exact-harness.mjs equivalence` |
| Unicode-policy comparisons | 1296 | 1296 | 1, 2, 3 separately | same equivalence command |
| Unicode-range comparisons | 1422 | 1422 | 1, 2, 3 separately | same equivalence command |
| Length-boundary comparisons | 24873 | 24873 | 1, 2, 3 separately | same equivalence command |
| Added-name bypass comparisons | 15 | 15 | 1, 2, 3 separately | same equivalence command |
| Equal emitted JS / actual M15,M19,M25 assertion controls | 3 | 3 | shared setup | `node .work/B19-dfa-compact-candidate/structural-control.mjs` |
| Original 25 actual mutants, 43830 truth cases each | 25 | 25 | 1 (supplemental) | `node .work/B19-dfa-full-mutation/full-mutation.mjs` |
| Mixed 24 phases / 12m calls; guards and sinks | 24 | 24 | 1, 2, 3 | `node .work/B19-dfa-compact-candidate/exact-harness.mjs timing` |
| Production strict build | 1 | 1 | shared setup | `npm run build` from jobs/B19-name-filter |
| Production M15,M19,M25 actual assertion controls | 3 | 3 | shared setup | `node .work/B19-dfa-production-acceptance/mutation-anchor-check.mjs` |

Strict candidate compile closes 22:12:35.108541 UTC; full equivalence naturally
CLOSED 22:14:39.123. Corrected structural control closes 22:14:09.361;
all 25 actual seed-1 mutants close 22:16:00.771. Mixed grant is
22:20:42.114254; harness START 22:20:42.407; natural CLOSED 22:20:51.845,
EXIT 0. Production strict build closes 22:23:38.406719, compiling the exact
measured JS; production controls close 22:24:20.187. Complete rows, sources,
GC and raw outputs are in results/dfa-scanner-diagnostic-20261008/.
Copied archive paths were not executed. The original uncompact source size
fails (6,258 bytes); only comments/empty lines are removed, with byte-equal
emitted JS. Initial supplementary lexical-reader failure is preserved with
original source/actual receipt; complete initial stderr and closure time were
not captured. Its reader alone changed to the actual TypeScript parser.

### Actual ae8 full hosted pass and failed after-green local KEEP

Exact head 559969f514d8c943a837e4759576c81d27b8a7c0 passes full hosted
run [37853546762](https://github.com/luisitin/partybox-gpt-drops/actions/runs/37853546762),
job 113572188397, completed SUCCESS at 22:27:30 UTC. Every one of the 100
original suite rows passes, including all 75 executed mutants, 131,490
original comparisons, all 32,000 locked corpus rows and 565 delivery hashes.
The genuine artifact 11582468572 is 8,686,127 bytes, SHA256
5183b8e4acd8ba461012ce56573bb47121381623b33cdcfc0f48c7d59ed3efc0.
Independent immutable-byte validation passes 2,909 assertions at
22:31:05.337579 UTC, including every actual current delivery byte and complete
native-log/fresh-report agreement. The hosted runtime dist file is absent;
no hosted compiled-byte equality or reconstructed individual times is claimed.

The first local original full check starts after that accepted green. This
one actual run also fulfills the original after-green KEEP rerun obligation;
it is not duplicated by applying two labels. Exact command `npm test` from
jobs/B19-name-filter, via `python3 .work/B19-dfa-production-acceptance/run-first-full.py`
from repository root. Actual grant 22:32:02.890081 UTC;
START 22:32:03.925505; natural CLOSED 22:32:23.725160 / EXIT 1.
All 584 guarded inputs remain unchanged. All 100 suites execute, every
non-latency row passes, and all 75 original mutants execute and are killed.
Only the literal per-call gate fails; each raw outlier remains retained.

| Scope | Seed | Cases | Passed | Outliers | Maximum ms | Exact command |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Hosted full | 1 | 10000 | 10000 | 0 | 0.025608999999803927 | `npm test` |
| Hosted full | 2 | 10000 | 10000 | 0 | 0.012829000000238011 | `npm test` |
| Hosted full | 3 | 10000 | 10000 | 0 | 0.012138999999478983 | `npm test` |
| First local and required KEEP | 1 | 10000 | 9994 | 6 | 0.20221800000035728 | `npm test` |
| First local and required KEEP | 2 | 10000 | 9997 | 3 | 0.1597650000003341 | `npm test` |
| First local and required KEEP | 3 | 10000 | 9995 | 5 | 0.0870729999987816 | `npm test` |

All per-test name/case/pass/seed/command ledgers, complete raw stdout/stderr,
coordinator, source guards and original controller paths are retained in
results/first-DFA-original-acceptance-20261008/. Full summary SHA256
259d6e55875396c7c059231a2f48b1d0e6a8050c64b3bec38e89ffbf7d0bf98a;
natural CLOSED receipt SHA256
fae5696cb132ccbcdce4d1f73da18191a5d9998203295c5c1f39e3091086e9f9.
All owners were directly released after observed closure. The release receipt
time is separately recorded; exact first release-message time was not captured.
No STOP/pause/fake clock, original test change or unchanged retry occurred.
Copied archive paths were not executed. The complete local report snapshot
also contains labeled pre-existing diagnostics not executed by this attempt.
The supplementary artifact reader's first count-edit failure is retained;
only that reader changed, using exact numeric-token boundaries. Actual corpus,
source, artifact bytes and original tests were unchanged.

### UNVERIFIED: complete acceptance and KEEP

The required after-green rerun fails, so PR23 remains draft and KEEP remains
open despite the genuine current hosted green. Historical 41442670 greens
and failures remain separate. No outlier cause, startup bound, universal
timing guarantee, favorable unchanged retry or cosmetic stop is claimed.

## Historical exact prefix-trie source 41442670, October 8

Historical prefix-trie production source SHA256 is
`41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d`.
This is exactly the measured prefix-trie candidate. It retains the external
suggestion keys and three exact benign spellings. Every original policy byte,
reference, 459 fixed case, 43,830-input per-seed workload, original timing
sample, 100,000-call warmup, seed and individually timed 0.05 ms gate remains.

The first unchanged full `npm test` on this genuinely changed source executed
in both hosted and local environments. All100 suites execute; only literal
latency fails: hosted1/0/0 outliers, local9/5/13. Every failed record remains
retained. Exact-head 1255490 later passes full hosted CI, while its required
post-green full rerun fails 9/11/4 calls. Overall acceptance and KEEP remain
incomplete; PR #23 stays draft. Earlier local 43/19/28 timing failures
and historical post-green 31/28/11 failures remain preserved below.

### Verified hosted green and mandatory post-green failure

Evidence checkpoint 1255490 triggers automatic full CI 37849845219 / job
113559766032, completed SUCCESS at 21:53:27 UTC. All 100 suite rows pass,
including every original workload, 75 real mutants and 352 delivery hashes.
Genuine artifact 11580638498, 6,923,580 bytes, SHA256
123f931cb51a27faf94c7cc87d4a76d1fa4c5ecde161492321510571b243bcfc,
passes 1,844 independent byte/structure assertions at 21:55:18.870769 UTC.
Its complete fresh summary equals every corresponding native log row.

The single required post-green full rerun is `npm test` from the job folder,
controlled by `python3 .work/B19-post-green-125-preparation/run-required-post-green-full.py`
from repository root. Quiet grant 21:58:15.694665 UTC; START 21:58:16.539431;
natural CLOSED 21:58:31.844316 / EXIT 1, all 368 guards unchanged. Every
non-latency suite passes, but the literal per-call gate fails.

| Scope | Seed | Timed cases | Passed | Outliers | Maximum, ms | Exact command |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Hosted green | 1 | 10000 | 10000 | 0 | 0.040441 | `npm test` |
| Hosted green | 2 | 10000 | 10000 | 0 | 0.012088 | `npm test` |
| Hosted green | 3 | 10000 | 10000 | 0 | 0.013951 | `npm test` |
| Required KEEP | 1 | 10000 | 9991 | 9 | 0.140660 | `npm test` |
| Required KEEP | 2 | 10000 | 9989 | 11 | 0.255844 | `npm test` |
| Required KEEP | 3 | 10000 | 9996 | 4 | 0.636235 | `npm test` |

Both complete 100-row name/case/pass/seed/command ledgers are retained in
results/post-green-125-and-mapping-review-20261008/hosted-green/fresh-reports/summary.json
and required-local-KEEP/reports/summary.json under the same directory.
All original sinks, raw outliers and coordinator records remain. The
original genuine ZIP stays privately at .work/B19-green-hosted-125/actual.zip
and is linked by artifact metadata without recursive ZIP nesting. It omits
dist/nameFilter.js, so no hosted compiled-byte equality is claimed; the
optional lookup failure is documented. Individual call times are not
reconstructed from summary/outlier receipts. PR23 stays draft and KEEP open.

### Rejected precompiled-mapping diagnostic

Private strict compile passes one setup case with exact command
`node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-known-map-candidate/tsconfig.json`,
CLOSED 22:00:41.439227 UTC / EXIT 0. Candidate 0e9c0bdc has default-gzip
sizes 5,247 / 3,857 bytes. The exact command
`node .work/B19-known-map-candidate/exact-harness.mjs equivalence`
passes all 214,308 complete results, suggestions, frozen outputs, wrappers,
both references and original 131,490 inputs. All 15 case/pass/seed/command
rows are retained in the full archived equivalence report/stdout, natural
CLOSED 22:01:02.352 UTC, all 367 guards unchanged.

One exact command `node .work/B19-known-map-candidate/exact-harness.mjs timing`
measures 24 balanced ABBA/BAAB phases / 12 million whole calls, all three
original samples and 100,000-call warmups per variant and seed. Natural
CLOSED 22:03:46.645 UTC / EXIT 0, all 367 guards unchanged. Seed gains
+0.775136%, -26.582097%, +0.685623% are mixed: REJECT the candidate.
Every phase, GC event, stdout, baseline/compiled source and original command
path remains in the same evidence archive. No relocated execution,
production adoption, literal acceptance or outlier/regression cause is claimed.

### First complete original acceptance checks

Exact command: `npm test` from jobs/B19-name-filter, expanding to
`npm run build && node tests/run.mjs`. Hosted run37846119304 on exact83db439
completed FAILURE21:21:17 UTC. Actual complete native log was read.
The first local attempt STARTED21:33:16.193965 UTC and naturally CLOSED
21:33:35.191788 UTC, EXIT1; all287 loaded/delivered start/end guards agree.

All100 original suites execute in each environment. Non-latency checks pass
with all original43830 comparisons/5000 obfuscations/25 actual mutants per
seed,32,000 locked corpus rows, supplemental coverage, original sinks, and
275-file current delivery integrity. All30,000 timed observations remain
subject to the original literal gate; every outlier is retained.

| Environment | Seed | Timed cases | Passed | Outliers | Maximum, ms | Exact command |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Hosted | 1 | 10000 | 9999 | 1 | 0.051227 | `npm test` |
| Hosted | 2 | 10000 | 10000 | 0 | 0.024325 | `npm test` |
| Hosted | 3 | 10000 | 10000 | 0 | 0.029525 | `npm test` |
| Local | 1 | 10000 | 9991 | 9 | 0.190573 | `npm test` |
| Local | 2 | 10000 | 9995 | 5 | 0.137325 | `npm test` |
| Local | 3 | 10000 | 9987 | 13 | 0.609950 | `npm test` |

The complete100-row per-test case/pass/seed/command ledgers are in
results/first-trie-original-acceptance-20261008/local-original-attempt/reports/summary.json
and hosted-original-attempt/fresh-reports/summary.json under that same folder.
The genuine failed hosted ZIP11578869086 is retained with official byte/hash
metadata; an independent1457-check reader passed all safeZIP/CRC/source,
locked corpus, actual mutant, fresh report and original sink checks, while
requiring the real failed timing gate to remain failed. It does not contain
every individual call time, so those times were not recomputed.
Actual grant21:32:50.814796 and release21:33:58.837616 UTC are separate
from the native local closure. See retained source/controller/coordinator
and original-command provenance; no relocated run occurred.

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

Literal acceptance failed in both first environments, and original KEEP
remains incomplete. All75 original mutants execute and are actually caught;
this does not satisfy the failed latency gate.
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

## Rejected indexed UTF16 preflight and current artifact audit

Production is unchanged at source7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d / compiled e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9. Private source3ffd36c935fe2327989e6de25ee77193a1124f55f4a9cd77d96b8fa0cfb2870c / compiled fe90e089b0783c5cbc4d59faa16e6e57d363ea8a6ba10ac3d17f685df020e1d2 is REJECTED and was never adopted.

Strict compilation, all eight genuine assertion controls, all214308 complete equivalent comparisons and all25 original seed1 real mutants passed, with all850 equivalence /852 mutation guards unchanged. Original M22/M23 spread anchors remain consequential at16/17 code points. No original corpus, policy, driver, sealed reference, warmup or sample count was changed.

One delegated fresh-owner whole-call ABBA/BAAB comparison: grant23:57:22.147265UTC, naturalCLOSED23:57:29.110Z, controllerCLOSED23:57:29.128565UTC EXIT0; all850+12 guards unchanged.24 phases/12 million calls and all seeded sinks pass. Seed gains28.23598749039163%,-1.3967508296478282%,-0.6802691614683712%; inconsistent gains reject this candidate. Complete raw phase times, GC events, workload hashes and stdout/stderr are retained. Startup was excluded; this diagnostic is not original0.05ms acceptance. No retry occurred. All owners were directly released only after natural closure and observed tool exit0. The coordinator delay before launch exceeded other owners' conservative checkpoints; that delay does not change or excuse the30-minute cadence requirement.

Current baseline3640 hosted full37859732634/job113592343584 failed literal0/1/0, maxima0.026569999999992433/0.5130060000001322/0.010935999999674095ms. All100 suite rows' nonlatency checks,75 mutants and828 hashes passed. Official artifact11585970966 is11334866 bytes,SHA256e0fb3e62ea544898db82f180e94e6835772f5f9fad311325c7a99350e9805b60. Genuine ZIP retained privately at .work/B19-failed-hosted-3640/actual.zip (excluded from recursive public artifact packaging). Independent4226 byte assertions passed: reader naturallyCLOSED23:47:00.924373UTC EXIT0. The archived official metadata, complete native log and reader/report bind this actual failed result, not acceptance. No failure cause is asserted. Earlier first-hosted2/0/0 and first-local12/9/2 remain binding failures.

## Rejected fused ASCII DFA and actual11a1 full failure

Production remains exact7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d / compiled e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9. Private fused source40cc83aaac089ec1842f37ee28481ff87ddabdc157c513a2b334a9c0f77383d0 / compiled90f3e5a9afa9ebc304184183f6219c9f2ecc24b4cb0904d2b1abeeb4ee936185 is REJECTED, never adopted.

| Check | Cases | Passed | Seed | Exact command from repository root |
| --- | ---: | ---: | --- | --- |
| Strict private compile |1|1|shared|`node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-fused-ASCII-DFA-candidate/tsconfig.json`|
| Genuine actual AssertionError controls |8|8|shared|`node .work/B19-fused-ASCII-DFA-candidate/structural-control.mjs`|
| Complete semantic/result/reference/frozen/wrapper comparisons |214308|214308|1,2,3|`node .work/B19-fused-ASCII-DFA-candidate/exact-harness.mjs equivalence`|
| Original executed actual mutants,43830 rows each |25|25|1 supplemental|`node .work/B19-fused-ASCII-DFA-mutation/full-mutation.mjs`|
| One24phase/12M whole-call diagnostic,guards/sinks |24|24|1,2,3|`node .work/B19-fused-ASCII-DFA-candidate/exact-harness.mjs timing`|
| Genuine failed11a1 official artifact byte/structure audit |4551|4551|full captured3seed|`python3 .work/B19-failed-hosted-11a1/validate.py`|

Strict build naturallyCLOSED00:04:40.942412UTC; eight controls00:04:42.186Z; equivalence00:04:50.242Z; actual25 real mutants00:04:56.589Z, all finite controllers EXIT0. All915 semantic/917 mutation guards unchanged. Independent static review observed PASS/EXIT0 before fresh clock00:09:51, with original mutation/generator blocks byte-identical to runnerbff0 and no static semantic counterexample. Candidate level9 sourcegzip5316bytes <6000. Type/codepoint-length/control precedence remains; after a hit all remaining units are classified, and any nonletter clears that hit before original fallback.

Root directly executes the single once-only controller21f6 after actual all-owner ACKs/freshprocess/sourceguards. Actual grant00:17:44.585387UTC; commandSTART00:17:44.585681; harnessSTART00:17:44.924Z; trial naturallyCLOSED00:17:50.670Z; controllerCLOSED00:17:50.697578UTC EXIT0 and root observed actual tool EXIT0. All915+12 guards and sinks pass,24phases/12M calls. Seeds improve16.601489178406993%,-2.084012090827206%,-16.204666935052586%; inconsistent gains reject the candidate. Six balanced blocks32.77481882001674%,-6.753162219948217%,-6.297788181452679%,2.0605830289386895%,-35.91653709216598%,3.9211305577570466% all remain. No phase/sample was discarded, no retry or production adoption occurred. The initial absent /usr/local/bin/python wrapper failure happened before controller launch and is preserved in actual root-delegation. False ACK/delegation templates remain labeled NOT-A-GRANT; live actual ACKs/grant/CLOSED are separate. Timing packet verifies diagnostic execution and guards, not the original0.05ms acceptance gate. Startup is excluded from gains; original warmup100k and10k sample hashes remain unchanged.

Current immutable11a1ff53bad077132fb353aaaec5482f6401066b original full run37862490184/job113601272926 FAILED, native updated00:00:45UTC. All100 fresh suite rows executed, every nonlatency check, all75 real mutants and893 delivery hashes pass. Literal1/0/0, maxima0.07032999999955791/0.0190149999998539/0.02682000000095286ms. Official artifact11586314724 genuine ZIP11776754bytes/SHA2564682a12942f64dd933180fbe3ddfab2cfbc70ddc5c05db623196a4bda850f538; independent4551 assertions validated00:03:30.912094, reader naturallyCLOSED00:03:30.926856UTC EXIT0. Archive contains the actual official metadata, complete61234UTF16-unit native log, full reader/report and genuine fresh reports. The actual ZIP remains privately at .work/B19-failed-hosted-11a1/actual.zip and is excluded from recursive public packaging. This audit validates failure bytes, not acceptance; firstlocal12/9/2 and earlier hosted failures remain binding. Cause remains unknown. Hosted compiled runtime bytes/all individual call times are absent from the artifact; none is reconstructed or claimed equal.

All captured paths/hashes and completed once-only controller receipts retain their original locations. These packets are historical evidence, not an invitation to rerun a completed controller unchanged. All original policy/reference/corpus/driver/counts,100kwarmup/10ksamples and literal0.05ms gate remain frozen. KEEP and original acceptance are incomplete; PR23 stays draft/open, originalPR2/canonical/main preserved.

## Exact6a green and sole required after-green failure

Production7817/e4b remains unchanged. Original full37864218510/job113606984120 at immutable6a079fec genuinely passes all100 checks, literal0/0/0, maxima0.039324000000306114/0.015398999999888474/0.014277000000220141ms and original sinks94721/93467/94479. Actual official artifact11587348649 is12602853bytes/SHA2569630701930debded211abf482b5bb70c48d84f0925f761d108ed248881a45506. Independent4981 assertions bind actual safeCRC ZIP/all979 immutable delivery bytes/full native100 rows/75 actual mutants/corpora and three recorded benchmarks; reader naturallyCLOSED00:26:43.120317UTC EXIT0. The full reader, receipts, official metadata, native log and fresh captured reports are archived. Hosted compiled bytes/all individual timed observations are absent and are not reconstructed.

Original PROMPTS.md:311 says “When the job passes every check, do not stop: loop (1) rerun every check, (2) find the weakest part (lowest confidence row, slowest test, least covered case, ugliest asset), (3) improve it, add tests for it, push, log it in LOOP.md, and repeat.” One required original full after this genuine green was granted00:34:24.768578UTC. Actual START00:34:25.852441; naturalCLOSED00:34:44.366961UTC EXIT1. All1006 source/runner/reference/corpus/proof/environment guards agree before/after. Every actual100 rawstdout row equals the fresh full summary. Every nonlatency check/all75 original mutants passes, but literal13/5/10 fail, maxima0.8997339999996257/0.3093109999990702/0.30112000000008265ms. All28 actual outliers and original sinks remain. No clock/gate/warmup/sample/source change, filtering, paused process or second attempt occurred. This is the actual binding after-green failure, distinct from pre-green first-local12/9/2. Genuine hosted green remains a valid passing observation; required acceptance and KEEP remain incomplete, PR23 draft. No cause or universal bound is inferred. results/required-after-green-original-acceptance-20261009/ contains the independent rawrow/receipt review and complete original attempts.

Distinct unadopted fold-column bfe73f40 /9b55 candidate passes strict build at00:23:28.021058UTC, eight genuine assertion controls plus exhaustive65536code-unit original-regex comparison at00:23:29.656334, full214308 semantic/result/reference/frozen/wrapper cases at00:23:37.329900 with1001 equal guards, and all25 actual original seed1mutants at00:23:44.283151 with1003 equal guards. Each mutant executes43830 rows/no exclusions; M22/M23 anchors remain consequential. This seed1 supplement is not three-seed acceptance. Sourcegzip Python5293/Node5314 and compiledNode5110 bytes are distinct actual implementations and are each below6000. Independent static review/new mixed timing are pending; no production change or gain claimed. Full source/compiled/original declarations/control/mutant/equivalence/raw receipts archived in results/fold-column-DFA-unadopted-20261009/.


## Actual8d hosted validation and once-only fold-column rejection (2026-10-09T01:11:15.241079+00:00)

Immutable8d hosted run37866126547 genuine11588287156 independently passes5591 assertions,1101 actualGit hashes,100 original rows,75 actual mutants and literal0/0/0; reader naturalCLOSED00:44:58.120405. Required originalaftergreen literal13/5/10 remains failed and is not rerun.

Actual distinct fold-column paired trial naturalCLOSED01:09:38.922650/EXIT0 with24 original phases/12M calls and all1131+1154 guards equal. Aggregate+7.7875/+2.7706/+0.6678%, but only5of6 balanced blocks improve; seed3block0 regresses. No adoption/no unchanged comparison retry/no cause claim; all61GC events and allphases retained. Original faulty761a controller/READY preserved; targetedca78 reaping repair independently passed1406 assertions before root actualgrant. Historical6a semantic/mutant proofs and original timing loop remain immutable.


## Original currenta7 fullproof and rejected distinctASCII table (2026-10-09T01:39:05.094377+00:00)

Actualfulla7 hosted37868586332/job113621118296 official11588977738/14744550B independentlyPASS5851assertions/1153immutableGit files/all100rows/all75actualmutants/literal0/0/0; readernaturalCLOSED01:15:21.319446/EXIT0. Originalrequiredaftergreen13/5/10 remainsFAIL and wasnotrerun.

DistinctASCII mapping2a1/68f2 passesstrictcompile/8executedassertioncontrols/128mapping/65536classification/214308three-seed semanticcases/25realoriginalseed1mutants43830each/noexclusions. Actualonceonly24phase12M comparisonnaturallyCLOSED01:34:33.427399/EXIT0 with1175+1206guards unchanged/reapedempty; seedgains-10.5052/-1.2451/+4.7080% fail predeclared5%allthree+positiveallsixblocks. REJECTED/NOADOPTION; everyphase/GC event retained/no causeattribution. ENOENT scaffoldfailureandwrongba70-DFA paths werecaughtbefore anyelapsedlaunch; exactfailedhelper/READY bytes preserved, targetonly1e19/9494 repair independentlyPASS1241. Current1175a7 proofmap needsno documentbridge.

This is a bounded substantive optimization round without an acceptable gain. Bindingacceptance/KEEP remainunfinished; no unchangedretry, relaxedgate/clock, exclusions or claimedcompletion. Production7817/e4b/originalrunnerbff0 and alloriginalsourceworkloads stay unchanged.

## Actual8d57 failure and prospective diagnostic checkpoint

The complete hosted run37870853694/job113628364491 failed1/0/0;99/100 rows passed. Genuineofficial11590167227 bytes/SHA/fullZIP and6321 independent structural assertions confirm the failure, not completion. All earlier13/5/10 literal failures and four rejected candidates remain. `results/failed-hosted-and-diagnostic-20261009/proof.zip` preserves complete native log, official public metadata, reader and byte proofs.

### UNVERIFIED

The newly instrumented30000-sample CPU/GC diagnostic is UNEXECUTED. It preserves original sample inputs/warmup but changes conditions through sampling, extra endpoint storage and eager declaration import; no past cause or original gate waiver. Its frozen source/runtime/rootgrant protocol must be regenerated at this new documentary head and independently reviewed before launch. Wholearchive member-byte/CRC and original integrity checks pass; no repeated original acceptance benchmark was run.


## Actual instrumented diagnostic and failed reader (2026-10-09)

The once-only, newly instrumented diagnostic started 02:15:14.766577 UTC. Its child naturally exited 0; the whole controller naturally closed 02:15:16.394134 with exit 1 and DIAGNOSTIC_FAILED. All 30,000 actual call measurements, the CPU profile, nine observed GC records and the exact failed controller/READY/grant/log are preserved in results/prospective-native-diagnostic-failed-20261009/proof.zip. The post-reader raised KeyError for jobs/B19-name-filter/dist/nameFilter.js: five generated non-Git dependencies were omitted from the external frozen source map. The earlier static PASS receipts are invalid for complete transitive dependency coverage. The original failure receipt remains unchanged.

A separate offline reader proposal recovers exactly those five hashes from the preexisting 9494 frozen map and diagnostic internal before/after hashes, then runs every original source and saved-data predicate. Independent full static review passed at 02:37:44.738060 UTC. The separate saved-data reader naturally closed 02:38:03.541394 UTC with exit 0 and SAVED_TELEMETRY_VERIFIED_WITH_REPAIRED_OFFLINE_READER, checking all original predicates against 1,265 actual source identities and two runtimes. Original DIAGNOSTIC_FAILED remains unchanged. New instrumented observations exceed 0.05ms 8/11/0 times; their maxima are 0.307625/0.122048/0.028608ms. These are diagnosis-only observations under changed instrumentation conditions, never original acceptance or a historical cause. A fresh independent output readback is pending; no native launch occurred during this repair. No native rerun or retrospective authorization occurred. The 100-microsecond CPU sampler cannot resolve the original 50-microsecond acceptance threshold; CPU/GC clock alignment and historical causation are unproven. Production and the original workload/gates remain unchanged. Required after-green 13/5/10 remains failed; KEEP and acceptance are incomplete.

This bounded checkpoint preserves actual new evidence. Current-at-observation 375d344 hosted run 37873324590/job113636087727 is metadata SUCCESS; its genuine official archive/full independent acceptance is still pending. The preceding push closed 02:10:41.401064 UTC and missed its prior source deadline by 59.802609 seconds, retained in the packet. Record this publication's actual normal-push closure separately. PR23 remains Draft.
