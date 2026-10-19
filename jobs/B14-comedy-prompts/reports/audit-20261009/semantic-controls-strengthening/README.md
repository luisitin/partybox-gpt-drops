# Semantic negative fixtures

The historical 2f packet genuinely accepted 27 negative and one positive CLI
controls. Those controls established same-size and same-genre scope. Reinserted
original candidates omitted the required confidence field, and the fixtures did
not independently check the combined named-reference cap. The semantic checker
did not read either condition, but those fixtures did not isolate the defect
from every other data constraint.

The current fixture builder derives confidence from both unchanged original
grades and selects a same-genre removal that preserves the combined cap of 3.
Before invoking the production semantic CLI, it independently validates all
1,200 schema records, unique IDs, 600 rows of each genre, original candidate
words/references, both grades of at least 4 and the derived confidence. Every
negative fixture preserves these constraints and fails on the restored explicit
premise pair; every reviewed pair is at or below 0.75 in both forms/directions.

The actual 28 strengthened controls passed at 13:52:33.769516 UTC. Children
closed naturally, temporary fixtures were removed, and all input bytes stayed
unchanged. Full stdout, stderr and report are retained beside the old script.
This is a verification improvement, with no prompt or grade change and no formal
KEEP credit. The hosted packet for this newer source still needs independent
whole acceptance. These controls cover only the 27 personally reviewed pairs;
they do not claim a complete semantic or factual-cue oracle.
