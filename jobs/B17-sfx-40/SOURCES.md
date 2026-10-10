# Meter definitions

- ITU-R BS.1770-4 (October 2015), Annex 1 Tables 1–2 and equations 3–7; Annex 2 4× FIR table: https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-S!!PDF-E.pdf
- EBU Tech 3341 v4 (November 2023), §2.9/Table 1: https://tech.ebu.ch/docs/tech/tech3341.pdf
- FFmpeg `ebur128` audio filter documentation: https://ffmpeg.org/ffmpeg-filters.html#ebur128

The reference author retrieved the official PDFs, independently copied the meter
coefficients and rebuilt cases 1–5 and 15–19. ORACLE.md records definitions,
mono adaptations, tolerances and exclusions. Measured pass results are in
VERIFY.md and reports/; references alone are not claimed as test results.
