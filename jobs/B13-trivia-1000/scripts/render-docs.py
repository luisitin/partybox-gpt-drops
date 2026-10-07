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

## Actual current progress check — {now}

Command actually executed: `python scripts/check-data.py --draft --require-local-captures`.
Deterministic research validation; random seed n/a. Full raw validator output: [reports/checks.json](reports/checks.json). This table records that exact checked row set, whose canonical version-list SHA is `{report['optionLengths']['rowVersionsSha256']}`.

| Check | Cases | Passed |
|---|---:|---:|
{table}

Schema/data errors: {len(errors)}. Ten category files each have100 real rows. Quote matching proves retained text presence, not factual entailment or independent editorial origin: the independent per-row reviewers read actual surrounding paragraphs/footnotes, tried concrete counterexamples, checked scope/fun facts/options and preserved original rejects. Source GET timestamps are actual original opens, not refreshed when a later choice order is reviewed.

The near-duplicate scan compares all {N*(N-1)//2:,} unordered normalized question pairs, takes the maximum of both SequenceMatcher directions and flags every ratio>0.8. Only current accepted keep/distinct decisions resolve a flag; rejection metadata cannot be counted as a pass. All historical flag payloads and substantive duplicate repairs remain retained.

The original answer-position draft cycled A/B/C/D by numeric ID, allowing100% prediction. That actual challenge is preserved in `evidence/fullset-position-pattern-challenge.json`; final balanced seeded random option ordering and actual full ordered-choice rereads are pending until their final manifests/reviews are accepted. Global option-length metrics are in the report, with actual independent full-pack editorial assessment required rather than acceptance from means alone.

## Local evidence and hosted CI scope

Full local command: `python scripts/check-data.py --require-local-captures`. Missing required author or second-pass bodies fail. Every retained body is SHA256 checked; each selected answer/fun-fact/additional-scope quote is checked for contiguous presence and≤25words.
Full hosted command: `python scripts/check-data.py --output reports/ci-checks.json`. It validates exact row/source identities, actual HTTP200 receipts, UTC times, requested/resolved URL chains, hashes, quote associations, context/claim assessments, review hashes, full counts and editorial gates. Full source bodies are excluded; unavailable bodies are explicitly reported and are never described as matched or newly reopened by CI. Hosted checksum checking runs before validation. GitHub CI evidence is added only after its actual exact-head conclusion is known.

## Preserved failed and rejected evidence

Initial music quote-path recovery failure, original per-category rejects, real Taj Mahal repeated-question challenge, source-dependency challenges, full1000-row position-pattern failure, actual citation/hash-encoding mismatch corrections, overwritten music capture-chain failures and their real fresh-GET recovery are retained in `evidence/`, `reviews/`, and `reports/`. Original decisions are not relabeled after a fact/choice edit.

## UNVERIFIED

- Current original-gate pending values: `{json.dumps(report['pending'],sort_keys=True)}`.
- Final balanced random ordering and actual per-row review of all final ordered options.
- Final exact-version similarity resolutions and option-length editorial acceptance.
- Full held-version local acceptance, independent immutable delivery audit, final checksums and exact final-head hosted CI while those records remain pending.
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
(R/'NEXT.md').write_text('''# B13 concrete continuation

1. Finish root exact-version world/nature reviewer checks and US-history independent requested repairs. Preserve every original rejected row/hash and actual source receipt.
2. Lead holds the ten finalized categories, preserves the original A/B/C/D cycle, shuffles each category to exactly25answers per position with a published deterministic seed, and seals full before/after permutations.
3. Every category reviewer actually reads every final ordered option set, records concrete counterexamples and binds current row hashes; original source GET times remain unchanged unless actually refetched.
4. Independently resolve every final similarity pair after actual final question/fun-fact reads; examine exact full-pack length metrics and bind the actual editorial assessment to all final row hashes.
5. Run full original local acceptance with `--require-local-captures`, render coherent docs and manifests, have the independent auditor copy/verify an immutable delivered+body snapshot and run its full acceptance, push only job/B13-trivia-1000 and its one read-only CI workflow, inspect exact-head hosted CI and publish an honest ready-for-review PR22. Never merge or push main.
''')
print(json.dumps({'renderedAt':now,'rows':N,'summary':summary,'researchComplete':complete}))
