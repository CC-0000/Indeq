import { SvelteComponent } from "svelte";
import type { CornerProps } from "../index.js";
declare const __propDef: {
    props: CornerProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ScrollAreaCornerProps = typeof __propDef.props;
export type ScrollAreaCornerEvents = typeof __propDef.events;
export type ScrollAreaCornerSlots = typeof __propDef.slots;
export default class ScrollAreaCorner extends SvelteComponent<ScrollAreaCornerProps, ScrollAreaCornerEvents, ScrollAreaCornerSlots> {
}
export {};
