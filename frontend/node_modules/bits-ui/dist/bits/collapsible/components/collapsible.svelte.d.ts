import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare const __propDef: {
    props: Props;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'data-state': string;
                'data-disabled': boolean | undefined;
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
export type CollapsibleProps = typeof __propDef.props;
export type CollapsibleEvents = typeof __propDef.events;
export type CollapsibleSlots = typeof __propDef.slots;
export default class Collapsible extends SvelteComponent<CollapsibleProps, CollapsibleEvents, CollapsibleSlots> {
}
export {};
