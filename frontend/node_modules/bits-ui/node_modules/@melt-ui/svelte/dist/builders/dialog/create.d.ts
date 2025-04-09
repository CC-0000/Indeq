/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { DialogEvents } from './events.js';
import type { CreateDialogProps } from './types.js';
export declare const dialogIdParts: readonly ["content", "title", "description"];
export type DialogIdParts = typeof dialogIdParts;
export declare function createDialog(props?: CreateDialogProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        title: string;
        description: string;
        content: string;
    }>;
    elements: {
        content: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isVisible, $contentId, $descriptionId, $titleId, $open]: [boolean, string, string, string, boolean]) => {
            id: string;
            role: "dialog" | "alertdialog";
            'aria-describedby': string;
            'aria-labelledby': string;
            'aria-modal': "true" | undefined;
            'data-state': string;
            tabindex: number;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        trigger: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => MeltActionReturn<DialogEvents['trigger']>, ([$open]: [boolean]) => {
            readonly 'aria-haspopup': "dialog";
            readonly 'aria-expanded': boolean;
            readonly type: "button";
        }, string>;
        title: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$titleId]: [string]) => {
            id: string;
        }, string>;
        description: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$descriptionId]: [string]) => {
            id: string;
        }, string>;
        overlay: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $open]: [boolean, boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly 'aria-hidden': true;
            readonly 'data-state': "open" | "closed";
        }, string>;
        close: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => MeltActionReturn<DialogEvents['close']>, () => {
            readonly type: "button";
        }, string>;
        portalled: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ($portal: string | HTMLElement | null | undefined) => {
            'data-portal': string | undefined;
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
        preventScroll: boolean;
        closeOnEscape: boolean;
        closeOnOutsideClick: boolean;
        onOutsideClick: ((event: PointerEvent | MouseEvent | TouchEvent) => void) | undefined;
        role: "dialog" | "alertdialog";
        defaultOpen: boolean;
        open?: import("svelte/store").Writable<boolean> | undefined;
        onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
        portal: string | HTMLElement | null | undefined;
        forceVisible: boolean;
        openFocus: import("../../internal/helpers/index.js").FocusProp | undefined;
        closeFocus: import("../../internal/helpers/index.js").FocusProp | undefined;
        ids?: Partial<{
            title: string;
            description: string;
            content: string;
        }> | undefined;
    }, "ids">>;
};
