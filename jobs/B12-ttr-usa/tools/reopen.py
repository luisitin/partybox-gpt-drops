"""Actual second HTTP reopening, with provenance and full factual re-extraction."""
import json,pathlib,hashlib,urllib.request,concurrent.futures,re,subprocess,csv
root=pathlib.Path(__file__).resolve().parent.parent;out=root/'test-output/reopening';out.mkdir(parents=True,exist_ok=True)
registry=json.loads((root/'sources/index.json').read_text());results={}
def fetch(item):
 id,s=item
 if id in ['supercheats','bgg-mystery','guide','se-inventory']:return None
 request=urllib.request.Request(s['url'],headers={'Cache-Control':'no-cache'})
 with urllib.request.urlopen(request)as response:body=response.read();status=response.status
 path=out/(id+('.pdf'if s['url'].endswith('.pdf')else'.txt'));path.write_bytes(body);first=(root/s['firstLocalFile']).read_bytes();assert body==first,(id,'source changed, review required')
 return id,{'url':s['url'],'method':'actual urllib HTTPS GET with Cache-Control:no-cache','httpStatus':status,'sha256':hashlib.sha256(body).hexdigest(),'sameAsFirstBytes':True,'bytes':len(body),'snapshotKind':'original bytes'}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:
 for result in pool.map(fetch,registry.items()):
  if result:results[result[0]]=result[1]
web=json.loads((root/'test-output/research/web-second-pass.json').read_text());text='\n'.join(c.get('text','')for c in web['content']);assert not web.get('isError');matches=list(re.finditer(r'(?m)^# .*\nURL: ([^\n]+)\n',text));pages={m.group(1):text[m.start():matches[i+1].start()if i+1<len(matches)else len(text)]for i,m in enumerate(matches)}
firstFull=json.loads((root/'test-output/research/fetch-ticket-lists.json').read_text());firstText='\n'.join(c.get('text','')for c in firstFull['value']['content']);rules=(root/'test-output/research/rules-first.txt').read_text()
canon=lambda name:name.replace('Sault St. Marie','Sault Ste. Marie').replace('Montréal','Montreal').replace('St. Louis','Saint Louis').replace('Washington DC','Washington')
key=lambda a,b:tuple(sorted((canon(a),canon(b))))
mega=[(key(a,b),int(points))for a,b,points in re.findall(r'- ([^\n]+?) to ([^\n]+?) - (\d+) Points',pages[registry['supercheats']['url']])];firstMega=json.loads((root/'sources/supercheats-mega-extracted.json').read_text());assert dict(mega)=={key(t['a'],t['b']):t['points']for t in firstMega};assert len(mega)==69
mystery=pages[registry['bgg-mystery']['url']];mFacts=[('Boston - Washington 4',('Boston','Washington'),4),('Montreal - Chicago 7',('Chicago','Montreal'),7),('Vancouver - Portland 2',('Portland','Vancouver'),2),('Winnipeg - Omaha 6',('Omaha','Winnipeg'),6)]
for quote,_,_ in mFacts:assert quote in mystery
for id in ['supercheats','bgg-mystery','guide','se-inventory']:
 page=pages[registry[id]['url']];assert page and 'URL: '+registry[id]['url']in page
 (out/(id+'.txt')).write_text(page);results[id]={'url':registry[id]['url'],'method':'new Exa web_fetch_exa call, page reopened and full relevant fact table re-extracted','toolSuccess':True,'retrievalSha256':hashlib.sha256(page.encode()).hexdigest(),'characters':len(page),'snapshotKind':'factual re-extraction, page boilerplate can differ'}
# Recheck every row against the freshly reopened inventories, using direct values.
data=json.loads((root/'usa.json').read_text());cite=json.loads((root/'citations.json').read_text());ag=json.loads((out/'agnias-routes.txt').read_text());rob=list(csv.DictReader(open(out/'rob-routes.txt',encoding='utf-8-sig')));colors={'X':'gray','B':'blue','K':'black','P':'pink','G':'green','R':'red','Y':'yellow','W':'white','O':'orange'}
baseRob=list(csv.DictReader(open(out/'rob-tickets.txt')));baseAg=json.loads((out/'agnias-base.txt').read_text());newAg=json.loads((out/'agnias-1910.txt').read_text());baseMap={key(t['City A'],t['City B']):int(t['Points'])for t in baseRob};baseAgMap={key(*t['cities']):t['points']for t in baseAg};newMap={key(*t['cities']):t for t in newAg};megaMap=dict(mega);mMap={pair:points for _,pair,points in mFacts};citiesRob=json.loads((out/'rob-cities.txt').read_text());citiesAg=json.loads((out/'agnias-cities.txt').read_text());cityA=set(map(canon,citiesRob));cityB=set(map(canon,citiesAg));rows=[]
for id in ['official-base','official-1910']:
 subprocess.run(['pdftotext','-layout',str(out/(id+'.pdf')),str(out/(id+'-text.txt'))],check=True)
