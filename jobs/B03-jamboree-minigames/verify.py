#!/usr/bin/env python3
"""Offline catalogue, provenance, regression and completeness checks. No game execution."""
import argparse
import copy
import csv
from collections import Counter
from datetime import datetime
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata
from urllib.parse import urlsplit
import jsonschema

ROOT=Path(__file__).resolve().parent
FACTS=['name','category','format','gameplay','controls','timeLimit','winRules','scoreRules','tieRules','reward']
OWN=['minigames','catalogue-sources','catalogue-conflicts','catalogue-second-pass','historical-supplement-reopens','catalogue-list-comparison']
LINEAGES={'www.mariowiki.com':'mariowiki','www.nintendolife.com':'hookshot','mariopartylegacy.com':'mariopartylegacy','familygamesquad.com':'familygamesquad','screenrant.com':'valnet','blog.bestbuy.ca':'bestbuy','gamingtrend.com':'gamingtrend','www.nintendo.com':'nintendo','www.thegamer.com':'valnet','www.gamenchickgaming.com':'gamenchick','namu.wiki':'namuwiki','www.consolecreatures.com':'consolecreatures','simplestreviews.blogspot.com':'celstudios','cogconnected.com':'cogconnected'}
def require(ok,message):
    if not ok:raise AssertionError(message)
def pairs(items):
    out={}
    for k,v in items:
        require(k not in out,'Duplicate JSON key: '+k);out[k]=v
    return out
