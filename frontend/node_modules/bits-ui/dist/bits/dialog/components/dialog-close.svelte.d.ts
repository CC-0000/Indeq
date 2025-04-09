import { SvelteComponent } from "svelte";
import type { CloseEvents } from "../index.js";
declare const __propDef: {
    props: import("../types.js").DialogTriggerProps;
    slots: {
        default: {
            builder: {
                readonly type: "button";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/dialog/events.js").DialogEvents["close"]>;
            };
        };
    };
    events: CloseEvents;
};
export type DialogCloseProps = typeof __propDef.props;
export type DialogCloseEvents = typeof __propDef.events;
export type DialogCloseSlots = typeof __propDef.slots;
export default class DialogClose extends SvelteComponent<DialogCloseProps, DialogCloseEvents, DialogCloseSlots> {
}
export {};
