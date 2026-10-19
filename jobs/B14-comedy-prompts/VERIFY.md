# Measured verification

The full release validator passed for all 3,000 original candidates and the
final 600 fill + 600 most-likely prompts. The complete verbatim validator output
is in `results/release.json`; exhaustive scan evidence is in
`results/pool-similarity.json`. Previous draft measurements and known failures
remain in `verification-history/` and the original grading records.

| Check | Cases | Passed | Seed | Exact command |
| --- | ---: | ---: | --- | --- |
| Original JSON Schema, IDs, genre, 90-character limit | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Actual independent grade/reason coverage and input hashes | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Sealed original authored batch integrity | 30 | 30 | not applicable | `python3 scripts/verify.py` |
| Complete original-pool pair comparisons, two text forms and both directions | 4498500 | 4498500 | not applicable | `python3 scripts/scan_pool.py` |
| Final JSON Schema, unchanged graded text, grades 4+ in both passes | 1200 | 1200 | not applicable | `python3 scripts/verify.py` |
| Independent final-pack pair comparisons and flag resolutions | 719400 | 719400 | not applicable | `python3 scripts/verify.py` |
| Final adult-only, no-slur and literal named-reference editorial audit | 1200 | 1200 | not applicable | `python3 scripts/verify.py` |
| All original candidates' editorial confidence records | 3000 | 3000 | not applicable | `python3 scripts/verify.py` |
| Combined canonical reference buckets, cap three | 630 | 630 | not applicable | `python3 scripts/verify.py` |
| Delivered-file size limit | 164 | 164 | not applicable | `python3 scripts/checksums.py` |
| Delivered-file SHA256 integrity | 163 | 163 | not applicable | `sha256sum -c SHA256SUMS.txt` |

Independent grade coverage does not mean all candidate jokes passed the humor
rubric: 1,978 qualified at grade 4+ in both passes. Only unchanged qualifying
rows were eligible for selection. Exact-grade agreement was 1,343/3,000
(44.76666667%); keep-threshold agreement was 2,217/3,000 (73.9%). Every rejected
grade and reason remains visible. All first-author grades were sealed before
grade-free handoff to the named independent reviewers.

The final editor read all 1,200 initially selected rows plus the replacement
rows, checked actual name spans, and excluded child mascots, unsupported tags
and repeated premises. `editorial-review.json` logs checks and confidence per
selected row; `named-reference-audit.json` records canonical aggregation. The
final pack contains no selected child-mascot scene. Rejected original child
mascots remain preserved and explicitly excluded rather than silently deleted.

The original-pool scan flagged 57 pairs above 0.75 similarity and retained all
55 earlier one-direction flags. Both full wording and wording after removing
the shared most-likely prefix are compared in both argument directions using
`difflib.SequenceMatcher(..., autojunk=False)`. The symmetric `quick_ratio`
upper bound skips an exact ratio only when neither direction can exceed 0.75;
it does not sample or reduce pair coverage. Fixed right-hand string indexes
are cached; no pair result is assumed. All 12 disjoint left-index segments and
their exact counts are recorded. The complete scan took 695.593576 seconds on
this local machine. All four flags in the final pack have individual distinct-
mechanism explanations. Removed candidates and earlier curation iterations
are retained; no selected joke or its independent grade was rewritten.

These are original fictional prompts with zero nonfiction fact claims, so
factual-source pairs and source reopenings are not invented. `SOURCES.md`
documents that scope. Editorial confidence is high for two grades of 5,
medium for two grades of at least 4, and low for rejected candidates below 4.

Full packaging rerun: `npm test` runs the complete exhaustive pool scan again,
all release checks, and every manifest hash. `SHA256SUMS.txt` covers all
delivered job files except itself; its generation checks every file against
the 30,000,000-byte size limit. Hosted CI uses one read-only Ubuntu job with
a 30-minute timeout and pinned major-version `actions/*` steps. The exact
GitHub workflow run is linked in the PR after it completes.

## UNVERIFIED

