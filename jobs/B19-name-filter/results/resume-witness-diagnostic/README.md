# Instrumented diagnostic only

Command: `node scripts/profile-witness.mjs` after `npm run build`. This is a
bounded fixed-witness investigation, not the full acceptance workload. Its
sourceStart/sourceEnd hashes identify the exact runtime and instrumentation.
The before report uses the retained October 7 runtime; the after report uses
the length-pruned runtime. Original acceptance seeds/counts/warmup/timers/gates
are unchanged. Each report keeps all20,000 individually timed observations,
stage-loop receipts, GC events and the actual CPU profile. No outlier is
removed. Stage loops and inspector sampling do not establish the historical
hosted failure cause, nor do timing-control/filter results certify0.05ms.

The delivery preserves both reports. The diagnostic excludes caller inputs
from caches and compares all17,576 lowercase3-letter words against the prior
full matcher; that comparison is supplemental rather than blind independence.
