# B17 verification

Full local suite passed with Node 22.16.0, TypeScript 5.9.3 and FFmpeg 7.1.5.
Exact local command: `npm exec --yes --package node@22.16.0 -c 'node --version && npm test'`.
CI installs the development compiler then runs exactly `npm test`.

Machine-readable evidence: reports/seed1.json, seed2.json, seed3.json,
mutations.json and summary.json. Each reports both implementations and exact
external FFmpeg summaries. A failed suite exits nonzero and does not create a
passing summary. The suite removes a previous summary at startup, and the
successful summary fingerprints all 15 code/configuration files; recording
rejects a changed source fingerprint. SHA256 coverage includes every deliverable
and checks the 30 MB per-file cap.

## Per-seed suites

| Test name | Cases per seed | Seeds | Passed | Exact command |
| --- | ---: | --- | --- | --- |
| sha256Files | 111 | 1, 2, 3 | all | `npm test` |
| independentRaw | 40 | 1, 2, 3 | all | `npm test` |
| independentMaster | 40 | 1, 2, 3 | all | `npm test` |
| independentFullPcm | 40 | 1, 2, 3 | all | `npm test` |
| independentWav | 40 | 1, 2, 3 | all | `npm test` |
| independentMeter | 40 | 1, 2, 3 | all | `npm test` |
| audioRequirements | 40 | 1, 2, 3 | all | `npm test` |
| fadeOperation | 40 | 1, 2, 3 | all | `npm test` |
| byteRegeneration | 40 | 1, 2, 3 | all | `npm test` |
| spectrogramPng | 40 | 1, 2, 3 | all | `npm test` |
| spectrogramRegeneration | 40 | 1, 2, 3 | all | `npm test` |
| externalFfmpeg | 40 | 1, 2, 3 | all | `npm test` |
| ebu3341MonoAdaptations | 10 | 1, 2, 3 | all | `npm test` |
| fftVsDft | 6 | 1, 2, 3 | all | `npm test` |
| canonicalDeliverables | 120 | 1, 2, 3 | all | `npm test` |
| catalogAndDistinctness | 6 | 1, 2, 3 | all | `npm test` |
| meterInvalidAndSilence | 6 | 1, 2, 3 | all | `npm test` |
| encodeInvalid | 4 | 1, 2, 3 | all | `npm test` |
| decodeInvalid | 30 | 1, 2, 3 | all | `npm test` |
| pcmExtrema | 1 | 1, 2, 3 | all | `npm test` |
| rngInvalid | 4 | 1, 2, 3 | all | `npm test` |
| masterInvalid | 3 | 1, 2, 3 | all | `npm test` |
| pureSource | 5 | 1, 2, 3 | all | `npm test` |
| probe | 1 | 1, 2, 3 | all | `npm test` |

Each seed compares 1649280 raw samples and
1649280 independently mastered samples.
The quantized fade check compares 19200 samples
per seed (240 at each end × 40 sounds). The entire independently reconstructed
PCM pipeline also matches every WAV byte, in addition to these edge checks.

## Measured audio

120 cases = 40 sounds × 3 seeds, each decoded from the final PCM16 WAV:

| Quantity | Observed range / maximum | Required |
| --- | --- | --- |
| Duration | 0.45–1.65 s | 0.05–3 s |
| Integrated loudness | -16.0000075–-15.9999898 LUFS | −16 ±0.5 |
| Highest 4× true peak | -5.0282785 dBTP | ≤−1.5 |
| Absolute DC offset | 1.4911998e-7 | <0.001 |
| Raw/reference sample error | 3.3306691e-16 | ≤1e−10 |
| Master/reference sample error | 4.2188475e-15 | ≤1e−9 |

Both endpoint samples are exactly 0; the first and final adjacent sample jumps
are below 0.001. All first/last 240 samples satisfy the independently reconstructed
5 ms raised-cosine/DC-correction/mastering operation within PCM quantization.
FFmpeg independently passes loudness/true-peak constraints on all 120 files.
Every WAV is byte-identical on regeneration. All 40 canonical WAVs and 40 PNGs
plus 40 manifest hashes are checked under every seed.

## EBU Tech 3341 calibration scope

Ten rebuilt **mono adaptations** of official Table 1 cases 1–5 and 15–19 are run
under each seed: 30/30 passes. Each official stereo integrated target is reduced
by 10 log10(2)=3.01029995664 LU for one channel; true-peak targets are unchanged.
Both meters agree to 2e−8 on every numeric field; expected integrated tolerances
are ±0.1 LU and true-peak tolerances are +0.2/−0.4 dB.

| Rebuilt case | Seed 1 production result | Expected acceptance | Seeds 1/2/3 |
| --- | --- | --- | --- |
| ebu3341-1-mono | -26.003597082 LUFS | [-26.110299957, -25.910299957] | pass/pass/pass |
| ebu3341-2-mono | -36.003597082 LUFS | [-36.110299957, -35.910299957] | pass/pass/pass |
| ebu3341-3-mono | -26.024168655 LUFS | [-26.110299957, -25.910299957] | pass/pass/pass |
| ebu3341-4-mono | -26.024168655 LUFS | [-26.110299957, -25.910299957] | pass/pass/pass |
| ebu3341-5-mono | -25.988957429 LUFS | [-26.110299957, -25.910299957] | pass/pass/pass |
| ebu3341-15-mono | -6.217063375 dBTP | [-6.400000000, -5.800000000] | pass/pass/pass |
| ebu3341-16-mono | -5.975908885 dBTP | [-6.400000000, -5.800000000] | pass/pass/pass |
| ebu3341-17-mono | -6.313274988 dBTP | [-6.400000000, -5.800000000] | pass/pass/pass |
| ebu3341-18-mono | -6.026488954 dBTP | [-6.400000000, -5.800000000] | pass/pass/pass |
| ebu3341-19-mono | 3.029073281 dBTP | [2.600000000, 3.200000000] | pass/pass/pass |

