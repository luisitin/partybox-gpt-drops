/**
 * Independent B19 public-contract reference.
 * Authored only from the input selections recorded in provenance.json.
 * No dependencies, I/O, randomness, or clocks occur inside the factory/filter.
 */

const MARK_OR_FORMAT = /[\p{M}\p{Cf}]/gu;
const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;
const IGNORABLE_AFTER_MAPPING = /[\p{P}\p{S}\p{Z}]/u;
const BIDI_CONTROL = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u;

function normalizeWholeString(value) {
  return value.normalize('NFKD').toLowerCase().replace(MARK_OR_FORMAT, '').trim();
}

function letterBit(letter) {
  return 1 << (letter.charCodeAt(0) - 97);
}

function termRuns(term) {
  const runs = [];
  for (const letter of term) {
    const previous = runs[runs.length - 1];
    if (previous && previous.letter === letter) {
      previous.minimum += 1;
    } else {
      runs.push({ letter, bit: letterBit(letter), minimum: 1 });
    }
  }
  return runs;
}

/**
 * Every reachable index is a possible boundary between original term runs.
 * Keeping all boundaries permits i-or-l tokens to serve either adjacent run.
 * A run consumes at least its original multiplicity, with any extra repeats.
 */
function containsRuns(segment, runs) {
  if (segment.length === 0 || runs.length === 0) return false;
  let boundaries = new Array(segment.length + 1).fill(true);
  for (const run of runs) {
    const next = new Array(segment.length + 1).fill(false);
    let foundBoundary = false;
    for (let start = 0; start < segment.length; start += 1) {
      if (!boundaries[start]) continue;
      for (let end = start; end < segment.length; end += 1) {
        if ((segment[end] & run.bit) === 0) break;
        if (end - start + 1 >= run.minimum) {
          next[end + 1] = true;
          foundBoundary = true;
        }
      }
    }
    if (!foundBoundary) return false;
    boundaries = next;
  }
  return boundaries.some(Boolean);
}

/**
 * Returns a frozen API whose filters use an independent snapshot of the policy.
 * Public policy terms and canonical group keys are reviewed lowercase ASCII.
 */
export function createReference(policy) {
  const exactExceptions = new Set(policy.safe);
  const aliases = new Map();
  for (const [canonical, spellings] of policy.groups) {
    const alternatives = canonical === '#'
      ? letterBit('i') | letterBit('l')
      : letterBit(canonical);
    if (canonical !== '#') aliases.set(canonical, alternatives);
    for (const spelling of spellings) aliases.set(spelling, alternatives);
  }

  const patternSpellings = new Set();
  for (const term of policy.terms) {
    patternSpellings.add(term);
    patternSpellings.add(Array.from(term).reverse().join(''));
  }
  const patterns = Array.from(patternSpellings, termRuns);

  const success = Object.freeze({ ok: true });
  const failures = Object.freeze({
    type: Object.freeze({ ok: false, reason: 'type', suggestion: 'use-text' }),
    length: Object.freeze({ ok: false, reason: 'length', suggestion: 'shorten' }),
    control: Object.freeze({ ok: false, reason: 'control', suggestion: 'remove-characters' }),
    empty: Object.freeze({ ok: false, reason: 'empty', suggestion: 'add-letters' }),
    blocked: Object.freeze({ ok: false, reason: 'blocked', suggestion: 'choose-another' }),
  });

  const nameFilter = Object.freeze(function nameFilter(value) {
    if (typeof value !== 'string') return failures.type;
    const originalPoints = Array.from(value);
    if (originalPoints.length > 16) return failures.length;

    for (const point of originalPoints) {
      const scalar = point.codePointAt(0);
      if (scalar <= 0x1f || (scalar >= 0x7f && scalar <= 0x9f)
        || (scalar >= 0xd800 && scalar <= 0xdfff) || BIDI_CONTROL.test(point)) {
        return failures.control;
      }
    }

    const normalized = normalizeWholeString(value);
    if (!LETTER_OR_NUMBER.test(normalized)) return failures.empty;
    if (exactExceptions.has(normalized)) return success;

    const segments = [];
    let segment = [];
    for (const point of normalized) {
      const alternatives = aliases.get(point);
      if (alternatives !== undefined) {
        segment.push(alternatives);
      } else if (!IGNORABLE_AFTER_MAPPING.test(point)) {
        // Unmapped L/N and all other unspecified categories are barriers.
        if (segment.length !== 0) segments.push(segment);
        segment = [];
      }
    }
    if (segment.length !== 0) segments.push(segment);

    for (const candidate of segments) {
      for (const pattern of patterns) {
        if (containsRuns(candidate, pattern)) return failures.blocked;
      }
    }
    return success;
  });

  const isAllowedName = Object.freeze(function isAllowedName(value) {
    return nameFilter(value).ok;
  });
  return Object.freeze({ nameFilter, isAllowedName });
}
