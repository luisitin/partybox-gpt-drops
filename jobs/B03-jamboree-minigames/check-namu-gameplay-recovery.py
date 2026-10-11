"""Validate two authored Korean-tip witnesses and preserve the exact earlier catalogue."""
import copy
import hashlib
import importlib.util
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASELINE = '5e6ad254f3acefb50c99af41f82677879a03b033'
BASE_DATA = '528a9a8131a3bb795d796ff0e66997d7ff2e69b8992dbe0ef4739007ad0cc1ef'
BASE_SOURCES = '48e3c7e8edd745b0177bea15a94a1734e58bb8404de76013f6f43f375e9f8c1c'
URL = 'https://namu.wiki/w/%EC%8A%88%ED%8D%BC%20%EB%A7%88%EB%A6%AC%EC%98%A4%20%ED%8C%8C%ED%8B%B0%20%EC%9E%BC%EB%B2%84%EB%A6%AC'
CONFIG = {
    'MG014': ('Granite Getaway', '굴러오는 바위에 깔리지 않도록 내려가면서 동시에 점프로 장애물들을 피해야 한다.', 'Players flee a rolling boulder. They jump over obstacles along the route.'),
    'MG049': ('Defuse or Lose', '도화선이 겹치는 부분에 불이 닿기 전에 끄는 것을 우선으로 하는 것이 좋다.', 'Players put out fires on fuses. Their aim is to slow the advancing flames.'),
}
def require(ok, message):
    if not ok: raise AssertionError(message)
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def read(name): return json.loads((ROOT / name).read_text())

