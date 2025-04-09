import { SvelteComponent } from "svelte";
import type { OverlayEvents, OverlayProps } from "../index.js";
import type { Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): OverlayProps<T, In, Out>;
    events(): OverlayEvents;
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
export type DialogOverlayProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type DialogOverlayEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type DialogOverlaySlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class DialogOverlay<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<DialogOverlayProps<T, In, Out>, DialogOverlayEvents<T, In, Out>, DialogOverlaySlots<T, In, Out>> {
}
export {};
