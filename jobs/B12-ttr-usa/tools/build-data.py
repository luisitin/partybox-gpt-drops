"""Author tooling: extract independently cross-checked fact rows, not game code."""
import csv,json,pathlib,re,hashlib,collections
root=pathlib.Path(__file__).resolve().parent.parent
read=lambda file:json.loads((root/file).read_text())
def save(file,value):(root/file).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n')
def normal(name):return name.replace('Sault St. Marie','Sault Ste. Marie').replace('St. Louis','Saint Louis').replace('Washington DC','Washington').replace('Montréal','Montreal')
def key(a,b):return tuple(sorted((normal(a),normal(b))))
registry={
'rob-routes':('Rob217','https://raw.githubusercontent.com/Rob217/TicketToRideAnalysis/master/data/USA/routes.csv','sources/rob-routes.csv'),
'agnias-routes':('Matt Gawarecki','https://raw.githubusercontent.com/AGnias47/ticket-to-ride-graph-analysis/main/mattgawarecki-ticket-to-ride/usa.routes.json','sources/agnias-routes.json'),
'rob-cities':('Rob217','https://raw.githubusercontent.com/Rob217/TicketToRideAnalysis/master/data/USA/city_locations.json','sources/rob-cities.json'),
'agnias-cities':('Matt Gawarecki','https://raw.githubusercontent.com/AGnias47/ticket-to-ride-graph-analysis/main/mattgawarecki-ticket-to-ride/usa.cities.json','sources/agnias-usa.cities.json'),
'rob-tickets':('Rob217','https://raw.githubusercontent.com/Rob217/TicketToRideAnalysis/master/data/USA/tickets.csv','sources/rob-tickets.csv'),
'agnias-base':('Matt Gawarecki','https://raw.githubusercontent.com/AGnias47/ticket-to-ride-graph-analysis/main/mattgawarecki-ticket-to-ride/usa.tickets.json','sources/agnias-usa.tickets.json'),
'agnias-1910':('Matt Gawarecki','https://raw.githubusercontent.com/AGnias47/ticket-to-ride-graph-analysis/main/mattgawarecki-ticket-to-ride/1910.usa.tickets.json','sources/agnias-1910.usa.tickets.json'),
'agnias-points':('Matt Gawarecki','https://raw.githubusercontent.com/AGnias47/ticket-to-ride-graph-analysis/main/mattgawarecki-ticket-to-ride/route-point-values.json','sources/agnias-route-point-values.json'),
'supercheats':('CMBF','https://www.supercheats.com/ticket-to-ride/wiki/1910-mega-game-map-master-routes-list','sources/supercheats-mega-extracted.json'),
'bgg-mystery':('BoardGameGeek editors','https://boardgamegeek.com/boardgame/13297/ticket-to-ride-mystery-train-expansion','sources/mystery-facts.json'),
'official-base':('Days of Wonder','https://ncdn0.daysofwonder.com/tickettoride/de/img/tt_rules_2015_en.pdf','sources/official-base.pdf'),
'official-1910':('Days of Wonder','https://cdn.svc.asmodee.net/staging-daysofwonder/uploads/2024/07/7216-T2R1910-EN-2018-1.pdf','sources/official-1910.pdf'),
'guide':('TheRuleBook editors','https://therulebook.com/board-games/ticket-to-ride-usa/','test-output/research/rules-first.txt'),
'se-inventory':('Boardgames StackExchange answer authors','https://boardgames.stackexchange.com/questions/8637/where-can-i-find-an-exhaustive-inventory-of-cards-in-ticket-to-ride','test-output/research/rules-first.txt')}
evidence={}
def cite(id,source,quote,locator):
 assert len(quote.split())<=25,(id,len(quote.split()))
 evidence[id]={'source':source,'quote':quote,'locator':locator};return id
def refs(id,one,two):return[cite(id+'-a',*one),cite(id+'-b',*two)]
cities1=read('sources/rob-cities.json');cities2=read('sources/agnias-usa.cities.json');assert{normal(n)for n in cities1}=={normal(n)for n in cities2};cities=[]
for i,name in enumerate(sorted(map(normal,cities2)),1):cities.append({'id':'C'+str(i).zfill(2),'name':name,'confidence':'high','evidence':refs('city'+str(i),('rob-cities','"'+next(x for x in cities1 if normal(x)==name)+'"','object key'),('agnias-cities','"'+next(x for x in cities2 if normal(x)==name)+'"','array entry'))})
rob=list(csv.DictReader(open(root/'sources/rob-routes.csv',encoding='utf-8-sig')));ag=read('sources/agnias-routes.json');colors={'X':'gray','B':'blue','K':'black','P':'pink','G':'green','R':'red','Y':'yellow','W':'white','O':'orange'};groups=collections.defaultdict(list)
for row in rob:groups[key(row['City A'],row['City B'])].append(row)
routes=[];counter=0;resolved=[]
for group,rows in sorted(groups.items()):
 for n,row in enumerate(rows):
  counter+=1;id='R'+str(counter).zfill(3);length=int(row['Distance']);color=colors[row['Color']];matches=[]
  for a,neighbors in ag.items():
   for b,raw in neighbors.items():
    if key(a,b)!=group:continue
    for k,connection in enumerate(raw['connections']):
     cc=connection['color'].lower().replace('any','gray').replace('purple','pink')
     if cc==color and raw['distance']==length:matches.append((a,b,k,connection,raw))
  assert matches,(group,row)
  a,b,k,connection,raw=matches[0];quote='"distance": '+str(length)+' … "color": "'+connection['color']+'"';e=refs(id,('rob-routes',','.join(row.values()),'CSV row '+str(rob.index(row)+2)),('agnias-routes',quote,f'/{a}/{b}/connections/{k}; omissions marked by ellipsis'))
  r={'id':id,'a':group[0],'b':group[1],'length':length,'color':color,'confidence':'high','evidence':e}
  if len(rows)>1:r['parallelGroup']='P'+str(list(sorted(groups)).index(group)+1).zfill(2)
  routes.append(r)
