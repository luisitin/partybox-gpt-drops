# B11 independent reference provenance

## Isolation

The author wrote this reference in `/workspace/blind-b11` before opening any
B11 production source, previous reference, fixture generator, tests, algorithm
notes or job README. No production/helper imports occur in `reference.ts`.
The author has not used another solver's algorithm or implementation.

Files/information read before sealing:

- Original B11 brief in `/workspace/partybox-gpt-drops/PROMPTS.md` and repository root README.
- Public API, type definitions and guard semantics supplied in messages by root/primary owner. Types were defined independently here from that contract.
- Explicitly permitted rule evidence in `/workspace/job-B11/jobs/B11-rummikub-solver/SOURCES.md` and `CONFLICTS.md`; these contain rule citations/profile decisions and old fixture identifiers, but no fixture/code content was opened.
- Publisher's English Classic manual downloaded directly from https://rummikub.com/wp-content/uploads/2019/12/2600-English-1.pdf and independently read via pdftotext, pages 1–4. PDF SHA256: `88a6f8b14c119b19b641dcfd13352f9eca3364f1b1a4219459b0f8f1b506ab00`. The copyrighted PDF/text are local research inputs and are not delivery files. This author did not independently inspect the manual's illustrations.
- The installed TypeScript 5.8.3 compiler from the B19 dependency directory was executed for strict compilation; no B19 algorithm was used in this reference.

## Public protocol

`reference.ts` exports independent `validateTable`, `validatePosition`,
`validatePlay(before, afterTableArray)` and `findBestPlay`, with its own public
TypeScript types. Validation comparisons should use acceptance; failure codes
and messages are independent. Successful solutions compare objective value,
new rack tile count and validity, rather than witness ordering or search stats.
IDs are nonempty strings (whitespace permitted); ordinary extra JSON keys are
ignored. All returned physical/placed tiles are copied explicitly.

## Algorithms

For 14 or fewer solver resources, every physical subset is literally enumerated.
Independently computed color/value/duplicate metadata quickly rejects subsets
that cannot possibly form a run or group. Every surviving subset is checked for
all permitted run windows/group joker bindings. An exact partition recurrence
covers every old table tile, optionally leaves rack tiles, and maximizes new
represented value followed by new tile count. Keeping only the maximum-score
binding of a physical subset is valid because no binding couples separate sets.

For larger resources, this independent implementation completes every possible
run interval and every 3/4-color group from physical tiles/jokers, then solves
weighted exact cover with optional rack tiles. It uses bigint tile sets,
minimum-candidate branching and memoization. An upper bound is the sum of
remaining rack numeric values plus 13 per rack joker, with rack count as tie
break. There are no time/state cutoffs and no heuristic result advertised as
optimal. Large inputs can take exponential time; the oracle has no universal
performance guarantee.

## Official rule profile and limit

Pages 1–4 independently confirm 106 classic tiles, 3/4 distinct-color groups,
ascending same-color runs without wrap, rack-only opening >=30, represented
joker opening value, and 30-point retained-joker penalty. Page 3 permits flexible
joker clearing, including table/rack replacements and splitting/dissolving an
old run. A retrieved joker must make a new set that turn; at least one rack tile
is required somewhere on that turn, not necessarily in each joker's new set.

This reference implements the explicitly supplied English2019 **end-of-turn**
profile: all old physical IDs stay on a legal final table, at least one rack tile
is added, and opened table jokers may be rebound. Opening preserves each old
meld's physical set and represented bindings; group/meld-list order is irrelevant.
The endpoint API cannot certify each intermediate retrieval/reuse operation or
its ordering. No universal manipulation-sequence certification is claimed.

## Actual self-checks before seal

Strict TypeScript 5.8.3 compile passed with noUncheckedIndexedAccess,
exactOptionalPropertyTypes and noUnused checks. All 54 own cases passed:
19 table, 11 position, 10 transition, 14 exact-objective solver fixtures.
Golden solver cases include two joker assignments, fourth-tile extraction,
opening preservation, a 16-tile optimum 184/16 and a 40-table/20-hand optimum
164/20. Every played output is checked by the independent transition validator;
all output tables and input immutability are checked. `SELFCHECK.json` records
actual deterministic results/search stats. Timings were diagnostic only.

Another 1,000 deterministic 14-tile rack cases (seed 123456789) passed output
validity/immutability with total objective checksum 17,703. `THROUGHPUT.json`
records the actual result; this is supplementary and does not substitute for
50,000 required cases per integration seed. The initial 1,000-case measurement
was 1,018.541605 ms locally; no maximum or p99 claim is inferred from it.

## Seal

`SEALED-SHA256SUMS.txt` hashes authored source, own checks, configs and reports,
excluding itself and compiled/research files. Seal hashes were sent to root and
primary owner before either imported this reference. Subsequent integration is
outside the blind authoring phase; sealed files must remain byte-identical.
