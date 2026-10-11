# Post-seal changes

The initial production/reference files are preserved unchanged as snapshots.
After source exchange, production gained candidateRgb for exact fractional
sRGB/CSS colors, because the original task does not require 8-bit hex. Core
CIEDE2000, Lab, Machado and contrast calculations remain unchanged. candidateRgb
copies the caller RGB, produces a round-trip decimal CSS color, and labels the
old hex field as an 8-bit approximation. The reference remains unchanged.
