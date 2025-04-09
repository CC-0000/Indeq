import { SvelteComponent } from "svelte";
import type { SubTriggerEvents } from "../index.js";
declare const __propDef: {
    props: {
        disabled?: boolean | undefined;
        asChild?: boolean | undefined;
        el?: HTMLDivElement | undefined;
    } & import("../../../internal/index.js").HTMLDivAttributes & {
        disabled?: boolean;
    };
    slots: {
        default: {
            builder: {
                readonly role: "menuitem";
                readonly id: string;
                readonly tabindex: -1;
                readonly 'aria-controls': string;
                readonly 'aria-expanded': boolean;
                readonly 'data-state': "open" | "closed";
                readonly 'data-disabled': true | undefined;
                readonly 'aria-haspopop': "menu";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerleave" | "pointermove">;
            };
        };
    };
    events: SubTriggerEvents;
};
export type MenuSubTriggerProps = typeof __propDef.props;
export type MenuSubTriggerEvents = typeof __propDef.events;
export type MenuSubTriggerSlots = typeof __propDef.slots;
export default class MenuSubTrigger extends SvelteComponent<MenuSubTriggerProps, MenuSubTriggerEvents, MenuSubTriggerSlots> {
}
export {};
