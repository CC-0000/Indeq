import { SvelteComponent } from "svelte";
import type { DescriptionProps } from "../index.js";
declare const __propDef: {
    props: DescriptionProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                id: string;
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
export type AlertDialogDescriptionProps = typeof __propDef.props;
export type AlertDialogDescriptionEvents = typeof __propDef.events;
export type AlertDialogDescriptionSlots = typeof __propDef.slots;
export default class AlertDialogDescription extends SvelteComponent<AlertDialogDescriptionProps, AlertDialogDescriptionEvents, AlertDialogDescriptionSlots> {
}
export {};
