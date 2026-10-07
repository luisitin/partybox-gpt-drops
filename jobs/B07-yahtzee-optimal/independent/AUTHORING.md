# Independent B07 authoring

Root authored this C++ generator and TypeScript scorer/decision implementation
before opening any primary B07 production, generator, tests or computed tables.
Only PROMPTS.md, repository README and PUBLIC-CONTRACT.md were read from the job.
No implementation source or privately computed result was exchanged before seal.

Independently retrieved rules: Hasbro 40958.pdf (2003 forced matching upper,
then lower, then other upper, including Yahtzee-box-zero example); Verhoeff's
rules.html and trivia.html (free category choice and matching-upper restriction
on Joker fixed scores). Support answer 211 failed to open. An earlier Hasbro
Yahtzee.pdf was image-only and yielded no text. The Verhoeff report response
displayed its abstract, scoring/rules sections and general one-die game-tree
discussion; no primary or third-party implementation code was read or copied.
The numerical target is a verification comparison only; it is absent from the
generator and runtime arithmetic.

The generator enumerates all 462 possible held multisets, all 252 full rolls,
and all 4,368 weighted completions. It performs full backward induction over
every publicly reachable card in each convention. Integer multinomial weights
represent all ordered chance outcomes. Values use IEEE754 doubles; no sampled
outcomes, cutoff, guessed continuation or canned EV is used. A subtotal that
cannot attain the upper bonus even with every remaining upper category scoring
five matches has the same remaining rewards as subtotal zero; both actual
subtotal table entries are filled and public cards retain their given subtotal.

The TypeScript implementation independently reexpresses scoring and within-turn
choices. It consumes only its own generator's raw tables. Its direct ordered-roll
method enumerates 6^n replacement branches to cross-check the compressed sums.
An internal bounded memo only stores recomputable turn values; it does not change
outputs or consume ambient randomness. Copied input tables prevent caller mutation
from affecting results. Test/generator filesystem access is outside pure runtime.

The seal includes source, strict configuration, independently generated tables,
generator reports and actual self-check output. Local rule PDFs/text are staging
only and are not handoff/delivery files. Any post-seal correction must retain this
snapshot and use an explicitly labelled amendment with new hashes.
