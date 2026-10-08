# B19 assumptions

- Preserve the supplied public API, finite English-policy lexicon, exact benign
  exceptions, normalized substring matching, and 16-original-code-point limit.
- The newly independent reference was sealed before production, previous tests,
  previous references or PR descriptions were read. Its authoring record and
  hashes remain unchanged in `tests/blind/`.
- Preserve all original generated, corpus, differential and mutation counts at
  seeds 1, 2 and 3. Historical reference checks remain supplemental.
- The 0.05 ms maximum remains a literal gate on every measured call. Outliers
  stay failures; means or percentiles never replace that requirement.
- Identical-string name/obfuscation conflicts and overlength corpus rows retain
  their explicit reviewed rejections; a passed policy regression is not an
  assertion that every corpus row was allowed.
- Runtime optimization uses a stateless ASCII fast path, a combined regex
  scan and a private finite policy-character table compiled only at startup.
  Whole-string lowercasing and original Unicode fallback remain. It adds no result cache, ambient randomness, clocks or dependencies.
- Only this job folder and the required B19 workflow may change. Delivery uses
  `job/B19-name-filter` and PR #2; main is never pushed.

## Resumed unfinished delivery, October 8

- The user's active request is to finish stalled original projects. B19 is the
  original dashboard's remaining failed code delivery; already complete B jobs
  are not restarted. Fresh original-repository ownership was checked before
  claiming B19; game-core queue claims and original worktrees remain untouched.
- Continuation preserves PR2 and all existing branch history in a separate
  checkout. The only permitted main change is the RUN-ALL claim-row refresh.
- A bounded diagnostic uses the actual hosted seed-1 witness and private stage
  exports in a separate module. Its instrumentation/timings never substitute
  for the unchanged complete acceptance workload. Historical cause remains
  unproved even when a timer-only diagnostic also records long observations.
- Repeated-letter patterns cannot consume fewer mapped characters than their
  source term. Length-specific matcher compilation is a general algorithm
  improvement, not a witness/input/result cache or benchmark-specific bypass.

- The original daily GeoNames bytes no longer match the lock in fresh hosted
  CI. A complete, exact original selected snapshot exists locally and matches
  every committed output hash. Check it in with attribution and validate before
  restoration rather than rewriting the lock or reducing required corpus rows.
- Two private ASCII allocation candidates remain rejected: the double-regex
  candidate slowed all mixed batches, and the single-scan balanced batches
  showed0.06/1.8/6.8%slower total time despite fewer GC observations. Witness
  improvements alone do not justify installing a mixed-workload regression.

- The private lazy/regexp known-character candidates preserve independent
  semantics but fail the mixed-whole-call gain condition; neither enters
  production. Reduced fixed-witness GC observations alone are insufficient.
- Production remains frozen after bounded measured investigations. An unmet
  literal latency check is recorded as incomplete acceptance, not a fabricated
  source/toolBLOCKED state or an excuse to change the user threshold.
