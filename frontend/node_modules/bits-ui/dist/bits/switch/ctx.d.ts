import { type CreateSwitchProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateSwitchProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root" | "thumb") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], <Node_1 extends any>(node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/switch/events").SwitchEvents["root"]>, ([$checked, $disabled, $required]: [boolean, boolean, boolean]) => {
            readonly "data-disabled": true | undefined;
            readonly disabled: true | undefined;
            readonly "data-state": "checked" | "unchecked";
            readonly type: "button";
            readonly role: "switch";
            readonly "aria-checked": "true" | "false";
            readonly "aria-required": "true" | undefined;
        }, string>;
        input: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$checked, $name, $required, $disabled, $value]: [boolean, string, boolean, boolean, string]) => {
            readonly type: "checkbox";
            readonly "aria-hidden": true;
            readonly hidden: true;
            readonly tabindex: -1;
            readonly name: string;
            readonly value: string;
            readonly checked: boolean;
            readonly required: boolean;
            readonly disabled: true | undefined;
            readonly style: string;
        }, string>;
    };
    states: {
        checked: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultChecked: boolean;
        checked?: import("svelte/store").Writable<boolean> | undefined;
        onCheckedChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        disabled: boolean;
        required: boolean;
        name: string;
        value: string;
    }, "checked">>;
};
export declare function getCtx(): GetReturn;
export {};
