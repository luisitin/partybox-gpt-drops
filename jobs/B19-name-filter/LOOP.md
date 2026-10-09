# B19 improvement log

## Independent reference and first performance improvement

An isolated author wrote and sealed a reference from the public contract,
original instructions and policy JSON. Its 1,000 author self-checks passed
before production was inspected. The full three-seed suite then compared every
43,830 input per seed with that sealed source: zero disagreements. Generated
obfuscation misses remain zero and all 75 executed mutants were caught.

Production now bypasses compatibility/mark/format operations for printable ASCII,
classifies ASCII letters directly, and combines forward/reversed term matching
into one scan. Policy decisions and original mandatory-repeat counts are
unchanged. The mutation that disables reversed matching now targets the term
list in the combined matcher.

The first full local run after optimization passed every behavioral gate but
failed the unchanged literal latency gate: 20, 12 and 24 observations exceeded
0.05 ms in seeds 1, 2 and 3. Median times were 0.000824, 0.000741 and 0.000792
ms; maxima were 0.379979, 0.274470 and 0.759725 ms. These failures are retained,
and hosted execution will independently measure the final source.

All original upstream bytes matched the pinned snapshot hashes, including
GeoNames, and the complete 32,000-row cache was recovered without changing the
lock. Clean local `npm ci --ignore-scripts --no-audit --no-fund` succeeded.

## Further allocation reduction and retained final measurements

Moved character-property regexes to module initialization and added a plain
ASCII-word path that matches the already-normalized text directly. Updated
mutation anchors retain the original mark/format/reversed-scan defects. The
strict type-check invocation now resolves the pinned compiler without relying
on an ambient executable path. The complete final local npm test still passes
every functional, independent-reference and mutation suite, but its unchanged
literal timing gate fails. Final measured reports and every outlier input/time
are committed under results/. No benchmark filters, extra warm-up, timer-window
change or benchmark-specific runtime bypass was introduced.

The first optimized hosted run was also inspected and failed latency only:
https://github.com/luisitin/partybox-gpt-drops/actions/runs/37637661735.
It observed two outliers over the three seeds. The PR description retains the
subsequent final-head result and the local failures remain disclosed.

## Finite Unicode policy-character compilation

Compiled declared glyphs, case variants and known ignorable formats at module
initialization, including normalized expansions, mapping and letter/number flags.
This avoids per-call NFKD/mark/format passes when every input character is
supported. Contextual lowercasing remains over the complete string; marks or
formats are removed ahead of it only when Unicode marks them Case_Ignorable.
Unknown Unicode retains the original path. The compiled table is private and
receives no per-call writes; there is no name/result cache.

All original 43,830 independent comparisons per seed and 75 mutations passed.
Another 1,296 context checks per seed passed. Source/runtime gzip sizes remain
3,946/3,114 bytes, below 6,000. The complete default npm test still failed the
literal timing gate: 37, 15 and 12 calls above 0.05 ms; maxima were 41.188051,
0.714895 and 19.354561 ms. Many failures are ordinary ASCII paths. Those are
actual wall-clock observations; their precise cause is not proven, and none
is removed or replaced by a percentile or a later favorable rerun.

## ASCII-letter guards and broader finite Unicode compilation

The original general ASCII-letter shortcut removes redundant control/content/trim
and remapping checks while retaining the exact exception and blocked/reversed
matchers. Its full original suite passed all behavioral/mutation checks but
failed 19/21/12 of the literal 10,000-call latency observations per seed; maxima
were 0.470704/0.480532/0.196494 ms. All raw receipts remain in
results/optimization-ascii-word/. The instrumented GC/optimization diagnostic
remains separate, with its actual timing and then-stale-inventory failures
disclosed in results/diagnostics-ascii-word/DIAGNOSTIC-NOTES.md.

