# B15 assumptions and boundaries

- The artwork is 120 original SVG icons on a fixed 64 by 64 canvas. Alpha >= 128 defines foreground; transparent holes remain holes. Pairwise alignment, scaling and filling are absent.
- The narrow SVG profile is an asset validator, with exact root attributes and canonical double-quoted `name="value"` serialization. It is not a general SVG sanitizer.
- The independent reference was sealed before opening source, artwork or fixtures. Its supplied contract omitted the canonical `=` spacing rule; the post-seal adapter adds that rule explicitly, preserves raw results and requires exactly one known serialization difference in each full seed.
- PNG checks cover RGB/RGBA, 8-bit, noninterlaced PNGs, all five filters, required chunk structure and CRCs. Other PNG profiles are outside this reference's supported format.
- Renderer evidence applies to the recorded Sharp/librsvg and CairoSVG versions. A blinded human recognition study and universal renderer pixel identity are unverified.
- Runtime dependencies are zero. Development dependencies need registry access for a fresh install and are recorded in the npm lockfile and Python requirements.
