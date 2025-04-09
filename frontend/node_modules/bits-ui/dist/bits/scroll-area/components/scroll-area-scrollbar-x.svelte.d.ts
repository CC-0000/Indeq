import { SvelteComponent } from "svelte";
import type { ScrollbarProps } from "../index.js";
declare const __propDef: {
    props: Omit<ScrollbarProps, "orientation">;
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
export type ScrollAreaScrollbarXProps = typeof __propDef.props;
export type ScrollAreaScrollbarXEvents = typeof __propDef.events;
export type ScrollAreaScrollbarXSlots = typeof __propDef.slots;
export default class ScrollAreaScrollbarX extends SvelteComponent<ScrollAreaScrollbarXProps, ScrollAreaScrollbarXEvents, ScrollAreaScrollbarXSlots> {
}
export {};
