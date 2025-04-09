import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'data-state': "open" | "closed";
                readonly 'data-disabled': true | undefined;
                readonly disabled: true | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/collapsible/events.js").CollapsibleEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type CollapsibleTriggerProps = typeof __propDef.props;
export type CollapsibleTriggerEvents = typeof __propDef.events;
export type CollapsibleTriggerSlots = typeof __propDef.slots;
export default class CollapsibleTrigger extends SvelteComponent<CollapsibleTriggerProps, CollapsibleTriggerEvents, CollapsibleTriggerSlots> {
}
export {};
