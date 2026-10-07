# Independently authored fleet enumerator

`blindOracle.ts` was written before this author inspected the existing production implementation, old oracle, job README, or tests. Only the repository root rules, original B10 prompt, and algorithm-neutral public contract supplied by the coordinating agent were read. No production imports or geometry helpers are used.

Public assumptions: row-major square boards of size 2–10; up to ten labeled ships with lengths 1–size; horizontal/vertical straight hulls; adjacent ships legal; overlap forbidden; 0 unknown, 1 miss, 2 unresolved hit, 3 revealed sunk hull. Named hits belong to their named afloat ship. All unresolved hits must be covered, and every afloat ship has an unknown cell because a fully hit ship should already have announced sinking. Equal-length ships retain distinct labels. Empty fleets are valid.

The reference generates its own geometry, filters each labeled ship's possible hulls, and literally traverses every nonoverlapping combination. A leaf counts only if all unresolved hits are covered. It counts labeled fleets and per-cell remaining-fleet occupancy. Target occupancy counts a cell when its occupying afloat ship contains an unresolved hit. No connected-component inference, halo rule, sampling, or partial-count fallback is used.

The optional exact-enumeration budget returns an explicit error with no partial counts. Enumeration counters are exact safe integers bounded by the validated node budget, then converted to BigInt. The oracle has no runtime dependencies, global cache, RNG, clock, or input mutation.

This file and oracle will be sealed in a commit before inspecting existing implementation code. API adapters, validation alignment, and additional policy-reference work after sealing will be identified separately; they do not erase the initial authoring boundary.
