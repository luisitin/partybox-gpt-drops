# Exact retained test corpus

These are the original20,000 Census aggregate name tokens,10,000 unfiltered
common-word entries and2,000 selected GeoNames cities used by the October7
full verification. Each exact byte digest remains the original committed
`../snapshot-manifest.json` value. No name, word or place was replaced, removed,
truncated or selected by moderation outcome. No live data lock is refreshed.

Source attribution, historical selection and conflicts are in `../../SOURCES.md`
and `../../CONFLICTS.md`. GeoNames data: https://www.geonames.org/ ;
CC BY4.0: https://creativecommons.org/licenses/by/4.0/ ; changes: select original
2,000 unique cities by population and retain name/ID/country/population fields.
The Census data are public aggregate historical frequencies, not personal
records. No separate license for the upstream common-word repository was
verified; this remains a snapshot of short word tokens, not copied prose.

Clean CI copies this snapshot into the cache only after validating every exact
output digest/count and manifest. This avoids daily GeoNames drift while
retaining all prescribed cases. Corrupt or incomplete snapshots fail closed.
