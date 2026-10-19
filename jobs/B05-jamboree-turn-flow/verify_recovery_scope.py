"""Preserve the original four-rule audit and check one later literal corroboration.

The genuine original checked delivery supplies the legacy data, not a projection
constructed by undoing a current mutation. The existing scope checker still runs
all of its checks and malformed fixtures. This stage independently confines the
current amendment to ROUND01 and one separately authored source.
"""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path
import zipfile

ORIGINAL_HEAD = 'e6d75baacd0c8777737dd1d8db5765a81215ffdd'
OFFICIAL_SHA256 = '4efe6f982e93b01eab9af78e6bd1a59fb497da8c24433494a73402537b6637ef'
MAC_URL = 'https://themacweekly.com/2024/11/aint-no-party-like-a-super-mario-party-jamboree/'
CLIPS = {'MACW-ROUND01-1': 'A game has four players taking turns rolling dice to move, with a minigame for coins', 'MACW-ROUND01-2': 'at the end of each round.'}
NOTE = ' Independently corroborated by Scarlet Dunning\'s separately authored firsthand Jamboree review, introductory four-player/round paragraph. Its later Lucky Bonus example conflicts with the retained catalog and is excluded. No vote, interruption priority, final-round exception, payout, counter, tie or primary-frame claim is added.'
EVIDENCE = {'sourceId': 'MACW', 'locator': 'Introductory four-player board-game description before Classic Game Mode', 'excerptIds': list(CLIPS)}
OLD_CALL = "    passed('FOUR_LITERAL_CORE_SCOPE', scope['run'](ROOT, data))"
NEW_CALL = "    legacy_data, recovery_cases = runpy.run_path(str(ROOT / 'verify_recovery_scope.py'))['run'](ROOT, data)\n    passed('FOUR_LITERAL_CORE_SCOPE', scope['run'](ROOT, legacy_data))\n    passed('ROUND01_RECOVERY_SCOPE', recovery_cases)"

