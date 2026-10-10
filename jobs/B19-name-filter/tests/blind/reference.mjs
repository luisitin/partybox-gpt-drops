// Independently authored from the public B19 policy and API contract.
// Each term is represented by a regular expression of minimum letter runs.
// No production/reference/test source was read before authoring or sealing.
export function createReference(policy) {
  const allowed = Object.freeze({ ok: true });
  const rejected = Object.fromEntries(['type', 'length', 'control', 'empty', 'blocked']
    .map(reason => [reason, Object.freeze({ ok: false, reason })]));
  const exceptions = new Set(policy.safe);
  const aliases = new Map();
  for (const [letter, characters] of policy.groups) {
    const target = letter === '#' ? '\ue000' : letter;
    if (letter !== '#') aliases.set(letter, letter);
    for (const character of characters) aliases.set(character, target);
  }
  const patternFor = word => {
    let result = '';
    for (let index = 0; index < word.length;) {
      const letter = word[index];
      let end = index + 1;
      while (end < word.length && word[end] === letter) ++end;
      const atom = letter === 'i' || letter === 'l' ? `[${letter}\ue000]` : letter;
      const minimum = end - index;
      result += atom + (minimum === 1 ? '+' : `{${minimum},}`);
      index = end;
    }
    return result;
  };
  const patterns = new Set();
  for (const word of policy.terms) {
    patterns.add(patternFor(word));
    patterns.add(patternFor([...word].reverse().join('')));
  }
  const forbidden = new RegExp([...patterns].join('|'));
  const hasCharacter = /[\p{L}\p{N}]/u;
  const removeMarksAndFormats = /[\p{M}\p{Cf}]/gu;
  const badControl = /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/;
  function nameFilter(value) {
    if (typeof value !== 'string') return rejected.type;
    if ([...value].length > 16) return rejected.length;
    if (badControl.test(value)) return rejected.control;
    for (let index = 0; index < value.length; ++index) {
      const unit = value.charCodeAt(index);
      if (unit >= 0xd800 && unit <= 0xdbff) {
        const next = value.charCodeAt(++index);
        if (!(next >= 0xdc00 && next <= 0xdfff)) return rejected.control;
      } else if (unit >= 0xdc00 && unit <= 0xdfff) return rejected.control;
    }
    const normalized = value.normalize('NFKD').toLowerCase()
      .replace(removeMarksAndFormats, '').trim();
    if (!hasCharacter.test(normalized)) return rejected.empty;
    if (exceptions.has(normalized)) return allowed;
    let mapped = '';
    for (const character of normalized) {
      const alias = aliases.get(character);
      if (alias !== undefined) mapped += alias;
      else if (hasCharacter.test(character)) mapped += '\u0000';
    }
    return forbidden.test(mapped) ? rejected.blocked : allowed;
  }
  const isAllowedName = value => nameFilter(value).ok;
  return Object.freeze({ nameFilter, isAllowedName });
}
