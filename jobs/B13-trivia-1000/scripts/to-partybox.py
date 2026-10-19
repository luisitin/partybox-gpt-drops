#!/usr/bin/env python3
"""B13 -> PartyBox lightning-round adapter (pure data mapping, no network, no game code).

Reads the held rows in categories/*.json and writes the PartyBox content files that
games/lightning-round/content/ expects. The held rows are never edited: exclusions and
mapping decisions live in partybox/exclusions.json and in the rule tables below.

  python3 scripts/to-partybox.py --out <dir>
      Writes <dir>/questions.json (PartyBox pack shape {"items": [...]}),
      <dir>/content-pack-origins.added.json (origin rows to append to content-pack-origins.json),
      <dir>/funfacts.json (id -> one-line fact; PartyBox has no funFact field),
      <dir>/sources.json (id -> publisher, URL and brief quotes, for attribution),
      <dir>/es-dropped.json (English ids to list under "dropped" in questions.es.json),
      <dir>/fit-report.json (per-row limit checks, counts, rule hits).

  python3 scripts/to-partybox.py --refresh --bank <PartyBox questions.json>
      Recomputes partybox/exclusions.json and partybox/overlap-candidates.json against a
      PartyBox bank. Needs the bank file; the bank's question text is never written out.

  python3 scripts/to-partybox.py --self-test

Constants copied from games/lightning-round/content/schema.ts (PartyBox checkout 26b85ba6).
Re-copy them at port time: the port must validate against the schema the port lands on.
"""
import argparse
import glob
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
JOB = os.path.dirname(HERE)

# ---- PartyBox schema constants (games/lightning-round/content/schema.ts) -------------
PB_CATEGORIES = [
    'geography', 'stem', 'history', 'arts-and-literature', 'sports', 'food-and-drink',
    'nature', 'language', 'entertainment', 'everyday-life', 'board-and-card-games',
    'world-heritage', 'museum-collections', 'ig-nobel-science',
]
PB_SUBCATEGORIES = {
    'geography': ['capitals', 'cities-and-landmarks', 'physical-geography', 'flags-and-borders', 'world-regions'],
    'stem': ['physics', 'chemistry', 'biology', 'astronomy-and-space', 'math', 'engineering-and-technology', 'computing'],
    'history': ['ancient-world', 'medieval-and-renaissance', 'modern-history', 'us-history', 'leaders-and-royals', 'wars-and-revolutions', 'inventions-and-discoveries'],
    'arts-and-literature': ['painting-and-sculpture', 'novels-and-authors', 'poetry-and-plays', 'mythology-and-folklore', 'architecture-and-design', 'classical-music-and-dance'],
    'sports': ['basketball', 'football', 'baseball', 'soccer', 'olympics', 'tennis-and-golf', 'hockey', 'motorsport-and-more'],
    'food-and-drink': ['world-cuisines', 'ingredients', 'cooking-and-kitchen', 'drinks', 'sweets-and-desserts'],
    'nature': ['mammals', 'birds-reptiles-and-fish', 'insects-and-sea-life', 'plants-and-trees', 'earth-and-weather', 'human-body'],
    'language': ['vocabulary', 'grammar-and-spelling', 'idioms-and-phrases', 'world-languages', 'word-origins'],
    'entertainment': ['movies', 'tv-shows', 'pop-music', 'video-games', 'comics-and-animation'],
    'everyday-life': ['brands-and-logos', 'holidays-and-traditions', 'money-and-business', 'travel-and-transport', 'units-and-measures'],
    'board-and-card-games': ['tabletop-rules'],
    'world-heritage': ['heritage-sites'],
    'museum-collections': ['collection-artists'],
    'ig-nobel-science': ['unlikely-research'],
}
PB_DIFFICULTY = {1: 'easy', 2: 'medium', 3: 'hard'}
PB_ID_RE = re.compile(r'^[a-z]{3}-\d{3,4}$')
PB_ID_PREFIX = 'tri'  # no bank id starts with "tri-" (checked by --refresh)

