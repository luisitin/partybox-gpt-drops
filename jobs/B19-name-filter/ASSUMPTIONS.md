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
- Runtime optimization uses a stateless ASCII fast path and a combined regex
  scan. It adds no result cache, ambient randomness, clocks or dependencies.
- Only this job folder and the required B19 workflow may change. Delivery uses
  `job/B19-name-filter` and PR #2; main is never pushed.
