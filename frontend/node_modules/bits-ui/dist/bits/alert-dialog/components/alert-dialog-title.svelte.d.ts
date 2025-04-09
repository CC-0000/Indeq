import { SvelteComponent } from "svelte";
import type { TitleProps } from "../index.js";
declare const __propDef: {
    props: TitleProps;
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
export type AlertDialogTitleProps = typeof __propDef.props;
export type AlertDialogTitleEvents = typeof __propDef.events;
export type AlertDialogTitleSlots = typeof __propDef.slots;
export default class AlertDialogTitle extends SvelteComponent<AlertDialogTitleProps, AlertDialogTitleEvents, AlertDialogTitleSlots> {
}
export {};
