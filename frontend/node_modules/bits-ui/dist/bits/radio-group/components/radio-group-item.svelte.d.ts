import { SvelteComponent } from "svelte";
import type { ItemEvents, ItemProps } from "../index.js";
declare const __propDef: {
    props: ItemProps;
    slots: {
        default: {
            builder: {
                readonly disabled: boolean;
                readonly 'data-value': string;
                readonly 'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
                readonly 'data-disabled': true | undefined;
                readonly 'data-state': "checked" | "unchecked";
                readonly 'aria-checked': boolean;
                readonly type: "button";
                readonly role: "radio";
                readonly tabindex: 0 | -1;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/radio-group/events.js").RadioGroupEvents["item"]>;
            };
        };
    };
    events: ItemEvents;
};
export type RadioGroupItemProps = typeof __propDef.props;
export type RadioGroupItemEvents = typeof __propDef.events;
export type RadioGroupItemSlots = typeof __propDef.slots;
export default class RadioGroupItem extends SvelteComponent<RadioGroupItemProps, RadioGroupItemEvents, RadioGroupItemSlots> {
}
export {};
