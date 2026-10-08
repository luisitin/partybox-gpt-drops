# B19 continuation point

Branch `job/B19-name-filter` (PR #2, draft). Polish pass 2026-10-08 made two product changes: failures
carry a stable `suggestion` key, and `analia`, `analise` and `sexto` are exact exceptions (292 total).
Local core and full runs pass every behavioral, corpus-policy, mutation and sealed-reference suite. The
checksum manifest was regenerated after the last edit. Remaining local failure: the literal 0.05 ms gate
on this loaded 4-CPU box.

Next, in order, for a human or the desktop agent:
1. Read the hosted run for the pushed head (`mcp__github__actions_list`, workflow `B19.yml`). Do not
   change the gate, a seed, a count or a warm-up to make it pass.
2. Owner decision: a Spanish lexicon with native review (INTEGRATION.md gap 1). Until then, PartyBox must
   not rely on this filter for es rooms.
3. Owner decision: accept or change the eleven blocked Census names (CONFLICTS.md 1; no allowlist exists).
4. Port per INTEGRATION.md. Normalize with `normalizeName` first; wire `name_blocked`; close the saves
   and reconnect bypasses.

Do not replace the maximum with a percentile, retime or filter failures, add a result cache, or repeat an
unchanged source until it happens to pass. Any further source change must rerun `npm ci --ignore-scripts
--no-audit --no-fund && npm test` and regenerate `SHA256SUMS.txt` from `reports/latest/SHA256SUMS.txt`.
