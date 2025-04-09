/// <reference types="svelte" />
import { noop } from '../../internal/helpers/index.js';
import type { MeltActionReturn } from '../../internal/types.js';
import type { ToastEvents } from './events.js';
import type { AddToastProps, CreateToasterProps, Toast } from './types.js';
export declare function createToaster<T = object>(props?: CreateToasterProps): {
    elements: {
        content: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Writable<Map<string, Toast<T>>>, (node: HTMLElement) => MeltActionReturn<ToastEvents['content']>, ($toasts: Map<string, Toast<T>>) => (id: string) => {
            id: string;
            role: string;
            'aria-describedby': string;
            'aria-labelledby': string;
            'aria-live': "assertive" | "polite";
            tabindex: number;
        } | null, string>;
        title: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Writable<Map<string, Toast<T>>>, import("svelte/action").Action<any, any, Record<never, any>>, ($toasts: Map<string, Toast<T>>) => (id: string) => {
            id: string;
        } | null, string>;
        description: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Writable<Map<string, Toast<T>>>, import("svelte/action").Action<any, any, Record<never, any>>, ($toasts: Map<string, Toast<T>>) => (id: string) => {
            id: string;
        } | null, string>;
        close: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => MeltActionReturn<ToastEvents['close']>, () => (id: string) => {
            type: "button";
            'data-id': string;
        }, string>;
    };
    states: {
        toasts: import("svelte/store").Readable<Toast<T>[]>;
    };
    helpers: {
        addToast: (props: AddToastProps<T>) => Toast<T>;
        removeToast: (id: string) => void;
        updateToast: (id: string, data: T) => void;
    };
    actions: {
        portal: <Node_1 extends HTMLElement>(el: Node_1, target?: import("../../internal/actions/index.js").PortalConfig) => {
            destroy: typeof noop;
            update?: undefined;
        } | {
            update: (newTarget: string | HTMLElement | undefined) => Promise<void>;
            destroy: () => void;
        };
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<{
        closeDelay: number;
        type: "background" | "foreground";
    }>;
};
