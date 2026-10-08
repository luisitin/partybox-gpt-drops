# B19 continuation point

PR2 remains draft. October 8 resumed B19 from original head04f8ece after a fresh
main/branch ownership check and claim. All prior failures/evidence stay intact.

A bounded, explicitly nongating diagnostic of the actual hosted3-character
ASCII witness measured the general full matcher versus only minimum-length
eligible terms. The latter reduced matcher work and matched all17,576 lowercase
three-letter inputs. Production now compiles eligible forward/reversed matchers
by mapped text length. The exact pre-change source and before/after diagnostic
reports, all individual observations and CPU samples are retained. Neither
diagnostic establishes historical outlier cause or acceptance.

Current result: length-pruned source5371665d completed the full unchanged command
with88suites; all behavior/mutants and74,619 new blind boundaries pass, but
36/8/16 individual timing observations exceed0.05ms. Maxima0.472961/0.246780/
0.456415ms and all raw/log evidence remain in results/resume-length-pruning/.
No unchanged retry is allowed. Exact-head hosted CI is pending.

Next independent action: investigate the measured per-call lowercasing allocation
for already-lowercaseASCII with a bounded private diagnostic candidate. Only
make a general allocation improvement if a controlled stage/whole-call gain is
measured; preserve Unicode contextual folding and every original acceptance
count/seed/timer/warmup/threshold. Then a genuinely changed source may receive
one complete fresh command, with all failures retained.

Do not replace the maximum with a percentile, filter/retime failures, add result
memoization, change seeds/counts/timer windows/warmup, or repeat unchanged source
until it happens to pass. No hard realtime or universal-corpus claim is made.
