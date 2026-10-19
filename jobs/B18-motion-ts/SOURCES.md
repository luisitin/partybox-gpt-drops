# Sources

## S1 - CSS easing definition and named controls

W3C, *CSS Easing Functions Level 1*, sections 2.2 and 2.2.1:
https://www.w3.org/TR/css-easing-1/

Checked: valid x controls, unbounded y, mapping progress through x to y,
endpoint-tangent extrapolation, and named curves. The constants used are:

```
ease         (0.25, 0.1, 0.25, 1)
ease-in      (0.42, 0,   1,    1)
ease-out     (0,    0,   0.58, 1)
ease-in-out  (0.42, 0,   0.58, 1)
```

Quote (15 words): "Both x values must be in the range [0, 1] or the definition is invalid."
No browser source code was copied. The specification defines the behavior;
Newton/bisection and stable residual choices are implementation decisions.

## S2 - Damped oscillator equation and all three cases

MIT OpenCourseWare, 18.03SC, *Under, Over and Critical Damping*, pages 1, 4 and 5:
https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/7e212064ad281d00e1dac893b1f722a7_MIT18_03SCF11_s13_2text.pdf

The page images were inspected as well as the text. The equation and
under/over/critical classification inform the runtime; the explicit overdamped
and critically damped examples supply fixed regressions. The velocity formulas,
stable evaluation rearrangements, and conservative settling bound are derived
in this job and cross-checked numerically. No source code is copied.

## S3 - Pinned development compiler

Official npm registry metadata for TypeScript 5.8.3:
https://registry.npmjs.org/typescript/5.8.3

The version, tarball URL and SHA-512 integrity in package-lock.json were checked
against this metadata. This is a development dependency, not a runtime import.
The local tests used the installed TypeScript 5.8.3 compiler; network access from
the local shell was unavailable, so a clean registry install is a separate CI
check rather than a claimed local result.

## S4 - CI artifact treatment

Official actions/upload-artifact documentation:
https://github.com/actions/upload-artifact

The workflow explicitly includes hidden files because its narrowly scoped
output directory is `.work/results/`. It does not upload the working directory,
node_modules, environment files, or credentials.
