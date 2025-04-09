import { type CreateTooltipProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
import type { FloatingProps } from "../floating/_types.js";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateTooltipProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "content" | "trigger" | "arrow") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        content: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tooltip/events.js").TooltipEvents["trigger"]>, ([$contentId, $triggerId, $open]: [string, string, boolean]) => {
            "aria-describedby": string;
            id: string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tooltip/events.js").TooltipEvents["content"]>, ([$isVisible, $open, $portal, $contentId]: [boolean, boolean, string | HTMLElement | null | undefined, string]) => {
            role: string;
            hidden: boolean;
            tabindex: number;
            style: string;
            id: string;
            "data-portal": string;
            "data-state": string;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            "data-arrow": boolean;
            style: string;
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
        open?: Writable<boolean> | undefined;
        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        closeOnPointerDown: boolean;
        openDelay: number;
        closeDelay: number;
        forceVisible: boolean;
        closeOnEscape: boolean;
        disableHoverableContent: boolean;
        group: string | boolean | undefined;
        portal: string | HTMLElement | null | undefined;
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
