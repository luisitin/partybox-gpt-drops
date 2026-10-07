# Conflicting evidence

- **C01 Branch avoidance:** Tastana reports an always Bowser avoidance rule. Another commenter on that source, wendadette, reports seeing otherwise. Burritozi11a reports avoiding unlucky spaces at Hard+, a related observation rather than proof of the same rule. No universal rule is asserted.
- **C02 Board intelligence and items:** Burritozi11a and Aurolis describe improved Hard behavior; Tastana and other independent players describe poor item use. These may reflect different states, boards or sample sizes. The reports are retained separately.
- **C03 Minigame strength:** Tastana describes Master as strong at Luigi Rescue Operation and weak at Unfriendly Flying Object. Necessary_Shit also reports strength in some games and poor decisions. A single general skill number is not inferred.
- **C04 Shop reserves:** Burritozi11a reports Hard+ skipping items near a star. Patrick Zwarts describes buying shop items and falling below the star budget despite difficulty setting. Neither provides a controlled frequency, version or state log. The implemented reserve penalty is a transparent design assumption.

The exact per-difficulty probabilities in the code are original model parameters. None is silently chosen from conflicting Nintendo behavior reports.

- **C05 Difficulty setting scope:** The original-game video explicitly lists Easy, Normal, Hard and Master for Koopathlon CPU difficulty and describes Easy through Master in Mario Party mode. Its Bowser Kaboom Squad Easy/Normal/Hard selection concerns stage difficulty. These settings are not silently treated as identical or evidence that all modes offer four levels.
- **C06 Buddy anecdote scope:** HylianSeven describes Master AI and Monty Mole using Boo with a Buddy; Burritozi11a describes Hard+. The agreement supports two player reports, not a deterministic Nintendo rule or controlled rate. Exact per-difficulty behavior remains a gap.
