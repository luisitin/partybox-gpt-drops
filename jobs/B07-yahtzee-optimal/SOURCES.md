# Rules and exact-strategy sources

Research on2026-10-07 used Exa search/fetch before primary source exchange.
reports/research-exa-raw.json preserves raw provider results and original URLs.
Manufacturer sources determine official rules; public engines are comparison
leads, never solved table inputs.

| Source | Evidence | Assessment |
|---|---|---|
| https://www.hasbro.com/common/instruct/40958.pdf |13 US categories,35at63,100extra Yahtzee, forced Joker priority even Yahtzee0|Manufacturer selected edition|
| https://hasbro-apac-eng.custhelp.com/app/answers/detail/a_id/211 |matching upper/lower/other upper priority|Manufacturer corroboration|
| https://instructions.hasbro.com/api/download/00950_en-ca_yahtzee-classic.pdf |later wording differs|Edition conflict; not silently mixed|
| https://www-set.win.tue.nl/~wstomv/misc/yahtzee/rules.html |any-open-category convention, fixed Jokers after matching upper filled|University-hosted mathematical convention; separate published mode|
| https://www-set.win.tue.nl/~wstomv/misc/yahtzee/trivia.html |254.5896 and attributed exact rational calculation|Academic benchmark, not input answer|
| https://vigir.missouri.edu/~gdesouza/Research/Conference_CDs/IEEE_SSCI_2007/CI%20and%20Games%20-%20CIG%202007/data/papers/CIG/S001P018.pdf |Glenn, Computer Strategies for Solitaire Yahtzee, IEEE CIG2007; finite DP/dice lattice|Published algorithm background; no table imported|
| https://github.com/jdh8/yahtzee-engine |reports official254.5877 and historical254.5896|Recent independent public source; insufficient alone for rule authority|
| https://raw.githubusercontent.com/jdh8/yahtzee-engine/main/src/solver.rs |public implementation/representation|Reviewed before our seal; no copied code|
| https://raw.githubusercontent.com/jdh8/yahtzee-engine/main/src/state.rs |public state representation|Disclosed public research|
| https://raw.githubusercontent.com/jdh8/yahtzee-engine/main/src/dice.rs |public dice representation|Disclosed public research|

Both team authors separately generated their full tables. The source seals
prove separation of those two cores, not that the primary never read any public
implementation. Complete chance probabilities are exact fair-dice fractions;
the returned double expectations approximate rational values.
