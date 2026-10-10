"""Implementation B: integer polynomial convolution and diagonal mass reassignment.
Does not read/import engine-a.ts, compiled A, or odds.json. Python stdlib arithmetic.
A separate exhaustive evaluator supplies a per-ordered-tuple cross-check as well.
This is algorithmic independence, NOT a claim of independently blinded authorship.
"""
import itertools, json, math, sys
from collections import Counter
from fractions import Fraction

def rat(n, d):
    f = Fraction(n, d)
    return f'{f.numerator}/{f.denominator}'

def polynomial(blocks):
    p = Counter({0: 1})
    for block in blocks:
        q = Counter()
        for exponent, coefficient in p.items():
            for face in block:
                q[exponent + face] += coefficient
        p = q
    return p

def distribution(s):
    split = s['bonusDice'] or len(s['blocks'])
    first, rest = s['blocks'][:split], s['blocks'][split:]
    base = polynomial(first)
    classified = Counter({(total, 0): count for total, count in base.items()})
    if s['bonusDice']:
        for v in set.intersection(*(set(b) for b in first)):
            score = s['bonusSevens'] if v == 7 else s['bonusRegular']
            classified[(v * split, 0)] -= 1
            classified[(v * split, score)] += 1
    extra = polynomial(rest)
    joint = Counter()
    for (subtotal, bonus), count in classified.items():
        for tail, multiplicity in extra.items():
            if count:
                total = subtotal + tail
                coin = None if not s['coinKnown'] else bonus + (total if s['payday'] else 0)
                joint[(total + s['offset'], coin)] += count * multiplicity
    total = math.prod(len(b) for b in s['blocks'])
    movement, coins = Counter(), Counter()
    for (m, c), n in joint.items():
        movement[m] += n
        if c is not None:
            coins[c] += n
    rows = [{'movement': m, 'coins': c, 'ways': str(n), 'probability': rat(n, total)}
            for (m, c), n in sorted(joint.items(), key=lambda x: (x[0][0], -1 if x[0][1] is None else x[0][1]))]
    return {'id': s['id'], 'sampleSpace': str(total), 'confidence': s['confidence'], 'facts': s['facts'],
            'movement': {str(m): rat(n,total) for m,n in sorted(movement.items())},
            'coins': {str(c): rat(n,total) for c,n in sorted(coins.items())} if s['coinKnown'] else None,
            'joint': rows, 'meanMovement': rat(sum(m*n for m,n in movement.items()), total),
            'meanCoins': rat(sum(c*n for c,n in coins.items()), total) if s['coinKnown'] else None}

def outcome(s, r):
    c = 0
    if s['bonusDice'] and len(set(r[:s['bonusDice']])) == 1:
        c = s['bonusSevens'] if r[0] == 7 else s['bonusRegular']
    if s['payday']:
        c += sum(r)
    return [sum(r) + s['offset'], c if s['coinKnown'] else None]

def main():
    data = json.load(open('dice.json', encoding='utf-8'))
    result = []
    for s in data['models']:
        d = distribution(s)
        cases = [outcome(s, r) for r in itertools.product(*s['blocks'])]
        observed = Counter(map(tuple, cases))
        assert observed == Counter({(x['movement'],x['coins']):int(x['ways']) for x in d['joint']})
        result.append({'distribution':d, 'cases':cases})
    json.dump(result, sys.stdout, separators=(',',':'))
if __name__ == '__main__': main()
