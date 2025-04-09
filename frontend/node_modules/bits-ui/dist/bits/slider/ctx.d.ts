import { type CreateSliderProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateSliderProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root" | "range" | "thumb" | "tick") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").SliderOrientation>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"ltr" | "rtl">>], import("svelte/action").Action<any, any, Record<never, any>>, ([$disabled, $orientation, $dir]: [boolean, import("@melt-ui/svelte").SliderOrientation, "ltr" | "rtl"]) => {
            dir: "ltr" | "rtl";
            disabled: boolean | undefined;
            "data-disabled": boolean | undefined;
            "data-orientation": import("@melt-ui/svelte/dist/builders/slider/types").SliderOrientation;
            style: string | undefined;
            "data-melt-id": string;
        }, string>;
        thumbs: import("@melt-ui/svelte/internal/helpers").ExplicitMakeElementArrayReturn<(node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/slider/events").SliderEvents["thumb"]>, import("@melt-ui/svelte/internal/types").NonEmptyArray<{
            readonly role: "slider";
            readonly "aria-valuemin": number;
            readonly "aria-valuemax": number;
            readonly "aria-valuenow": number;
            readonly "aria-disabled": true | undefined;
            readonly "aria-orientation": import("@melt-ui/svelte/dist/builders/slider/types").SliderOrientation;
            readonly "data-melt-part": "thumb";
            readonly "data-value": number;
            readonly style: string;
            readonly tabindex: 0 | -1;
        }>, string>;
        range: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number[]>, sideEffect?: ((newValue: number[]) => void) | undefined) => void;
            set: (this: void, value: number[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number[]>, invalidate?: import("svelte/store").Invalidator<number[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => number[];
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<"rl" | "lr" | "tb" | "bt">>, import("svelte/store").Readable<(val: number) => number>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $direction, $position]: [number[], "rl" | "lr" | "tb" | "bt", (val: number) => number]) => {
            style: string;
        }, string>;
        ticks: import("@melt-ui/svelte/internal/helpers").ExplicitMakeElementArrayReturn<import("svelte/action").Action<any, any, Record<never, any>>, {
            "data-bounded": boolean | undefined;
            "data-value": number;
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
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultValue: number[];
        value?: import("svelte/store").Writable<number[]> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<number[]> | undefined;
        min: number;
        max: number;
        step: number;
        orientation: import("@melt-ui/svelte").SliderOrientation;
        dir: "ltr" | "rtl";
        disabled: boolean;
    }, "value" | "onValueChange" | "defaultValue">>;
};
export declare function getCtx(): GetReturn;
export {};
