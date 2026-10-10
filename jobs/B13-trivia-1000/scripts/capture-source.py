#!/usr/bin/env python3
"""Fetch one real source and emit an actual retrieval receipt, never a fact grade."""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

parser = argparse.ArgumentParser()
parser.add_argument('--url', required=True)
parser.add_argument('--category', required=True)
parser.add_argument('--source-id', required=True)
parser.add_argument('--pass', dest='phase', choices=['author', 'reopen'], required=True)
args = parser.parse_args()
if not args.url.startswith(('https://', 'http://')):
    parser.error('Source URL must be HTTP(S)')
if '/' in args.category or '/' in args.source_id or '..' in args.category or '..' in args.source_id:
    parser.error('Category and source ID must be plain identifiers')
root = Path(__file__).resolve().parents[1]
folder = root / '.work' / args.category / args.phase
folder.mkdir(parents=True, exist_ok=True)
when = datetime.now(timezone.utc).isoformat()
receipt = {'pass': args.phase, 'retrievedAt': when, 'method': 'urllib-http-get',
           'requestedUrl': args.url}
try:
    request = Request(args.url, headers={'User-Agent': 'B13TriviaEvidence/1.0 (public factual research)'})
    with urlopen(request, timeout=40) as response:
        raw = response.read()
        receipt['resolvedUrl'] = response.geturl()
        receipt['status'] = response.status
        content_type = response.headers.get_content_type()
        receipt['contentType'] = content_type
        charset = response.headers.get_content_charset() or 'utf-8'
    raw_path = folder / (args.source_id + '.raw')
    raw_path.write_bytes(raw)
    receipt['rawSha256'] = hashlib.sha256(raw).hexdigest()
    receipt['rawPath'] = str(raw_path.relative_to(root))
    if content_type not in ('text/html', 'application/xhtml+xml', 'text/plain'):
        raise ValueError('Unsupported source body type; use a real PDF/text extractor and document it: ' + content_type)
    body = raw.decode(charset, errors='replace')
    if content_type != 'text/plain':
        soup = BeautifulSoup(body, 'html.parser')
        receipt['title'] = soup.title.get_text(' ', strip=True) if soup.title else ''
        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()
        body = soup.get_text(' ', strip=True)
    body = ' '.join(body.split())
    text_path = folder / (args.source_id + '.txt')
    text_path.write_text(body + '\n', encoding='utf-8')
    receipt['contentSha256'] = hashlib.sha256(text_path.read_bytes()).hexdigest()
    receipt['capturePath'] = str(text_path.relative_to(root))
    receipt['captureComplete'] = True
    receipt['characters'] = len(body)
    if not body:
        raise ValueError('Empty extracted body')
except (HTTPError, URLError, OSError, ValueError) as error:
    receipt['error'] = str(error)
    if isinstance(error, HTTPError):
        receipt['status'] = error.code
    path = folder / (args.source_id + '.receipt.json')
    path.write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps(receipt))
    raise SystemExit(1)
path = folder / (args.source_id + '.receipt.json')
path.write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt))
