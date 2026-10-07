import { bodies } from './art.js';
export type IconName = keyof typeof bodies;
export const iconNames: readonly IconName[] = Object.freeze(Object.keys(bodies) as IconName[]);
export const palette = Object.freeze(['#20243a','#fff4d9','#ff7668','#ffc857','#52cbb5','#9a8df2'] as const);
const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#fff4d9" stroke="#20243a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">';
/** Pure SVG lookup. Unknown names are rejected without throwing. */
export function getIcon(name: string): string | undefined {
  if (!Object.hasOwn(bodies, name)) return undefined;
  return head + bodies[name as IconName] + '</svg>';
}
