import { SvelteComponent } from "svelte";
import type { ContentEvents, ContentProps } from "../index.js";
import { type Transition } from "../../../internal/index.js";
declare class __sveltets_Render<T extends Transition, In extends Transition, Out extends Transition> {
    props(): ContentProps<T, In, Out>;
    events(): ContentEvents;
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/link-preview/events.js").LinkPreviewEvents["content"]>;
            };
        };
    };
}
export type LinkPreviewContentProps<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['props']>;
export type LinkPreviewContentEvents<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['events']>;
export type LinkPreviewContentSlots<T extends Transition, In extends Transition, Out extends Transition> = ReturnType<__sveltets_Render<T, In, Out>['slots']>;
export default class LinkPreviewContent<T extends Transition, In extends Transition, Out extends Transition> extends SvelteComponent<LinkPreviewContentProps<T, In, Out>, LinkPreviewContentEvents<T, In, Out>, LinkPreviewContentSlots<T, In, Out>> {
}
export {};
