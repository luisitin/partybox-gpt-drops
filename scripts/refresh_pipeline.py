#!/usr/bin/env python3
"""Refresh the project pipeline from GitHub branches, commits, and pull requests."""
from __future__ import annotations

import json
import os
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "luisitin/partybox-gpt-drops")
TOKEN = os.environ["GITHUB_TOKEN"]
API = f"https://api.github.com/repos/{REPO}"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {TOKEN}",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "partybox-pipeline-refresh",
}


def get_json(url: str):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def plain(text: str, limit: int = 360) -> str:
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"[*_>#]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def pr_notes(pull: dict) -> str:
    body = pull.get("body") or ""
    paragraphs = [plain(part, 320) for part in re.split(r"\n\s*\n", body) if plain(part, 320) and not part.strip().startswith("#")]
    description = paragraphs[0] if paragraphs else pull.get("title", "No PR description")
    match = re.search(r"### Verification status\s*(.*?)(?:\n### |\Z)", body, flags=re.S | re.I)
    verification = plain(match.group(1), 1200) if match else ""
    note = f"PR says: {description}"
    if verification:
        note += f" Verification note: {verification}"
    return note


prompts = Path("PROMPTS.md").read_text(encoding="utf-8")
jobs = re.findall(r"^## (B\d{2}) (.+)$", prompts, flags=re.MULTILINE)
if not jobs:
    raise SystemExit("No job headings found in PROMPTS.md")

branches = get_json(f"{API}/branches?per_page=100")
pulls = get_json(f"{API}/pulls?state=all&per_page=100")
branch_by_name = {item["name"]: item for item in branches}
main_sha = branch_by_name["main"]["commit"]["sha"]
latest_by_head = {}
for pull in pulls:
    head = pull.get("head", {}).get("ref", "")
    if head and (head not in latest_by_head or pull["updated_at"] > latest_by_head[head]["updated_at"]):
        latest_by_head[head] = pull

groups = {"Pre-pipeline": [], "Pipeline": [], "Review": [], "Completed": []}
for job_id, title in jobs:
    prefix = f"job/{job_id}-"
    branch_name = next((name for name in branch_by_name if name.startswith(prefix)), None)
    if branch_name is None:
        branch_name = next((name for name in latest_by_head if name.startswith(prefix)), None)
    branch = branch_by_name.get(branch_name) if branch_name else None
    pull = latest_by_head.get(branch_name) if branch_name else None
    head_sha = branch["commit"]["sha"] if branch else (pull or {}).get("head", {}).get("sha")

    if pull and pull.get("merged_at"):
        stage = "Completed"
    elif pull and pull["state"] == "open":
        stage = "Review"
    elif branch or pull:
        stage = "Pipeline"
    else:
        stage = "Pre-pipeline"

    compare = {}
    if pull and pull.get("merged_at"):
        try:
            compare = {"files": get_json(f"{API}/pulls/{pull['number']}/files?per_page=100")}
        except Exception:
            compare = {}
    elif head_sha and head_sha != main_sha:
        try:
            compare = get_json(f"{API}/compare/{main_sha}...{head_sha}")
        except Exception:
            compare = {}

    changed_files = compare.get("files", [])
    job_files = [f["filename"] for f in changed_files if f["filename"].startswith(f"jobs/{job_id}-")]
    workflow = f".github/workflows/{job_id}.yml" in [f["filename"] for f in changed_files]
    if job_files:
        work = "Project files changed: " + ", ".join(job_files[:5])
        if len(job_files) > 5:
            work += f", and {len(job_files) - 5} more"
        if workflow:
            work += "; job CI workflow also added"
    elif workflow:
        work = "Added the job's GitHub verification workflow; no job deliverables are committed yet."
    elif changed_files:
        names = [f["filename"] for f in changed_files]
        work = "Changed files: " + ", ".join(names[:5])
        if len(names) > 5:
            work += f", and {len(names) - 5} more"
    elif branch:
        work = "Branch is reserved, but has no commits beyond main."
    elif pull and pull.get("state") == "closed":
        work = "Previous pull request closed without merge; branch is no longer available."
    elif pull:
        work = "Pull request exists, but its branch is no longer available."
    else:
        work = "No job branch or pull request found."

    if pull:
        work += " " + pr_notes(pull)

    commits = compare.get("commits", [])
    if pull and pull.get("merged_at"):
        date = datetime.fromisoformat(pull["merged_at"].replace("Z", "+00:00")).astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        evidence = f"{date} — merged PR #{pull['number']}: {plain(pull['title'], 180)}"
    elif commits:
        commit = commits[-1]
        message = plain(commit.get("commit", {}).get("message", "").splitlines()[0], 180)
        date = commit.get("commit", {}).get("author", {}).get("date", "")
        if date:
            date = datetime.fromisoformat(date.replace("Z", "+00:00")).astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        evidence = f"{date} — {message}" if date else message
    else:
        evidence = "No new commit beyond main" if branch and head_sha == main_sha else "No commit details available"

    if changed_files:
        evidence += "; files: " + ", ".join(f["filename"] for f in changed_files[:6])
        if len(changed_files) > 6:
            evidence += f", +{len(changed_files) - 6} more"
    if pull:
        evidence += f"; [PR #{pull['number']}]({pull['html_url']})"

    work = work.replace("|", "\\|")
    evidence = evidence.replace("|", "\\|")
    link = pull["html_url"] if pull else (
        f"https://github.com/{REPO}/tree/{branch_name}" if branch_name else
        f"https://github.com/{REPO}/blob/main/PROMPTS.md"
    )
    groups[stage].append((job_id, title, stage, work, evidence, link))

now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
lines = [
    "# ChatGPT project pipeline",
    "",
    f"_Last refreshed: {now}_",
    "",
    "This tracker covers the 20 jobs in [PROMPTS.md](PROMPTS.md). It reads branch commits, changed files, and pull-request notes from GitHub.",
    "",
    "Live dashboard: https://partybox-project-tracker.artificiallysloppy.chatgpt.site",
    "",
    "The notes below describe what the GitHub record suggests is being worked on. They are evidence from commits and pull requests, not a claim that a job has passed verification.",
    "",
    "## Stage meanings",
    "",
    "- **Pre-pipeline:** no job branch or pull request exists.",
    "- **Pipeline:** a job branch exists, or a previous pull request was closed without merging.",
    "- **Review:** a pull request is open.",
    "- **Completed:** a pull request has been merged.",
    "",
    f"**Current count:** {len(groups['Pre-pipeline'])} pre-pipeline, {len(groups['Pipeline'])} pipeline, {len(groups['Review'])} in review, {len(groups['Completed'])} completed.",
    "",
]
for stage, items in groups.items():
    lines.extend([f"## {stage} ({len(items)})", ""])
    if items:
        lines.extend(["| Job | What seems to be worked on | Latest evidence |", "|---|---|---|"])
        for job_id, title, status, work, evidence, link in items:
            lines.append(f"| [{job_id} {title}]({link}) | {work} | {evidence} |")
    else:
        lines.append("_None._")
    lines.append("")

Path("PIPELINE.md").write_text("\n".join(lines), encoding="utf-8")
