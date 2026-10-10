from pathlib import Path
import hashlib
import json
ROOT = Path(__file__).resolve().parents[1]
paths = sorted(path for path in ROOT.rglob("*") if path.is_file()
               and ".work" not in path.parts and "__pycache__" not in path.parts
               and path.name != "SHA256SUMS.txt")
assert all(path.stat().st_size <= 30_000_000 for path in paths), "delivered file exceeds 30 MB"
manifest = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(ROOT)}" for path in paths]
(ROOT / "SHA256SUMS.txt").write_text("\n".join(manifest) + "\n")
assert (ROOT / "SHA256SUMS.txt").stat().st_size <= 30_000_000, "manifest exceeds 30 MB"
print(json.dumps({"hashedFiles": len(paths), "sizeCheckedFiles": len(paths) + 1,
                  "maxDeliveredFileBytes": max([path.stat().st_size for path in paths], default=0)}))
