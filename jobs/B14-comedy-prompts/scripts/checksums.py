"""Generate release hashes or verify all delivered files without changing them."""
import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAX_FILE_BYTES = 30_000_000
MANIFEST = "SHA256SUMS.txt"

def delivered_files(root):
    paths = []
    for path in root.rglob("*"):
        if ".work" in path.relative_to(root).parts or "__pycache__" in path.relative_to(root).parts:
            continue
        if path.is_symlink():
            raise ValueError("delivered symlink is not a regular local file: " + str(path.relative_to(root)))
        if path.is_file():
            if path.stat().st_size > MAX_FILE_BYTES:
                raise ValueError("delivered file exceeds 30 MB: " + str(path.relative_to(root)))
            if path != root / MANIFEST:
                paths.append(path)
    return sorted(paths)

def payload_hash(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()

def run(root, check):
    paths = delivered_files(root)
    expected = {str(path.relative_to(root)): payload_hash(path) for path in paths}
    manifest = root / MANIFEST
    if check:
        if not manifest.is_file():
            raise ValueError("missing delivery manifest")
        recorded = {}
        for number, line in enumerate(manifest.read_text().splitlines(), 1):
            match = re.fullmatch(r"([0-9a-f]{64})  (.+)", line)
            if not match:
                raise ValueError("invalid manifest line " + str(number))
            digest, relative = match.groups()
            relpath = Path(relative)
            if relpath.is_absolute() or ".." in relpath.parts or relative != relpath.as_posix() or relative in recorded:
                raise ValueError("unsafe or duplicate manifest path: " + relative)
            recorded[relative] = digest
        if recorded != expected:
            missing = sorted(set(expected) - set(recorded))
            stale = sorted(set(recorded) - set(expected))
            wrong = sorted(path for path in set(recorded) & set(expected) if recorded[path] != expected[path])
            raise ValueError("delivery manifest mismatch: unlisted=" + repr(missing) + ", absent=" + repr(stale) + ", hashes=" + repr(wrong))
    else:
        encoded = "\n".join(digest + "  " + path for path, digest in expected.items()) + "\n"
        if len(encoded.encode()) > MAX_FILE_BYTES:
            raise ValueError("manifest exceeds 30 MB")
        manifest.write_text(encoded)
    return {"mode": "check" if check else "generate", "hashedFiles": len(paths), "sizeCheckedFiles": len(paths) + 1,
            "maxDeliveredFileBytes": max([path.stat().st_size for path in paths] + [manifest.stat().st_size], default=0),
            "manifestChanged": not check}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify sizes, full manifest coverage and hashes without writing")
    args = parser.parse_args()
    print(json.dumps(run(ROOT, args.check)))

if __name__ == "__main__":
    main()
