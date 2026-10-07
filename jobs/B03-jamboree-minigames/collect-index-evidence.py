#!/usr/bin/env python3
"""Fetch two source lists twice; archive short list evidence and source-byte hashes.

The inherited HTTPS proxy and curl's default certificate verification are retained.
This collects index evidence only, never per-game rules or final research results.
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
import tempfile
from legacy_extract import parse_legacy
from wiki_extract import parse_wiki

SOURCES = {
    'wiki': 'https://www.mariowiki.com/List_of_Super_Mario_Party_Jamboree_minigames',
    'legacy': 'https://mariopartylegacy.com/super-mario-party-jamboree/minigame-list-tips-and-unlockables',
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


def collect(source_id):
    url = SOURCES[source_id]
    with tempfile.TemporaryDirectory(prefix='b03-index-') as tmp:
        path = Path(tmp) / 'source.html'
        args = ['curl', '--fail', '--silent', '--show-error', '--location',
                '--connect-timeout', '10', '--max-time', '45', '--output', str(path),
                '--write-out', '%{http_code} %{url_effective}', url]
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
        result = subprocess.run(args, capture_output=True, text=True)
        if result.returncode:
            raise RuntimeError(f'{source_id}: curl exit {result.returncode}: {result.stderr.strip()}')
        body = path.read_bytes()
        text = body.decode('utf-8')
        if source_id == 'nintendo':
            visible = VisibleText()
            visible.feed(text)
            parsed = {'rows': [], 'paragraphs': [' '.join(visible.parts)]}
        else:
            parsed = (parse_wiki if source_id == 'wiki' else parse_legacy)(text)
        quotes = []
        if source_id == 'wiki':
            base_quote = re.search(r'Super Mario Party Jamboree features (\d+) minigames, the most of any game in the Mario Party series\.', parsed['paragraphs'][0])
            tv_quote = re.search(r'includes (\d+) new minigames \(bringing the total to (\d+)\)', parsed['paragraphs'][1])
            assert base_quote and tv_quote, 'Source count wording changed; review required.'
            declared = {'base': int(base_quote[1]), 'jamboree_tv': int(tv_quote[1]), 'combined': int(tv_quote[2])}
            quotes = [{'field': 'baseCount', 'quote': base_quote[0], 'locator': 'introductory paragraph 1'},
                      {'field': 'tvAndCombinedCount', 'quote': tv_quote[0], 'locator': 'introductory paragraph 2'}]
            for quote, locator in [
                ('the Koopathlon, Kaboom-Squad, and Rhythm minigames cannot be played in its version of Free Play.', 'introductory paragraph 3'),
                ('Mouse minigames marked with an asterisk (*) cannot be played in Co-op rules with four players.', '#Jamboree_TV_minigames'),
            ]:
                assert any(quote in paragraph for paragraph in parsed['paragraphs'])
                quotes.append({'field': 'singleSourceContext', 'quote': quote, 'locator': locator})
        elif source_id == 'legacy':
            matches = [re.search(r'Each of the (\d+) Super Mario Party Jamboree minigames are listed below\.', p) for p in parsed['paragraphs']]
            count_quote = next((m for m in matches if m), None)
            assert count_quote, 'Source count wording changed; review required.'
            declared = {'base': int(count_quote[1]), 'jamboree_tv': None, 'combined': None}
            quotes = [{'field': 'baseCount', 'quote': count_quote[0], 'locator': 'introductory paragraph'}]
        else:
            quote = "Enjoy 20 new minigames using Joy-Con 2 mouse controls, HD rumble 2, and the system's built-in microphone."
            assert quote in parsed['paragraphs'][0], 'Official count wording changed; review required.'
            declared = {'base': None, 'jamboree_tv': 20, 'combined': None}
            quotes = [{'field': 'tvCount', 'quote': quote, 'locator': 'Even MORE minigames! section'}]
        assert all(len(q['quote'].split()) <= 25 for q in quotes)
        record = {'retrievedAtUtc': timestamp, 'sha256': hashlib.sha256(body).hexdigest(),
                  'byteLength': len(body), 'curlCommand': shlex.join(args),
                  'reportedHttpStatusAndEffectiveUrl': result.stdout.strip(),
                  'curlExitCode': result.returncode,
                  'tlsVerification': 'default curl verification enabled; inherited proxy preserved',
                  'declaredCounts': declared, 'quotes': quotes, 'rows': parsed['rows']}
        if 'categories' in parsed:
            record['categoryHeadings'] = parsed['categories']
        return source_id, record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    evidence = {'scope': 'preliminary names/category list evidence; no per-game rule verification',
                'sources': {key: {'url': url} for key, url in SOURCES.items()}}
    for pass_id in ('pass1', 'pass2'):
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
            for key, record in pool.map(collect, SOURCES):
                evidence['sources'][key][pass_id] = record
                print(f'{pass_id} {key}: {len(record["rows"])} rows, HTTP {record["reportedHttpStatusAndEffectiveUrl"]}, SHA256 {record["sha256"]}')
    args.output.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n')
    print(f'Saved {args.output}. Final B03 research remains incomplete.')


if __name__ == '__main__':
    main()
