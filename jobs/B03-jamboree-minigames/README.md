# B03 — Every Jamboree minigame, catalogued

Draft research catalogue of all **132 games**: 112 base games and 20 Jamboree TV additions. JSON and CSV retain every requested field, original two-sentence summaries, phone touch-screen assessments, literal control-symbol witnesses, citations, confidence and explicit unknowns. All 132 narrow core-gameplay summaries have accounts from independent publisher families. No complete row meets the original two-independent-source research requirement: **NOT_MET**.

Known scoped timer reports cover 103 rows, scoring reports 78, and tie reports 31. Every win-rule report is qualified as single-source. The nine four-player Showdown Party encounter formats and nine character-specific Party Buddy awards now have independent corroboration; the guide misnames Peach’s game, so its award stays single-source. Unknown coin/star awards remain null; in-game scoring tokens are not substituted for board rewards. PhoneFit is an editorial proposal for adaptation, not Nintendo compatibility or executed gameplay.

## Files and evidence

- `minigames.json`, `minigames.csv`, `minigames.schema.json`: complete draft inventory and exact field-preserving CSV.
- `catalogue-sources.json`: 145 source URLs, 1,866 short clips, publisher lineages and two retained source passes. `SOURCES.md` contains every clip and its URL/locator.
- `catalogue-second-pass.json`: all 132 published-row fingerprints, 132 identical fresh article scopes, 431 independent publisher contexts and every checked field.
- `catalogue-conflicts.json`, `CONFLICTS.md`: fifteen material disagreements, plus preserved preliminary roster differences.
- `reports/source-reopens-*`: all 148 current/historical retained URLs reopened twice, 296 verified HTTPS requests, 3,738 recovered clips and zero missing clips. Full response HTML remains outside the delivery; hashes and compact excerpts are committed.
- `reports/buddy-recovery-audit.md`: exact prior/current row fingerprints, transport failure and recovery, original source-body comparison bindings, and scoped exclusions.
- `reports/reward-quote-capture-audit.json`: 84 exact reward/gameplay quotation comparisons against both preserved article captures; nineteen payout/item/buddy fields now cite matching statements.
- `reports/research-gaps.json`: the exact 839 fact fields still lacking accepted independent corroboration. Narrow corroboration covers 481 of 1,320 fact fields; zero whole rows are complete.
- Original external research history and helper suites remain intact. See `HISTORICAL-INDEX-NOTES.md` and the original `verification-results.json`, `gameplay-*` and `source-*` records.

## Rerun

From the repository root with Python 3.12:

```bash
python -m pip install -r jobs/B03-jamboree-minigames/requirements.txt
PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --hashes
```

That command validates structure, evidence bindings, all inherited suites, 36 additional isolated hostile fixtures and the complete delivery manifest. It succeeds for this explicitly incomplete draft. The original strict research gate intentionally fails with exit code 1:

```bash
PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/verify.py --strict --hashes
```

Reopen every URL into a new external directory without overwriting old captures:

```bash
PYTHONDONTWRITEBYTECODE=1 python jobs/B03-jamboree-minigames/reopen-catalogue.py --output /tmp/b03-new-source-reopen
```

Network success and quote recovery establish access and exact text presence; they do not establish independent agreement about every game mechanic. See `VERIFY.md` for actual results, all 132 row logs and unverified boundaries. The single GitHub workflow reruns full offline verification and asserts that this draft cannot be promoted by the strict gate.
