# Authoring provenance

The original author writes every TSV row and its first-pass reason directly.
Build scripts only serialize these authored rows. No random-word permutations,
automatically generated joke templates, or automatic quality grades are used.

Each measured batch is sealed separately, including the original TSV containing
first-pass grades and its grade-free JSON input. The full candidate pool is not
complete yet. Send `review-inputs/*.json` to the independent reviewer in batches;
record that reviewer's identity and full per-row results. The final combined
`review-input.json` will also receive a complete-pool seal before selection.

## Resumed completion and final curation

The resumed primary agent `resume_b14_author` retained the first 2,800 authored
rows, integrated existing independent reviews without edits, sealed the existing
batch 029 draft and hand-authored batch 030. All 3,000 now have individual first
and independent second grades. `resume_b14_review` read only grade-free inputs
028–030 and the reviewer instructions before returning its 300 fresh grades.

Final curation read all 1,200 provisional rows and nine replacement rows. The
selected wording was never rewritten. Grade ranking and cap accounting are
mechanical selection tools; they never supply or alter editorial quality grades.
The complete-pool input seal and all 30 individual author/review seals remain.
