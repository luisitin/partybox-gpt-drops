# B13 1,000 verified trivia questions → PartyBox integration guide

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | **Port with fixes**: content only. 51 rows are excluded for PartyBox and the must-fixes below apply before the merge. |
| Branch | `job/B13-trivia-1000` @ see `git log -1` after the polish commit · PR #22 (open, not draft, unmerged) · CI: `acceptance` success on 60293314 (checked 2026-10-08). |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B13-trivia-1000 && python3 -m pip install -r requirements.txt && mkdir -p .work && python3 scripts/check-data.py --output .work/checks.json` (about 30 s), plus `python3 scripts/to-partybox.py --self-test`. |
| Lands in PartyBox | `games/lightning-round/content/questions.json` (merge 949 items), `content/questions.es.json` (`dropped` list), `content/content-pack-origins.json` (949 origin rows), `content/SOURCES.md`. **No new game.** |

## What it is

1,000 four-option trivia questions for US adult players: 10 categories × 100, difficulty 1–3 at 34/33/33, and exactly 25 correct answers per position in each category. Each row has two source quotations and a review trail. The hosted acceptance passes: 1000/1000 adversarial accepts, 1000/1000 source-reopen reviews, 2210/2210 similarity flags resolved.

Strength: the facts are source-backed, and the PartyBox fit is clean. Every row fits the PartyBox limits (longest question 113 of 160 characters, longest choice 52 of 60, longest source label 107 of 200), and PartyBox's own zod schema accepts all 949 kept rows (`partybox/validate-with-partybox.ts`).

Weakness: English only; PartyBox has no fun-fact field; about half the rows get a default subcategory; 27 kept rows contain roman numerals that PartyBox's speech reader spells letter by letter. Sections 7 and 8 below cover these.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `categories/*.json` (10 files) | Held rows, the source of truth. | Not copied. The adapter reads them. Do not edit: each row's hash is bound to its review. |
| `scripts/to-partybox.py` | Adapter: rule mapping, exclusions, origin rows, a mirror of PartyBox's limits. | Run at port time. Not copied into PartyBox. |
| `partybox/exclusions.json` | The 51 excluded ids with reasons, plus 5 flagged rows. | Read by the adapter. This is the port decision record. |
| `partybox/validate-with-partybox.ts` | Runs PartyBox's `questionsPackSchema` and `toSpeakable` on a pack file. | Run from the PartyBox checkout. Not copied. |
| `partybox/overlap-candidates.json` | 481 same-answer pairs with shared subject words, not excluded. | Reviewer input. Not copied. |
| `partybox/fit-summary.json` | Port counts: kept, excluded, categories, difficulty, positions, rule hits. | Reference only. |

Generated at port time by `python3 scripts/to-partybox.py --out <dir>`:

| Generated file | Goes to |
| --- | --- |
| `questions.json` (949 items, shape `{"items": [...]}`) | **Merge** into `games/lightning-round/content/questions.json`. Append the B13 items after the existing 5,567. Never replace the file. |
| `content-pack-origins.added.json` (949 rows) | Append to `games/lightning-round/content/content-pack-origins.json`. The duplicate checker (`scripts/check-content-pack-duplicates.ts`) reads "added" entries from it. |
| `es-dropped.json` (949 ids) | Add every id to `dropped` in `content/questions.es.json`, or translate (gap 2). |
| `sources.json` | Full URLs and quotes. Copy the publisher and URL lines into `content/SOURCES.md`. Quotes stay out by default (see Licence). |
| `funfacts.json` | Sidecar for a reveal screen. Blocked until the schema gap is decided (gap 3). |
| `fit-report.json` | Per-row evidence. Paste the summary into the port's PR; do not commit it to PartyBox. |

## Leave these (evidence, tooling, reports)

`evidence/`, `reviews/`, `research/`, `reports/`, `SOURCES.md`, `CONFLICTS.md`, `VERIFY.md`, `LOOP.md`, `NEXT.md`, `ASSUMPTIONS.md`, `CONTRACT.md`, `SHA256SUMS.txt`, `.github/workflows/B13.yml`. They prove the held rows and do not need to travel with the port.

