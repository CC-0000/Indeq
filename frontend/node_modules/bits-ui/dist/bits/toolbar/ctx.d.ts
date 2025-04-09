import { type CreateToolbarGroupProps as ToolbarGroupProps, type CreateToolbarProps as ToolbarProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
type GetGroupReturn = Omit<ReturnType<typeof setGroupCtx>, "updateOption">;
export declare function setCtx(props: ToolbarProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "button" | "link" | "root" | "group" | "group-item") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            role: string;
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        button: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events").ToolbarEvents["button"]>, () => {
            readonly role: "button";
            readonly type: "button";
        }, string>;
        separator: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            readonly role: "separator";
            readonly "data-orientation": "horizontal" | "vertical";
            readonly "aria-orientation": "horizontal" | "vertical";
        }, string>;
        link: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events").ToolbarEvents["link"]>, () => {
            readonly role: "link";
        }, string>;
    };
    builders: {
        createToolbarGroup: <T extends import("@melt-ui/svelte").ToolbarGroupType = "single">(props?: ToolbarGroupProps<T> | undefined) => {
            elements: {
                group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
                    readonly role: "group";
                    readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
                }, string>;
                item: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"single" | T>>, {
                    update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
                    set: (this: void, value: string | string[] | undefined) => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
                    get: () => string | string[] | undefined;
                    destroy?: (() => void) | undefined;
                }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events").ToolbarEvents["item"]>, ([$disabled, $type, $value, $orientation]: [boolean, "single" | T, string | string[] | undefined, import("@melt-ui/svelte/internal/types").Orientation]) => (props: import("@melt-ui/svelte").ToolbarGroupItemProps) => {
                    readonly disabled: true | undefined;
                    readonly pressed: boolean;
                    readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
                    readonly "data-disabled": true | undefined;
                    readonly "data-value": string;
                    readonly "data-state": "on" | "off";
                    readonly "aria-checked": boolean | undefined;
                    readonly "aria-pressed": boolean | undefined;
                    readonly type: "button";
                    readonly role: "radio" | undefined;
                    readonly "data-melt-toolbar-item": "";
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
            options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
                defaultValue?: (T extends "single" ? string : string[]) | undefined;
                value?: import("svelte/store").Writable<string | string[] | undefined> | undefined;
                onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
                type: "single" | T;
                disabled: boolean;
            }>;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        loop: boolean;
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
    }>;
};
export declare function setGroupCtx<T extends "single" | "multiple">(props: ToolbarGroupProps<T>): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "button" | "link" | "root" | "group" | "group-item") => Record<string, string> | undefined;
    elements: {
        group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("svelte/action").Action<any, any, Record<never, any>>, ($orientation: import("@melt-ui/svelte/internal/types").Orientation) => {
            readonly role: "group";
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"single" | T>>, {
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events").ToolbarEvents["item"]>, ([$disabled, $type, $value, $orientation]: [boolean, "single" | T, string | string[] | undefined, import("@melt-ui/svelte/internal/types").Orientation]) => (props: import("@melt-ui/svelte").ToolbarGroupItemProps) => {
            readonly disabled: true | undefined;
            readonly pressed: boolean;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            readonly "data-disabled": true | undefined;
            readonly "data-value": string;
            readonly "data-state": "on" | "off";
            readonly "aria-checked": boolean | undefined;
            readonly "aria-pressed": boolean | undefined;
            readonly type: "button";
            readonly role: "radio" | undefined;
            readonly "data-melt-toolbar-item": "";
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
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        defaultValue?: (T extends "single" ? string : string[]) | undefined;
        value?: import("svelte/store").Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
        type: "single" | T;
        disabled: boolean;
    }>;
};
export declare function getCtx(): GetReturn;
export declare function getGroupCtx(): GetGroupReturn;
export {};
