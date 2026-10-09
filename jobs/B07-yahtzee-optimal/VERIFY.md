# Verification and actual evidence

Run `npm ci && npm test` from `jobs/B07-yahtzee-optimal`. `npm test` executes
`node run.mjs`; every mandatory suite runs for seeds 1, 2 and 3 without reduced
counts. `reports/summary.json` and each `reports/full-seed-N.json` contain the
actual reports, current source hashes and runtime versions. Historical full
receipts and raw stdout are retained under `reports/historical/` because
integration checks were improved after the earlier complete run.

| Test | Cases per seed | Seeds | Exact command run by npm test | Observed result | Evidence |
|---|---:|---|---|---|---|
| Strict production and independent TypeScript | all configured strict flags | deterministic build | `node node_modules/typescript/bin/tsc -p tsconfig.json`; explicit strict compiler commands in `run.mjs` | PASS | full stdout and source hashes |
| Original primary seal | 19 files, original source replayed from snapshot | 1, 2, 3 invocation | `checkSeal` in `node run.mjs` | PASS | unchanged original manifest |
| Independent original seal | 13 files | 1, 2, 3 invocation | `checkSeal` in `node run.mjs` | PASS | unchanged original manifest |
| Native adapter V1 / V2 seals | 14 / 30 files | 1, 2, 3 invocation | `checkSeal` in `node run.mjs` | PASS | original snapshot and amendment |
| Delivery checksums, size and purity | every delivered file <=30 MB; no runtime dependencies | whole invocation | `node run.mjs` | PASS | full manifest coverage and initial/final source hashes |
| Independent full table regenerations | both modes, 536,448 valid entries each | 1, 2, 3 | `./.verification/independent-generator MODE .verification/independent-regenerated-MODE-seed-SEED.bin` | PASS | byte-identical own sealed tables, actual generation counts |
| Primary full table regenerations | both modes, 536,448 valid entries each | 1, 2, 3 | regeneration inside `node simulate.mjs MODE SEED` | PASS | byte-identical shipped primary tables |
| Full independent table differential | 1,072,896 valid entries | 1, 2, 3 | `node verify-seed.mjs SEED` | PASS | worst absolute difference 9.379164112033322e-13 |
| Action-superset invariant | 536,448 matched official/published states | 1, 2, 3 | `node verify-seed.mjs SEED` | PASS | published legal actions never decrease optimum within declared roundoff tolerance |
| Boundary, immutability, ties and malformed inputs | 1,056 assertions | 1, 2, 3 | `node verify-seed.mjs SEED` | PASS | exact assertion results, including repaired null-mode replay |
| Random exact midgame optimum comparisons | 50,000, including 33,333 direct ordered-roll hold replays | 1, 2, 3 | `node verify-seed.mjs SEED` | PASS | 150,000 total; scorecards, dice and inputs unchanged |
| Every ordered roll x category x mode | 7,776 x 13 x 2 = 202,176 | 1, 2, 3 | `node verify-seed.mjs SEED` | PASS | 606,528 total independent scorer cases |
| Deliberate mutations | 25 separately strict compiled and runtime killed | 1, 2, 3 | `node mutate.mjs SEED` | PASS | 75 compile/kills; mutation names, edits and actual failures in reports |
| Fresh proof-cache mechanics | 16 assertions | 1, 2, 3 | `node proof-selfcheck.mjs` | PASS | synthetic transport only; corruption/order/partial/fingerprint failures rejected |
| Paired full simulated games | 1,000,000 per rule mode | 1, 2, 3 | `node simulate.mjs official SEED`; `node simulate.mjs published SEED` | PASS | 6,000,000 games; every individual result agrees |
| Paired strategy decisions | 39,000,000 per rule mode | 1, 2, 3 | same paired commands | PASS | 234,000,000 decisions: 156M holds and 78M categories |
| Paired score/bonus/next-card transitions | 13,000,000 per rule mode | 1, 2, 3 | same paired commands | PASS | 78,000,000 comparisons |
| Actual TypeScript/native full component vectors | all observed components, 252 full rolls each | 1, 2, 3 | same paired commands | PASS | fresh direct proof or exact-byte match to a proof from this invocation; per-cell direct/reused counts retained |
| Final aggregate | all six simulation cells and all three full seed suites | 1, 2, 3 | `node run.mjs` | PASS | hard assertions enforce 150k/606528/75/6M/234M/78M totals |

