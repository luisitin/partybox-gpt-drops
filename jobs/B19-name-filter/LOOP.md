# B19 improvement log

## Independent reference and first performance improvement

An isolated author wrote and sealed a reference from the public contract,
original instructions and policy JSON. Its 1,000 author self-checks passed
before production was inspected. The full three-seed suite then compared every
43,830 input per seed with that sealed source: zero disagreements. Generated
obfuscation misses remain zero and all 75 executed mutants were caught.

Production now bypasses compatibility/mark/format operations for printable ASCII,
classifies ASCII letters directly, and combines forward/reversed term matching
into one scan. Policy decisions and original mandatory-repeat counts are
unchanged. The mutation that disables reversed matching now targets the term
list in the combined matcher.

The first full local run after optimization passed every behavioral gate but
failed the unchanged literal latency gate: 20, 12 and 24 observations exceeded
0.05 ms in seeds 1, 2 and 3. Median times were 0.000824, 0.000741 and 0.000792
ms; maxima were 0.379979, 0.274470 and 0.759725 ms. These failures are retained,
and hosted execution will independently measure the final source.

All original upstream bytes matched the pinned snapshot hashes, including
GeoNames, and the complete 32,000-row cache was recovered without changing the
lock. Clean local `npm ci --ignore-scripts --no-audit --no-fund` succeeded.

## Further allocation reduction and retained final measurements

Moved character-property regexes to module initialization and added a plain
ASCII-word path that matches the already-normalized text directly. Updated
mutation anchors retain the original mark/format/reversed-scan defects. The
strict type-check invocation now resolves the pinned compiler without relying
on an ambient executable path. The complete final local npm test still passes
every functional, independent-reference and mutation suite, but its unchanged
literal timing gate fails. Final measured reports and every outlier input/time
are committed under results/. No benchmark filters, extra warm-up, timer-window
change or benchmark-specific runtime bypass was introduced.

The first optimized hosted run was also inspected and failed latency only:
https://github.com/luisitin/partybox-gpt-drops/actions/runs/37637661735.
It observed two outliers over the three seeds. The PR description retains the
subsequent final-head result and the local failures remain disclosed.
