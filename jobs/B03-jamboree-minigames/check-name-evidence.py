#!/usr/bin/env python3
"""Freshly recheck compact evidence twice without replacing historical evidence.

Standard library + curl only. curl retains default TLS verification and the
inherited proxy. Each pass uses a distinct response directory. Snapshots are
optional; otherwise only hashes and quote-check results survive temporary files.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import tempfile


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip, self.parts, self.alt_values = 0, [], []

    def handle_starttag(self, tag, attributes):
        if tag in ('script', 'style'):
            self.skip += 1
        attributes = dict(attributes)
        if tag == 'img' and 'alt' in attributes:
            self.alt_values.append(attributes['alt'])

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip and data.strip():
            self.parts.append(data.strip())


def check_bytes(source, record, path, pass_id):
    """Validate the recorded digest before parsing the retained response bytes."""
    body = path.read_bytes() if path.exists() else b''
    matches = hashlib.sha256(body).hexdigest() == record['sha256']
    if not matches:
        raise RuntimeError('Response bytes changed before quote checks: ' + source['sourceId'])
    parser = VisibleText()
    parser.feed(body.decode('utf-8'))
    text = ' '.join(parser.parts)
    checks = []
    for quote in source['quotes']:
        found = (quote['quote'] in parser.alt_values if quote.get('html_attribute')
                 else quote['quote'] in text)
        checks.append({
            'sourceId': source['sourceId'], 'passId': pass_id,
            'field': quote['field'], 'locator': quote['locator'],
            'quoteFound': found, 'wordCount': len(quote['quote'].split()),
            'quoteLimitPassed': len(quote['quote'].split()) <= 25,
            'recordedResponseHashMatchesRetainedBytes': matches,
            'successfulRetrieval': record['curlExitCode'] == 0 and
                record['httpStatusEffectiveUrl'].startswith('200 '),
        })
    return checks


def retrieve(source, pass_id, pass_root, snapshot_root):
    source_id = source['sourceId']
    if any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789-_' for c in source_id):
        raise ValueError('Unsafe source ID')
    path = pass_root / (source_id + '.html')
    command = ['curl', '--fail', '--silent', '--show-error', '--location',
               '--connect-timeout', '10', '--max-time', '35', '--output', str(path),
               '--write-out', '%{http_code} %{url_effective}', source['url']]
    started = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='microseconds')
    result = subprocess.run(command, capture_output=True, text=True)
    body = path.read_bytes() if path.exists() else b''
    record = {
        'id': source_id, 'url': source['url'], 'timeUtc': started,
        'curlExitCode': result.returncode,
        'httpStatusEffectiveUrl': result.stdout.strip(), 'stderr': result.stderr.strip(),
        'byteLength': len(body), 'sha256': hashlib.sha256(body).hexdigest(),
        'temporaryResponsePath': str(path), 'path': None,
        'responseSnapshotRetained': False,
        'tlsVerification': 'default curl certificate verification retained; inherited proxy retained',
        'curlCommand': command,
    }
    checks = check_bytes(source, record, path, pass_id)
    if snapshot_root is not None and path.exists():
        archive_path = snapshot_root / pass_id / (source_id + '.html')
        with archive_path.open('xb') as output:
            output.write(body)
        if hashlib.sha256(archive_path.read_bytes()).hexdigest() != record['sha256']:
            raise RuntimeError('Archived response digest mismatch: ' + source_id)
        record.update(path=str(archive_path), responseSnapshotRetained=True)
    return source_id, record, checks


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--evidence', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path,
                        help='New output file; existing files are never replaced.')
    parser.add_argument('--snapshot-dir', type=Path,
                        help='Optional new directory retaining separate responses for both passes.')
    args = parser.parse_args()
    if args.evidence.resolve() == args.output.resolve() or args.output.exists():
        parser.error('--output must be a new file distinct from --evidence')
    original = json.loads(args.evidence.read_text())
    sources = [{k: source[k] for k in
                ('sourceId', 'family', 'url', 'quotes', 'author', 'publishedAt') if k in source}
               for source in original['sources']]
    if len({source['sourceId'] for source in sources}) != len(sources):
        parser.error('Duplicate source IDs')
    if args.snapshot_dir is not None:
        args.snapshot_dir.mkdir(parents=True, exist_ok=False)
        for pass_id in ('pass1', 'pass2'):
            (args.snapshot_dir / pass_id).mkdir()
    report = {
        'scope': 'Fresh two-pass quote recheck; historical evidence is unchanged',
        'inputEvidenceSha256': hashlib.sha256(args.evidence.read_bytes()).hexdigest(),
        'snapshotPolicy': ('Separate source responses retained for each pass' if args.snapshot_dir
                           else 'Separate temporary responses hashed before parsing; raw bytes not retained after this run'),
        'sources': sources, 'checks': [],
    }
    with tempfile.TemporaryDirectory(prefix='b03-name-pass1-') as first, \
            tempfile.TemporaryDirectory(prefix='b03-name-pass2-') as second:
        for pass_id, pass_root in [('pass1', Path(first)), ('pass2', Path(second))]:
            with concurrent.futures.ThreadPoolExecutor(max_workers=min(5, len(sources))) as pool:
                futures = [pool.submit(retrieve, source, pass_id, pass_root, args.snapshot_dir)
                           for source in sources]
                for future in futures:
                    source_id, record, checks = future.result()
                    next(source for source in sources if source['sourceId'] == source_id)[pass_id] = record
                    report['checks'].extend(checks)
    report['separateResponsePaths'] = all(source['pass1']['temporaryResponsePath'] !=
                                        source['pass2']['temporaryResponsePath'] for source in sources)
    report['checksPassed'] = report['separateResponsePaths'] and all(
        check['quoteFound'] and check['quoteLimitPassed'] and
        check['recordedResponseHashMatchesRetainedBytes'] and check['successfulRetrieval']
        for check in report['checks'])
    with args.output.open('x') as output:
        output.write(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'checksPassed': report['checksPassed'], 'quoteChecks': len(report['checks']),
                      'separateResponsePaths': report['separateResponsePaths'],
                      'output': str(args.output)}, indent=2))
    return 0 if report['checksPassed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
