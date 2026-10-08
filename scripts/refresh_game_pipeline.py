#!/usr/bin/env python3
"""Read fresh game-cores state; keep operator acceptance notes separate from CI."""
from __future__ import annotations
import base64, concurrent.futures, json, os, re, urllib.request
from datetime import datetime, timezone
from pathlib import Path
REPO = "luisitin/partybox-game-cores"
API = f"https://api.github.com/repos/{REPO}"
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
HEADERS = {"Accept":"application/vnd.github+json", "User-Agent":"partybox-game-pipeline", "X-GitHub-Api-Version":"2022-11-28"}
if TOKEN: HEADERS["Authorization"] = f"Bearer {TOKEN}"
def get(path):
    with urllib.request.urlopen(urllib.request.Request(API + path, headers=HEADERS), timeout=30) as response:
        return json.load(response)
def paged(path):
    result=[]
    for page in range(1,20):
        values=get(path + ("&" if "?" in path else "?") + f"per_page=100&page={page}")
        result.extend(values)
        if len(values)<100: return result
    raise RuntimeError("GitHub pagination exceeded explicit bound")
def plain(value): return re.sub(r"\s+", " ", str(value or "")).strip()
def cell(value): return plain(value).replace("|", "\\|")
root=Path(__file__).resolve().parents[1]
activity_path=root/"_pipeline/game-cores.json"
activity=json.loads(activity_path.read_text()) if activity_path.exists() else {"workers":[]}
notes={w["current"]:w for w in activity.get("workers",[])}
source=get("/contents/JOBS.md?ref=main")
jobs=re.findall(r"^## (G\d{2}) (.+)$",base64.b64decode(source["content"]).decode(),re.M)
if len(jobs)!=10: raise RuntimeError("Expected ten game jobs")
branches=paged("/branches")
pulls=paged("/pulls?state=all")
def observe(job):
    job_id,title=job
    prefix=f"job/{job_id}-"
    matching=sorted((p for p in pulls if p["head"]["ref"].startswith(prefix)),key=lambda p:p["updated_at"],reverse=True)
    pull=matching[0] if matching else None
    matching_branches=[b for b in branches if b["name"].startswith(prefix)]
    binding=pull["head"]["ref"] if pull else activity.get("activeBranches",{}).get(job_id)
    branch=next((b for b in matching_branches if b["name"]==binding),None) if binding else next(iter(matching_branches),None)
    sha=branch["commit"]["sha"] if branch else pull["head"]["sha"] if pull else None
    stage="Completed" if pull and pull.get("merged_at") else "Review" if pull and pull["state"]=="open" else "Pipeline" if branch or pull else "Pre-pipeline"
    run_error=None
    try:
        runs=get(f"/actions/runs?head_sha={sha}&per_page=100").get("workflow_runs",[]) if sha else []
        runs=[r for r in runs if r["head_sha"]==sha and f"/{job_id}.yml" in r.get("path","")]
        runs.sort(key=lambda r:(r.get("run_number",0),r.get("run_attempt",0)),reverse=True)
        run=runs[0] if runs else None
    except Exception as error:
        run=None;run_error=str(error)
    try:
        if pull:
            files=[f["filename"] for f in paged(f"/pulls/{pull['number']}/files")]
        elif sha:
            tree=get(f"/git/trees/{sha}?recursive=1")
            if tree.get("truncated"): raise RuntimeError("GitHub tree was truncated")
            files=[f["path"] for f in tree.get("tree",[]) if f["type"]=="blob" and (f["path"].startswith(f"jobs/{job_id}-") or f["path"]==f".github/workflows/{job_id}.yml")]
        else: files=[]
    except Exception as error: files=[]
    return {"id":job_id,"title":title,"stage":stage,"branch":branch["name"] if branch else None,"head":sha,"otherBranches":[{"name":b["name"],"head":b["commit"]["sha"]} for b in matching_branches if not branch or b["name"]!=branch["name"]],
        "pr": {k:pull.get(k) for k in ("number","html_url","title","state","draft","merged_at","updated_at","body")} if pull else None,
        "check": {k:run.get(k) for k in ("id","head_sha","status","conclusion","html_url","updated_at","path")} if run else None,
        "checkError":run_error,"files":files,"operatorNote":notes.get(job_id)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: rows=list(pool.map(observe,jobs))
now=datetime.now(timezone.utc).isoformat()
activity.update(repository=REPO,observedAt=now,rows=rows)
activity_path.parent.mkdir(parents=True,exist_ok=True)
activity_path.write_text(json.dumps(activity,indent=2)+"\n")
counts={stage:sum(row["stage"]==stage for row in rows) for stage in ("Pre-pipeline","Pipeline","Review","Completed")}
lines=["# Game core pipeline","",f"_GitHub state observed: {now}_","",f"Source: https://github.com/{REPO}","","Live dashboard: https://partybox-project-tracker.artificiallysloppy.chatgpt.site","","Completed means merged. Ready for review is a separate PR state; green CI does not by itself establish original acceptance.","",activity.get("summary",""),"",f"Operator work notes: {activity.get('updatedAt','unavailable')}","","**Current stages:** "+", ".join(f"{count} {stage.lower()}" for stage,count in counts.items())+".",""]
for stage in counts:
    group=[row for row in rows if row["stage"]==stage]
    lines.extend([f"## {stage} ({len(group)})",""])
    if not group: lines.extend(["_None._",""]);continue
    lines.extend(["| Game | PR / exact head | Exact-head workflow | Verified work / pending next step |","|---|---|---|---|"])
    for row in group:
        pr,run,note=row["pr"],row["check"],row["operatorNote"]
        prtext=f"[PR #{pr['number']}]({pr['html_url']}) · {'draft' if pr['draft'] else 'ready for review'}" if pr else "No PR"
        result=(run.get("conclusion") or "unknown") if run and run["status"]=="completed" else run["status"] if run else "Unavailable" if row["checkError"] else "No run found"
        checks=f"[{result}]({run['html_url']})" if run else result
        detail=(note["summary"]+" **Next:** "+note["next"]) if note else "No current operator acceptance note. Read the PR evidence and original JOBS.md; readiness is not inferred from workflow status."
        lines.append(f"| {cell(row['id']+' '+row['title'])} | {prtext} · `{(row['head'] or '')[:12]}` | {checks} | {cell(detail)} |")
    lines.append("")
lines.extend(["## Delivered files by game",""])
for row in rows:
    lines.extend([f"### {row['id']} {row['title']}","",f"Exact branch head: `{row['head'] or 'none'}`.",""])
    if row["otherBranches"]:
        lines.extend(["Other matching branches (separate history; not the active delivery):", ""])
        lines.extend(f"- [{branch['name']}](https://github.com/{REPO}/tree/{branch['name']}) · `{branch['head']}`" for branch in row["otherBranches"])
        lines.append("")
    if row["files"]:
        lines.extend(f"- [{name}](https://github.com/{REPO}/blob/{row['head']}/{name})" for name in row["files"])
    else: lines.append("Changed file list unavailable or empty.")
    lines.append("")
(root/"GAME-PIPELINE.md").write_text("\n".join(lines))
print(json.dumps({"observedAt":now,"counts":counts,"rows":[{k:row[k] for k in ('id','head','stage','check')} for row in rows]}))