The next substantive change compiles all 94 printable fullwidth ASCII and 64
Latin-1 code points at module initialization through the existing NFKD policy.
This avoids repeated normalization/replacement allocations for fullwidth text
and ordinary accented names. Whole-string contextual lowercasing and unknown
Unicode fallback remain unchanged. Neither inputs nor results are cached.
Every original suite/count/seed and the unchanged 100,000 warm-up calls plus
10,000 individually timed calls per seed remain intact. The sealed reference
and supplemental historical oracle are unchanged.

The complete npm test passed 131,490 original independent comparisons, 3,888
existing Unicode contexts, 4,266 newly added range contexts, all corpus-policy
checks, zero obfuscation misses and all 75 actual executed mutations. It still
failed the literal maximum: 5/11/9 outliers, maxima
0.154320/0.582158/0.227552 ms. Medians were
0.000616/0.000546/0.000541 ms. Source/runtime gzip sizes are 4,239/3,225 bytes.
Raw source-bound full reports are in results/optimization-width-latin1/.
These measurements do not prove scheduler/GC causation, erase prior failures
or establish complete acceptance. The PR remains a draft.

## October 8 resumed incomplete delivery: minimum-length pruning

Fresh original-repository ownership check found no B19 row and a20-hour-old
sole branch; claimed15:42:00UTC in a separate main clone. OriginalPR2/history
and worktree remain intact. This resumes a failed acceptance task, not a
completed/cosmetic KEEP streak.

A bounded instrumented diagnostic uses the actual hosted seed-1 three-character
ASCII witness. Of63 forward terms, only3 can consume3 mapped characters.
Eligible matcher11–15ms versus complete matcher23–29ms per500,000 calls, and
zero disagreements on all17,576 lowercase3-letter strings. Production now
compiles minimum-length-eligible forward/reversed regexes once. The normalized
expansion fallback retains the complete matcher, with no result/witness cache.
Exact pre-change source and both complete diagnostic receipts are preserved.

The genuinely changed source's unchanged complete command failed literal
latency36/8/16 times; maxima0.472961/0.246780/0.456415ms. All88suites execute,
all original behavior/differential/mutation counts pass, plus74,619 new sealed
boundary comparisons. Gzip4477/3358bytes passes. No cause for all timing
outliers is claimed, no diagnostic replaces acceptance, no failure disappears,
and PR2 remains draft. A general already-lowercase allocation change is the
next candidate, conditional on actual diagnostic evidence.

## Real hosted regression: pinned corpus replay

The first resumed head's actual hosted log exposed daily GeoNames drift, so
only61suites and11,830sealed comparisons perseed executed; failure remained
explicit. The available original selected snapshot matches every original
locked byte hash. It is now checked in with attribution and fail-closed
offline restoration. Real8-case tests passed3times, preserving all32,000rows
and demonstrating corruption/missing-file rejection without network.

Private double-regex and charCode lowercasing candidates did not demonstrate
mixed whole-call gains; neither changed production. Balanced scan results and
exact scripts remain delivered, including slower batches. Existing runtime
5371665d and its actual failed latency receipts remain untouched. This source/
packaging correction requires fresh hosted complete checks; it is not a
completed acceptance or cosmetic KEEP round. PR2 stays draft.

## Four rejected optimization hypotheses and current complete CI

The exact snapshot restores all required hosted corpus workloads. Full current
head b3f5231 CI37807137561 still fails one0.063416ms seed3call. Actual complete
log read confirms all91suites and all original43,830sealed inputs perseed,
75mutants/15,000obfuscations/24snapshot tests/156checksums pass.

Double-regex ASCII folding, single charCode ASCII folding, lazy known-string
construction and a compiled unchanged-known-string proof were tested privately.
Every candidate preserves independent semantics on its declared complete
inputs/contexts, but none demonstrated consistent mixed whole-call gains.
All raw batches/GC observations and exact scripts remain delivered, including
slower batches and one corrected-before-measurement diagnostic quoting failure.
Only the earlier measured length pruning and exact snapshot replay were
installed. Production is frozen; literal acceptance still fails and PR2
remains draft. These are unfinished verification investigations, not cosmetic
KEEP rounds or proof of a hard realtime bound.
- 2026-10-08 polish: analia, analise and sexto added as exact exceptions and failures gained a suggestion key; INTEGRATION.md written; see VERIFY.md 'Polish pass 2026-10-08'. Literal 0.05 ms gate unchanged; hosted run 37809073933 green on 2b54431.

