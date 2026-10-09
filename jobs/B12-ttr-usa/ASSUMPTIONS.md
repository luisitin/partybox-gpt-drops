# Assumptions and public contract

- Original classic USA thirty-ticket edition is the requested base, rather than the newer33-ticket edition. Differences will be documented with source evidence.
- USA1910 tickets are kept in a separate catalog; expansion variants and reprinted/revised original tickets must be identified explicitly rather than silently mixed.
- Every physical parallel route has its own ID; route-count conventions distinguish adjacency groups from actual claimable tracks.
- Exact longest continuous path means an undirected weighted trail: an edge is used once, nodes may repeat, loops and parallel IDs are supported in synthetic tests.
- Public independent-author contract was exchanged before any production/reference source. Standard route scoring1..6→1,2,4,7,10,15; longest bonus10 is awarded to all tied positive maxima. Empty synthetic networks receive no bonus.
- Gray claims use one non-locomotive color plus any locomotives; all-locomotive claims are valid. Colored routes use only their matching color and locomotives. Standard2–3 global and4–5 same-player parallel restrictions apply based on unordered endpoints.
- canClaim returnsfalse on malformed input; applyClaim throwsRangeError. Graph/scoring APIs throwRangeError for malformed data and duplicate/unknown ownedIDs. Zero-edge connectivity completes a same-city synthetic ticket. Functions preserve all caller data.

- Canonical city names normalize Montréal→Montreal, St. Louis→Saint Louis,
  Sault St. Marie→Sault Ste. Marie and Washington DC→Washington. The printed
  purple route color uses API token `pink`, matching the two machine sources.
- USA1910 `baseReprint`, `new1910`, `mysteryTrain` origins and `revisedFrom`
  preserve physical expansion composition. Base-only scoring uses the original
  longest-trail 10-point bonus. The 1910 Globetrotter/variant bonus is not an
  automatic change to `scoreGame`; expansion variant rules are outside this API.
- `seeded` accepts safe integer seeds, coerces them to unsigned 32-bit state,
  and applies LCG 1664525/1013904223 with output divided by 2^32. Invalid seeds
  throw RangeError. Card counts and ticket points must be safe integers.
- The full-game generator plays a legal seeded policy, not a strategic bot or
  an exhaustive enumeration of all games. It shuffles the actual 110-card deck,
  deals four cards and three tickets (keeps two or three), exposes five market
  cards (resets if at least three locomotives), then chooses legal claims,
  blind two-card draws or drawing three tickets (keeps at least one). Returned
  tickets go to the bottom; discarded train cards recycle only on exhaustion.
  Blind locomotive draws are ordinary one-card draws. No face-up drawing is
  used by this policy. At two trains or fewer, all players including the
  triggering player take one final turn. No game is dropped or truncated; a
  1,500-turn generator guard fails the suite rather than accepting a partial game.
- A late-game claim preference seeks an actual end condition. It changes only
  which legal move is chosen; both independently authored implementations
  check every generated claim/application and every final score.

- Recovery 2026-10-09: malformed record boundaries reject arrays and functions.
  Inventories must be non-array records with exactly the nine enumerable own
  card keys; inherited/non-enumerable counts cannot masquerade as a complete
  spendable inventory. Valid object prototypes are not otherwise restricted.
- Caller-data preservation means enumerable own game/player extension fields
  (including symbols) survive applyClaim. Core mutable containers are copied;
  unrelated metadata is retained by identity and is not mutated. The immutable
  independently authored reference predates this correction and drops extensions,
  so direct frozen-input contract controls verify those fields.
- Reopening uses the source registry's original firstSha256 when ignored first PDF
  files are absent. A present local first snapshot is checked too. An upstream
  byte change remains a hard review failure; no source is silently replaced.
- Recovery research claims are limited to rechecking the historical full archive
  and controlled transport tests. The complete14-source second network pass has
  not been rerun in this recovery, and no new factual rows or quotes are promoted.
