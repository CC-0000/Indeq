import { type CreateRadioGroupProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateRadioGroupProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root" | "item" | "item-indicator") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$required, $orientation]: [boolean, import("@melt-ui/svelte/internal/types").Orientation]) => {
            readonly role: "radiogroup";
            readonly "aria-required": boolean;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/radio-group/events").RadioGroupEvents["item"]>, ([$value, $orientation, $disabled]: [string, import("@melt-ui/svelte/internal/types").Orientation, boolean]) => (props: import("@melt-ui/svelte").RadioGroupItemProps) => {
            readonly disabled: boolean;
            readonly "data-value": string;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            readonly "data-disabled": true | undefined;
            readonly "data-state": "checked" | "unchecked";
            readonly "aria-checked": boolean;
            readonly type: "button";
            readonly role: "radio";
            readonly tabindex: 0 | -1;
        }, string>;
        hiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            "aria-hidden": "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
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
    helpers: {
        isChecked: import("svelte/store").Readable<(itemValue: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        disabled: boolean;
        required: boolean;
        loop: boolean;
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
        defaultValue: string | undefined;
        value?: import("svelte/store").Writable<string> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string> | undefined;
    }, "value">>;
};
export declare function getCtx(): GetReturn;
export declare function setItemCtx(value: string): {
    value: string;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$required, $orientation]: [boolean, import("@melt-ui/svelte/internal/types").Orientation]) => {
            readonly role: "radiogroup";
            readonly "aria-required": boolean;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/radio-group/events").RadioGroupEvents["item"]>, ([$value, $orientation, $disabled]: [string, import("@melt-ui/svelte/internal/types").Orientation, boolean]) => (props: import("@melt-ui/svelte").RadioGroupItemProps) => {
            readonly disabled: boolean;
            readonly "data-value": string;
            readonly "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
            readonly "data-disabled": true | undefined;
            readonly "data-state": "checked" | "unchecked";
            readonly "aria-checked": boolean;
            readonly type: "button";
            readonly role: "radio";
            readonly tabindex: 0 | -1;
        }, string>;
        hiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            "aria-hidden": "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
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
    getAttrs: (part: "input" | "root" | "item" | "item-indicator") => Record<string, string> | undefined;
    helpers: {
        isChecked: import("svelte/store").Readable<(itemValue: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        disabled: boolean;
        required: boolean;
        loop: boolean;
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
        defaultValue: string | undefined;
        value?: import("svelte/store").Writable<string> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string> | undefined;
    }, "value">>;
};
type GetItemReturn = Omit<ReturnType<typeof setItemCtx>, "updateOption">;
export declare function getRadioIndicator(): GetItemReturn;
export {};