## Isolated post-green review: original workload restored

The original B19 KEEP command requires a complete rerun after green. One
rerun of2b54431 closed16:40:40.528UTC and failed only its unchanged maximum:
31/28/11outliers. All91suites execute, every original behavioral count passes,
and every fresh receipt is retained. This round did not complete KEEP.

Another active session then pushed product693d9501:five suggestion keys and
three new exact spellings. Its positive list and expanded policy changed the
timed sample and original baseline count. History and product changes are
preserved on this isolated review branch fromccc610f; original branch/main
are untouched. Originalpositive48, fixed459 and full43830 are restored using
a hash-locked original289-exception fixture. New feature checks are separate:
90prod/blind name+bypass checks and18frozen protocol guards pass.

One full genuinely corrected-protocol check closed16:54:44.534UTC,EXIT1:
all100suites execute, only latency fails43/19/28times. All original corpora,
differentials,mutants,obfuscations,strict types,integrity and sizes pass.
Every actual log and raw report is retained. The weak points and exact next
step are logged in requirement-review.json. No causal timing explanation,
unchanged luck retry, user waiver or only-cosmetic stopping claim is made.

## October 8 measured regex-prefix improvement

The remaining literal timing weakness motivated one source-bound candidate.
A trie factors only identical repeated-letter regex tokens, preserving minima,
i/l/# ambiguity, exact exceptions, normalized substring/reversed languages and
all per-call operations. The exact candidate SHA256 is 41442670786856c1dfa98a5755bd21273287047750035f419249ab7402e8505d.

Strict TypeScript passed. Complete private result/suggestion/frozen/wrapper
agreement and both references passed all214,308 cases, including all131,490
original inputs. One naturally completed ABBA/BAAB experiment on the exact
original seeded samples measured35.7596/37.9846/29.6573% gains across12million
whole calls; all24 phases, raw GC observations, sources and commands remain
byte-for-byte archived in results/prefix-trie-diagnostic-20261008/. All six
blocks favor the candidate. Original private paths and real grant/closure/
delayed release times are retained; archived paths were not executed.

The measured candidate is adopted exactly. This is a substantive runtime
improvement, not a completed acceptance or cosmetic KEEP round. Original
policy/workloads, every timer/warmup/threshold, both reference sources, and
all previous failed receipts remain unchanged. The full changed-source
command, exact-head hosted evidence, and required post-green full rerun are
pending. PR23 stays draft; originalPR2/canonical/main are preserved.

Production strict build passed21:14:38.142896 UTC and exact compiled34b70d1c
matches the measured candidate. Three supplemental assertion controls actually
kill M15/M19/M25. The initial M25 witness Bob was shielded by existing correct
minimum-length pruning, so its helper attempt failed and remains retained.
Only that supplemental witness changed to the original benign case Bobby;
corrected controls pass at21:17:00.409 UTC. These are readiness controls, not
full75-mutant or literal acceptance proof.

## First full checks on exact measured trie: still incomplete

Hosted83db439/run37846119304 executes all100 original suites,275 delivery
hashes and75 actual mutants; only one0.051227 ms seed1 observation fails.
The genuine downloaded failed ZIP passed1457 independent byte/structural
checks at21:42:24.494174 UTC, explicitly preserving its literal failure.

One first local full command naturally CLOSED21:33:35.191788 UTC/EXIT1,
all287 guarded inputs identical. All100 suites execute; only latency fails
9/5/13 calls, maxima0.190573/0.137325/0.609950 ms. Both complete original
reports, all outliers, source maps, commands, raw logs and coordinator actual
grant/closure/release records are preserved in
results/first-trie-original-acceptance-20261008/. No native attempt was
stopped and no unchanged favorable retry was run.

The prospective next mechanism is to avoid duplicate mapping work using the
existing precompiled character data while preserving whole-string contextual
casing, exact exceptions and fallback. It is not an asserted diagnosis or
measured gain yet. Current literal acceptance and KEEP remain incomplete.

