type Result = {
    readonly ok: true;
} | {
    readonly ok: false;
    readonly reason: 'type' | 'length' | 'empty' | 'control' | 'blocked';
};
export declare function reference(input: unknown): Result;
export {};
