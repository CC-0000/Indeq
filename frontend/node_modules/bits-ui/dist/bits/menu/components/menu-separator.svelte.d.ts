import { SvelteComponent } from "svelte";
import type { SeparatorProps } from "../index.js";
declare const __propDef: {
    props: SeparatorProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                'aria-orientation': "vertical" | undefined;
                'aria-hidden': boolean;
                'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
            } & {
                "data-melt-separator": "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenuSeparatorProps = typeof __propDef.props;
export type MenuSeparatorEvents = typeof __propDef.events;
export type MenuSeparatorSlots = typeof __propDef.slots;
export default class MenuSeparator extends SvelteComponent<MenuSeparatorProps, MenuSeparatorEvents, MenuSeparatorSlots> {
}
export {};
