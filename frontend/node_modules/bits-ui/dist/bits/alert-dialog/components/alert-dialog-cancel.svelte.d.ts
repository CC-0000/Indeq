import { SvelteComponent } from "svelte";
import type { CancelEvents, CancelProps } from "../index.js";
declare const __propDef: {
    props: CancelProps;
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
    events: CancelEvents;
};
export type AlertDialogCancelProps = typeof __propDef.props;
export type AlertDialogCancelEvents = typeof __propDef.events;
export type AlertDialogCancelSlots = typeof __propDef.slots;
export default class AlertDialogCancel extends SvelteComponent<AlertDialogCancelProps, AlertDialogCancelEvents, AlertDialogCancelSlots> {
}
export {};