## Observed full local pass before the final integration rerun

The earlier full run completed on 2026-10-07 at 17:14:51 UTC with every original
count passed. Runtime: Node v22.16.0, TypeScript 5.8.3, g++ Debian 14.2.0.
The source changes before the final rerun are identified with both hashes in
`reports/historical/integration-changes-before-final-rerun.json`. Neither
production core, generator nor solved table changed in that interval.

| Mode | Seed | Games | Actual mean | Standard errors from computed EV | Component vectors | Direct TS checks | Exact-byte proof reuse |
|---|---:|---:|---:|---:|---:|---:|---:|
| official | 1 | 1,000,000 | 254.566784 | 0.352182 | 164,147 | 164,147 | 0 |
| published | 1 | 1,000,000 | 254.603886 | 0.239758 | 164,218 | 164,218 | 0 |
| official | 2 | 1,000,000 | 254.579815 | 0.132746 | 164,403 | 11,921 | 152,482 |
| published | 2 | 1,000,000 | 254.575741 | 0.232832 | 164,510 | 11,854 | 152,656 |
| official | 3 | 1,000,000 | 254.577033 | 0.179491 | 164,364 | 6,087 | 158,277 |
| published | 3 | 1,000,000 | 254.485353 | 1.753617 | 164,241 | 6,111 | 158,130 |

All six means satisfy the literal four-standard-error gate. The 985,883 complete
component vectors include 364,338 direct actual-TS checks and 621,545 exact-byte
proof reuses. Each record is SHA256-checked in full and each stream's first
component is also directly audited. Caches are deleted at the start of every
`npm test` and bound to core, generator, table, native executable, compiled TS,
bridge and verifier fingerprints. Any changed byte or fingerprint fails; no
persisted cache can stand in for a fresh full invocation. Bridge numeric/policy
counters count direct comparisons, not reused records; explicit direct/reused
record fields distinguish them. Visited keys and full stream hashes are retained.

Independent comparisons use absolute tolerance 1e-10 for floating summation
roundoff. Full table differences are below 1e-12. There are no epsilon ties in
production: exact floating equality uses canonical category/lexicographic hold
ordering. Different summation orders can select equivalent near-tied actions;
each alternative is replayed against the independent objective and must remain
within tolerance. The earlier random suites reported 317/283/307 alternative
holds, zero alternative categories, worst value gap 7.9581e-13 and direct
ordered-sum residual 2.2397e-11. The solver exhausts outcomes and actions;
this is not a bitwise/rational-arithmetic identity claim.

Pre-exchange primary selfcheck: 1,882,810 assertions. Original independent
selfcheck: 1,073,622 assertions. Adapter transport selfcheck: 1,000 components,
756,000 numeric and 756,000 policy comparisons, plus all 16 malformed-stream
fixtures rejected. Adapter scorer selfcheck: 65,520 scoring cases and 524,160
field comparisons across 20 actual profiles. These sealed development checks
are retained as original receipts; they are distinguished from each full CI run.

## Fresh final current-code local run

The final `npm ci` installation passed, followed by the complete `npm test`
process with exit code 0 in 1,400.454 seconds (23m20.454s). Actual runtime was
Node v24.19.0, TypeScript 5.8.3 and g++ Debian 14.2.0; the hosted workflow is
separately pinned to Node 22.16.0. `reports/final-local-receipt.json` and
`reports/final-full-npm-test.log` retain the process result and full stdout.

