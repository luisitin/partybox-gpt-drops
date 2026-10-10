# B13 authoring and review contract

The target is 1,000 real multiple-choice questions for US adult party players.
No placeholder, guessed citation, synthetic filler or assumed review pass counts.

## Category ownership and fixed IDs

| File / category slug | IDs | Target |
|---|---|---:|
| us-geography | B13-0001–B13-0100 | 100 |
| world-geography | B13-0101–B13-0200 | 100 |
| science-space | B13-0201–B13-0300 | 100 |
| animals-nature | B13-0301–B13-0400 | 100 |
| us-history-civics | B13-0401–B13-0500 | 100 |
| world-history | B13-0501–B13-0600 | 100 |
| movies-tv | B13-0601–B13-0700 | 100 |
| music | B13-0701–B13-0800 | 100 |
| sports-games | B13-0801–B13-0900 | 100 |
| food-everyday-life | B13-0901–B13-1000 | 100 |

Each category is `categories/<slug>.json`, a JSON array. Lead owns integration,
scripts, schema and commits. Workers edit only their explicitly assigned category,
its evidence files and its research notes. Do not overwrite another worker.

## Row fields

- `id`, `category`, `question`, `difficulty` (1 easy, 2 medium, 3 hard).
- `options`: exactly four distinct, plausible, same-type strings.
- `correctAnswer`: exact correct option string; `correctIndex`: its zero-based index.
- `funFact`: one interesting, one-line contextual fact, grounded in both sources.
- `confidence`: high/medium/low, plus `confidenceReason` specific to this row.
- `sources`: exactly two `{sourceId,url,publisher,quote,funFactQuote?}` records.
  `quote` supports the answer; optional `funFactQuote` independently supports
  additional contextual facts when the answer quote does not cover them. Each is
  actual contiguous source text, at most 25 whitespace-delimited words; formatting
  whitespace may be normalized. No paraphrase, stitched fragments or invented quote.
  An optional `extraQuote` is allowed when an added answer-scope clause needs a
  third distinct brief excerpt from that source. It follows exactly the same
  contiguous≤25-word author-body, actual second-pass body and independent
  per-row claim-support review checks; it never relaxes two-source support.
- `claims`: an array of `{kind,text,sourceIds}`. Kind is `answer` or `funFact`;
  every distinct factual claim in wording/answer/fun fact is represented and cites
  both source IDs. Every fact has its own <=25-word supporting quote from each
  source when needed. Quotes must actually support claims, not merely name a topic.

Per category, difficulty counts are 34/33/33, and each correct index occurs 25
times. These are editorial targets, not permission to invent or pad questions.
Difficulty is a reasoned judgment about the US audience; do not equate obscurity
with ambiguity. Wrong answers must remain unambiguously wrong under the exact scope.

## Sources and independence

Use authoritative institutional primary pages plus independently authored editorial
references where possible. Different URLs from the same publisher, mirrors,
syndication, identical copies, and quoted republication are not independent.
Record editorial owner and why the pair is independently authored in the source
ledger. Government agencies or departments with common underlying content do not
become independent by changing the hostname. Actual dates and measurements need
consistent definitions and rounding. Avoid volatile answers; if needed, explicitly
date the question `as of 2025` and cite evidence for that historical cutoff.

Source IDs are `<category>-sNNNN`; IDs may be reused when the same page actually
supports multiple facts. Do not use a page merely because its headline looks right.
Open and read the body and context. Check quoted text against the captured body.
Full copyrighted source captures stay in ignored `.work/`; delivery contains
brief evidence quotes, content hashes, retrieval receipts, URLs and attribution.
Respect licensing and avoid accumulating excessive quotations from one copyrighted
page. Public-domain and properly attributed openly licensed sources can support
larger fact collections; never use a licensing claim without evidence.

## Worker deliverables

- `categories/<slug>.json` with real authored rows only (100 when complete).
- `evidence/<slug>-sources.json`: source records with `sourceId,url,title,publisher,
  editorialOwner,quality,independenceNotes,licenseNotes,retrievals`.
- Each retrieval records `pass` (author/reopen), actual UTC `retrievedAt`, `method`,
  `requestedUrl`, `resolvedUrl` if known, `status` if actually returned, `contentSha256`,
  and local capture path. Never invent a successful HTTP status for an Exa result.
- `evidence/<slug>-authoring.json`: per-row evidence reads and confidence reasons,
  source capture hashes, exact quote matches, and unresolved problems.
- `research/<slug>-notes.md`: actually attempted sources, exclusions and conflicts.

## Mandatory fresh review and second reopening

Another reviewer, who did not author the rows, tries to disprove every row. Record
the actual attempted counterexample, scope/date ambiguity checks, distractor checks,
fun-fact support and concrete result per ID. No blanket or default accepted status.
Reopen BOTH sources for every row in a second full pass; a repeated page may be
opened once in that pass and its new receipt associated with every applicable row.
Review logs identify the row version/content hash so changes require a fresh review.
Store disagreements in `CONFLICTS.md`; revise or exclude unresolved rows.

## Full-set gates

Validate JSON Schema; exactly ten categories of 100; balanced difficulty; answer
positions 25%±2% (planned exactly 25%); no repeated option within a row; all facts
have two independent supporting source quotes and row-specific confidence;
all 1,000 adversarial and source-reopen reviews completed. Normalize question
text and flag similarity >0.8, retain every flagged pair and its actual editorial
resolution. Report option length per answer position, correct versus incorrect
length, and how often the correct answer is uniquely longest. Fix systematic clues.
Nothing is complete merely because structural validation passes.
