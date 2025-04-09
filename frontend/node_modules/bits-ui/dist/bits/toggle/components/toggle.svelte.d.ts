import { SvelteComponent } from "svelte";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
    slots: {
        default: {
            builder: {
                readonly 'data-disabled': true | undefined;
                readonly disabled: true | undefined;
                readonly 'data-state': "on" | "off";
                readonly 'aria-pressed': boolean;
                readonly type: "button";
            } & {
                "data-melt-toggle": "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toggle/events.js").ToggleEvents["root"]>;
            };
        };
    };
    events: Events;
};
export type ToggleProps = typeof __propDef.props;
export type ToggleEvents = typeof __propDef.events;
export type ToggleSlots = typeof __propDef.slots;
export default class Toggle extends SvelteComponent<ToggleProps, ToggleEvents, ToggleSlots> {
}
export {};
