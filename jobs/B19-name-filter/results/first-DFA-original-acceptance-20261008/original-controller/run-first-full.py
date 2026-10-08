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
out = repo / ".work/B19-first-DFA-full"
assert not out.exists(), "This first full attempt already exists; do not retry it."
out.mkdir()
head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=repo, text=True).strip()
assert head == "559969f514d8c943a837e4759576c81d27b8a7c0"
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
for relative in ["B19-dfa-compact-candidate/candidate-nameFilter.ts", "B19-dfa-compact-candidate/compiled/candidate-nameFilter.js", "B19-dfa-compact-candidate/equivalence-latest.json", "B19-dfa-compact-candidate/timing-latest.json", "B19-dfa-compact-candidate/structural-control.json", "B19-dfa-full-mutation/CLOSED.json", "B19-dfa-coordination/balanced-block-review.json"]:
    paths.append(repo / ".work" / relative)

def guards():
    return {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in paths}

source_start = guards()
assert source_start[str(job / "nameFilter.ts")] == "ae8dc388665a4b4241b40b7ce1b86ba98e9eaadde7facefddf8ee47a00858e8a"
assert source_start[str(job / "tests/run.mjs")] == "bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9"
started = datetime.now(timezone.utc).isoformat()
receipt = {"kind": "first-DFA-changed-source-original-full-acceptance", "head": head,
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
