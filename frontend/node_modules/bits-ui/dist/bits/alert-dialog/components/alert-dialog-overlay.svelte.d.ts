import { SvelteComponent } from "svelte";
import type { OverlayProps } from "../index.js";
import type { Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): OverlayProps<T, In, Out>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            builder: {
                readonly hidden: true | undefined;
                readonly tabindex: -1;
                readonly style: string;
                readonly 'aria-hidden': true;
                readonly 'data-state': "open" | "closed";
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
export type AlertDialogOverlayProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type AlertDialogOverlayEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type AlertDialogOverlaySlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class AlertDialogOverlay<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<AlertDialogOverlayProps<T, In, Out>, AlertDialogOverlayEvents<T, In, Out>, AlertDialogOverlaySlots<T, In, Out>> {
}
export {};
