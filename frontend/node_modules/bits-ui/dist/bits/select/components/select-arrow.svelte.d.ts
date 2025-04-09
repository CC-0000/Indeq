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
export type SelectArrowProps = typeof __propDef.props;
export type SelectArrowEvents = typeof __propDef.events;
export type SelectArrowSlots = typeof __propDef.slots;
export default class SelectArrow extends SvelteComponent<SelectArrowProps, SelectArrowEvents, SelectArrowSlots> {
}
export {};
