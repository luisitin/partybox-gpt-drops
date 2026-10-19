export type Difficulty = 'easy' | 'normal' | 'hard' | 'master';
export type Rng = () => number;
export interface Action {
  readonly id: string;
  readonly legal: boolean;
  readonly cost: number;
  readonly coinGain: number;
  readonly starGain: number;
  readonly movement: number;
  readonly buddyGain: number;
  readonly risk: number;
}
export interface Branch {
  readonly id: string;
  readonly cost: number;
  readonly coinGain: number;
  readonly distanceToStar: number | null;
  readonly buddyGain: number;
  readonly risk: number;
}
export interface State {
  readonly coins: number;
  readonly starPrice: number;
  readonly starDistance: number | null;
  readonly starAvailable: boolean;
  readonly turnsLeft: number;
  readonly buddy: boolean;
  readonly branches: readonly Branch[];
  readonly inventory: readonly Action[];
  readonly shop: readonly Action[];
}
