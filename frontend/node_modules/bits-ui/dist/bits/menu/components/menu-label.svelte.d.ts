import { SvelteComponent } from "svelte";
import type { LabelProps } from "../index.js";
declare const __propDef: {
    props: LabelProps;
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
export type MenuLabelProps = typeof __propDef.props;
export type MenuLabelEvents = typeof __propDef.events;
export type MenuLabelSlots = typeof __propDef.slots;
export default class MenuLabel extends SvelteComponent<MenuLabelProps, MenuLabelEvents, MenuLabelSlots> {
}
export {};
