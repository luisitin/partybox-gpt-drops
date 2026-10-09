"""Validate eleven shared actions and restore the exact accepted earlier proof view."""
import copy, hashlib, importlib.util, json, re, unicodedata
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASELINE = 'dd1e54f90b1202c03c8688b7bd074ab63caabd54'
BASE_DATA = '134c35f54a54c303efcde89e1fb2646dceefa6a3dfded067d2321dcfca2d7fe0'
BASE_SOURCES = '142edef1568541ce5b02577ffda0f83044f7466d1b6b16eaa75f57955b6e3749'
BASE_REOPENS = ['d5f9346a7baf258c58804543bfc388cc890b399e857711e1e4022a5d8952cfcb', '7900d093eb2915c7d2f2fbde71445377415af166fbfb893dc22b0ac34f0a1651']
CONFIG = {
 'MG001': ('Lumber Tumble', 'Players cross a bridge between logs. They watch for gaps in the path.', '두 개의 통나무 사이에서 다리를 건너야 하며 뒤로 갈수록 두 통나무가 앞이나 뒤로 움직이기 때문에 [117] 앞에 바닥이 어디가 없는지 파악을 해두는 편이 좋다.', ['Players attempt to stay on a maze-like bridge.', 'The players cannot jump over the gaps and must go around them instead.']),
 'MG003': ('Camera-Ready', 'Players move the camera and change its zoom. They use a reference photograph to line up their shot.', '화면을 움직이는 것 뿐만 아니라 확대 및 축소를 해야하기 때문에 보기의 사진에서 조형물을 참고하면서 사진을 찍으면 높은 점수를 받기 쉽다.', ['Players need to move their cameras, zoom in, zoom out, and wait for the perfect time before taking the picture.', 'Players are shown a picture at the beginning of each round and have to attempt to take an exact copy of the shown picture.']),
 'MG017': ('Hammer It Home', 'Players hammer nails. They adjust their power for nails at different depths.', '깊게 들어가 있는 못은 재빠르게 치고 들어가지 않은 못은 힘을 모아서 치자.', ['Different nails appear at different heights, with the higher ones requiring more power.']),
 'MG028': ('Stamp Out!', 'Players cover areas with their own color. They can paint over areas already colored by opponents.', '다른 사람의 색 위에 자신의 색으로 덧칠하면 효율적으로 진행할 수 있다.', ['Each player tries to cover as much of the drawing pad they are on with stamps matching their color,', 'including over areas already covered by opponents.']),
 'MG043': ("Pickin' Produce", 'Players sort fruit on conveyor belts. They pass fruit to their partner using the middle belt.', '즉, 각자 정리할 수 없는 과일이 무조건 한 종류 있다. 팀원이 정리할 수 있도록 빠르게 중앙 컨베이어, 특히 시작 부분으로 넘겨 주자.', ['Sort the fruits in teams of two. Work together to send bananas, apples, and watermelons along the correct conveyor belts.', 'players are placed on a wooden platform between two conveyor belts, with the remaining one being accessible only for the other player.']),
 'MG082': ("Spike's Gambit", 'Players collect coins on a sloping hill. They avoid the spiked rollers that come down the hill.', '2층에 걸친 오르막 언덕에 떨어지는 코인을 모으는 게임. 가시롤러에 맞으면 일정 거리만큼 굴러 떨어지고, 거대가시롤러에 맞으면 맨 밑까지 굴러 떨어진다.', ['Coins regularly drop from the sky into the sand and must be touched to be collected.', 'Regularly, the three top Spikes spew spiked rollers.']),
 'MG084': ('Lane Change', 'Players switch lanes to collect coins. They steer clear of obstacles along the route.', '차선을 변경해가며 코인을 모으는 미니게임. 장애물에 부딪히면 속도가 초기화된다.', ['Players can move between each lane next to each other as they advance along the track, collecting coins as they do so.']),
 'MG085': ('Coin Conveyor', 'Players arrange moving puzzle pieces. They fill and clear lines to collect coins.', '컨베이어 벨트 위에서 움직이는 퍼즐 조각을 잘 정렬해서 한번에 많은 열을 지우며 코인을 획득하는 미니게임.', ['The player must take the pieces and place them on a 7-by-7 grid.', 'When a row or column is filled, it is cleared.', 'The coins it contained get collected and the Bob-ombs it contained clear the surrounding blocks.']),
 'MG086': ('Which Door Has More?', 'Players compare the numbers of objects in a room. They choose the group with more objects.', '오브젝트 방에서 두 오브젝트의 수를 비교해 더 많은 쪽을 골라 코인 방으로 가는 미니게임.', ['To accomplish this, the player must determine which of the species present on the floor is of greater quantity.']),
 'MG088': ('Burning Bridges', 'Players jump over incoming fireballs. They time their jumps to avoid larger fireballs.', '소, 중, 대형 불덩이가 양 끝에서 날아오고 그것을 점프로 피하면 된다.', ['These statues frequently spit fireballs, which players must jump over or they are eliminated.', 'Overtime, the fireballs increase in speed and larger fireballs can appear.']),
 'MG092': ('The Floor Is Falling', 'Players watch floor panels change color. They avoid panels about to disappear.', '시간이 지나면 초록색, 노란색, 빨간색으로 번쩍이는 시간이 점점 빨라지며 번쩍이지 않는 곳으로 이동하는 것이 좋다.', ['Parts of the floor that are about to disappear change colors from green to yellow to red before disappearing.', "Watch the panels, be careful where you stand, and don't fall!"]),
}
def require(ok, message):
 if not ok: raise AssertionError(message)
