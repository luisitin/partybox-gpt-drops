# Independent second grading

Read only the handed-off file under `review-inputs/` and these instructions when
grading. Do not read `candidates.json`, `batches/`, or first-author grade reasons.
The seal file contains only hashes and IDs and is safe to consult.

Grade every candidate 1-5 with a specific one-line editorial reason. The rubric
requires immediate first-read sense, an outrageous or somewhat morbid premise,
and familiar household cultural references. Random non sequiturs and merely
mechanical template variations should score below 4. A 4 is clearly playable;
a 5 is unusually sharp. The most-likely genre should invite friends to identify
someone plausibly guilty of its recognizable absurd behavior. Fill prompts need
a clear setup that allows several funny answers rather than one prescribed joke.

Reject slurs and anything involving minors. Check named-reference tags against
the text; report missing or mistaken tags. The combined final pack will permit
at most three prompts per named brand/person, so do not silently reinterpret that
cap as separate per genre. Review the wording itself without considering how the
first author might have scored it.

Return JSON with `reviewer`, `batch`, `reviewInputSha256`, and `rows`, each row
containing `id`, integer `grade`, and `reason`. Preserve all rows, including grades
below 4. Send any wording fixes as proposals; changing a sealed prompt requires
new grading of the changed wording.
