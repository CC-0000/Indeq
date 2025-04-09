import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                type: "button";
                role: string;
                'data-state': string;
                tabindex: number;
                'data-value': string;
                'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
                'data-disabled': boolean | undefined;
                disabled: boolean | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/tabs/events.js").TabsEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type TabsTriggerProps = typeof __propDef.props;
export type TabsTriggerEvents = typeof __propDef.events;
export type TabsTriggerSlots = typeof __propDef.slots;
export default class TabsTrigger extends SvelteComponent<TabsTriggerProps, TabsTriggerEvents, TabsTriggerSlots> {
}
export {};
