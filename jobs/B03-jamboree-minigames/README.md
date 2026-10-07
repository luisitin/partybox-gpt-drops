# B03 — preliminary catalogue index

This is a research milestone, not the completed minigame specification. `catalogue-index.json` preserves 132 wiki-listed names and raw category paths: 112 base entries and 20 Jamboree TV additions. Mario Party Legacy independently lists both sets, and Nintendo confirms 20 additions. All 20 TV names and 110 base names match after case/punctuation normalization. Two base-name disagreements, category variations and a four-player availability conflict remain visible in `CONFLICTS.md`.

`complete` is explicitly `false`. The index contains no timers, controls, scoring, tie rules, rewards, summaries or phone-fit ratings. Raw category headings remain separate. Mario Party Legacy is an independent publisher, not the prompt-required second wiki list page. Supplementary wiki/Destructoid research corroborates the English spelling Sandwiched; neither disputed Legacy identity linkage is accepted.

- `catalogue-index.json` and `catalogue-index.schema.json`: preliminary name/category index and its schema.
- `source-excerpts.json`: short quoted names, categories and count statements, with retrieval timestamps and SHA-256 hashes of original page bytes from two fresh HTTP passes. Whole webpages are not committed.
- `source-access.json`: earlier real source-access probes, including two candidate URLs that redirected to an irrelevant N64 page; these candidates are excluded from catalogue evidence.
- `SOURCES.md`, `CONFLICTS.md`, `VERIFY.md`: citations, unresolved differences, actual validation output and index-only second-pass audit.
- `collect-index-evidence.py`, `wiki_extract.py`, `legacy_extract.py`, `build-index.py`, `verify-index.py`: reproducible research helpers. Python 3, curl and jsonschema 4.26.0 are used.
- `ASSUMPTIONS.md` and `NEXT.md`: scope decisions and exact resumption steps.
- `NAME-RESEARCH.md`, `name-evidence.json`, `check-name-evidence.py` and its fresh check report: narrow English-name evidence and repeatable two-pass quotation checks.
- `check-validator-rejections.py` and before/after reports: a valid baseline plus five actual false-acceptance regressions, all now rejected.

Validate the committed index without network requests, from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/check-validator-rejections.py
cd jobs/B03-jamboree-minigames
sha256sum -c SHA256SUMS.txt
```

To independently reopen the sources and compare the current lists against the committed index without modifying it:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/collect-index-evidence.py --output /tmp/b03-index-recheck.json
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/verify-index.py --evidence /tmp/b03-index-recheck.json
```

The collector retains the inherited HTTPS proxy and curl's certificate verification. Its output and optional snapshot directory must be new paths. Changed source names, category wording or quotations require review. Page hashes can change when publishers update markup, while extracted names remain identical.

Regenerate a separate candidate index for review:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/build-index.py --evidence /tmp/b03-index-recheck.json --output /tmp/b03-catalogue-index-candidate.json
```

The preliminary index validation can pass while the final B03 research requirements remain unverified. `minigames.json`, `minigames.csv` and the final per-game schema have not been delivered.
