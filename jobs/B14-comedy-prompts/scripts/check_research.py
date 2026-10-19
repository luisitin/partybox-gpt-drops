"""Check research metadata without turning partial fact coverage into readiness."""
import argparse
import hashlib
import json
from datetime import datetime
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]

def check(root, partial=False):
    load = lambda name: json.loads((root / name).read_text())
    facts = load("reports/audit-20261009/verified-initial-cues.json")
    schema = load("reports/audit-20261009/verified-initial-cues.schema.json")
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema).validate(facts)
    prompts = load("prompts.json")
    by_id = {row["id"]: row for row in prompts}
    review = load("research-review.json")
    Draft202012Validator(load("research-review.schema.json")).validate(review)
    assert review["selectedSha256"] == hashlib.sha256((root / "prompts.json").read_bytes()).hexdigest(), "research review is stale"
    ids = {fact["id"] for fact in facts}
    assert len(ids) == len(facts), "duplicate fact ID"
    conflict_ids = set(load("reports/audit-20261009/initial-cue-conflicts.json"))
    for fact in facts:
        assert set(fact["promptIds"]) <= by_id.keys(), "fact refers to a removed prompt"
        assert set(fact["conflictIds"]) <= conflict_ids, "undocumented source conflict"
        sources = fact["sources"]
        assert len({source["independentAuthorGroup"].casefold().strip() for source in sources}) == 2, "sources share authorship"
        assert len({source["url"] for source in sources}) == 2, "source URL repeated"
        for source in sources:
            assert len(source["quote"].split()) == source["quoteWords"] <= 25, "quote exceeds bound or word count is false"
            assert [record["pass"] for record in source["fullPasses"]] == [1, 2], "second full opening is missing"
            for record in source["fullPasses"]:
                assert datetime.fromisoformat(record["closedUTC"]) >= datetime.fromisoformat(record["openedUTC"]), "impossible opening chronology"
    rows = review["rows"]
    assert len(rows) == len(by_id) == 1200 and {row["promptId"] for row in rows} == by_id.keys(), "research does not cover every selected row"
    proof_path = root / "research-second-pass.json"
    proof = json.loads(proof_path.read_text()) if proof_path.exists() else {"rows": []}
    verified_ids = {row["promptId"] for row in rows if row["status"] == "VERIFIED"}
    proof_rows = {row["promptId"]: row for row in proof["rows"]}
    assert len(proof_rows) == len(proof["rows"]) and set(proof_rows) == verified_ids, "verified rows lack exact second-pass coverage"
    if verified_ids:
        assert proof["selectedSha256"] == review["selectedSha256"], "second pass belongs to another selected pack"
        assert proof["qualifiedFactsSha256"] == hashlib.sha256((root / "reports/audit-20261009/verified-initial-cues.json").read_bytes()).hexdigest(), "second pass belongs to different facts"
    for row in rows:
        prompt = by_id[row["promptId"]]
        assert row["textSha256"] == hashlib.sha256(prompt["text"].encode()).hexdigest(), "review belongs to different text"
        assert set(row["verifiedFactIds"]) <= ids, "row uses an unknown fact"
        for fact_id in row["verifiedFactIds"]:
            assert row["promptId"] in next(f for f in facts if f["id"] == fact_id)["promptIds"], "fact not associated with this prompt"
        if row["status"] == "VERIFIED":
            assert row["allActualCuesReviewed"] and row["verifiedFactIds"] and row["coverageReason"], "limited facts cannot qualify an entire row"
            observed = proof_rows[row["promptId"]]
            assert observed["actualFullText"] == prompt["text"] and observed["textSha256"] == row["textSha256"] and observed["allActualCuesReviewed"], "second pass did not cover this exact text"
            assert observed["factIds"] == row["verifiedFactIds"] and observed["cueAndCreativeClassification"] == row["coverageReason"], "second-pass cue classification differs"
            expected_sources = {(fact_id, source["sourceId"]): source for fact_id in row["verifiedFactIds"] for source in next(f for f in facts if f["id"] == fact_id)["sources"]}
            checks = observed["sourceReopeningChecks"]
            assert len(checks) == len(expected_sources) and {(check["factId"], check["sourceId"]) for check in checks} == expected_sources.keys(), "second pass omitted a fact source"
            for check in checks:
                source = expected_sources[check["factId"], check["sourceId"]]
                assert check["actualBothCapturedBodiesAndExactQuoteOffsetsRechecked"] and check["url"] == source["url"] and check["independentAuthorGroup"] == source["independentAuthorGroup"], "second-pass source identity differs"
                second = source["fullPasses"][1]
                assert check["secondRawSha256"] == second["rawSha256"] and check["secondVisibleSha256"] == second["visibleSha256"] and check["secondOpenedUTC"] == second["openedUTC"] and check["secondClosedUTC"] == second["closedUTC"], "second full-opening receipt differs"
    incomplete = [row["promptId"] for row in rows if row["status"] != "VERIFIED"]
    report = {"mode": "partial-metadata" if partial else "strict-readiness", "schemaValidatedFacts": len(facts), "reviewRows": len(rows), "fullyQualifiedRows": len(rows) - len(incomplete), "unverifiedRows": len(incomplete), "ready": not incomplete, "scope": "Metadata integrity only; original full-source acceptance receipts qualify individual facts. Partial mode never grants readiness."}
    if not partial:
        assert not incomplete, f"UNVERIFIED: {len(incomplete)} selected prompts still need complete cultural-cue review"
    return report

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--partial", action="store_true")
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    print(json.dumps(check(args.root, args.partial), indent=2))