## Field mapping (B13 row → PartyBox item)

| B13 field | PartyBox field | Rule |
| --- | --- | --- |
| `id` `B13-0001` | `id` `tri-0001` | `tri-` plus the last four digits. The prefix is not used by any of the 5,567 bank ids (checked by `--refresh`). |
| `category` (10 slugs) | `category` (14 fixed) | Per row, the first matching keyword rule wins, else the default. us-geography, world-geography → `geography`; science-space → `stem`; animals-nature → `nature`; us-history-civics, world-history → `history`; movies-tv, music → `entertainment` (classical music → `arts-and-literature`); sports-games → `sports` (chess, Monopoly, cards → `board-and-card-games`); food-everyday-life → `food-and-drink` (travel, brands, money, holidays, units → `everyday-life`). |
| `category` + question text | `subcategory` | Keyword rules, then a per-category default. 510 rows by rule, 490 by default. |
| `question` | `question` | Unchanged. Longest is 113 characters; the limit is 160. |
| `options` (4) | `choices` | Same order. |
| `correctIndex` | `answerIndex` | Same value. In the kept rows the positions are 242 / 238 / 233 / 236. |
| `difficulty` 1 / 2 / 3 | `difficulty` easy / medium / hard | 1 → easy, 2 → medium, 3 → hard. Kept: 310 / 314 / 325. |
| `correctAnswer` | (implicit) | Equals `choices[answerIndex]`. |
| `sources[0..1].publisher` | `source` | Unique publishers joined with `; `. Longest is 107 characters; the limit is 200. |
| `sources[].url`, `quote`, `funFactQuote`, `extraQuote` | `sources.json` → `content/SOURCES.md` | Not part of the PartyBox item. |
| `funFact` | none | PartyBox has no such field. Sidecar `funfacts.json`. |
| `confidence`, `confidenceReason`, `claims`, `sourceId` | none | Evidence only. |
| Spanish | `questions.es.json` | None exists. Put every id in `dropped`, or translate. |

Checks: `python3 scripts/to-partybox.py --self-test` (mapping cases, id mapping, distinct choices, normalisation), then `PB_REPO=<partybox checkout> <partybox checkout>/node_modules/.bin/tsx partybox/validate-with-partybox.ts <out>/questions.json`.

## Exclusions (what the port drops, and why)

51 of 1,000 rows, all listed in `partybox/exclusions.json`. The rows stay in `categories/` unchanged.

- **5 answer-in-question leaks.** B13-0137 (the stem names Sydney, the answer), 0158 (the falls are named after the river that is the answer), 0337 ("in one breeding cycle" gives away "One"), 0514 (the stem names "Qin Shi Huang"), 0911 ("milk chocolate" gives away "Milk").
- **32 same-fact duplicates** of bank items with the same correct answer and normalized question similarity ≥ 0.8. Examples: B13-0597 vs `art-001` ("Who painted the Mona Lisa?"), B13-0770 vs `art-0330` ("In which city was Mozart born?"), B13-0282 vs `sci-0201` ("Which planet is closest to the Sun?"), B13-0220 vs `sci-0105` ("What is the chemical symbol for calcium?", an exact match).
- **14 state-capital duplicates.** Same state, same capital, bank item also asks the capital. Example: B13-0005 vs `geo-0090` (California, Sacramento).

Re-add a row only after a rewrite and a fresh review, never by editing the bank.

## Port steps

