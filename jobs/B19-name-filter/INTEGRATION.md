# B19 Player-name filter → PartyBox integration guide

> Verification note: these integration notes came from another active session.
> The PartyBox paths and integration behavior below have not been rechecked by
> this isolated protocol review. No other repository is modified. This drop
> retains its literal 0.05 ms check; the integration notes do not waive it.

> For the owner's desktop Claude agent, who ports this into the main repo (luisitin/partybox, local
> C:/dev/partybox). Read this file first; everything else in this folder is the job's own record.

| | |
| --- | --- |
| Status | Current corrected standalone drop has two genuine full checks and completed finite runtime review; final delivery/PR23 status is on GitHub. All parent-repository port behavior below remains UNVERIFIED in this review. |
| Branch | Supplemental `job/B19-name-filter-protocol-review-20261008`, PR23 into canonical `job/B19-name-filter`; originalPR2 remains untouched. Corrected-runtime full run37880030043 attempts1/2 is independently accepted at exact89ea55. Current final delivery CI must be accepted separately. |
| Repo | luisitin/partybox-gpt-drops |
| Test | `cd jobs/B19-name-filter && npm ci --ignore-scripts --no-audit --no-fund && npm test` (Node 22+). Full run ≈ 1 min on an idle box; `npm run test:core` skips corpora. |
| Lands in PartyBox | `packages/engine/src/name-filter.ts` (new, pure) · called from `packages/engine/src/players.ts` `join()` · tests `packages/engine/src/name-filter.test.ts` (new) |

## What it is

