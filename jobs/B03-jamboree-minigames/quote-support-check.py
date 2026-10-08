#!/usr/bin/env python3
"""Quote-support check for minigames.json (B03 polish pass, 2026-10-08). Stdlib only, offline.

For every fact field that carries a claim and a status of corroborated or single_source, it flags:
- title_only: every registered quote, reduced to words, is inside the minigame title (plus a, an, of, the, and),
  so the quote cannot show a category, a format or a rule. Heading locators are not text, so they do not count.
- missing_numbers: numbers stated by the retained claim that appear in none of the field's registered quotes.
The output is deterministic. `--write` regenerates reports/quote-support-check.json; the verifier recomputes it.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIELDS = ['category', 'format', 'controls', 'timeLimit', 'winRules', 'scoreRules', 'tieRules', 'reward']
CHECKED_STATUSES = ('corroborated', 'single_source')
TITLE_WORDS = {'a', 'an', 'of', 'the', 'and'}
SKIP_KEYS = {'unresolved', 'scope', 'limitation', 'reportedLabel', 'fieldStatusMeaning'}
NUMBER_WORDS = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
                'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'fifteen': 15, 'twenty': 20, 'thirty': 30,
                'forty': 40, 'fifty': 50, 'sixty': 60, 'ninety': 90, 'hundred': 100}


def words(text):
    return re.findall(r"[a-z0-9']+", text.lower())


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


def build(minigames, sources):
    quotes = {quote['id']: quote['text'] for source in sources['sources'] for quote in source.get('quotes', [])}
    items, title_only, missing = [], {}, {}
    checked = 0
    for row in minigames['minigames']:
        title = set(words(row['name'])) | TITLE_WORDS
        for field in FIELDS:
            evidence = row['fieldEvidence'].get(field)
            if not evidence or evidence['status'] not in CHECKED_STATUSES or not row.get(field):
                continue
            checked += 1
            ids = evidence.get('quoteIds') or []
            texts = [quotes[qid] for qid in ids]
            claim = ' '.join(claim_text(row[field], []))
            is_title_only = bool(texts) and all(set(words(text)) <= title for text in texts)
            quoted_numbers = set().union(*[numbers(text) for text in texts]) if texts else set()
            missing_numbers = sorted(numbers(claim) - quoted_numbers)
            if not is_title_only and not missing_numbers:
                continue
            if is_title_only:
                title_only[field] = title_only.get(field, 0) + 1
            if missing_numbers:
                missing[field] = missing.get(field, 0) + 1
            items.append({'id': row['id'], 'name': row['name'], 'field': field, 'status': evidence['status'],
                          'titleOnly': is_title_only, 'missingNumbers': missing_numbers})
    return {
        'job': 'B03',
        'generatedBy': 'jobs/B03-jamboree-minigames/quote-support-check.py',
        'scope': 'Automated lexical check of registered quotes against retained claims. It proves neither support nor '
                 'contradiction; a flagged field needs a human re-read of its source before it is used.',
        'checkedFieldClaims': checked,
        'flaggedFieldClaims': len(items),
        'titleOnlyByField': dict(sorted(title_only.items())),
        'missingNumbersByField': dict(sorted(missing.items())),
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
