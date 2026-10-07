/** Pure auditor for this deliberately small, inert SVG profile; not a general SVG sanitizer. */
export interface Audit { readonly valid: boolean; readonly bytes: number; readonly colors: readonly string[]; readonly shapes: number; readonly issues: readonly string[]; }
const NS = 'http://www.w3.org/2000/svg';
const tags = new Set(['svg','g','path','rect','circle','ellipse']);
const rootKeys = new Set(['xmlns','viewBox','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin']);
const common = ['fill','stroke','stroke-width','fill-rule'];
const keys: Readonly<Record<string, ReadonlySet<string>>> = {
  g: new Set(['transform']), path: new Set([...common,'d']),
  rect: new Set([...common,'x','y','width','height','rx']),
  circle: new Set([...common,'cx','cy','r']), ellipse: new Set([...common,'cx','cy','rx','ry'])
};
const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const arity: Readonly<Record<string,number>> = { M:2, L:2, H:1, V:1, C:6, Q:4, Z:0 };
export function utf8Bytes(value: string): number { return new TextEncoder().encode(value).length; }
/** Scanner implementation: commands delimit runs of numeric arguments. */
function pathOK(value: string): boolean {
  let pos = 0, command = '', count = 0, seen = false;
  const finish = (): boolean => command !== '' && (command === 'Z' ? count === 0 : count > 0 && count % (arity[command] ?? 999) === 0);
  while (pos < value.length) {
    const ch = value[pos] ?? '';
    if (/[,\s]/.test(ch)) { pos++; continue; }
    if (Object.hasOwn(arity,ch)) {
      if (seen && !finish()) return false;
      if (!seen && ch !== 'M') return false;
      command = ch; count = 0; seen = true; pos++; continue;
    }
    if (!seen || command === 'Z') return false;
    const match = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(value.slice(pos));
    if (!match || !Number.isFinite(Number(match[0]))) return false;
    count++; pos += match[0].length;
  }
  return seen && finish();
}
export function auditSvg(svg: string): Audit {
  const bytes = utf8Bytes(svg), issues: string[] = [], paints = new Set<string>();
  let shapes = 0, roots = 0, cursor = 0;
  const stack: string[] = []; let root: Record<string,string> = {};
  const done = (): Audit => ({ valid: issues.length === 0, bytes, colors: [...paints].sort(), shapes, issues });
  if (bytes > 1500) issues.push('byte-limit');
  if (/[\r\n\t]/.test(svg)) issues.push('control-whitespace');
  if (svg !== svg.trim() || />\s+</.test(svg)) issues.push('not-minified');
  if (/[&]|<\?|<!/.test(svg)) issues.push('entities-or-declarations');
  const token = /<\/?[A-Za-z][^<>]*>/g;
  for (const hit of svg.matchAll(token)) {
    const at = hit.index;
    if (svg.slice(cursor,at).trim() !== '') issues.push('text-or-malformed-markup');
    cursor = at + hit[0].length;
    const raw = hit[0], closing = raw.startsWith('</');
    const nm = /^<\/?([A-Za-z][\w:-]*)/.exec(raw), name = nm?.[1] ?? '';
    if (closing) {
      if (raw !== '</'+name+'>') issues.push('closing-syntax');
      if (stack.pop() !== name) issues.push('closing-mismatch');
      continue;
    }
    const self = raw.endsWith('/>'), inside = raw.slice(nm?.[0].length ?? 1,self ? -2 : -1);
    const attrs: Record<string,string> = Object.create(null) as Record<string,string>;
    let rest = inside;
    while (rest.length) {
      const found = /^\s+([A-Za-z][\w:-]*)="([^"<>]*)"/.exec(rest);
      if (!found) { if (rest.trim()) issues.push('attribute-syntax'); break; }
      const key = found[1] ?? '', val = found[2] ?? '';
      if (Object.hasOwn(attrs,key)) issues.push('duplicate-attribute');
      attrs[key] = val; rest = rest.slice(found[0].length);
    }
    const isRoot = stack.length === 0;
    if (!isRoot && stack[stack.length-1] !== 'svg' && stack[stack.length-1] !== 'g') issues.push('leaf-has-children');
    if (isRoot) { roots++; root = attrs; if (name !== 'svg') issues.push('root-name'); }
    else if (name === 'svg') issues.push('nested-svg');
    if (!tags.has(name)) issues.push('element-not-allowed');
    const allowed = isRoot ? rootKeys : (keys[name] ?? new Set<string>());
    for (const [key,value] of Object.entries(attrs)) {
      if (!allowed.has(key)) issues.push('attribute-not-allowed');
      if (key === 'fill' || key === 'stroke') {
        if (value !== 'none') {
          if (!/^#[\da-f]{6}$/i.test(value)) issues.push('paint-not-hex');
          paints.add(value.toLowerCase());
        }
      }
      if (key === 'fill-rule' && value !== 'evenodd' && value !== 'nonzero') issues.push('fill-rule');
      if (key === 'stroke-width' && (!numberPattern.test(value) || !Number.isFinite(Number(value)) || Number(value) <= 0)) issues.push('stroke-width');
    }
    const required: Readonly<Record<string,readonly string[]>> = {circle:['cx','cy','r'],ellipse:['cx','cy','rx','ry'],rect:['x','y','width','height']};
    for (const key of required[name] ?? []) {
      const value = Number(attrs[key]);
      if (!numberPattern.test(attrs[key] ?? '')) issues.push('numeric-syntax');
      if (!Number.isFinite(value)) issues.push('nonfinite');
    }
    if (name === 'circle' && Number(attrs.r) <= 0) issues.push('circle-radius');
    if (name === 'ellipse' && Number(attrs.rx) <= 0) issues.push('ellipse-rx');
    if (name === 'ellipse' && Number(attrs.ry) <= 0) issues.push('ellipse-ry');
    if (name === 'rect' && Number(attrs.width) <= 0) issues.push('rect-width');
    if (name === 'rect' && Number(attrs.height) <= 0) issues.push('rect-height');
    if (name === 'rect' && attrs.rx !== undefined && (!numberPattern.test(attrs.rx) || !Number.isFinite(Number(attrs.rx)) || Number(attrs.rx) < 0)) issues.push('rect-rx');
    if (name === 'path' && !pathOK(attrs.d ?? '')) issues.push('path-grammar');
    if (name === 'g') {
      const rotation = /^rotate\(([^()]*)\)$/.exec(attrs.transform ?? '');
      const parts = rotation?.[1]?.trim().split(/[ ,]+/) ?? [];
      if (parts.length !== 3 || parts.some(x => !numberPattern.test(x) || !Number.isFinite(Number(x)))) issues.push('rotation');
    }
    if (name === 'path' || name === 'circle' || name === 'ellipse' || name === 'rect') shapes++;
    if (!self) stack.push(name);
  }
  if (svg.slice(cursor).trim() !== '') issues.push('trailing-text');
  if (stack.length !== 0) issues.push('unclosed-element');
  if (roots !== 1) issues.push('root-count');
  if (shapes === 0) issues.push('empty-art');
  if (root.xmlns !== NS) issues.push('namespace');
  if (root.viewBox !== '0 0 64 64') issues.push('viewbox');
  if (root['stroke-width'] !== '4') issues.push('root-stroke');
  if (root['stroke-linecap'] !== 'round') issues.push('linecap');
  if (root['stroke-linejoin'] !== 'round') issues.push('linejoin');
  const colors = [...paints];
  if (colors.length > 6) issues.push('color-limit');
  return done();
}
/** Little-endian bit per pixel; foreground means alpha >= 128, with no registration changes. */
export function alphaMask(rgba: Uint8Array): Uint32Array | undefined {
  if (rgba.length % 4 !== 0) return undefined;
  const result = new Uint32Array(Math.ceil(rgba.length / 128));
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i+3]! >= 128) { const pixel = i/4, word = pixel >>> 5; result[word] = (result[word] ?? 0) | (1 << (pixel & 31)); }
  }
  return result;
}
function popcount(value: number): number {
  let x = value >>> 0;
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}
export interface Overlap { readonly intersection: number; readonly union: number; readonly iou: number; }
export function compareMasks(a: ArrayLike<number>, b: ArrayLike<number>): Overlap | undefined {
  if (a.length !== b.length) return undefined;
  let intersection = 0, union = 0;
  for (let i = 0; i < a.length; i++) { intersection += popcount((a[i] ?? 0) & (b[i] ?? 0)); union += popcount((a[i] ?? 0) | (b[i] ?? 0)); }
  return {intersection,union,iou:union === 0 ? 1 : intersection/union};
}
/** Exact comparison against 4/5. Equality is a failure, not a pass. */
export function belowLimit(intersection: number, union: number): boolean {
  return Number.isSafeInteger(intersection) && Number.isSafeInteger(union) && intersection >= 0 && union > 0 && intersection <= union && intersection * 5 < union * 4;
}
