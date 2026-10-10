# Sports and games authoring notes

IDs B13-0801–0900 contain 100 actual authored questions. Difficulty is 34 easy,
33 medium and 33 hard; every answer position occurs 25 times. The author read
both supporting source passages and their surrounding contexts. All 400 answer
and contextual quote fields match captured source text and contain at most 25
words. The 61 delivered source URLs have actual author-pass retrieval receipts.
This author milestone is not a completed independent adversarial or source-reopen
pass. `evidence/sports-games-author-seal.json` binds the final author version.

## Scope and excluded disagreements

- Team sizes explicitly scope standard full-sided soccer, full-court basketball,
  baseball fielding, indoor volleyball, full-strength ice hockey, rugby union and
  conventional curling. Futsal, 3x3 basketball, designated hitters, beach
  volleyball, penalties, rugby league, sevens and curling doubles are excluded.
- Original and historical rules are identified for Queensberry boxing; no claim
  says all modern boxing divisions have three-minute rounds.
- The original Webb Ellis rugby-invention story is disputed; the questions use
  the agreed Rugby School association instead.
- Badminton's 1992 official Olympic debut is distinguished from its earlier
  demonstration and exhibition appearances. The 21-point question allows normal
  extension and the scoring cap; 21 does not always end a game.
- Butterfly questions scope surface swimming, since underwater dolphin kicks
  occur in other strokes. Individual medley is distinct from relay medley order.
- A conventional full golf round has 18 holes; nine-hole courses also exist.
- Go's antiquity estimates differ between the references; only the agreed China
  origin is used, without a precise age or legendary invention date. Black moves
  first in an even game; handicap play is explicitly excluded.
- Monopoly's Landlord's Game creation (1903) and patent (1904) dates differ in
  definition, so the question credits Lizzie Magie without asserting a year.
  Charles Darrow is not presented as Monopoly's sole inventor.
- Scrabble's initial development (1931), redesign/name and marketed publication
  (1948) are distinct. The year question asks the game Butts developed that
  became Scrabble, not the date on a later published edition.
- Ancient Olympic 776 BCE is the traditional first recorded date, not proof
  that no earlier unrecorded festival occurred. Ancient pentathlon is explicitly
  distinguished from changing modern pentathlon formats.

## Actual source recovery and corrections

The final audit found inherited gridiron and badminton supporting excerpts inside
Britannica AI widgets. Those excerpts were replaced before sealing. Selected
support now comes from actual editorial narrative, native non-AI FAQs, the
authored badminton Olympic timeline, technique captions and an official rulebook.
The superseded rows and exact hashes are retained in
`evidence/sports-games-author-stage-revisions.json`; no independent pass is
retroactively claimed for those versions.

Actual HTTPS requests to Britannica's gridiron `Play-of-the-game` address
redirected to the general American-football history, which did not expose the
needed rule text. NFL's general rulebook and apparent 2025 page both returned
HTTP 200 while redirecting to its **2026** rulebook; the apparent rookie-guide
address returned HTTP 200 at the homepage. None is represented as a 2025 source.
An Exa lookup reviewed five results and located the real official 2025 rulebook:
`https://static.www.nfl.com/image/upload/fl_attachment/league/tautmcaqh6x5stgtl2yl.pdf`.
The PDF was actually downloaded with HTTP 200 and extracted with observed
`pdftotext 25.03.0`. Its title and introductory text identify the rules in effect
for the 2025 season. Four brief rule quotes independently support touchdown six,
field goal three, four downs and the usual ten-yard line to gain. Full bodies,
including the copyrighted PDF, stay in ignored `.work/`.

Final author changes also narrow sabre to modern Olympic fencing, strengthen the
Kano founder passage, and repair accidental word-number joins in authored prose.
Quoted source text is preserved literally, apart from permitted whitespace
normalization. Fresh reviews and actual second source openings remain pending.

The independent sports review rejected 0857–0860 because their selected Wikipedia boxing-glove passage directly cites the paired Britannica. A fresh actual WBA GET read Jesús Cova’s credited historical account, translated by WBA Press (April 24, 2025), for glove/round/rest/namesake/authorship support. Its 1865/1867 disagreement with Britannica is explicitly retained in `evidence/sports-games-independent-boxing-author-revisions.json`; the disputed year question and contextual fact are replaced by author and one-minute rest. The IBHOF museum route returned actual 503 twice and is not evidence. These four exact new versions are held for a separate reviewer.

Additional independent-review repairs: three golf/fencing selections now quote the full-round/any-blade wording actually present in the original captured bodies. Judo0865/0866/0868 replace a Britannica-citing Wikipedia lead with actual IJF source body reads, including Kano’s attributed1932lecture; no exact founding month is claimed. Ancient Olympics0898/0899 replace a Britannica-citing Wiki776BCsentence with Mark Cartwright’s actual WHE article, whose named bibliography has no paired Britannica reference. Original rows and all disagreements are retained in `evidence/sports-games-additional-source-author-revisions.json`. All changed versions await independent review.
