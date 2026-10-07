# B15 verification loop

1. Author the independent auditor from the public contract without source access; run its 69 self-checks and seal source hashes.
2. Import the unchanged sealed files into `test/blind/`; preserve the older auditor as supplemental evidence.
3. Run every original SVG and mask case, both complete raster sets, every silhouette pair and every threshold case through the reference. Save raw and profile decisions.
4. Fix defects exposed by the comparison. Exact threshold arithmetic now uses integers beyond the safe Number multiplication range.
5. Run `npm test` for seeds 1, 2 and 3, all 25 executable mutants each, package reports/PNGs and independently verify both manifests.
6. Push only this job and its workflow; observe the exact final head's hosted run and link its actual result in PR #10.
