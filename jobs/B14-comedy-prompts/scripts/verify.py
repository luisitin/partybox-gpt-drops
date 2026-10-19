"""Structural draft checks and strict delivery gates; absent reviews never count as passes."""
import argparse
import hashlib
import json
import difflib
import re
from collections import Counter
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--draft", action="store_true")
args = parser.parse_args()
rows = json.loads((ROOT / "candidates.json").read_text())
schema = json.loads((ROOT / "candidates.schema.json").read_text())
Draft202012Validator.check_schema(schema)
errors = list(Draft202012Validator(schema).iter_errors(rows))
assert not errors, "JSON Schema: " + "; ".join(e.message for e in errors[:10])
assert len({row["id"] for row in rows}) == len(rows), "duplicate candidate ID"
assert all("___" in row["text"] for row in rows if row["kind"] == "fill"), "missing blank"
assert all(row["text"].startswith("Who's most likely to ") for row in rows if row["kind"] == "most-likely"), "missing most-likely prefix"
counts = Counter(row["kind"] for row in rows)
result = {"mode": "draft" if args.draft else "release", "schemaCases": len(rows),
          "schemaPassed": len(rows), "candidateCounts": dict(counts),
          "requiredCandidateCounts": {"fill": 1500, "most-likely": 1500},
          "maximumCharacters": max([len(row["text"]) for row in rows], default=0),
          "reviewInputSha256": hashlib.sha256((ROOT / "review-input.json").read_bytes()).hexdigest()}
first_by_id = {row["id"]: row for row in rows}
reviewed = {}
reviewer_by_id = {}
for path in sorted((ROOT / "grading").glob("pass2-*.json")):
    batch = json.loads(path.read_text())
    input_path = ROOT / "review-inputs" / (batch["batch"] + ".json")
    assert hashlib.sha256(input_path.read_bytes()).hexdigest() == batch["reviewInputSha256"], "batch review hash mismatch"
    input_ids = {row["id"] for row in json.loads(input_path.read_text())}
    batch_ids = {row["id"] for row in batch["rows"]}
    assert len(batch_ids) == len(batch["rows"]) and batch_ids == input_ids, "incomplete or duplicate batch review"
    assert batch["reviewer"] and batch["reviewer"] != "original-author", "invalid independent grader identity"
    for row in batch["rows"]:
        assert row["id"] not in reviewed, "second-pass candidate reviewed twice without resolution"
        assert isinstance(row["grade"], int) and 1 <= row["grade"] <= 5 and len(row["reason"]) >= 10, "invalid second-pass row"
        reviewed[row["id"]] = row
        reviewer_by_id[row["id"]] = batch["reviewer"]
if reviewed:
    result["independentReviewedCases"] = len(reviewed)
    result["independentGrade4Plus"] = sum(row["grade"] >= 4 for row in reviewed.values())
    result["bothPassesGrade4Plus"] = sum(row["grade"] >= 4 and first_by_id[key]["firstPass"]["grade"] >= 4 for key, row in reviewed.items())
    result["reviewedExactGradeAgreement"] = sum(row["grade"] == first_by_id[key]["firstPass"]["grade"] for key, row in reviewed.items()) / len(reviewed)
    result["reviewedThresholdAgreement"] = sum((row["grade"] >= 4) == (first_by_id[key]["firstPass"]["grade"] >= 4) for key, row in reviewed.items()) / len(reviewed)
if args.draft:
    result["UNVERIFIED"] = ["full candidate counts", "independent second grading", "final 600+600 selections", "final near-duplicate resolution", "editorial named-reference and adult-content checks"]
