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
