# B18 improvement log

## Completed independent verification

The previous delivery lacked blind independent authorship. An isolated author
wrote RK4, an analytic spring, a conservative settling estimate and a 113-bit
Bezier evaluator from the original instructions and public contract. Source
hashes were sealed before integration; their authoring record and self-checks
are retained in `tests/blind/`. Production `motion.ts` was unchanged.

The full `npm test` rerun passed every suite for seeds 1, 2 and 3. The sealed
RK4 reference checked all 151,939,668 trajectory states; the sealed Bezier
reference checked all 3,000,000 required random points and 120,012 named points.
All 75 isolated mutants compiled and were caught by assertions. Historical
references remain supplemental checks. Actual `.work/results/seed*.json`
reports were copied into `results/`.

Clean local dependency installation succeeded with
`npm ci --ignore-scripts --no-audit --no-fund`. Hosted CI also passed for the
integration commit `1aa792d9b425d89920e809f18eac5f55a9fccf27`:
https://github.com/luisitin/partybox-gpt-drops/actions/runs/37633596287.
The PR description records the subsequently observed run for the final delivery
commit, so its exact head and status can be checked without a self-referential
commit identifier in these files.

## Remaining limits

The documented accuracy domains and finite-output guard limitations remain.
Live browser-engine differential sampling has not been run. These limits are
listed in `VERIFY.md`; none removes a requested numerical or mutation suite.
