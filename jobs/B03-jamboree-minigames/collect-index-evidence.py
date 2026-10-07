#!/usr/bin/env python3
"""Reopen four list/count URLs from three publishers in two fresh passes.

Keep distinct original snapshots outside the checkout. Commit short list excerpts
and byte hashes only. Inherited proxy and curl certificate verification remain on.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shlex
import subprocess
import sys
import tempfile
sys.dont_write_bytecode = True
from legacy_extract import parse_legacy
from wiki_extract import parse_wiki

SOURCES = {
    'wiki': 'https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames',
    'legacy': 'https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables',
    'legacyTv': 'https://mariopartylegacy.com/games/super-mario-party-jamboree/jamboree-tv/',
    'nintendo': 'https://www.nintendo.com/us/store/products/super-mario-party-jamboree-nintendo-switch-2-edition-plus-jamboree-tv-switch-2/',
}


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts, self.skip = [], 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip-1)
    def handle_data(self, data):
        if not self.skip and data.strip(): self.parts.append(data.strip())


class LegacyTvIndexParser(HTMLParser):
    """Preserve list names and exact section placement, without inferring Mouse labels."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.heading=None; self.h2=None; self.h3=None
        self.paragraph=None; self.list_name=None; self.strong=None
        self.table_depth=0; self.rows=[]; self.bowser={}; self.paragraphs=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag in ('h2','h3'): self.heading={'tag':tag,'parts':[]}
        if tag=='table': self.table_depth+=1
        if tag=='strong' and self.table_depth and self.h2=='Bowser Live': self.strong=[]
        if tag=='p':
            self.paragraph=[]
            if ('post-list-info-container-text' in attrs.get('class','').split()
                    and self.h2=='Free Play (List of Minigames)'
                    and self.h3=='List of Jamboree TV Minigames'): self.list_name=[]
        if tag=='br' and self.paragraph is not None: self.paragraph.append(' ')
    def handle_endtag(self, tag):
        if self.heading and tag==self.heading['tag']:
            value=' '.join(''.join(self.heading['parts']).split())
            if tag=='h2': self.h2=value;self.h3=None
            else: self.h3=value
            self.heading=None
        if tag=='strong' and self.strong is not None:
            name=' '.join(''.join(self.strong).split())
            self.bowser[name]=['Bowser Live',self.h3]
            self.strong=None
        if tag=='table': self.table_depth-=1
        if tag=='p' and self.paragraph is not None:
            self.paragraphs.append(' '.join(''.join(self.paragraph).split()))
            if self.list_name is not None:
                assert self.h2=='Free Play (List of Minigames)' and self.h3=='List of Jamboree TV Minigames'
                name=' '.join(''.join(self.list_name).split())
                self.rows.append({'name':name,'categoryPath':[self.h2,self.h3],'categoryAnchor':'free-play'})
                self.list_name=None
            self.paragraph=None
    def handle_data(self, data):
        if self.heading is not None: self.heading['parts'].append(data)
        if self.strong is not None: self.strong.append(data)
        if self.paragraph is not None: self.paragraph.append(data)
        if self.list_name is not None: self.list_name.append(data)
    def result(self):
        assert len(self.bowser)==6 and len(self.rows)==20, 'TV source layout/count changed; review required.'
        assert set(self.bowser).issubset({r['name'] for r in self.rows})
        for row in self.rows:
            if row['name'] in self.bowser:
                row['categoryPath']=self.bowser[row['name']]
                row['categoryAnchor']='bowser-live'
                row['group']='bowser_live'
            else: row['group']='other_new'
        return {'rows':self.rows,'paragraphs':self.paragraphs,
                'categoryGroups':[{'group':'bowser_live','declaredCount':6},{'group':'other_new','declaredCount':14}]}


