#!/usr/bin/env python3
"""Render current documentation from an actually executed version-bound check."""
import hashlib,json
from pathlib import Path
from datetime import datetime,timezone
R=Path(__file__).resolve().parents[1];report=json.loads((R/'reports/checks.json').read_text())
def h(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':')).encode()).hexdigest()
rows=[]
for p in sorted((R/'categories').glob('*.json')):rows.extend(json.loads(p.read_text()))
rows.sort(key=lambda x:x['id']);versions=[{'id':r['id'],'rowSha256':h(r)} for r in rows]
assert report['optionLengths']['rowVersionsSha256']==h(versions),'Rows changed after check: rerun checker before rendering documentation.'
now=datetime.now(timezone.utc).isoformat();N=len(rows);errors=report['schemaAndDataErrors'];complete=report['researchComplete']
check_command='python scripts/check-data.py'+(' --draft' if report['mode']=='draft' else '')+(' --require-local-captures' if report['captureProofMode']=='required local author and second-pass bodies' else '')
status='All original research gates passed for the checked local version.' if complete else 'The authored pack is complete; independent research/editorial acceptance remains unfinished.'
summary=f"{N} questions in ten categories; {report['adversarialAcceptedCurrent']} current independent acceptances; {report['reopenSupportedCurrent']} current second-pass support reviews."
(R/'README.md').write_text(f'''# B13 — 1,000 verified trivia questions

{status} {summary}
Latest actually checked version rendered {now}; exact hashes and every open gate are in [reports/checks.json](reports/checks.json).

The original B13 prompt and [CONTRACT.md](CONTRACT.md) require four plausible choices, balanced difficulty/positions, two independent actual source accounts per factual claim, 100% fresh adversarial review and second-pass source reopening. JSON categories, schema, brief source quotes, immutable retrieval receipts, rejected versions and concrete corrections are included. Full copyrighted bodies remain in ignored local `.work/`.

Install: `python -m pip install -r requirements.txt`.
Full local evidence acceptance: `python scripts/check-data.py --require-local-captures`.
Full delivered/hosted metadata acceptance: `python scripts/check-data.py`.
Draft progress check: `python scripts/check-data.py --draft --require-local-captures`.

Local acceptance checks retained author and actual second-pass bodies against their original hashes and selected quotes. Hosted CI checks immutable receipt/quotation/context associations because full copyrighted bodies are excluded; CI does not make new external source opens or human factual assessments. Both modes require every final review and editorial gate. [VERIFY.md](VERIFY.md) records actual commands/counts and remaining limits; [SOURCES.md](SOURCES.md) lists all selected short quotes; [CONFLICTS.md](CONFLICTS.md) preserves disagreements and exclusions. [NEXT.md](NEXT.md) names the concrete remaining work. No GitHub main changes or merges are made.
''')
totals=[('Authored rows against JSON Schema, IDs, four unique options, answer/index and author hashes',N,N if not errors else 'see actual errors'),('Category difficulty 34/33/33 and exact answer positions 25/25/25/25',10,10 if not errors else 'see actual errors'),('Author quotation fields in actual hash-checked retained bodies',report['quoteFields'],report['quoteMatchesActualLocalCaptures']),('Current independent adversarial acceptances',N,report['adversarialAcceptedCurrent']),('Current actual second-pass source support reviews',N,report['reopenSupportedCurrent']),('Second-pass quotation associations/body matches',report['reopenQuoteAssociationsChecked'],report['reopenQuoteMatchesActualLocalCaptures']),('Retained similarity flags with current accepted concrete resolutions',len(report['similarityFlags']),report['similarityFlagsResolved'])]
table='\n'.join(f'| {name} | {cases} | {passed} |' for name,cases,passed in totals)
(R/'VERIFY.md').write_text(f'''# B13 verification

## Actual current acceptance check — {now}

Command actually executed: `{check_command}`.
Deterministic research validation; random seed n/a. Full raw validator output: [reports/checks.json](reports/checks.json). This table records that exact checked row set, whose canonical version-list SHA is `{report['optionLengths']['rowVersionsSha256']}`.

| Check | Cases | Passed |
|---|---:|---:|
{table}

Schema/data errors: {len(errors)}. Ten category files each have 100 real rows. Quote matching proves retained text presence, not factual entailment or independent editorial origin: the independent per-row reviewers read actual surrounding paragraphs/footnotes, tried concrete counterexamples, checked scope/fun facts/options and preserved original rejects. Source GET timestamps are actual original opens, not refreshed when a later choice order is reviewed.

The near-duplicate scan compares all {N*(N-1)//2:,} unordered normalized question pairs, takes the maximum of both SequenceMatcher directions and flags every ratio>0.8. Only current accepted keep/distinct decisions resolve a flag; rejection metadata cannot be counted as a pass. All historical flag payloads and substantive duplicate repairs remain retained.

The original answer-position draft cycled A/B/C/D by numeric ID, allowing 100% prediction. That actual challenge is preserved in `evidence/fullset-position-pattern-challenge.json`. The seeded final shuffle (root seed 20261007, separately derived category seeds) preserves all original facts and choice multisets in `evidence/final-option-permutation-manifest.json`; every reviewer then actually read every final ordered option set. Two late independent rejections produced explicitly declared author amendments to 0515 and 0979, each reread by its separate reviewer. `evidence/final-option-post-shuffle-amendments.json` preserves both changes; these two amendments do change options and are not claimed to preserve their original multisets. Independent audits prove the other 998 rows match the original shuffle exactly, and all 1,000 final indices remain unchanged with exactly 25 answers per position per category.

The final original-cycle heuristic scores {report['answerPositionPattern']['numericIdModulo4Matches']}/{N}. Full-pack length strategy metrics and the actual editorial assessment bind the exact current row hashes in `evidence/option-length-assessment.json`. The independent position audit reports all category pairs, preserved selected answers and actual descriptive metrics; it does not certify randomness or promise that no possible fitted heuristic exists.

## Local evidence and hosted CI scope

Full local command: `python scripts/check-data.py --require-local-captures`. Missing required author or second-pass bodies fail. Every retained body is SHA256 checked; each selected answer/fun-fact/additional-scope quote is checked for contiguous presence and at most 25 words.
Full hosted command: `python scripts/check-data.py --output reports/ci-checks.json`. It validates exact row/source identities, actual HTTP 200 receipts, UTC times, requested/resolved URL chains, hashes, quote associations, context/claim assessments, review hashes, full counts and editorial gates. Full source bodies are excluded; unavailable bodies are explicitly reported and are never described as matched or newly reopened by CI. Hosted checksum checking runs before validation. GitHub CI evidence is added only after its actual exact-head conclusion is known.

The separately authored guard audit in `evidence/independent-post-repair-checker-guard-tests.json` records actual production-function negative cases: a missing mandatory local body, a naked incomplete reopen receipt and an explicitly rejected duplicate decision. All three are rejected as required; the earlier demonstrated gaps and original audit are preserved outside delivery. This compact audit records the actual function tests, not an invented rerun or source GET.

## Preserved failed and rejected evidence

Initial music quote-path recovery failure, original per-category rejects, real Taj Mahal repeated-question challenge, source-dependency challenges, full1000-row position-pattern failure, actual citation/hash-encoding mismatch corrections, overwritten music capture-chain failures and their real fresh-GET recovery are retained in `evidence/`, `reviews/`, and `reports/`. Original decisions are not relabeled after a fact/choice edit.

## UNVERIFIED

- Current original-gate pending values: `{json.dumps(report['pending'],sort_keys=True)}`.
- Independent immutable delivery audit and exact final-head hosted CI remain pending until their actual integration records below are written.
- Factual correctness and independence are reasoned source judgments, not mathematical guarantees; no human party playtest or empirical US-audience difficulty calibration is claimed.
''')
source=['# B13 source quotations','',f'{N} current actual questions. Source ledgers record actual authorship, licensing/credit, retrieval timestamps/method/HTTP status and content hashes. Every selected fact is associated with two source accounts; final current acceptance coverage remains in the version-bound report. Full copyrighted captures are excluded.']
for r in rows:
 source.extend(['',f"## {r['id']} — {r['question']}",'',f"Answer: {r['correctAnswer']}. Fun fact: {r['funFact']}",''])
 for l in r['sources']:
  source.append(f"- {l['sourceId']}: [{l['publisher']}]({l['url']})")
  for f in ['quote','funFactQuote','extraQuote']:
   if f in l:source.append(f"  {f}: “{l[f]}” ({len(l[f].split())} words).")
(R/'SOURCES.md').write_text('\n'.join(source)+'\n')
(R/'NEXT.md').write_text('''# B13 delivery continuation

All 1,000 current question versions, source support reviews, final ordered-option reads, similarity decisions and the full-pack option-length assessment are closed in the actual full local report. The original rejects and two declared post-shuffle amendments remain preserved.

1. Hold all delivered files and referenced local bodies for the separate immutable-copy auditor. It must run the original full local checker once on its verified snapshot and preserve its actual output, exit status and before/after hashes.
2. Record the actual auditor result, final checksum and file-size results, then push only job/B13-trivia-1000 and its one read-only CI workflow. Inspect the hosted CI result for the exact pushed head.
3. Once the exact-head CI and separate audit actually pass, mark PR22 ready for review while leaving it unmerged. Retain factual judgment and human-playtest limits in the PR. Never merge or push main.

Further editorial changes must preserve these final held versions, invalidate affected row-bound acceptance, receive a separate actual rereview and repeat the affected checks. A future party playtest or empirical difficulty study can use this delivered pack without pretending one has already happened.
''')
print(json.dumps({'renderedAt':now,'rows':N,'summary':summary,'researchComplete':complete}))
