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
export type SeparatorProps = typeof __propDef.props;
export type SeparatorEvents = typeof __propDef.events;
export type SeparatorSlots = typeof __propDef.slots;
export default class Separator extends SvelteComponent<SeparatorProps, SeparatorEvents, SeparatorSlots> {
}
export {};
