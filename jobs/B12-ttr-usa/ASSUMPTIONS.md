# Assumptions and public contract

- Original classic USA thirty-ticket edition is the requested base, rather than the newer33-ticket edition. Differences will be documented with source evidence.
- USA1910 tickets are kept in a separate catalog; expansion variants and reprinted/revised original tickets must be identified explicitly rather than silently mixed.
- Every physical parallel route has its own ID; route-count conventions distinguish adjacency groups from actual claimable tracks.
- Exact longest continuous path means an undirected weighted trail: an edge is used once, nodes may repeat, loops and parallel IDs are supported in synthetic tests.
- Public independent-author contract was exchanged before any production/reference source. Standard route scoring1..6→1,2,4,7,10,15; longest bonus10 is awarded to all tied positive maxima. Empty synthetic networks receive no bonus.
- Gray claims use one non-locomotive color plus any locomotives; all-locomotive claims are valid. Colored routes use only their matching color and locomotives. Standard2–3 global and4–5 same-player parallel restrictions apply based on unordered endpoints.
- canClaim returnsfalse on malformed input; applyClaim throwsRangeError. Graph/scoring APIs throwRangeError for malformed data and duplicate/unknown ownedIDs. Zero-edge connectivity completes a same-city synthetic ticket. Functions preserve all caller data.