# ---- B13 -> PartyBox mapping rules ---------------------------------------------------
# Each B13 category: (default PartyBox category, default subcategory, rules).
# A rule is (regex, PartyBox category or None to keep the default, subcategory); first match wins.
RULES = {
    'us-geography': ('geography', 'cities-and-landmarks', [
        (r'capital', None, 'capitals'),
        (r'flag|border|admitted|statehood|became a state|joined the union', None, 'flags-and-borders'),
        (r'river|lake|mountain|peak|desert|valley|canyon|falls|coast|volcano|glacier|island|bay\b|sea\b|plain|basin|forest|range|reef|cave', None, 'physical-geography'),
        (r'region|midwest|northeast|southwest|pacific|appalach|great plains|south\b|north\b|west\b', None, 'world-regions'),
    ]),
    'world-geography': ('geography', 'cities-and-landmarks', [
        (r'capital', None, 'capitals'),
        (r'flag|border', None, 'flags-and-borders'),
        (r'river|lake|mountain|peak|desert|volcano|glacier|island|ocean|sea\b|reef|falls|coast|plain|range|lagoon|rainforest|archipelago|canyon|waterfall|savanna|steppe|baikal|everest|kilimanjaro', None, 'physical-geography'),
        (r'continent|region|hemisphere|peninsula|country|countries|nation|archipelago|territory', None, 'world-regions'),
    ]),
    'science-space': ('stem', 'physics', [
        (r'chemical|element|atomic|molecul|acid|compound|isotope', None, 'chemistry'),
        (r'planet|moon|star\b|asteroid|\bsun\b|galax|space|apollo|nasa|orbit|comet|telescope|solar|mars|jupiter|eclipse|rocket|astronaut|lunar|neptune|ceres', None, 'astronomy-and-space'),
        (r'\bSI\b|unit|measure|force|energy|light|gravity|pressure|electric|magnet|speed|wave|quantum|relativity|newton|volt|ohm|kelvin|joule|watt|tesla|coulomb|lumen|lux|pascal|ampere|candela|mole\b|henry|farad|hertz|siemens|gray|katal|becquerel|sievert', None, 'physics'),
        (r'cell|dna|gene\b|bacteria|virus|organ|blood|bone|body|species|photosynth|evolution|plant|animal|heart', None, 'biology'),
        (r'prime|number|square|angle|geometry|\bpi\b|equation|math|algebra|integer', None, 'math'),
    ]),
    'animals-nature': ('nature', 'mammals', [
        (r'bird|reptile|lizard|snake|turtle|tortoise|crocodile|alligator|fish|shark|cassowary|flamingo|ostrich|penguin|eagle|owl|parrot|dragon|frog|emu\b|pelican', None, 'birds-reptiles-and-fish'),
        (r'insect|\bbee\b|butterfl|\bant\b|spider|octopus|coral|jellyfish|crab|squid|\bsea\b|ocean|mollus', None, 'insects-and-sea-life'),
        (r'plant|tree|flower|fruit|seed|fung|mushroom|forest|leaf|leaves|bamboo|cacao|cactus|oak\b|pine\b|moss|grass|nectar', None, 'plants-and-trees'),
        (r'earth|weather|volcano|rain\b|storm|climate|tide|cloud|wind\b|hurricane|tornado', None, 'earth-and-weather'),
        (r'human|teeth|tooth|lung|brain|skin|muscle|\beye\b|\bear\b|hearing|smell', None, 'human-body'),
    ]),
    'us-history-civics': ('history', 'us-history', [
        (r'\bpresident\b|founder|general\b|leader|senator|justice\b', None, 'leaders-and-royals'),
        (r'war\b|revolution|battle|treaty', None, 'wars-and-revolutions'),
        (r'invent|patent|discover', None, 'inventions-and-discoveries'),
    ]),
    'world-history': ('history', 'modern-history', [
        (r'ancient|pharaoh|egypt|roman|\brome\b|greek|greece|athens|sparta|persia|mesopotamia|sumer|babylon|hammurabi|cyrus|xerxes|darius|alexander|olymp|qin\b|han dynasty|china|dynast|ptolemy|cleopatra|aztec|maya|inca|sanctuary|chariot|ziggurat|pyramid|khufu', None, 'ancient-world'),
        (r'medieval|renaissance|charlemagne|byzant|mongol|magna carta|crusade|mansa|\bmali\b|ottoman|justinian|feudal|florence|medici|vikings?|samurai|kublai|genghis|timbuktu|plague', None, 'medieval-and-renaissance'),
        (r'\bwar\b|wars\b|revolution|bastille|napoleon|treaty|invasion|independence|battle|revolt|armistice', None, 'wars-and-revolutions'),
        (r'invent|discover|printing press|telegraph|steam|penicillin|radio|engine|compass|gunpowder', None, 'inventions-and-discoveries'),
        (r'\bking\b|queen|emperor|empress|ruler|tsar|czar|monarch|dictator|leader|prime minister|president', None, 'leaders-and-royals'),
    ]),
    'movies-tv': ('entertainment', 'movies', [
        (r'\btv\b|television|sitcom|series\b|episode|cartoon|\bshow\b|hbo|netflix|soap', None, 'tv-shows'),
    ]),
    'music': ('entertainment', 'pop-music', [
        (r'symphon|concerto|opera|composer|mozart|beethoven|bach\b|ballet|classical|sonata|orchestra|piano|violin|cello|conduct|requiem|cantata', 'arts-and-literature', 'classical-music-and-dance'),
    ]),
    'sports-games': ('sports', 'motorsport-and-more', [
        (r'chess|monopoly|board game|dice|poker|bridge\b|scrabble|domino|\bgo\b|card game|checkers|tabletop|bingo', 'board-and-card-games', 'tabletop-rules'),
        (r'basketball|naismith|\bnba\b|dunk', None, 'basketball'),
        (r'football|\bnfl\b|touchdown|quarterback|super bowl', None, 'football'),
        (r'baseball|robinson|pitch|\bmlb\b|home run|batter', None, 'baseball'),
        (r'soccer|fifa|world cup|goalkeeper|\bgoal\b', None, 'soccer'),
        (r'olymp|judo|fenc|sabre|marathon|decathlon|kodokan', None, 'olympics'),
        (r'tennis|golf|birdie|eagle|bogey|\bpar\b|wimbledon|grand slam|stroke|fairway|bunker', None, 'tennis-and-golf'),
        (r'hockey|puck|stanley cup|\bnhl\b', None, 'hockey'),
    ]),
    'food-everyday-life': ('food-and-drink', 'ingredients', [
        (r'drink|coffee|\btea\b|wine|beer|milk\b|juice|soda|cocktail|mead', None, 'drinks'),
        (r'chocolate|candy|dessert|cake|sweet|sugar|cookie|lactose|sucrose|galactose|caramel|honey', None, 'sweets-and-desserts'),
        (r'cook|bak|oven|knife|recipe|kitchen|al dente|fry|boil|roast|mayonnaise|emulsion|whisk|grill|batter|dough|rise\b', None, 'cooking-and-kitchen'),
        (r'cuisine|italian|french|japanese|mexican|indian|chinese|thai\b|pasta|sushi|taco|curry|paella|kimchi|tortilla', None, 'world-cuisines'),
        (r'ingredient|flour|salt\b|egg|sauce|vinegar|gluten|whey|collagen|yeast|butter|cheese|\bgas\b|acid|mixture|yolk|starch|protein|vitamin|paprika|spice|saffron|cumin', None, 'ingredients'),
        (r'travel|\bcar\b|train|plane|airport|\bbus\b|road|transport|bicycle|subway|taxi|highway|\bship', 'everyday-life', 'travel-and-transport'),
        (r'brand|logo|company|trademark|slogan|corporation', 'everyday-life', 'brands-and-logos'),
        (r'money|dollar|coin\b|price|business|\bbank\b|currency|\btax\b|stock', 'everyday-life', 'money-and-business'),
        (r'holiday|tradition|christmas|birthday|wedding|festival|custom|celebrat|thanksgiving|new year|halloween', 'everyday-life', 'holidays-and-traditions'),
        (r'unit|measure|inch|mile|kilo|liter|litre|meter|gram\b|celsius|fahrenheit|minute|hour|\bcup\b|ounce|pound|teaspoon|tablespoon|gallon', 'everyday-life', 'units-and-measures'),
    ]),
}

