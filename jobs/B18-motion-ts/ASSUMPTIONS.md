# B18 assumptions

- Resume the existing public API and documented numerical domains. The runtime remains pure, with zero runtime dependencies and the decimal 1,200-byte gzip limit.
- The original instruction requires implementations written without looking at one another. A new isolated reference author has access only to the original prompt and public API contract. Existing production and test implementations are excluded from that author's input.
- A settling-time estimate may differ between valid algorithms. Compare its all-future displacement and velocity bound, rather than require identical conservative estimates.
- Preserve every original test count, seed, accuracy tolerance and mutation gate. Additional independent checks supplement those tests.
- A completed delivery is a verified pull request for maintainer review. The repository prohibits pushing to main.