else:
    assert counts == {"fill": 1500, "most-likely": 1500}, "incomplete 1500+1500 candidate pool"
    reviews = json.loads((ROOT / "grading" / "pass2.json").read_text())
    assert reviews["reviewInputSha256"] == result["reviewInputSha256"], "review applies to different input"
    second = {row["id"]: row for row in reviews["rows"]}
    assert len(second) == 3000 and set(second) == {row["id"] for row in rows}, "incomplete second pass"
    assert reviews["reviewer"] != "original-author", "second grader is original author"
    assert all(isinstance(row["grade"], int) and 1 <= row["grade"] <= 5 and row["reason"] for row in second.values()), "invalid second grading"
    assert all(second[key] == dict(value, reviewer=reviewer_by_id[key]) for key, value in reviewed.items()), "merged reviews differ from sealed independent batch records"
    seal = json.loads((ROOT / "seals/full-pool.json").read_text())
    assert seal["candidateCount"] == 3000 and seal["candidatesSha256"] == hashlib.sha256((ROOT / "candidates.json").read_bytes()).hexdigest() and seal["reviewInputSha256"] == result["reviewInputSha256"], "full pool seal mismatch"
    for author_path in sorted((ROOT / "batches").glob("*.tsv")):
        author_seal = json.loads((ROOT / "seals" / (author_path.stem + ".json")).read_text())
        assert author_seal["firstPassSha256"] == hashlib.sha256(author_path.read_bytes()).hexdigest(), "first-pass batch changed after sealing"
        assert author_seal["reviewInputSha256"] == hashlib.sha256((ROOT / "review-inputs" / (author_path.stem + ".json")).read_bytes()).hexdigest(), "review input changed after sealing"
    selected = json.loads((ROOT / "prompts.json").read_text())
    final_schema = json.loads((ROOT / "prompts.schema.json").read_text())
    Draft202012Validator.check_schema(final_schema)
    assert not list(Draft202012Validator(final_schema).iter_errors(selected)), "final JSON Schema"
    assert len({row["text"].casefold() for row in selected}) == 1200, "exact duplicate selected text"
    assert not {"Q0997", "M0997", "Q1040", "M1178", "Q0007", "Q0017", "M0580"}.intersection(row["id"] for row in selected), "known child or unsupported-brand candidate selected"
    final_counts = Counter(row["kind"] for row in selected)
    assert final_counts == {"fill": 600, "most-likely": 600}, "incomplete final selections"
    by_id = {row["id"]: row for row in rows}
    assert len({row["id"] for row in selected}) == 1200, "duplicate selected ID"
    alias_registry = json.loads((ROOT / "named-reference-aliases.json").read_text())
    aliases = alias_registry["tagToCanonical"]
    assert all(isinstance(key, str) and isinstance(value, str) and value not in aliases for key, value in aliases.items()), "invalid or chained canonical aliases"
    assert alias_registry["auditStatus"] == "complete", "full named-reference alias audit pending"
    named = Counter()
    for row in selected:
        original = by_id[row["id"]]
        assert row["text"] == original["text"] and row["kind"] == original["kind"] and row["namedReferences"] == original["namedReferences"], "selection differs from graded input"
        assert original["firstPass"]["grade"] >= 4 and second[row["id"]]["grade"] >= 4, "selected prompt failed a grading pass"
        named.update({aliases.get(reference, reference) for reference in original["namedReferences"]})
    assert max(named.values(), default=0) <= 3, "named brand/person appears more than three times"
    named_audit = json.loads((ROOT / "named-reference-audit.json").read_text())
    assert named_audit["poolCandidates"] == 3000 and named_audit["rawTagsAudited"] == len({t for r in rows for t in r["namedReferences"]}), "incomplete named tag audit"
    assert named_audit["canonicalMappings"] == aliases and named_audit["selectedCombinedCounts"] == dict(sorted(named.items())) and named_audit["selectedUnmatchedNames"] == 0, "named audit does not match actual final rows"
    normalize = lambda text: re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()
    flagged = []
    full_text = [normalize(r["text"]) for r in selected]
    content_text = [t.removeprefix("who s most likely to ") for t in full_text]
    for index, a in enumerate(selected):
        for j in range(index + 1, len(selected)):
            b = selected[j]
            x = difflib.SequenceMatcher(None, full_text[index], full_text[j], autojunk=False)
            y = difflib.SequenceMatcher(None, content_text[index], content_text[j], autojunk=False)
            # Both exact scans use a proved upper-bound skip, never sampling.
            full_ratio = max(x.ratio(), difflib.SequenceMatcher(None, full_text[j], full_text[index], autojunk=False).ratio()) if x.quick_ratio() > .75 else 0
            content_ratio = max(y.ratio(), difflib.SequenceMatcher(None, content_text[j], content_text[index], autojunk=False).ratio()) if y.quick_ratio() > .75 else 0
            if max(full_ratio, content_ratio) > .75:
                flagged.append({"ids": sorted([a["id"], b["id"]]),
                                "fullTextRatio": max(x.ratio(), difflib.SequenceMatcher(None, full_text[j], full_text[index], autojunk=False).ratio()), "contentRatio": max(y.ratio(), difflib.SequenceMatcher(None, content_text[j], content_text[index], autojunk=False).ratio())})
    resolutions = json.loads((ROOT / "similarity-resolutions.json").read_text())
    resolution_map = {tuple(sorted(row["ids"])): row for row in resolutions}
    assert len(resolution_map) == len(resolutions), "duplicate similarity resolutions"
    for flag in flagged:
        resolution = resolution_map.get(tuple(flag["ids"]))
        assert resolution and resolution["action"] == "keep-distinct" and len(resolution["reason"]) >= 30, "unresolved >0.75 similarity flag"
    assert set(resolution_map) == {tuple(flag["ids"]) for flag in flagged}, "stale similarity resolution"
    editorial = json.loads((ROOT / "editorial-review.json").read_text())
    selected_digest = hashlib.sha256((ROOT / "prompts.json").read_bytes()).hexdigest()
    assert editorial["selectedSha256"] == selected_digest, "editorial review applies to different selected text"
    editorial_rows = {row["id"]: row for row in editorial["rows"]}
    assert len(editorial_rows) == 1200 and set(editorial_rows) == {row["id"] for row in selected}, "incomplete final editorial review"
    assert all(row["noSlurs"] and row["noMinors"] and row["namedReferencesChecked"] for row in editorial_rows.values()), "failed editorial review"
    for row in selected:
        check = editorial_rows[row["id"]]
        evidence = check["namedReferenceEvidence"]
        assert len(evidence) == len(row["namedReferences"]) and {e["tag"] for e in evidence} == set(row["namedReferences"]), "incomplete per-row named evidence"
        assert all(row["text"][e["start"]:e["end"]] == e["nameInText"] and e["nameInText"] and e["canonical"] == aliases.get(e["tag"], e["tag"]) for e in evidence), "named evidence not literally present"
        expected_confidence = "high" if by_id[row["id"]]["firstPass"]["grade"] == second[row["id"]]["grade"] == 5 else "medium"
        assert row["confidence"] == check["confidence"] == expected_confidence, "editorial confidence differs from actual grades"
    confidence_rows = json.loads((ROOT / "candidate-confidence.json").read_text())["rows"]
    assert len(confidence_rows) == 3000 and {r["id"] for r in confidence_rows} == set(by_id), "incomplete confidence coverage"
    for r in confidence_rows:
        minimum = min(by_id[r["id"]]["firstPass"]["grade"], second[r["id"]]["grade"])
        assert r["confidence"] == ("high" if minimum == 5 else "medium" if minimum >= 4 else "low"), "candidate confidence mismatch"
    pool = json.loads((ROOT / "results/pool-similarity.json").read_text())
    assert pool["candidateCases"] == 3000 and pool["pairComparisons"] == 4498500 and pool["candidateSha256"] == hashlib.sha256((ROOT / "candidates.json").read_bytes()).hexdigest() and pool["selectedSha256"] == selected_digest, "pool similarity evidence mismatch"
    assert pool["textForms"] == 2 and pool["wordingDirectionsPerPair"] == 2, "pool scan does not cover both directions and text forms"
    segments = pool["coverageSegments"]
    assert segments[0]["leftStart"] == 0 and segments[-1]["leftEndExclusive"] == 3000 and all(a["leftEndExclusive"] == b["leftStart"] for a,b in zip(segments, segments[1:])), "pool segments omit a row interval"
    assert sum(segment["pairComparisons"] for segment in segments) == 4498500, "pool pair count incomplete"
    assert {tuple(f["ids"]) for f in pool["flags"] if f["resolution"] == "keep-distinct"} == set(resolution_map), "full-pool and independent final-pair scans disagree"
    result.update({"secondPassCases": 3000,
                   "candidatePoolSimilarityComparisons": pool["pairComparisons"], "similarityTextForms": 2, "similarityDirections": 2, "candidatePoolSimilarityFlags": pool["flaggedPairs"],
                   "finalSchemaCases": 1200, "namedReferenceBuckets": len(named), "maximumCombinedReferenceCount": max(named.values()),
                   "firstPassSealsChecked": 30, "candidateConfidenceCases": 3000, "selectedCounts": dict(final_counts),
                   "similarityPairComparisons": len(selected) * (len(selected) - 1) // 2,
                   "similarityFlaggedAndResolved": len(flagged), "editorialCases": 1200,
                   "agreementExact": sum(row["firstPass"]["grade"] == second[row["id"]]["grade"] for row in rows) / 3000,
                   "agreementKeepThreshold": sum((row["firstPass"]["grade"] >= 4) == (second[row["id"]]["grade"] >= 4) for row in rows) / 3000})
print(json.dumps(result, indent=2))
