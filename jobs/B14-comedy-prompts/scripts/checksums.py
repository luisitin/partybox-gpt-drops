from pathlib import Path
import hashlib
ROOT = Path(__file__).resolve().parents[1]
paths = sorted(path for path in ROOT.rglob("*") if path.is_file()
               and ".work" not in path.parts and "__pycache__" not in path.parts
               and path.name != "SHA256SUMS.txt")
manifest = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(ROOT)}" for path in paths]
(ROOT / "SHA256SUMS.txt").write_text("\n".join(manifest) + "\n")
print(f"Hashed {len(paths)} job files")
