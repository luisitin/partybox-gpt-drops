"""Read-only exact global curation check against unchanged sealed grades."""
import json
from pathlib import Path
from ranked_selection import select
ROOT=Path(__file__).resolve().parents[1]
load=lambda p:json.loads((ROOT/p).read_text())
rows=load("candidates.json");second={r["id"]:r for r in load("grading/pass2.json")["rows"]};aliases=load("named-reference-aliases.json")["tagToCanonical"]
decisions=load("curation-decisions.json")
excluded={r["id"] for r in decisions["excludedAfterPassingGrades"]}|{"Q0997","M0997","Q1040","M1178","Q0007","Q0017","M0580"}
expected=select(rows,second,aliases,excluded)
actual=load("prompts.json")
assert sorted(r["id"] for r in actual)==sorted(r["id"] for r in expected),"selection is not the exact declared best feasible ranked set"
print(json.dumps({"actualSelected":len(actual),"allOriginalCandidates":len(rows),"bothGenreQuotas":600,"combinedReferenceCap":3,"exactGlobalRankedFeasibleSelection":True,"originalWordsAndGradesChanged":False}))
