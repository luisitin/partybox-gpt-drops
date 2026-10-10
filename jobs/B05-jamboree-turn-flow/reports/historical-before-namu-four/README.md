# B05 — Turn flow, exact strings, bonus stars

**What this is:** a research draft of one party-board game's turn flow, its nine bonus-star counters, Homestretch, Pro and Frenzy deltas, and 22 short quoted host lines, each with a source.
**How to use it:** read `INTEGRATION.md` first (IP warning, port map), then `DESIGN-DIGEST.md` for the ranked takeaways, then `turnflow.md` for the timeline. Re-word and rename everything; ship no quoted text.
**Status:** reference only. Structural checks PASS; strict research acceptance is NOT MET by design (33 of 95 facts dual-sourced, 3 of 9 bonus criteria, 0 of 9 tie procedures). CI green on head `a84fd4e` (run 37675945275).

**Research draft; strict acceptance NOT MET.** The drop contains a phased party timeline, nine Bonus Star records, eight Homestretch effects, seven award policies, and 22 exact source-transcribed strings (11 voice lines and 11 host-text lines).

There are 95 claim/gap rows: 33 corroborated core claims, 39 single-source reports, three conflicts and 20 explicit unknowns. Three of nine bonus criteria have independent corroboration. Tie procedures and precise counter edge cases remain open. Each fact now links registered short quotations; a quotation can support only part of a composite claim, so source scope and lineage still matter.

Both fresh reopening passes retrieved all 25 source URLs and recovered all 192 registered quotations: 384 recoveries across the two passes. All 141 retained claim, bonus, effect, string and award-policy rows have A/B reviews bound to their canonical SHA-256 data fingerprints. Bonus-row review outcomes remain unverified where tie fields are unknown. The same assistant conducted both passes.

## Contents and rerun

`turnflow.md` is the readable timeline. `claims.json` holds evidence and confidence; `bonusStars.json`, `homestretch.json`, and `strings.json` hold the requested catalogs. `SOURCES.md` and `sources.json` provide URLs, short quotations and source lineages. `CONFLICTS.md`, `ASSUMPTIONS.md`, `LOOP.md`, `NEXT.md`, and `RESEARCH-LEADS.md` preserve decisions and gaps. Citation captures in `reports/source-captures/` retain registered quotations plus retrieved-markdown SHA-256 fingerprints; they do not archive full articles.

```sh
python -m pip install -r requirements.txt
python verify.py --structural
python verify.py --strict
python verify.py --structural --checksums
sha256sum -c SHA256SUMS.txt
```

Python 3.10+ is required. Structural verification exits 0. Strict research acceptance currently exits 1 for missing independent fact evidence, six bonus criteria and nine tie procedures; malformed data exits 2. Exact strings have source URLs; no primary-frame captures or guessed timestamps are claimed. Full alternative dialogue, internal event queues and hidden RNG probabilities remain unverified.

The B05 workflow runs structural checks, all manifest hashes, and the strict command while asserting its documented exit 1. A green artifact-verification run does not certify research completeness. Keep PR9 draft.

Repository `luisitin/partybox-gpt-drops`; exact branch `job/B05-jamboree-turn-flow`. Delivered changes are confined to this job and `.github/workflows/B05.yml`. All files are below 30,000,000 bytes.
