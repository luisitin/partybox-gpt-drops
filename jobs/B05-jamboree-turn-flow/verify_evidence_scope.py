"""Check that the four literal B05 confirmations do not enlarge unrelated facts.

This is an integrity and scope check, not a game replay or a factual web reader.
The actual complete source pages remain private; public receipts retain short clips.
"""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path

BASE = '91345bb1adc69328f0c696cb9f638fd6c20620ba'
CHANGED = {'PRO08', 'EFFECT03', 'EFFECT04', 'EFFECT06'}
NAMU_URL = 'https://namu.wiki/w/%EC%8A%88%ED%8D%BC%20%EB%A7%88%EB%A6%AC%EC%98%A4%20%ED%8C%8C%ED%8B%B0%20%EC%9E%BC%EB%B2%84%EB%A6%AC'
QUOTES = {
    'NAMU-PRO08-1': '무조건 20코인씩 모으고, 멈춘 플레이어가 제시된 미니게임 [33] 6종류 중 원하는 미니게임을 결정할 수 있다.',
    'NAMU-EFFECT03-2': '모든 플레이어가 스타 강탈 칸을 받는다.',
    'NAMU-EFFECT04-3': '모든 플레이어가 더블 주사위를 받는다.',
    'NAMU-EFFECT06-4': '모든 플레이어의 보유 코인 2배',
}
EXTRA_OLD_SOURCE = {
    'GAME': {'GAME-PRO08-21': 'the player who lands on the space being able to choose the minigame'},
    'HOME': {
        'HOME-EFFECT03-15': 'All players receive a Star Steal Trap.',
        'HOME-EFFECT04-16': 'All players receive Double Dice.',
        'HOME-EFFECT06-17': "All players' coins double.",
    },
}

def read(root: Path, name: str):
    return json.loads((root / name).read_text(encoding='utf-8'))