1. In the PartyBox checkout, branch from `main`. Work there, not in this repo.
2. In the job folder: `python3 scripts/to-partybox.py --out /tmp/b13-port`. Confirm 949 items and zero schema errors in `fit-summary.json`.
3. Validate: `PB_REPO=<partybox> <partybox>/node_modules/.bin/tsx partybox/validate-with-partybox.ts /tmp/b13-port/questions.json` (must print `PartyBox schema: ok, 949 items`).
4. Merge: append the 949 items to `games/lightning-round/content/questions.json`, keeping the existing items first. `questionsPackSchema` rejects duplicate ids.
5. Append `content-pack-origins.added.json` to `content/content-pack-origins.json`, then run `pnpm exec tsx scripts/check-content-pack-duplicates.ts`.
6. Add every `es-dropped.json` id to `dropped` in `content/questions.es.json`. Otherwise `content-es.test.ts` fails (every English id must be present or dropped).
7. Decide gaps 3 and 4 before the merge. They change the client and speech, not only data.
8. Add the publisher and URL lines to `content/SOURCES.md`.
9. Run the verify commands below. Then update `games/lightning-round/README.md` (≤120 lines) with the new question count and the `CHANGELOG.md` Unreleased line. Add an ADR in `docs/DECISIONS.md` if the schema gains `funFact`.

## Make it feel right in PartyBox (content, not visuals)

This job has no visual assets. On the TV the question card shows up to 113 characters, the four choices and the timer, and the reveal shows the correct choice. On the phone the same four choices appear on the existing answer buttons.

Checked here: the six longest rows rendered at 390 px in headless Chromium, with no horizontal overflow and the tallest card at 420 px in an 844 px screen. This is a plain HTML mock, not the PartyBox client, so re-check in the real lightning-round client after the merge. The reveal beat wants the fun fact (gap 3) and the roman numerals must be read correctly (gap 4).

## Known gaps and risks

**Must fix or decide before the merge**

1. **Subcategories are keyword-derived.** 490 of 1,000 rows fall to a per-category default, so topic filters may look wrong. The reviewer must check the topic checklist. Topic-only games need `MIN_PER_SUBCATEGORY` = 30 per topic.
2. **No Spanish.** Either list all 949 ids under `dropped` (English only; Spanish players never see these rows) or translate them. Translation is a separate job of about 950 rows.
3. **No fun-fact field.** Adding `funFact` to `questionFields` needs an ADR and a reveal-screen change in `games/lightning-round/client`. Until then the facts stay in `funfacts.json`.
4. **Roman numerals are read letter by letter.** PartyBox's `toSpeakable` spells runs of two to five capitals, so "Louis XVI" is read as "X V I", "World War II" as "I I", and "Title VII" as "Title V I I". The kept set has 27 rows with 39 strings. Fix either with per-item entries in the game's `content/pronunciations.json` (`parsePronunciations`) or with an SDK rule, which needs an ADR. Measured by `validate-with-partybox.ts`.

**Should fix (after the merge, or the owner decides)**

5. **More overlap with the bank.** `partybox/overlap-candidates.json` lists 481 pairs with the same answer and shared subject words, not excluded. Most are template look-alikes, but a human must decide each one.
6. **Template repetition.** 23 kept rows start "What is the chemical symbol for…". The bank already has 7 such rows.
7. **Distractor proximity, B13-0110.** The distractors 1,430 / 430 / 4,430 metres sit around the correct 2,430 metres, so the answer can be guessed by similarity. Flagged for a rewrite and fresh review.
8. **Stem overlap, B13-0846 and 0889.** 0846's distractor "Par" appears in the stem; 0889's distractor "Jersey City" shares "Jersey" with the stem. Minor, flagged.
9. **Difficulty doubts, B13-0074 and 0427.** Both are labelled hard but are widely taught. Difficulty is a reasoned audience judgment, with no playtest.
10. **US share.** A keyword count finds 198 of 1,000 rows US-specific (us-geography 90/100, us-history-civics 52/100, world-geography 5/100, world-history 1/100). That may suit a US adult deck. The owner decides whether a US-heavy mix is wanted.
11. **Time-sensitive stems.** 41 rows contain time-sensitive words and 20 have no "as of 2025" cutoff. All 20 were read and are definitional or historical facts (largest living bird, the 1896 Olympics, Kodokan 1882), so no cutoff was added.
12. **Not checked in this pass:** overlap with the content packs C01–C08 (`partybox-content-packs`) and with other PartyBox games' question banks. Check before the merge.

**Licence and IP**

