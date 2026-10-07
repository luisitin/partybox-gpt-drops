# Post-exchange oracle amendment

The original blind reference was independently authored and sealed before
primary-source access, SHA256317cce5eaa7e896a936e74d57a1d959b3d411b97afd5fd199f0490043961cf52.
Its `reference.ts`, authoring record, original driver/report and original seal
remain unchanged at their original paths.

After both independent cores were sealed, the primary owner reported a sparse
owned-ID array boundary. The oracle owner independently inspected the public
contract and reproduced the defect: with a valid one-edge route and
`new Array(1)`, original `longestTrail` returned0. `Array.map` skipped the sparse
slot, bypassing the requirement that every owned ID be known and distinct.
Ticket connectivity could instead throw TypeError. The agreed contract requires
RangeError for both malformed inputs; this is an oracle defect, not a change to
route/trail rules or an adjustment to match a production answer.

`amended-reference.ts` changes only the validation traversal from
`ownedIds.map` to `[...ownedIds].map`, making holes explicit undefined entries
that the existing validation rejects. No trail, scoring, legality or RNG
algorithm changes. `sparse-replay.mjs` preserves the concrete before/after
replay, and `amended-selfcheck.mjs` reruns every original own self-check with
the amended source. Strict compilation and successful replay/self-checks are
sealed independently in `AMENDED-SHA256SUMS.txt` after completion.

The original blind stage and this later exchanged-stage correction are both
retained; the amended source must not be described as byte-identical to the
original blind seal. Primary integration should use the amended source and
archive the original record as well.

## Primary post-seal repair

Primary initial2b96b13... is preserved byte-for-byte as ttr.snapshot.ts.txt.
Actual pre-repair boundary outcomes are in reports/pre-repair-boundaries.json.
Sparse claim cards and held ticket arrays skipped Array.every checks, unsafe
integer card/ticket counts were accepted, and NaNseed coerced into a seed.
Primary now validates spread arrays, uses safe integers, rejects malformed route
records and rejects invalid seeds. Its amended hash is79982cb6fc526354b6a44da665077f55971869d49632bbfd7199d0ccee10523b.
No trail/scoring algorithm changed. The helper independently rechecked exactly
60,000small graphs+60,000ticket queries and boundary/RNG cases against this
amended primary with zero disagreements; see helper-full-differential.json.

Initial oracle317c... is separately preserved as reference.snapshot.ts.txt.
The helper's independently agreed sparse ownedID repair is the sole oracle
amendment; currentreference matches reference.amended.snapshot.ts.txt exactly.

## Portable archive and driver paths

All original helper files, including the three independent seals, are copied
unchanged to `reports/oracle-archive/`. `tests/oracle-self.mjs` verifies those
seals, copies the archive to test-output, and reruns both original and amended
self-checks plus the concrete sparse-array replay. Those new compilation and
report writes do not alter the archive. Current TypeScript 5.9.3 is additionally
used; the original sealed authoring run used 5.8.3.

`tests/graphs.mjs` retains `tests/helper-probe.snapshot.mjs.txt`'s comparisons
and counts. Its path adaptations are portable imports (`../dist/`), local
snapshot source-hash paths and writing its report to `test-output/graphs.json`.
All original 20,000-per-seed differential comparisons are retained. An additional
comparison on every identical graph calls the blind author's exhaustive
edge-subset `brute` function, copied unchanged from the sealed self-check driver
to `tests/brute.mjs` (only its export and provenance header added). This checks
all subsets up to 2^12, retaining the Euler criterion and valid weight pruning.
The core independently authored trail algorithms remain unchanged. Current immutable-input goldens and full-game harness were written
after exchange and are identified as integration tests, not blind authorship.
