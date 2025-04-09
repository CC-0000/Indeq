import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'data-state': "open" | "closed";
                readonly id: string;
                readonly style: string;
                readonly 'data-id': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/context-menu/events.js").ContextMenuEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type ContextMenuTriggerProps = typeof __propDef.props;
export type ContextMenuTriggerEvents = typeof __propDef.events;
export type ContextMenuTriggerSlots = typeof __propDef.slots;
export default class ContextMenuTrigger extends SvelteComponent<ContextMenuTriggerProps, ContextMenuTriggerEvents, ContextMenuTriggerSlots> {
}
export {};