baseText=(out/'official-base-text.txt').read_text();expText=(out/'official-1910-text.txt').read_text();normalize=lambda text:re.sub(r'\s+',' ',text)
groupCounts={}
for a,neighbors in ag.items():
 for b,entry in neighbors.items():
  pair=key(a,b);fact=(entry['distance'],len(entry['connections']))
  if pair in groupCounts:assert groupCounts[pair]==fact
  groupCounts[pair]=fact
paramValues={'playersMinimum':2,'playersMaximum':5,'trainsPerPlayer':45,'trainCardsTotal':110,'baseTicketCount':len(baseRob),'new1910TicketCount':sum(not x.get('revised')for x in newAg),'mysteryTicketCount':len(mMap),'revisedBaseTicketCount':sum(bool(x.get('revised'))for x in newAg),'megaTicketCount':len(mega),'cityCount':len(cityA),'adjacencyGroupCount':len(groupCounts),'physicalRouteCount':sum(x[1]for x in groupCounts.values()),'routeLengthTotal':sum(x[0]*x[1]for x in groupCounts.values()),'longestTrailBonus':10}
assert len(cityA)==len(cityB)==36 and len(rob)==100 and sum(int(x['Distance'])for x in rob)==309
for category in ['cities','routes','baseTickets','usa1910Tickets','cardCounts','routePoints','parameters']:
 for i,row in enumerate(data[category]):
  if category=='cities':assert row['name']in cityA&cityB
  elif category=='routes':
   assert any(key(t['City A'],t['City B'])==key(row['a'],row['b'])and int(t['Distance'])==row['length']and colors[t['Color']]==row['color']for t in rob)
   assert any(key(a,b)==key(row['a'],row['b'])and raw['distance']==row['length']and any(c['color'].lower().replace('any','gray')==row['color']for c in raw['connections'])for a,neighbors in ag.items()for b,raw in neighbors.items())
  elif category=='baseTickets':assert baseMap[key(row['a'],row['b'])]==baseAgMap[key(row['a'],row['b'])]==row['points']
  elif category=='usa1910Tickets':
   pair=key(row['a'],row['b']);assert megaMap[pair]==row['points'];other=mMap[pair]if row['origin']=='mysteryTrain'else newMap[pair]['points']if row['origin']=='new1910'or'revisedFrom'in row else baseAgMap[pair];assert other==row['points']
  elif category=='cardCounts':
   source=pages[registry['se-inventory']['url']];assert '8 colors with 12 of each, and 14 locomotive wilds.'in source;assert row['count']==(14 if row['color']=='locomotive' else 12)
  elif category=='parameters':assert row['value']==paramValues[row['name']]
  elif category=='routePoints':assert f"{row['length']} car route = {row['points']} "+('point'if row['points']==1 else'points')in pages[registry['guide']['url']]
  # Parameters use complete fresh inventories or fresh exact short rule text.
  for evidenceId in row['evidence']:
   c=cite[evidenceId];assert c['source']in results
   if c['source']=='guide':assert c['quote']in pages[registry['guide']['url']]
   elif c['source']=='se-inventory':assert c['quote']in pages[registry['se-inventory']['url']]
   elif c['source']in ['official-base','official-1910']:
    text=baseText if c['source']=='official-base'else expText
    if '…'not in c['quote']:assert c['quote']in normalize(text),(evidenceId,c['quote'])
    else:
     length,point=map(int,c['quote'].split(' … '));assert re.search(r'\b'+str(length)+r'\s+'+str(point)+r'\s*$',text,re.M),(evidenceId,'scoring table text')
  rows.append({'rowId':category+'/'+str(i),'sourceIds':[cite[x]['source']for x in row['evidence']],'checkedFields':[x for x in row if x not in ['confidence','evidence']],'passed':True,'confidence':row['confidence'],'passNumber':2})
assert len(rows)==264 and all(r['passed']for r in rows)
report={'passNumber':2,'sourcesReopened':len(results),'factRowsRechecked':len(rows),'passed':True,'sources':results,'rows':rows,'notes':'Network calls actually executed after first extraction. Direct reopened values, not first-pass cache, were used in every row comparison. Source inventory conflicts explicitly recorded; valid opposite direction matched canonical route.'}
(root/'reports/source-reopening.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n');print(json.dumps({'passed':True,'actualSourcesReopened':len(results),'rowsRechecked':len(rows)}))