- Facts and mechanics are not copyrightable. Question text was written by the B13 workers. Publisher names are attribution: Encyclopaedia Britannica, Wikipedia, UNESCO World Heritage Centre, the National Park Service, the Smithsonian, Animal Diversity Web, American Film Institute, Los Alamos, NIST, OpenStax and State Symbols USA.
- Wikipedia is CC BY-SA. The port copies only publisher names, not quotes, so no Wikipedia text ships in PartyBox. If the owner wants the ≤25-word quotes in PartyBox, that needs a licence decision first.
- Trademarks and titles are named as facts only: Monopoly, Jaws, Star Wars, Titanic, The Matrix, NBA, NFL, Super Bowl and others. These are nominative mentions, not endorsements. No logos or art ship. If the owner wants no brand names at all, reword the rows that name them. That keyword scan was not run.

**Connections to other satellite deliverables**

- The content packs (C01–C08) feed G04 Reality Check and may overlap with these rows (gap 12).
- No other B-job touches lightning-round content.

## Verify after porting

- In the PartyBox checkout: `pnpm verify` (registry, typecheck, lint, unit and contract tests, build, bundle, drift).
- `pnpm vitest --project games` (covers `content.test.ts`, `content-es.test.ts`, `game.test.ts`).
- `pnpm exec tsx scripts/check-content-pack-duplicates.ts`.
- `PB_REPO=<partybox> <partybox>/node_modules/.bin/tsx partybox/validate-with-partybox.ts <merged questions.json>`.
- `pnpm sim --game lightning-round --players 6 --runs 200 --seed 1`.
- `pnpm check-bundle`: content must not reach a client chunk.
- `pnpm e2e:snap --game lightning-round`, then read the screenshots.

## Polish pass 2026-10-08 (Claude, cloud)

Checked:
- `check-data.py` hosted mode: exit 0, 1000 rows, 1000 adversarial accepts, 1000 reopen supports, 2210 similarity flags resolved, `researchComplete` true. Run into `.work/`.
- `check-data.py --require-local-captures` (and `--draft`): exit 1 in this clone, with 1,040 "required local body missing" messages. The `.work/` bodies are gitignored and absent, so the local proof cannot be re-run here. The author's run is recorded in VERIFY.md and was not reproduced.
- `sha256sum --check`, `verify-guard-fixtures.py` and the adapter self-test: see VERIFY.md.
- PartyBox's own schema and speech reader, run from the PartyBox checkout (`26b85ba6`): 949/949 schema-valid, 27 rows with roman numerals, 23 chemical-symbol template rows.
- Exclusion scan against the 5,567-item bank: 51 rows (5 leaks, 32 same-fact, 14 state-capital).
- Spot check of 40 seeded-random rows (seed 20261008) against my own knowledge: no factual errors found, plus the difficulty doubts above. Not re-opened against the cited sources; this pass did not attempt those fetches, so every fact is still checked only by the job's earlier review records.
- Phone-width render of the six longest rows (Chromium, 390 px): no overflow.

Changed (commit messages start `B13:`):
- `scripts/to-partybox.py`, `partybox/exclusions.json`, `partybox/overlap-candidates.json`, `partybox/fit-summary.json`, `partybox/validate-with-partybox.ts`: the port adapter, decisions and validator.
- `README.md` rewritten with the What / How / Status block; this file added; VERIFY.md, LOOP.md, NEXT.md and SHA256SUMS.txt updated.
- `categories/`, `evidence/`, `reviews/`, `research/`, `reports/` and `trivia.schema.json` unchanged. `reports/checks.json` was overwritten by a test run and restored from git, so it matches the committed acceptance report.

## Version scope after the 2026-10-09 research amendments

The port review,51 static exclusions,949-row fit summary and private-bank checks above describe the original Ready22 row version. Nine new research amendments have their own exact independent source/option reviews; no new PartyBox private-bank refresh, exported-pack installation, schema/speech/client run or game merge is claimed here. Existing adapter artifacts remain historical. Their old missing-body limitation is closed for the original pack by the genuine1,051 retained-body proof; current full research acceptance is recorded separately in VERIFY and reports/checks.json.
