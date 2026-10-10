# Sources and corpus provenance

Accessed October 6, 2026 America/Chicago (CI timestamps may be October 7 UTC).
Raw bytes, selected outputs, counts and SHA-256 values are pinned in
`data/snapshot-manifest.json`. The cache is checked against this committed lock.

## U.S. Census Bureau, 1990 frequently occurring names

https://www.census.gov/topics/population/genealogy/data/1990_census/1990_census_namefiles.html

Brief excerpt: "Frequency in percent" and "Rank". The page links the male-first,
female-first and surname files and documents their columns. These are aggregate
historical name frequencies, not personal records and not a current ranking.

https://www2.census.gov/topics/genealogy/1990surnames/dist.male.first
https://www2.census.gov/topics/genealogy/1990surnames/dist.female.first
https://www2.census.gov/topics/genealogy/1990surnames/dist.all.last

Selection: deduplicate given names, rank by maximum of the two sex-specific
frequencies (alphabetical ties), take 5,000, then append highest-ranked distinct
surnames until exactly 20,000 unique strings. This is NOT an official combined
first/last top-20,000 ranking; the weighting/selection is disclosed, not inferred.
No moderation-result or length exclusions enter corpus selection.

## first20hours/google-10000-english, original frequency list

https://github.com/first20hours/google-10000-english/blob/master/README.md
https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt

Brief excerpt: "10,000 most common English words in order of frequency".
The maintainer describes the list as derived from Peter Norvig's compilation of
Google-corpus frequencies and separately provides swear-free lists. We use every
entry of the original 10,000-row list, not a filtered replacement. Frequency does
not imply benign meaning, nor does the list prove every entry is a dictionary word.
No separate repository-wide license was verified; this delivery makes no claim
about such a license. The retained test snapshot is a list of short word tokens;
no README article or other prose is reproduced.

## GeoNames cities15000

https://download.geonames.org/export/dump/readme.txt
https://download.geonames.org/export/dump/cities15000.zip
https://www.geonames.org/export/

Brief excerpt from readme: "This work is licensed under a Creative Commons Attribution 4.0 License".
Credit: GeoNames, https://www.geonames.org/ ; license:
https://creativecommons.org/licenses/by/4.0/
Changes: select the 2,000 largest-population unique case-insensitive city names
from the snapshot, tie by GeoNames ID, retain name/ID/country/population. The source
is not a current population census or a proof of population accuracy. The JSON
schema/selection and digest, not real-world population truth, are under test.
All original place names remain intact, including 57 over the 16-point limit.
The upstream extract changes daily; a changed snapshot fails verification rather
than being silently substituted. Use the retained cache to reproduce old results.

## Unicode Consortium, UTS #39

https://www.unicode.org/reports/tr39/tr39-34.html

Consulted for the distinction between normalization and confusable detection.
Brief excerpt: "Conformance to the Unicode Standard does not imply conformance to any UTS."
The filter uses a bespoke finite mapping table plus JavaScript NFKD; it does not
copy the complete confusables table or claim UTS #39 conformance. The test ledger
records Node and its Unicode version because built-in Unicode behavior is versioned.

## Project requirements

https://github.com/luisitin/partybox-gpt-drops/blob/main/README.md

Read before implementation. All changes are confined to jobs/B19-name-filter/
plus the explicitly required read-only, pull-request-scoped B19 workflow.
The blocklist and exception decisions are authored moderation policy, not sourced
claims that every use of a listed string is abusive.

## Exact retained snapshot added October8

New exact-head hosted CI failed because the daily GeoNames source changed from
the original lock. The preserved original selected32,000-row cache was available
and matched every original output digest. It is now delivered unchanged under
`data/retained-snapshot/`, with the same original provenance/attribution above.
Clean runs verify every digest/count and manifest before copying any cache
file; corrupt/missing files fail closed. No source lock, original selection,
row, spelling or moderation expectation changed. This is reproduction of the
original dataset, not a new source or a claim about current city populations.
