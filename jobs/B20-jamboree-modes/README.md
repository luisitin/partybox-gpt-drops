# B20 — Every other Jamboree mode, buildable specs

This folder contains 28 researched mode/mechanic/variant records, 85 rule records and one original phone/TV adaptation spec per record. Read INTEGRATION.md and DESIGN-DIGEST.md for the integration boundary.

Current research remains partial: **61/85 rules corroborated, 22 single-source and two conflicts; 84/168 field slots still empty**. PR16 stays draft. Structural checks establish data/reference integrity and finite proposal phase exits; they do not certify missing Nintendo behavior or execute the proposed games.

The 2026-10-09 repair corroborates one narrow rule: literal Jamboree Buddies do not appear under Jamboree TV Tag Team Rules. Mario Wiki and Matt Kowalski's separately authored NicheGamer review support it at medium confidence. All other rule objects, all factual values, all 28 mode objects and all 196 original proposal phases remain unchanged.

Both complete research passes actually reopened all **26 retained URLs**, recovered every registered short quotation (**230 clips per pass, 460 recoveries**) and rechecked all **309 mode/rule/proposal-phase rows per pass**. Historical capture dates and previous decisions are preserved under reports/historical-before-buddy-tag/. Exa may return cached extracted text; origin HTTP/TLS freshness, installed patches and primary game frames were not inspected.

From this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # expected exit 1: original research standard remains NOT_MET
sha256sum -c SHA256SUMS.txt
```

VERIFY.md and validator-output.txt record actual commands, complete suite/case counts and outputs. The original 12 rejection fixtures remain, with ten additional research-scope fixtures for this repair. The existing read-only 30-minute B20 workflow reruns the full structural/checksum and unchanged strict gate. Its delivery artifact contains the actual files and complete outputs for independent exact-head verification.

All phone/TV equations, clocks, RNG behavior and scoring thresholds identified as proposals remain original design choices; prototype gameplay is unexecuted. No unsupported exact clock, probability, reward, unlock or patch scope was guessed.
