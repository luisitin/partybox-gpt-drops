# First deterministic-scanner original acceptance and required KEEP

Exact head 559969f514d8c943a837e4759576c81d27b8a7c0 delivers source
ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a,
compiled 330968b37089918bf450bb0a8a4546133e855c55df2aafe462d36be7aa4c6b8e.
All original workloads, references, policy fixture, 100k warmup, 10k seeded
individual timers and literal 0.05 ms gate remain unchanged.

The genuine hosted full check 37853546762 / job 113572188397 completes
SUCCESS at 22:27:30 UTC: all 100 suite rows, 75 executed mutants, 565 delivery
hashes and original seeded sinks pass. Literal outliers are 0/0/0 with maxima
0.025609/0.012829/0.012139 ms. Actual artifact 11582468572 is 8,686,127 bytes,
SHA256 5183b8e4acd8ba461012ce56573bb47121381623b33cdcfc0f48c7d59ed3efc0.
Its immutable bytes independently pass 2,909 assertions at 22:31:05.337579 UTC,
including every current delivery byte and complete native-log/fresh-row agreement.
The original ZIP remains at .work/B19-green-hosted-559/actual.zip; no nested
ZIP is added. Hosted dist/nameFilter.js is absent, so no hosted compiled-byte
equality is claimed. Individual timed observations are not reconstructed.

The first local full check starts only after that genuine green acceptance.
Consequently this single actual run also fulfills the original after-green
KEEP rerun obligation; there is no second unchanged attempt from relabeling.
Actual grant 22:32:02.890081 UTC; START 22:32:03.925505;
natural CLOSED 22:32:23.725160 / EXIT 1. All 584 guards remain unchanged.
The unchanged command is npm test from jobs/B19-name-filter, controlled by
python3 .work/B19-dfa-production-acceptance/run-first-full.py from repository
root. Every non-latency suite and all 75 actual mutants pass. Literal failures:

| Seed | Calls | Passed | Outliers | Maximum ms |
| --- | ---: | ---: | ---: | ---: |
| 1 | 10000 | 9994 | 6 | 0.20221800000035728 |
| 2 | 10000 | 9997 | 3 | 0.1597650000003341 |
| 3 | 10000 | 9995 | 5 | 0.0870729999987816 |

Full summary SHA256 259d6e55875396c7c059231a2f48b1d0e6a8050c64b3bec38e89ffbf7d0bf98a.
CLOSED receipt SHA256 fae5696cb132ccbcdce4d1f73da18191a5d9998203295c5c1f39e3091086e9f9.
Every raw outlier, complete stdout/stderr, all 100 per-test name/case/pass/seed/
command rows, source guards, original controller and coordination receipt remain.
All owners were directly released after natural closure. The later release
receipt time is labeled separately; exact first release-message time was not captured.
No STOP, pause, fake clock, gate change, outlier deletion or unchanged retry occurred.

The first local reports directory was a complete snapshot of reports/latest;
it also includes pre-existing diagnostic files not executed by this attempt.
Only fresh summary/benchmark/mutation/corpus rows identify this full run.
Archived copies were not run at these new paths. Original absolute .work paths
are recorded below. Earlier green and failed scopes remain separate and retained.

The first supplementary hosted-artifact reader failed when a broad numeric
count replacement accidentally changed the expected corpus hash prefix. Its
source and actual partial EXIT 1 receipt are retained; exact closure and full
original stderr were not captured. Only the reader was corrected using numeric
token boundaries. Actual source, corpus, artifact and original tests were unchanged.
The accepted reader uses the original lock 46374224a6bfae76ac22ca87e77859d77d02353a26073bdfb72c91860ba79a6f.

The independent static review found no reachable correctness counterexample,
but does not replace the literal gate. PR23 remains draft; KEEP and complete
acceptance remain open. The cause of every observed outlier remains unknown.
