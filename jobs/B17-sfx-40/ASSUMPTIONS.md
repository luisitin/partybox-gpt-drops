# Assumptions

- All effects are longer than 400 ms, allowing a complete BS.1770 integrated block.
- Loudness is measured as mono (one channel weight 1), without dual-mono compensation.
- “Original” means generated mathematical oscillators/noise/envelopes with no sampled audio.
- Determinism means byte identity under the pinned Node version and algorithm, not a promise of identical transcendental functions across all JavaScript engines.
- The 5 ms start/end requirement uses an explicit raised-cosine envelope and separate sample-domain edge checks.
- Official EBU corpus conformance and the reproducible subset of buildable calibration signals will be distinguished in VERIFY.md.

## Polish pass 2026-10-08 (v2 engine)

- The target is −16 LUFS, the spec's value, with a ±0.5 LU acceptance band. PartyBox's own `polish-check` accepts −16 ±3 LUFS on the TV, so −16 sits in the middle of the team's range.
- Delivered audio is mono, as the spec asks. `renderCue` also returns a stereo pair, mastered the same way (`finishStereo`), so a port that wants stereo does not need a second recipe.
- The leveller ceiling is −2 dBTP on the 4× envelope and the delivery limit is −1.5 dBTP. `finishAudio` throws above −1.55 dBTP, a 0.05 dB guard band.
- `twin.ts` cross-checks `dsp.ts`; it is not an independent oracle. The blind oracle covers the first delivery's recipe (`legacy.ts`) and the shared master, meter and encoder.
- The trims in `cues.ts` are proposals, not measurements against PartyBox's voices.
- Spectral balance is not an acceptance criterion in this suite. The spectrograms are for inspection.
- Local runs use Node 22.22.0 and FFmpeg 6.1.1; CI pins Node 22.16.0. `Math.sin`, `Math.exp` and `Math.pow` may differ in the last bit between engines, so byte identity is claimed for the pinned Node version only.
- The cue names that replace existing PartyBox cues are taken from `SOUND_CUES` on PartyBox main at 26b85ba6.
