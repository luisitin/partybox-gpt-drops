# B13 verification

## Current acceptance report documentation rendered — 2026-10-09T14:05:36.114178+00:00

Command actually executed: `python scripts/check-data.py --require-local-captures`.
Deterministic research validation; random seed n/a. Full raw validator output: [reports/checks.json](reports/checks.json). This table records that exact checked row set, whose canonical version-list SHA is `54fb1f1b86cc169ac24117a409748cacc84ff956c2b5c638e76b41064c32d588`.

| Check | Cases | Passed |
|---|---:|---:|
| Authored rows against JSON Schema, IDs, four unique options, answer/index and author hashes | 1000 | 1000 |
| Category difficulty 34/33/33 and exact answer positions 25/25/25/25 | 10 | 10 |
| Author quotation fields in actual hash-checked retained bodies | 3509 | 3509 |
| Current independent adversarial acceptances | 1000 | 1000 |
| Current actual second-pass source support reviews | 1000 | 1000 |
| Second-pass quotation associations/body matches | 3509 | 3509 |
| Retained similarity flags with current accepted concrete resolutions | 2210 | 2210 |

Schema/data errors: 0. Ten category files each have 100 real rows. Quote matching proves retained text presence, not factual entailment or independent editorial origin: the independent per-row reviewers read actual surrounding paragraphs/footnotes, tried concrete counterexamples, checked scope/fun facts/options and preserved original rejects. Source GET timestamps are actual original opens, not refreshed when a later choice order is reviewed.

The near-duplicate scan compares all 499,500 unordered normalized question pairs, takes the maximum of both SequenceMatcher directions and flags every ratio>0.8. Only current accepted keep/distinct decisions resolve a flag; rejection metadata cannot be counted as a pass. All historical flag payloads and substantive duplicate repairs remain retained.

Historical original shuffle scope: the original answer-position draft cycled A/B/C/D by numeric ID, allowing 100% prediction. That actual challenge is preserved in `evidence/fullset-position-pattern-challenge.json`. The original seeded final shuffle (root seed 20261007, separately derived category seeds) and original ordered-option reviews are retained in `evidence/final-option-permutation-manifest.json`. Two original late rejections produced the declared 0515 and 0979 amendments in `evidence/final-option-post-shuffle-amendments.json`. The historical independent audit's 998 unchanged-row statement concerns that original delivery, before later editorial amendments; it does not certify later row or option versions. Current row hashes, option counts, answer positions and independent assessments are bound to the actually executed report above. Later amendments preserve their own original versions and actual independent rereviews under `evidence/resume-audit-20261009/` when present.

The final original-cycle heuristic scores 278/1000. Full-pack length strategy metrics and the actual editorial assessment bind the exact current row hashes in `evidence/option-length-assessment.json`. The independent position audit reports all category pairs, preserved selected answers and actual descriptive metrics; it does not certify randomness or promise that no possible fitted heuristic exists.

## Local evidence and hosted CI scope

Full local command: `python scripts/check-data.py --require-local-captures`. Missing required author or second-pass bodies fail. Every retained body is SHA256 checked; each selected answer/fun-fact/additional-scope quote is checked for contiguous presence and at most 25 words.
Full hosted command: `python scripts/check-data.py --output reports/ci-checks.json`. It validates exact row/source identities, actual HTTP 200 receipts, UTC times, requested/resolved URL chains, hashes, quote associations, context/claim assessments, review hashes, full counts and editorial gates. Full source bodies are excluded; unavailable bodies are explicitly reported and are never described as matched or newly reopened by CI. Hosted checksum checking runs before validation. GitHub CI evidence is added only after its actual exact-head conclusion is known.

The separately authored guard audit in `evidence/independent-post-repair-checker-guard-tests.json` records actual production-function negative cases: a missing mandatory local body, a naked incomplete reopen receipt and an explicitly rejected duplicate decision. All three are rejected as required; the earlier demonstrated gaps and original audit are preserved outside delivery. This compact audit records the actual function tests, not an invented rerun or source GET.

## Preserved failed and rejected evidence

Initial music quote-path recovery failure, original per-category rejects, real Taj Mahal repeated-question challenge, source-dependency challenges, full1000-row position-pattern failure, actual citation/hash-encoding mismatch corrections, overwritten music capture-chain failures and their real fresh-GET recovery are retained in `evidence/`, `reviews/`, and `reports/`. Original decisions are not relabeled after a fact/choice edit.

## UNVERIFIED

