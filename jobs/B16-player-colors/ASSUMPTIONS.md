# Assumptions

- Display colors are 8-bit sRGB. CIEDE2000 uses D65 Lab and kL=kC=kH=1.
- Machado severity-1 matrices operate on linear-light sRGB, followed by gamut
  clipping and sRGB encoding. The exact published decimal matrix entries are used.
- The first eight colors must be separated by at least20 in normal viewing;
  all twelve must be separated by at least12 in normal/protan/deutan/tritan views.
  The stronger first-eight20-in-all-views reading will also be reported explicitly.
- The named text and fill contrast rules apply to the stated normal sRGB colors.
  Simulated contrast is reported additionally rather than silently substituted.
- A numerical search failure is not proof of mathematical impossibility. Any
  incomplete acceptance requirement remains a failing gate and is documented.
