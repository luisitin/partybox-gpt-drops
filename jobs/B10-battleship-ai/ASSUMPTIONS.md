# Assumptions

- Primary full benchmarks use public ship identity on hits and exact already-hit sunk hulls, consistent with the existing cited classic feedback contract. Anonymous hits remain supported when the host identifies the sunk hull; adjacent hits are never merged by guessing.
- Ships are labeled even when lengths agree; touching is allowed, overlap is forbidden. Complete legal fleets have a uniform prior.
- Full-game tests retain all original counts, seeds 1, 2, 3, Hard mean below 45, and the literal 50 ms maximum gate. No timing outliers are removed.
- Sampled inference is an importance-weighted approximation. Exact counts are compared to literal enumeration; every sampled benchmark return is independently reduced from its public legal-world audit, and every selected shot is independently replayed using its final RNG draw. The private simulator fleet is never passed to a matcher.
