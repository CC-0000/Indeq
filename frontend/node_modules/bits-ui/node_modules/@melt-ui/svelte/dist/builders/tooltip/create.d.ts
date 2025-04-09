/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import { type Writable } from 'svelte/store';
import type { TooltipEvents } from './events.js';
import type { CreateTooltipProps } from './types.js';
export declare const tooltipIdParts: readonly ["trigger", "content"];
export type TooltipIdParts = typeof tooltipIdParts;
export declare function createTooltip(props?: CreateTooltipProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        content: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<Writable<string>>, import("../../internal/helpers/index.js").WithGet<Writable<string>>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => MeltActionReturn<TooltipEvents['trigger']>, ([$contentId, $triggerId, $open]: [string, string, boolean]) => {
            'aria-describedby': string;
            id: string;
            'data-state': string;
        }, string>;
        content: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<Writable<string | HTMLElement | null | undefined>>, import("../../internal/helpers/index.js").WithGet<Writable<string>>], (node: HTMLElement) => MeltActionReturn<TooltipEvents['content']>, ([$isVisible, $open, $portal, $contentId]: [boolean, boolean, string | HTMLElement | null | undefined, string]) => {
            role: string;
            hidden: boolean;
            tabindex: number;
            style: string;
            id: string;
            'data-portal': string;
            'data-state': string;
        }, string>;
        arrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/index.js").WithGet<Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            'data-arrow': boolean;
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
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        positioning: import("../../internal/actions/index.js").FloatingConfig | {
            placement: "bottom";
        };
        arrowSize: number;
        defaultOpen: boolean;
        open?: Writable<boolean> | undefined;
        onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
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
