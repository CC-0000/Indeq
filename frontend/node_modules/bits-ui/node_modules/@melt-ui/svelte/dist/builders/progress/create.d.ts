/// <reference types="svelte" />
import type { CreateProgressProps } from './types.js';
export declare const createProgress: (props?: CreateProgressProps) => {
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number | null>, sideEffect?: ((newValue: number | null) => void) | undefined) => void;
            set: (this: void, value: number | null) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number | null>, invalidate?: import("svelte/store").Invalidator<number | null> | undefined): import("svelte/store").Unsubscriber;
            get: () => number | null;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<number>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $max]: [number | null, number]) => {
            value: number | null;
            max: number;
            role: string;
            'aria-valuemin': number;
            'aria-valuemax': number;
            'aria-valuenow': number | null;
            'data-value': number | null;
            'data-state': string;
            'data-max': number;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<number | null>, sideEffect?: ((newValue: number | null) => void) | undefined) => void;
            set: (this: void, value: number | null) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number | null>, invalidate?: import("svelte/store").Invalidator<number | null> | undefined): import("svelte/store").Unsubscriber;
            get: () => number | null;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        defaultValue: number | null;
        value?: import("svelte/store").Writable<number | null> | undefined;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<number | null> | undefined;
        max: number;
    }, "value">>;
};
