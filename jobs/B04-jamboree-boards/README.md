# B04 — All Jamboree boards, space by space

**Research PARTIAL.** Seven current boards with 16 baseline, Tag Team and angry count profiles; 176 type-count rows; 35 inventory profiles and 215 item rows. Includes sourced Star, event, path, phase, Homestretch and TV rules, seven detailed board documents, eleven cited regional connections, closed schemas and evidence audits. Unknown exact adjacency, event completeness, gate positions and unsupported qualifiers are explicit.

518 factual rows: 29 corroborated, 479 single-source, nine conflicting and one unknown. The original research standard remains NOT_MET. All unresolved count profiles are listed in CONFLICTS.md. Keep PR18 draft.

Both passes reopened all 21 retained URLs and recovered all 357 quotations (714 recoveries). Every 593 retained row was reviewed twice; 391 numerical/table rows additionally compared against exact fresh source cells twice. Ten map images were retrieved and visually reviewed twice; only citations and fingerprints are published. Both passes use the same assistant and retrieval may be cached.

## Verification

Completed local structural checks pass 23 suites and 4,712 cases; the final manifest adds a twenty-fourth suite and 67 hashes, totaling 4,779 cases. All 12 deliberate invalid fixtures are rejected. The strict command completes with the documented exit 1. Actual output and every row are logged in VERIFY.md. CI checks integrity and that explicit unmet verdict.

From this folder:

```sh
python3 -m pip install -r requirements.txt
python3 verify.py --structural --checksums
python3 verify.py --strict  # expected exit 1
sha256sum -c SHA256SUMS.txt
```

Fresh research requires reopening the cited URLs and reviewing changed qualifiers; the offline verifier makes no live-page-freshness claim. No Nintendo executable, RNG or live game behavior is tested. Exact latest-head artifact CI is linked in the PR description after observation.

## Data interpretation

Inventory profiles are host/ruleset alternatives, not physical shop counts. `conditionRulesScope=tag_team` limits that update qualifier to Tag Team; it does not make an ordinary item exclusive to Tag Team. `itemRulesRestriction=tag_team` specifically restricts Together Dice. Steamer Ticket’s reported price is initial, not a fixed later price. Numeric baseline count tables are not Pro Rules or post-Homestretch layouts. Shared TV rule IDs appear in each board’s tvChanges list; local layout changes remain in its scoped count profiles.
