import { SvelteComponent } from "svelte";
import type { ContentEvents, ContentProps } from "../index.js";
import type { Transition } from "../../../internal/types.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): ContentEvents;
    slots(): {
        default: {
            builder: {
                readonly hidden: true | undefined;
                readonly id: string;
                readonly role: "listbox";
                readonly style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerleave">;
            };
        };
    };
}
export type ComboboxContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type ComboboxContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type ComboboxContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class ComboboxContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<ComboboxContentProps<T, In, Out>, ComboboxContentEvents<T, In, Out>, ComboboxContentSlots<T, In, Out>> {
}
export {};
