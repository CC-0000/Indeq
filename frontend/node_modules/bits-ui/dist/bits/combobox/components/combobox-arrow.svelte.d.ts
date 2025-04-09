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
export type ComboboxArrowProps = typeof __propDef.props;
export type ComboboxArrowEvents = typeof __propDef.events;
export type ComboboxArrowSlots = typeof __propDef.slots;
export default class ComboboxArrow extends SvelteComponent<ComboboxArrowProps, ComboboxArrowEvents, ComboboxArrowSlots> {
}
export {};
