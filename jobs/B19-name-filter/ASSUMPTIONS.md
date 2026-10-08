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
  checkout. The original README forbids writes to main. The later user rule for
  main claim refreshes applies to partybox-game-cores, not this repository.
  Earlier inherited claim-row writes are historical; none is repeated here.
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
- PartyBox calls `nameFilter` on the output of its own `normalizeName` (invisible and bidi characters
  removed, whitespace collapsed, 1–16 code points). The filter counts raw input on its own; the port must
  never reverse that order (INTEGRATION.md, step 2).
- `suggestion` keys are a stable API; the host owns the copy and its translations.
- The literal 0.05 ms gate is kept as written. Actual hosted results include both
  passes and failures; local failures also remain valid. No cause or universal
  wall-clock guarantee follows from a finite pass.

## Isolated original-workload review, October 8

- Another active session pushed product changes to the original B19 branch.
  This review preserves those commits and uses its own
  `job/B19-name-filter-protocol-review-20261008` branch from ccc610f.
- The new suggestion keys and three exact benign spellings remain in production.
  The original 289-exception fixture, 459 fixed cases, 43,830 full comparison
  inputs and original timed positive list stay fixed. New name/bypass checks
  are supplemental; no original case, seed, timer or threshold is changed.
- The sealed reference code remains unchanged. It receives the current policy,
  including the three documented additions; original policy bytes are separately
  frozen only to preserve the original workload, not to undo the new product.
- One complete original B19 KEEP rerun on 2b54431 failed its literal timing gate.
  It is historical after the external product change, and is not current-source
  proof, a completed cosmetic round, or justification for a threshold waiver.
