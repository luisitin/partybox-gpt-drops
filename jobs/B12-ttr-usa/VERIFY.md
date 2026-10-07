# Verification

Completed under Node v22.16.0, TypeScript 5.9.3, Python jsonschema 4.26.0. All suites run seeds **1, 2, 3** via the single command below. Actual machine reports are retained in reports/; CI also uploads raw output.

```sh
npm ci --ignore-scripts --no-audit --no-fund
python -m pip install 'jsonschema==4.26.0'
npm test
sha256sum -c SHA256SUMS.txt
```

## Test ledger

| Test | Cases per seed | Passed | Seeds | Exact command |
|---|---:|---|---|---|
| All cores strict compilation | 3 TS files; strict + unchecked-index/optional/unused/fallthrough/override/no-emit-on-error flags | yes | deterministic once, shared by all seeds | `npm run build` |
| Two independent trail/connectivity implementations | 20,000 graphs + 20,000 tickets | yes | 1,2,3 | `node tests/graphs.mjs` |
| Blind exhaustive edge-subset brute force | 20,000 identical graphs, 0–12 edges each | yes | 1,2,3 | `node tests/graphs.mjs` |
| Boundary/legality/scoring/RNG differential | 53 boundaries + 6,000 RNG draws total | yes | 1,2,3 plus documented boundary seeds | `node tests/graphs.mjs` |
| Immutable goldens + 100 random mutation probes | 175 checks | yes | 1,2,3 | `node tests/probe.mjs` |
| Real completed full USA games, two independent scores | 2,000 | yes | 1,2,3 | `node tests/games.mjs` |
| Data facts, 2-source inventories, citation/row/physical counts | 2903 assertions | yes | 1,2,3 | `node tests/data.mjs` |
| Draft 2020-12 schema: pure TS vs independent Python | 125 cases: 1 valid + 124 invalid | yes | 1,2,3 | `node tests/data.mjs` |
| Original and amended sealed oracle own self-checks | 22,292 assertions each; 2,000 exhaustive graphs + 1,000 synthetic scoring/applications per seed in each driver | yes | 1,2,3 | `node tests/oracle-self.mjs` |
| 25 isolated planted bugs, strict compilation and behavioral rejection | 25 compiled; 25 kills per seed (75 total) | yes | 1,2,3 | `node tests/mutations.mjs` |
| Actual fresh source reopening, every fact row | 14 sources / 264 rows, 528 citations | yes | source pass 2, then audited 1,2,3 | `python tools/reopen.py` after actual second Exa web fetch as documented below |

The graph ledger records **186053 comparisons**, zero discrepancies. Each exhaustive subset oracle examines masks up to 2^12, uses positive-weight pruning and checks connected Euler subsets; it is blind-authored separately from both production and reference trail searches. The original sealed helper source and exact extracted function are retained. No graph or full-game sample is skipped.

## Full-game evidence

Every final game digest, game count, move count and conservation-check count is identical to the preserved pre-loop full run despite the runtime bookkeeping optimization.

Every game shuffles all110 physical train cards, deals/keeps destination tickets, plays legal claims and draws, recycles discards, ends at two trains or fewer and completes one final turn for each player including the trigger. Every turn proves card conservation, train-length conservation and all30 physical ticket IDs. Every claim/application is compared; input objects are frozen and checked unchanged. Every final score field (route points, signed tickets, exact longest trail, bonus, total, completed IDs) matches. The 1,500-turn guard fails rather than truncates games.

| Seed | Completed games | Turns | Claims | Blind cards drawn | Ticket draws | Recycles | Max owned edges | Turn range | Replay SHA256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | 2000 | 295271 | 118652 | 340784 | 6227 | 3284 | 22 | 79–220 | 7825340701a64c9faecab20f983f6fec28ae145c17215c55f07d76c0369a7cf9 |
| 2 | 2000 | 295199 | 118560 | 341076 | 6101 | 3304 | 21 | 79–219 | bbc136a68fcaa4329fb6fbf1173d42caa0b24efffa0cae700f603c50cb021767 |
| 3 | 2000 | 295133 | 118757 | 340388 | 6182 | 3310 | 21 | 79–219 | c6a2e929f86b59bca8e83350e33067cf8b4f8a8bf8b80ca9d8953a2f2e023a7f |

## Actual independent schema-validator output

Actual seed1 standards-validator output, canonical valid first followed by all124 invalid cases:

```json
{
  "validator": "jsonschema Draft202012Validator",
  "schemaValid": true,
  "cases": 125,
  "valid": [
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ],
  "passed": true
}
```

The full 125-case output for each seed is in reports/data-schema-audit.json, including every boolean. The schema checks structure/field bounds; tests separately check identifiers, endpoint membership, catalog composition and two-source values.

## Independent authorship and repairs