def validate(proof, data, sources, reopens):
    require(proof['baselineSourceCommit'] == BASELINE and proof['copyrightBodiesPublished'] is False and proof['newHttpRequestsForThisRepair'] == 0, 'Wrong baseline, copyright or request scope')
    require(proof['scope'] == 'Exactly two common-action summaries from original authored Korean Tip cells; no category, roster or detailed mechanic promotion.', 'Repair scope changed')
    require(len(proof['repairs']) == 2 and {x['id'] for x in proof['repairs']} == set(CONFIG), 'Authored-tip repair scope differs')
    sb = {s['id']: s for s in sources['sources']}; require(len(sb) == len(sources['sources']) == 146, 'Missing or duplicate source')
    source = sb['NAMU_BASE']; require(source['url'] == URL and source['publisherLineage'] == 'namuwiki' and source['kind'] == 'community_wiki_article', 'False Namu publisher or scope')
    captures = proof['retainedActualCaptures']; require(len(captures) == 2 and [c['pass'] for c in captures] == [1, 2], 'Missing actual original-language A/B capture')
    expected = [c for c in read('reports/namu-roster-candidate.json')['captureRecords'] if c['sourceId'] == 'NAMU_BASE']
    require(captures == expected, 'Retained actual Namu capture changed')
    require(len(set(proof['originalTableScopeSha256Passes'])) == 1 and len(proof['originalTableScopeSha256Passes']) == 2, 'Full original numbered-table scope changed')
    require(proof['authoredTipColumn'] == 3 and proof['excludedNintendoDescriptionColumn'] == 2 and proof['literalEnglishNamesMatched'] is True, 'Description reprint or guessed identity used')
    for number, capture in enumerate(captures, 1):
        require(capture['url'] == URL and capture['curlExitCode'] == 0 and capture['httpStatus'] == 200 and capture['sslVerifyResult'] == 0 and capture['tlsVerificationDisabled'] is False, 'Failed Namu transport')
        p = source['passes'][number - 1]; r = next(x for x in reopens[number - 1] if x['sourceId'] == 'NAMU_BASE')
        require(p['bodyBytes'] == r['bodyBytes'] == capture['bodyBytes'] and p['bodySha256'] == r['bodySha256'] == capture['bodySha256'], 'Actual body witness changed')
        require(r['requestBeganUTC'] == capture['startedUTC'] and r['requestCompletedUTC'] == capture['completedUTC'] and r['httpEffectiveTls'] == ['200', URL, '0'] and r['rawBodyPublished'] is False, 'Receipt or request time invented')
        require(p['fullArticleScopeSha256'] == proof['originalTableScopeSha256Passes'][number - 1], 'Whole-table context not bound')
    require(datetime.fromisoformat(captures[1]['startedUTC']) > datetime.fromisoformat(captures[0]['completedUTC']), 'Pass B preceded pass A')
    require({q['id'] for q in source['quotes']} == {'NAMU_BASE_tip_' + x for x in CONFIG}, 'Unreviewed quote added')
    qb = {q['id']: (s, q) for s in sources['sources'] for q in s['quotes']}; rows = {r['id']: r for r in data['minigames']}
    restored = copy.deepcopy(data)
    for repair in proof['repairs']:
        ident = repair['id']; name, text, summary = CONFIG[ident]; row = rows[ident]; qid = 'NAMU_BASE_tip_' + ident
        require(row['name'] == repair['name'] == name and row['summary'] == repair['summary'] == summary, 'Human-rechecked shared action changed')
        require(repair['beforeGameplayEvidence']['status'] == 'single_source' and row['fieldEvidence']['gameplay']['status'] == 'corroborated', 'Unexpected confidence promotion')
        require(qb[qid][1]['text'] == text and 6 <= len(text.split()) <= 25 and repair['quote'] == text, 'Literal short original tip differs')
        require(repair['tipContextSha256Passes'][0] == repair['tipContextSha256Passes'][1] and len(repair['tipContextSha256Passes']) == 2 and repair['quotedColumn'] == 'authoredTip', 'Quoted Nintendo description or changed full tip')
        require(repair['wikiSourceId'] == 'W' + ident[2:] and repair['wikiQuoteId'] in row['fieldEvidence']['gameplay']['quoteIds'] and qb[repair['wikiQuoteId']][0]['id'] == repair['wikiSourceId'], 'Independent complete Wiki action missing')
        require({qb[q][0]['publisherLineage'] for q in [qid, repair['wikiQuoteId']]} == {'namuwiki', 'mariowiki'}, 'Independent publisher families missing')
        require(row['fieldEvidence']['gameplay']['quoteIds'] == repair['beforeGameplayEvidence']['quoteIds'] + [qid], 'Prior citations lost or unrelated citations added')
        for cited in [qid, repair['wikiQuoteId']]:
            owner = qb[cited][0]
            require(all(cited in p['recoveredQuoteIds'] for p in owner['passes']) and all(cited in next(r for r in rs if r['sourceId'] == owner['id'])['recoveredQuoteIds'] for rs in reopens), 'Literal clip absent from a real source pass')
        old = next(r for r in restored['minigames'] if r['id'] == ident); old['summary'] = repair['beforeSummary']; old['fieldEvidence']['gameplay'] = copy.deepcopy(repair['beforeGameplayEvidence'])
    historical = copy.deepcopy(sources); historical['sources'] = [s for s in historical['sources'] if s['id'] != 'NAMU_BASE']
    require(digest(restored) == proof['baselineDataSha256'] == BASE_DATA and digest(historical) == proof['baselineSourcesSha256'] == BASE_SOURCES, 'Exact 132-row or 145-source accepted baseline altered')
    require(proof['baselineRowHashes'] == [{'id': r['id'], 'sha256': digest(r)} for r in restored['minigames']], 'Every-row baseline fingerprint differs')
    require(proof['baselineSourceHashes'] == {s['id']: digest(s) for s in historical['sources']}, 'Original quotes or source pass receipts changed')
    require(source['uniqueQuotedWords'] == sum(len(q['text'].split()) for q in source['quotes']) <= 200, 'Korean source word budget exceeded')
    spec = importlib.util.spec_from_file_location('unicode_quote_rule', ROOT / 'quote-support-check.py'); qsc = importlib.util.module_from_spec(spec); spec.loader.exec_module(qsc)
    count = 0
    for s in historical['sources']:
        for q in s['quotes']:
            old = len(re.findall(r"[A-Za-z0-9']+", q['text'])) >= 6 and not q['text'].strip().endswith(':')
            require(qsc.substantive(q['text']) == old, 'Unicode update changes a previous quotation classification'); count += 1
    require(count == proof['oldQuoteClassificationsUnchanged'] == 1898, 'Old quotation scope differs')
    require(qsc.substantive(CONFIG['MG014'][1]) and not qsc.substantive('Granite Getaway:') and not qsc.substantive('도화선 불') and not qsc.substantive('도화선이 겹치는 부분에 불이 닿기 전에:'), 'Unicode substantive rule accepts headings or fragments')
    return restored, historical, [[r for r in rs if r['sourceId'] != 'NAMU_BASE'] for rs in reopens]

