# Movement assumptions

- Entering a destination defines movement cost: ordinary entries spend one
  step; pass-through entries spend zero steps and count one visit. Initial
  positions are not entries, and face zero stops immediately.
- Spending the last ordinary step ends movement immediately. Dead ends retain
  the current physical position and discard unused steps.
- Distinct next IDs are uniformly selected after deduplication. `kind` is
  metadata; only `passThrough` changes movement cost.
- The target policy compares shortest directed input-graph edge-hop distances,
  including zero-cost nodes. Ties are uniform. Unknown or unreachable targets
  give uniform choice; reaching a target does not stop movement.
- Positive mass entering a closed pass-through class is reported as
  `nonTermination`. Every reachable recurrent class member has infinite
  unconditional expected visits; transient visits can remain finite.
- Required finite-path enumeration covers DAGs and cycles that consume steps.
  Infinite zero-cost path families are solved exactly and are never truncated.
- Simulation means one million complete rolls on each of 50 boards per seed,
  from one fixed start per board. Exact suites cover every physical start,
  both policies, faces zero through ten, and exact die mixtures.
- The production API rejects malformed inputs, including an omitted target for
  the target policy. Random valid-input comparisons always supply a target ID.

## Cloud queue and boundary handling

The current user's CLAIMS.md-only main updates override the generic README ban solely for queue coordination. Existing job branches are resumed in lowest-ID claim order rather than skipped. A claim is shared only after a confirmed successful push. No queue ownership is inferred from a local-only main commit.

BoardNode.next is an array of string IDs, as declared by the public type. Untyped/JSON calls with missing, null, string, Set, array-like or non-string entries are malformed and must be rejected, while genuine valid dead ends, self-loops and unreachable targets remain supported. No sealed oracle was altered.

## Polish pass 2026-10-08

- Die keys are strict: an object key must equal `String(Number(key))`. Keys such as `''`, `'01'`, `'1e0'` and `'-0'` are rejected, not repaired to a face. Values must be `Rational` objects with bigint fields. Earlier builds silently accepted these.
- `dieFromFractions` is the only string parser. It accepts optional minus on the numerator and integer fractions, nothing else.
- The B01 connection uses a byte-for-byte fixture (`fixtures/b01-odds.json`, SHA-256 `3874aeeb...`) because CI checks out only this branch. Changing the B01 table requires re-copying it deliberately.
- The independent Python brute force is evidence and a regression gate. It uses its own generator and enumerates literal walks with `fractions.Fraction`; it is not a second copy of the TypeScript logic.
- Unknown `target` IDs still fall back to uniform choice. That behaviour is pinned by the sealed reference and is not changed here; the port must validate targets (see INTEGRATION.md).
