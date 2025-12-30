export declare const addToMap: <K extends string, P, T extends Record<K, P>>(map: Map<K, P>, obj: T) => K[];
export type ExtendedArrayType<T> = T[] & {
    remove: (item: T) => ExtendedArrayType<T>;
    toggle: (item: T) => ExtendedArrayType<T>;
    clear: () => ExtendedArrayType<T>;
    unique: () => ExtendedArrayType<T>;
};
export declare function extendedArray<T>(array?: T[]): ExtendedArrayType<T>;
export declare const _: {
    deepClone: <K extends string | number | symbol, V>(k: Record<K, V>) => Record<K, V>;
};
