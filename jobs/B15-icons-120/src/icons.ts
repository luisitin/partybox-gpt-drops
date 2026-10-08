import { bodies } from './art.js';
export type IconName = keyof typeof bodies;
export const iconNames: readonly IconName[] = Object.freeze(Object.keys(bodies) as IconName[]);
export const palette = Object.freeze(['#20243a','#fff4d9','#ff7668','#ffc857','#52cbb5','#9a8df2'] as const);
/** The outline and detail colour every icon is drawn with. The `ink` option swaps exactly this colour. */
export const defaultInk = '#20243a';
/** `ink`: outline and detail colour, either 'currentColor' (themed through CSS `color`) or #rgb / #rrggbb. */
export interface IconOptions { readonly ink?: string; }
const head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#fff4d9" stroke="#20243a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">';
const inkPattern = /^(currentColor|#[0-9a-f]{3}|#[0-9a-f]{6})$/;
function inked(svg: string, options: IconOptions | undefined): string | undefined {
  const ink = options?.ink;
  if (ink === undefined) return svg;
  if (typeof ink !== 'string' || !inkPattern.test(ink)) return undefined;
  return svg.replaceAll('"' + defaultInk + '"', '"' + ink + '"');
}
/** Pure SVG lookup. Unknown names or an invalid `ink` are rejected without throwing. */
export function getIcon(name: string, options?: IconOptions): string | undefined {
  if (!Object.hasOwn(bodies, name)) return undefined;
  return inked(head + bodies[name as IconName] + '</svg>', options);
}
/**
 * One hidden SVG sprite with a `<symbol id="pb-icon-NAME">` per icon, used as `<svg><use href="#pb-icon-dice"/></svg>`.
 * Ink defaults to currentColor, so the page themes outlines with CSS `color`. Pure: same input, same bytes.
 */
export function getSprite(options: IconOptions = { ink: 'currentColor' }): string | undefined {
  const symbols: string[] = [];
  for (const name of iconNames) {
    const svg = getIcon(name, options);
    if (svg === undefined) return undefined;
    symbols.push('<symbol id="pb-icon-' + name + '"' + svg.slice(svg.indexOf(' viewBox='), -'</svg>'.length) + '</symbol>');
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">' + symbols.join('') + '</svg>';
}
