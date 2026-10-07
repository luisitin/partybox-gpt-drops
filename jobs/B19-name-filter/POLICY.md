# Moderation contract

## Domain and order

`nameFilter(unknown)` returns frozen `{ok:true}` or `{ok:false,reason}` values.
Non-strings fail with type. More than 16 Unicode code points fail with length;
the count precedes trimming and normalization. C0/C1 controls, malformed surrogate
code points and bidi formatting controls fail with control. After NFKD, lowercase,
mark removal, format-character removal and trim, at least one Unicode letter or
number is required (empty otherwise).

The 289 exact exception spellings in data/policy.json are tested at this stage.
Exceptions do not operate on arbitrary substrings and do not apply after leet
or homoglyph substitutions. Diacritics, case and compatibility-equivalent forms
can normalize to an exception; arbitrary extra letters cannot.

Each remaining code point is mapped by the declared finite groups. Digits/symbols
include 0->o, 3->e, 4/@->a, 5/$->s, 7/+->t, 8->b, 6/9->g, 2->z, !->i;
1 and | remain ambiguous i-or-l. Selected Cyrillic/Greek/other single-character
lookalikes are explicit in the file. Punctuation/symbol/separator characters are
ignored only after mapping. Unmapped letters/numbers create a barrier rather than
being silently deleted. This does NOT implement the complete UTS #39 data set.

The 63 English-policy terms are matched as substrings in either direction.
Every original run requires at least its original letter count: boob needs two
o's, so Bob is not a match. Additional repetitions are recognized. Unknown scripts,
multi-character glyph constructions (for example vv for w), phonetics, arbitrary
insertion of other letters, and every possible language/slur are outside the
verified coverage. The generator does not claim exhaustive coverage of that space.

## Scunthorpe cases

Scunthorpe, Penistone, Hancock, Hitchcock, Cockburn, Dickinson, Dickson, Cummings,
Sussex, Essex, Sexton, Cumberland, Analysis, Canal, Cockatoo, Cocktail, Cucumber,
Nigeria and Niger pass as exact benign spellings. Bob, Bobby and Bobbi are
regressions for the required-double-letter bug discovered during development.
A benign word must not act as an arbitrary bypass: Hancocksex remains blocked.
Non-abusive identity descriptors such as transsexual are explicit exceptions;
identity alone is not classified as a slur.

## Kept conflicts

The Census strings Lana, Dick, Bonner, Coon, Stitt, Dyke, Boner, Dicks, Coons,
Dykes and Raper remain rejected. These are counted as real-name false positives,
not renamed true positives. Lana reverses anal. Bonner is boner with a repeated n.
Stitt reverses to ttits. Dick/Coon/Dyke/Boner are exact lexical collisions; the
plural/agent-noun cases remain blocked by the declared policy. A context-free
function cannot decide which intent produced an identical case-insensitive name.

In the English corpus, 48 explicitly sexual/profanity/adult-content entries remain
blocked and telecommunications is overlength. Among 2,000 places, no in-domain
lexical rejections remain, but 57 original names exceed 16 code points. They are
reported in full; no replacements, truncation, or silent corpus filtering is used.

The exact first-scan exceptions are recorded in data/exception-review.json. This
is an exposed regression set, not a claim of performance on unseen real names.
All remaining original-input rejections and reasons are data/kept-rejections.json.
A maintainer can change this policy, but must review matching tests and collisions;
there is no user-supplied allowlist that can bypass filtering at runtime.
