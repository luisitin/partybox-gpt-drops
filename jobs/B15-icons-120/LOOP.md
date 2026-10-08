# B15 verification loop

1. Author the independent auditor from the public contract without source access; run its 69 self-checks and seal source hashes.
2. Import the unchanged sealed files into `test/blind/`; preserve the older auditor as supplemental evidence.
3. Run every original SVG and mask case, both complete raster sets, every silhouette pair and every threshold case through the reference. Save raw and profile decisions.
4. Fix defects exposed by the comparison. Exact threshold arithmetic now uses integers beyond the safe Number multiplication range.
5. Run `npm test` for seeds 1, 2 and 3, all 25 executable mutants each, package reports/PNGs and independently verify both manifests.
6. Push only this job and its workflow; observe the exact final head's hosted run and link its actual result in PR #10.
7. 2026-10-08 polish pass (Claude, cloud): reviewed all 120 icons at 24/48/96 px on the PartyBox night and daylight themes. Redrew or re-weighted 73 icons: ribbon lines, no ink-only structure, distinct silhouettes, everything inside the live area. Added the `ink` option, `getSprite()`/`sprite.svg`, `gallery.html` and Spanish titles. Added tests for the live area, night visibility, sprite, gallery and titles. Resealed, then reran `npm test`; results are in VERIFY.md under "Polish pass 2026-10-08".