US_STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
             'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
             'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
             'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
             'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
             'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
             'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

FUNFACT_SOURCES_NOTE = 'funFact is a PartyBox-side sidecar; PartyBox items carry no funFact field.'


def norm(text):
    """Accent-, case- and punctuation-insensitive form used for every comparison here."""
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c)).lower()
    text = re.sub(r'[^a-z0-9 ]+', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def load_rows(job=JOB):
    rows = []
    for path in sorted(glob.glob(os.path.join(job, 'categories', '*.json'))):
        with open(path, encoding='utf-8') as fh:
            rows.extend(json.load(fh))
    rows.sort(key=lambda r: r['id'])
    return rows


def pb_id(b13_id):
    m = re.fullmatch(r'B13-(\d{4})', b13_id)
    if not m:
        raise ValueError(f'unexpected B13 id {b13_id!r}')
    return f'{PB_ID_PREFIX}-{m.group(1)}'


def map_subcategory(row):
    """Return (pb_category, subcategory, rule) where rule is 'rule:<n>' or 'default'."""
    default_cat, default_sub, rules = RULES[row['category']]
    text = row['question']
    for n, (pattern, cat, sub) in enumerate(rules):
        if re.search(pattern, text, re.IGNORECASE):
            return (cat or default_cat, sub, f'rule:{n}')
    return (default_cat, default_sub, 'default')


def source_attribution(row):
    names = []
    for s in row['sources']:
        if s['publisher'] not in names:
            names.append(s['publisher'])
    return '; '.join(names)


def build_item(row):
    cat, sub, rule = map_subcategory(row)
    item = {
        'id': pb_id(row['id']),
        'category': cat,
        'subcategory': sub,
        'difficulty': PB_DIFFICULTY[row['difficulty']],
        'question': row['question'],
        'choices': list(row['options']),
        'answerIndex': row['correctIndex'],
        'source': source_attribution(row),
    }
    return item, rule


def check_item(item):
    """Mirror of questionSchema in games/lightning-round/content/schema.ts (no zod here)."""
    errors = []
    if not PB_ID_RE.match(item['id']):
        errors.append('id pattern')
    if item['category'] not in PB_CATEGORIES:
        errors.append('category enum')
    elif item['subcategory'] not in PB_SUBCATEGORIES[item['category']]:
        errors.append('subcategory not in category')
    if item['difficulty'] not in ('easy', 'medium', 'hard'):
        errors.append('difficulty enum')
    if not (1 <= len(item['question']) <= 160):
        errors.append('question length')
    choices = item['choices']
    if len(choices) != 4:
        errors.append('choices count')
    elif len({c.strip().lower() for c in choices}) != 4:
        errors.append('choices not distinct')
    if any(not (1 <= len(c) <= 60) for c in choices):
        errors.append('choice length')
    if not (0 <= item['answerIndex'] <= 3):
        errors.append('answerIndex range')
    if not (1 <= len(item['source']) <= 200):
        errors.append('source length')
    return errors


def load_exclusions(job=JOB):
    path = os.path.join(job, 'partybox', 'exclusions.json')
    with open(path, encoding='utf-8') as fh:
        data = json.load(fh)
    return {e['id']: e for e in data['excluded']}, data.get('flagged', [])


def build(out_dir, job=JOB):
    rows = load_rows(job)
    excluded, flagged = load_exclusions(job)
    os.makedirs(out_dir, exist_ok=True)
    items, funfacts, sources, origins, report_rows = [], {}, {}, [], []
    rule_hits = Counter()
    problems = []
    for row in rows:
        item, rule = build_item(row)
        errs = check_item(item)
        status = 'excluded' if row['id'] in excluded else 'kept'
        if errs:
            problems.append((row['id'], errs))
        rule_hits[rule.split(':')[0]] += 1
        report_rows.append({
            'b13': row['id'], 'pb': item['id'], 'status': status,
            'exclusion': excluded.get(row['id'], {}).get('reason'),
            'subcategory_rule': rule, 'errors': errs,
            'question_len': len(item['question']), 'max_choice_len': max(len(c) for c in item['choices']),
            'source_len': len(item['source']),
        })
        if status == 'kept':
            items.append(item)
            origins.append({
                'id': item['id'], 'answer': row['correctAnswer'], 'url': row['sources'][0]['url'],
                'evidence': f"B13 held row {row['id']}: {source_attribution(row)}",
                'pack': 'questions', 'spanishTwin': False,
            })
            funfacts[item['id']] = row['funFact']
            sources[item['id']] = {
                'b13': row['id'],
                'sources': [{k: s[k] for k in ('publisher', 'url', 'quote') if k in s} |
                            ({'funFactQuote': s['funFactQuote']} if 'funFactQuote' in s else {}) |
                            ({'extraQuote': s['extraQuote']} if 'extraQuote' in s else {})
                            for s in row['sources']],
            }
    if problems:
        for rid, errs in problems:
            print('FIT ERROR', rid, errs, file=sys.stderr)
        raise SystemExit('fit errors: rows do not satisfy the PartyBox schema')
    ids = [i['id'] for i in items]
    assert len(ids) == len(set(ids)), 'duplicate PartyBox ids'
    dropped = sorted(i['id'] for i in items)
    write_json(os.path.join(out_dir, 'questions.json'), {'items': items})
    write_json(os.path.join(out_dir, 'content-pack-origins.added.json'), origins)
    write_json(os.path.join(out_dir, 'funfacts.json'), {'note': FUNFACT_SOURCES_NOTE, 'items': funfacts})
    write_json(os.path.join(out_dir, 'sources.json'), {'items': sources})
    write_json(os.path.join(out_dir, 'es-dropped.json'), {
        'note': 'No Spanish twins exist for B13 rows. Add these ids to "dropped" in questions.es.json, or translate them.',
        'dropped': dropped,
    })
    summary = summarize(items, report_rows, rule_hits, flagged)
    write_json(os.path.join(out_dir, 'fit-report.json'), {'summary': summary, 'rows': report_rows})
    print(json.dumps(summary, indent=1, ensure_ascii=False))


def summarize(items, report_rows, rule_hits, flagged):
    kept = [r for r in report_rows if r['status'] == 'kept']
    by_cat = Counter(i['category'] for i in items)
    by_diff = Counter(i['difficulty'] for i in items)
    by_pos = Counter(i['answerIndex'] for i in items)
    excl = Counter(r['exclusion'] for r in report_rows if r['status'] == 'excluded')
    return {
        'rows_in': len(report_rows),
        'rows_kept': len(kept),
        'excluded_by_reason': dict(excl),
        'schema_errors': sum(1 for r in report_rows if r['errors']),
        'question_len_max': max(r['question_len'] for r in report_rows),
        'choice_len_max': max(r['max_choice_len'] for r in report_rows),
        'source_len_max': max(r['source_len'] for r in report_rows),
        'kept_by_partybox_category': dict(sorted(by_cat.items())),
        'kept_by_difficulty': dict(sorted(by_diff.items())),
        'kept_answer_index': dict(sorted(by_pos.items())),
        'subcategory_rule_hits': dict(sorted(rule_hits.items())),
        'flagged_for_rewrite': len(flagged),
        'spanish_twins': 0,
    }


def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)
        fh.write('\n')


