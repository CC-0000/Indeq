import { type CreatePinInputProps as PinInputProps } from "@melt-ui/svelte";
export declare function getPinInputData(): {
    NAME: "pin-input";
    PARTS: readonly ["root", "input", "hidden-input"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: PinInputProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root" | "hidden-input") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        root: string;
    }>;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $rootId]: [string[], string]) => {
            id: string;
            "data-complete": string | undefined;
        }, string>;
        input: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"text" | "password">>], (node: HTMLInputElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pin-input/events").PinInputEvents["input"]>, ([$value, $placeholder, $disabled, $type]: [string[], string, boolean, "text" | "password"]) => () => {
            "data-complete": string | undefined;
            placeholder: string;
            disabled: boolean | undefined;
            type: "text" | "password";
            value: string;
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
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        };
        valueStr: import("svelte/store").Readable<string>;
    };
    helpers: {
        clear: () => void;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        placeholder: string;
        name: string | undefined;
        disabled: boolean;
        type: "text" | "password";
        defaultValue: string[];
        value?: import("svelte/store").Writable<string[]> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string[]> | undefined;
        ids?: Partial<{
            root: string;
        }> | undefined;
    }, "value" | "ids">>;
};
export declare function getCtx(): GetReturn;
export {};
