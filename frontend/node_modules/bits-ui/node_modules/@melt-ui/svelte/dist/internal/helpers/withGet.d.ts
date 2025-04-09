import { type Readable, type StoresValues, type Writable } from 'svelte/store';
type ReadableValue<T> = T extends Readable<infer V> ? V : never;
export type WithGet<T extends Readable<unknown>> = T & {
    get: () => ReadableValue<T>;
    destroy?: () => void;
};
/**
 * Transforms an existing store into a store with a `get` method.
 * Uses subscriptions to keep the value up to date, so make sure to call `destroy` when you're done with it.
 * @date 20/01/2024 - 16:38:39
 *
 * @export
 * @template {Readable<unknown>} T
 * @param {T} store
 * @returns {WithGet<T>}
 */
export declare function withGet<T extends Readable<unknown>>(store: T): WithGet<T>;
export declare namespace withGet {
    var writable: <T>(initial: T) => WithGet<Writable<T>>;
    var derived: <S extends WithGet<Readable<unknown>> | WithGet<Readable<unknown>>[] | [WithGet<Readable<unknown>>, ...WithGet<Readable<unknown>>[]], T>(stores: S, fn: (values: StoresValues<S>) => T) => WithGet<Readable<T>>;
}
export declare function addGetToStores<T extends Record<string, Writable<unknown>>>(stores: T): { [K in keyof T]: WithGet<T[K]>; };
export {};
