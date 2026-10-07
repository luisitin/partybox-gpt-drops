# B19 continuation point

PR #2 is an honest draft with complete independent-reference verification,
all original three-seed corpus/generator/mutation suites and measured reports.
The final local literal 0.05 ms maximum remains unmet; all outlier inputs and
times are delivered in results/benchmark-seed*.json. Eleven reviewed name
collisions and the documented word/length conflicts remain explicit.

For substantive future optimization, inspect those witnesses and reduce actual
per-check allocation or execution work. Retain every original input/count/seed,
all 25 real mutations per seed and the unchanged per-observation maximum. Do
not filter outliers, alter the timer window, add benchmark-specific behavior or
rerun an unchanged source until a lucky green result. Rerun the complete command
from this directory: npm ci --ignore-scripts --no-audit --no-fund && npm test.

The PR description identifies the inspected final head and hosted CI conclusion.
