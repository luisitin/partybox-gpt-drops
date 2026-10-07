# Editorial disagreements and rejected versions

All 3,000 candidates received two actual per-row grading passes. The graders
agreed on the exact grade for 1,343 rows (44.76666667%) and on the grade-4 keep
threshold for 2,217 rows (73.9%). All 1,657 score disagreements and all 783
threshold disagreements remain visible in the first and second grading records.
No score was silently increased or replaced to achieve the final count.

The first author missed the child mascots in Q0997/M0997 (Morton Salt) and Q1040
(Wendy's). Independent reviewers rejected these, and all three original rows are
excluded unchanged. Final curation also excluded M1178: its USPS tag was not
present in the actual wording, despite passing its earlier humor grades. The
additional reference audit preserves this miss and does not reinterpret generic
postal wording as an explicitly named brand.

Eight repeated premises were removed after the first selection's eleven
similarity flags. Four genuinely different mechanisms remain, each with a
specific recorded explanation. Nine eligible unchanged replacements preserve
600 rows per genre. `curation-iterations/01/` keeps the initial selection and
all eleven decisions; no independent wording or grade was edited.

This is original adult fiction, so there are no nonfiction research claims or
factual-source disagreements to reconcile. Brand cues and fictional dialogue
are explicitly not factual descriptions of real events or products.

A final weakness check found that SequenceMatcher is order-sensitive. Both
argument directions are now checked for every pair and both text forms. This
exposed the extra M0338/M1338 merchandising repetition; M0338 was removed
unchanged and replaced by M0386. The earlier one-direction pool scan and the
newly exposed flag are preserved in `curation-iterations/`. The strengthened
full scan must retain every original flag, rather than weakening the threshold.
