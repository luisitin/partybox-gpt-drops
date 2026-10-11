# Primary authoring and source exchange

The primary author wrote `generator.cpp` and `yahtzeeOpt.ts` in this job's
isolated checkout. The coordinator wrote a separate B07 implementation in
`/workspace/blind-b07`. Neither author opened the other's implementation,
tests or tables before authoring and sealing its own core.

## Allowed inputs and actual reads

The primary author read the original B07 prompt, repository README and shared
`PUBLIC-CONTRACT.md`. Public research included Hasbro's US40958 rules, its
customer support answer, Verhoeff's rules/trivia pages, Glenn's published
dynamic-programming paper and public third-party `jdh8/yahtzee-engine` README,
`solver.rs`, `state.rs` and `dice.rs` through Exa. This is disclosed public
research, not an unseen-source claim. No third-party code was copied into
the core. `SOURCES.md` records URLs and the convention conflict.

The full primary C++ generator and TypeScript API had already been written,
and TypeScript had already compiled strictly, when the coordinator announced
its sealed helper and computed starting values. That message contained summary
results and its general algorithm class. The primary did not open any helper
source, helper tests or helper tables before its own seal, and did not alter
its algorithms to obtain those announced values. Published starting values
were also already visible in the public research; they are comparison
fixtures and never input to the generator or production decision algorithm.

## Actual pre-exchange checks

Both complete native calculations finished before exchange: 536,448 publicly
valid table entries per mode, 359,616 calculated canonical components including
four canonical terminal components. The other valid terminal/upper-equivalent
entries are exact copies of their own calculated canonical component. No
cutoff, sampled continuation value or imported answer was used.

`CORE-SELFCHECK.json` records 1,882,810 passing assertions: all7,776 ordered
rolls ×13 categories in both modes (202,176 scoring cases), every valid table
state in both modes, 50 directly enumerated ordered-roll hold expectations,
chance-only closed form, Joker/bonus/forced-box boundaries, terminal states,
malformed inputs and frozen-input calls. The compiler uses every strict flag
listed in `tsconfig.json`; C++ compiles with `-Wall -Wextra -Werror`.

One initial selfcheck fixture incorrectly expected a chance-only two-reroll
hold to retain4. Direct scalar calculation shows the first-reroll threshold
is4.25, so the correct hold is5 and6. That fixture was corrected before sealing;
the production core was unchanged. Both full generator logs are preserved in
`reports/initial-generation-*.log`.

`PRIMARY-SEALED-SHA256SUMS.txt` was written after these checks and before opening
the coordinator's independent files. It seals the original source, tables,+contract, own selfcheck and authoring record. Any later source correction must
retain this original seal and explain the concrete discrepancy separately.
