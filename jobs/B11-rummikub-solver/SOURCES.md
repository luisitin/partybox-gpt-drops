# Sources and chosen profile

Retrieved during this job. Page numbers below are one-based. No rulebook text, diagrams, proprietary tile artwork or PDFs are redistributed.

## R1 — authoritative English rule profile

Publisher's rules index: https://rummikub.com/rules/
English Classic manual: https://rummikub.com/wp-content/uploads/2019/12/2600-English-1.pdf
Printed identifier, p.4: `D-2600-1236-0041 120819`.

| Rule | Location | Implementation / tests |
|---|---|---|
| 106 tiles; two copies of each numbered face; two jokers | p.1 Contents | inventory; J19–J23, V02/V04 |
| Groups: 3–4 equal values, distinct colors; runs: >=3 consecutive same-color values; no wrap | p.1 Sets | table validators; J01–J25 |
| Rack-only opening >=30; joker takes represented value; additions to old sets on later turns | p.1 Playing The Game | transition validators; J26–J31, S03/S04/S17 |
| Final manipulated table contains only complete legal sets | p.2 Manipulation | mandatory resource cover and postcheck |
| Flexible joker release, immediate reuse, rack contribution somewhere on that turn, no pre-opening retrieval | p.3 The Joker and examples; p.4 example 4 | J32–J40 |
| Joker left on rack: 30-point penalty | p.4 Scoring | separate `rackPenaltyShed` result |

Short quotation, p.1: “On turns after a player has made his/her initial meld”. No other English-manual passages are quoted in this drop. Text extraction was inspected for all pages; page 1 and page 3 diagrams were visually inspected. The web screenshot endpoint for page 4 returned a bot challenge, so example 4's English diagram was not visually rechecked; its parsed explanation and the German counterpart were available. This image-check limitation does not constitute independent confirmation of every rules interpretation.

## R2 — official alternative, not the implemented profile

https://rummikub.com/wp-content/uploads/2019/12/2600-Germany.pdf
The German Sabra manual, p.3 rule 3, says “sofort oder auch später” after opening. Its p.4 scoring gives a 25-point retained-joker penalty. Both pages were visually inspected. See `CONFLICTS.md`; these incompatible details are not silently imported into R1.

## T1 — development dependency provenance

https://registry.npmjs.org/typescript/5.8.3
The registry reports TypeScript 5.8.3 with integrity:
`sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==`.
The checked-in lockfile uses that exact release and integrity. This is a build/test dependency, not a solver runtime dependency.

## Delivery contract

https://github.com/luisitin/partybox-gpt-drops/blob/main/README.md
Read before branch creation. It expressly permits the one root CI workflow, requires PR-only delivery, confines other files to the job folder, and requires all-seed verification and explicit unverified status. No code or empirical results were borrowed from another solver.
