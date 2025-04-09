import { type CreateTabsProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateTabsProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root" | "content" | "trigger" | "list") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        list: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            role: string;
            "aria-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tabs/events").TabsEvents["trigger"]>, ([$value, $orientation]: [string, import("@melt-ui/svelte/internal/types").Orientation]) => (props: import("@melt-ui/svelte").TabsTriggerProps) => {
            type: "button";
            role: string;
            "data-state": string;
            tabindex: number;
            "data-value": string;
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            "data-disabled": boolean | undefined;
            disabled: boolean | undefined;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string) => (tabValue: string) => {
            role: string;
            "aria-labelledby": string;
            hidden: boolean | undefined;
            tabindex: number;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultValue?: string | undefined;
        value?: import("svelte/store").Writable<string> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string> | undefined;
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
        activateOnFocus: boolean;
        loop: boolean;
        autoSet: boolean;
    }, "value" | "onValueChange" | "defaultValue" | "autoSet">>;
};
export declare function getCtx(): GetReturn;
export {};
