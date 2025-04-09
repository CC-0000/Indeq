/// <reference types="svelte" />
import type { CreateTableOfContentsArgs, TableOfContentsItem } from './types.js';
export declare function createTableOfContents(args: CreateTableOfContentsArgs): {
    elements: {
        item: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number[]>>, (node: HTMLAnchorElement) => {
            destroy: () => void;
        }, ($activeHeadingIdxs: number[]) => (id: string) => {
            'data-id': string;
            'data-active': string | undefined;
        }, string>;
    };
    states: {
        activeHeadingIdxs: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number[]>>;
        headingsTree: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<TableOfContentsItem[]>>;
    };
    helpers: {
        isActive: import("svelte/store").Readable<(headingId: string) => boolean>;
    };
};
