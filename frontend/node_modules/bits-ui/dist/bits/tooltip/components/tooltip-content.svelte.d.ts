import { SvelteComponent } from "svelte";
import type { ContentEvents, ContentProps } from "../index.js";
import { type Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): ContentEvents;
    slots(): {
        default: {
            builder: {
                role: string;
                hidden: boolean;
                tabindex: number;
                style: string;
                id: string;
                'data-portal': string;
                'data-state': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tooltip/events.js").TooltipEvents["content"]>;
            };
        };
    };
}
export type TooltipContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type TooltipContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type TooltipContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class TooltipContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<TooltipContentProps<T, In, Out>, TooltipContentEvents<T, In, Out>, TooltipContentSlots<T, In, Out>> {
}
export {};
