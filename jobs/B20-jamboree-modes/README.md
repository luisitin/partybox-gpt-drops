# B20 — Every other Jamboree mode, buildable specs

**Research PARTIAL; original phone/TV prototype specs provided.** The roster contains 28 normalized records: 13 top-level modes/mechanics/rules and 15 child activities, difficulties or variants. Standard base Mario Party is excluded; Pro Rules and Jamboree Buddies are identified as a variant and a mechanic. Menu hubs are not counted as extra playable modes.

`modes.json` links 85 sourced rule records in `rules.json`, per-field coverage, observed/reported lengths and one original adaptation spec per record. One `modes/<id>.md` per record explains the facts and concrete phone/TV controls, state, scoring and seven phases. The common protocol specifies server authority, input envelopes, rate limits, disconnect handling, derived events and global exits. Proposal physics, timings and score thresholds are explicitly labeled; they do not fill gaps in Nintendo research.

All 28 presence records have two publisher lineages. Among the 85 rules, 56 core claims are corroborated, 26 remain single-source and three preserve conflicts/ambiguities. Missing exact field/qualifier evidence appears under UNVERIFIED. Unknown clocks, probabilities and counter rules are not guessed.

Both reopening passes retrieved all 22 retained URLs and recovered all 223 registered quotations, 446 recoveries total. All 309 retained mode/rule/phase rows have two review decisions. Source captures hold only short quotations, retrieval metadata and retrieved-markdown SHA-256 fingerprints. Cached content may be returned; neither primary game frames nor an installed game version were verified.

## Verification

The substantive milestone is awaiting closed-schema, graph/reference, negative-fixture and integrity verification; no completed test or CI result is claimed until VERIFY.md records it. The original full-source standard remains unmet for the listed single-source/conflicting rules and field gaps. Keep PR16 draft.

Repository `luisitin/partybox-gpt-drops`; branch `job/B20-jamboree-modes`; files confined to this job and its B20 verification workflow. All files remain below 30,000,000 bytes.
