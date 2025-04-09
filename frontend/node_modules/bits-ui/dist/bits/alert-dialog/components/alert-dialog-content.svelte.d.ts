import { SvelteComponent } from "svelte";
import type { ContentProps } from "../index.js";
import type { Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): {
        pointerdown: PointerEvent;
        pointermove: PointerEvent;
        pointerup: PointerEvent;
        touchcancel: TouchEvent;
        touchend: TouchEvent;
        touchmove: TouchEvent;
        touchstart: TouchEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
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
export type AlertDialogContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type AlertDialogContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type AlertDialogContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class AlertDialogContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<AlertDialogContentProps<T, In, Out>, AlertDialogContentEvents<T, In, Out>, AlertDialogContentSlots<T, In, Out>> {
}
export {};
