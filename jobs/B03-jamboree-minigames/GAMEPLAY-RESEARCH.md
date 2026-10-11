# B03 preliminary gameplay research leads

This package is **UNVERIFIED single-family evidence**, not the completed minigame catalogue. All 132 distinct wiki article URLs were freshly requested twice with the inherited HTTPS proxy and TLS verification. Each request returned HTTP200 and actual article content. All extracted leads were identical across the two passes. Records retain both UTC retrieval times, response status, byte count and SHA-256 hashes.

Files suitable for the research milestone are `gameplay-leads.json`, `gameplay-leads.schema.json`, `collect-gameplay.py`, `verify-gameplay-leads.py`, `test-gameplay-evidence.py`, `gameplay-second-pass-audit.json`, `gameplay-verification-results.json`, `gameplay-guard-validation-results.json`, `guard-validation-results.json` and these notes. Keep `pass1/`, `pass2/`, `pass1-results.json`, `pass2-results.json`, `index.json` and pilot HTML files outside the checkout; they contain local raw snapshots or longer source text and are not deliverables.

`gameplay-leads.json` uses one quotation dictionary per source article, referenced by candidate field labels. Each quotation has at most 25 words, and each page supplies at most 90 unique quoted words. Source image alt labels are retained separately so controller icons are not silently converted into button claims. A field reference is a research lead, not a complete or independently verified field value.

| Candidate field | Rows with at least one lead | TV rows |
| --- | ---: | ---: |
| Gameplay | 132 | 20 |
| Controls | 132 | 20 |
| Win rules | 82 | 19 |
| Score rules | 57 | 11 |
| Time-limit mention | 30 | 5 |
| Tie rules | 22 | 4 |
| Coin-reward mention | 10 | 1 |
| Star-reward mention | 0 | 0 |

Ten returning-game pages include other Mario Party editions. The extractor excludes shared unscoped sections and only retains sections explicitly scoped to Jamboree on these pages: Domination, Three Throw, Granite Getaway, Treasure Divers, Platform Peril, Stamp Out!, Blame It on the Crane, Snow Brawl, Defuse or Lose and Jump the Gun. This intentionally leaves some applicable shared descriptions unquoted until their edition can be established. Mario's Three-peat and Peach's Day Off have component-specific durations; one quoted timer does not establish their total elapsed duration.

TV mode headings such as Battle, Co-op and 2-vs.-2 remain attached to the quotations. Mouse/camera/microphone controls are preserved only when present as text or actual source image labels. No accessory, alternate-mode or hardware behavior was independently observed.

Missing timers, tie outcomes and rewards remain absent. Standard winner coins, stars, zero rewards, motion/button labels, whole-game timers and version parity are never inferred. No two-sentence summaries or phone-fit ratings were synthesized. Every row still requires an independent mechanics source and human scope review before final B03 delivery.

From the repository root, re-open all sources into a directory outside the checkout:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/collect-gameplay.py --index jobs/B03-jamboree-minigames/catalogue-index.json --output /tmp/b03-gameplay-recheck
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence /tmp/b03-gameplay-recheck/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json --snapshots /tmp/b03-gameplay-recheck
```

Validate the compact saved evidence without remote retrievals or raw snapshots:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-gameplay-leads.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json --schema jobs/B03-jamboree-minigames/gameplay-leads.schema.json
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/test-gameplay-evidence.py --evidence jobs/B03-jamboree-minigames/gameplay-leads.json --index jobs/B03-jamboree-minigames/catalogue-index.json
```

Python 3, curl and jsonschema 4.x are required. No runtime dependencies are downloaded by these helpers. The existing catalogue index is required; all helpers default to `catalogue-index.json` adjacent to the helper, and `--index` can select an explicit existing index. The verifier binds every name, ordinal, edition and URL to that index.

The collector requires explicit `--output`, uses at most four concurrent requests, preserves proxy/CA settings and refuses to put raw captures inside a Git checkout. Fresh retrieval requires a new output directory; choose a different unused directory for each fresh run. The optional `--reparse` flag requires an existing snapshot directory and validates every raw hash, byte count, index binding and retrieval record before writing any extraction. Reparse does not make a fresh source pass. Effective HTTPS URLs matched the indexed URLs exactly in these captures; no URL normalization is accepted or needed. The verifier also checks curl's recorded TLS result is zero and the second retrieval timestamp is strictly later than the first.

The actual capture-bound verification output records schema validation, 132 index rows and bindings, 987 short quotations, 264 verified HTTPS URL/TLS/hash/byte records and raw-page hashes, 132 ordered timestamp pairs, 1,974 quote locations in the two captured article sections, 264 extraction comparisons, and 84 returning-game scope checks. The separate guard suite rejected 18 deliberately invalid evidence/output cases, validated 264 raw-capture preflight records and made zero network requests. Without `--snapshots`, the guard suite runs the 16 cases that do not require raw bodies. Passing these checks establishes evidence integrity; final B03 remains incomplete.
