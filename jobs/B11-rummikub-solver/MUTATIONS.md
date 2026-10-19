# 25 planted source bugs — observed kill matrix

Each mutant makes exactly one source replacement in a temporary copy of `rummikub.ts`. Every mutant was strictly compiled and then run against all 61 hand-written tests. Compilation errors, crashes, launch errors and timeouts are **not** credited kills. Each cell names the first failing test in that seed's shuffled order; all cells were observed assertion failures. The complete replacement definitions are in `test/mutations.mjs`.

| ID | Deliberate bug | Seed 1 killer | Seed 2 killer | Seed 3 killer |
|---|---|---|---|---|
| M01 | Accept two-tile melds | J24 | J24 | J24 |
| M02 | Reject valid four-tile groups | J36 | J07 | J07 |
| M03 | Ignore repeated group colors | J10 | J10 | J12 |
| M04 | Ignore unequal group values | J11 | J11 | J11 |
| M05 | Require gaps of two in runs | S14 | S09 | J40 |
| M06 | Ignore mixed run colors | J13 | J13 | J13 |
| M07 | Allow value fourteen | J17 | J17 | J17 |
| M08 | Allow value zero | J16 | J16 | J16 |
| M09 | Permit three physical jokers | V03 | J19 | J19 |
| M10 | Permit three numbered copies | J23 | J23 | J23 |
| M11 | Ignore duplicate physical IDs | V02 | V02 | J20 |
| M12 | Reject every placed joker | S10 | J09 | J40 |
| M13 | Raise initial threshold to 31 | J26 | J26 | J26 |
| M14 | Lower initial threshold to 29 | J28 | J28 | J28 |
| M15 | Allow initial-turn table manipulation | J31 | J30 | J30 |
| M16 | Allow old table tiles to disappear | J37 | J37 | J37 |
| M17 | Allow foreign physical IDs | J38 | J38 | J38 |
| M18 | Allow a physical tile to change identity | V01 | V01 | V01 |
| M19 | Allow table-only moves | J39 | J39 | J39 |
| M20 | Do not score a played rack joker | S10 | S09 | S09 |
| M21 | Count old table points as new rack value | S08 | S07 | S05 |
| M22 | Omit group candidates | S10 | S06 | S10 |
| M23 | Omit run candidates | S14 | S09 | S14 |
| M24 | Omit all joker substitutions | S10 | S09 | S09 |
| M25 | Treat mandatory low-word table resources as optional | S06 | S06 | S06 |

**Result: 25/25 kills per seed, 75/75 total.** This is a selected semantic mutation set, not exhaustive mutation coverage. Mutants are not shipped as runtime modes and never overwrite the original source.
