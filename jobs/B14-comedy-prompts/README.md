# B14: 600 comedy prompts + 600 most-likely prompts

The follow-up research currently qualifies15 limited facts and21 specifically reviewed prompts. The remaining1179 require complete source-backed cue review; strict research readiness rejects them. Original Ready PR13 is preserved and supplemental PR29 remains Draft. Humor grades describe editorial agreement, independently of research confidence.

`prompts.json` is the final adult-party fiction pack: 600 fill-in-the-blank
prompts and 600 most-likely prompts, each at most 90 Unicode characters.
Every selected row was graded 4 or 5 by both its author and a fresh independent
reviewer. The complete 1,500+1,500 original candidate pool, every low grade and
all grading reasons remain in `candidates.json`, `batches/` and `grading/`.

The current combined final pack has 644 canonical named references, at most three
appearances each across both genres. `named-reference-audit.json` and
`editorial-review.json` record the actual names visible in each selected row;
`similarity-resolutions.json` explains every retained pair above 0.75 similarity.
The full original pool also receives an exhaustive pair scan, comparing both
argument directions because SequenceMatcher can be order-sensitive.

Install the pinned validator and rerun all checks:

```sh
python3 -m pip install -r requirements.txt
npm test
```

`npm test` reruns every original-pool pair comparison, the final selection
checks and the file manifest. It uses no randomness; seeds are not applicable.
`npm run build` serializes hand-authored TSVs and refuses to modify sealed
batches. It never writes jokes or assigns grades. `npm run checksums` rebuilds
the manifest only when deliberately publishing a changed artifact.

`prompts.schema.json` validates the final import file; `candidates.schema.json`
validates the full candidate pool. Confidence describes editorial agreement,
not factual reliability or an audience playtest: high means two grades of 5,
medium means two grades of at least 4. The rejected pool also contains low
confidence records in `candidate-confidence.json`.

All scenarios, quoted fictional labels and imagined dialogue are original
fiction. Cultural references do not assert real incidents, endorsements,
product features, or misconduct. Read `SOURCES.md` and `ASSUMPTIONS.md` for
that scope. Humor was independently reviewed, but has not been audience-tested.

The 2026-10-09 follow-up is an active Draft audit. It repairs both-genre ranking and personally reviewed repeated premises, adds a read-only delivery gate and preserves genuine original full evidence. Strict cultural-cue research remains unfinished. See NEXT.md and reports/audit-20261009/CURRENT-SCOPE.md; the original zero-facts fiction exemption does not certify real cultural references.


## Supplemental repair status

Draft PR29 preserves the original Ready PR13. It restores exact ranking across both genres, removes reviewed repeated premises, and checks delivery size/coverage before release. The current pack keeps600 per format and all original candidate wordings and grades. Nine sourced cultural facts support13 fully reviewed rows; the remaining1,187 rows are still UNVERIFIED.

Run `npm test` for original structural/editorial checks and the new selector, delivery, semantic and partial research controls. Run `npm run test:research` for strict research readiness: it currently fails because research is unfinished. A successful partial metadata check never means the pack is ready. NEXT.md records the exact work still required.


## Retail research qualification14:45:46 UTC

Fifteen narrowly scoped facts and21 complete prompt rows now have actual paired original source/author/context/quote/offset acceptance. Eight new whole rows passed after six retail associations were qualified14:45:46.891513 UTC. All20 unique new full captures were independently reparsed unchanged; all60 combined fact-specific full capture checks passed. Existing9 facts and alloriginal wordings/grades/seals are preserved. Q1033 remains UNVERIFIED because exact earlier Preparing/Baking tracker labels lack the required independent literal support. Other1178 rows also remain UNVERIFIED; strict research readiness must reject1179. Partial metadata and whole hosted structural success grant no full completion. FormalKEEP0/PR29Draft.

Actual source redirects are documented: the requested HEMNES product URL returned the full current IKEA product-category catalogue. Its bed-category text supports only the general bed association, never current HEMNES stock. Corporate Costco casket sales do not imply a funeral-director service/package. The independent2005 report supports a historical membership/casket association, not present prices/stock. Domino's2026 stage update and the independent2019 one-store timing account retain different exact labels and no universal accuracy claim. All short quotations are at most25 words; each canonical URL is counted across every reused fact, never reset. Shared Namu/Cel excerpts were not added.

Resume with actual full native current-head hosted packet and source index, using the new independent reader with --qualified-facts15 --qualified-rows21 --extra-captures /dev/shm/gpt-drops-B14-research-20261009/cue-captures and --require-schema-valid-semantic. Parent110/b90 evidence remains historical. Complete actual cue research for1179 remaining prompts before formalKEEP. Original public captures are private and must remain intact; no runtime source substitution is allowed.


## Next-cue original-source qualification15:18 UTC

Twenty-one narrow facts now support30 complete personally reviewed prompt rows;1170 remain UNVERIFIED. Six new facts and nine new rows were actually accepted15:18:16.906743 UTC. All22 new original complete HTTPS captures were reparsed unchanged, with84 combined fact-specific physical hash/exact quotation/offset checks. The two original legacy Netflix captures that redirected to HTTP remain preserved and unadopted; genuinely new secure canonical captures support Skip Intro instead. How-To Geek's two complete page bodies have differing unrelated recommendations after the authored articles; each entire byline/article prefix was independently checked unchanged and both original full-body hashes remain separate. Every exact excerpt is at most25words and each canonical URL's shared total remains below200, including Catherine Brookes reused for two facts. No shared Namu/Cel quotations were added.

Netflix numeric still-watching triggers, account-sharing rights, historical rollout counts, Burger King free-paper-hat/current-mascot promises, Wendy's current-platform policies, burger rankings/regional freshness, and actual announcement services remain excluded. Every imagined ghost/funeral/wedding/court/divorce/obituary setting has a specifically written classification; there is no blanket fiction exemption. Q1033's exact older Domino tracker labels remain UNVERIFIED.

OriginalReady13/source7985 is unchanged. All3000 original authored candidate words, both independent humor grades and30seals remain intact. The selected600+600 pack retainsSHA256 d826be69ce85e684e92958119b57aec637b9aea552a69646535a0c461c830c94,644 combined named-reference buckets and cap3. Original exhaustive scan/workflow/schema/selection/delivery/semantic/research gates are unchanged. SupplementalPR29 remainsDraft/formalKEEP0; structural green does not complete the binding all1200 research requirement.

Exact parent6b whole hosted evidence was independently accepted15:18:05.494916 UTC. Run37947803566/job113878513894/artifact11624744659; official121472B ZIP SHA256 aa154df055b73219e4493b1a954861d22e9a7312d44f74e2523dbb77424f6c9c; complete1096323B native logSHA256 313c2d0a7cef3d094a83fb21f3724e82036b91790183593fdbf8a4b9c444babc. All329 native inputs,327 manifest payloads,328 sizes,3 safeZIP/CRC entries,1056 exact native-bound artifact lines,12scan segments/4,498,500candidate+719,400final comparisons/57ratios/30seals/3000grades/600selector/14delivery/28full-schema semantic/12research/15facts60physical checks/21whole rows passed. This is genuine historical qualification for6b, not proof of the newly adopted21facts/30rows source. Its complete original archive, lossless original native log, source index and reader are delivered beside this handoff.
