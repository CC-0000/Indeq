/// <reference types="svelte" />
import { type InteractOutsideEvent } from '../../internal/actions/index.js';
import type { MeltActionReturn } from '../../internal/types.js';
import type { PopoverEvents } from './events.js';
import type { CreatePopoverProps } from './types.js';
export declare const popoverIdParts: readonly ["trigger", "content"];
export type PopoverIdParts = typeof popoverIdParts;
export declare function createPopover(args?: CreatePopoverProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        content: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<PopoverEvents['trigger']>, ([$isVisible, $contentId, $triggerId]: [boolean, string, string]) => {
            readonly role: "button";
            readonly 'aria-haspopup': "dialog";
            readonly 'aria-expanded': "true" | "false";
            readonly 'data-state': "open" | "closed";
            readonly 'aria-controls': string;
            readonly id: string;
        }, string>;
        content: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $portal, $contentId]: [boolean, string | HTMLElement | null | undefined, string]) => {
            hidden: boolean | undefined;
            tabindex: number;
            style: string;
            id: string;
            'data-state': string;
            'data-portal': string | undefined;
        }, string>;
        arrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            'data-arrow': boolean;
            style: string;
        }, string>;
        close: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => MeltActionReturn<PopoverEvents['close']>, () => {
            readonly type: "button";
        }, string>;
        overlay: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible]: [boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly 'aria-hidden': "true";
            readonly 'data-state': "open" | "closed";
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
        open?: import("svelte/store").Writable<boolean> | undefined;
        onOpenChange: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
        disableFocusTrap: boolean;
        closeOnEscape: boolean;
        closeOnOutsideClick: boolean;
        onOutsideClick: ((event: InteractOutsideEvent) => void) | undefined;
        preventScroll: boolean;
        portal: string | HTMLElement | null | undefined;
        forceVisible: boolean;
        openFocus: import("../../internal/helpers/index.js").FocusProp | undefined;
        closeFocus: import("../../internal/helpers/index.js").FocusProp | undefined;
        ids?: Partial<{
            content: string;
            trigger: string;
        }> | undefined;
    }, "open" | "ids">>;
};
