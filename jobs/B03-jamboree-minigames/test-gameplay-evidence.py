#!/usr/bin/env python3
"""Adversarial provenance and output-directory checks; no network requests."""
import argparse
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile

def load_helper(name, filename):
    spec=importlib.util.spec_from_file_location(name,Path(__file__).resolve().with_name(filename));module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def expect_rejection(name, call, results):
    try:call()
    except (ValueError,KeyError):results.append({'case':name,'rejected':True})
    else:raise ValueError('Invalid evidence was accepted: '+name)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--index',type=Path,default=Path(__file__).resolve().with_name('catalogue-index.json'))
    p.add_argument('--evidence',type=Path,default=Path(__file__).resolve().with_name('gameplay-leads.json'))
    p.add_argument('--snapshots',type=Path,help='Optional actual raw captures for reparse preflight checks.')
    args=p.parse_args();index=json.loads(args.index.read_text());data=json.loads(args.evidence.read_text())
    verifier=load_helper('b03_gameplay_verifier','verify-gameplay-leads.py');collector=load_helper('b03_gameplay_collector','collect-gameplay.py')
    verifier.validate(data,index);results=[]
    mutations=[
        ('effective URL mismatch',lambda d:d['entries'][0]['pass1'].__setitem__('curlOutput','200\nhttps://www.mariowiki.com/Unrelated_Article\n0\n')),
        ('nonzero TLS result',lambda d:d['entries'][0]['pass1'].__setitem__('curlOutput','200\n'+d['entries'][0]['url']+'\n60\n')),
        ('HTTP error reported as retrieval',lambda d:d['entries'][0]['pass1'].__setitem__('curlOutput','403\n'+d['entries'][0]['url']+'\n0\n')),
        ('indexed name mismatch',lambda d:d['entries'][0].__setitem__('name','Unrelated minigame')),
        ('indexed edition mismatch',lambda d:d['entries'][0].__setitem__('edition','jamboree_tv')),
        ('indexed URL mismatch',lambda d:d['entries'][0].__setitem__('url','https://www.mariowiki.com/Unrelated_Article')),
        ('second pass timestamp not later',lambda d:d['entries'][0]['pass2'].__setitem__('retrievedAt',d['entries'][0]['pass1']['retrievedAt'])),
        ('nonhexadecimal hash',lambda d:d['entries'][0]['pass1'].__setitem__('bodySha256','z'*64)),
        ('boolean byte count',lambda d:d['entries'][0]['pass1'].__setitem__('bodyBytes',True)),
        ('false independent verification count',lambda d:d.__setitem__('independentlyVerifiedRows',1)),
        ('false final verified flag',lambda d:d['entries'][0].__setitem__('finalVerified',True)),
        ('false second source family',lambda d:d['entries'][0].__setitem__('sourceFamily','Independent publisher')),
    ]
    for name,mutation in mutations:
        changed=copy.deepcopy(data);mutation(changed);expect_rejection(name,lambda:verifier.validate(changed,index),results)
    missing_output=subprocess.run([sys.executable,str(Path(__file__).resolve().with_name('collect-gameplay.py')),'--index',str(args.index),'--reparse'],capture_output=True,text=True)
    if missing_output.returncode!=2 or '--output' not in missing_output.stderr:raise ValueError('Collector did not require explicit --output.')
    results.append({'case':'collector output argument required','rejected':True})
    with tempfile.TemporaryDirectory(prefix='b03-evidence-guards-') as temporary:
        folder=Path(temporary)
        expect_rejection('fresh retrieval existing directory',lambda:collector.prepare_output(folder,False),results)
        expect_rejection('reparse missing directory',lambda:collector.prepare_output(folder/'missing',True),results)
        checkout=folder/'checkout';checkout.mkdir();(checkout/'.git').write_text('test marker\n')
        expect_rejection('raw output inside checkout',lambda:collector.prepare_output(checkout/'captures',False),results)
        if collector.prepare_output(folder/'fresh-captures',False)!=(folder/'fresh-captures').resolve():raise ValueError('New outside-checkout directory rejected.')
    preflight=0
    if args.snapshots:
        rows=index['entries'] if isinstance(index,dict) else index
        for row in rows:
            times=[]
            for number in [1,2]:
                stem=args.snapshots/('pass'+str(number))/f"{row['ordinal']:03d}"
                capture=json.loads(Path(str(stem)+'.json').read_text());raw=Path(str(stem)+'.html').read_bytes()
                times.append(collector.validate_saved_capture(row,capture,raw));preflight+=1
            if times[1]<=times[0]:raise ValueError('Raw capture pass order invalid.')
        row=rows[0];stem=args.snapshots/'pass1'/'001';capture=json.loads(Path(str(stem)+'.json').read_text());raw=Path(str(stem)+'.html').read_bytes()
        expect_rejection('reparse modified raw source bytes',lambda:collector.validate_saved_capture(row,capture,raw+b'changed'),results)
        bad=copy.deepcopy(capture);bad['bodyBytes']+=1
        expect_rejection('reparse wrong byte count',lambda:collector.validate_saved_capture(row,bad,raw),results)
    print(json.dumps({'passed':True,'networkRequests':0,'rejectedInvalidCases':len(results),'validCompactDataset':True,'validNewOutputDirectory':True,'rawCapturePreflightCases':preflight,'cases':results},indent=2))

if __name__=='__main__':main()
