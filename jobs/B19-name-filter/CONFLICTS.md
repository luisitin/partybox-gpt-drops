# Conflicts and limitations

1. Blocking every supported obfuscation and allowing every real name conflict on
identical strings. Lana/anal and Bonner/boner are concrete witnesses. Eleven
Census names remain blocked and are explicitly reported as false positives.
2. An unfiltered frequency list contains actual sexual/profanity words. The
48 kept lexical word rejections are deliberate policy decisions; passing their
regression expectations does not mean all 10,000 words are allowed.
3. A 16-code-point API cannot allow every longer place name unchanged. The 57
place and one word length rejections are format failures, not lexical matches.
4. The Census sources are historical and separated by category. Our disclosed
5,000-given-plus-15,000-distinct-surname selection is not a certified combined
national top-20,000 ranking. No data are invented to fill missing downloads.
5. The original regex and NFA sources were authored in the same session.
A newly sealed independent reference now checks every case; its author read
only the original instructions, public contract and policy data before sealing.
The historical NFA remains supplemental rather than a blind-authorship claim.
6. Low mean/p99 latency does not prove a maximum bound. Individual observed
outliers over 0.05 ms fail npm test and are never discarded or turned into passes.
7. Exceptions were reviewed after observing the corpus. Zero unexpected
rejections on this regression set would not establish zero unseen false positives.
8. A first implementation wrongly collapsed mandatory doubled letters (Bob/boob)
and omitted a lowercase homoglyph partner. Both were fixed, with regressions.
The final mutation harness counts only baseline-passing cases as mutant kills;
preexisting failures cannot make a mutant appear caught.
9. Snapshot hashes intentionally reject changed upstream corpora. The retained
cache reproduces the selected data; a later fresh GeoNames download may not.
10. Spanish is not covered. The lexicon is English-only, so Spanish profanity and slurs (`Puta`,
`Pendejo`, `Joder`, `Maricón`, `Coño`, `Polla`, `Zorra`) pass. PartyBox ships es; a Spanish lexicon
needs a native review and an owner decision. This is a known scope gap, not a passed claim.
11. Substring policy versus given names. Analía (and Analia) and Sexto were blocked by the substrings
`anal` and `sex`. They are now exact exceptions (`analia`, `analise`, `sexto`). Other given names with a
blocked substring remain blocked until someone adds them with the same exact-spelling review.

12. Expanded all-scalar contexts expose952198 old sealed-oracle disagreements on unassigned/private-use separators; production and historical NFA agree on all4456448. Unknown remaining categories are kept as barriers. Complete bidi-property interpretation additionally exposes accepted061c/200e/200f format controls. New independent reference remains unadopted, old seal and all failed inputs retained; original finite green never claimed complete Unicode coverage.
