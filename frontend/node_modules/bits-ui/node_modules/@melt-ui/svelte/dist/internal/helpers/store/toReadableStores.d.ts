import { type Readable } from 'svelte/store';
import { type WithGet } from '../withGet.js';
type TODO = any;
export type ToReadableStores<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K] extends Readable<TODO> ? WithGet<T[K]> : WithGet<Readable<T[K]>>;
};
/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export declare function toReadableStores<T extends Record<string, unknown>>(properties: T): ToReadableStores<T>;
export {};
