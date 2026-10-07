#!/usr/bin/env python3
"""Reopen every retained URL twice into a new external directory. Never overwrite a drop."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import tempfile
import unicodedata
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parent
def compact(t):return re.sub(r'\s+','',unicodedata.normalize('NFKC',t))
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
    spec=importlib.util.spec_from_file_location('b03_output_guards',ROOT/'collect-gameplay.py');guard=importlib.util.module_from_spec(spec);spec.loader.exec_module(guard)
    output=guard.prepare_output(args.output,False);output.mkdir(parents=True,exist_ok=False)
    sources=json.loads((ROOT/'catalogue-sources.json').read_text())['sources'];supplement=json.loads((ROOT/'historical-supplement-reopens.json').read_text())['sources']
    names=json.loads((ROOT/'name-evidence.json').read_text())['sources'];old=json.loads((ROOT/'source-excerpts.json').read_text())['sources']
    for i,s in enumerate(supplement):
        candidates=[x for x in names if x['url']==s['url']]
        qq=[{'id':f'H{i+1}Q{j+1}','text':q['quote'],'locator':q['locator']} for x in candidates for j,q in enumerate(x['quotes'])]
        if not qq:
            qq=[{'id':f'H{i+1}Q{j+1}','text':q['quote'],'locator':q['locator']} for x in old.values() if x['url']==s['url'] for j,q in enumerate(x['pass2']['quotes'])]
        sources.append({'id':f'HIST{i+1}','url':s['url'],'quotes':qq})
    allpasses=[]
    def fetch(source):
        began=datetime.now(timezone.utc).isoformat()
        with tempfile.TemporaryDirectory(prefix='b03-source-body-') as tmp:
            body=Path(tmp)/'page.html';cmd=['curl','--fail','--silent','--show-error','--location','--connect-timeout','10','--max-time','45','--output',str(body),'--write-out','%{http_code}\n%{url_effective}\n%{ssl_verify_result}\n',source['url']]
            r=subprocess.run(cmd,capture_output=True,text=True);raw=body.read_bytes() if body.exists() else b''
            soup=BeautifulSoup(raw,'html.parser')
            for tag in soup.select('sup,script,style'):tag.decompose()
            text=soup.get_text(' ',strip=True)+' '+' '.join(x.get('alt','') for x in soup.select('img[alt]'))
            recovered=[];missing=[]
            for q in source['quotes']:
                (recovered if compact(q['text']) in compact(text) else missing).append(q['id'])
            record={'sourceId':source['id'],'url':source['url'],'requestBeganUTC':began,'requestCompletedUTC':datetime.now(timezone.utc).isoformat(),'curlExit':r.returncode,'httpEffectiveTls':r.stdout.splitlines(),'bodySha256':hashlib.sha256(raw).hexdigest(),'bodyBytes':len(raw),'recoveredQuoteIds':recovered,'missingQuoteIds':missing,'quotes':[{'id':q['id'],'text':q['text'],'locator':q['locator']} for q in source['quotes']],'rawBodyPublished':False}
            return record
    for number in [1,2]:
        with ThreadPoolExecutor(max_workers=4) as pool:records=list(pool.map(fetch,sources))
        for rec in records:rec['pass']=number
        allpasses.append(records);(output/f'pass{number}.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({'pass':number,'sources':len(records),'http200TlsVerified':sum(x['curlExit']==0 and x['httpEffectiveTls']==['200',x['url'],'0'] for x in records),'missingQuotes':sum(len(x['missingQuoteIds']) for x in records)}),flush=True)
    success=all(x['curlExit']==0 and x['httpEffectiveTls']==['200',x['url'],'0'] and not x['missingQuoteIds'] for group in allpasses for x in group)
    report={'job':'B03','passed':success,'scope':'Fresh source access and short-clip recovery only; no independent game execution or automatic factual promotion.','uniqueUrls':len(sources),'passes':2,'requests':len(sources)*2,'quoteRecoveries':sum(len(x['recoveredQuoteIds']) for group in allpasses for x in group),'missingQuotes':sum(len(x['missingQuoteIds']) for group in allpasses for x in group),'failedSources':[{'pass':x['pass'],'sourceId':x['sourceId'],'url':x['url'],'missingQuoteIds':x['missingQuoteIds'],'transport':x['httpEffectiveTls']} for group in allpasses for x in group if x['curlExit']!=0 or x['httpEffectiveTls']!=['200',x['url'],'0'] or x['missingQuoteIds']]}
    (output/'summary.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2));return 0 if success else 1
if __name__=='__main__':raise SystemExit(main())
