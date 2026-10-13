# Independent authoring and integration

The production author and the coordinator authored separate transition builders
and stationary solvers. They exchanged the original requirements and a public
mathematical contract for states, dice, jail rules, card multiplicities and
observation conventions. They did not exchange implementation source, algorithms,
tests or computed answers until both cores were sealed. The production owner’s
pre-exchange record is `PRODUCTION-AUTHORING.md`; the coordinator’s is
`blind-authoring/AUTHORING.md`. Public third-party research accessed before the
production seal is disclosed in the production record.

The production core is unchanged since its pre-exchange seal:
`b43bcb333a028cb622e027ea4563b3bfc86afbada8e189e7fae892b01b538c58`.
It uses integer transition enumeration and sparse power iteration. The separately
authored transition/linear reference is unchanged:
`d9bce69c3c9dd7e27ec528a61e8b3feab5068b94e5fa85ad8ff44f0432e8df5b`.
Both pre-exchange drivers and raw self-check reports are preserved with seals.

After the stationary source exchange, the coordinator separately authored an
ROI oracle using only the public property data contract, rent formulas and its
own previously sealed stationary implementation. The coordinator had not viewed
production source, tests or ROI outputs. It independently enumerates special
Chance arrivals from dice, rather than reading production event matrices. Its
290 pre-exchange self-checks and separate seal are preserved in `blind-authoring/`.
`roi-reference.ts` is copied without changes, SHA256
`ee9b607e9217a5eab63fc3f84c436028cbcb7b39f3d1c2a2da48e8ed6cb8042a`.
Scenario labels differ; the harness compares scenario structure and all numeric
fields in canonical property/level order. Prices and rents are separately
compared against source-extracted fixtures, so both ROI authors receiving those
public mathematical inputs cannot conceal changed production property data.

The integration harness and direct imperative simulator were written after
source exchange. They are additional verification, not claimed as blind authors.
All required exact and mutation checks call the blind transition/stationary and
ROI implementations. Simulation uses the independent linear probabilities as
its expectation. Published fixtures are external comparisons, not production
imports or stored solver answers. `npm test` verifies each authoring seal, the
unchanged integrated copies and the before/after hashes of all executed sources.
The ROI seal contains its original absolute authoring paths; the runner verifies
the archived files by their basenames without modifying the original seal.
