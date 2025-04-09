import { type Writable } from 'svelte/store';
import { type WithGet } from '../withGet.js';
export type ToWritableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: WithGet<Writable<T[K]>>;
};
/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export declare function toWritableStores<T extends Record<string, unknown>>(properties: T): ToWritableStores<T>;
