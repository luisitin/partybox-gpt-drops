# B16 separate authoring record

Root authored reference.ts from the original B16 prompt, its public function
contract, Sharma's published 34 Lab pairs, and Machado's published severity-1
matrix table. Root did not inspect color.ts, its tests, optimization algorithms,
generated palettes or any production result before sealing this reference.

The reference uses direct standard CIEDE2000 equations, D65 sRGB-to-XYZ-to-Lab,
piecewise sRGB transfer functions, linear-light Machado matrices with clipping,
and WCAG relative luminance. These define the measurements, not a guarantee
that any requested 12-color palette exists or has been found. Normal-mode
simulation returns a fresh array and no operation changes input arrays.

Strict TypeScript compilation, all 34 published differences within 0.00005,
black/white calibration, all four simulation views and seeded symmetry and
identity checks are completed before source exchange and recorded in SELFCHECK.

Production color.ts was independently sealed before reference viewing:
`386cb5f0265833f907827467662a4d29ade0aea9df2be14c4dc20d06d5d55435`,
with strict compilation and all 34 Sharma pairs passing. Exact initial production
is color.snapshot.ts.txt. Exact root reference SHA256:
`5b371509c4b754964c3c62698bc5c679e865a9909f7db6373286ad248a684ea3`.
It was copied unchanged into reference.ts and reference.snapshot.ts.txt only
after both authors had sealed. Root's independent 30,046 selfchecks are preserved
as reports/oracle-selfcheck.json. Packaged suites provide the required three
seeds and all palette comparisons; selfcheck results alone are not that suite.
