"""Prove only sixteen narrow fields and restore all accepted historical evidence."""
from pathlib import Path
from datetime import datetime
import copy, hashlib, importlib.util, json, re, unicodedata

ROOT = Path(__file__).resolve().parent
BASELINE = 'df837ce3d6a402590e2ae71151345c204f0563d5'
DATA = 'd4b264f25b8e7a4f2ee9c6aa43b9ba0da1c677f21e8046b6908354d4dd704eb0'
SOURCES = '27669a0d97dc12a87a7a013e26b6738506cd6ab365b7a41e65894209fbafcef6'
REOPENS = ['708ca3d412dc32124d1b165a6a73949c4c016973c76b3301306460f4fc6623c4','ecb40c4a541132386204bf4fe4b110aaf3d8d0a9f524ea0f21cc94523a01008b']
PACKET = '192bded51f78b2f64ff33bbc9bee6803c5089efedcd9a1bea674344513ada120'
URL = 'https://simplestreviews.blogspot.com/2024/10/super-mario-party-jamboree-board.html'
SUMMARIES = {
    'MG002':'Players study pictures on circus balls. Toads roll the balls around.',
    'MG005':'Players move around a sphere collecting flags. They try to collect as many flags as possible.',
    'MG008':'Players create shockwaves by ground-pounding. They dodge the shockwaves made by opponents.',
    'MG009':'Players look for differences between pictures. Thwomps obscure the pictures.',
    'MG010':'Players dodge gusts from Ty-foos. They move on slippery ice.',
    'MG013':'Players shoot basketballs at hoops. They aim for the middle row.',
    'MG019':'Players steer through a course. They pass Amps.',
    'MG020':'Players ride cycles during a race. They also clear hurdles.',
    'MG021':'Players swing a pickax to dig. They try to dig quickly.',
    'MG026':'Players dive underwater for treasure chests. They carry the chests back to the surface.',
    'MG033':'The solo player hides. A team tries to find the hidden player.',
}
SCOPE = 'Exactly five literal Survivathon categories and eleven narrowed shared-action summaries; every precise mechanic, roster, phone assessment, whole-row status and unrelated field stays unchanged.'