See ORACLE.md, ORACLE_AMENDMENTS.md and reports/oracle-archive/. The original primary and blind oracle were sealed before source exchange. Exact original sources and seal files remain available. Post-exchange malformed-array/integer boundary fixes are explicitly replayed; the later correction is not described as part of the original blind seal. The integration harness and source research are separate from the blind author.

## Planted bug ledger

Each changes exactly one production-source anchor in its own .mutations directory. Every copy strictly compiled. The unmodified baseline passed all goldens; each planted copy failed an actual assertion under each seed. No compiler error, timeout, changed oracle or weakened gate counts as a kill. Evidence/source hashes are in reports/mutations.json.

| ID | Bug | Strict compile | Seed1 | Seed2 | Seed3 |
|---|---|---|---|---|---|
| 1 | six-point-table | pass | killed | killed | killed |
| 2 | minimum-route-length | pass | killed | killed | killed |
| 3 | maximum-route-length | pass | killed | killed | killed |
| 4 | minimum-players | pass | killed | killed | killed |
| 5 | existing-three-player-parallel | pass | killed | killed | killed |
| 6 | candidate-three-player-parallel | pass | killed | killed | killed |
| 7 | same-player-parallel | pass | killed | killed | killed |
| 8 | exact-train-balance | pass | killed | killed | killed |
| 9 | payment-length | pass | killed | killed | killed |
| 10 | double-spend | pass | killed | killed | killed |
| 11 | exact-card-balance | pass | killed | killed | killed |
| 12 | mixed-gray-payment | pass | killed | killed | killed |
| 13 | all-locomotive-payment | pass | killed | killed | killed |
| 14 | card-deduction | pass | killed | killed | killed |
| 15 | train-deduction | pass | killed | killed | killed |
| 16 | claim-owner | pass | killed | killed | killed |
| 17 | zero-edge-ticket | pass | killed | killed | killed |
| 18 | reverse-ticket-adjacency | pass | killed | killed | killed |
| 19 | breadth-first-frontier | pass | killed | killed | killed |
| 20 | four-odd-euler-shortcut | pass | killed | killed | killed |
| 21 | weighted-edge | pass | killed | killed | killed |
| 22 | edge-reuse-guard | pass | killed | killed | killed |
| 23 | disconnected-component-sum | pass | killed | killed | killed |
| 24 | incomplete-ticket-sign | pass | killed | killed | killed |
| 25 | longest-tie-bonus | pass | killed | killed | killed |

## Second source pass: every row

After the first extraction, ten selected raw inventories/PDFs were reopened with actual HTTPS GET (Cache-Control:no-cache), and four selected web pages were newly fetched through Exa. Fresh returned content, not the first-pass cache, was re-extracted; the official PDFs were read with pdftotext. Tools/reopen.py compared those fresh values and excerpts against every row. reports/source-reopening.json records actual URLs, methods, raw or factual-extraction SHA256, source IDs, fields and outcomes. Source snapshots and all conflicts are retained. This network authoring pass actually completed; CI rechecks its evidence and source snapshots without claiming to perform a new network reopening.

