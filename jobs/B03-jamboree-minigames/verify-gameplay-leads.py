#!/usr/bin/env python3
"""Validate preliminary evidence integrity, never certify game mechanics."""
import argparse
from collections import Counter
import datetime
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

FIELDS=['controls','winRules','scoreRules','timeLimit','tieRules','coinReward','starReward','gameplay']

def require(condition, message):
    if not condition:raise ValueError(message)

def validate(d, index, snapshots=None, schema=None):
    checks=Counter()
    if schema is not None:
        import jsonschema
        jsonschema.Draft202012Validator.check_schema(schema)
        jsonschema.Draft202012Validator(schema).validate(d);checks['json_schema']=1
    rows=index['entries'] if isinstance(index,dict) else index
    require(d['complete'] is False and type(d['independentlyVerifiedRows']) is int and d['independentlyVerifiedRows']==0,'False completeness or independent-verification claim.')
    require(len(rows)==len(d['entries'])==132 and len({r['url'] for r in d['entries']})==132,'Expected 132 unique source rows.')
    require([r['ordinal'] for r in d['entries']]==list(range(1,133)),'Ordinals must match the 132-row index order.');checks['unique_index_rows']=132
    for row,reference in zip(d['entries'],rows):
        require(all(row[field]==reference[field] for field in ['ordinal','name','edition']) and row['url']==reference['wikiArticleUrl'],'Name/ordinal/edition/URL differs from the supplied index.');checks['index_bound_rows']+=1
        require(urlsplit(row['url']).scheme=='https' and urlsplit(row['url']).netloc=='www.mariowiki.com','Source URL must be the indexed HTTPS wiki article.')
        require(row['sourceFamily']=='MarioWiki' and row['confidence']=='low' and row['finalVerified'] is False,'False source-family/confidence/final-verification claim.')
        require(row['secondPassLeadsIdentical'] is True,'Second-pass extraction differs.')
        quoted={q['id']:q for q in row['quotes']};require(len(quoted)==len(row['quotes']),'Duplicate quotation IDs.')
        words=sum(len(q['quote'].split()) for q in row['quotes']);require(words==row['uniqueQuoteWords']<=90,'Per-source quotation budget exceeded or misreported.')
        for q in row['quotes']:
            require(0<len(q['quote'].split())==q['quoteWords']<=25,'Quotation word count invalid.');checks['short_quotes']+=1
        require(set(row['fieldQuoteReferences'])==set(FIELDS),'Candidate field map is incomplete.')
        for field,refs in row['fieldQuoteReferences'].items():
            require(len(refs)==len(set(refs)) and all(ref in quoted for ref in refs),'Unknown or duplicate quotation reference.');checks['field_reference_lists']+=1
        require(row['missingLeadFields']==[f for f in FIELDS if not row['fieldQuoteReferences'][f]],'Missing-field list differs from evidence.')
        times=[]
        for number in [1,2]:
            capture=row['pass'+str(number)]
            # No effective-URL normalization was observed in these captures.
            require(capture['curlOutput'].splitlines()==['200',row['url'],'0'],'HTTP status, effective HTTPS URL, or TLS verification result is invalid.')
            require(type(capture['curlExit']) is int and capture['curlExit']==0 and capture['tlsVerificationEnabled'] is True,'Source retrieval was not successful with TLS verification.');checks['source_pass_records']+=1
            require(bool(re.fullmatch('[0-9a-f]{64}',capture['bodySha256'])) and type(capture['bodyBytes']) is int and capture['bodyBytes']>0,'Source hash or byte count is invalid.');checks['https_url_tls_hash_byte_records']+=1
            instant=datetime.datetime.fromisoformat(capture['retrievedAt']);require(instant.tzinfo is not None,'Source timestamp lacks a timezone.');times.append(instant)
            if snapshots is not None:
                stem=snapshots/('pass'+str(number))/f"{row['ordinal']:03d}"
                raw=Path(str(stem)+'.html').read_bytes();saved=json.loads(Path(str(stem)+'.json').read_text())
                require(all(saved[k]==row[k] for k in ['ordinal','name','edition','url']),'Snapshot metadata differs from indexed evidence.')
                require(all(saved[k]==capture[k] for k in ['retrievedAt','curlExit','curlOutput','bodySha256','bodyBytes','tlsVerificationEnabled']),'Compact provenance differs from its raw snapshot record.')
                require(hashlib.sha256(raw).hexdigest()==capture['bodySha256'] and len(raw)==capture['bodyBytes'],'Raw capture hash or byte count mismatch.');checks['raw_capture_hashes']+=1
                for q in row['quotes']:
                    require(any(q['quote'] in b['text'] and q['locator']==b['locator'] and q['sectionPath']==b['sectionPath'] for b in saved['blocks']),'Quotation not located in its captured article section.');checks['quotes_located_in_capture_sections']+=1
                    if saved.get('multiGameArticle'):
                        require(any('jamboree' in x.lower() for x in q['sectionPath']),'Old-game or unscoped quote on returning-game page.');checks['returning_game_scoped_quotes']+=1
                other=json.loads((snapshots/('pass'+str(3-number))/f"{row['ordinal']:03d}.json").read_text())
                require(saved['fieldLeads']==other['fieldLeads'],'Fresh captured-pass extractions differ.');checks['fresh_pass_extraction_comparisons']+=1
        require(times[1]>times[0],'Second-pass timestamp must be strictly later than the first.');checks['ordered_pass_timestamps']+=1
    for field in FIELDS:
        expected={'rowsWithLeads':sum(bool(r['fieldQuoteReferences'][field]) for r in d['entries']),'tvRowsWithLeads':sum(bool(r['fieldQuoteReferences'][field]) for r in d['entries'] if r['edition']=='jamboree_tv'),'quoteReferences':sum(len(r['fieldQuoteReferences'][field]) for r in d['entries'])}
        require(expected==d['coverage'][field],'Coverage totals differ from retained quotations.');checks['coverage_totals']+=1
    return {'passed':True,'scope':'Preliminary evidence integrity only; final B03 research remains UNVERIFIED.','caseCounts':dict(checks),'fieldCoverage':d['coverage']}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--evidence',type=Path,required=True)
    p.add_argument('--index',type=Path,default=Path(__file__).resolve().with_name('catalogue-index.json'),help='Catalogue index to bind names, ordinals, editions and URLs; defaults to adjacent catalogue-index.json.')
    p.add_argument('--snapshots',type=Path,help='Optional two-pass capture directory; compare raw hashes and extracted sections.')
    p.add_argument('--schema',type=Path,help='Optional schema validation using jsonschema 4.x.')
    args=p.parse_args()
    d=json.loads(args.evidence.read_text());index=json.loads(args.index.read_text());schema=json.loads(args.schema.read_text()) if args.schema else None
    print(json.dumps(validate(d,index,args.snapshots,schema),indent=2))

if __name__=='__main__':
    try:main()
    except Exception as error:
        print('FAILED: '+str(error),file=sys.stderr);raise