def read(n): return json.loads((ROOT/n).read_text())
def digest(v): return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def key(v): return ''.join(c for c in unicodedata.normalize('NFKC',v).casefold() if c.isalnum())
def module(n):
    spec=importlib.util.spec_from_file_location(n.replace('-','_'),ROOT/n)
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def validate(p,d,s,rs):
    count=0
    def require(ok,message):
        nonlocal count
        count+=1
        if not ok: raise AssertionError(message)
    candidate=read('reports/original-review-candidates.json')
    require(p['job']=='B03' and p['baselineSourceCommit']==BASELINE and p['scope']==SCOPE,'Wrong accepted source parent or adopted semantic scope')
    require(p['retainedCandidatePacketSha256']==digest(candidate)==PACKET and p['newHttpRequestsForAdoption']==0 and p['fullCopyrightBodiesPublished'] is False,'Retained actual candidate history changed, invented request or full-body publication')
    require(p['baselineDataSha256']==DATA and p['baselineSourcesSha256']==SOURCES and p['baselineReopensSha256Passes']==REOPENS,'Accepted complete baseline seals changed')
    require(len(d['minigames'])==132 and len(s['sources'])==149 and len(p['categories'])==5 and set(x['id'] for x in p['gameplay'])==set(SUMMARIES) and len(p['gameplay'])==11,'Wrong row/source or adoption cardinality')
    restored=copy.deepcopy(d);rows={x['id']:x for x in restored['minigames']}
    for repair in p['categories']: rows[repair['id']]['fieldEvidence']['category']=copy.deepcopy(repair['beforeEvidence'])
    for repair in p['gameplay']:
        rows[repair['id']]['summary']=repair['beforeSummary'];rows[repair['id']]['fieldEvidence']['gameplay']=copy.deepcopy(repair['beforeEvidence'])
    require(digest(restored)==DATA,'Any unrelated field, summary, controls, timer, confidence or whole-row value changed')
    require(len(p['baselineRowHashes'])==132,'Missing original row fingerprints')
    for row,expected in zip(restored['minigames'],p['baselineRowHashes']): require(expected=={'id':row['id'],'sha256':digest(row)},'Accepted original row fingerprint changed')
    wanted_sources={'W_LIST'}|{'W'+x[2:] for x in SUMMARIES}
    require(set(p['beforeSources'])==wanted_sources and set(p['beforeReopens'])=={'1','2'} and all(set(x)==wanted_sources for x in p['beforeReopens'].values()),'Affected source/reopen scope changed')
    old_sources=copy.deepcopy(s)
    require(s['sources'][-1]['id']=='CEL_BLOG' and sum(x['id']=='CEL_BLOG' for x in s['sources'])==1,'Duplicate or misplaced new publisher source')
    old_sources['sources']=[copy.deepcopy(p['beforeSources'].get(x['id'],x)) for x in s['sources'] if x['id']!='CEL_BLOG']
    require(digest(old_sources)==SOURCES and len(p['baselineSourceHashes'])==148,'Any old source identity, quotation or unrelated capture metadata changed')
    for source in old_sources['sources']: require(p['baselineSourceHashes'][source['id']]==digest(source),'Accepted source fingerprint changed')
    require(all(len(x)==152 and x[-1]['sourceId']=='CEL_BLOG' for x in rs),'Complete new A/B history missing or misplaced source')
    old_rs=[[copy.deepcopy(p['beforeReopens'][str(n)].get(x['sourceId'],x)) for x in record if x['sourceId']!='CEL_BLOG'] for n,record in enumerate(rs,1)]
    require([digest(x) for x in old_rs]==REOPENS,'Complete original151-record A/B history changed')
    qsc=module('quote-support-check.py')
    classes=[{'id':q['id'],'substantive':qsc.substantive(q['text'])} for source in old_sources['sources'] for q in source['quotes']]
    require(len(classes)==len(p['baselineQuoteClassifications'])==1951,'Original quotation-classifier cardinality changed')
    for actual,old in zip(classes,p['baselineQuoteClassifications']): require(actual==old,'Historical quotation classification changed')
    by={x['id']:x for x in s['sources']};cap={(x['sourceId'],x['pass']):x for x in candidate['actualCaptures']}
    author=by['CEL_BLOG'];quotes=[p['newHeadingQuotes']['CEL_BLOG']]+[x['authorQuote'] for x in candidate['gameplayCandidates']]
    require(author['url']==URL and author['publisherLineage']=='celstudios' and author['kind']=='publisher_article' and author['quotes']==quotes,'New publisher identity, independent original clips or heading changed')
    require(author['uniqueQuotedWords']==122 and by['W_LIST']['publisherLineage']=='mariowiki'!=author['publisherLineage'],'Shared canonical-page author budget or source independence changed')
    require(p['newHeadingQuotes']['CEL_BLOG']['text']=='Survivathon' and p['newHeadingQuotes']['W_LIST']['text']=='Survivathon Minigames','Literal subdivision heading changed')
    require(p['nativeAuthorWitness']==candidate['completeArticleScopes'][0]['nativeAuthorWitness'] and p['pairedCompleteArticleScopes']==candidate['completeArticleScopes'],'Complete original-author scope or real visible profile changed')
    for sid in wanted_sources:
        current,old=by[sid],p['beforeSources'][sid]
        require({k:v for k,v in current.items() if k not in ['quotes','passes','uniqueQuotedWords']}=={k:v for k,v in old.items() if k not in ['quotes','passes','uniqueQuotedWords']},'Original source identity or publication metadata changed')
        added=p['newPrimaryQuotes'].get(sid,[]) if sid!='W_LIST' else [p['newHeadingQuotes']['W_LIST']]
        require(current['quotes']==old['quotes']+added,'Historical primary quotation deleted, modified or reordered')
        for q in added: require(0<len(q['text'].split())<=25 and q['id'] not in {x['id'] for x in old['quotes']},'Unbounded or duplicate new primary quotation')
    for sid in wanted_sources|{'CEL_BLOG'}:
        current=by[sid];ids=[q['id'] for q in current['quotes']]
        require(current['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in current['quotes']})<=200,'Canonical-page quote budget differs')
        for n in [1,2]:
            pa=current['passes'][n-1];rec=next(x for x in rs[n-1] if x['sourceId']==sid)
            require(pa['recoveredQuoteIds']==rec['recoveredQuoteIds']==ids and rec['missingQuoteIds']==[] and rec['quotes']==[{k:q[k] for k in ['id','text','locator']} for q in current['quotes']],'Complete old/new registered quotes not recovered')
            if sid=='W_LIST':
                expected=copy.deepcopy(p['beforeSources'][sid]['passes'][n-1]);expected['recoveredQuoteIds']=ids
                require(pa==expected,'Old Wiki list capture/date rewritten')
                expected_rec=copy.deepcopy(p['beforeReopens'][str(n)][sid]);expected_rec.update({'recoveredQuoteIds':ids,'quotes':rec['quotes']})
                require(rec==expected_rec,'Old Wiki list reopen receipt rewritten')
            else:
                c=cap[(sid,n)]
                require(c['actualTransportPassed'] and c['curlExitCode']==0 and c['httpEffectiveTls']==['200',current['url'],'0'] and c['tlsVerificationDisabled'] is False,'Failed or insecure capture promoted')
                require(pa['bodyBytes']==rec['bodyBytes']==c['bodyBytes'] and pa['bodySha256']==rec['bodySha256']==c['bodySha256'],'Actual received source body changed')
                require(pa['observedAtUTC']==rec['requestCompletedUTC']==c['completedUTC'] and rec['requestBeganUTC']==c['startedUTC'],'Source retrieval date invented')
                require(pa['httpStatus']==200 and pa['tlsVerified'] is True and rec['curlExit']==0 and rec['httpEffectiveTls']==c['httpEffectiveTls'] and rec['rawBodyPublished'] is False,'Transport or raw-body publication scope changed')
                require(pa['textSha256']==pa['fullArticleScopeSha256']==c['textSha256'] and pa['textCharacters']==c['textCharacters'],'Complete actual native source replaced by excerpt')
        require(datetime.fromisoformat(current['passes'][1]['observedAtUTC'])>datetime.fromisoformat(current['passes'][0]['observedAtUTC']),'Second source pass preceded first closure')
    current_rows={x['id']:x for x in d['minigames']};cat_by={x['id']:x for x in candidate['categoryCandidates']}
    require(set(cat_by)=={x['id'] for x in p['categories']},'Different, duplicate or incomplete literal category adoption')
    for repair in p['categories']:
        row=current_rows[repair['id']];old=cat_by[row['id']]
        require(repair['beforeEvidence']==old['currentCategoryEvidence'] and repair['beforeEvidence']['status']=='single_source','Already-supported category recounted')
        require(row['name']==repair['name']==old['name'] and row['category']==repair['category']==old['category'],'Unsupported title/category alias or changed value')
        require(row['fieldEvidence']['category']=={'status':'corroborated','quoteIds':repair['beforeEvidence']['quoteIds']+repair['quoteIds'],'limitation':p['categoryLimitation']},'Category promotion exceeds literal reviewed scope')
        require(repair['quoteIds']==[p['newHeadingQuotes'][sid]['id'] for sid in ['W_LIST','CEL_BLOG']],'Independent literal heading citation omitted')
        require(all(key(row['name']) in set(map(key,x['categoryMembers'])) for x in candidate['completeArticleScopes']),'Incomplete literal second-publisher membership')
    cand_by={x['id']:x for x in candidate['gameplayCandidates']}
    for repair in p['gameplay']:
        row=current_rows[repair['id']];old=cand_by[row['id']]
        require(row['name']==repair['name']==old['name'] and repair['beforeSummary']==old['currentSummary'] and repair['beforeEvidence']==old['currentGameplayEvidence'] and repair['beforeEvidence']['status']=='single_source','Wrong literal name, old summary or already-supported action recounted')
        require(row['summary']==repair['summary']==SUMMARIES[row['id']] and len(re.split(r'(?<=[.!?])\s+(?=[A-Z])',row['summary']))==2,'Summary goes beyond the explicitly reviewed narrow shared actions')
        expected_ids=list(dict.fromkeys(repair['beforeEvidence']['quoteIds']+[old['authorQuote']['id']]+repair['primaryQuoteIds']))
        require(row['fieldEvidence']['gameplay']=={'status':'corroborated','quoteIds':expected_ids,'limitation':p['gameplayLimitation']},'Old citation lost or precise mechanic promoted')
        all_q={q['id']:q for q in by[old['primarySourceId']]['quotes']}
        require(repair['primaryQuoteIds'] and all(x in all_q and qsc.substantive(all_q[x]['text']) for x in repair['primaryQuoteIds']) and qsc.substantive(old['authorQuote']['text']),'Only fragments or one substantive lineage support action')
        require(repair['pairedFullParagraphHashes']==[next(x['fullParagraphSha256'] for x in scope['namedParagraphs'] if x['id']==row['id']) for scope in candidate['completeArticleScopes']],'Complete literal original-author paragraph changed')
    require(current_rows['MG016']==next(x for x in restored['minigames'] if x['id']=='MG016'),'Excluded Night Lights motion promoted')
    require(sum(e['status']=='corroborated' for r in d['minigames'] for e in r['fieldEvidence'].values())==337 and sum(r['fieldEvidence']['category']['status']=='corroborated' for r in d['minigames'])==123 and sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==50 and all(r['complete'] is False for r in d['minigames']),'False coverage, category, gameplay or whole-row gain')
    for source in s['sources']: require(source['uniqueQuotedWords']==sum(len(t.split()) for t in {q['text'] for q in source['quotes']})<=200,'Any historical canonical-page budget changed')
    count+=module('check-original-review-candidates.py').validate(candidate,restored,old_sources,old_rs)
    count+=module('check-mouse-category-recovery.py').validate(read('reports/mouse-category-recovery.json'),restored,old_sources,old_rs)[3]
    return restored,old_sources,old_rs,count

def historical_view(d,s,rs):
    if not (ROOT/'reports/original-review-recovery.json').exists(): return d,s,rs
    p=read('reports/original-review-recovery.json')
    if digest(d)==DATA and digest(s)==SOURCES and [digest(x) for x in rs]==REOPENS:
        a,b,c=read('minigames.json'),read('catalogue-sources.json'),[read('reports/source-reopens-pass'+x+'.json') for x in 'AB']
        if (ROOT/'reports/cog-gameplay-recovery.json').exists(): a,b,c=module('check-cog-gameplay-recovery.py').historical_view(a,b,c)
        validate(p,a,b,c)
        return d,s,rs
    if (ROOT/'reports/cog-gameplay-recovery.json').exists(): d,s,rs=module('check-cog-gameplay-recovery.py').historical_view(d,s,rs)
    return validate(p,d,s,rs)[:3]

def run():
    p,d,s=read('reports/original-review-recovery.json'),read('minigames.json'),read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB']
    if (ROOT/'reports/cog-gameplay-recovery.json').exists(): d,s,rs=module('check-cog-gameplay-recovery.py').historical_view(d,s,rs)
    count=validate(p,d,s,rs)[3]
    for n in range(12):
        a,b,c,e=copy.deepcopy([p,d,s,rs])
        if n==0: b['minigames'][0]['summary']='An unsupported action. An unsupported second action.'
        elif n==1: b['minigames'][1]['fieldEvidence']['gameplay']['status']='single_source'
        elif n==2: a['categories'][1]=copy.deepcopy(a['categories'][0])
        elif n==3: a['baselineQuoteClassifications'][0]['substantive']=not a['baselineQuoteClassifications'][0]['substantive']
        elif n==4: next(x for x in c['sources'] if x['id']=='CEL_BLOG')['publisherLineage']='mariowiki'
        elif n==5: next(x for x in e[1] if x['sourceId']=='CEL_BLOG')['requestBeganUTC']='2099-01-01T00:00:00+00:00'
        elif n==6: a['gameplay'][0]['pairedFullParagraphHashes'][1]='0'*64
        elif n==7: next(x for x in c['sources'] if x['id']=='W_LIST')['quotes'][0]['text']='Changed historical clip'
        elif n==8: next(x for x in e[1] if x['sourceId']=='W002')['recoveredQuoteIds'].pop()
        elif n==9: b['minigames'][15]['summary']='Players rotate a Joy-Con. They turn a crank.'
        elif n==10: a['newHttpRequestsForAdoption']=26
        elif n==11: a['fullCopyrightBodiesPublished']=True
        try: validate(a,b,c,e)
        except (AssertionError,KeyError,ValueError): pass
        else: raise AssertionError('Malformed original-review adoption or historical restoration accepted')
    return [{'name':'Sixteen narrow independent review facts restore every accepted132-row148-source1951-classification complete A+B history before inherited checks','caseCount':count,'passed':True,'seed':None},{'name':'Twelve actual malformed original review adoption and historical restoration fixtures reject','caseCount':12,'passed':True,'seed':None}]

if __name__=='__main__':print(json.dumps(run(),indent=2))
