#!/usr/bin/env python3
"""Validate B05 structure; separately fail strict research acceptance for open gaps.

No network access is performed. Recheck provenance is a recorded manual audit,
not a claim that Python has re-watched the game or independently verified facts.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any
try:
    from jsonschema import Draft202012Validator, FormatChecker
    from jsonschema.exceptions import ValidationError, SchemaError
except ImportError:
    sys.exit('Install requirements: python -m pip install -r requirements.txt')
ROOT = Path(__file__).resolve().parent
FILES = ('claims', 'sources', 'strings', 'bonusStars', 'homestretch', 'recheck')
MAX_BYTES = 30_000_000

def reject_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f'Duplicate JSON key: {key}')
        result[key] = value
    return result

def load(name: str) -> Any:
    return json.loads((ROOT / name).read_text(encoding='utf-8'), object_pairs_hook=reject_duplicates)

def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)

def unique(rows: list[dict[str, Any]], field: str = 'id') -> dict[str, dict[str, Any]]:
    result = {r[field]: r for r in rows}
    require(len(result) == len(rows), f'Duplicate {field}')
    return result

def run(mode: str, checksums: bool) -> int:
    data = {name: load(name + '.json') for name in FILES}
    schema = load('schema.json')
    Draft202012Validator.check_schema(schema)
    validators = {name: Draft202012Validator({'$ref': '#/$defs/' + name, '$defs': schema['$defs']}, format_checker=FormatChecker()) for name in FILES}
    tests: list[tuple[str, int]] = []
    def passed(name: str, cases: int) -> None:
        tests.append((name, cases))
        print(f'PASS {name}: {cases}/{cases}')
    for name in FILES:
        validators[name].validate(data[name])
    passed('JSON_SCHEMA', 6)
    claims = unique(data['claims']['claims'])
    sources = unique(data['sources']['sources'])
    strings = unique(data['strings'])
    bonuses = unique(data['bonusStars']['bonuses'])
    effects = unique(data['homestretch']['effects'])
    audits = unique(data['recheck']['rows'], 'rowId')
    policies = unique(data['bonusStars']['awardPolicies'])
    passed('UNIQUE_IDS', 7)
    excerpts = {s['id']: unique(s['excerpts']) for s in sources.values()}
    reference_count = 0
    for c in claims.values():
        for e in c['evidence']:
            require(e['sourceId'] in sources, f'{c["id"]}: orphan source')
            require(all(x in excerpts[e['sourceId']] for x in e['excerptIds']), f'{c["id"]}: orphan excerpt')
            reference_count += 1
    for b in bonuses.values():
        require(b['criterionClaimId'] in claims, 'Orphan criterion')
        require(all(x in sources for x in b['sourceIds'] + [b['nameSourceId']]), 'Orphan bonus source')
        require(all(x in claims for x in b['selectionPolicyClaimIds'] + b['tieRule']['claimIds']), 'Orphan policy')
        require(b['criterionStatus'] == claims[b['criterionClaimId']]['status'], 'Criterion status drift')
        require(b['criterionConfidence'] == claims[b['criterionClaimId']]['confidence'], 'Criterion confidence drift')
    for h in effects.values():
        require(h['claimId'] in claims and all(x in sources for x in h['sourceIds']), 'Orphan effect reference')
    for p in policies.values():
        require(p['claimId'] in claims, 'Orphan policy claim')
        require(p['eligibleBonusIds'] is None or all(x in bonuses for x in p['eligibleBonusIds']), 'Orphan policy bonus')
    passed('CLAIM_SOURCE_REFERENCES', reference_count)
    passed('CATALOG_REFERENCES', len(bonuses) + len(effects) + len(policies))
    for t in strings.values():
        e = t['source']
        require(e['sourceId'] in sources and e['url'] == sources[e['sourceId']]['url'], 'String source mismatch')
        require(any(x.get('stringId') == t['id'] for x in excerpts[e['sourceId']].values()), 'Uncatalogued string')
        require(not t['visualCaptureVerified'] and e['timestamp'] is None, 'Invented capture or timestamp')
    passed('STRING_SOURCE_COMPLETENESS', len(strings))
    for s in sources.values():
        words = 0
        for e in s['excerpts']:
            text = e.get('text')
            if text is None:
                require(e['stringId'] in strings, 'Orphan string excerpt')
                text = strings[e['stringId']]['text']
            words += len(text.split())
        require(words <= 25, f'{s["id"]}: excerpt word budget exceeded ({words})')
    passed('SOURCE_EXCERPT_BUDGET', len(sources))
    independent = [c for c in claims.values() if c['status'] == 'corroborated']
    for c in independent:
        groups = {sources[e['sourceId']]['independenceGroup'] for e in c['evidence']}
        require(len(groups) >= 2, f'{c["id"]}: dependent-source double counting')
    require(sources['TRACKER']['independenceGroup'] == sources['BONUS']['independenceGroup'], 'Derived tracker counted independently')
    passed('CORROBORATION_LINEAGE_GUARD', len(independent) + 1)
    require(len(bonuses) == 9, 'Documented nine-category catalog mismatch')
    require(len(effects) == 8, 'Documented eight-effect catalog mismatch')
    passed('DOCUMENTED_CATALOG_COUNTS', 2)
    for b in bonuses.values():
        require(b['tieRule']['value'] is None and b['eligibilityMinimum'] is None and not b['counterEdgeCasesVerified'], 'Unknown bonus behavior replaced with a guess')
    require(data['bonusStars']['selectionAlgorithm'] is None and data['homestretch']['selectionProbabilities'] is None, 'Guessed random-selection algorithm')
    passed('UNKNOWN_BEHAVIOR_REMAINS_NULL', len(bonuses) + 2)
    expected = {'claim:' + x for x in claims} | {'bonus:' + x for x in bonuses} | {'effect:' + x for x in effects} | {'string:' + x for x in strings}
    require(set(audits) == expected, 'Audit rows omit or invent a retained record')
    reopen = {(r['pass'], r['sourceId']): r for r in data['recheck']['sourceReopens']}
    require(len(reopen) == len(data['recheck']['sourceReopens']), 'Duplicate source reopen')
    for phase in ('A', 'B'):
        for sid, source in sources.items():
            require((phase, sid) in reopen, 'Missing source reopening')
            r = reopen[phase, sid]
            require(r['opened'] and r['references'], 'Incomplete reopen record')
        for row in audits.values():
            kind, rid = row['rowId'].split(':', 1)
            canonical = {'claim': claims, 'bonus': bonuses, 'effect': effects, 'string': strings}[kind][rid]
            if kind == 'claim':
                source_ids = [e['sourceId'] for e in canonical['evidence']]
            elif kind == 'string':
                source_ids = [canonical['source']['sourceId']]
            else:
                source_ids = canonical['sourceIds']
            require(all((phase, sid) in reopen for sid in source_ids), 'Row source not reopened')
            require(row['pass' + phase] in data['recheck']['resultMeanings'], 'Invalid audit decision')
            if kind == 'claim':
                require(row['pass' + phase] == canonical['status'], 'Claim audit status mismatch')
        passed('RECORDED_ROW_RECHECK_' + phase, len(expected))
        passed('RECORDED_SOURCE_REOPEN_' + phase, len(sources))
    # Negative cases verify rejection, rather than asserting tests that never ran.
    negatives: list[tuple[str, Any]] = []
    x = copy.deepcopy(data['strings']); del x[0]['source']; negatives.append(('strings', x))
    x = copy.deepcopy(data['strings']); x[0]['confidence'] = 'certain'; negatives.append(('strings', x))
    x = copy.deepcopy(data['strings']); x[0]['unexpected'] = True; negatives.append(('strings', x))
    x = copy.deepcopy(data['strings']); x[0]['source']['url'] = 'not-a-url'; negatives.append(('strings', x))
    x = copy.deepcopy(data['bonusStars']); x['bonuses'][0]['tieRule']['value'] = 'all tied win'; negatives.append(('bonusStars', x))
    x = copy.deepcopy(data['claims']); x['claims'][0]['status'] = 'verified'; negatives.append(('claims', x))
    for name, invalid in negatives:
        require(not validators[name].is_valid(invalid), 'Deliberate schema defect escaped detection')
    caught = 0
    for action in (lambda: unique([{'id': 'x'}, {'id': 'x'}]), lambda: json.loads('{"a":1,"a":2}', object_pairs_hook=reject_duplicates)):
        try:
            action()
        except (AssertionError, ValueError):
            caught += 1
    require(caught == 2, 'Deliberate duplicate escaped detection')
    passed('NEGATIVE_REJECTION_CASES', len(negatives) + caught)
    files = [p for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    require(all(p.stat().st_size <= MAX_BYTES for p in files), 'File exceeds 30 MB')
    passed('FILE_SIZE_LIMIT', len(files))
    if checksums:
        lines = (ROOT / 'SHA256SUMS.txt').read_text().splitlines()
        expected_paths: set[str] = set()
        for line in lines:
            digest, rel = line.split('  ', 1)
            target = (ROOT / rel).resolve()
            require(ROOT in target.parents and target.is_file(), 'Unsafe or absent checksum path')
            require(rel not in expected_paths, 'Duplicate checksum path')
            expected_paths.add(rel)
            require(hashlib.sha256(target.read_bytes()).hexdigest() == digest, 'Checksum mismatch: ' + rel)
        require(expected_paths == {p.relative_to(ROOT).as_posix() for p in files if p.name != 'SHA256SUMS.txt'}, 'Checksum manifest incomplete')
        passed('SHA256_MANIFEST', len(lines))
    print(f'STRUCTURAL_RESULT=PASS; suites={len(tests)}; seed=N/A (deterministic)')
    if mode == 'strict':
        criteria = sum(b['criterionStatus'] == 'corroborated' for b in bonuses.values())
        print(f'FACTS_DUAL_SOURCE={len(independent)}/{len(claims)}; FAIL')
        print(f'BONUS_CRITERIA_DUAL_SOURCE={criteria}/{len(bonuses)}; FAIL')
        print(f'FULL_BONUS_BEHAVIOR_VERIFIED=0/{len(bonuses)}; FAIL')
        print(f'STRING_PRIMARY_CAPTURES=0/{len(strings)}; FAIL')
        print('FULL_TIMELINE_AND_STRING_COVERAGE=INCOMPLETE; FAIL')
        print('STRICT_RESEARCH_RESULT=NOT_MET; exit=1')
        return 1
    return 0

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--structural', action='store_true')
    group.add_argument('--strict', action='store_true')
    parser.add_argument('--checksums', action='store_true')
    args = parser.parse_args()
    try:
        return run('strict' if args.strict else 'structural', args.checksums)
    except (OSError, ValueError, AssertionError, ValidationError, SchemaError) as error:
        print(f'VALIDATION_ERROR: {error}', file=sys.stderr)
        return 2

if __name__ == '__main__':
    raise SystemExit(main())
