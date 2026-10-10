import * as blind from '../dist/blindReference.js';
export const referenceValidateTable = input => blind.validateTable(input).ok;
export const referenceValidatePosition = input => blind.validatePosition(input).ok;
export const referenceValidatePlay = (before, after) => blind.validatePlay(before, after).ok;
export function referenceBestPlay(input) {
  const result = blind.findBestPlay(input);
  return result.ok ? {...result, playedCount: result.played.length} : result;
}
export {blind};