A pure, zero-dependency TypeScript function, `nameFilter(input: unknown)`, that rejects a player name
when it contains a finite English list of sexual terms and slurs, including leetspeak, repeated letters,
inserted separators, reversals and a documented set of confusable letters. It accepts a reviewed list of
benign names and words (Scunthorpe, Cumming, Dickens, Sussex and so on) and returns a frozen
`{ ok: true }` or `{ ok: false, reason, suggestion }`. Measured here: 5,000 seeded obfuscations all blocked,
459 immutable original fixed cases and 5,000 generated obfuscations pass per seed (15,000 across seeds1–3), all25 original mutants per seed are executed/killed,
and the new independently sealed run-boundary reference agrees on every current compared original/supplementary input. The historical sealed oracle has retained Unicode disagreements. Honest limits: English only (Spanish
profanity passes), a finite confusable table (not UTS #39), and 11 Census names are blocked by design.

## Take these files (the product)

| File | What | Goes to (PartyBox path) |
| --- | --- | --- |
| `jobs/B19-name-filter/nameFilter.ts` | The whole filter: TERMS, SAFE exceptions, GROUPS confusables, `nameFilter`, `isAllowedName`. No imports, no I/O, no clock, no randomness. | `packages/engine/src/name-filter.ts` (new). Drop the header line "B19:" and keep the policy comment. Named exports only (already true). |
| `jobs/B19-name-filter/POLICY.md` | The moderation contract: domain, order, Scunthorpe cases, kept conflicts. | Reference for a new ADR in `docs/DECISIONS.md` (number ≥ ADR-088, after the owner's local main). Do not copy verbatim; condense to the rules. |
| `jobs/B19-name-filter/tests/run.mjs` (the generator only: `rng`, `makeObfuscations`, the `positive` list) | The seeded 5,000-case obfuscation generator and the benign list. | Port into `packages/engine/src/name-filter.test.ts` as vitest cases (project `engine`). Do not port the mutation harness. |

## Leave these (evidence, tooling, reports)

- `jobs/B19-name-filter/tests/blind/**`, `tests/reference.ts`, `historical/**`: independent oracles and
  the superseded implementations. They prove the work; the port does not need them.
- `jobs/B19-name-filter/tests/run.mjs` (rest), `scripts/**`, `tests/retained-snapshot.py`: the harness,
  corpus fetch and integrity checks. Corpus acquisition is a drop-repo concern, not a PartyBox one.
- `jobs/B19-name-filter/results/**`, `data/**`, `reports/**` (generated): measured receipts and the
  reviewed rejection ledger. `data/kept-rejections.json` is the record of every blocked corpus row.
- `jobs/B19-name-filter/{VERIFY,LOOP,NEXT,ASSUMPTIONS,CONFLICTS,SOURCES,SHA256SUMS.txt}`: the job log.
- `.github/workflows/B19.yml`: the drop repo's CI. PartyBox runs `pnpm verify` instead.

## Port steps

1. **Copy** `nameFilter.ts` to `packages/engine/src/name-filter.ts`. It needs no import rewrite (it imports
   nothing). Run `pnpm lint`: the engine rules (no `Date.now`, `Math.random`, timers, I/O) already hold.
2. **Host-specific normalization ordering remains UNVERIFIED.** In `join()` (`packages/engine/src/players.ts`, around line 73) the name
   is `const name = normalizeName(event.name);`. The historical suggestion was to filter that normalized value. That is a host-policy decision, not the standalone B19 contract: B19 checks raw16-code-point length and rejects bidi controls before normalization. Do not treat invisible/bidi stripping as preserving that raw rejection contract; verify the actual host adapter and the chosen raw-input policy before porting.
   Reason: PartyBox's `normalizeName` (`packages/shared/src/ids.ts`, line ~49) strips invisible and bidi
   characters, collapses whitespace and only then counts 1–16 code points. The filter counts the raw input
   and rejects controls, so an unfiltered call would reject a name that `normalizeName` accepts (for
   example `"Bob\u200b"`). Test this ordering explicitly.
3. **Wire the result.** After the `if (!name)` branch that returns `name_invalid`, add:
   `const verdict = nameFilter(name); if (!verdict.ok) return { room, effects: [error(event.playerId,
   verdict.reason === 'blocked' ? 'name_blocked' : 'name_invalid', message)] };`. Add `name_blocked` next to
   `name_taken` in the client's error handling (`packages/client/src/net/controller.ts` line ~229 is the
   pattern) and in `packages/client/src/i18n-en.ts` / `i18n-es.ts`. The engine's English message is
   fallback only; the client shows L('…').
4. **Map `suggestion` to copy** (keys are stable; wording is the host's): `choose-another` → "That name
   isn't allowed. Try another one." · `shorten` → "Use 16 characters or fewer." · `add-letters` → "Add at
   least one letter or number." · `remove-characters` → "Remove hidden characters from the name." ·
   `use-text` → "Type your name with letters." Spanish drafts (needs native review): "Ese nombre no está
   permitido. Prueba otro." · "Usa 16 caracteres o menos." · "Añade al menos una letra o número." · "Quita
   los caracteres ocultos del nombre." · "Escribe tu nombre con letras."
5. **Close the two bypasses** (decision, see gaps 2 and 3). `findDisconnectedByName` and the `takeOver`
   branch in `join()` resume a seat before validation, and `packages/server/src/join-seat.ts` (line ~20)
   claims a seat by `nameKey(normalizeName(...))`. Names saved before this ships (`packages/engine/src/saves.ts`,
   ADR-067 `saveable`) skip the filter. Recommended: run `nameFilter` on restore and rename a blocked
   seat to `Player N`.
6. **Bots**: `botName()` in `packages/engine/src/bots.ts` (line ~29) draws names. Add a test that every
   bot name passes `nameFilter`.
7. **Tests** (`packages/engine/src/name-filter.test.ts`, vitest, project `engine`): the Scunthorpe list
   (`Scunthorpe`, `Dickens`, `Cumming`, `Sussex`, `Essex`, `Analisa`), the blocked witnesses (`s.e.x`,
   `ｓｅｘ`, `d1ck`, `p0rn`, `Hancocksex`), the normalize-then-filter ordering test, a determinism test (same
   input, same result), and the seeded generator (5,000 cases, seed 1). Keep the generator's `rng` seeded;
   never `Math.random`.
8. **Docs in the same commit**: ADR in `docs/DECISIONS.md` (number ≥ ADR-088, cites POLICY.md), one
   `CHANGELOG.md` Unreleased line, `docs/DEPENDENCIES.md` gets no new line (zero dependencies). A new
   `docs/sdk/` entry is not needed: the filter is engine code, not a game-sdk export.
9. **Client bundle**: none. The engine is server-only (`packages/client` never imports `@partybox/engine`),
   so the phone budget (`scripts/bundle-budget.json`) is unaffected. Confirm with `pnpm check-bundle`.

## Make it feel AAA in PartyBox (not a 2D bootleg)

Nothing a player sees comes from this drop except the join error. Make that error feel like part of the
product, not a red flash: the name field keeps focus, the rejected text stays, the message appears under
the field in the `--pb-danger` token with the warm copy from step 4, and the field shakes once (the
existing `useJoinShake` hook in `packages/client/src/controller/useJoinShake.ts`). Reduced motion gets no
shake, only the text. Check the message at 320×568 and at 200% text, and in Spanish. No TV change is
needed: the room lobby never shows a rejected name, so nothing reaches the TV.

## Known gaps and risks

**Must (before the port is enabled for players)**

1. **Spanish profanity and slurs pass.** Checked with the built filter: `Puta`, `Pendejo`, `Joder`,
   `Mierda`, `Culo`, `Verga`, `Maricón`, `Cabrón`, `Coño`, `Polla`, `Zorra` and `Pajero` are all `ok`. The
   lexicon is English only (POLICY.md scope). PartyBox ships es, so an es room needs a reviewed Spanish
   lexicon (its own `ES_TERMS`, same matcher) before this filter can claim to cover that room. This is
   an owner decision on which terms count; no list was invented here.
2. **Raw-input versus host-normalized wiring** (step2) is not verified here. The standalone contract counts raw codepoints and rejects controls; a host that strips them first changes that contract. Verify adapter ordering and raw-control/length regressions in the actual parent repository before porting.
3. **Legacy and reconnect paths** (step 5) bypass the filter. A blocked name saved before the port stays
   in play unless restore filters it.
4. **Real names blocked by design.** Eleven Census names are rejected (`Lana`, `Dick`, `Bonner`, `Coon`,
   `Stitt`, `Dyke`, `Boner`, `Dicks`, `Coons`, `Dykes`, `Raper`): identical spellings of blocked terms or
   whole-word obfuscations. There is no allowlist by design. The owner must accept these or change the policy.

**Should**

5. **The literal 0.05 ms per-call gate is environment-sensitive.** On the GitHub runner (run 37809073933,
   `2b54431`) all 30,000 timed calls pass; maxima 0.046, 0.038 and 0.022 ms. On this shared 4-CPU box the
   same source has 6–14 calls per seed above 0.05 ms (across this box's runs) (maxima of several ms), and the gate fails. Median
   calls take 0.0007–0.0009 ms on the runner. This drop keeps the literal maximum as
   an acceptance gate. Later external heads changed the timed input sample; their
   results cannot replace the original sample or erase any measured failure.
6. **Confusables are a finite table, not UTS #39.** The `GROUPS` table covers declared Cyrillic, Greek and
   Latin look-alikes. Other scripts and multi-character spellings (`vv` for `w`) are not claimed.
7. **Spanish given names.** This pass added exact exceptions `analia`, `analise` and `sexto` (`Analía` was
   blocked by the substring `anal`). Other Spanish and Latin American given names are untested; there is
   no Spanish name corpus in this job.
8. **Policy changed after sealing.** `tests/blind/reference.mjs` is unchanged (its hash matches the sealed
   manifest) but it reads `data/policy.json`, which gained three exact exceptions in this pass. POLICY.md
   and CONFLICTS.md record the change.

**Nit**

9. The 10,000-word list (`first20hours/google-10000-english`) has no verified repository licence (SOURCES.md).
   Do not ship it; use a PartyBox-authored word list for tests.
10. GeoNames (CC BY 4.0) needs attribution if any place-name fixture ships. The port does not need it.

## Verify after porting

`pnpm verify`, `pnpm vitest --project engine`, `pnpm lint`, `pnpm check-bundle`. Then a join smoke test: a
blocked name gets `name_blocked`, a benign name joins, and `Bob\u200b` joins as `Bob`. No `pnpm sim` or
`pnpm e2e:snap` is needed for an engine-only change, but add one join case to the engine tests.

## Polish pass 2026-10-08 (Claude, cloud)

- **Branch reconciled.** The remote branch had moved to `2b54431` (three commits from another session,
  scoped to this job). Fast-forwarded, no rewrite.
- **Hosted CI checked.** Run 37809073933 on `2b54431`: success, full mode, 91 suites, 0 failures, latency
  10,000/10,000 on each seed. The PR body still describes an older failing head (`b3f5231`); it was not edited.
- **Product change.** Failures now carry a stable `suggestion` key (`use-text`, `shorten`, `add-letters`,
  `remove-characters`, `choose-another`) beside `reason`. Types `NameReason`, `NameSuggestion` exported.
- **Product change.** Exact exceptions `analia`, `analise` and `sexto` added to `SAFE` and
  `data/policy.json` (292 total). Each has a regression case.
- **Checked, not changed.** Real-name probes (Dick, Dickens, Cumming, Scunthorpe, Penistone, Analisa,
  Sexton, Titus, Chinook, Matthias, Mohammed, Iñigo, Ólafur, Peñalosa) and Spanish profanity (see gap 1).
