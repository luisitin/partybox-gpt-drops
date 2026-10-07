# B05 — Turn flow, exact strings, bonus stars

**Status: research draft; strict acceptance NOT MET.** Do not merge this as an authoritative game implementation. Structural validity and review coverage are not factual completeness.

This drop records 95 claims/gaps, nine documented Bonus Star categories, eight reported Homestretch effects, and 13 short exact transcript excerpts. Of the 95 rows, 22 are corroborated core claims, 50 are single-source reports, three preserve conflicts and 20 are explicit unanswered requirements. Only three of nine bonus criteria have independent corroboration; no complete tie/counter implementation is certified. Both source-reopen passes cover all 18 retained URLs, and all 125 retained claim/catalog/string rows have two recorded reviews by the same assistant, not independent researchers.

## Files

`turnflow.md` is the readable phased timeline. `claims.json` is its status-bearing fact/gap ledger. `bonusStars.json` contains criteria, unknown tie fields and seven award policies. `homestretch.json` contains the eight reported effects with triggers and documented exceptions. `strings.json` is a limited 13-entry excerpt bank, **not a complete script**; voice and on-screen host-text transcriptions are distinguished.

`sources.json` contains URLs, provenance groups and a centralized short-excerpt catalog. `SOURCES.md` indexes every claim, its evidence locators and missing per-row excerpts. `CONFLICTS.md` preserves disagreements. `recheck.json` records source reopens, per-row A/B decisions, amendments and a rejected video-access attempt. `VERIFY.md` reports tests and every unresolved row. `schema.json`, `verify.py`, `requirements.txt`, `validator-output.txt` and `SHA256SUMS.txt` support reproducible structural checks.

## Rerun from this folder

```sh
python -m pip install -r requirements.txt
python verify.py --structural
python verify.py --strict
python verify.py --structural --checksums
sha256sum -c SHA256SUMS.txt
```

Python 3.10 or later is required. The pinned JSON Schema validator was executed in the delivery environment. `--structural` should exit 0. **`--strict` deliberately exits 1 because the research acceptance conditions are unmet**; an unexplained crash is not the intended failure. `--checksums` also verifies that every delivered file except the manifest itself is listed. Do not redirect new output into the checksummed folder without regenerating the manifest.

The commands do not fetch websites or re-watch gameplay. To repeat the research, open each public URL in `sources.json`, examine the indicated sections, and independently reassess each row. `recheck.json` includes session-local retrieval references as provenance, not public archives. Tool reads may be cached; there is no fresh-origin, immutable-source or game-build verification claim.

## Delivery boundaries

Repository: `luisitin/partybox-gpt-drops`. Branch: `job/B05-jamboree-turn-flow`. All changes are confined to `jobs/B05-jamboree-turn-flow/`. No main-branch write or other job-folder change is intended. This is a research drop, not a code-job CI workflow. Every file is under 30,000,000 bytes; no split/JOIN file is needed.

The missing independent evidence, exact dialogue inventory, game event-priority tests and counter/tie edge cases are all retained under **UNVERIFIED** in `VERIFY.md`. A browser attempt could not play the public gameplay video; no captions, guessed timestamps or inferred footage were used to certify a rule.
