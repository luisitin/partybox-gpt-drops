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
out = repo / ".work/B19-first-ascii-DFA-full"
assert not out.exists(), "This first full attempt already exists; do not retry it."
grant_file = Path(__file__).parent / 'grant.json'
assert grant_file.exists(), 'Root exclusive grant required; controller may not run before it.'
grant = json.loads(grant_file.read_text())
assert grant['expectedHead'] == '5a49063d430e9f5c71ea31da9bac6775280b3c28'
assert grant['scope'] == 'one first current-source original full npm test'
assert grant['quietGranted'] is True
assert grant['expectedSourceSha256'] == '7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d'
out.mkdir()
head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=repo, text=True).strip()
assert head == "5a49063d430e9f5c71ea31da9bac6775280b3c28"
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
for relative in ["B19-ascii-DFA-fold-candidate/candidate-nameFilter.ts", "B19-ascii-DFA-fold-candidate/compiled/candidate-nameFilter.js", "B19-ascii-DFA-fold-candidate/equivalence-latest.json", "B19-ascii-DFA-fold-candidate/timing-latest.json", "B19-ascii-DFA-fold-candidate/structural-control.json", "B19-ascii-DFA-fold-mutation/CLOSED.json", "B19-ascii-DFA-fold-coordination/balanced-block-review.json", "B19-failed-hosted-5a/independent-failed-hosted-validation.json"]:
    paths.append(repo / ".work" / relative)

def guards():
    return {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in paths}

source_start = guards()
ready = json.loads((Path(__file__).parent / 'READY.json').read_text())
assert source_start == ready['sourceGuards'], 'READY guards changed; obtain new source-bound preparation.'
assert hashlib.sha256((job / 'dist/nameFilter.js').read_bytes()).hexdigest() == 'e4b39efbf033bef9c41788e9bf0f002cdb61ff9dbbdfa6cbfcbfda65122d2cf9'
assert source_start[str(job / "nameFilter.ts")] == "7817489fc1d0908a87914223a84b31c15ea7e13b3555cb4238594751616f163d"
assert source_start[str(job / "tests/run.mjs")] == "bff0c17b62aa75d342527a8ced855678380411053476557acde61f2e1b6fbdd9"
started = datetime.now(timezone.utc).isoformat()
receipt = {"kind": "first-ASCII-DFA-changed-source-original-full-acceptance", "head": head,
           "argv": ["npm", "test"], "workingDirectory": str(job),
           "startedUtc": started, "sourceStart": source_start,
           "clockOrGateChanges": False, "priorFailedAttemptsRetained": True,
           "rootGrant": grant,
           "hostedCurrentAcceptedGreenBeforeStart": False,
           "requiredAfterGreenKEEPFulfilledByThisRun": False}
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