The meter resets filters on every call. The 120 deliverable comparisons use
complete 400 ms blocks; incomplete trailing blocks are excluded. General inputs
shorter than 400 ms are explicitly zero-padded by project convention and are not
present in delivered audio. Case 19 stays floating point to avoid quantizing the synthetic calibration input.
Its continuous amplitude is 1.41; the 45° sampled sine has peak 1.41/√2≈0.997,
so those particular samples can fit PCM16 despite a true peak above 0 dBTP.
Sources/recipes are in ORACLE.md and SOURCES.md.

## 25 isolated source mutations

Each copy starts from unmodified production source. Exactly one textual bug is
planted, that copy compiles successfully in strict TypeScript, and the unchanged
behavioral probe must fail an assertion for each seed. No mutation uses oracle
edits, hardcoded simulated outcomes, or compilation failure as its kill.

| # | Bug | Source | Seed 1 | Seed 2 | Seed 3 |
| ---: | --- | --- | --- | --- | --- |
| 1 | K shelf gain | meter.ts | caught | caught | caught |
| 2 | High-pass numerator | meter.ts | caught | caught | caught |
| 3 | Loudness calibration offset | meter.ts | caught | caught | caught |
| 4 | Wrong 400 ms block | meter.ts | caught | caught | caught |
| 5 | Wrong 75% overlap | meter.ts | caught | caught | caught |
| 6 | Absolute gate too high | meter.ts | caught | caught | caught |
| 7 | Relative gate too high | meter.ts | caught | caught | caught |
| 8 | Corrupt true peak FIR tap | meter.ts | caught | caught | caught |
| 9 | Power logarithm for true peak | meter.ts | caught | caught | caught |
| 10 | Remove all oversampling phases | meter.ts | caught | caught | caught |
| 11 | Incorrect DC divisor | meter.ts | caught | caught | caught |
| 12 | Fade shortened tenfold | meter.ts | caught | caught | caught |
| 13 | Disable DC correction | meter.ts | caught | caught | caught |
| 14 | Wrong mastering loudness | meter.ts | caught | caught | caught |
| 15 | Wrong sample rate | meter.ts | caught | caught | caught |
| 16 | Incorrect bit depth header | wav.ts | caught | caught | caught |
| 17 | Halved PCM encoder gain | wav.ts | caught | caught | caught |
| 18 | Big endian PCM output | wav.ts | caught | caught | caught |
| 19 | Incorrect PCM decoding scale | wav.ts | caught | caught | caught |
| 20 | Incorrect seeded RNG multiplier | sfx.ts | caught | caught | caught |
| 21 | Half oscillator frequency | sfx.ts | caught | caught | caught |
| 22 | Wrong harmonic amplitude | sfx.ts | caught | caught | caught |
| 23 | Corrupt noise recursion | sfx.ts | caught | caught | caught |
| 24 | Sequence chooses next note early | sfx.ts | caught | caught | caught |
| 25 | Linear instead of geometric sweep | sfx.ts | caught | caught | caught |

Full source substitutions, successful compilation flags, exitcodes and real
assertion output are in reports/mutations.json. Result: 25/25 source bugs, 75/75
seeded probes. Temporary copies are deleted after the run.

## Independence and CI

The reference author had no conversation fork and was forbidden to inspect
production before sealing. The mathematical recipe and type contract were
shared; implementation source was not. The exact initial reference is preserved
as reference.snapshot.ts.txt (SHA256 625ea76450a7f7edf57a1637efae8bd037c0d5da5c889c6c0eba3d424fe22323).
The two narrow post-seal changes, their reasons and hashes are recorded in
ORACLE_AMENDMENTS.md. Source was never viewed by the reference author.

The first complete hosted run passed:
https://github.com/luisitin/partybox-gpt-drops/actions/runs/37634170473
(code revision 28dd7ba; full logs were inspected, all 3 seeds and 25 mutations present).
The PR description links the final successful hosted run after publication.
The workflow has read-only contents permission, no secrets, a 30 minute timeout,
and only actions/* pinned to major versions.

## UNVERIFIED

- Full EBU Mode certification, multichannel weighting, momentary/short-term
  displays, loudness range, official programme-material cases 7/8, and cases 6–14/20–23
  are outside this mono integrated/4× meter's verified scope. Passing the ten
  rebuilt adaptations does not establish certification of the complete standard.
- Subjective audition for taste and perceived game feel has not been performed.
  The quantitative 5 ms taper checks do not assert universal psychoacoustic
  inaudibility for every listener or playback system.
- Cross-engine byte identity beyond the pinned Node/V8 environment is not claimed.
