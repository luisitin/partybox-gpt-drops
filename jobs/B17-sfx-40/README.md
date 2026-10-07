# B17 40 original synthesized sound effects

Forty original UI/game effects synthesized from oscillators, filtered seeded noise,
and envelopes. No recorded audio or sample library is used. The `audio/` folder
contains mono 48 kHz, signed 16-bit PCM WAVs; `spectrograms/` contains a PNG for
each effect. Open `gallery.html` to listen, inspect, and download. `manifest.json`
contains the complete sound recipes, measured properties, paths, and WAV hashes.

## Reproduce

Use Node 22.16.0 (the CI version), npm, and FFmpeg with the `ebur128` filter.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

One command performs strict TypeScript compilation, complete suites for seeds
1/2/3, comparison with the blind independent implementation, all audio limits,
regeneration, PNG validation, FFT versus direct DFT, rebuilt EBU calibration,
external FFmpeg measurement, invalid inputs, and 25 isolated compilable source
mutations under all three seeds. Rerun reports appear in `reports-run/`; checked-in
evidence appears in `reports/`. `npm run generate` reproduces the canonical seed-1
WAVs, spectrograms, manifest, and listening gallery.

The production TypeScript modules are pure and have **zero runtime dependencies**.
TypeScript is the only development package. Tests and the output-writing CLI use
Node standard-library I/O; FFmpeg is an independent test tool, not a synthesizer
or production dependency. RNG functions are supplied explicitly. The manifest
records seed 1; seeds 2 and 3 verify other noise realizations without replacing
canonical media.

## Sound list

| ID | Effect | Duration | Recipe |
| --- | --- | ---: | --- |
| `coin` | Coin | 0.72 s | Three metallic ascending partials |
| `star-get` | Star get | 1.10 s | Bright four-note reward arpeggio |
| `dice-roll` | Dice roll | 0.90 s | Rhythmic rattling filtered noise |
| `dice-stop` | Dice stop | 0.52 s | Low wooden landing with a tonal body |
| `step` | Step | 0.46 s | Soft low impact with rustling attack |
| `buzzer` | Buzzer | 0.68 s | Rough detuned error buzz |
| `ding` | Ding | 0.85 s | Clear harmonic confirmation bell |
| `whoosh` | Whoosh | 0.80 s | Ascending airy sweep |
| `pop` | Pop | 0.48 s | Round falling bubble tone |
| `countdown-tick` | Countdown tick | 0.45 s | Compact dry countdown cue |
| `final-tick` | Final tick | 0.56 s | Higher double countdown accent |
| `win-fanfare` | Win fanfare | 1.65 s | Five-note major victory figure |
| `lose` | Lose | 1.20 s | Descending minor disappointment |
| `item-use` | Item use | 0.85 s | Glowing upward activation chirp |
| `shop-open` | Shop open | 1.05 s | Friendly rising shop chord |
| `vote` | Vote | 0.60 s | Small affirmative pluck |
| `reveal` | Reveal | 1.20 s | Swelling suspense into a bright reveal |
| `timer-warning` | Timer warning | 0.90 s | Three urgent rising notes |
| `menu-move` | Menu move | 0.46 s | Muted navigation tap |
| `menu-back` | Menu back | 0.55 s | Falling navigation chirp |
| `confirm` | Confirm | 0.64 s | Two-note upward approval |
| `cancel` | Cancel | 0.64 s | Two-note downward cancellation |
| `join` | Player join | 0.90 s | Warm arrival triad |
| `leave` | Player leave | 0.90 s | Soft descending departure |
| `ready` | Ready | 0.62 s | Bright sustained readiness blip |
| `start` | Game start | 1.15 s | Rising start flourish |
| `round-end` | Round end | 1.10 s | Relaxed closing cadence |
| `bonus` | Bonus | 1.05 s | Sparkling high reward cascade |
| `penalty` | Penalty | 0.70 s | Grainy low penalty fall |
| `teleport` | Teleport | 1.00 s | Modulated rising transport beam |
| `shield` | Shield | 1.10 s | Warm humming protective field |
| `power-up` | Power up | 1.25 s | Octave-spanning energized rise |
| `power-down` | Power down | 1.25 s | Long falling energy discharge |
| `notification` | Notification | 0.84 s | Gentle three-note attention cue |
| `achievement` | Achievement | 1.50 s | Extended major accomplishment motif |
| `error` | Error | 0.76 s | Three dark rejection pulses |
| `splash` | Splash | 0.85 s | Falling textured synthetic water burst |
| `bounce` | Bounce | 0.58 s | Elastic descending spring chirp |
| `swipe` | Swipe | 0.60 s | Short downward airy gesture |
| `connect` | Connect | 0.95 s | Rising connected-state chord |

## Meter and fades

`meter.ts` uses the exact 48 kHz BS.1770-4 two-stage K filter, 400 ms blocks
with 75% overlap, −70 LUFS absolute gate and −10 LU relative gate. True peak uses
the recommendation's four-phase, twelve-tap FIR, including its tail. All delivered
sounds are longer than 400 ms. Mono uses channel weight 1. A declared zero-padding
convention exists for shorter inputs to the general meter; it is unused by these
assets. The PCM readback target is −16 ±0.5 LUFS, ≤−1.5 dBTP, and |DC|<0.001.

Mastering removes DC through a raised-cosine correction basis, applies exact
5 ms tapers at both ends, and normalizes using gated integrated loudness.
Tests independently reconstruct the entire mastering operation and compare both
PCM edges within one quantization step. This proves the prescribed taper; an
extra global-peak envelope diagnostic is documented separately in ORACLE.md.

The standards calibration is a reproducible **mono adaptation** of EBU Tech 3341
cases 1–5 and 15–19. It checks the published tolerances with the stereo loudness
target reduced by 3.0103 LU; case 19 remains floating point to avoid quantizing
the constructed calibration signal. Its sampled values fit PCM16 even though
its interpolated true peak exceeds 0 dBTP. It is not full EBU Mode certification. ORACLE.md,
ORACLE_AMENDMENTS.md and SOURCES.md state isolation, sources and scope.

Spectrograms use a 1024-sample Hann FFT, 256 time columns, logarithmic frequency
bins from 47 Hz to 24 kHz, and a 70 dB magnitude window. Each PNG is independently
parsed, CRC-checked and inflated during testing.
