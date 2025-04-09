import { SvelteComponent } from "svelte";
import type { ItemEvents, ItemProps } from "../index.js";
declare const __propDef: {
    props: ItemProps;
    slots: {
        default: {
            builder: {
                readonly disabled: true | undefined;
                readonly pressed: boolean;
                readonly 'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
                readonly 'data-disabled': true | undefined;
                readonly 'data-state': "on" | "off";
                readonly 'data-value': string;
                readonly 'aria-pressed': boolean | undefined;
                readonly 'aria-checked': boolean | undefined;
                readonly type: "button";
                readonly role: "radio" | undefined;
                readonly tabindex: 0 | -1;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toggle-group/events.js").ToggleGroupEvents["item"]>;
            };
        };
    };
    events: ItemEvents;
};
export type ToggleGroupItemProps = typeof __propDef.props;
export type ToggleGroupItemEvents = typeof __propDef.events;
export type ToggleGroupItemSlots = typeof __propDef.slots;
export default class ToggleGroupItem extends SvelteComponent<ToggleGroupItemProps, ToggleGroupItemEvents, ToggleGroupItemSlots> {
}
export {};