def load(name):return json.loads((ROOT/name).read_text(),object_pairs_hook=pairs)
def digest(row):return hashlib.sha256(json.dumps(row,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def key(name):return ''.join(c for c in unicodedata.normalize('NFKC',name).casefold() if c.isalnum())
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,ROOT/path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate_catalogue(d,sources,audit,index):
    jsonschema.Draft202012Validator(load('minigames.schema.json')).validate(d)
    rows=d['minigames'];expected=index['entries'];require(d['complete'] is False,'False completion claim')
    require(len(rows)==132 and len({key(r['name']) for r in rows})==132,'Roster length or normalized duplicate')
    require(sum(r['edition']=='base' for r in rows)==112,'Base scope differs')
    sourceby={s['id']:s for s in sources['sources']};require(len(sourceby)==len(sources['sources']) and len(sourceby)>=142,'Missing or duplicate sources')
    quotes={}
    for s in sources['sources']:
        parsed=urlsplit(s['url']);require(parsed.scheme=='https' and parsed.netloc in LINEAGES and s['publisherLineage']==LINEAGES[parsed.netloc],'False URL/publisher lineage')
        if s['kind']=='game_article':
            ordinal=int(s['id'][1:]);require(s['url']==expected[ordinal-1]['wikiArticleUrl'],'Game article differs from indexed URL')
        require(len(s['passes'])==2 and [p['pass'] for p in s['passes']]==['A','B'],'Two distinct ordered passes required')
        qq={q['id'] for q in s['quotes']};require(len(qq)==len(s['quotes']),'Duplicate source quote IDs')
        require(s['uniqueQuotedWords']==sum(len(q.split()) for q in {q['text'] for q in s['quotes']})<=200,'Source quotation budget differs')
        for q in s['quotes']:
            require(q['id'] not in quotes and 0<len(q['text'].split())<=25,'Duplicate or overlong quote');quotes[q['id']]=(s,q)
        for p in s['passes']:
            require(len(p['recoveredQuoteIds'])==len(set(p['recoveredQuoteIds'])) and set(p['recoveredQuoteIds'])==qq,'Pass did not recover every retained quote')
            if s['kind']=='game_article' or 'httpStatus' in p:require(p['httpStatus']==200 and p['tlsVerified'] is True and re.fullmatch('[0-9a-f]{64}',p['bodySha256']) and p['bodyBytes']>0,'Invalid actual HTTP/TLS capture')
        if all('observedAtUTC' in p for p in s['passes']):require(datetime.fromisoformat(s['passes'][1]['observedAtUTC'])>datetime.fromisoformat(s['passes'][0]['observedAtUTC']),'Article pass order differs')
    require(len(audit['rows'])==132 and audit['factsFullyVerified']==0,'Audit scope or factual completion differs')
    require(audit['quoteRecoveriesPerPass']==len(quotes),'Article audit quotation total differs from source registry')
    for i,(r,e,a) in enumerate(zip(rows,expected,audit['rows']),1):
        require(r['id']==f'MG{i:03d}' and r['name']==e['name'] and r['edition']==e['edition'],'Published row differs from canonical index')
        require(r['confidence']=='low' and r['complete'] is False,'Unresolved whole row promoted')
        require(set(r['fieldEvidence'])==set(FACTS),'Incomplete fact evidence map')
        for field,ev in r['fieldEvidence'].items():
            require(all(q in quotes for q in ev['quoteIds']),'Unknown quotation reference')
            if ev['status']!='unverified':require(ev['quoteIds'],'Sourced field without citations')
            if ev['status']=='corroborated':require(len({quotes[q][0]['publisherLineage'] for q in ev['quoteIds']})>=2,'Two references from one publisher are not independent')
        require(len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',r['summary']))==2,'Summary must contain two sentences')
        require(len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',r['phoneFitReason']))==1 and 1<=r['phoneFit']<=5,'Phone rationale or rating invalid')
        require(r['phoneFitBasis'].startswith('Original editorial assessment'),'Phone judgement promoted as Nintendo fact')
        require(r['reward']['stars'] is None,'Unknown star award guessed')
        require(r['controls']['bindings'],'Missing literal control notation')
        for b in r['controls']['bindings']:
            require(b['notationClip'] in quotes,'Unknown control notation witness');q=quotes[b['notationClip']][1]
            require(b['sourceIconLabels']==[x['alt'] for x in q.get('controllerImageLabels',[])],'Controller symbols guessed or changed')
        require(a['id']==r['id'] and a['name']==r['name'] and a['publishedRowSha256']==digest(r),'Second-pass audit does not bind published field values')
        require(a['articleScopeIdentical'] and a['articlePassAScopeSha256']==a['articlePassBScopeSha256'],'Complete article scope changed')
        require(set(a['checkedFields'])==set(r) and a['fieldStatuses']=={k:v['status'] for k,v in r['fieldEvidence'].items()},'Not all published fields were reviewed')
        for c in a['independentScopeChecks']:
            require(c['scopeIdentical'] and c['passAScopeSha256']==c['passBScopeSha256'] and all(q in quotes for q in c['quoteIds']),'Independent context changed or missing')
    require(sum('motion' in r['controls']['inputTypes'] for r in rows[:112])==25,'Rhythm motion omission was reintroduced')
    require(rows[25]['timeLimit']['wholeGameSeconds']==60 and rows[38]['timeLimit']['wholeGameSeconds']==45,'Old-edition timer imported')
    require(rows[115]['fieldEvidence']['format']['status']=='conflict','Pull-Back Attack availability conflict erased')
    require(rows[127]['fieldEvidence']['controls']['status']=='conflict','Hitting It Rich camera conflict erased')
    require(all(rows[i]['timeLimit']['wholeGameSeconds'] is None for i in [1,2,63,65,72,129,130]),'Component timer promoted as total runtime')
    return rows,quotes


def validate_reopens(sources, passes, summary):
    expected = {s['id']: {'url':s['url'], 'quotes':[{k:q[k] for k in ['id','text','locator']} for q in s['quotes']]} for s in sources['sources']}
    supplemental = load('historical-supplement-reopens.json')['sources']
    name_sources = load('name-evidence.json')['sources']
    old_sources = load('source-excerpts.json')['sources']
    for i, source in enumerate(supplemental, 1):
        candidates = [x for x in name_sources if x['url']==source['url']]
        qq = [{'id':f'H{i}Q{j+1}', 'text':q['quote'], 'locator':q['locator']} for x in candidates for j,q in enumerate(x['quotes'])]
        if not qq:
            qq = [{'id':f'H{i}Q{j+1}', 'text':q['quote'], 'locator':q['locator']} for x in old_sources.values() if x['url']==source['url'] for j,q in enumerate(x['pass2']['quotes'])]
        require(qq, 'Supplemental source has no retained original quotations')
        expected[f'HIST{i}']={'url':source['url'], 'quotes':qq}
    require(len(expected)>=145 and len({s['url'] for s in expected.values()})==len(expected), 'Delivery URLs missing or duplicated')
    by_pass=[]
    for number, records in enumerate(passes, 1):
        require(len(records)==len(expected), 'Delivery source reopen count differs')
        seen={}
        for record in records:
            sid=record['sourceId']
            require(sid in expected and sid not in seen, 'Reopen ID missing, invented or duplicated')
            seen[sid]=record
            witness=expected[sid]
            require(record['url']==witness['url'] and record['pass']==number, 'Reopen source URL or pass differs')
            require(record['curlExit']==0 and record['httpEffectiveTls']==['200',witness['url'],'0'], 'Unsuccessful HTTP or TLS recorded as successful reopen')
            require(type(record['bodyBytes']) is int and record['bodyBytes']>0 and re.fullmatch('[0-9a-f]{64}',record['bodySha256']), 'Invalid response hash or byte count')
            begin=datetime.fromisoformat(record['requestBeganUTC']); end=datetime.fromisoformat(record['requestCompletedUTC'])
            require(begin.tzinfo is not None and end.tzinfo is not None and end>=begin, 'Invalid request timestamps')
            require(record['rawBodyPublished'] is False, 'Full source HTML should remain outside the research drop')
            require(record['quotes']==witness['quotes'], 'Reopen quotes differ from original source registry')
            quote_ids=[q['id'] for q in witness['quotes']]
            require(len(quote_ids)==len(set(quote_ids)) and all(0<len(q['text'].split())<=25 for q in witness['quotes']), 'Invalid reopen quotation set')
            require(record['missingQuoteIds']==[] and len(record['recoveredQuoteIds'])==len(set(record['recoveredQuoteIds'])) and set(record['recoveredQuoteIds'])==set(quote_ids), 'Not every source quotation was recovered')
        require(set(seen)==set(expected), 'Reopen source scope differs')
        by_pass.append(seen)
    for sid in expected:
        require(datetime.fromisoformat(by_pass[1][sid]['requestBeganUTC'])>datetime.fromisoformat(by_pass[0][sid]['requestCompletedUTC']), 'Second reopen precedes first completion')
    require(summary['passed'] is True and summary['uniqueUrls']==len(expected) and summary['passes']==2 and summary['requests']==len(expected)*2 and summary['quoteRecoveries']==sum(len(r['recoveredQuoteIds']) for records in passes for r in records) and summary['missingQuotes']==0 and summary['failedSources']==[], 'Reopen summary differs from complete request records')
    return sum(len(r['recoveredQuoteIds']) for records in passes for r in records)

def run(args):
    checks=[]
    def checked(name,cases,callback,detail=''):
        callback();checks.append({'name':name,'caseCount':cases,'passed':True,'seed':None,'detail':detail});print(f'PASS {name}: {cases} cases; seed=n/a')
    documents={x:load(x+'.json') for x in OWN};schemas={x:load(x+'.schema.json') for x in OWN}
    index=load('catalogue-index.json');data=documents['minigames'];sources=documents['catalogue-sources'];audit=documents['catalogue-second-pass']
    def schema_check():
        for x in OWN:jsonschema.Draft202012Validator.check_schema(schemas[x]);jsonschema.Draft202012Validator(schemas[x]).validate(documents[x])
    checked('Six closed Draft 2020-12 data schemas',6,schema_check)
    jsonfiles=sorted(ROOT.rglob('*.json'))
    checked('All delivery JSON rejects duplicate keys',len(jsonfiles),lambda:[load(str(f.relative_to(ROOT))) for f in jsonfiles])
    rows,quotes=validate_catalogue(data,sources,audit,index)
    checked('Canonical 132-row union and 112/20 edition scope',132,lambda:require(len(rows)==132,'Count differs'))
    checked('Every row has every required field and exact canonical name',132*len(rows[0]),lambda:require(all(set(r)==set(rows[0]) for r in rows),'Missing field'))
    checked('Case/punctuation-insensitive name uniqueness',132,lambda:require(len({key(r['name']) for r in rows})==132,'Duplicate normalized name'))
    def counts():
        c=documents['catalogue-list-comparison']['counts'];require(c=={'wikiCombined':132,'wikiBase':112,'wikiTv':20,'nintendoLifeBaseTable':112,'nintendoLifeTvDistinctNames':20,'nintendoLifeCombinedStatement':132,'familyGameSquadBaseNames':112},'Source counts differ')
        require(len(documents['catalogue-list-comparison']['nintendoLifeRawBaseOnly'])==len(documents['catalogue-list-comparison']['wikiRawBaseMissingFromNintendoLife'])==3,'Raw spelling differences erased')
        require(documents['catalogue-list-comparison']['familyGameSquadBaseMissing']==[],'Independent canonical-name gap')
        require(all(q in quotes for q in documents['catalogue-list-comparison']['countQuoteIds']),'Missing short count witness')
    checked('Counts versus independently reopened lists and raw disagreements',10,counts)
    def csv_check():
        with (ROOT/'minigames.csv').open(newline='') as f:csvrows=list(csv.DictReader(f))
        require(len(csvrows)==132,'CSV row count differs')
        for saved,row in zip(csvrows,rows):
            require(set(saved)==set(row),'CSV fields differ')
            for k,v in row.items():
                observed=json.loads(saved[k]) if isinstance(v,(dict,list,bool)) or v is None or isinstance(v,int) else saved[k]
                require(observed==v,'CSV round-trip changed '+row['id']+' '+k)
    checked('Exact JSON/CSV field round trip',132*len(rows[0]),csv_check)
    def quote_support_check():
        spec=importlib.util.spec_from_file_location('quote_support_check',ROOT/'quote-support-check.py');qsc=importlib.util.module_from_spec(spec);spec.loader.exec_module(qsc)
        report=qsc.build(data,sources);require(load('reports/quote-support-check.json')==report,'Quote-support report differs from its recomputation')
        require(not [i for i in report['items'] if i['titleOnly'] and i['status']=='corroborated' and i['field'] in ('category','format')],'A corroborated category or format rests on title-only quotes')
        require(report['flaggedFieldClaims']==len(report['items']) and report['checkedFieldClaims']>=700,'Quote-support totals are invalid')
    checked('Quote-support report reproduces; no title-only corroborated category or format',load('reports/quote-support-check.json')['checkedFieldClaims'],quote_support_check,'Automated lexical flags need a human source re-read; they do not prove support')
    checked('Field citations and true publisher lineage boundaries',1320,lambda:validate_catalogue(data,sources,audit,index))
    checked('Short clips, quote budgets and complete A/B recovery',len(quotes)+len(sources['sources'])*3,lambda:validate_catalogue(data,sources,audit,index))
    checked('Literal controller labels and 25 base motion entries',sum(len(r['controls']['bindings']) for r in rows)+132,lambda:validate_catalogue(data,sources,audit,index))
    checked('Original two-sentence summaries and phone assessments',396,lambda:validate_catalogue(data,sources,audit,index))
    def gameplay_rule_check():
        spec=importlib.util.spec_from_file_location('quote_support_check',ROOT/'quote-support-check.py');qsc=importlib.util.module_from_spec(spec);spec.loader.exec_module(qsc)
        quotes=qsc.quote_index(sources)
        for r in rows:require(r['fieldEvidence']['gameplay']['status']==qsc.expected_gameplay_status(r['fieldEvidence']['gameplay']['quoteIds'],quotes),'Gameplay status breaks the two-lineage substantive-quote rule: '+r['id'])
        require(sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in rows)==61,'Corroborated summaries differ from the verified common-action rule')
    checked('Narrow summary status follows the two-lineage substantive-quote rule',132,gameplay_rule_check,'Only summaries with sentence-length quotes from two publisher lineages are corroborated')
    def same_publisher_rejects():
        altered=copy.deepcopy(data)
        altered['minigames'][121]['fieldEvidence']['gameplay']['quoteIds']=['SR_MOUSEQ002','TG_TVQ001']
        try:validate_catalogue(altered,sources,audit,index)
        except AssertionError as error:require(str(error)=='Two references from one publisher are not independent','Wrong failure hid publisher-lineage weakness')
        else:raise AssertionError('ScreenRant and TheGamer falsely counted as independent publishers')
    checked('ScreenRant/TheGamer shared-Valnet lineage rejection',1,same_publisher_rejects)
    contexts=sum(len(a['independentScopeChecks']) for a in audit['rows'])
    checked('Full row audit bindings and complete reopened source contexts',132+contexts,lambda:validate_catalogue(data,sources,audit,index))
    checked('Unknown awards, returning editions, timer scopes and conflict retention',132+25,lambda:validate_catalogue(data,sources,audit,index))
    checked('Fifteen material conflicts preserved',15,lambda:require(len(documents['catalogue-conflicts']['conflicts'])==15,'Conflict omitted'))
    def reward_witness_check(proof):
        schema=load('reports/reward-quote-capture-audit.schema.json')
        jsonschema.Draft202012Validator.check_schema(schema);jsonschema.Draft202012Validator(schema).validate(proof)
        expected={r['id']:set(r['fieldEvidence']['reward']['quoteIds']) for r in rows if r['fieldEvidence']['reward']['status'] in ['single_source','corroborated']}
        require(len(expected)==19, 'Reported reward row scope differs')
        expected['MG120']={q for q in rows[119]['fieldEvidence']['gameplay']['quoteIds'] if q.startswith('W120_gameplay_')}
        wanted={(row,q,p) for row,ids in expected.items() for q in ids for p in [1,2]};observed=set()
        for check in proof['checks']:
            key=(check['id'],check['quoteId'],check['pass']);require(key in wanted and key not in observed,'Duplicate, invented or unrelated reward/gameplay witness')
            observed.add(key);source,quote=quotes[check['quoteId']]
            require(check['sourceUrl']==source['url'] and check['quote']==quote['text'] and check['bodySha256']==source['passes'][check['pass']-1]['bodySha256'], 'Capture witness differs from original quote/response registry')
        require(observed==wanted,'Missing exact reward or gameplay witness')
        require(all('_reward_' in q for row,ids in expected.items() if row!='MG120' for q in ids),'Reward claim supported only by introductory text')
    reward_proof=load('reports/reward-quote-capture-audit.json')
    checked('Exact reward/gameplay quote witnesses bound to both article captures',len(reward_proof['checks']),lambda:reward_witness_check(reward_proof))
    def bad_reward_witnesses():
        mutations=[lambda d:d['checks'].pop(),lambda d:d['checks'][0].__setitem__('quote','Unsupported reward'),lambda d:d['checks'][0].__setitem__('bodySha256','0'*64),lambda d:d['checks'].__setitem__(1,copy.deepcopy(d['checks'][0]))]
        for mutate in mutations:
            proof=copy.deepcopy(reward_proof);mutate(proof)
            try:reward_witness_check(proof)
            except (AssertionError,jsonschema.ValidationError):pass
            else:raise AssertionError('Malformed reward capture witness accepted')
    checked('Four isolated malformed reward-capture fixtures',4,bad_reward_witnesses)
    def gaps_check():
        gaps=load('reports/research-gaps.json');schema=load('reports/research-gaps.schema.json')
        jsonschema.Draft202012Validator.check_schema(schema);jsonschema.Draft202012Validator(schema).validate(gaps)
        expected=[{'id':r['id'],'name':r['name'],'unresolvedFields':[{'field':f,'status':e['status'],'limitation':e['limitation'],'quoteIds':e['quoteIds']} for f,e in r['fieldEvidence'].items() if e['status']!='corroborated']} for r in rows]
        require(gaps['rows']==expected,'Research gap ledger does not match every published row/field')
        count=sum(e['status']=='corroborated' for r in rows for e in r['fieldEvidence'].values())
        require(gaps['corroboratedNarrowFacts']==count and gaps['remainingFactFields']==1320-count,'Research gap totals differ')
    checked('Closed schema and exact per-row remaining research-gap ledger',133,gaps_check)
    reopen_paths=['reports/source-reopens-passA','reports/source-reopens-passB','reports/source-reopens-summary']
    reopen_docs=[load(x+'.json') for x in reopen_paths]
    def reopen_schemas():
        for path, document in zip(reopen_paths,reopen_docs):
            schema=load(path+'.schema.json');jsonschema.Draft202012Validator.check_schema(schema);jsonschema.Draft202012Validator(schema).validate(document)
    checked('Three closed source-reopening report schemas',3,reopen_schemas)
    recovered=validate_reopens(sources,reopen_docs[:2],reopen_docs[2])
    checked('All '+str(len(reopen_docs[0]))+' source URLs reopened twice with ordered HTTPS/TLS records',len(reopen_docs[0])*2,lambda:validate_reopens(sources,reopen_docs[:2],reopen_docs[2]))
    checked('Every recovered reopen quotation bound to the original registry',recovered,lambda:validate_reopens(sources,reopen_docs[:2],reopen_docs[2]))
    preview_arrangement_recovery=module('b03_preview_arrangement_recovery','check-preview-arrangement-recovery.py')
    for result in preview_arrangement_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Preview arrangement recovery failed'),result.get('detail',''))
    japanese_coin=module('b03_japanese_coin_candidates','check-japanese-coin-candidates.py')
    for result in japanese_coin.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Japanese Coin candidate failed'),result.get('detail',''))
    deferred_facts=module('b03_deferred_fact_reconciliation','check-deferred-fact-reconciliation.py')
    for result in deferred_facts.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Deferred fact reconciliation failed'),result.get('detail',''))
    preview_arrangements=module('b03_preview_player_arrangements','check-preview-player-arrangements.py')
    for result in preview_arrangements.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Preview arrangement candidate failed'),result.get('detail',''))
    coin_frontier=module('b03_coin_category_frontier','check-coin-category-frontier.py')
    for result in coin_frontier.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Coin category frontier failed'),result.get('detail',''))
    format_recovery=module('b03_format_recovery','check-format-recovery.py')
    for result in format_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Player-format recovery failed'),result.get('detail',''))
    format_candidate=module('b03_format_candidates','check-format-candidates.py')
    for result in format_candidate.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Player-format candidate failed'),result.get('detail',''))
    rosalina_recovery=module('b03_rosalina_gameplay_recovery','check-rosalina-gameplay-recovery.py')
    for result in rosalina_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Rosalina gameplay recovery failed'),result.get('detail',''))
    rosalina_candidate=module('b03_rosalina_structural_candidate','check-rosalina-structural-candidate.py')
    for result in rosalina_candidate.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Rosalina structural candidate failed'),result.get('detail',''))
    ranked_recovery=module('b03_ranked_gameplay_recovery','check-ranked-gameplay-recovery.py')
    for result in ranked_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Six ranked-guide action recovery failed'),result.get('detail',''))
    ranked_checker=module('b03_ranked_gameplay_candidates','check-ranked-gameplay-candidates.py')
    for result in ranked_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Ranked independent gameplay candidate proof failed'),result.get('detail',''))
    cog_recovery=module('b03_cog_recovery','check-cog-gameplay-recovery.py')
    for result in cog_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'COG action recovery failed'),result.get('detail',''))
    cog_checker=module('b03_cog_candidates','check-cog-gameplay-candidates.py')
    for result in cog_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'COG candidate provenance failed'),result.get('detail',''))
    original_review_recovery=module('b03_original_review_recovery','check-original-review-recovery.py')
    for result in original_review_recovery.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Original review recovery failed'),result.get('detail',''))
    original_review_checker=module('b03_original_review_candidates','check-original-review-candidates.py')
    for result in original_review_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Original review candidate provenance failed'),result.get('detail',''))
    mouse_recovery_checker=module('b03_mouse_category_recovery','check-mouse-category-recovery.py')
    for result in mouse_recovery_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Mouse category adoption failed'),result.get('detail',''))
    mouse_candidate_checker=module('b03_mouse_category_candidate','check-mouse-category-candidate.py')
    for result in mouse_candidate_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Mouse candidate provenance failed'),result.get('detail',''))
    category_checker=module('b03_category_heading_repair','check-category-heading-repair.py')
    for result in category_checker.run():
        checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    recovery_checker=module('b03_category_summary_recovery','check-category-summary-recovery.py')
    for result in recovery_checker.run():
        checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    common_checker=module('b03_common_gameplay_recovery','check-common-gameplay-recovery.py')
    for result in common_checker.run():
        checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    namu_checker=module('b03_namu_gameplay_recovery','check-namu-gameplay-recovery.py')
    for result in namu_checker.run():
        checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    knock_checker=module('b03_knock_scope_recovery','check-knock-scope-recovery.py')
    for result in knock_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Knock whole-scope repair failed'),result.get('detail',''))
    tv_action_checker=module('b03_tv_action_recovery','check-tv-action-recovery.py')
    for result in tv_action_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Four original-review actions failed'),result.get('detail',''))
    tips_recovery_checker=module('b03_family_tips_recovery','check-family-tips-recovery.py')
    for result in tips_recovery_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Four shared-action recovery failed'),result.get('detail',''))
    tv_candidate_checker=module('b03_tv_author_candidate','check-tv-author-candidate.py')
    for result in tv_candidate_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Unadopted review candidate proof failed'),result.get('detail',''))
    tips_candidate_checker=module('b03_family_tips_candidate','check-family-tips-candidate.py')
    for result in tips_candidate_checker.run():
        checked(result['name'],result['caseCount'],lambda:require(result['passed'] is True,'Candidate provenance check failed'),result.get('detail',''))
    namu_batch_checker=module('b03_namu_batch_recovery','check-namu-batch-recovery.py')
    for result in namu_batch_checker.run():
        checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    def negative_reopens():
        mutations=[
            lambda p,s:p[0].pop(),
            lambda p,s:p[0].__setitem__(1,copy.deepcopy(p[0][0])),
            lambda p,s:p[0][0].__setitem__('sourceId','invented'),
            lambda p,s:p[0][0].__setitem__('url','https://example.com/'),
            lambda p,s:p[0][0].__setitem__('pass',2),
            lambda p,s:p[0][0].__setitem__('curlExit',22),
            lambda p,s:p[0][0].__setitem__('httpEffectiveTls',['200',p[0][0]['url'],'1']),
            lambda p,s:p[0][0].__setitem__('bodyBytes',True),
            lambda p,s:p[0][0].__setitem__('bodySha256','g'*64),
            lambda p,s:p[1][0].__setitem__('requestBeganUTC',p[0][0]['requestBeganUTC']),
            lambda p,s:p[0][0]['quotes'][0].__setitem__('text','invented factual support'),
            lambda p,s:p[0][0]['recoveredQuoteIds'].pop(),
            lambda p,s:p[0][0]['missingQuoteIds'].append(p[0][0]['quotes'][0]['id']),
            lambda p,s:p[0][0].__setitem__('rawBodyPublished',True),
            lambda p,s:s.__setitem__('quoteRecoveries',s['quoteRecoveries']+1),
            lambda p,s:s.__setitem__('passed',False)]
        for mutate in mutations:
            passes=copy.deepcopy(reopen_docs[:2]); summary=copy.deepcopy(reopen_docs[2]);mutate(passes,summary)
            try:validate_reopens(sources,passes,summary)
            except AssertionError:pass
            else:raise AssertionError('Malformed reopening proof accepted')
    checked('Sixteen isolated malformed reopening-proof fixtures',16,negative_reopens)
    def negative():
        mutators=[lambda d:d['minigames'][0].pop('controls'),lambda d:d['minigames'][0].__setitem__('phoneFit',6),lambda d:d['minigames'][1].__setitem__('name','LUMBER-- TUMBLE'),lambda d:d['minigames'][0]['fieldEvidence']['name'].__setitem__('quoteIds',['W001_q1']),lambda d:d['minigames'][0]['fieldEvidence']['name'].__setitem__('quoteIds',['absent']),lambda d:d['minigames'][0]['reward'].__setitem__('stars',0),lambda d:d.__setitem__('complete',True),lambda d:d['minigames'][0].__setitem__('summary','Only one sentence.'),lambda d:d['minigames'][38]['timeLimit'].__setitem__('wholeGameSeconds',60),lambda d:d['minigames'][63]['timeLimit'].__setitem__('wholeGameSeconds',30),lambda d:d['minigames'][115]['fieldEvidence']['format'].__setitem__('status','corroborated'),lambda d:d['minigames'][102]['controls'].__setitem__('inputTypes',['buttons'])]
        for m in mutators:
            d=copy.deepcopy(data);m(d)
            try:validate_catalogue(d,sources,audit,index)
            except (AssertionError,jsonschema.ValidationError):pass
            else:raise AssertionError('Hostile catalogue fixture accepted')
        for which in ['lineage','quote','audit']:
            ss=copy.deepcopy(sources);aa=copy.deepcopy(audit)
            if which=='lineage':ss['sources'][0]['publisherLineage']='independent-invented'
            if which=='quote':ss['sources'][0]['quotes'][0]['text']=' '.join(['word']*26)
            if which=='audit':aa['rows'][0]['publishedRowSha256']='0'*64
            try:validate_catalogue(data,ss,aa,index)
            except (AssertionError,jsonschema.ValidationError):pass
            else:raise AssertionError('Hostile evidence fixture accepted')
    checked('Fifteen isolated hostile catalogue/evidence fixtures',15,negative)
    # Preserve the external writer's original acceptance tests and invoke them unchanged.
    iv=module('b03_preserved_index','verify-index.py')
    for label,file in [('historical','source-excerpts.json'),('fresh','current-index-evidence.json')]:
        for result in iv.verify(index,load(file),load('catalogue-index.schema.json')):
            result['name']='Preserved '+label+' index / '+result['name'];checks.append(result);print(f"PASS {result['name']}: {result['caseCount']} cases; seed=n/a")
    gv=module('b03_preserved_gameplay','verify-gameplay-leads.py')
    for label,file in [('historical','gameplay-leads.json'),('fresh','current-article-leads.json')]:
        out=gv.validate(load(file),index,None,load('gameplay-leads.schema.json'))
        for name,n in out['caseCounts'].items():checks.append({'name':'Preserved '+label+' article / '+name,'caseCount':n,'passed':True,'seed':None,'detail':'Compact evidence integrity only; no game execution.'});print(f'PASS Preserved {label} article / {name}: {n} cases; seed=n/a')
    commands=[(['check-validator-rejections.py'],'caseCount'),(['test-gameplay-evidence.py','--evidence','gameplay-leads.json'],'rejectedInvalidCases'),(['test-gameplay-evidence.py','--evidence','current-article-leads.json'],'rejectedInvalidCases')]
    for argv,field in commands:
        result=subprocess.run([sys.executable,str(ROOT/argv[0]),*argv[1:]],cwd=ROOT,text=True,capture_output=True)
        require(result.returncode==0,'Original guard failed: '+result.stdout+result.stderr);out=json.loads(result.stdout);checked('Preserved guard / '+' '.join(argv),out[field],lambda:require(out['passed'] is True,'Guard report failed'))
    files=[f for f in ROOT.rglob('*') if f.is_file() and '__pycache__' not in f.parts]
    checked('Every delivered file below 30 MB',len(files),lambda:require(all(f.stat().st_size<=30*1024*1024 for f in files),'Oversized file'))
    if args.hashes:
        lines=(ROOT/'SHA256SUMS.txt').read_text().splitlines();named=[]
        for line in lines:
            h,name=line.split('  ',1);require(not Path(name).is_absolute() and '..' not in Path(name).parts,'Manifest escapes job folder');named.append(name);require(hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==h,'Hash differs: '+name)
        expected={str(f.relative_to(ROOT)) for f in files if f.name!='SHA256SUMS.txt'};require(set(named)==expected and len(named)==len(expected),'Manifest omits/adds files')
        checked('Complete SHA-256 delivery manifest',len(named),lambda:None)
    statuses={field:dict(Counter(r['fieldEvidence'][field]['status'] for r in rows)) for field in FACTS}
    completefacts=sum(e['status']=='corroborated' for r in rows for e in r['fieldEvidence'].values())
    result={'job':'B03','passed':True,'seed':None,'checks':checks,'suites':len(checks),'cases':sum(c['caseCount'] for c in checks),'rows':132,'fieldStatuses':statuses,'strictResearch':{'verdict':'NOT_MET','corroboratedNarrowFacts':completefacts,'requiredFactFields':1320,'wholeRowsComplete':0,'wholeRowsRequired':132,'nintendoGameplayExecuted':False},'versions':{'python':sys.version.split()[0],'jsonschema':__import__('importlib.metadata',fromlist=['version']).version('jsonschema')}}
    print(json.dumps(result,indent=2))
    if args.report:Path(args.report).write_text(json.dumps(result,indent=2)+'\n')
    return 1 if args.strict else 0
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--strict',action='store_true');p.add_argument('--hashes',action='store_true');p.add_argument('--report');args=p.parse_args()
    try:sys.exit(run(args))
    except Exception as e:print('FAILED: '+str(e),file=sys.stderr);raise
