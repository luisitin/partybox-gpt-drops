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
SOURCES = [('oldspice-press-primary', 'https://oldspice.com/press-release/old-spices-most-sophisticated-cologneinfused-scents-press-release/', 'Procter & Gamble / Old Spice', 'primary')]

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

class HTTPSOnlyRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not newurl.startswith('https://'):
            raise ValueError('Source redirect downgraded HTTPS; not qualified')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(source, passn):
    id, url, group, role = source
    receipt = {'sourceId': id, 'url': url, 'declaredUnadoptedAuthorGroup': group, 'role': role, 'pass': passn, 'openedUTC': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    stem = CACHE / (id + '-pass' + str(passn))
    assert not stem.with_suffix('.html').exists(), 'Never overwrite an earlier source opening'
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; factual-cue-verification/1.0)', 'Accept': 'text/html'})
        with urllib.request.build_opener(HTTPSOnlyRedirect()).open(request, timeout=12) as response:
            raw = response.read(4_000_001)
            assert len(raw) <= 4_000_000 and response.status == 200 and response.url.startswith('https://')
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
    (ROOT / 'PRODUCT-PRESS-TWO-PASS-TRANSPORT.json').write_text(json.dumps({'sources': SOURCES, 'receipts': receipts, 'factPromotions': 0, 'wholeRowsQualified': 0, 'allOwnedThreadsNaturallyClosed': True, 'scope': 'Discovery and genuine bounded full-body openings only. No fact, byline, property or complete row is qualified until actual two-author context/quote/conflict checks.'}, indent=2) + '\n')
    print(json.dumps({'pass': passn, 'good': sum(r['success'] for r in batch), 'bad': [{key: r[key] for key in ['sourceId', 'errorType', 'reason']} for r in batch if not r['success']]}), flush=True)