- Humor and confidence are editorial judgments, not an audience playtest.
- Textual similarity cannot prove absence of every conceivable semantic
  resemblance. Individually flagged pairs and actual final curation are
  provided for maintainer review.
- The exact-head hosted CI conclusion and run link are recorded in the PR;
  local validation alone does not establish a hosted result.
- This delivery remains unmerged and requires the repository maintainer's review.

## 2026-10-09 follow-up evidence and remaining gates

Original whole receipt: reports/audit-20261009/original-7985/ORIGINAL-7985-FULL-ACCEPTANCE.json. Artifact5385B SHA256ba8f481a977e3ab0f46542f35301f194e3f3e966e74e95bc2c2b77214646b3f6; complete native38937B SHA25687005174996cef36e16c1288dde5be99acff3e481c80d826714649e4d5276b79. Exact original run37675775829/job112978767591/artifact11506704793. Original size compliance was independently observed, but its CI did not run the size/coverage checker; do not inherit that missing check as a passing workflow gate.

New command python3 scripts/test_delivery.py:10negative+2positive immutable actual CLI cases including both oversized false-greens; no seeds/randomness. npm test now includes python3 scripts/checksums.py --check as a read-only size/coverage/hash gate. No source text or grade is regenerated.

UNVERIFIED: current hosted whole suite; revised both-genre curation; semantic Folgers repetition; real cultural cues in all1200 rows. Original zero-nonfiction-facts exemption does not verify existing real associations. The current candidate inventory promotes zero facts. Two complete initial ten-source transport passes had18useful full responses and2LA Times403 failures; author independence, quotes, per-fact confidence, conflicts and all-row research qualification remain pending. No audience testing or new formal KEEP completion is claimed.


## Actual research checkpoint qualification
Exact70f51 whole hosted packet/run37932915642 accepted13:11:31UTC:217native blobs,215manifestpayloads,216observedsizes,3ZIP CRC,4,498,500+719,400pairs,30seals/3000grades,600independentselectorcontrols,14deliverycontrols. Current added research metadata:9 scoped associations, schema validated;10 genuine CLI controls (9negative/1positive) verify incomplete coverage, independentauthors, missingsecondpass, quote bounds, stalewording and falsefullrow promotions. Commands npm run test:research:partial; npm run test:research is a deliberately failing strict readiness command: all1200 current whole rows UNVERIFIED. Partial metadata green confers no Ready/KEEP credit. See full actual outputs in reports/audit-20261009/research-checkpoint. Separate local22-row semantic adoption/fullcontroller is not adopted or qualified by this source.


## Current actual semantic and research checks
Full frozen230-input controller closed13:20:17.927240UTC: all4,498,500pool+719,400final pairs passed,12coverage intervals/57flags/4resolved/55historical/30seals/3000independentgrades intact;644combinedreferencebuckets/max3. Command python3 scripts/scan_pool.py then python3 scripts/verify.py, rawcompleteoutputs/immutablehashreceipt insemantic-recovery. Actual28semantic controls:27negative1positive same1200/600pergenre, all27exact maximumratios<=.75inbothforms/directions. Command npm run test:semantic; fixtureinputs unchanged/temporaryfixturesremoved/allchildrennatural. Currentresearchschema/metadata validator:9facts/1200rows/13qualified/1187UNVERIFIED/ready:false; strict npm run test:research fails on1187.12actual CLI controls(11negative1positive), including missing row-specific secondpass and altered capture binding; command npm run test:research:partial. Every13qualifiedrow recordsactualfulltext,cue/creative classification,exactfactIDs,independentauthors,and captured first/secondopening hashes andtimestamps inresearch-second-pass.json. This is noall1200researchorReady/KEEPclaim. Whole exact new hosted proof still pending.


## Genuine2f evidence and semantic-fixture correction

