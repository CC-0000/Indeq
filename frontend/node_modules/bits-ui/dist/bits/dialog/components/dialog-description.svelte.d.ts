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
export type DialogDescriptionProps = typeof __propDef.props;
export type DialogDescriptionEvents = typeof __propDef.events;
export type DialogDescriptionSlots = typeof __propDef.slots;
export default class DialogDescription extends SvelteComponent<DialogDescriptionProps, DialogDescriptionEvents, DialogDescriptionSlots> {
}
export {};
