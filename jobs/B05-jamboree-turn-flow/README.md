# B05 — Turn flow, exact strings, bonus stars

**What this is:** a research draft of one party-board game's turn flow, its nine bonus-star counters, Homestretch, Pro and Frenzy deltas, and 22 short quoted host lines, each with a source.
**How to use it:** read `INTEGRATION.md` first (IP warning, port map), then `DESIGN-DIGEST.md` for the ranked takeaways, then `turnflow.md` for the timeline. Re-word and rename everything; ship no quoted text.
**Status:** reference only. Structural checks PASS; strict research acceptance is NOT MET by design (38 of 95 facts dual-sourced, 3 of 9 bonus criteria, 0 of 9 tie procedures). Current complete hosted results and checked artifact are linked in PR9 after observation. Historical head `91345bb` passed run 37813265437; it is not proof of this refreshed head.

**Research draft; strict acceptance NOT MET.** The drop contains a phased party timeline, nine Bonus Star records, eight Homestretch effects, seven award policies, and 22 exact source-transcribed strings (11 voice lines and 11 host-text lines).

There are 95 claim/gap rows: 38 corroborated core claims, 34 single-source reports, three conflicts and 20 explicit unknowns. Three of nine bonus criteria have independent corroboration. Tie procedures and precise counter edge cases remain open. Each fact now links registered short quotations; a quotation can support only part of a composite claim, so source scope and lineage still matter.

Both fresh reopening passes retrieved all 27 source URLs and recovered all 202 registered quotations: 404 recoveries across the two passes. All 141 retained claim, bonus, effect, string and award-policy rows have A/B reviews bound to their canonical SHA-256 data fingerprints. Bonus-row review outcomes remain unverified where tie fields are unknown. The same assistant conducted both passes.

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

## Historical e6 four literal confirmations — 2026-10-09

PRO08 now independently confirms the existing 20-coin stake and landing-player minigame choice. EFFECT03/EFFECT04/EFFECT06 independently confirm the all-player trap, Double Dice and wallet-doubling grants. All remain medium confidence. Only those four claim classifications/citations and three matching effect records change; all factual wording, the other 91 claims, nine Bonuses, seven policies and 22 strings remain unchanged. The original full delivery is preserved under `reports/historical-before-namu-four/`.

All 26 pages were actually reopened twice, with 200 registered quotes recovered in each pass and 141 complete row reviews per pass. Same returned bodies may be cached. Primary frames, installed patch, overflow/caps, precise counters and source-origin freshness remain unverified. Keep PR9 draft: strict acceptance still exits 1.

## Recovery: one round-end corroboration — 2026-10-09

ROUND01 now has literal independent corroboration from Nintendo and Scarlet Dunning's authored firsthand Mac Weekly introduction. Existing wording and medium confidence stay unchanged. Every other94 claim and all9 Bonus records,7 award policies,8 Homestretch records and22 strings are unchanged from e6. Only22 new quotation words, from Mac Weekly, were added; zero new Cel/Namu words. Both new full27-source passes and all141 row reviews are recorded. Strict research remains NOT MET: 38/95 core claims,3/9 criteria,0/9 ties. Keep PR9 draft. See BLOCKED.md for concrete missing evidence.

The genuine original328,023-byte official e6 archive, full native log and acceptance receipt are preserved in reports/20261009-recovery/. The original75-file historical snapshot and original schema, four-fact scope checker, requirements and workflow remain byte-for-byte unchanged. All legacy scope checks and12 malformed fixtures still execute against the genuine original data, followed by the new one-claim scope and14 real rejection fixtures. Current exact-head hosted acceptance is pending at publication; original green runs certify their own partial deliveries only.