## Mandatory post-green failure and rejected mapping

Checkpoint 1255490 is normally pushed at 21:53:04.366710 UTC, late against
the prior 30-minute deadline. Its automatic full CI passes all 100 suites,
75 mutants and 352 hashes; genuine artifact audit passes 1,844 assertions.
The required post-green original full rerun naturally fails 21:58:31.844316,
all 368 guards unchanged: 9/11/4 literal outliers. Non-latency checks pass,
but KEEP remains open, all prior failures retained and no unchanged retry.

Existing-mapping reuse passes strict compile and 214,308 complete behavior
comparisons. One coordinated balanced 24-phase / 12-million-call experiment
measures +0.775136 / -26.582097 / +0.685623% gain: reject the candidate.
Every phase, GC event, source map and original .work command path remains
in results/post-green-125-and-mapping-review-20261008/. No cause is inferred.

The weakest remaining part is literal per-call acceptance. Next investigate
a zero-allocation deterministic scan compiled from the existing regex
language, preserving every original mutation anchor's actual effect. It is
prospective until full semantic and whole-call evidence establishes benefit.
No cosmetic stop or completion is claimed.

## Exact-regex deterministic scanner: measured substantive improvement

The existing regex language compiles at startup to a bounded 539-state DFA.
Substring restart, repeated minima and i/l/# ambiguity are derived from the
same pattern(), keeping all original mutant anchors effective. Original
normalization, controls, exceptions and returned values stay unchanged.
Long expansions and construction bounds retain the complete regex fallback.
The uncompact 6,258-byte source fails size; a separate comment-only compact
variant emits identical JS and fits. The initial supplementary lexical
reader fails before mutation checks; its source and actual partial receipt
remain. Only that helper changes to the actual TypeScript parser/transpiler.

Candidate ae8dc388 / compiled 330968b3 passes strict compile, 214,308 complete
semantic comparisons and all 25 original seed-1 actual mutants. One exact
balanced 24-phase/12-million-call run naturally closes 22:20:51.845 UTC,
all 480 guards unchanged, gains 53.300560/46.667906/35.853386%. All six blocks
favor it. Adopt the exact candidate, a substantive matcher improvement.
Existing warmup/samples are unchanged; startup construction is excluded from
phase gains. Only table matching is allocation-free per call, not the full
normalization function or constructor. No cause/bound is inferred.

Production strict build reproduces exact compiled 330968b3 at 22:23:38.406719;
actual M15/M19/M25 controls pass 22:24:20.187. Every source, phase, GC, command,
baseline and failure scope is retained in the original-path evidence archive.
The first changed-source original full gates and new-head CI are pending;
KEEP remains open and PR23 draft. No unchanged extra test is run to hunt luck.

## First DFA full green and actual required KEEP failure

At exact 559969f the automatic original full workflow 37853546762 succeeds,
100 suite rows / 75 actual mutants / 565 delivery hashes, literal outliers
0/0/0. The complete native log and genuine artifact 11582468572 independently
agree on every fresh row and every committed delivery byte; 2,909 assertions
pass at 22:31:05.337579 UTC. Original source ae8dc388 and compiled 330968b3
remain unchanged. No hosted runtime dist byte equality is claimed.

The first local full run begins after that genuine green, so the one actual
run also satisfies the original post-green rerun instruction. Actual grant
22:32:02.890081 UTC; START 22:32:03.925505; natural CLOSED
22:32:23.725160 / EXIT 1. All 584 guards stay unchanged. Every non-latency
suite and all 75 mutants pass; the literal gate fails 6/3/5 calls, maxima
0.202218/0.159765/0.087073 ms. All raw outcomes and original paths remain in
results/first-DFA-original-acceptance-20261008/. All owners are directly
released after natural closure, with a separately labeled later receipt time.
No original timer, threshold, sample, warmup or case is altered; no unchanged
extra acceptance run occurs. Complete acceptance and KEEP remain open.