At13:56:29.513559UTC the complete official2f artifact, native CI,270 source hashes and all original gates were independently accepted; see semantic-checkpoint/current-2f/WHOLE-CHECKPOINT-ACCEPTANCE.json. The separate260 whole receipt preserves its zero entire researched rows. Original reader failure is retained. The materially stronger28 semantic controls actually passed13:52:33.769516UTC, with all1200 fixture records schema/grade/confidence/cap valid. Later exact-source hosted evidence remains pending. Strict cultural research still rejects1187unfinished rows; no formal KEEP credit.


## 2026-10-09 retail research handoff

Twelve candidate sources were genuinely opened twice (24 requests,20 useful full HTTP200 bodies). Domino's Australian source failed404 both times and its UK source failed403 both times; failure bodies and every full successful native capture remain privately preserved. Actual last transport closure14:11:30.111445 UTC; controller later naturally closed0. The new source candidates concern IKEA assembly/Allen keys, Costco receipt checking/casket sales, and Domino's tracking. Full HTTP200 is transport success only; authorship, literal fact scope, quote offsets, independence and entire prompt classification still require acceptance. No new fact or prompt row is promoted.

The newer2026 Domino's corporate release describes revised tracker stages; the2019 MEL firsthand stakeout describes earlier behavior. Do not present older Preparing/Baking labels or one timing experiment as a present universal guarantee. Costco's funeral FAQ distinguishes casket sales from funeral-director services; an imagined funeral package is fiction. IKEA assembly evidence does not mean IKEA sells coffins. Third-party syndicated corporate releases and a MEL repost are not independent authors. Shared Namu/Cel quotes were not used or reset.

The exact parent b90 hosted packet was independently accepted14:29:00.794698 UTC. All291 native source blobs,289 manifest payloads,290 sizes,3 full safeZIP entries/CRC,1018 complete artifact line counts,all12 original scan segments/57 recomputed ratios/30 seals/3000 independent grades/600 selector/14 delivery/28 strengthened full-schema-grade-confidence-cap semantic/12 research controls passed. Research stays9 facts/13 whole rows/1187 UNVERIFIED, Readyfalse, formalKEEP0. Complete originalZIP, gzip of the complete unaltered nativeUTF8 bytes, native source index, reader and actual receipt are preserved beside this note.

The local exec transport disconnected14:17 and recovered14:20; no missing-process result was treated as completed work. Early checkpoint target14:27:51 missed; hard14:32:51 still applies to this publication. Native reader and retail controller naturally closed; full captures are private and no publisher body is republished.

The next exact source remains pending its own hosted whole packet; parent acceptance is historical only.


## Retail research qualification14:45:46 UTC

Fifteen narrowly scoped facts and21 complete prompt rows now have actual paired original source/author/context/quote/offset acceptance. Eight new whole rows passed after six retail associations were qualified14:45:46.891513 UTC. All20 unique new full captures were independently reparsed unchanged; all60 combined fact-specific full capture checks passed. Existing9 facts and alloriginal wordings/grades/seals are preserved. Q1033 remains UNVERIFIED because exact earlier Preparing/Baking tracker labels lack the required independent literal support. Other1178 rows also remain UNVERIFIED; strict research readiness must reject1179. Partial metadata and whole hosted structural success grant no full completion. FormalKEEP0/PR29Draft.

Actual source redirects are documented: the requested HEMNES product URL returned the full current IKEA product-category catalogue. Its bed-category text supports only the general bed association, never current HEMNES stock. Corporate Costco casket sales do not imply a funeral-director service/package. The independent2005 report supports a historical membership/casket association, not present prices/stock. Domino's2026 stage update and the independent2019 one-store timing account retain different exact labels and no universal accuracy claim. All short quotations are at most25 words; each canonical URL is counted across every reused fact, never reset. Shared Namu/Cel excerpts were not added.

Resume with actual full native current-head hosted packet and source index, using the new independent reader with --qualified-facts15 --qualified-rows21 --extra-captures /dev/shm/gpt-drops-B14-research-20261009/cue-captures and --require-schema-valid-semantic. Parent110/b90 evidence remains historical. Complete actual cue research for1179 remaining prompts before formalKEEP. Original public captures are private and must remain intact; no runtime source substitution is allowed.


