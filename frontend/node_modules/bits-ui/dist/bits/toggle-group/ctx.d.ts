import { type CreateToggleGroupProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx<T extends "single" | "multiple">(props: CreateToggleGroupProps<T>): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root" | "item") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            readonly role: "group";
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<T | "single">>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toggle-group/events").ToggleGroupEvents["item"]>, ([$value, $disabled, $orientation, $type]: [string | string[] | undefined, boolean, import("@melt-ui/svelte/internal/types").Orientation, T | "single"]) => (props: import("@melt-ui/svelte").ToggleGroupItemProps) => {
            readonly disabled: true | undefined;
            readonly pressed: boolean;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            readonly "data-disabled": true | undefined;
            readonly "data-state": "on" | "off";
            readonly "data-value": string;
            readonly "aria-pressed": boolean | undefined;
            readonly "aria-checked": boolean | undefined;
            readonly type: "button";
            readonly role: "radio" | undefined;
            readonly tabindex: 0 | -1;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        };
    };
    helpers: {
        isPressed: import("svelte/store").Readable<(itemValue: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultValue: string | (T extends "single" ? string : string[]);
        value?: import("svelte/store").Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
        type: T | "single";
        disabled: boolean;
        rovingFocus: boolean;
        loop: boolean;
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
    }, "value">>;
};
export declare function getCtx(): GetReturn;
export {};
