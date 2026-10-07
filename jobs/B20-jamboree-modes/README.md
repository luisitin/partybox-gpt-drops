# B20 — Every other Jamboree mode, buildable specs

**Research PARTIAL; original phone/TV prototype specs provided.** The roster contains 28 normalized records: 13 top-level modes/mechanics/rules and 15 child activities, difficulties or variants. Standard base Mario Party is excluded; Pro Rules and Jamboree Buddies are identified as a variant and a mechanic. Menu hubs are not counted as extra playable modes.

`modes.json` links 85 sourced rule records in `rules.json`, per-field coverage, observed/reported lengths and one original adaptation spec per record. One `modes/<id>.md` per record explains the facts and concrete phone/TV controls, state, scoring and seven phases. The common protocol specifies server authority, input envelopes, rate limits, disconnect handling, derived events and global exits. Proposal physics, timings and score thresholds are explicitly labeled; they do not fill gaps in Nintendo research.

All 28 presence records have two publisher lineages. Among the 85 rules, 60 narrow core claims are corroborated, 23 remain single-source and two preserve conflicts/ambiguities. Missing exact field/qualifier evidence appears under UNVERIFIED. Unknown clocks, probabilities and counter rules are not guessed.

The retained original plus incremental audit records cover all 25 URLs in both passes and recover all 229 registered quotations, 458 recoveries total. Seven relevant sources were reopened/read in both new passes; unchanged sources retain their original captures. All 309 retained mode/rule/phase rows have two review decisions. Source captures hold only short quotations, retrieval metadata and retrieved-markdown SHA-256 fingerprints. Cached content may be returned; neither primary game frames nor an installed game version were verified.

## Verification

The completed local structural run passes 18/18 suites and 2,830 cases; the final manifest adds a nineteenth suite and 117 hashes (2,947 cases). All 12 deliberately invalid fixtures are rejected. `--strict` completes and returns 1 because the original research standard remains unmet. CI checks this explicit outcome as well as data integrity; a green run does not certify the unresolved research or execute the prototype gameplay. The original full-source standard remains unmet for the listed single-source/conflicting rules and field gaps. Keep PR16 draft.

Rerun from this folder with `python3 -m pip install -r requirements.txt`, `python3 verify.py --structural --checksums`, `python3 verify.py --strict` (expected exit 1), and `sha256sum -c SHA256SUMS.txt`. Actual output is in `validator-output.txt`.

Repository `luisitin/partybox-gpt-drops`; branch `job/B20-jamboree-modes`; files confined to this job and its B20 verification workflow. All files remain below 30,000,000 bytes.
