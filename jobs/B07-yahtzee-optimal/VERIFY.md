# Observed verification at the source/table milestone

| Test | Count | Seed | Exact command | Observed |
|---|---:|---|---|---|
| Strict TypeScript | all configured strict flags | deterministic | npm run build | PASS |
| Native generator | -Wall -Wextra -Werror | deterministic | g++ -std=c++20 -O3 -fopenmp -Wall -Wextra -Werror generator.cpp -o .verification/generator | PASS |
| Primary pre-exchange own checks |1,882,810 assertions;202,176 scoring cases;1,072,896 valid states;50 ordered holds|deterministic|node core-selfcheck.mjs|PASS before exchange|
| Complete official table |536,448 states;359,616 canonical components incl4terminal|deterministic|OMP_NUM_THREADS=3 .verification/generator --mode official --output tables/official.bin|PASS actual log/table|
| Complete published table |same full count|deterministic|OMP_NUM_THREADS=3 .verification/generator --mode published --output tables/published.bin|PASS actual log/table|
| Independent seal |13 files|deterministic|cd independent; sha256sum -c SEALED-SHA256SUMS.txt|PASS unchanged|
| Full table differential |1,072,896 entries; finite masks identical|1,2,3|node verify-seed.mjs SEED|PASS each; maxdifference9.3792e-13|
| Random midgame comparisons |50,000 perseed;33,333 direct ordered hold replays perseed|1,2,3|node verify-seed.mjs SEED|PASS all three actual reports|
| Ordered scoring |7,776×13×2modes perseed|1,2,3|node verify-seed.mjs SEED|PASS202,176 perseed|
| Mutation suite |25strict compilations and25runtime kills perseed|1,2,3|node mutate.mjs SEED|seed1PASS; later seeds running|
| Initial official native games |1,000,000 full13-turn games|1|OMP_NUM_THREADS=2 .verification/generator --mode official --output .verification/initial-simulation-official.bin --games 1000000 --seed 1 --report reports/initial-simulation-official-seed-1.json|PASS0.3522SE; supplemental own simulation|
| Null-mode defect |actual input and four-API replay|deterministic|boundaryChecks in test.mjs|corrected; original preserved|

Independent comparisons use1e-10 roundoff tolerance, not bitwise rational
arithmetic. Different summation orders may select alternative holds; each chosen
hold is replayed against ordered chance outcomes. Equality fixtures enforce
deterministic lexicographic ties. Seed1/2/3 produced317/283/307 alternate holds,
zero alternate categories, maximum value gap7.9581e-13 and maximum ordered-sum
residual2.2397e-11. Each count is from an actual full50,000-state report.

## UNVERIFIED at this milestone

The single npm test pipeline; finished75mutants combined; final paired native
and actual-TS-validated6,000,000 full games; both generator regeneration gates
in that pipeline; final-head GitHub Actions. Initial own simulation alone is
not differential proof. The original simultaneous official-rule/254.5896
conjunction conflicts; both modes resolve it explicitly, not a literal pass.
