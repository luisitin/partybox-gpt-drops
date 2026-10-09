"""One changed-source original acceptance attempt; no clock or gate changes."""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import sys

repo = Path(__file__).resolve().parents[2]
job = repo / "jobs/B19-name-filter"
out = repo / ".work/B19-first-trie-full"
assert not out.exists(), "This first full attempt already exists; do not retry it."
out.mkdir()
head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=repo, text=True).strip()
assert head == "83db439a87637f9e4350c3b3da199c386752ae50"
paths = []
for row in (job / "SHA256SUMS.txt").read_text().splitlines():
    expected, relative = row.split("  ", 1)
    path = (job / relative).resolve()
    assert hashlib.sha256(path.read_bytes()).hexdigest() == expected
    paths.append(path)
for relative in ["SHA256SUMS.txt", "dist/nameFilter.js", "dist/tests/reference.js",
                 "data/cache/names.json", "data/cache/words.json", "data/cache/places.json",
                 "node_modules/typescript/bin/tsc", "node_modules/typescript/lib/tsc.js",
                 "node_modules/typescript/lib/_tsc.js", "node_modules/typescript/package.json"]:
    paths.append(job / relative)
paths += [Path(shutil.which("node")).resolve(), Path(__file__).resolve()]

def guards():
    return {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in paths}

source_start = guards()
assert source_start[str(job / "nameFilter.ts")] == "41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d"
assert source_start[str(job / "tests/run.mjs")] == "bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9"
started = datetime.now(timezone.utc).isoformat()
receipt = {"kind": "first-changed-source-original-full-acceptance", "head": head,
           "argv": ["npm", "test"], "workingDirectory": str(job),
           "startedUtc": started, "sourceStart": source_start,
           "clockOrGateChanges": False, "priorFailedAttemptsRetained": True}
(out / "START.json").write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"event": "START", "head": head, "startedUtc": started,
                  "guardedFiles": len(source_start), "argv": ["npm", "test"]}), flush=True)
with (out / "stdout.log").open("w") as stdout, (out / "stderr.log").open("w") as stderr:
    process = subprocess.run(["npm", "test"], cwd=job, stdout=stdout, stderr=stderr)
closed = datetime.now(timezone.utc).isoformat()
source_end = guards()
receipt.update({"closedUtc": closed, "exitCode": process.returncode,
                "sourceEnd": source_end, "sourcesUnchanged": source_end == source_start})
if (job / "reports/latest/summary.json").exists():
    shutil.copytree(job / "reports/latest", out / "reports")
    summary = json.loads((out / "reports/summary.json").read_text())
    receipt["summary"] = {"mode": summary["mode"], "suites": len(summary["suites"]),
                          "sourceSha256": summary["sourceSha256"], "failures": summary["failures"]}
(out / "CLOSED.json").write_text(json.dumps(receipt, indent=2) + "\n")
print(json.dumps({"event": "CLOSED", "closedUtc": closed, "exitCode": process.returncode,
                  "sourcesUnchanged": receipt["sourcesUnchanged"], "summary": receipt.get("summary")}), flush=True)
sys.exit(process.returncode if receipt["sourcesUnchanged"] else 2)
