# Improvement loop

Initial takeover: original B17 instructions and repository rules read. Asset folder
was absent; existing workflow preserved. An independent meter author was assigned
with no history fork and prohibited from reading production before sealing.

Verification improvement 1: all 120 audio cases, 30 rebuilt EBU cases and 120 FFmpeg
measurements passed. Mutation 17 triggered the intended PCM mismatch but Node's
large array diff exceeded subprocess maxBuffer. Replaced verbose array diff with
a byte equality assertion, keeping exact byte acceptance. Added a readback bound
using the independently reconstructed unfaded peak; this complements comparison
of every mastered sample and 240 samples at each PCM edge. Whole suite rerun required.

Verification improvement 2: the pinned Node22.16.0 full suite passed all120 audio
cases,30 EBU cases and75/75 mutation probes. The weakest remaining evidence was
composition: the encoder and mastering were checked separately. Added exact WAV
byte comparison against the complete independently reconstructed PCM pipeline
for all40 effects under all3 seeds. Added SHA256 integrity checks under eachseed
and repeat canonical-file/manifest checks under eachseed. Acceptance limits and
calibration tolerances are unchanged.

Improvement 2 completed: the entire independent PCM pipeline now matches every
WAV byte for all 120 cases, canonical WAV/PNG/manifest checks repeat under all
three seeds, and all listed deliverable hashes are checked under every seed.
The full rerun passed again: 120 audio, 30 EBU and 75 mutation checks. Remaining
improvements are presentation and subjective sound selection; original measured
acceptance thresholds remain satisfied. Final hosted commit verification pending.

Final provenance improvement: every hashed deliverable is checked for integrity,
complete coverage and the 30 MB filecap. A previous success summary is removed at
suite startup, and a successful summary fingerprints all 15 code/config files.
Evidence recording rejects changed source hashes. Full pinned-node rerun passed
120 audio/30 EBU/75 mutation checks again. Calibration documentation clarified that
case 19's sample peak is below fullscale despite its reconstructed +3 dBTP peak;
no synthesis or meter behavior changed. Final exact-head hosted inspection follows.

Final purity review found exported FFT changed caller arrays. Converted it to
copy its real/imaginary inputs and return new arrays, preserving all numeric and
PNG output. Added assertions of unchanged caller arrays alongside independent
direct-DFT comparisons for all six sizes under each seed. Full rerun required
before recording or handing off this code change.

Purity improvement complete: both FFT inputs remain unchanged for every tested
size/seed, every canonical spectrogram remains byte-identical, and the full local
suite passed again (120 audio, 30 rebuilt EBU, 75 mutation cases). Hosted code
revision df5ae5d also passed; its full 891-line log contains all three successful
seeds and all 25 detected mutations. Final evidence publication changes reports
and documentation; exact-head CI will be inspected before the B16 handoff.