def run(root: Path, data: dict) -> tuple[dict, int]:
    evidence = root / 'reports/20261009-recovery'
    archive = evidence / 'original-e6-checked-delivery.zip'
    raw = archive.read_bytes()
    assert len(raw) == 328023 and hashlib.sha256(raw).hexdigest() == OFFICIAL_SHA256
    receipt = json.loads((evidence / 'original-e6-full-acceptance.json').read_text())
    assert receipt['sourceHead'] == ORIGINAL_HEAD and receipt['officialArtifact'] == 11591030777
    native = {r['path']: r for r in receipt['files']}
    assert len(native) == 156
    with zipfile.ZipFile(archive) as z:
        assert len(z.infolist()) == len(set(z.namelist())) == 158 and z.testzip() is None
        for path, recorded in native.items():
            b = z.read(path)
            assert len(b) == recorded['bytes']
            assert hashlib.sha1(b'blob ' + str(len(b)).encode() + bytes([0]) + b).hexdigest() == recorded['gitBlobSha']
        prefix = 'jobs/B05-jamboree-turn-flow/'
        legacy = {name: json.loads(z.read(prefix + name + '.json')) for name in ('claims', 'sources', 'bonusStars', 'strings', 'homestretch')}
        for relative in ('schema.json', 'requirements.txt', 'verify_evidence_scope.py'):
            assert (root / relative).read_bytes() == z.read(prefix + relative)
        assert (root.parent.parent / '.github/workflows/B05.yml').read_bytes() == z.read('.github/workflows/B05.yml')
        assert (root / 'verify.py').read_text() == z.read(prefix + 'verify.py').decode().replace(OLD_CALL, NEW_CALL)
        for path in native:
            if path.startswith(prefix + 'reports/historical-before-namu-four/'):
                assert (root / path[len(prefix):]).read_bytes() == z.read(path)

    def core(current: dict) -> int:
        count = 0
        def check(ok: bool, message: str):
            nonlocal count
            count += 1
            if not ok:
                raise AssertionError(message)
        before_claims = legacy['claims']['claims']
        after_claims = current['claims']['claims']
        check([c['id'] for c in after_claims] == [c['id'] for c in before_claims], 'Claim set/order changed')
        for before, after in zip(before_claims, after_claims):
            if before['id'] != 'ROUND01':
                check(before == after, 'Unrelated claim changed: ' + before['id'])
                continue
            wanted = copy.deepcopy(before)
            wanted['status'] = 'corroborated'
            wanted['note'] += NOTE
            wanted['evidence'].append(EVIDENCE)
            check(after == wanted, 'ROUND01 wording, confidence, citation or limitation drift')
        top = copy.deepcopy(current['claims']); top['claims'] = before_claims
        check(top == legacy['claims'], 'Claim metadata changed')
        for name in ('bonusStars', 'strings', 'homestretch'):
            check(current[name] == legacy[name], 'Unrelated catalog changed: ' + name)
        before_sources = legacy['sources']['sources']
        after_sources = current['sources']['sources']
        check(len(after_sources) == len(before_sources) + 1 == 27, 'Source set changed')
        check(after_sources[:-1] == before_sources, 'Original source lineage or quotations changed')
        mac = after_sources[-1]
        check(mac['id'] == 'MACW' and mac['url'] == MAC_URL, 'New source identity drift')
        check(mac['independenceGroup'] == 'mac-weekly-scarlet-dunning' and mac['kind'] == 'hands_on_review', 'New source lineage drift')
        check({c['id']: c['text'] for c in mac['excerpts']} == CLIPS, 'New full-qualifier quotation drift')
        check(sum(len(c['text'].split()) for c in mac['excerpts']) == 22, 'New source quota drift')
        check('Lucky Bonus' in mac['notes'] and 'excluded' in mac['notes'], 'Source reliability limitation removed')
        top = copy.deepcopy(current['sources']); top['sources'] = before_sources
        check(top == legacy['sources'], 'Source metadata changed')
        return count

    count = core(data)
    invalid = []
    def defect(label, change):
        d = copy.deepcopy(data); change(d); invalid.append((label, d))
    claim = lambda d, cid: next(x for x in d['claims']['claims'] if x['id'] == cid)
    source = lambda d, sid: next(x for x in d['sources']['sources'] if x['id'] == sid)
    defect('unrelated promotion', lambda d: claim(d, 'PRO05').update(status='corroborated'))
    defect('factual broadening', lambda d: claim(d, 'ROUND01').update(text='Every interruption ends every round.'))
    defect('confidence inflation', lambda d: claim(d, 'ROUND01').update(confidence='high'))
    defect('missing independent citation', lambda d: claim(d, 'ROUND01')['evidence'].pop())
    defect('missing limitation', lambda d: claim(d, 'ROUND01').update(note=''))
    defect('same Nintendo lineage', lambda d: source(d, 'MACW').update(independenceGroup='nintendo'))
    defect('unrelated URL', lambda d: source(d, 'MACW').update(url='https://example.com/'))
    defect('changed original source', lambda d: source(d, 'NAMU')['excerpts'][0].update(text='20코인'))
    defect('lost cardinality qualifier', lambda d: source(d, 'MACW')['excerpts'][0].update(text='A game has players'))
    defect('lost round boundary qualifier', lambda d: source(d, 'MACW')['excerpts'][1].update(text='at the end'))
    defect('bonus guess', lambda d: d['bonusStars']['bonuses'][0]['tieRule'].update(value='all tied win'))
    defect('frame invention', lambda d: d['strings'][0].update(visualCaptureVerified=True))
    defect('counter inference', lambda d: d['bonusStars']['bonuses'][5].update(counterEdgeCasesVerified=True))
    defect('overflow inference', lambda d: d['homestretch']['effects'][5].update(detail='No coin cap.'))
    for label, bad in invalid:
        caught = False
        try:
            core(bad)
        except AssertionError:
            caught = True
        if not caught:
            raise AssertionError('Malformed recovery escaped: ' + label)
        count += 1
    return legacy, count
