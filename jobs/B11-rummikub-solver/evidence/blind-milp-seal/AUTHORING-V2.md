# Independent B11 full-size oracle amendment

## Blind authoring boundary

The original seal remains unchanged. In particular, `reference.ts` is still
SHA256 `dd1439b64a5f46124ba452a2bd54091ab05006f45b1bf1e110bc31645212a3c8`.
Its literal physical-subset oracle remains the reference for every case with
14 or fewer resources. Its independently authored validators check the amended
oracle's input, final table, transition, values, rack penalty, and remaining hand.

During this amendment the author read only their own previously authored files,
the public contract messages, and `LARGE-PUBLIC-INPUTS.json` supplied by the
integration owner (ten public positions, with no answers). The permitted original
prompt, root README and rule documents read in the first phase are listed in
`AUTHORING.md`. No B11 production, old reference, tests, generators, algorithm
notes, job README, implementation excerpts, or expected answers were opened.
Feedback that the first sealed full-size search did not finish was performance
information, not another implementation's algorithm or answers.

The intermediate `large-solver-v2.ts` and `reference-v2.ts` attempted a new
multiset exact-cover recurrence, but remained too slow. These unsealed drafts are
not integration deliverables. The final amendment is `milp-reference.py` and the
own witness/self-check helpers named in `SEALED-V2-SHA256SUMS.txt`.

## Independently formulated integer model

Each numbered face has an available count and a mandatory old-table count.
Every physical joker has its own labelled resource row; an old joker is required
once and a rack joker is optional at most once. Candidate columns independently
enumerate all same-color ascending run intervals and every three/four-color
group, filling each slot with its available numbered face or an unused labelled
joker. No production candidates or answers enter the model.

Columns with identical consumed numbered faces and labelled jokers retain the
binding with highest NEW-rack-joker represented value. This is a local dominance
rule: old joker bindings do not score, and bindings do not couple separate melds
under the supplied end-of-turn rule profile. Runs of length six or more then
leave the optimization model: repeatedly splitting off three tiles gives runs
of lengths three to five, preserving every physical tile and every joker's
represented face, hence preserving feasibility and both objective components.
All shorter pieces occur in the exhaustive enumeration. Every group stays.

An integer column multiplicity is between zero and its available-copy limit
(at most two for numbered-only columns; at most one with any labelled joker).
Each numbered resource row requires consumption between its mandatory count and
its available count. Joker rows require old jokers exactly once and rack jokers
zero or once. Thus every model solution is a legal partition containing all old
resources; every legal partition has an equivalent model solution.

The model maximizes `128 * representedValue + newRackCount`. At most 106 physical
tiles exist, so this exactly orders value first, rack count second. Numeric old
table values/counts are a constant removed from reported certificate objectives.
Old joker values never score. Physical numbered IDs are reconstructed old copies
first within each face, then rack copies, which preserves all mandatory IDs.
Every joker uses its labelled ID and explicitly selected face. Opening uses
rack-only resources and appends unchanged old melds; if its certified unrestricted
maximum is below 30, no legal opening exists and an analytic pass certificate
retains the underlying MILP bound.

## Solver and certificate boundary

Development-only versions measured here: Python 3.12.14, NumPy 2.3.5, SciPy
1.17.0. The requirement file pins NumPy/SciPy. Production remains independent of
Python and SciPy. Each persistent process forces OMP, OpenBLAS, MKL and NumExpr
threads to one, and sets HiGHS threads=1, random_seed=0, parallel=false,
presolve=true, mip_rel_gap=0. No timeout, state cutoff or approximate success
path exists.

Every numerical solve must return OPTIMAL. The source rounds its witness only
after checking integrality within 1e-5, then verifies all column bounds and every
resource row with exact Python integers. It recomputes the integer objective and
the allocated physical witness value/count exactly. Reported solver primal must
match that integer objective within 1e-5, and the reported dual bound must differ
by less than one integer encoded unit. This is a floating-point optimizer's
reported optimum certificate, not an interval-arithmetic or exact rational dual
proof. That numerical boundary is retained explicitly. Where the witness reaches
the exact inventory upper bound (each rack number plus 13 for each rack joker,
all rack tiles counted), an additional elementary integer optimality proof is
reported; four of the ten public inputs close that bound.

The own Node witness helper then independently validates each table and play
with the unchanged sealed TS validators and recomputes represented value, count,
physical played IDs, rack penalty, and remaining hand. Integration additionally
checks the production validator separately.

## Streaming protocol

Run `python3 milp-reference.py` once. Each nonblank stdin line is one JSON Position
already accepted by the independent TS position validator. Each stdout line is
`{result, certificate, elapsedMs}`. `result` has the public SolveResult shape.
Certificates use NEW rack encoded objectives in the maximizing direction;
`rawPrimalObjective`, `rawDualBound`, and `oldTableConstant` disclose the original
model scale. An empty model has an explicit `analytic-empty-model` backend;
a failed solve emits `{error:{message,line}}` and cannot count as a result.
Diagnostics use stderr. One process amortizes SciPy import time across a corpus.

## Actual checks before the amended seal

`MILP-PUBLIC-10.json` records all ten supplied 40-table/20-hand inputs, freshly
computed. Every one has OPTIMAL status, zero reported primal/dual gap, exact
integer rows, and independently checked physical table/play witnesses. These are
supplemental measurements, not a substitute for all required integration cases.

`MILP-CROSSCHECK-1000.json` records 1,000 newly authored positions compared with
the original sealed literal oracle. Each family has 200 cases: random racks,
concentrated/duplicate faces, old runs, an old joker, and two old jokers. Both
opening states, zero/one/two total jokers, empty/short hands and up to 14 total
resources occur. Every value/count equals the literal optimum; every output
passes the independent table/play/metadata checks. There are no discarded cases.

The integration owner's full 150,000 small comparisons had already passed the
original seal. The full 608 large positions and additional 3,000 accelerator
cross-checks remain integration work; this document does not claim those runs.

## Amended seal

`SEALED-V2-SHA256SUMS.txt` covers the final authored model, own helper/check sources,
pin file, this provenance note, public input data and actual own reports. The
manifest excludes itself and compiled/research files. Hashes are sent to the
root and integration owner before they copy these files. The author continues
to avoid B11 production/old-reference access after this seal.
