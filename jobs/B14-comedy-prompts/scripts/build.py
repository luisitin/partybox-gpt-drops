"""Convert hand-authored TSV batches; no generated wording or automatic grading."""
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
counts = Counter()
rows = []
(ROOT / "review-inputs").mkdir(exist_ok=True)
(ROOT / "seals").mkdir(exist_ok=True)
for path in sorted((ROOT / "batches").glob("*.tsv")):
    batch_rows = []
    for line_number, line in enumerate(path.read_text().splitlines(), 1):
        if not line or line.startswith("#"):
            continue
        fields = line.split("|")
        if len(fields) != 5:
            raise ValueError(f"{path.name}:{line_number}: expected five fields")
        kind, grade, references, prompt, reason = fields
        if kind not in ["fill", "most-likely"]:
            raise ValueError(f"{path.name}:{line_number}: unknown kind")
        if len(prompt) > 90 or not 1 <= int(grade) <= 5 or len(reason) < 10:
            raise ValueError(f"{path.name}:{line_number}: invalid length, grade, or reason before sealing")
        if (kind == "fill" and "___" not in prompt) or (kind == "most-likely" and not prompt.startswith("Who's most likely to ")):
            raise ValueError(f"{path.name}:{line_number}: invalid genre structure before sealing")
        counts[kind] += 1
        prefix = "Q" if kind == "fill" else "M"
        row = {"id": f"{prefix}{counts[kind]:04}", "kind": kind,
               "text": prompt, "namedReferences": references.split(";") if references else [],
               "firstPass": {"grade": int(grade), "reason": reason,
                             "reviewer": "original-author"}}
        rows.append(row)
        batch_rows.append({k: row[k] for k in ["id", "kind", "text", "namedReferences"]})
    batch_encoded = (json.dumps(batch_rows, indent=2, ensure_ascii=False) + "\n").encode()
    seal = {"batch": path.name, "firstPassSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "reviewInputSha256": hashlib.sha256(batch_encoded).hexdigest(),
            "candidateIds": [row["id"] for row in batch_rows]}
    seal_path = ROOT / "seals" / (path.stem + ".json")
    if seal_path.exists() and json.loads(seal_path.read_text()) != seal:
        raise ValueError(f"Sealed authoring batch changed: {path.name}; invalidate and document its review before resealing")
    seal_path.write_text(json.dumps(seal, indent=2) + "\n")
    (ROOT / "review-inputs" / (path.stem + ".json")).write_bytes(batch_encoded)
(ROOT / "candidates.json").write_text(json.dumps(rows, indent=2, ensure_ascii=False) + "\n")
view = [{k: row[k] for k in ["id", "kind", "text", "namedReferences"]} for row in rows]
encoded = (json.dumps(view, indent=2, ensure_ascii=False) + "\n").encode()
(ROOT / "review-input.json").write_bytes(encoded)
print(json.dumps({"candidates": dict(counts), "reviewInputSha256": hashlib.sha256(encoded).hexdigest()}))
