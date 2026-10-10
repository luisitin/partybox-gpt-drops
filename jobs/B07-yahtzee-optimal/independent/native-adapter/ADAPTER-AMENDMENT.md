# Adapter V2 amendment

Original V1 adapter and its unchanged 14-file seal are retained under v1-snapshot. The original independent implementation and 13-file seal are unchanged.

V2 caches the finite 252 full-roll inventories and 462 legal hold inventories, codes and dice arrays. It replaces repeated reconstruction with exact integer catalog lookup and six inventory comparisons. Every numeric comparison, policy comparison, alternative-optimum check, stream checksum and invalid-input check remains. No solver arithmetic, tie decision, tolerance, score field or simulation count changes. Proof reuse across simulations, if implemented by the primary author, is outside this adapter and must be fresh per test invocation and fingerprint-bound.

All original parser positive and negative fixtures are rerun before the V2 seal.
