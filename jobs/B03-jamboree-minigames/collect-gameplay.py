#!/usr/bin/env python3
"""Single-family research leads only, never a completed per-game catalogue."""
import concurrent.futures
import argparse
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess

BASE = None  # Set only from the required --output argument.
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class Node:
    def __init__(self, tag, attrs=None):
        self.tag=tag; self.attrs=dict(attrs or []); self.children=[]

class DOM(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.root=Node('root'); self.stack=[self.root]
    def handle_starttag(self, tag, attrs):
        n=Node(tag, attrs); self.stack[-1].children.append(n)
        if tag not in VOID: self.stack.append(n)
    def handle_startendtag(self, tag, attrs): self.stack[-1].children.append(Node(tag,attrs))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag: del self.stack[i:]; break
    def handle_data(self, data): self.stack[-1].children.append(data)

def nodes(n):
    yield n
    for c in n.children:
        if isinstance(c,Node): yield from nodes(c)

def text(n, nested_lists=True):
    if isinstance(n,str): return n
    if n.tag in {'script','style','sup'}: return ''
    if 'mw-editsection' in n.attrs.get('class','').split(): return ''
    if not nested_lists and n.tag in {'ul','ol'}: return ''
    return ''.join(text(c,nested_lists) for c in n.children)

def clean(s): return ' '.join(s.split())

def parse(html, row):
    dom=DOM();dom.feed(html)
    content=next((n for n in nodes(dom.root) if 'mw-parser-output' in n.attrs.get('class','').split()),None)
    if content is None: return {'articleFound':False,'blocks':[],'fieldLeads':{},'scopeWarnings':['No article parser output found.']}
    outline=[]; current=[]; blocks=[]
    def walk(n):
        nonlocal current
        if isinstance(n,str):return
        classes=n.attrs.get('class','').split()
        if n.tag in {'script','style'} or n.attrs.get('id')=='toc' or any(c in classes for c in ['navbox','infobox','mw-editsection','gallery']):return
        if re.fullmatch('h[2-6]',n.tag):
            level=int(n.tag[1]); name=clean(text(n)); anchor=next((k.attrs.get('id') for k in nodes(n) if k.attrs.get('id')),n.attrs.get('id'))
            current=[x for x in current if x['level']<level]+[{'level':level,'heading':name,'anchor':anchor}]
            outline.append(current[:]);return
        if n.tag in {'p','li'}:
            s=clean(text(n,nested_lists=False))
            if s:
                images=[{'alt':i.attrs.get('alt',''),'title':i.attrs.get('title',''),'src':i.attrs.get('src','')} for i in nodes(n) if i.tag=='img']
                blocks.append({'tag':n.tag,'sectionPath':[h['heading'] for h in current],'locator':'#'+(current[-1]['anchor'] or '') if current else 'article introduction','text':s,'imageLabels':images})
            for c in n.children:
                if isinstance(c,Node) and c.tag in {'ul','ol'}:walk(c)
            return
        for c in n.children:walk(c)
    for child in content.children:walk(child)
    scope=[]
    intro=' '.join(b['text'] for b in blocks if not b['sectionPath'])
    other_games=re.findall(r'(?<!Super )Mario Party(?: Superstars| [1-9]| DS|: Island Tour|: The Top 100| Star Rush)',intro)
    multi=bool(other_games) or any(h['heading']=='Mario Party' or re.match(r'^Mario Party(?: [1-9]|:| DS| Superstars)',h['heading']) for path in outline for h in path)
    if multi:scope.append('Multiple-game article: only explicitly Jamboree-scoped sections are used; shared unscoped sections remain excluded.')
    def applicable(b):
        path=b['sectionPath']; combined=' / '.join(path)
        if any(t in combined.lower() for t in ['names in other languages','references','gallery','trivia','external links']):return False
        if multi and path and 'jamboree' not in combined.lower():return False
        return bool(path)
    usable=[b for b in blocks if applicable(b)]
    leads={k:[] for k in ['gameplay','controls','winRules','scoreRules','timeLimit','tieRules','coinReward','starReward']}
    def add(field,b,q):
        if not q or len(q.split())>25:return
        item={'quote':q,'quoteWords':len(q.split()),'locator':b['locator'],'sectionPath':b['sectionPath'],'sourceImageLabels':b['imageLabels'],'sourceStatus':'UNVERIFIED: single MarioWiki family; lexical research lead, requires human review and independent corroboration'}
        if item not in leads[field]:leads[field].append(item)
    for b in usable:
        path=' / '.join(b['sectionPath']).lower();s=b['text']
        if 'controls' in path:
            if len(s.split())<=25:add('controls',b,s)
            continue
        if not any(x in path for x in ['gameplay','overview','in-game text','rules','objectives','super mario party jamboree']):continue
        sentences=[x.strip() for x in re.split(r'(?<=[.!?])\s+(?=["“]?[A-Z])',s) if x.strip()]
        for q in sentences:
            if len(q.split())>25:continue
            low=q.lower()
            if any(x in path for x in ['gameplay','overview','in-game text']):add('gameplay',b,q)
            if re.search(r'\b(win|wins|winner|winners|winning|finish first|finishes first|finishes the|crosses the finish|survives|survive|eliminated|loses|lose)\b',low):add('winRules',b,q)
            if re.search(r'\b(score|scores|scored|scoring|points|point|highest score|lowest score)\b',low):add('scoreRules',b,q)
            if re.search(r'\b(tie|ties|tied|draw|same score)\b',low):add('tieRules',b,q)
            has_duration=bool(re.search(r'\b(?:\d+|one|two|three|four|five|ten|thirty|sixty)[- ](?:seconds?|minutes?)\b',low))
            explicit_timer=re.search(r'time limit|timer|lasts for|ends after|given|have .{0,20}seconds|has .{0,20}seconds|within .{0,25}(?:seconds|minutes).{0,35}(?:ends|tie)|after .{0,20}(?:seconds|minutes).{0,20}wins',low)
            if has_duration and explicit_timer and not re.search(r'achievement|record',low):add('timeLimit',b,q)
            if re.search(r'\b(awarded|reward|rewards|receive|receives|earned|earn|earns|gets|get|granted)\b',low):
                if re.search(r'\bcoins?\b',low):add('coinReward',b,q)
                if re.search(r'\bstars?\b',low):add('starReward',b,q)
    for field in leads:leads[field]=leads[field][:12]
    if row['edition']=='jamboree_tv':scope.append('TV article: preserve mouse, camera, microphone and Battle/Co-op wording as written; no hardware or alternate mode was independently observed.')
    if row['name'] in {"Mario's Three-peat", "Peach's Day Off"}:scope.append('Composite minigame: individual duration quotations refer to component challenges; no total elapsed duration is inferred.')
    return {'articleFound':True,'outline':outline,'articleIntro':intro,'blocks':blocks,'fieldLeads':leads,'scopeWarnings':scope,'multiGameArticle':multi}

def fetch(row, pass_number):
    folder=BASE/('pass'+str(pass_number));folder.mkdir(exist_ok=True)
    stem=folder/f"{row['ordinal']:03d}"
    command=['curl','--silent','--show-error','--location','--connect-timeout','10','--max-time','40','--dump-header',str(stem)+'.headers','--output',str(stem)+'.html','--write-out','%{http_code}\n%{url_effective}\n%{ssl_verify_result}\n',row['wikiArticleUrl']]
    started=datetime.datetime.now(datetime.timezone.utc).isoformat();r=subprocess.run(command,capture_output=True,text=True)
    file=Path(str(stem)+'.html');body=file.read_bytes() if file.exists() else b''
    info={'ordinal':row['ordinal'],'name':row['name'],'edition':row['edition'],'sourceFamily':'MarioWiki','url':row['wikiArticleUrl'],'retrievedAt':started,'curlExit':r.returncode,'curlOutput':r.stdout,'error':r.stderr,'bodyBytes':len(body),'bodySha256':hashlib.sha256(body).hexdigest(),'tlsVerificationEnabled':True}
    extraction=parse(body.decode('utf-8','replace'),row) if r.returncode==0 and r.stdout.startswith('200\n') else {'articleFound':False,'blocks':[],'fieldLeads':{},'scopeWarnings':['Source unavailable; no claims extracted.']}
    info.update(extraction)
    Path(str(stem)+'.json').write_text(json.dumps(info,indent=2,ensure_ascii=False)+'\n')
    return info

def compact_evidence(rows, results):
    """One quotation dictionary per source; total quotation words at most 90."""
    fields=['controls','winRules','scoreRules','timeLimit','tieRules','coinReward','starReward','gameplay']
    entries=[]
    for row,a,b in zip(rows,results[1],results[2]):
        chosen=[]; references={k:[] for k in fields};words=0
        for position in range(12):
            for field in fields:
                candidates=a['fieldLeads'].get(field,[])
                if position>=len(candidates):continue
                lead=candidates[position]
                existing=next((q for q in chosen if q['quote']==lead['quote'] and q['locator']==lead['locator']),None)
                if existing is None:
                    if words+lead['quoteWords']>90:continue
                    existing={'id':'q'+str(len(chosen)+1),**{k:lead[k] for k in ['quote','quoteWords','locator','sectionPath','sourceImageLabels']}}
                    chosen.append(existing);words+=lead['quoteWords']
                if existing['id'] not in references[field]:references[field].append(existing['id'])
        entries.append({'ordinal':row['ordinal'],'name':row['name'],'edition':row['edition'],'url':row['wikiArticleUrl'],'sourceFamily':'MarioWiki','status':'UNVERIFIED: single source family; scoped lexical leads, not completed mechanics fields','confidence':'low','quotes':chosen,'uniqueQuoteWords':words,'fieldQuoteReferences':references,'missingLeadFields':[f for f in fields if not references[f]],'scopeWarnings':a['scopeWarnings'],'pass1':{k:a[k] for k in ['retrievedAt','curlExit','curlOutput','bodySha256','bodyBytes','tlsVerificationEnabled']},'pass2':{k:b[k] for k in ['retrievedAt','curlExit','curlOutput','bodySha256','bodyBytes','tlsVerificationEnabled']},'secondPassLeadsIdentical':a['fieldLeads']==b['fieldLeads'],'finalVerified':False})
    coverage={f:{'rowsWithLeads':sum(bool(r['fieldQuoteReferences'][f]) for r in entries),'tvRowsWithLeads':sum(bool(r['fieldQuoteReferences'][f]) for r in entries if r['edition']=='jamboree_tv'),'quoteReferences':sum(len(r['fieldQuoteReferences'][f]) for r in entries)} for f in fields}
    data={'job':'B03','scope':'UNVERIFIED single-family gameplay research leads only','complete':False,'independentlyVerifiedRows':0,'entries':entries,'coverage':coverage,'limitations':['Statements were retrieved from the 132 article URLs; no second independent publisher supports these mechanics yet.','Missing values remain absent; quotes are not exhaustive gameplay specifications.','Controls image labels retain actual alt attributes separately; quotations exclude image substitution.','Timer mentions may refer to a stage or round and need human scope review.','All old-game unscoped sections on multi-game articles were excluded.','No final minigames.json, minigames.csv, synthesized summary or phoneFit rating is supplied.','A two-pass quote comparison is not two independent sources.']}
    (BASE/'gameplay-leads.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    return data

def validate_saved_capture(row, capture, body):
    for field in ['ordinal','name','edition']:
        if capture.get(field)!=row[field]:raise ValueError('Saved capture index mismatch: '+field)
    if capture.get('url')!=row['wikiArticleUrl']:raise ValueError('Saved capture URL differs from index.')
    lines=capture.get('curlOutput','').splitlines()
    if lines!=['200',row['wikiArticleUrl'],'0']:raise ValueError('Saved capture lacks exact HTTPS URL / successful TLS provenance.')
    if not row['wikiArticleUrl'].startswith('https://') or capture.get('curlExit')!=0 or capture.get('tlsVerificationEnabled') is not True:
        raise ValueError('Saved capture lacks successful verified HTTPS retrieval.')
    digest=capture.get('bodySha256','')
    if not re.fullmatch('[0-9a-f]{64}',digest) or digest!=hashlib.sha256(body).hexdigest():raise ValueError('Saved capture raw-byte SHA-256 mismatch.')
    if type(capture.get('bodyBytes')) is not int or capture['bodyBytes']<=0 or capture['bodyBytes']!=len(body):raise ValueError('Saved capture byte count mismatch.')
    instant=datetime.datetime.fromisoformat(capture['retrievedAt'])
    if instant.tzinfo is None:raise ValueError('Saved capture timestamp has no timezone.')
    return instant

def prepare_output(output, reparse):
    output=output.resolve()
    # Managed workspace roots can carry platform Git metadata without being a
    # selected repository checkout. Protect the nested actual repositories.
    if any((ancestor/'.git').exists() for ancestor in [output,*output.parents] if ancestor not in {Path('/workspace'),Path('/tmp')}):
        raise ValueError('--output must be outside all Git checkouts; raw source pages are retained locally only.')
    if reparse:
        if not output.is_dir():raise ValueError('--reparse requires an existing snapshot directory.')
    else:
        if output.exists():raise ValueError('Fresh retrieval requires a new --output directory; existing snapshots will not be overwritten.')
    return output

def main():
    global BASE
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,required=True,help='New outside-checkout directory for fresh captures; an existing directory is allowed only with --reparse.')
    parser.add_argument('--index',type=Path,default=Path(__file__).resolve().with_name('catalogue-index.json'),help='Preliminary catalogue index; defaults to adjacent catalogue-index.json.')
    parser.add_argument('--reparse',action='store_true',help='Re-extract already saved two-pass bodies without new requests.')
    args=parser.parse_args()
    try:BASE=prepare_output(args.output,args.reparse)
    except ValueError as error:parser.error(str(error))
    index=json.loads(args.index.read_text());rows=index['entries'] if isinstance(index,dict) else index
    if args.reparse:
        # Validate every source before any reparse output is written.
        for row in rows:
            instants=[]
            for number in [1,2]:
                stem=BASE/('pass'+str(number))/f"{row['ordinal']:03d}"
                capture=json.loads(Path(str(stem)+'.json').read_text())
                instants.append(validate_saved_capture(row,capture,Path(str(stem)+'.html').read_bytes()))
            if instants[1]<=instants[0]:raise ValueError('Saved second pass is not later than first pass: '+row['name'])
    else:BASE.mkdir(parents=True,exist_ok=False)
    results={}
    for number in [1,2]:
        if args.reparse:
            captures=[]
            for row in rows:
                stem=BASE/('pass'+str(number))/f"{row['ordinal']:03d}"
                capture=json.loads(Path(str(stem)+'.json').read_text())
                if capture['curlExit']==0 and capture['curlOutput'].startswith('200\n'):
                    capture.update(parse(Path(str(stem)+'.html').read_text(),row))
                Path(str(stem)+'.json').write_text(json.dumps(capture,indent=2,ensure_ascii=False)+'\n')
                captures.append(capture)
        else:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
                captures=list(pool.map(lambda r:fetch(r,number),rows))
        results[number]=captures
        (BASE/('pass'+str(number)+'-results.json')).write_text(json.dumps(captures,indent=2,ensure_ascii=False)+'\n')
        print(json.dumps({'pass':number,'sources':len(captures),'freshRequests':0 if args.reparse else len(captures),'http200Captured':sum(c['curlOutput'].startswith('200\n') for c in captures),'articleFound':sum(c['articleFound'] for c in captures)},ensure_ascii=False),flush=True)
    audit=[]
    for a,b in zip(results[1],results[2]):
        audit.append({'ordinal':a['ordinal'],'name':a['name'],'edition':a['edition'],'url':a['url'],'pass1':{'httpStatus':a['curlOutput'].splitlines()[0],'bodySha256':a['bodySha256'],'retrievedAt':a['retrievedAt']},'pass2':{'httpStatus':b['curlOutput'].splitlines()[0],'bodySha256':b['bodySha256'],'retrievedAt':b['retrievedAt']},'extractedLeadsIdentical':a['fieldLeads']==b['fieldLeads'],'fieldCoverage':{k:len(v) for k,v in a['fieldLeads'].items()},'missingFields':[k for k in ['gameplay','controls','winRules','scoreRules','timeLimit','tieRules','coinReward','starReward'] if not a['fieldLeads'].get(k)],'scopeWarnings':a['scopeWarnings'],'independentSourceCount':1 if a['articleFound'] else 0,'finalVerified':False})
    (BASE/'second-pass-audit.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n')
    summary={'job':'B03','status':'UNVERIFIED single-family research leads','requestedSources':len(rows),'distinctUrls':len({r['wikiArticleUrl'] for r in rows}),'twoSourceRequirementMet':False,'passes':2,'sourceCounts':{'pass1Http200':sum(c['curlOutput'].startswith('200\n') for c in results[1]),'pass2Http200':sum(c['curlOutput'].startswith('200\n') for c in results[2])},'identicalLeadExtractions':sum(a['extractedLeadsIdentical'] for a in audit),'coverage':{f:{'rowsWithLeads':sum(bool(c['fieldLeads'].get(f)) for c in results[1]),'quoteCount':sum(len(c['fieldLeads'].get(f,[])) for c in results[1]),'tvRowsWithLeads':sum(bool(c['fieldLeads'].get(f)) for c in results[1] if c['edition']=='jamboree_tv')} for f in ['gameplay','controls','winRules','scoreRules','timeLimit','tieRules','coinReward','starReward']},'limitations':['All extracted statements are single-family lexical research leads; no source independently corroborated these mechanics.','Missing values remain absent; standard minigame coin/star awards are never inferred.','Multi-game unscoped sections excluded.','No synthesized two-sentence summaries or phoneFit ratings.','Image control labels are retained separately from actual text quotations.','Timer keyword classification requires review; achievement durations and record thresholds are excluded.']}
    (BASE/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    compact=compact_evidence(rows,results)
    summary['compactCoverage']=compact['coverage'];summary['uniqueQuoteWordLimitPerSource']=90;summary['compactQuoteCount']=sum(len(r['quotes']) for r in compact['entries'])
    (BASE/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    (BASE/'SHA256SUMS.txt').write_text(''.join(hashlib.sha256(f.read_bytes()).hexdigest()+'  '+str(f.relative_to(BASE))+'\n' for f in sorted(BASE.rglob('*')) if f.is_file() and f.name!='SHA256SUMS.txt'))
    print(json.dumps(summary,indent=2),flush=True)

if __name__=='__main__':main()
