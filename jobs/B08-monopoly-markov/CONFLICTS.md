# Published gaps and edition conventions

## Truman Collins maximum-stay Jail probability

Collins publishes Just Visiting2.1392% and in-jail9.4569%, aggregate0.115961.
The specified three-attempt rule computes aggregate0.11527745312425577, absolute
gap0.00068354687574421, above1e-4. All other39 squares in his maximum-stay table
are within1e-4; all40 ASAP squares match, largest error1.146819755e-6.

The Collins public simulation source (`mon_sim.c`, linked from his table) pays
before the third turn and follows ordinary doubles, and permits a repeat-roll
doubles streak on earlier jail release. The official cited US jail rule ends a
doubles-release turn and uses the actual third attempted roll if payment is then
required. Butler’s published model describes these same distinctions. We retain
the specified official rule, compare its two strategies successfully to Butler’s
roll and turn tables, and preserve Collins’s discrepant table as an explicit
diagnostic. Seeds, observation definitions and thresholds were not changed to
force that table’s maximum-stay Jail cell to pass.

## Roll observations versus turn boundaries

Per-roll occupancy includes every repeated doubles roll and every failed jail
attempt. End-turn occupancy samples only final turns. They are different
probabilities: comparing Butler’s turn table directly with per-roll output would
create avoidable discrepancies. The engine outputs both, and the fixtures state
which convention is compared. Aggregate physical square10 includes both jail
and visiting; the120-state distribution retains the distinction.

## Physical decks versus the requested IID decks

Official physical play shuffles the decks, returns used cards to the bottom and
allows a GOJF card to be held. This task specifies IID16-card odds, as do the
compared exact tables. The engine keeps GOJF among nonmovement cards, does not
hold/use it and draws independently. A rotating-deck/inventory model requires
additional states; it is not silently approximated by this120-state chain.

## Utility dice and historical Marvin Gardens

The cited2021 US rulebook explicitly directs a new utility-rent dice roll. Its
mean is seven independently of arrival. Some earlier interpretations use the
movement throw for ordinary utility rent; that correlated convention would
produce different utility ROI while leaving movement probabilities unchanged.
This implementation labels and uses the cited fresh-roll edition consistently.

Wikibooks notes older US Marvin Gardens base rent$22 (set$44). Its modern US row
and Drexel’s row specify$24 (set$48); the modern value is used and every rent level
is compared against those source fixtures. Different editions should use their
corresponding deed data.
