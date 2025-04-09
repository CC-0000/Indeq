import { SvelteComponent } from "svelte";
import type { ArrowProps } from "../index.js";
declare const __propDef: {
    props: ArrowProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'data-arrow': boolean;
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
export type LinkPreviewArrowProps = typeof __propDef.props;
export type LinkPreviewArrowEvents = typeof __propDef.events;
export type LinkPreviewArrowSlots = typeof __propDef.slots;
export default class LinkPreviewArrow extends SvelteComponent<LinkPreviewArrowProps, LinkPreviewArrowEvents, LinkPreviewArrowSlots> {
}
export {};