The fresh run passed all three full seeds, all six million-game cells, all
150,000 midgame states, 606,528 scoring cases and 75 actual mutant kills. Both
complete generators regenerated their own tables for each seed. The new
536,448-pair action-superset invariant and 16 fresh-cache assertions passed for
every seed. Means, visited component totals and direct/reused proof counts
exactly matched the retained earlier complete pass. No production core,
independent seal, table, native controller or test source changed during this
fresh invocation. Only publication documents were updated after exit; their
before/after hashes are recorded separately from the tested source receipt.

The exact final production source SHA256 is
`878f038112b2a12a5bd9f0ecaed375b89360cfa0e7894fc91ec4cc923f4de0fa`.
The GitHub run exercises the complete same command against the published commit;
its actual observed green URL is linked in PR21 once it completes.

## UNVERIFIED / explicit limits

The literal conjunction "official forced Joker rules and EV 254.5896" conflicts:
official computes 254.5877; the separately exposed published convention computes
254.5896. CONFLICTS.md records both rule sources and calculated results. No false
literal pass is claimed.

Expectations are IEEE754 approximations to exact finite sums, not rational
return values. A bitwise identity between independently ordered floating sums
is not claimed. Human rule interpretation outside the selected US40958 edition
is not certified.

The final-head hosted result is recorded in the PR description only after the
workflow actually finishes. The historical local pass alone does not prove the
latest integration edits or hosted runtime; the fresh final reports and exact
commit/run link distinguish that evidence.

## Polish pass 2026-10-08

Scope: `jobs/B07-yahtzee-optimal/**` only. The kit change is commit `e3591e6`; the commit that carries this section adds docs and the manifest.

Full `npm test` (Node v22.22.0, TypeScript 5.8.3, g++ 13.3.0), run from `jobs/B07-yahtzee-optimal`:
- Exit 0, 16:22 to 16:53 UTC (31 min 14 s on a busy shared machine).
- Seeds 1 to 3 all PASS: 150,000 midgame states; 606,528 scoring cases; 75 of 75 strict compiled mutants and 75 of 75 runtime mutants killed; 6,000,000 full paired games; 234,000,000 native decision comparisons; 78,000,000 native scoring transitions; 985,883 visited component vectors.
- Port kit PASS (`partybox/test-port.mjs`): 1,072,896 valid and 1,024,256 invalid table slots checked; 3 x 5,548 = 16,644 bitwise root-versus-port states; six adapter cells of 300 games, all within 4 standard errors; 16 of 16 port mutants killed.
- The run's log is kept in scratch, not in the repo. The run rewrote tracked files under `reports/`; they were restored with `git checkout` after the run, and `SHA256SUMS.txt` matches the restored files.
- An earlier full run in this pass was stopped at 45 minutes by the background limit of the command that ran it, before it printed its exit line (a harness timeout, not a test failure). It is not counted; the run above is the result.

Gates in a scratch PartyBox copy of `26b85ba6`, with the final kit files copied in (`cmp`-identical):
- `tsc -p tsconfig.json`: exit 0.
- `eslint games/yahtzee --max-warnings 0`: exit 0.
- `prettier --check games/yahtzee`: exit 0.
- `vitest run games/yahtzee`: 13 files, 105 tests passed (117 s on the busy machine).

Simulations in the same scratch copy (`pnpm sim --game yahtzee --seed 1`):
- 2 players, `--skills normal,sharp --strategy fast`, 200 runs: 0 failed; wins per seat sharp 73.5%, normal 26.5%.
- 4 players, same flags, 200 runs: 0 failed; 40.1% of games per sharp seat, 9.9% per normal seat.
- 6 players, `--strategy fast`, 200 runs: 0 failed (104 s).
- 6 players, default `mixed`, 200 runs: 152 runs fail with `stuck×152` on the port, the same count on a clean export of `26b85ba6` with no port, and with `--skills normal,sharp`. Pre-existing; see INTEGRATION.md gap 5.

