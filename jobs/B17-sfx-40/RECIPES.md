# B17 recipes: how a sound is written down, rendered and checked

A sound is data, not code. `recipes.ts` holds the 40 sounds as plain objects; `dsp.ts` turns one into
stereo samples; `meter.ts` and `wav.ts` master and encode it. Everything is pure: the same recipe and
the same seed always give the same samples, and no clock, file or network is touched.

## The shape of a recipe

```ts
interface Recipe { seconds: number; layers: Layer[]; bus: BusSpec }
interface BusSpec { drive: number; eq: EqBand[]; room: RoomSpec }
```

`seconds` is 0.05 to 3. Every layer's `at` must be inside the sound.

| Layer | What it is | Fields that matter |
| --- | --- | --- |
| `tone` | additive sine partials (modal bars, glass, wood, sine, and warm sums of partials) | `hz`, `partials[{ratio,gain,decay}]` (1–32), `glideTo` + `glide` (exponential glide, s), `vibratoHz/Cents`, `fmRatio/fmIndex/fmT60` (FM on partial 0), `unison` (1–8 voices, `detuneCents`, `spread`) |
| `noise` | seeded white noise through a TPT state-variable filter | `filter` `lp`/`bp`/`hp`, `hz` → `hzTo` sweep, `q` |
| `scatter` | `count` (1–64) copies of its own `layers` with seeded timing, gain and pitch jitter | `span`, `curve`, `jitter`, `fallDb`, `gainJitterDb`, `pitchJitter`, `panSpread` |

Every layer has the same envelope: `at` (onset), `gainDb`, a constant-power `pan` that moves linearly to
`panTo` over `move` seconds, a raised-cosine `attack`, a flat `hold`, then an exponential decay that
reaches −60 dB after `t60` seconds (a partial multiplies `t60` by its own `decay`), and optional tremolo
(`tremoloHz`, `tremoloDepth` 0…1).

`bus` shapes the mix after the layers are summed:

1. `drive`: a `tanh` saturator after peak normalisation (0 = clean). Gentle, never clipping.
2. `eq`: RBJ biquads (`hp`, `lp`, `peak`, `lowshelf`, `highshelf`) with `hz`, `q`, `db`.
3. `room`: a wet-only room (`sendDb`, `rt60`, `damp`, `predelay`, `size`): 4 Schroeder all-passes into an
   8-line Hadamard feedback network, each line damped and sized to hit the requested `rt60`.

## Randomness

`seeded(seed)` is the 32-bit linear congruential generator from *Numerical Recipes*
(`state = (state × 1664525 + 1013904223) mod 2³²`). Each layer draws exactly one 32-bit sub-seed, in
layer order, so a layer's noise is independent of the others. A scatter draws its own timing stream from
one sub-seed and gives every copy its own sub-seed. `soundSeed(id, seed)` mixes the sound id into the
caller's seed, so two sounds never share noise by accident. `drawSeed` rejects any generator value
outside [0, 1).

## From recipe to delivered WAV

1. `renderUnlimited`: layers → drive → EQ → room (stereo).
2. `level`: applies the 5 ms raised-cosine edge fades to both channels, then bisects the input gain (up to 24 dB
   of limiting, 14 steps) until a look-ahead true-peak limiter (1.5 ms look-ahead, 60 ms release, ceiling
   −2 dBTP on the 4× interpolated envelope) leaves the mid at −16 LUFS (BS.1770-4 gating, 400 ms blocks).
   A recipe that needs more than 24 dB of limiting throws a `RangeError` instead of being squashed.
   `renderRecipe` is `level(renderUnlimited(…))`.
3. `finishAudio` (meter.ts), the shared master, on the mid: removes DC through the fade basis, applies the
   5 ms fades again (so the taper is squared; both endpoints stay exactly 0), sets −16 LUFS, and throws a
   `RangeError` if the true peak is above −1.55 dBTP (a 0.05 dB margin under the −1.5 dBTP limit). The suite
   also requires every delivered sample peak to stay at or below −1.5 dBFS.
4. `encodeWav`: mono PCM16, 48 kHz, one `RIFF` with a 44-byte header, rounded (not truncated).

The delivered WAVs are step 1–3 on the mid, then `encodeWav`. `renderCue(id, {seed, semitones})` is the
port's entry point and takes a second path that the suite checks against the first: the stereo pair is
mastered by `finishStereo` (per-channel DC through the fade basis, then one gain that puts the mid at
−16 LUFS, and a RangeError above −1.5 dBTP), and the `mono` it returns is `finishAudio` of the mid.
Both land on −16 LUFS, and the suite requires `renderCue`'s mono to equal the delivered seed-1 WAV bytes.
`semitones` (−24…24) transposes every tone and noise filter, which is how a countdown or a join step is
made without a second recipe.

## Limits enforced before rendering

Finite numbers only; `t60 > 0`; `at` ≥ 0 and inside the sound; durations 0.05–3 s; tremolo depth 0…1;
partials 1–32; unison 1–8; scatter 1–64 copies with `curve > 0`; EQ band frequencies above 0 and below
Nyquist; `drive ≥ 0`; `predelay < 1 s`; transposition within ±24 semitones. A violation throws a
`RangeError` before any sample is written, so a bad recipe cannot ship silently.

## Adding or changing a sound

1. Add the id to `SOUND_IDS` and a `make(...)` entry to `SOUNDS` in `recipes.ts`, with its group and a
   one-line description. Add its PartyBox links in `cues.ts`.
2. `npm test`. The suite checks the twin, the master, −16 LUFS, −1.5 dBTP, DC, edges, byte regeneration,
   the spectrogram, FFmpeg agreement and the committed evidence. A failure names the sound.
3. `npm run generate` rewrites `audio/`, `spectrograms/`, `manifest.json` and `gallery.html`. Then, after a
   passing run, `node tools/record.mjs` refreshes `reports/`, `VERIFY.md` and `SHA256SUMS.txt`.
4. Listen to it in `gallery.html`. The tests cannot tell you whether it is pleasant.

## Known edges

- The room uses a fixed set of delay lengths; `size` scales them, so very large sizes get slow to render.
- `level()` applies the 5 ms fade before limiting and `finishAudio` applies it again; the second pass
  only squares an already-zero edge, so it changes nothing audible and is kept so the master stays the
  shared, independently checked operation.
- Rendering all 40 sounds takes about 27 s of CPU on the development machine (Node 22.22.0).
  Render once and ship the WAVs.
- The engine uses `Math.sin`, `Math.cos`, `Math.exp` and `Math.pow`. Byte identity is claimed for the pinned
  Node version only (see ASSUMPTIONS.md).
