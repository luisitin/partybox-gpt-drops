# Next step

B16 is complete for the original brief (canonical 16-bit palette: three seeds, 25 mutations, hosted run on PR #15).

Polish pass 2026-10-08 (done on this branch): the canonical palette fails its gates after 8-bit rounding, so PartyBox uses `partybox/palette-12.json` (8-bit, same gates, ring rule). `npm test` now also runs `tests/partybox.mjs`.

Next, owner decision: accept the ring rule (see INTEGRATION.md "Must" 2) and port `partybox/tokens-player.css`; or ask for a new search that keeps the literal fill-on-light rule. Human CVD viewing check still open. Re-run `npm test` after any palette change.