Other measurements:
- Cold start (Node v22.22.0; CommonJS transpile of the kit's `tables.ts` and both generated files; three runs): import with both tables decoded, 148 to 164 ms; first `solvedValue` lookup under 0.2 ms; heap used about 19.9 MB.
- The earlier lazy version, from a stale build in `.verification/`: import 55 to 66 ms, then 34 to 57 ms on the first lookup per mode.
- Gzip of the two generated tables at `gzip -9`: 2,773,413 and 2,772,152 bytes (5.5 MB together); raw 7,672,630 bytes.
- Bundle (an earlier pass, before the `tables.ts` change, which is server-only): the yahtzee phone entry is 8.4 KB gzip, the TV 17.8 KB, and no game module is in the entry.

Failure found and fixed in this pass: the first `test-port.mjs` run after the eager-table change exited 1. Mutant P07 replaced only the `official` entry, which left `SOLVED_OFFICIAL` unused; strict TypeScript then rejected it (TS6133), so the mutant check crashed. P07 now swaps both entries. Re-run: 16 of 16 killed.

Corrections to the record (INTEGRATION.md, "This pass (continued)" lists each one): the roll-log files, the `bot.ts` header and signature, the ADR number, the Joker default, and removal of two unsupported figures (solo averages; `stuck×76`).

Still not run here: `pnpm verify` (the whole gate, including fuzz replay, build, drift and i18n) on the port. CI on the pushed head is recorded in the PR, not in this file.

## Verification audit 2026-10-09 — current source pending hosted proof

The original903 delivery was genuinely accepted before this repair: full
run37812451169/job113432500423, official artifact11565573928,2598244 bytes,
SHA256 a18f5c80b16c95ffac5a85d5a886bf1e1dbfccb77edc18ae071071241cf290e5.
The complete84070-byte native log SHA256 is
8d8089eeb16d1d0b6edafdeec8fc61a76571ed77cabf1d46285e94f55d10f0cb.
All153 original Git blobs,148 manifest entries,96 immutable source hashes,
51 safe ZIP members and89 native JSON records matched in full. Its old
75 actual mutants,150000 midgames,606528 scorers,6M games,234M decisions,
78M transitions and16 port mutants passed. This is historical903 proof only.

Actual original defect replay: replacing only the original tracked summary
with the genuine original hosted summary makes `node run.mjs` exit1 at the
original `Committed manifest .../reports/summary.json` assertion. Every original
source blob was restored. The raw failure and receipt remain in
reports/recovery-20261009/original-current903/.

Current additions (no reduction or replacement of original checks):

| Check | Cases | Command | Current observation |
|---|---:|---|---|
| Report-session success/failure restoration |47 assertions,2 successes,4 failures| `node report-session-selfcheck.mjs` |PASS: actual child exit7, SIGTERM143, thrown exception and ENOENT retain fresh outputs and restore originals|
| Standalone primary regeneration |2 modes x3 seeds,536448 reachable states/mode| `npm test`, `.verification/generator --mode MODE --seed SEED --output PATH` |Full changed-source hosted proof PENDING at publication; entire SHA256 must equal shipped binary|
| Full original workloads and original seals |all original counts and seeds1/2/3| `npm ci && npm test` |Full changed-source hosted proof PENDING at publication|
| Final delivery manifest and report originals |every current manifest entry| `node run.mjs` after child naturally closes|Full changed-source hosted proof PENDING at publication|

Fresh runtime reports are exported by the original single workflow from
.verification/full-run-reports/latest/ rather than from restored historical
inputs. report-session.json binds original/output/restored hashes and actual
child status; passed=false is retained for failures. All invocation archives
and original-input backups survive repeated runs. Historical tracked reports,
all original independent/primary/adapter seals and all original workload gates
remain checked. The workflow retains its original read-only permissions,
Ubuntu runner, pinned Actions majors, original Node22.16.0 and30-minute cap.

UNVERIFIED: changed-head hosted whole acceptance and final KEEP GOING are still
pending at this publication. All prior documented rule conflict, numerical
limits and private-product whole pnpm verify/port risks remain. Transport
selfchecks prove restoration mechanics, not Yahtzee semantic outcomes.