def run(root: Path, data: dict) -> int:
    history = root / 'reports/historical-before-namu-four'
    snapshot = read(history, 'snapshot.json')
    count = 0
    def require(ok: bool, message: str):
        nonlocal count
        count += 1
        if not ok:
            raise AssertionError(message)
    require(snapshot['sourceHead'] == BASE, 'Historical source head drift')
    for item in snapshot['files']:
        target = history / item['storedPath']
        require(target.is_file() and not target.is_symlink(), 'Missing historical file')
        require(hashlib.sha256(target.read_bytes()).hexdigest() == item['sha256'], 'Historical bytes changed')
    old = {name: read(history, name + '.json') for name in ('claims', 'sources', 'bonusStars', 'strings', 'homestretch')}

    def core(d: dict):
        n = 0
        def check(ok: bool, message: str):
            nonlocal n
            n += 1
            if not ok:
                raise AssertionError(message)
        claims = {c['id']: c for c in d['claims']['claims']}
        original = {c['id']: c for c in old['claims']['claims']}
        check(set(claims) == set(original) and len(claims) == 95, 'Claim set changed')
        for cid, before in original.items():
            after = claims[cid]
            if cid not in CHANGED:
                check(after == before, 'Unrelated claim changed: ' + cid)
                continue
            check(after['text'] == before['text'] and after['phase'] == before['phase'], 'Factual wording/scope changed: ' + cid)
            check(after['status'] == 'corroborated' and after['confidence'] == before['confidence'] == 'medium', 'Status/confidence drift: ' + cid)
            check(set(after) == set(before), 'Claim field set changed')
            check(after['note'].startswith(before['note']), 'Original limit note removed')
            check(len(after['evidence']) == len(before['evidence']) + 1, 'Evidence shape changed')
            original_ev = copy.deepcopy(after['evidence'][0])
            original_ev['excerptIds'] = before['evidence'][0]['excerptIds']
            check(original_ev == before['evidence'][0], 'Original citation changed')
            check(after['evidence'][-1]['sourceId'] == 'NAMU', 'New source identity changed')
            check(after['evidence'][-1]['excerptIds'] == [next(x for x in QUOTES if cid in x)], 'New quotation scope changed')
        check(d['bonusStars'] == old['bonusStars'], 'Bonus/tie/policy data changed')
        check(d['strings'] == old['strings'], 'String/speaker/capture data changed')
        current_effects = {e['id']: e for e in d['homestretch']['effects']}
        old_effects = {e['id']: e for e in old['homestretch']['effects']}
        check(set(current_effects) == set(old_effects), 'Effect set changed')
        for eid, before in old_effects.items():
            after = copy.deepcopy(current_effects[eid])
            if before['claimId'] in CHANGED:
                check(after['status'] == 'corroborated' and after['sourceIds'] == before['sourceIds'] + ['NAMU'], 'Effect evidence/status drift')
                after['status'], after['sourceIds'] = before['status'], before['sourceIds']
            check(after == before, 'Effect factual fields changed: ' + eid)
        top = copy.deepcopy(d['homestretch']); top['effects'] = old['homestretch']['effects']
        check(top == old['homestretch'], 'Homestretch selection/unknown fields changed')
        src = {s['id']: s for s in d['sources']['sources']}
        previous_src = {s['id']: s for s in old['sources']['sources']}
        check(set(src) == set(previous_src) | {'NAMU'} and len(src) == 26, 'Source set drift')
        for sid, before in previous_src.items():
            after = copy.deepcopy(src[sid])
            extras = EXTRA_OLD_SOURCE.get(sid, {})
            check(after['excerpts'][:len(before['excerpts'])] == before['excerpts'], 'Original short quotations changed')
            check({q['id']: q['text'] for q in after['excerpts'][len(before['excerpts']):]} == extras, 'Additional source clips changed')
            after['excerpts'] = before['excerpts']
            check(after == before, 'Original source lineage/metadata changed')
        namu = src['NAMU']
        check(namu['url'] == NAMU_URL and namu['independenceGroup'] == 'namuwiki' and namu['kind'] == 'secondary', 'Original Korean lineage changed')
        check({q['id']: q['text'] for q in namu['excerpts']} == QUOTES, 'Original Korean quote catalog drift')
        check(sum(len(q['text'].split()) for q in namu['excerpts']) == 31, 'New article quote budget changed')
        check(all(len(q['text'].split()) <= 25 for q in namu['excerpts']), 'New clip exceeds budget')
        return n
    count += core(data)
    for phase in ('A', 'B'):
        for sid in [s['id'] for s in data['sources']['sources']]:
            capture = read(root, 'reports/source-captures/' + phase + '-' + sid + '.json')
            require(capture['sourceId'] == sid and capture['pass'] == phase, 'Current full-pass capture missing')
            require(capture['accessedDate'] == '2026-10-09' and capture['accessedAtUtc'].startswith('2026-10-09T'), 'Historical pass presented as fresh')
            require(all(q['recovered'] for q in capture['quotations']), 'Full-pass quotation not recovered')
    negative = []
    def bad(label, mutate):
        d = copy.deepcopy(data); mutate(d); negative.append((label, d))
    byid = lambda d, cid: next(c for c in d['claims']['claims'] if c['id'] == cid)
    bad('other claim promotion', lambda d: byid(d, 'PRO05').update(status='corroborated'))
    bad('reset conflict promotion', lambda d: byid(d, 'PRO06').update(status='corroborated'))
    bad('Bowser conflict removal', lambda d: byid(d, 'PRO09').update(status='corroborated'))
    bad('factual broadening', lambda d: byid(d, 'PRO08').update(text='Every Pro Space takes exactly 20 coins.'))
    bad('confidence inflation', lambda d: byid(d, 'PRO08').update(confidence='high'))
    bad('borrowed editorial lineage', lambda d: next(s for s in d['sources']['sources'] if s['id'] == 'NAMU').update(independenceGroup='mariowiki'))
    bad('translated mirror URL', lambda d: next(s for s in d['sources']['sources'] if s['id'] == 'NAMU').update(url=NAMU_URL.replace('namu.wiki', 'en.namu.wiki')))
    bad('old quotation modification', lambda d: d['sources']['sources'][0]['excerpts'][0].update(text='invented quotation'))
    bad('bonus tie invention', lambda d: d['bonusStars']['bonuses'][0]['tieRule'].update(value='all tied win'))
    bad('primary frame invention', lambda d: d['strings'][0].update(visualCaptureVerified=True))
    bad('effect cap invention', lambda d: next(e for e in d['homestretch']['effects'] if e['id'] == 'wallet-coins').update(detail='The wallet has no cap.'))
    bad('missing quote qualifier', lambda d: next(s for s in d['sources']['sources'] if s['id'] == 'NAMU')['excerpts'][0].update(text='20코인'))
    for label, invalid in negative:
        caught = False
        try:
            core(invalid)
        except AssertionError:
            caught = True
        require(caught, 'Deliberate scope defect escaped: ' + label)
    return count
