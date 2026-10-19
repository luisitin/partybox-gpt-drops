# Post-seal native verification adapter

This adapter is authored by the original blind author after both authoring seals.
The original 13-file blind seal and primary seal remain unchanged. No primary
implementation or algorithm source was opened to author this adapter: only the
public struct/function contract and binary observation protocol were exchanged.

`generate-core.hpp` is exactly the original sealed `generate.cpp` prefix before
its CLI `int main(`. The CLI is removed because C++ implicit main return no longer
applies when the function is namespace-renamed. No generation arithmetic is
changed. `native-reference.hpp` adds score/turn APIs over that independently
authored inventory, completion weights and the blind author's own full tables.
It never uses primary tables or primary decisions to produce its own optimum.
Canonical upper-zero reuse applies only when even all remaining five-match
upper scores cannot earn the bonus; score() retains the actual input subtotal.

`reference-verification.ts` is exactly the sealed TypeScript runtime with one
additional factory return property exposing its existing private `evaluate`
result. It changes no scoring, expectation, decision or memo arithmetic. The
original source is kept intact. This access-only verification copy ties native
choices to the real authored TypeScript implementation for every observed card.

`verify-stream.mjs` checks all 252 dice multisets, all three value layers and
every category/hold policy for every supplied distinct component. It validates
legal held submultisets. Different policies caused by floating evaluation order
are directly evaluated against the actual TypeScript optimum at a fixed 1e-10
tolerance; alternative counts and maximum differences are retained. Doubles
are numerical expectations, not an exact-rational or bitwise equality claim.
The complete transient binary stream and ordered key stream receive SHA256
digests; inputs and reports permit reproduction without publishing gigabytes
of redundant layer values. No partial stream or missing expected record passes.

The standalone format is 9,076 bytes: uint32 public key; zero/one/two each 252
little-endian float64; category/holdOneCode/holdTwoCode each 252 int32. The paired
format is 8,572 bytes: key; primary category252uint8 and h1/h2 codes252uint16;
reference same policy fields; reference zero/one/two252float64. No struct padding
is serialized. Public key is mask + upper*8192 + eligibility*524288 +
publishedMode*1048576. Each hold code is six face-counts in base6.

The primary callback may be async and is awaited for every record. Empty streams,
partial records, duplicate keys and an explicit expected count mismatch fail.

Build native adapter with -std=c++20 -O3 -ffp-contract=off -Wall -Wextra -Werror
-pedantic. No fast-math or fused multiply-add contraction is allowed. CLI/stream
filesystem access and native compilation are development verification tools,
outside the zero-dependency pure TypeScript runtime.

## Actual development self-checks

The standalone native stream was checked on 1,000 distinct publicly valid card
keys: 756,000 numeric and 756,000 policy comparisons, no differences or alternate
choices. The parser's paired-format synthetic protocol check repeats those same
reference vectors as its primary fields; that is a transport test, explicitly
not a primary simulation or independent-primary success claim. Corrupt/partial/
missing/duplicate streams and failing async callbacks are deliberately rejected.
The native score API additionally checks all 252 dice multisets and all 13
categories under 20 profiles against the real sealed TypeScript scoring body,
including upper-threshold crossing, both modes, zero/50 Yahtzee boxes and forced
Joker branches. Its report records 65,520 cases and 524,160 field comparisons.

Reproduce native/TS development checks from this folder after strict compiling
reference-verification.ts with the pinned TypeScript 5.8.3 used by the job:

```
g++ -std=c++20 -O3 -ffp-contract=off -Wall -Wextra -Werror -pedantic dump-reference.cpp -o dump-reference
./dump-reference SELFCHECK-KEYS.bin ../official.bin ../published.bin > ../native-observations-selfcheck.bin
node verify-stream.mjs ../official.bin ../published.bin standalone SELFCHECK.json 1000 < ../native-observations-selfcheck.bin
node parser-selfcheck.mjs
g++ -std=c++20 -O3 -ffp-contract=off -Wall -Wextra -Werror -pedantic score-selfcheck.cpp -o score-selfcheck
./score-selfcheck ../official.bin ../published.bin | node score-selfcheck.mjs
```

The generated native-observation staging file and executables are not delivery
files; the sealed source, input key file and reports reproduce them.
