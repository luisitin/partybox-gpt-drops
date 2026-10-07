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

## Finite Unicode policy-character compilation

Compiled declared glyphs, case variants and known ignorable formats at module
initialization, including normalized expansions, mapping and letter/number flags.
This avoids per-call NFKD/mark/format passes when every input character is
supported. Contextual lowercasing remains over the complete string; marks or
formats are removed ahead of it only when Unicode marks them Case_Ignorable.
Unknown Unicode retains the original path. The compiled table is private and
receives no per-call writes; there is no name/result cache.

All original 43,830 independent comparisons per seed and 75 mutations passed.
Another 1,296 context checks per seed passed. Source/runtime gzip sizes remain
3,946/3,114 bytes, below 6,000. The complete default npm test still failed the
literal timing gate: 37, 15 and 12 calls above 0.05 ms; maxima were 41.188051,
0.714895 and 19.354561 ms. Many failures are ordinary ASCII paths. Those are
actual wall-clock observations; their precise cause is not proven, and none
is removed or replaced by a percentile or a later favorable rerun.

## ASCII-letter guards and broader finite Unicode compilation

The original general ASCII-letter shortcut removes redundant control/content/trim
and remapping checks while retaining the exact exception and blocked/reversed
matchers. Its full original suite passed all behavioral/mutation checks but
failed 19/21/12 of the literal 10,000-call latency observations per seed; maxima
were 0.470704/0.480532/0.196494 ms. All raw receipts remain in
results/optimization-ascii-word/. The instrumented GC/optimization diagnostic
remains separate, with its actual timing and then-stale-inventory failures
disclosed in results/diagnostics-ascii-word/DIAGNOSTIC-NOTES.md.

The next substantive change compiles all 94 printable fullwidth ASCII and 64
Latin-1 code points at module initialization through the existing NFKD policy.
This avoids repeated normalization/replacement allocations for fullwidth text
and ordinary accented names. Whole-string contextual lowercasing and unknown
Unicode fallback remain unchanged. Neither inputs nor results are cached.
Every original suite/count/seed and the unchanged 100,000 warm-up calls plus
10,000 individually timed calls per seed remain intact. The sealed reference
and supplemental historical oracle are unchanged.

The complete npm test passed 131,490 original independent comparisons, 3,888
existing Unicode contexts, 4,266 newly added range contexts, all corpus-policy
checks, zero obfuscation misses and all 75 actual executed mutations. It still
failed the literal maximum: 5/11/9 outliers, maxima
0.154320/0.582158/0.227552 ms. Medians were
0.000616/0.000546/0.000541 ms. Source/runtime gzip sizes are 4,239/3,225 bytes.
Raw source-bound full reports are in results/optimization-width-latin1/.
These measurements do not prove scheduler/GC causation, erase prior failures
or establish complete acceptance. The PR remains a draft.
