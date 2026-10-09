# Raw ASCII-letter DFA folding: measured improvement

Adopt exactly source 7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d,
compiled e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9.
Baseline source ae8dc388 / compiled 330968b3 and its complete original full
green and failed follow-up remain preserved. No original policy/reference/
corpus/workload/timer/warmup/seed/0.05 ms gate is changed.

After the original type and raw-length decisions, proven nonempty ASCII letters
of raw length <=16 can scan the unchanged 539-state DFA through a startup
fold table derived by calling the original lower(). A proven miss returns the
same frozen OK before allocating plain/lowercase text or consulting SAFE.
Every hit retains the unique original lower()/SAFE anchor; direct-hit state
avoids a second scan. SCAN.empty and undefined-SCAN fallback remain exact.
Unicode, separators, controls, result/suggestion/frozen semantics and wrapper
remain unchanged. This is distinct from archived rejected classifiers that
still performed ordinary plain/SAFE/matcher work. No input/result cache exists.

Strict private compile passes 22:46:21.152079 UTC. Six actual behavioral
AssertionError controls pass 22:46:45.599. Complete equivalence naturally
CLOSED 22:46:55.502: all 214,308 cases, full results, suggestions, frozen
objects, wrappers, both references and 131,490 original inputs agree; all
669 source guards remain unchanged. All original 25 seed-1 mutants parse,
execute and are killed on 43,830 truth rows, zero exclusions, naturally
CLOSED 22:47:01.464; their 671 guards remain unchanged. These checks are
supplemental and do not replace the original 75-mutant full suite or latency gate.
Diagnostic default gzip is 5,271 source / 5,064 compiled bytes; source
preparation level-9 gzip is 5,251 bytes. Original full size checks remain.

One exact original-sample ABBA/BAAB comparison is delegated after fresh
owner quiet ACKs and a live process audit. Actual grant 22:51:59.355368 UTC;
harness START and natural CLOSED are retained in the actual raw report;
natural CLOSED 22:52:05.726, command CLOSED 22:52:05.758797 / EXIT 0.
Every 24 phase / 12 million whole call and raw GC observation stays retained.
All 669 harness and 12 external guards remain unchanged; all seeded sinks agree.
Seed gains are 13.840704%, 10.520572%, 8.367045% against ae8/330.

| Seed | Block 0 gain % | Block 1 gain % |
| --- | ---: | ---: |
| 1 | 14.2692822760 | 13.3997313316 |
| 2 | 9.2463141904 | 11.7704516860 |
| 3 | 15.0949914807 | 2.0498843469 |

All six actual blocks favor the candidate, including the smaller final block.
Timing report SHA256 907a33c9ed5b0536e2baf89e0b42734ffa279c06ac5ef38e56d531973047431a.
Existing original 100k warmup and 10k sample rows per variant/seed stay fixed.
Startup DFA/fold-table construction is excluded from the phase gains; no
startup gain, first-call cost, universal per-call bound or outlier cause is claimed.
The shortcut avoids plain-string/lowercase work only on proven ASCII misses;
no allocation-free whole-function claim is made.

Independent actual-byte static review closes with scoped acceptance at
22:53:43 UTC, without new tests/timing/mutations. Exact source adoption is
22:54:58.870981; production strict build closes 22:54:59.829508, reproducing
exact measured e4b compiled bytes. Six actual production assertion controls
close 22:55:00.854989. Original command paths and times are retained.

The preceding 39c6a17 automatic full hosted run 37855098543 is genuinely
green: all 100 suites / 75 executed mutants / 647 delivery hashes pass.
Actual artifact 11583995901 is 9,633,217 bytes, SHA256
877b00ad2b5fddf3fa8c4ccd5a5f585dc088b063d5e1114f2b5bd7308e825e56.
Its complete native log agrees with all fresh rows; 3,319 immutable-byte
assertions pass at 22:44:14.860516 UTC. Actual ZIP stays privately at
.work/B19-green-hosted-39/actual.zip without recursive ZIP nesting. Its
runtime source is historical after the new adoption. Hosted compiled runtime
is absent, so no hosted compiled-byte equality is claimed; individual times
are not reconstructed. The predecessor's single after-green first local/KEEP
full failure 6/3/5 remains binding and is not rerun unchanged.

Every original source/compiled baseline, script, declared sample, raw stdout/
stderr, full phases/GC, guards and separate root coordination time remains.
Copied archive paths were not executed. Root coordinated fresh-owner ACKs;
uncaptured exact ACK and first release-message times are labeled accurately.
All owners were directly released after natural closure, with later receipt
time separate. No STOP, pause, fake clock, settling, filter or extra phase.
Current changed-source full checks and required KEEP are not yet accepted;
PR23 remains draft, KEEP open, and all historical failures stay retained.
