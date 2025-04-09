import { SvelteComponent } from "svelte";
import type { ContentProps } from "../index.js";
import type { Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            builder: {
                'data-state': string;
                'data-disabled': boolean | undefined;
                'data-value': string;
                hidden: boolean | undefined;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => void;
            };
        };
    };
}
export type AccordionContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type AccordionContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type AccordionContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class AccordionContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<AccordionContentProps<T, In, Out>, AccordionContentEvents<T, In, Out>, AccordionContentSlots<T, In, Out>> {
}
export {};
