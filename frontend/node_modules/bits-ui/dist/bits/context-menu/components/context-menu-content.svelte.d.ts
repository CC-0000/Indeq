import { SvelteComponent } from "svelte";
import type { ContentEvents, ContentProps } from "../index.js";
import type { Transition } from "../../../internal/types.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): ContentEvents;
    slots(): {
        default: {
            builder: {
                readonly role: "menu";
                readonly hidden: true | undefined;
                readonly style: string;
                readonly id: string;
                readonly 'aria-labelledby': string;
                readonly 'data-state': "open" | "closed";
                readonly 'data-portal': "" | undefined;
                readonly tabindex: -1;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/context-menu/events.js").ContextMenuEvents["menu"]>;
            };
        };
    };
}
export type ContextMenuContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type ContextMenuContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type ContextMenuContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class ContextMenuContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<ContextMenuContentProps<T, In, Out>, ContextMenuContentEvents<T, In, Out>, ContextMenuContentSlots<T, In, Out>> {
}
export {};
