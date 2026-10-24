# Conflicts

Initial discovery already shows a classic30-ticket/new33-ticket rulebook edition difference and errors/asymmetry in some volunteer map datasets. Those will be resolved by explicit primary-map/independent-data comparison and documented perrow; no source is assumed correct merely because it is machine-readable.

## Resolved map and scoring conflicts

The two independently authored map inventories agree on36cities,78unordered adjacency groups,100physical tracks and309train spaces.78does **not** include the separate tracks of doubles:22groups have two tracks. Every physical track is separately represented.

Matt Gawarecki's JSON (mirrored by AGnias47) has three directional errors: Chicago→Toronto says Any, but Toronto→Chicago says White; Denver→Helena says Pink, but Helena→Denver says Green; Sault Ste. Marie→Toronto says the invalid color Toronto, but Toronto→Sault Ste. Marie says Any. Rob217's independently created routeCSV agrees with the valid reverse records: respectively white4, green4 andgray2. These three values were additionally inspected visually in the official2015rulebook's setup map (PDFpages2–3). Both directions are preserved in the original downloadedJSON; no source correction is silently hidden.

The same source's route-point-values.json says length6scores16. The official printed scoring table and independently written TheRuleBook scoring bullets both say15. Canonicaldata and both separately authored game implementations use15. This additional source is retained for the explicit disagreement; it is not used as supporting evidence for15.

## Ticket catalogs and editions

The requested base edition is the classic30-ticket USA deck, as the official2015rulebook and both independent30-row inventories specify. The2025revised USA rules describe33tickets; this is a different edition and is not substituted into the requested classic data. Public source: https://cdn.svc.asmodee.net/production-daysofwonder/uploads/2025/07/7201N_TICKET2RIDEV2_RULES_EN_20250425_WEB.pdf . That source is supplementary edition evidence, not a supporting source for classic rows.

Matt Gawarecki's1910JSON has39rows:35new tickets plus4revised copies of base tickets. It omits the4MysteryTrain tickets, so appending it naïvely would miscount69cards and duplicate revised base endpoints. The official1910rulebook specifies35new+30base reprints+4MysteryTrain=69. The full69-row independently authored CMBF/SuperCheats inventory agrees with all35newvalues and all4revisions; BGG's explicit MysteryTrain contents independently supplies Boston–Washington4, Montreal–Chicago7, Vancouver–Portland2 andWinnipeg–Omaha6. Canonicalusa1910Tickets contains exactly69cards:30baseReprint(including4revised),35new1910,4mysteryTrain. baseTickets retains original30values separately.

The four revised values are LosAngeles–Miami20→19, LosAngeles–NewYork21→20, SaultSte.Marie–OklahomaCity9→8, andSeattle–NewYork22→20. Their revisedFrom fields preserve the original values. They are independently listed at https://boardgames.stackexchange.com/questions/3348/ttr-destination-ticket-value-changes-in-the-america-1910-expansion .

## Guide naming and canonical aliases

TheRuleBook correctly gives the longest-path numeric bonus10, but calls it Globetrotter. The original rulebook calls this LongestContinuousPath; USA1910's distinct Globetrotter bonus is15for most completed tickets. Only original longestTrailBonus10 is modeled by scoreGame;1910ticket values are available as separate data. Expansion game-variant scoring is outside the requested USA base scoring model.

Pink is the JSON/code spelling of the route color called Purple in the official rulebook. Rob217'sPcode and MattGawarecki'sPink refer to that same printed color. CanonicalSaintLouis/SaultSte.Marie/Washington/Montreal normalize St.Louis/SaultSt.Marie/WashingtonDC/Montréal aliases for matching; no extra cities are added.
