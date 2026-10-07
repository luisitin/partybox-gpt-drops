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
    selected = json.loads((ROOT / "prompts.json").read_text())
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
        assert row["text"] == original["text"] and row["kind"] == original["kind"], "selection differs from graded input"
        assert original["firstPass"]["grade"] >= 4 and second[row["id"]]["grade"] >= 4, "selected prompt failed a grading pass"
        named.update({aliases.get(reference, reference) for reference in original["namedReferences"]})
    assert max(named.values(), default=0) <= 3, "named brand/person appears more than three times"
    normalize = lambda text: re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()
    flagged = []
    for index, a in enumerate(selected):
        left = normalize(a["text"])
        left_content = left.removeprefix("who s most likely to ")
        for b in selected[index + 1:]:
            right = normalize(b["text"])
            right_content = right.removeprefix("who s most likely to ")
            full_ratio = difflib.SequenceMatcher(None, left, right, autojunk=False).ratio()
            content_ratio = difflib.SequenceMatcher(None, left_content, right_content, autojunk=False).ratio()
            if max(full_ratio, content_ratio) > 0.75:
                flagged.append({"ids": sorted([a["id"], b["id"]]),
                                "fullTextRatio": full_ratio, "contentRatio": content_ratio})
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
    result.update({"secondPassCases": 3000, "selectedCounts": dict(final_counts),
                   "similarityPairComparisons": len(selected) * (len(selected) - 1) // 2,
                   "similarityFlaggedAndResolved": len(flagged), "editorialCases": 1200,
                   "agreementExact": sum(row["firstPass"]["grade"] == second[row["id"]]["grade"] for row in rows) / 3000,
                   "agreementKeepThreshold": sum((row["firstPass"]["grade"] >= 4) == (second[row["id"]]["grade"] >= 4) for row in rows) / 3000})
print(json.dumps(result, indent=2))
