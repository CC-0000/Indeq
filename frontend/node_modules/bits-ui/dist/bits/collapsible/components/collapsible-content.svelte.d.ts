import { SvelteComponent } from "svelte";
import type { ContentProps } from "../index.js";
import type { Transition } from "../../../internal/types.js";
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
                hidden: boolean | undefined;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
}
export type CollapsibleContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type CollapsibleContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type CollapsibleContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class CollapsibleContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<CollapsibleContentProps<T, In, Out>, CollapsibleContentEvents<T, In, Out>, CollapsibleContentSlots<T, In, Out>> {
}
export {};
