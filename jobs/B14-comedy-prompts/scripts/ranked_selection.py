"""Select both genres together with exact ranked inclusion and shared reference caps."""
import heapq
import json
from collections import Counter

def rank_key(row, second):
    first = row["firstPass"]["grade"]
    grade = second[row["id"]]["grade"]
    return (-min(first, grade), -first - grade, -grade, row["id"])

def select(candidates, second, aliases, excluded, quotas=None, cap=3):
    quotas = {"fill": 600, "most-likely": 600} if quotas is None else quotas
    eligible = sorted((r for r in candidates if r["id"] not in excluded and r["firstPass"]["grade"] >= 4 and second[r["id"]]["grade"] >= 4), key=lambda r: rank_key(r, second))
    assert len({r["id"] for r in eligible}) == len(eligible)
    assert all(len(r["namedReferences"]) == 1 for r in eligible), "this selector requires the sealed one-reference contract"
    genres = sorted(quotas)
    brands = sorted({aliases.get(r["namedReferences"][0], r["namedReferences"][0]) for r in eligible})
    source = 0
    genre_nodes = {genre: i + 1 for i, genre in enumerate(genres)}
    offset = 1 + len(genres)
    candidate_nodes = {r["id"]: offset + i for i, r in enumerate(eligible)}
    brand_offset = offset + len(eligible)
    brand_nodes = {brand: brand_offset + i for i, brand in enumerate(brands)}
    sink = brand_offset + len(brands)
    graph = [[] for _ in range(sink + 1)]
    def edge(a, b, capacity, cost):
        forward = [b, len(graph[b]), capacity, cost]
        reverse = [a, len(graph[a]), 0, -cost]
        graph[a].append(forward); graph[b].append(reverse)
        return forward
    for genre, node in genre_nodes.items():
        edge(source, node, quotas[genre], 0)
    candidate_edges = {}
    for index, row in enumerate(eligible):
        node = candidate_nodes[row["id"]]
        # Each earlier inclusion outweighs the sum of every later inclusion.
        # This implements the declared ranking and ID tie-break exactly.
        candidate_edges[row["id"]] = edge(genre_nodes[row["kind"]], node, 1, -(1 << (len(eligible) - 1 - index)))
        brand = aliases.get(row["namedReferences"][0], row["namedReferences"][0])
        edge(node, brand_nodes[brand], 1, 0)
    for node in brand_nodes.values():
        edge(node, sink, cap, 0)
    # Initial residual network is a DAG in node order.
    potentials = [None] * len(graph); potentials[source] = 0
    for node, edges in enumerate(graph):
        if potentials[node] is None: continue
        for target, _, capacity, cost in edges:
            if capacity and (potentials[target] is None or potentials[target] > potentials[node] + cost):
                potentials[target] = potentials[node] + cost
    potentials = [p if p is not None else 0 for p in potentials]
    flow = 0
    required = sum(quotas.values())
    while flow < required:
        distances = [None] * len(graph); distances[source] = 0
        parents = [None] * len(graph); queue = [(0, source)]
        while queue:
            distance, node = heapq.heappop(queue)
            if distance != distances[node]: continue
            for index, (target, _, capacity, cost) in enumerate(graph[node]):
                if not capacity: continue
                reduced = cost + potentials[node] - potentials[target]
                assert reduced >= 0, "invalid shortest-path potential"
                candidate = distance + reduced
                if distances[target] is None or candidate < distances[target]:
                    distances[target] = candidate
                    parents[target] = (node, index)
                    heapq.heappush(queue, (candidate, target))
        if distances[sink] is None:
            raise ValueError("no feasible pack satisfies both genre quotas and combined reference caps")
        for node, distance in enumerate(distances):
            if distance is not None: potentials[node] += distance
        node = sink
        while node != source:
            parent, index = parents[node]
            target, reverse, _, _ = graph[parent][index]
            graph[parent][index][2] -= 1
            graph[target][reverse][2] += 1
            node = parent
        flow += 1
    chosen = sorted((r for r in eligible if candidate_edges[r["id"]][2] == 0), key=lambda r: r["id"])
    assert Counter(r["kind"] for r in chosen) == quotas
    references = Counter(aliases.get(r["namedReferences"][0], r["namedReferences"][0]) for r in chosen)
    assert max(references.values(), default=0) <= cap
    return chosen