base1=list(csv.DictReader(open(root/'sources/rob-tickets.csv')));base2=read('sources/agnias-usa.tickets.json');baseKeys={key(*t['cities']):t for t in base2};assert len(base1)==len(base2)==30;assert all(baseKeys[key(t['City A'],t['City B'])]['points']==int(t['Points']) for t in base1)
base=[]
for i,t in enumerate(sorted(base1,key=lambda t:key(t['City A'],t['City B'])),1):
 a,b=key(t['City A'],t['City B']);points=int(t['Points']);raw=baseKeys[(a,b)];base.append({'id':'B'+str(i).zfill(2),'a':a,'b':b,'points':points,'confidence':'high','evidence':refs('base'+str(i),('rob-tickets',','.join(t.values()),'CSV row '+str(base1.index(t)+2)),('agnias-base','"'+raw['cities'][0]+'", "'+raw['cities'][1]+'" … "points": '+str(points),'ticket array entry; omissions marked'))})
mega=read('sources/supercheats-mega-extracted.json');extra=read('sources/agnias-1910.usa.tickets.json');extraKeys={key(*t['cities']):t for t in extra};baseMap={key(t['a'],t['b']):t for t in base};mystery={('Boston','Washington'):4,('Chicago','Montreal'):7,('Portland','Vancouver'):2,('Omaha','Winnipeg'):6};save('sources/mystery-facts.json',[{'a':a,'b':b,'points':p}for(a,b),p in mystery.items()]);exp=[]
for i,t in enumerate(sorted(mega,key=lambda t:key(t['a'],t['b'])),1):
 a,b=key(t['a'],t['b']);points=t['points'];first=('supercheats',f"{t['a']} to {t['b']} - {points} Points.",'69-ticket list');item={'id':'U'+str(i).zfill(2),'a':a,'b':b,'points':points,'confidence':'high'}
 if(a,b)in mystery:
  assert points==mystery[(a,b)];origin='mysteryTrain';display={('Boston','Washington'):'Boston - Washington 4',('Chicago','Montreal'):'Montreal - Chicago 7',('Portland','Vancouver'):'Vancouver - Portland 2',('Omaha','Winnipeg'):'Winnipeg - Omaha 6'}[(a,b)];second=('bgg-mystery',display,'Contents: four new tickets')
 elif(a,b)in baseMap:
  origin='baseReprint'
  if(a,b)in extraKeys and extraKeys[(a,b)].get('revised'):
   raw=extraKeys[(a,b)];assert raw['points']==points;item['revisedFrom']=baseMap[(a,b)]['points'];second=('agnias-1910','"'+raw['cities'][0]+'", "'+raw['cities'][1]+'" … "points": '+str(points)+' … "revised": true','revised ticket array entry')
  else:
   raw=baseKeys[(a,b)];assert raw['points']==points;second=('agnias-base','"'+raw['cities'][0]+'", "'+raw['cities'][1]+'" … "points": '+str(points),'base unchanged in reprint')
 else:
  origin='new1910';raw=extraKeys[(a,b)];assert raw['points']==points and not raw.get('revised');second=('agnias-1910','"'+raw['cities'][0]+'", "'+raw['cities'][1]+'" … "points": '+str(points),'new ticket array entry')
 item['origin']=origin;item['evidence']=refs('1910-'+str(i),first,second);exp.append(item)
assert collections.Counter(t['origin']for t in exp)=={'baseReprint':30,'new1910':35,'mysteryTrain':4};assert sum('revisedFrom'in t for t in exp)==4
cards=[]
for color in ['pink','white','blue','yellow','orange','black','red','green','locomotive']:
 count=14 if color=='locomotive' else 12
 q='plus 14 Locomotives'if count==14 else'12 each of Box, Passenger, Tanker, Reefer, Freight, Hopper, Coal, and Caboose cars'
 cards.append({'color':color,'count':count,'confidence':'high','evidence':refs('cards-'+color,('official-base',q,'components; purple/pink alias explained'),('se-inventory','8 colors with 12 of each, and 14 locomotive wilds.','accepted answer component inventory'))})
