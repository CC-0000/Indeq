import { SvelteComponent } from "svelte";
import type { ContentEvents, ContentProps } from "../index.js";
import type { Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): ContentEvents;
    slots(): {
        default: {
            builder: {
                id: string;
                role: "dialog" | "alertdialog";
                'aria-describedby': string;
                'aria-labelledby': string;
                'aria-modal': "true" | undefined;
                'data-state': string;
                tabindex: number;
                hidden: boolean | undefined;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => {
                    destroy: () => void;
                };
            };
        };
    };
}
export type DialogContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type DialogContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type DialogContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class DialogContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<DialogContentProps<T, In, Out>, DialogContentEvents<T, In, Out>, DialogContentSlots<T, In, Out>> {
}
export {};