The genuine changed-input twelve-case research controller closed at2026-10-09T14:49:04.498867+00:00 with11 negative and1 positive case; every owned child closed naturally, every temporary fixture was removed and every input remained unchanged. Its first run failed because the historical negative fixture flipped the first row to VERIFIED, but the newly qualified M0001 was already VERIFIED. That status assignment was a no-op. The corrected actual control takes a genuine verified row and explicitly makes its cue-review flag incomplete; the unchanged production predicate rejects it for 'limited facts cannot qualify an entire row'. All twelve original cases remain, the first complete failure stdout/stderr are preserved, and no first-run pass was credited.

Exact historical parent110 independently passed14:49:35.533778 UTC, run37944830825/job113868296578/artifact11624646440. All303 native files,301 manifest payloads,302 sizes,3 complete safeZIP entries/CRC,1030 full artifact line counts bound to the native log, original comparison counts/12 segments/57 recomputed ratios/30 seals/3000 original grades/600 selector/14 delivery/28 full-schema semantic/12 historical research cases passed. Its9 facts/13 entire rows are parent qualification, not evidence for later adopted15 facts/21 rows. Complete packet/reader/source index are retained beside this handoff. Source publication still needs its own hosted whole acceptance.


## Next-cue original-source qualification15:18 UTC

Twenty-one narrow facts now support30 complete personally reviewed prompt rows;1170 remain UNVERIFIED. Six new facts and nine new rows were actually accepted15:18:16.906743 UTC. All22 new original complete HTTPS captures were reparsed unchanged, with84 combined fact-specific physical hash/exact quotation/offset checks. The two original legacy Netflix captures that redirected to HTTP remain preserved and unadopted; genuinely new secure canonical captures support Skip Intro instead. How-To Geek's two complete page bodies have differing unrelated recommendations after the authored articles; each entire byline/article prefix was independently checked unchanged and both original full-body hashes remain separate. Every exact excerpt is at most25words and each canonical URL's shared total remains below200, including Catherine Brookes reused for two facts. No shared Namu/Cel quotations were added.

Netflix numeric still-watching triggers, account-sharing rights, historical rollout counts, Burger King free-paper-hat/current-mascot promises, Wendy's current-platform policies, burger rankings/regional freshness, and actual announcement services remain excluded. Every imagined ghost/funeral/wedding/court/divorce/obituary setting has a specifically written classification; there is no blanket fiction exemption. Q1033's exact older Domino tracker labels remain UNVERIFIED.

OriginalReady13/source7985 is unchanged. All3000 original authored candidate words, both independent humor grades and30seals remain intact. The selected600+600 pack retainsSHA256 d826be69ce85e684e92958119b57aec637b9aea552a69646535a0c461c830c94,644 combined named-reference buckets and cap3. Original exhaustive scan/workflow/schema/selection/delivery/semantic/research gates are unchanged. SupplementalPR29 remainsDraft/formalKEEP0; structural green does not complete the binding all1200 research requirement.

Exact parent6b whole hosted evidence was independently accepted15:18:05.494916 UTC. Run37947803566/job113878513894/artifact11624744659; official121472B ZIP SHA256 aa154df055b73219e4493b1a954861d22e9a7312d44f74e2523dbb77424f6c9c; complete1096323B native logSHA256 313c2d0a7cef3d094a83fb21f3724e82036b91790183593fdbf8a4b9c444babc. All329 native inputs,327 manifest payloads,328 sizes,3 safeZIP/CRC entries,1056 exact native-bound artifact lines,12scan segments/4,498,500candidate+719,400final comparisons/57ratios/30seals/3000grades/600selector/14delivery/28full-schema semantic/12research/15facts60physical checks/21whole rows passed. This is genuine historical qualification for6b, not proof of the newly adopted21facts/30rows source. Its complete original archive, lossless original native log, source index and reader are delivered beside this handoff.


