import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                'aria-describedby': string;
                id: string;
                'data-state': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tooltip/events.js").TooltipEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type TooltipTriggerProps = typeof __propDef.props;
export type TooltipTriggerEvents = typeof __propDef.events;
export type TooltipTriggerSlots = typeof __propDef.slots;
export default class TooltipTrigger extends SvelteComponent<TooltipTriggerProps, TooltipTriggerEvents, TooltipTriggerSlots> {
}
export {};
