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
export type ScrollAreaThumbYProps = typeof __propDef.props;
export type ScrollAreaThumbYEvents = typeof __propDef.events;
export type ScrollAreaThumbYSlots = typeof __propDef.slots;
export default class ScrollAreaThumbY extends SvelteComponent<ScrollAreaThumbYProps, ScrollAreaThumbYEvents, ScrollAreaThumbYSlots> {
}
export {};
