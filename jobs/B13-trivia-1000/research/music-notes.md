# Music research notes — in progress

Author: finish_b17. The currently authored eight rows are real sourced rows, not a complete 100-row category. They have not been sealed for independent review. Sources were fetched by actual HTTPS GET with captured status, resolved URL, UTC time and HTML/text hashes. Full captures remain ignored under `.work/music/`.

## Source selection

The preparation pass fetched 25 topic pages from Wikimedia and 25 independently edited Britannica pages discovered with Exa searches. Only the four pages actually used in the current eight rows enter the source ledger. A source pair is compared for the particular claims, rather than accepted because it has different URLs. The selected Wikipedia pages contain no link to the paired Britannica URL; editorial ownership and independently written prose are recorded separately.

## Scope decisions and exclusions

- Beatles hometown is Liverpool; the question does not confuse the 1957 Lennon/McCartney meeting with the band's 1960 formation. The familiar four-member lineup scopes Ringo's drummer role without asserting that he played every studio drum part.
- Epstein worked in a Liverpool record shop. Britannica calls him its manager and Wikipedia calls him an owner. The delivered fact uses “worked” and does not silently choose one ownership description.
- Parlophone scopes George Martin's production role, avoiding the later Phil Spector contribution.
- Elvis's private recording in 1953 is distinct from his commercial recording career in 1954. The Sun-label question explicitly asks commercial recordings.
- An initial draft about Elvis's first number-one record was excluded because the abbreviated Britannica wording did not clearly distinguish pop from earlier country charts. A birthplace question replaces that draft. The final data make no unsourced first-chart claim.
- The source preparation encountered current Britannica FAQ updates about living artists and 2026 events. These are excluded from the planned question scope; historical career facts require matching independent support. No current marriage, death, verdict, changing award total or record-count question is planned.
- Queen's formation year needs additional comparison: Britannica mentions 1971 while the Wikimedia history uses 1970. No formation-year question is authored.

## Actual checks so far

The authoring script matched every delivered answer quote and fun-fact quote as a contiguous whitespace-normalized substring of the captured source text and enforced at most 25 words per quote. All eight rows passed the owner's row JSON Schema with Python Draft202012Validator. Correct indices are currently two per position. Category-size, final difficulty balance, whole-pack similarity/length checks, independent adversarial review and fresh reopening remain pending.

## Resumed final author snapshot

100 real questions now authored across 25 artists/bands spanning pop, rock, country, soul, jazz, hip-hop and classical music. The recovered original eight questions and actual captures are retained. Receipt plumbing now distinguishes the raw HTML hash/path from the normalized extracted plaintext hash/path used for exact quote checks; the original failed integration report remains historical evidence rather than being relabeled a pass.

Current owner /root/resume_b14_review read relevant source-body paragraphs and contexts, authored 92 additional questions, and independently compared each answer and contextual claim. All 400 quote fields match actual captured plaintext, each at most25 words; all100 rows pass the row JSON Schema. Difficulty34/33/33 and correct indices25 each are actual counts. These structural results do not replace the pending fresh adversarial review or second full source reopening.

Additional scope decisions: Queen formation year1970 versus1971 is excluded; Madonna full-name middle-name variation is excluded by asking family surname only; precise Beethoven onset-of-deafness dates are excluded. Tupac birthplace borough conflicts (Wikipedia Manhattan, Britannica Brooklyn), while both places are in New York City: the delivered question asks only the shared city and preserves the disagreement in its confidence reason. Recovered sources sometimes contain2026 updates; no changing marriage/award total/current-status answer was adopted. Beyonce marriage is explicitly dated2008. Swift questions concern fixed2014,2020,2021 historical releases. Composer calendar disputes are avoided by asking uncontroversial places and work attributions. The Hot Five question excludes Hot Seven from distractors because it is also a real ensemble.
