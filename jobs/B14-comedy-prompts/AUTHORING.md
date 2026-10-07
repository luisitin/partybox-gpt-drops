# Authoring provenance

The original author writes every TSV row and its first-pass reason directly.
Build scripts only serialize these authored rows. No random-word permutations,
automatically generated joke templates, or automatic quality grades are used.

Each measured batch is sealed separately, including the original TSV containing
first-pass grades and its grade-free JSON input. The full candidate pool is not
complete yet. Send `review-inputs/*.json` to the independent reviewer in batches;
record that reviewer's identity and full per-row results. The final combined
`review-input.json` will also receive a complete-pool seal before selection.
