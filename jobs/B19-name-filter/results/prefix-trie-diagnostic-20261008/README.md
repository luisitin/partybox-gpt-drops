# Original private regex-prefix measurements

These are byte-for-byte archives of one private candidate preparation,
one strict compile, one behavioral comparison and one mixed ABBA/BAAB run.
The production baseline was head
`5155180bd03a5de0336a2ae289941b1b279061b3`, runtime source
`693d9501633b9099676d38cf2d215bdf3dab570b3e8d300f485d685e2be2f15f`.
The candidate source is
`41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d`.

The original working directory was
`/workspace/partybox-gpt-drops-B19-finish`. Observed commands were:

```sh
python3 .work/B19-trie-candidate/build-candidate.py
node jobs/B19-name-filter/node_modules/typescript/bin/tsc -p .work/B19-trie-candidate/tsconfig.json
node .work/B19-trie-candidate/exact-harness.mjs equivalence
node .work/B19-trie-candidate/exact-harness.mjs timing
```

The strict compile exited 0 at 20:51:19.715634 UTC. Behavioral comparison
closed naturally at 20:51:36.306 UTC, exit 0: 214,308 cases, including all
131,490 original comparisons, complete result/suggestion/frozen/wrapper
agreement, both references and the existing Unicode/range/length cases.
All 243 start/end guarded paths agreed. Default-gzip diagnostic sizes were
5,010 source bytes and 3,686 compiled bytes; required level-9 sizes are measured
separately by the unchanged full acceptance command.

The timing coordinator granted the quiet window at 21:00:19.372445 UTC.
The timing command actually started at 21:00:37.865735 UTC, with its internal
START at 21:00:38.258 UTC. It naturally CLOSED at 21:00:57.928 UTC and command
exit 0 was observed at 21:00:57.976145 UTC. Explicit coordinator release was
delayed until 21:04:37.553132 UTC. No STOP or CONT was applied to the attempt.
The separate original coordination receipt preserves that complete timeline.

| Seed | Baseline total, ms | Candidate total, ms | Improvement |
| --- | ---: | ---: | ---: |
| 1 | 3592.733511 | 2307.985113 | 35.7596% |
| 2 | 3204.699459 | 1987.406176 | 37.9846% |
| 3 | 3396.803045 | 2389.403058 | 29.6573% |

All 24 measured 500,000-call phases and their GC observations are retained.
Each seed uses the exact original seeded 10,000-input sample, including the
original positive list, generated obfuscations and all three public corpora.
Every phase within a seed has the same output sink. Both ABBA and BAAB blocks
favor the candidate at each seed; totals include all phases.

`provenance.json` maps each original private file to its archived path,
byte count and digest. `original-private/` retains the original scripts,
TypeScript, compiled candidate, configuration, guarded maps, START/CLOSED
records, complete phase records, stdout/stderr and observed command receipts.
`baseline-loaded/` also retains the actual baseline compiled runtime and
reference bytes before production adoption. Reproduction requires restoring
the recorded baseline checkout and `.work` layout; no relocated run occurred.

This experiment measured mixed whole-call throughput. It did not run or waive
the original per-call 0.05 ms acceptance check, erase a previous failure,
establish an outlier cause, prove a hardware-independent maximum or complete
the mandatory original KEEP loop.
