import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                role: "button";
                'aria-haspopup': "dialog";
                'aria-expanded': boolean;
                'data-state': string;
                'aria-controls': string;
                id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/link-preview/events.js").LinkPreviewEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type LinkPreviewTriggerProps = typeof __propDef.props;
export type LinkPreviewTriggerEvents = typeof __propDef.events;
export type LinkPreviewTriggerSlots = typeof __propDef.slots;
export default class LinkPreviewTrigger extends SvelteComponent<LinkPreviewTriggerProps, LinkPreviewTriggerEvents, LinkPreviewTriggerSlots> {
}
export {};
