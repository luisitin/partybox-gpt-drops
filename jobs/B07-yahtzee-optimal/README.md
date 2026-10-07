# B07 exact optimal solitaire Yahtzee

Pure TypeScript scoring and optimal hold/category decisions, backed by actual
complete solved tables and an independently authored native generator. Every
chance outcome and legal action is included; there is no search cutoff or
simulation approximation in the solver. Expectations use IEEE754 doubles.

| Rule mode | Primary empty-card EV | Independent empty-card EV |
|---|---:|---:|
| official (default) |254.58772873449593|254.5877287344961|
| published |254.58960948196315|254.58960948196366|

The requested254.5896 target belongs to the published convention. Hasbro's
forced Joker convention has a different result. Both are explicitly exposed;
see CONFLICTS.md and the frozen PUBLIC-CONTRACT.md.

Run npm ci, then npm run build. Import build/yahtzeeOpt.js, which exports score,
expectedValue, bestCategory, bestHold and valueOfHold. The public contract gives
category order, state validation, transitions, rerolls and deterministic ties.
Runtime dependencies are empty; production functions perform no I/O or random
draws. Build copies actual JSON tables beside the compiled module.

Each mode's binary table is8,388,608 bytes; compact JSON is under13MB. Of
1,048,576 slots,536,448 are publicly valid reachable states. Invalid slots are
NaN in binary andnull in JSON. Regenerate with no target as input:

    mkdir -p .verification
    g++ -std=c++20 -O3 -fopenmp -Wall -Wextra -Werror generator.cpp -o .verification/generator
    OMP_NUM_THREADS=2 .verification/generator --mode official --output tables/official.bin
    OMP_NUM_THREADS=2 .verification/generator --mode published --output tables/published.bin
    node convert-tables.mjs

independent/ preserves separately sealed source, generator, its own actual
tables and pre-exchange selfchecks. AUTHORING.md, original seals and
AMENDMENT.md make source history auditable. The null-mode repair changes only
the primary normalizer. Full-suite integration is in progress; VERIFY.md lists
observed results and outstanding paired simulation/hosted CI gates. The finished
single command will be npm test with all original seeds/counts.