The unchanged original twelve-case research CLI controller genuinely passed on the new21fact/30row inputs at2026-10-09T15:21:43.588881+00:00:11negative and1positive controls, all owned children naturally closed, all fixtures removed, all inputs unchanged. Strict research still rejects1170 unverified rows. Historical incomplete-fixture/no-op failure remains preserved.


## UNVERIFIED product-source author candidate2026-10-09

Current adopted qualification remains21 facts and30 complete whole rows;1170 selected prompts remain UNVERIFIED. This is a material original-source discovery/authoring checkpoint with28 new genuine complete secure source opens and an immutable author proposal dated2026-10-09T16:12:09.355415Z. The UNADOPTED candidate contains29 total narrow facts,42 classified whole rows and1158 unresolved rows. Candidate quantities are not current pack qualification; a separate independent peer is still required.

The author independently reparsed26 proposed full original bodies from13 used sources, read both whole article/site contexts, checked116 combined fact-specific raw/text hashes and exact literal excerpt offsets, and preserved actual authors, dates, affiliate disclosures and the UGG publicist exchange. Both fresh full visible bodies for every used source are identical. All28 capture threads closed naturally; no earlier source body was overwritten. Actual metadata-only candidate checks passed partial integrity and correctly rejected strict readiness for1158 unknown rows; production inputs stayed untouched and the private fixture and children closed naturally.

The proposed Tide/FEBREZE/Old Spice/Crocs/UGG/Duracell facts are confined to specifically stated product associations. Current labels, medical advice, comparative performance, actual fictional product names, fingerprint-removal efficacy, funeral/estate incidents and communication with the deceased are excluded. Every proposed whole row has its own exact text/hash and authored cue/creative classification; no blanket fiction exemption qualifies rows.

EauMG's actual displayed author is Ajent Orange. The old Victoria declaration remains in the unchanged unadopted historical transport and is expressly rejected. The separate Men's Health Old Spice article is excluded because actual article metadata says sponsored:true. Familiprix's displayed Vie de Parents author/commercial provenance is not qualified. Original UGG HTTP406 and CinemaSound HTTP403 failures remain preserved and unadopted. Current M0042 Tide stain-guide possession, Q0673 Clean Linen scent, M0088 Duracell customer support and Q1033 older Domino tracker labels remain UNKNOWN.

All original3000 candidate words, two humor grades and30 seals, selected600+600 words/confidence,644 canonical named-reference buckets/cap3, schemas, workflows and full4,498,500+719,400 comparison gates are unchanged. Original Ready PR13/source7985 is preserved; supplemental PR29 stays Draft/formalKEEP0. Exact current research qualification files and conflict register are byte-for-byte unchanged. No Namu/Cel excerpt budget was used or reset. Every new canonical URL's combined unique excerpts total at most23 words, each excerpt at most25; the unchanged global ledger counts reused URLs across all facts under200.

The earlier15:48:27 early target and15:53:27 hard target from the actual15:23:27 publication were missed. PREVIOUS-EPOCH-MISSED.json records the actual observation; no target reset, backdated publication or invented gain is inferred. GitHub's native commit/readback supplies the actual next publication time.

Exact current77 whole hosted acceptance genuinely completed2026-10-09T15:40:06.418908Z. Run37951384335/job113890753838/artifact11626677165; official124866B ZIP SHA256 f4a193584bbba3ce683b9369bbf7018ac4761d59a2897b322dc4650e48881a74; complete1101358B native log SHA256 cca54ddfafe46e8e6ee19b54e9d62101f5e3486988ed3e1cbef1820f2a318fec. All356 native source inputs,354 manifest payloads,355 delivery sizes,3 ZIP/CRC entries,1083 complete native-bound artifact lines,12 scan segments,57 ratios,30 seals,3000 grades,600 selector controls,14 delivery controls,28 full-schema semantic controls,12 research controls,21 facts/84 physical checks and30 whole rows passed. The entire original ZIP, lossless native log, exact source index, acceptance and independent reader are delivered here unchanged. This proves current77's stated partial scope; it grants no newer whole-source acceptance or full-pack readiness.
