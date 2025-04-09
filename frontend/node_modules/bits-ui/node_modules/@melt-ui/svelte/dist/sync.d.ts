import type { Writable } from 'svelte/store';
type WritableValue<T> = T extends Writable<infer V> ? V : never;
export declare function createSync<Stores extends Record<string, Writable<unknown>>>(stores: Stores): { [K in keyof Stores]: (value: WritableValue<Stores[K]>, setter?: ((value: WritableValue<Stores[K]>) => void) | undefined) => void; };
export {};
