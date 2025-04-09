import { SvelteComponent } from "svelte";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
    slots: {
        default: {
            builder: {
                readonly 'data-disabled': true | undefined;
                readonly disabled: true | undefined;
                readonly 'data-state': "checked" | "unchecked";
                readonly type: "button";
                readonly role: "switch";
                readonly 'aria-checked': "true" | "false";
                readonly 'aria-required': "true" | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_1 extends unknown>(node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/switch/events.js").SwitchEvents["root"]>;
            };
        };
    };
    events: Events;
};
export type SwitchProps = typeof __propDef.props;
export type SwitchEvents = typeof __propDef.events;
export type SwitchSlots = typeof __propDef.slots;
export default class Switch extends SvelteComponent<SwitchProps, SwitchEvents, SwitchSlots> {
}
export {};
