export type NameReason = 'type' | 'length' | 'empty' | 'control' | 'blocked';
export type NameSuggestion = 'use-text' | 'shorten' | 'add-letters' | 'remove-characters' | 'choose-another';
export type NameResult = {
    readonly ok: true;
} | {
    readonly ok: false;
    readonly reason: NameReason;
    readonly suggestion: NameSuggestion;
};
export declare function nameFilter(input: unknown): NameResult;
export declare function isAllowedName(input: unknown): boolean;
