import { SvelteComponent } from "svelte";
import type { ItemEvents, ItemProps } from "../index.js";
declare const __propDef: {
    props: ItemProps;
    slots: {
        default: {
            builder: {
                role: string;
                tabindex: number;
                'data-orientation': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">;
            };
        };
    };
    events: ItemEvents;
};
export type MenuItemProps = typeof __propDef.props;
export type MenuItemEvents = typeof __propDef.events;
export type MenuItemSlots = typeof __propDef.slots;
export default class MenuItem extends SvelteComponent<MenuItemProps, MenuItemEvents, MenuItemSlots> {
}
export {};