Weakest actual part remains literal latency, with unknown cause. A bounded
independent static review finds the prospective raw-letter fold-table DFA
shortcut distinct from earlier rejected ASCII classifiers: a proven nonmatch
could return frozen OK before lower()/SAFE allocation, while matches retain
the original single exception anchor. No candidate is authored or measured at
this checkpoint; original guards, actual mutants, full Unicode semantics and
consistent balanced whole-call benefit are required before any adoption.
This is substantive unfinished work, not a cosmetic KEEP stop.

## Measured raw ASCII-letter DFA shortcut

The distinct shortcut proves an ASCII-letter miss through the unchanged DFA
before plain/lowercase/SAFE work, while hits retain the original single
exception anchor. Type/full raw-length decisions, all Unicode/fallback paths,
SCAN.empty and every original mutation effect remain exact. Strict compile,
214,308 complete cases, six real AssertionErrors and all original 25 executed
seed-1 mutants pass. All 669 semantic and 671 mutation guards stay unchanged.

One delegated balanced run naturally closes 22:52:05.726 UTC / EXIT 0,
all 24 phases / 12 million whole calls retained. All six blocks favor it:
14.269282/13.399731%, 9.246314/11.770452%, 15.094991/2.049884%; seed gains
13.840704/10.520572/8.367045%. All 669 harness + 12 external guards and
seeded sinks remain unchanged. The smaller final block remains visible.
Startup construction is excluded, original warmup/samples stay fixed;
no literal acceptance, first-call bound or outlier cause is inferred.

Independent actual-byte static acceptance closes 22:53:43 UTC. Adopt exact
7817/e4b at 22:54:58.870981; production strict build reproduces the measured
compiled bytes at 22:54:59.829508, six actual controls pass 22:55:00.854989.
All original source/compiled baselines, commands, phases, GC and guarded raw
outputs are retained in results/ascii-DFA-fold-diagnostic-20261008/.
Predecessor 39c6 full hosted green and its 3,319 byte/structure assertions are
historical after adoption; the single after-green 6/3/5 failure stays binding.
The genuine current-source full gates are pending, KEEP open and PR23 draft.
No unchanged extra acceptance test is launched to chase luck.

## First current ASCII-DFA original full failures

Hosted37856872614 fails2/0/0, independently audited3786 assertions at23:19:19.410668. Sole first-local grant23:24:15.063016/START23:24:16.514021/natural CLOSED23:24:33.285692UTC EXIT1, all760 guards unchanged, literal12/9/2. All other checks/all75 mutants pass. Full raw proof and direct releases preserved. This is not a completed KEEP round or after-green scope. Weakest part remains literal latency with unknown cause; substantive UTF16 preflight is prospective after G10 release, not a cosmetic stop.

##00:17 rejected fused classification development refinement

Original acceptance still fails. Strict/214308/25actualmutants/8controls pass; sole root-executed24phase comparison shows+16.601/-2.084/-16.205% seedgains, so40cc never enters production. Complete raw evidence and actual4551-assertion11a1 failed artifact archived; prospective fold-column sentinel follows only after the coordinated G01 window. This does not fulfill after-green KEEP.

##00:34 binding after-green KEEP rerun fails; fold-column candidate remains private

Exact6a full hosted genuineGREEN verified4981 actual-byte assertions. Required original PROMPTS311 step1 runs once after that green, naturalCLOSED00:34:44.366961UTC EXIT1: literal13/5/10, all1006 guards unchanged/all100 fresh rows/nonlatency/75mutants retained. This failed step does not complete KEEP. No unchanged second attempt or cause inference. Weakest part remains literal latency; all28 outliers retained. The earlier first-local12/9/2 predates green and is not this scope.

One distinct private fold-column algorithm reuses existing lower-derived column for classification/transition; strict214308/all25 actual original mutants/eight AssertionErrors/65536code-unit equivalence pass,1001/1003 guards stable. It is unadopted and untimed pending independent static review/fresh once-only original mixed comparison. Source/driver/policy/reference/corpora/warmup/sample/gate stay frozen. Full meaningful green/failure/candidate proofs are archived; only-cosmetic stopping point is not reached.


