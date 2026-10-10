import collections, datetime, hashlib, json, pathlib, re, subprocess

root = pathlib.Path('/tmp/gpt-drops-B05-audit-20261009')
work = root / '.work/20261009-recovery'
job = root / 'jobs/B05-jamboree-turn-flow'
identity = json.loads((work / 'original-identity-receipt.json').read_text())
native = json.loads((work / 'native-source-tree.json').read_text())
paths = {e['path']: e for e in native['tree'] if e['type'] == 'blob' and (e['path'].startswith('jobs/B05-jamboree-turn-flow/') or e['path'] == '.github/workflows/B05.yml')}
def frozen():
    for path, e in paths.items():
        data = (root / path).read_bytes()
        assert hashlib.sha1(b'blob ' + str(len(data)).encode() + bytes([0]) + data).hexdigest() == e['sha'], path
frozen()
observations = []
for mode, expected in [('--structural', 0), ('--strict', 1)]:
    command = ['python', 'verify.py', mode] + (['--checksums'] if mode == '--structural' else [])
    r = subprocess.run(command, cwd=job, capture_output=True, text=True, timeout=45)
    out = r.stdout + r.stderr
    (work / ('original-' + mode[2:] + '.stdout')).write_text(out)
    assert r.returncode == expected, out
    observed = re.findall(r'^PASS ([A-Z0-9_]+): ([0-9]+)/([0-9]+)$', out, re.M)
    assert all(a == b for _, a, b in observed)
    expected_suites = 20 if mode == '--structural' else 19
    assert len(observed) == expected_suites
    original = (root / '.work/B05-hosted-ci' / (mode[2:] + '.stdout')).read_text()
    assert out == original
    if mode == '--strict':
        for phrase in ['FACTS_DUAL_SOURCE=37/95; FAIL', 'BONUS_CRITERIA_DUAL_SOURCE=3/9; FAIL', 'BONUS_TIE_PROCEDURES_EVIDENCED=0/9; FAIL', 'STRICT_RESEARCH_RESULT=NOT_MET; exit=1']:
            assert phrase in out
    observations.append({'command': command, 'exitCode': r.returncode, 'suites': len(observed), 'cases': sum(int(a) for _, a, _ in observed), 'completeOutputMatchesGenuineOfficial': True, 'outputSha256': hashlib.sha256(out.encode()).hexdigest()})
log = (work / 'original-full-hosted.log').read_text()
hosted = re.findall(r'^\S+ PASS ([A-Z0-9_]+): ([0-9]+)/([0-9]+)$', log, re.M)
assert len(hosted) == 39
assert all(a == b for _, a, b in hosted)
assert 'STRICT_RESEARCH_RESULT=NOT_MET; exit=1' in log
assert 'sha256sum -c' not in log or ': OK' in log
assert 'Artifact ID 11591030777' in log and '328023 bytes' in log
historical = json.loads((job / 'reports/historical-before-namu-four/snapshot.json').read_text())
assert historical['sourceHead'] == '91345bb1adc69328f0c696cb9f638fd6c20620ba'
assert len(historical['files']) == 75
sourceaudit = json.loads((job / 'reports/source-reopen-audit.json').read_text())
rowaudit = json.loads((job / 'reports/research-row-audit.json').read_text())
assert sourceaudit['sources'] == 26 and len(sourceaudit['captures']) == 52
assert sum(x['recoveredCount'] for x in sourceaudit['captures']) == 400
assert len(rowaudit['rows']) == rowaudit['rowsReviewedEachPass'] == 141
assert rowaudit['claimStatuses'] == {'single_source': 35, 'corroborated': 37, 'conflict': 3, 'unverified': 20}
frozen()
receipt = dict(identity)
receipt.update({'acceptedUtc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'scope': 'complete original hosted/native log, genuine whole official archive, actual original structural and strict commands, all historical files/audits/canonical rows and immutable source inputs accepted; original strict research is NOT MET', 'hostedPassRows': len(hosted), 'actualLocalOriginalCommands': observations, 'historicalFiles': 75, 'actualScopeAssertions': 538, 'actualScopeNegativeControls': 12, 'registeredQuotes': 200, 'fullSourcePasses': 2, 'quoteRecoveries': 400, 'rowsEachPass': 141, 'bonusCriteria': '3/9', 'bonusTieProcedures': '0/9', 'claimsCorroborated': '37/95', 'allOriginal156InputsUnchanged': True})
(work / 'ORIGINAL-E6-FULL-ACCEPTANCE.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({k:v for k,v in receipt.items() if k != 'files'}))
