/**
 * Where each B17 sound lands in PartyBox. The names are the SOUND_CUES list of the owner's local
 * PartyBox main (packages/game-sdk/src/ui/sound.tsx, read in the 2026-10-08 polish pass; the GitHub
 * checkout at 26b85ba6 has the same list). A 'replace' row would voice that existing cue; a 'new' row
 * proposes a cue PartyBox does not have yet. Pure data; INTEGRATION.md walks through the port.
 *
 * trimDb is a PROPOSED playback gain relative to the −16 LUFS render, not a measurement: no PartyBox
 * voice was rendered and levelled in this pass (no measuring tool is shipped here). The port must
 * measure its own voices and set the trim so the swapped cue keeps the mix the team tuned. Until then
 * every trim is a starting point near the cue's note density; the tests only require 0 ≥ trim ≥ −30 dB.
 */
import type {SoundId} from './recipes.js';

export interface CueLink {
  readonly sound: SoundId;
  /** 'replace': voices an existing PartyBox cue. 'new': proposes a cue PartyBox does not have. */
  readonly action: 'replace' | 'new';
  /** The PartyBox SoundCue it voices, or the proposed name of the new cue. */
  readonly cue: string;
  /** Fixed transposition before the call's own semitones (pause sits a fifth lower, jackpot in G). */
  readonly semitones: number;
  /** Playback gain in dB relative to the −16 LUFS render (TV; the phone engine's 0.35 master applies on top). */
  readonly trimDb: number;
  /** The moment, in PartyBox's words. */
  readonly moment: string;
}

const replace = (sound: SoundId, cue: string, trimDb: number, moment: string, semitones = 0): CueLink =>
  ({sound, action: 'replace', cue, semitones, trimDb, moment});
const beat = (sound: SoundId, cue: string, trimDb: number, moment: string): CueLink =>
  ({sound, action: 'new', cue, semitones: 0, trimDb, moment});

export const CUES: readonly CueLink[] = [
  replace('ready', 'ready', -17.5, 'Sound enabled or unmuted: the TV proving its speakers work'),
  replace('start', 'start', -15.5, 'A game begins (selecting → playing)'),
  replace('join', 'join', -16, 'A player joins; steps up joinSemitones [0, 2, 4, 5, 7]'),
  replace('leave', 'leave', -16, 'A player leaves, is kicked or drops (the mirror of join)'),
  replace('notification', 'phase', -16, 'A phase change that needs the phone (the shell chime)'),
  replace('countdown-tick', 'countdown', -21, 'Each of the last 5 seconds on the TV; countdownSemitones [7, 5, 4, 2, 0]'),
  replace('countdown-tick', 'tick', -27, 'The phone\'s half-gain countdown at its 5 s edge'),
  replace('reveal', 'reveal', -15.5, 'An answer or result is revealed'),
  replace('swipe', 'card', -18, 'One card read out (Blanks) or dealt (Bingo); soft enough to repeat'),
  replace('win-fanfare', 'win', -15, 'Results screen winner (the cheer sample still layers on top)'),
  replace('menu-back', 'pause', -17, 'The VIP pauses (A4 → E4, a settling fourth)', -7),
  replace('achievement', 'fanfare', -15, 'A game-end flourish (Yahtzee, Phase 10, Rummikub, Blanks final)'),
  replace('star-get', 'jackpot', -16, 'Final-wager reveal (Lightning), in G so the C-major win can follow', -5),
  replace('lose', 'bust', -17, 'A lost wager or a bust'),
  replace('bonus', 'sweep', -16, 'A Wisecrack sweep: a faster cousin of win'),
  replace('shop-open', 'wager', -16.5, 'The wager phase opens (Lightning)'),
  replace('round-end', 'tally', -18, 'A scores or leaderboard phase'),
  replace('vote', 'submit', -18.5, 'A player\'s own choice sent (phone)'),
  replace('menu-move', 'lock', -24, 'A player locks in; whole tones rise with the count (quiet)'),
  replace('ding', 'correct', -16.5, 'The phone\'s own verdict card: right'),
  replace('error', 'error', -17.5, 'Rejected input or an error toast (phone)'),
  replace('buzzer', 'wrong', -16.5, 'The wrong buzzer'),
  replace('bounce', 'call', -17, 'A new Bingo call: a bouncy boing'),
  replace('step', 'daub', -19, 'A square daubed on a phone: a dauber landing'),
  replace('confirm', 'claim', -17, 'BINGO! sent from a phone: a rising "sent!"'),
  replace('pop', 'dibs', -18, 'Someone has dibs on BINGO! (TV): a soft rising "hm?"'),
  replace('connect', 'close', -21, 'One square to go on a phone: a hushed rising "ooh"'),
  beat('coin', 'coin', -18, 'Money changes hands: Monopoly rent and salary, Blind Auction payouts (as tally)'),
  beat('dice-roll', 'dice-roll', -18, 'Dice leave the hand: Yahtzee and Monopoly Dice3d throws (as daub)'),
  beat('dice-stop', 'dice-land', -18, 'Dice settle on their faces, timed to Dice3d landing (as daub)'),
  beat('whoosh', 'stage', -21, 'A TV camera move: ADR-064 stage pan, toss and curtain (as countdown)'),
  beat('final-tick', 'countdown-last', -21, 'The last second of a countdown, in place of the fifth countdown step (as countdown)'),
  beat('timer-warning', 'hurry', -18, 'Ten seconds left, before the last-5-seconds state (as tally)'),
  beat('item-use', 'boost', -17, 'A power or event card is used: Blind Auction Mystery Box events (as claim)'),
  beat('cancel', 'cancel', -18.5, 'A choice withdrawn or a sheet dismissed on the phone (as submit)'),
  beat('penalty', 'penalty', -17, 'Points or money lost: Monopoly tax and jail fees (as bust)'),
  beat('teleport', 'warp', -16, 'A token jumps across the board: Monopoly "go to jail", party-board warps (as reveal)'),
  beat('shield', 'shield', -17, 'A protection holds: immunity or a blocked steal in minigames (as claim)'),
  beat('power-up', 'power-up', -16, 'Something grows stronger: a level, a multiplier, a party-board star (as reveal)'),
  beat('power-down', 'power-down', -17, 'Something weakens or runs out (as bust)'),
  beat('splash', 'splash', -18, 'A shot lands in water: Battleship misses (as daub)'),
];
