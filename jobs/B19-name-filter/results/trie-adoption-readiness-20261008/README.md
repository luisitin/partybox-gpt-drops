# Current trie adoption readiness

The current source is the exact measured41442670 trie, compiled34b70d1c.
One production `npm run build` from jobs/B19-name-filter exited0 at
21:14:38.142896 UTC. Actual compiled bytes match the measured private candidate.

The supplemental command was
`node .work/B19-production-acceptance/mutation-anchor-check.mjs`
from /workspace/partybox-gpt-drops-B19-finish. Its corrected attempt naturally
closed21:17:00.409 UTC, command exit0 at21:17:00.424769 UTC.
M15/M19/M25 each have exactly one anchor; each mutant parses, executes, and
throws an actual caught AssertionError on fixed truth: c1it, seeex and Bobby.
Original compiled bytes pass every one of those same assertions.

The first supplemental attempt failed because its selected M25 witness Bob
has only3 mapped letters; existing minimum-length pruning correctly excludes
the4-letter boob pattern. It was a witness mistake, not a production defect.
Its exact helper bytes and completed tool output are preserved under
original-private/failed-initial-control/. An exact close timestamp was not
captured for that failed control; the receipt labels the later recording time.
Only the supplemental witness changed to the original benign case Bobby.
Production and the original full mutation suite did not change for this fix.

The full100-suite npm test, all75 original mutant checks, and the original
literal latency gate have not executed on the changed source yet. Archives
retain original `.work` paths; no relocated command was run.