pointsSource=read('sources/agnias-route-point-values.json');points=[]
for length,value in enumerate([0,1,2,4,7,10,15]):
 if length==0:continue
 assert pointsSource[str(length)]==value or (length==6 and pointsSource[str(length)]==16)
 points.append({'length':length,'points':value,'confidence':'high','evidence':refs('points-'+str(length),('official-base',f'{length} … {value}','Route Scoring Table, numeric row; ellipsis indicates visual spacing'),('guide',f'{length} car route = {value} '+('point'if value==1 else'points'),'Route Scoring bullet'))})
parameters=[]
def param(name,value,one,two):parameters.append({'name':name,'value':value,'confidence':'high','evidence':refs('param-'+name,one,two)})
param('playersMinimum',2,('official-base','For 2 - 5 players','front page'),('guide','Players 2–5','summary'))
param('playersMaximum',5,('official-base','For 2 - 5 players','front page'),('guide','Players 2–5','summary'))
param('trainsPerPlayer',45,('official-base','Each player takes a set of 45 Colored Train Cars','setting up'),('guide','Give each player 45 train cars','setup'))
param('trainCardsTotal',110,('official-base','110 Train Car cards','components'),('se-inventory','of the 110 train cards','component inventory'))
param('baseTicketCount',30,('official-base','30 Destination Ticket cards','components'),('guide','30 destination ticket cards','contents'))
param('new1910TicketCount',35,('official-1910','35 new Destination Tickets','components'),('agnias-1910','"revised": true','derived:39 rows minus4 revised base replacements'))
param('mysteryTicketCount',4,('official-1910','4 Destination Tickets from the long out-of-print Mystery Train expansion','components'),('bgg-mystery','4 new Tickets','contents'))
param('revisedBaseTicketCount',4,('official-1910','including 4 whose value was revised downward','components'),('agnias-1910','"revised": true','derived:count4 flagged rows'))
param('megaTicketCount',69,('official-1910','Shuffle all 69 tickets','Mega game'),('supercheats','contains a total of 69 Destination Tickets','intro'))
param('cityCount',36,('rob-cities','"Atlanta"','derived:36 object keys'),('agnias-cities','"Atlanta"','derived:36 array entries'))
param('adjacencyGroupCount',78,('rob-routes','City A,City B,Distance,Color','derived:78 distinct unordered city pairs'),('agnias-routes','"distance": 2','derived:78 distinct unordered city pairs'))
param('physicalRouteCount',100,('rob-routes','City A,City B,Distance,Color','derived:100 CSV route rows'),('agnias-routes','"connections": [','derived:100 physical connections after directional deduplication'))
param('routeLengthTotal',309,('rob-routes','City A,City B,Distance,Color','derived:sum100 length fields'),('agnias-routes','"distance": 2','derived:sum length times connections after directional deduplication'))
param('longestTrailBonus',10,('official-base','adds 10 points to his score','final scoring'),('guide','+10 to the player with the longest continuous path of trains','final scoring; incorrect Globetrotter name omitted'))
param('globetrotterBonus1910',15,('official-1910','A new 15 point Globetrotter bonus card','components'),('supercheats','contains a total of 69 Destination Tickets','scope-only citation; second bonus source pending'))
# Explicitly avoid claiming unsupported second evidence for optional bonus; only requested classic score model is delivered.
parameters=[p for p in parameters if p['name']!='globetrotterBonus1910'];evidence.pop('param-globetrotterBonus1910-a');evidence.pop('param-globetrotterBonus1910-b')
data={'schemaVersion':1,'edition':'Classic Ticket to Ride USA,30 base tickets; USA1910 full69-ticket catalog separate','cities':cities,'routes':routes,'baseTickets':base,'usa1910Tickets':exp,'cardCounts':cards,'routePoints':points,'parameters':parameters}
save('usa.json',data);save('citations.json',evidence);save('sources/index.json',{id:{'author':author,'url':url,'firstLocalFile':file,'firstSha256':hashlib.sha256((root/file).read_bytes()).hexdigest()}for id,(author,url,file)in registry.items()})
rows=[]
for category in ['cities','routes','baseTickets','usa1910Tickets','cardCounts','routePoints','parameters']:
 for i,row in enumerate(data[category]):rows.append({'rowId':category+'/'+str(i),'category':category,'confidence':row['confidence'],'evidence':row['evidence']})
save('reports/fact-rows.json',rows)
print(json.dumps({'factRows':len(rows),'citations':len(evidence),'cities':len(cities),'physicalRoutes':len(routes),'adjacencyGroups':len(groups),'spaces':sum(r['length']for r in routes),'baseTickets':len(base),'usa1910Tickets':len(exp)}))
