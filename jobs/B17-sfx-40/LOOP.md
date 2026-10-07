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
