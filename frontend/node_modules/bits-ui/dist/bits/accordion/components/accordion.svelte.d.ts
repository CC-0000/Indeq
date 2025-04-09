import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare class __sveltets_Render<Multiple extends boolean> {
    props(): Props<Multiple>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            builder: {
                'data-melt-id': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
}
export type AccordionProps<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['props']>;
export type AccordionEvents<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['events']>;
export type AccordionSlots<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['slots']>;
export default class Accordion<Multiple extends boolean> extends SvelteComponent<AccordionProps<Multiple>, AccordionEvents<Multiple>, AccordionSlots<Multiple>> {
}
export {};
