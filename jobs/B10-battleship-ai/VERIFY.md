# Verification status

The new sealed blind references pass all three correctness seeds. Full original
benchmark counts and the unchanged literal 50 ms gate remain pending.

| Suite | Count per seed | Passed | Seeds | Exact command |
|---|---:|---|---|---|
| Strict TypeScript/configuration checks | 1 build / 6 static checks | All | 1,2,3 | `npm run build && node test/run.mjs --no-bench` |
| Exact reduced-board density vs blind literal enumeration | 10,000 | All | 1,2,3 | same |
| Easy/Medium/Hard blind shot policies | 30,000 | All | 1,2,3 | same |
| Sampled legal-world and conditional-marginal blind audit | 200 | All | 1,2,3 | same |
| Individually planted bugs | 25 | All 75 caught | 1,2,3 | same |

Machine evidence is in evidence/blind-correctness.json and .log. Original source
verification and failed local timing are retained in evidence/previous-VERIFY.md
and raw-reports.zip. New exact/policy/audit authoring was sealed before production
inspection; BLIND-REFERENCE.md records the scope. The benchmark now independently
checks every shot and every Hard density return, including all sampled audit worlds.

## UNVERIFIED

Final 100,000 games per difficulty per seed, all literal 50 ms maxima, Hard mean
below 45 on all three seeds, and hosted exact-head CI are pending. An exploratory
1,000-game run had one 72.618 ms call and is explicitly a failed latency gate. No
cause is assigned without a trace and no outlier is waived.
