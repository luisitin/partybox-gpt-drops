"""Enforce explicit personally reviewed premise exclusions; no automatic semantic claim."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def check(root):
    selected = {row["id"] for row in json.loads((root / "prompts.json").read_text())}
    pairs = json.loads((root / "semantic-premise-review.json").read_text())["reviewedRepeatedPremisePairs"]
    collisions = [row["pair"] for row in pairs if set(row["pair"]) <= selected]
    assert not collisions, f"Repeated concrete premises are still selected: {collisions}"
    return {"explicitReviewedPairs": len(pairs), "selectedPremiseCollisions": len(collisions), "scope": "Enforces actual reviewed pairs only; neither a full semantic oracle nor complete research qualification."}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=ROOT)
    print(json.dumps(check(parser.parse_args().root), indent=2))
