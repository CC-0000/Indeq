import { type CreateProgressProps } from "@melt-ui/svelte";
export declare function setCtx(props: CreateProgressProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number | null>, sideEffect?: ((newValue: number | null) => void) | undefined) => void;
            set: (this: void, value: number | null) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number | null>, invalidate?: import("svelte/store").Invalidator<number | null> | undefined): import("svelte/store").Unsubscriber;
            get: () => number | null;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $max]: [number | null, number]) => {
            value: number | null;
            max: number;
            role: string;
            "aria-valuemin": number;
            "aria-valuemax": number;
            "aria-valuenow": number | null;
            "data-value": number | null;
            "data-state": string;
            "data-max": number;
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
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultValue: number | null;
        value?: import("svelte/store").Writable<number | null> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<number | null> | undefined;
        max: number;
    }, "value">>;
};
