/// <reference types="svelte" />
import type { Action } from 'svelte/action';
import { type ScrollAreaState } from './create.js';
import type { ScrollAreaType } from './types.js';
import type { MeltActionReturn } from '../../internal/types.js';
import type { ScrollAreaEvents } from './events.js';
export type CreateScrollbarAction = (state: ScrollAreaState) => Action<HTMLElement>;
/**
 * The base scrollbar action is used for all scrollbar types,
 * and provides the basic functionality for dragging the scrollbar
 * thumb and scrolling the content.
 *
 * The other scrollbar actions will extend this one, preventing a ton
 * of code duplication.
 */
export declare function createBaseScrollbarAction(state: ScrollAreaState): (node: HTMLElement) => {
    destroy(): void;
};
/**
 * The auto scrollbar action will show the scrollbar when the content
 * overflows the viewport, and hide it when it doesn't.
 */
export declare function createAutoScrollbarAction(state: ScrollAreaState): (node: HTMLElement) => {
    destroy(): void;
};
/**
 * The hover scrollbar action will show the scrollbar when the user
 * hovers over the scroll area, and hide it when they leave after
 * an optionally specified delay.
 */
export declare function createHoverScrollbarAction(state: ScrollAreaState): (node: HTMLElement) => {
    destroy(): void;
};
/**
 * The scroll scrollbar action will only show the scrollbar
 * when the user is actively scrolling the content.
 */
export declare function createScrollScrollbarAction(state: ScrollAreaState): (node: HTMLElement) => {
    destroy(): void;
};
/**
 * Creates the horizontal/x-axis scrollbar builder element.
 */
export declare function createScrollbarX(state: ScrollAreaState, createAction: CreateScrollbarAction): import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("./helpers.js").Sizes>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("../../internal/types.js").TextDirection>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<ScrollAreaEvents['scrollbar']>, ([$sizes, $dir, $isVisible]: [import("./helpers.js").Sizes, import("../../internal/types.js").TextDirection, boolean]) => {
    style: string;
    'data-state': string;
}, string>;
/**
 * Creates the vertical/y-axis scrollbar builder element.
 */
export declare function createScrollbarY(state: ScrollAreaState, createAction: CreateScrollbarAction): import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("./helpers.js").Sizes>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("../../internal/types.js").TextDirection>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<ScrollAreaEvents['scrollbar']>, ([$sizes, $dir, $isVisible]: [import("./helpers.js").Sizes, import("../../internal/types.js").TextDirection, boolean]) => {
    style: string;
    'data-state': string;
}, string>;
export declare function getScrollbarActionByType(type: ScrollAreaType): typeof createBaseScrollbarAction;