def digest(value): return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
def read(name): return json.loads((ROOT / name).read_text())
def normalize(text):
 text = re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', text)).strip()
 text = re.sub(r"\s+([.,;:!?\)'])", r'\1', text)
 return re.sub(r'\(\s+', '(', text)

def validate(proof, data, sources, reopens):
 require(proof['baselineSourceCommit'] == BASELINE and proof['copyrightBodiesPublished'] is False, 'Wrong baseline or published full body')
 require(proof['scope'] == 'Exactly eleven shared-action summaries; authored Korean tips exclude Nintendo-description cells and self-attributed instruction advice.', 'Wrong batch scope')
 require(len(proof['repairs']) == len(CONFIG) and {r['id'] for r in proof['repairs']} == set(CONFIG), 'Wrong repair targets')
 require(proof['excludedInstructionAttributedCandidate'] == 'MG022', 'Instruction reprint candidate silently adopted')
 require(len(proof['freshWikiCaptures']) == 24 and proof['actualFreshHttpRequests'] == 24, 'Actual research requests changed')
 fresh = {(c['sourceId'], c['pass']): c for c in proof['freshWikiCaptures']}
 require(len(fresh) == 24, 'Duplicate A/B request')
 for ident in ['W' + x[2:] for x in CONFIG] + ['W022']:
  a, b = fresh[(ident, 1)], fresh[(ident, 2)]
  require(datetime.fromisoformat(b['startedUTC']) > datetime.fromisoformat(a['completedUTC']), 'Pass B preceded A')
  for c in [a, b]: require(c['curlExitCode'] == 0 and c['httpEffectiveTls'][0] == '200' and c['httpEffectiveTls'][2] == '0' and c['tlsVerificationDisabled'] is False and c['bodyBytes'] > 0, 'Failed native source response')
 rows = {r['id']: r for r in data['minigames']}; sb = {s['id']: s for s in sources['sources']}
 require(len(sb) == len(sources['sources']) == 146, 'Source set changed')
 restored = copy.deepcopy(data)
 for repair in proof['repairs']:
  ident = repair['id']; name, summary, korean, wiki_texts = CONFIG[ident]; row = rows[ident]; wid = 'W' + ident[2:]
  require(row['name'] == name == repair['name'] and row['summary'] == summary == repair['summary'], 'Shared actions changed')
  require(repair['quotedColumn'] == 'authoredTip' and repair['originalTipSha256Passes'][0] == repair['originalTipSha256Passes'][1], 'Description column or changed original tip')
  require(repair['koreanQuote'] == korean and 6 <= len(korean.split()) <= 25, 'Wrong bounded original-language quotation')
  require(repair['beforeGameplayEvidence']['status'] == 'single_source' and row['fieldEvidence']['gameplay']['status'] == 'corroborated', 'Unexpected status promotion')
  nq = 'NAMU_BASE_batch_' + ident; new_ids = [wid + '_batch_' + str(i + 1) for i in range(len(wiki_texts))]
  expected_ids = repair['beforeGameplayEvidence']['quoteIds'] + new_ids + [nq]
  require(row['fieldEvidence']['gameplay']['quoteIds'] == expected_ids, 'Lost or unrelated gameplay citation')
  require(sb['NAMU_BASE']['publisherLineage'] == 'namuwiki' and sb[wid]['publisherLineage'] == 'mariowiki', 'Independent publisher families changed')
  for source, ids, texts in [(sb['NAMU_BASE'], [nq], [korean]), (sb[wid], new_ids, wiki_texts)]:
   qb = {q['id']: q for q in source['quotes']}
   for qid, text in zip(ids, texts):
    require(qb[qid]['text'] == text and 6 <= len(text.split()) <= 25, 'Missing literal bounded action quotation')
    for n in [1, 2]:
     r = next(r for r in reopens[n - 1] if r['sourceId'] == source['id'])
     require(qid in r['recoveredQuoteIds'] and any(q['id'] == qid and q['text'] == text for q in r['quotes']), 'Quote absent from full second pass')
     require(qid in source['passes'][n - 1]['recoveredQuoteIds'], 'Quote absent from registered pass')
  for n in [1, 2]:
   p = sb[wid]['passes'][n - 1]; c = fresh[(wid, n)]; r = next(r for r in reopens[n - 1] if r['sourceId'] == wid)
   require(c['url'] == sb[wid]['url'] == r['url'], 'Native URL or identity changed')
   require(p['bodyBytes'] == r['bodyBytes'] == c['bodyBytes'] and p['bodySha256'] == r['bodySha256'] == c['bodySha256'], 'Full body witness changed')
   require(r['requestBeganUTC'] == c['startedUTC'] and r['requestCompletedUTC'] == c['completedUTC'] and r['httpEffectiveTls'] == c['httpEffectiveTls'], 'Request time or transport invented')
   require(repair['wikiOverviewSha256Passes'][n - 1] == repair['wikiOverviewSha256Passes'][0] and p['fullArticleScopeSha256'] == repair['wikiFullArticleSha256Passes'][n - 1], 'Full narrative scope changed')
  old = next(x for x in restored['minigames'] if x['id'] == ident); old['summary'] = repair['beforeSummary']; old['fieldEvidence']['gameplay'] = copy.deepcopy(repair['beforeGameplayEvidence'])
 require(digest(restored) == proof['baselineDataSha256'] == BASE_DATA, 'Unrelated accepted row value/evidence changed')
 require(proof['baselineRowHashes'] == [{'id': r['id'], 'sha256': digest(r)} for r in restored['minigames']], 'Exact 132-row baseline changed')
 affected = {'NAMU_BASE'} | {'W' + ident[2:] for ident in CONFIG}
 require(set(proof['beforeSources']) == affected and all(s['id'] == ident for ident, s in proof['beforeSources'].items()), 'Wrong historical source view')
 historical = copy.deepcopy(sources)
 historical['sources'] = [copy.deepcopy(proof['beforeSources'].get(s['id'], s)) for s in historical['sources']]
 require(digest(historical) == proof['baselineSourcesSha256'] == BASE_SOURCES and proof['baselineSourceHashes'] == {s['id']: digest(s) for s in historical['sources']}, 'Accepted original source/quotation/pass changed')
 for ident in affected:
  source, before = sb[ident], proof['beforeSources'][ident]
  require({k: v for k, v in source.items() if k not in ['quotes', 'uniqueQuotedWords', 'passes']} == {k: v for k, v in before.items() if k not in ['quotes', 'uniqueQuotedWords', 'passes']}, 'Accepted source metadata changed')
  require(source['quotes'][:len(before['quotes'])] == before['quotes'], 'An existing source quotation changed')
  expected_new = {'NAMU_BASE_batch_' + x for x in CONFIG} if ident == 'NAMU_BASE' else {ident + '_batch_' + str(i + 1) for i in range(len(CONFIG['MG' + ident[1:]][3]))}
  require({q['id'] for q in source['quotes'][len(before['quotes']):]} == expected_new and len(source['quotes']) == len(before['quotes']) + len(expected_new), 'An unreviewed quotation added')
  require(len(source['passes']) == 2 and all(p['recoveredQuoteIds'] == [q['id'] for q in source['quotes']] for p in source['passes']), 'Incomplete source pass quotation set')
 h_reopens = [[copy.deepcopy(proof['beforeReopens'][str(n)].get(r['sourceId'], r)) for r in rs] for n, rs in enumerate(reopens, 1)]
 require([digest(r) for r in h_reopens] == proof['baselineReopensSha256Passes'] == BASE_REOPENS, 'Accepted complete A/B baseline changed')
 for source in sources['sources']:
  require(source['uniqueQuotedWords'] == sum(len(text.split()) for text in {q['text'] for q in source['quotes']}) <= 200, 'Source quotation budget exceeded')
 require(sb['NAMU_BASE']['uniqueQuotedWords'] == 195 and len(sb['NAMU_BASE']['quotes']) == 13, 'Earlier Korean history lost or unreviewed clip added')
 prior = read('reports/namu-gameplay-recovery.json')
 require(proof['retainedNamuCaptures'] == prior['retainedActualCaptures'] and proof['newNamuHttpRequests'] == 0, 'Namu source recapture invented')
 for n in [1, 2]:
  before = proof['beforeSources']['NAMU_BASE']['passes'][n - 1]; current = sb['NAMU_BASE']['passes'][n - 1]
  require({k: v for k, v in current.items() if k != 'recoveredQuoteIds'} == {k: v for k, v in before.items() if k != 'recoveredQuoteIds'}, 'Retained Namu capture altered')
 spec = importlib.util.spec_from_file_location('batch_unicode_rule', ROOT / 'quote-support-check.py'); qsc = importlib.util.module_from_spec(spec); spec.loader.exec_module(qsc)
 classification = [{'id': q['id'], 'substantive': qsc.substantive(q['text'])} for s in historical['sources'] for q in s['quotes']]
 require(len(classification) == 1900 and classification == proof['baselineQuoteClassifications'], 'Any earlier quote classification changed')
 require(sum(e['status'] == 'corroborated' for r in data['minigames'] for e in r['fieldEvidence'].values()) == 299, 'Unexpected fact coverage')
 return restored, historical, h_reopens

