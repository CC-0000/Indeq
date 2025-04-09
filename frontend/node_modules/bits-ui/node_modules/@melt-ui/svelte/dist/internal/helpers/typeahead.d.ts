/// <reference types="svelte" />
export type TypeaheadArgs = {
    /**
     * What to do when a match is found, usually highlight/focus the element.
     * @param element The element that matches the typed keys
     */
    onMatch?: (element: HTMLElement) => void;
    /**
     * Get the current item, usually the active element.
     * @returns The current item
     * @default () => document.activeElement
     */
    getCurrentItem?: () => Element | null | undefined;
};
export type HandleTypeaheadSearch = {};
export declare function createTypeaheadSearch(args?: TypeaheadArgs): {
    typed: import("./withGet.js").WithGet<import("svelte/store").Writable<string[]>>;
    resetTyped: () => void;
    handleTypeaheadSearch: (key: string, items: HTMLElement[]) => void;
};