# ---- overlap with a PartyBox bank (only with --refresh) -------------------------------
def find_overlaps(rows, bank_items):
    by_answer = defaultdict(list)
    for p in bank_items:
        by_answer[norm(p['choices'][p['answerIndex']])].append(p)
    state_norms = [(s, norm(s)) for s in US_STATES]

    def states(text):
        n = norm(text)
        return [s for s, sn in state_norms if re.search(r'\b' + re.escape(sn) + r'\b', n)]

    leaks, exclusions, candidates = [], [], []
    for row in rows:
        answer = norm(row['correctAnswer'])
        q_norm = norm(row['question'])
        if len(answer) >= 3 and re.search(r'\b' + re.escape(answer) + r'\b', q_norm):
            leaks.append({'id': row['id'], 'reason': 'answer-in-question',
                          'answer': row['correctAnswer'],
                          'detail': 'the correct answer text appears in the question'})
        for p in by_answer.get(answer, []):
            p_norm = norm(p['question'])
            ratio = SequenceMatcher(None, q_norm, p_norm).ratio()
            shared = (set(q_norm.split()) & set(p_norm.split())) - {'the', 'of', 'in', 'is', 'which', 'what', 'a', 'an', 'was', 'and'}
            rec = {'id': row['id'], 'bankId': p['id'], 'answer': row['correctAnswer'], 'ratio': round(ratio, 3)}
            bs, ps = states(row['question']), states(p['question'])
            if ratio >= 0.8:
                exclusions.append(dict(rec, reason='same-fact-as-bank',
                                       detail='same correct answer and normalized question similarity >= 0.8'))
            elif 'capital' in q_norm and 'capital' in p_norm and len(bs) == 1 and bs == ps:
                exclusions.append(dict(rec, reason='state-capital-as-bank',
                                       detail=f'same state capital question for {bs[0]}'))
            elif len(shared) >= 2:
                candidates.append(dict(rec, reason='review: same answer, shared subject words'))
    return leaks, exclusions, candidates


