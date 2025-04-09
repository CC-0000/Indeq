import { SvelteComponent } from "svelte";
import type { ActionEvents, ActionProps } from "../index.js";
declare const __propDef: {
    props: ActionProps;
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
    events: ActionEvents;
};
export type AlertDialogActionProps = typeof __propDef.props;
export type AlertDialogActionEvents = typeof __propDef.events;
export type AlertDialogActionSlots = typeof __propDef.slots;
export default class AlertDialogAction extends SvelteComponent<AlertDialogActionProps, AlertDialogActionEvents, AlertDialogActionSlots> {
}
export {};
