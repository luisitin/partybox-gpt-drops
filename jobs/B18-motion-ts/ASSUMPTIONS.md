# B18 assumptions

- Preserve the existing public API, zero runtime dependencies, pure functions,
  documented numerical domains and decimal 1,200-byte gzip gate.
- The independent reference author read the original instructions, repository
  README and public API contract before writing and sealing the sources.
  Production and previous reference access was authorized only after sealing.
  Provenance and source hashes are retained in `tests/blind/`.
- A settling estimate is a conservative all-future bound for both displacement
  and velocity. Different valid conservative estimates need not be numerically
  equal. The blind estimate and production estimate both receive tail checks;
  the historical envelope inversion remains a supplemental comparison.
- All original test counts, seeds, tolerances and mutation gates are retained.
  No original million-point or every-frame comparison is replaced by a sample.
- Arbitrary finite inputs receive finite output guards. Precise numerical
  accuracy is verified only over the domains stated in `README.md`; browser
  rendering engines and exhaustive binary64 enumeration are not claimed.
- Clean `npm ci --ignore-scripts --no-audit --no-fund` succeeded locally during
  this resumed delivery. Hosted CI independently performs `npm ci --ignore-scripts`.
- Delivery is PR #5 on `job/B18-motion-ts` for maintainer review. The repository
  prohibits pushing to main or changing another job's folder.
