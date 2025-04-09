import { type CreatePopoverProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
import type { FloatingProps } from "../floating/_types.js";
export declare function getPopoverData(): {
    NAME: "popover";
    PARTS: readonly ["arrow", "close", "content", "trigger"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreatePopoverProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "content" | "trigger" | "close" | "arrow") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        content: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/popover/events").PopoverEvents["trigger"]>, ([$isVisible, $contentId, $triggerId]: [boolean, string, string]) => {
            readonly role: "button";
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": "true" | "false";
            readonly "data-state": "open" | "closed";
            readonly "aria-controls": string;
            readonly id: string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $portal, $contentId]: [boolean, string | HTMLElement | null | undefined, string]) => {
            hidden: boolean | undefined;
            tabindex: number;
            style: string;
            id: string;
            "data-state": string;
            "data-portal": string | undefined;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
        close: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/popover/events").PopoverEvents["close"]>, () => {
            readonly type: "button";
        }, string>;
        overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible]: [boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly "aria-hidden": "true";
            readonly "data-state": "open" | "closed";
        }, string>;
    };
    states: {
        open: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "bottom";
        };
        arrowSize: number;
        defaultOpen: boolean;
        open?: import("svelte/store").Writable<boolean> | undefined;
        onOpenChange: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        disableFocusTrap: boolean;
        closeOnEscape: boolean;
        closeOnOutsideClick: boolean;
        onOutsideClick: ((event: import("@melt-ui/svelte").InteractOutsideEvent) => void) | undefined;
        preventScroll: boolean;
        portal: string | HTMLElement | null | undefined;
        forceVisible: boolean;
        openFocus: import("@melt-ui/svelte").FocusProp | undefined;
        closeFocus: import("@melt-ui/svelte").FocusProp | undefined;
        ids?: Partial<{
            content: string;
            trigger: string;
        }> | undefined;
    }, "open" | "ids">>;
};
export declare function getCtx(): GetReturn;
export declare function setArrow(size?: number): GetReturn;
export declare function updatePositioning(props: FloatingProps): void;
export {};
