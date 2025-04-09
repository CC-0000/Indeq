/// <reference types="svelte" />
import type { MeltActionReturn, NonEmptyArray } from '../../internal/types.js';
import type { SliderEvents } from './events.js';
import type { CreateSliderProps } from './types.js';
export declare const createSlider: (props?: CreateSliderProps) => {
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("./types.js").SliderOrientation>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<"ltr" | "rtl">>], import("svelte/action").Action<any, any, Record<never, any>>, ([$disabled, $orientation, $dir]: [boolean, import("./types.js").SliderOrientation, "ltr" | "rtl"]) => {
            dir: "ltr" | "rtl";
            disabled: boolean | undefined;
            'data-disabled': boolean | undefined;
            'data-orientation': import("./types.js").SliderOrientation;
            style: string | undefined;
            'data-melt-id': string;
        }, string>;
        thumbs: import("../../internal/helpers/index.js").ExplicitMakeElementArrayReturn<(node: HTMLElement) => MeltActionReturn<SliderEvents['thumb']>, NonEmptyArray<{
            readonly role: "slider";
            readonly 'aria-valuemin': number;
            readonly 'aria-valuemax': number;
            readonly 'aria-valuenow': number;
            readonly 'aria-disabled': true | undefined;
            readonly 'aria-orientation': import("./types.js").SliderOrientation;
            readonly 'data-melt-part': "thumb";
            readonly 'data-value': number;
            readonly style: string;
            readonly tabindex: 0 | -1;
        }>, string>;
        range: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number[]>, sideEffect?: ((newValue: number[]) => void) | undefined) => void;
            set: (this: void, value: number[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number[]>, invalidate?: import("svelte/store").Invalidator<number[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => number[];
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<"rl" | "lr" | "tb" | "bt">>, import("svelte/store").Readable<(val: number) => number>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $direction, $position]: [number[], "rl" | "lr" | "tb" | "bt", (val: number) => number]) => {
            style: string;
        }, string>;
        ticks: import("../../internal/helpers/index.js").ExplicitMakeElementArrayReturn<import("svelte/action").Action<any, any, Record<never, any>>, {
            'data-bounded': boolean | undefined;
            'data-value': number;
            style: string;
        }[], string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<number[]>, sideEffect?: ((newValue: number[]) => void) | undefined) => void;
            set: (this: void, value: number[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number[]>, invalidate?: import("svelte/store").Invalidator<number[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => number[];
            destroy?: (() => void) | undefined;
        };
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        defaultValue: number[];
        value?: import("svelte/store").Writable<number[]> | undefined;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<number[]> | undefined;
        min: number;
        max: number;
        step: number;
        orientation: import("./types.js").SliderOrientation;
        dir: "ltr" | "rtl";
        disabled: boolean;
    }, "value" | "onValueChange" | "defaultValue">>;
};
