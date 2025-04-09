import { type CreateCheckboxProps } from "@melt-ui/svelte";
export declare function getCheckboxData(): {
    NAME: "checkbox";
    PARTS: readonly ["root", "input", "indicator"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateCheckboxProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root" | "indicator") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
            set: (this: void, value: boolean | "indeterminate") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean | "indeterminate";
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/checkbox/events").CheckboxEvents["root"]>, ([$checked, $disabled, $required]: [boolean | "indeterminate", boolean, boolean]) => {
            readonly "data-disabled": true | undefined;
            readonly disabled: true | undefined;
            readonly "data-state": "indeterminate" | "checked" | "unchecked";
            readonly type: "button";
            readonly role: "checkbox";
            readonly "aria-checked": boolean | "mixed";
            readonly "aria-required": boolean;
        }, "checkbox">;
        input: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
            set: (this: void, value: boolean | "indeterminate") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean | "indeterminate";
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$checked, $name, $value, $required, $disabled]: [boolean | "indeterminate", string | undefined, string, boolean, boolean]) => {
            readonly type: "checkbox";
            readonly "aria-hidden": true;
            readonly hidden: true;
            readonly tabindex: -1;
            readonly name: string | undefined;
            readonly value: string;
            readonly checked: boolean;
            readonly required: boolean;
            readonly disabled: true | undefined;
            readonly style: string;
        }, "checkbox-input">;
    };
    states: {
        checked: {
            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
            set: (this: void, value: boolean | "indeterminate") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean | "indeterminate";
            destroy?: (() => void) | undefined;
        };
    };
    helpers: {
        isIndeterminate: import("svelte/store").Readable<boolean>;
        isChecked: import("svelte/store").Readable<boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        disabled: boolean;
        required: boolean;
        name: string | undefined;
        value: string;
        defaultChecked: boolean | "indeterminate";
        checked?: import("svelte/store").Writable<boolean | "indeterminate"> | undefined;
        onCheckedChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean | "indeterminate"> | undefined;
    }, "defaultChecked" | "checked">>;
};
export declare function getCtx(): GetReturn;
export {};
