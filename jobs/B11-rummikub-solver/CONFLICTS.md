# Conflicts and explicit decisions

| Issue | Conflicting evidence or ambiguity | Decision |
|---|---|---|
| Opening-turn manipulation | R1, p.1 defers table additions to later turns; R2, p.3 permits manipulation immediately after opening or later. | R1 only: preserve every old meld on the opening turn. J29/J31 reject changing it. |
| Retained-joker penalty | R1, p.4 uses 30; R2, p.4 uses 25. | Report 30 in `rackPenaltyShed`; do not advertise multilingual/edition-neutral compliance. |
| Meaning of “most tile value” | The request does not specify whether a joker should optimize represented meld value or avoided rack penalty. | Primary objective is represented new meld value, with rack count as tie-break. Penalty shed is reported separately. This is an API decision, not an official strategy recommendation. |
| Group joker color | The caller's group binding can be one of two absent colors. | Require an explicit valid `as` for an auditable table value; after opening, rebindings are permitted if the full transition remains legal. |
| Earlier independence gap | The original oracle and production solver shared an author. | A separate blind reference was sealed at 8564ea3 before inspection. Historical results remain archived; current full independent verification is pending. |
| 500 ms wording | A finite benchmark cannot establish a universal worst-case guarantee. | Measure p99 and maximum, fail `npm test` if either exceeds 500 ms on the defined corpus, and separately disclose the absence of a universal SLA. |

Source identifiers R1/R2 and direct links are in `SOURCES.md`. Other legacy, tournament, house-rule, XP, Twist, and multilingual profiles have not been exhaustively reconciled. They are not silently treated as equivalent.
