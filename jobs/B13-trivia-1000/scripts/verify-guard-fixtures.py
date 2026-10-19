"""Execute three actual verifier guards on isolated synthetic negative fixtures."""
import ast, datetime, hashlib, json, pathlib, re, sys
from types import SimpleNamespace
from urllib.parse import urlparse

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
code = (root / 'scripts/check-data.py').read_text()
tree = ast.parse(code)
env = {'datetime': datetime.datetime, 'timezone': datetime.timezone,
       'urlparse': urlparse, 're': re, 'ROOT': root, 'errors': [],
       'capture_cache': {}, 'receipt_checks': 0,
       'args': SimpleNamespace(require_local_captures=True)}
for name in ['timestamp', 'proof']:
    node = next(v for v in tree.body if isinstance(v, ast.FunctionDef) and v.name == name)
    exec(compile(ast.Module(body=[node], type_ignores=[]), 'actual_current_checker_guard', 'exec'), env)
receipt = {'pass': 'reopen', 'status': 200,
           'retrievedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'method': 'NEGATIVE SYNTHETIC FIXTURE; NOT AN ACTUAL SOURCE OPEN',
           'requestedUrl': 'https://example.com/fixture',
           'resolvedUrl': 'https://example.com/fixture', 'contentSha256': 'a'*64,
           'capturePath': '.work/negative-fixture-body-that-does-not-exist.txt'}
assert not (root / receipt['capturePath']).exists()
env['proof'](receipt, receipt['requestedUrl'], 'reopen', 'isolated missing-body fixture')
result = {'requiredMissingBodyRejected': any('required local body missing' in e for e in env['errors'])}
env['errors'] = []
env['proof']({}, receipt['requestedUrl'], 'reopen', 'isolated naked-receipt fixture')
result['MissingReopenReceiptRejected'] = bool(env['errors'])
result['missingReceiptErrors'] = env['errors'].copy()
node = next(v for v in tree.body if isinstance(v, ast.For) and isinstance(v.target, ast.Name) and v.target.id == 'flag')
flag = {'ids': ['B13-TEST1', 'B13-TEST2'], 'rowSha256': ['b'*64, 'c'*64]}
resolution = {**flag, 'reason': 'Explicit synthetic rejected duplicate, not real research.',
              'reviewer': 'negative-fixture',
              'reviewedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'decision': 'revise-duplicate'}
env.update(flags=[flag], resolutions=[resolution], resolved=[])
exec(compile(ast.Module(body=[node], type_ignores=[]), 'actual_current_similarity_guard', 'exec'), env)
result['RejectedDuplicateNotCountedResolved'] = not env['resolved']
assert all(result[k] for k in ['requiredMissingBodyRejected', 'MissingReopenReceiptRejected', 'RejectedDuplicateNotCountedResolved'])
result.update(checkerSha256=hashlib.sha256(code.encode()).hexdigest(),
              runAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              rerunCommand='python scripts/verify-guard-fixtures.py .',
              actualInvocation=['python', *sys.argv],
              fixtureCount=3,
              scope='Three isolated tests execute current production guards on explicitly synthetic missing/rejected fixtures. No remote retrieval, factual grading, shared data mutation or invented real source receipt.')
print(json.dumps(result, indent=2))
