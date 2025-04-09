import { noop } from '../../internal/helpers/index.js';
import type { TextDirection } from '../../internal/types.js';
export type Sizes = {
    content: number;
    viewport: number;
    scrollbar: {
        size: number;
        paddingStart: number;
        paddingEnd: number;
    };
};
export declare function debounceCallback(cb: () => void, delay: number): () => void;
export declare function resizeObserver(node: HTMLElement, handleResize: () => void): () => void;
export declare function addUnlinkedScrollListener(node: HTMLElement, handler?: typeof noop): () => void;
export declare function isScrollingWithinScrollbarBounds(scrollPos: number, maxScrollPos: number): boolean;
export declare function toInt(value?: string): number;
export declare function getThumbRatio(viewportSize: number, contentSize: number): number;
export declare function getThumbSize(sizes: Sizes): number;
export declare function getScrollPositionFromPointer(pointerPos: number, pointerOffset: number, sizes: Sizes, dir?: TextDirection): number;
export declare function getThumbOffsetFromScroll(scrollPos: number, sizes: Sizes, dir?: TextDirection): number;
