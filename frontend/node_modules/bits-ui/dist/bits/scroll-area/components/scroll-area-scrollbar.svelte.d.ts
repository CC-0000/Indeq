import { SvelteComponent } from "svelte";
import type { ScrollbarProps } from "../index.js";
declare const __propDef: {
    props: ScrollbarProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                style: string;
                'data-state': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointermove" | "pointerup">;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ScrollAreaScrollbarProps = typeof __propDef.props;
export type ScrollAreaScrollbarEvents = typeof __propDef.events;
export type ScrollAreaScrollbarSlots = typeof __propDef.slots;
export default class ScrollAreaScrollbar extends SvelteComponent<ScrollAreaScrollbarProps, ScrollAreaScrollbarEvents, ScrollAreaScrollbarSlots> {
}
export {};