def collect(task):
    source_id, snapshot_dir, pass_id = task
    url=SOURCES[source_id]
    path=snapshot_dir/pass_id/(source_id+'.html')
    path.parent.mkdir(parents=True,exist_ok=True)
    if path.exists():
        raise FileExistsError(f'Preserve existing source snapshot: {path}; choose a fresh snapshot directory.')
    args=['curl','--fail','--silent','--show-error','--location','--connect-timeout','10','--max-time','45',
          '--output',str(path),'--write-out','%{http_code} %{url_effective}',url]
    timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='microseconds').replace('+00:00','Z')
    result=subprocess.run(args,capture_output=True,text=True)
    if result.returncode: raise RuntimeError(f'{source_id}: curl exit {result.returncode}: {result.stderr.strip()}')
    assert result.stdout.strip()=='200 '+url, 'Source redirected to another scope; review required.'
    body=path.read_bytes();text=body.decode('utf-8')
    if source_id=='nintendo':
        visible=VisibleText();visible.feed(text)
        parsed={'rows':[],'paragraphs':[' '.join(visible.parts)]}
    elif source_id=='legacyTv':
        parser=LegacyTvIndexParser();parser.feed(text);parser.close();parsed=parser.result()
    else: parsed=(parse_wiki if source_id=='wiki' else parse_legacy)(text)
    if source_id=='wiki':
        base=re.search(r'Super Mario Party Jamboree features (\d+) minigames, the most of any game in the Mario Party series\.',parsed['paragraphs'][0])
        tv=re.search(r'includes (\d+) new minigames \(bringing the total to (\d+)\)',parsed['paragraphs'][1])
        assert base and tv, 'Wiki count wording changed.'
        declared={'base':int(base[1]),'jamboree_tv':int(tv[1]),'combined':int(tv[2])}
        quotes=[{'field':'baseCount','quote':base[0],'locator':'introductory paragraph 1'},
                {'field':'tvAndCombinedCount','quote':tv[0],'locator':'introductory paragraph 2'}]
        context=[('the Koopathlon, Kaboom-Squad, and Rhythm minigames cannot be played in its version of Free Play.','introductory paragraph 3'),
                 ('Mouse minigames marked with an asterisk (*) cannot be played in Co-op rules with four players.','#Jamboree_TV_minigames')]
    elif source_id=='legacy':
        matches=[re.search(r'Each of the (\d+) Super Mario Party Jamboree minigames are listed below\.',p) for p in parsed['paragraphs']]
        base=next((m for m in matches if m),None);assert base, 'Legacy base count wording changed.'
        declared={'base':int(base[1]),'jamboree_tv':None,'combined':None}
        quotes=[{'field':'baseCount','quote':base[0],'locator':'introductory paragraph'}];context=[]
    elif source_id=='legacyTv':
        quote='There are 20 new minigames in total in Jamboree TV.'
        assert any(quote in p for p in parsed['paragraphs']), 'Legacy TV count wording changed.'
        declared={'base':None,'jamboree_tv':20,'combined':None}
        quotes=[{'field':'tvCount','quote':quote,'locator':'#free-play'}]
        context=[('Six of them are Bowser Live minigames','#free-play'),
                 ('Each of the new 14 non-Bowser minigames can be played through three variations: Battle, Team of 2, and Team of 4.','#free-play'),
                 ('Any minigame from the Bowser Kaboom Squad, Koopathlon, or Rhythm Kitchen modes are not included.','#free-play'),
                 ('Shell Hockey is notably the only minigame not to have a Team of 4 variation.','#free-play')]
    else:
        quote="Enjoy 20 new minigames using Joy-Con 2 mouse controls, HD rumble 2, and the system's built-in microphone."
        assert quote in parsed['paragraphs'][0], 'Nintendo count wording changed.'
        declared={'base':None,'jamboree_tv':20,'combined':None}
        quotes=[{'field':'tvCount','quote':quote,'locator':'Even MORE minigames! section'}];context=[]
    for quote,locator in context:
        assert any(quote in p for p in parsed['paragraphs']), 'Context quotation changed.'
        quotes.append({'field':'sourceContext','quote':quote,'locator':locator})
    assert all(0<len(q['quote'].split())<=25 for q in quotes)
    record={'retrievedAtUtc':timestamp,'sha256':hashlib.sha256(body).hexdigest(),'byteLength':len(body),
            'snapshotPath':str(path),'curlCommand':shlex.join(args),
            'reportedHttpStatusAndEffectiveUrl':result.stdout.strip(),'curlExitCode':result.returncode,
            'tlsVerification':'default curl verification enabled; inherited proxy preserved',
            'declaredCounts':declared,'quotes':quotes,'rows':parsed['rows']}
    for name in ('categories','categoryGroups'):
        if name in parsed:record['categoryHeadings' if name=='categories' else name]=parsed[name]
    return source_id,record


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True,type=Path)
    parser.add_argument('--snapshot-dir',type=Path)
    args=parser.parse_args()
    snapshot_dir=(args.snapshot_dir or Path(tempfile.mkdtemp(prefix='b03-list-snapshots-'))).resolve()
    existing=[snapshot_dir/p/(s+'.html') for p in ('pass1','pass2') for s in SOURCES
              if (snapshot_dir/p/(s+'.html')).exists()]
    if existing:
        raise FileExistsError('Snapshot files already exist; choose a fresh --snapshot-dir before collecting.')
    evidence={'scope':'preliminary names/category list evidence; no per-game rule verification',
              'sources':{key:{'url':url} for key,url in SOURCES.items()}}
    for pass_id in ('pass1','pass2'):
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            for key,record in pool.map(collect,[(s,snapshot_dir,pass_id) for s in SOURCES]):
                evidence['sources'][key][pass_id]=record
                print(f'{pass_id} {key}: {len(record["rows"])} rows, HTTP {record["reportedHttpStatusAndEffectiveUrl"]}, SHA256 {record["sha256"]}')
    args.output.write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
    print(f'Saved {args.output}; distinct original snapshots in {snapshot_dir}. Final B03 research remains incomplete.')


if __name__=='__main__': main()
