import { type CreateToggleProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateToggleProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "input" | "root") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toggle/events").ToggleEvents["root"]>, ([$pressed, $disabled]: [boolean, boolean]) => {
            readonly "data-disabled": true | undefined;
            readonly disabled: true | undefined;
            readonly "data-state": "on" | "off";
            readonly "aria-pressed": boolean;
            readonly type: "button";
        }, "toggle">;
    };
    states: {
        pressed: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        disabled: boolean;
        defaultPressed: boolean;
        pressed?: import("svelte/store").Writable<boolean> | undefined;
        onPressedChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
    }, "pressed">>;
};
export declare function getCtx(): GetReturn;
export {};