- Current original-gate pending values: `{"adversarialNotCurrent": 0, "knownExactAnswerCycle": false, "optionLengthEditorialAssessment": null, "reopenNotCurrent": 0, "similarityFlagsUnresolved": 0, "targetRowsMissing": 0}`.
- Exact final-head hosted CI must be checked after the current source push. Completed historical immutable audits are retained below with their original version scope.
- Factual correctness and independence are reasoned source judgments, not mathematical guarantees; no human party playtest or empirical US-audience difficulty calibration is claimed.

## Retained historical verification

These completed audits retain their original version hashes and actual dates. They do not certify later row or checker amendments.

## Actual independent option integrity audits

The original pure-shuffle audit command was `python /workspace/b13-position-audit/audit_positions.py --repo /workspace/job-B13/jobs/B13-trivia-1000 --output /workspace/b13-position-audit/final-held --label held-final-shuffle --before /workspace/job-B13/jobs/B13-trivia-1000/evidence/pre-final-option-shuffle-snapshot.json --manifest /workspace/job-B13/jobs/B13-trivia-1000/evidence/final-option-permutation-manifest.json --before-category-dir /workspace/b13-position-audit/provisional-2112/held-categories`. Root seed 20261007; derived per-category seeds are preserved in the immutable permutation manifest. All 1,000 permutations/answers/non-option fields, all ten category bindings and all 45 category-sequence comparisons passed. The source proof is copied byte-for-byte under `evidence/independent-position-audit-original-final-shuffle/`.

The actual latest overlay command was `python /workspace/b13-position-audit/audit_amendments.py --repo /workspace/job-B13/jobs/B13-trivia-1000 --original-audit /workspace/b13-position-audit/final-held/audit.json --output /workspace/b13-position-audit/current-two-amendments`. All 998 unchanged rows, two declared amendment payloads/hashes, 1,000 unchanged indices, ten balanced categories and all 45 sequence comparisons passed. Exact actual capture time, script and audit hashes are in `evidence/independent-position-audit-two-amendment-overlay/provenance.json`. This audit is distinct from source/factual acceptance. The independent scripts and full raw snapshot are retained outside delivery; copied reports retain their original historical paths.

Actual lead full local command, exit 0 and exact checker/report/stdout hashes are recorded in `evidence/lead-final-local-acceptance-provenance.json`, with raw output in `reports/final-lead-full-check.stdout.txt`. There were no unavailable required author or second-pass bodies.

## Independently held full local acceptance — 2026-10-07T21:31:22.419498+00:00

The separate auditor copied 244 delivered files and 1,051 referenced plaintext bodies into a read-only snapshot, then checked every SHA and size both before and after. No source or copy bytes changed. It actually ran `python3 scripts/check-data.py --require-local-captures --output .work/independent-full-check.json` in `/tmp/b13-independent-delivery-audit/held-20261007T212900Z` once, exit 0 in 17 seconds, and produced a report byte-identical to the lead's full report (SHA256 `d7dd966e8ecac09660e9dc3854863e33ba16d588657c2eaae04eda3f9f748403`). Random seed n/a for deterministic validation. All 1,000 current row/review versions, 3,507 author and 3,507 second-pass quote matches, 4,000 receipt associations and 2,210 flagged-pair resolutions passed. The independent source-document audit checked 1,000 sections and all additional quotes, with zero issues.

Actual checksum command `sha256sum --check SHA256SUMS.txt` passed 243/243 declared file hashes in that snapshot. Its whole-file size audit passed all 244 files, largest 9,525,424 bytes, against the 30,000,000-byte limit. The final documentary additions are the copied audit evidence, portable guard reproduction, docs and regenerated inventory/checksum list; all category/review/source/checker/full-report bytes remain those independently audited. The final checksum and exact-head CI verify the expanded delivery. Full raw results, snapshot hashes and the auditor's limitations are copied byte-for-byte under `evidence/independent-held-delivery-audit/`. No full copyrighted source body is in the GitHub payload.

The marathon original author raw HTML was unavailable after a recorded capture-ID collision. Its normalized author plaintext was restored byte-identically from an actual reviewer copy; neither the local proof nor the audit claims to reconstruct that original raw response.

## Reproduced checker regression guards and final delivery checks

Actual command: `python scripts/verify-guard-fixtures.py . > reports/checker-guard-fixtures.json`; exit 0, three cases / three passed, deterministic seed n/a. It executes the actual production guards on explicitly synthetic negative fixtures: required absent local body, incomplete reopen receipt and rejected duplicate decision. It does not open sources or grade facts. Actual run time and unchanged checker SHA are in the report. The original independent three-case artifact remains preserved. Hosted CI repeats the portable command after the full acceptance.

