# Algorithm and correctness argument

These are implementation-specific mathematical arguments, not a machine-checked proof or a claim that testing makes defects impossible. Legal end-of-turn partitions are the model; the precise rule edition and objective are stated in the README and sources.

## 1. Complete finite candidate family

A group is enumerated for each value and each three- or four-color subset. For every slot, the enumerator independently tries the matching numbered resource and each unused physical joker, even when a numbered tile is available. Thus a useful numbered tile can be reserved for another meld rather than forcing a natural-only choice.

For each color, every consecutive interval of lengths 3, 4 and 5 is enumerated with all joker substitutions. Any longer legal run can be split into a length-three prefix and its suffix; repeated splitting eventually yields only lengths 3, 4 and 5. This preserves every physical tile, every joker binding and every score. It does not imply that the table validator rejects longer runs: the validator accepts runs up to 13, and the reference oracle enumerates them directly.

With at most two jokers, every meld has a numbered tile. A candidate cannot use the same physical joker twice or the same numbered face twice. Candidates with an identical resource subset have identical compatibility with all other melds; retaining the binding with the highest hand-joker value dominates all lower-value bindings. Equal-weight representatives are resolved in a deterministic enumeration order.

## 2. Resources and mandatory copies

Numbered copies with the same face are interchangeable for set feasibility. A resource stores their count (0, 1 or 2), physical IDs, and original hand count. Table copies precede rack copies for reconstruction. Jokers are separate resources because the objective differs between a joker already on the table and a joker supplied from the rack.

At a state with residual count `c` and original rack count `h`, a resource is mandatory exactly when `c > h`. Equivalently, the already used count is still below the original table count. A mandatory pivot cannot be skipped; an optional pivot may lose one unused rack copy. Once enough equivalent numbered copies have been selected, reconstruction assigns the old table IDs first, then any used rack IDs. Therefore no old tile is silently returned to the hand.

The opening search contains only rack resources. The already valid table is copied untouched into the output, and the opening threshold is applied to the maximum achievable new value. If even that maximum is below the threshold, no valid opening exists under the chosen model.

## 3. Exact recurrence

Let `F(c)` be the best encoded weight attainable from a residual count vector while covering its mandatory copies. Let `p` be the first nonzero resource in value-then-color order. A complete solution either uses `p` in one of the feasible candidates containing it, or skips one copy when it is optional:

```
F(c) = max({ w(m) + F(c - m) : feasible meld m contains p }
           union { F(c - e_p) : p is optional })
F(0) = 0
max(empty feasible choices) = -Infinity
```

Every edge strictly decreases the remaining physical tile count, so recursion terminates. Every legal partition induces one of these choices at every pivot. Memoization only reuses identical relevant residual states. No time limit, node limit, beam width, random sampling or heuristic answer is substituted.

Each candidate weight is `128 * value + tileCount`. Numbered tiles score their face; a rack joker scores its represented value; an old table joker contributes zero value. The old numbered table total is a fixed baseline subtracted at the end. The table tile count is also fixed, so maximizing total used count breaks ties exactly as maximizing rack count does. Since there are at most 106 physical tiles, a one-point increase dominates any possible tile-count difference.

The residual upper bound counts all residual numbered face values, treats each residual rack joker as at most 13, and includes each residual tile in the count component. An old table joker contributes only that component. It is admissible even for an infeasible residual state. A branch is pruned only when it cannot strictly improve the incumbent; tied branches need not replace an already valid witness.

## 4. Frontier memo key

Resources are sorted by ascending number, then color, with physical jokers at the end. Every candidate spans at most five numerical values. Before the current pivot, all resources are exhausted. A candidate selected at an earlier pivot can have reduced only resources at most four values ahead of that earlier pivot. Consequently, among numbered resources at or after the current pivot, only the next twenty indices can differ from their original counts. Four colors times five values bounds that window even when some resource types are absent. All further numbered counts are unchanged; all earlier counts are zero.

The key includes the absolute pivot, twenty count-at-least-one bits, twenty count-equals-two bits, and two physical-joker availability bits. All are exact integers. The layout uses at most 48 bits, below JavaScript's 53-bit exact integer range. Signed 32-bit masks are normalized when splitting the numeric key into low and high words.

A linear-probed memo table stores both key words and compares both on lookup. Hash collisions do not imply state equality. It grows at 70% occupancy. Values encode score and witness choice in an unsigned word. There are at most 949 group and 2528 short-run template assignments before deduplication (3477 combined); a 12-bit choice field plus an offset of 64 accommodates every candidate index and every skip sentinel. With this deck, the packed score stays below 2^32.

The larger-position audit mechanically replaces the entire compressed-key/custom-memo block with a full four-word inventory string key and built-in Map. It then compares both value/count and the exact deterministic table witness on every benchmark position. This specifically audits compression and storage; it is NOT independently authored search logic and does not replace the small exhaustive oracle.

## 5. Joker symmetry and availability indexing

Two rack jokers are interchangeable with one another, as are two table jokers. A rack joker is not interchangeable with a table joker. When both equal-origin jokers are available, branches using only the second joker are redundant: swap their physical labels in the entire solution to obtain a branch using the first. Branches using both are retained.

For each pivot, four candidate lists are precomputed for the four possible physical-joker availability masks. Each list preserves the same descending-weight order and excludes only unavailable-joker candidates or the proved symmetric alternative. This reduces failed feasibility scans; it does not change the feasible optima or introduce a heuristic cutoff.

## 6. Independent small reference

`reference.ts` has its own types, validators, meld recognition, explicit bindings and scoring. It imports no production code. For at most 14 total physical tiles it checks all physical subsets, accepts every possible group or run of any legal length, then uses exhaustive disjoint-subset partition reachability over their unions. It tracks mandatory old IDs directly rather than interchangeable counts. This provides a different algorithm and a different representation from the production recursion.

Values and played counts must agree; equal optima can have different valid partitions. Both validators check both returned partitions and transitions. Hand-authored rules fixtures guard against shared rule misinterpretation. Color/ID/order metamorphic tests, source mutation tests and large full-state comparisons cover additional implementation risks.

Both sources were written by the same assistant, with the reference written first. That fact does not establish the requested no-looking, separate-author independence; it is explicitly unverified.

## 7. Output boundary and scope

Successful plays are revalidated by the production transition validator before return, and their value is recomputed from physical IDs. Passes copy a previously validated table. Tests recheck both kinds of output using both table validators; play outputs additionally pass both transition validators. Invalid ordinary input shapes return error values rather than entering search.

This is an end-state solver, not a complete game engine or an adversarial JavaScript-object sandbox. Optimality is for the documented additive immediate objective. Test results establish the reported cases, not a universal performance theorem or perfect implementation correctness.

## 8. Separately authored blind reference

`blindReference.ts` was sealed at 8564ea3 before its author or the integrating lead inspected production. Its own validators, literal small physical-subset enumeration and larger exact cover are independent of production helpers. The primary tests now use that source; `reference.ts` is retained as historical supplemental code. The large reference path is undergoing independent performance work. Actual completed coverage is recorded in VERIFY.md.
