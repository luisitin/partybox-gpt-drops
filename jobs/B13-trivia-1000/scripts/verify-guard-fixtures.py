"""Execute fifteen current production guard controls on isolated fixtures."""
import ast, datetime, hashlib, json, pathlib, re, sys
from types import SimpleNamespace
from urllib.parse import urlparse

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
code = (root / 'scripts/check-data.py').read_text()
tree = ast.parse(code)
env = {'datetime': datetime.datetime, 'timezone': datetime.timezone,
       'json': json, 'hashlib': hashlib,
       'urlparse': urlparse, 're': re, 'ROOT': root, 'errors': [],
       'capture_cache': {}, 'receipt_checks': 0,
       'args': SimpleNamespace(require_local_captures=True)}
for name in ['canonical_sha', 'timestamp', 'reviewer_identity', 'independent_review', 'proof']:
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
row = json.loads((root/'categories/world-geography.json').read_text())[0]
author = json.loads((root/'evidence/world-geography-authoring.json').read_text())[0]
review = json.loads((root/'reviews/world-geography-adversarial.json').read_text())[0]
assert row['id'] == author['id'] == review['id']
valid_node = next(v.value for v in ast.walk(tree) if isinstance(v, ast.Assign)
                  and any(isinstance(t, ast.Name) and t.id == 'valid' for t in v.targets))
valid_expression = compile(ast.Expression(valid_node), 'actual_current_review_acceptance', 'eval')
env.update(row=row, a=author, r=review)
assert eval(valid_expression, env), 'Valid existing independent review was rejected'
identity_cases = [
    ('self-review', author, {**review, 'reviewer': author['author']}),
    ('self-review-with-role-and-case', author, {**review, 'reviewer': author['author'].upper()+' (different role description)'}),
    ('missing-author', {k:v for k,v in author.items() if k != 'author'}, review),
    ('blank-author', {**author, 'author':'  '}, review),
    ('missing-reviewer', author, {k:v for k,v in review.items() if k != 'reviewer'})
]
identity_results = []
for label, fixture_author, fixture_review in identity_cases:
    rejected = not eval(valid_expression, dict(env, a=fixture_author, r=fixture_review))
    assert rejected, label
    identity_results.append({'case':label, 'rejectedByActualProductionGate':rejected})
rows = [r for p in sorted((root/'categories').glob('*.json')) for r in json.loads(p.read_text())]
report = json.loads((root/'reports/checks.json').read_text())
lengths = {k:v for k,v in report['optionLengths'].items()
           if k not in ['rowVersionsSha256','metricsSha256','editorialAssessment']}
versions = [{'id':r['id'],'rowSha256':env['canonical_sha'](r)} for r in sorted(rows,key=lambda r:r['id'])]
assessment = json.loads((root/'evidence/option-length-assessment.json').read_text())
length_node = next(v.value for v in tree.body if isinstance(v, ast.Assign)
                   and any(isinstance(t, ast.Name) and t.id == 'length_assessment_current' for t in v.targets))
length_expression = compile(ast.Expression(length_node), 'actual_current_length_acceptance', 'eval')
length_env = dict(env, lengths=lengths, row_versions=versions, length_assessment=assessment)
assert eval(length_expression, length_env), 'Valid current UTC length assessment rejected'
dates = [('malformed','placeholder'),
         ('future',(datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(days=1)).isoformat()),
         ('non-UTC','2026-10-07T22:20:25+01:00'),
         ('naive','2026-10-07T21:20:25'),
         ('missing',None)]
date_results=[]
for label, value in dates:
    rejected = not eval(length_expression, dict(length_env, length_assessment={**assessment,'reviewedAt':value}))
    assert rejected, label
    date_results.append({'case':label,'rejectedByActualProductionGate':rejected})
result['independentReviewIdentityCases'] = identity_results
result['validCurrentIndependentReviewAccepted'] = True
result['actualUtcLengthAssessmentCases'] = date_results
result['validCurrentUtcLengthAssessmentAccepted'] = True
result.update(checkerSha256=hashlib.sha256(code.encode()).hexdigest(),
              runAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              rerunCommand='python scripts/verify-guard-fixtures.py .',
              actualInvocation=['python', *sys.argv],
              fixtureCount=15,
              scope='Three original evidence/duplicate controls, five author-identity counterexamples, five timestamp counterexamples and two valid current controls execute unchanged current production guards. No remote retrieval, factual grading, shared data mutation or invented real source receipt.')
print(json.dumps(result, indent=2))
