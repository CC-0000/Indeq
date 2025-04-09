import { SvelteComponent } from "svelte";
import type { HeaderProps } from "../index.js";
declare const __propDef: {
    props: HeaderProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                'aria-level': number;
                'data-heading-level': number;
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
export type AccordionHeaderProps = typeof __propDef.props;
export type AccordionHeaderEvents = typeof __propDef.events;
export type AccordionHeaderSlots = typeof __propDef.slots;
export default class AccordionHeader extends SvelteComponent<AccordionHeaderProps, AccordionHeaderEvents, AccordionHeaderSlots> {
}
export {};
