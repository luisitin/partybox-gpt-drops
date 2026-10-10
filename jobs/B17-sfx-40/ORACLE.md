# Independent audio oracle

`reference.ts` was written without reading the production audio source, tests,
or generated assets. Its inputs were the repository README, the B17 public
prompt, and the public documents linked below. Its implementation and this
document are sealed by a SHA256 record sent to the coordinating agent before
production comparison. Any later change needs a separately recorded reason
and hash; the first seal remains evidence of the original blind authoring.

The oracle has no imports or runtime dependencies. It accepts explicit sample
buffers and creates no random values or timestamps. Its filter uses direct
form I histories and a rolling energy window. Its decoder separately walks
RIFF chunks and checks their boundaries.

`referenceRaw` and `referenceEncode` additionally implement the mathematical
recipe supplied to both authors as a public specification before sealing.
The shared recipe defines normalized time, oscillator phase accumulation,
linear/geometric sweeps, sequence indexing and envelope, filtered supplied
noise, harmonics, two identifier-specific modulations, `tanh`, and signed
PCM quantization. Sharing this behavior definition is necessary for comparing
two implementations; no implementation source was shared. The reference
recipe uses explicitly passed RNG values and produces an unfaded, unmastered
buffer. Mastering comparisons use the separately metered delivered PCM.

## Published definitions and chosen scope

1. [ITU-R BS.1770-4, October 2015](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-S!!PDF-E.pdf),
   Annex 1, pp. 4–7, Tables 1 and 2 and equations (3)–(7): the exact 48 kHz
   shelving and high-pass coefficient values, mono channel weight 1, loudness
   offset −0.691, 400 ms blocks with 75% overlap, absolute threshold −70 LKFS,
   and relative threshold 10 LU below the absolute-gated mean. Both comparisons
   are strictly greater than the threshold. Incomplete trailing blocks are
   excluded. The meter resets both filters for each call.
2. The same document, Annex 2, pp. 16–17: four interpolation phases, each with
   twelve FIR taps, copied from the supplied coefficient table. Floating point
   omits the optional 12.04 dB integer-headroom attenuation. The full FIR tail
   is examined with zero extension at the boundaries. The reported peak is the
   maximum absolute interpolated output, with `20*log10` conversion; sample
   peak is reported separately. This finite FIR is the recommendation's
   supplied 4× estimator, rather than an assertion of exact continuous time
   reconstruction.
3. [EBU Tech 3341, version 4, November 2023](https://tech.ebu.ch/docs/tech/tech3341.pdf),
   §2.9, Table 1, pp. 8–9: reproducible test definitions and accepted tolerances.
   The document says that passing the minimum tests does not imply accuracy
   in every aspect (§2.9, p. 7).

The meter deliberately supports **48 kHz mono only**. The strict decoder
supports PCM16 interleaved channels so the calling suite can explicitly check
48 kHz and one channel. It accepts `fmt ` lengths 16 or 18 with an empty
extension, valid unknown chunks and their padding, and exactly one `fmt `
before exactly one nonempty `data` chunk. It rejects inconsistent RIFF length,
truncation, duplicate format/data chunks, invalid frame alignment, non-PCM or
non-16-bit formats, and inconsistent byte rate. Integer PCM is divided by
32768, including −32768 → −1 exactly.

**Short sound convention:** BS.1770 excludes incomplete gating blocks and
does not define a programme result for fewer than 400 ms. For B17 effects
shorter than 400 ms, the input is explicitly padded with raw zeros to one
400 ms block. Those zeros pass through the filters, retaining filter decay.
This is a stated project convention, not a new EBU compliance claim. Longer
signals receive no loudness padding. DC and both peaks use the original
record, with zero extension only for true peak convolution. Silence yields
negative infinity for loudness and true peak.

`referenceFade` checks zero endpoints within one PCM16 step. When supplied
the independently calculated corrected pre-fade peak, it verifies each edge
against that peak times the exact specified raised cosine gain, plus one
quantization step. A full fade operation check must additionally compare the
synthesizer's pre-fade signal with the delivered samples.

Without the optional pre-fade peak, its sine quarter-wave envelope relative
to the whole faded record is a conservative diagnostic only. It can flag
legitimate tapers because the largest faded sample may occur within the
taper. Integration found seven such flags across 120 sound/seed pairs;
these do not establish failed fade operations. Neither mode establishes
psychoacoustic inaudibility.

## Rebuilt EBU subset

`referenceEbuFixtures()` lazily builds **ten mono adaptations** of Table 1
cases 1–5 and 15–19. These are new floating point signals following published
definitions, not byte copies of the EBU downloaded test files. Stereo
integrated targets are shifted by −10 log10(2) = −3.01029995664 LU because the
official signal consists of identical channels with unit weights. That shift
is derived from BS.1770; the resulting mono targets are not listed as such in
the EBU table. Per-channel maximum true peak retains the table's expectation.

| Case | Exact generated segments or sine definition | Mono acceptance |
| --- | --- | --- |
| 1 | 1000 Hz, 20 s at −23 dBFS peak | −26.01029995664 ±0.1 LUFS |
| 2 | 1000 Hz, 20 s at −33 dBFS peak | −36.01029995664 ±0.1 LUFS |
| 3 | 1000 Hz; 10 s −36, 60 s −23, 10 s −36 dBFS peak | −26.01029995664 ±0.1 LUFS |
| 4 | 1000 Hz; 10 s −72, 10 s −36, 60 s −23, 10 s −36, 10 s −72 dBFS peak | −26.01029995664 ±0.1 LUFS |
| 5 | 1000 Hz; 20 s −26, **20.1 s −20**, 20 s −26 dBFS peak | −26.01029995664 ±0.1 LUFS |
| 15 | fs/4 Hz, amplitude 0.50, phase 0° | [−6.4, −5.8] dBTP |
| 16 | fs/4 Hz, amplitude 0.50, phase 45° | [−6.4, −5.8] dBTP |
| 17 | fs/6 Hz, amplitude 0.50, phase 60° | [−6.4, −5.8] dBTP |
| 18 | fs/8 Hz, amplitude 0.50, phase 67.5° | [−6.4, −5.8] dBTP |
| 19 | fs/4 Hz, amplitude 1.41, phase 45° | [2.6, 3.2] dBTP |

Cases 15–19 are one second long, with 10 ms linear fade-in/out; the public
definition leaves their duration unspecified. Case 19 remains floating point
to avoid quantizing the constructed calibration fixture. Its continuous tone
amplitude is 1.41, but the 45° sampled sine has peak 1.41/√2 ≈0.997, so these
particular PCM samples fit normalized PCM16 even though its true peak exceeds
0 dBTP. No clipping-based justification is claimed.

## Unverified scope

This oracle and subset do not implement momentary or short-term display,
loudness range, surround weighting or live meter behavior. Cases 6–14 and
20–23 are omitted. Cases 7–8 require the official programme material. Cases
20–23 specify antialias filtering and a short taper without defining their
exact coefficients/shape, so no claim is made to reconstruct them uniquely.
The rebuilt subset alone does not establish full EBU Mode certification or
full BS.1770 conformity. Actual results and commands belong in VERIFY.md
after the sealed oracle is compiled and exercised.