def historical_view(data, sources, reopens):
 path = ROOT / 'reports/namu-batch-recovery.json'
 if not path.exists(): return data, sources, reopens
 return validate(read('reports/namu-batch-recovery.json'), data, sources, reopens)

def run():
 proof = read('reports/namu-batch-recovery.json'); data = read('minigames.json'); sources = read('catalogue-sources.json'); reopens = [read('reports/source-reopens-pass' + p + '.json') for p in 'AB']
 validate(proof, data, sources, reopens)
 for number in range(10):
  p, d, s, rs = copy.deepcopy(proof), copy.deepcopy(data), copy.deepcopy(sources), copy.deepcopy(reopens)
  if number == 0: p['repairs'][0]['quotedColumn'] = 'NintendoDescription'
  elif number == 1: p['repairs'][0]['summary'] += ' Exact timer is 10 seconds.'
  elif number == 2: next(x for x in s['sources'] if x['id'] == 'NAMU_BASE')['publisherLineage'] = 'mariowiki'
  elif number == 3: next(x for x in rs[1] if x['sourceId'] == 'W001')['recoveredQuoteIds'].pop()
  elif number == 4: p['freshWikiCaptures'][0]['bodySha256'] = '0' * 64
  elif number == 5: d['minigames'][1]['timeLimit']['wholeGameSeconds'] = 999
  elif number == 6: p['beforeSources']['W001']['quotes'][0]['text'] = 'Changed historical quotation'
  elif number == 7: p['baselineQuoteClassifications'][0]['substantive'] = not p['baselineQuoteClassifications'][0]['substantive']
  elif number == 8: p['excludedInstructionAttributedCandidate'] = None
  elif number == 9: p['beforeReopens']['1']['W001']['requestCompletedUTC'] = '2026-10-09T03:00:00Z'
  try: validate(p, d, s, rs)
  except (AssertionError, KeyError): pass
  else: raise AssertionError('Malformed batch proof accepted')
 return [{'name': 'Eleven independent authored-tip actions, 24 actual native requests and exact accepted 132-row/146-source baseline preservation', 'caseCount': 1900 + 132 + 146 + 24 + 44, 'passed': True, 'seed': None, 'detail': 'Retained original Korean Tip cells only; Nintendo-description cells and instruction-attributed Gate candidate excluded; all source budgets retained.'}, {'name': 'Ten malformed batch source, capture, scope, history and classification proofs rejected', 'caseCount': 10, 'passed': True, 'seed': None, 'detail': 'No category, exact control, timer, scoring, tie, payout or roster promotion.'}]

if __name__ == '__main__': print(json.dumps(run(), indent=2))
