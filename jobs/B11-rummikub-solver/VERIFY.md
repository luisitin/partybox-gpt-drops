# B11 verification

The blind reference is sealed and integrated. Full independent large-case verification and final hosted CI are pending. Historical same-author results are in `evidence/previous-VERIFY.md` and are not current acceptance evidence.

## Actual integration results

| Test | Seed | Cases | Passed | Exact command |
|---|---:|---:|---:|---|
| Strict build of production, legacy reference and blind reference | 1 | 3 | 3 | `npm run build` |
| Hand-written cases, including 40 joker fixtures | 1 | 61 | 61 | `SEED=1 node test/unit.mjs` |
| Contracts and metamorphic checks | 1 | 1,005 | 1,005 | `SEED=1 node test/contracts.mjs` |
| Literal physical-subset differential, at most 14 tiles | 1 | 50,000 | 50,000 | `SEED=1 node test/small.mjs` |
| Individually planted, strictly compiling source mutations | 1 | 25 | 25 | `SEED=1 node test/mutations.mjs` |

The reference author also ran 54 standalone semantic selfchecks and 1,000 deterministic 14-tile throughput cases before integration. Commands, individual results and the immutable source hashes are in `evidence/blind-seal/`. These do not replace the required full suites.

## Independence and timing boundaries

The reference author read the original task, root repository rules, the public API contract and official English rule evidence. Production, old reference, tests and algorithm notes were not inspected before sealing. The lead copied the unchanged source and pushed it before inspecting production. All optimum comparisons use the blind adapter.

The large independent answer ledger is freshly generated from public positions, with no production answers as input. It is reused only for the identical per-seed audit and benchmark corpus; input and source hashes are checked before every comparison. Production calls are fresh and timed separately. Every primary and reference table/play is revalidated.

The strict 500 ms gate checks both p99 and every measured production call's maximum. No outlier is discarded. Compiler errors, crashes, timeouts and launch failures cannot count as mutation kills; a passing baseline is required before mutation planting.

## UNVERIFIED

- Complete final-source `npm test` with all suites for seeds 1, 2 and 3.
- All 600 unique large positions and 24 warm-up positions compared to the independent optimum, and the full 500 ms timing gate. The first exploratory large physical-cover reference call was manually stopped without a completed result; the independent author is optimizing it without reading production.
- Final GitHub Actions success on the exact delivery head.
- Universal all-input/all-machine latency, intermediate manipulation animations, other rule editions and hostile JavaScript objects are outside the verified scope.
