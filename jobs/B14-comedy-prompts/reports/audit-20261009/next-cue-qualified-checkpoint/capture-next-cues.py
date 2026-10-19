import concurrent.futures
import datetime
import hashlib
import json
import re
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE = ROOT / 'cue-captures'
CACHE.mkdir(parents=True, exist_ok=True)
SOURCES = [('netflix-still-primary', 'https://help.netflix.com/en/node/114059', 'Netflix', 'primary'), ('netflix-still-howto', 'https://www.howtogeek.com/685919/why-netflix-asks-are-you-still-watching-and-how-to-stop-it/', 'How-To Geek', 'independent'), ('netflix-profile-primary', 'https://help.netflix.com/en/node/10421', 'Netflix', 'primary'), ('netflix-profile-howto', 'https://www.howtogeek.com/295978/how-to-configure-netflix-profiles/', 'How-To Geek', 'independent'), ('netflix-skip-primary', 'https://about.netflix.com/news/looking-back-on-the-origin-of-skip-intro-five-years-later', 'Netflix', 'primary'), ('netflix-skip-verge', 'https://www.theverge.com/2017/3/17/14959650/netflix-skip-intro-button', 'The Verge', 'independent'), ('bk-crown-primary', 'https://news.bk.com/blog-posts/burger-king-crowns-its-guests-king-in-new-ad-campaign', 'Burger King', 'primary'), ('bk-crown-tasting', 'https://www.tastingtable.com/2239841/burger-king-facts-everybody-should-know/', 'Tasting Table', 'independent'), ('wendy-roast-primary', 'https://www.wendys.com/blog/wendys-spiciest-roasts-from-roast-day-2021', "Wendy's", 'primary'), ('wendy-roast-thrillist', 'https://www.thrillist.com/news/nation/wendys-national-roast-day-twitter', 'Thrillist', 'independent'), ('wendy-roast-dailydot', 'https://dailydot.com/wendys-twitter-burn-interview', 'Daily Dot', 'independent')]

class Visible(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ignore = 0
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ['script', 'style', 'noscript']:
            self.ignore += 1
    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'noscript']:
            self.ignore = max(0, self.ignore - 1)
    def handle_data(self, text):
        if not self.ignore:
            self.parts.append(text)

def fetch(source, passn):
    id, url, group, role = source
    receipt = {'sourceId': id, 'url': url, 'declaredUnadoptedAuthorGroup': group, 'role': role, 'pass': passn, 'openedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    stem = CACHE / (id + '-pass' + str(passn))
    assert not stem.with_suffix('.html').exists(), 'Never overwrite an earlier source opening'
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; factual-cue-verification/1.0)', 'Accept': 'text/html'})
        with urllib.request.urlopen(request, timeout=12) as response:
            raw = response.read(4_000_001)
            assert len(raw) <= 4_000_000 and response.status == 200
            assert 'text/html' in response.headers.get('Content-Type', '')
            stem.with_suffix('.html').write_bytes(raw)
            visible = Visible()
            visible.feed(raw.decode('utf8', errors='replace'))
            text = re.sub(r'\s+', ' ', ' '.join(visible.parts)).strip()
            stem.with_suffix('.txt').write_text(text)
            assert len(text) > 500, 'Not a useful complete page'
            receipt.update(success=True, actualHTTP200FullBody=True, rawBytes=len(raw), rawSha256=hashlib.sha256(raw).hexdigest(), visibleCharacters=len(text), visibleSha256=hashlib.sha256(text.encode()).hexdigest(), finalURL=response.url)
    except Exception as error:
        receipt.update(success=False, errorType=type(error).__name__, reason=str(error))
        if isinstance(error, urllib.error.HTTPError):
            raw = error.read(4_000_001)
            stem.with_suffix('.http-failure').write_bytes(raw)
            receipt.update(actualHTTPFailureStatus=error.code, failureBytes=len(raw), failureSha256=hashlib.sha256(raw).hexdigest())
    receipt['closedUTC'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return receipt

receipts = []
for passn in [1, 2]:
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        batch = list(pool.map(lambda source: fetch(source, passn), SOURCES))
    receipts.extend(batch)
    (ROOT / 'NEXT-CUE-TWO-PASS-TRANSPORT.json').write_text(json.dumps({'sources': SOURCES, 'receipts': receipts, 'factPromotions': 0, 'wholeRowsQualified': 0, 'allOwnedThreadsNaturallyClosed': True, 'scope': 'Discovery and genuine bounded full-body openings only. No fact, byline, property or complete row is qualified until actual two-author context/quote/conflict checks.'}, indent=2) + '\n')
    print(json.dumps({'pass': passn, 'good': sum(r['success'] for r in batch), 'bad': [{key: r[key] for key in ['sourceId', 'errorType', 'reason']} for r in batch if not r['success']]}), flush=True)
