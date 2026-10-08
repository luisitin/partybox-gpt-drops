#!/usr/bin/env python3
"""Quote-support check for minigames.json (B03 polish pass, 2026-10-08). Stdlib only, offline.

Two rules, both automated and both proxies for a human re-read (they prove neither support nor contradiction):

1. Claim flags for every claim with status corroborated or single_source:
   - title_only: every registered quote, reduced to words, is inside the minigame title (plus a, an, of, the, and).
     Heading locators are not text, so they do not count as quoted support.
   - missing_numbers: numbers the retained claim states that appear in none of the field's registered quotes.
   - fragment_only: for the two-sentence summary (evidence key gameplay), no registered quote is substantive
     (at least six words and not a heading ending in a colon).

2. Gameplay status rule (the summary's evidence): corroborated needs substantive quotes from two publisher
   lineages; single_source needs one; otherwise unverified. `expected_gameplay_status` implements it and the
   verifier checks every row against it.

`--write` regenerates reports/quote-support-check.json; the verifier recomputes it and fails on any drift.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CLAIMS = [('category', 'category'), ('format', 'format'), ('controls', 'controls'), ('timeLimit', 'timeLimit'),
          ('winRules', 'winRules'), ('scoreRules', 'scoreRules'), ('tieRules', 'tieRules'), ('reward', 'reward'),
          ('summary', 'gameplay')]
CHECKED_STATUSES = ('corroborated', 'single_source')
TITLE_WORDS = {'a', 'an', 'of', 'the', 'and'}
SKIP_KEYS = {'unresolved', 'scope', 'limitation', 'reportedLabel', 'fieldStatusMeaning'}
NUMBER_WORDS = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
                'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'fifteen': 15, 'twenty': 20, 'thirty': 30,
                'forty': 40, 'fifty': 50, 'sixty': 60, 'ninety': 90, 'hundred': 100}


def words(text):
    return re.findall(r"[a-z0-9']+", text.lower())


def substantive(text):
    return len(re.findall(r"[A-Za-z0-9']+", text)) >= 6 and not text.strip().endswith(':')


def numbers(text):
    out = {int(m) for m in re.findall(r'(?<![\w.])\d+(?![\w])', text)}
    lowered = text.lower()
    out |= {value for word, value in NUMBER_WORDS.items() if re.search(r'\b' + word + r'\b', lowered)}
    return out


def claim_text(value, out):
    if isinstance(value, bool) or value is None:
        return out
    if isinstance(value, int):
        out.append(str(value))
    elif isinstance(value, str):
        out.append(value)
    elif isinstance(value, dict):
        for key, item in value.items():
            if key not in SKIP_KEYS:
                claim_text(item, out)
    elif isinstance(value, list):
        for item in value:
            claim_text(item, out)
    return out


def quote_index(sources):
    """quote id -> (publisher lineage, text) for every registered quote."""
    return {quote['id']: (source['publisherLineage'], quote['text'])
            for source in sources['sources'] for quote in source.get('quotes', [])}


def expected_gameplay_status(evidence_quote_ids, quotes):
    lineages = {quotes[q][0] for q in evidence_quote_ids if q in quotes and substantive(quotes[q][1])}
    if len(lineages) >= 2:
        return 'corroborated'
    if lineages:
        return 'single_source'
    return 'unverified'


def build(minigames, sources):
    quotes = quote_index(sources)
    texts = {qid: text for qid, (_, text) in quotes.items()}
    items, title_only, missing, fragment = [], {}, {}, 0
    checked, gameplay_rule = 0, {}
    for row in minigames['minigames']:
        title = set(words(row['name'])) | TITLE_WORDS
        ids_gameplay = row['fieldEvidence']['gameplay']['quoteIds']
        rule_status = expected_gameplay_status(ids_gameplay, quotes)
        gameplay_rule[rule_status] = gameplay_rule.get(rule_status, 0) + 1
        if not any(substantive(texts[qid]) for qid in ids_gameplay if qid in texts):
            fragment += 1
        for claim_key, evidence_key in CLAIMS:
            evidence = row['fieldEvidence'].get(evidence_key)
            if not evidence or evidence['status'] not in CHECKED_STATUSES or not row.get(claim_key):
                continue
            checked += 1
            ids = evidence.get('quoteIds') or []
            quoted = [texts[qid] for qid in ids]
            claim = ' '.join(claim_text(row[claim_key], []))
            is_title_only = bool(quoted) and all(set(words(text)) <= title for text in quoted)
            quoted_numbers = set().union(*[numbers(text) for text in quoted]) if quoted else set()
            missing_numbers = sorted(numbers(claim) - quoted_numbers)
            is_fragment = claim_key == 'summary' and not any(substantive(text) for text in quoted)
            if not (is_title_only or missing_numbers or is_fragment):
                continue
            if is_title_only:
                title_only[claim_key] = title_only.get(claim_key, 0) + 1
            if missing_numbers:
                missing[claim_key] = missing.get(claim_key, 0) + 1
            items.append({'id': row['id'], 'name': row['name'], 'field': claim_key, 'status': evidence['status'],
                          'titleOnly': is_title_only, 'fragmentOnly': is_fragment, 'missingNumbers': missing_numbers})
    return {
        'job': 'B03',
        'generatedBy': 'jobs/B03-jamboree-minigames/quote-support-check.py',
        'scope': 'Automated checks of registered quotes against retained claims. They prove neither support nor '
                 'contradiction; a flagged claim needs a human re-read of its source before it is used.',
        'checkedFieldClaims': checked,
        'flaggedFieldClaims': len(items),
        'titleOnlyByField': dict(sorted(title_only.items())),
        'missingNumbersByField': dict(sorted(missing.items())),
        'summaryFragmentOnly': fragment,  # every summary, whatever its status: no sentence-length quote
        'gameplayRuleStatuses': dict(sorted(gameplay_rule.items())),
        'items': items,
    }


def load_inputs(root=ROOT):
    minigames = json.loads((root / 'minigames.json').read_text(encoding='utf-8'))
    sources = json.loads((root / 'catalogue-sources.json').read_text(encoding='utf-8'))
    return minigames, sources


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='write reports/quote-support-check.json')
    args = parser.parse_args(argv)
    report = build(*load_inputs())
    text = json.dumps(report, indent=2, ensure_ascii=False) + '\n'
    if args.write:
        (ROOT / 'reports' / 'quote-support-check.json').write_text(text, encoding='utf-8')
    print(text, end='')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