def refresh(bank_path, job=JOB):
    rows = load_rows(job)
    with open(bank_path, encoding='utf-8') as fh:
        bank = json.load(fh)
    bank_items = bank['items'] if isinstance(bank, dict) else bank
    if any(p['id'].startswith(PB_ID_PREFIX + '-') for p in bank_items):
        raise SystemExit(f'bank already uses the {PB_ID_PREFIX}- prefix; choose another in the adapter')
    leaks, exclusions, candidates = find_overlaps(rows, bank_items)
    seen, excluded = set(), []
    for rec in leaks + exclusions:
        if rec['id'] in seen:
            continue
        seen.add(rec['id'])
        excluded.append(rec)
    excluded.sort(key=lambda r: r['id'])
    path = os.path.join(job, 'partybox', 'exclusions.json')
    flagged = []
    if os.path.exists(path):
        with open(path, encoding='utf-8') as fh:
            flagged = json.load(fh).get('flagged', [])  # editorial list: preserved, never regenerated
    write_json(path, {
        'note': ('Port-time exclusions. Each row stays in categories/ unchanged; the adapter drops it only for PartyBox. '
                 'Bank text is never copied here: only ids, normalized answers and similarity.'),
        'bank': os.path.basename(bank_path) + f' ({len(bank_items)} items, ids and answers only)',
        'excluded': excluded,
        'flagged': flagged,
    })
    write_json(os.path.join(job, 'partybox', 'overlap-candidates.json'), {
        'note': 'Same answer and shared subject words, not excluded. A reviewer decides each one. No bank question text.',
        'items': sorted(candidates, key=lambda r: (r['id'], r['bankId'])),
    })
    print(json.dumps({'leaks': len(leaks), 'excluded_total': len(excluded),
                      'excluded_by_reason': dict(Counter(r['reason'] for r in excluded)),
                      'review_candidates': len(candidates)}, indent=1))


