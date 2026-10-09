# B13 — 1,000 verified trivia questions

All original research gates passed for the checked local version. 1000 questions in ten categories; 1000 current independent acceptances; 1000 current second-pass support reviews.
Latest actually checked version rendered 2026-10-09T14:05:36.114178+00:00; exact hashes and every open gate are in [reports/checks.json](reports/checks.json).

The original B13 prompt and [CONTRACT.md](CONTRACT.md) require four plausible choices, balanced difficulty/positions, two independent actual source accounts per factual claim, 100% fresh adversarial review and second-pass source reopening. JSON categories, schema, brief source quotes, immutable retrieval receipts, rejected versions and concrete corrections are included. Full copyrighted bodies remain in ignored local `.work/`.

Install: `python -m pip install -r requirements.txt`.
Full local evidence acceptance: `python scripts/check-data.py --require-local-captures`.
Full delivered/hosted metadata acceptance: `python scripts/check-data.py`.
Draft progress check: `python scripts/check-data.py --draft --require-local-captures`.

Local acceptance checks retained author and actual second-pass bodies against their original hashes and selected quotes. Hosted CI checks immutable receipt/quotation/context associations because full copyrighted bodies are excluded; CI does not make new external source opens or human factual assessments. Both modes require every final review and editorial gate. [VERIFY.md](VERIFY.md) records actual commands/counts and remaining limits; [SOURCES.md](SOURCES.md) lists all selected short quotes; [CONFLICTS.md](CONFLICTS.md) preserves disagreements and exclusions. [NEXT.md](NEXT.md) names the concrete remaining work. Job deliverables remain on their isolated branch; only the queue claim ledger is refreshed on main under RUN-ALL. No product merge is made.
