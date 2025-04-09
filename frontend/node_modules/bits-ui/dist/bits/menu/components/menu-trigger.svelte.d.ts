import { SvelteComponent } from "svelte";
import type { DropdownTriggerEvents, DropdownTriggerProps } from "../index.js";
declare const __propDef: {
    props: DropdownTriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-controls': string;
                readonly 'aria-expanded': boolean;
                readonly 'data-state': "open" | "closed";
                readonly id: string;
                readonly tabindex: 0;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"keydown" | "pointerdown">;
            };
        };
    };
    events: DropdownTriggerEvents;
};
export type MenuTriggerProps = typeof __propDef.props;
export type MenuTriggerEvents = typeof __propDef.events;
export type MenuTriggerSlots = typeof __propDef.slots;
export default class MenuTrigger extends SvelteComponent<MenuTriggerProps, MenuTriggerEvents, MenuTriggerSlots> {
}
export {};
