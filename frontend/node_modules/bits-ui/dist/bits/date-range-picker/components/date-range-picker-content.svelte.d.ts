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
export type DateRangePickerContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type DateRangePickerContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type DateRangePickerContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class DateRangePickerContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<DateRangePickerContentProps<T, In, Out>, DateRangePickerContentEvents<T, In, Out>, DateRangePickerContentSlots<T, In, Out>> {
}
export {};
