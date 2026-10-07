"""Structural draft checks and strict delivery gates; absent reviews never count as passes."""
import argparse
import hashlib
import json
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
    named = Counter()
    for row in selected:
        original = by_id[row["id"]]
        assert row["text"] == original["text"] and row["kind"] == original["kind"], "selection differs from graded input"
        assert original["firstPass"]["grade"] >= 4 and second[row["id"]]["grade"] >= 4, "selected prompt failed a grading pass"
        named.update(original["namedReferences"])
    assert max(named.values(), default=0) <= 3, "named brand/person appears more than three times"
    result.update({"secondPassCases": 3000, "selectedCounts": dict(final_counts),
                   "agreementExact": sum(row["firstPass"]["grade"] == second[row["id"]]["grade"] for row in rows) / 3000,
                   "agreementKeepThreshold": sum((row["firstPass"]["grade"] >= 4) == (second[row["id"]]["grade"] >= 4) for row in rows) / 3000})
print(json.dumps(result, indent=2))
