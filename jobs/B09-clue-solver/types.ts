/** Shared contract; no solver algorithm is defined in this file. */
export interface Deck {
  readonly suspects: readonly string[];
  readonly weapons: readonly string[];
  readonly rooms: readonly string[];
}
export interface Suggestion {
  readonly player: number;
  readonly cards: readonly [string, string, string];
  /** First player clockwise who showed a card; null means nobody could show. */
  readonly refutedBy: number | null;
  /** Only include a card that the observer actually saw. */
  readonly shownCard?: string;
}
export interface GameLog {
  readonly deck?: Deck;
  readonly handSizes: readonly number[];
  readonly me: number;
  readonly ownHand: readonly string[];
  readonly shown?: readonly { readonly player: number; readonly card: string }[];
  readonly suggestions: readonly Suggestion[];
}
export interface Fraction { readonly numerator: bigint; readonly denominator: bigint }
export interface Solution {
  readonly ok: true;
  readonly totalDeals: bigint;
  readonly cards: Readonly<Record<string, {
    readonly envelope: Fraction;
    readonly hands: readonly Fraction[];
  }>>;
}
export interface SolverError {
  readonly ok: false;
  readonly code: "INVALID_INPUT" | "CONTRADICTION";
  readonly message: string;
}
export type SolverResult = Solution | SolverError;
export const CLASSIC_DECK: Deck = {
  suspects: ["Green", "Mustard", "Peacock", "Plum", "Scarlet", "White"],
  weapons: ["Candlestick", "Dagger", "Lead Pipe", "Revolver", "Rope", "Wrench"],
  rooms: ["Ballroom", "Billiard Room", "Conservatory", "Dining Room", "Hall", "Kitchen", "Library", "Lounge", "Study"],
};
