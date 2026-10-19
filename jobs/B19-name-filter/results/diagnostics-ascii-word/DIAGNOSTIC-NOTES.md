# Diagnostic only; never an acceptance replacement

Command: node --trace-gc --trace-opt --trace-deopt tests/run.mjs.
This repeats the unchanged behavioral and timing workload with V8 diagnostic
instrumentation. It does not replace the uninstrumented full npm test receipt
in ../optimization-ascii-word/. Diagnostic timings remain failures.

The log records benchmark-function optimization/deoptimization between its
warmup and final timing report, including insufficient type feedback, on-stack
replacement and concurrent optimization. Garbage collection and incremental
marking also appear around these phases. These observations demonstrate runtime
work outside the pure filter algorithm; they do not prove the cause of every
individual outlier or establish a controlled-latency guarantee.

The diagnostic additionally reports delivery-checksum failures because the
original passed attempt was copied into results/ before this diagnostic and the
expanded delivery manifest had not yet been regenerated. Those inventory
failures are retained, not mislabeled as behavioral failures or passes. The
normal full attempt had valid delivery checksums and failed only literal timing.
The final published inventory is independently regenerated and checked.