def self_test():
    cases = [
        (('What is the chemical symbol for tin?', 'science-space'), 'chemistry'),
        (('Which named SI derived unit measures pressure?', 'science-space'), 'physics'),
        (('Which planet is closest to the Sun?', 'science-space'), 'astronomy-and-space'),
        (('Who invented basketball?', 'sports-games'), 'basketball'),
        (('Which board game uses Park Place?', 'sports-games'), 'tabletop-rules'),
        (('Which bird is the largest living bird?', 'animals-nature'), 'birds-reptiles-and-fish'),
    ]
    for (question, cat), expected in cases:
        row = {'question': question, 'category': cat}
        got = map_subcategory(row)[1]
        assert got == expected, f'{question!r}: expected {expected}, got {got}'
    assert pb_id('B13-0001') == 'tri-0001' and pb_id('B13-1000') == 'tri-1000'
    assert PB_ID_RE.match(pb_id('B13-0042'))
    sample = {'question': 'q', 'choices': ['a', 'A', 'b', 'c'], 'answerIndex': 0, 'category': 'x',
              'subcategory': 'y', 'difficulty': 'easy', 'id': 'tri-0001', 'source': 's'}
    assert 'choices not distinct' in check_item(dict(sample, subcategory='physics', category='stem'))
    assert norm('Brasília — São Paulo!') == 'brasilia sao paulo'
    print('self-test: 6 mapping cases, id mapping, distinct-choice check, normalisation: ok')


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', help='directory for the PartyBox files')
    ap.add_argument('--refresh', action='store_true', help='recompute partybox/exclusions.json (needs --bank)')
    ap.add_argument('--bank', help='PartyBox questions.json for --refresh')
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args(argv)
    if args.self_test:
        self_test()
        return 0
    if args.refresh:
        if not args.bank:
            ap.error('--refresh needs --bank')
        refresh(args.bank)
        return 0
    if not args.out:
        ap.error('give --out <dir>, --refresh --bank <file>, or --self-test')
    build(args.out)
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
