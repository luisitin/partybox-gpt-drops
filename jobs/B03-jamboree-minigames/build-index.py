#!/usr/bin/env python3
"""Build a preliminary wiki-ordered index without resolving source disagreements."""
import argparse
from collections import Counter
import json
from pathlib import Path
import unicodedata


def normalize(name):
    return ''.join(char for char in unicodedata.normalize('NFKC', name).casefold() if char.isalnum())


def build(evidence):
    wiki = evidence['sources']['wiki']['pass1']['rows']
    legacy = evidence['sources']['legacy']['pass1']['rows']
    wiki2 = evidence['sources']['wiki']['pass2']['rows']
    legacy2 = evidence['sources']['legacy']['pass2']['rows']
    legacy_tv = evidence['sources']['legacyTv']['pass1']['rows']
    legacy_tv2 = evidence['sources']['legacyTv']['pass2']['rows']
    assert wiki == wiki2, 'Wiki list changed between passes; investigate before generating.'
    assert legacy == legacy2, 'Legacy list changed between passes; investigate before generating.'
    assert legacy_tv == legacy_tv2, 'Legacy TV list changed between passes; investigate before generating.'
    assert all(n == 1 for n in Counter(normalize(r['name']) for r in wiki).values())
    assert all(n == 1 for n in Counter(normalize(r['name']) for r in legacy).values())
    assert all(n == 1 for n in Counter(normalize(r['name']) for r in legacy_tv).values())
    legacy_by_key = {normalize(r['name']): r for r in legacy}
    legacy_tv_by_key = {normalize(r['name']): r for r in legacy_tv}
    wiki_base_by_key = {normalize(r['name']): r for r in wiki if r['edition'] == 'base'}
    wiki_tv_by_key = {normalize(r['name']): r for r in wiki if r['edition'] == 'jamboree_tv'}
    entries = []
    variants = []
    category_pairs = {}
    for ordinal, row in enumerate(wiki, 1):
        independent_source = 'legacy' if row['edition']=='base' else 'legacyTv'
        independent_by_key = legacy_by_key if row['edition']=='base' else legacy_tv_by_key
        match = independent_by_key.get(normalize(row['name']))
        citations = [{'source': 'wiki', 'field': 'name', 'quote': row['name'], 'locator': '#'+row['categoryAnchor']}]
        citations.extend({'source': 'wiki', 'field': 'category', 'quote': label, 'locator': '#'+row['categoryAnchor']} for label in row['categoryPath'])
        if match:
            citations.append({'source': independent_source, 'field': 'name', 'quote': match['name'], 'locator': '#'+match['categoryAnchor']})
            citations.extend({'source': independent_source, 'field': 'category', 'quote': label, 'locator': '#'+match['categoryAnchor']} for label in match['categoryPath'])
            if row['name'] != match['name']:
                variants.append({'wikiName': row['name'], 'legacyName': match['name']})
            pair = (' / '.join(row['categoryPath']), ' / '.join(match['categoryPath']))
            if pair[0] != pair[1]:
                category_pairs.setdefault(pair, []).append(row['name'])
        entries.append({'ordinal': ordinal, 'name': row['name'], 'edition': row['edition'],
                        'wikiCategoryPath': row['categoryPath'],
                        'wikiArticleUrl': 'https://www.mariowiki.com'+row['articlePath'],
                        'legacyName': match['name'] if match else None,
                        'legacySource': independent_source if match else None,
                        'legacyCategoryPath': match['categoryPath'] if match else None,
                        'confidence': 'medium' if match else 'low',
                        'citations': citations,
                        'indexPass2': {'wiki': True, 'legacy': True if match else None}})
    return {'job': 'B03', 'scope': 'preliminary catalogue index only', 'complete': False,
            'sourceCounts': {'wikiBase': len(wiki_base_by_key), 'wikiTv': len(wiki)-len(wiki_base_by_key),
                             'wikiCombined': len(wiki), 'legacyBase': len(legacy), 'legacyTv': len(legacy_tv),
                             'legacyCombined': len(legacy)+len(legacy_tv),
                             'nintendoTv': evidence['sources']['nintendo']['pass1']['declaredCounts']['jamboree_tv']},
            'normalization': 'Unicode NFKC, casefold, retain alphanumeric characters; never correct spelling or infer aliases',
            'entries': entries,
            'comparison': {'baseNormalizedIntersection': len(set(wiki_base_by_key)&set(legacy_by_key)),
                           'tvNormalizedIntersection': len(set(wiki_tv_by_key)&set(legacy_tv_by_key)),
                           'combinedNormalizedIntersection': len(set(wiki_base_by_key)&set(legacy_by_key))+len(set(wiki_tv_by_key)&set(legacy_tv_by_key)),
                           'wikiOnlyBase': [r['name'] for r in wiki_base_by_key.values() if normalize(r['name']) not in legacy_by_key],
                           'legacyOnlyBase': [r['name'] for r in legacy if normalize(r['name']) not in wiki_base_by_key],
                           'wikiOnlyTv': [r['name'] for r in wiki_tv_by_key.values() if normalize(r['name']) not in legacy_tv_by_key],
                           'legacyOnlyTv': [r['name'] for r in legacy_tv if normalize(r['name']) not in wiki_tv_by_key],
                           'punctuationCaseVariants': variants,
                           'categoryDifferences': [{'wikiPath': w, 'legacyPath': l, 'names': names} for (w,l),names in category_pairs.items()]},
            'unresearchedFields': ['format', 'timeLimit', 'controls', 'winRules', 'scoreRules', 'tieRules',
                                  'coinReward', 'starReward', 'twoSentenceSummary', 'phoneFit', 'phoneFitReason'],
            'remainingGates': ['Resolve two base name disagreements with independently retrieved authoritative evidence.',
                               'Research exact per-game categories and reconcile mode-availability disagreements, especially four-player Co-op for Pull-Back Attack.',
                               'Obtain the prompt-required two wiki list page count comparisons; Mario Party Legacy is an independent publisher, not a wiki.',
                               'Research every requested per-game fact using two independent sources with short quotes.',
                               'Reopen every per-game source and log a full second pass for every final row.',
                               'Deliver final minigames.json, minigames.csv, and JSON Schema; pass all final research checks.']}


def main():
    cli=argparse.ArgumentParser()
    cli.add_argument('--evidence', type=Path, required=True)
    cli.add_argument('--output', type=Path, required=True)
    args=cli.parse_args()
    result=build(json.loads(args.evidence.read_text()))
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(result["entries"])} preliminary rows; {result["comparison"]["baseNormalizedIntersection"]} independent base-name matches; complete=false')


if __name__=='__main__':
    main()
