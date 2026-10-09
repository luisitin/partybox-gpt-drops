# Exact-regex deterministic scanner diagnostic

Production adopts exactly candidate ae8dc388 / compiled 330968b3, following
one source-bound, naturally completed private experiment. Original production
41442670, all previous failures and exact original workloads remain archived.

A fixed-grammar parser reads the existing generated BAD.source language,
constructs an epsilon NFA and a bounded 539-state deterministic table.
Each character transition includes the initial states for substring scanning.
Repeated minima and i/l/# ambiguity derive from the unchanged pattern()
function, so the original mutant anchors still affect actual matching.
Unknown text characters reset the table state; normalization, exceptions,
controls, wrapper, frozen results and suggestions are unchanged. Longer
normalization expansions and a construction limit retain the complete regex
fallback. Only table matching has no per-call allocation; normalization and
startup construction still allocate. Startup construction is excluded from
phase gains and has no measured time or universal bound here.

Strict compile naturally passes at 22:12:35.108541 UTC. Complete equivalence
passes 214,308 result/suggestion/frozen/wrapper/both-reference comparisons,
including 131,490 original inputs, naturally CLOSED 22:14:39.123 UTC.
Default diagnostic gzip is 5,142 / 4,928 bytes; original full level-9 checks
remain unchanged. The compact source emits byte-identical JavaScript to the
retained uncompact source. Its 6,258-byte source preparation failed the size
bound and was retained; only comments and empty lines were removed to fit.

The first supplemental lexical reader failed before any mutation check,
because it did not rescan template context. Its original source and actual
EXIT 1/chunk/wall-time receipt are retained; complete original stderr and
exact closure time were not captured. Only that reader changed to the actual
TypeScript parser/transpiler; no candidate semantic bytes changed. Corrected
control passes at 22:14:09.361 UTC, proving equal emitted JS and actual
M15/M19/M25 behavioral AssertionErrors. A separate original 25-mutant seed-1
control executes every mutant against 43,830 cases with zero baseline failures,
all killed, natural CLOSED 22:16:00.771 UTC. This is supplemental evidence,
not the required 75-mutant three-seed original full acceptance.

One exact ABBA/BAAB command uses the original 10,000 sampled inputs and
100,000 warmup calls per variant/seed. Grant 22:20:42.114254 UTC; actual
harness START 22:20:42.407; natural CLOSED 22:20:51.845 UTC / EXIT 0.
All 480 guards remain unchanged, all 24 phases / 12 million whole calls and
GC observations are retained. Seed gains are 53.300560%, 46.667906%,
35.853386%; all six balanced blocks favor the candidate (21.73–55.06%).
These are whole-call gains on this finite workload after existing warmup,
not startup gains, an explanation of prior outliers, original literal
acceptance, completed KEEP or a universal wall-clock guarantee.

The previous exact fddfd50 hosted full pass is historical after adoption:
run 37851475091, artifact 11581888418, 2,399 byte/structure assertions, all
100 suites / 75 actual mutants / 463 delivery hashes. Its original ZIP stays
privately at .work/B19-green-hosted-fdd/actual.zip; complete native log and
fresh reports are retained here without recursively nesting ZIP archives.

Every original .work script path, baseline/compiled source, all actual phases,
raw stdout/stderr, guards and separate coordinator times are preserved.
Copied archive paths were not executed. Current changed-source full npm test,
new-head hosted checks and any required post-green KEEP are still pending.
