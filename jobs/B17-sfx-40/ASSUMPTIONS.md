# Assumptions

- All effects are longer than 400 ms, allowing a complete BS.1770 integrated block.
- Loudness is measured as mono (one channel weight 1), without dual-mono compensation.
- “Original” means generated mathematical oscillators/noise/envelopes with no sampled audio.
- Determinism means byte identity under the pinned Node version and algorithm, not a promise of identical transcendental functions across all JavaScript engines.
- The 5 ms start/end requirement uses an explicit raised-cosine envelope and separate sample-domain edge checks.
- Official EBU corpus conformance and the reproducible subset of buildable calibration signals will be distinguished in VERIFY.md.