## Actual8d hosted validation and once-only fold-column rejection (2026-10-09T01:11:15.241079+00:00)

Immutable8d hosted run37866126547 genuine11588287156 independently passes5591 assertions,1101 actualGit hashes,100 original rows,75 actual mutants and literal0/0/0; reader naturalCLOSED00:44:58.120405. Required originalaftergreen literal13/5/10 remains failed and is not rerun.

Actual distinct fold-column paired trial naturalCLOSED01:09:38.922650/EXIT0 with24 original phases/12M calls and all1131+1154 guards equal. Aggregate+7.7875/+2.7706/+0.6678%, but only5of6 balanced blocks improve; seed3block0 regresses. No adoption/no unchanged comparison retry/no cause claim; all61GC events and allphases retained. Original faulty761a controller/READY preserved; targetedca78 reaping repair independently passed1406 assertions before root actualgrant. Historical6a semantic/mutant proofs and original timing loop remain immutable.


## Original currenta7 fullproof and rejected distinctASCII table (2026-10-09T01:39:05.094377+00:00)

Actualfulla7 hosted37868586332/job113621118296 official11588977738/14744550B independentlyPASS5851assertions/1153immutableGit files/all100rows/all75actualmutants/literal0/0/0; readernaturalCLOSED01:15:21.319446/EXIT0. Originalrequiredaftergreen13/5/10 remainsFAIL and wasnotrerun.

DistinctASCII mapping2a1/68f2 passesstrictcompile/8executedassertioncontrols/128mapping/65536classification/214308three-seed semanticcases/25realoriginalseed1mutants43830each/noexclusions. Actualonceonly24phase12M comparisonnaturallyCLOSED01:34:33.427399/EXIT0 with1175+1206guards unchanged/reapedempty; seedgains-10.5052/-1.2451/+4.7080% fail predeclared5%allthree+positiveallsixblocks. REJECTED/NOADOPTION; everyphase/GC event retained/no causeattribution. ENOENT scaffoldfailureandwrongba70-DFA paths werecaughtbefore anyelapsedlaunch; exactfailedhelper/READY bytes preserved, targetonly1e19/9494 repair independentlyPASS1241. Current1175a7 proofmap needsno documentbridge.

This is a bounded substantive optimization round without an acceptable gain. Bindingacceptance/KEEP remainunfinished; no unchangedretry, relaxedgate/clock, exclusions or claimedcompletion. Production7817/e4b/originalrunnerbff0 and alloriginalsourceworkloads stay unchanged.

2026-10-09 failure-proof milestone: actual8d57 native1/0/0+6321 full-artifact assertions preserved; failure-safe prospective CPU/GC diagnostic prepared UNEXECUTED. Production/runner unchanged; original13/5/10 unresolved; no formal passing KEEP round or gain.


## Actual instrumented diagnostic and failed reader (2026-10-09)

The once-only, newly instrumented diagnostic started 02:15:14.766577 UTC. Its child naturally exited 0; the whole controller naturally closed 02:15:16.394134 with exit 1 and DIAGNOSTIC_FAILED. All 30,000 actual call measurements, the CPU profile, nine observed GC records and the exact failed controller/READY/grant/log are preserved in results/prospective-native-diagnostic-failed-20261009/proof.zip. The post-reader raised KeyError for jobs/B19-name-filter/dist/nameFilter.js: five generated non-Git dependencies were omitted from the external frozen source map. The earlier static PASS receipts are invalid for complete transitive dependency coverage. The original failure receipt remains unchanged.

