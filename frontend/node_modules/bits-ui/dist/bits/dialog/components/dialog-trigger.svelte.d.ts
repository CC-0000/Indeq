import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-haspopup': "dialog";
                readonly 'aria-expanded': boolean;
                readonly type: "button";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/dialog/events.js").DialogEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type DialogTriggerProps = typeof __propDef.props;
export type DialogTriggerEvents = typeof __propDef.events;
export type DialogTriggerSlots = typeof __propDef.slots;
export default class DialogTrigger extends SvelteComponent<DialogTriggerProps, DialogTriggerEvents, DialogTriggerSlots> {
}
export {};
