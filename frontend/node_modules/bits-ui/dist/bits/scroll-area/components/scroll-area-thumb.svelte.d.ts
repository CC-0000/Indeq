import { SvelteComponent } from "svelte";
import type { ThumbProps } from "../index.js";
declare const __propDef: {
    props: ThumbProps;
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerdown" | "pointerup">;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ScrollAreaThumbProps = typeof __propDef.props;
export type ScrollAreaThumbEvents = typeof __propDef.events;
export type ScrollAreaThumbSlots = typeof __propDef.slots;
export default class ScrollAreaThumb extends SvelteComponent<ScrollAreaThumbProps, ScrollAreaThumbEvents, ScrollAreaThumbSlots> {
}
export {};