A separate offline reader proposal recovers exactly those five hashes from the preexisting 9494 frozen map and diagnostic internal before/after hashes, then runs every original source and saved-data predicate. Independent full static review passed at 02:37:44.738060 UTC. The separate saved-data reader naturally closed 02:38:03.541394 UTC with exit 0 and SAVED_TELEMETRY_VERIFIED_WITH_REPAIRED_OFFLINE_READER, checking all original predicates against 1,265 actual source identities and two runtimes. Original DIAGNOSTIC_FAILED remains unchanged. New instrumented observations exceed 0.05ms 8/11/0 times; their maxima are 0.307625/0.122048/0.028608ms. These are diagnosis-only observations under changed instrumentation conditions, never original acceptance or a historical cause. A fresh independent output readback is pending; no native launch occurred during this repair. No native rerun or retrospective authorization occurred. The 100-microsecond CPU sampler cannot resolve the original 50-microsecond acceptance threshold; CPU/GC clock alignment and historical causation are unproven. Production and the original workload/gates remain unchanged. Required after-green 13/5/10 remains failed; KEEP and acceptance are incomplete.

This bounded checkpoint preserves actual new evidence. Current-at-observation 375d344 hosted run 37873324590/job113636087727 is metadata SUCCESS; its genuine official archive/full independent acceptance is still pending. The preceding push closed 02:10:41.401064 UTC and missed its prior source deadline by 59.802609 seconds, retained in the packet. Record this publication's actual normal-push closure separately. PR23 remains Draft.


## Actual expanded correctness and full proof checkpoint (2026-10-09)

Exact a2f8c49 original full hosted run37875556064/job113643220481 is now independently accepted: genuine11591967665/16914184B/SHA6e054c9355cf0113e411bfe49641d1649e7c488f5c335d7fc890f157312546c2;6341 assertions bind all1251 immutable Git files/100 native rows/all75 actual mutants/literal0/0/0. Reader validated02:45:52.947161 and was observed naturally closed EXIT0 by02:46:21. Historical375 full6331 acceptance and fresh reports are also preserved in results/full-hosted-a2-and-offline-reader-20261009/. All current delivery checks apply to their exact named head. Required original after-green13/5/10 remains failed; this does not finish KEEP or establish a universal latency bound. The original failed diagnostic and its separately repaired offline output independently passed readback02:39:10, now publicly included.

A new untimed exhaustive correctness supplement naturally completed02:48:58.924 with EXIT1: four contexts over all1114112 Unicode codepoints,4456448 actual cases. Production and the historical NFA agree in EVERY case. The old sealed regex reference disagrees in952198 cases, all the inserted unknown character context:814730 unassigned and137468 private-use characters. Every145768769-byte failure row is preserved inside the4912614-byte verified archive results/unicode-scalar-blind-discrepancy-20261009/. Separate entire actual Node Unicode17 failure-stream classification completed02:58:48.153; the old sealed code and failed supplement remain untouched. No broad all-Unicode agreement is claimed for the older sealed reference.

A fresh independent author read only original instructions, public POLICY and data/policy.json, authored a different run-boundary matcher, and sealed it before seeing production or anyone else's cases. Its4784 own selfchecks pass; reference SHAa93b35e3170122b2fd0a77619eff36716c3b9fc2f4c47f3bfce1971778a76e71 and full provenance are preserved in results/independent-unicode-reference-unadopted-20261009/. It remains UNADOPTED pending parent hidden cases, original three-seed semantic/mutation/full performance checks. It assumes remaining unmapped nonseparator categories are barriers, preserving existing production behavior, and uses the complete Unicode Bidi_Control property. Root observed Alice+U+061C/U+200E/U+200F currently returns OK while the new reference returns control. The written public policy rejects bidi formatting controls, so rejecting the complete property is the chosen reasonable interpretation; a targeted production/historical-NFA correction and new sealed-reference integration require full actual verification before adoption. No existing frozen oracle or failed results were rewritten.

NEXT exact step: validate the sealed new reference against all original seeded cases plus expanded Unicode inputs; isolate the three currently accepted bidi marks. Then make the narrow declared-control correction, preserving all historical sealed files and outcomes, and verify all original three-seed cases and actual25 mutants each, strict/gzip/purity/frozen suggestions, full CI and once-after-green KEEP on the changed source. No unchanged lottery retry, gate/warmup/clock/sample change or production adoption occurred in this checkpoint.

## Narrow complete-bidi correction, October 9

