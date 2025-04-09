/// <reference types="svelte" />
import { type IdObj, type ToWritableStores, type WithGet } from '../../internal/helpers/index.js';
import { type Readable, type Writable } from 'svelte/store';
import type { CreateScrollAreaProps } from './types.js';
import type { MeltActionReturn, Orientation, TextDirection } from '../../internal/types.js';
import { type Sizes } from './helpers.js';
type ScrollAreaParts = 'root' | 'viewport' | 'content' | 'scrollbar' | 'thumb' | 'corner';
export declare const name: (part?: ScrollAreaParts | undefined) => string;
export declare const scrollAreaIdParts: readonly ["root", "viewport", "content", "scrollbarX", "scrollbarY", "thumbX", "thumbY"];
export type ScrollAreaIdParts = typeof scrollAreaIdParts;
export type ScrollAreaRootState = {
    cornerWidth: WithGet<Writable<number>>;
    cornerHeight: WithGet<Writable<number>>;
    scrollbarXEnabled: WithGet<Writable<boolean>>;
    scrollbarYEnabled: WithGet<Writable<boolean>>;
    scrollbarXEl: WithGet<Writable<HTMLElement | null>>;
    scrollbarYEl: WithGet<Writable<HTMLElement | null>>;
    scrollAreaEl: WithGet<Writable<HTMLElement | null>>;
    viewportEl: WithGet<Writable<HTMLElement | null>>;
    contentEl: WithGet<Writable<HTMLElement | null>>;
    options: ToWritableStores<Required<Omit<CreateScrollAreaProps, 'ids'>>>;
    ids: ToWritableStores<IdObj<ScrollAreaIdParts>>;
};
export type ScrollAreaScrollbarState = {
    isHorizontal: WithGet<Writable<boolean>>;
    domRect: WithGet<Writable<DOMRect | null>>;
    prevWebkitUserSelect: WithGet<Writable<string>>;
    pointerOffset: WithGet<Writable<number>>;
    thumbEl: WithGet<Writable<HTMLElement | null>>;
    thumbOffset: WithGet<Writable<number>>;
    scrollbarEl: WithGet<Writable<HTMLElement | null>>;
    sizes: WithGet<Writable<Sizes>>;
    orientation: WithGet<Writable<Orientation>>;
    hasThumb: WithGet<Readable<boolean>>;
    isVisible: WithGet<Writable<boolean>>;
    handleWheelScroll: (e: WheelEvent, payload: number) => void;
    handleThumbDown: (payload: {
        x: number;
        y: number;
    }) => void;
    handleThumbUp: (e: MouseEvent) => void;
    onThumbPositionChange: () => void;
    onDragScroll: (payload: number) => void;
    handleSizeChange: () => void;
};
export type ScrollAreaState = {
    rootState: ScrollAreaRootState;
    scrollbarState: ScrollAreaScrollbarState;
};
export declare function createScrollArea(props?: CreateScrollAreaProps): {
    options: ToWritableStores<Omit<{
        type: import("./types.js").ScrollAreaType;
        hideDelay: number;
        dir: TextDirection;
        ids?: Partial<{
            content: string;
            viewport: string;
            root: string;
            scrollbarX: string;
            scrollbarY: string;
            thumbX: string;
            thumbY: string;
        }> | undefined;
    }, "ids">>;
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<[WithGet<Writable<number>>, WithGet<Writable<number>>, WithGet<Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$cornerWidth, $cornderHeight, $rootId]: [number, number, string]) => {
            style: string;
            id: string;
        }, string>;
        viewport: import("../../internal/helpers/index.js").MeltElement<[WithGet<Writable<boolean>>, WithGet<Writable<boolean>>, WithGet<Writable<string>>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$scrollbarXEnabled, $scrollbarYEnabled, $viewportId]: [boolean, boolean, string]) => {
            style: string;
            id: string;
        }, string>;
        content: import("../../internal/helpers/index.js").MeltElement<[WithGet<Writable<string>>], <Node_3 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$contentId]: [string]) => {
            style: string;
            id: string;
        }, string>;
        corner: import("../../internal/helpers/index.js").MeltElement<[Writable<number>, Writable<number>, WithGet<Writable<TextDirection>>, Readable<boolean>], import("svelte/action").Action<any, any, Record<never, any>>, ([$width, $height, $dir, $shouldDisplay]: [number, number, TextDirection, boolean]) => {
            style: string;
        }, string>;
        scrollbarX: import("../../internal/helpers/index.js").MeltElement<[WithGet<Writable<Sizes>>, WithGet<Writable<TextDirection>>, WithGet<Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<"pointerdown" | "pointermove" | "pointerup">, ([$sizes, $dir, $isVisible]: [Sizes, TextDirection, boolean]) => {
            style: string;
            'data-state': string;
        }, string>;
        scrollbarY: import("../../internal/helpers/index.js").MeltElement<[WithGet<Writable<Sizes>>, WithGet<Writable<TextDirection>>, WithGet<Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<"pointerdown" | "pointermove" | "pointerup">, ([$sizes, $dir, $isVisible]: [Sizes, TextDirection, boolean]) => {
            style: string;
            'data-state': string;
        }, string>;
        thumbX: import("../../internal/helpers/index.js").MeltElement<[WithGet<Readable<boolean>>, WithGet<Writable<boolean>>, WithGet<Writable<number>>], (node: HTMLElement) => MeltActionReturn<"pointerdown" | "pointerup">, ([$hasThumb, $isHorizontal, $offset]: [boolean, boolean, number]) => {
            style: string;
            'data-state': string;
        }, string>;
        thumbY: import("../../internal/helpers/index.js").MeltElement<[WithGet<Readable<boolean>>, WithGet<Writable<boolean>>, WithGet<Writable<number>>], (node: HTMLElement) => MeltActionReturn<"pointerdown" | "pointerup">, ([$hasThumb, $isHorizontal, $offset]: [boolean, boolean, number]) => {
            style: string;
            'data-state': string;
        }, string>;
    };
};
export {};