def before_batch_view(data, sources, reopens):
    if not (ROOT / 'reports/namu-batch-recovery.json').exists(): return data, sources, reopens
    spec = importlib.util.spec_from_file_location('b03_namu_batch_historical_view', ROOT / 'check-namu-batch-recovery.py')
    batch = importlib.util.module_from_spec(spec); spec.loader.exec_module(batch)
    return batch.historical_view(data, sources, reopens)

def historical_view(data, sources, reopens):
    data, sources, reopens = before_batch_view(data, sources, reopens)
    if not any(s['id'] == 'NAMU_BASE' for s in sources['sources']): return data, sources, reopens
    return validate(read('reports/namu-gameplay-recovery.json'), data, sources, reopens)

def run():
    proof = read('reports/namu-gameplay-recovery.json'); data = read('minigames.json'); sources = read('catalogue-sources.json'); reopens = [read('reports/source-reopens-pass' + p + '.json') for p in 'AB']
    data, sources, reopens = before_batch_view(data, sources, reopens)
    validate(proof, data, sources, reopens)
    for number in range(8):
        p, d, s, rs = copy.deepcopy(proof), copy.deepcopy(data), copy.deepcopy(sources), copy.deepcopy(reopens)
        if number == 0: p['repairs'][0]['quotedColumn'] = 'NintendoDescription'
        elif number == 1: p['repairs'][0]['summary'] += ' Exact timer 10 seconds.'
        elif number == 2: next(x for x in s['sources'] if x['id'] == 'NAMU_BASE')['publisherLineage'] = 'mariowiki'
        elif number == 3: next(x for x in rs[1] if x['sourceId'] == 'NAMU_BASE')['recoveredQuoteIds'].pop()
        elif number == 4: p['retainedActualCaptures'][0]['bodySha256'] = '0' * 64
        elif number == 5: d['minigames'][0]['timeLimit']['wholeGameSeconds'] = 999
        elif number == 6: next(x for x in s['sources'] if x['id'] == 'FGS_BASE')['quotes'][0]['text'] = 'Altered old quotation'
        elif number == 7: p['repairs'][0]['beforeSummary'] = 'Invented old action. Invented sentence.'
        try: validate(p, d, s, rs)
        except (AssertionError, KeyError): pass
        else: raise AssertionError('Malformed authored-tip repair accepted')
    return [{'name': 'Original Korean authored tips, two independent A/B actions and exact 132-row/145-source baseline preservation', 'caseCount': 1898 + 132 + 145 + 4 + 4, 'passed': True, 'seed': None, 'detail': 'Nintendo-description cells excluded; Unicode rule preserves all 1,898 original clip classifications.'}, {'name': 'Eight malformed authored-tip, publisher, receipt, scope and baseline proofs rejected', 'caseCount': 8, 'passed': True, 'seed': None, 'detail': 'No timer, reward, category or second-wiki roster promotion.'}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
