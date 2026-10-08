# B19 continuation point

Branch `job/B19-name-filter` (PR #2, draft). Polish pass 2026-10-08 made two product changes: failures
carry a stable `suggestion` key, and `analia`, `analise` and `sexto` are exact exceptions (292 total).
Local core and full runs pass every behavioral, corpus-policy, mutation and sealed-reference suite. The
checksum manifest was regenerated after the last edit. Remaining local failure: the literal 0.05 ms gate
on this loaded 4-CPU box.

Next, in order, for a human or the desktop agent:
1. The hosted runs on `303f4f0` (37810714023) and `0974951` (37810885025) failed only the literal latency
   gate on seed 1 (3 and 1 calls above 0.05 ms). The benchmark sample changed when three names were added to the
   positive list, so this is not a clean comparison with the green `2b54431` run. Decide whether to keep this
   source or revert the product change to `5371665d`. Do not rerun it to get a green, and do not change the gate, a seed, a count or a
   warm-up. The owner decides whether the gate stays a hard check or becomes a recorded benchmark.
2. Owner decision: a Spanish lexicon with native review (INTEGRATION.md gap 1). Until then, PartyBox must
   not rely on this filter for es rooms.
3. Owner decision: accept or change the eleven blocked Census names (CONFLICTS.md 1; no allowlist exists).
4. Port per INTEGRATION.md. Normalize with `normalizeName` first; wire `name_blocked`; close the saves
   and reconnect bypasses.

Do not replace the maximum with a percentile, retime or filter failures, add a result cache, or repeat an
unchanged source until it happens to pass. Any further source change must rerun `npm ci --ignore-scripts
--no-audit --no-fund && npm test` and regenerate `SHA256SUMS.txt` from `reports/latest/SHA256SUMS.txt`.