| Row | Confidence | Fresh source IDs | Fields rechecked | Pass |
|---|---|---|---|---|
| cities/0 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/1 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/2 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/3 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/4 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/5 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/6 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/7 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/8 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/9 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/10 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/11 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/12 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/13 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/14 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/15 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/16 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/17 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/18 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/19 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/20 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/21 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/22 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/23 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/24 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/25 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/26 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/27 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/28 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/29 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/30 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/31 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/32 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/33 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/34 | high | rob-cities, agnias-cities | id, name | 2: passed |
| cities/35 | high | rob-cities, agnias-cities | id, name | 2: passed |
| routes/0 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/1 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/2 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/3 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/4 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/5 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/6 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/7 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/8 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/9 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/10 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/11 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/12 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/13 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/14 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/15 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/16 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/17 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/18 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/19 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/20 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/21 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/22 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/23 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/24 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/25 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/26 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/27 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/28 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/29 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/30 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/31 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/32 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/33 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/34 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/35 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/36 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/37 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/38 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/39 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/40 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/41 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/42 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/43 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/44 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/45 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/46 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/47 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/48 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/49 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/50 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/51 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/52 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/53 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/54 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/55 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/56 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/57 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/58 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/59 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/60 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/61 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/62 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/63 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/64 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/65 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/66 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/67 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/68 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/69 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/70 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/71 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/72 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/73 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/74 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/75 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/76 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/77 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/78 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/79 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/80 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/81 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/82 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/83 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/84 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/85 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/86 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/87 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/88 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/89 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/90 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/91 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/92 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/93 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/94 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/95 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/96 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/97 | high | rob-routes, agnias-routes | id, a, b, length, color | 2: passed |
| routes/98 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| routes/99 | high | rob-routes, agnias-routes | id, a, b, length, color, parallelGroup | 2: passed |
| baseTickets/0 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/1 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/2 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/3 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/4 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/5 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/6 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/7 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/8 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/9 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/10 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/11 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/12 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/13 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/14 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/15 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/16 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/17 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/18 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/19 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/20 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/21 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/22 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/23 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/24 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/25 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/26 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/27 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/28 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| baseTickets/29 | high | rob-tickets, agnias-base | id, a, b, points | 2: passed |
| usa1910Tickets/0 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/1 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/2 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/3 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/4 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/5 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/6 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/7 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/8 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/9 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/10 | high | supercheats, bgg-mystery | id, a, b, points, origin | 2: passed |
| usa1910Tickets/11 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/12 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/13 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/14 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/15 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/16 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/17 | high | supercheats, bgg-mystery | id, a, b, points, origin | 2: passed |
| usa1910Tickets/18 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/19 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/20 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/21 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/22 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/23 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/24 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/25 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/26 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/27 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/28 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/29 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/30 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/31 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/32 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/33 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/34 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/35 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/36 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/37 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/38 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/39 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/40 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/41 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/42 | high | supercheats, agnias-1910 | id, a, b, points, revisedFrom, origin | 2: passed |
| usa1910Tickets/43 | high | supercheats, agnias-1910 | id, a, b, points, revisedFrom, origin | 2: passed |
| usa1910Tickets/44 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/45 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/46 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/47 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/48 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/49 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/50 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/51 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/52 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/53 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/54 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/55 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/56 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/57 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/58 | high | supercheats, agnias-1910 | id, a, b, points, revisedFrom, origin | 2: passed |
| usa1910Tickets/59 | high | supercheats, agnias-1910 | id, a, b, points, revisedFrom, origin | 2: passed |
| usa1910Tickets/60 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/61 | high | supercheats, bgg-mystery | id, a, b, points, origin | 2: passed |
| usa1910Tickets/62 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/63 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/64 | high | supercheats, bgg-mystery | id, a, b, points, origin | 2: passed |
| usa1910Tickets/65 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/66 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| usa1910Tickets/67 | high | supercheats, agnias-base | id, a, b, points, origin | 2: passed |
| usa1910Tickets/68 | high | supercheats, agnias-1910 | id, a, b, points, origin | 2: passed |
| cardCounts/0 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/1 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/2 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/3 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/4 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/5 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/6 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/7 | high | official-base, se-inventory | color, count | 2: passed |
| cardCounts/8 | high | official-base, se-inventory | color, count | 2: passed |
| routePoints/0 | high | official-base, guide | length, points | 2: passed |
| routePoints/1 | high | official-base, guide | length, points | 2: passed |
| routePoints/2 | high | official-base, guide | length, points | 2: passed |
| routePoints/3 | high | official-base, guide | length, points | 2: passed |
| routePoints/4 | high | official-base, guide | length, points | 2: passed |
| routePoints/5 | high | official-base, guide | length, points | 2: passed |
| parameters/0 | high | official-base, guide | name, value | 2: passed |
| parameters/1 | high | official-base, guide | name, value | 2: passed |
| parameters/2 | high | official-base, guide | name, value | 2: passed |
| parameters/3 | high | official-base, se-inventory | name, value | 2: passed |
| parameters/4 | high | official-base, guide | name, value | 2: passed |
| parameters/5 | high | official-1910, agnias-1910 | name, value | 2: passed |
| parameters/6 | high | official-1910, bgg-mystery | name, value | 2: passed |
| parameters/7 | high | official-1910, agnias-1910 | name, value | 2: passed |
| parameters/8 | high | official-1910, supercheats | name, value | 2: passed |
| parameters/9 | high | rob-cities, agnias-cities | name, value | 2: passed |
| parameters/10 | high | rob-routes, agnias-routes | name, value | 2: passed |
| parameters/11 | high | rob-routes, agnias-routes | name, value | 2: passed |
| parameters/12 | high | rob-routes, agnias-routes | name, value | 2: passed |
| parameters/13 | high | official-base, guide | name, value | 2: passed |

## UNVERIFIED

- Exhaustive enumeration of all possible full USA games and strategic playing strength. The 6,000 games are actual completed seeded legal games, not a claim about every possible game.
- Expansion variant scoring policies (1910 Globetrotter/Big Cities) and the newer 33-ticket base edition; catalogs and differences are explicit, while scoreGame implements classic USA scoring.
- Worst-case search performance on arbitrary large dense cyclic graphs. Exactness has no cap; exponential time is possible.
- Future changes to live source URLs. The two actually opened authoring passes and immutable local factual snapshots are the verified evidence.
- Hosted CI until the exact-head run is inspected; its final green URL is recorded in the PR after completion.
