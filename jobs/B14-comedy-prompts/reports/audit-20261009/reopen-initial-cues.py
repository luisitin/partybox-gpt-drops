import concurrent.futures,datetime,hashlib,json,re,urllib.request
from html.parser import HTMLParser
from pathlib import Path
w=Path(__file__).resolve().parent;cache=w/'cue-captures';cache.mkdir(exist_ok=True)
sources=[
('motel6-official','https://www.motel6.com/pages/policies/about/','Motel 6 / G6 Hospitality','primary'),
('motel6-latimes','https://www.latimes.com/archives/la-xpm-1988-06-18-fi-4623-story.html','Los Angeles Times editorial','independent'),
('enterprise-official','https://www.enterprisemobility.com/en/about/our-heritage.html','Enterprise Mobility','primary'),
('enterprise-autoslash','https://blog.autoslash.com/remember-when-hertz-would-pick-you-up/','AutoSlash editorial','independent'),
('digiorno-official','https://www.goodnes.com/digiorno/about-us/','Nestle / DiGiorno','primary'),
('digiorno-eater','https://www.eater.com/2019/6/24/18715848/digiorno-pizza-slogan-its-not-delivery-its-digiorno','Eater editorial','independent'),
('geico-official','https://www.geico.com/about/corporate/history-the-full-story/','GEICO','primary'),
('geico-insurance','https://insurancenewsnet.com/innarticle/at-age-20-the-geico-gecko-remains-king-of-the-insurance-ads','InsuranceNewsNet editorial','independent'),
('energizer-official','https://energizer.com/energizer-bunny/bunny-timeline/','Energizer','primary'),
('energizer-forbes','https://www.forbes.com/2008/07/08/advertising-mars-geico-biz-media-cx_lr_0708spokescreatures_slide.html','Forbes editorial','independent')]
class Visible(HTMLParser):
 def __init__(self):super().__init__();self.ignore=0;self.parts=[]
 def handle_starttag(self,t,a):
  if t in ['script','style','noscript']:self.ignore+=1
 def handle_endtag(self,t):
  if t in ['script','style','noscript']:self.ignore=max(0,self.ignore-1)
 def handle_data(self,t):
  if not self.ignore:self.parts.append(t)
def fetch(source,passn):
 id,url,author,role=source;receipt={'sourceId':id,'url':url,'authorGroup':author,'role':role,'pass':passn,'startedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; factual-cue-verification/1.0)','Accept':'text/html'})
  with urllib.request.urlopen(req,timeout=12) as response:
   b=response.read(4_000_001);assert len(b)<=4_000_000;assert response.status==200
   ct=response.headers.get('Content-Type','');assert 'text/html' in ct
   html=b.decode('utf-8',errors='replace');parser=Visible();parser.feed(html);text=re.sub(r'\s+',' ',' '.join(parser.parts)).strip()
   assert len(text)>500,'not a full useful page'
   base=cache/(id+'-pass'+str(passn));base.with_suffix('.html').write_bytes(b);base.with_suffix('.txt').write_text(text)
   receipt.update({'success':True,'responseStatus':response.status,'finalUrl':response.url,'rawBytes':len(b),'rawSha256':hashlib.sha256(b).hexdigest(),'visibleCharacters':len(text),'visibleSha256':hashlib.sha256(text.encode()).hexdigest(),'contentType':ct})
 except Exception as error:receipt.update({'success':False,'errorType':type(error).__name__,'reason':str(error)})
 receipt['closedUTC']=datetime.datetime.now(datetime.timezone.utc).isoformat();return receipt
allreceipts=[]
for passn in [1,2]:
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:batch=list(pool.map(lambda s:fetch(s,passn),sources))
 allreceipts+=batch
 (w/'CUE-INITIAL-TWO-PASS-TRANSPORT.json').write_text(json.dumps({'actualSources':sources,'receipts':allreceipts,'factPromotions':0,'scope':'Actual complete bounded HTML retrieval and fresh reopen only; facts remain unadopted until two-author quote/context/conflict and full-row coverage review.','allOwnedThreadsNaturallyClosed':True},indent=2)+'\n')
 print(json.dumps({'pass':passn,'good':sum(x['success'] for x in batch),'bad':[{k:x[k] for k in ['sourceId','errorType','reason']} for x in batch if not x['success']]}),flush=True)
