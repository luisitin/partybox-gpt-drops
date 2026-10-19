# Focused English-name research

The spelling **Sandwiched** is now supported by two independent publisher families: the individual Super Mario Wiki page and Chris Penwell's authored Destructoid guide. The guide names it in a six-game demo list and refers to Destructoid's own hands-on coverage. This supports the English name only; it does not corroborate every gameplay rule.

Mario Party Legacy still prints **Sandwhiched**. Its raw entry and the strict source-set difference remain unchanged. No alias is accepted merely because the spelling or category looks similar.

**Squeaky Shakedown** has wiki-family English-name evidence only. Legacy still prints **Squeaky Showdown**. Independent English-name corroboration and the identity linkage remain UNVERIFIED. Nintendo Japan supplies the Japanese sandwich title and four-player label, but neither disputed English name.

`name-evidence.json` records five source URLs, provenance families, short quotations and locators, original pass-one timestamps, fresh pass-two timestamps, byte hashes and 20 quote checks. Original responses were separately retained outside the checkout. All ten recorded hashes were checked against their respective snapshots before parsing. An earlier outside-checkout report selected an overwritten second-pass file as pass one; that metadata was superseded before delivery. The committed evidence uses explicit original provenance records and distinct response paths.

`name-evidence-current-recheck.json` is an additional executed two-pass check from the delivered helper. It reports 20 passing quote-presence/length checks, ten successful requests and distinct response paths. These automated checks establish quote presence and retrieval integrity; source independence and the interpretation of each quotation were reviewed separately.

Reopen the sources without replacing historical evidence, from the repository root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 jobs/B03-jamboree-minigames/check-name-evidence.py --evidence jobs/B03-jamboree-minigames/name-evidence.json --output /tmp/b03-name-fresh-check.json
```

The output must be a new file. Use `--snapshot-dir /tmp/b03-name-fresh-snapshots` with a new directory to retain separate response bytes. Otherwise the helper hashes and parses each distinct temporary response before removing it. Curl retains default TLS verification and the inherited proxy.

## Source-discovery limits

The focused follow-up checked 26 additional routes: fifteen returned HTTP 200 and eleven had a specific CONNECT 403. Correctly identified GameFAQs review/FAQ/cheat material and a CGMagazine review/search supplied no independent Squeaky name. Search-term echoes were rejected as evidence. A guessed GameFAQs slug returned an unrelated Golf In Wonderland page and was rejected; a successful HTTP status alone does not establish source identity.

The official Japanese minigame page and Destructoid guide are reachable. Some other publisher/search destinations and YouTube remained denied; Game8 returned HTTP 402 `payment_required`. No payment, authentication or verification bypass was attempted. Failed discovery does not establish that an independent source cannot exist elsewhere. The exact additional-route diagnostics are retained in `name-search-access.json`.

Both Legacy identity linkages and independent English **Squeaky Shakedown** evidence remain incomplete. Final per-game B03 requirements are unchanged by this narrow research gain.