The written bidi-control rejection is interpreted as all 12 Unicode Bidi_Control points, including U+061C/U+200E/U+200F. The old source accepted these three. An untimed source-frozen comparison naturally finished 2026-10-09T03:25:38.601Z: every original 43,830 input at seeds 1/2/3 agrees with the fresh independently sealed reference; 102 supplemental/explicit-control discrepancies are retained as FAIL. Production now adds only those three to CONTROLS; the historical NFA adds the same three and makes no independent-authorship claim. The new sealed run-boundary implementation is integrated byte-for-byte, with its pre-exposure reference/seal pinned; historical blind files remain immutable. Unassigned/private-use points remain barriers. The original random inputs, corpus, fixed cases, 25 original mutants, warmup, samples, timer and literal 0.05ms gate are unchanged. New Unicode cases and four additional executed mutations are additive and untimed; they never enter original latency or original mutation workloads. Old source required-after-green13/5/10 remains a genuine historical failure. Changed-source acceptance/KEEP restart at zero; no gain is asserted before actual full checks.

Corrected canonical private untimed functional preflight naturally closed EXIT0 observed by2026-10-09T03:32:33.806582+00:00:106 suites/zero failures, all75 original actual mutants and12 additional actual mutants killed, every original input at all three seeds and the added92,568 comparisons per seed pass. Source gzip5272B/compiled gzip5050B, both below6000. Exact executed command is node /tmp/B19-current-untimed-functional-preflight-20261009.mjs > /tmp/B19-current-untimed-functional-preflight-canonical-20261009.log 2>&1. Original latency was deliberately not executed here; this is NOT a full npm-test acceptance pass. The complete actual private source/rawlog/reports and explicit command-field qualification are retained in results/bidi-control-repair-20261009/canonical-untimed-preflight.zip. Original full benchmark remains unchanged in committed npm test; current original hosted full checks/genuine artifact and once-after-green KEEP remain pending.

Actual exhaustive untimed current-source unknown-category comparison naturally finished2026-10-09T03:32:25.558Z EXIT0: all814,730 Unicode17 Cn and137,468 Co points (952,198 total) in the original failing an+point+al context return OK in current production and the new independently sealed reference, with all seven actual source/runtime/self hashes unchanged and zero discrepancies. This replaces the old checker only for current checks, retaining every old failure and immutable old seal. It proves this complete finite category/context, not all contexts, all languages or performance. Exact command: node /tmp/B19-new-reference-unknown-category-exhaustive-20261009.mjs.

## Required corrected-source original full follow-up, October 9

Exactly one required original full after accepted89 green was predeclared and requested at03:59:00 UTC through GitHub rerun of original sole verifyjob113657351539. The native request returnedsuccess:true. Original run37880030043 ATTEMPT2/newjob113662768128 completedSUCCESS03:59:35; official11594272489 is19,236,951B/SHA0e233d22683855b82aaf03ba28a94cc03c4c60e38fe861780eef5d7d5aef734c. All original workflow/checks/gates/Node22/warmup/seeds/samples remain unchanged on exact89. This required invocation is distinct from prohibited luck retries: the three-control corrected source had its first genuinegreen independently accepted40:34, and this is its single binding follow-up. Full actual official independent after-green reader is PENDING, so KEEP/completion remain open. No local original run/grant ever executed. Four prospective local controllers/readies remain UNEXECUTED, preserving their caught failure-finalization/stdlib and active startup-module coverage defects. Original old-source13/5/10 remains historical and immutable. Dedicated original GitHub execution avoids pausing unrelated local projects. First green6497/full109/current1278 Git proof and all unexecuted local review inputs/failreceipts are preserved in results/required-after-green-hosted-89-20261009/.

NEXT: receive the exact new19MB official bytes, verify fullSHA/CRC/all1278 immutableGit/109 fresh native rows/75original+12additional mutants/all original literal observations and exact attempt2, preserve every actual outcome; then reread the job and rank/fix supported remaining weaknesses. Do not markReady or claimKEEPfinished from metadata alone.
