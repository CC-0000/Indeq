import { type CreateScrollAreaProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateScrollAreaProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root" | "content" | "viewport" | "scrollbar-x" | "scrollbar-y" | "thumb-x" | "thumb-y" | "corner") => Record<string, string> | undefined;
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        type: import("@melt-ui/svelte").ScrollAreaType;
        hideDelay: number;
        dir: import("@melt-ui/svelte/internal/types").TextDirection;
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
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<number>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<number>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$cornerWidth, $cornderHeight, $rootId]: [number, number, string]) => {
            style: string;
            id: string;
        }, string>;
        viewport: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$scrollbarXEnabled, $scrollbarYEnabled, $viewportId]: [boolean, boolean, string]) => {
            style: string;
            id: string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<string>>], <Node_3 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$contentId]: [string]) => {
            style: string;
            id: string;
        }, string>;
        corner: import("@melt-ui/svelte/internal/helpers").MeltElement<[Writable<number>, Writable<number>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<import("@melt-ui/svelte/internal/types").TextDirection>>, import("svelte/store").Readable<boolean>], import("svelte/action").Action<any, any, Record<never, any>>, ([$width, $height, $dir, $shouldDisplay]: [number, number, import("@melt-ui/svelte/internal/types").TextDirection, boolean]) => {
            style: string;
        }, string>;
        scrollbarX: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<import("@melt-ui/svelte/dist/builders/scroll-area/helpers").Sizes>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<import("@melt-ui/svelte/internal/types").TextDirection>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointermove" | "pointerup">, ([$sizes, $dir, $isVisible]: [import("@melt-ui/svelte/dist/builders/scroll-area/helpers").Sizes, import("@melt-ui/svelte/internal/types").TextDirection, boolean]) => {
            style: string;
            "data-state": string;
        }, string>;
        scrollbarY: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<Writable<import("@melt-ui/svelte/dist/builders/scroll-area/helpers").Sizes>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<import("@melt-ui/svelte/internal/types").TextDirection>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointermove" | "pointerup">, ([$sizes, $dir, $isVisible]: [import("@melt-ui/svelte/dist/builders/scroll-area/helpers").Sizes, import("@melt-ui/svelte/internal/types").TextDirection, boolean]) => {
            style: string;
            "data-state": string;
        }, string>;
        thumbX: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<number>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointerup">, ([$hasThumb, $isHorizontal, $offset]: [boolean, boolean, number]) => {
            style: string;
            "data-state": string;
        }, string>;
        thumbY: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<Writable<number>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointerup">, ([$hasThumb, $isHorizontal, $offset]: [boolean, boolean, number]) => {
            style: string;
            "data-state": string;
        }, string>;
    };
};
export declare function getCtx(): GetReturn;
export declare function setScrollbarOrientation(orientation: Writable<"horizontal" | "vertical">): Writable<"horizontal" | "vertical">;
export declare function getScrollbarOrientation(): Writable<"horizontal" | "vertical">;
export {};
