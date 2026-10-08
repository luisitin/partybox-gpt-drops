#!/usr/bin/env python3
"""Third, independent implementation of the B02 movement semantics (see README "Precisely defined movement").

It shares no code with boardOdds.ts or support.mjs: it generates its own random boards, enumerates every
finite walk literally with fractions.Fraction (no matrices, no memoisation, no truncation), and prints the
expected results as JSON for tools/independent-check.mjs to compare exactly against boardOdds().

Generator restriction (so that literal enumeration is finite): pass-through to pass-through edges only go
to a higher index, so zero-step cycles cannot exist. Ordinary cycles stay allowed: each one spends a step.

Usage: python3 -I tools/python_bruteforce.py --seed 1 --graphs 300 --max-nodes 25
"""
import argparse
import json
import random
from collections import deque
from fractions import Fraction

FACES = range(0, 11)
POLICIES = ('uniform', 'toward target')


def make_board(rnd, n):
    pass_through = [rnd.random() < 0.3 for _ in range(n)]
    nodes = []
    for i in range(n):
        out = set()
        for _ in range(rnd.choice([0, 1, 1, 2, 2, 3])):
            j = rnd.randrange(n)
            if pass_through[i] and pass_through[j] and j <= i:
                continue  # keep the pass-through subgraph acyclic
            out.add(j)
        nodes.append({
            'id': f'n{i}',
            'kind': 'shop' if pass_through[i] else 'space',
            'next': [f'n{j}' for j in sorted(out)],
            'passThrough': pass_through[i],
        })
    rnd.shuffle(nodes)  # node order is a representation, not a probability
    return {'nodes': nodes}


def hop_distance(board, target):
    """Directed edge-hop distance to target over the full graph (reverse BFS). Infinite if unreachable."""
    ids = [v['id'] for v in board['nodes']]
    dist = {i: None for i in ids}
    if target not in dist:
        return dist
    reverse = {i: [] for i in ids}
    for v in board['nodes']:
        for w in v['next']:
            reverse[w].append(v['id'])
    dist[target] = 0
    queue = deque([target])
    while queue:
        v = queue.popleft()
        for w in reverse[v]:
            if dist[w] is None:
                dist[w] = dist[v] + 1
                queue.append(w)
    return dist


def enumerate_walks(board, start, steps, policy, target, dist):
    """Literal enumeration of every walk from start that spends `steps` die steps. Returns exact results."""
    by_id = {v['id']: v for v in board['nodes']}
    landing = {v['id']: Fraction(0) for v in board['nodes']}
    passes = {v['id']: Fraction(0) for v in board['nodes'] if v['passThrough']}

    def choices(node_id):
        out = by_id[node_id]['next']
        if policy == 'uniform' or not out:
            return out
        reachable = [dist[w] for w in out if dist[w] is not None]
        if not reachable:
            return out  # target unreachable from every successor: uniform fallback
        best = min(reachable)
        return [w for w in out if dist[w] == best]

    def walk(node_id, remaining, weight):
        # Movement stops immediately when the last step is spent, or at a dead end.
        options = choices(node_id)
        if remaining == 0 or not options:
            landing[node_id] += weight
            return
        share = weight / len(options)
        for w in options:
            if by_id[w]['passThrough']:
                passes[w] += share          # entering a shop: zero steps, one visit
                walk(w, remaining, share)
            else:
                walk(w, remaining - 1, share)  # entering an ordinary space: one step

    walk(start, steps, Fraction(1))
    return landing, passes


def mixture(die, per_face):
    """Weighted sum of the per-face exact results (each face is enumerated once, then reused)."""
    landing = {k: Fraction(0) for k in next(iter(per_face.values()))[0]}
    passes = {k: Fraction(0) for k in next(iter(per_face.values()))[1]}
    for face, weight in die.items():
        l, p = per_face[face]
        for k in landing:
            landing[k] += weight * l[k]
        for k in passes:
            passes[k] += weight * p[k]
    return landing, passes


def text(x):
    return f'{x.numerator}/{x.denominator}'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--graphs', type=int, default=100)
    ap.add_argument('--max-nodes', type=int, default=25)
    args = ap.parse_args()
    rnd = random.Random(args.seed * 1000003 + 17)
    cases = []
    for g in range(args.graphs):
        n = rnd.randint(1, args.max_nodes)
        board = make_board(rnd, n)
        ids = [v['id'] for v in board['nodes']]
        target = rnd.choice(ids)
        policy = POLICIES[g % 2]
        dist = hop_distance(board, target)
        # Random exact die over faces 0..10 (weights 0..4, zero weights allowed), normalised exactly.
        weights = {f: rnd.randint(0, 4) for f in FACES}
        total = sum(weights.values())
        if total == 0:
            weights[0] = 1
            total = 1
        die = {f: Fraction(w, total) for f, w in weights.items() if w}
        results = []
        for start in ids:
            exact = {face: enumerate_walks(board, start, face, policy, target, dist) for face in FACES}
            l, p = mixture(die, exact)
            results.append({'start': start,
                            'faces': {str(face): {'landing': {k: text(v) for k, v in l_.items()},
                                                  'passes': {k: text(v) for k, v in p_.items()}}
                                      for face, (l_, p_) in exact.items()},
                            'mixture': {'landing': {k: text(v) for k, v in l.items()},
                                        'passes': {k: text(v) for k, v in p.items()}}})
        cases.append({'graph': g, 'policy': policy, 'target': target, 'board': board,
                      'die': {str(f): text(w) for f, w in die.items()}, 'results': results})
    print(json.dumps({'generator': 'tools/python_bruteforce.py', 'seed': args.seed,
                      'graphs': len(cases), 'cases': cases}))


if __name__ == '__main__':
    main()
