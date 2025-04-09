import { type CreatePaginationProps } from "@melt-ui/svelte";
export declare function getPaginationData(): {
    NAME: "pagination";
    PARTS: readonly ["root", "prev-button", "next-button", "page"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreatePaginationProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root" | "page" | "prev-button" | "next-button") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-scope": string;
        }, string>;
        pageTrigger: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events").PaginationEvents["pageTrigger"]>, ($page: number) => (pageItem: import("@melt-ui/svelte").Page) => {
            "aria-label": string;
            "data-value": number;
            "data-selected": string | undefined;
        }, string>;
        prevButton: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events").PaginationEvents["prevButton"]>, ($page: number) => {
            readonly "aria-label": "Previous";
            readonly disabled: boolean;
        }, string>;
        nextButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<number>, sideEffect?: ((newValue: number) => void) | undefined) => void;
            set: (this: void, value: number) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<number>, invalidate?: import("svelte/store").Invalidator<number> | undefined): import("svelte/store").Unsubscriber;
            get: () => number;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<number>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events").PaginationEvents["nextButton"]>, ([$page, $totalPages]: [number, number]) => {
            readonly "aria-label": "Next";
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
        pages: import("svelte/store").Readable<import("@melt-ui/svelte").PageItem[]>;
        totalPages: import("svelte/store").Readable<number>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        count: number;
        perPage: number;
        siblingCount: number;
        defaultPage: number;
        page?: import("svelte/store").Writable<number> | undefined;
        onPageChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<number> | undefined;
    }, "page" | "defaultPage" | "onPageChange">>;
};
export declare function getCtx(): GetReturn;
export {};
