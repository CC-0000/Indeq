/// <reference types="svelte" />
import { type Updater } from 'svelte/store';
export declare function cn(...classes: (string | undefined)[]): string;
export declare const isBrowser: boolean;
/**
 * A custom store that only allows setting/updating the value from the
 * browser to avoid SSR data leaks. By defining this helper, we don't
 * have to worry about checking for `isBrowser` in every place we
 * mutate the various stores.
 *
 * This should only ever be initialized with an empty array or object,
 * as otherwise the initial value will persist across requests.
 */
export declare function clientWritable<T>(initialValue: T): {
    subscribe: (this: void, run: import("svelte/store").Subscriber<T>, invalidate?: import("svelte/store").Invalidator<T> | undefined) => import("svelte/store").Unsubscriber;
    set: (value: T) => void;
    update: (updater: Updater<T>) => void;
};
