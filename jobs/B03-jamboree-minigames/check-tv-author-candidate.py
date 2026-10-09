"""Unadopted authored-review candidates; current catalogue must stay exact."""
from pathlib import Path
from datetime import datetime
import copy,hashlib,json
ROOT=Path(__file__).resolve().parent
BASELINE='38ec4755e794a6dff5807925bdb4b48300e67d1e'
BASE_DATA='8d252221b535e361f02b1142f7ce8c39387c63548a1a65831e1f7e537e2abe7a'
BASE_SOURCES='0cf30267b6dd48832813f459c97ba7b36252f75e5b9c569d267cbaf7c4e65634'
BASE_REOPENS=['7c11b2e0437b3fb2591ce15c9adb4835edd342e939f06a1117d3678b82aa6fe9', '424fa1bba46dc908a16c87af01a8a8ac1ef83077f750928e52747faee4226012']
CAPTURE_DIGEST='95c334e582bff5645fc72d839d39929e075180850ce65baffe09024d51e87b9a'
CONFIG={'MG030': {'source': 'CC_TV', 'summary': 'One player flies a Bomber Bill at the team. The team players try to avoid being hit.', 'quotes': ['Sunset Standoff mode has one player flying Bomber Bill to the team.', 'The three other players must work together to avoid being hit;'], 'name': 'Sunset Standoff', 'fullContextSha256Passes': ['625e192a0ca847eae285ffd5ac9e8bbfdecc73e539e1b8e06f8ca002196f961a', '625e192a0ca847eae285ffd5ac9e8bbfdecc73e539e1b8e06f8ca002196f961a']}, 'MG113': {'source': 'BB_TV', 'summary': 'Players play air hockey. They aim their shots.', 'quotes': ['Shell Hockey feels like arcade air hockey you’d find in most movie theatre arcades.', 'It was tough to stop playing once I got competitive and figured out how to aim.'], 'name': 'Shell Hockey', 'fullContextSha256Passes': ['56ac032d0c16f317c53ebbf1ddfb6f2f2ef2cb9f95d37a67b19d3012679c3197', '56ac032d0c16f317c53ebbf1ddfb6f2f2ef2cb9f95d37a67b19d3012679c3197']}, 'MG115': {'source': 'BB_TV', 'summary': 'Players stack plush toys. They try to build a tall tower.', 'quotes': ['You drag and drop plush blocks, rotating and pivoting them to build the highest tower.'], 'name': 'Stuffie Stacker', 'fullContextSha256Passes': ['7433714d4473dd1d02088f145de58ae3dafaec1dcd4a6bd248d314c5756029fb', '7433714d4473dd1d02088f145de58ae3dafaec1dcd4a6bd248d314c5756029fb']}, 'MG117': {'source': 'BB_TV', 'summary': 'Players line up dominoes. They topple the chain toward a goal.', 'quotes': ['Domino Effect has you and a partner lining up pieces with the mouse to topple dominoes toward a goal.'], 'name': 'Domino Effect', 'fullContextSha256Passes': ['03e3bc7e191039e435f55235c09a35be5a510ae0cbad4855d6fad5d6fe6e7334', '03e3bc7e191039e435f55235c09a35be5a510ae0cbad4855d6fad5d6fe6e7334']}}
AUTHOR_SOURCES={'BB_TV': {'url': 'https://blog.bestbuy.ca/video-games/super-mario-party-jamboree-nintendo-switch-2-edition-jamboree-tv-review', 'author': 'Jon Scarr', 'publisherLineage': 'bestbuy', 'oldUniqueQuotedWords': 30, 'newUniqueQuotedWords': 64, 'totalKnownB03UniqueQuotedWords': 94, 'title': 'Super Mario Party Jamboree - Nintendo Switch 2 Edition + Jamboree TV review | Best Buy Blog', 'externalSameURLAudit': 'Exact URL search of available GPT drops job worktrees found only B03 uses. Any remote other-job quotation use must be reconciled before adoption.'}, 'CC_TV': {'url': 'https://www.consolecreatures.com/super-mario-party-jamboree-tv-review/', 'author': 'Bobby Pashalidis', 'publisherLineage': 'consolecreatures', 'oldUniqueQuotedWords': 0, 'newUniqueQuotedWords': 23, 'totalKnownB03UniqueQuotedWords': 23, 'title': 'Super Mario Party Jamboree - Nintendo Switch 2 Edition + Jamboree TV Review | Console Creatures', 'externalSameURLAudit': 'Exact URL search of available GPT drops job worktrees found only B03 uses. Any remote other-job quotation use must be reconciled before adoption.'}}
def read(n):return json.loads((ROOT/n).read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def validate(p,d,s,rs):
 count=0
 def require(ok,msg):
  nonlocal count
  count+=1
  if not ok:raise AssertionError(msg)
 require(p['job']=='B03' and p['status']=='UNADOPTED' and p['noProductPromotion'] is True and p['copyrightBodiesPublished'] is False,'Premature acceptance or full-body publication')
 require(p['baselineSourceCommit']==BASELINE and p['baselineDataSha256']==digest(d)==BASE_DATA,'Published data changed before adoption')
 require(p['baselineSourcesSha256']==digest(s)==BASE_SOURCES and p['baselineReopensSha256Passes']==[digest(x) for x in rs]==BASE_REOPENS,'Published source/quote/actual A+B history changed')
 require(len(d['minigames'])==132 and len(s['sources'])==147,'Accepted source or row count changed')
 require(len(p['baselineRowHashes'])==132,'Missing complete original row audit')
 for row,old in zip(d['minigames'],p['baselineRowHashes']):require(old=={'id':row['id'],'sha256':digest(row)},'Original row fingerprint changed')
 sb={x['id']:x for x in s['sources']};require(len(p['baselineSourceHashes'])==147,'Wrong historical source scope')
 for sid,source in sb.items():require(p['baselineSourceHashes'][sid]==digest(source),'Original source object changed')
 require(p['currentCoverage']==303 and p['currentOpenFields']==1017 and p['wholeRowsComplete']==0 and p['currentGameplayCorroborated']==35 and p['currentGameplaySingleSource']==97,'Candidate packet changes accepted progress')
 require(sum(r['fieldEvidence']['gameplay']['status']=='corroborated' for r in d['minigames'])==35,'Premature gameplay promotion')
 require(p['authorSources']==AUTHOR_SOURCES,'False source, author, lineage or budget')
 require([x['id'] for x in p['candidates']]==list(CONFIG) and len(p['candidates'])==4,'Wrong candidate set')
 caps=p['captures'];require(len(caps)==34 and digest(caps)==CAPTURE_DIGEST,'Actual complete request metadata changed')
 by={(x['sourceId'],x['pass']):x for x in caps};require(len(by)==34,'Duplicate or absent actual pass')
 require(p['actualRequests']==34 and p['actualSuccessful200TLSRequests']==32,'Invented request total')
 good=0
 for c in caps:
  require(c['tlsVerificationDisabled'] is False and len(c['bodySha256'])==len(c['textSha256'])==64,'Missing full-body or TLS witness')
  require(datetime.fromisoformat(c['completedUTC'])>=datetime.fromisoformat(c['startedUTC']),'Invalid actual request interval')
  if c['actualTransportPassed']:
   require(c['curlExitCode']==0 and c['httpEffectiveTls'][0]=='200' and c['httpEffectiveTls'][2]=='0' and c['bodyBytes']>0 and c['textCharacters']>0,'Unverified source response');good+=1
  else:require(c['sourceId']=='JAMES_TV' and c['curlExitCode']==56 and c['httpEffectiveTls'][0]=='000' and c['bodyBytes']==0,'Failed source smuggled in')
 require(good==32,'Success total mismatch')
 rows={r['id']:r for r in d['minigames']};wordsets={}
 for r in p['candidates']:
  ident=r['id'];expected=CONFIG[ident];row=rows[ident];sid=r['sourceId'];wid='W'+ident[2:]
  require(r['name']==row['name']==expected['name'] and r['status']=='UNADOPTED','Wrong literal identity or accepted status')
  require(r['candidateSummary']==expected['summary'] and r['authoredQuotes']==expected['quotes'] and sid==expected['source'],'Invented shared action or quotation')
  require(row['fieldEvidence']['gameplay']['status']=='single_source' and r['preservedPrimaryQuoteIds']==row['fieldEvidence']['gameplay']['quoteIds'] and r['beforeRowSha256']==digest(row),'Premature current value or evidence change')
  require(r['authoredFullContextSha256Passes']==expected['fullContextSha256Passes'],'Named full authored paragraph changed')
  require(r['wikiFullScopeSha256Passes']==[by[(wid,n)]['textSha256'] for n in [1,2]],'Complete primary scope changed')
  wordsets.setdefault(sid,set()).update(r['authoredQuotes'])
  for q in r['authoredQuotes']:require(6<=len(q.split())<=25,'Unbounded or fragment-only clip')
  for source in [sid,wid]:
   a,b=by[(source,1)],by[(source,2)]
   require(a['actualTransportPassed'] and b['actualTransportPassed'] and a['textSha256']==b['textSha256'],'Absent complete accepted A+B scopes')
   require(datetime.fromisoformat(b['startedUTC'])>datetime.fromisoformat(a['completedUTC']),'B preceded closed A')
   require(sid!='W'+ident[2:] and AUTHOR_SOURCES[sid]['publisherLineage']!='mariowiki','No independent author lineage')
 for sid,texts in wordsets.items():
  old={q['text'] for q in sb.get(sid,{}).get('quotes',[])};source=p['authorSources'][sid]
  require(source['oldUniqueQuotedWords']==sum(len(x.split()) for x in old),'Historical quotation budget changed')
  require(source['newUniqueQuotedWords']==sum(len(x.split()) for x in texts-old),'New clip budget changed')
  require(source['totalKnownB03UniqueQuotedWords']==sum(len(x.split()) for x in texts|old)<=200,'Cumulative canonical-page budget exceeded')
 require(sb['NAMU_BASE']['uniqueQuotedWords']==195 and sb['FGS_BASE']['uniqueQuotedWords']==200 and sb['FGS_TIPS']['uniqueQuotedWords']==73,'Prior authored-source budgets changed')
 return count
def run():
 p=read('reports/tv-author-candidate.json');d=read('minigames.json');s=read('catalogue-sources.json');rs=[read('reports/source-reopens-pass'+x+'.json') for x in 'AB'];count=validate(p,d,s,rs)
 mutations=[
  lambda p,d,s,rs:p.__setitem__('status','ADOPTED'),
  lambda p,d,s,rs:d['minigames'][29]['fieldEvidence']['gameplay'].__setitem__('status','corroborated'),
  lambda p,d,s,rs:p['candidates'][0].__setitem__('candidateSummary','Players move. The timer is exactly30seconds.'),
  lambda p,d,s,rs:p['candidates'][0]['authoredQuotes'].__setitem__(0,'Nintendo game instructions copied here.'),
  lambda p,d,s,rs:p['authorSources']['CC_TV'].__setitem__('publisherLineage','mariowiki'),
  lambda p,d,s,rs:p['captures'][0].__setitem__('bodySha256','0'*64),
  lambda p,d,s,rs:p['candidates'][1]['authoredFullContextSha256Passes'].__setitem__(1,'0'*64),
  lambda p,d,s,rs:p['authorSources']['BB_TV'].__setitem__('totalKnownB03UniqueQuotedWords',0)
 ]
 for mutation in mutations:
  args=copy.deepcopy([p,d,s,rs]);mutation(*args)
  try:validate(*args)
  except (AssertionError,KeyError,ValueError):pass
  else:raise AssertionError('Malformed candidate was accepted')
 return [{'name':'Four original-review candidate scopes preserve the entire accepted catalogue','caseCount':count,'passed':True,'seed':None,'detail':'Actual complete34-request packet,32successful/2failed; four UNADOPTED actions and exact132-row/147-source/A+B baseline.'},{'name':'Malformed original-review candidate source, scope, history and premature-promotion rejection','caseCount':len(mutations),'passed':True,'seed':None,'detail':'Eight actual rejected fixtures; no current fact promotion.'}]
if __name__=='__main__':print(json.dumps(run(),indent=2))

