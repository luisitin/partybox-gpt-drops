# World-history authoring notes

Author owns B13-0501–0600. Evidence captures are actual HTTP bodies under ignored `.work/world-history/author/`. Short answer and contextual quotes are matched against normalized captured text; this authoring check is not the mandatory fresh review.

## Actual exclusions / conflicts

- Alexander: Britannica gives June 13, 323 BCE for death; World History Encyclopedia gives June 10 or 11. No exact death-day question is authored.
- Genghis Khan: birth chronology is explicitly uncertain in both references. No birth-year question is authored. `Temujin` is the familiar English transliteration; Britannica uses `Temüjin`.
- Qin Shi Huang: sources spell the ruler's title differently and present disputed paternity. No disputed-paternity claim is used; Legalism, Qin, and the funerary terracotta army are supported in both.
- WHE `/Shah_Jahan/` returns a disambiguation/search page with an AI summary notice, not an authored biography. It is excluded. An actual authored Taj Mahal article was separately captured.
- Gutenberg: Britannica says Bible printed in 1455; WHE says 1456. No exact completion-year claim will be used. The wording must limit the mechanized press claim to Europe; printing was developed earlier in East Asia.
- Ashoka: reign/death dates vary between sources. No exact reign/death-year claim will be used.
- Historical builder/ruler/event questions avoid the modern location questions reserved for world-geography.

## Progress

First 20 real rows use five independently authored Britannica/WHE pairs. Both quotes per claim match actual bodies; page quotation totals remain below 200 words. Delivery remains in authoring progress. No fresh review or second source reopening has yet been performed by this author.

## 100-row author milestone (2026-10-07)

Recovered 20 genuine earlier rows and continued to 100; all 400 answer/context quote fields match actual captured source bodies and are at most 25 words. There are 52 independently owned Britannica/WHE article URLs used. Difficulty is 34/33/33 and answer indices exactly 25 each. `evidence/world-history-author-seal.json` binds current files; no fresh adversarial review or second full reopening is claimed. Author-stage factual/quote refinements retain the superseded full rows in `world-history-author-stage-revisions.json`.

Additional exclusions: Black Death sources disagree on ending year (1351 vs 1352), so the question asks its beginning century. The WHE Mehmed article gives an inconsistent siege-opening date; only the agreed conquest year is used. Mansa Musa's exact reign dates, total wealth, pilgrimage entourage and death year are uncertain or differ; no such numerical claim is used. Cyrus's mythical childhood and Croesus's conflicting reported fate are excluded. WHE's original Shah Jahan disambiguation page is excluded; independently authored Taj Mahal context supports the monument questions. A short-topic-only Napoleon quotation was strengthened to the actual civil-law/First Consul narratives before sealing. Britannica sometimes serves only the first chapter; separate genuine French Revolution chapters were retrieved, not treated as if unseen later chapters had been read.

## Fresh-review repairs and final context versions

The separate reviewer challenged all 100 initial rows and requested 14 changes. B13-0533 now tests the Taj Mahal's monument type, removing an exact cross-category commissioner duplicate; B13-0555 tests Jane Seymour as Edward VI's mother, removing the Elizabeth I mother duplicate. The competing Timurid distractor in B13-0536 is removed. The other changes strengthen actual claim quotations and add contextual facts instead of repeating information already supplied in the question. Complete original and intermediate rows remain in `evidence/world-history-review-revisions.json`.

The reviewer also found that WHE's Mehmed bibliography directly links the paired Britannica biography. That second source is excluded from all four current Mehmed rows and retained with its real original retrievals and rejection reason. Actual HTTP retrieval and body reading of Gale's *Encyclopedia of World Biography* at Encyclopedia.com provides the replacement. Its displayed reading list names Kritoboulos, *The Cambridge Modern History*, Edwin Pears and Steven Runciman without citing the paired Britannica page. The entry's unselected “Faith” spelling and unrelated Otluk-beli date defect are explicitly excluded; the selected conquest year, sultan status and Conqueror epithet agree with Britannica.

Other actual replacement attempts are retained in `evidence/world-history-source-exclusions.json`: the National Gallery body did not directly establish all required conquest facts; the attempted Met route returned HTTP 404; the Princeton book page was less direct than a biography body; a composite Encyclopedia.com page risked mixing differently credited entries.

The reviewer independently reopened the replacement biography and freshly challenged every repaired exact hash. All 100 current rows at category SHA-256 `2f2d94ba2515db70b6fa3cf95de67bcdf2423dc2e623d31f81ca19b7a4b12ef8` have separate `accept` and `supported` records. Full-set editorial and final option-order gates remain the lead's integration work.
