/// <reference types="svelte" />
import { type WithGet } from '../../internal/helpers/withGet.js';
import type { MeltActionReturn } from '../../internal/types.js';
import { type Readable } from 'svelte/store';
import type { LinkPreviewEvents } from './events.js';
import type { CreateLinkPreviewProps } from './types.js';
export declare const linkPreviewIdParts: readonly ["trigger", "content"];
export type LinkPreviewIdParts = typeof linkPreviewIdParts;
export declare function createLinkPreview(props?: CreateLinkPreviewProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        content: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, WithGet<import("svelte/store").Writable<string>>, WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<LinkPreviewEvents['trigger']>, ([$open, $triggerId, $contentId]: [boolean, string, string]) => {
            role: "button";
            'aria-haspopup': "dialog";
            'aria-expanded': boolean;
            'data-state': string;
            'aria-controls': string;
            id: string;
        }, string>;
        content: import("../../internal/helpers/index.js").MeltElement<[Readable<boolean>, WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<LinkPreviewEvents['content']>, ([$isVisible, $portal, $contentId]: [boolean, string | HTMLElement | null | undefined, string]) => {
            hidden: boolean | undefined;
            tabindex: number;
            style: string;
            id: string;
            'data-state': string;
            'data-portal': string | undefined;
        }, string>;
        arrow: import("../../internal/helpers/index.js").MeltElement<WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
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
        defaultOpen: boolean;
        open?: import("svelte/store").Writable<boolean> | undefined;
        onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
        openDelay: number;
        closeDelay: number;
        closeOnOutsideClick: boolean;
        onOutsideClick: ((event: import("../../internal/actions/index.js").InteractOutsideEvent) => void) | undefined;
        closeOnEscape: boolean;
        arrowSize: number;
        forceVisible: boolean;
        portal: string | HTMLElement | null | undefined;
        ids?: Partial<{
            content: string;
            trigger: string;
        }> | undefined;
    }, "ids">>;
};
