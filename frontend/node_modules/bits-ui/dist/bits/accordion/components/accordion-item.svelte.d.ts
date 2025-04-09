import { SvelteComponent } from "svelte";
import type { ItemProps } from "../index.js";
declare const __propDef: {
    props: ItemProps;
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
export type AccordionItemProps = typeof __propDef.props;
export type AccordionItemEvents = typeof __propDef.events;
export type AccordionItemSlots = typeof __propDef.slots;
export default class AccordionItem extends SvelteComponent<AccordionItemProps, AccordionItemEvents, AccordionItemSlots> {
}
export {};
