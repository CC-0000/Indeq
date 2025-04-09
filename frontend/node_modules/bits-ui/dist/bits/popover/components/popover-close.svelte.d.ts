import { SvelteComponent } from "svelte";
import type { CloseEvents, CloseProps } from "../index.js";
declare const __propDef: {
    props: CloseProps;
    slots: {
        default: {
            builder: {
                readonly type: "button";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/popover/events.js").PopoverEvents["close"]>;
            };
        };
    };
    events: CloseEvents;
};
export type PopoverCloseProps = typeof __propDef.props;
export type PopoverCloseEvents = typeof __propDef.events;
export type PopoverCloseSlots = typeof __propDef.slots;
export default class PopoverClose extends SvelteComponent<PopoverCloseProps, PopoverCloseEvents, PopoverCloseSlots> {
}
export {};