Final checksum command: `sha256sum --check --quiet SHA256SUMS.txt`; 253/253 declared files pass, deterministic seed n/a. Final size command: `python -c "from pathlib import Path; f=[p for p in Path('.').rglob('*') if p.is_file() and not {'.work','__pycache__','node_modules'}.intersection(p.parts)]; assert all(p.stat().st_size < 30000000 for p in f); print(len(f),max(p.stat().st_size for p in f))"`; 254/254 delivered files pass, largest 9,525,424 bytes. Per-file sizes excluding the checksum list and inventory itself are in `reports/delivery-inventory.json`. The inventory is itself checksummed.

## Polish pass 2026-10-08 — commands and results

Environment: Python 3.13 in the clone at 60293314 plus this pass's commits, PartyBox checkout 26b85ba6 (`/home/user/partybox`, read only), Chromium from the sandbox. Outputs went to `.work/` (gitignored), so `reports/checks.json` and the other committed reports were not overwritten.

| Check | Exact command | Cases | Result |
| --- | --- | ---: | --- |
| Hosted acceptance | `python3 scripts/check-data.py --output .work/checks.json` | 1000 rows, 528 sources, 3,507 quote fields | exit 0; 1000/1000 adversarial accepts; 1000/1000 reopen supports; 2,210/2,210 similarity flags resolved; `researchComplete` true. Seed n/a. |
| Local full acceptance | `python3 scripts/check-data.py --require-local-captures --output .work/local.json` | 1000 rows | exit 1 in this clone: 1,040 "required local body missing" messages and 277 reopen gates not current, because `.work/` is absent. The author's proof is unchanged and was not reproduced. |
| Draft progress | `python3 scripts/check-data.py --draft --require-local-captures --output .work/draft.json` | 1000 rows | exit 1, same cause. |
| Guard fixtures | `python3 scripts/verify-guard-fixtures.py .` | 3 | 3/3 pass (missing body, incomplete reopen receipt, rejected duplicate). |
| Adapter self-test | `python3 scripts/to-partybox.py --self-test` | 6 mapping cases, id mapping, distinct-choice check, normalisation | ok |
| Adapter build | `python3 scripts/to-partybox.py --out .work/partybox` | 1000 rows in | 949 kept, 51 excluded; 0 errors against the mirrored PartyBox limits (question ≤160, choices ≤60 and distinct, source ≤200, id pattern, subcategory-in-category). Longest: question 113, choice 52, source 107. |
| PartyBox schema | `PB_REPO=/home/user/partybox /home/user/partybox/node_modules/.bin/tsx partybox/validate-with-partybox.ts .work/partybox/questions.json` | 949 items | `questionsPackSchema` accepts all 949 (exit 0). |
| Exclusion refresh | `python3 scripts/to-partybox.py --refresh --bank /home/user/partybox/games/lightning-round/content/questions.json` | 5,567 bank items | 5 answer-in-question leaks; 32 same-fact duplicates (same answer, normalized similarity ≥ 0.8); 14 state-capital duplicates; 481 review-queue pairs. Bank text is not written to the repo. |
| Speech reader | validator (informational, Zira voice, `toSpeakable`) | 949 items, 4,745 strings | 434 strings with digits read as words (years); 153 with a phonetic override for "US"; 39 roman-numeral strings (27 kept rows) spelled letter by letter, e.g. "Louis XVI" → "X V I", "World War II" → "I I", "Title VII" → "Title V I I". |
| Phone width | headless Chromium, 390 px viewport, six longest rows | 6 cards | no horizontal overflow (scrollWidth 390); tallest card 420 px in an 844 px screen. A plain HTML mock, not the PartyBox client. |
| Option similarity | ad hoc scan, all 1000 rows | 4 options per row | 24 pairs with an equal or substring option; 1 is a real distractor problem (B13-0110); the rest are plausible distractors. |
| Answer position and difficulty | `python3 scripts/check-data.py` (categories) | 10 categories | 34/33/33 difficulty and 25/25/25/25 positions in every category (re-counted with a script in this pass). |
| Time-sensitive stems | ad hoc keyword scan | 41 flagged | 20 lack an "as of 2025" cutoff. All 20 were read: definitional or historical facts (largest living bird, Kodokan 1882, the 1896 Olympics), so no cutoff added. |
| US-specific share | ad hoc keyword count | 1000 rows | 198 rows. us-geography 90/100, us-history-civics 52/100, world-geography 5/100, world-history 1/100. |
| Spot check | seeded random sample, seed 20261008, 40 rows | 40 rows | No factual errors found against the reviewer's own knowledge. Two difficulty doubts (B13-0074, B13-0427). This is not a source re-open. |
| Checksums | `sha256sum --check SHA256SUMS.txt` | the delivered file set | run on the final committed tree; the pushed head's B13 workflow repeats it. |

