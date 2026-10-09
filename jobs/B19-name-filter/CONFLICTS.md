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

## Narrow complete-bidi correction, October 9

The written bidi-control rejection is interpreted as all 12 Unicode Bidi_Control points, including U+061C/U+200E/U+200F. The old source accepted these three. An untimed source-frozen comparison naturally finished 2026-10-09T03:25:38.601Z: every original 43,830 input at seeds 1/2/3 agrees with the fresh independently sealed reference; 102 supplemental/explicit-control discrepancies are retained as FAIL. Production now adds only those three to CONTROLS; the historical NFA adds the same three and makes no independent-authorship claim. The new sealed run-boundary implementation is integrated byte-for-byte, with its pre-exposure reference/seal pinned; historical blind files remain immutable. Unassigned/private-use points remain barriers. The original random inputs, corpus, fixed cases, 25 original mutants, warmup, samples, timer and literal 0.05ms gate are unchanged. New Unicode cases and four additional executed mutations are additive and untimed; they never enter original latency or original mutation workloads. Old source required-after-green13/5/10 remains a genuine historical failure. Changed-source acceptance/KEEP restart at zero; no gain is asserted before actual full checks.

Actual exhaustive untimed current-source unknown-category comparison naturally finished2026-10-09T03:32:25.558Z EXIT0: all814,730 Unicode17 Cn and137,468 Co points (952,198 total) in the original failing an+point+al context return OK in current production and the new independently sealed reference, with all seven actual source/runtime/self hashes unchanged and zero discrepancies. This replaces the old checker only for current checks, retaining every old failure and immutable old seal. It proves this complete finite category/context, not all contexts, all languages or performance. Exact command: node /tmp/B19-new-reference-unknown-category-exhaustive-20261009.mjs.

## Current reference and acceptance qualification

The earlier paragraph12/unadopted-reference state is historical. Current default checks use the new pre-exposure sealed a93b35 reference byte-for-byte; historical404493 sealed files and952198 old disagreements remain unchanged. Corrected89 passes two genuine full109-row observations, including its single required after-green, with0/0/0 recorded literal outliers. The new finite assigned-Unicode audit passes1942968 cases; finite barriers/controls are described in requirement-review.json. No broad universal-language/confusable or host-integration coverage is inferred.
