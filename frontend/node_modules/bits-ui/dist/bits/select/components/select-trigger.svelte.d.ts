import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-activedescendant': string | undefined;
                readonly 'aria-autocomplete': "list";
                readonly 'aria-controls': string;
                readonly 'aria-expanded': boolean;
                readonly 'aria-labelledby': string;
                readonly id: string;
                readonly role: "combobox";
                readonly disabled: true | undefined;
                readonly type: "button" | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"input" | "click" | "keydown">;
            };
        };
    };
    events: TriggerEvents;
};
export type SelectTriggerProps = typeof __propDef.props;
export type SelectTriggerEvents = typeof __propDef.events;
export type SelectTriggerSlots = typeof __propDef.slots;
export default class SelectTrigger extends SvelteComponent<SelectTriggerProps, SelectTriggerEvents, SelectTriggerSlots> {
}
export {};
