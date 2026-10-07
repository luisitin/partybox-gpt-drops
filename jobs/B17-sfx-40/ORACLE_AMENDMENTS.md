# Oracle seal and integration amendments

The original blind seal, sent to the coordinating agent before production
comparison, was:

```
625ea76450a7f7edf57a1637efae8bd037c0d5da5c889c6c0eba3d424fe22323  reference.ts
2f3121ed2c3d7563f5e46ed83715297dca0d0e051adc4fe43ea879e2893add15  ORACLE.md
```

The exact original source is preserved as `reference.snapshot.ts.txt`.
Its SHA256 is the original `625ea76450a7f7edf57a1637efae8bd037c0d5da5c889c6c0eba3d424fe22323`.
The `.txt` suffix excludes it from TypeScript compilation. It was reconstructed
by reversing the two documented amendments and its original hash was verified
before writing the snapshot; the current `reference.ts` was left unchanged.

After the seal, the coordinating agent reported that the public sound
catalogue uses an empty `notes` array for sound kinds that do not select
sequence notes. The oracle unnecessarily rejected that unused property.
The guard was narrowed to reject an empty note array only for `sequence`.
This changes input acceptance for unused metadata; it does not change any
filter, synthesis sample, quantization, or signal fixture formula. No
production implementation source was read to make this change.

The amended source seal is:

```
ed007f1bdb1900a6852eb40a625d67d6ef3fd9058ba4bd3a4be4c82432aa7ff9  reference.ts
```

The coordinating suite must record tests against the amended source. The
original hashes remain recorded as evidence of blind authoring.

## Fade diagnostic correction after integration

Integration reported seven flags from the default global faded peak
diagnostic among 120 sound/seed pairs. All had exactly zero endpoints. The
flagged IDs were seed 1 `ding`, `menu-move`, `menu-back`, `bounce`; seed 2
`menu-move`, `menu-back`; and seed 3 `menu-back`. Their relevant samples were
225–236 into the 240-sample leading taper. A largest faded sample can occur
inside its taper, so comparison to a global faded peak is not a necessary
condition for a correct fade. The original documentation's assertion that
the diagnostic was necessary was corrected.

The optional third argument of `referenceFade` now accepts an independently
established corrected pre-fade peak. In that mode it uses the exact published
raised cosine envelope rather than the diagnostic quarter sine bound. The
existing diagnostic behavior remains available and is explicitly labelled.
The complete fade operation also needs comparison against independent raw
synthesis, DC correction, and normalization; the coordinating suite provides
that operation check.

The second amended seal is:

```
2c7397344bb67fbb74134229eb86254d97628fa9d961d8d113d214f89822a658  reference.ts
51e4c7460b42b2d445ad7111a07a58d1e63987f84b7773d66bf69845e890baba  ORACLE.md
```
