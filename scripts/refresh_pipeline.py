#!/usr/bin/env python3
"""Refresh PIPELINE.md from the repository's job prompts, branches, and pull requests."""
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


prompts = Path("PROMPTS.md").read_text(encoding="utf-8")
jobs = re.findall(r"^## (B\d{2}) (.+)$", prompts, flags=re.MULTILINE)
if not jobs:
    raise SystemExit("No job headings found in PROMPTS.md")

branches = get_json(f"{API}/branches?per_page=100")
pulls = get_json(f"{API}/pulls?state=all&per_page=100")
branch_names = {item["name"] for item in branches}
latest_by_head = {}
for pull in pulls:
    head = pull.get("head", {}).get("ref", "")
    if head and (head not in latest_by_head or pull["updated_at"] > latest_by_head[head]["updated_at"]):
        latest_by_head[head] = pull

groups = {"Pre-pipeline": [], "Pipeline": [], "Review": [], "Completed": []}
for job_id, title in jobs:
    prefix = f"job/{job_id}-"
    matching_branch = next((name for name in branch_names if name.startswith(prefix)), None)
    pull = latest_by_head.get(matching_branch) if matching_branch else None

    if pull and pull.get("merged_at"):
        stage = "Completed"
        detail = f"[PR #{pull['number']}]({pull['html_url']}) merged"
    elif pull and pull["state"] == "open":
        stage = "Review"
        detail = f"[PR #{pull['number']}]({pull['html_url']}) open for review"
    elif matching_branch:
        stage = "Pipeline"
        detail = f"Branch [{matching_branch}](https://github.com/{REPO}/tree/{matching_branch}) exists; no open PR"
        if pull:
            detail += f"; [PR #{pull['number']}]({pull['html_url']}) closed without merge"
    else:
        stage = "Pre-pipeline"
        detail = "No job branch found"

    groups[stage].append((job_id, title, detail))

now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
lines = [
    "# ChatGPT project pipeline",
    "",
    f"_Last refreshed: {now}_",
    "",
    "This tracker follows the 20 jobs listed in [PROMPTS.md](PROMPTS.md). It checks the job branches and pull requests in this repository.",
    "Live dashboard: https://partybox-project-tracker.artificiallysloppy.chatgpt.site",
    "",
    "## Stage meanings",
    "",
    "- **Pre-pipeline:** no job branch has been created yet.",
    "- **Pipeline:** a job branch exists, but its pull request is not open.",
    "- **Review:** a pull request is open and waiting for review.",
    "- **Completed:** a pull request has been merged.",
    "",
    f"**Current count:** {len(groups['Pre-pipeline'])} pre-pipeline, {len(groups['Pipeline'])} pipeline, {len(groups['Review'])} in review, {len(groups['Completed'])} completed.",
    "",
]
for stage, items in groups.items():
    lines.extend([f"## {stage} ({len(items)})", ""])
    if items:
        lines.extend(["| Job | Project | GitHub status |", "|---|---|---|"])
        for job_id, title, detail in items:
            lines.append(f"| {job_id} | {title} | {detail} |")
    else:
        lines.append("_None._")
    lines.append("")

Path("PIPELINE.md").write_text("\n".join(lines), encoding="utf-8")
