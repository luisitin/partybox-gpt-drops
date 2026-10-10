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

## October 8 resumed incomplete delivery: minimum-length pruning

Fresh original-repository ownership check found no B19 row and a20-hour-old
sole branch; claimed15:42:00UTC in a separate main clone. OriginalPR2/history
and worktree remain intact. This resumes a failed acceptance task, not a
completed/cosmetic KEEP streak.

A bounded instrumented diagnostic uses the actual hosted seed-1 three-character
ASCII witness. Of63 forward terms, only3 can consume3 mapped characters.
Eligible matcher11–15ms versus complete matcher23–29ms per500,000 calls, and
zero disagreements on all17,576 lowercase3-letter strings. Production now
compiles minimum-length-eligible forward/reversed regexes once. The normalized
expansion fallback retains the complete matcher, with no result/witness cache.
Exact pre-change source and both complete diagnostic receipts are preserved.

The genuinely changed source's unchanged complete command failed literal
latency36/8/16 times; maxima0.472961/0.246780/0.456415ms. All88suites execute,
all original behavior/differential/mutation counts pass, plus74,619 new sealed
boundary comparisons. Gzip4477/3358bytes passes. No cause for all timing
outliers is claimed, no diagnostic replaces acceptance, no failure disappears,
and PR2 remains draft. A general already-lowercase allocation change is the
next candidate, conditional on actual diagnostic evidence.

## Real hosted regression: pinned corpus replay

The first resumed head's actual hosted log exposed daily GeoNames drift, so
only61suites and11,830sealed comparisons perseed executed; failure remained
explicit. The available original selected snapshot matches every original
locked byte hash. It is now checked in with attribution and fail-closed
offline restoration. Real8-case tests passed3times, preserving all32,000rows
and demonstrating corruption/missing-file rejection without network.

Private double-regex and charCode lowercasing candidates did not demonstrate
mixed whole-call gains; neither changed production. Balanced scan results and
exact scripts remain delivered, including slower batches. Existing runtime
5371665d and its actual failed latency receipts remain untouched. This source/
packaging correction requires fresh hosted complete checks; it is not a
completed acceptance or cosmetic KEEP round. PR2 stays draft.

## Four rejected optimization hypotheses and current complete CI

The exact snapshot restores all required hosted corpus workloads. Full current
head b3f5231 CI37807137561 still fails one0.063416ms seed3call. Actual complete
log read confirms all91suites and all original43,830sealed inputs perseed,
75mutants/15,000obfuscations/24snapshot tests/156checksums pass.

Double-regex ASCII folding, single charCode ASCII folding, lazy known-string
construction and a compiled unchanged-known-string proof were tested privately.
Every candidate preserves independent semantics on its declared complete
inputs/contexts, but none demonstrated consistent mixed whole-call gains.
All raw batches/GC observations and exact scripts remain delivered, including
slower batches and one corrected-before-measurement diagnostic quoting failure.
Only the earlier measured length pruning and exact snapshot replay were
installed. Production is frozen; literal acceptance still fails and PR2
remains draft. These are unfinished verification investigations, not cosmetic
KEEP rounds or proof of a hard realtime bound.
- 2026-10-08 polish: analia, analise and sexto added as exact exceptions and failures gained a suggestion key; INTEGRATION.md written; see VERIFY.md 'Polish pass 2026-10-08'. Literal 0.05 ms gate unchanged; hosted run 37809073933 green on 2b54431.
