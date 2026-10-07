#!/usr/bin/env python3
"""Independent integer multiset oracle. JSON-lines positions in; certified results out.

The small physical-subset oracle remains reference.ts.  This independently authored
model quotients only interchangeable numbered copies.  It labels every joker.
"""
from __future__ import annotations

import copy
import itertools
import json
import math
import os
import sys
import time
import warnings
from dataclasses import dataclass

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import numpy as np
from scipy.optimize import Bounds, LinearConstraint, milp
from scipy.sparse import csc_matrix

COLORS = ("red", "blue", "black", "orange")
VALUE = tuple(i % 13 + 1 for i in range(52))


@dataclass(frozen=True)
class Pattern:
    kind: str
    slots: tuple[tuple[int, int], ...]  # face, joker index (-1 for numbered)
    faces: tuple[int, ...]
    joker_mask: int
    new_joker_value: int
    new_joker_count: int


def solve(position: dict) -> dict:
    """Solve a position previously accepted by the independent TS validator.

    Optimality is accepted only with HiGHS status=OPTIMAL, an integer feasible
    rounded primal witness, matching objective, and primal/dual gap below one
    integer objective unit.  No timeout or approximate success path exists.
    """
    started = time.perf_counter()
    opened = position["initialMeldDone"]
    hand = position["hand"]
    old = [tile for meld in position["table"] for tile in meld["tiles"]] if opened else []
    old_ids = {tile["id"] for tile in old}
    quantities = [0] * 52
    mandatory = [0] * 52
    physical: list[list[dict]] = [[] for _ in range(52)]
    jokers: list[dict] = []
    rack_joker: list[bool] = []
    for tile in old + hand:
        if tile["kind"] == "joker":
            jokers.append(tile)
            rack_joker.append(tile["id"] not in old_ids)
        else:
            face = COLORS.index(tile["color"]) * 13 + tile["value"] - 1
            quantities[face] += 1
            mandatory[face] += tile["id"] in old_ids
            physical[face].append(tile)

    patterns_by_resources: dict[tuple[int, int], Pattern] = {}

    def add(kind: str, slots: tuple[tuple[int, int], ...]) -> None:
        faces = tuple(face for face, joker in slots if joker < 0)
        face_mask = sum(1 << face for face in faces)
        joker_mask = sum(1 << joker for _, joker in slots if joker >= 0)
        new_joker_value = sum(VALUE[face] for face, joker in slots
                              if joker >= 0 and rack_joker[joker])
        new_joker_count = sum(joker >= 0 and rack_joker[joker] for _, joker in slots)
        pattern = Pattern(kind, slots, faces, joker_mask, new_joker_value, new_joker_count)
        key = (face_mask, joker_mask)
        previous = patterns_by_resources.get(key)
        # Bindings consume identical resources.  Old bindings do not score;
        # therefore the highest NEW-joker represented value dominates locally.
        if previous is None or new_joker_value > previous.new_joker_value:
            patterns_by_resources[key] = pattern

    def fill(kind: str, wanted: tuple[int, ...]) -> None:
        if sum(quantities[face] == 0 for face in wanted) > len(jokers):
            return

        def visit(at: int, slots: tuple[tuple[int, int], ...], used: int) -> None:
            if at == len(wanted):
                add(kind, slots)
                return
            face = wanted[at]
            if quantities[face]:
                visit(at + 1, slots + ((face, -1),), used)
            for joker in range(len(jokers)):
                if not used & (1 << joker):
                    visit(at + 1, slots + ((face, joker),), used | (1 << joker))

        visit(0, (), 0)

    for color in range(4):
        for start in range(11):
            for stop in range(start + 3, 14):
                fill("run", tuple(color * 13 + value for value in range(start, stop)))
    for value in range(13):
        for size in (3, 4):
            for colors in itertools.combinations(range(4), size):
                fill("group", tuple(color * 13 + value for color in colors))

    enumerated_patterns = len(patterns_by_resources)
    # Every run of length >=6 decomposes into consecutive pieces of length
    # 3..5: repeatedly take a prefix of length 3 until a final length 3..5.
    # This preserves each physical resource and each represented joker face,
    # so its value/count and feasibility are unchanged.  The smaller pieces
    # are in our exhaustive enumeration.  Groups remain length 3 or 4.
    patterns = [p for p in patterns_by_resources.values() if len(p.slots) <= 5]
    generation_ms = (time.perf_counter() - started) * 1000
    columns: list[int] = []
    rows: list[int] = []
    entries: list[float] = []
    upper: list[int] = []
    objectives: list[int] = []
    # At most 106 physical tiles exist, so one value point always dominates
    # every possible rack-count difference in this fixed integer encoding.
    weight = 128
    constant = weight * sum(mandatory[f] * VALUE[f] for f in range(52)) + sum(mandatory)
    for column, pattern in enumerate(patterns):
        for face in pattern.faces:
            rows.append(face)
            columns.append(column)
            entries.append(1.0)
        for joker in range(len(jokers)):
            if pattern.joker_mask & (1 << joker):
                rows.append(52 + joker)
                columns.append(column)
                entries.append(1.0)
        upper.append(1 if pattern.joker_mask else min(quantities[f] for f in pattern.faces))
        objectives.append(weight * (sum(VALUE[f] for f in pattern.faces) + pattern.new_joker_value)
                          + len(pattern.faces) + pattern.new_joker_count)
    lower_rows = mandatory + [int(not is_rack) for is_rack in rack_joker]
    upper_rows = quantities + [1] * len(jokers)
    if not patterns:
        if any(lower_rows):
            raise RuntimeError("Valid existing table unexpectedly has no candidate")
        chosen = []
        certificate = dict(status="OPTIMAL", backend="analytic-empty-model", encodedObjective=0, primalObjective=0.0,
                           dualBound=0.0, absoluteGap=0.0, integerRowsVerified=True,
                           candidates=0, nodes=0, scipyVersion="1.17.0", threads=1,
                           rawPrimalObjective=0.0, rawDualBound=0.0, oldTableConstant=0,
                           enumeratedCandidates=enumerated_patterns, generationMs=generation_ms,
                           solveMs=0.0)
    else:
        matrix = csc_matrix((np.array(entries, dtype=np.float64),
                             (np.array(rows, dtype=np.int32), np.array(columns, dtype=np.int32))),
                            shape=(52 + len(jokers), len(patterns)))
        # SciPy forwards these HiGHS options; it warns because they are not in
        # SciPy's smaller documented option set.  Both thread/seed settings are
        # explicit rather than relying on a machine's thread-count defaults.
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", message="Unrecognized options detected.*", category=RuntimeWarning)
            solve_started = time.perf_counter()
            answer = milp(c=-np.array(objectives, dtype=np.float64),
                          integrality=np.ones(len(patterns), dtype=np.int32),
                          bounds=Bounds(np.zeros(len(patterns)), np.array(upper)),
                          constraints=LinearConstraint(matrix, np.array(lower_rows), np.array(upper_rows)),
                          options={"presolve": True, "mip_rel_gap": 0.0,
                                   "threads": 1, "random_seed": 0, "parallel": False})
            solve_ms = (time.perf_counter() - solve_started) * 1000
        if answer.status != 0 or not answer.success or answer.x is None:
            raise RuntimeError(f"No certified optimum: {answer.status}: {answer.message}")
        rounded = [int(round(float(value))) for value in answer.x]
        if any(abs(float(actual) - integer) > 1e-5
               for actual, integer in zip(answer.x, rounded)):
            raise RuntimeError("Nonintegral solver witness")
        if any(not 0 <= integer <= maximum for integer, maximum in zip(rounded, upper)):
            raise RuntimeError("Integer column bound violated")
        consumed = [0] * len(lower_rows)
        for pattern, multiplicity in zip(patterns, rounded):
            for face in pattern.faces:
                consumed[face] += multiplicity
            for joker in range(len(jokers)):
                if pattern.joker_mask & (1 << joker):
                    consumed[52 + joker] += multiplicity
        if any(not minimum <= actual <= maximum
               for actual, minimum, maximum in zip(consumed, lower_rows, upper_rows)):
            raise RuntimeError("Exact integer resource row violated")
        encoded = sum(mult * objective for mult, objective in zip(rounded, objectives))
        primal = -float(answer.fun)
        dual = -float(answer.mip_dual_bound)
        if not math.isfinite(primal) or not math.isfinite(dual):
            raise RuntimeError("Nonfinite certificate")
        if abs(primal - encoded) > 1e-5 or dual < encoded - 1e-5 or dual - encoded >= 1.0:
            raise RuntimeError(f"Integer optimum not certified: {encoded}, {primal}, {dual}")
        chosen = [pattern for pattern, multiplicity in zip(patterns, rounded)
                  for _ in range(multiplicity)]
        certificate = dict(status="OPTIMAL", backend="scipy-highs", encodedObjective=encoded-constant,
                           primalObjective=primal-constant, dualBound=dual-constant, absoluteGap=dual - encoded,
                           integerRowsVerified=True, candidates=len(patterns),
                           nodes=int(answer.mip_node_count), scipyVersion="1.17.0", threads=1,
                           rawPrimalObjective=primal, rawDualBound=dual, oldTableConstant=constant,
                           enumeratedCandidates=enumerated_patterns, generationMs=generation_ms,
                           solveMs=solve_ms)

    indices = [0] * 52
    formed = []
    new_value = 0
    new_count = 0
    for pattern in chosen:
        tiles = []
        for face, joker in pattern.slots:
            if joker < 0:
                tile = physical[face][indices[face]]
                indices[face] += 1
                copied = {key: tile[key] for key in ("id", "kind", "color", "value")}
                is_new = tile["id"] not in old_ids
            else:
                tile = jokers[joker]
                copied = {"id": tile["id"], "kind": "joker",
                          "as": {"color": COLORS[face // 13], "value": VALUE[face]}}
                is_new = rack_joker[joker]
            if is_new:
                new_value += VALUE[face]
                new_count += 1
            tiles.append(copied)
        formed.append({"kind": pattern.kind, "tiles": tiles})
    if certificate["encodedObjective"] != weight * new_value + new_count:
        raise RuntimeError("Physical allocation objective mismatch")
    certificate["inventoryEncodedUpperBound"] = weight * sum(
        13 if tile["kind"] == "joker" else tile["value"] for tile in hand) + len(hand)
    certificate["inventoryBoundClosed"] = (certificate["encodedObjective"]
                                           == certificate["inventoryEncodedUpperBound"])

    stats = {"states": certificate["nodes"], "memoHits": 0, "boundPrunes": 0,
             "candidates": certificate["candidates"]}
    if new_count == 0 or (not opened and new_value < 30):
        if not opened and new_value < 30 and new_count:
            # The relaxed rack-only optimum is below the opening threshold.
            # Thus no opening play exists and the legal game's exact optimum
            # is the pass value 0.  Preserve the underlying MILP certificate.
            certificate["backend"] = "analytic-opening-threshold-from-optimal-milp"
            certificate["unrestrictedEncodedObjective"] = certificate["encodedObjective"]
            certificate["unrestrictedPrimalObjective"] = certificate["primalObjective"]
            certificate["unrestrictedDualBound"] = certificate["dualBound"]
            certificate["unrestrictedGap"] = certificate["absoluteGap"]
            certificate["encodedObjective"] = 0
            certificate["primalObjective"] = 0.0
            certificate["dualBound"] = 0.0
            certificate["absoluteGap"] = 0.0
            certificate["inventoryBoundClosed"] = False
        result = dict(ok=True, action="pass", table=copy.deepcopy(position["table"]), played=[],
                      remainingHand=copy.deepcopy(hand), value=0, rackPenaltyShed=0,
                      initialMeldDone=opened, optimal=True, stats=stats)
    else:
        table = formed if opened else copy.deepcopy(position["table"]) + formed
        hand_by_id = {tile["id"]: tile for tile in hand}
        played = [tile["id"] for meld in table for tile in meld["tiles"] if tile["id"] in hand_by_id]
        if len(played) != new_count or len(set(played)) != new_count:
            raise RuntimeError("Physical rack count mismatch")
        played_set = set(played)
        result = dict(ok=True, action="play", table=table, played=played,
                      remainingHand=copy.deepcopy([tile for tile in hand if tile["id"] not in played_set]),
                      value=new_value, rackPenaltyShed=sum(30 if hand_by_id[t]["kind"] == "joker"
                                                          else hand_by_id[t]["value"] for t in played),
                      initialMeldDone=True, optimal=True, stats=stats)
    return {"result": result, "certificate": certificate,
            "elapsedMs": (time.perf_counter() - started) * 1000}


def main() -> None:
    for line_number, line in enumerate(sys.stdin, 1):
        if not line.strip():
            continue
        try:
            output = solve(json.loads(line))
            print(json.dumps(output, separators=(",", ":"), allow_nan=False), flush=True)
        except Exception as error:
            print(f"Oracle failure on input line {line_number}: {error}", file=sys.stderr, flush=True)
            print(json.dumps({"error": {"message": str(error), "line": line_number}},
                             separators=(",", ":")), flush=True)


if __name__ == "__main__":
    main()