Changes made in this pass: `scripts/to-partybox.py`, `partybox/`, `README.md`, `INTEGRATION.md`, these notes, `NEXT.md`, the regenerated `reports/delivery-inventory.json` and `SHA256SUMS.txt`. The held rows (`categories/`), `evidence/`, `reviews/`, `research/`, `reports/checks.json` and `CONFLICTS.md` are unchanged.

UNVERIFIED in this pass:
- No cited source was re-opened. Each fact stays as strong as the job's earlier review records.
- The local full acceptance was not reproduced (`.work/` absent). The author's run stays as recorded above.
- Subcategory assignment: 490 rows use a default. No human has reviewed the keyword rules.
- Spanish: no twins exist. The port must list them as `dropped` or translate them.
- Difficulty labels are judgment only; no audience playtest.
- Speech was measured with the Zira voice only, not the production voices.
- The phone-width render is an HTML mock, not the PartyBox client.
- Overlap with the content packs C01–C08 and with other PartyBox question banks was not checked.

## Genuine retained-evidence recovery — 2026-10-09

The unchanged87693947 row set was independently revalidated against all1,051 original retained plaintext bodies in a fresh checkout. Actual original full captured-evidence check exited0 at11:27:18.872093 UTC; the controller closed11:27:19.849227 with all1,312 source/body fingerprints unchanged. All1,000 rows,3,507 author/3,507 reopen quotations,4,000 receipts and2,210 similarity resolutions pass. Checksum verification, allthree original guard fixtures and the original adapter self-test also pass. Full current original hosted log113423823659/run37809925089 was physically read in its entirety and compared byte-for-byte with the decoded tool text; SHA53ae9ccbf331c721641d9fa5375c3c76c8951b706baccb923708946551e00c12. This original workflow uploads no artifact, and its hosted check matches0 private quotation bodies.

Exact receipts and body hashes are in evidence/resume-audit-20261009/. This closes the earlier clone-specific missing-body limitation for the original version. It does not certify pending editorial amendments or a current player-quality review; NEXT lists the reproduced remaining issues. No new formal KEEP GOING credit or current Ready status is claimed.

## Current eight-amendment checkpoint — 2026-10-09

Eight exact question variants now have actual independent current reviews and sixteen fresh second opens. The full captured-evidence draft report passes1,000 rows,3,508 author and3,508 reopen literal matches,4,000 associations and all2,210 similarity resolutions. It is explicitly incomplete only at the exact-current independent option-length editorial gate. Historical reports/checks.json and its old guard report have not been relabelled current. Self/missing-author and malformed/future/non-UTC date acceptance failures, plus actual renderer history/NEXT loss, were reproduced before repairing their production gates. Private full source bodies and HTTP response headers are excluded. Draft28 remains Draft; original Ready22 is unchanged. No pre-green repair is counted as a formal KEEP round.

## Actual current nine-row independent immutable audit — 2026-10-09

Separate reviewer /root/restart_g01_0458 actually ran the unchanged current original full local checker on a normal-copy286-file snapshot with1,087 byte-identical retained plaintext hardlinks, without changing original permissions. Its corrected invocation naturally closed12:37:04.450165 UTC, exit0; the complete800,173-byte report SHA8cfddb7f0488ccc2346ee72d4e757e20eaa326044eeaf7de985a3f82f7c71b31 is byte-identical to the actual lead report. All current1,000 rows/546records/3,509 author+3,509 reopen matches/4,000 associations/1,000 current independent reviews and all2,210 pair resolutions pass. All15 current actual guard fixtures and the entire285-entry manifest exited0. Every source+copy file/body hash and full size remained unchanged before/after. The first invocation really exited1 because its output was placed outside the copy root; only the auditor output argument was corrected, with no production/gate/source change, and both actual invocations are preserved. No fresh GET,991-row factual rereview, human playtest or formal KEEP credit is claimed by this audit.

The auditor recorded a30MiB ceiling; the lead separately verifies the stricter30,000,000-byte delivery ceiling for every frozen file. The maximum is9,525,424 bytes under both. The final additions are audit receipts plus documentary continuation/inventory/checksums; the actual checked questions, sources, reviews, report, checker, renderer, schema and original workflow remain byte-identical to the frozen audit. Final current hosted whole-log acceptance is pending after this source publication.
