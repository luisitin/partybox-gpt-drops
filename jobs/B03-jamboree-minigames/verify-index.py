#!/usr/bin/env python3
"""Validate the preliminary index and source evidence; never certify final B03."""
import argparse
from collections import Counter
from datetime import datetime
import importlib.metadata
import json
from pathlib import Path
import re
import unicodedata
import jsonschema

ROOT = Path(__file__).resolve().parent


def key(name):
    return ''.join(c for c in unicodedata.normalize('NFKC', name).casefold() if c.isalnum())


def verify(index, evidence, schema):
    results = []
    def checked(name, cases, callback, detail=''):
        callback()
        results.append({'name': name, 'caseCount': cases, 'passed': True, 'seed': None, 'detail': detail})
    def require(condition, message):
        if not condition: raise AssertionError(message)

    def check_schema():
        validator = jsonschema.Draft202012Validator(schema)
        validator.check_schema(schema)
        errors = sorted(validator.iter_errors(index), key=lambda e: str(e.path))
        require(not errors, '\n'.join(str(e) for e in errors))
    checked('Draft 2020-12 JSON Schema', 1, check_schema)

    def transports():
        for source in evidence['sources'].values():
            for pass_id in ('pass1', 'pass2'):
                record=source[pass_id]
                require(record['curlExitCode']==0, 'Failed source request recorded as research evidence')
                require(record['reportedHttpStatusAndEffectiveUrl'].startswith('200 '), 'Non-200 source response')
                require(re.fullmatch('[0-9a-f]{64}',record['sha256']) is not None, 'Invalid source-byte hash')
                require(record['byteLength']>0, 'Empty source retrieval')
                require('--insecure' not in record['curlCommand'] and ' -k ' not in record['curlCommand'], 'TLS bypass recorded')
            first=datetime.fromisoformat(source['pass1']['retrievedAtUtc'].replace('Z','+00:00'))
            second=datetime.fromisoformat(source['pass2']['retrievedAtUtc'].replace('Z','+00:00'))
            require(second>first, 'Pass two must be a later network request')
    checked('Successful TLS-preserving fresh retrieval records', 6, transports)

    def counts():
        for pass_id in ('pass1','pass2'):
            wiki=evidence['sources']['wiki'][pass_id]
            legacy=evidence['sources']['legacy'][pass_id]
            nintendo=evidence['sources']['nintendo'][pass_id]
            base=sum(r['edition']=='base' for r in wiki['rows'])
            tv=sum(r['edition']=='jamboree_tv' for r in wiki['rows'])
            declared=wiki['declaredCounts']
            require(base==declared['base']==index['sourceCounts']['wikiBase'], 'Wiki base count differs')
            require(tv==declared['jamboree_tv']==index['sourceCounts']['wikiTv'], 'Wiki TV count differs')
            require(len(wiki['rows'])==declared['combined']==index['sourceCounts']['wikiCombined'], 'Wiki combined count differs')
            require(len(legacy['rows'])==legacy['declaredCounts']['base']==index['sourceCounts']['legacyBase']==base, 'Independent base counts differ')
            require(nintendo['declaredCounts']['jamboree_tv']==index['sourceCounts']['nintendoTv']==tv, 'Official TV additions count differs')
    checked('Source count claims versus extracted rows and independent counts', 10, counts,
            '112 base on wiki and Legacy; 20 additions on wiki and Nintendo; wiki lists 132 combined. Independent full TV list remains missing.')

    populations=[index['entries']]+[evidence['sources'][s][p]['rows'] for s in ('wiki','legacy') for p in ('pass1','pass2')]
    def duplicates():
        for rows in populations:
            duplicates=[n for n,count in Counter(key(r['name']) for r in rows).items() if count>1]
            require(not duplicates, f'Normalized duplicates: {duplicates}')
    checked('Case/punctuation-insensitive duplicate checks', sum(map(len,populations)), duplicates)

    def recheck():
        for source_id in ('wiki','legacy'):
            source=evidence['sources'][source_id]
            require(source['pass1']['rows']==source['pass2']['rows'], f'{source_id} names/categories changed between requests')
        nintendo=evidence['sources']['nintendo']
        require(nintendo['pass1']['quotes']==nintendo['pass2']['quotes'], 'Official count quote changed')
    checked('Fresh second-pass list rows and official count quote', 245, recheck,
            '132 wiki rows and 112 Legacy rows reopened; 1 Nintendo count quote reopened. Index-only check.')

    def index_links():
        wiki=evidence['sources']['wiki']['pass2']['rows']
        legacy={key(r['name']):r for r in evidence['sources']['legacy']['pass2']['rows']}
        require(len(index['entries'])==len(wiki), 'Index lacks wiki rows')
        for number,(row,source_row) in enumerate(zip(index['entries'],wiki),1):
            require(row['ordinal']==number, 'Index ordinal does not follow source order')
            require(row['name']==source_row['name'] and row['wikiCategoryPath']==source_row['categoryPath'] and row['edition']==source_row['edition'], 'Index wiki fields not supported by pass-two source')
            match=legacy.get(key(row['name'])) if row['edition']=='base' else None
            require(row['legacyName']==(match['name'] if match else None), 'Unjustified Legacy name alias')
            require(row['legacyCategoryPath']==(match['categoryPath'] if match else None), 'Unjustified Legacy category alias')
            require(row['confidence']==('medium' if match else 'low'), 'Confidence hides single-source row')
            require(row['indexPass2']=={'wiki':True,'legacy':True if match else None}, 'Incorrect per-row pass-two claim')
    checked('All preliminary rows tied to pass-two source names/categories', len(index['entries']), index_links)

    citations=[c for r in index['entries'] for c in r['citations']]
    source_quotes=[q for source in evidence['sources'].values() for p in ('pass1','pass2') for q in source[p]['quotes']]
    def short_quotes():
        for quote in citations+source_quotes:
            require(0<len(quote['quote'].split())<=25, 'Quote exceeds 25 words')
        for row in index['entries']:
            for citation in row['citations']:
                candidates=evidence['sources'][citation['source']]['pass2']['rows']
                source_name=row['name'] if citation['source']=='wiki' else row['legacyName']
                matching=[r for r in candidates if r['name']==source_name]
                require(len(matching)==1, 'Citation lacks unique source row')
                values=[matching[0]['name']] if citation['field']=='name' else matching[0]['categoryPath']
                require(citation['quote'] in values, 'Quote is not a verbatim extracted name/category')
                require(citation['locator']=='#'+matching[0]['categoryAnchor'], 'Citation locator differs')
    checked('Short verbatim source citations and locators', len(citations)+len(source_quotes), short_quotes)

    def diffs():
        wiki=evidence['sources']['wiki']['pass2']['rows']
        legacy=evidence['sources']['legacy']['pass2']['rows']
        wiki_base={key(r['name']):r['name'] for r in wiki if r['edition']=='base'}
        legacy_base={key(r['name']):r['name'] for r in legacy}
        c=index['comparison']
        require(c['baseNormalizedIntersection']==len(set(wiki_base)&set(legacy_base)), 'Intersection count differs')
        require(set(c['wikiOnlyBase'])=={wiki_base[k] for k in set(wiki_base)-set(legacy_base)}, 'Wiki-only differences omitted')
        require(set(c['legacyOnlyBase'])=={legacy_base[k] for k in set(legacy_base)-set(wiki_base)}, 'Legacy-only differences omitted')
        require(set(c['wikiOnlyTv'])=={r['name'] for r in wiki if r['edition']=='jamboree_tv'}, 'TV list differences omitted')
        expected_variants={(wiki_base[k],legacy_base[k]) for k in set(wiki_base)&set(legacy_base) if wiki_base[k]!=legacy_base[k]}
        require({(r['wikiName'],r['legacyName']) for r in c['punctuationCaseVariants']}==expected_variants, 'Case/punctuation variants omitted')
    checked('Source-set disagreements retained without spelling corrections', 5, diffs,
            '110 normalized base-name matches; wiki-only base 2; Legacy-only base 2; wiki-only TV 20.')

    def headings():
        for pass_id in ('pass1','pass2'):
            source=evidence['sources']['legacy'][pass_id]
            for heading in source['categoryHeadings']:
                require(sum(r['categoryPath']==heading['categoryPath'] for r in source['rows'])==heading['declaredCount'], 'Legacy category count claim differs')
    checked('Legacy declared category totals versus table rows', 20, headings)
    return results


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--evidence', type=Path, default=ROOT/'source-excerpts.json')
    parser.add_argument('--json-output', type=Path)
    args=parser.parse_args()
    index=json.loads((ROOT/'catalogue-index.json').read_text())
    schema=json.loads((ROOT/'catalogue-index.schema.json').read_text())
    evidence=json.loads(args.evidence.read_text())
    results=verify(index,evidence,schema)
    print(f'jsonschema {importlib.metadata.version("jsonschema")} / Draft 2020-12')
    for result in results:
        print(f'PASS {result["name"]}: {result["caseCount"]} cases; seed=n/a'+(f'; {result["detail"]}' if result['detail'] else ''))
    print('UNVERIFIED: final per-game facts, independent complete TV list, two wiki list-page counts, final JSON/CSV/schema, full per-game second pass.')
    print('Job B03 complete=false. These passing checks validate the preliminary index only.')
    if args.json_output:
        args.json_output.write_text(json.dumps({'scope':'preliminary index only','finalJobComplete':False,'jsonschemaVersion':importlib.metadata.version('jsonschema'),'tests':results},indent=2)+'\n')


if __name__=='__main__':
    main()
