import { SvelteComponent } from "svelte";
import type { GroupProps } from "../index.js";
declare const __propDef: {
    props: GroupProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                'aria-labelledby': string;
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
export type MenuGroupProps = typeof __propDef.props;
export type MenuGroupEvents = typeof __propDef.events;
export type MenuGroupSlots = typeof __propDef.slots;
export default class MenuGroup extends SvelteComponent<MenuGroupProps, MenuGroupEvents, MenuGroupSlots> {
}
export {};
