# B13 verification

## Actual current progress check — 2026-10-07T21:09:44.934532+00:00

Command actually executed: `python scripts/check-data.py --draft --require-local-captures`.
Deterministic research validation; random seed n/a. Full raw validator output: [reports/checks.json](reports/checks.json). This table records that exact checked row set, whose canonical version-list SHA is `74712c3d244f8d96b481862f38d03cd4ffb47bbfb88dd09177d0c6f271d33de7`.

| Check | Cases | Passed |
|---|---:|---:|
| Authored rows against JSON Schema, IDs, four unique options, answer/index and author hashes | 1000 | 1000 |
| Category difficulty 34/33/33 and exact answer positions 25/25/25/25 | 10 | 10 |
| Author quotation fields in actual hash-checked retained bodies | 3506 | 3506 |
| Current independent adversarial acceptances | 1000 | 1000 |
| Current actual second-pass source support reviews | 1000 | 1000 |
| Second-pass quotation associations/body matches | 3506 | 3506 |
| Retained similarity flags with current accepted concrete resolutions | 2210 | 2199 |

Schema/data errors: 0. Ten category files each have100 real rows. Quote matching proves retained text presence, not factual entailment or independent editorial origin: the independent per-row reviewers read actual surrounding paragraphs/footnotes, tried concrete counterexamples, checked scope/fun facts/options and preserved original rejects. Source GET timestamps are actual original opens, not refreshed when a later choice order is reviewed.

The near-duplicate scan compares all 499,500 unordered normalized question pairs, takes the maximum of both SequenceMatcher directions and flags every ratio>0.8. Only current accepted keep/distinct decisions resolve a flag; rejection metadata cannot be counted as a pass. All historical flag payloads and substantive duplicate repairs remain retained.

The original answer-position draft cycled A/B/C/D by numeric ID, allowing100% prediction. That actual challenge is preserved in `evidence/fullset-position-pattern-challenge.json`; final balanced seeded random option ordering and actual full ordered-choice rereads are pending until their final manifests/reviews are accepted. Global option-length metrics are in the report, with actual independent full-pack editorial assessment required rather than acceptance from means alone.

## Local evidence and hosted CI scope

Full local command: `python scripts/check-data.py --require-local-captures`. Missing required author or second-pass bodies fail. Every retained body is SHA256 checked; each selected answer/fun-fact/additional-scope quote is checked for contiguous presence and≤25words.
Full hosted command: `python scripts/check-data.py --output reports/ci-checks.json`. It validates exact row/source identities, actual HTTP200 receipts, UTC times, requested/resolved URL chains, hashes, quote associations, context/claim assessments, review hashes, full counts and editorial gates. Full source bodies are excluded; unavailable bodies are explicitly reported and are never described as matched or newly reopened by CI. Hosted checksum checking runs before validation. GitHub CI evidence is added only after its actual exact-head conclusion is known.

## Preserved failed and rejected evidence

Initial music quote-path recovery failure, original per-category rejects, real Taj Mahal repeated-question challenge, source-dependency challenges, full1000-row position-pattern failure, actual citation/hash-encoding mismatch corrections, overwritten music capture-chain failures and their real fresh-GET recovery are retained in `evidence/`, `reviews/`, and `reports/`. Original decisions are not relabeled after a fact/choice edit.

## UNVERIFIED

- Current original-gate pending values: `{"adversarialNotCurrent": 0, "knownExactAnswerCycle": true, "optionLengthEditorialAssessment": "PENDING", "reopenNotCurrent": 0, "similarityFlagsUnresolved": 11, "targetRowsMissing": 0}`.
- Final balanced random ordering and actual per-row review of all final ordered options.
- Final exact-version similarity resolutions and option-length editorial acceptance.
- Full held-version local acceptance, independent immutable delivery audit, final checksums and exact final-head hosted CI while those records remain pending.
- Factual correctness and independence are reasoned source judgments, not mathematical guarantees; no human party playtest or empirical US-audience difficulty calibration is claimed.
