# Assumptions

- The natural reading of “first 8 pairwise … at least 20; all 12 … at least 12, also under … simulation” applies ≥20 to the first eight in normal vision, and ≥12 to all pairs in all four views. The stronger optional first-eight/all-view ≥20 result is separately reported.
- Fill and selected black/white text contrast are measured for actual normal sRGB colors, as requested. Simulation sheets transform the entire scene; simulated text/fill contrast was not specified as an additional gate.
- The original instructions do not require eight-bit hex colors. Exact 16-bit sRGB channel fractions and CSS `color(srgb …)` are canonical; approximate hex values are labeled and are not acceptance inputs.
- Machado severity 1.0 matrices act on linear sRGB; transformed channels are clipped to [0,1] before re-encoding. D65 Lab uses the cited sRGB/XYZ matrix and unit CIEDE2000 weights.
- The PNGs have 16-bit RGB samples, no alpha, and no embedded display profile. Canonical normal fills are exact; simulated scenes use nearest-16-bit samples after transformation. Display software and physical device behavior remain unverified.
- Pure numerical and PNG functions preserve caller arrays. I/O, file hashing, fixtures, child processes, and optional optimization are restricted to author/test tooling.
