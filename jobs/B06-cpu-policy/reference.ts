// Independently authored from the public B06 model contract and public types.
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
interface Option { readonly id: string | null; readonly utility: number; }
const exploration: Readonly<Record<Difficulty, number>> = {
  easy: 1, normal: 0.5, hard: 0.1, master: 0,
};
const purchase: Readonly<Record<Difficulty, number>> = {
  easy: 0.5, normal: 0.85, hard: 0.98, master: 1,
};
function draw(rng: Rng): number | null {
  try {
    const value = rng();
    return Number.isFinite(value) && value >= 0 && value < 1 ? value : null;
  } catch { return null; }
}
function select(options: readonly Option[], difficulty: Difficulty, rng: Rng): string | null {
  if (options.length === 0) return null;
  const u = draw(rng);
  if (u === null) return null;
  const q = exploration[difficulty];
  if (u < q) return options[Math.floor(u / q * options.length)]?.id ?? null;
  let maximum = -Infinity;
  for (const option of options) if (option.utility > maximum) maximum = option.utility;
  const ties = options.filter(option => option.utility === maximum);
  const position = Math.floor((u - q) / (1 - q) * ties.length);
  return ties[position]?.id ?? null;
}
function actionUtility(state: State, action: Action, shopping: boolean): number {
  const distance = state.starDistance;
  const progress = distance === null ? 0 : Math.min(action.movement, distance);
  const buddyGain = state.buddy ? 0 : action.buddyGain;
  let utility = 50 * action.starGain + action.coinGain - action.cost +
    4 * buddyGain - 20 * action.risk + progress;
  if (distance !== null && distance > 0 && action.movement >= distance &&
      state.coins - action.cost >= state.starPrice) utility += 30;
  if (shopping && distance !== null && distance <= 10 &&
      state.coins - action.cost < state.starPrice) utility -= 30;
  return utility;
}
function chooseAction(state: State, actions: readonly Action[], shopping: boolean,
                      difficulty: Difficulty, rng: Rng): string | null {
  if (state.turnsLeft === 0) return null;
  const options: Option[] = [];
  for (const action of actions) if (action.legal && action.cost <= state.coins) {
    options.push({ id: action.id, utility: actionUtility(state, action, shopping) });
  }
  // Contract clarification: null is appended only when an actual action exists.
  if (options.length === 0) return null;
  options.push({ id: null, utility: 0 });
  return select(options, difficulty, rng);
}
export function chooseBranch(state: State, difficulty: Difficulty, rng: Rng): string | null {
  if (state.turnsLeft === 0) return null;
  const options: Option[] = [];
  for (const branch of state.branches) if (branch.cost <= state.coins) {
    let utility = branch.coinGain - branch.cost +
      4 * (state.buddy ? 0 : branch.buddyGain) - 20 * branch.risk;
    if (branch.distanceToStar !== null) {
      const canPay = state.coins - branch.cost + branch.coinGain >= state.starPrice;
      utility += (canPay ? 100 : 10) / (branch.distanceToStar + 1);
    }
    options.push({ id: branch.id, utility });
  }
  return select(options, difficulty, rng);
}
export function chooseItem(state: State, difficulty: Difficulty, rng: Rng): string | null {
  return chooseAction(state, state.inventory, false, difficulty, rng);
}
export function chooseShopBuy(state: State, difficulty: Difficulty, rng: Rng): string | null {
  if (state.inventory.length >= 3) return null;
  return chooseAction(state, state.shop, true, difficulty, rng);
}
export function buyStar(state: State, difficulty: Difficulty, rng: Rng): boolean {
  if (state.turnsLeft === 0 || !state.starAvailable || state.coins < state.starPrice) return false;
  const u = draw(rng);
  return u !== null && u < purchase[difficulty];
}
