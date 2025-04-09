import { SvelteComponent } from "svelte";
import type { ItemEvents, ItemProps } from "../index.js";
declare const __propDef: {
    props: ItemProps;
    slots: {
        default: {
            builder: {
                readonly 'data-value': string;
                readonly 'data-label': string | undefined;
                readonly 'data-disabled': true | undefined;
                readonly 'aria-disabled': true | undefined;
                readonly 'aria-selected': boolean;
                readonly 'data-selected': "" | undefined;
                readonly id: string;
                readonly role: "option";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "pointermove">;
            };
            isSelected: boolean;
        };
    };
    events: ItemEvents;
};
export type ComboboxItemProps = typeof __propDef.props;
export type ComboboxItemEvents = typeof __propDef.events;
export type ComboboxItemSlots = typeof __propDef.slots;
export default class ComboboxItem extends SvelteComponent<ComboboxItemProps, ComboboxItemEvents, ComboboxItemSlots> {
}
export {};
