# B06 Jamboree CPU behavior and transparent policy

`cpuPolicy.ts` implements four pure functions over `types.ts`: branch choice, item use, shop purchase and star purchase. See `CONTRACT.md` for exact legal state and decision semantics. This is an original policy with explicit design parameters; it is not a recovered Nintendo implementation.

## Reproduce

Use Node 22 or later. Run `npm ci --ignore-scripts --no-audit --no-fund`, then `npm test`. The command strictly compiles both independent implementations and runs all code gates for seeds 1, 2 and 3, including 25 separately compiled, actually executed source mutants each time. It also validates the research JSON schema and source mappings. `node tests/research-strict.mjs` separately fails while evidence gaps remain.

The independent author sealed its code and 80 hand-written scenarios before reading production. Production was also sealed before the authoring snapshots were exchanged. `reference.ts` is copied unchanged, and `blind-authoring/` preserves the original authoring record, seal and selfcheck. `tests/scenarios.mjs` adapts those expected cases to either implementation and adds per-case arithmetic explanations in every report.

## Toy board

Each of 10,000 games per seed has two players, Easy then Hard, each starting with 20 coins, zero stars and a single 5-coin item. There are twelve rounds. A fair injected random draw awards six coins to one player as a minigame prize, then both receive two coins. Each selects an item, a deliberately poor shop deal costing six coins, and a branch: star encounter (no coin gain), work (+8 coins, no encounter), or trap (actual -6 coins, no encounter). An available star costs twenty coins. The same board, legal choices and random generator apply to both difficulties. Highest star count wins, then coins; ties count against the Hard win rate. All inputs, effects, decisions and scores are replayed with the independent implementation.

The toy intentionally exercises simple decision tradeoffs. Its measured advantage demonstrates the documented model's behavior on this included board. It does not measure Nintendo CPU win rates or real minigame skill.

## Research limits

`research.md`, `research.json`, `research.schema.json`, `SOURCES.md`, and `CONFLICTS.md` record supported facts, the scope of eyewitness reports and every coverage gap. In particular, the four difficulty levels' exact branch/item/shop/star/buddy/minigame probabilities remain unverified. Reports are not silently promoted into deterministic rules. See `VERIFY.md` for actual counts and remaining limitations.
