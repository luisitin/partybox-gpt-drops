# Independent B18 numerical reference

These sources were authored in `/workspace/blind-b18` before any production
implementation, pre-existing test implementation, previous pull request, or
previous B18 reference was opened. No file under `/workspace/job-B18` was read.
No production source or generated test vectors were supplied to this author.

The only repository files read were
`/workspace/partybox-gpt-drops/PROMPTS.md` for the original B18 requirements and
`/workspace/partybox-gpt-drops/README.md` for repository delivery rules. The
calling agent supplied the public function contract and settling sentinel and
argument conventions in plain text. A separate blind mathematics agent derived
the settling envelope without reading any files or implementation source.

## Sources and protocols

`spring-oracle.mjs` provides an independently expanded classical fourth-order
Runge–Kutta step for the position and velocity ODE. `rk4Step([x,v],dt,m,k,c)`
returns the next state. `rk4Trajectory(m,k,c,x0,v0,steps,dt=1e-4)` retains every
frame, including the initial state. The stepper assumes a valid finite oscillator
and a numerically resolvable step size; its intended required comparison uses
`dt=1e-4`. Random generation and comparison to production belong to the calling
harness, so this module does not invent or omit its random test cases.

`bezier-quad.cpp` is a standalone binary stream evaluator. Build with:

```sh
g++ -O2 -std=gnu++17 -Wall -Wextra -Werror bezier-quad.cpp -lquadmath -o quad-oracle
```

With no arguments it reads five IEEE 754 little endian float64 values per row:
`progress,x1,y1,x2,y2`. It writes one little endian float64 result per row. It
uses GCC `__float128` arithmetic with a 113-bit significand for De Casteljau
evaluation, safeguarded numerical inversion, and endpoint tangent
extrapolation. The search supports up to 4096 iterations, including subnormal
progress values and stationary x curves. Progress zero and one return exact
endpoints. Control x values outside `[0,1]` or nonfinite inputs are disabled to
zero. The caller's main reference comparisons should use valid CSS control x
values. Overflowing finite mathematical outputs saturate at the finite float64
limit. The supported standard named control points are exported as
`namedControlPoints` by the JavaScript module.

With `--spring` it reads six float64 values per row:
`t,m,k,c,x0,v0`, and writes two values: position, velocity. It evaluates the
analytic ODE solutions using quad arithmetic. Invalid/nonfinite parameters are
disabled to `[0,0]`; valid nonpositive time returns the original state.
Spring outputs also saturate at the finite float64 limit. This additional
analytic mode supports semantic fixtures independently from the RK4 oracle.
It does not claim correctly rounded trigonometric phase for astronomically
large oscillatory arguments; the required random RK4 comparison uses ordinary,
resolvable physical scales. Runtime finite guards can separately be checked
for arbitrary finite inputs without claiming a precise extreme phase.

The JavaScript module also exports `spring(t,m,k,c,x0=1,v0=0)` as a convenient
double precision analytic evaluator for the ordinary physical scales used by
the RK4 corpus. Its formulas are independently authored in this directory.
The quad analytic mode is the stronger semantic reference when binary64
intermediate coefficients overflow or underflow; the JavaScript convenience
function does not claim numerical accuracy for those intermediate extremes.

Both protocols report incomplete records on stderr and fail. Successful
evaluation has no textual stdout. The retained executable is only a convenient
local build; source is the portable artifact.

## Conservative settling bound

`settleTime(m,k,c,x0=1,v0=0,epsilon=0.001)` returns a conservative all-future-time
bound for both `|x|` and `|v|`. Invalid parameters or zero initial state return
zero; zero stiffness or damping and unrepresentable estimates use
`Number.MAX_VALUE` as requested by the public contract.

For positive stiffness and damping, write `alpha=c/(2m)`, `omega2=k/m`,
`r=min(alpha,k/c)`,
`A=max(|x0|,|v0|)` and
`B=max(|v0|+alpha*|x0|,alpha*|v0|+omega2*|x0|)`.
The independently derived envelope is

```text
|x(t)| <= (A+B*t)*exp(-r*t)
|v(t)| <= (A+B*t)*exp(-r*t)
```

For underdamping, `|sin(beta*t)|/beta <= t` gives the envelope with decay
`alpha`. For critical damping the exact polynomial gives the same bound.
For overdamping, the hyperbolic basis gives decay
`alpha-sqrt(alpha^2-omega2) = omega2/(alpha+sqrt(alpha^2-omega2))`, at least
`k/c`. Thus the chosen smaller `r` works in all three regimes.

The envelope is decreasing for `t>=1/r`. The implementation doubles `y>=1`
until `log(A+B*y/r)-y <= log(epsilon)` and returns `y/r` with a rounding margin.
All coefficients and comparisons are computed in the log domain. The bound is
deliberately conservative, so other valid settling estimates need not equal it.
An estimate earlier than this envelope proves cannot automatically be treated
as incorrect: tighter regime-specific envelopes or direct future trajectory
bounds can validate it.

## Self-check and sealing

Run `node selfcheck.mjs` from this directory after building the executable.
`SELFCHECK.json` records the actual results for mathematical endpoint,
diagonal-curve, stationary-curve, subnormal-progress, endpoint-tangent,
undamped, critical, overdamped, and free-particle fixtures. It also checks RK4
against explicit elementary solutions at every one of 50000 steps and checks
the settling bound against explicit trajectories. These are author self-checks;
the production comparison suites and million-point seeded comparisons are the
calling harness's responsibility and are not claimed here.

`SEALED-SHA256SUMS.txt` is generated only after successful self-checks. The
calling agent receives its hashes before importing these sources. Source
changes after sealing require a new hash and an explicit authoring record.
