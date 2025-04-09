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
                hidden: boolean | undefined;
                tabindex: number;
                style: string;
                id: string;
                'data-state': string;
                'data-portal': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_1 extends unknown>(node: HTMLElement) => {
                    destroy(): void;
                };
            };
        };
    };
}
export type PopoverContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type PopoverContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type PopoverContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class PopoverContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<PopoverContentProps<T, In, Out>, PopoverContentEvents<T, In, Out>, PopoverContentSlots<T, In, Out>> {
}
export {};
