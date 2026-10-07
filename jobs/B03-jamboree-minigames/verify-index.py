#!/usr/bin/env python3
"""Validate preliminary research evidence; passing checks never certify final B03."""
import argparse
from collections import Counter
from datetime import datetime
import hashlib
import importlib.metadata
import json
from pathlib import Path
import re
import shlex
import unicodedata
from urllib.parse import urlsplit
import jsonschema

ROOT=Path(__file__).resolve().parent
EXPECTED_SOURCES={
    'wiki':'https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames',
    'legacy':'https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables',
    'legacyTv':'https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/',
    'nintendo':'https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/',
}
LIST_SOURCES=('wiki','legacy','legacyTv')


def key(name):
    return ''.join(c for c in unicodedata.normalize('NFKC',name).casefold() if c.isalnum())


def verify(index,evidence,schema):
    results=[]
    def require(condition,message):
        if not condition: raise AssertionError(message)
    def checked(name,cases,callback,detail=''):
        callback()
        results.append({'name':name,'caseCount':cases,'passed':True,'seed':None,'detail':detail})
    def rows(source,pass_id='pass2'): return evidence['sources'][source][pass_id]['rows']

    def check_schema():
        validator=jsonschema.Draft202012Validator(schema);validator.check_schema(schema)
        errors=sorted(validator.iter_errors(index),key=lambda e:str(e.path))
        require(not errors,'\n'.join(str(e) for e in errors))
    checked('Draft 2020-12 JSON Schema',1,check_schema)

    def transports():
        require(set(evidence['sources'])==set(EXPECTED_SOURCES),'Unexpected or missing source publisher')
        paths=[]
        for source_id,url in EXPECTED_SOURCES.items():
            source=evidence['sources'][source_id]
            require(source['url']==url,'Wrong HTTPS source URL or publisher scope')
            parsed=urlsplit(source['url'])
            require(parsed.scheme=='https' and not parsed.username and not parsed.password and not parsed.fragment,'Source must be the expected HTTPS URL')
            for pass_id in ('pass1','pass2'):
                r=source[pass_id]
                require(r['curlExitCode']==0,'Failed source request recorded as evidence')
                require(r['reportedHttpStatusAndEffectiveUrl']=='200 '+url,'Effective response URL or scope differs')
                require(re.fullmatch('[0-9a-f]{64}',r['sha256']) is not None,'Invalid source-byte hash')
                require(r['byteLength']>0,'Empty source retrieval')
                cmd=shlex.split(r['curlCommand'])
                require(cmd[0]=='curl' and cmd[-1]==url,'Recorded curl command does not target the expected source')
                require(not {'-k','--insecure','--proxy-insecure','--noproxy','--proxy','-x'}&set(cmd),'TLS/proxy bypass recorded')
                require('--fail' in cmd and '--location' in cmd,'Expected curl failure/redirect handling missing')
                snapshot=Path(r['snapshotPath'])
                expected_command=['curl','--fail','--silent','--show-error','--location',
                                  '--connect-timeout','10','--max-time','45','--output',str(snapshot),
                                  '--write-out','%{http_code} %{url_effective}',url]
                require(cmd==expected_command,'Recorded curl arguments differ from the supported TLS-preserving collector command')
                require(cmd[cmd.index('--output')+1]==str(snapshot),'Recorded snapshot path differs from request')
                require(snapshot.parent.name==pass_id and snapshot.name==source_id+'.html','Distinct source/pass snapshot name required')
                paths.append(str(snapshot.resolve()))
                if snapshot.exists():
                    data=snapshot.read_bytes()
                    require(hashlib.sha256(data).hexdigest()==r['sha256'] and len(data)==r['byteLength'],'Original snapshot bytes do not match retrieval record')
            first=datetime.fromisoformat(source['pass1']['retrievedAtUtc'].replace('Z','+00:00'))
            second=datetime.fromisoformat(source['pass2']['retrievedAtUtc'].replace('Z','+00:00'))
            require(second>first,'Pass two must be a later request')
        require(len(paths)==len(set(paths)),'Snapshot path reused across requests')
    checked('Expected HTTPS publishers, effective scopes, and distinct verified snapshots',len(EXPECTED_SOURCES)*2,transports,
            'Stored page bytes checked when original outside-checkout snapshot files remain available.')

    def counts():
        for p in ('pass1','pass2'):
            wiki=evidence['sources']['wiki'][p];legacy=evidence['sources']['legacy'][p]
            tv=evidence['sources']['legacyTv'][p];nintendo=evidence['sources']['nintendo'][p]
            base=sum(r['edition']=='base' for r in wiki['rows']);new=sum(r['edition']=='jamboree_tv' for r in wiki['rows'])
            require(base==wiki['declaredCounts']['base']==index['sourceCounts']['wikiBase'],'Wiki base count differs')
            require(new==wiki['declaredCounts']['jamboree_tv']==index['sourceCounts']['wikiTv'],'Wiki TV count differs')
            require(len(wiki['rows'])==wiki['declaredCounts']['combined']==index['sourceCounts']['wikiCombined'],'Wiki combined count differs')
            require(len(legacy['rows'])==legacy['declaredCounts']['base']==index['sourceCounts']['legacyBase']==base,'Independent base count differs')
            require(len(tv['rows'])==tv['declaredCounts']['jamboree_tv']==index['sourceCounts']['legacyTv']==new,'Independent TV count differs')
            require(nintendo['declaredCounts']['jamboree_tv']==index['sourceCounts']['nintendoTv']==new,'Official TV additions count differs')
            require(len(legacy['rows'])+len(tv['rows'])==index['sourceCounts']['legacyCombined']==len(wiki['rows']),'Combined publisher-list union count differs')
    checked('Counts versus two publisher catalogues and official additions count',14,counts,
            'Wiki combined list:132; Legacy base112 + TV20:132. Nintendo additions20. Second wiki list page remains missing.')

    populations=[index['entries']]+[rows(s,p) for s in LIST_SOURCES for p in ('pass1','pass2')]
    def duplicates():
        for population in populations:
            require(all(n==1 for n in Counter(key(r['name']) for r in population).values()),'Normalized duplicate names')
        for p in ('pass1','pass2'):
            require(not {key(r['name']) for r in rows('legacy',p)}&{key(r['name']) for r in rows('legacyTv',p)},'Publisher edition lists overlap')
    checked('Case/punctuation-insensitive duplicate and edition-overlap checks',sum(map(len,populations)),duplicates)

    def recheck():
        for s in LIST_SOURCES:
            source=evidence['sources'][s]
            require(source['pass1']['rows']==source['pass2']['rows'],f'{s} names/categories changed between requests')
        for s in EXPECTED_SOURCES:
            source=evidence['sources'][s]
            require(source['pass1']['quotes']==source['pass2']['quotes'],f'{s} short quotations changed between requests')
    recheck_cases=sum(len(rows(s)) for s in LIST_SOURCES)+sum(len(evidence['sources'][s]['pass2']['quotes']) for s in EXPECTED_SOURCES)
    checked('Fresh second-pass list rows and all short source quotations',recheck_cases,recheck,
            '132 wiki +112 Legacy base +20 Legacy TV list rows; list labels/context only, never full game mechanics.')

    independent={s:{key(r['name']):r for r in rows(s)} for s in ('legacy','legacyTv')}
    def index_links():
        wiki=rows('wiki');require(len(index['entries'])==len(wiki),'Index lacks wiki rows')
        for n,(r,w) in enumerate(zip(index['entries'],wiki),1):
            require(r['ordinal']==n,'Index ordinal differs from source order')
            require(r['name']==w['name'] and r['wikiCategoryPath']==w['categoryPath'] and r['edition']==w['edition'],'Unsupported wiki row fields')
            article='https://www.mariowiki.com'+w['articlePath']
            require(r['wikiArticleUrl']==article and urlsplit(article).scheme=='https' and urlsplit(article).netloc=='www.mariowiki.com','Article URL differs from extracted path or HTTPS wiki host')
            source_id='legacy' if r['edition']=='base' else 'legacyTv'
            match=independent[source_id].get(key(r['name']))
            require(r['legacyName']==(match['name'] if match else None),'Unjustified independent name alias')
            require(r['legacySource']==(source_id if match else None),'Independent publisher page attribution differs')
            require(r['legacyCategoryPath']==(match['categoryPath'] if match else None),'Unjustified source category alias')
            require(r['confidence']==('medium' if match else 'low'),'Confidence hides unmatched name')
            require(r['indexPass2']=={'wiki':True,'legacy':True if match else None},'Incorrect per-row second-pass claim')
    checked('Every row and HTTPS game link bound to exact pass-two extraction',len(index['entries']),index_links)

    def complete_citations():
        for r,w in zip(index['entries'],rows('wiki')):
            expected=[('wiki','name',w['name'],'#'+w['categoryAnchor'])]
            expected += [('wiki','category',label,'#'+w['categoryAnchor']) for label in w['categoryPath']]
            source_id='legacy' if r['edition']=='base' else 'legacyTv';match=independent[source_id].get(key(r['name']))
            if match:
                expected.append((source_id,'name',match['name'],'#'+match['categoryAnchor']))
                expected += [(source_id,'category',label,'#'+match['categoryAnchor']) for label in match['categoryPath']]
            actual=[(c['source'],c['field'],c['quote'],c['locator']) for c in r['citations']]
            require(Counter(actual)==Counter(expected),'Citation multiset omits/substitutes/duplicates required exact name/category evidence')
    checked('Complete exact per-row citation multisets, without duplicates or substitutes',len(index['entries']),complete_citations)

    citations=[c for r in index['entries'] for c in r['citations']]
    source_quotes=[q for s in evidence['sources'].values() for p in ('pass1','pass2') for q in s[p]['quotes']]
    def short_quotes():
        require(all(0<len(q['quote'].split())<=25 for q in citations+source_quotes),'Quote exceeds 25 words')
    checked('Every archived/index quotation at most 25 words',len(citations)+len(source_quotes),short_quotes)

    wb={key(r['name']):r for r in rows('wiki') if r['edition']=='base'}
    wt={key(r['name']):r for r in rows('wiki') if r['edition']=='jamboree_tv'}
    lb=independent['legacy'];lt=independent['legacyTv']
    def diffs():
        c=index['comparison'];base=len(set(wb)&set(lb));tv=len(set(wt)&set(lt))
        require(c['baseNormalizedIntersection']==base,'Base intersection differs')
        require(c['tvNormalizedIntersection']==tv,'TV intersection differs')
        require(c['combinedNormalizedIntersection']==base+tv,'Combined intersection differs')
        for field,a,b in [('wikiOnlyBase',wb,lb),('legacyOnlyBase',lb,wb),('wikiOnlyTv',wt,lt),('legacyOnlyTv',lt,wt)]:
            expected=[a[k]['name'] for k in set(a)-set(b)]
            require(Counter(c[field])==Counter(expected),f'{field} differences omitted/duplicated')
        variants=[(a[k]['name'],b[k]['name']) for a,b in ((wb,lb),(wt,lt)) for k in set(a)&set(b) if a[k]['name']!=b[k]['name']]
        require(Counter((v['wikiName'],v['legacyName']) for v in c['punctuationCaseVariants'])==Counter(variants),'Case/punctuation variants omitted/duplicated')
    checked('Exact base/TV/combined source sets and spelling disagreements',8,diffs,
            'Base intersection110; TV20; combined130. Two wiki-only and two Legacy-only base names preserved; TV sets identical.')

    expected_categories={}
    for w in rows('wiki'):
        match=(lb if w['edition']=='base' else lt).get(key(w['name']))
        if match:
            pair=(' / '.join(w['categoryPath']),' / '.join(match['categoryPath']))
            if pair[0]!=pair[1]:expected_categories.setdefault(pair,[]).append(w['name'])
    def category_differences():
        actual=index['comparison']['categoryDifferences']
        require(len(actual)==len(expected_categories),'Category difference groups omitted/added')
        seen=set()
        for r in actual:
            pair=(r['wikiPath'],r['legacyPath'])
            require(pair in expected_categories and pair not in seen,'Unknown/duplicate category difference group')
            require(Counter(r['names'])==Counter(expected_categories[pair]),'Category difference membership omitted/substituted')
            seen.add(pair)
    checked('Reconstructed exact category-difference groups and membership',len(expected_categories),category_differences)

    def headings():
        for p in ('pass1','pass2'):
            source=evidence['sources']['legacy'][p]
            for h in source['categoryHeadings']:
                require(sum(r['categoryPath']==h['categoryPath'] for r in source['rows'])==h['declaredCount'],'Base category totals differ')
            source=evidence['sources']['legacyTv'][p]
            for h in source['categoryGroups']:
                require(sum(r['group']==h['group'] for r in source['rows'])==h['declaredCount'],'TV source group totals differ')
    heading_cases=sum(len(evidence['sources']['legacy'][p]['categoryHeadings'])+len(evidence['sources']['legacyTv'][p]['categoryGroups']) for p in ('pass1','pass2'))
    checked('Independent base category and raw TV group count claims',heading_cases,headings)
    return results


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--evidence',type=Path,default=ROOT/'source-excerpts.json')
    parser.add_argument('--json-output',type=Path)
    args=parser.parse_args()
    index=json.loads((ROOT/'catalogue-index.json').read_text());schema=json.loads((ROOT/'catalogue-index.schema.json').read_text())
    results=verify(index,json.loads(args.evidence.read_text()),schema)
    print(f'jsonschema {importlib.metadata.version("jsonschema")} / Draft 2020-12')
    for r in results:print(f'PASS {r["name"]}: {r["caseCount"]} cases; seed=n/a'+(f'; {r["detail"]}' if r['detail'] else ''))
    print('UNVERIFIED: final per-game facts, source category/availability conflicts, two wiki list-page counts, final JSON/CSV/schema, full per-game second pass.')
    print('Job B03 complete=false. Passing checks validate the preliminary index only.')
    if args.json_output:args.json_output.write_text(json.dumps({'scope':'preliminary index only','finalJobComplete':False,'jsonschemaVersion':importlib.metadata.version('jsonschema'),'tests':results},indent=2)+'\n')


if __name__=='__main__': main()
