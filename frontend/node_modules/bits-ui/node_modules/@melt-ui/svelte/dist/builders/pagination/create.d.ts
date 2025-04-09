/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { PaginationEvents } from './events.js';
import type { CreatePaginationProps, Page } from './types.js';
export declare function createPagination(props: CreatePaginationProps): {
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            'data-scope': string;
        }, string>;
        pageTrigger: import("../../internal/helpers/index.js").MeltElement<{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, (node: HTMLElement) => MeltActionReturn<PaginationEvents['pageTrigger']>, ($page: number) => (pageItem: Page) => {
            'aria-label': string;
            'data-value': number;
            'data-selected': string | undefined;
        }, string>;
        prevButton: import("../../internal/helpers/index.js").MeltElement<{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, (node: HTMLElement) => MeltActionReturn<PaginationEvents['prevButton']>, ($page: number) => {
            readonly 'aria-label': "Previous";
            readonly disabled: boolean;
        }, string>;
        nextButton: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<number>>], (node: HTMLElement) => MeltActionReturn<PaginationEvents['nextButton']>, ([$page, $totalPages]: [number, number]) => {
            readonly 'aria-label': "Next";
            readonly disabled: boolean;
        }, string>;
    };
    states: {
        range: import("svelte/store").Readable<{
            start: number;
            end: number;
        }>;
        page: {
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        };
        pages: import("svelte/store").Readable<import("./types.js").PageItem[]>;
        totalPages: import("svelte/store").Readable<number>;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        count: number;
        perPage: number;
        siblingCount: number;
        defaultPage: number;
        page?: import("svelte/store").Writable<number> | undefined;
        onPageChange?: import("../../internal/helpers/index.js").ChangeFn<number> | undefined;
    }, "page" | "defaultPage" | "onPageChange">>;
};
