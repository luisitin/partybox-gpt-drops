#!/usr/bin/env python3
"""Read-only boundary audit for B03 preliminary-index validation.

Baseline must validate. Each isolated, structurally valid mutation must reject.
All mutations occur in memory; no job files are written. Output is optional and
may be supplied as a new report path when recording verification.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import shlex
import sys


def wrong_article(index, evidence):
    index['entries'][0]['wikiArticleUrl'] = 'https://www.mariowiki.com/Wrong_game'


def missing_category_conflicts(index, evidence):
    index['comparison']['categoryDifferences'] = []


def missing_name_and_independent_citations(index, evidence):
    for row in index['entries']:
        category = next(c for c in row['citations']
                        if c['source'] == 'wiki' and c['field'] == 'category')
        row['citations'] = [copy.deepcopy(category), copy.deepcopy(category)]


def unrelated_plain_http_sources(index, evidence):
    for source in evidence['sources'].values():
        source['url'] = 'http://example.invalid/unrelated'
        for pass_id in ('pass1', 'pass2'):
            source[pass_id]['reportedHttpStatusAndEffectiveUrl'] = '200 http://example.invalid/unrelated'


def combined_tls_bypass_option(index, evidence):
    record = evidence['sources']['wiki']['pass1']
    tokens = shlex.split(record['curlCommand'])
    tokens.insert(1, '-ksS')
    record['curlCommand'] = shlex.join(tokens)


MUTATIONS = [
    ('wrong_article_for_verified_name', wrong_article),
    ('omitted_category_disagreements', missing_category_conflicts),
    ('duplicate_wiki_category_replaces_all_name_and_independent_citations', missing_name_and_independent_citations),
    ('unrelated_http_publisher_replaces_all_expected_sources', unrelated_plain_http_sources),
    ('combined_curl_short_option_records_disabled_tls_verification', combined_tls_bypass_option),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--job-dir', type=Path,
                        default=Path(__file__).resolve().parent)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    files = ['verify-index.py', 'catalogue-index.json', 'source-excerpts.json', 'catalogue-index.schema.json']
    report = {'scope': 'isolated validator-boundary mutations plus accepted baseline',
              'caseCount': len(MUTATIONS)+1,
              'sourceSHA256': {name: hashlib.sha256((args.job_dir/name).read_bytes()).hexdigest() for name in files},
              'cases': []}
    spec = importlib.util.spec_from_file_location('b03_review_verify_index', args.job_dir/'verify-index.py')
    verifier = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier)
    index = json.loads((args.job_dir/'catalogue-index.json').read_text())
    evidence = json.loads((args.job_dir/'source-excerpts.json').read_text())
    schema = json.loads((args.job_dir/'catalogue-index.schema.json').read_text())
    # An unexpected baseline failure invalidates the audit and must not be
    # mistaken for successfully rejecting a deliberately defective input.
    baseline_checks = verifier.verify(index, evidence, schema)
    report['cases'].append({'name': 'unmodified_baseline', 'expected': 'accept',
                            'accepted': True, 'passed': True,
                            'verificationGroups': len(baseline_checks)})
    for name, mutate in MUTATIONS:
        changed_index, changed_evidence = copy.deepcopy(index), copy.deepcopy(evidence)
        mutate(changed_index, changed_evidence)
        case = {'name': name, 'expected': 'reject'}
        try:
            checks = verifier.verify(changed_index, changed_evidence, schema)
            case.update(accepted=True, passed=False, verificationGroups=len(checks))
        except Exception as error:
            case.update(accepted=False, passed=True, exceptionType=type(error).__name__, reason=str(error))
        report['cases'].append(case)
    report['passed'] = all(case['passed'] for case in report['cases'])
    serialized = json.dumps(report, indent=2)+'\n'
    if args.output:
        args.output.write_text(serialized)
    print(serialized, end='')
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
