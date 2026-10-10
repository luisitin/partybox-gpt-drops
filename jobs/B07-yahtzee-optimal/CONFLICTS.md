# Original target and official Joker rules

The prompt requires official rules and empty-card EV rounding to254.5896.
These requirements select different scoring conventions.

Hasbro US40958 forces a later Yahtzee into matching upper if open, otherwise
open lower, otherwise another upper for0. It applies even when Yahtzee was
scratched0; only extra100 disappears. Verhoeff's historically published OSYP
rules permit any open category and apply fixed Joker scores only when matching
upper is filled.

| Convention | Actual primary EV | Independent EV | Four decimals |
|---|---:|---:|---:|
| Hasbro forced default |254.58772873449593|254.5877287344961|254.5877|
| Explicit published |254.58960948196315|254.58960948196366|254.5896|

The computed gap is about0.00188074746722 points. Both independently generated
tables agree below1e-12 at every valid state. No target enters either generator
or production result. The coordinator approved official default plus explicit
historical mode. The literal contradictory conjunction is not claimed passed.

The newer English-Canadian00950 download has different threshold/Joker
wording. This job fixes US40958 and63-inclusive upper threshold, matching the
specified US model. SOURCES.md and reports/research-exa-raw.json retain evidence.
